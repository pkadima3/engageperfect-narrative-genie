
/**
 * User Profile Page
 * 
 * Allows users to view and manage their account information.
 * 
 * Interacts with:
 * - AuthContext for current user data
 * - Firestore for extended profile data
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, UserCircle, Mail, Shield, CreditCard, Calendar, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserDisplayName } from "@/services/userService";
import { UserProfile } from "@/types/user";
import PageLayout from "@/components/Layout/PageLayout";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import { Input } from "@/components/ui/input";
import { pageTransition } from "@/lib/animations";

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
        setDisplayName(currentUser.displayName || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [currentUser, toast]);
  
  const handleUpdateDisplayName = async () => {
    if (!displayName.trim()) {
      toast({
        title: "Error",
        description: "Display name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setUpdateLoading(true);
      await updateUserDisplayName(displayName);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Your display name has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update display name.",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <PageLayout className="bg-[#0d1425] text-white">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="bg-[#0d1425] text-white">
      <motion.div
        className="w-full max-w-4xl mx-auto px-6 py-12"
        initial="initial"
        animate="animate"
        variants={pageTransition}
      >
        <div className="mb-8 flex items-center">
          <PrimaryButton
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            icon={<ArrowLeft className="h-4 w-4" />}
            className="mr-4"
          >
            Back
          </PrimaryButton>
          <h1 className="text-3xl font-bold">Your Profile</h1>
        </div>

        <div className="glass-panel rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <User className="mr-2 h-5 w-5" />
              Account Information
            </h2>
            {!isEditing && (
              <PrimaryButton
                variant="outline"
                onClick={() => setIsEditing(true)}
                icon={<User className="h-4 w-4" />}
                size="sm"
              >
                Edit Profile
              </PrimaryButton>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center md:w-1/3">
                <UserCircle className="h-5 w-5 mr-2 text-slate-400" />
                <span className="text-slate-300">Display Name</span>
              </div>
              <div className="md:w-2/3 mt-2 md:mt-0">
                {isEditing ? (
                  <div className="flex items-center">
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mr-2"
                    />
                    <PrimaryButton
                      size="sm"
                      onClick={handleUpdateDisplayName}
                      loading={updateLoading}
                      disabled={updateLoading}
                    >
                      Save
                    </PrimaryButton>
                    <PrimaryButton
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(currentUser?.displayName || "");
                      }}
                      className="ml-2"
                    >
                      Cancel
                    </PrimaryButton>
                  </div>
                ) : (
                  <span className="font-medium">{currentUser?.displayName || "Not set"}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center md:w-1/3">
                <Mail className="h-5 w-5 mr-2 text-slate-400" />
                <span className="text-slate-300">Email</span>
              </div>
              <div className="md:w-2/3 mt-2 md:mt-0">
                <span className="font-medium">{currentUser?.email}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center md:w-1/3">
                <Calendar className="h-5 w-5 mr-2 text-slate-400" />
                <span className="text-slate-300">Account Created</span>
              </div>
              <div className="md:w-2/3 mt-2 md:mt-0">
                <span className="font-medium">
                  {formatDate(userProfile?.createdAt || currentUser?.metadata.creationTime)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {userProfile && (
          <div className="glass-panel rounded-xl p-8">
            <h2 className="text-2xl font-semibold flex items-center mb-6">
              <CreditCard className="mr-2 h-5 w-5" />
              Subscription Information
            </h2>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center md:w-1/3">
                  <Shield className="h-5 w-5 mr-2 text-slate-400" />
                  <span className="text-slate-300">Current Plan</span>
                </div>
                <div className="md:w-2/3 mt-2 md:mt-0">
                  <span className="font-medium capitalize">
                    {userProfile.selected_plan || userProfile.plan_type || "Free"}
                  </span>
                </div>
              </div>

              {userProfile.requests_limit && (
                <div className="flex flex-col md:flex-row md:items-center bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center md:w-1/3">
                    <span className="text-slate-300">Usage</span>
                  </div>
                  <div className="md:w-2/3 mt-2 md:mt-0">
                    <div className="flex items-center">
                      <div className="w-full bg-slate-700 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              ((userProfile.requests_used || 0) / userProfile.requests_limit) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        {userProfile.requests_used || 0}/{userProfile.requests_limit}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {userProfile.reset_date && (
                <div className="flex flex-col md:flex-row md:items-center bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center md:w-1/3">
                    <Calendar className="h-5 w-5 mr-2 text-slate-400" />
                    <span className="text-slate-300">Next Reset</span>
                  </div>
                  <div className="md:w-2/3 mt-2 md:mt-0">
                    <span className="font-medium">{formatDate(userProfile.reset_date)}</span>
                  </div>
                </div>
              )}

              {userProfile.trial_end_date && (
                <div className="flex flex-col md:flex-row md:items-center bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center md:w-1/3">
                    <Calendar className="h-5 w-5 mr-2 text-slate-400" />
                    <span className="text-slate-300">Trial Ends</span>
                  </div>
                  <div className="md:w-2/3 mt-2 md:mt-0">
                    <span className="font-medium">{formatDate(userProfile.trial_end_date)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </PageLayout>
  );
};

export default Profile;
