import React from 'react'
import HistoryTable from './HistoryTable'
import Image from 'next/image'
import { IoIosArrowDown } from "react-icons/io";
import Graph from './Graph';

export const LineChart = () => {
    return (
        <div className='flex gap-[34px] pl-[23px] rounded-[20px] bg-white shadow-[0_0_10px_5px_rgba(0,0,0,0.05)]'>
            <div className='flex flex-col gap-10'>
                <div className='flex justify-between items-start'>
                    <div className='flex flex-col gap-5'>
                        <div className='flex gap-[5px] pt-[25px]'>
                            <div className='flex items-start'>
                                <Image
                                    src="/assets/icons/Frame 427319409.svg"
                                    alt='Frame 427319409.svg'
                                    width={20}
                                    height={20}
                                />
                                <span className='text-[#3FAF58] text-[12px] font-medium tracking-[-0.24px] leading-normal'>5%</span>
                            </div>
                            <p className='text-[#A1A1A1] text-[12px] font-normal leading-normal tracking-[-0.24px]'>than all time</p>
                        </div>
                        <div className='flex flex-col gap-2.5'>
                            <span className='text-[#252525] text-[30px] font-normal leading-normal tracking-[0.6px]'>85%</span>
                            <span className='text-[#3FAF58] font-semibold leading-normal tracking-[-0.24px] text-[12px]'>Good</span>
                            <span className='text-[#252525] text-[15px] font-normal leading-[110%] tracking-[-0.3px]'>Health score</span>
                        </div>
                    </div>
                    
                    {/* Fixed dropdown with proper border */}
                    {/* <div className='relative pt-[25px]'>
                        <div className='flex items-center gap-2 py-2 pl-[20px] pr-[1px] border-b-[1.5px] border-[#E0E0E0]'>
                            <span className='text-[#5B5B5B] text-[12px] font-normal leading-normal tracking-[-0.48px]'>All time</span>
                            <IoIosArrowDown className="text-[#5B5B5B]" />
                        </div>
                    </div> */}
                </div>
                
                <div>
                    <Graph/>
                </div>
            </div>
            <HistoryTable />
        </div>
    )
}