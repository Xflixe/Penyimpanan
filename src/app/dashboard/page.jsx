"use client";
import { useEffect, useState } from 'react';
import { account, storage, databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import FileCard from '@/components/FileCard'; // Import the FileCard component
import FileUploadSection from '@/components/FileUpload'; // Import the FileUploadSection component
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserFiles = async () => {
            try {
                const user = await account.get();
                const userId = user.$id;

                // Fetch user's files using Query.equal to filter by userId
                const fileDocuments = await databases.listDocuments(
                    '67209f0f00173cdb3169', // Replace with your actual database ID
                    '6720ad02000746b42e77',   // Replace with your actual collection ID
                    [Query.equal('userId', userId)]
                );

                const userFiles = await Promise.all(
                    fileDocuments.documents.map(async (doc) => {
                        const file = await storage.getFile('6720a2a2001867f6768e', doc.fileId);
                        const previewUrl = await storage.getFilePreview('6720a2a2001867f6768e', doc.fileId);

                        return {
                            ...file,
                            previewUrl,
                        };
                    })
                );

                setFiles(userFiles);
            } catch (error) {
                console.error("Error fetching user files:", error);
                setError("Could not load files. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserFiles();
    }, []);

    const handleUpload = async (uploadedFiles) => {
        const user = await account.get();
        const userId = user.$id;

        // Iterate through uploaded files (assuming multiple uploads)
        for (const file of uploadedFiles) {
            // Upload the file to Appwrite Storage
            const uploadedFile = await storage.createFile(
                '6720a2a2001867f6768e',    // Replace with your actual bucket ID
                ID.unique(),
                file
            );

            // Store file metadata in Appwrite's collection
            await databases.createDocument(
                '67209f0f00173cdb3169',  // Replace with your actual database ID
                '6720ad02000746b42e77',    // Replace with your actual collection ID
                ID.unique(),
                {
                    fileId: uploadedFile.$id,
                    userId: userId,
                }
            );

            // Fetch the preview URL for the uploaded file
            const previewUrl = await storage.getFilePreview('6720a2a2001867f6768e', uploadedFile.$id);
            setFiles((prevFiles) => [
                ...prevFiles,
                {
                    ...uploadedFile,
                    previewUrl,
                },
            ]);
        }
    };

    const handleDownload = (fileId) => {
        const downloadUrl = storage.getFileDownload('6720a2a2001867f6768e', fileId);
        window.open(downloadUrl, '_blank');
    };

    const handleView = (fileId) => {
        const viewUrl = storage.getFileView('6720a2a2001867f6768e', fileId);
        window.open(viewUrl, '_blank');
    };

    return (
        <div className="p-6 bg-black">
            <h2 className="text-2xl font-semibold text-center mb-4">Your Files</h2>
            
            {/* Upload Section using FileUploadSection component */}
            <FileUploadSection onUpload={handleUpload} />

            {loading && <p>Loading files...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.length > 0 ? (
                        files.map((file) => (
                            <FileCard 
                                key={file.$id}
                                file={file}
                                onDownload={handleDownload}
                                onView={handleView}
                            />
                        ))
                    ) : (
                        <p className="text-gray-600 col-span-full">You haven&apos;t uploaded any files yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
