import { Console } from "console";
import Account from "../../entities/account.entity";
import DVEA from "../../entities/dvea.entity";
import Revenue, { PaymentMode } from "../../entities/revenue.entity";
import VultAccount from "../../entities/vult-account.entity";
import { addRevenue, createAccount, createRT, createVult } from "./interfaces/transactions.types";
import { Transaction } from "../../entities/transactions.entity";
import RevenueType from "../../entities/revenue-types.entity";


export default class TransactionServices{
    createVult = async(payload: createVult)=>{
        const vult = VultAccount.create({
            accountNumber: payload.accountNumber,
            name: payload.name,
            openBal: payload.openBal
          });

          // Save the user to the database
          await vult.save();
    return vult
    }

    createAcc = async(payload: createAccount)=>{
        const acc = Account.create({
            accountNumber: payload.accountNumber,
            accountType: payload.accountType
          });

          // Save the user to the database
          await acc.save();
    return acc
    }

    // create revenue type
    createRT = async(payload: createRT)=>{
        const acc = RevenueType.create({
            name: payload.name,
            vultAccountId: payload.vultAccountId,
          });

          // Save the user to the database
          await acc.save();
    return acc
    }

    addRevenueTransaction = async (payload) => {
        try {
          // Create and save the revenue
          const revenue = Revenue.create({
            dtid: payload.dtid,
            source: payload.source,
            amount: payload.amount,
            transactionDate: payload.transactionDate,
            mode: payload.mode,
            desc: payload.desc,
            ref: payload.ref,
            revenueTypeId: payload.revenueTypeId,
            settled: payload.settled,
            createdOn: new Date(),
            dateReceived: new Date(),
            userId: "9ac8ea5f-9b68-4488-9568-8a2bd6d3c7cb" // Save the logged-in user
          });
      
          const savedRevenue = await revenue.save();
      
          // If revenue is settled, process the transaction and apply double entry
          if (savedRevenue.settled) {
            await this.processTransaction(savedRevenue);
          }
      
          return savedRevenue;
        } catch (error) {
          console.error("Error in addRevenueTransaction:", error);
          throw error;
        }
      };
      
    processTransaction = async (savedRevenue) => {
        try {
          // Create and save the transaction
          const transaction = Transaction.create({
            jvNo: "", // Define a format for JV number
            payerOrPayee: savedRevenue.source,
            description: savedRevenue.desc,
            refNo: savedRevenue.ref,
            dveaNo: savedRevenue.revenueTypeId,
            settled: savedRevenue.settled,
            debit: savedRevenue.amount,
            dtNo: "", // Define a format for DT number
            createdAt: new Date(),
            userId: savedRevenue.userId,
            date: savedRevenue.transactionDate
          });
      
          await transaction.save();
      
          // Apply the double entry rule
          await this.applyDoubleEntry(savedRevenue);
        } catch (error) {
          console.error("Error in processTransaction:", error);
          throw error;
        }
      };
      
    applyDoubleEntry = async (revenue) => {
        try {
          // Find the associated revenue type account
          const revenueTypeAccount = await RevenueType.findOne({ where: { id: revenue.revenueTypeId } });
          if (!revenueTypeAccount) {
            throw new Error("Revenue type account not found");
          }
      
          // Credit the revenue type account
          revenueTypeAccount.amount += revenue.amount;
          await revenueTypeAccount.save();
      
          // Debit the revenue type account
          revenueTypeAccount.amount -= revenue.amount;
          await revenueTypeAccount.save();
      
          // Find the associated vault account
          const vaultAccount = await VultAccount.findOne({ where: { id: revenueTypeAccount.vultAccountId } });
          if (!vaultAccount) {
            throw new Error("Vault account not found");
          }
      
          // Credit the vault account
          vaultAccount.currentBal += revenue.amount;
          await vaultAccount.save();
        } catch (error) {
          console.error("Error in applyDoubleEntry:", error);
          throw error;
        }
      };  
}


