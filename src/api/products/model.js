import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import categoriesModel from "./category/model.js";
import productsCategoriesModel from "./productsCategoryModel.js";

const productsModel = sequelize.define("product", {
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 1),
    allowNull: false,
  },
  // category: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

productsModel.belongsToMany(categoriesModel, {
  through: productsCategoriesModel,
  foreignKey: { name: "productId", allowNull: false },
});

categoriesModel.belongsToMany(productsModel, {
  through: productsCategoriesModel,
  foreignKey: { name: "categoryId", allowNull: false },
});

export default productsModel;
