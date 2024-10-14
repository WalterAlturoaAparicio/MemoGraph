import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { compare } from 'bcrypt'
import * as nodemailer from 'nodemailer'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Validación del usuario durante el login
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email)
    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  // Inicio de sesión con generación de token y manejo de sesiones anteriores
  async login(user: User): Promise<string> {
    // Cerrar sesión anterior en otros dispositivos
    if (user.jwtToken) await this.userService.logout(user.id)

    // Generar un nuevo token JWT
    const payload = { email: user.email, sub: user.id }
    const jwtToken = this.jwtService.sign(payload, { expiresIn: '1y' })

    // Actualizar el token en el UserService
    await this.userService.updateJwtToken(user.id, jwtToken)

    return jwtToken
  }

  // Generar y enviar OTP por correo electrónico
  async generateOtp(email: string): Promise<string> {
    const user = await this.userService.findByEmail(email)
    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    // Generar OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    await this.userService.updateOtpCode(user.id, otpCode)

    // Enviar el OTP por correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Tu código OTP',
      text: `Tu código OTP es: ${otpCode}`,
    })

    return otpCode
  }

  // Validar OTP
  async validateOtp(email: string, otpCode: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email)
    if (user && user.otpCode === otpCode) {
      await this.userService.verifyOtp(user.id)
      return true
    }
    return false
  }
}
