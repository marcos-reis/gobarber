import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppErrors';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const response = await createUser.execute({
      email: 'jonhdoe@dominio.com',
      name: 'Jonh Doe',
      password: '123123',
    });

    expect(response).toHaveProperty('id');
  });

  it('should be able to create a new user with email already used', async () => {
    await createUser.execute({
      email: 'jonhdoe@dominio.com',
      name: 'Jonh Doe',
      password: '123123',
    });

    await expect(
      createUser.execute({
        email: 'jonhdoe@dominio.com',
        name: 'Jonh Doe',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
