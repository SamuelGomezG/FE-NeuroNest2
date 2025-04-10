import type { Models } from "react-native-appwrite";

export type AuthContextType = {
  user: Models.Document | null;
  isLoading: boolean;
};