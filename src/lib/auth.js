import { account, databases } from './appwrite';
import { ID } from 'appwrite';

export const registerUser = async (email, password, name) => {
    try {
        const user = await account.create(ID.unique(), email, password, name);
        await databases.createDocument('67209f0f00173cdb3169', '67209f1e0028e75dceb6', user.$id, { name, email });
        return user;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        // Create a session for the user
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
        // Upload file to Appwrite storage
        const uploadedFile = await storage.createFile('6720a2a2001867f6768e', 'unique()', file);

        // Add file metadata to the UserFiles collection
        await databases.createDocument(
            '67209f0f00173cdb3169', // Replace with your database ID
            '6720ad02000746b42e77',   // Replace with your collection ID
            'unique()',    // Unique document ID
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
