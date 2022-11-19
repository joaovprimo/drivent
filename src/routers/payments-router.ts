/*import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { postPayments, getPayments } from "@/controllers";

const paymentsRouter = Router();

paymentsRouter
.all("/*", authenticateToken)
.get("/ticketId", getPayments)
.post("/process", postPayments)

export { paymentsRouter };*/
