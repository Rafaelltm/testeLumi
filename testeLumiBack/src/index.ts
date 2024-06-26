import express, { Express } from "express";
import dotenv from "dotenv";

import cors from 'cors';

import "reflect-metadata";

import { router } from "./routes";
import { sequelize } from "./database";

dotenv.config();
const port = process.env.PORT || 3001;

const app: Express = express();

//Inicializa a conexao ao banco de dados
(async () => {
  try {
    await sequelize.sync();

    console.log("Database Inicializado");
  } catch (error) {
    console.log("Erro ao inicializar o banco -> ", error);
  }
})();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export { app };