import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetClientesService } from "../services/GetClientesService";
import { RestError } from "../error/RestError";

export class GetClientesRest {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const getClientesService = container.resolve(GetClientesService);

      const res = await getClientesService.execute();

      return response.status(200).json(res);
    } catch (err) {
      if (err instanceof RestError) {
        return response.status(err.statusCode).json({ error: err.message });
      }
      return response.status(500).json({ error: err });
    }
  }
}
