"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { signup } from "@/lib/api/auth";
import { useAuth } from "@/context/AuthContext";
import { toast } from 'sonner';

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

type SignupData = z.infer<typeof signupSchema>;

export default function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupData>({ resolver: zodResolver(signupSchema) });

    const onSubmit = async (data: SignupData) => {
        setLoading(true);
        try {
            const result = await signup(data.email, data.password);
            localStorage.setItem("token", result.token);
            login();
            toast.success("Signup successful!");
            router.push("/");
        } catch (err: any) {
            toast.error(err.message || "Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-72px)] bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                    Create an Account
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Sign up to get started with your account
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            {...register("email")}
                            className="normal-input"
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            {...register("password")}
                            className="normal-input"
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg  hover:bg-transparent hover:border-puprle-600 transition ease-in duration-200 hover:text-purple-600 border border-purple-600 cursor-pointer font-semibold"
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-purple-600 hover:underline font-medium">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
