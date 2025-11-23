"use client";

import { useState } from "react";
import Sankey from "./sankey";
import LineChartSchoolTrends from "./line-chart-school-trends";
import Donut from "./donut";

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
    rawDegreeData,
    className = ""
}: Readonly<{
    rawDegreeData: Array<DataColumns>,
    className: string
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

    const [campus, setCampus] = useState(Campus.Manoa);
    const [year, setYear] = useState(Year.Y2025);
    const filteredData = rawDegreeData.filter(item => item.CAMPUS == campus && item.FISCAL_YEAR == year);

    // Interactive chart selection: tracking selected linechart for emphasis
    const [selectedCampus, setSelectedCampus] = useState<string | null>(null);

    const renderChart = (campusName: string, lineColor?: string) => {
        const borderColor = lineColor || "#3b82f6"; // default blue
        const glowColor = lineColor ? `${lineColor}FF` : "rgba(59, 130, 246, 0.5)"; 
        const glowSelectedColor = lineColor ? `${lineColor}FF` : "rgba(96, 165, 250, 0.7)"; 

        return (
            <div
            className={`chart-card ${selectedCampus === campusName ? "selected" : ""}`}
            onClick={() => setSelectedCampus(campusName)}
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
    * - Utilize useState to change and select campus and year?
    */

    return (
        <div className={className}>
            {/* Row with 3 line charts */}
            <div className="grid grid-cols-9 row-start-1 col-span-10">
                {/* <div className="col-start-1 col-span-3 bg-white rounded-[25px] h-[270px] px-3 py-2 m-4 text-center">
                    <span className="font-bold">UH Manoa</span> 
                    <LineChartSchoolTrends 
                        rawDegreeData={rawDegreeData} 
                        campus={campus}
                        className="pt-1"
                    />
                </div>
                <div className="col-start-4 col-span-3 bg-white rounded-[25px] h-[270px] px-3 py-2 m-4 text-center">
                    <span className="font-bold">UH Hilo</span> 
                    <LineChartSchoolTrends 
                        rawDegreeData={rawDegreeData} 
                        campus={Campus.Hilo} 
                        lineColor="green"
                        className="pt-1"
                    />
                </div>
                <div className="col-start-7 col-span-3 bg-white rounded-[25px] h-[270px] px-3 py-2 m-4 text-center">
                    <span className="font-bold">UH West Oahu</span> 
                    <LineChartSchoolTrends 
                        rawDegreeData={rawDegreeData} 
                        campus={Campus.WestOahu} 
                        lineColor="purple"
                        className="pt-1"
                    />
                </div> */}
                <div className="col-start-1 col-span-3">{renderChart(Campus.Manoa)}</div>
                <div className="col-start-4 col-span-3">{renderChart(Campus.Hilo, "#008001")}</div>
                <div className="col-start-7 col-span-3">{renderChart(Campus.WestOahu, "#800080")}</div>
            </div>
            <div className="row-start-2 row-span-2 col-span-10 grid grid-cols-subgrid">
                <Donut data={filteredData} />
                <Sankey data={filteredData} className="col-start-6 col-span-5 bg-white border border-neutral-2 rounded-[50px] p-4 m-4" />
            </div>
        </div>
    );
}