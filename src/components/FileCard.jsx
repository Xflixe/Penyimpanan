"use client";
import { useState } from "react";
import Image from "next/image";
import { databases, ID } from "@/lib/appwrite";

const FileCard = ({ file, onDownload, onView }) => {
  const [shortLink, setShortLink] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const createShortLink = async () => {
    try {
      const document = await databases.createDocument(
        `${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}`,
        `${process.env.NEXT_PUBLIC_SHORTENED_URL_ID}`,
        ID.unique(),
        {
          originalUrl: file.previewUrl,
          createdAt: new Date().toISOString(),
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
    <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-md overflow-hidden p-4">
      <h2 className="text-xl font-bold text-white">{file.name}</h2>
      <p className="text-sm text-gray-300 mt-1">{/* Description */}</p>
      <div className="mt-4">
        <Image
          src={file.previewUrl}
          height={240}
          width={256}
          className="h-60 w-full object-contain rounded-md"
          alt={file.name}
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => onDownload(file.$id)}
          className="px-4 py-2 rounded bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
        >
          Download
        </button>
        <button
          onClick={() => onView(file.$id)}
          className="px-4 py-2 rounded bg-gray-600 text-white text-xs font-bold hover:bg-gray-700"
        >
          View
        </button>
        <button
          onClick={createShortLink}
          className="px-4 py-2 rounded bg-green-600 text-white text-xs font-bold hover:bg-green-700"
        >
          {isCopied ? "Link Copied!" : "Share"}
        </button>
      </div>
    </div>
  );
};

export default FileCard;
