import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBookingsController, postBookingController } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBookingsController)
  .post("/", postBookingController);

export { bookingRouter };
