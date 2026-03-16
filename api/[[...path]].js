/**
 * Vercel serverless: barcha /api/* so'rovlarni Express backend ga yuboradi.
 * Masalan: /api/order-notify, /api/score, /api/telegram-webhook
 */
const app = require('../server/index');
module.exports = app;
