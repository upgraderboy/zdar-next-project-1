"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Textarea } from "@/components/ui/textarea"

import { z } from "zod"

import { trpc } from "@/trpc/client"
import { jobInsertSchema } from "@/db/schema"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ageOptions } from "@/types"

interface JobFormProps {
  initialData?: z.infer<typeof jobInsertSchema> & { id?: string }; // id optional for new record
}
export default function JobForm({ initialData }: JobFormProps) {
  const isEdit = !!initialData?.id;

  console.log(isEdit)
  const utils = trpc.useUtils();
  const createJob = trpc.job.createJob.useMutation({
    onSuccess: () => {
      utils.job.invalidate(); // refetch after create
      toast("Job successfully created!");
    },
  });

  const updateJob = trpc.job.updateJob.useMutation({
    onSuccess: () => {
      utils.job.invalidate(); // refetch after update
      toast("Job successfully updated!");
    },
  });
  const form = useForm<z.infer<typeof jobInsertSchema>>({
    resolver: zodResolver(jobInsertSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      jobType: "Full-Time",
      experienceLevel: "Entry Level",
      ageCategory: [],
      isDisabilityAllowed: false,
      genderPreference: "All",
      softSkills: [],
      hardSkills: [],
      salaryRange: "",
      companyId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  const onSubmit = async (values: z.infer<typeof jobInsertSchema>) => {
    if (isEdit && initialData?.id) {
      await updateJob.mutateAsync({ ...values, id: initialData.id });
    } else {
      await createJob.mutateAsync(values);
    }
  };
  console.log(JSON.stringify(form.formState.errors));
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Name Position */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name Position *</FormLabel>
              <FormControl>
                <Input placeholder="Name Position" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Job Offer */}
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Job Offer</FormLabel>
            <FormControl>
              <Textarea placeholder="Write max 300 mots" className="h-32" {...field} value={field.value || ""} />
            </FormControl>
          </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Contract Type */}
          <FormField control={form.control} name="jobType" render={({ field }) => (
            <FormItem>
              <FormLabel>Search Contract Type *</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-Time">Full Time</SelectItem>
                    <SelectItem value="Part-Time">Part Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Gender Preference */}
          <FormField control={form.control} name="genderPreference" render={({ field }) => (
            <FormItem>
              <FormLabel>Gender Preference *</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value || "All"}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Gender Preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Disability Choice */}
        <FormField
          control={form.control}
          name="isDisabilityAllowed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disability Choice *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(val) => field.onChange(val === "true")}
                  value={field.value === true ? "true" : "false"}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="yes" />
                    <FormLabel htmlFor="yes">Yes</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="no" />
                    <FormLabel htmlFor="no">No</FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Age Category */}
        <FormField control={form.control} name="ageCategory" render={({ field }) => (
          <FormItem>
            <FormLabel>Age Category *</FormLabel>
            <FormControl>
              <div className="grid grid-cols-3 gap-4">
                {ageOptions.map((age) => (
                  <div key={age} className="flex items-center space-x-2">
                    <Checkbox id={age} checked={field.value?.includes(age)} onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange([...field.value, age])
                      } else {
                        field.onChange(field.value?.filter((item) => item !== age))
                      }
                    }} />
                    <FormLabel htmlFor={age}>{age}</FormLabel>
                  </div>
                ))}
              </div>
            </FormControl>
          </FormItem>
        )} />

        {/* Experience */}
        <FormField control={form.control} name="experienceLevel" render={({ field }) => (
          <FormItem>
            <FormLabel>Experience *</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry Level">Entry Level</SelectItem>
                  <SelectItem value="Intermediate Level">Intermediate Level</SelectItem>
                  <SelectItem value="Senior Level">Senior Level</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="hardSkills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hard Skills</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="e.g. JavaScript, Python, UI/UX Design"
                  value={field.value?.join(", ") || ""}
                  onChange={(e) =>
                    field.onChange(e.target.value.split(",").map((s) => s.trim()))
                  }
                />
              </FormControl>
              <FormDescription>e.g. technical or job-specific skills</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="softSkills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Soft Skills</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="e.g. Communication, Teamwork, Adaptability"
                  value={field.value?.join(", ") || ""}
                  onChange={(e) =>
                    field.onChange(e.target.value.split(",").map((s) => s.trim()))
                  }
                />
              </FormControl>
              <FormDescription>e.g. personal or interpersonal skills</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        {/* Annual Salary */}
        {/* <FormField control={form.control} name="annualSalary" render={({ field }) => (
          <FormItem>
            <FormLabel>Annual Salary *</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30k-50k">$30,000 - $50,000</SelectItem>
                  <SelectItem value="50k-70k">$50,000 - $70,000</SelectItem>
                  <SelectItem value="70k-90k">$70,000 - $90,000</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} /> */}

        {/* Monthly Salary */}
        {/* <FormField control={form.control} name="monthlySalary" render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Salary *</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-[50%]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2k-3k">$2,000 - $3,000</SelectItem>
                  <SelectItem value="3k-4k">$3,000 - $4,000</SelectItem>
                  <SelectItem value="4k-5k">$4,000 - $5,000</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} /> */}

        {/* Hard Skills */}
        {/* <FormField control={form.control} name="hardSkill" render={({ field }) => (
          <FormItem>
            <FormLabel>Hard Skills *</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} /> */}

        {/* Soft Skills */}
        {/* <FormField control={form.control} name="softSkill" render={({ field }) => (
          <FormItem>
            <FormLabel>Soft Skills *</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="teamwork">Teamwork</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} /> */}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button type="submit" className="bg-[#ff4500] hover:bg-[#ff4500]/90">Submit</Button>
        </div>

      </form>
    </Form>
  )
}
