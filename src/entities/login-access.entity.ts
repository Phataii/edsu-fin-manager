import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity } from 'typeorm';

@Entity('otps')
export class OTP extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string; // The OTP code

  @Column()
  userId: number; // The user or entity associated with the OTP

  @Column('timestamp')
  expiresAt: Date; // Expiration time for the OTP

  @CreateDateColumn()
  createdAt: Date; // Automatically set when the OTP is created

  @Column({ default: false })
  isUsed: boolean; // Indicates whether the OTP has been used
}
