import {
  APPWRITE_API_KEY,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_PICTURES_COLLECTION_ID,
  APPWRITE_USERS_COLLECTION_ID,
  APPWRITE_PICTURES_BUCKET_ID,
} from '@env';
import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

const client = new Client()
  .setEndpoint(APPWRITE_API_KEY)
  .setProject(APPWRITE_PROJECT_ID)
  .setPlatform('com.neuronest.neuronest');

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

/**
 * Creates an email/password session for user authentication using Appwrite
 *
 * @async
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise<import('react-native-appwrite').Models.Session>} Session object created for the user
 * @throws {Error} If the session creation fails
 */
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(typeof error === 'string' ? error : 'Unknown error ocurred.');
    }
  }
};

/**
 * Creates a new user account with the given credentials, generate an avatar with 'userName', signs in the user, and saves a user document into the database using Appwrite
 * @async
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} userName - User's username
 * @returns {Promise<import('react-native-appwrite').Models.Document>} Database document created for the user
 * @throws {Error} If account or document creation fail
 */
export const createUser = async (email, password, userName) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, userName);
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(userName);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      ID.unique(),
      {
        userName,
        userID: newAccount.$id,
        email,
        avatarUrl,
      },
    );

    return newUser;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(typeof error === 'string' ? error : 'Unknown error ocurred.');
    }
  }
};

/**
 * Takes information from currently logged-in user and queries the database to check if said user exists using Appwrite
 * @async
 * @returns {Promise<import('react-native-appwrite').Models.Document>} Current user's document if found
 * @throws {Error} If no user is currently logged in or if current user does not exist in the database
 */
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_USERS_COLLECTION_ID,
      [Query.equal('userID', currentAccount.$id)],
    );
    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(typeof error === 'string' ? error : 'Unknown error ocurred.');
    }
  }
};
