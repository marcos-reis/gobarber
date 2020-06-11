import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import AppError from '@shared/errors/AppErrors';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;

let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to reset a password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@dominio.com',
      name: 'John Doe',
      password: '123456',
    });
    const { token } = await fakeUserTokensRepository.generate(user.id);
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    await resetPassword.execute({
      token,
      password: '123123',
    });
    const updatedUser = await fakeUsersRepository.findById(user.id);
    expect(updatedUser?.password).toBe('123123');
    expect(generateHash).toBeCalledWith('123123');
  });
  it('should not be able to reset the password with non-existent token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existent-token',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to reset the password with non-existent user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existent-user',
    );
    await expect(
      resetPassword.execute({
        token,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to reset the password passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@dominio.com',
      name: 'John Doe',
      password: '123456',
    });
    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        token,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
