import * as d3 from "d3";
import { promises as fs } from "fs";
import LinePlot from "./components/test_chart";
import ChartGroup from "./components/chart_group";

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
    
    return (
        <div>
            <h1>Hello World</h1>
            <LinePlot data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
            <ChartGroup rawDegreeData={rawDegreeData} />
        </div>
    );
}
