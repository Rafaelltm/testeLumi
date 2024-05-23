import { DataType, Table, Column, Model, HasMany, PrimaryKey, AllowNull } from 'sequelize-typescript';
import { Fatura } from './Fatura';

@Table
export class Cliente extends Model {

  @PrimaryKey
  @Column(DataType.BIGINT)
  numCliente: number;

  @AllowNull(false)
  @Column
  nomeCliente: string;

  @HasMany(() => Fatura) faturas: Fatura[];

}