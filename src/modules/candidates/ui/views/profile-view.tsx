import { ResumeSection } from "@/modules/candidates/ui/sections/ResumeSection";
import ProfileSection from "../sections/profile-section";

export function ProfileView() {
    return <div>
        <ProfileSection />
        <ResumeSection />
    </div>
}