import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// 💼 Dashboard-only restricted routes
const isCandidateDashboard = createRouteMatcher(['/dashboard/candidates(.*)'])
const isCompanyDashboard = createRouteMatcher(['/dashboard/companies(.*)'])

// 💡 Public listing/profile pages — allow both roles
// const isCandidatePublic = createRouteMatcher(['/candidates', '/candidates/:id'])
// const isCompanyPublic = createRouteMatcher(['/companies', '/companies/:id'])

const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const session = await auth()
  const userId = session.userId
  const claims = session.sessionClaims
  const onboardingComplete = claims?.metadata?.onboardingComplete
  const role = claims?.metadata?.role

  // 🔄 Redirect sign-in/create to sign-up
  if (req.nextUrl.pathname === '/sign-in/create') {
    return NextResponse.redirect(new URL('/sign-up', req.url))
  }

  // 🛑 Not logged in trying to access protected dashboard or onboarding
  if (
    !userId &&
    (isOnboardingRoute(req) || isCandidateDashboard(req) || isCompanyDashboard(req))
  ) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // 🚪 Logged in, onboarding not complete
  if (userId && onboardingComplete === false && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }

  // 🛡️ Logged in, accessing wrong dashboard
  if (userId && onboardingComplete === true) {
    if (isCandidateDashboard(req) && role !== 'CANDIDATE') {
      return NextResponse.redirect(new URL('/', req.url))
    }
    if (isCompanyDashboard(req) && role !== 'COMPANY') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // ✅ Let everything else pass through
  return NextResponse.next()
})