"use client";

import * as d3 from "d3";
import { getInstanceByDom, init } from "echarts";
import { useEffect, useRef } from "react";
import { useSankeyAndDonutSync } from "../SankeyAndDonutSync";

function sankeyDataProcess(data) {
    // Return empty structure if no data
    if (!data || data.length === 0) {
        return { nodes: [], links: [] };
    }

    const totalDegrees = data.reduce((total, item) => total + parseInt(item.AWARDS), 0);
    let nodes = [{
        name: "Total ",
        depth: 0,
        parent_value: totalDegrees,
        itemStyle: { color: "rgb(230, 230, 230)" },
    }];
    let links = [];
    let prevGroup = [{ name: "Total ", degrees: totalDegrees }];

    for (let i = 1; i <= 5; i++) {
        // Getting groups, "parent" groups, and degrees
        const currentGroup = [...new Set(data.map(item => item["GROUP" + i]))]
            .filter(item => item != "")
            .map(groupRow => {
                const dataRows = data.filter(item => item["GROUP" + i] === groupRow);
                const tempObj = {
                    name: groupRow + i,
                    degrees: dataRows
                        .reduce((total, item) => total + parseInt(item.AWARDS), 0),
                    parent: i > 1 ? dataRows
                        .map(item => item["GROUP" + (i - 1)])[0] + (i - 1) : "Total ",
                };
                tempObj.parent_degrees = prevGroup
                    .filter(item => item.name === tempObj.parent)[0].degrees;

                return tempObj;
            });
        currentGroup.sort((a, b) => {
            if (a.degrees < b.degrees) {
                return 1;
            } else if (a.degrees > b.degrees) {
                return -1;
            } else {
                return 0;
            }
        });

        // Use processed data of current group to create nodes and links
        currentGroup.forEach((item, j) => {
            // Generate color for first group (rest are inherited by parent)
            item.color = i > 1 ? prevGroup.filter(prvItem => prvItem.name === item.parent)[0].color :
                d3.rgb(d3.hsl(360 * (j / currentGroup.length), 1.0, 0.65)).toString();

            nodes.push({
                name: item.name,
                depth: j > 100 ? i + 1 : i,
                parent_value: item.parent_degrees,
                itemStyle: { color: item.color },
                label: {
                    formatter: (d) => {
                        return d.name.slice(0, -1).length > 16 ? d.name.slice(0, -1).slice(0, 16) + "..." : d.name.slice(0, -1);
                    }
                }
            });
            links.push({
                source: item.parent,
                target: item.name,
                value: item.degrees,
                parent_value: item.parent_degrees
            });
        });

        prevGroup = currentGroup;
    }

    return { nodes, links };
}

/*
Some code for intiallizing echart copied from tania.dev
https://www.taniarascia.com/apache-echarts-react/
*/
export default function Sankey({
    data,
    campus,
    className = "",
}) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const option = useRef({});
    const { hoveredCollege, setHoveredCollege } = useSankeyAndDonutSync();

    // Echart initialization
    useEffect(() => {
        if (!chartRef.current) return;
        
        const chart = init(chartRef.current);
        chartInstance.current = chart;

        option.current = {
            title: {
                text: `${campus} Degrees Awarded Breakdown`,
                top: 0,
                textStyle: {
                    fontSize: 16
                },
                subtextStyle: {
                    fontSize: 14
                }
            },
            backgroundColor: "rgba(0, 0, 0, 0)",
            tooltip: {
                trigger: "item",
                triggerOn: "mousemove",
            },
            series: {
                type: "sankey",
                width: "75%",
                height: "90%",
                data: [],
                links: [],
                nodeAlign: "left",
                nodeWidth: 16,
                nodeGap: 3,
                layoutIterations: 0,
                draggable: false,
                roam: true,
                scaleLimit: { min: 1, max: 3 },
                label: {
                    fontSize: 9,
                    fontFamily: "Verdana, sans-serif"
                },
                itemStyle: {
                    borderColor: "rgb(20, 20, 20)",
                    borderWidth: 0.5,
                },
                lineStyle: {
                    color: "gradient",
                    curveness: 0.35,
                    opacity: 0.45,
                },
                emphasis: {
                    focus: "trajectory",
                    label: { formatter: (d) => d.name.slice(0, -1) },
                },
                animationDuration: 500,
                animationEasing: "circularIn",
                tooltip: {
                    position: function (point, params, dom, rect, size)
                    {
                        const offset = 20;
                        let obj = {
                            top: point[1] + offset,
                            left: point[0] - dom.offsetWidth - offset
                        };
                        return obj;
                    },
                    formatter: function (params)
                    {
                        if (params.dataType === "edge") {
                            return `<span style="font-weight:400;">
                                ${params.data.source.slice(0, -1) + " --> " + params.data.target.slice(0, -1)}
                            </span>
                            <span style="float:right;margin-left:20px;"><span style="font-weight:900;">
                                ${params.value + " / " + params.data.parent_value}
                            </span> degrees awarded</span>`;
                        } else if (params.dataType === "node") {
                            return `<span style="font-weight:400;">
                                ${params.name.slice(0, -1)}
                            </span>
                            <span style="float:right;margin-left:20px;"><span style="font-weight:900;">
                                ${params.value + " / " + params.data.parent_value}
                            </span> degrees awarded</span>`;
                        }
                    },
                },
            },
        };

        // Add event listeners for hover sync
        chart.on("mouseover", (params) => {
            if (params.dataType === "node" && params.data.depth === 1) {
                // Only sync for GROUP1 nodes (colleges)
                const nodeIndex = params.dataIndex - 1; // Subtract 1 for "Total" node
                if (nodeIndex >= 0) {
                    // Downplay all nodes first, then highlight will happen via sync
                    chart.dispatchAction({
                        type: "downplay",
                        seriesIndex: 0,
                    });
                    setHoveredCollege(nodeIndex);
                }
            }
        });

        chart.on("mouseout", () => {
            setHoveredCollege(null);
        });

        // Resize chart on window resize
        function handleResize() {
            chart.resize();
        };
        window.addEventListener("resize", handleResize);

        return () => {
            chart?.dispose();
            window.removeEventListener("resize", handleResize);
        };
    }, [setHoveredCollege, campus]);

    // Handle hover from donut chart
    useEffect(() => {
        if (!chartInstance.current) return;

        if (hoveredCollege != null) {
            // Highlight the corresponding college node (add 1 for "Total" node offset)
            chartInstance.current.dispatchAction({
                type: "highlight",
                seriesIndex: 0,
                dataIndex: hoveredCollege + 1,
            });
        } else {
            chartInstance.current.dispatchAction({
                type: "downplay",
                seriesIndex: 0,
            });
        }
    }, [hoveredCollege]);

    // Update sankey with new data
    useEffect(() => {
        const chart = getInstanceByDom(chartRef.current);
        const sankeyData = sankeyDataProcess(data);

        option.current.series.data = sankeyData.nodes;
        option.current.series.links = sankeyData.links;
        option.current.title.text = `${campus} Degrees Awarded Breakdown`;

        chart.setOption(option.current);
    }, [data, campus]);

    return <div ref={chartRef} className={className} onDoubleClick={() => {
        // Reset zoom and center on double click
        option.current.series.zoom = 1;
        option.current.series.center = ["50%", "50%"];
        getInstanceByDom(chartRef.current).setOption(option.current);
    }}></div >;
}
