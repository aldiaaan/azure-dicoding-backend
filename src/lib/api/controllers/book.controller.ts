import * as express from "express";
import joi from "joi";

import * as bookService from "lib/services/book.service";
import * as reviewService from "lib/services/review.service";
import { PaginationOptions } from "lib/services";
import { BadRequestError } from "lib/errors";

const checkIDValidity = async (id: number) => {
  const schema = joi.object({
    id: joi.number().positive(),
  });

  await schema.validateAsync({ id }).catch((err) => {
    throw new BadRequestError(err);
  });

  return true;
};

const checkPaginationQueryOrThrow = async ({ limit, page }: PaginationOptions) => {
  const schema = joi.object({
    limit: joi.number().positive(),
    page: joi.number().positive(),
  });

  await schema.validateAsync({ limit, page }).catch((err) => {
    console.log(err);
    throw new BadRequestError(err);
  });
};

export const index = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const paginationQuery = {
      limit: parseInt(req.query.limit as string) || 25,
      page: parseInt(req.query.page as string) || 1,
    };

    await checkPaginationQueryOrThrow({ limit: paginationQuery.limit, page: paginationQuery.page });

    res.json(await bookService.getBooks({ limit: paginationQuery.limit, page: paginationQuery.page }));
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    await checkIDValidity(id);

    const paginationQuery = {
      limit: parseInt(req.query.limit as string) || 25,
      page: parseInt(req.query.page as string) || 1,
    };

    await checkPaginationQueryOrThrow({ limit: paginationQuery.limit, page: paginationQuery.page });

    res.json(await bookService.getReviews(id, { limit: paginationQuery.limit, page: paginationQuery.page }));
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    const schema = joi.object({
      id: joi.number(),
      rating: joi.number().min(0).max(5),
    });

    await schema.validateAsync({ id, rating: parseInt(req.body.rating) }).catch((err) => {
      throw new BadRequestError(err);
    });

    const book = await bookService.findBookOrThrow(id);

    const review = await reviewService.add({ ...req.body, book });

    res.json({ review });
  } catch (error) {
    next(error);
  }
};

export const patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const cover = req.file;

    const schema = joi.object({
      id: joi.number().positive(),
    });

    await schema.validateAsync({ id }).catch((err) => {
      console.log(err);
      throw new BadRequestError(err);
    });

    const coverURL = await bookService.uploadCover(cover);

    const updatedBook = await bookService.update(id, { ...req.body, coverURL });

    res.json({ book: updatedBook });
  } catch (error) {
    next(error);
  }
};

export const find = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    await checkIDValidity(id);

    const book = await bookService.findBookOrThrow(id, { relations: ["reviews"] });

    res.json(book);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    await checkIDValidity(id);

    await bookService.remove(id);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const search = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { query } = req.query;

    const books = [];

    const results = await bookService.search(query as string);

    for await (const book of results) {
      books.push(book);
    }

    res.json({ books });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { title, author, synopsis, releaseYear } = req.body;

    console.log(releaseYear);

    const schema = joi.object({
      releaseYear: joi.number().positive(),
    });

    await schema.validateAsync({ releaseYear }).catch((err) => {
      throw new BadRequestError(err);
    });

    const coverURL = await bookService.uploadCover(req.file);

    const book = await bookService.create({ title, author, synopsis, releaseYear: parseInt(releaseYear), coverURL });

    res.json({ book });
  } catch (error) {
    next(error);
  }
};
