import { Fatura } from '../entities/Fatura';
import { RestError } from '../error/RestError';

import { injectable } from "tsyringe";

@injectable()
export class GetFaturasFromClienteService {

  async execute(numCliente: number): Promise<Fatura[]> {
    try {
      const res = await Fatura.findAll({ where: { numCliente: numCliente } });

      return res;
    } catch (err) {
      console.log(err);
      throw new RestError(`Ocorreu um erro ao buscar dados dos clientes.`, 400);
    }
  }

}