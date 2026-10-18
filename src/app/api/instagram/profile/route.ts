import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = (searchParams.get('token') || process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN || '').trim();

  if (!token) {
    return NextResponse.json({ success: false, error: 'No access token provided' }, { status: 400 });
  }

  try {
    // 1. Try Instagram Basic Display / User API (graph.instagram.com)
    const igRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count,profile_picture_url&access_token=${token}`
    );
    const igData = await igRes.json();

    if (igRes.ok && igData.id) {
      return NextResponse.json({
        success: true,
        account: {
          id: igData.id,
          username: igData.username,
          name: igData.username,
          account_type: igData.account_type === 'MEDIA_CREATOR' ? 'CREATOR' : 'BUSINESS',
          profile_picture_url: igData.profile_picture_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          media_count: igData.media_count || 0,
        },
      });
    }

    // 2. Try Meta Graph API (graph.facebook.com)
    const fbRes = await fetch(
      `https://graph.facebook.com/v21.0/me?fields=id,name,accounts{instagram_business_account{id,username,name,profile_picture_url}}&access_token=${token}`
    );
    const fbData = await fbRes.json();

    if (fbRes.ok && fbData.accounts?.data?.[0]?.instagram_business_account) {
      const ig = fbData.accounts.data[0].instagram_business_account;
      return NextResponse.json({
        success: true,
        account: {
          id: ig.id,
          username: ig.username,
          name: ig.name || ig.username,
          account_type: 'BUSINESS',
          profile_picture_url: ig.profile_picture_url,
          media_count: 0,
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: igData.error?.message || fbData.error?.message || 'Could not verify Instagram account with token',
    }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Server error fetching profile',
    }, { status: 500 });
  }
}
