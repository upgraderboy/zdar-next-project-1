"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import { ResponsiveModal } from "@/components/responsive-modal";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface ImageUploadModalProps{
    id: string;
    open: boolean;
    onOpenChange: (open: boolean)=> void;
}



export const ImageUploadModal = ({ id, open, onOpenChange }: ImageUploadModalProps) => {
    const utils = trpc.useUtils();
    const onUploadComplete = () => {
        utils.companies.getProfile.invalidate();
        utils.resume.getOne.invalidate({ id: id! });
        utils.resume.getList.invalidate();
        onOpenChange(false);
    }
    // console.log(id, open, onOpenChange)
    return (
        <ResponsiveModal
            title="Upload A Image"
            open={open}
            onOpenChange={onOpenChange}
        >
            <UploadDropzone
                endpoint="thumbnailUploader"
                input={{ id }}
                onClientUploadComplete={onUploadComplete}
                onUploadError={(error) => {
                    console.log(error)
                    toast.error(error.message, {
                        className: "text-red-500"
                    });
                }}
                appearance={{
                    button: {
                        color: "white",
                        backgroundColor: "blue"
                    }
                }}
            />
        </ResponsiveModal>
    )
}