const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

fs.mkdirSync(publicDir, { recursive: true });

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}

const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const typeBuf = Buffer.from(type);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  typeBuf.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 8 + data.length);
  return out;
};

const rgba = (hex, alpha = 255) => {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
    alpha,
  ];
};

const blend = (a, b, t) => a.map((value, index) => Math.round(value + (b[index] - value) * t));

const createCanvas = (width, height) => {
  const pixels = Buffer.alloc(width * height * 4);

  const set = (x, y, color) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = (y * width + x) * 4;
    const alpha = color[3] / 255;
    pixels[i] = Math.round(color[0] * alpha + pixels[i] * (1 - alpha));
    pixels[i + 1] = Math.round(color[1] * alpha + pixels[i + 1] * (1 - alpha));
    pixels[i + 2] = Math.round(color[2] * alpha + pixels[i + 2] * (1 - alpha));
    pixels[i + 3] = 255;
  };

  const fillRect = (x, y, w, h, color) => {
    for (let yy = Math.max(0, Math.round(y)); yy < Math.min(height, Math.round(y + h)); yy += 1) {
      for (let xx = Math.max(0, Math.round(x)); xx < Math.min(width, Math.round(x + w)); xx += 1) set(xx, yy, color);
    }
  };

  const fillCircle = (cx, cy, radius, color) => {
    const r2 = radius * radius;
    for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
      for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy <= r2) set(x, y, color);
      }
    }
  };

  const fillLine = (x1, y1, x2, y2, lineWidth, color) => {
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    const radius = Math.max(1, lineWidth / 2);
    for (let i = 0; i <= steps; i += 1) {
      const t = steps === 0 ? 0 : i / steps;
      fillCircle(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, radius, color);
    }
  };

  const writePng = (fileName) => {
    const raw = Buffer.alloc((width * 4 + 1) * height);
    for (let y = 0; y < height; y += 1) {
      const rowStart = y * (width * 4 + 1);
      raw[rowStart] = 0;
      pixels.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
    }

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;
    ihdr[9] = 6;

    const png = Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk('IHDR', ihdr),
      chunk('IDAT', zlib.deflateSync(raw)),
      chunk('IEND', Buffer.alloc(0)),
    ]);

    fs.writeFileSync(path.join(publicDir, fileName), png);
  };

  return { width, height, pixels, set, fillRect, fillCircle, fillLine, writePng };
};

const paintBackground = (canvas, accentStrength = 0.55) => {
  const night = rgba('#08111f');
  const ink = rgba('#13223f');
  const violet = rgba('#7c3aed');
  const cyan = rgba('#06b6d4');
  const lime = rgba('#a3e635');

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const gx = x / canvas.width;
      const gy = y / canvas.height;
      const base = blend(night, ink, Math.min(1, gy * 1.15));
      const pulseA = Math.max(0, 1 - Math.hypot(gx - 0.18, gy - 0.22) / 0.62);
      const pulseB = Math.max(0, 1 - Math.hypot(gx - 0.78, gy - 0.68) / 0.72);
      const pulseC = Math.max(0, 1 - Math.hypot(gx - 0.5, gy - 0.45) / 0.8);
      let color = blend(base, violet, pulseA * accentStrength);
      color = blend(color, cyan, pulseB * accentStrength * 0.78);
      color = blend(color, lime, pulseC * accentStrength * 0.18);
      canvas.set(x, y, color);
    }
  }
};

const drawZMark = (canvas, x, y, size, color = rgba('#f8fafc'), accent = rgba('#67e8f9')) => {
  const stroke = Math.max(10, Math.round(size * 0.105));
  const left = x + size * 0.2;
  const right = x + size * 0.8;
  const top = y + size * 0.24;
  const mid = y + size * 0.5;
  const bottom = y + size * 0.76;
  canvas.fillLine(left, top, right, top, stroke, color);
  canvas.fillLine(right, top, left, bottom, stroke, color);
  canvas.fillLine(left, bottom, right, bottom, stroke, color);
  canvas.fillLine(left + size * 0.08, mid + size * 0.16, right - size * 0.08, mid - size * 0.16, Math.max(6, stroke * 0.38), accent);
};

