import axios from "axios";
import { useEffect, useState } from "react";

function Contact() {
  const [querry, setQuerry] = useState([]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_CONTACT_LIST)
      .then((res) => {
        setQuerry(res.data);
      })
      .catch(() => {
        console.error("Error in receiving Data");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700 dark:text-orange-400">
          Contact Queries
        </h2>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700">
          <thead className="bg-blue-600 text-white dark:bg-gray-800">
            <tr>
              {["S.No", "Name", "Email", "Phone Number", "Message", "Date"].map(
                (header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-center font-semibold tracking-wide text-white dark:text-orange-400"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {querry.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-100 dark:bg-gray-700"
                } hover:bg-blue-50 dark:hover:bg-gray-600 transition`}
              >
                <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                  {item.id}
                </td>
                <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                  {item.email}
                </td>
                <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                  {item.phone}
                </td>
                <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200 max-w-xs break-words">
                  {item.message}
                </td>
                <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                  {item.date?.slice(0, 10) || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Contact;
