import { BaseEntity, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import Account from "./account.entity";
import RevenueType from "./revenue-types.entity";

export namespace PaymentMode {
  export enum CashOffice {
    CASH = 'cash office (CASH)',
    POS = 'cash office (POS)',
    UBA = 'cash office (UBA)',
  }

  export enum BankDeposit {
    UBA = 'bank deposit (UBA)',
    STERLING = 'bank deposit (STERLING)',
  }

  export const PAYSTACK = 'paystack';
  export const FLUTTERWAVE = 'flutterwave';
}


@Entity("revenue")
export default class Revenue extends BaseEntity{
    @PrimaryGeneratedColumn("uuid") id: string;
    @Column({ type: 'varchar', nullable: true })
    jvNo: string; // JV NO

    @Column({unique: true, nullable: true}) dtid: string; //deposit ticket
    @Column({nullable: true}) source: string; //UTME OR ...
    @Column({nullable: true}) amount: number;
    @Column({nullable: true}) dateReceived: Date
    @Column({nullable: true}) transactionDate: Date
    @Column({nullable: true}) mode: string;
    @Column({nullable: true}) ref: string;
    @Column({nullable: true}) desc: string;

    @ManyToOne(() => Account, (account) => account.revenues, {
        onDelete: 'CASCADE', // Optional: Delete revenues if the account is deleted
        onUpdate: 'CASCADE',
      })
      @Index()
      account: Account; // Foreign key linking to the Account

      @Column({ default: false })
      settled: boolean; 

      @Column({ nullable: true }) revenueTypeId: string;
    @ManyToOne(() => RevenueType) revenueType: RevenueType;

    @Column({ nullable: true }) userId: string;
    @ManyToOne(() => User) user: User;
    
    @CreateDateColumn() createdOn: Date
}