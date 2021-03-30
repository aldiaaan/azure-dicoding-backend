import config from "lib/config";

import { SearchClient, AzureKeyCredential } from "@azure/search-documents";

export const bookSearchClient = new SearchClient(
  config.azure.search.endpoint,
  "azuresql-index",
  new AzureKeyCredential(config.azure.search.adminKey)
);
