"use client"

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
//import { signupSchema } from "@/app/clinetvaildations/signup"

interface User {
    email: string;
    password: string;
    username: string;
}

export default function SignupPage() {
    const router = useRouter();

    const [user, setUser] = useState<User>({
        email: "",
        password: "",
        username: ""
    });
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const onSignUp = async () => {
        try {
            setLoading(true);
            // Validate user input
            // const result = signupSchema.safeParse(user);

            // if (!result.success) {
            //     const formattedErrors: any = result.error.format();

            //     const errorMessage = Object.keys(formattedErrors)
            //         .map((key) => {
            //             const error = formattedErrors[key];
            //             if (error._errors && Array.isArray(error._errors)) {
            //                 return error._errors.join(", ");
            //             } else {
            //                 return "Unknown error";
            //             }
            //         })
            //         .join("\n");

            //     toast.error(errorMessage);
            //     return;
            // }
            const response = await axios.post("http://localhost:1337/api/auth/local/register", user, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 641200374d9b87fb667a92212759c3121b7278d938b68e36c33513d1f0f014a1775915e50dd3f8066adeda2188946237c73dad1f82626b9d21c4b55fa9cb61c9a92a8ce597ea620f6f4342fc6400b496fc86384772147305d8ebe4276bc93f8824b590298dc9f24b7da48688ed149c7b555fb89492752073c2ef039693a4ff49'
                }
            });
            console.log("🚀 ~ onSignUp ~ response:", response)

            if (response.data.success) {
                router.push("/login");
            } else {
                // Handle unexpected success response
                toast.error("Signup succeeded but an unexpected response was received.");
            }
        } catch (error: any) {
            console.log("🚀 ~ onSignUp ~ error:", error)
            if (error.code === 'ERR_NETWORK') {
                toast.error("Network error. Please check your connection or try again later.");
            } else {
                const errorMessage = error.response?.data?.error.message || "An unexpected error occurred.";
                if (typeof errorMessage === 'string') {
                    toast.error(errorMessage);
                } else if (Array.isArray(errorMessage)) {
                    errorMessage.forEach((msg: string) => toast.error(msg));
                } else if (typeof errorMessage === 'object' && errorMessage !== null) {
                    toast.error(JSON.stringify(errorMessage));
                } else {
                    toast.error("An unexpected error occurred.");
                }
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <div><Toaster /></div>
            <h1>{loading ? "processing" : "signup"}</h1>
            <hr />
            <label htmlFor="username">Username</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="username"
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="Username"
            />
            <label htmlFor="email">Email</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="email"
                type="text"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email"
            />
            <label htmlFor="password">Password</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="Password"
            />
            <button
                onClick={onSignUp}
                className={`p-2 ${buttonDisabled ? 'bg-gray-500' : 'bg-blue-500'} text-white rounded-lg hover:bg-blue-600`}
                disabled={buttonDisabled}
            >
                {buttonDisabled ? "no signup" : "signup"}
            </button>
            <Link href="/login">Visit login page</Link>
        </div>
    );
}

