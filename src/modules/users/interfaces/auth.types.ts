export type SignUpBody = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    code: string; //Admin code
  }

  export type SignInBody = {
    email: string;
    password: string;
  }

  export type InviteUser = {
    email: string;
    firstName: string;
    lastName: string;
    userId: string; //Admin-invitee
  }