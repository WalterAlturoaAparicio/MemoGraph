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

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email)
    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
