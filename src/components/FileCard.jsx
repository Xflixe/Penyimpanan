"use client";

import { useState } from "react";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { databases, ID } from "@/lib/appwrite"; // Import necessary modules

const FileCard = ({ file, onDownload, onView }) => {
    const [shortLink, setShortLink] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    // Function to create a short link
    const createShortLink = async () => {
        try {
            const document = await databases.createDocument(
                "67209f0f00173cdb3169", // Replace with your actual database ID
                "6720ed7c000032387dc9", // Replace with your actual collection ID
                ID.unique(),
                {
                    originalUrl: file.previewUrl,
                    createdAt: new Date().toISOString()
                }
            );
            const shortUrl = `${window.location.origin}/s/${document.$id}`;
            setShortLink(shortUrl);
            navigator.clipboard.writeText(shortUrl);
            setIsCopied(true);
        } catch (error) {
            console.error("Failed to create short link:", error);
        }
    };

    return (
        <CardContainer className="inter-var">
            <CardBody
                className="bg-gray-50 relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-black border-white/[0.2] w-auto sm:w-[30rem] h-auto rounded-xl p-4 border"
            >
                <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-white overflow-hidden text-balance"
                >
                    {file.name}
                </CardItem>
                <CardItem
                    as="p"
                    translateZ="60"
                    className="text-sm max-w-sm mt-2 text-neutral-300"
                >
                    {/* Description */}
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                    <Image
                        src={file.previewUrl}
                        height={240} 
                        width={256} 
                        className="h-60 w-full object-fit rounded-xl group-hover/card:shadow-xl"
                        alt={file.name}
                    />
                </CardItem>
                <div className="flex justify-between items-center mt-4">
                    <CardItem
                        translateZ={20}
                        as="button"
                        onClick={() => onDownload(file.$id)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                    >
                        Download
                    </CardItem>
                    <CardItem
                        translateZ={20}
                        as="button"
                        onClick={() => onView(file.$id)}
                        className="px-4 py-2 rounded-xl bg-gray-600 text-white text-xs font-bold hover:bg-gray-700"
                    >
                        View
                    </CardItem>
                    <CardItem
                        translateZ={20}
                        as="button"
                        onClick={createShortLink}
                        className="px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700"
                    >
                        {isCopied ? "Link Copied!" : "Share"}
                    </CardItem>
                </div>
            </CardBody>
        </CardContainer>
    );
};

export default FileCard;
