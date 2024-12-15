import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Privilege {
    SuperAdmin = 1,
    Admin = 2,
    Manager=3,
    Clerk = 4,
  }

@Entity('users')
export class User extends BaseEntity{
@PrimaryGeneratedColumn('uuid') id: string
@Column() firstName: string
@Column() lastName: string
@Column({ unique: true }) email: string
@Column({ default: false }) emailVerified: boolean
@Column() password: string
@Column({ default: true }) isNew: boolean
@Column("int") privilege: Privilege;
@CreateDateColumn() createdOn: Date
}