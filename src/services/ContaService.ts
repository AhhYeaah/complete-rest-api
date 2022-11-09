import { AppDataSource } from '../database/data-source';
import { Conta } from '../database/entities/Conta';

export class ContaService {
  constructor(private contaRepository = AppDataSource.getRepository(Conta)) {}

  async contaExiste(cpf: string): Promise<boolean> {
    return (await this.contaRepository.count({ where: { cpf: cpf } })) > 0;
  }

  async saveConta(nome: string, cpf: string): Promise<Conta> {
    return this.contaRepository.save({ cpf, nome });
  }

  async checarSaldo(cpf: string): Promise<number> {
    return (await this.contaRepository.findOneOrFail({ where: { cpf: cpf } })).saldo;
  }

  async modificarSaldo(cpf: string, montante: number) {
    const conta = await this.contaRepository.findOneOrFail({ where: { cpf: cpf } });
    conta.saldo += montante;

    return this.contaRepository.save(conta);
  }

  async transferencia(cpfOrigem: string, cpfDestino: string, montante: number): Promise<true> {
    await this.modificarSaldo(cpfOrigem, 0 - montante);
    await this.modificarSaldo(cpfDestino, montante);

    return true;
  }
}
