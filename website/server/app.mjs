import http from 'node:http';
import { readFile, writeFile, rename, mkdir, chmod, stat, realpath, unlink } from 'node:fs/promises';
import path from 'node:path';
import { randomBytes, randomUUID, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { HttpError, invalid, object, string, validateSite, validateBooking, validateBookingUpdate } from './validation.mjs';

const derive = promisify(scrypt);
const MAX_IMAGE = 8 * 1024 * 1024;
const COOKIE = 'mudhouse_session';
const SESSION_SECONDS = 8 * 60 * 60;
const hashToken = token => createHash('sha256').update(token).digest('hex');
const equal = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const first = Buffer.from(a), second = Buffer.from(b);
  return first.length === second.length && timingSafeEqual(first, second);
};
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff' };

async function atomicJSON(filename, value) {
  const temporary = `${filename}.${randomUUID()}.tmp`;
  try { await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600, flag: 'wx' }); await rename(temporary, filename); }
  catch (error) { await unlink(temporary).catch(() => {}); throw error; }
}
async function accountFor(username, password) {
  const salt = randomBytes(24).toString('hex');
  const hash = (await derive(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 })).toString('hex');
  return { username, salt, hash };
}
async function passwordMatches(password, account) {
  if (typeof password !== 'string' || password.length > 256) return false;
  const hash = (await derive(password, account.salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 })).toString('hex');
  return equal(hash, account.hash);
}
function credentials(username, password) {
  if (typeof username !== 'string' || !/^[a-zA-Z0-9._-]{3,60}$/.test(username)) invalid('Admin ID must have 3–60 letters, numbers, dots, underscores or hyphens.');
  if (typeof password !== 'string' || password.length < 12 || password.length > 256) invalid('Choose a password with 12–256 characters.');
}
function bodyJSON(req, limit = 2 * 1024 * 1024) {
  if (!(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) throw new HttpError(415, 'Send JSON with Content-Type application/json.');
  const announced = Number(req.headers['content-length']);
  if (announced > limit) throw new HttpError(413, 'This request is too large.');
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0; let rejected = false;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > limit) { if (!rejected) { rejected = true; reject(new HttpError(413, 'This request is too large.')); } return; }
      chunks.push(chunk);
    });
    req.on('error', reject);
    req.on('end', () => { if (rejected) return; try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { reject(new HttpError(400, 'The request contains invalid JSON.')); } });
  });
}
function decodeImage(input) {
  const value = object(input, 'Image upload');
  string(value.filename, 'File name', 250, true);
  const encoded = string(value.data, 'Image data', Math.ceil(MAX_IMAGE / 3) * 4 + 4, true);
  if (encoded.length % 4 || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) invalid('Image data must use base64 encoding.');
  const buffer = Buffer.from(encoded, 'base64');
  if (!buffer.length || buffer.length > MAX_IMAGE) throw new HttpError(413, 'Choose an image smaller than 8 MB.');
  let mime, extension;
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && buffer.toString('ascii', 12, 16) === 'IHDR') {
    const width = buffer.readUInt32BE(16), height = buffer.readUInt32BE(20);
    if (!width || !height || width * height > 100000000) invalid('Image dimensions are unsupported.');
    mime = 'image/png'; extension = 'png';
  } else if (buffer.length >= 8 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 && buffer[buffer.length - 2] === 255 && buffer[buffer.length - 1] === 217) {
    mime = 'image/jpeg'; extension = 'jpg';
  } else if (buffer.length >= 16 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP' && buffer.readUInt32LE(4) === buffer.length - 8) {
    mime = 'image/webp'; extension = 'webp';
  } else if (buffer.length >= 14 && ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6)) && buffer[buffer.length - 1] === 59) {
    const width = buffer.readUInt16LE(6), height = buffer.readUInt16LE(8);
    if (!width || !height || width * height > 100000000) invalid('Image dimensions are unsupported.');
    mime = 'image/gif'; extension = 'gif';
  } else invalid('Use a valid PNG, JPEG, WebP or GIF image. SVG and other file types are not accepted.');
  if (value.mime !== mime) invalid('The selected file type does not match its image contents.');
  return { buffer, mime, extension, filename: path.basename(value.filename).replace(/[\r\n\u0000]/g, ''), alt: string(value.alt, 'Image description', 500), caption: string(value.caption, 'Image caption', 1000) };
}
function mediaReferenced(site, id) {
  const { media, ...rest } = site;
  const visit = value => value === id || (Array.isArray(value) ? value.some(visit) : value && typeof value === 'object' ? Object.values(value).some(visit) : false);
  return visit(rest);
}

