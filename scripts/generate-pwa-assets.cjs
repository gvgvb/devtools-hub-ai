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

const rgba = (hex) => {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
    255,
  ];
};

const blend = (a, b, t) => a.map((value, index) => Math.round(value + (b[index] - value) * t));

const writePng = (fileName, size, maskable = false) => {
  const pixels = Buffer.alloc(size * size * 4);
  const top = rgba('#0f172a');
  const bottom = rgba('#2563eb');
  const accent = rgba('#22c55e');
  const white = rgba('#ffffff');
  const safe = maskable ? 0.18 : 0.08;

  const set = (x, y, color) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    pixels[i] = color[0];
    pixels[i + 1] = color[1];
    pixels[i + 2] = color[2];
    pixels[i + 3] = color[3];
  };

  const fillRect = (x, y, w, h, color) => {
    for (let yy = Math.max(0, y); yy < Math.min(size, y + h); yy += 1) {
      for (let xx = Math.max(0, x); xx < Math.min(size, x + w); xx += 1) set(xx, yy, color);
    }
  };

  const fillLine = (x1, y1, x2, y2, width, color) => {
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const x = Math.round(x1 + (x2 - x1) * t);
      const y = Math.round(y1 + (y2 - y1) * t);
      fillRect(x - Math.floor(width / 2), y - Math.floor(width / 2), width, width, color);
    }
  };

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (x - size / 2) / (size / 2);
      const dy = (y - size / 2) / (size / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const base = blend(top, bottom, y / size);
      const glow = Math.max(0, 1 - distance);
      set(x, y, blend(base, accent, glow * 0.28));
    }
  }

  const inset = Math.round(size * safe);
  const stroke = Math.max(10, Math.round(size * 0.07));
  fillLine(inset + size * 0.26, size * 0.31, inset + size * 0.12, size * 0.5, stroke, white);
  fillLine(inset + size * 0.12, size * 0.5, inset + size * 0.26, size * 0.69, stroke, white);
  fillLine(size - inset - size * 0.26, size * 0.31, size - inset - size * 0.12, size * 0.5, stroke, white);
  fillLine(size - inset - size * 0.12, size * 0.5, size - inset - size * 0.26, size * 0.69, stroke, white);
  fillRect(Math.round(size * 0.46), Math.round(size * 0.28), stroke, Math.round(size * 0.44), accent);

  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0;
    pixels.copy(raw, rowStart + 1, y * size * 4, (y + 1) * size * 4);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
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

writePng('icon-192.png', 192);
writePng('icon-512.png', 512);
writePng('maskable-192.png', 192, true);
writePng('maskable-512.png', 512, true);
writePng('apple-touch-icon.png', 180);

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="0.65" stop-color="#2563eb"/>
      <stop offset="1" stop-color="#22c55e"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <path d="M25 18 13 32l12 14M39 18l12 14-12 14" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M32 17v30" stroke="#22c55e" stroke-width="7" stroke-linecap="round"/>
</svg>
`;

const maskIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M8 8h48v48H8z"/>
  <path d="M25 18 13 32l12 14M39 18l12 14-12 14" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), favicon, 'utf8');
fs.writeFileSync(path.join(publicDir, 'mask-icon.svg'), maskIcon, 'utf8');

console.log('Generated PWA icons in public/.');
