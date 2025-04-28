"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import nookies from "nookies";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

interface Profile {
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const cookies = nookies.get(null);
        const token = cookies.token;

        if (token) {
          const response = await axios.get("/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header className="bg-transparent z-10 border-b-gray-500 border-b-2" />

      <div className="flex-grow flex items-center justify-center bg-gray-50 py-16">
        <div className="w-full max-w-md px-6 py-8 bg-white shadow-lg rounded-lg text-center">
          {loading ? (
            <div className="text-center text-lg text-gray-600">Loading...</div>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-gray-800 mb-6">
                User Profile
              </h1>

              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-blue-200 mx-auto flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-blue-700">
                  {profile?.username.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Profile Details */}
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between border px-4 py-2 rounded">
                  <span className="font-semibold">Username</span>
                  <span>{profile?.username}</span>
                </div>
                <div className="flex justify-between border px-4 py-2 rounded">
                  <span className="font-semibold">Created At</span>
                  <span>{profile?.createdAt}</span>
                </div>
                <div className="flex justify-between border px-4 py-2 rounded">
                  <span className="font-semibold">Role</span>
                  <span>{profile?.role}</span>
                </div>
              </div>

              {/* Back to Home Button */}
              <button
                onClick={() => router.push("/articles")}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
              >
                Back to home
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
