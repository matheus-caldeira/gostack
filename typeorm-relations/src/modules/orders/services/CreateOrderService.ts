import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) throw new AppError('Customer not found');

    const products_info = await this.productsRepository.findAllById(products);

    const products_quantity: IProduct[] = [];

    if (!products_info.length) throw new AppError('Produtos não localizados');

    const products_order = products_info.map(product => {
      const product_order = products.find(({ id }) => id === product.id);

      if (
        !product_order ||
        product_order.quantity <= 0 ||
        product_order.quantity > product.quantity
      )
        throw new AppError('Um ou mais itens não tem em estoque');

      products_quantity.push({
        id: product.id,
        quantity: product.quantity - (product_order?.quantity || 0),
      });

      return {
        product_id: product.id,
        quantity: product_order.quantity,
        price: product.price,
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: products_order,
    });

    await this.productsRepository.updateQuantity(products_quantity);

    return order;
  }
}

export default CreateOrderService;
