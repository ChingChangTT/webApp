import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const envPath = resolve(root, '.env.local');
const outputPath = resolve(root, 'public/runtime-config.js');
let apiKey = '';

if (existsSync(envPath)) {
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
