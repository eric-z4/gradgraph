"use client";

import { useEffect, useRef } from "react";
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

function barChartDataProcess(data: DataColumns[]) {
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
    
    const xAxisData = sortData.map(item => item.name);
    const yAxisData = sortData.map(item => item.value);

    return { xAxisData, yAxisData };
}

export default function InfoBoxBarChart({ data, campus, year, className = "" }: InfoBoxBarChartProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.EChartsType | null>(null);

    const yearNumber = year ? year.replace(/[^\d]/g, '') : '2025';

    useEffect(() => {
        if (chartRef.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }

        return () => {
            chartInstance.current?.dispose();
            chartInstance.current = null;
        };
    }, []);

    useEffect(() => {
        if (!chartInstance.current) return;

        const { xAxisData, yAxisData } = barChartDataProcess(data);

        const option = {
            title: {
                text: `${campus} Degrees by Type`,
                textStyle: {
                    fontsize: 10,
                    color: '#fff'
                },
                subtext: `Fiscal Year ${yearNumber}`,
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
                    data: xAxisData,
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
                    data: yAxisData,
                    color: '#FAF9F6',
                },
            ],
        };

        chartInstance.current.setOption(option);
    }, [data, campus, year, yearNumber]);

    return (
        <div
            ref={chartRef}
            className={className}
            style={{ width: "100%", height: "100%" }}
        />
    );
}
