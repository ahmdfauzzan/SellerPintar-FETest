import { useEffect, useState } from "react";
import Image from "next/image";
import logoipsum from "@/assets/img/logoipsum.png";
import axios from "@/lib/axios";
import nookies from "nookies";
import Link from "next/link";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
          setRole(response.data.role);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // const handleLogout = () => {
  //   nookies.destroy(null, "token");
  //   window.location.href = "/login";
  // };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center px-14 py-4 relative">
        {/* Logo clickable */}
        <Link href="/articles">
          <Image src={logoipsum} alt="Logo" width={140} height={40} />
        </Link>

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
                {username && <span>{username}</span>}
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
              {role === "Admin" && ( // 👈 Kalau Admin, tampilkan Dashboard
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
                onClick={() => setShowLogoutConfirm(true)}
                className="block w-full px-4 py-2 text-gray-700 text-left hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        {showLogoutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-30 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
              <h2 className="text-lg font-bold mb-2">Logout</h2>
              <p className="text-sm mb-4">Are you sure want to logout?</p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => {
                    nookies.destroy(null, "token");
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
