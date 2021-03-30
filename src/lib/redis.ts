import * as redis from "redis";
import { Promise } from "bluebird";

export const redisClient = Promise.promisifyAll(
  redis.createClient(6380, "bookcatalog.redis.cache.windows.net", {
    auth_pass: "vUfBaM4FqOoIGrHyduR5Dhy+JF7bEdRozLTSqyUFfPM=",
    tls: { servername: "bookcatalog.redis.cache.windows.net" },
  })
);
