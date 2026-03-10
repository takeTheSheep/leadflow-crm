export class AppError extends Error {
  public statusCode: number;
  public expose: boolean;

  constructor(message: string, statusCode = 400, expose = true) {
    super(message);
    this.statusCode = statusCode;
    this.expose = expose;
  }
}

export function toSafeError(error: unknown, fallback = "Unexpected server error") {
  if (error instanceof AppError) {
    return {
      message: error.expose ? error.message : fallback,
      statusCode: error.statusCode,
    };
  }

  return {
    message: fallback,
    statusCode: 500,
  };
}

