import config from "lib/config";
import { BlobServiceClient } from "@azure/storage-blob";

export const blobServiceClient = BlobServiceClient.fromConnectionString(
  config.azure.storage.connstring
);
export const containerClient = blobServiceClient.getContainerClient(
  config.azure.storage.containerName
);
