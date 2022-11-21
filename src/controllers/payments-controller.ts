import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import paymentsService from "@/services/payments-service";

export async function getPayments(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId } = req.query;

  const ticket = Number(ticketId);

  try{
    const payments = await paymentsService.getPaymentsByTicketId(userId, ticket);
    return  res.status(httpStatus.OK).send(payments);
  }catch(err) {
    if(err.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }else if(err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }else if (err.name === "BadRequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}

export async function postPayments(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId } = req.body;
  const { cardData } = req.body;

  const ticket = Number(ticketId);
  //issuer, number, name, expirationDate, cvv
  try{
    const payment = await paymentsService.postPayment(userId, ticket, cardData);
    return res.status(httpStatus.CREATED).send(payment);
  }catch(err) {
    if(err.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }else if(err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }else if (err.name === "BadRequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}
