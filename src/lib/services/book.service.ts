import FileType from "file-type";
import { v4 as uuidv4 } from "uuid";
import { FindOneOptions } from "typeorm";

import { containerClient } from "lib/azure-storage";
import { bookSearchClient } from "lib/azure-search";
import { Book as BookEntity, Review, Review as ReviewEntity } from "lib/entities";
import { BadRequestError, EntityNotFoundError } from "lib/errors";
import { redisClient } from "lib/redis";

export interface PaginationResult {
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginationOptions {
  limit: number;
  page: number;
}

const ALLOWED_COVER_SIZE = 5242880;
const ALLOWED_COVER_MIMETYPES = ["image/jpeg", "image/png", "image/web"];

export const findBookOrThrow = async (id: number, options?: FindOneOptions<BookEntity>): Promise<BookEntity> => {
  // @ts-ignore
  const cache = await redisClient.getAsync(`book:${id}`);

  if (!cache) {
    const book = await BookEntity.findOne(id, options);
    if (!book) throw new EntityNotFoundError("book");

    redisClient.set(`book:${id}`, JSON.stringify(book));
    return book;
  }

  return JSON.parse(cache);
  // const book = await BookEntity.findOne(id, options);
  // if (!book) throw new EntityNotFoundError("book");

  // return book;
};

export const getReviews = async (
  id: number,
  paginationOptions: PaginationOptions
): Promise<{ reviews: ReviewEntity[] } & PaginationResult> => {
  console.log(paginationOptions);

  const reviewsQuery = ReviewEntity.createQueryBuilder("review")
    .where(`review.bookId = :id`, { id })
    .skip((paginationOptions.page - 1) * paginationOptions.limit)
    .take(paginationOptions.limit)
    .getMany();

  const reviewsCountQuery = ReviewEntity.createQueryBuilder("review").where(`review.bookId = :id`, { id }).getCount();

  const [reviews, reviewsCount] = await Promise.all([reviewsQuery, reviewsCountQuery]);

  return {
    reviews,
    total: reviewsCount,
    totalPages: Math.ceil(reviewsCount / paginationOptions.limit),
    currentPage: paginationOptions.page,
  };
};

export const uploadCover = async (cover: Express.Multer.File): Promise<string | undefined> => {
  let coverURL;

  if (cover) {
    const { originalname, buffer, size } = cover;

    const fileInfo = await FileType.fromBuffer(buffer);

    if (size > ALLOWED_COVER_SIZE) throw new BadRequestError();

    if (!ALLOWED_COVER_MIMETYPES.includes(fileInfo?.mime || "")) throw new BadRequestError();

    const finalName = `${uuidv4()}-${originalname.split(".")[0]}.${fileInfo?.ext}`;

    const blockBlobClient = containerClient.getBlockBlobClient(finalName);

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: fileInfo?.mime },
    });

    coverURL = blockBlobClient.url;
  }

  return coverURL;
};

export const create = async (book: Partial<BookEntity>): Promise<BookEntity> => {
  return await BookEntity.create(book).save();
};

export const getBooks = async (
  paginationOptions: PaginationOptions
): Promise<PaginationResult & { books: BookEntity[] }> => {
  const booksQuery = BookEntity.find({
    take: paginationOptions.limit,
    skip: (paginationOptions.page - 1) * paginationOptions.limit,
  });

  const booksCount = BookEntity.count();

  const [books, count] = await Promise.all([booksQuery, booksCount]);

  return {
    total: count,
    totalPages: Math.ceil(count / paginationOptions.limit),
    currentPage: paginationOptions.page,
    books,
  };
};

export const update = async (id: number, book: Partial<BookEntity>): Promise<BookEntity> => {
  const updatedBook = await findBookOrThrow(id);

  Object.assign(updatedBook, book);

  await updatedBook.save();

  return updatedBook;
};

export const remove = async (id: number): Promise<boolean> => {
  const book = await findBookOrThrow(id);

  await book.remove();

  return true;
};

export const search = async (query: string): Promise<any> => {
  const searchResults = await bookSearchClient.search(query);

  return searchResults.results;
};
