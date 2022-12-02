import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBookingsController } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBookingsController);

export { bookingRouter };