export async function createCmsServer(options = {}) {
  const projectDir = options.projectDir || path.resolve(import.meta.dirname, '..');
  const dataDir = options.dataDir || path.join(projectDir, '.data');
  const uploadsDir = path.join(dataDir, 'uploads');
  const storePath = path.join(dataDir, 'store.json');
  const seedPath = options.seedPath || path.join(projectDir, 'cms', 'seed.json');
  const manifestPath = options.manifestPath || path.join(projectDir, 'cms', 'manifest.json');
  const distDir = options.distDir || path.join(projectDir, 'dist');
  const allowedOrigins = new Set(options.allowedOrigins || ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:5180', 'http://localhost:5180', ...(process.env.PUBLIC_ORIGIN ? [process.env.PUBLIC_ORIGIN] : [])]);
  const secureCookies = options.secureCookies ?? process.env.PUBLIC_ORIGIN?.startsWith('https:') ?? false;
  await mkdir(uploadsDir, { recursive: true, mode: 0o700 });
  await chmod(dataDir, 0o700); await chmod(uploadsDir, 0o700);
  const seed = options.seed || JSON.parse(await readFile(seedPath, 'utf8'));
  const readManifest = async () => options.manifest || JSON.parse(await readFile(manifestPath, 'utf8'));
  const knownFields = async () => { const manifest = await readManifest(); return { contentKeys: new Set(manifest.contentFields.map(field => field.id)), imageKeys: new Set(manifest.imageSlots.map(slot => slot.id)) }; };
  const roomIds = seed.rooms.map(item => item.id);
  let store;
  try { store = JSON.parse(await readFile(storePath, 'utf8')); }
  catch (error) {
    if (error.code !== 'ENOENT') throw new Error('CMS data could not be read. Restore the private datastore from a backup before restarting.');
    const username = options.initialCredentials?.username || 'admin';
    const password = options.initialCredentials?.password || randomBytes(24).toString('base64url');
    credentials(username, password);
    const site = validateSite(seed, { media: [], roomIds, ...await knownFields() });
    site.revision = 1; site.updatedAt = new Date().toISOString();
    store = { version: 1, site, bookings: [], account: await accountFor(username, password) };
    await atomicJSON(storePath, store);
    await writeFile(path.join(dataDir, 'initial-admin.txt'), `The Mud House — local administrator access\n\nAdmin URL: http://127.0.0.1:5173/admin\nAdmin ID: ${username}\nPassword: ${password}\n\nChange this password in Admin → Settings → Account after your first login.\nThis private file is removed automatically when the password is changed.\n`, { flag: 'wx', mode: 0o600 });
  }
  if (store.version !== 1 || !store.account?.hash || !Array.isArray(store.bookings)) throw new Error('The CMS datastore format is invalid.');
  validateSite(store.site, { media: store.site.media, roomIds, ...await knownFields() });
  await chmod(storePath, 0o600);
  const sessions = new Map(); const rates = new Map(); let pending = Promise.resolve();
  const enqueue = operation => { const next = pending.then(operation); pending = next.catch(() => {}); return next; };
  const persist = async next => { await atomicJSON(storePath, next); store = next; };
  const updateSite = async site => {
    const next = { ...site, revision: store.site.revision + 1, updatedAt: new Date().toISOString() };
    await persist({ ...store, site: next }); return next;
  };
  const sessionFor = req => {
    const token = (req.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
    const key = hashToken(token); const session = sessions.get(key);
    if (!session || session.expires <= Date.now()) { sessions.delete(key); return null; }
    return { ...session, key };
  };
  const cookie = (token, maxAge = SESSION_SECONDS) => `${COOKIE}=${token}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secureCookies ? '; Secure' : ''}`;
  const issueSession = res => {
    const token = randomBytes(32).toString('hex'); const csrfToken = randomBytes(32).toString('hex');
    sessions.set(hashToken(token), { username: store.account.username, csrfToken, expires: Date.now() + SESSION_SECONDS * 1000 });
    res.setHeader('Set-Cookie', cookie(token)); return { authenticated: true, username: store.account.username, csrfToken };
  };
  const rateLimit = (req, key, maximum, minutes) => {
    const id = `${key}:${req.socket.remoteAddress}`; const now = Date.now();
    let entry = rates.get(id); if (!entry || entry.until <= now) { entry = { count: 0, until: now + minutes * 60000 }; rates.set(id, entry); }
    if (++entry.count > maximum) throw new HttpError(429, 'Too many attempts. Please wait a few minutes and try again.');
  };
  const sweep = setInterval(() => {
    const now = Date.now(); for (const [key, session] of sessions) if (session.expires <= now) sessions.delete(key);
    for (const [key, rate] of rates) if (rate.until <= now) rates.delete(key);
  }, 60000).unref();
  const requireOrigin = req => {
    if (!allowedOrigins.has(req.headers.origin) || req.headers['sec-fetch-site'] === 'cross-site') throw new HttpError(403, 'This request must come from the hotel website.');
  };
  const requireAdmin = (req, write = false) => {
    const session = sessionFor(req); if (!session) throw new HttpError(401, 'Please sign in to continue.');
    if (write && !equal(req.headers['x-csrf-token'], session.csrfToken)) throw new HttpError(403, 'Your session security token is missing or expired. Refresh and try again.');
    return session;
  };
  const revisionMatches = revision => { if (!Number.isInteger(revision)) invalid('A valid site revision is required.'); if (revision !== store.site.revision) throw new HttpError(409, 'The website changed in another session. Reload the latest version before saving.'); };
  const send = (res, status, body) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); };
  const addBooking = async (body, manual) => enqueue(async () => {
    const normalized = validateBooking(body, store.site, { manual: true });
    const existing = store.bookings.find(item => item.requestId === normalized.requestId);
    if (existing) {
      const { id, reference, status, notes, createdAt, updatedAt, ...original } = existing;
      if (JSON.stringify(original) !== JSON.stringify(normalized)) throw new HttpError(409, 'This request was already submitted with different details. Start a new enquiry.');
      return { id, reference, status: 'new' };
    }
    const input = manual ? normalized : validateBooking(body, store.site);
    if (store.bookings.length >= 50000) throw new HttpError(503, 'Please contact the hotel to send your enquiry.');
    const now = new Date().toISOString(); const id = randomUUID();
    const booking = { ...input, id, reference: `MH-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`, status: 'new', notes: '', createdAt: now, updatedAt: now };
    await persist({ ...store, bookings: [booking, ...store.bookings] });
    return { id, reference: booking.reference, status: 'new' };
  });
  async function staticFile(res, filename, base, overrideMime) {
    try {
      const actual = await realpath(filename); const root = await realpath(base);
      if (!actual.startsWith(`${root}${path.sep}`) || !(await stat(actual)).isFile()) return false;
      const bytes = await readFile(actual);
      res.writeHead(200, { 'Content-Type': overrideMime || mimeTypes[path.extname(actual)] || 'application/octet-stream', 'Cache-Control': overrideMime ? 'public, max-age=86400' : 'no-cache', ...(overrideMime ? { 'Content-Security-Policy': "default-src 'none'; sandbox" } : {}) }); res.end(bytes); return true;
    } catch (error) { if (['ENOENT', 'ENOTDIR'].includes(error.code)) return false; throw error; }
  }
  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    try {
      let pathname;
      try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { throw new HttpError(400, 'Invalid request address.'); }
      if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').some(part => part === '..' || part.startsWith('.'))) throw new HttpError(404, 'Not found.');
      const method = req.method;
      if (!['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) throw new HttpError(405, 'Method not allowed.');
      if (pathname.startsWith('/api/') && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) requireOrigin(req);
      if (pathname === '/api/health' && method === 'GET') return send(res, 200, { ok: true });
      if (pathname === '/api/site' && method === 'GET') return send(res, 200, store.site);
      if (pathname === '/api/auth/session' && method === 'GET') { const session = sessionFor(req); return send(res, 200, session ? { authenticated: true, username: session.username, csrfToken: session.csrfToken } : { authenticated: false }); }
      if (pathname === '/api/auth/login' && method === 'POST') {
        rateLimit(req, 'login', options.loginLimit || 8, 15);
        const body = object(await bodyJSON(req), 'Sign in');
        const correct = await passwordMatches(body.password, store.account);
        if (!correct || body.username !== store.account.username) throw new HttpError(401, 'The admin ID or password is incorrect.');
        const old = sessionFor(req); if (old) sessions.delete(old.key);
        return send(res, 200, issueSession(res));
      }
      if (pathname === '/api/auth/logout' && method === 'POST') { const session = requireAdmin(req, true); sessions.delete(session.key); res.setHeader('Set-Cookie', cookie('', 0)); return send(res, 200, { authenticated: false }); }
      if (pathname === '/api/auth/password' && method === 'POST') {
        requireAdmin(req, true); rateLimit(req, 'password', 8, 15);
        const body = object(await bodyJSON(req), 'Account update'); credentials(body.username, body.newPassword);
        const account = store.account;
        if (!await passwordMatches(body.currentPassword, account)) throw new HttpError(401, 'The current password is incorrect.');
        const nextAccount = await accountFor(body.username, body.newPassword);
        await enqueue(async () => { if (store.account.hash !== account.hash) throw new HttpError(409, 'Your account changed in another session. Sign in again.'); await persist({ ...store, account: nextAccount }); sessions.clear(); await unlink(path.join(dataDir, 'initial-admin.txt')).catch(error => { if (error.code !== 'ENOENT') throw error; }); });
        return send(res, 200, issueSession(res));
      }
      if (pathname === '/api/bookings' && method === 'POST') { rateLimit(req, 'enquiry', options.bookingLimit || 15, 10); return send(res, 201, await addBooking(await bodyJSON(req), false)); }
      if (pathname.startsWith('/api/admin/')) {
        requireAdmin(req, !['GET', 'HEAD'].includes(method));
        if (pathname === '/api/admin/site' && method === 'GET') return send(res, 200, store.site);
        if (pathname === '/api/admin/manifest' && method === 'GET') return send(res, 200, await readManifest());
        if (pathname === '/api/admin/site' && method === 'PUT') {
          const body = object(await bodyJSON(req), 'Site update');
          const result = await enqueue(async () => { revisionMatches(body.revision); const site = validateSite(body.data, { media: store.site.media, roomIds, ...await knownFields() }); return updateSite(site); });
          return send(res, 200, result);
        }
        if (pathname === '/api/admin/media' && method === 'POST') {
          const input = decodeImage(await bodyJSON(req, 12 * 1024 * 1024));
          const result = await enqueue(async () => {
            if (store.site.media.length >= 2000) invalid('The media library is full. Remove unused images first.');
            const id = randomUUID(); const name = `${id}.${input.extension}`; const filename = path.join(uploadsDir, name);
            const media = { id, url: `/uploads/${name}`, filename: input.filename, mime: input.mime, size: input.buffer.length, alt: input.alt, caption: input.caption, createdAt: new Date().toISOString() };
            await writeFile(filename, input.buffer, { mode: 0o600, flag: 'wx' });
            try { const site = await updateSite({ ...store.site, media: [...store.site.media, media] }); return { media, site }; }
            catch (error) { await unlink(filename).catch(() => {}); throw error; }
          });
          return send(res, 201, result);
        }
        const mediaMatch = pathname.match(/^\/api\/admin\/media\/([a-f0-9-]{36})$/);
        if (mediaMatch && ['PATCH', 'DELETE'].includes(method)) {
          const body = object(await bodyJSON(req), 'Image update');
          const result = await enqueue(async () => {
            revisionMatches(body.revision); const item = store.site.media.find(item => item.id === mediaMatch[1]);
            if (!item) throw new HttpError(404, 'Image not found.');
            if (method === 'PATCH') return updateSite({ ...store.site, media: store.site.media.map(current => current.id === item.id ? { ...current, alt: string(body.alt, 'Image description', 500), caption: string(body.caption, 'Image caption', 1000) } : current) });
            if (mediaReferenced(store.site, item.id)) throw new HttpError(409, 'This image is still used on the website. Replace or remove its placements before deleting it.');
            const site = await updateSite({ ...store.site, media: store.site.media.filter(current => current.id !== item.id) });
            await unlink(path.join(uploadsDir, path.basename(item.url))).catch(error => { if (error.code !== 'ENOENT') throw error; }); return site;
          });
          return send(res, 200, result);
        }
        if (pathname === '/api/admin/bookings' && method === 'GET') return send(res, 200, { bookings: store.bookings });
        if (pathname === '/api/admin/bookings' && method === 'POST') return send(res, 201, await addBooking(await bodyJSON(req), true));
        const bookingMatch = pathname.match(/^\/api\/admin\/bookings\/([a-f0-9-]{36})$/);
        if (bookingMatch && method === 'PATCH') {
          const update = validateBookingUpdate(await bodyJSON(req));
          const booking = await enqueue(async () => {
            const index = store.bookings.findIndex(item => item.id === bookingMatch[1]); if (index < 0) throw new HttpError(404, 'Booking request not found.');
            const updated = { ...store.bookings[index], ...update, updatedAt: new Date().toISOString() }; const bookings = [...store.bookings]; bookings[index] = updated;
            await persist({ ...store, bookings }); return updated;
          }); return send(res, 200, booking);
        }
        if (pathname === '/api/admin/export' && method === 'GET') { res.setHeader('Content-Disposition', 'attachment; filename="mud-house-backup.json"'); return send(res, 200, { site: store.site, bookings: store.bookings, exportedAt: new Date().toISOString() }); }
      }
      if (pathname.startsWith('/api/')) throw new HttpError(404, 'API endpoint not found.');
      if (!['GET', 'HEAD'].includes(method)) throw new HttpError(405, 'Method not allowed.');
      if (pathname.startsWith('/uploads/')) {
        const item = store.site.media.find(item => item.url === pathname);
        if (!item || !/^\/uploads\/[a-f0-9-]{36}\.(png|jpg|webp|gif)$/.test(pathname) || !await staticFile(res, path.join(uploadsDir, path.basename(pathname)), uploadsDir, item.mime)) throw new HttpError(404, 'Image not found.');
        return;
      }
      const filename = path.resolve(distDir, `.${pathname === '/' ? '/index.html' : pathname}`);
      if (filename.startsWith(`${path.resolve(distDir)}${path.sep}`) && await staticFile(res, filename, distDir)) return;
      if (!path.extname(pathname) && await staticFile(res, path.join(distDir, 'index.html'), distDir)) return;
      throw new HttpError(404, 'Page not found. Start the frontend development server or create a production build.');
    } catch (error) {
      if (res.headersSent) { res.end(); return; }
      const status = error instanceof HttpError ? error.status : 500;
      if (status === 500 && !options.silent) console.error('CMS request failed:', error.message);
      send(res, status, { error: status === 500 ? 'The server could not complete this request. Please try again.' : error.message });
    }
  });
  server.requestTimeout = 30000; server.headersTimeout = 15000;
  server.on('close', () => clearInterval(sweep));
  return {
    server,
    async listen(port = 5180, host = '127.0.0.1') { await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, host, resolve); }); return server.address(); },
    async close() { await pending; await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())); },
  };
}
