import Link from "next/link"
export default function Footer() {
    return (
        <>
            <footer className="flex justify-between px-4 py-4">
                <div>
                    <p className="text-[#535359] text-[16px] ">Designed and Developed by Humorstech Pvt Ltd</p>
                </div>
                <div>
                    <ul className="flex gap-2 text-[#535359] text-[14px]">
                        <li className="hover:text-[#308BF9] transition-colors duration-200">
                            <Link
                                href="https://respyr.in/terms-conditions/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Terms & Conditions
                            </Link>
                        </li>
                        <li className="cursor-pointer hover:text-[#308BF9] transition-colors duration-200">
                            <Link
                                href="https://respyr.in/privacy_policy/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Privacy Policy
                            </Link>
                        </li>
                    </ul>
                </div>
            </footer>
        </>
    )
}