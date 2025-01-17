import { Console } from "console";
import Account from "../../entities/account.entity";
import DVEA from "../../entities/dvea.entity";
import Revenue, { PaymentMode } from "../../entities/revenue.entity";
import VultAccount from "../../entities/vult-account.entity";
import { createAccount, createRT, createVult, ExpenditureDTO } from "./interfaces/transactions.types";
import { Transaction } from "../../entities/transactions.entity";
import dataSource from "../../datasource/data-source";
import { Privilege, User } from "../../entities/user.entity";
import { BadRequestException, NotFoundException } from "../../utils/service-exceptions";
import { MoreThan } from "typeorm";
import Expenditure from "../../entities/expenditure.entity";


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
          accountType: payload.accountType,
          accountName: payload.accountName
        });

        // Save the acc to the database
        await acc.save();
    return acc
    }

    // create revenue type
    createRT = async(payload: createRT)=>{
        const acc = Revenue.create({
            // name: payload.name,
            vultAccountId: payload.vultAccountId,
          });

          // Save the user to the database
          await acc.save();
    return acc
    }

    addRevenueTransaction = async (payload) => {
        try {
          
          const jvNo = await this.generateJVSerialNumber();
          const dtNo = await this.generateDTSerialNumber();

          // Create and save the revenue
          const revenue = Revenue.create({
            mode: payload.mode,
            ref: payload.ref,
            debit: payload.amount,
            credit: 0,
            desc: payload.desc,
            jvNo,
            source: payload.source,
            transactionDate: payload.transactionDate,
            accountId: payload.accountId, // DR account
            userId: payload.userId, // Save the logged-in user
            createdOn: new Date(),
          });
          // if user selects CR account while posting
          if(payload.vultAccountId != null || payload.vultAccountId != undefined){
            
            revenue.vultAccountId = payload.vultAccountId, // CR account
            revenue.settled = true,
            revenue.dtNo = dtNo
            revenue.dateReceived = new Date();

            const creditTransaction = Revenue.create({
              accountId: revenue.accountId,
              vultAccountId: revenue.vultAccountId,
              jvNo: revenue.jvNo, 
              source: revenue.source,
              desc: revenue.desc,
              ref: revenue.ref,
              dveaNo: revenue.dveaNo,
              mode: revenue.mode,
              settled: true,
              debit: 0, // Explicitly set to zero
              credit: revenue.debit,
              dtNo,
              createdOn: new Date(),
              dateReceived: new Date(),
              userId: revenue.userId,
              transactionDate: revenue.transactionDate
            })
            await creditTransaction.save();
            await this.addRevenueToCrAcc(creditTransaction);
          }
         
          await revenue.save();
          return {message: "Revenue saved"};
        } catch (error) {
          console.error("Error in addRevenueTransaction:", error);
          throw error;
        }
      };

      settleRevenueTrx = async (data) => {
        try {
           // Find the revenue record by reference
           const revenue = await Revenue.findOne({ where: { ref: data.ref, debit: MoreThan(0) } });
           if (!revenue) {
             throw new Error(`Revenue record not found for reference: ${data.ref}`);
           }

           // Generate a new DT serial number
          const dtNo = await this.generateDTSerialNumber();
          const creditTransaction = Revenue.create({
            accountId: revenue.accountId,
            vultAccountId: data.creditAccount,
            jvNo: revenue.jvNo, 
            source: revenue.source,
            desc: revenue.desc,
            mode: revenue.mode,
            ref: revenue.ref,
            dveaNo: revenue.dveaNo,
            settled: true,
            debit: 0, // Explicitly set to zero
            credit: revenue.debit,
            dtNo,
            createdOn: new Date(),
            userId: revenue.userId,
            transactionDate: revenue.transactionDate
          })
          
          await creditTransaction.save();
         
          // Update revenue record
          revenue.dtNo = dtNo;
          revenue.settled = true;
          revenue.vultAccountId = data.creditAccount
          await revenue.save();
      
          // do the vult calculation thing
          await this.addRevenueToCrAcc(creditTransaction);
      
          return `Successfully settled revenue and transactions for reference: ${data.ref}`;
        } catch (error) {
          return `Error settling revenue and transactions: ${error.message}`;
        }
      };

    // sum the incoming revenue into CR account
    addRevenueToCrAcc = async (data) => {
      try {
        // Ensure data.credit is a valid number
        const creditAmount = parseFloat(data.credit);
        if (isNaN(creditAmount)) {
          throw new Error(`Invalid credit amount: ${data.credit}`);
        }
    
        // Fetch the account
        const account = await VultAccount.findOne({ where: { id: data.vultAccountId } });
        if (!account) {
          throw new NotFoundException(`Account not found`);
        }
    
        // Convert account.currentBal to a number
        const currentBalance = parseFloat(account.currentBal as any); // Ensure it's treated as a number
    
        // Perform the addition
        const newBalance = currentBalance + creditAmount;
        account.currentBal = newBalance;
    
        // Save the updated account
        await account.save();
        
      } catch (e) {
        console.error("Error in addRevenueToCrAcc:", e.message || e);
        throw e;
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
        

        submitExpenditure = async (payload: ExpenditureDTO): Promise<{ message: string; data?: Expenditure; error?: string }> => {
          try {
            console.log("Payload received:", payload);
        
            // Validate payload fields
            if (!payload.pvNo || !payload.payee || !payload.address || !payload.total || !payload.accounts.length) {
              throw new Error("Missing required fields in the payload.");
            }
        
            // Ensure all accounts have valid data
            const formattedAccounts = payload.accounts.map((account, index) => {
              if (!account.desc || !account.accountCode || !account.amount || !account.ref) {
                throw new Error(`Invalid account details at index ${index}. All fields are required.`);
              }
        
              return {
                desc: account.desc,
                accountCode: account.accountCode,
                amount: parseFloat(account.amount as unknown as string), // Ensure amount is a valid number
                ref: account.ref,
              };
            });
        
            // Create a new expenditure instance
            const expenditure = Expenditure.create({
              pvNo: payload.pvNo,
              payee: payload.payee,
              address: payload.address,
              cheqOrMandateNo: payload.cheqOrMandateNo || null,
              total: payload.total,
              accounts: formattedAccounts,
              vultAccountId: payload.vultAccountId || null,
              dateOfBill: new Date(payload.DateOfBill), // Convert date to Date object
            });
        
            // Save the expenditure to the database
            await expenditure.save();
        
            // Return success response
            return {
              message: "Expenditure saved successfully.",
              data: expenditure,
            };
          } catch (error) {
            console.error("Error saving expenditure:", error);
        
            // Return error response
            return {
              message: "An error occurred while saving the expenditure.",
              error: error instanceof Error ? error.message : "Unknown error",
            };
          }
        };
        
      generateDTSerialNumber = async (): Promise<string> => {
        try {
           // Retrieve the latest serial number from the database
           const transactionRepository = dataSource.getRepository(Revenue);
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
         const transactionRepository = dataSource.getRepository(Revenue);
          const latestEntry = await transactionRepository.createQueryBuilder('trx')
              .select('trx.jvNo') // Ensure the column name matches your database
              .orderBy('trx.jvNo', 'DESC')
              .getOne();
  
          let nextNumber = 1; // Default to 1 if no serial number exists
  
          if (latestEntry?.jvNo) {
              // Extract the numeric part from the latest serial number (e.g., "DT-000000001" -> 1)
              const numericPart = parseInt(latestEntry.jvNo.replace('JV-', ''), 10);
              nextNumber = numericPart + 1;
          }
  
          // Format the next serial number with leading zeros
          const paddedNumber = nextNumber.toString().padStart(9, '0'); // 9 digits with leading zeros
          return `JV-${paddedNumber}`;
      } catch (error) {
          console.error('Error generating serial number:', error);
          throw error;
      }
  };
}


