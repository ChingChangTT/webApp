import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const envPath = resolve(root, '.env.local');
const outputPath = resolve(root, 'public/runtime-config.js');
let apiKey = '';

// Hosting providers such as Vercel expose project variables through process.env
// during the build. Keep .env.local as a convenient fallback for local work.
if (process.env.GOOGLE_MAPS_API_KEY) {
  apiKey = process.env.GOOGLE_MAPS_API_KEY.trim();
} else if (existsSync(envPath)) {
  const line = readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .find(entry => entry.trim().startsWith('GOOGLE_MAPS_API_KEY='));
  apiKey = line?.slice(line.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '') ?? '';
}

mkdirSync(resolve(root, 'public'), { recursive: true });
writeFileSync(
  outputPath,
  `window.__BEAUTIFO_CONFIG__ = ${JSON.stringify({ googleMapsApiKey: apiKey })};\n`,
  'utf8'
);
