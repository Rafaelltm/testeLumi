import { Router } from "express";
import multer from "multer";
import { ImportFaturaRest } from "../rest/ImportFaturaRest";
import { GetFaturasFromClienteRest } from "../rest/GetFaturasFromClienteRest";

const faturaRoutes = Router();

const importFaturaRest = new ImportFaturaRest();
const getFaturasFromClienteRest = new GetFaturasFromClienteRest();

const upload = multer({
    dest: "./tmp",
});

faturaRoutes.post(
    "/import",
    upload.single("file"),
    importFaturaRest.handle
);

faturaRoutes.get(
    "/cliente/:numCliente",
    getFaturasFromClienteRest.handle
)

export { faturaRoutes };