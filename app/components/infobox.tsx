"use client";

import { ReactNode, useState } from 'react';
import { BsInfoCircle, BsX } from 'react-icons/bs';
import '../css/infobox.css';
import ManoaMD from '../markdown/manoa.mdx';
import HiloMD from '../markdown/hilo.mdx';
import WestOahuMD from '../markdown/west_oahu.mdx';
import InfoDefMD from '../markdown/info_default.mdx';
import InfoBoxBarChart from './infobox_bar_chart';

interface InfoBoxProps {
    campus?: string;
    year?: string;
    className?: string;
    color?: string;
    data: Array<{
        FISCAL_YEAR: string;
        CAMPUS: string;
        CIP: string;
        CIP_DESC: string;
        GROUP1: string;
        GROUP2: string;
        GROUP3: string;
        GROUP4: string;
        GROUP5: string;
        OUTCOME: string;
        AWARDS: number;
    }>;
}

export default function InfoBox({
    campus = "UH Manoa",
    year = "FY 2025",
    className = "",
    color = "#024731",
    data
}: InfoBoxProps)
{
    const [showInfoCard, setShowInfoCard] = useState(false);
    const getInfoText = (campusName: string): ReactNode | null => {
        switch (campusName) {
            case "UH Manoa":
                return <ManoaMD />;
            case "UH Hilo":
                return <HiloMD />;
            case "UH West O`ahu":
                return <WestOahuMD />;
            default:
                return <InfoDefMD />;
        }
    };
    const infoText = getInfoText(campus);

    /*
    * - Have text be changeable (Text as useState)
    * - Display info of...
    *     - Campus name
    *     - Fiscal Year?
    *     - Major percentage explanation?
    *     - Breakdown of major by gender?
    */
    return (
        <div className={`${className} relative h-full min-h-screen`}>
            <div 
                className={`border border-neutral-2 py-8 px-4 overflow-auto h-full transition-all duration-300 ${showInfoCard ? 'blur-xs' : 'blur-none'}`}
                style={{ backgroundColor: color }}
            >
                <h1 className="text-5xl font-semibold pb-2 text-neutral-1">
                    GradGraph
                    <button 
                        type="button" 
                        className="flex-shrink-0 p-1.5 ml-2 rounded-full hover:bg-neutral-1/10 transition-all cursor-pointer hover:scale-110"
                        onClick={() => setShowInfoCard(true)}
                        aria-label="Learn more about GradGraph"
                    >
                        <BsInfoCircle className="w-5 h-5 text-neutral-1"/>
                    </button>
                </h1>
                <h2 className="pb-2 text-base text-neutral-1/80">
                    <em>Visualizing the degrees awarded across the University of Hawai‘i</em>
                </h2>
                <hr className="border-t border-neutral-1/30"></hr>
                <div className="pt-3">
                    <div className="bg-[#FAF9F6] rounded-lg container border-solid border-[2px] mx-auto px-4">
                        <span className="text-base text-left leading-relaxed">{infoText}</span>
                    </div>
                    <div
                        style={{
                            height: "250px",
                            margin: "16px auto",
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: "12px",
                            boxSizing: "border-box"
                        }}
                    >
                        <InfoBoxBarChart data={data} campus={campus} year={year} className="w-full h-full"/>
                    </div>
                </div>
            </div>

            {showInfoCard && (
                <div 
                    className="absolute inset-0 z-50 flex items-center justify-center"
                    onClick={() => setShowInfoCard(false)}
                >
                    <div 
                        className="bg-white border border-neutral-2/40 rounded-2xl p-8 shadow-xl max-w-lg w-full mx-4 animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-heading">
                                About GradGraph
                            </h2>
                            <button 
                                onClick={() => setShowInfoCard(false)}
                                className="cursor-pointer transition-all hover:scale-110"
                                aria-label="Close"
                            >
                                <BsX className="w-7 h-7 mt-1 text-neutral-2 hover:text-heading transition-colors"/>
                            </button>
                        </div>
                        <div className="text-left space-y-4">
                            <p className="text-body leading-relaxed">
                                GradGraph allows you to look at the degrees awarded across the three main University of Hawaii campuses: UH Manoa, UH Hilo, and UH West Oahu. You can explore the distribution of degrees across these campuses and see the trends over different fiscal years.
                            </p>
                            <p>Select a line chart to view information for that campus. Once selected, you can click a point on the graph or hold and drag the red line to a specific data point to explore a campus&apos; data for a given year. </p>
                            <p className="text-sm text-neutral-2 pt-2 border-t border-neutral-2/20">
                                Data source: <a href="https://opendata.hawaii.gov/dataset/university-of-hawaii-student-degrees-awarded/resource/3a0b8368-71a7-4402-b9c7-9fc5a398a952" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 transition-colors">Hawaii Open Data</a>
                                <br></br>
                                Source code: <a href="https://github.com/eric-z4/gradgraph" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 transition-colors">GitHub</a>
                                <br></br>
                                Created by <a href="https://github.com/eric-z4" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 transition-colors">Eric Zhou</a>, <a href="https://github.com/jpinera" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 transition-colors">Jaren Pinera</a>, and <a href="https://github.com/usradam" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 transition-colors">Adam Graham</a>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}