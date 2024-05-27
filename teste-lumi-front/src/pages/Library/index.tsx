import React, { useEffect, useState, useCallback } from "react";
import Container from "../../components/Container";

import api from "../../services/api";

import "./styles.css";
import Base64ToPdfDownloader from "../../components/Base64ToPdfDownloader";
import CustomSelect from "../../components/CustomSelect";
import FileInput from "../../components/FileInput";
import { useLocation } from "react-router-dom";

interface ICliente {
  numCliente: number;
  nomeCliente: string;
}

interface IFatura {
  id: number;
  numCliente: number;
  numInstalacao: number;
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

const Library = () => {
  const location = useLocation();

  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [faturas, setFaturas] = useState<IFatura[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<string>("");
  const [faturaSelecionada, setFaturaSelecionada] = useState<string>("");
  const [faturaPdf, setFaturaPdf] = useState<object>({});
  const [isLoadedDownloadPdfBtn, setIsLoadedDownloadPdfBtn] = useState<boolean>(false);
  const [isFaturaFileSelected, setIsFaturaFileSelected] = useState<boolean>(false);
  const [base64ToDownload, setBase64ToDownload] = useState<string>("");
  const [fileNameToDownload, setFileNameToDownload] = useState<string>("");

  const handleFaturaSelecionadaChange = (value: string) => {
    try {
      setFaturaSelecionada(value);
      setIsLoadedDownloadPdfBtn(false);
      if (value !== "") {
        const faturaFiltered = faturas.filter((fatura) => fatura.id === Number(value));

        setBase64ToDownload(faturaFiltered[0].faturaBase64);
        setFileNameToDownload(`${faturaFiltered[0].numInstalacao}-${faturaFiltered[0].mesReferencia}-${faturaFiltered[0].anoReferencia}`);

        setIsLoadedDownloadPdfBtn(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleClienteSelecionadoChange = async (value: string) => {
    try {
      setClienteSelecionado(value);
      setIsLoadedDownloadPdfBtn(false);
      setFaturaSelecionada("");
      setFaturas([]);
      if (value !== "") {
        const response = await api.get(`/faturas/cliente/${value}`);

        if (response.data.length > 0) {
          setFaturas(response.data);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleSendPdfFile = async () => {
    try {
      await api.post('/faturas/import', faturaPdf, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Pdf enviado com sucesso!');
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }

  const handlePdfFileChange = (file: File) => {
    setIsFaturaFileSelected(false);
    if (file.type === 'application/pdf') {
      const formData = new FormData();
      formData.append('file', file);

      setFaturaPdf(formData);
      setIsFaturaFileSelected(true);
    } else {
      alert('Por favor, selecione um arquivo PDF.');
    }
  };

  const handleLoadClientes = useCallback(async () => {
    try {
      const response = await api.get("/clientes/all");

      setClientes(response.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {

    handleLoadClientes();
  }, [handleLoadClientes, setClientes]);

  return (
    <Container title="Biblioteca de Faturas" isMain={true} path={location.pathname}>
      <div className="splitedDiv">
        <div className="splitedDivPiece importFatura">
          <Container title="Importar Faturas" isMain={false}>
            <FileInput
              id="file-upload"
              label="Selecionar Arquivo PDF"
              onFileChange={handlePdfFileChange}
              style={{ display: 'none' }}
            />
            <button disabled={!isFaturaFileSelected} className="sendPdfBtn" onClick={handleSendPdfFile}>Enviar</button>
          </Container>
        </div>
        <div className="splitedDivPiece downloadFatura">
          <Container title="Download de Faturas" isMain={false}>
            <div className="form-item">
              <label>
                1. Selecione o cliente
              </label>
              <CustomSelect
                id="cliente-select"
                value={clienteSelecionado}
                onChange={(e) => handleClienteSelecionadoChange(e.target.value)}
                options={clientes.map((cliente: ICliente) => ({
                  value: cliente.numCliente,
                  label: `${cliente.numCliente} - ${cliente.nomeCliente}`
                }))}
              />
            </div>

            <div className="form-item">
              <label>
                2. Selecione o Mês/Ano da fatura
              </label>
              <CustomSelect
                id="fatura-select"
                value={faturaSelecionada}
                onChange={(e) => handleFaturaSelecionadaChange(e.target.value)}
                options={faturas.map((fatura: IFatura) => ({
                  value: fatura.id,
                  label: `${fatura.mesReferencia}/${fatura.anoReferencia}`
                }))}
              />
            </div>
            <Base64ToPdfDownloader btnClassName="sendPdfBtn" base64String={base64ToDownload} fileName={fileNameToDownload} isDisabled={isLoadedDownloadPdfBtn} />
          </Container>
        </div>
      </div>
    </Container>
  );
}

export default Library;