import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("logs")
export default class Log extends BaseEntity{
    @PrimaryGeneratedColumn() id: string;
    @Column({ default: null }) action: string;

    @Column({ nullable: false }) userId: string;
    @ManyToOne(() => User) user: User;
    @CreateDateColumn() timestamp: Date; 
}