import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      auth: AuthPayload,
      user?: string | JwtPayload;
    }
  }
}

export interface AuthPayload {
  userId: string
}