import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";

import dotenv from "dotenv";

import { Cliente } from "../entities/Cliente";
import { Fatura } from "../entities/Fatura";

interface IDbOptions {
  dialect: Dialect;
  host: string;
  username: string;
  password: string;
  database: string;
}

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const DbOptions: IDbOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const sequelize = new Sequelize(DbOptions.database, DbOptions.username, DbOptions.password, {
  host: DbOptions.host,
  dialect: DbOptions.dialect,
  models: [Cliente, Fatura],
  query: { raw: true },
  logging: false,
});

export { sequelize };