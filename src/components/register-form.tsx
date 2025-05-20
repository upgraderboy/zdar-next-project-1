'use client'
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"


import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignUp } from '@clerk/nextjs'

import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from "next/image"

const baseCandidateSchema = z.object({
  role: z.literal('CANDIDATE'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const baseCompanySchema = z.object({
  role: z.literal('COMPANY'),
  companyName: z.string().min(1, 'Company name is required'),
  websiteUrl: z.string().url('Invalid website URL'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const rawFormSchema = z.discriminatedUnion('role', [
  baseCandidateSchema,
  baseCompanySchema,
])
const formSchema = rawFormSchema.superRefine((data, ctx) => {
  if (data.role === 'COMPANY') {
    try {
      const url = new URL(data.websiteUrl)
      const domain = url.hostname.replace(/^www\./, '')
      if (!data.email.endsWith(`@${domain}`)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: `Email must match domain @${domain}`,
        })
      }
    } catch {
      // Do nothing, handled by URL validation already
    }
  }
})
type FormSchema = z.infer<typeof rawFormSchema>
export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { isLoaded } = useSignUp()
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'CANDIDATE',
    } as FormSchema,
  })
  if (!isLoaded) return null

  // const { startEmailLinkFlow } = signUp.createEmailLinkFlow()


  const role = form.watch('role')

  const onSubmit = async () => {
    if (!isLoaded) return
    setLoading(true)
    setError(null)

    try {
      // const { email, password } = values

      
      // const publicMetadata = values.role === 'CANDIDATE'
      //   ? {
      //     role: values.role,
      //     fullName: values.fullName,
      //   }
      //   : {
      //     role: values.role,
      //     companyName: values.companyName,
      //     websiteUrl: values.websiteUrl,
      //   }
        
        // const result = await signUp.create({
        //   emailAddress: email,
        //   password,
        //   unsafeMetadata: publicMetadata
        // })


        // const protocol = window.location.protocol
        // const host = window.location.host
  
        // Send the user an email with the email link
        // const signUpAttempt = await startEmailLinkFlow({
        //   // URL to navigate to after the user visits the link in their email
        //   redirectUrl: `${protocol}//${host}/sign-up/verify`,
        // })

    } catch (err) {
      console.error(err)
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 py-6">
          <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Acme Inc account
                </p>
              </div>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signup As</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CANDIDATE">Candidate</SelectItem>
                      <SelectItem value="COMPANY">Company</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {role === 'CANDIDATE' && (
              <>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Upgrader Boy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {role === 'COMPANY' && (
              <>
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Upgrader Boy Pvt Ltd" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://upgraderboy.tech" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@domain.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </Button>
          </div>
          </form>
        </Form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
