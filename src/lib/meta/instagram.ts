import crypto from 'crypto';

export interface MetaOAuthParams {
  clientId: string;
  redirectUri: string;
  state: string;
  scope: string[];
}

// Permissions for Instagram Graph API & Business Messaging
export const META_SCOPES = [
  'instagram_basic',
  'instagram_manage_messages',
  'instagram_manage_comments',
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_metadata',
];

/**
 * Generates the official Meta / Instagram OAuth Login URL
 */
export const getMetaOAuthUrl = (state: string): string => {
  const appId = process.env.META_APP_ID || process.env.NEXT_PUBLIC_META_APP_ID || '';
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  const redirectUri = `${appUrl}/api/instagram/callback`;
  const scope = META_SCOPES.join(',');

  return `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&response_type=code&state=${encodeURIComponent(state)}`;
};

/**
 * 256-bit AES-GCM Server-side encryption for Access Tokens
 */
const getEncryptionKey = (): Buffer => {
  const secret = process.env.META_APP_SECRET || 'techie_fallback_secret_key_32_bytes!';
  return crypto.createHash('sha256').update(secret).digest();
};

export const encryptAccessToken = (token: string): string => {
  try {
    const iv = crypto.randomBytes(12);
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (err) {
    console.error('Failed to encrypt access token:', err);
    return token;
  }
};

export const decryptAccessToken = (encryptedToken: string): string => {
  try {
    if (!encryptedToken.includes(':')) return encryptedToken;
    const [ivHex, authTagHex, encrypted] = encryptedToken.split(':');
    if (!ivHex || !authTagHex || !encrypted) return encryptedToken;

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Failed to decrypt access token:', err);
    return encryptedToken;
  }
};

/**
 * Exchanges OAuth authorization code for short-lived token and upgrades to long-lived Meta token (60 days)
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  accessToken: string;
  expiresIn?: number;
  userId?: string;
  error?: string;
}> {
  try {
    const appId = process.env.META_APP_ID || '';
    const appSecret = process.env.META_APP_SECRET || '';
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
    const redirectUri = `${appUrl}/api/instagram/callback`;

    // 1. Exchange code for user access token
    const tokenUrl = `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&code=${code}`;

    const tokenRes = await fetch(tokenUrl, { method: 'GET' });
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      return {
        accessToken: '',
        error: tokenData.error?.message || 'Failed to exchange authorization code for access token',
      };
    }

    const shortLivedToken = tokenData.access_token;

    // 2. Exchange short-lived token for long-lived access token (60 days)
    const longLivedUrl = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;

    const longLivedRes = await fetch(longLivedUrl, { method: 'GET' });
    const longLivedData = await longLivedRes.json();

    const finalAccessToken = longLivedData.access_token || shortLivedToken;
    const expiresIn = longLivedData.expires_in || 60 * 24 * 3600; // default 60 days

    return {
      accessToken: finalAccessToken,
      expiresIn,
      userId: tokenData.user_id,
    };
  } catch (err: unknown) {
    return {
      accessToken: '',
      error: err instanceof Error ? err.message : 'Network error exchanging OAuth code',
    };
  }
}

/**
 * Fetches connected Instagram Business/Creator Account details using the user access token
 */
export async function fetchInstagramAccountsFromMeta(userAccessToken: string): Promise<Array<{
  instagramAccountId: string;
  instagramUsername: string;
  instagramName: string;
  profilePictureUrl?: string;
  accountType: 'CREATOR' | 'BUSINESS';
}>> {
  try {
    // 1. Fetch user's managed Facebook Pages and linked Instagram Business accounts
    const pagesUrl = `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name,profile_picture_url}&access_token=${userAccessToken}`;

    const res = await fetch(pagesUrl);
    const data = await res.json();

    if (!res.ok || !data.data) {
      console.warn('No Facebook Pages found or permission error:', data.error);
      return [];
    }

    const accounts: Array<{
      instagramAccountId: string;
      instagramUsername: string;
      instagramName: string;
      profilePictureUrl?: string;
      accountType: 'CREATOR' | 'BUSINESS';
    }> = [];

    for (const page of data.data) {
      if (page.instagram_business_account) {
        const ig = page.instagram_business_account;
        accounts.push({
          instagramAccountId: ig.id,
          instagramUsername: ig.username,
          instagramName: ig.name || ig.username,
          profilePictureUrl: ig.profile_picture_url,
          accountType: 'BUSINESS',
        });
      }
    }

    return accounts;
  } catch (err) {
    console.error('Error fetching Instagram accounts:', err);
    return [];
  }
}

/**
 * Webhook signature verification for real Meta Webhooks
 */
export const verifyMetaWebhookSignature = (
  rawBody: string,
  signatureHeader: string | null
): boolean => {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret || !signatureHeader) return false;

  const [method, signature] = signatureHeader.split('=');
  if (method !== 'sha256' || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', appSecret)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'utf-8'),
    Buffer.from(expectedSignature, 'utf-8')
  );
};

export interface SendInstagramMessageParams {
  recipientId: string;
  messageText: string;
  accessToken: string;
  instagramAccountId: string;
}

export const sendInstagramDirectMessage = async ({
  recipientId,
  messageText,
  accessToken,
}: SendInstagramMessageParams): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const apiVersion = process.env.INSTAGRAM_API_VERSION || 'v21.0';
    const effectiveToken = accessToken || process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN || '';
    const url = `https://graph.facebook.com/${apiVersion}/me/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${effectiveToken}`,
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: messageText },
        messaging_type: 'RESPONSE',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || 'Failed to send message via Meta Graph API',
      };
    }

    return {
      success: true,
      messageId: data.message_id,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown communication error with Meta API',
    };
  }
};
