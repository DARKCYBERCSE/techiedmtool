import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyMetaWebhookSignature, sendInstagramDirectMessage } from '@/lib/meta/instagram';

/**
 * Meta Webhook Handler
 * 
 * GET: Webhook challenge verification for Meta App Dashboard
 * POST: Incoming Instagram direct messages & comments event processing
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'techie_verify_secret_token_123';

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification token mismatch' }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-hub-signature-256');

    // In production with META_APP_SECRET set, verify HMAC SHA-256 signature
    if (process.env.META_APP_SECRET) {
      const isValid = verifyMetaWebhookSignature(rawBody, signature);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);

    // Instagram Webhook structure verification
    if (payload.object === 'instagram' || payload.object === 'page') {
      const entries = payload.entry || [];

      for (const entry of entries) {
        // Direct messages event
        if (entry.messaging) {
          for (const msgEvent of entry.messaging) {
            const senderId = msgEvent.sender?.id;
            const recipientId = msgEvent.recipient?.id;
            const message = msgEvent.message;

            if (message && !message.is_echo && senderId) {
              const text = message.text || '';
              // Processing logic: Match rules from database and reply via Graph API
              console.log(`[Meta Webhook] Received Instagram DM from ${senderId}: "${text}"`);
            }
          }
        }

        // Reel / Post comments event
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'comments') {
              const comment = change.value;
              console.log(`[Meta Webhook] Received Instagram Comment from ${comment.from?.id}: "${comment.text}"`);
            }
          }
        }
      }

      return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Unsupported webhook object' }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown webhook error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
