"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { databases } from "@/lib/appwrite";

const RedirectPage = ({ params }) => {
    const { id } = params; 
    const router = useRouter();

    useEffect(() => {
        const fetchOriginalUrl = async () => {
            try {
                const document = await databases.getDocument(
                    "67209f0f00173cdb3169", // Replace with your actual database ID
                    "6720ed7c000032387dc9", // Replace with your actual collection ID
                    id
                );
                router.push(document.originalUrl);
            } catch (error) {
                console.error("Redirect failed:", error);
                router.push("/error"); // Redirect to an error page if needed
            }
        };

        fetchOriginalUrl();
    }, [id, router]);

    return <p>Redirecting...</p>;
};

export default RedirectPage;
