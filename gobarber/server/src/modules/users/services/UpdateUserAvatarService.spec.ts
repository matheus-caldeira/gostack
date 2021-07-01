import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update avatar from new user', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test@email.com',
      name: 'Teste',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'teste.jpg',
    });
    expect(user.avatar).toEqual('teste.jpg');
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      email: 'test@email.com',
      name: 'Teste',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'teste1.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'teste2.jpg',
    });

    const userUpdate = await fakeUsersRepository.findById(user.id);

    expect(deleteFile).toHaveBeenCalledWith('teste1.jpg');
    expect(userUpdate?.avatar).toEqual('teste2.jpg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: '123as41d5a68a9a56',
        avatarFilename: 'teste.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
