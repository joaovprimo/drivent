import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBookingsController, postBookingController, putBookingController } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBookingsController)
  .post("/", postBookingController)
  .put("/:bookingId", putBookingController);

export { bookingRouter };
