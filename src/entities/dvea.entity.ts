import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Account from "./account.entity";

@Entity("dvea")
export default class DVEA extends BaseEntity{
    @PrimaryGeneratedColumn("uuid") id: string;
    @Column() dveaNumber: string;
    @Column() dveaType: string;

    @Column({ nullable: false }) accountId: string;
    @ManyToOne(() => Account) account: Account;
    @CreateDateColumn() createdOn: Date
}