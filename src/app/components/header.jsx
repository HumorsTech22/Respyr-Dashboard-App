import { CircleUser, MapPin, Menu, Search } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { TiLocation } from "react-icons/ti";

const Header = () => {
  return (
    <div className=' md:static sticky -top-21 z-50 md:px-10 flex md:flex-row flex-col gap-y-[15px]  bg-white justify-between items-center  py-7 '>
      <div className='flex  items-center justify-between  w-full md:w-auto'>
        <Menu className=' md:hidden text-black' />
        <div className='flex items-center gap-[10px] '>

          {/* <div className=' md:flex  gap-[10px]'>
            

            <Image
              src="/assets/icons/Group.svg"
              alt='locationlogo'
              width={24}
              height={24}
              className='hidden md:block'

            />
            <div className='flex flex-col'>
              <p className='hidden md:flex items-center gap-[5px] text-[#252525] font-semibold text-[18px] tracking-[-0.04em]'>Adarsh Clinic

                <IoIosArrowDown />
              </p>
              <p className='md:hidden flex items-center gap-[5px] text-[#252525] font-semibold text-[18px] tracking-[-0.04em]'>Ruku Hospital

                <IoIosArrowDown />
              </p>
              <p className='text-[12px] hidden md:block text-[#252525] font-normal tracking-[-0.04em] md:text-start text-center'>First floor</p>
              <p className='text-[12px] md:hidden text-[#252525] font-normal tracking-[-0.04em] md:text-start text-center'>First floor OPD</p>
            </div>
          </div> */}
        </div>
        <div className='md:hidden'>
          <Image src={'/assets/img/carimage.svg'} height={29} width={29} alt='carlogo' />
        </div>
      </div>

      <div className='flex items-center  text-[#87BDFF] gap-[10px] 
        shadow-[inset_0_0_10px_rgba(48,139,249,0.15)] px-[20px] py-[15px] rounded-[10px] md:w-[344px] w-full  '>
        {/* <Search/> */}
        <Image
          src="/assets/icons/Group (1).svg"
          alt='group'
          width={20}
          height={20}

        />
        <input
          className='font-semibold text-[16px] tracking-[-0.04em] text-[#87BDFF]'
          placeholder="search 'Rajnikanth'" />
      </div>



      {/* <CircleUser className='hidden md:block'/> */}
      <Image
        src="/assets/icons/Group 2215.svg"
        alt='profile'
        width={40}
        height={40}
        className='cursor-pointer hidden md:block'
      />
    </div>
  )
}

export default Header