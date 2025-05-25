import React from 'react';
import { ChevronsUpDown } from 'lucide-react';

const headers = [
    "Product ID", "Name", "Image", "Description", "Category", "Price", "Quantity", "Status", "Action"
];

const Loading = () => {
    return (
        <div className="overflow-x-auto min-h-screen p-4 bg-white rounded-xl shadow-xl">
            <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100 text-gray-700 text-left">
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header}
                                className={`p-3 border border-gray-300 whitespace-nowrap ${header === "Price" || header === "Quantity"
                                    ? "w-[120px]"
                                    : header === "Status"
                                        ? "w-[160px]"
                                        : header === "Image"
                                            ? "w-[100px]"
                                            : ""
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    {header}
                                    {header !== "Action" && (
                                        <ChevronsUpDown className="w-4 text-gray-400" />
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>

                    <tr className="bg-white">
                        {headers.map((header) => {
                            const isRange = header === 'Price' || header === 'Quantity';
                            const isTextField = ["Product ID", "Name", "Description", "Category"].includes(header);

                            return (
                                <td
                                    key={header}
                                    className={`p-2 border border-gray-300 ${header === "Price" || header === "Quantity"
                                        ? "w-[180px]"
                                        : header === "Status"
                                            ? "w-[160px]"
                                            : header === "Image"
                                                ? "w-[100px]"
                                                : ""
                                        }`}
                                >
                                    {header === "Status" ? (
                                        <select className="filter-input cursor-not-allowed bg-gray-100 text-gray-400" disabled>
                                            <option>All Status</option>
                                        </select>
                                    ) : isRange ? (
                                        <div className="flex gap-1">
                                            <input type="number" placeholder="Min" className="filter-input cursor-not-allowed bg-gray-100" disabled />
                                            <input type="number" placeholder="Max" className="filter-input cursor-not-allowed bg-gray-100" disabled />
                                        </div>
                                    ) : isTextField ? (
                                        <input type="text" placeholder={`Filter ${header}`} className="filter-input cursor-not-allowed bg-gray-100" disabled />
                                    ) : null}
                                </td>
                            );
                        })}
                        <td className="border border-gray-300" />
                    </tr>
                </thead>

                <tbody className="animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <tr key={i} className="border-b border-gray-200">
                            <td className="p-3 border border-gray-300"><div className="h-4 w-20 bg-gray-300 rounded" /></td>
                            <td className="p-3 border border-gray-300"><div className="h-4 w-28 bg-gray-300 rounded" /></td>
                            <td className="p-3 border border-gray-300"><div className="w-12 h-12 bg-gray-300 rounded-md" /></td>
                            <td className="p-3 border border-gray-300">
                                <div className="space-y-1">
                                    <div className="h-3 w-48 bg-gray-300 rounded" />
                                    <div className="h-3 w-40 bg-gray-300 rounded" />
                                </div>
                            </td>
                            <td className="p-3 border border-gray-300"><div className="h-4 w-20 bg-gray-300 rounded" /></td>
                            <td className="p-3 border border-gray-300"><div className="h-4 w-16 bg-gray-300 rounded" /></td>
                            <td className="p-3 border border-gray-300"><div className="h-4 w-16 bg-gray-300 rounded" /></td>
                            <td className="p-3 border border-gray-300"><div className="h-4 w-24 bg-gray-300 rounded" /></td>
                            <td className="p-3 border border-gray-300"><div className="h-4 w-6 bg-gray-300 rounded" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Loading;
