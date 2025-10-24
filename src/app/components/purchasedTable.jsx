"use client";
import Image from "next/image"
export default function PurchasedTable(){
    return(
        <>
        <div>
            <div className="border rounded-[14px] bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.25)]">
              
              <div className="bg-[#B0CFFF] py-3 px-2 rounded-[8px]">
                <Image
                src="/img/carbon_purchase.svg"
                alt="carbon_purchase"
                width={34}
                height={34}
                />
                </div>
                <span className="text-[#252525] text-[15px] font-normal leading-normal tracking-[-0.3px]">Total Purchases</span>
            </div>
        </div>
        </>
    )
}