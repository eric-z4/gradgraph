import LinePlot from "./components/test_chart";

export default function Page() {
    return (
        <div>
            <h1>Hello World</h1>
            <LinePlot data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
        </div>
    );
}
