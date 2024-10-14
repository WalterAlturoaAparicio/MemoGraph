import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
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

  // Actualizar el JWT token del usuario
  async updateJwtToken(userId: number, jwtToken: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (user) {
      user.jwtToken = jwtToken
      await this.userRepository.save(user)
    }
  }

  // Cerrar sesión del usuario
  async logout(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
        throw new NotFoundException('User not found'); 
    }

    if (!user.jwtToken) {
        throw new BadRequestException('User is already logged out'); 
    }

    user.jwtToken = null; 
    await this.userRepository.save(user); 
  }

  // Actualizar código OTP
  async updateOtpCode(userId: number, otpCode: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (user) {
      user.otpCode = otpCode
      await this.userRepository.save(user)
    }
  }

  // Marcar OTP como verificado
  async verifyOtp(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (user) {
      user.isOtpVerified = true
      await this.userRepository.save(user)
    }
  }
}
