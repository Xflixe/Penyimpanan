"use client";
import { useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

const Navbar = () => {
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

    const handleLogout = async () => {
        try {
            await account.deleteSession('current'); // Log out the current session
            setIsLoggedIn(false);
            router.push('/'); // Redirect to the home page after logging out
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleHomeRedirect = () => {
        router.push('/'); // Redirect to the Home
    };

    return (
        <nav className="p-4 bg-black z-10"> {/* Added bg-opacity for transparency and fixed positioning */}
            <div className="container mx-auto flex justify-between items-center">
                <button className="text-white text-2xl" onClick={handleHomeRedirect}>OpalSpace</button>
                <div>
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Logout
                        </button>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
