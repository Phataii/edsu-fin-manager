import { StringLiteral } from "typescript"

export type createVult= {
    accountNumber: string;
    name: string;
    openBal: number
}

export type createAccount = {
    accountNumber: string;
    accountType: string;
    accountName: string;
}

export type createRT = {
    name: string;
    vultAccountId: string;
}
export interface ExpenditureDTO {
    pvNo: string;                      // Payment Voucher Number
    payee: string;                     // Name of the person or entity to pay
    address: string;                   // Address of the payee
    cheqOrMandateNo?: string;          // Optional: Cheque or Mandate Number
    total: number;                     // Total expenditure amount
    accounts: {                        // Array of account details
      desc: string;                    // Description
      accountCode: string;             // Account code identifier
      amount: number;                  // Amount associated with the account
      ref: string;                     // Reference
    }[];                               // This should be an array of objects
    vultAccountId?: string;            // Optional: ID of the VULT account
    DateOfBill: Date;                  // Date of the bill
  }
  
