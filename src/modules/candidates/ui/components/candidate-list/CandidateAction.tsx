import { Button } from "@/components/ui/button";
import { CandidateWithResume } from "@/modules/candidates/server/procedure";
import { Heart, ZoomIn } from "lucide-react";
export const CandidateAction = ({ candidate }: { candidate: CandidateWithResume }) => {
    return (
        <div className="w-full flex items-center justify-center">
            <Button
                variant="outline"
                className="ml-auto"
                onClick={() => {
                    console.log(candidate);
                }} asChild
            >
                <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                className="ml-auto"
                onClick={() => {
                    console.log(candidate);
                }} asChild
            >
                <Heart className={true ? "fill-red-500 text-red-500" : ""} />
            </Button>
        </div>
    );
};