/**
 * Ngrok tunnel — port 5173 ni internetga ochadi.
 * NGROK_AUTHTOKEN: loyiha ildizidagi .env yoki server/.env da
 */
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const cwd = process.cwd();

// 1) root .env (skript papkasi ildizi)
config({ path: resolve(root, '.env') });
// 2) cwd/.env (npm run tunnel qayerdan ishga tushsa)
if (!process.env.NGROK_AUTHTOKEN) config({ path: resolve(cwd, '.env') });
// 3) root/server/.env va cwd/server/.env
if (!process.env.NGROK_AUTHTOKEN) config({ path: resolve(root, 'server', '.env') });
if (!process.env.NGROK_AUTHTOKEN) config({ path: resolve(cwd, 'server', '.env') });
// 4) server/.env dan qo'lda o'qish
for (const base of [root, cwd]) {
  if (process.env.NGROK_AUTHTOKEN) break;
  const serverEnv = resolve(base, 'server', '.env');
  if (existsSync(serverEnv)) {
    const content = readFileSync(serverEnv, 'utf8').replace(/\r\n/g, '\n');
    const match = content.match(/NGROK_AUTHTOKEN\s*=\s*["']?([^\s#"'\r\n]+)["']?/);
    if (match) process.env.NGROK_AUTHTOKEN = match[1].trim();
  }
}

import ngrok from '@ngrok/ngrok';

const port = Number(process.env.VITE_PORT || process.env.PORT) || 5173;
const token = (process.env.NGROK_AUTHTOKEN || '').trim();

if (!token) {
  console.error('NGROK_AUTHTOKEN topilmadi. .env yoki server/.env ga qo\'ying.');
  console.error('Token: https://dashboard.ngrok.com/get-started/your-authtoken');
  process.exit(1);
}

// Ngrok faqat HTTP backendga to'g'ri ulanadi. Shuning uchun dev serverni HTTP da ishga tushiring (dev:tunnel).
try {
  const listener = await ngrok.forward({
    addr: port,
    authtoken: token,
  });
  const url = listener.url();
  console.log('');
  console.log('  Mini App URL (BotFather ga yuboring):');
  console.log('  ' + url);
  console.log('');
  console.log('  MUHIM: Terminal 1 da npm run dev:tunnel ishlatishingiz kerak (npm run dev emas).');
  console.log('  Tunnel ochiq. To\'xtatish: Ctrl+C');
  console.log('');
  process.stdin.resume();
} catch (err) {
  console.error('Ngrok xato:', err.message);
  process.exit(1);
}
