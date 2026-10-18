import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getMetaOAuthUrl } from '@/lib/meta/instagram';

export async function GET(req: NextRequest) {
  const appId = (process.env.META_APP_ID || process.env.NEXT_PUBLIC_META_APP_ID || '947533688039115').trim();

  // Generate a cryptographically secure state token to prevent CSRF
  const state = crypto.randomBytes(24).toString('hex');
  const metaOAuthUrl = getMetaOAuthUrl(state);

  // Set secure HTTP-only state cookie for OAuth validation
  const response = NextResponse.redirect(metaOAuthUrl);
  response.cookies.set('meta_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15, // 15 minutes validity
  });

  return response;
}
