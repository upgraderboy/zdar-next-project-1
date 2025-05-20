import { GetAllJobsOutput } from "@/types"
import { trpc } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toast } from "sonner"
export default function JobAction({ job }: { job: GetAllJobsOutput[number] }) {
    const { data: status, refetch } = trpc.job.checkApplied.useQuery({ jobId: job.id });
    const utils = trpc.useUtils();
    const { data } = trpc.job.isFavoriteJob.useQuery({ jobId: job.id });
    const { mutate } = trpc.job.toggleFavoriteJob.useMutation({
      onSuccess: () => {
        utils.job.isFavoriteJob.invalidate({ jobId: job.id });
      },
    });
    console.log(data)
    const mutation = trpc.job.applyOrRemove.useMutation();
    const handleClick = () => {
        mutation.mutate({ jobId: job.id }, {
          onSuccess: (res) => {
            toast.success(res.applied ? "Applied successfully!" : "Application removed.");
            refetch();
          },
          onError: (err) => toast.error(err.message),
        });
      };
    return (
        <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{job.experienceLevel}</span>
                        {
                            (
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" className="ml-auto" onClick={handleClick}>
                                        {status?.hasApplied ? "Applied" : "Apply"}
                                    </Button>
                                    <Heart className={`w-4 h-4 ${data?.isFavorite ? "fill-red-500 text-red-500" : "fill-gray-500 text-gray-500"}`} onClick={() => mutate({ jobId: job.id })} />
                                </div>
                            )
                        }
                    </div>
    )
}