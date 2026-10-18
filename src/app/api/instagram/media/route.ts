import { NextRequest, NextResponse } from 'next/server';
import { fetchInstagramMedia } from '@/lib/meta/instagram';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get('account_id') || process.env.NEXT_PUBLIC_INSTAGRAM_ACCOUNT_ID || 'me';
  const token = searchParams.get('token') || process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN || '';

  try {
    const media = await fetchInstagramMedia(accountId, token);
    return NextResponse.json({ success: true, media });
  } catch (err: unknown) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch Instagram media',
      media: [],
    }, { status: 500 });
  }
}
