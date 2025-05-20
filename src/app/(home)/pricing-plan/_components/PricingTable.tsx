"use client"
import { Check, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { useUser } from '@clerk/nextjs'
const plans = [
  {
    name: "Free",
    description: "Best for personal use",
    price: "$0",
    billing: "forever",
    paymentLink: "/companies",
    href: "/auth/login",
    buttonText: "Free",
    features: ["1 user", "5 projects", "2GB storage", "Basic support"],
    notAllowed: ["1 user", "5 projects", "2GB storage", "Basic support"]
  },
  {
    name: "Basic",
    description: "Perfect for small teams",
    price: "$19",
    billing: "per month",
    href: '/auth/login',
    buttonText: "Buy Now",
    paymentLink: process.env.STRIPE_MONTHLY_PLAN_LINK || "https://buy.stripe.com/test_8wM4ifak6gmQfo47ss",
    features: ["5 users", "20 projects", "10GB storage", "Priority support", "Advanced analytics"],
    notAllowed: ["1 user", "5 projects", "2GB storage", "Basic support"]
  },
  {
    name: "Premium",
    description: "For larger businesses",
    price: "$199",
    billing: "per year",
    href: '/auth/login',
    buttonText: "Buy Now",
    paymentLink: process.env.STRIPE_YEARLY_PLAN_LINK || "https://buy.stripe.com/test_bIY9Cz8bY6Mgb7O5kl",
    features: ["Unlimited users", "Unlimited projects", "100GB storage", "24/7 support", "Custom integrations", "Advanced security"],
    notAllowed: ["1 user", "5 projects", "2GB storage", "Basic support"]
  },
]

export default function PricingTable() {
  const { user } = useUser();
  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-10">Choose Your Plan</h2>
      <div className="mx-6 md:mx-0 grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col outline-1 text-center">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-4xl font-bold mb-2">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">/{plan.billing}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="w-1/2 flex items-center m-auto">
                    <div className="flex">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    {feature}
                    </div>
                  </li>
                ))}
                {plan.features.map((feature) => (
                  <li key={feature} className="w-1/2 flex items-center m-auto">
                    <div className="flex">
                    <X className="mr-2 h-4 w-4 text-black" />
                    {feature}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {user ? (
                <Button className="w-full">
                  <Link href={plan.paymentLink || ""}>{plan.buttonText}</Link>
                </Button>
              ) : (
                <Button className="w-full"><Link href={plan.href}>{plan.buttonText}</Link></Button>
              )}
              {/* <PaymentLink href={plan.href} text={plan.buttonText} paymentLink={plan.paymentLink} /> */}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

