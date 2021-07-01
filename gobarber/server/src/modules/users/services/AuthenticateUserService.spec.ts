import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUserService.execute({
      email: 'test@email.com',
      name: 'Teste',
      password: '123456789',
    });

    const userAuth = await authenticateUserService.execute({
      email: 'test@email.com',
      password: '123456789',
    });

    expect(userAuth).toHaveProperty('token');
    expect(userAuth.user).toEqual(user);
  });

  it('should be able to authenticate with wrong password', async () => {
    await createUserService.execute({
      email: 'test@email.com',
      name: 'Teste',
      password: '123456789',
    });

    await expect(
      authenticateUserService.execute({
        email: 'test@email.com',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to authenticate with on existing user', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'test@email.com',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
