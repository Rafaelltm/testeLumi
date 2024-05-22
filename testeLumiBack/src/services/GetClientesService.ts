import { Cliente } from '../entities/Cliente';
import { RestError } from '../error/RestError';

import { injectable } from "tsyringe";

@injectable()
export class GetClientesService {

  async execute(): Promise<Cliente[]> {
    try {
      const res = await Cliente.findAll();

      return res;
    } catch (err) {
      console.log(err);
      throw new RestError(`Ocorreu um erro ao buscar dados dos clientes.`, 400);
    }
  }

}