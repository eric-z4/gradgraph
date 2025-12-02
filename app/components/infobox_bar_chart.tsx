"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

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

interface InfoBoxBarChartProps {
  data: DataColumns[];
  campus: string;
  year: string;
  className?: string;
}

export default function InfoBoxBarChart({ data, campus, year, className = "" }: InfoBoxBarChartProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.EChartsType | null>(null);
    const option = useRef({});
    const yearNumber = year ? year.replace(/[^\d]/g, '') : '2025';
    const [xAxisData, setXAxisData] = useState<string[]>([]);
    const [yAxisData, setYAxisData] = useState<number[]>([]);

    useEffect(() => {
        if (chartRef.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }
        
        option.current = {
            title: {
                text: "",
                textStyle: {
                    fontsize: 10,
                    color: '#fff'
                },
                subtext: "",
                subtextStyle: {
                    color: 'fff'
                }
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            grid: {
                left: "8%",
                right: "8%",
                bottom: "5%",
                containLabel: true,
            },
            xAxis: [
                {
                    type: "category",
                    data: [],
                    axisTick: { alignWithLabel: true },
                    axisLabel: { color: '#fff', fontSize: 12, rotate: 20 },
                },
            ],
            yAxis: [
                {
                    type: "value",
                    axisLabel: { color: '#fff', fontSize: 12 }
                }
            ],
            series: [
                {
                    name: "Awards",
                    type: "bar",
                    barWidth: "60%",
                    data: [],
                    color: '#FAF9F6',
                },
            ],
        }

        return () => {
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, []);

    // Asynchronously process the data when it changes
    useEffect(() => {
        async function barChartDataProcess(data: DataColumns[]) {
            const degreeTypeTotals = {} as Record<string, number>;

            for (const row of data) {
                const degreeType = row.OUTCOME;
                if (!degreeType) continue;

                const awards = Number(row.AWARDS) || 0;
                degreeTypeTotals[degreeType] = (degreeTypeTotals[degreeType] || 0) + awards;
            }

            const sortData = Object.entries(degreeTypeTotals)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value);

            setXAxisData(sortData.map(item => item.name));
            setYAxisData(sortData.map(item => item.value));
        }
        barChartDataProcess(data);
        
        return () => {};
    }, [data])

    useEffect(() => {
        if (!chartInstance.current) return;

        // I tried using echarts.ComposeOption on option's useRef to get rid of these type errors,
        // but I kept encountering error TS18048 and TS2339. This is why my Sankey is JSX.
        // Note that this WORKS, just that typescript doesn't like option not having a type
        option.current.title.text = `${campus} Degrees Awarded`;
        option.current.title.subtext = `Fiscal Year ${yearNumber}`;
        option.current.xAxis[0].data = xAxisData;
        option.current.series[0].data = yAxisData;

        chartInstance.current.setOption(option.current);
    }, [xAxisData, yAxisData, data, campus, year, yearNumber]);

    return (
        <div
            ref={chartRef}
            className={className}
            style={{ width: "100%", height: "100%" }}
        />
    );
}
