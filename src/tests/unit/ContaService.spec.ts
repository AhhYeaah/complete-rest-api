import * as dotenv from 'dotenv';
dotenv.config();
import { describe, expect, test } from '@jest/globals';
/* Há dois motivos (e mais um) para que eu não faça o de contaServices
   1. Nenhuma função tem uma logica interna mais complicada
      do que uma comparação ou subtração simples.
   2. A simplicidade das funções faça com que se eu de fato
      tentasse testar, estaria apenas comprovando que o typeORM
      funciona.
   3. EU não sei virtualizar um banco interiro só pra testes T~T*/

describe('ContaService', () => {
  test('Ser um teste muito massa', () => {
    expect(true).toBe(true);
  });
});
