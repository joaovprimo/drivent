import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes } from "@/controllers";
//getTicket, postTicket
const ticketsRouter = Router();

ticketsRouter
//.all("/*", authenticateToken)
  .get("/types", authenticateToken, getTicketTypes);
//.get("/", getTicket)
//.post("/", postTicket)

export { ticketsRouter };
