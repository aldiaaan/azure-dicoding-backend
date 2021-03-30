import { Router } from "express";

import * as books from "lib/api/controllers/book.controller";
import multer from "multer";

const routes = Router();
const upload = multer();

routes.get("/api/books/search", books.search);
routes.get("/api/books", books.index);

// routes.get("/api/book/search", books.search);
routes.post("/api/book/create", upload.single("cover"), books.create);
routes.patch("/api/book/:id/patch", upload.single("cover"), books.patch);
routes.delete("/api/book/:id/delete", books.remove);
routes.get("/api/book/:id", books.find);
routes.get("/api/book/:id/reviews", books.getReviews);
routes.post("/api/book/:id/review", books.addReview);

export { routes };
