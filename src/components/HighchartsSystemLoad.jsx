import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function HighchartsSystemLoad({ data }) {
  const options = {
    chart: { type: "line", height: 260 },
    title: { text: "System Load (MW)" },
    xAxis: {
      categories: data.map((d) => d.hour),
      title: { text: "Hour" },
    },
    yAxis: {
      title: { text: "System Load (MW)" },
      min: 1600,
      max: 2600,
    },
    series: [
      {
        name: "Load",
        data: data.map((d) => d.load),
        color: "#1976d2",
      },
    ],
    credits: { enabled: false },
    legend: { enabled: false },
    tooltip: { valueSuffix: " MW" },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 600 },
          chartOptions: { legend: { enabled: false } },
        },
      ],
    },
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
