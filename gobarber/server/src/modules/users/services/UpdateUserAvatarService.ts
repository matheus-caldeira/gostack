import path from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';

import AppError from '@shared//errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUser from '../entities/IUser';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

type IResponse = Partial<IUser>;

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,

    @inject('StorageProvider') private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    avatarFilename,
    user_id,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(user_id);

    if (!user)
      throw new AppError('Only authenticated users can change avatar', 401);

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = fileName;

    await this.usersRepository.save(user);

    const userWithoutPassword: IResponse = { ...user };

    delete userWithoutPassword.password;

    return user;
  }
}

export default UpdateUserAvatarService;
