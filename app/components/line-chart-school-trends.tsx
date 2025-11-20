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
  lineColor = "rgb(29, 120, 180)",
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
    // const yAxisMax = Math.ceil(yMax / 1000) * 1000;
    // Dynamic Y axis logic
    const { yAxisMax, yTick } = useMemo(() => {
      if (yMax < 1000) {
        return { yAxisMax: 1200, yTick: 200 };
      }
      return {
        yAxisMax: Math.ceil(yMax / 1000) * 1000,
        yTick: 1000,
      };
    }, [yMax]);

     // State for vertical line position
    const [vlineX, setVlineX] = useState(x[Math.floor(x.length / 2)]);

    const [markerY, setMarkerY] = useState(y[8]);

    function snapToNearest(targetX: number) {
      let nearestIndex = 0;
      let minDist = Infinity;

      x.forEach((val, i) => {
        const dist = Math.abs(val - targetX);
        if (dist < minDist) {
          minDist = dist;
          nearestIndex = i;
        }
      });

      return { x: x[nearestIndex], y: y[nearestIndex] };
    }


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
            // Vertical line as a scatter trace with 1 point
            x: [vlineX],
            y: [markerY],
            type: "scatter",
            mode: "markers",
            marker: {
              size: 12,
              color: lineColor,
              line: { width: 2, color: "rgba(248, 85, 85, 1)" }
            },
            hoverinfo: "skip",
            showlegend: false,
          },
        ]}
        layout={{
          // title: { text: `${campus}` },
          dragmode: "x", // enables horizontal dragging of points
          height: 220,
          margin: { t: 10, r: 10, l: 50, b: 30 },
          automargin: true,
          autosize: true,
          xaxis: {
                title: {
                    text: 'Year', font: { size: 12 }
                },
                tickfont: { size: 10 },
                tickmode: 'linear',
                dtick: 3,             // interval of tickmarks
                range: [2009.6, 2025.25] // adjust padding of x-axis for visual readability
            },
          yaxis: {
                title: {
                    text: 'Total Degrees', font: { size: 12 },
                    standoff: 10
                },
                tickfont: { size: 10 }, 
                tickmode: 'linear',
                dtick: yTick,
                range: [0, yAxisMax]  // adjust padding of y-axis for visual readability
            },
          shapes: [
            {
              type: "line",
              x0: vlineX,
              x1: vlineX,
              y0: 0,
              y1: yAxisMax,
              line: { color: "rgba(248, 85, 85, 0.7)", width: 2 },
              layer: "below",
            },
          ],
          // This makes shapes draggable?
          editable: true,
          hovermode: "closest",
        } as any}
        style={{ width: "100%", height: "100%" }}
        onRelayout={(ev: any) => {
          if (ev["shapes[0].x0"] !== undefined) {
            const newX = ev["shapes[0].x0"];
            const snapped = snapToNearest(newX);

            setVlineX(snapped.x);
            setMarkerY(snapped.y);
          }
        }}
      />
    </div>
  );
}


// ChartJS implementation
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


