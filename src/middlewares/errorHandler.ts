import type { NextFunction, Request, Response } from "express";

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
   if (err instanceof BadRequestError){
    res.status(400).send(err.message);
  } else if (err instanceof UnauthorizedError){
    res.status(401).send(err.message);
  } else if (err instanceof ForbiddenError){
    res.status(403).send(err.message);
  } else if (err instanceof NotFoundError) {
    res.status(404).send(err.message);
  } else {
    res.status(500).send("Internal Server Error");
  }
}