"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/assets/img/logoputih.png";
import nookies from "nookies"; // Import nookies for cookie management

const Sidebar = () => {
  const pathname = usePathname();

  // Function to handle logout
  const handleLogout = () => {
    nookies.destroy(null, "token"); // Remove the token cookie
    window.location.href = "/login"; // Redirect to the login page
  };

  return (
    <aside className="w-64 bg-[#2563EB] text-white flex flex-col">
      <Link href="/articles" className="p-4">
        <Image src={logo} alt="Logo" />
      </Link>

      <nav className="flex flex-col gap-2 p-4">
        {/* Articles Link */}
        <Link
          href="/admin/articles"
          className={`p-2 rounded ${
            pathname.startsWith("/admin/articles") ? "bg-blue-900" : ""
          }`}
        >
          Articles
        </Link>

        {/* Categories Link */}
        <Link
          href="/admin/categories"
          className={`p-2 rounded ${
            pathname.startsWith("/admin/categories") ? "bg-blue-900" : ""
          }`}
        >
          Categories
        </Link>

        {/* Logout Link */}
        <Link
          href="#"
          onClick={handleLogout} // Trigger the logout function on click
          className={`p-2 rounded ${
            pathname.startsWith("/logout") ? "bg-blue-900" : ""
          }`}
        >
          Logout
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
