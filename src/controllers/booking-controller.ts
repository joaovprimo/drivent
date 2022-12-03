import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";
import { number } from "joi";

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
  }
}

export async function postBookingController(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try{
    const postingBooking = await bookingService.postBookingService(userId, roomId);
    return res.status(httpStatus.OK).send({ bookingId: postingBooking.id }); 
  }catch(error) {
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.name === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if(error.name === "BadRequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if(error.name === "PaymentError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
  }
}

export async function putBookingController(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const  bookingId2  = req.params.bookingId;
  const bookingId = Number(bookingId2);

  try{
    const updatedBooking = await bookingService.updatingBooking(userId, roomId, bookingId);
    return res.status(httpStatus.OK).send({ bookingId: updatedBooking.id });
  }catch(error) {
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.name === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if(error.name === "BadRequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if(error.name === "PaymentError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
  }
}
