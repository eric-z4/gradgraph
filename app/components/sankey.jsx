"use client";

import * as d3 from "d3";
import { init } from "echarts";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSankeyAndDonutSync } from "../SankeyAndDonutSync";

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
    const { hoveredCollege, setHoveredCollege, selectedSlice, setSelectedSlice } = useSankeyAndDonutSync();
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

    
    // Zoom and center Sankey on a specific node
// const zoomToNode = useCallback((nodeIndex, zoomFactor = 2) => {
//     if (!chartInstance.current || !nodes[nodeIndex + 1]) return;

//     const seriesModel = chartInstance.current.getModel().getSeries()[0];
//     const layout = seriesModel.getData().getItemLayout(nodeIndex + 1);

//     if (!layout) return;

//     const chartDom = chartRef.current;
//     const chartWidth = chartDom.offsetWidth;
//     const chartHeight = chartDom.offsetHeight;

//     const nodeCenterX = layout.x + layout.width / 2;
//     const nodeCenterY = layout.y + layout.height / 2;

//     const centerXPercent = (nodeCenterX / chartWidth) * 100;
//     const centerYPercent = (nodeCenterY / chartHeight) * 100;

//     chartInstance.current.setOption({
//         series: [{
//             type: "sankey",
//             center: [`${centerXPercent}%`, `${centerYPercent}%`],
//             zoom: zoomFactor
//         }]
//     });
// }, [chartInstance, nodes, chartRef]);

// const zoomToNode = useCallback((nodeIndex, zoomFactor = 1.8) => {
//     if (!chartInstance.current || !nodes[nodeIndex + 1]) return;

//     const seriesModel = chartInstance.current.getModel().getSeries()[0];
//     const layout = seriesModel.getData().getItemLayout(nodeIndex + 1);

//     if (!layout) return;

//     const chartDom = chartRef.current;
//     const chartWidth = chartDom.offsetWidth;
//     const chartHeight = chartDom.offsetHeight;

//     const nodeCenterX = layout.x + layout.width / 2;
//     const nodeCenterY = layout.y + layout.height / 2;

//     const targetCenterX = chartWidth / 2;
//     const targetCenterY = chartHeight / 2;

//     const translateX = targetCenterX - nodeCenterX;
//     const translateY = targetCenterY - nodeCenterY;

