import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller'; // Asegúrate de que la ruta sea correcta
import { UserService } from './user.service'; // Asegúrate de que la ruta sea correcta

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            findById: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const createdUser = { id: 1, email }; // Ajusta según tu modelo de usuario

      userService.createUser = jest.fn().mockResolvedValue(createdUser);

      const result = await userController.register({ email, password });

      expect(userService.createUser).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(createdUser);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const user = { id: userId, email: 'test@example.com' }; // Ajusta según tu modelo de usuario

      userService.findById = jest.fn().mockResolvedValue(user);

      const result = await userController.getUserById(userId);

      expect(userService.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });
  });

  describe('logout', () => {
    it('should log out the user', async () => {
      const req = { user: { id: 1 } } as any; // Simulamos la solicitud
      userService.logout = jest.fn().mockResolvedValue(undefined);

      await userController.logout(req);

      expect(userService.logout).toHaveBeenCalledWith(req.user.id);
    });
  });
});
