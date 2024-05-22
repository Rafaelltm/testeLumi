import { Request, Response } from "express";
import { container } from "tsyringe";

import { ImportFaturaService } from "../services/ImportFaturaService";
import { RestError } from "../error/RestError";

export class ImportFaturaRest {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { file } = request;

      const importFaturaService = container.resolve(ImportFaturaService);

      await importFaturaService.execute(file);

      return response.status(200).send();
    } catch (err) {
      if (err instanceof RestError) {
        return response.status(err.statusCode).json({ error: err.message });
      }
      return response.status(500).json({ error: err });
    }
  }
}
