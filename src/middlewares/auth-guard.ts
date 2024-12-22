import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { unless } from "express-unless";

export const jwtGuard = (options: { credentialsRequired: boolean }) => {
  const middleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.auth;

      if (!token) {
        if (options.credentialsRequired) {
          return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        return next();
      }

      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret);
      req.user = decoded;

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };

  // Attach `unless` method to the middleware
  middleware.unless = unless;

  return middleware;
};
