import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("email-template")
export default class EmailTemplate extends BaseEntity{
    @PrimaryGeneratedColumn("uuid") id: string;
    @Column({ default: null }) type: string;
    @Column('longtext') template: string;
    @Column({ default: null }) subject: string;
    @Column({ default: null }) from: string;
    @CreateDateColumn({ default: null })createdAt: Date;
    @CreateDateColumn({ default: null })updatedAt: Date;
}