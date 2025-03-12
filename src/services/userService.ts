
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { UserProfile } from "@/types/user";

// User collection reference
const USERS_COLLECTION = "users";

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (
  userId: string, 
  profileData: Partial<UserProfile>
): Promise<void> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      await updateDoc(userDocRef, profileData);
    } else {
      // Create new user document if it doesn't exist
      await setDoc(userDocRef, {
        ...profileData,
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Update user display name in both Auth and Firestore
 */
export const updateUserDisplayName = async (displayName: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");
    
    // First update the Firebase Auth display name
    await user.updateProfile({ displayName });
    
    // Then update the Firestore profile
    await updateUserProfile(user.uid, { displayName });
    
    return;
  } catch (error) {
    console.error("Error updating display name:", error);
    throw error;
  }
};
