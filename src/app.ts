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
import DVEA from "./entities/dvea.entity";
import { Transaction } from "./entities/transactions.entity";
import Revenue, { PaymentMode } from "./entities/revenue.entity";
import cookieParser from "cookie-parser";
import { Privilege, User } from "./entities/user.entity";
import RevenueType from "./entities/revenue-types.entity";

const app = express();

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
 
  res.render('users/auth.ejs');
});

app.get('/funds', requireLogin, async (_: Request, res: Response) => {
  const vultRepository = dataSource.getRepository(VultAccount)
        const vults = await vultRepository.find();
  res.render('funds.ejs', {vults});
});

app.get('/revenue', async (_: Request, res: Response) => {
  const revenueRepo = dataSource.getRepository(Revenue);
  // Fetch transactions with related account and user data
  const revenues = await revenueRepo.find({
    relations: ['account', 'revenueType'], // Include related entities
  });

  const revenueTypeRepository = dataSource.getRepository(RevenueType);
  const revenueTypes = await revenueTypeRepository.find({ select: ['id', 'name'] });
  const paymentModes = [
    ...Object.values(PaymentMode.CashOffice),
    ...Object.values(PaymentMode.BankDeposit),
    PaymentMode.PAYSTACK,
    PaymentMode.FLUTTERWAVE,
  ];
  res.render('revenue/revenue.ejs', { revenues, revenueTypes, paymentModes: Object.values(paymentModes) });
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
  res.render('users/users.ejs',{user: res.locals.userDetails, users, PrivilegeNames});
});
app.get('/transactions', async (_: Request, res: Response) => {
  const transactionRepository = dataSource.getRepository(Transaction);
  
  // Fetch transactions with related account and user data
  const transactions = await transactionRepository.find({
    relations: ['account', 'user'], // Include related entities
  });

  res.render('transactions.ejs', { transactions });
});

app.get('/account/view', async (_: Request, res: Response) => {
  const accRepository = dataSource.getRepository(Account)
  const accounts = await accRepository.find();

  res.render('account.ejs', {accounts});
});

app.get('/revenue-type', async (_: Request, res: Response) => {
  const rtRepository = dataSource.getRepository(RevenueType) // rt is revenue type
  const rts = await rtRepository.find({
    relations: ["vultAccount"],
  });

  const accRepository = dataSource.getRepository(VultAccount);
  const accounts = await accRepository.find({ select: ['id', 'name'] });


  res.render('revenue/revenue-type.ejs', {rts, accounts});
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
