import { Router } from "express";
import { getDefaultEvent } from "@/controllers";

const ticketsRouter = Router();

ticketsRouter.get("/", getDefaultEvent );

export { ticketsRouter };