const drawWord = (canvas, x, y, scale, color) => {
  const w = 7 * scale;
  const h = 10 * scale;
  const gap = 3 * scale;
  const letters = {
    Z: [[0, 0, 5, 1], [4, 1, 5, 2], [3, 2, 4, 3], [2, 3, 3, 4], [1, 4, 2, 5], [0, 5, 5, 6]],
    Y: [[0, 0, 1, 1], [4, 0, 5, 1], [1, 1, 2, 2], [3, 1, 4, 2], [2, 2, 3, 6]],
    P: [[0, 0, 1, 6], [1, 0, 4, 1], [4, 1, 5, 3], [1, 3, 4, 4]],
    H: [[0, 0, 1, 6], [4, 0, 5, 6], [1, 3, 4, 4]],
    O: [[1, 0, 4, 1], [0, 1, 1, 5], [4, 1, 5, 5], [1, 5, 4, 6]],
    R: [[0, 0, 1, 6], [1, 0, 4, 1], [4, 1, 5, 3], [1, 3, 4, 4], [3, 4, 5, 6]],
    I: [[0, 0, 5, 1], [2, 1, 3, 5], [0, 5, 5, 6]],
    C: [[1, 0, 5, 1], [0, 1, 1, 5], [1, 5, 5, 6]],
  };

  'ZYPHORIC'.split('').forEach((letter, index) => {
    const ox = x + index * (w + gap);
    for (const [rx, ry, rw, rh] of letters[letter]) {
      canvas.fillRect(ox + rx * scale, y + ry * scale, rw * scale, rh * scale, color);
    }
  });
};

const writeIconPng = (fileName, size, maskable = false) => {
  const canvas = createCanvas(size, size);
  paintBackground(canvas, 0.6);

  const pad = size * (maskable ? 0.16 : 0.08);
  canvas.fillCircle(size * 0.5, size * 0.5, size * 0.38, rgba('#020617', 70));
  drawZMark(canvas, pad, pad, size - pad * 2, rgba('#f8fafc'), rgba('#67e8f9'));
  canvas.writePng(fileName);
};

const writeOgImage = (fileName) => {
  const canvas = createCanvas(1200, 630);
  paintBackground(canvas, 0.5);
  canvas.fillCircle(970, 160, 220, rgba('#67e8f9', 34));
  canvas.fillCircle(180, 520, 260, rgba('#a3e635', 18));
  canvas.fillRect(84, 96, 1032, 438, rgba('#020617', 64));
  drawZMark(canvas, 92, 150, 260, rgba('#f8fafc'), rgba('#67e8f9'));
  drawWord(canvas, 390, 180, 18, rgba('#f8fafc'));
  canvas.fillRect(398, 332, 520, 14, rgba('#67e8f9'));
  canvas.fillRect(398, 372, 650, 10, rgba('#94a3b8'));
  canvas.fillRect(398, 404, 590, 10, rgba('#94a3b8'));
  canvas.fillRect(398, 476, 170, 18, rgba('#a3e635'));
  canvas.fillRect(600, 476, 230, 18, rgba('#67e8f9'));
  canvas.writePng(fileName);
};

writeIconPng('zyphoric-icon-192.png', 192);
writeIconPng('zyphoric-icon-512.png', 512);
writeIconPng('zyphoric-maskable-192.png', 192, true);
writeIconPng('zyphoric-maskable-512.png', 512, true);
writeIconPng('zyphoric-apple-touch-icon.png', 180);
writeOgImage('zyphoric-og-image.png');
writeOgImage('zyphoric-social-preview.png');

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Zyphoric">
  <defs>
    <linearGradient id="zyphoric-favicon-gradient" x1="6" x2="58" y1="5" y2="59" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#7c3aed"/>
      <stop offset="0.52" stop-color="#0891b2"/>
      <stop offset="1" stop-color="#a3e635"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#08111f"/>
  <circle cx="46" cy="16" r="20" fill="#67e8f9" opacity=".16"/>
  <path d="M18 18h30L18 46h30" fill="none" stroke="url(#zyphoric-favicon-gradient)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24 40 42 24" fill="none" stroke="#f8fafc" stroke-width="4" stroke-linecap="round"/>
