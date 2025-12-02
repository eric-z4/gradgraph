"use client";

import * as d3 from "d3";
import { init } from "echarts";
import { useEffect, useRef } from "react";
import { useSankeyAndDonutSync } from "../SankeyAndDonutSync";

function sankeyDataProcess(data) {
    // Return empty structure if no data
    if (!data || data.length === 0) {
        return { nodes: [], links: [] };
    }

    const nodeLimit = 100;
    const totalDegrees = data.reduce((total, item) => total + parseInt(item.AWARDS), 0);
    let nodes = [{
        name: "Total ",
        depth: 0,
        parent_value: totalDegrees,
        itemStyle: { color: "rgb(230, 230, 230)" },
    }];
    let links = [];
    let prevGroup = [{ node: {}, link: {} }];
    let depthOffset = 0;

    for (let i = 1; i <= 5; i++) {
        const currentGroup = [...new Set(data.map(item => item["GROUP" + i]))]
            .filter(item => item != "")
            .map((groupRow, j) => {
                const dataRows = data.filter(item => item["GROUP" + i] === groupRow);
                const dataDegrees = dataRows.reduce((total, item) => total + parseInt(item.AWARDS), 0);
                const dataParent = i > 1 ? dataRows.map(item => item["GROUP" + (i - 1)])[0] + (i - 1) : "Total ";
                const dataParentDegrees = i > 1 ? prevGroup.filter(prvItem => prvItem.link.target === dataParent)[0].link.value : totalDegrees;

                const node = {
                    name: groupRow + i,
                    depth: i,
                    parent_value: dataParentDegrees,
                    itemStyle: { color: "rgb(0, 0, 0)" },
                    label: {
                        formatter: (d) => {
                            return d.name.slice(0, -1).length > 16 ? d.name.slice(0, -1).slice(0, 16) + "..." : d.name.slice(0, -1);
                        }
                    }
                };
                const link = {
                    source: dataParent,
                    target: groupRow + i,
                    value: dataDegrees,
                    parent_value: dataParentDegrees
                };

                return {node, link};
            });
        currentGroup.sort((a, b) => {
            if (a.link.value < b.link.value) {
                return 1;
            } else if (a.link.value < b.link.value) {
                return -1;
            } else {
                return 0;
            }
        });
        currentGroup.forEach((item, k) => {
            item.node.itemStyle.color = i > 1 ? prevGroup.filter(prvItem => prvItem.link.target === item.link.source)[0].node.itemStyle.color : d3.rgb(d3.hsl(360 * (k / currentGroup.length), 1.0, 0.65)).toString();
            item.node.depth += depthOffset;

            if (k > nodeLimit * (depthOffset + 1)) {
                depthOffset++;
            }

            nodes.push(item.node);
            links.push(item.link);
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
                text: "",
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
            chartInstance.current = null;
            window.removeEventListener("resize", handleResize);
        };
    }, [setHoveredCollege]);

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
        const { nodes, links } = sankeyDataProcess(data);
        
        option.current.series.data = nodes;
        option.current.series.links = links;
        option.current.title.text = `${campus} Degrees Awarded Breakdown`;

        chartInstance.current.setOption(option.current);
    }, [data, campus]);

    return <div ref={chartRef} className={className} onDoubleClick={() => {
        // Reset zoom and center on double click
        chartInstance.current.setOption({ series: { type:"sankey", zoom: 1, center: ["50%", "50%"] } });
    }}></div >;
}
