import { Router } from "express";
import { getDefaultEvent } from "@/controllers";

const paymentsRouter = Router();

paymentsRouter.get("/", getDefaultEvent );

export { paymentsRouter };
