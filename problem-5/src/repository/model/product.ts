import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ProductAttributes {
  id: string;
  code: string;
  name: string;
  price?: number;
  quantity?: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  deletedAt?: Date;
}

export type ProductPk = "id";
export type ProductId = Product[ProductPk];
export type ProductOptionalAttributes = "price" | "quantity" | "avatar" | "createdAt" | "updatedAt" | "description" | "deletedAt";
export type ProductCreationAttributes = Optional<ProductAttributes, ProductOptionalAttributes>;

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  id!: string;
  code!: string;
  name!: string;
  price?: number;
  quantity?: number;
  avatar?: string;
  createdAt!: Date;
  updatedAt!: Date;
  description?: string;
  deletedAt?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof Product {
    return sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "Products_code_key"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'Products',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "Products_code_key",
        unique: true,
        fields: [
          { name: "code" },
        ]
      },
      {
        name: "Products_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  }) as typeof Product;
  }
}
