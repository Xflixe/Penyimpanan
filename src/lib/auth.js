import { account, databases } from './appwrite';
import { ID } from 'appwrite';

export const registerUser = async (email, password, name) => {
    try {
        const user = await account.create(ID.unique(), email, password, name);
        await databases.createDocument(
          `${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}`,
          `${process.env.NEXT_PUBLIC_USERS_COLLECTION_ID}`,
          user.$id,
          { name, email }
        );
        return user;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        return await account.deleteSession('current');
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};

export const uploadFile = async (file, userId) => {
    try {
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

        return uploadedFile;
    } catch (error) {
        console.error("File upload error:", error);
        throw error;
    }
};
