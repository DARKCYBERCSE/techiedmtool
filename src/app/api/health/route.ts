import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://demo-placeholder.supabase.co'
  );

  const isMetaConfigured = Boolean(
    process.env.META_APP_ID && process.env.META_APP_SECRET
  );

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      supabase: isSupabaseConfigured ? 'CONNECTED' : 'STANDBY_DEMO_MODE',
      meta_api: isMetaConfigured ? 'CONNECTED' : 'STANDBY_DEMO_MODE',
      webhooks: 'ACTIVE',
    },
  });
}
