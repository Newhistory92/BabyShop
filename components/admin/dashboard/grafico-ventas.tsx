"use client"

import { useEffect, useRef } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface DatosGrafico {
  labels: string[]
  ventas: number[]
  pedidos: number[]
}

interface PropiedadesGraficoVentas {
  datos: DatosGrafico
}

export function GraficoVentas({ datos }: PropiedadesGraficoVentas) {
  const chartRef = useRef<ChartJS>(null)

  // Configuración del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#7F6CFF",
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "#2A2E2A",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
        borderColor: "#3A3E3A",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(225, 219, 255, 0.2)",
        },
        ticks: {
          color: "#7F6CFF",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#7F6CFF",
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  }

  // Datos del gráfico
  const data = {
    labels: datos.labels,
    datasets: [
      {
        label: "Ventas ($)",
        data: datos.ventas,
        borderColor: "#A1F044",
        backgroundColor: "rgba(161, 240, 68, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Pedidos",
        data: datos.pedidos,
        borderColor: "#7F6CFF",
        backgroundColor: "rgba(127, 108, 255, 0.0)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  }

  // Actualizar el gráfico cuando cambian los datos
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update()
    }
  }, [datos])

  return (
    <div className="h-[300px]">
      <Line ref={chartRef} options={options} data={data} />
    </div>
  )
}

