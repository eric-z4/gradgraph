"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import * as d3 from "d3";
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

interface DonutProps {
  data: DataColumns[];
  campus: string;
  year: string;
  className?: string;
}

// Define the type at the top of your file
interface SelectedSlice {
  index: number;
  name: string;
  depth: number;
}

// This is why I don't want to change my sankey.jsx to Typescript
interface CustomOptionProps extends echarts.EChartsCoreOption {
    title: {
        text: string,
        subtext: string,
        left: string,
        top: number,
        textStyle: {
            fontSize: number;
        },
        subtextStyle: {
            fontSize: number;
        };
    },
    tooltip: {
        trigger: string,
        formatter: string;
    },
    legend: {
        orient: string,
        left: string,
        bottom: number,
        data: string[],
        textStyle: {
            fontSize: number;
        },
        itemGap: number,
        itemWidth: number,
        itemHeight: number,
        selectedMode: boolean;
    },
    series: {
            name: string,
            type: string,
            radius: string[],
            center: string[],
            data: {
                name: string,
                value: number,
                itemStyle: { color: string; };
            }[],
            label: {
                fontSize: number,
                distance: number;
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: number,
                    shadowOffsetX: number,
                    shadowColor: string,
                };
            },
            itemStyle: {
                borderColor: string,
                borderWidth: number;
            };
    }[];
}

export default function Donut({ data, campus, year, className="" }: DonutProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const option = useRef<CustomOptionProps | null>(null);
  const { hoveredCollege, setHoveredCollege } = useSankeyAndDonutSync();
    const yearNumber = year ? year.replace(/[^\d]/g, '') : '2025';
    const [legendData, setLegendData] = useState<string[]>([]);
    const [seriesData, setSeriesData] = useState<{ name: string, value: number, itemStyle: {color: string} }[]>([]);
  const { selectedSlice, setSelectedSlice } = useSankeyAndDonutSync();

  useEffect(() => {
    if (!chartRef.current) return;

      chartInstance.current = echarts.init(chartRef.current);

      option.current = {
        title: {
            text: "",
            subtext: "",
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
            data: [],
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
                data: [],
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
      }

    // chartInstance.current.on("mouseover", params => {
    //   if (params.dataIndex != null && chartInstance.current) {
    //     // Downplay all slices first, then highlight the current one
    //     chartInstance.current.dispatchAction({
    //       type: "downplay",
    //       seriesIndex: 0,
    //     });
    //     setHoveredCollege(params.dataIndex);
    //   }
    // });
    chartInstance.current.on("mouseover", params => {
      if (params.dataIndex != null) {
        setHoveredCollege(params.dataIndex);
      }
    });

    chartInstance.current.on("mouseout", () => {
      setHoveredCollege(null);
    });

    // Instance for selecting slices
   chartInstance.current.on("click", params => {
      if (params.dataIndex != null && option.current) {
        const sliceName = option.current.series[0].data[params.dataIndex].name;

        setSelectedSlice((prev: SelectedSlice | null) =>
          prev && prev.index === params.dataIndex ? null : {
            index: params.dataIndex,
            name: sliceName,
            depth: 1,
          }
        );
      }
    });

    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [setHoveredCollege, setSelectedSlice]);

  // Highlight effect (hover + click)
  useEffect(() => {
    if (!chartInstance.current) return;

    // Downplay everything
    chartInstance.current.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
    });

    // Highlight selected slice first (if any)
    if (selectedSlice != null) {
      chartInstance.current.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: selectedSlice.index,
      });
    }

    // Highlight hovered slice on top of selected slice
    if (hoveredCollege != null && hoveredCollege !== selectedSlice) {
      chartInstance.current.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: hoveredCollege,
      });
    }

    // Show tooltip for hovered slice, or selected if none hovered
    const tooltipIndex = hoveredCollege ?? selectedSlice;
    if (tooltipIndex != null) {
      chartInstance.current.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: tooltipIndex,
      });
    } else {
      chartInstance.current.dispatchAction({ type: "hideTip" });
    }
  }, [hoveredCollege, selectedSlice]);




  // useEffect(() => {
  //   if (!chartInstance.current) return;

  //   // Downplay all slices first
  //   chartInstance.current.dispatchAction({
  //     type: "downplay",
  //     seriesIndex: 0,
  //   });

  //   if (selectedSlice != null) {
  //     chartInstance.current.dispatchAction({
  //       type: "highlight",
  //       seriesIndex: 0,
  //       dataIndex: selectedSlice,
  //     });
  //     chartInstance.current.dispatchAction({
  //       type: "showTip",
  //       seriesIndex: 0,
  //       dataIndex: selectedSlice,
  //     });
  //   } else if (hoveredCollege != null) {
  //     chartInstance.current.dispatchAction({
  //       type: "highlight",
  //       seriesIndex: 0,
  //       dataIndex: hoveredCollege,
  //     });
  //     chartInstance.current.dispatchAction({
  //       type: "showTip",
  //       seriesIndex: 0,
  //       dataIndex: hoveredCollege,
  //     });
  //   } else {
  //     chartInstance.current.dispatchAction({ type: "hideTip" });
  //   }
  // }, [hoveredCollege]);
  //   if (hoveredCollege != null) {
  //       chartInstance.current.dispatchAction({
  //       type: "highlight",
  //       seriesIndex: 0,
  //       dataIndex: hoveredCollege,
  //     });
  //     chartInstance.current.dispatchAction({
  //       type: "showTip",
  //       seriesIndex: 0,
  //       dataIndex: hoveredCollege,
  //     });
  //   } else {
  //     chartInstance.current.dispatchAction({ type: "downplay", seriesIndex: 0 });
  //     chartInstance.current.dispatchAction({ type: "hideTip" });
  //   }
  // }, [hoveredCollege]);



    // Asynchronously process the data when it changes
    useEffect(() => {
        async function donutDataProcess(data: DataColumns[]) {
            if (!data || !Array.isArray(data)) {
                return { legendData: [], seriesData: [] };
            }

            const totalAwards = {} as Record<string, number>;

            for (const row of data) {
                const college = row.GROUP1;
                if (!college) continue;

                const awards = Number(row.AWARDS) || 0;
                totalAwards[college] = (totalAwards[college] || 0) + awards;
            }

            // Create array of the dictionary objects and sort by value descending
            const collegeData = Object.entries(totalAwards)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value);

            // Match D3 color scheme of the Sankey chart
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

            setLegendData(collegeData.map(d => d.name))
            setSeriesData(seriesData);
        }
        donutDataProcess(data);

        return () => { };
    }, [data])

  useEffect(() => {
    if (!chartInstance.current) return;

      if (option.current != null) {
          option.current.title.text = `${campus} Degrees Awarded`;
          option.current.title.subtext = `Fiscal Year ${yearNumber}`;
          option.current.legend.data = legendData;
          option.current.series[0].data = seriesData;

          chartInstance.current.setOption(option.current);
      }
  }, [legendData, seriesData, campus, year, yearNumber]);

    return (
        <div className={className}>
      <div
        ref={chartRef}
        style={{ width: "95%", height: "95%" }}
      />
    </div>
  );
}
