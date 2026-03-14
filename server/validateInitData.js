const crypto = require('crypto');

/**
 * Validates Telegram Mini App initData using the bot token.
 * @param {string} initData - Raw initData string from Telegram.WebApp.initData
 * @param {string} botToken - Bot token (keep server-side only)
 * @returns {boolean}
 */
function validateInitData(initData, botToken) {
  if (!initData || !botToken) return false;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return false;
  params.delete('hash');
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  return calculatedHash === hash;
}

/**
 * Parse user from initData (only after validation).
 * @param {string} initData
 * @returns {{ id: number, first_name?: string, username?: string } | null}
 */
function parseUserFromInitData(initData) {
  if (!initData) return null;
  const params = new URLSearchParams(initData);
  const userStr = params.get('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

module.exports = { validateInitData, parseUserFromInitData };
