import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/ticket-service";
import httpStatus from "http-status";

/*export async function getTicket() {
    
}*/

export async function getTicketTypes(req: Request, res: Response) {
  try{
    const ticketsTypes = await ticketsService.getTicketTypesServices(); 
    return res.status(httpStatus.OK).send(ticketsTypes);
  }catch(err) {
    return res.status(401).send(err.message);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body;
  const { userId } = req;

  try{
    if(!ticketTypeId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    const ticket = await ticketsService.postTicketServices(ticketTypeId, userId);
    return res.status(httpStatus.CREATED).send(ticket);
  }catch(err) {
    if(err.name === "InvalidDataError" ) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }else if(err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}
