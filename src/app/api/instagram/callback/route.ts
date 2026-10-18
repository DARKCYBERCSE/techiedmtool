import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, fetchInstagramAccountsFromMeta, encryptAccessToken } from '@/lib/meta/instagram';
import { getServiceSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorReason = searchParams.get('error_reason');
  const errorDescription = searchParams.get('error_description');

  // Handle accidental webhook challenge sent to callback URL
  const hubMode = searchParams.get('hub.mode');
  const hubChallenge = searchParams.get('hub.challenge');
  const hubVerifyToken = searchParams.get('hub.verify_token');
  if (hubMode === 'subscribe' && hubChallenge) {
    return new NextResponse(hubChallenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

  // 1. Handle Meta OAuth cancellation or permission denial
  if (error || errorReason) {
    const errorMsg = errorDescription || errorReason || error || 'Access denied by user';
    return NextResponse.redirect(
      new URL(`/dashboard/accounts?error=${encodeURIComponent(errorMsg)}`, appUrl)
    );
  }

  // 2. Validate state token to protect against CSRF
  const savedState = req.cookies.get('meta_oauth_state')?.value;
  if (!state || !savedState || state !== savedState) {
    return NextResponse.redirect(
      new URL('/dashboard/accounts?error=invalid_oauth_state', appUrl)
    );
  }

  // 3. Validate presence of authorization code
  if (!code) {
    return NextResponse.redirect(
      new URL('/dashboard/accounts?error=missing_authorization_code', appUrl)
    );
  }

  try {
    // 4. Exchange code for long-lived Meta Access Token
    const exchangeResult = await exchangeCodeForTokens(code);

    if (exchangeResult.error || !exchangeResult.accessToken) {
      return NextResponse.redirect(
        new URL(`/dashboard/accounts?error=${encodeURIComponent(exchangeResult.error || 'Token exchange failed')}`, appUrl)
      );
    }

    const { accessToken, expiresIn } = exchangeResult;
    const tokenExpiresAt = new Date(Date.now() + (expiresIn || 60 * 24 * 3600) * 1000).toISOString();
    const encryptedToken = encryptAccessToken(accessToken);

    // 5. Fetch linked Instagram Business/Creator accounts
    const discoveredAccounts = await fetchInstagramAccountsFromMeta(accessToken);

    // Store in Supabase if service credentials are valid
    let savedToSupabase = false;
    let primaryUsername = '';

    try {
      const supabase = getServiceSupabase();
      
      // Determine user id from session or cookie
      let targetUserId: string | null = null;
      const userCookie = req.cookies.get('sb-user-id')?.value;
      if (userCookie) {
        targetUserId = userCookie;
      }

      if (discoveredAccounts.length > 0) {
        for (const acc of discoveredAccounts) {
          primaryUsername = acc.instagramUsername;
          if (targetUserId) {
            await supabase.from('instagram_accounts').upsert({
              user_id: targetUserId,
              external_account_id: acc.instagramAccountId,
              username: acc.instagramUsername,
              name: acc.instagramName,
              profile_picture_url: acc.profilePictureUrl || null,
              account_type: acc.accountType,
              encrypted_access_token_reference: encryptedToken,
              token_expires_at: tokenExpiresAt,
              connection_status: 'CONNECTED',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id,external_account_id' });
          }
        }
        savedToSupabase = true;
      }
    } catch (dbErr) {
      console.warn('Supabase DB save note (will pass data via URL params):', dbErr);
    }

    // 6. Build redirect with real discovered account details
    const redirectUrl = new URL('/dashboard/accounts', appUrl);
    redirectUrl.searchParams.set('connected', 'success');

    if (discoveredAccounts.length > 0) {
      const primary = discoveredAccounts[0];
      redirectUrl.searchParams.set('account_id', primary.instagramAccountId);
      redirectUrl.searchParams.set('username', primary.instagramUsername);
      redirectUrl.searchParams.set('name', primary.instagramName);
      if (primary.profilePictureUrl) {
        redirectUrl.searchParams.set('avatar', primary.profilePictureUrl);
      }
      redirectUrl.searchParams.set('type', primary.accountType);
    } else {
      // User connected Meta but hasn't linked an IG Business account to their FB Page
      redirectUrl.searchParams.set('meta_connected', 'true');
      redirectUrl.searchParams.set('notice', 'no_business_page_linked');
    }

    const response = NextResponse.redirect(redirectUrl);
    // Clear state cookie
    response.cookies.delete('meta_oauth_state');

    // Optionally set a short-lived token cookie (or access reference)
    response.cookies.set('ig_last_connected', primaryUsername || 'meta_user', {
      maxAge: 3600,
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    console.error('Instagram OAuth Callback unhandled error:', err);
    return NextResponse.redirect(
      new URL(`/dashboard/accounts?error=${encodeURIComponent(err instanceof Error ? err.message : 'Unknown OAuth error')}`, appUrl)
    );
  }
}
