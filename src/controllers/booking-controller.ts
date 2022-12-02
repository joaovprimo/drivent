import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";

export async function getBookingsController(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try{
    const booking = await bookingService.getBookingService(userId);
    return res.status(httpStatus.OK).send(booking);
  }catch(error) {
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
