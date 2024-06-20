import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, Title } from "chart.js";

function DoughnutChart({ percentage, label }) {
  Chart.register(ArcElement, Tooltip, Legend, Title);

  const usedColor = {
    High: ["#CC0001", "#FFD6D6"],
    Normal: ["#00B074", "#D9F3EA"],
    Low: ["#2D9BD9", "#DFEFF9"],
  };

  const data = {
    labels: [label],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [usedColor[label][0], usedColor[label][1]],
        borderWidth: 2,
        radius: "40%",
      },
    ],
  };

  return (
    <div style={{ width: "300px", height: "300px" }}>
      <Doughnut
        data={data}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

export default DoughnutChart;
