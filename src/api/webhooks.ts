import type { Request, Response } from "express";
import { upgradeToChirpyRed } from "../db/queries/users.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./errors.js";
import { getAPIKey } from "../utils/auth.js";
import { config } from "../config.js";

type RequestData = {
  "event": string,
  "data": {
    "userId": string
  }
}

export async function polkaWebhookHandler(req: Request, res: Response) {
  const apiKey = getAPIKey(req);

  if(config.api.polkaKey !== apiKey) {
    throw new UnauthorizedError("Invalid Key");
  }

  const {event, data}: RequestData = req.body;
  if (!event) {
    throw new BadRequestError("Missing event param");
  }

  if (!data) {
    throw new BadRequestError("Missing data param");
  }

  const {userId} = data;

  if (!userId) {
    throw new BadRequestError("Missing user id");
  }

  if(event !== "user.upgraded") {
    return res.status(204).send();
  }

  const user = await upgradeToChirpyRed(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return res.status(204).send();
}