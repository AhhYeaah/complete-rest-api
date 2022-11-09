export interface criarContaTypes {
  body: {
    nome: string;
    cpf: string;
  };
}

export interface depositarTypes {
  body: {
    cpf: string;
    montante: number;
  };
}

export interface transferenciaTypes {
  body: {
    cpfOrigem: string;
    cpfDestino: string;
    montante: number;
  };
}