</svg>
`;

const maskIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16"/>
  <path d="M18 18h30L18 46h30" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 96" role="img" aria-label="Zyphoric logo">
  <defs>
    <linearGradient id="zyphoric-logo-gradient" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#7c3aed"/>
      <stop offset=".55" stop-color="#06b6d4"/>
      <stop offset="1" stop-color="#a3e635"/>
    </linearGradient>
  </defs>
  <rect width="96" height="96" rx="24" fill="#08111f"/>
  <path d="M28 28h40L28 68h40" fill="none" stroke="url(#zyphoric-logo-gradient)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M116 29h150v11H138l128 17v10H116V56h127L116 39z" fill="#f8fafc"/>
  <path d="M116 76h166v8H116z" fill="#67e8f9"/>
</svg>
`;

fs.writeFileSync(path.join(publicDir, 'zyphoric-favicon.svg'), favicon, 'utf8');
fs.writeFileSync(path.join(publicDir, 'zyphoric-mask-icon.svg'), maskIcon, 'utf8');
fs.writeFileSync(path.join(publicDir, 'zyphoric-logo.svg'), logo, 'utf8');

const manifest = {
  id: '/',
  name: 'Zyphoric',
  short_name: 'Zyphoric',
  description:
    'Zyphoric is a browser-native developer workspace with AI-enhanced utilities for formatting, decoding, and debugging.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  display_override: ['standalone', 'minimal-ui'],
  background_color: '#0f2549',
  theme_color: '#0f2549',
  lang: 'en-US',
  categories: ['developer', 'productivity', 'utilities'],
  shortcuts: [
    {
      name: 'JSON Formatter',
      short_name: 'JSON',
      description: 'Format and validate JSON locally.',
      url: '/tools/json',
      icons: [{ src: '/zyphoric-icon-192.png', sizes: '192x192', type: 'image/png' }],
    },
    {
      name: 'JWT Decoder',
      short_name: 'JWT',
      description: 'Decode JWT headers and payloads in the browser.',
      url: '/tools/jwt',
      icons: [{ src: '/zyphoric-icon-192.png', sizes: '192x192', type: 'image/png' }],
    },
    {
      name: 'AI Code Explainer',
      short_name: 'Explain',
      description: 'Get AI-assisted explanations for code snippets.',
      url: '/ai/explainer',
      icons: [{ src: '/zyphoric-icon-192.png', sizes: '192x192', type: 'image/png' }],
    },
  ],
  icons: [
    { src: '/zyphoric-icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/zyphoric-icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/zyphoric-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    { src: '/zyphoric-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  screenshots: [
    {
      src: '/zyphoric-social-preview.png',
      sizes: '1200x630',
      type: 'image/png',
      form_factor: 'wide',
      label: 'Zyphoric social preview',
    },
  ],
};

const serviceWorker = `const CACHE_VERSION = 'zyphoric-v1';
const APP_CACHE = \`\${CACHE_VERSION}-app\`;
const RUNTIME_CACHE = \`\${CACHE_VERSION}-runtime\`;
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/zyphoric-favicon.svg',
  '/zyphoric-icon-192.png',
  '/zyphoric-icon-512.png',
  '/zyphoric-maskable-192.png',
  '/zyphoric-maskable-512.png',
  '/zyphoric-apple-touch-icon.png',
  '/zyphoric-og-image.png',
  '/zyphoric-social-preview.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(APP_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![APP_CACHE, RUNTIME_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/.netlify/functions/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
`;

fs.writeFileSync(path.join(publicDir, 'manifest.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(publicDir, 'sw.js'), serviceWorker, 'utf8');

console.log('Generated Zyphoric brand assets, manifest, and service worker in public/.');
