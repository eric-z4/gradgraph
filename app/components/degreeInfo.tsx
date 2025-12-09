import React from 'react';

interface SelectedSlice {
  index: number;
  name: string;
  depth?: number;
  value?: number;
}

interface BarChartItem {
  name: string;
  value: number;
  degreeType?: string;
}

interface DegreeInfoProps {
  selectedSlice: SelectedSlice;
  barChartData: BarChartItem[];
  totalDegrees: number;
}

export function DegreeInfo({
  selectedSlice,
  barChartData,
  totalDegrees
}: DegreeInfoProps): React.ReactElement {
  const percentOfStudents = ((selectedSlice.value ?? 0) / totalDegrees * 100).toFixed(3);
  const sortedByCount = [...barChartData].sort((a, b) => b.value - a.value);
  const topMajors = sortedByCount.slice(0, 3).map(d => d.name);
  const topMajorsCount = sortedByCount.map(item => item.value);

  // Aggregate by degree type
  const degreeTypeMap: Record<string, number> = {};
  barChartData.forEach(item => {
    const type = item.degreeType || "Unknown";
    degreeTypeMap[type] = (degreeTypeMap[type] || 0) + item.value;
  });

  const sortedDegreeTypes = Object.entries(degreeTypeMap).sort(([, a], [, b]) => b - a);
  const mostCommonDegree = sortedDegreeTypes[0]?.[0] || "";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 pt-2">Detailed Summary</h1>
      <p className="mb-4">
        {percentOfStudents}% of all students graduated in the <strong>{selectedSlice.name}</strong>.
      </p>

      {/* <h2 className="text-lg ">Students mainly received degrees in:</h2>
      <ul className="ps-3 list-disc list-inside mb-4">
        <li>{topMajors[0] || "-"} ({topMajorsCount[0]})</li>
        <li>{topMajors[1] || "-"} ({topMajorsCount[1]})</li>
        <li>{topMajors[2] || "-"} ({topMajorsCount[2]})</li>
      </ul> */}

      {/* ONLY show this section when depth === 1 */}
      {selectedSlice.depth === 1 && (
        <>
          <h2 className="text-lg ">Students mainly received degrees in:</h2>
          <ul className="ps-3 list-disc list-inside mb-4">
            <li>{topMajors[0] || "-"} ({topMajorsCount[0]})</li>
            <li>{topMajors[1] || "-"} ({topMajorsCount[1]})</li>
            <li>{topMajors[2] || "-"} ({topMajorsCount[2]})</li>
          </ul>
        </>
      )}

      <h2 className="text-lg font-semibold">Degree types breakdown:</h2>
      <p className="">
        Most people obtained <strong>{mostCommonDegree}</strong>.
      </p>
      <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
        {sortedDegreeTypes.map(([type, count]) => `${type}: ${count}`).join('\n')}
      </pre>
    </div>
  );
}
