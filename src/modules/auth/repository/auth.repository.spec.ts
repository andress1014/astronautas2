import { AuthRepository } from './auth.repository';
import { Model } from 'mongoose';
import { User } from 'src/models/user/user.schema';

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let userModel: Partial<Record<keyof Model<User>, jest.Mock>>;

  beforeEach(() => {
    userModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    authRepository = new AuthRepository(userModel as unknown as Model<User>);
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const email = 'test@example.com';
      const user = {
        _id: '123',
        email,
        fullName: 'John Doe',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      userModel.findOne!.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await authRepository.findByEmail(email);

      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });

    it('should return null if no user is found', async () => {
      const email = 'notfound@example.com';

      userModel.findOne!.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await authRepository.findByEmail(email);

      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const userData: Partial<User> = {
        email: 'newuser@example.com',
        fullName: 'Test User',
        password: 'hashedPassword',
      };

      const createdUser = {
        ...userData,
        _id: 'abc123',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      userModel.create!.mockResolvedValue(createdUser);

      const result = await authRepository.createUser(userData);

      expect(userModel.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(createdUser);
    });
  });
});
