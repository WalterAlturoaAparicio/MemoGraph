import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller'; // Asegúrate de que la ruta sea correcta
import { AuthService } from './auth.service'; // Asegúrate de que la ruta sea correcta
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should log in a user and return a JWT', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = { id: 1, email }; // Ajusta según tu modelo User
      const jwtToken = 'jwtToken'; // Simulamos el token JWT

      // Configurar los mocks
      authService.validateUser = jest.fn().mockResolvedValue(user);
      authService.login = jest.fn().mockResolvedValue(jwtToken);

      const result = await authController.login({ email, password });

      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.login).toHaveBeenCalledWith(user);
      expect(result).toBe(jwtToken); // Verifica que el resultado sea el token JWT
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';

      // Configurar el mock para validar un usuario que no existe
      authService.validateUser = jest.fn().mockResolvedValue(null);

      await expect(authController.login({ email, password })).rejects.toThrow(
        UnauthorizedException,
      );

      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
    });
  });
});
