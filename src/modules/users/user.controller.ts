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
            req.session.error = `${error.message}`;
            res.redirect('/users');
          }
        }
      };

      deleteUser = async (req: Request, res: Response) => {
        try {
          const result = await this.userService.deleteUser(req.params.uId, req.params.aId);
          req.session.message = 'User record successfully deleted';
          res.redirect('/users');
        } catch (error) {
          req.session.error = 'An error occurred while deleting the user';
          res.redirect('/users');
        }
      };
      


      inviteUser = async (req: Request, res: Response) => {
        try {
            const result = await this.userService.inviteUser(req.body);
            req.session.message = `${result}`;
            res.redirect('/users');
        } catch (error) {
            // Redirect to an error page with a custom message
            req.session.error = `${error.message}`;
            res.redirect('/users');
            // res.status(400).redirect(`/users?error=${encodeURIComponent(error.message)}`);
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
