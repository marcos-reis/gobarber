import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppErrors';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;

let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });
  it('should be able to update avatar user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      avatarFilename: 'avatar.png',
      user_id: user.id,
    });

    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update avatar no-existents-user', async () => {
    await expect(
      updateUserAvatar.execute({
        avatarFilename: 'avatar.png',
        user_id: 'non-existent-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update avatar user that already a avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
    });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    await updateUserAvatar.execute({
      avatarFilename: 'avatar.png',
      user_id: user.id,
    });

    await updateUserAvatar.execute({
      avatarFilename: 'avatar2.png',
      user_id: user.id,
    });
    expect(user.avatar).toBe('avatar2.png');
    expect(deleteFile).toBeCalledWith('avatar.png');
  });
});
