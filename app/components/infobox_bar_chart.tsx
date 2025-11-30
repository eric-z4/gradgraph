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

}