"use client";

import Image from "next/image";
import logo from "@/assets/img/logoputih.png";

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-4">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 sm:flex-row">
        <Image
          src={logo}
          alt="Logo"
          width={120}
          height={100}
          className="object-contain"
        />
        <p className="text-center">© 2025 Blog genzet. All rights reserved.</p>
      </div>
    </footer>
  );
}
