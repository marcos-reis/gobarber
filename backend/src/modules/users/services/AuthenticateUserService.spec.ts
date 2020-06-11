import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import AppError from '@shared/errors/AppErrors';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to create a new session', async () => {
    const user = await createUser.execute({
      email: 'jonhdoe@dominio.com',
      name: 'Jonh Doe',
      password: '123123',
    });
    const response = await authenticateUser.execute({
      email: 'jonhdoe@dominio.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to create a new session', async () => {
    await createUser.execute({
      email: 'jonhdoe@dominio.com',
      name: 'Jonh Doe',
      password: '123123',
    });

    await expect(
      authenticateUser.execute({
        email: 'jonhdoe@dominio.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new session to user non-existent', async () => {
    await expect(
      authenticateUser.execute({
        email: 'jonhdoe@dominio.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
