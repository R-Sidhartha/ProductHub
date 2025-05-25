"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-cyan-100 px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight text-gray-900 mb-2">
          Welcome to <span className="text-purple-600">ProductHub</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-10">
          Your all-in-one solution to manage, showcase, and grow your products with ease.
        </p>
        <Link
          href="/sign-up"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg  hover:bg-transparent hover:border-puprle-600 transition ease-in duration-200 hover:text-purple-600 border border-purple-600 cursor-pointer font-semibold"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
