"use client"
import Hero from "@/app/(home)/_components/Hero";
import Testimonials from "@/app/(home)/_components/Testimonials";
import Stats from "@/app/(home)/_components/Stats";
import RegisterBtn from "@/app/(home)/_components/RegisterBtn";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
export const dynamic = 'auto'
const Page = () => {
  const { user } = useUser();
  useEffect(()=>{
    const stripePaymentLink = localStorage.getItem("stripePaymentLink");
    if(stripePaymentLink && user?.emailAddresses[0].emailAddress){
      window.location.href = stripePaymentLink + `prefilled_email=${user?.emailAddresses[0].emailAddress}`;
      localStorage.removeItem("stripePaymentLink");
    }
  },[user]);
  return (
    <>
      <div className="min-h-screen ">

        <Hero />
        <Testimonials />
        <Stats />

        <RegisterBtn />
      </div>
    </>
  );
}
export default Page;