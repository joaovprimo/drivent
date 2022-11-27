import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try{
    const hotels = await hotelsService.getHotelsService(userId);
    return res.status(httpStatus.OK).send(hotels);
  }catch(error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    else if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    else if(error.name === "PaymentError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    else{
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}
