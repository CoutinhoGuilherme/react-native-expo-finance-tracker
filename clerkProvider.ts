import * as SecureStore from "expo-secure-store";
import { createSecureStorage } from "@clerk/clerk-expo";

export const tokenCache = createSecureStorage({
  async getToken(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {}
  },
});

// ⚠️ Lê do arquivo .env
export const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY!;
