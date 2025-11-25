"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import * as d3 from "d3";
import { useSankeyAndDonutSync } from "../SankeyAndDonutSync";

function donutDataProcess(data) {
    if (!data || !Array.isArray(data)) {
        return { legendData: [], seriesData: [] };
    }
    
    const colleges = Array.from(
        new Set(data.map(d => d.GROUP1).filter(Boolean))
    );

    // Calculate total awards for each college and sort by degree count (descending)
    const collegeData = colleges.map(college => {
        const totalAwards = data
            .filter(d => d.GROUP1 === college)
            .reduce((sum, d) => sum + Number(d.AWARDS || 0), 0);
        
        return {
            name: college,
            value: totalAwards
        };
    }).sort((a, b) => b.value - a.value);

    // Match D3 color scheme of Sankey chart
    const colors = collegeData.map((_, i) => {
        const hslColor = d3.hsl(360 * (i / collegeData.length), 1.0, 0.65);
        return d3.rgb(hslColor).toString();
    });

    const seriesData = collegeData.map((item, i) => {
        return {
            name: item.name,
            value: item.value,
            itemStyle: { color: colors[i] }
        };
    });

    return {
        legendData: collegeData.map(d => d.name),
        seriesData
    };
}

export default function Donut({ data, campus, year, className="" }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { hoveredCollege, setHoveredCollege } = useSankeyAndDonutSync();

  const yearNumber = year ? year.replace(/[^\d]/g, '') : '2025';

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current);

    chartInstance.current.on("mouseover", params => {
      if (params.dataIndex != null) {
        // Downplay all slices first, then highlight the current one
        chartInstance.current.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
        });
        setHoveredCollege(params.dataIndex);
      }
    });

    chartInstance.current.on("mouseout", () => {
      setHoveredCollege(null);
    });

    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [setHoveredCollege]);

  useEffect(() => {
    if (!chartInstance.current) return;

    if (hoveredCollege != null) {
        chartInstance.current.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: hoveredCollege,
      });
      chartInstance.current.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: hoveredCollege,
      });
    } else {
      chartInstance.current.dispatchAction({ type: "downplay", seriesIndex: 0 });
      chartInstance.current.dispatchAction({ type: "hideTip" });
    }
  }, [hoveredCollege]);

  useEffect(() => {
    if (!chartInstance.current) return;

    const { legendData, seriesData } = donutDataProcess(data);

    const option = {
      title: {
        text: `${campus} Degrees Awarded`,
        subtext: `Fiscal Year ${yearNumber}`,
        left: "center",
        top: 0,
        textStyle: {
          fontSize: 16
        },
        subtextStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: "horizontal",
        left: "center",
        bottom: 0,
        data: legendData,
        textStyle: {
          fontSize: 12
        },
        itemGap: 6,
        itemWidth: 10,
        itemHeight: 10,
        selectedMode: false
      },
      series: [
        {
          name: "Degrees Awarded",
          type: "pie",
          radius: ["28%", "60%"],
          center: ["50%", "45%"], // [horizontal, vertical]
          data: seriesData,
          label: {
            fontSize: 11,
            distance: 5
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            }
          },
          itemStyle: {
            borderColor: "rgb(20, 20, 20)",
            borderWidth: 0.5
          }
        }
      ]
    };
      chartInstance.current.setOption(option);
  }, [data, campus, year, yearNumber]);

    return (
        <div className={className}>
      <div
        ref={chartRef}
        style={{ width: "95%", height: "95%" }}
      />
    </div>
  );
}
