import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class AddRelation1624728380985 implements MigrationInterface {
  name: 'AddRelation1624728380985';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        name: 'OrdersCustomer',
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKeys('orders_products', [
      new TableForeignKey({
        name: 'OrdersProductsOrder',
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        name: 'OrdersProductsProduct',
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'SET NULL',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('orders', 'OrdersCustomer');
    await queryRunner.dropForeignKey('orders_products', 'OrdersProductsOrder');
    await queryRunner.dropForeignKey(
      'orders_products',
      'OrdersProductsProduct',
    );
  }
}
