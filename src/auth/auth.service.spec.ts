import { AuthService } from './auth.service'; // Asegúrate de que la ruta sea correcta
import { UserService } from '../user/user.service'; // Asegúrate de que la ruta sea correcta
import { JwtService } from '@nestjs/jwt'; // Asegúrate de que la ruta sea correcta
import { User } from '../user/user.entity'; // Asegúrate de que la ruta sea correcta

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(() => {
    // Crear mocks para UserService y JwtService
    userService = {
      logout: jest.fn(),
      updateJwtToken: jest.fn(),
    } as any;

    jwtService = {
      sign: jest.fn(),
    } as any;

    authService = new AuthService(userService, jwtService);
  });

  describe('login', () => {
    it('should log out previous session and generate a new JWT', async () => {
      const user: User = {
        id: 1, email: 'test@example.com', jwtToken: 'oldToken',
        password: '',
        otpCode: '',
        isOtpVerified: false,
        createdAt: undefined,
        isActive: false
      }; // Ajusta según tu modelo User
      const newToken = 'newJwtToken';

      // Configurar los mocks
      userService.logout = jest.fn().mockResolvedValue(undefined);
      jwtService.sign = jest.fn().mockReturnValue(newToken);
      userService.updateJwtToken = jest.fn().mockResolvedValue(undefined);

      // Ejecutar el método login
      const result = await authService.login(user);

      // Afirmaciones
      expect(userService.logout).toHaveBeenCalledWith(user.id); // Verifica que se llamó a logout
      expect(jwtService.sign).toHaveBeenCalledWith({ email: user.email, sub: user.id }, { expiresIn: '1y' }); // Verifica que se generó el token
      expect(userService.updateJwtToken).toHaveBeenCalledWith(user.id, newToken); // Verifica que se actualizó el token en el UserService
      expect(result).toBe(newToken); // Verifica que el resultado sea el nuevo token
    });

    it('should generate a JWT without logging out if no jwtToken is provided', async () => {
      const user: User = {
        id: 1, email: 'test@example.com', jwtToken: undefined,
        password: '',
        otpCode: '',
        isOtpVerified: false,
        createdAt: undefined,
        isActive: false
      }; // Ajusta según tu modelo User
      const newToken = 'newJwtToken';

      // Configurar los mocks
      userService.logout = jest.fn(); // No debe ser llamado
      jwtService.sign = jest.fn().mockReturnValue(newToken);
      userService.updateJwtToken = jest.fn().mockResolvedValue(undefined);

      // Ejecutar el método login
      const result = await authService.login(user);

      // Afirmaciones
      expect(userService.logout).not.toHaveBeenCalled(); // Verifica que logout no se llamó
      expect(jwtService.sign).toHaveBeenCalledWith({ email: user.email, sub: user.id }, { expiresIn: '1y' }); // Verifica que se generó el token
      expect(userService.updateJwtToken).toHaveBeenCalledWith(user.id, newToken); // Verifica que se actualizó el token en el UserService
      expect(result).toBe(newToken); // Verifica que el resultado sea el nuevo token
    });
  });
});
