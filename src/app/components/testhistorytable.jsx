import { CgProfile } from "react-icons/cg";
import Image from "next/image";
import Link from "next/link";
export default function TestHistoryTable() {
    return (
        <>
            <div>


                <div className="relative overflow-x-auto pr-2.5">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Subject Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Test Taken
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Sugar Score
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Liver Score
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Respiratory Score
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Gut Score
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    View
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Apple MacBook Pro 17"
                                </th>
                                <td className="px-6 py-4">
                                    Silver
                                </td>
                                <td className="px-6 py-4">
                                    Laptop
                                </td>
                                <td className="px-6 py-4">
                                    $99
                                </td>
                                <td className="px-6 py-4">
                                    $999
                                </td>
                                <td className="px-6 py-4">
                                    $1999
                                </td>

                                <td className="px-6 py-4">
                                    <Link
                                        href="/patientprofile"
                                    >
                                        <button className="cursor-pointer">
                                            <Image
                                                src="/assets/img/Group 2216.svg"
                                                width={40}
                                                height={40}
                                                alt="User avatar"
                                            />
                                        </button>
                                    </Link>
                                </td>

                            </tr>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Microsoft Surface Pro
                                </th>
                                <td className="px-6 py-4">
                                    White
                                </td>
                                <td className="px-6 py-4">
                                    Laptop PC
                                </td>
                                <td className="px-6 py-4">
                                    $1999
                                </td>
                            </tr>
                            <tr className="bg-white dark:bg-gray-800">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Magic Mouse 2
                                </th>
                                <td className="px-6 py-4">
                                    Black
                                </td>
                                <td className="px-6 py-4">
                                    Accessories
                                </td>
                                <td className="px-6 py-4">
                                    $99
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}