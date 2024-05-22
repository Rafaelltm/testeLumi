import { Cliente } from '../entities/Cliente';
import { Fatura } from '../entities/Fatura';

import { RestError } from '../error/RestError';

import fs from "fs";
import { injectable } from "tsyringe";
import pdfParse from "pdf-parse";
import { channel } from 'diagnostics_channel';

interface IPdfText {
  numCliente: number;
  nomeCliente: string;
  mesReferencia: string;
  anoReferencia: number;
  energiaEletricaQtd: number;
  energiaEletricaVlr: number;
  energiaSCEEEQtd: number;
  energiaSCEEEVlr: number;
  energiaCompensadaQtd: number;
  energiaCompensadaVlr: number;
  contribuicaoIluminacaoValor: number;
}

interface ICreateCliente {
  numCliente: number;
  nomeCliente: string;
}

interface ICreateFatura {
  numCliente: number;
  mesReferencia: string;
  anoReferencia: number;
  energiaEletricaQtd: number;
  energiaEletricaVlr: number;
  energiaSCEEEQtd: number;
  energiaSCEEEVlr: number;
  energiaCompensadaQtd: number;
  energiaCompensadaVlr: number;
  contribuicaoIluminacaoValor: number;
  faturaBase64: string;
}

@injectable()
export class ImportFaturaService {

  async execute(file: Express.Multer.File): Promise<void> {
    try {
      const pdfText = await this.extractPDFText(file.path);
      const base64StringPdfFile = fs.readFileSync(file.path, { encoding: "base64" });

      const pdfConvertedData = this.extractDataFromPdfText(pdfText);

      await this.handleCliente({
        numCliente: pdfConvertedData.numCliente,
        nomeCliente: pdfConvertedData.nomeCliente
      });

      await this.handleFatura({ ...pdfConvertedData, faturaBase64: base64StringPdfFile });

    } catch (err) {
      console.log(err);
      throw new RestError(`Ocorreu um erro ao importar dados do arquivo pdf.`, 422);
    }
  }

  async handleFatura({
    numCliente,
    mesReferencia,
    anoReferencia,
    energiaEletricaQtd,
    energiaEletricaVlr,
    energiaSCEEEQtd,
    energiaSCEEEVlr,
    energiaCompensadaQtd,
    energiaCompensadaVlr,
    contribuicaoIluminacaoValor,
    faturaBase64,
  }: ICreateFatura): Promise<void> {
    try {
      const fatura = await Fatura.findOne({
        where: {
          numCliente,
          mesReferencia,
          anoReferencia,
        }
      });

      if (fatura === null) {
        await Fatura.create({
          numCliente,
          mesReferencia,
          anoReferencia,
          energiaEletricaQtd,
          energiaEletricaVlr,
          energiaSCEEEQtd,
          energiaSCEEEVlr,
          energiaCompensadaQtd,
          energiaCompensadaVlr,
          contribuicaoIluminacaoValor,
          faturaBase64,
        });
      }
    } catch (err) {
      throw new RestError("Ocorreu um erro na inserção da fatura na base de dados", 400);
    }
  }

  async handleCliente({ numCliente, nomeCliente }: ICreateCliente): Promise<void> {
    try {
      const cliente = await Cliente.findByPk(numCliente);

      if (cliente === null) {
        await Cliente.create({
          numCliente,
          nomeCliente,
        });
      }
    } catch (err) {
      throw new RestError("Ocorreu um erro na inserção do cliente na base de dados", 400);
    }
  }

  async extractPDFText(pdfPath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(pdfPath);
      const data = await pdfParse(dataBuffer);

      return data.text;
    } catch (error) {
      throw new RestError("Erro ao extrair texto do PDF", 400);
    }
  }

  extractDataFromPdfText(pdfText: string): IPdfText {
    const data: any = {};

    const energiaEletricaMatch = pdfText.match(/Energia Elétrica.*?(\d+)\s+([\d,]+)\s+([\d,]+).*?/);
    if (energiaEletricaMatch) {
      data.energiaEletrica = {
        quantidade: parseInt(energiaEletricaMatch[1].replace(/\s/g, '')),
        valor: parseFloat(energiaEletricaMatch[3].replace(',', '.')),
      };
    }

    const EnergiaSceeIsentaMatch = pdfText.match(/Energia SCEE ISENTA.*?(\d+)\s+([\d,]+)\s+([\d,]+).*?/);
    if (EnergiaSceeIsentaMatch) {
      data.energiaSCEEIsenta = {
        quantidade: parseInt(EnergiaSceeIsentaMatch[1].replace(/\s/g, '')),
        valor: parseFloat(EnergiaSceeIsentaMatch[3].replace(',', '.')),
      };
    }

    const energiaCompensadaGdMatch = pdfText.match(/Energia compensada GD I.*?(\d+)\s+([\d,]+)\s+([\d,-]+).*?/);
    if (energiaCompensadaGdMatch) {
      data.energiaCompensadaGDI = {
        quantidade: parseInt(energiaCompensadaGdMatch[1].replace(/\s/g, '')),
        valor: parseFloat(energiaCompensadaGdMatch[3].replace(',', '.')),
      };
    }

    const contribIlumPublicaMatch = pdfText.match(/Contrib Ilum Publica Municipal\s+([\d,]+).*?/);
    if (contribIlumPublicaMatch) {
      data.contribuicaoIlumPublica = parseFloat(contribIlumPublicaMatch[1].replace(',', '.'));
    }

    const clienteInstalacaoMatch = pdfText.match(/Nº DO CLIENTE\s+Nº DA INSTALAÇÃO\s+(\d+)\s+(\d+)/);
    if (clienteInstalacaoMatch) {
      data.numeroCliente = clienteInstalacaoMatch[1];
    }

    const datasReferenciaMatch = pdfText.match(/Referente\sa\s+Vencimento\s+Valor\sa\spagar\s+\(R\$\)\s+(\w+\/\d+)\s+(\d+\/\d+\/\d+)\s+([\d,]+)/);
    if (datasReferenciaMatch) {
      data.referencia = datasReferenciaMatch[1];
    }

    const nomeClienteMatch = pdfText.match(/Comprovante\ de\ Pagamento\n(.+)/);
    if (nomeClienteMatch) {
      data.nomeCliente = nomeClienteMatch[1];
    }

    const pdfConvertedData: IPdfText = {
      numCliente: Number(data.numeroCliente),
      nomeCliente: data.nomeCliente,
      mesReferencia: data.referencia.split('/')[0],
      anoReferencia: Number(data.referencia.split('/')[1]),
      energiaEletricaQtd: Number(data.energiaEletrica?.quantidade) || 0,
      energiaEletricaVlr: Number(data.energiaEletrica?.valor) || 0,
      energiaSCEEEQtd: Number(data.energiaSCEEIsenta?.quantidade) || 0,
      energiaSCEEEVlr: Number(data.energiaSCEEIsenta?.valor) || 0,
      energiaCompensadaQtd: Number(data.energiaCompensadaGDI?.quantidade) || 0,
      energiaCompensadaVlr: Number(data.energiaCompensadaGDI?.valor) || 0,
      contribuicaoIluminacaoValor: Number(data.contribuicaoIlumPublica) || 0,
    }

    return pdfConvertedData;
  }
}