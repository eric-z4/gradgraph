/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useCallback, useRef, useEffect } from "react";

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
  selectedYear?: string;
  onYearChange?: (year: string) => void;
  isActive?: boolean;
}

export default function LineChartSchoolTrends({
  rawDegreeData,
  campus,
  lineColor = "rgb(29, 120, 180)",
  className = "",
  selectedYear,
  onYearChange,
  isActive = false,
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
    // Initialize based on selectedYear if provided
    const getInitialX = () => {
      if (selectedYear) {
        const yearNum = parseInt(selectedYear.replace(/[^\d]/g, ""), 10);
        const index = x.indexOf(yearNum);
        return index >= 0 ? x[index] : x[x.length - 1];
      }
      return x[x.length - 1];
    };

    const [vlineX, setVlineX] = useState(getInitialX());

    const getInitialY = () => {
      const initialX = getInitialX();
      const index = x.indexOf(initialX);
      return index >= 0 ? y[index] : y[y.length - 1];
    };

    const [markerY, setMarkerY] = useState(getInitialY());
    const lastNotifiedYear = useRef<number>(vlineX);
    const isDragging = useRef(false);
    const recentDrag = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const snapToNearest = useCallback((targetX: number) => {
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
    }, [x, y]);

    // Notify parent of year change only when it actually changes
    const notifyYearChange = useCallback((yearX: number) => {
      if (yearX !== lastNotifiedYear.current && onYearChange) {
        lastNotifiedYear.current = yearX;
        const fiscalYear = `Fiscal Year ${yearX}`;
        onYearChange(fiscalYear);
      }
    }, [onYearChange]);

    // Convert mouse position to data x-coordinate
    const getDataXFromMouseEvent = useCallback((e: MouseEvent | React.MouseEvent) => {
      if (!containerRef.current) return null;
      const plotArea = containerRef.current.querySelector('.plotly') as HTMLElement;

      if (!plotArea) return null;
      const plotRect = plotArea.getBoundingClientRect();
      const mouseX = e.clientX - plotRect.left;
      const plotWidth = plotRect.width;
      
      // Approximate margins
      const leftMargin = 40;
      const rightMargin = 10;
      const effectiveWidth = plotWidth - leftMargin - rightMargin;
      
      if (mouseX < leftMargin || mouseX > plotWidth - rightMargin) return null;
      
      // Map pixel position to data coordinate
      const xRange = [2009.6, 2025.25];
      const dataX = xRange[0] + ((mouseX - leftMargin) / effectiveWidth) * (xRange[1] - xRange[0]);
      
      return dataX;
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!isActive || !isDragging.current) return;

      const dataX = getDataXFromMouseEvent(e);
      if (dataX !== null) {
        const snapped = snapToNearest(dataX);

        if (snapped.x !== vlineX) {
          setVlineX(snapped.x);
          setMarkerY(snapped.y);
          notifyYearChange(snapped.x);
          recentDrag.current = true;
        }
      }
    }, [isActive, getDataXFromMouseEvent, snapToNearest, vlineX, notifyYearChange]);

    const handleMouseUp = useCallback(() => {
      isDragging.current = false;
      // Clear recentDrag shortly after mouseup so subsequent clicks are honored
      setTimeout(() => {
        recentDrag.current = false;
      }, 100);
    }, []);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className={`${className} plot-container`}
      onMouseDown={() => {
        if (!isActive) return;
        isDragging.current = true;
      }}
    >
      <Plot
        data={[
          {
            x,
            y,
            type: "scatter",
            mode: "lines",
            line: { color: lineColor },
            showlegend: false,
            name: "",
            hoverinfo: "skip",
          },
          {
            x: [vlineX, vlineX],
            y: [0, yAxisMax],
            type: "scatter",
            mode: "lines",
            line: { color: "rgba(248, 85, 85, 0.85)", width: 4 },
            hoverinfo: "skip",
            showlegend: false,
            name: "",
          },
          { // Data markers rendered after the vertical line so markers appear on top
            x,
            y,
            type: "scatter",
            mode: "markers",
            marker: { size: 6, color: lineColor, line: { width: 0 } },
            showlegend: false,
            name: "",
            hovertemplate: isActive ? "Year: %{x}<br>Total Degrees: %{y}<extra></extra>" : "",
            hoverinfo: isActive ? "text" : "skip",
          },
          {
            x: [vlineX],
            y: [markerY],
            type: "scatter",
            mode: "markers",
            marker: {
              size: 12,
              color: lineColor,
              line: { width: 2, color: "rgba(248, 85, 85, 1)" }
            },
            hoverinfo: isActive ? "text" : "skip",
            hovertext: `Year: ${vlineX}<br>Total Degrees: ${markerY}`,
            showlegend: false,
            name: "",
          },
        ]}
        layout={{
          dragmode: false,
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
                dtick: 3,
                range: [2009.6, 2025.25],
                fixedrange: true // Disable zoom on x-axis
            },
          yaxis: {
                title: {
                    text: 'Total Degrees', font: { size: 12 },
                    standoff: 10
                },
                tickfont: { size: 10 }, 
                tickmode: 'linear',
                dtick: yTick,
                range: [0, yAxisMax],
                fixedrange: true // Disable zoom on y-axis
            },
          hovermode: "closest",
          showlegend: false,
        } as any}
        config={{
          displayModeBar: false,
          edits: {
            shapePosition: false
          }
        }}
        style={{ width: "100%", height: "100%" }}
        onClick={(evt: any) => {
          if (!isActive) return;

          // Ignore clicks that immediately follow a drag
          if (recentDrag.current) return;
          let snapped: { x: number; y: number } | null = null;

          if (evt.points && evt.points.length > 0) {
            const clickedX = evt.points[0].x;
            snapped = snapToNearest(clickedX);
          } else if (evt.event) {
            const dataX = getDataXFromMouseEvent(evt.event as MouseEvent);
            if (dataX !== null) snapped = snapToNearest(dataX);
          }

          if (snapped) {
            setVlineX(snapped.x);
            setMarkerY(snapped.y);
            notifyYearChange(snapped.x);
          }
        }}
      />
    </div>
  );
}