import { Controller, Post, Body, Get, Param } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.userService.createUser(body.email, body.password)
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.userService.findById(id)
  }
}
