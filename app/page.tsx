import * as d3 from "d3";
import { promises as fs } from "fs";
import LinePlot from "./components/test_chart";
import ChartGroup from "./components/chart_group";

export default async function Page() {
    const csvFile = await fs.readFile(process.cwd() + "/app/data/UH_Student_Degrees_Awarded.csv", "utf8");
    const rawDegreeData = d3.csvParse(csvFile);
    
    return (
        <div>
            <h1>Hello World</h1>
            <LinePlot data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
            <ChartGroup rawDegreeData={rawDegreeData} />
        </div>
    );
}
