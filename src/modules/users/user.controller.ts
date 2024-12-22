import { Request, Response } from "express";
import UserServices from "./user.services";
import { BadRequestException } from "../../utils/service-exceptions";


export default class UserController{
    private userService: UserServices;

    constructor() {
        this.userService = new UserServices();
      }

      signUp = async (req: Request, res: Response) => {
        try {
          const result = await this.userService.signUp(req.body);
         const successMessage = "Sign up successful! Please log in.";
          res.render('users/auth', { message: successMessage });
        } catch (error) {
          if (error instanceof BadRequestException) {
            res.render('signup', {
              error: error.message,
              formData: req.body // Send the original form data back
            });
          } else {
            // Pass unexpected errors to the global error handler
            next(error);
          }
        }
      }
      
      signIn = async (req: Request, res: Response) => {
        try {
          const result = await this.userService.signIn(req.body);
          function hasAccessToken(result: any): result is { accessToken: string; user: any } {
            return 'accessToken' in result;
          }
        
          if (hasAccessToken(result)) {
            // Now TypeScript knows `result` has `accessToken` property
            res.cookie('auth', result.accessToken, {
            
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });
            res.redirect('/');
          }      
      
          // Render the dashboard or send a response
          res.render('dashboard.ejs', { user: result.user });
        } catch (error) {
          if (error instanceof BadRequestException) {
            res.render('users/auth', {
              error: error.message,
              formData: req.body, // Send the original form data back
            });
          } else {
            res.status(400).redirect(`users/auth?error=${encodeURIComponent(error.message)}`);
          }
        }
      };

      deleteUser = async (req: Request, res: Response) => {
        try {
            const result = await this.userService.deleteUser(req.params.userId, "9ac8ea5f-9b68-4488-9568-8a2bd6d3c7cb");
            res.redirect('/users?message=User record successfully deleted');
        } catch (error) {
            console.error(error); // Log the error for debugging
            // Redirect to an error page with a custom message
            res.status(400).redirect(`/users?error=${encodeURIComponent(error.message)}`);
        }
    };


      inviteUser = async (req: Request, res: Response) => {
        try {
            const result = await this.userService.inviteUser(req.body);
            res.status(200).json(result);
        } catch (error) {
            console.error(error); // Log the error for debugging
            // Redirect to an error page with a custom message
            res.status(400).redirect(`/users?error=${encodeURIComponent(error.message)}`);
        }
    };
    
      verifyAccount = async (req: Request, res: Response) => {
        const result = await this.userService.verifyAccount(req.auth.userId, req.body);
        res.status(200).json(result);
      }
}

function next(error: any) {
  throw new Error("Function not implemented.");
}
