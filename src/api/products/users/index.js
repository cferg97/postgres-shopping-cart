import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import usersModel from "./model.js";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.name) {
      query.firstName = { [Op.iLike]: `${req.query.name}%` };
    }
    const users = await usersModel.findAll({
      where: { ...query },
    });
    res.send(users);
  } catch (err) {
    next(err);
  }
});

usersRouter.get("/:userid", async (req, res, next) => {
  try {
    const user = await usersModel.findByPk(req.params.userid, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `User with ID ${req.params.userid} not found.`)
      );
    }
  } catch (err) {
    next(err);
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const { userId } = await usersModel.create(req.body);
    res.status(201).send({ id: userId });
  } catch (err) {
    next(err);
  }
});

usersRouter.put("/:userid", async (req, res, next) => {
  try {
    const [updatedRows, updatedRecords] = await usersModel.update(req.body, {
      where: { userId: req.params.userid },
      returning: true,
    });
    if (updatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(404, `User with ID ${req.params.userid} not found.`)
      );
    }
  } catch (err) {
    next(err);
  }
});

usersRouter.delete("/:userid", async (req, res, next) => {
  try {
    const deletedRows = await usersModel.destroy({
      where: { userId: req.params.userid },
    });
    if (deletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with ID ${req.params.userid} not found.`)
      );
    }
  } catch (err) {
    next(err);
  }
});

export default usersRouter;
