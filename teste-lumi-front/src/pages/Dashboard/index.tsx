import React, { useEffect, useCallback, useState } from 'react';
import Container from '../../components/Container';

import "./styles.css";

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
import CustomSelect from '../../components/CustomSelect';

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

interface IGraphType {
  value: string;
  label: string;
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
  const [isLoadedGraph, setIsLoadedGraph] = useState<Boolean>(false);
  const [graphTypes, setGraphTypes] = useState<IGraphType[]>([]);

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
    // const labels: string[] = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "SET", "OUT", "NOV", "DEZ"];
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

      labels.push(`${fatura.mesReferencia} - ${fatura.anoReferencia}`);
    }

    const datasets = selectedQuantidade
      ? [
        {
          label: graphDataSetsNames[0],
          data: consumoEnergiaData,
          backgroundColor: 'rgba(1, 59, 33, 0.8)',
        },
        {
          label: graphDataSetsNames[1],
          data: energiaCompensadaData,
          backgroundColor: 'rgba(145, 227, 169, 0.8)',
        },
      ]
      : [
        {
          label: graphDataSetsNames[0],
          data: valorTotalData,
          backgroundColor: 'rgba(1, 59, 33, 0.8)',
        },
        {
          label: graphDataSetsNames[1],
          data: economiaGdData,
          backgroundColor: 'rgba(145, 227, 169, 0.8)',
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
      setGraphTypes([]);
      setClienteSelecionado(value);
      setIsLoadedGraph(false);
      if (value !== "") {
        const response = await api.get(`/faturas/cliente/${value}`);

        if (response.data.length > 0) {
          setFaturas(response.data);
          setGraphTypes([{
            value: "quantidade",
            label: "Energia (KWh)"
          }, {
            value: "valor",
            label: "Valor Monetário (R$)"
          }]);
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
    <Container title="Dashboard" isMain={true}>
      <div className="graphsDiv">
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
            2. Selecione o gráfico que deseja visualizar
          </label>
          <CustomSelect
            id="tipo-grafico-select"
            value={tipoSelecionado}
            onChange={(e) => handleTipoSelecionadoChange(e.target.value)}
            options={graphTypes.map((graphType: IGraphType) => ({
              value: graphType.value,
              label: graphType.label,
            }))}
          />
        </div>
        <div className="barGraphDiv">
          {isLoadedGraph && <Bar options={graphOptions} data={graphData} />}
        </div>
      </div>
    </Container>
  );
}

export default Dashboard;