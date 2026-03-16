/** 
 * Vercel serverless (Node.js): barcha /api/* so'rovlarni 
 * CommonJS Express backend (server/index.js) ga yuboradi.
 * 
 * Root package.json "type": "module" bo'lgani uchun, bu fayl .cjs
 * kengaytmada — shunda Vercel buni CommonJS sifatida ko'radi va
 * require/module.exports ishlaydi.
 */
const app = require('../server/index');

module.exports = app;

