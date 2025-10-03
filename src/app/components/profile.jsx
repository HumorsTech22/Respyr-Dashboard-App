import React from 'react'
import Image from 'next/image'
import { IoIosArrowRoundBack } from "react-icons/io";
export const Profile = () => {
    return (
        <div className='flex flex-col gap-10 rounded-[20px] pl-5 pr-[30px] pt-[35px] pb-[60px] shadow-[0_0_10px_5px_rgba(0,0,0,0.05)] bg-white'>
            <div className='flex items-center gap-[7px] cursor-pointer'>
                <IoIosArrowRoundBack className='w-[33px] h-[32px] ' />
                <span className='text-[#535359] text-[15px] font-normal leading-normal tracking-[-0.6px]'>Go Back</span>
            </div>

            <div className='flex flex-col gap-5 '>
                <Image
                    src="/assets/img/Group 2216.svg"
                    width={80}
                    height={80}
                    alt="User avatar"
                />
                <div className='flex flex-col gap-4'>
                    <span className='text-[#252525] text-[30px] font-normal leading-[110%] tracking-[-0.6px]'>Anush Kumar</span>
                    <div className='flex gap-2.5 items-center'>
                        <span className='text-[#252525] font-normal leading-[110%] tracking-[0.3px] text-[15px]'>25 years</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="4"
                            height="4"
                            viewBox="0 0 4 4"
                            fill="none"
                            aria-hidden="true"
                        >
                            <circle cx="2" cy="2" r="2" fill="#252525" />
                        </svg>
                        <span className='text-[#252525] font-normal leading-[110%] tracking-[0.3px] text-[15px]'>Male</span>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-5'>
                <div className='flex justify-between items-center'>
                    <span className='text-[#252525] font-normal leading-[110%] tracking-[-0.24px]'>Date of Birth</span>
                    <span className='text-[#535359] text-[12px] font-normal leading-[110%] tracking-[-0.24px]'>12 August 2024</span>
                </div>



                <div className='flex  justify-between items-center'>
                    <span className='text-[#252525] font-normal leading-[110%] tracking-[-0.24px]'>Height</span>
                    <span className='text-[#535359] text-[12px] font-normal leading-[110%] tracking-[-0.24px]'>180 cm</span>
                </div>

                <div className='flex  justify-between items-center'>
                    <span className='text-[#252525] font-normal leading-[110%] tracking-[-0.24px]'>Weight</span>
                    <span className='text-[#535359] text-[12px] font-normal leading-[110%] tracking-[-0.24px]'>74 kg</span>
                </div>

                <div className='flex  justify-between items-center'>
                    <span className='text-[#252525] font-normal leading-[110%] tracking-[-0.24px]'>BMI</span>
                    <div className='flex flex-col gap-[5px]'>
                        <span className='text-[#535359] text-[12px] font-normal leading-[110%] tracking-[-0.24px]'>22.8kg/m2</span>
                        <span className='flex justify-end text-[#3FAF58] text-[10px] font-normal leading-[110%] tracking-[-0.2px]'>normal</span>
                    </div>
                </div>

                <div className='flex  justify-between items-center'>
                    <span className='text-[#252525] font-normal leading-[110%] tracking-[-0.24px]'>BMR</span>
                    <span className='text-[#535359] text-[12px] font-normal leading-[110%] tracking-[-0.24px]'>1,745 Cal</span>
                </div>
            </div>
        </div>
    )
}
