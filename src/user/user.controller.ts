import { Controller, Post, Body, Get, Param, UseGuards, HttpCode, Req } from '@nestjs/common'
import { UserService } from './user.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)  
  @Post('logout')
  @HttpCode(204)  
  async logout(@Req() req: Request): Promise<void> {
    const user = req["user"];  
    return await this.userService.logout(user.id);
  }
}
