
/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 * Manages the current user state, loading state, and authentication operations.
 * 
 * Interacts with:
 * - Firebase Auth service
 * - Protected routes that require authentication
 * - Sign-in, sign-up, and account pages
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

// Define the shape of our context
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (username: string, email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component to wrap the app and provide auth context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const googleProvider = new GoogleAuthProvider();

  // Sign up with email and password
  const signUp = async (username: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: username });
      }
      
      return userCredential;
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
      }
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
      }
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive"
        });
      }
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive"
        });
      }
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password."
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Reset password failed",
          description: error.message,
          variant: "destructive"
        });
      }
      throw error;
    }
  };

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
