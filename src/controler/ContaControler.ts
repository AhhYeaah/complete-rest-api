import { Conta } from '../database/entities/Conta';
import { ContaService } from '../services/ContaService';
import { isCPF } from '../utils/validation/isCpf';
import { isNotEmpty } from '../utils/validation/isNotEmpty';
import { isValidMontante } from '../utils/validation/isValidMontante';

interface ControlerResponse<T> {
  result?: T;
  error?: { code: number; message: string };
}

export class ContaControler {
  constructor(private contaService = new ContaService()) {}

  async cadastrarConta(nome: string, cpf: string): Promise<ControlerResponse<Conta>> {
    if (!isNotEmpty(nome) || !isCPF(cpf)) {
      return { error: { code: 400, message: 'Parametros fornecidos invalidos' } };
    }

    try {
      if (await this.contaService.contaExiste(cpf)) {
        return { error: { code: 403, message: 'Usuario ja existe' } };
      }

      return { result: await this.contaService.saveConta(nome, cpf) };
    } catch (error) {
      return { error: { code: 500, message: 'Internal Server Error' } };
    }
  }
  //beaware of the typescript type nerd
  async depositar(cpf: string, montante: number): Promise<ControlerResponse<Pick<Conta, 'cpf' | 'saldo'>>> {
    if (!isValidMontante(montante) || !isCPF(cpf)) {
      return { error: { code: 400, message: 'Parametros fornecidos invalidos' } };
    }

    try {
      if (montante > 2000) {
        return { error: { code: 403, message: 'Nenhuma transação de deposito pode exceder o valor de R$2000' } };
      }
      if (!(await this.contaService.contaExiste(cpf))) {
        return { error: { code: 404, message: 'Usuario não encontrado' } };
      }

      const { saldo } = await this.contaService.modificarSaldo(cpf, montante);
      return { result: { cpf, saldo } };
    } catch (error) {
      return { error: { code: 500, message: 'Erro interno do servidor' } };
    }
  }

  async transferencia(cpfOrigem: string, cpfDestino: string, montante: number): Promise<ControlerResponse<true>> {
    if (!isValidMontante(montante) || !isCPF(cpfOrigem) || !isCPF(cpfDestino) || cpfOrigem === cpfDestino) {
      return { error: { code: 400, message: 'Parametros fornecidos invalidos' } };
    }

    try {
      if (!(await this.contaService.contaExiste(cpfOrigem)) || !(await this.contaService.contaExiste(cpfDestino))) {
        return { error: { code: 404, message: 'Usuario não encontrado' } };
      }

      const saldoContaOrigem = await this.contaService.checarSaldo(cpfOrigem);

      if (saldoContaOrigem - montante < 0) {
        return { error: { code: 403, message: 'Usuario não tem saldo suficiente' } };
      }

      return { result: await this.contaService.transferencia(cpfOrigem, cpfDestino, montante) };
    } catch (error) {
      if (error) return { error: { code: 500, message: 'Erro interno do servidor' } };
    }
  }
}
