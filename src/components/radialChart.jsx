import {PolarArea } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default function RadialChart({ words, counts }) {

  const data = {
    labels: words, // top 10 words
    datasets: [
      {
        label: "Word Frequency",
        data: counts,
        backgroundColor: [
          "rgba(176, 38, 255, 0.8)",  // neon purple
          "rgba(255, 0, 144, 0.8)",   // neon pink
          "rgba(102, 0, 255, 0.8)",   // deep violet
          "rgba(0, 204, 255, 0.8)",   // cyan
          "rgba(255, 120, 0, 0.8)",   // orange
          "rgba(0, 255, 180, 0.8)",   // turquoise
          "rgba(255, 255, 0, 0.8)",   // neon yellow
          "rgba(0, 255, 0, 0.8)",     // green
          "rgba(255, 0, 0, 0.8)",     // red
          "rgba(0, 100, 255, 0.8)",   // blue
        ],
        borderColor: "white",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        ticks: { display: false }, // hide numbers for clean look
        grid: { color: "rgba(255,255,255,0.1)" },
        angleLines: { color: "rgba(255,255,255,0.2)" },
      }
    },
    plugins: {
      legend: {
        labels: { color: "white" },
        position: "left"
      },
    },
  };

  return (
    <div className="bg-white/5 p-4 rounded-xl mt-8">
      <h2 className="text-neonPurple text-center font-bold mb-4">
        Radial Word Frequency 🌌
      </h2>
      <PolarArea data={data} options={options} />
    </div>
  );
}