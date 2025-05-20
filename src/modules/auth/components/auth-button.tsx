"use client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"
import { ClapperboardIcon, Home, Receipt, UserCircleIcon } from "lucide-react"
import { usePathname } from "next/navigation"

export const AuthButton = () => {
    const { user } = useUser()
    const { isLoaded } = useUser()
    const pathName = usePathname();
    // !isSignedIn ? (
    //     <Skeleton className="px-12 py-6 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none [&_svg]:size-4 border" />
    // ) : 
    if (!isLoaded) {
        return (
            <>
                {
                    (
                        <Skeleton className="h-9 w-9 rounded-full bg-blue-600 border" />
                    )
                }
            </>
        )
    }
    const role = user?.unsafeMetadata?.role
    return (
        <>
            <SignedIn>
                <UserButton>
                    {
                        pathName !== "/candidates" && pathName !== "/companies" ? (
                            <UserButton.MenuItems>
                                    <UserButton.Link label="My Dashboard" href={role === "CANDIDATE" ? `/candidates` : `/companies`} labelIcon={<Home className="size-4" />} />
                                    <UserButton.Link label="My Billing Portal" href={role === "CANDIDATE" ? `/candidates/billing` : `/companies/billing`} labelIcon={<Receipt className="size-4" />} />
                                    <UserButton.Link label={role === "CANDIDATE" ? "My Resumes" : "My Jobs"} href={role === "CANDIDATE" ? `/candidates/resumes` : `/companies/my-jobs`} labelIcon={<ClapperboardIcon className="size-4" />} />
                                </UserButton.MenuItems>
                        ) : (
                            <UserButton.MenuItems>
                                <UserButton.Link label="Home" href="/" labelIcon={<Home className="size-4" />} />
                                <UserButton.Link label="My Profile" href="/companies/profile" labelIcon={<Home className="size-4" />} />
                                <UserButton.Link label="Create A Job" href="/companies/create-job" labelIcon={<Receipt className="size-4" />} />
                                <UserButton.Link label="My Jobs" href="/companies/my-jobs" labelIcon={<Home className="size-4" />} />
                                <UserButton.Link label="My Billing Portal" href="/companies/billing" labelIcon={<Receipt className="size-4" />} />
                            </UserButton.MenuItems>
                        )
                    }
                </UserButton>
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal">
                    <Button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none [&_svg]:size-4" variant="outline">
                        <UserCircleIcon /> Sign In
                    </Button>
                </SignInButton>
            </SignedOut>
        </>
    )
}