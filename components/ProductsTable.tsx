import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronsUpDown } from "lucide-react";
import { useDebounce } from '@/hooks/useDebounce';

export interface Product {
    id?: number;
    productId?: string;
    name: string;
    image: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
    status: 'In Stock' | 'Out of Stock';
}

interface ProductsTableProps {
    products: Product[];
    setFilters?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    onDelete?: (id: number) => void;
    filters: Record<string, string>;
    setEditProduct: (product: Product) => void;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products, setFilters, setEditProduct, onDelete, filters, setShowModal }) => {
    const [dropdownOpenId, setDropdownOpenId] = useState<Number | null>(null);
    const [localFilters, setLocalFilters] = useState<Record<string, string>>(filters);

    const debouncedFilters = useDebounce(localFilters, 500);
    const dropdownRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        if (setFilters) {
            setFilters(debouncedFilters);
        }
    }, [debouncedFilters, setFilters]);


    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpenId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = (id: Number) => {
        setDropdownOpenId(dropdownOpenId === id ? null : id);
    };

    const headers: Array<keyof Product> = ['productId', 'name', 'image', 'description', 'category', 'price', 'quantity', 'status'];

    return (
        <div className="overflow-x-auto min-h-screen p-4 bg-white rounded-xl shadow-xl">
            <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100 text-gray-700 text-left">
                    <tr>
                        {headers.map((key) => (
                            <th
                                key={key}
                                className={`p-3 border border-gray-300 whitespace-nowrap ${key === "price" || key === "quantity"
                                    ? "w-[120px]"
                                    : key === "status"
                                        ? "w-[160px]"
                                        : key === "image"
                                            ? "w-[100px]"
                                            : ""
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    {key === "productId"
                                        ? "Product ID"
                                        : key === "name"
                                            ? "Name"
                                            : key === "image"
                                                ? "Image"
                                                : key[0].toUpperCase() + key.slice(1)}
                                    <ChevronsUpDown className="w-4 text-gray-400" />
                                </div>
                            </th>
                        ))}
                        <th className="p-3 border border-gray-300 w-[80px]">Action</th>
                    </tr>

                    <tr className="bg-white">
                        {headers.map((key) => {
                            const isRangeField = key === 'price' || key === 'quantity';
                            const isTextField = key === 'productId' || key === 'name' || key === 'description' || key === 'category';

                            return (
                                <td
                                    key={key}
                                    className={`p-2 border border-gray-300 ${key === 'price' || key === 'quantity' ? 'w-[180px]' :
                                        key === 'status' ? 'w-[160px]' :
                                            key === 'image' ? 'w-[100px]' :
                                                ''
                                        }`}
                                >
                                    {key === 'status' ? (
                                        <select
                                            value={localFilters[key] || ''}
                                            onChange={(e) =>
                                                setLocalFilters(prev => ({ ...prev, [key]: e.target.value }))
                                            }
                                            className={`filter-input ${localFilters[key] ? 'border-purple-500 bg-purple-100' : ''
                                                } 
`}
                                        >
                                            <option value="">All Status</option>
                                            <option value="In Stock">In Stock</option>
                                            <option value="Out of Stock">Out of Stock</option>
                                        </select>
                                    ) : isRangeField ? (
                                        <div className="flex gap-1">
                                            {['min', 'max'].map((range) => {
                                                const fieldKey = `${range}${key[0].toUpperCase() + key.slice(1)}`;
                                                return (
                                                    <input
                                                        key={range}
                                                        type="number"
                                                        placeholder={range === 'min' ? 'Min' : 'Max'}
                                                        value={localFilters[fieldKey] || ''}
                                                        onChange={(e) =>
                                                            setLocalFilters(prev => ({
                                                                ...prev,
                                                                [fieldKey]: e.target.value,
                                                            }))
                                                        }
                                                        className={`filter-input ${localFilters[fieldKey] ? 'border-purple-500 bg-purple-100' : ''
                                                            } 
`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ) : isTextField ? (
                                        <input
                                            type="text"
                                            placeholder={`Filter ${key}`}
                                            value={localFilters[key] || ''}
                                            onChange={(e) =>
                                                setLocalFilters(prev => ({ ...prev, [key]: e.target.value }))
                                            }
                                            className={`filter-input ${localFilters[key] ? 'border-purple-500 bg-purple-100' : ''
                                                }
`}
                                        />
                                    ) : null}
                                </td>
                            );
                        })}
                        <td className="border border-gray-300"></td>
                    </tr>
                </thead>

                <tbody>
                    {products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50 transition duration-200">
                            <td className="p-3 border border-gray-300 font-medium">{product.productId}</td>
                            <td className="p-3 border border-gray-300">{product.name}</td>
                            <td className="p-3 border border-gray-300">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={50}
                                    height={50}
                                    className="rounded-md object-cover"
                                />
                            </td>
                            <td className="p-3 border border-gray-300 text-sm text-gray-600">
                                {product.description.length > 100
                                    ? product.description.slice(0, 80) + '...'
                                    : product.description}
                            </td>
                            <td className="p-3 border border-gray-300 align-middle">
                                <span className="inline-block px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 rounded-full">
                                    {product.category}
                                </span>
                            </td>
                            <td className="p-3 border border-gray-300">{product.price}</td>
                            <td className="p-3 border border-gray-300">{product.quantity}</td>
                            <td className={`p-3 border border-gray-300 font-semibold ${product.status === 'In Stock' ? 'text-green-600' : 'text-red-500'}`}>
                                {product.status}
                            </td>
                            <td className="p-3 border border-gray-300 relative">
                                {product.id && (
                                    <>
                                        <button
                                            onClick={() => toggleDropdown(product.id!)}
                                            className="px-2 text-2xl py-1 rounded hover:opacity-50 cursor-pointer"
                                        >
                                            &#8942;
                                        </button>
                                        {dropdownOpenId === product.id && (
                                            <div ref={dropdownRef} className="absolute right-0 mt-1 w-24 bg-white border shadow-lg rounded z-10">
                                                <button
                                                    className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                                                    onClick={() => {
                                                        setEditProduct(product);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-red-600"
                                                    onClick={() => onDelete?.(product.id!)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsTable;
