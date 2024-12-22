import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index, BaseEntity } from 'typeorm';
import Account from './account.entity';
import { User } from './user.entity';

@Entity('transactions') // Table name
export class Transaction extends BaseEntity{
  @PrimaryGeneratedColumn('uuid') // Unique identifier for each transaction
  id: string;

  @CreateDateColumn() // Automatically managed by TypeORM
  date: Date;
  
  @Column({ type: 'varchar', nullable: true })
  jvNo: string; // JV NO

  @Column({ type: 'varchar'})
  payerOrPayee: string; // Name of the payer or payee

  @Column({ type: 'text', nullable: true })
  description: string; // Optional description for the transaction

  @Column({ type: 'varchar', unique: false })
  refNo: string; // Unique reference number for the transaction

  @Column({ type: 'varchar', nullable: true })
  dveaNo: string; // Optional DVEA number

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  debit: number; // Debit amount

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  credit: number; // Credit amount

  @Column({ type: 'varchar', nullable: true })
  image: string; // Path or URL to the associated image

  @Column({ default: false })
  settled: boolean; 

  @Column({ type: 'varchar', nullable: true })
  dtNo: string; // Deposit Ticket No

  @CreateDateColumn() // Automatically managed by TypeORM
  createdAt: Date;

  @ManyToOne(() => Account, (account) => account.transaction, {  // Revenue, Expense, Liability, Equity, Assets
    onDelete: 'CASCADE', // Optional: Delete transactions if the account is deleted
    onUpdate: 'CASCADE',
  })
  @Index()
  account: Account; // Foreign key linking to the Account

  //The person that entered the payment
  @Column({ nullable: false }) userId: string;
  @ManyToOne(() => User) user: User;
}
