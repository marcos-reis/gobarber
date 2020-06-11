import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
// import AppError from '@shared/errors/AppErrors';
import FaKeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppErrors';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FaKeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FaKeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover password using email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@dominio.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({ email: 'jonhdoe@dominio.com' });

    expect(sendMail).toBeCalled();
  });

  it('should not be able to recover password using email nonexistent', async () => {
    await expect(
      sendForgotPasswordEmail.execute({ email: 'jonhdoe@dominio.com' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should  generate token a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@dominio.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({ email: 'jonhdoe@dominio.com' });

    expect(generateToken).toBeCalledWith(user.id);
  });
});
