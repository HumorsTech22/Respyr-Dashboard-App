"use client"
import { useState } from 'react';
import { LineChart } from './LineChart';

export default function Analytics() {
    const [activeTab, setActiveTab] = useState('sugar');

    return (
        <div className="p-6">
            <p className="text-[#5B5B5B] font-semibold leading-normal tracking-[-1px] text-[25px] mb-6">
                Health Analytics
            </p>
            
            <div className="mb-4 border-b border-[#A1A1A1]">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                    <li className="me-[26px]" role="presentation">
                        <button 
                            className={`inline-block p-4 border-b-2 text-[15px] font-normal leading-normal tracking-[0.6px] rounded-t-lg cursor-pointer ${
                                activeTab === 'sugar' 
                                    ? 'text-[#308BF9] border-[#308BF9]' 
                                    : 'text-[#5B5B5B]  hover:text-gray-600 '
                            }`}
                            onClick={() => setActiveTab('sugar')}
                            type="button"
                            role="tab"
                        >
                            Sugar Score
                        </button>
                    </li>
                    <li className="me-[26px]" role="presentation">
                        <button 
                            className={`inline-block p-4 border-b-2 text-[15px] font-normal leading-normal tracking-[0.6px] rounded-t-lg cursor-pointer  ${
                                activeTab === 'liver' 
                                    ? 'text-[#308BF9] border-[#308BF9]' 
                                    : 'text-[#5B5B5B] border-transparent hover:text-gray-600 '
                            }`}
                            onClick={() => setActiveTab('liver')}
                            type="button"
                            role="tab"
                        >
                            Liver Score
                        </button>
                    </li>
                    <li className="me-[26px]" role="presentation">
                        <button 
                            className={`inline-block p-4 border-b-2 text-[15px] font-normal leading-normal tracking-[0.6px] rounded-t-lg cursor-pointer ${
                                activeTab === 'respiratory' 
                                    ? 'text-[#308BF9] border-[#308BF9]' 
                                    : 'text-[#5B5B5B] border-transparent hover:text-gray-600'
                            }`}
                            onClick={() => setActiveTab('respiratory')}
                            type="button"
                            role="tab"
                        >
                            Respiratory Score
                        </button>
                    </li>
                    <li className="me-[26px]" role="presentation">
                        <button 
                            className={`inline-block p-4 border-b-2 text-[15px] font-normal leading-normal tracking-[0.6px] rounded-t-lg cursor-pointer ${
                                activeTab === 'gut' 
                                    ? 'text-[#308BF9] border-[#308BF9]' 
                                    : 'text-[#5B5B5B] border-transparent hover:text-gray-600'
                            }`}
                            onClick={() => setActiveTab('gut')}
                            type="button"
                            role="tab"
                        >
                            Gut Score
                        </button>
                    </li>
                </ul>
            </div>

            <div>

                <LineChart/>
                <div className={`p-4 rounded-lg bg-gray-50 ${activeTab === 'sugar' ? 'block' : 'hidden'}`}>
                    <p className="text-sm text-gray-500">
                        This is some placeholder content for the <strong className="font-medium text-gray-800">Sugar Score tab's associated content</strong>.
                    </p>
                    {/* Add your Sugar Score content here */}
                </div>
                
                <div className={`p-4 rounded-lg bg-gray-50 ${activeTab === 'liver' ? 'block' : 'hidden'}`}>
                    <p className="text-sm text-gray-500">
                        This is some placeholder content for the <strong className="font-medium text-gray-800">Liver Score tab's associated content</strong>.
                    </p>
                    {/* Add your Liver Score content here */}
                </div>
                
                <div className={`p-4 rounded-lg bg-gray-50 ${activeTab === 'respiratory' ? 'block' : 'hidden'}`}>
                    <p className="text-sm text-gray-500">
                        This is some placeholder content for the <strong className="font-medium text-gray-800">Respiratory Score tab's associated content</strong>.
                    </p>
                    {/* Add your Respiratory Score content here */}
                </div>
                
                <div className={`p-4 rounded-lg bg-gray-50 ${activeTab === 'gut' ? 'block' : 'hidden'}`}>
                    <p className="text-sm text-gray-500">
                        This is some placeholder content for the <strong className="font-medium text-gray-800">Gut Score tab's associated content</strong>.
                    </p>
                    {/* Add your Gut Score content here */}
                </div>
            </div>
        </div>
    );
}