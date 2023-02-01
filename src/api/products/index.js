import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import productsModel from "./model.js";

const productsRouter = express.Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.name) {
      query.name = { [Op.iLike]: `${req.query.name}` };
    }
    if (req.query.category) {
      query.category = { [Op.iLike]: `${req.query.category}` };
    }
    if (req.query.price) {
      query.price = { [Op.gte]: `${req.query.price}` };
    }
    if (req.query.priceMin && req.query.priceMax) {
      query.price = {
        [Op.between]: [
          `${parseFloat(req.query.priceMin).toFixed(2)}`,
          `${parseFloat(req.query.priceMax).toFixed(2)}`,
        ],
      };
    }

    const products = await productsModel.findAll({
      where: { ...query },
      attributes: ["id", "name", "brand", "price", "imageUrl"],
    });
    res.send(products);
  } catch (err) {
    next(err);
  }
});

productsRouter.get("/:productid", async (req, res, next) => {
  try {
    const product = await productsModel.findByPk(req.params.productid, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product not found with ID ${req.params.productid}`
        )
      );
    }
  } catch (err) {
    next(err);
  }
});

productsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await productsModel.create(req.body);
    res.status(201).send({ id });
  } catch (err) {
    next(err);
  }
});

productsRouter.put("/:productid", async (req, res, next) => {
  try {
    const [updatedRows, updatedRecords] = await productsModel.update(req.body, {
      where: { id: req.params.productid },
      returning: true,
    });
    if (updatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(
          404,
          `Product with ID ${req.params.productid} not found`
        )
      );
    }
  } catch (err) {
    next(err);
  }
});

productsRouter.delete("/:productid", async (req, res, next) => {
  try {
    const deletedRows = await productsModel.destroy({
      where: { id: req.params.productid },
    });
    if (deletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with ID ${req.params.productid} not found`
        )
      );
    }
  } catch (err) {
    next(err);
  }
});

export default productsRouter;
