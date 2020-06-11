import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppErrors';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;

let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });
  it('should be able to show profile user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const showUser = await showProfile.execute(user.id);

    expect(showUser.name).toBe('John Doe');
  });
  it('should not be able to show profile user', async () => {
    expect(showProfile.execute('user-inexistent')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
