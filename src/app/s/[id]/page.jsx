"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { databases } from "@/lib/appwrite";

const RedirectPage = ({ params }) => {
  const router = useRouter();

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        const { id } = await params;

        const document = await databases.getDocument(
          `${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}`,
          `${process.env.NEXT_PUBLIC_SHORTENED_URL_ID}`,
          id
        );

        console.log("Fetched Document:", document);

        if (!document.originalUrl || !document.originalUrl.startsWith("http")) {
          console.error("Invalid URL:", document.originalUrl);
          router.push("/error");
          return;
        }

        console.log("Redirecting to:", document.originalUrl);
        router.push(document.originalUrl);
      } catch (error) {
        console.error("Redirect failed:", error);
        console.log("Params:", params);
        router.push("/error");
      }
    };

    fetchOriginalUrl();
  }, [params, router]);

  return <p>Redirecting...</p>;
};

export default RedirectPage;
