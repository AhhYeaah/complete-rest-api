import * as dotenv from 'dotenv';
dotenv.config();
import * as express from 'express';
import { AppDataSource } from './src/./database/data-source';
import { ContaControler } from './src/controler/ContaControler';
import { criarContaTypes, depositarTypes, transferenciaTypes } from './src/utils/types/endpointTypes';

console.log('\n\t 🔥 Starting engines... 🔥');
AppDataSource.initialize().then(async () => {
  console.log('   Connection with database established.');

  const app = express();
  app.use(express.json());

  app.post('/criarConta', async ({ body: { nome, cpf } }: criarContaTypes, res) => {
    const { error, result } = await new ContaControler().cadastrarConta(nome, cpf);

    if (error) {
      res.status(error.code).send(error.message);
    } else {
      res.status(200).send(result);
    }
  });

  app.put('/depositar', async ({ body: { cpf, montante } }: depositarTypes, res) => {
    const { error, result } = await new ContaControler().depositar(cpf, Number(montante));

    if (error) {
      res.status(error.code).send(error.message);
    } else {
      res.status(200).send(result);
    }
  });

  app.put('/transferir', async ({ body: { cpfOrigem, cpfDestino, montante } }: transferenciaTypes, res) => {
    const { error, result } = await new ContaControler().transferencia(cpfOrigem, cpfDestino, Number(montante));

    if (error) {
      res.status(error.code).send(error.message);
    } else {
      res.status(200).send(result);
    }
  });

  app.listen(3000);
  console.log('     Server started at localhost:3000');
  console.log('\t   🚀 To the moon! 🚀\n');
});
