import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IUser from '../entities/IUser';

interface IUsersRepository {
  findById(id: string): Promise<IUser | undefined>;
  findByEmail(email: string): Promise<IUser | undefined>;
  create(data: ICreateUserDTO): Promise<IUser>;
  save(data: IUser): Promise<IUser>;
}

export default IUsersRepository;
