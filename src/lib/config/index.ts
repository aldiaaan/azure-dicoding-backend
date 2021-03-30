const config = {
  mssql: {
    host: process.env.MSSQL_HOST ?? "",
    port: parseInt(process.env.MSSQL_PORT ?? ""),
    user: process.env.MSSQL_USER ?? "",
    password: process.env.MSSQL_PASSWORD ?? "",
    database: process.env.MSSQL_DATABASE ?? "",
  },
  azure: {
    storage: {
      connstring: process.env.AZURE_STORAGE_CONNECTION_STRING ?? "",
      containerName: process.env.AZURE_STORAGE_CONTAINER_NAME ?? "",
    },
    search: {
      endpoint: process.env.AZURE_SEARCH_ENDPOINT ?? "",
      adminKey: process.env.AZURE_SEARCH_ADMIN_KEY ?? "",
    },
  },
};

export default config;
