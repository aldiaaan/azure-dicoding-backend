import { Request, Response, NextFunction } from "express";
import { pick } from "lodash";

import { SafeForClientError } from "lib/errors";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  const isErrorSafeForClient = err instanceof SafeForClientError;

  const clientError = isErrorSafeForClient
    ? pick(err, ["message", "name", "status", "data"])
    : {
        message: "Something went wrong when processing your request, please try again later",
        name: "INTERNAL_ERROR",
        status: 500,
        data: {},
      };

  res.status(clientError.status).send({ error: clientError });
};
