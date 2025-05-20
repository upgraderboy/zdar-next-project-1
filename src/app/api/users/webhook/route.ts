import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { candidates, companies } from '@/db/schema'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Do something with payload
  // For this guide, log payload to console
  const eventType = evt.type
  // console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
  console.log("---------------------------------------------------------------------")
  console.log('Webhook payload:', JSON.stringify(body, null, 2))
  if(eventType === 'user.created') {
    const client = await clerkClient()
    const { data } = evt;
    
    
    
    if(!data.unsafe_metadata?.role) {
      (await clerkClient()).users.deleteUser(data.id)
      return new Response('Error: Role not found', { status: 400 })
    }
    await client.users.updateUser(data.id, {
      publicMetadata: {
        role: data.unsafe_metadata.role,
        onboardingComplete: false
      }
    })
    // const role = (await user).sessionClaims?.metadata.role
    console.log('User created:')
    const name = data.first_name && data.last_name ? data.first_name + ' ' + data.last_name : data.email_addresses[0].email_address;
    // const username = data.username ? data.username : data.email_addresses[0].email_address.split("@")[0];
    
    
    console.log("Public metadata:", data.public_metadata, data.unsafe_metadata)
    if(data.unsafe_metadata.role === "CANDIDATE")
      await db.insert(candidates).values({
        clerkId: data.id,
        name,
        imageUrl: data.image_url,
        email: data.email_addresses[0].email_address,
        isVerified: data.email_addresses[0].verification?.status === 'verified'
      })
    if(data.unsafe_metadata.role === "COMPANY") {
      // await db.insert(companies).values({
      //   customerId: data.id,
      //   name,
      //   logoUrl: data.image_url,
      //   email: data.email_addresses[0].email_address,
      //   isVerified: data.email_addresses[0].verification?.status === 'verified'
      // })
    }
  }

  if(eventType === 'user.updated') {
    const { data } = evt;
    console.log('User updated:')
    const name = data.first_name && data.last_name ? data.first_name + ' ' + data.last_name : data.email_addresses[0].email_address;
    if( data.unsafe_metadata.role === "CANDIDATE")
      await db.update(candidates).set({
        name,
        imageUrl: data.image_url,
        email: data.email_addresses[0].email_address,
        isVerified: data.email_addresses[0].verification?.status === 'verified'
      }).where(eq(candidates.clerkId, data.id))
    if( data.unsafe_metadata.role === "COMPANY")
      await db.update(companies).set({
        name,
        logoUrl: data.image_url,
        websiteUrl: data.unsafe_metadata.websiteUrl as string,
        isVerified: data.email_addresses[0].verification?.status === 'verified'
      }).where(eq(companies.clerkId, data.id))
  }
  if(eventType === 'user.deleted') {
    const { data } = evt;
    console.log('User deleted:', data)
    if(!data.id) return new Response('Error: User ID not found', { status: 400 })
    const existingCandidate = await db.select().from(candidates).where(eq(candidates.clerkId, data.id))
    if(existingCandidate) {
      await db.delete(candidates).where(eq(candidates.clerkId, data.id))
    }
    const existingCompany = await db.select().from(companies).where(eq(companies.clerkId, data.id))
    if(existingCompany) {
      await db.delete(companies).where(eq(companies.clerkId, data.id))
    }
  }
  return new Response('Webhook received', { status: 200 })
}