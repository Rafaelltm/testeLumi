import { Table, Column, Model, PrimaryKey, ForeignKey, BelongsTo, AllowNull, DataType, AutoIncrement } from 'sequelize-typescript';
import { Cliente } from './Cliente';

@Table
export class Fatura extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Cliente)
  @Column(DataType.BIGINT)
  numCliente: number;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  numInstalacao: number;

  @BelongsTo(() => Cliente, { foreignKey: 'numCliente' })
  cliente: Cliente;

  @AllowNull(false)
  @Column
  mesReferencia: string;

  @AllowNull(false)
  @Column
  anoReferencia: number;

  @AllowNull(true)
  @Column
  energiaEletricaQtd: number;

  @AllowNull(true)
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

}