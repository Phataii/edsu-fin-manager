import { BaseEntity, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import Account from "./account.entity";
import VultAccount from "./vult-account.entity";

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
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: true})
    mode: string;

    @Column({nullable: true})
    ref: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    debit: number; // Debit amount
  
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    credit: number; // Credit amount

    @Column({nullable: true})
    desc: string;

    @Column({ type: 'varchar', nullable: true })
    jvNo: string; // JV NO

    @Column({ type: 'varchar', nullable: true })
    dveaNo: string; // Optional DVEA number

    @Column({nullable: true})
    source: string; //UTME OR ...

    @Column({ default: false })
    settled: boolean; 

    @Column({ type: 'varchar', nullable: true })
    dtNo: string; // Deposit Ticket No

    @Column({nullable: true})
    transactionDate: Date

    @Column({nullable: true})
    dateReceived: Date

    @Column({ type: 'varchar', nullable: true })
    image: string; // Path or URL to the associated image

    @Column({ nullable: true }) accountId: string;
    @ManyToOne(() => Account) account: Account;

    @Column({ nullable: true }) vultAccountId: string;
    @ManyToOne(() => VultAccount) vultAccount: VultAccount;

    @Column({ nullable: true }) userId: string;
    @ManyToOne(() => User) user: User;
    
    @CreateDateColumn() createdOn: Date
}