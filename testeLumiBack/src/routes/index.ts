import { Router } from "express";

import { faturaRoutes } from "./fatura.routes";

const router = Router();

router.use("/faturas", faturaRoutes);

export { router };