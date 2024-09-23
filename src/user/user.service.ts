import { Injectable } from '@nestjs/common'
import { User } from './user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })
    return this.userRepository.save(newUser)
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } })
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } })
  }
  //   async validateUser(email: string, password: string): Promise<User | null> {
  //     const user = await this.findUserByEmail(email)
  //     if (user && (await bcrypt.compare(password, user.password))) {
  //       return user
  //     }
  //     return null
  //   }

  //   async login(user: User): Promise<string> {
  //     // Cerrar sesión anterior en otro dispositivo
  //     await this.logout(user.id)

  //     // Generar nuevo token
  //     const payload = { email: user.email, sub: user.id }
  //     const jwtToken = this.jwtService.sign(payload, { expiresIn: '1y' })
  //     user.jwtToken = jwtToken

  //     await this.userRepository.save(user)
  //     return jwtToken
  //   }

  //   async logout(userId: number): Promise<void> {
  //     const user = await this.userRepository.findOne({ where: { id: userId } })
  //     if (user) {
  //       user.jwtToken = null
  //       await this.userRepository.save(user)
  //     }
  //   }

  //   async generateOtp(email: string): Promise<string> {
  //     const user = await this.findUserByEmail(email)
  //     if (!user) {
  //       throw new Error('Usuario no encontrado')
  //     }

  //     const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  //     user.otpCode = otpCode
  //     await this.userRepository.save(user)

  //     // Enviar OTP por correo electrónico
  //     const transporter = nodemailer.createTransport({
  //       service: 'gmail',
  //       auth: {
  //         user: process.env.EMAIL_USER,
  //         pass: process.env.EMAIL_PASSWORD,
  //       },
  //     })

  //     await transporter.sendMail({
  //       from: process.env.EMAIL_USER,
  //       to: email,
  //       subject: 'Tu código OTP',
  //       text: `Tu código OTP es: ${otpCode}`,
  //     })

  //     return otpCode
  //   }

  //   async validateOtp(email: string, otpCode: string): Promise<boolean> {
  //     const user = await this.findUserByEmail(email)
  //     if (user && user.otpCode === otpCode) {
  //       user.isOtpVerified = true
  //       await this.userRepository.save(user)
  //       return true
  //     }
  //     return false
  //   }
}
