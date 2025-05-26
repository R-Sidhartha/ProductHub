'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product } from './ProductsTable';

const schema = z.object({
    name: z.string().min(1, 'Product name is required'),
    image: z.string().url('Valid image URL required'),
    description: z.string().min(10, 'Description required'),
    category: z.string().min(1, 'Category is required'),
    price: z.number().min(0, 'Price is required'),
    quantity: z.number().min(0, 'Quantity must be at least 0'),
    status: z.enum(['In Stock', 'Out of Stock']),
});

type ProductFormValues = z.infer<typeof schema>;

interface AddProductModalProps {
    initialData?: Product;
    onClose: () => void;
    onAdd: (product: ProductFormValues) => void;
    onUpdate?: (data: Product) => void;
    externalIsSubmitting?: boolean;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ initialData,
    onClose,
    onAdd,
    onUpdate,
    externalIsSubmitting }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
        resolver: zodResolver(schema),
        defaultValues: initialData || {
            name: '',
            image: '',
            description: '',
            category: '',
            price: 0,
            quantity: 0,
            status: 'In Stock'
        }
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);


    const onSubmit = (data: ProductFormValues) => {
        if (initialData && onUpdate) {
            onUpdate({ ...initialData, ...data });
        } else {
            onAdd(data);
        }
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div
                className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            >
                <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-1">
                    {initialData ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-center text-gray-500 mb-5">
                    {initialData ? 'Update product details below' : 'Enter product details below'}
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                        <input
                            {...register("name")}
                            className="normal-input"
                            placeholder="e.g., iPhone 15"
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL <span className="text-red-500">*</span></label>
                        <input
                            {...register("image")}
                            className="normal-input"
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Note: Please upload image URLs only from <a href="https://unsplash.com" target="_blank" className="underline text-purple-600">Unsplash</a>.
                        </p>
                        {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                        <textarea
                            {...register("description")}
                            className="normal-input"
                            rows={3}
                            placeholder="Brief description of the product"
                        />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                        <input
                            {...register("category")}
                            className="normal-input"
                            placeholder="e.g., Electronics"
                        />
                        {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            step="any"
                            {...register("price", { valueAsNumber: true })}
                            className="normal-input"
                            placeholder="e.g., 999.99"
                        />
                        {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            {...register("quantity", { valueAsNumber: true })}
                            className="normal-input"
                            placeholder="e.g., 50"
                        />
                        {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                        <select
                            {...register("status")}
                            className="normal-input"
                        >
                            <option value="">Select Status</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                        {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
                    </div>

                    <div className="flex justify-between gap-2 mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            className="w-1/2 bg-gray-400 text-black px-4 py-2 rounded-lg  hover:bg-transparent hover:border-gray-400 transition ease-in duration-200 hover:text-gray-600 border border-gray-400 cursor-pointer font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || externalIsSubmitting}
                            className="w-1/2 bg-purple-600 text-white px-4 py-2 rounded-lg  hover:bg-transparent hover:border-purple-600 transition ease-in duration-200 hover:text-purple-600 border border-purple-600 cursor-pointer font-semibold"
                        >
                            {isSubmitting || externalIsSubmitting
                                ? initialData ? 'Updating...' : 'Adding...'
                                : initialData ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
