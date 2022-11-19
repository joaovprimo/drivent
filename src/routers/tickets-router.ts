import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes, postTicket } from "@/controllers";
//getTicket, 
const ticketsRouter = Router();

ticketsRouter
//.all("/*", authenticateToken)
  .get("/types", authenticateToken, getTicketTypes)
//.get("/", getTicket)
  .post("/", authenticateToken, postTicket);

export { ticketsRouter };
