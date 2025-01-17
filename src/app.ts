import cors from "cors";
import 'dotenv/config';
import express, { NextFunction, Request, Response } from "express";
import 'express-async-errors';
import helmet from 'helmet';
import hpp from 'hpp';
import "reflect-metadata";
import apiRequestLogger from './middlewares/api-request-logger';
import exceptionFilter from './middlewares/exception-filter';
import modules from './modules';
import path from "path";
import jwt from 'jsonwebtoken';
import VultAccount from "./entities/vult-account.entity";
import dataSource from "./datasource/data-source";
import Account from "./entities/account.entity";
const session = require('express-session');
import { Transaction } from "./entities/transactions.entity";
import Revenue, { PaymentMode } from "./entities/revenue.entity";
import cookieParser from "cookie-parser";
import { Privilege, User } from "./entities/user.entity";
import { MoreThan } from "typeorm";
import Expenditure from "./entities/expenditure.entity";

const app = express();
app.use(
  session({
    secret: '.wnkdcuo20c', // Replace with your actual secret key
    resave: false, // Prevents resaving session on every request
    saveUninitialized: true, // Saves uninitialized sessions
    cookie: { 
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 24 * 60 * 60 * 1000, // Session expires after 1 day
    },
  })
);

// Use helmet and configure Content Security Policy (CSP)

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(hpp());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Logging and error handling
if (process.env.NODE_ENV !== 'production') {
  app.use(apiRequestLogger);
}

app.use(modules);

// Middleware to ensure user is logged in
export const requireLogin = (req, res, next) => {
  const token = req.cookies.auth;
  if (!token) {
    return res.redirect('/auth'); // Redirect to login if no token is found
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    res.locals.user = decoded;
    next(); // Proceed to the next middleware/route
  } catch (err) {
    return res.status(403).send('Invalid or expired token. Please log in again.');
  }
};

const decodedAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decoded = jwt.verify(req.cookies.auth, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(401).send('User not found');
    }

    res.locals.userDetails = user; // Assign user details to `res.locals.userDetails`
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error('Error in decodedAuth middleware:', error);
    return res.status(401).send('Invalid or expired token');
  }
};
// End of Middleware to ensure user is logged in

// View Functions
app.get('/', requireLogin, decodedAuth, async (_: Request, res: Response) => {
  const totalBalance = await dataSource.getRepository(VultAccount)
    .createQueryBuilder("account")
    .select("SUM(account.openBal)", "sum")
    .getRawOne();
    const totalBal = parseFloat(totalBalance.sum) || 0
    const today = new Date()
  res.render('dashboard.ejs', {user: res.locals.userDetails, totalBal, today});
});

app.get('/auth', (_: Request, res: Response) => {
  const error = _.session.error;
  _.session.error = null;   // Clear the error after displaying
  res.render('users/auth.ejs', {error});
});

app.get('/funds', requireLogin, async (_: Request, res: Response) => {
  const vultRepository = dataSource.getRepository(VultAccount)
        const vults = await vultRepository.find();
  res.render('funds.ejs', {vults});
});

app.get('/revenue', requireLogin, decodedAuth, async (_: Request, res: Response) => {
  const revenueRepo = dataSource.getRepository(Revenue);
  // Fetch transactions with related account and user data
  const revenues = await revenueRepo.createQueryBuilder('revenue')
  .where('revenue.credit = :credit', { credit: 0 }) // Correctly reference the parameter
  .leftJoinAndSelect('revenue.vultAccount', 'vultAccount') // Join the vultAccount relation
  .getMany();

 
  const vultRepo = dataSource.getRepository(VultAccount);
  // Fetch transactions with related account and user data
  const vults = await vultRepo.createQueryBuilder('vult')
  .getMany();

  const accountTypes = dataSource.getRepository(Account);
  const accounts = await accountTypes.find({ select: ['id', 'accountNumber', 'accountName'] });
  const paymentModes = [
    ...Object.values(PaymentMode.CashOffice),
    ...Object.values(PaymentMode.BankDeposit),
    PaymentMode.PAYSTACK,
    PaymentMode.FLUTTERWAVE,
  ];
  const message = _.session.message;
  const error = _.session.error;
  _.session.message = null; // Clear the message after displaying
  _.session.error = null;   // Clear the error after displaying
  res.render('revenue/revenue.ejs', { user: res.locals.userDetails, revenues, accounts, vults, paymentModes: Object.values(paymentModes), message, error });
});

