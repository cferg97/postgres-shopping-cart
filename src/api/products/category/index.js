import express from "express";
import categoriesModel from "./model.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/", async (req, res, next) => {
  try {
    const { categoryId } = await categoriesModel.create(req.body);
    res.status(201).send({ id: categoryId });
  } catch (err) {
    next(err);
  }
});

categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await categoriesModel.findAll();
    res.send(categories);
  } catch (err) {
    next(err);
  }
});

export default categoriesRouter;
