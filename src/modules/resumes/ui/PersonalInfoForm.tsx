import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { personalInfoSchema, PersonalInfoValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { EditorFormProps } from "../../../../types/globals";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ImagePlusIcon, MoreVerticalIcon } from "lucide-react";
import { ImageUploadModal } from "@/components/image-upload-modal";
import { LocationPicker } from "./LocationPicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PhoneInput from "react-phone-number-input";
import { Textarea } from "@/components/ui/textarea";

export default function PersonalInfoForm({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const form = useForm<PersonalInfoValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            firstName: resumeData.firstName || "",
            lastName: resumeData.lastName || "",
            jobTitle: resumeData.jobTitle || "",
            city: resumeData.city || "",
            country: resumeData.country || "",
            summary: resumeData.summary || "",
            phone: resumeData.phone || "",
            email: resumeData.email || "",
            lat: resumeData.lat || undefined,
            lng: resumeData.lng || undefined,
            experienceLevel: resumeData.experienceLevel || undefined,
            jobType: resumeData.jobType || undefined,
            gender: resumeData.gender || undefined,
            disability: resumeData.disability || undefined,
            age: resumeData.age || undefined,
            skillType: resumeData.skillType || undefined,
        },
    });
    console.log(form.getValues())
    const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
    useEffect(() => {
        const subscription = form.watch((values) => {
            setResumeData((prev) => {
                const newData = { ...prev, ...values };
                if (JSON.stringify(prev) !== JSON.stringify(newData)) {
                    return newData;
                }
                return prev;
            });
        });
        return () => subscription.unsubscribe?.();
    }, [form, setResumeData]);

    useEffect(() => {
        if (thumbnailModalOpen) {
            document.body.style.pointerEvents = "none"; // Prevent clicks
        }
        return () => {
            document.body.style.pointerEvents = "auto"; // Always reset when modal closes
        };
    }, [thumbnailModalOpen]);

    return (
        <div className="mx-auto max-w-xl space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Personal info</h2>
                <p className="text-sm text-muted-foreground">Tell us about yourself.</p>
            </div>
            <ImageUploadModal id={resumeData.id!} open={thumbnailModalOpen} onOpenChange={setThumbnailModalOpen} />
            <Form {...form}>
                <form className="space-y-3">

                    <div className="p-0.5 border border-dashed border-neutral-400 relative h-[153px] w-[153px] group">
                        {
                            resumeData.photo ? (
                                <Image src={resumeData.photo} fill unoptimized alt="Thumbnail" className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full">
                                    <Image src="/logo.png" width={100} height={100} alt="Thumbnail" />
                                </div>
                            )
                        }
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    type="button"
                                    size="icon"
                                    className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7"
                                    onClick={() => setThumbnailModalOpen(true)}
                                >
                                    <MoreVerticalIcon className="text-white size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setThumbnailModalOpen(true)}>
                                    <ImagePlusIcon className="size-4 mr-1" /> Change
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="jobTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Age</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Controller
                        name="lat"
                        control={form.control}
                        render={({ field: latField }) => (
                            <Controller
                                name="lng"
                                control={form.control}
                                render={({ field: lngField }) => (
                                    <LocationPicker
                                        className="w-full"
                                        apiKey={process.env.GOOGLE_MAPS_API_KEY! || "AIzaSyCRh0XosbCfHfG6-VJMpnbfE7gy2VYE91o"}
                                        value={
                                            latField.value !== undefined && lngField.value !== undefined
                                                ? { lat: latField.value, lng: lngField.value }
                                                : undefined
                                        }
                                        defaultValue={resumeData.lat && resumeData.lng ? { lat: resumeData.lat, lng: resumeData.lng } : undefined}
                                        onValueChange={(value) => {
                                            latField.onChange(value?.lat);
                                            lngField.onChange(value?.lng);
                                        }}
                                    />
                                )}
                            />
                        )}
                    />
                    {/* Add a Textarea for summary */}

                    <FormField
                        control={form.control}
                        name="summary"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Summary</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormDescription>
                                    Write a short summary about yourself.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start">
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl className="w-full">
                                        <PhoneInput
                                            placeholder="Enter your phone number"
                                            {...field}
                                            defaultCountry="TR"
                                        />
                                    </FormControl>
                                    <FormDescription>Enter your phone number.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" />
                                    </FormControl>
                                    <FormDescription>Enter your email address.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* Show these fields in 2 cols of a row */}
                    {/* Disability - ["Yes", "No"] */}
                    {/* Skill Type - ["TECH", "NON-TECH"] */}
                    <FormField
                        control={form.control}
                        name="skillType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Skill Type</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select skill type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TECH">TECH</SelectItem>
                                            <SelectItem value="NON-TECH">NON-TECH</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="disability"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Disability</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select disability" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Gender - ["Male", "Female", "Other"] */}
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Experience Level - ["Entry Level", "Mid Level", "Senior Level"] */}
                        <FormField
                            control={form.control}
                            name="experienceLevel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Experience Level</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select experience level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Entry Level">Entry Level</SelectItem>
                                                <SelectItem value="Mid Level">Mid Level</SelectItem>
                                                <SelectItem value="Senior Level">Senior Level</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Job Type - ["Full-Time", "Part-Time", "Internship"] */}
                        <FormField
                            control={form.control}
                            name="jobType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select job type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Full-Time">Full-Time</SelectItem>
                                                <SelectItem value="Part-Time">Part-Time</SelectItem>
                                                <SelectItem value="Internship">Internship</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
}