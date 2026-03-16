/**
 * Ngrok tunnel — port 3002 (backend server) ni internetga ochadi.
 * Chiqqan URL ni loyiha ildizidagi .env ga VITE_API_URL=... qilib qo'ying.
 * NGROK_AUTHTOKEN: .env yoki server/.env da
 */
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const cwd = process.cwd();

config({ path: resolve(root, '.env') });
if (!process.env.NGROK_AUTHTOKEN) config({ path: resolve(cwd, '.env') });
if (!process.env.NGROK_AUTHTOKEN) config({ path: resolve(root, 'server', '.env') });
if (!process.env.NGROK_AUTHTOKEN) config({ path: resolve(cwd, 'server', '.env') });
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

const port = Number(process.env.PORT) || 3002;
const token = (process.env.NGROK_AUTHTOKEN || '').trim();

if (!token) {
  console.error('NGROK_AUTHTOKEN topilmadi. .env yoki server/.env ga qo\'ying.');
  process.exit(1);
}

try {
  const listener = await ngrok.forward({ addr: port, authtoken: token });
  const url = listener.url();
  console.log('');
  console.log('  Backend URL (loyiha ildizidagi .env ga VITE_API_URL qilib qo\'ying):');
  console.log('  ' + url);
  console.log('');
  console.log('  MUHIM: Avval "cd server && npm run start" ishlatib server ni ishga tushiring.');
  console.log('  Tunnel ochiq. To\'xtatish: Ctrl+C');
  console.log('');
  process.stdin.resume();
} catch (err) {
  console.error('Ngrok xato:', err.message);
  process.exit(1);
}
