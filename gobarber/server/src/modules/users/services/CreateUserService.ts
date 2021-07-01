import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IUser from '../entities/IUser';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

type IResponse = Partial<IUser>;

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    email,
    password,
  }: IRequest): Promise<IResponse> {
    const checkUser = await this.usersRepository.findByEmail(email);

    if (checkUser) throw new AppError('Email address already used');

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const userResponse: IResponse = { ...user };

    delete userResponse.password;

    return userResponse;
  }
}

export default CreateUserService;
