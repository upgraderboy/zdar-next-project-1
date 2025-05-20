import { db } from "@/db";
import { companies, resumes } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  thumbnailUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).input(z.object({
    id: z.string(),
  }))
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      const { userId: clerkUserId, sessionClaims } = await auth();
      const role = sessionClaims?.metadata.role;
      console.log(input, clerkUserId, sessionClaims)
      // If you throw, the user will not be able to upload
      if (!clerkUserId) throw new UploadThingError("Unauthorized");
      let user;
      if(role === "COMPANY"){
        [user] = await db.select().from(companies).where(eq(companies.clerkId, clerkUserId));
      }
      if(role === "CANDIDATE"){
        [user] = await db.select().from(resumes).where(eq(resumes.id, input.id));
      }
      if (!user) throw new UploadThingError("Unauthorized");
      // if(!user.logoKey) throw new UploadThingError("Thumbnail Not Found!");
      if(user.logoKey){
        const utApi = new UTApi();
        await utApi.deleteFiles(user.logoKey);
        if(role === "COMPANY"){
          await db.update(companies).set({
            logoUrl: null,
            logoKey: null
          }).where(and(
            eq(companies.id, user.id)
          ))
        }
        if(role === "CANDIDATE"){
          await db.update(resumes).set({
            photoUrl: null,
            logoKey: null
          }).where(and(
            eq(resumes.id, user.id)
          ))
        }
      }

      return { user, ...input, role };
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
    })
    
    .onUploadComplete(async ({ metadata, file }) => {
      if(!metadata?.user?.id) throw new UploadThingError("Unauthorized");
      if(metadata?.role === "COMPANY"){
        await db.update(companies).set({
            logoUrl: file.ufsUrl,
            logoKey: file.key,
        }).where(and(
            eq(companies.id, metadata.user.id)
        ))
      }
      console.log(metadata, file)
      if(metadata?.role === "CANDIDATE"){
        await db.update(resumes).set({
            photoUrl: file.ufsUrl,
            logoKey: file.key,
        }).where(and(
            eq(resumes.id, metadata.user.id)
        ))
      }
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.user.id);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.user.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
