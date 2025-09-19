"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useFavoriteStore } from "@/store/favoriteStore";
import Link from "next/link";
import Image from "next/image";

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

  const { favorites } = useFavoriteStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/auth/profile");
        setProfile(response.data);
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

      <div className="flex-grow flex flex-col items-center bg-gray-50 py-16">
        <div className="w-full max-w-md px-6 py-8 bg-white shadow-lg rounded-lg text-center mb-10">
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

        {/* Favorite Articles */}
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">My Favorite Articles</h2>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favorites.map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`}>
                  <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                    <div className="relative w-full aspect-[4/3] bg-gray-100">
                      {article.imageUrl ? (
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-lg">{article.title}</h3>
                      <p className="text-sm text-gray-500">
                        {article.category.name} • By {article.user.username}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No favorite articles yet.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
