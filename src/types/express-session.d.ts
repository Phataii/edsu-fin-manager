import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    message?: string; // Add your custom session properties here
    error?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      session: session.Session & Partial<session.SessionData>;
    }
  }
}
