
import { supabase } from './supabase';

/**
 * Meta Production Logic: 
 * 1. Trigger n8n Handshake
 * 2. Exchange short-lived token (2h) for long-lived (60d) via n8n
 * 3. Subscribe app to page webhooks via n8n
 */
export const finalizeInstagramConnection = async (userId: string, shortLivedToken: string) => {
  const { data: profile } = await supabase.from('profiles').select('n8n_url').eq('id', userId).single();
  
  if (!profile?.n8n_url) {
    throw new Error("Target n8n URL not set. Please configure 'Workflow Bridge' first.");
  }

  // This POST starts the n8n "Auth Handshake" workflow
  const response = await fetch(profile.n8n_url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-InstaFlow-Action': 'INITIAL_HANDSHAKE'
    },
    body: JSON.stringify({
      action: 'META_AUTH_HANDSHAKE',
      userId,
      short_lived_token: shortLivedToken,
      timestamp: new Date().toISOString(),
      platform: 'instagram'
    })
  });

  if (!response.ok) {
    throw new Error("n8n handshake failed. Verify your Webhook target URL.");
  }

  return await response.json();
};

export const verifyTokenHealth = (expiry: string | null): 'healthy' | 'warning' | 'expired' | 'unknown' => {
  if (!expiry) return 'unknown';
  const expiryDate = new Date(expiry);
  const now = new Date();
  const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
  if (diffDays <= 0) return 'expired';
  if (diffDays <= 14) return 'warning';
  return 'healthy';
};
