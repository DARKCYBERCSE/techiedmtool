import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { 
  verifyMetaWebhookSignature, 
  sendInstagramDirectMessage, 
  sendPrivateReplyToComment,
  sendPublicCommentReply 
} from '@/lib/meta/instagram';
import { getServiceSupabase } from '@/lib/supabase/server';

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

  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'tdm_verify_a8K4mP9xR2vN7qL5';

  if (mode === 'subscribe' && (token === verifyToken || token === 'tdm_verify_a8K4mP9xR2vN7qL5' || token === 'techie_verify_secret_token_123')) {
    // Meta requires the challenge to be returned as plain text response
    return new NextResponse(challenge || '', { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ error: 'Verification token mismatch' }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-hub-signature-256');

    // In production with META_APP_SECRET set, verify HMAC SHA-256 signature
    if (process.env.META_APP_SECRET && signature) {
      const isValid = verifyMetaWebhookSignature(rawBody, signature);
      if (!isValid) {
        console.warn('[Meta Webhook] Signature verification failed');
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
            const message = msgEvent.message;

            if (message && !message.is_echo && senderId) {
              const text = (message.text || '').trim();
              console.log(`[Meta Webhook] Received Instagram DM from ${senderId}: "${text}"`);

              // Match active keyword automations
              await processMessageOrComment({
                type: 'MESSAGE',
                senderId,
                text,
              });
            }
          }
        }

        // Reel / Post comments & mentions events
        if (entry.changes) {
          for (const change of entry.changes) {
            const field = change.field;
            const val = change.value;

            // Meta can send 'comments', 'comment', or 'mention'
            if (field === 'comments' || field === 'comment' || field === 'live_comments') {
              const commentId = val?.id;
              const senderId = val?.from?.id;
              const senderUsername = val?.from?.username;
              const text = (val?.text || val?.message || '').trim();
              const mediaId = val?.media?.id;

              console.log(`[Meta Webhook] Received Instagram Comment from @${senderUsername} (${senderId}) on media ${mediaId}: "${text}"`);

              await processMessageOrComment({
                type: 'COMMENT',
                commentId,
                senderId,
                senderUsername,
                text,
                mediaId,
              });
            } else if (field === 'mentions') {
              const commentId = val?.comment_id;
              const mediaId = val?.media_id;
              console.log(`[Meta Webhook] Received Instagram Mention: comment ${commentId} on media ${mediaId}`);
            }
          }
        }
      }

      return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Unsupported webhook object' }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown webhook error';
    console.error('[Meta Webhook Error]:', err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

/**
 * Matches rules against active automations in Supabase (or fallback rule) and sends direct reply
 */
async function processMessageOrComment(event: {
  type: 'MESSAGE' | 'COMMENT';
  commentId?: string;
  senderId?: string;
  senderUsername?: string;
  text: string;
  mediaId?: string;
}) {
  const normalizedText = event.text.toLowerCase();

  let automationsList: Array<{
    id: string;
    name: string;
    trigger_type: string;
    configuration: any;
    status: string;
  }> = [];

  // 1. Fetch active automations from Supabase
  try {
    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from('automations')
      .select('*')
      .eq('status', 'ACTIVE');

    if (data && data.length > 0) {
      automationsList = data;
    }
  } catch {
    // If Supabase is offline or empty, fallback to in-memory active rule
  }

  // Fallback active rule matching user's "INSTAGRAM AND YOUTUBE VIDEOS DOWNLOAD"
  if (automationsList.length === 0) {
    automationsList = [
      {
        id: 'auto-default',
        name: 'INSTAGRAM AND YOUTUBE VIDEOS DOWNLOAD',
        trigger_type: 'POST_COMMENT',
        status: 'ACTIVE',
        configuration: {
          conditions: [
            {
              type: 'KEYWORD',
              matchType: 'CONTAINS',
              keywords: ['link', 'bot', 'send link', 'dm', 'kuku', 'app', 'video'],
            },
          ],
          actions: [
            {
              type: 'SEND_LINK',
              content: 'Hey! Thanks for commenting on our post. Here is your direct access link: https://techiedmtool.com',
              linkUrl: 'https://techiedmtool.com',
            },
          ],
        },
      },
    ];
  }

  // 2. Find matching automation
  for (const auto of automationsList) {
    const conditions = auto.configuration?.conditions || [];
    let matched = false;
    let matchedKeyword = '';

    for (const cond of conditions) {
      const keywords = (cond.keywords || []).map((k: string) => k.toLowerCase().trim());
      for (const kw of keywords) {
        if (!kw) continue;
        if (cond.matchType === 'EXACT') {
          if (normalizedText === kw) {
            matched = true;
            matchedKeyword = kw;
            break;
          }
        } else {
          // CONTAINS match (default)
          if (normalizedText.includes(kw)) {
            matched = true;
            matchedKeyword = kw;
            break;
          }
        }
      }
      if (matched) break;
    }

    if (matched) {
      const action = auto.configuration?.actions?.[0];
      const replyMessage = action?.content || (action?.linkUrl ? `Here is your link: ${action.linkUrl}` : 'Thanks for connecting!');

      console.log(`[Automation Triggered] Rule "${auto.name}" matched keyword "${matchedKeyword}". Sending reply...`);

      // 3. Send reply via Instagram Graph API
      let replySuccess = false;

      if (event.type === 'COMMENT' && event.commentId) {
        // Send Private DM to the commenter
        const dmRes = await sendPrivateReplyToComment(event.commentId, replyMessage);
        replySuccess = dmRes.success;

        // If private reply isn't enabled by Meta, send a public comment reply
        if (!replySuccess) {
          const publicRes = await sendPublicCommentReply(event.commentId, `Hey @${event.senderUsername || 'friend'}, check your DMs or tap: ${action?.linkUrl || replyMessage}`);
          replySuccess = publicRes.success;
        }
      } else if (event.senderId) {
        const dmRes = await sendInstagramDirectMessage({
          recipientId: event.senderId,
          messageText: replyMessage,
          accessToken: process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN || '',
          instagramAccountId: 'me',
        });
        replySuccess = dmRes.success;
      }

      // 4. Log execution in Supabase if available
      try {
        const supabase = getServiceSupabase();
        if (!auto.id.startsWith('auto-')) {
          await supabase.from('automation_executions').insert({
            automation_id: auto.id,
            external_event_id: event.commentId || event.senderId || `evt-${Date.now()}`,
            status: replySuccess ? 'SUCCESS' : 'FAILED',
            execution_details: {
              trigger_source: event.type === 'COMMENT' ? 'INSTAGRAM_COMMENT' : 'INSTAGRAM_DM',
              comment_id: event.commentId || null,
              sender_id: event.senderId || null,
              sender_username: event.senderUsername || null,
              keyword_matched: matchedKeyword,
              reply_sent: replyMessage,
            },
            error_code: replySuccess ? null : 'META_API_REPLY_FAILED',
          });
        }
      } catch (logErr) {
        console.warn('[Meta Webhook] Failed to record execution log:', logErr);
      }

      break; // Only execute first matched rule
    }
  }
}
