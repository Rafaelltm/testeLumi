import { Table, Column, Model, PrimaryKey, ForeignKey, BelongsTo, AllowNull, DataType } from 'sequelize-typescript';
import { Cliente } from './Cliente';

@Table
export class Fatura extends Model {

  @PrimaryKey
  @ForeignKey(() => Cliente)
  @Column(DataType.BIGINT)
  numCliente: number;

  @PrimaryKey
  @Column
  mesReferencia: string;

  @PrimaryKey
  @Column
  anoReferencia: number;

  @AllowNull(false)
  @Column
  energiaEletricaQtd: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL)
  energiaEletricaVlr: number;

  @AllowNull(true)
  @Column
  energiaSCEEEQtd: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL)
  energiaSCEEEVlr: number;

  @AllowNull(true)
  @Column
  energiaCompensadaQtd: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL)
  energiaCompensadaVlr: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL)
  contribuicaoIluminacaoValor: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  faturaBase64: string;

  @BelongsTo(() => Cliente) cliente: Cliente;
}