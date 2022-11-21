import eventsService from "@/services/events-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getDefaultEvent(_req: Request, res: Response) {
  try {
    const event = await eventsService.getFirstEvent();
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    if(error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }else if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }else if (error.name === "BadRequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}
