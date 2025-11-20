"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

function donutDataProcess(data) {
    if (!data || !Array.isArray(data)) {
        return { legendData: [], seriesData: [] };
    }
    
    const colleges = Array.from(
        new Set(data.map(d => d.GROUP1).filter(Boolean))
    );

    const seriesData = colleges.map(college => {
        const totalAwards = data
            .filter(d => d.GROUP1 === college)
            .reduce((sum, d) => sum + Number(d.AWARDS || 0), 0);
        
        return {
            name: college,
            value: totalAwards
        };
    });

    return {
        legendData: colleges,
        seriesData
    };
}

export default function Donut({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart once
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const { legendData, seriesData } = donutDataProcess(data);

    const option = {
      title: {
        text: "UH Manoa Degrees Awarded",
        subtext: "Fiscal Year 2025",
            left: "center",
        top: 0,
        textStyle: {
          fontSize: 14
        },
        subtextStyle: {
          fontSize: 12
        }
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        // type: "scroll",
        orient: "horizontal",
        left: "center",
        bottom: 0,
        data: legendData,
        textStyle: {
          fontSize: 10
        },
        itemGap: 6,
        itemWidth: 10,
        itemHeight: 10
      },
      series: [
        {
          name: "Degrees Awarded",
          type: "pie",
          radius: ["28%", "60%"],
          center: ["50%", "45%"], // [horizontal, vertical]
          data: seriesData,
          label: {
            fontSize: 10,
            distance: 5
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
      chartInstance.current.setOption(option);
  }, [data]);

  useEffect(() => {
    // Cleanup only on unmount
    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  return (
    <div className="col-start-1 col-span-5 bg-orange-100 rounded-[50px] p-2 m-4 flex items-center justify-center">
      <div
        ref={chartRef}
        style={{ width: "95%", height: "95%" }}
      />
    </div>
  );
}
