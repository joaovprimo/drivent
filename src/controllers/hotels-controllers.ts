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
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.name === "PaymentError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if(error.name === "BadRequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}

export async function getRoomsbyHotelId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);

  try{
    const rooms = await hotelsService.getRoomsService(userId, hotelId);
    return res.status(httpStatus.OK).send(rooms);
  }catch(error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.name === "PaymentError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if(error.name === "BadRequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}
