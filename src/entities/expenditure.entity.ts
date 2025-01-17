import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import VultAccount from "./vult-account.entity";
import { User } from "./user.entity";

@Entity('expenditures')
export default class Expenditure extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    pvNo: string;

    @Column({ default: null })
    payee: string;

    @Column({ default: null })
    address: string;

    @Column({ default: null })
    cheqOrMandateNo: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    total: number;

    @Column("json", { nullable: true })
    accounts: { desc: string; accountCode: string; amount: number, ref: string }[];

    @Column({ nullable: true }) vultAccountId: string;
    @ManyToOne(() => VultAccount) vultAccount: VultAccount;

    @Column({ nullable: true }) userId: string;
    @ManyToOne(() => User) user: User;

    @Column() dateOfBill: Date

    @CreateDateColumn() createdOn: Date
}
