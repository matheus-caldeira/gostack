import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create({
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ email, name, password });

    await this.ormRepository.save(user);

    return user;
  }

  public async save(data: User): Promise<User> {
    return this.ormRepository.save(data);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }
}

export default UsersRepository;