//     chartInstance.current.setOption({
//         series: [{
//             type: "sankey",
//             zoom: zoomFactor,
//             center: [
//                 `${50 + (translateX / chartWidth) * 100}%`,
//                 `${50 + (translateY / chartHeight) * 100}%`
//             ]
//         }]
//     }, { replaceMerge: ['series'] });
// }, [nodes]);

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
                                ${params.value + " / " + params.data.parent_value.value}
                            </span> degrees awarded</span>`;
                        } else if (params.dataType === "node") {
                            return `<span style="font-weight:400;">
                                ${params.name.slice(0, -1)}
                            </span>
                            <span style="float:right;margin-left:20px;"><span style="font-weight:900;">
                                ${params.value + " / " + params.data.parent_value.value}
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
                    setHoveredCollege(nodeIndex);
                }
            }
        });

        // // For selecting nodes like donut chart
        chart.on("click", (params) => {
            if (params.dataType === "node" && params.data.depth === 1 && option.current) {
                const nodeIndex = params.dataIndex - 1;
                if (nodeIndex >= 0) {
                    // Get the node's name
                    const sliceName = option.current.series.data[params.dataIndex].name.slice(0, -1); // remove depth number

                    setSelectedSlice(prev =>
                        prev?.name === sliceName
                            ? null
                            : { index: params.dataIndex, name: sliceName }
                    );

                    // Optional: zoomToNode(nodeIndex);
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
    }, [setHoveredCollege, setSelectedSlice]);

    // Handle hover from donut chart
    useEffect(() => {
        if (!chartInstance.current) return;

        // Downplay all nodes first
        chartInstance.current.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
        });

        // If hovering, highlight hovered node (temporary)
        if (hoveredCollege != null) {
            chartInstance.current.dispatchAction({
                type: "highlight",
                seriesIndex: 0,
                dataIndex: hoveredCollege + 1,
            });
            chartInstance.current.dispatchAction({
                type: "showTip",
                seriesIndex: 0,
                dataIndex: hoveredCollege + 1,
            });
        } 
        // If not hovering but have selection, highlight selected node
        else if (selectedSlice != null) {
            chartInstance.current.dispatchAction({
                type: "highlight",
                seriesIndex: 0,
                dataIndex: selectedSlice.index + 1,
            });
            chartInstance.current.dispatchAction({
                type: "showTip",
                seriesIndex: 0,
                dataIndex: selectedSlice.index + 1,
            });
        } 
        // No hover and no selection, hide tooltip
        else {
            chartInstance.current.dispatchAction({ type: "hideTip" });
        }
    }, [hoveredCollege, selectedSlice, nodes]);

    // Asynchronously process the data when it changes
    useEffect(() => {
        async function sankeyDataProcess(data) {
            // Return empty structure if no data
            if (!data || data.length === 0) {
                return { nodes: [], links: [] };
            }

            const nodeLimit = 100;
            const totalDegrees = data.reduce((total, item) => total + parseInt(item.AWARDS), 0);
            const groupCount = [0, 0, 0, 0, 0];
            let mappedData = new Map();
            let depthOffset = 0;

            data.forEach(item => {
                for (let i = 1; i <= 5; i++) {
                    const currentItemGroup = mappedData.get(item["GROUP" + i] + i);
                    if (currentItemGroup == undefined && item["GROUP" + i] !== "") {
                        mappedData.set(item["GROUP" + i] + i, {
                            node: {
                                name: item["GROUP" + i] + i,
                                depth: i,
                                degrees: { value: item.AWARDS },
                                parent_value: i > 1 ? mappedData.get(item["GROUP" + (i - 1)] + (i - 1)).node.degrees : { value: totalDegrees },
                                itemStyle: i > 1 ? mappedData.get(item["GROUP" + (i - 1)] + (i - 1)).node.itemStyle : { color: "rgb(0, 0, 0)" },
                                label: {
                                    formatter: (d) => {
                                        return d.name.slice(0, -1).length > 16 ? d.name.slice(0, -1).slice(0, 16) + "..." : d.name.slice(0, -1);
                                    }
                                }
                            },
                            link: {
                                source: i > 1 ? item["GROUP" + (i - 1)] + (i - 1) : "Total ",
                                target: item["GROUP" + i] + i,
                                value: item.AWARDS,
                                parent_value: i > 1 ? mappedData.get(item["GROUP" + (i - 1)]+ (i - 1)).node.degrees : { value: totalDegrees }
                            }
                        });
                        groupCount[i - 1]++;
                    }
                    else if (currentItemGroup != undefined) {
                        currentItemGroup.node.degrees.value += item.AWARDS;
                        currentItemGroup.link.value += item.AWARDS;
                    }
                }
            });
            const processedDataArr = [...mappedData.values()];
            processedDataArr.sort((a, b) => {
                return (b.link.value - a.link.value) - ((parseInt(b.node.name.slice(-1)) - parseInt(a.node.name.slice(-1))) * 10000);
            });
            processedDataArr
                .filter(item => parseInt(item.node.name.slice(-1)) === 1)
                .forEach((item, j, array) => item.node.itemStyle.color = d3.rgb(d3.hsl(360 * (j / array.length), 1.0, 0.65)).toString());
            for (let k = 0; k < 5; k++) {
                if (groupCount[k] > nodeLimit) {
                    depthOffset++;
                    processedDataArr
                        .filter(item => parseInt(item.node.name.slice(-1)) === k + 1)
                        .slice(nodeLimit)
                        .forEach(item => { item.node.depth += depthOffset; });
                }
                else if (depthOffset > 0) {
                    processedDataArr
                        .filter(item => parseInt(item.node.name.slice(-1)) === k + 1)
                        .forEach(item => { item.node.depth += depthOffset; });
                }
            }

            setNodes([{
                name: "Total ",
                depth: 0,
                parent_value: { value: totalDegrees },
                itemStyle: { color: "rgb(230, 230, 230)" },
            }].concat(processedDataArr.map(item => item.node)));
            setLinks(processedDataArr.map(item => item.link));
        }
        sankeyDataProcess(data);

    }, [data])

    // Update sankey with new data
    useEffect(() => {
        option.current.series.data = nodes;
        option.current.series.links = links;
        option.current.title.text = `${campus} Degrees Awarded Breakdown`;

        chartInstance.current.setOption(option.current);
    }, [nodes, links, campus]);

    return <div ref={chartRef} className={className} onDoubleClick={() => {
        // Reset zoom and center on double click
        chartInstance.current.setOption({ series: { type:"sankey", zoom: 1, center: ["50%", "50%"] } });
    }}></div >;
}
