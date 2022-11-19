import { Request, Response } from "express";
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

/*export async function postTicket() {
    
}*/
