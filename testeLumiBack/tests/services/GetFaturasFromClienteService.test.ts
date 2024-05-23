import { GetFaturasFromClienteService } from '../../src/services/GetFaturasFromClienteService';
import { Fatura } from '../../src/entities/Fatura';
import { RestError } from '../../src/error/RestError';

jest.mock('../../src/entities/Fatura');
jest.mock('../../src/error/RestError');

describe('GetFaturasFromClienteService', () => {
  let service: GetFaturasFromClienteService;

  beforeEach(() => {
    service = new GetFaturasFromClienteService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of invoices for a given client number', async () => {
    const mockFaturas = [
      { id: 1, numCliente: 123, valor: 100 },
      { id: 2, numCliente: 123, valor: 200 },
    ];
    (Fatura.findAll as jest.Mock).mockResolvedValue(mockFaturas);

    const numCliente = 123;
    const result = await service.execute(numCliente);

    expect(Fatura.findAll).toHaveBeenCalledWith({ where: { numCliente } });
    expect(result).toEqual(mockFaturas);
  });

  it('should throw a RestError when an error occurs', async () => {
    const errorMessage = 'Database error';
    (Fatura.findAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const numCliente = 123;

    try {
      await service.execute(numCliente);
    } catch (error) {
      expect(error).toBeInstanceOf(RestError);
    }
  });
});
