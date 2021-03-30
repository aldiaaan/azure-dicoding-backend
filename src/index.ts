import "module-alias/register";
import "dotenv/config";
import "reflect-metadata";

import express from "express";

import { initializeExpress } from "lib/express";
import { initializeDatabase } from "lib/database";

async function start() {
  const app = express();

  await initializeExpress(app);
  await initializeDatabase();

  app.listen(process.env.PORT || 5000, () => {
    console.log("App started!");
  });
}

start();
