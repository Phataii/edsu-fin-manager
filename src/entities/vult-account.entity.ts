import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("vult-accounts")
export default class VultAccount extends BaseEntity{
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column({default: null}) accountNumber: string;
    @Column() name: string;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    openBal: number; // Credit amount
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    currentBal: number; // Credit amount
    @Column({default: null}) year: string;
    @CreateDateColumn() openBalDate: Date;
}