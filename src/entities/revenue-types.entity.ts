import { BaseEntity, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Account from "./account.entity";
import VultAccount from "./vult-account.entity";

@Entity("revenue-types")
export default class RevenueType extends BaseEntity{
    @PrimaryGeneratedColumn("uuid") id: string;
    @Column({ type: 'varchar', unique: true, nullable: false })
    name: string; // tuition account

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    amount: number; // the amount for that revenue
    
    
    @Column({ nullable: true }) vultAccountId: string;
    @ManyToOne(() => VultAccount) vultAccount: VultAccount;
    

    @CreateDateColumn() createdOn: Date
}