"use client";

import { useState } from "react";
import Sankey from "./sankey";
import LineChartSchoolTrends from "./line-chart-school-trends";
import Donut from "./donut";
import InfoBox from "./infobox";
import { SankeyAndDonutSyncProvider } from "../SankeyAndDonutSync";

interface DataColumns
{
    FISCAL_YEAR: string,
    CAMPUS: string,
    CIP: string,
    CIP_DESC: string,
    GROUP1: string,
    GROUP2: string,
    GROUP3: string,
    GROUP4: string,
    GROUP5: string,
    OUTCOME: string,
    AWARDS: number;
}

export default function ChartGroup({
    rawDegreeData
}: Readonly<{
    rawDegreeData: Array<DataColumns>
}>) {
    const enum Campus {
        Manoa = "UH Manoa",
        Hilo = "UH Hilo",
        WestOahu = "UH West O`ahu"
    };

    const enum Year {
        Y2010 = "Fiscal Year 2010",
        Y2011 = "Fiscal Year 2011",
        Y2012 = "Fiscal Year 2012",
        Y2013 = "Fiscal Year 2013",
        Y2014 = "Fiscal Year 2014",
        Y2015 = "Fiscal Year 2015",
        Y2016 = "Fiscal Year 2016",
        Y2017 = "Fiscal Year 2017",
        Y2018 = "Fiscal Year 2018",
        Y2019 = "Fiscal Year 2019",
        Y2020 = "Fiscal Year 2020",
        Y2021 = "Fiscal Year 2021",
        Y2022 = "Fiscal Year 2022",
        Y2023 = "Fiscal Year 2023",
        Y2024 = "Fiscal Year 2024",
        Y2025 = "Fiscal Year 2025",
    };

    const [campus, setCampus] = useState(Campus.Manoa as string);
    const [year, setYear] = useState(Year.Y2025);
    const filteredData = rawDegreeData.filter(item => item.CAMPUS == campus && item.FISCAL_YEAR == year);

    // Line chart selection
    const handleCampusClick = (campusName: string) => {
        setCampus(campusName);
    }

    const renderChart = (campusName: string, lineColor?: string) => {
        const borderColor = lineColor || "#3b82f6"; // default blue
        const glowColor = lineColor ? `${lineColor}FF` : "rgba(59, 130, 246, 0.5)"; 
        const glowSelectedColor = lineColor ? `${lineColor}FF` : "rgba(96, 165, 250, 0.7)"; 

        return (
            <div
            className={`chart-card ${campus === campusName ? "selected" : ""}`}
            onClick={() => handleCampusClick(campusName)}
            style={{
                "--border-color": borderColor,
                "--glow-hover-color": glowColor,
                "--glow-selected-color": glowSelectedColor,
                borderColor: lineColor,
            } as React.CSSProperties} // cast for TS
        >
            <span className="font-bold">{campusName}</span>
            <LineChartSchoolTrends
                rawDegreeData={rawDegreeData}
                campus={campusName}
                lineColor={lineColor}
                className="pt-1 pe-2"
            />
        </div>
        );
    };

    /*
    * TODO
    * - Utilize useState to change and select year?
    */

    const getCampusColor = (campusName: string) => {
        switch(campusName) {
            case Campus.Manoa:
                return "#024731";
            case Campus.Hilo:
                return "#A32015";
            case Campus.WestOahu:
                return "#A71930";
            default:
                return "#024731";
        }
    };

    return (
        <div className="grid grid-cols-10 grid-row-1 h-screen">
            <div className="bg-white col-span-3">
                <InfoBox campus={campus} color={getCampusColor(campus)} className="text-center flex h-screen px-4" />
            </div>
            <div className="bg-white col-span-7 grid grid-cols-10 grid-rows-3">
                <div className="grid grid-cols-9 row-start-1 col-span-10">
                    <div className="col-start-1 col-span-3">{renderChart(Campus.Manoa, "#024731")}</div>
                    <div className="col-start-4 col-span-3">{renderChart(Campus.Hilo, "#A32015")}</div>
                    <div className="col-start-7 col-span-3">{renderChart(Campus.WestOahu, "#A71930")}</div>
                </div>
                <div className="row-start-2 row-span-2 col-span-10 grid grid-cols-subgrid">
                    <SankeyAndDonutSyncProvider>
                        <Donut data={filteredData} campus={campus} className="col-start-1 col-span-5 bg-white border-2 border-neutral-2 rounded-[50px] p-2 m-4 flex items-center justify-center" />
                        <Sankey data={filteredData} campus={campus} className="col-start-6 col-span-5 bg-white border-2 border-neutral-2 rounded-[50px] p-4 m-4" />
                    </SankeyAndDonutSyncProvider>
                </div>
            </div>
        </div>
    );
}