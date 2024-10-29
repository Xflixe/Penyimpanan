"use client";
import { useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { Vortex } from '@/components/ui/vortex';

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                await account.get();
                setIsLoggedIn(true);
            } catch (error) {
                setIsLoggedIn(false);
            }
        };

        checkSession();
    }, []);

    const handleDashboardRedirect = () => {
        router.push('/dashboard');
    };

    return (
        <div className="relative w-full h-screen">
            <Vortex />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h2 className="text-center text-3xl font-semibold mb-4">Welcome to OpalSpace</h2>
                {isLoggedIn ? (
                    <button 
                        onClick={handleDashboardRedirect} 
                        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                    >
                        Go to Dashboard
                    </button>
                ) : (
                    <div className="text-center p-4">
                        <p className="mb-4">
                            You are not logged in. Please sign up or log in to use this project.
                        </p>
                        <button 
                            onClick={() => router.push('/login')} 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => router.push('/register')} 
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
