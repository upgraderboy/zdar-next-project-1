import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ResumeServerData } from "../../types/globals";
import { ResumeValues } from "./validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDuration = (duration: number)=>{
  const seconds = Math.floor((duration % 60000) / 1000);
  const minutes = Math.floor(duration / 60000);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}
export const snakeCaseToTitle = (str: string)=>{
  return str.replace(/_/g, " ").replace(/\b\w/g, (char)=> char.toUpperCase());
}

export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File
    ? {
        name: value.name,
        size: value.size,
        type: value.type,
        lastModified: value.lastModified,
      }
    : value;
}

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    workExperiences: data.workExperiences.map((exp) => ({
      position: exp.position || undefined,
      company: exp.company || undefined,
      startDate: exp.startDate?.toISOString().split("T")[0],
      endDate: exp.endDate?.toISOString().split("T")[0],
      description: exp.description || undefined,
    })),
    educations: data.educations.map((edu) => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: edu.startDate?.toISOString().split("T")[0],
      endDate: edu.endDate?.toISOString().split("T")[0],
    })),
    hardSkills: data.hardSkills,
    softSkills: data.softSkills,
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    summary: data.summary || undefined,
    lat: data.lat,
    lng: data.lng,
    disability: data.disability || undefined,
    gender: data.gender || undefined,
    experienceLevel: data.experienceLevel || undefined,
    jobType: data.jobType || undefined,
    age: data.age || undefined,
    skillType: data.skillType || undefined,
  };
}

// Helper function to format dates with fallback
export function formatDate(date: Date | null | undefined): string {
  if (!date) return "Present"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}
export function sanitizeResume(resume: ResumeServerData): ResumeValues {
  return {
    ...resume,
    email: resume.email ?? undefined,
    photo: resume.photoUrl ?? undefined,
    workExperiences: resume.workExperiences.map((exp) => ({
      position: exp.position ?? undefined,
      company: exp.company ?? undefined,
      startDate: exp.startDate?.toISOString().split("T")[0],
      endDate: exp.endDate?.toISOString().split("T")[0],
      description: exp.description ?? undefined,
    })),
    educations: resume.educations.map((edu) => ({
      degree: edu.degree ?? undefined,
      school: edu.school ?? undefined,
      startDate: edu.startDate?.toISOString().split("T")[0],
      endDate: edu.endDate?.toISOString().split("T")[0],
    })),
    // aur jitne bhi nullable fields ho unko undefined karo
    hardSkills: resume.hardSkills,
    softSkills: resume.softSkills,
    borderStyle: resume.borderStyle,
    colorHex: resume.colorHex,
    summary: resume.summary ?? undefined,
    lat: resume.lat,
    lng: resume.lng,
    // category: resume.category ?? undefined,
    disability: resume.disability ?? undefined,
    gender: resume.gender ?? undefined,
    experienceLevel: resume.experienceLevel ?? undefined,
    jobType: resume.jobType ?? undefined,
    age: resume.age ?? undefined,
  };
}