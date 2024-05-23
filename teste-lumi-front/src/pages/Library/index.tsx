import React, { useEffect, useState, useCallback } from "react";
import Container from "../../components/Container";

import api from "../../services/api";

import "./styles.css";
import Base64ToPdfDownloader from "../../components/Base64ToPdfDownloader";

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
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [faturas, setFaturas] = useState<IFatura[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<string>("");
  const [faturaSelecionada, setFaturaSelecionada] = useState<string>("");
  const [faturaPdf, setFaturaPdf] = useState<object>({});
  const [isLoadedFaturaSelect, setIsLoadedFaturaSelect] = useState<Boolean>(false);
  const [isLoadedDownloadPdfBtn, setIsLoadedDownloadPdfBtn] = useState<Boolean>(false);
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
      setIsLoadedFaturaSelect(false);
      setIsLoadedDownloadPdfBtn(false);
      setFaturaSelecionada("");
      if (value !== "") {
        const response = await api.get(`/faturas/cliente/${value}`);

        if (response.data.length > 0) {
          setFaturas(response.data);
          setIsLoadedFaturaSelect(true);
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
    } catch (err) {
      console.log(err);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {

      const formData = new FormData();
      formData.append('file', file);

      setFaturaPdf(formData);
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
    <Container title="Biblioteca de Faturas">
      <div className="splitedDiv">
        <div className="importFatura">
          <Container title="Import de Faturas">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <button className="sendPdfBtn" onClick={handleSendPdfFile}>Enviar</button>
          </Container>
        </div>
        <div className="downloadFatura">
          <Container title="Download de Faturas">
            Selecione o cliente do qual se deseja fazer o download da fatura
            <select value={clienteSelecionado} onChange={(e) => handleClienteSelecionadoChange(e.target.value)}>
              <option value="">Selecione o cliente</option>
              {clientes && clientes.map((cliente: ICliente) => {
                return <option
                  key={cliente.numCliente}
                  value={cliente.numCliente}>
                  {cliente.numCliente} - {cliente.nomeCliente}
                </option>
              })}
            </select>

            {isLoadedFaturaSelect &&
              <select value={faturaSelecionada} onChange={(e) => handleFaturaSelecionadaChange(e.target.value)}>
                <option value="">Selecione a fatura</option>
                {faturas && faturas.map((fatura: IFatura) => {
                  return <option
                    key={fatura.id}
                    value={fatura.id}>
                    {fatura.mesReferencia}/{fatura.anoReferencia}
                  </option>
                })}
              </select>
            }
            {isLoadedDownloadPdfBtn &&
              <Base64ToPdfDownloader base64String={base64ToDownload} fileName={fileNameToDownload} />
            }
          </Container>
        </div>
      </div>
    </Container>
  );
}

export default Library;