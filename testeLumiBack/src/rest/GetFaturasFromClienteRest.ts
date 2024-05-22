import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetFaturasFromClienteService } from "../services/GetFaturasFromClienteService";
import { RestError } from "../error/RestError";

export class GetFaturasFromClienteRest {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { numCliente } = request.params;

      const getFaturasFromClienteService = container.resolve(GetFaturasFromClienteService);

      const res = await getFaturasFromClienteService.execute(Number(numCliente));

      return response.status(200).json(res);
    } catch (err) {
      if (err instanceof RestError) {
        return response.status(err.statusCode).json({ error: err.message });
      }
      return response.status(500).json({ error: err });
    }
  }
}
