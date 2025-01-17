import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./transactions.entity";
import Revenue from "./revenue.entity";

@Entity("account")
export default class Account extends BaseEntity{
    @PrimaryGeneratedColumn("uuid") id: string;
    @Column() accountNumber: string;
    @Column() accountName: string;
    @Column() accountType: string;
    @OneToMany(() => Transaction, (transaction) => transaction.account)
    transaction: Transaction[]; // Defines the relationship

    @OneToMany(() => Revenue, (revenue) => revenue.account)
    revenues: Revenue[]; // Defines the relationship
    @CreateDateColumn() createdOn: Date
}