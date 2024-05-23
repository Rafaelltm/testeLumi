import React, { useEffect, useCallback, useState } from 'react';
import Container from '../../components/Container';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import api from "../../services/api";

import "./styles.css";
import Header from '../../components/Header';

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [faturas, setFaturas] = useState<IFatura[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<string>("");
  const [tipoSelecionado, setTipoSelecionado] = useState<string>("");
  const [isLoadedGraphTypeSelect, setIsLoadedGraphTypeSelect] = useState<Boolean>(false);
  const [isLoadedGraph, setIsLoadedGraph] = useState<Boolean>(false);

  const [graphTitle, setGraphTitle] = useState<string>("Energia (kWh)");
  const [graphLabels, setGraphLabels] = useState<string[]>([]);
  const [graphData, setGraphData] = useState<{ labels: string[], datasets: { label: string, data: number[], backgroundColor: string }[] }>({
    labels: [],
    datasets: []
  });

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: graphTitle,
      },
    },
  };

  const handleTipoSelecionadoChange = (value: string) => {
    let selectedQuantidade = true;
    let selectedValor = false;

    try {
      setTipoSelecionado(value);
      if (value === 'quantidade') {
        selectedQuantidade = true;
        selectedValor = false;

        setGraphTitle("Energia (kWh)");
      } else if (value === 'valor') {
        selectedQuantidade = false;
        selectedValor = true;

        setGraphTitle("Valores Monetários (R$)");
      }
      handleGraphsData(selectedQuantidade, selectedValor);
      setIsLoadedGraph(true);
    } catch (err) {
      console.log(err);
    }
  }

  const handleGraphsData = (
    selectedQuantidade: Boolean,
    selectedValor: Boolean,
  ) => {
    const labels: string[] = [];
    const consumoEnergiaData: number[] = [];
    const energiaCompensadaData: number[] = [];
    const valorTotalData: number[] = [];
    const economiaGdData: number[] = [];

    const graphDataSetsNames: string[] = selectedQuantidade ? ["Consumo de Energia Elétrica", "Energia Compensada"] : ["Valor Total sem GD", "Economia GD"];

    for (let fatura of faturas) {
      console.log(fatura);
      consumoEnergiaData.push(fatura.energiaEletricaQtd + fatura.energiaSCEEEQtd);
      energiaCompensadaData.push(fatura.energiaCompensadaQtd);
      valorTotalData.push(Number(fatura.energiaEletricaVlr) + Number(fatura.energiaSCEEEVlr) + Number(fatura.contribuicaoIluminacaoValor));
      economiaGdData.push(Number(fatura.energiaCompensadaVlr));

      labels.push(fatura.mesReferencia);
    }

    const datasets = selectedQuantidade
      ? [
        {
          label: graphDataSetsNames[0],
          data: consumoEnergiaData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: graphDataSetsNames[1],
          data: energiaCompensadaData,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ]
      : [
        {
          label: graphDataSetsNames[0],
          data: valorTotalData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: graphDataSetsNames[1],
          data: economiaGdData,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ];

    setGraphLabels(labels);
    setGraphData({
      labels: labels,
      datasets: datasets,
    });
  };

  const handleClienteSelecionadoChange = async (value: string) => {
    try {
      setTipoSelecionado("");
      setIsLoadedGraphTypeSelect(false);
      setClienteSelecionado(value);
      setIsLoadedGraph(false);
      if (value !== "") {
        const response = await api.get(`/faturas/cliente/${value}`);

        if (response.data.length > 0) {
          setFaturas(response.data);
          setIsLoadedGraphTypeSelect(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

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
  }, [handleLoadClientes]);

  return (
    <Container title="Dashboard">
      <Header />
      <div className="graphsDiv">
        Selecione o cliente do qual se deseja fazer o download da fatura
        <select value={clienteSelecionado} onChange={(e) => handleClienteSelecionadoChange(e.target.value)}>
          <option value="">Selecione o cliente</option>
          {clientes && clientes.map((cliente: ICliente) => (
            <option key={cliente.numCliente} value={cliente.numCliente}>
              {cliente.numCliente} - {cliente.nomeCliente}
            </option>
          ))}
        </select>
        {isLoadedGraphTypeSelect &&
          <select value={tipoSelecionado} onChange={(e) => handleTipoSelecionadoChange(e.target.value)}>
            <option value="">Selecione o tipo de gráfico</option>
            <option value="quantidade">Energia (KWh)</option>
            <option value="valor">Valor Monetário (R$)</option>
          </select>
        }
        {isLoadedGraph && <Bar options={graphOptions} data={graphData} />}
      </div>
    </Container>
  );
}

export default Dashboard;