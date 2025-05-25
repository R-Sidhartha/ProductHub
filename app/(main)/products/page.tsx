'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ProductsTable, { Product } from '@/components/ProductsTable';
import AddProductModal from '@/components/AddProductModal';
import {
    createProduct,
    deleteProduct,
    getFilteredProducts,
    updateProduct,
} from '@/lib/api/products';
import { useRouter } from 'next/navigation';
import Loading from './loading';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const Page = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [filtersLoaded, setFiltersLoaded] = useState(false);
    const router = useRouter();
    const { isLoggedIn, loading } = useAuth();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.push('/sign-in');
        }
    }, [loading, isLoggedIn, router]);

    useEffect(() => {
        if (filtersLoaded) {
            localStorage.setItem('productFilters', JSON.stringify(filters));
        }
    }, [filters, filtersLoaded]);

    useEffect(() => {
        const savedFilters = localStorage.getItem('productFilters');
        if (savedFilters) {
            setFilters(JSON.parse(savedFilters));
        }
        setFiltersLoaded(true);
    }, []);

    const fetchFilteredProducts = useCallback(
        async (filters: Record<string, string>, token: string) => {
            try {
                setFetchLoading(true);
                const data = await getFilteredProducts(filters, token);
                setProducts(data);
                toast.success('Products loaded successfully!');
            } catch (err: any) {
                toast.error(err.message || 'Failed to load filtered products');
            } finally {
                setFetchLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        if (token && filtersLoaded) {
            fetchFilteredProducts(filters, token);
        }
    }, [filters, token, filtersLoaded, fetchFilteredProducts]);

    const handleAddProduct = async (newProductData: {
        name: string;
        image: string;
        description: string;
        category: string;
        price: number;
        quantity: number;
        status: "In Stock" | "Out of Stock";
    }) => {
        if (!token) {
            toast.error('Unauthorized, please login.');
            return;
        }
        setActionLoading(true);
        try {
            const payload = {
                ...newProductData,
                price: newProductData.price,
            };

            const createdProduct = await createProduct(payload, token);
            setProducts((prev) => [createdProduct, ...prev]);
            toast.success('Product added successfully!');
            setShowModal(false);
        } catch (err: any) {
            toast.error(err.message || 'Failed to add product');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async (updatedProduct: Product) => {
        if (!token) return;
        setActionLoading(true)
        if (updatedProduct.id === undefined) {
            toast.error('Invalid product: missing ID');
            return;
        }
        try {
            await updateProduct(updatedProduct.id, updatedProduct, token);
            setProducts((prev) =>
                prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
            );
            toast.success('Product updated successfully!');

        } catch (err: any) {
            toast.error(err.message || 'Failed to update product');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!token) return;
        setActionLoading(true)
        try {
            await deleteProduct(id, token);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success('Product deleted successfully!');

        } catch (err: any) {
            toast.error(err.message || 'Failed to delete product');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="flex px-5 items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Products Dashboard</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg  hover:bg-transparent hover:border-puprle-600 transition ease-in duration-200 hover:text-purple-600 border border-purple-600 cursor-pointer font-semibold"
                >
                    Add Product
                </button>
            </div>
            {fetchLoading || actionLoading ? (
                <Loading />
            ) : (
                <ProductsTable
                    products={products}
                    setFilters={setFilters}
                    onDelete={handleDelete}
                    filters={filters}
                    setEditProduct={setEditProduct}
                    setShowModal={setShowModal}
                />
            )}

            {showModal && (
                <AddProductModal
                    onClose={() => {
                        setShowModal(false);
                        setEditProduct(null);
                    }}
                    onAdd={handleAddProduct}
                    onUpdate={handleUpdate}
                    externalIsSubmitting={actionLoading}
                    initialData={editProduct || undefined}

                />
            )}
        </div>
    );
};

export default Page;