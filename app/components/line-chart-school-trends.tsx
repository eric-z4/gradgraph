/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

// Dynamically import Plotly with SSR disabled (avoids issues with server-side rendering)
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface DataColumns {
  FISCAL_YEAR: string;
  CAMPUS: string;
  CIP: string;
  CIP_DESC: string;
  GROUP1: string;
  GROUP2: string;
  GROUP3: string;
  GROUP4: string;
  GROUP5: string;
  OUTCOME: string;
  AWARDS: number;
}

interface LineChartProps {
  rawDegreeData: DataColumns[];
  campus: string;
  lineColor?: string;
  className?: string;
}

export default function LineChartSchoolTrends({
  rawDegreeData,
  campus,
  lineColor = "",
  className = "",
}: LineChartProps) {
  // Memoize data to avoid unnecessary re-renders
  const { x, y, yMax } = useMemo(() => {
    // Filter data for the selected campus
    const campusData = rawDegreeData.filter((d) => d.CAMPUS === campus);

    // Aggregate total degrees by year
    const totals = campusData.reduce((acc, row) => {
        // Extract only the numeric year from FISCAL_YEAR
        const year = parseInt(row.FISCAL_YEAR.replace(/[^\d]/g, ""), 10);
        acc[year] = (acc[year] || 0) + row.AWARDS;
        return acc;
    }, {} as Record<number, number>);

    const sortedYears = Object.keys(totals)
        .map(Number)
        // Sort years numerically
        .sort((a, b) => a - b); 

    const yValues = sortedYears.map((year) => totals[year]);
    const maxY = Math.max(...yValues);

    return {
        x: sortedYears,
        y: yValues,
        yMax: maxY
    };
    }, [rawDegreeData, campus]);

    // Round up yMax to nearest 1000
    const yAxisMax = Math.ceil(yMax / 1000) * 1000;

     // State for vertical line position
    const [vlineX, setVlineX] = useState(x[Math.floor(x.length / 2)]);

  return (
    <div className={className}>
      <Plot
        data={[
          {
            x,
            y,
            type: "scatter",
            mode: "lines+markers",
            line: { color: lineColor },
            showlegend: false,
          },
          {
            // Vertical line as a scatter trace with two points
            x: [vlineX, vlineX],
            y: [0, yAxisMax],
            type: "scatter",
            mode: "lines+markers", // markers needed for draggable points
            marker: { size: 10, color: "red" },
            line: { color: "red", width: 2 },
            hoverinfo: "none",
            showlegend: false,
          },
        ]}
        layout={{
          title: { text: `${campus}` },
          dragmode: "x", // enables horizontal dragging of points
          xaxis: {
                title: {
                    text: 'Year'
                },
                tickmode: 'linear',
                dtick: 3,             // interval of tickmarks
                range: [2009.6, 2025.25] // adjust padding of x-axis for visual readability
            },
          yaxis: {
                title: {
                    text: 'Total Degrees',
                    standoff: 10
                },
                tickmode: 'linear',
                dtick: 1000,
                range: [-200, yAxisMax]  // adjust padding of y-axis for visual readability
            },
          margin: { t: 40, r: 20, l: 70, b: 70 },
          shapes: [
            {
              type: "line",
              x0: vlineX,
              x1: vlineX,
              y0: 0,
              y1: yAxisMax,
              line: { color: "red", width: 2 },
            },
          ],
          // This makes shapes draggable
          editable: true,
        //   height: 350,
        //   width: 300,
          hovermode: "closest",
        } as any}
        style={{ width: "100%", height: 350 }}
        onRelayout={(event) => {
          const e = event as any;
          if (e["shapes[0].x0"] !== undefined) {
            setVlineX(e["shapes[0].x0"]);
          }
        }}
      />
    </div>
  );
}



// import { Line } from "react-chartjs-2";
// import {
//     Chart as ChartJS,
//     LineElement,
//     PointElement,
//     CategoryScale,
//     LinearScale,
//     Tooltip,
//     Legend
// } from "chart.js";
// import { useMemo } from "react";

// ChartJS.register(
//     LineElement,
//     PointElement,
//     CategoryScale,
//     LinearScale,
//     Tooltip,
//     Legend
// );

// interface DataColumns {
//     FISCAL_YEAR: string;
//     CAMPUS: string;
//     CIP: string;
//     CIP_DESC: string;
//     GROUP1: string;
//     GROUP2: string;
//     GROUP3: string;
//     GROUP4: string;
//     GROUP5: string;
//     OUTCOME: string;
//     AWARDS: number;
// }

// export default function LineChartSchoolTrends({
//     rawDegreeData,
//     campus,
//     className = ""
// }: Readonly<{
//     rawDegreeData: Array<DataColumns>;
//     campus: string;
//     className?: string;
// }>) {

//     // Aggregate campus totals by year
//     const yearTotals = useMemo(() => {
//         const totals: Record<string, number> = {};

//         rawDegreeData
//             .filter((row) => row.CAMPUS === campus)
//             .forEach((row) => {
//                 totals[row.FISCAL_YEAR] =
//                     (totals[row.FISCAL_YEAR] || 0) + row.AWARDS;
//             });

//         return Object.entries(totals)
//             .map(([year, total]) => ({ year, total }))
//             .sort((a, b) => a.year.localeCompare(b.year));
//     }, [rawDegreeData, campus]);

//     const data = {
//         labels: yearTotals.map((d) => d.year),
//         datasets: [
//             {
//                 label: `${campus} – Total Graduates`,
//                 data: yearTotals.map((d) => d.total),
//                 borderColor: "rgb(53, 162, 235)",
//                 backgroundColor: "rgba(53, 162, 235, 0.4)",
//                 tension: 0.2
//             }
//         ]
//     };

//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     };

//     return (
//         <div className={className}>
//             <Line data={data} options={options} />
//         </div>
//     );
// }


