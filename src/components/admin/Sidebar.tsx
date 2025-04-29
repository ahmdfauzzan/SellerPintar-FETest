"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/assets/img/logoputih.png";
import nookies from "nookies";
import { useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    nookies.destroy(null, "token");
    window.location.href = "/login";
  };

  return (
    <>
      <aside className="w-64 bg-[#2563EB] text-white flex flex-col">
        <Link href="/articles" className="p-4">
          <Image src={logo} alt="Logo" />
        </Link>

        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="/admin/articles"
            className={`p-2 rounded ${
              pathname.startsWith("/admin/articles") ? "bg-blue-900" : ""
            }`}
          >
            Articles
          </Link>

          <Link
            href="/admin/categories"
            className={`p-2 rounded ${
              pathname.startsWith("/admin/categories") ? "bg-blue-900" : ""
            }`}
          >
            Categories
          </Link>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`p-2 text-left rounded w-full ${
              pathname.startsWith("/logout") ? "bg-blue-900" : ""
            }`}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Modal Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-30 bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-bold mb-2 text-gray-800">Logout</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure want to logout?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
