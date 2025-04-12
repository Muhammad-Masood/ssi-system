"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Fingerprint,
  FileCheck,
  InboxIcon,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { WalletContext } from "@/providers/Providers";
import { toast } from "sonner";
import { ConnectWallet } from "@/app/components/ConnectWallet";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { wallet } = useContext(WalletContext);
  const { isConnected, signer } = wallet;

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "DIDs",
      href: "/dashboard/dids",
      icon: Fingerprint,
    },
    {
      title: "Credentials",
      href: "/dashboard/credentials",
      icon: FileCheck,
    },
    {
      title: "VC Requests",
      href: "/dashboard/requests",
      icon: InboxIcon,
    },
  ];

  const handleDisconnect = () => {
    // Implement wallet disconnect logic here
    toast.success("Wallet disconnected");
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <Fingerprint className="h-6 w-6" />
            <span className="font-bold text-lg">SSI KIT</span>
          </div>
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.title}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          {isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {signer?.address.substring(0, 6)}...
                    {signer?.address.substring(38)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Connected
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleDisconnect}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
          ) : (
             <ConnectWallet />
          )}
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
