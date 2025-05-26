"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { login } from "@/lib/api/auth";
import { useAuth } from "@/context/AuthContext";
import { toast } from 'sonner';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

type LoginData = z.infer<typeof loginSchema>;

export default function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { login: authLogin } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (data: LoginData) => {
        setLoading(true);
        try {
            const result = await login(data.email, data.password);
            localStorage.setItem("token", result.token);
            authLogin();
            toast.success("Login successful!");
            router.push("/");
        } catch (err: any) {
            toast.error(err.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-72px)] bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                    Welcome Back
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Please enter your credentials to sign in
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            {...register("email")}
                            className="normal-input"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            {...register("password")}
                            className="normal-input"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg  hover:bg-transparent hover:border-puprle-600 transition ease-in duration-200 hover:text-purple-600 border border-purple-600 cursor-pointer font-semibold"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="text-purple-600 hover:underline font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
