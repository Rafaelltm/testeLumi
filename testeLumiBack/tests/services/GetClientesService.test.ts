import { GetClientesService } from '../../src/services/GetClientesService';
import { Cliente } from '../../src/entities/Cliente';
import { RestError } from '../../src/error/RestError';

jest.mock('../../src/entities/Cliente');

describe('GetClientesService', () => {
  let service: GetClientesService;

  beforeEach(() => {
    service = new GetClientesService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of clients', async () => {
    const mockClientes = [
      { id: 1, nome: 'Cliente 1' },
      { id: 2, nome: 'Cliente 2' },
    ];
    (Cliente.findAll as jest.Mock).mockResolvedValue(mockClientes);

    const result = await service.execute();

    expect(Cliente.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockClientes);
  });

  it('should throw a RestError when an error occurs', async () => {
    const errorMessage = 'Database error';
    (Cliente.findAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

    try {
      await service.execute();
    } catch (error) {
      expect(error).toBeInstanceOf(RestError);
    }
  });
});
