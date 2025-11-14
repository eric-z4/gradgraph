import * as d3 from "d3";
import LinePlot from "./components/test_chart";
import Sankey from "./components/sankey";

export default function Page() {
    return (
        <div>
            <h1>Hello World</h1>
            <LinePlot data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
            <Sankey
                data={d3
                    .csv(
                        "https://opendata.hawaii.gov/dataset/d5fa9b76-b63a-4810-93aa-e6624db0fafc/resource/3a0b8368-71a7-4402-b9c7-9fc5a398a952/download/opendata-degrees-awarded.csv"
                    )
                    .then((rawData) => {
                        return rawData.filter(
                            (x) =>
                                x.CAMPUS === "UH Manoa" &&
                                x.FISCAL_YEAR === "Fiscal Year 2025"
                        );
                    })}
            />
        </div>
    );
}
