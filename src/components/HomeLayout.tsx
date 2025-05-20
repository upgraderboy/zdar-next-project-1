"use client"
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { HomeNavBar } from "./HomeNavBar";
import { NavigationSidebar } from "./NavigationSidebar";

interface HomeLayoutProps {
    children: ReactNode;
}



export const HomeLayout = ({ children }: HomeLayoutProps) => {
    return (
        <SidebarProvider>
            <div className="w-full">
                <HomeNavBar />
                <div className="flex min-h-screen pt-[4rem]">
                    <NavigationSidebar />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}