"use client";

import * as d3 from "d3";
import { getInstanceByDom, init } from "echarts";
import { useEffect, useRef } from "react";

function sankeyDataProcess(data) {
    //GROUPING
    const group1 = [...new Set(data.map(item => item.GROUP1))];
    const group2 = [...new Set(data.map(item => item.GROUP2))];
    const group3 = [...new Set(data.map(item => item.GROUP3))].filter(item => item != "");
    const group4 = [...new Set(data.map(item => item.GROUP4))].filter(item => item != "");
    const group5 = [...new Set(data.map(item => item.GROUP5))].filter(item => item != "");
    const groupOrder = [group1, group2, group3, group4, group5];
    const degreeDataByGroup = [];
    const totalDegrees = data.reduce((total, item) => total + parseInt(item.AWARDS), 0);

    for (let i = groupOrder.length - 1; i >= 0; i--) {
        let temp = [];
        let tempLen = groupOrder[i].length;

        for (let j = 0; j < tempLen; j++) {
            let tempName = groupOrder[i][j];
            let tempCategory = [...new Set(data
                .filter(item => item["GROUP" + (i + 1)] == tempName)
                .map(item => item.CIP_DESC))];
            let tempObj = {
                name: groupOrder[i][j] + (i + 1),
                degrees: data
                    .filter(item => item["GROUP" + (i + 1)] == tempName)
                    .reduce((total, item) => total + parseInt(item.AWARDS), 0),
                parent: i != 0 ? data
                    .filter(item => item["GROUP" + (i + 1)] == tempName)
                    .map(item => item["GROUP" + i])[0] + i : "Total ",
                parent_degrees: i != 0 ? data
                    .filter(item => item["GROUP" + i] == data
                        .filter(item => item["GROUP" + (i + 1)] == tempName)
                        .map(item => item["GROUP" + i])[0])
                    .reduce((total, item) => total + parseInt(item.AWARDS), 0) : totalDegrees,
            };
            if (tempCategory.length == 1) {
                tempObj.category = tempCategory[0];
            }

            temp.push(tempObj);
        }

        temp.sort((a, b) => {
            if (a.degrees < b.degrees) {
                return 1;
            } else if (a.degrees > b.degrees) {
                return -1;
            } else {
                return 0;
            }
        })

        degreeDataByGroup.push(temp);
    }

    degreeDataByGroup.reverse();

    //TURNING IT INTO NODES AND LINKS
    let tempColorsArr = [];

    let tempGroup1ColorArr = [];
    for (let j = 0; j < degreeDataByGroup[0].length; j++) {
        let tempColor = d3.hsl(360 * (j / degreeDataByGroup[0].length), 1.0, 0.65);
        tempGroup1ColorArr.push(d3.rgb(tempColor).toString());
    }
    tempColorsArr.push(tempGroup1ColorArr);

    for (let i = 1; i < degreeDataByGroup.length; i++) {
        let tempGroupColorArr = []
        for (let j = 0; j < degreeDataByGroup[i].length; j++) {
            let parentIndex = degreeDataByGroup[i - 1].findIndex(item => item.name == degreeDataByGroup[i][j].parent);
            let tempColor = d3.hsl(tempColorsArr[i - 1][parentIndex]);
            //let lightness = d3.interpolateNumber(0.1, 0.15)
            //tempColor.l += lightness(j / degreeDataByGroup[i].length);
            tempGroupColorArr.push(d3.rgb(tempColor).toString());
        }
        tempColorsArr.push(tempGroupColorArr)
    }

    let degreeGroupForNodes = [...degreeDataByGroup]
    degreeGroupForNodes.reverse()
        .forEach((group, i) => {
            if (i > 1 && group.length > 100) {
                degreeGroupForNodes[i - 2] = degreeGroupForNodes[i - 1];
                degreeGroupForNodes[i - 1] = group.slice(100);
                degreeGroupForNodes[i] = group.slice(0, 100);
            }
        });
    degreeGroupForNodes.reverse();

    const nodes = [{
        name: "Total ",
        depth: 0,
        parent_value: totalDegrees,
        itemStyle: { color: "rgb(230, 230, 230)" },
    }]
        .concat(degreeGroupForNodes.flatMap((group, i) => group.map((item, j) => {
            return {
                name: item.name,
                depth: i + 1,
                parent_value: item.parent_degrees,
                itemStyle: { color: tempColorsArr[i][j] },
                label: {
                    formatter: (d) => {
                        return d.name.slice(0, -1).length > 23 ? d.name.slice(0, -1).slice(0, 23) + "..." : d.name.slice(0, -1);
                    }
                },
            }
        })))
    const links = degreeDataByGroup.flatMap((group, i) => group.map(item => {
        return {
            source: item.parent,
            target: item.name,
            value: item.degrees,
            parent_value: item.parent_degrees
        }
    }))

    return { nodes, links }
}

/*
Some code for intiallizing echart copied from tania.dev
https://www.taniarascia.com/apache-echarts-react/
*/
export default function Sankey({
    data,
    width = 1200,
    height = 800
})
{
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = init(chartRef.current);

        return () => {
            chart?.dispose();
        };
    }, []);

    useEffect(() => {
        const chart = getInstanceByDom(chartRef.current);
        const sankeyData = sankeyDataProcess(data);

        let option = {
            tooltip: {
                trigger: "item",
                triggerOn: "mousemove",
            },
            series: {
                type: "sankey",
                data: sankeyData.nodes,
                links: sankeyData.links,
                nodeAlign: "left",
                nodeWidth: 16,
                nodeGap: 7,
                layoutIterations: 0,
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
                    formatter: function (params) {
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

        chart.setOption(option);
    }, [data]);

    return <div ref={chartRef} style={{ width: width, height: height }}></div >
}
