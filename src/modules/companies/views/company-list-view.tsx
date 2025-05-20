"use client";

import { trpc } from "@/trpc/client";
import { useState } from "react";
import { useDebounce } from "use-debounce"; // 👈 install this
import { CompanyCard } from "@/modules/companies/ui/components/CompanyCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
export default function CompanyListView() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch] = useDebounce(searchQuery, 400); // ⏳ delay query

    const [sortBy, setSortBy] = useState<"companyName" | "createdAt">("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const { data, isLoading } = trpc.companies.getAllCompanies.useQuery({
        search: debouncedSearch,
        sortBy,
        sortOrder,
    });

    return (
        <div className="">
            {/* 🔍 Search and Sort Controls */}
            <div className="relative h-[400px] flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <Image
                    src="/company_view_1.png"
                    alt="Business professionals"
                    width={1000}
                    height={1000}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="w-full relative z-20 flex flex-col items-center text-center space-y-8 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">View Companies</h1>
                    <div className="max-w-2xl w-full relative flex items-center bg-white rounded-full overflow-hidden">
                        <Input
                            placeholder="Search companies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-2 border-none outline-none rounded-none bg-white text-black"
                        />
                        <Button className="h-full rounded-none bg-primary text-white px-4" type="submit">
                            <Search color="white" size={24} />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex w-full mb-4">
                <div className="flex flex-col md:flex-row gap-3 items-start md:items-center ml-auto mt-4 mr-2">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as "companyName" | "createdAt")}
                        className="border px-2 py-2 rounded-md"
                    >
                        <option value="companyName">Sort by Name</option>
                        <option value="createdAt">Sort by Created</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                        className="border px-2 py-2 rounded-md"
                    >
                        <option value="asc">Asc</option>
                        <option value="desc">Desc</option>
                    </select>
                </div>
            </div>
            
            {/* 📋 Candidate Cards */}
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div className="w-full container mx-auto flex flex-wrap gap-4">
                    {data?.map((company) => (
                        <CompanyCard key={company.id} company={company} />
                    ))}
                </div>
            )}
        </div>
    );
}