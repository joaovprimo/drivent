import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { postPayments, getPayments } from "@/controllers";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPayments)
  .post("/process", postPayments);

export { paymentsRouter };
