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
    try{
        const product = await productsModel.findByPk(req.params.productid, {
            attributes: {exclude: ["createdAt", "updatedAt"]}
        })
        if(product){
            
        }
    }
})

productsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await productsModel.create(req.body);
    res.status(201).send({ id });
  } catch (err) {
    next(err);
  }
});

export default productsRouter;
