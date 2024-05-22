import { Router } from "express";

import { faturaRoutes } from "./fatura.routes";
import { clienteRoutes } from "./cliente.routes";

const router = Router();

router.use("/faturas", faturaRoutes);
router.use("/clientes", clienteRoutes);

export { router };