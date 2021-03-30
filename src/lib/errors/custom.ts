export class SafeForClientError extends Error {
  constructor(
    public status: number = 500,
    public message: string = "Something went wrong when processing your request.",
    public name: string = "INTERNAL_ERROR",
    public data: { [key: string]: any } = {}
  ) {
    super();
  }
}

export class NotFoundError extends SafeForClientError {
  constructor() {
    super(404, "Invalid API entrypoint", "ROUTE_NOT_FOUND");
  }
}

export class EntityNotFoundError extends SafeForClientError {
  constructor(entityName: string) {
    super(404, `${entityName} not found`, "ENTITY_NOT_FOUND");
  }
}

export class BadRequestError extends SafeForClientError {
  constructor(data: { [key: string]: any } = {}) {
    super(400, "There were validation errors", "BAD_REQUEST", data);
  }
}
