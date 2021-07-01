import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const customer_exist = await this.customersRepository.findByEmail(email);

    if (customer_exist) throw new AppError('E-mail já está cadastrado');

    const customer = await this.customersRepository.create({
      email,
      name,
    });

    return customer;
  }
}

export default CreateCustomerService;
