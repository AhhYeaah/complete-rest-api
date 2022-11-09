import * as dotenv from 'dotenv';
dotenv.config();
import { describe, expect, test } from '@jest/globals';
import { ContaControler } from '../../controler/ContaControler';
import {
  INVALID_CPF,
  INVALID_NAN_MONTANTE,
  INVALID_NEGATIVE_MONTANTE,
  INVALID_STRING,
  INVALID_TOO_HIGH_MONTANTE,
  VALID_CPF,
  VALID_CPF2,
  VALID_LOW_MONTANTE,
  VALID_MONTANTE,
  VALID_NAME,
} from '../variables';
import { ContaService } from '../../services/ContaService';

// Com esses testes foram testadas por consequencia todas as funções da pasta utils.
describe('ContaControler', () => {
  const stubContaService = {
    contaExiste: (cpf: string) => {
      return 1;
    },
    saveConta: (nome: string, cpf: string) => {
      return {
        nome: nome,
        cpf: cpf,
        saldo: 0,
      };
    },
    modificarSaldo: (cpf: string, montante: number) => {
      return {
        cpf: cpf,
        saldo: 0,
      };
    },
    checarSaldo: (cpfOrigem) => {
      return 20;
    },
    transferencia: (cpfOrigem, cpfDestino, montante) => {
      return true;
    },
  } as unknown as ContaService;

  test('CriarConta - Deve retornar uma conta quando tudo estiver correto', async () => {
    const modifiedStubContaService = {
      ...stubContaService,
      contaExiste: (cpf: string) => {
        return 0;
      },
    } as unknown as ContaService;

    const contaControler = new ContaControler(modifiedStubContaService);
    const { result, error } = await contaControler.cadastrarConta(VALID_NAME, VALID_CPF);

    expect(result).toMatchObject({
      nome: VALID_NAME,
      cpf: VALID_CPF,
      saldo: 0,
    });

    expect(error).toBe(undefined);
  });

  test('CriarConta - Deve retornar um erro quando a conta ja existir', async () => {
    const contaControler = new ContaControler(stubContaService);

    const { result, error } = await contaControler.cadastrarConta(VALID_NAME, VALID_CPF);
    expect(error).toMatchObject({
      code: 403,
      message: 'Usuario ja existe',
    });
    expect(result).toBe(undefined);
  });

  test('CriarConta - Deve retornar um erro quando o nome for invalido.', async () => {
    const modifiedStubContaService = {
      ...stubContaService,
      contaExiste: (cpf: string) => {
        return 0;
      },
    } as unknown as ContaService;

    const contaControler = new ContaControler(modifiedStubContaService);

    const { result, error } = await contaControler.cadastrarConta(INVALID_STRING, VALID_CPF);
    expect(error).toMatchObject({
      code: 400,
      message: 'Parametros fornecidos invalidos',
    });
    expect(result).toBe(undefined);
  });

  test('CriarConta - Deve retornar um erro quando o cpf for invalido.', async () => {
    const modifiedStubContaService = {
      ...stubContaService,
      contaExiste: (cpf: string) => {
        return 0;
      },
    } as unknown as ContaService;

    const contaControler = new ContaControler(modifiedStubContaService);

    const { result, error } = await contaControler.cadastrarConta(VALID_NAME, INVALID_CPF);
    expect(error).toMatchObject({
      code: 400,
      message: 'Parametros fornecidos invalidos',
    });
    expect(result).toBe(undefined);
  });

  test('Depositar - Deve retornar as informações da conta após deposito', async () => {
    const contaControler = new ContaControler(stubContaService);
    const { result, error } = await contaControler.depositar(VALID_CPF, VALID_MONTANTE);

    expect(result).toMatchObject({
      cpf: VALID_CPF,
      saldo: 0,
    });

    expect(error).toBe(undefined);
  });

  test('Depositar - Deve retornar um erro caso o depósito seja superior a R$2000', async () => {
    const contaControler = new ContaControler(stubContaService);
    const { result, error } = await contaControler.depositar(VALID_CPF, INVALID_TOO_HIGH_MONTANTE);

    expect(result).toBe(undefined);
    expect(error).toMatchObject({ code: 403, message: 'Nenhuma transação de deposito pode exceder o valor de R$2000' });
  });

  test('Depositar - Deve retornar um erro caso a conta não exista', async () => {
    const modifiedStubContaService = {
      ...stubContaService,
      contaExiste: (cpf: string) => {
        return 0;
      },
    } as unknown as ContaService;

    const contaControler = new ContaControler(modifiedStubContaService);
    const { result, error } = await contaControler.depositar(VALID_CPF, VALID_MONTANTE);

    expect(result).toBe(undefined);
    expect(error).toMatchObject({
      code: 404,
      message: 'Usuario não encontrado',
    });
  });

  test('Depositar - Deve retornar um erro caso o montante seja negativo', async () => {
    const contaControler = new ContaControler(stubContaService);
    const { result, error } = await contaControler.depositar(VALID_CPF, INVALID_NEGATIVE_MONTANTE);

    expect(result).toBe(undefined);
    expect(error).toMatchObject({ code: 400, message: 'Parametros fornecidos invalidos' });
  });

  test('Depositar - Deve retornar um erro caso o montante não seja um numero', async () => {
    const contaControler = new ContaControler(stubContaService);
    const { result, error } = await contaControler.depositar(VALID_CPF, INVALID_NAN_MONTANTE);

    expect(result).toBe(undefined);
    expect(error).toMatchObject({ code: 400, message: 'Parametros fornecidos invalidos' });
  });

  test('Transferencia - Deve retornar true caso não haja nenhum problema', async () => {
    const contaControler = new ContaControler(stubContaService);
    const { result, error } = await contaControler.transferencia(VALID_CPF, VALID_CPF2, VALID_LOW_MONTANTE);

    expect(result).toBe(true);
    expect(error).toBe(undefined);
  });

  test('Transferencia - Deve retornar um erro caso o cpf de origem e o de destino sejam iguais', async () => {
    const contaControler = new ContaControler(stubContaService);
    const { result, error } = await contaControler.transferencia(VALID_CPF, VALID_CPF, VALID_LOW_MONTANTE);

    expect(result).toBe(undefined);
    expect(error).toMatchObject({ code: 400, message: 'Parametros fornecidos invalidos' });
  });

  test('Transferencia - Deve retornar um erro caso o cpf de origem ou o de destino não existam', async () => {
    const modifiedStubContaService = {
      ...stubContaService,
      contaExiste: (cpf: string) => {
        return 0;
      },
    } as unknown as ContaService;

    const contaControler = new ContaControler(modifiedStubContaService);
    const { result, error } = await contaControler.transferencia(VALID_CPF, VALID_CPF, VALID_LOW_MONTANTE);

    expect(result).toBe(undefined);
    expect(error).toMatchObject({ code: 400, message: 'Parametros fornecidos invalidos' });
  });

  test('Transferencia - Deve retornar um erro caso o saldo da conta de origem seja insuficiente', async () => {
    const contaControler = new ContaControler(stubContaService);
    const { result, error } = await contaControler.transferencia(VALID_CPF, VALID_CPF2, VALID_MONTANTE);

    expect(result).toBe(undefined);
    expect(error).toMatchObject({ code: 403, message: 'Usuario não tem saldo suficiente' });
  });
});
