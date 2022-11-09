import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Conta {
  @Column()
  nome: string;

  @PrimaryColumn({ unique: true })
  cpf: string;

  @Column({ default: 0, type: 'float' })
  saldo: number;
}
