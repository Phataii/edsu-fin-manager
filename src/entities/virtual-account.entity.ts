import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("virtual-accounts")
export default class VirtualAccount extends BaseEntity{
    @PrimaryGeneratedColumn('uuid') // Unique identifier for each transaction
    id: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    amount: number; // amount

    @Column({ type: 'varchar', unique: true, nullable: false })
    name: string; // tuition account

    @CreateDateColumn() Date: Date;
}