app.get('/revenue/details/:id', requireLogin, decodedAuth, async (_: Request, res: Response) => {
  const id = _.params.id
  const data = await Revenue.findOne({where:{id, debit: MoreThan(0)},
  relations: ['account', 'vultAccount', 'user'],});
  
  const vults = await VultAccount.find()
  if (!vults) {
    return res.status(404).send('Transaction not found');
  }
  res.render('revenue/details.ejs', {data, user: res.locals.userDetails, vults});
});

app.get('/settle/:id', requireLogin, decodedAuth, async (req: Request, res: Response) => {
  const ref = req.params.id; // Retrieve the 'ref' parameter from the URL

  try {
    const revenueRecords = await Revenue.find({where:{ ref }});
    
    const vults = await VultAccount.find()
    if (!vults) {
      return res.status(404).send('Transaction not found');
    }

    const revenue = await Revenue.findOne({where:{ ref, debit: MoreThan(0) },
    relations: ['account'],
  });

    res.render('revenue/settle.ejs', { revenueRecords, vults, revenue });
  } catch (error) {
    console.error('Error fetching transaction or credit records:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/fund/:id',async (_: Request, res: Response) => {
  const id = _.params.id
   const bank = await VultAccount.findOne({where:{id}})
   const revenues = await Revenue.find({where:{vultAccountId: id, credit: MoreThan(0)}});
  res.render('spend.ejs', {bank, revenues});
});

app.get('/expenditures', async (_: Request, res: Response) => {
  const expenditureRepository = dataSource.getRepository(Expenditure);
  const expenses = await expenditureRepository.createQueryBuilder('trx')
    .leftJoinAndSelect('trx.vultAccount', 'vultAccount')
    .getMany();
  const message = _.session.message;
  const error = _.session.error;
  _.session.message = null; // Clear the message after displaying
  _.session.error = null;   // Clear the error after displaying
  res.render('expense/list.ejs', {expenses, message, error});
});

app.get('/expenditure/spend', async (_: Request, res: Response) => {
  const vults = await VultAccount.find();
  res.render('expense/spend.ejs', {vults});
});

app.get('/voucher/details/:id', async (_: Request, res: Response) => {
  const id = _.params.id;
  const expenditure = await Expenditure.findOne({
    where: { id },
    relations: ['vultAccount', 'user'],
  });

  if (!expenditure) {
    return res.status(404).send('Expenditure not found');
  }
  res.render('expense/voucher.ejs', {expenditure});
});

app.get('/invoice', (_: Request, res: Response) => {
  res.render('revenue/invoice.ejs');
});

app.get('/profile',requireLogin, decodedAuth, async (_: Request, res: Response) => {
  res.render('users/profile.ejs',{user: res.locals.userDetails});
});

app.get('/users',requireLogin, decodedAuth, async (_: Request, res: Response) => {
  const PrivilegeNames = {
    [Privilege.SuperAdmin]: "SuperAdmin",
    [Privilege.Admin]: "Admin",
    [Privilege.Manager]: "Manager",
    [Privilege.Clerk]: "Clerk",
};
  const users = await User.find();
  const message = _.session.message;
  const error = _.session.error;
  _.session.message = null; // Clear the message after displaying
  _.session.error = null;   // Clear the error after displaying
  res.render('users/users.ejs',{user: res.locals.userDetails, users, PrivilegeNames, message, error});
});

app.get('/transactions', async (req: Request, res: Response) => {
  const transactionRepository = dataSource.getRepository(Transaction);
  const transactions = await transactionRepository.createQueryBuilder('trx')
    .leftJoinAndSelect('trx.account', 'account')
    .getMany();

  res.render('transactions.ejs', { transactions });
});


app.get('/accounts', async (_: Request, res: Response) => {
  const accRepository = dataSource.getRepository(Account)
  const accounts = await accRepository.find();
  const message = _.session.message;
  _.session.message = null;
  res.render('account.ejs', {accounts,message});
});

app.get('/funds', async (_: Request, res: Response) => {
  const vultRepository = dataSource.getRepository(VultAccount)
        const vults = await vultRepository.find();
  res.render('funds.ejs', {vults});
});

app.get('/error', (req, res) => {
  const message = req.query.message || "Something went wrong.";
  res.render('error', { message });
});

app.get('/logout', (req, res) => {
  // Clear the 'auth' cookie
  res.clearCookie('auth', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  // Redirect to the login page or home page
  res.redirect('/auth');
});


app.use((_req, res, _next) => {
  res.status(404).json({
    message: 'Resource does not exist',
  });
});

app.use(exceptionFilter);

export default app;
