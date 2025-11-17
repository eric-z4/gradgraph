"use client";

import { useState } from "react";
import Sankey from "./sankey";

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

    /*
    * TODO
    * - Line chart
    * - Pie/donut chart
    * - Utilize useState to change and select campus and year?
    */

    return (
        <div className={className}>
            <div className="bg-green-50 row-start-1 col-span-10">
                { /*Insert line charts here*/ }
            </div>
            <div className="bg-yellow-50 row-start-2 row-span-2 col-span-10 grid grid-cols-subgrid">
                { /*Insert pie/donut chart here*/ }
                <Sankey data={filteredData} className="col-start-6 col-span-5" />
            </div>
        </div>
    );
}