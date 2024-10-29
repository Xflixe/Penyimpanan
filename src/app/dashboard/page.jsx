"use client";
import { useEffect, useState } from "react";
import { account, storage, databases } from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import FileCard from "@/components/FileCard";
import FileUploadSection from "@/components/FileUpload";

const ITEMS_PER_PAGE = 9;

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const user = await account.get();
        const userId = user.$id;

        const fileDocuments = await databases.listDocuments(
          `${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}`,
          `${process.env.NEXT_PUBLIC_FILES_COLLECTION_ID}`,
          [Query.equal("userId", userId)]
        );

        const userFiles = await Promise.all(
          fileDocuments.documents.map(async (doc) => {
            const file = await storage.getFile(
              `${process.env.NEXT_PUBLIC_VONE_BUCKET_ID}`,
              doc.fileId
            );
            const previewUrl = await storage.getFilePreview(
              `${process.env.NEXT_PUBLIC_VONE_BUCKET_ID}`,
              doc.fileId
            );

            return {
              ...file,
              previewUrl,
            };
          })
        );

        setFiles(userFiles);
        setFilteredFiles(userFiles);
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

    for (const file of uploadedFiles) {
      const uploadedFile = await storage.createFile(
        `${process.env.NEXT_PUBLIC_VONE_BUCKET_ID}`,
        ID.unique(),
        file
      );

      await databases.createDocument(
        `${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}`,
        `${process.env.NEXT_PUBLIC_FILES_COLLECTION_ID}`,
        ID.unique(),
        {
          fileId: uploadedFile.$id,
          userId: userId,
        }
      );

      const previewUrl = await storage.getFilePreview(
        `${process.env.NEXT_PUBLIC_VONE_BUCKET_ID}`,
        uploadedFile.$id
      );
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
    const downloadUrl = storage.getFileDownload(`${process.env.NEXT_PUBLIC_VONE_BUCKET_ID}`, fileId);
    window.open(downloadUrl, "_blank");
  };

  const handleView = (fileId) => {
    const viewUrl = storage.getFileView(`${process.env.NEXT_PUBLIC_VONE_BUCKET_ID}`, fileId);
    window.open(viewUrl, "_blank");
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    const filtered = files.filter((file) =>
      file.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredFiles(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentFiles = filteredFiles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 bg-black">
      <h2 className="text-2xl font-semibold text-center mb-4">Your Files</h2>

      <FileUploadSection onUpload={handleUpload} />

      <div className="mb-4 w-full flex justify-center items-center">
        <input
          type="text"
          placeholder="Search by file name"
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 rounded border border-gray-600 bg-gray-800 text-white"
        />
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-indigo-600 text-white mx-2"
        >
          Previous
        </button>
        <span className="text-white">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-indigo-600 text-white mx-2"
        >
          Next
        </button>
      </div>
      {loading && <p>Loading files...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="flex flex-wrap justify-around gap-4">
          {currentFiles.length > 0 ? (
            currentFiles.map((file) => (
              <div
                key={file.$id}
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4"
              >
                <FileCard
                  file={file}
                  onDownload={handleDownload}
                  onView={handleView}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-full">
              No files match your search.
            </p>
          )}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-indigo-600 text-white mx-2"
        >
          Previous
        </button>
        <span className="text-white">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-indigo-600 text-white mx-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
