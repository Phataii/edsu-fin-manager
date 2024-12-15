declare global {
  namespace Express {
    export interface Request {
      auth: AuthPayload
    }
  }
}

export interface AuthPayload {
  userId: string
}