import { createConnection, Connection } from "typeorm";

import config from "lib/config";
import * as entities from "lib/entities";

export const createDatabaseConnection = (): Promise<Connection> =>
  createConnection({
    type: "mssql",
    host: config.mssql.host,
    port: config.mssql.port,
    username: config.mssql.user,
    password: config.mssql.password,
    database: config.mssql.database,
    entities: Object.values(entities),
    synchronize: true,
  });

export const initializeDatabase = async () => {
  console.log("Connecting to database...");
  await createDatabaseConnection();
  console.log("Database connection established");
};
