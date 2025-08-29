import axios from "axios";
import { useEffect, useState } from "react";

function Contact() {
    const [querry, setQuerry] = useState([])




    useEffect(() => {
        axios.get(import.meta.env.VITE_CONTACT_LIST).then((res) => {
            setQuerry(res.data)
        }).catch(() => {
            console.error("Error in receving Data")
        })

    }, [])
    return (
        <div className="flex justify-center  min-h-screen bg-gray-100">
            <div className="w-full max-w-6xl p-6 rounded-2xl">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
                    Contact Queries
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-center border-b border-gray-300  text-sm font-semibold text-gray-700">
                                    S.NO
                                </th>
                                <th className="px-4 py-3 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">
                                    Name
                                </th>
                                <th className="px-4 py-3 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">
                                    Email
                                </th>
                                <th className="px-4 py-3 border-b border-gray-300 text-centertext-sm font-semibold text-gray-700">
                                    Phone Number
                                </th>
                                <th className="px-4 py-3 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">
                                    Messages
                                </th>
                                <th className="px-4 py-3 border-b border-gray-300 text-center text-sm font-semibold text-gray-700">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                querry.map((item,index) => {
                                    return (<>
                                        <tr key={index} className={`${index%2==0 ? "bg-white":"bg-[#EFF6FF]"}`}>
                                            <td className="px-2 py-3 border-b text-center border-gray-200 text-sm text-gray-700">
                                                {item.id}
                                            </td>
                                            <td className="px-2 py-3 border-b text-center border-gray-200 text-sm text-gray-700">
                                                {item.name}
                                            </td>
                                            <td className="px-2 py-3 border-b text-center border-gray-200 text-sm text-gray-700">
                                                {item.email}
                                            </td>
                                            <td className="px-2 py-3 border-b text-center border-gray-200 text-sm text-gray-700">
                                                {item.phone}
                                            </td>
                                            <td className="px-2 py-3 border-b w-36 text-center border-gray-200 text-sm text-gray-700">
                                                {item.message}
                                            </td>
                                            <td className="px-2 py-3 border-b text-center border-gray-200 text-sm text-gray-700">
                                                {item.date.slice(0,10)}
                                            </td>
                                        </tr>     </>)
                                })

                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Contact;
