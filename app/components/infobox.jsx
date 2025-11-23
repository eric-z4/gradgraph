"use client";

import { useState } from 'react';
import { BsInfoCircle, BsX } from 'react-icons/bs';
import './infobox.css';

export default function InfoBox({
    className = ""
})
{
    const [showInfoCard, setShowInfoCard] = useState(false);
    const infoText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut enim ut odio maximus tempor sed sed mi. Curabitur quis tortor sed ex placerat posuere. Donec ipsum ipsum, fringilla non pellentesque in, scelerisque quis lacus. Integer aliquam sem elit, a mattis nibh porta id. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam et maximus velit. In ut urna urna. Nulla eu molestie dui, sed molestie dui. Aenean nisi urna, luctus eu pulvinar vitae, malesuada a arcu.Aliquam erat volutpat.In id laoreet arcu.Proin eget velit massa.Interdum et malesuada fames ac ante ipsum primis in faucibus.Maecenas augue augue, sollicitudin nec aliquet id, iaculis quis odio.In semper justo felis, ac tristique tellus condimentum eget.Duis feugiat risus ipsum, id vehicula nulla ultricies non.Sed iaculis, justo ut elementum suscipit, enim tortor efficitur diam, ac fermentum diam lectus sed ipsum.Pellentesque nec ornare dolor, at suscipit turpis.Nullam commodo ornare metus eget vehicula.Etiam eget est id nulla auctor consequat et at sapien.";

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
            <div className={`bg-white border border-neutral-2 rounded-4xl p-4 overflow-auto transition-opacity duration-300 ${showInfoCard ? 'opacity-50' : 'opacity-100'}`}>
                <h1 className="text-5xl font-semibold pb-4">
                    GradGraph
                    <button 
                        type="button" 
                        className="flex-shrink-0 p-1.5 rounded-full hover:bg-neutral-1/10 transition-all cursor-pointer hover:scale-110"
                        onClick={() => setShowInfoCard(true)}
                        aria-label="Learn more about GradGraph"
                    >
                        <BsInfoCircle className="w-5 h-5 ml-2 text-neutral-2 hover:text-primary-2 transition-colors"/>
                    </button>
                </h1>
                <hr className="border-t border-neutral-2/30"></hr>
                <p className="pt-3 text-left">
                    {infoText}
                </p>
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