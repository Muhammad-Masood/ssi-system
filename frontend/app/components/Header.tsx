"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext, useState } from "react";
import { WalletContext } from "@/providers/Providers";
import Link from "next/link";
import { ConnectWallet } from "./ConnectWallet";
import {
  adminNavbarLinks,
  issuerNavbarLinks,
  NavbarLink,
  userNavbarLinks,
  verifierNavbarLinks,
} from "@/lib/utils";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export function Header({ session }: { session: Session | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>();
  const { wallet } = useContext(WalletContext);
  const router = useRouter();
  const pathName = usePathname();
  const isAdminPath = pathName.startsWith("/admin");
  console.log(isAdminPath);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-[1.3rem] py-1">
      <div className="flex h-14 items-center gap-4 px-4">
        {/* <SidebarTrigger /> */}
        <div className="flex-1">
          <Link
            href="/"
            className="text-2xl lg:text-4xl font-bold text-gray-900 tracking-wide hover:text-blue-700 transition-colors duration-200"
          >
            {!pathName.startsWith("/dashboard") && "SSI KIT"}
          </Link>
        </div>

        <div
          className="space-x-6 px-4"
          // className={`${
          // ""
          // menuOpen ? "flex" : "hidden"
          // } flex-col md:flex md:flex-row md:items-center gap-4 md:gap-8 mt-4 md:mt-0 absolute md:static top-16 left-0 right-0 bg-white md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none`}
        >
          {(wallet.tab === "issuer"
            ? issuerNavbarLinks
            : wallet.tab === "verifier"
            ? verifierNavbarLinks
            : isAdminPath
            ? adminNavbarLinks
            : userNavbarLinks
          ).map((link: NavbarLink, index: number) => (
            <Link
              href={link.href}
              key={index}
              className={`text-base text-gray-700 hover:text-blue-700 ${
                selectedLink === index ? "text-blue-700" : ""
              } transition-colors duration-300 pl-2`}
              onClick={() => {
                setSelectedLink(index);
                setMenuOpen(false);
              }} // Close menu on link click for mobile
            >
              {link.name}
            </Link>
          ))}
        </div>
        {session ? (
          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    4
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  New VC request from John Doe
                </DropdownMenuItem>
                <DropdownMenuItem>Policy update required</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="@admin"
                    />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer"
                >
                  Sign out
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ConnectWallet />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/auth")}
            >
              Sign In
            </Button>
            {/* <div className="hidden md:block">
              <ConnectWallet />
            </div> */}
          </div>
        )}
      </div>
    </header>
  );
}
