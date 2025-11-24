"use client";

import { useState } from 'react';
import { BsInfoCircle, BsX } from 'react-icons/bs';
import './infobox.css';

export default function InfoBox({
    campus = "UH Manoa",
    className = ""
})
{
    const [showInfoCard, setShowInfoCard] = useState(false);
    const getInfoText = (campusName) => {
        switch(campusName) {
            case "UH Manoa":
                return "Founded in 1907, the University of Hawaiʻi at Mānoa is a destination of choice for students and faculty from across the nation and the world. UH Mānoa offers unique research opportunities, a diverse community, a nationally-ranked Division I athletics program and much more.";
            case "UH Hilo":
                return "The University of Hawaiʻi at Hilo (UH Hilo) is a public university in Hilo, Hawaiʻi, United States. It was founded as Hilo Center at Lyman Hall of the Hilo Boys School in 1945 and was a branch campus of the University of Hawaiʻi at Mānoa. In 1970 it was reorganized by an act of the Hawaiʻi State Legislature and became a campus within the newly created University of Hawaiʻi System.";
            case "UH West Oʻahu":
                return "The University of Hawaiʻi–West Oʻahu is a public university in Kapolei, Hawaiʻi. As part of the University of Hawaiʻi system, UH West Oʻahu offers baccalaureate and graduate degrees in liberal arts and professional studies, serving the leeward coast and central Oʻahu communities.";
            default:
                return "Select a campus to view detailed information about its degree distribution.";
        }
    };
    const infoText = getInfoText(campus);

    /*
    * - Have text be changeable (Text as useState)
    * - Display info of...
    *     - Campus name
    *     - Fiscal Year?
    *     - Major percentage explanation?
    *     - Breakdown of major by gender? and undergrad/grad degree
    */

    return (
        <div className={`${className} relative`}>
            <div className={`bg-primary-1 border border-neutral-2 py-8 px-4 overflow-auto transition-all duration-300 ${showInfoCard ? 'blur-xs' : 'blur-none'}`}>
                <h1 className="text-5xl font-semibold pb-2 text-neutral-1">
                    GradGraph
                    <button 
                        type="button" 
                        className="flex-shrink-0 p-1.5 rounded-full hover:bg-neutral-1/10 transition-all cursor-pointer hover:scale-110"
                        onClick={() => setShowInfoCard(true)}
                        aria-label="Learn more about GradGraph"
                    >
                        <BsInfoCircle className="w-5 h-5 ml-2 text-neutral-1 hover:text-primary-2 transition-colors"/>
                    </button>
                </h1>
                <h2 className="pb-2 text-base text-neutral-1/80">
                    <em>Visualizing the degrees awarded across the University of Hawai‘i system</em>
                </h2>
                <hr className="border-t border-neutral-1/30"></hr>
                <div className="pt-3">
                    <div className="inline-block px-3 py-1 bg-neutral-1/10 text-highlight-1 rounded-full text-sm mb-3">
                        Exploring {campus}
                    </div>
                    {/* Campus-specific dataviz may go here? Can change the structure if need be */}
                    <p className="text-base text-neutral-1/90 leading-relaxed">{infoText}</p>
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
                                className="cursor-pointer transition-all hover:scale-125"
                                aria-label="Close"
                            >
                                <BsX className="w-7 h-7 mt-1 text-neutral-2 hover:text-heading transition-colors"/>
                            </button>
                        </div>
                        <div className="text-left space-y-4">
                            <p className="text-body leading-relaxed">
                                GradGraph allows you to look at the degrees awarded across the three main University of Hawaii campuses: UH Manoa, UH Hilo, and UH West Oahu. You can explore the distribution of degrees across various colleges and see the trends over different fiscal years.
                            </p>
                            <p>Click on a line chart to view information for that campus.</p>
                            <p className="text-sm text-neutral-2 pt-2 border-t border-neutral-2/20">
                                Created by <a href="https://github.com/eric-z4" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 transition-colors">Eric Zhou</a>, <a href="https://github.com/jpinera" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 transition-colors">Jaren Pinera</a>, and <a href="https://github.com/usradam" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 transition-colors">Adam Graham</a>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}