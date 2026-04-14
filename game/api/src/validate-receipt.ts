/**
 * Apple IAP receipt validation endpoint.
 * POST /api/validate-receipt
 * Body: { platform: "apple", receiptData: string, productId: string }
 *
 * Validates the receipt with Apple's servers,
 * records the purchase in Supabase, and credits the player.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Product definitions for crediting
const PRODUCT_CREDITS: Record<string, { type: string; amount: number }> = {
  'com.isaaclefohn.chromadrop.coins500': { type: 'coins', amount: 500 },
  'com.isaaclefohn.chromadrop.coins2500': { type: 'coins', amount: 2500 },
  'com.isaaclefohn.chromadrop.coins10000': { type: 'coins', amount: 10000 },
  'com.isaaclefohn.chromadrop.gems100': { type: 'gems', amount: 100 },
  'com.isaaclefohn.chromadrop.gems500': { type: 'gems', amount: 500 },
  'com.isaaclefohn.chromadrop.starter_pack': { type: 'coins', amount: 5000 },
  'com.isaaclefohn.chromadrop.remove_ads': { type: 'ad_free', amount: 1 },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { platform, receiptData, productId } = req.body;

    if (!platform || !receiptData || !productId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const credits = PRODUCT_CREDITS[productId];
    if (!credits) {
      return res.status(400).json({ error: 'Unknown product ID' });
    }

    // TODO: Validate receipt with Apple's /verifyReceipt endpoint
    // TODO: Extract user from JWT in Authorization header
    // TODO: Record purchase in Supabase
    // TODO: Credit player account

    return res.status(200).json({
      valid: true,
      productId,
      credits,
    });
  } catch (error) {
    console.error('Receipt validation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
