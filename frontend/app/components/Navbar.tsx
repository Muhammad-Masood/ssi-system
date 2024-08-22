"use client";
import { NavbarLink, links } from "@/lib/utils";
import { ConnectWallet } from "./ConnectWallet";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
// import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="flex justify-between items-center px-4 md:px-[3rem] py-4">
        {/* Logo Section */}
        <Link
          href="/"
          className="text-2xl lg:text-4xl font-bold text-gray-900 tracking-wide hover:text-blue-700 transition-colors duration-200"
        >
          SSI KIT
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="text-3xl md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <Menu /> : <Menu />}
        </button>

        {/* Links Section (Responsive) */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } flex-col md:flex md:flex-row md:items-center gap-4 md:gap-8 mt-4 md:mt-0 absolute md:static top-16 left-0 right-0 bg-white md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none`}
        >
          {links.map((link: NavbarLink, index: number) => (
            <Link
              href={link.href}
              key={index}
              className={`text-base md:text-lg lg:text-xl text-gray-700 hover:text-blue-700 hover:underline ${selectedLink===index?"text-blue-700":""} transition-colors duration-200 pl-2`}
              onClick={() => {
                setSelectedLink(index);
                setMenuOpen(false)
              }} // Close menu on link click for mobile
            >
              {link.name}
            </Link>
          ))}
          <div className="block lg:hidden md:hidden">
          <ConnectWallet />
        </div>
        </div>

        {/* Wallet Section */}
        <div className="hidden md:block">
          <ConnectWallet />
        </div>
      </div>

      {/* Wallet Section for Mobile */}
      {menuOpen && (
        <div className="md:hidden flex justify-center mt-4">
          <ConnectWallet />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
