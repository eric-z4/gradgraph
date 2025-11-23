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
                <p className="text-5xl font-bold pb-4">
                    GradGraph
                    <button 
                        type="button" 
                        className="inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                        onClick={() => setShowInfoCard(!showInfoCard)}
                    >
                        <BsInfoCircle className="w-6 h-6 text-body hover:text-heading ms-2 transition-colors" />
                    </button>
                </p>
                <hr className="outline outline-1 outline-primary-2"></hr>
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
                        className="bg-white border-2 border-primary-2 rounded-3xl p-6 shadow-2xl max-w-md w-96 animate-bounce-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-heading">
                                About GradGraph
                            </h2>
                            <button 
                                onClick={() => setShowInfoCard(false)}
                                className="cursor-pointer transition-all hover:scale-125"
                            >
                                <BsX className="w-6 h-6 text-body hover:text-heading mt-1"/>
                            </button>
                        </div>
                        <div className="text-left">
                            <p>
                                GradGraph allows you to look at the degrees awarded across the three main University of Hawaii campuses: UH Manoa, UH Hilo, and UH West Oahu. You can explore the distribution of degrees across various colleges and see the trends over different fiscal years.
                            </p>
                        </div>
                        <div className="text-left mt-4">
                            <p>
                                Made by <a href="https://github.com/eric-z4" target="_blank" rel="noopener noreferrer"><span className='underline hover:text-blue-600'>Eric Zhou</span></a>, <a href="https://github.com/jpinera" target="_blank" rel="noopener noreferrer"><span className='underline hover:text-blue-600'>Jaren Pinera</span></a>, and <a href="https://github.com/usradam" target="_blank" rel="noopener noreferrer"><span className='underline hover:text-blue-600'>Adam Graham</span></a>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}