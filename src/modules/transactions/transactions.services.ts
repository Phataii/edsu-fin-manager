import { Console } from "console";
import Account from "../../entities/account.entity";
import DVEA from "../../entities/dvea.entity";
import Revenue, { PaymentMode } from "../../entities/revenue.entity";
import VultAccount from "../../entities/vult-account.entity";
import { addRevenue, createAccount, createRT, createVult } from "./interfaces/transactions.types";
import { Transaction } from "../../entities/transactions.entity";
import RevenueType from "../../entities/revenue-types.entity";
import dataSource from "../../datasource/data-source";
import { Privilege, User } from "../../entities/user.entity";
import { BadRequestException, NotFoundException } from "../../utils/service-exceptions";


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
          const revenueAccount = await Account.findOne({ where: { accountNumber: "01-001-100" } }); // Revenue account
          // Create and save the revenue
          const revenue = Revenue.create({
            account: revenueAccount,
            jvNo: payload.jvNo,
            // dtid: payload.dtid, Update when trx is reconciled
            source: payload.source,
            amount: payload.amount,
            transactionDate: payload.transactionDate,
            mode: payload.mode,
            desc: payload.desc,
            ref: payload.ref,
            revenueTypeId: payload.revenueTypeId,
            // settled: true,
            createdOn: new Date(),
            dateReceived: new Date(),
            userId: payload.userId // Save the logged-in user
          });
       
          const savedRevenue = await revenue.save();

          await this.processTransaction(savedRevenue);

          // If revenue is settled, process the transaction and apply double entry
          // if (savedRevenue.settled) {
          //   await this.processTransaction(savedRevenue);
          // }
      
          return savedRevenue;
        } catch (error) {
          console.error("Error in addRevenueTransaction:", error);
          throw error;
        }
      };
      
      processTransaction = async (savedRevenue) => {
        try {
            // Fetch the accounts
            const assetAccount = await Account.findOne({ where: { accountNumber: "03-001-100" } }); // Asset account
            const revenueAccount = await Account.findOne({ where: { accountNumber: "01-001-100" } }); // Revenue account
            
            if (!assetAccount || !revenueAccount) {
                throw new Error('Required accounts not found');
            }
    
            const dtNo = await this.generateDTSerialNumber();
            // Create and save the credit transaction (revenue)
            const creditTransaction = Transaction.create({
              account: revenueAccount,
              jvNo: savedRevenue.jvNo, // Define a format for JV number if needed
              payerOrPayee: savedRevenue.source,
              description: savedRevenue.desc,
              refNo: savedRevenue.ref,
              dveaNo: savedRevenue.revenueTypeId,
              // settled: savedRevenue.settled,
              debit: 0, // Explicitly set to zero
              credit: savedRevenue.amount,
              // dtNo,
              createdAt: new Date(),
              userId: savedRevenue.userId,
              date: savedRevenue.transactionDate
          });

        await creditTransaction.save();

            // Create and save the debit transaction (asset)
            const debitTransaction = Transaction.create({
                account: assetAccount,
                jvNo: savedRevenue.jvNo, // Define a format for JV number if needed
                payerOrPayee: savedRevenue.source,
                description: savedRevenue.desc,
                refNo: savedRevenue.ref,
                dveaNo: savedRevenue.revenueTypeId,
                // settled: savedRevenue.settled,
                debit: savedRevenue.amount,
                credit: 0, // Explicitly set to zero
                // dtNo,
                createdAt: new Date(),
                userId: savedRevenue.userId,
                date: savedRevenue.transactionDate
            });
    
            await debitTransaction.save();
    
            console.log('Double entry successfully created.');
        } catch (error) {
            console.error("Error in processTransaction:", error);
            throw error;
        }
    };
    
    settleRevenueTrx = async (ref) => {
      try {
        console.log(">>>>>>>>>", ref)
        // Find the revenue record by reference
        const revenue = await Revenue.findOne({ where: { ref } });
        if (!revenue) {
          throw new Error(`Revenue record not found for reference: ${ref}`);
        }
    
        // Generate a new DT serial number
        const dtSerialNumber = await this.generateDTSerialNumber();
    
        // Update revenue record
        revenue.dtid = dtSerialNumber;
        revenue.settled = true;
        await revenue.save();
    
        // Find all transactions related to the reference
        const transactions = await Transaction.find({ where: { refNo: ref } });
        if (transactions.length > 0) {
          // Update all transactions in a batch
          await Promise.all(
            transactions.map(async (transaction) => {
              transaction.dtNo = dtSerialNumber; // Use the same DT serial number
              transaction.settled = true;
              await transaction.save();
            })
          );
        }
    
        return `Successfully settled revenue and transactions for reference: ${ref}`;
      } catch (error) {
        return `Error settling revenue and transactions: ${error.message}`;
      }
    };
    
    deleteRevenue = async (revenueId: string,userId: string) => {
          const admin = await User.findOne({ where: { id: userId } });
          if (!admin) {
            throw new NotFoundException("Admin not found");
          }
          if (admin.privilege !== Privilege.Reviewer) {
            throw new BadRequestException("Only Admins are authorized to perform this action");
          }
        
          const revenueRepository = dataSource.getRepository(Revenue);
        
          try {
            const data = await revenueRepository.findOne({ where: { id: revenueId } });
            if (!data) {
              throw new NotFoundException("Revenue not found");
            }
            await revenueRepository.remove(data);
          } catch (error) {
            // console.error("Error during user deletion:", error); // Log unexpected errors
            throw new BadRequestException("An unexpected error occurred during deletion");
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



      generateDTSerialNumber = async (): Promise<string> => {
        try {
           // Retrieve the latest serial number from the database
           const transactionRepository = dataSource.getRepository(Transaction);
            const latestEntry = await transactionRepository.createQueryBuilder('trx')
                .select('trx.dtNo') // Ensure the column name matches your database
                .orderBy('trx.dtNo', 'DESC')
                .getOne();
    
            let nextNumber = 1; // Default to 1 if no serial number exists
    
            if (latestEntry?.dtNo) {
                // Extract the numeric part from the latest serial number (e.g., "DT-000000001" -> 1)
                const numericPart = parseInt(latestEntry.dtNo.replace('DT-', ''), 10);
                nextNumber = numericPart + 1;
            }
    
            // Format the next serial number with leading zeros
            const paddedNumber = nextNumber.toString().padStart(9, '0'); // 9 digits with leading zeros
            return `DT-${paddedNumber}`;
        } catch (error) {
            console.error('Error generating serial number:', error);
            throw error;
        }
    };

    generateJVSerialNumber = async (): Promise<string> => {
      try {
         // Retrieve the latest serial number from the database
         const transactionRepository = dataSource.getRepository(Transaction);
          const latestEntry = await transactionRepository.createQueryBuilder('trx')
              .select('trx.dtNo') // Ensure the column name matches your database
              .orderBy('trx.dtNo', 'DESC')
              .getOne();
  
          let nextNumber = 1; // Default to 1 if no serial number exists
  
          if (latestEntry?.dtNo) {
              // Extract the numeric part from the latest serial number (e.g., "DT-000000001" -> 1)
              const numericPart = parseInt(latestEntry.dtNo.replace('DT-', ''), 10);
              nextNumber = numericPart + 1;
          }
  
          // Format the next serial number with leading zeros
          const paddedNumber = nextNumber.toString().padStart(9, '0'); // 9 digits with leading zeros
          return `DT-${paddedNumber}`;
      } catch (error) {
          console.error('Error generating serial number:', error);
          throw error;
      }
  };
}


