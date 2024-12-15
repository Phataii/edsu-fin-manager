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
          res.redirect('/account/view');
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
    }

function next(error: any) {
    throw new Error("Function not implemented.");
}
