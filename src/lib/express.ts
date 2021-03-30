import { Express } from "express";

import express from "express";
import cors from "cors";

import { routes, errorHandler } from "lib/api";
import { NotFoundError } from "lib/errors";

export const initializeExpress = async (app: Express): Promise<void> => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(routes);

  app.use((_req, _res, next) => next(new NotFoundError()));

  app.use(errorHandler);
};
