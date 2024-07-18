"use client"

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        identifier: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("http://localhost:1337/api/auth/local", user, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`
                }
            });
            toast.success("Login successful!");
            //router.push("/dashboard"); // Redirect to a dashboard or another page after successful login
        } catch (error: any) {
            toast.error(error.response?.data?.error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setButtonDisabled(!(user.identifier.length > 0 && user.password.length > 0));
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <div><Toaster /></div>
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    className="p-2 border border-gray-300 rounded-lg w-full mb-4 focus:outline-none focus:border-blue-500"
                    id="identifier"
                    type="text"
                    value={user.identifier}
                    onChange={(e) => setUser({ ...user, identifier: e.target.value })}
                    placeholder="Email"
                />
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    className="p-2 border border-gray-300 rounded-lg w-full mb-6 focus:outline-none focus:border-blue-500"
                    id="password"
                    type="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Password"
                />
                <button
                    onClick={onLogin}
                    disabled={buttonDisabled || loading}
                    className={`p-2 w-full text-white rounded-lg ${buttonDisabled ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"} transition duration-200`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                <div className="text-center mt-4">
                    <Link href="/signup" className="text-blue-500 hover:underline">Visit Signup page</Link>
                </div>
            </div>
        </div>
    );
}