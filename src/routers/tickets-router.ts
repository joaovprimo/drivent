import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes, postTicket, getTicket } from "@/controllers";
 
const ticketsRouter = Router();

ticketsRouter
//.all("/*", authenticateToken)
  .get("/types", authenticateToken, getTicketTypes)
  .get("/", authenticateToken, getTicket)
  .post("/", authenticateToken, postTicket);

export { ticketsRouter };
