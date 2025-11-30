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
}

export default function InfoBoxBarChart({ data, campus, year, className = "" }: InfoBoxBarChartProps) {

}