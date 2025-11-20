import * as d3 from "d3";
import { promises as fs } from "fs";
import ChartGroup from "./components/chart_group";
import InfoBox from "./components/infobox";

export default async function Page() {
    const csvFile = await fs.readFile(process.cwd() + "/app/data/UH_Student_Degrees_Awarded.csv", "utf8");
    const rawDegreeData = Array.from(d3.csvParse(csvFile, (d) => {
        return {
            FISCAL_YEAR: d.FISCAL_YEAR,
            CAMPUS: d.CAMPUS,
            CIP: d.CIP,
            CIP_DESC: d.CIP_DESC,
            GROUP1: d.GROUP1,
            GROUP2: d.GROUP2,
            GROUP3: d.GROUP3,
            GROUP4: d.GROUP4,
            GROUP5: d.GROUP5,
            OUTCOME: d.OUTCOME,
            AWARDS: +d.AWARDS
        };
    }));

    /*
    * TODO
    * - Website title
    * - Info panel on the left
    * - Work on front-end visuals
    */
    
    return (
        <div className="grid grid-cols-10 grid-row-1 h-screen px-4">
            <div className="grid grid-cols-10 grid-row-3 bg-blue-50 col-span-3">
                <InfoBox className="text-center col-start-2 col-span-8 row-start-2 place-content-center h-screen" />
            </div>
            <ChartGroup rawDegreeData={rawDegreeData} className="col-span-7 grid grid-cols-10 grid-rows-3" />
        </div>
    );
}
