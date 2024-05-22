import { Router } from "express";
import { GetClientesRest } from "../rest/GetClientesRest";

const clienteRoutes = Router();

const getClientesRest = new GetClientesRest();

clienteRoutes.get(
  "/all",
  getClientesRest.handle
);

export { clienteRoutes };