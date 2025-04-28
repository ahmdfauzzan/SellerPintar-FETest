"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import axios from "@/lib/axios";
import nookies from "nookies";
import Link from "next/link";

interface TopbarProps {
  className?: string;
}

const Topbar: React.FC<TopbarProps> = ({ className }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // State for role
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const pathname = usePathname(); // Get current pathname

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const cookies = nookies.get(null);
        const token = cookies.token;

        if (token) {
          const response = await axios.get("/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUsername(response.data.username);
          setProfilePicture(response.data.profile_picture);
          setRole(response.data.role); // Save role from API
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    nookies.destroy(null, "token");
    window.location.href = "/login";
  };

  // Update the pageTitle based on pathname
  const pageTitle =
    pathname === "/admin/categories" ? "Category" : "Articles";

  return (
    <div className={`w-full bg-white ${className}`}>
      <div className="flex justify-between items-center px-14 py-4 relative">
        <h1 className="text-3xl font-semibold">{pageTitle}</h1>{" "}
        {/* Dynamically render the title */}
        <div className="relative">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {/* Avatar */}
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                {profilePicture ? (
                  <Image
                    src={profilePicture}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {username?.charAt(0).toUpperCase()}
                  </div>
                )}
                {username && (
                  <span className="hidden md:block">{username}</span>
                )}
              </>
            )}
          </div>

          {/* Overlay when dropdown is open */}
          {dropdownOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-10"
              onClick={() => setDropdownOpen(false)}
            />
          )}

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-20">
              {role === "Admin" && ( // Show Dashboard for Admin
                <Link href="/admin/articles">
                  <div className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Dashboard Admin
                  </div>
                </Link>
              )}
              <Link href="/profile">
                <div className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  My Account
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-gray-700 text-left hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
