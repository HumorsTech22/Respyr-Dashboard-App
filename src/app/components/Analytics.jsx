"use client"
import { useState } from 'react';
import { LineChart } from './LineChart';
import { useSelector } from 'react-redux';

export default function Analytics() {
    const [activeTab, setActiveTab] = useState('sugar');
    const { personal, records } = useSelector((state) => state.profile);

    console.log("Personal data in Analytics:", personal);
    console.log("Records data in Analytics:", records);

    return (
        <div className="">
            <p className="text-[#5B5B5B] font-semibold leading-normal tracking-[-1px] text-[25px] mb-6">
                Health Analytics
            </p>

            <div className="mb-4 border-b border-[#A1A1A1]">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                    <li className="me-[26px]" role="presentation">
                        <button
                            className={`inline-block p-4 border-b-2 text-[15px] font-normal leading-normal tracking-[-0.6px] rounded-t-lg cursor-pointer ${activeTab === 'sugar'
                                    ? 'text-[#308BF9] border-[#308BF9]'
                                    : 'text-[#5B5B5B] border-transparent hover:text-gray-600'
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
                            className={`inline-block p-4 border-b-2 text-[15px] font-normal leading-normal tracking-[-0.6px] rounded-t-lg cursor-pointer  ${activeTab === 'liver'
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
                            className={`inline-block p-4 border-b-2 text-[15px] font-normal leading-normal tracking-[-0.6px] rounded-t-lg cursor-pointer ${activeTab === 'respiratory'
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
                            className={`inline-block p-4 border-b-2 text-[15px] font-normal leading-normal tracking-[-0.6px] rounded-t-lg cursor-pointer ${activeTab === 'gut'
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
                <LineChart activeTab={activeTab} records={records} />
            </div>
        </div>
    );
}