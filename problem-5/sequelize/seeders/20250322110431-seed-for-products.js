'use strict';

import { v7 } from "uuid";
/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface) {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
  */
  await queryInterface.bulkInsert('Products', [
    {
      id: v7(),
      name: 'Product 1',
      code: 'P001',
      price: 1000,
      quantity: 10,
      avatar: 'https://via.placeholder.com/150',
      description: 'Description for product 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: v7(),
      name: 'Product 2',
      code: 'P002',
      price: 2000,
      quantity: 20,
      avatar: 'https://via.placeholder.com/150',
      description: 'Description for product 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: v7(),
      name: 'Product 3',
      code: 'P003',
      price: 3000,
      quantity: 30,
      avatar: 'https://via.placeholder.com/150',
      description: 'Description for product 3',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: v7(),
      name: 'Product 4',
      code: 'P004',
      price: 4000,
      quantity: 40,
      avatar: 'https://via.placeholder.com/150',
      description: 'Description for product 4',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: v7(),
      name: 'Product 5',
      code: 'P005',
      price: 5000,
      quantity: 50,
      avatar: 'https://via.placeholder.com/150',
      description: 'Description for product 5',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // I want to add 100 products, so I will use a loop
    ...Array.from({ length: 100 }, (_, index) => ({
      id: v7(),
      name: `Product ${index + 6}`,
      code: `P00${index + 6}`,
      price: (index + 6) * 1000,
      quantity: (index + 6) * 10,
      avatar: 'https://via.placeholder.com/150',
      description: `Description for product ${index + 6}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  ]);
}

export async function down(queryInterface) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
  await queryInterface.bulkDelete('Products', null, {});
}

