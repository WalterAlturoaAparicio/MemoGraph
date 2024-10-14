import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    const can = await super.canActivate(context) as boolean;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Aquí puedes agregar más lógica, como verificar si el usuario está bloqueado
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    return can;
  }
}
