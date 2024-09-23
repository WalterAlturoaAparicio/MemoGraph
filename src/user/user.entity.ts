import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ nullable: true })
  otpCode: string

  @Column({ default: false })
  isOtpVerified: boolean

  @Column({ nullable: true })
  jwtToken: string

  @Column()
  createdAt: Date

  @Column({ default: true })
  isActive: boolean
}
