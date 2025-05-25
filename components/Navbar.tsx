"use client";
import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { isLoggedIn, logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push("/sign-in");
    };

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center sticky top-0 z-50">
            <Link href="/" className="text-2xl font-bold text-purple-600 hover:text-purple-700 transition-colors">
                ProductHub
            </Link>

            <div className="flex items-center space-x-6 text-sm font-medium">
                {!isLoggedIn ? (
                    <Link
                        href="/sign-up"
                        className="text-purple-600 hover:text-purple-800 transition-colors font-semibold text-lg"
                    >
                        Sign Up
                    </Link>
                ) : (
                    <>
                        <Link
                            href="/products"
                            className={`px-3 py-1.5 text-lg rounded-md font-semibold transition-all ${isActive("/products")
                                ? "underline text-purple-700 font-bold"
                                : "text-gray-600 hover:text-purple-700"
                                }`}
                        >
                            Products
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-red-500 hover:text-red-700 transition-colors font-semibold text-lg"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
