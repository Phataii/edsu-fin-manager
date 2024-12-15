import { StringLiteral } from "typescript"

export type createVult= {
    accountNumber: string;
    name: string;
    openBal: number
}

export type createAccount = {
    accountNumber: string;
    accountType: string;
}

export type createRT = {
    name: string;
    vultAccountId: string;
}

export type addRevenue = {
    source: string;
    dtid: string;
    amount: number;
    transactionDate: Date;
    mode: string;
    ref: string;
    desc: string;
    settled: boolean;
    revenueTypeId: string;

}
