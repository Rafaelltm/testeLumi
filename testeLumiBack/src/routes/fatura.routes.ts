import { Router } from "express";
import multer from "multer";
import { ImportFaturaRest } from "../rest/ImportFaturaRest";

const faturaRoutes = Router();

const importFaturaRest = new ImportFaturaRest();

const upload = multer({
    dest: "./tmp",
});

faturaRoutes.post(
    "/import",
    upload.single("file"),
    importFaturaRest.handle
);

export { faturaRoutes };