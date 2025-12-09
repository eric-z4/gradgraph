"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { useSankeyAndDonutSync } from "../SankeyAndDonutSync";

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

// This is why I don't want to change my sankey.jsx to Typescript
interface CustomOptionProps extends echarts.EChartsCoreOption {
    title: {
        text: string,
        textStyle: {
            fontsize: number,
            color: string;
        },
        subtext: string,
        subtextStyle: {
            color: string;
        };
    },
    tooltip: {
        trigger: string,
        axisPointer: {
            type: string,
        },
    },
    grid: {
        left: string,
        right: string,
        bottom: string,
        containLabel: boolean,
    },
    xAxis: {
            type: string,
            data: string[],
            axisTick: { alignWithLabel: boolean; },
            axisLabel: { color: string, fontSize: number, rotate: number; },
    }[],
    yAxis: {
            type: string,
            axisLabel: { color: string, fontSize: number; };
    }[],
    series: {
            name: string,
            type: string,
            barWidth: string,
            data: number[],
            color: string,
    }[]
}

export default function InfoBoxBarChart({ data, campus, year, className = "" }: InfoBoxBarChartProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.EChartsType | null>(null);
    const option = useRef<CustomOptionProps | null>(null);
    const yearNumber = year ? year.replace(/[^\d]/g, '') : '2025';
    const [xAxisData, setXAxisData] = useState<string[]>([]);
    const [yAxisData, setYAxisData] = useState<number[]>([]);
    const { selectedSlice } = useSankeyAndDonutSync();

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

            // If a donut slice (college) is selected, filter by GROUP1, GROUP2, etc.
            // const filteredByCollege = selectedSlice
            //     ? data.filter(row => row.GROUP1 === selectedSlice.name)
            //     : data;
            const filterByCollegeOrMajorData = selectedSlice
                ? data.filter(row => {
                    // Use GROUP4 if depth > 3
                    const depthCol = Math.min(selectedSlice.depth, 3);
                    const groupCol = `GROUP${depthCol}` as keyof DataColumns;
                    return row[groupCol] === selectedSlice.name;
                })
                : data;

            const degreeTypeTotals = {} as Record<string, number>;

            for (const row of filterByCollegeOrMajorData) {
                const degreeType = row.OUTCOME;
                if (!degreeType) continue;

                const awards = Number(row.AWARDS) || 0;
                degreeTypeTotals[degreeType] = (degreeTypeTotals[degreeType] || 0) + awards;
            }

            const sortData = Object.entries(degreeTypeTotals)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value);

            // setXAxisData(sortData.map(item => item.name));
            // Customize xAxis labels by removing the word "degree" or "degrees"
            setXAxisData(
                sortData.map(item =>
                    item.name.replace(/degrees?/i, "").trim()
                )
            );
            setYAxisData(sortData.map(item => item.value));
        }
        barChartDataProcess(data);
        
        return () => {};
    }, [data, selectedSlice])

    useEffect(() => {
        if (!chartInstance.current) return;

        if (option.current != null) {
            option.current.title.text = selectedSlice
                ? `${selectedSlice.name}`
                : `${campus} Degrees Awarded`;
            option.current.title.subtext = `Fiscal Year ${yearNumber}`;
            option.current.xAxis[0].data = xAxisData;
            option.current.series[0].data = yAxisData;

            chartInstance.current.setOption(option.current);
        }
    }, [xAxisData, yAxisData, data, campus, year, yearNumber, selectedSlice]);

    return (
        <div
            ref={chartRef}
            className={className}
            style={{ width: "100%", height: "100%" }}
        />
    );
}
