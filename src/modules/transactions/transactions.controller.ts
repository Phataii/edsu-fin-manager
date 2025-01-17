import { BadRequestException } from "../../utils/service-exceptions";
import TransactionServices from "./transactions.services";
import { Request, Response } from "express";


export default class TransactionsController{
    private transactionService: TransactionServices;

    constructor() {
        this.transactionService = new TransactionServices();
      }

      createVult = async (req: Request, res: Response) => {
        try {
          const result = await this.transactionService.createVult(req.body);
          res.redirect('/funds');
        } catch (error) {
          if (error instanceof BadRequestException) {
            res.render('funds', {
              error: error.message,
              formData: req.body // Send the original form data back
            });
          } else {
            // Pass unexpected errors to the global error handler
            next(error);
          }
        }
      }

      createAcc = async (req: Request, res: Response) => {
        try {
          const result = await this.transactionService.createAcc(req.body);
          req.session.message = 'Account created';
          res.redirect('/accounts');
        } catch (error) {
          if (error instanceof BadRequestException) {
            res.render('accounts', {
              error: error.message,
              formData: req.body // Send the original form data back
            });
          } else {
            // Pass unexpected errors to the global error handler
            next(error);
          }
        }
      }

      createRT = async (req: Request, res: Response) => {
        try {
          const result = await this.transactionService.createRT(req.body);
          res.redirect('/revenue-type');
        } catch (error) {
          if (error instanceof BadRequestException) {
            res.render('funds', {
              error: error.message,
              formData: req.body // Send the original form data back
            });
          } else {
            // Pass unexpected errors to the global error handler
            next(error);
          }
        }
      }

      addRevenue = async (req: Request, res: Response) => {
        try {
          const result = await this.transactionService.addRevenueTransaction(req.body);
          req.session.message = 'Revenue added successfully';
          res.redirect('/revenue');
        } catch (error) {
          if (error instanceof BadRequestException) {
            res.render('funds', {
              error: error.message,
              formData: req.body // Send the original form data back
            });
          } else {
            // Pass unexpected errors to the global error handler
            next(error);
          }
        }
      }

      addExpenditure = async (req: Request, res: Response) => {
        try {
          const result = await this.transactionService.submitExpenditure(req.body);
          req.session.message = 'Expenditure added successfully';
          res.redirect('/expenditures');
        } catch (error) {
          if (error instanceof BadRequestException) {
            res.render('funds', {
              error: error.message,
              formData: req.body // Send the original form data back
            });
          } else {
            // Pass unexpected errors to the global error handler
            next(error);
          }
        }
      }

      settleRevenue = async (req: Request, res: Response, next) => {
        try {
          await this.transactionService.settleRevenueTrx(req.body);
          // Redirect with success message as a query parameter
          req.session.message = 'Transaction successfully settled!';
            res.redirect('/revenue');
        } catch (error) {
          if (error instanceof BadRequestException) {
            res.render('transactions', {
              error: error.message,
              formData: req.body // Send the original form data back
            });
          } else {
            // Pass unexpected errors to the global error handler
            next(error);
          }
        }
      };
      deleteRevenue = async (req: Request, res: Response) => {
        try {
            const result = await this.transactionService.deleteRevenue(req.body.revenueId, req.body.userId);
            req.session.message = 'Revenue record successfully deleted';
            res.redirect('/revenue');
        } catch (error) {
            console.error(error); // Log the error for debugging
            // Redirect to an error page with a custom message
            req.session.error = `${error.message}`;
            res.redirect('/revenue');
        }
    };
    }

    
  


function next(error: any) {
    throw new Error("Function not implemented.");
}
