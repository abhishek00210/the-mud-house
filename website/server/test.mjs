import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, stat, writeFile, mkdir, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createCmsServer } from './app.mjs';
import { validateBooking } from './validation.mjs';

const origin = 'http://127.0.0.1:5173';
const fixturePassword = 'test-only-secure-password-12345';
const seed = JSON.parse(await readFile(new URL('../cms/seed.json', import.meta.url), 'utf8'));
const manifest = JSON.parse(await readFile(new URL('../cms/manifest.json', import.meta.url), 'utf8'));
const contentKey = manifest.contentFields[0].id;
const imageKey = manifest.imageSlots[0].id;
const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j0ioAAAAASUVORK5CYII=';

async function fixture(options = {}) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'mudhouse-cms-test-'));
  const config = { dataDir: path.join(directory, '.data'), distDir: path.join(directory, 'dist'), seed, manifest, initialCredentials: { username: 'test-admin', password: fixturePassword }, allowedOrigins: [origin], silent: true, ...options };
  let app = await createCmsServer(config); let address = await app.listen(0); let base = `http://127.0.0.1:${address.port}`;
  let cookie = ''; let token = '';
  async function request(route, { method = 'GET', body, auth = true, csrf = true, from = origin, headers = {} } = {}) {
    const response = await fetch(`${base}${route}`, { method, headers: { ...(method !== 'GET' ? { 'Content-Type': 'application/json', ...(from ? { Origin: from } : {}) } : {}), ...(auth && cookie ? { Cookie: cookie } : {}), ...(csrf && token ? { 'X-CSRF-Token': token } : {}), ...headers }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
    const text = await response.text(); let data; try { data = JSON.parse(text); } catch { data = text; }
    return { status: response.status, data, headers: response.headers };
  }
  async function login(username = 'test-admin', password = fixturePassword) {
    const result = await request('/api/auth/login', { method: 'POST', body: { username, password }, auth: false });
    assert.equal(result.status, 200); cookie = result.headers.get('set-cookie').split(';')[0]; token = result.data.csrfToken; return result;
  }
  async function site() { const result = await request('/api/admin/site'); assert.equal(result.status, 200); return result.data; }
  async function save(data) { return request('/api/admin/site', { method: 'PUT', body: { revision: data.revision, data } }); }
  return { directory, config, request, login, site, save,
    async restart() { await app.close(); app = await createCmsServer(config); address = await app.listen(0); base = `http://127.0.0.1:${address.port}`; },
    async close() { await app.close(); await rm(directory, { recursive: true, force: true }); },
  };
}
const booking = (values = {}) => ({ type: 'stay', itemId: seed.rooms[0].id, name: 'Test Guest', contact: 'guest@example.test', method: 'Email', date: '2099-10-11', endDate: '2099-10-13', guests: 2, rooms: 1, message: 'Test stay request', consent: true, requestId: `test-${crypto.randomUUID()}`, ...values });

test('Persistent CMS authentication, editing, media and booking lifecycle', async t => {
  const f = await fixture({ bookingLimit: 100 }); t.after(() => f.close());
  await t.test('private initialization and sanitized public configuration', async () => {
    const publicSite = await f.request('/api/site', { auth: false }); assert.equal(publicSite.status, 200);
    assert.equal(publicSite.data.rooms.length, 4); assert.equal(publicSite.data.account, undefined); assert.equal(publicSite.data.bookings, undefined);
    const file = await readFile(path.join(f.config.dataDir, 'store.json'), 'utf8'); assert.ok(!file.includes(fixturePassword));
    assert.equal((await stat(path.join(f.config.dataDir, 'store.json'))).mode & 0o777, 0o600);
    assert.equal((await stat(path.join(f.config.dataDir, 'initial-admin.txt'))).mode & 0o777, 0o600);
    assert.equal((await f.request('/api/auth/session')).data.authenticated, false);
    assert.equal((await f.request('/api/admin/site')).status, 401);
    assert.equal((await f.request('/api/admin/bookings')).status, 401);
    assert.equal((await f.request('/api/admin/export')).status, 401);
    assert.equal((await f.request('/api/admin/site', { method: 'PUT', body: {} })).status, 401);
  });
  await t.test('sign-in cookies, trusted origin and CSRF checks', async () => {
    assert.equal((await f.request('/api/auth/login', { method: 'POST', body: { username: 'test-admin', password: 'wrong' } })).status, 401);
    const login = await f.login(); const cookie = login.headers.get('set-cookie');
    assert.match(cookie, /HttpOnly/); assert.match(cookie, /SameSite=Strict/); assert.match(cookie, /Path=\/api/);
    assert.equal((await f.request('/api/auth/session')).data.authenticated, true);
    assert.equal((await f.request('/api/admin/manifest')).data.contentFields.length, manifest.contentFields.length);
    const data = await f.site();
    assert.equal((await f.request('/api/admin/site', { method: 'PUT', body: { revision: data.revision, data }, csrf: false })).status, 403);
    assert.equal((await f.request('/api/admin/site', { method: 'PUT', body: { revision: data.revision, data }, from: 'https://attacker.test' })).status, 403);
    assert.equal((await f.request('/api/admin/site', { method: 'PUT', body: { revision: data.revision, data }, from: null })).status, 403);
    assert.equal((await f.request('/api/admin/site', { method: 'PUT', body: { revision: data.revision, data }, headers: { 'Sec-Fetch-Site': 'cross-site' } })).status, 403);
    assert.equal((await f.request('/api/admin/site', { method: 'PUT', body: { revision: data.revision, data }, headers: { 'Content-Type': 'text/plain' } })).status, 415);
    assert.equal((await f.request('/api/admin/site', { method: 'PUT', body: { oversized: 'x'.repeat(2 * 1024 * 1024) } })).status, 413);
  });
  await t.test('persistent content writes, server-owned revision and concurrency protection', async () => {
    const data = await f.site(); data.content[contentKey] = 'A saved hotel welcome'; data.revision = 1;
    const results = await Promise.all([f.save(data), f.save(data)]);
    assert.deepEqual(results.map(result => result.status).sort(), [200, 409]);
    const updated = await f.site(); assert.equal(updated.revision, 2); assert.equal(updated.content[contentKey], 'A saved hotel welcome');
    assert.equal((await f.request('/api/site')).data.content[contentKey], 'A saved hotel welcome');
    assert.equal(JSON.parse(await readFile(path.join(f.config.dataDir, 'store.json'), 'utf8')).site.revision, 2);
  });
  await t.test('invalid state cannot overwrite valid content', async () => {
    const original = await f.site();
    const mutations = [
      data => { data.rooms[0].rate = -1; }, data => { data.rooms[0].guests = 1.5; },
      data => { data.packages.push({ ...data.packages[0] }); }, data => { data.rooms.pop(); },
      data => { data.content['invented:field'] = 'Unknown field'; }, data => { data.images['invented:image'] = { mediaId: '', alt: '', position: 'center' }; },
      data => { data.settings.mapUrl = 'javascript:alert(1)'; }, data => { data.settings.accentColor = 'red;display:none'; },
      data => { data.settings.accentColor = ['#ffffff']; },
      data => { data.gallery[0].href = '//attacker.test'; }, data => { data.settings.logoMediaId = 'missing'; },
      data => { data.gallery[0].photo = 'missing'; }, data => { data.packages[0].photo = 'missing'; },
      data => { data.rooms[0].image = 'missing'; }, data => { data.menu[0].category = 'missing'; }, data => { data.faqs[0].category = 'missing'; },
      data => { data.rooms[0].blockedDates = [{ from: '2099-02-30', to: '2099-03-01' }]; },
    ];
    for (const mutate of mutations) { const data = structuredClone(original); mutate(data); assert.equal((await f.save(data)).status, 400); }
    assert.equal((await f.site()).revision, original.revision);
  });
  await t.test('validated uploads, metadata, image placement and referenced-file protection', async () => {
    const upload = body => f.request('/api/admin/media', { method: 'POST', body });
    assert.equal((await upload({ filename: 'bad.svg', mime: 'image/svg+xml', data: Buffer.from('<svg/>').toString('base64'), alt: '', caption: '' })).status, 400);
    assert.equal((await upload({ filename: 'bad.jpg', mime: 'image/jpeg', data: png, alt: '', caption: '' })).status, 400);
    assert.equal((await upload({ filename: 'bad.png', mime: 'image/png', data: '@@@@', alt: '', caption: '' })).status, 400);
    const result = await upload({ filename: '../new-room.png', mime: 'image/png', data: png, alt: 'A bright room', caption: 'Room photograph' });
    assert.equal(result.status, 201); const media = result.data.media; assert.match(media.url, /^\/uploads\/[a-f0-9-]{36}\.png$/); assert.equal(media.filename, 'new-room.png');
    const image = await f.request(media.url, { auth: false }); assert.equal(image.status, 200); assert.match(image.headers.get('content-type'), /image\/png/); assert.equal(image.headers.get('x-content-type-options'), 'nosniff');
    const metadata = await f.request(`/api/admin/media/${media.id}`, { method: 'PATCH', body: { revision: result.data.site.revision, alt: 'Updated alt', caption: 'Updated caption' } }); assert.equal(metadata.status, 200);
    const state = metadata.data; state.images[imageKey] = { mediaId: media.id, alt: 'Hero', position: '50% 50%' };
    const saved = await f.save(state); assert.equal(saved.status, 200);
    assert.equal((await f.request(`/api/admin/media/${media.id}`, { method: 'DELETE', body: { revision: saved.data.revision } })).status, 409);
    delete saved.data.images[imageKey]; const removedPlacement = await f.save(saved.data); assert.equal(removedPlacement.status, 200);
    assert.equal((await f.request(`/api/admin/media/${media.id}`, { method: 'DELETE', body: { revision: removedPlacement.data.revision } })).status, 200);
    assert.equal((await f.request(media.url)).status, 404);
    await assert.rejects(stat(path.join(f.config.dataDir, 'uploads', path.basename(media.url))), { code: 'ENOENT' });
  });
  await t.test('public requests are private, idempotent and date-validated', async () => {
    const input = booking();
    const result = await f.request('/api/bookings', { method: 'POST', body: input, auth: false }); assert.equal(result.status, 201); assert.match(result.data.reference, /^MH-/);
    assert.equal(Object.keys(result.data).length, 3); assert.equal(result.data.status, 'new');
    const duplicate = await f.request('/api/bookings', { method: 'POST', body: input, auth: false }); assert.deepEqual(duplicate.data, result.data);
    assert.equal((await f.request('/api/bookings', { method: 'POST', body: { ...input, name: 'Changed name' }, auth: false })).status, 409);
    assert.equal((await f.request('/api/bookings')).status, 404);
    for (const changed of [{ itemId: 'unknown-room' }, { consent: false }, { date: '2099-02-30' }, { endDate: '2099-10-10' }, { guests: -1 }, { contact: 'invalid' }, { website: 'spam' }, { date: '2000-01-01', endDate: '2000-01-02' }]) {
      assert.equal((await f.request('/api/bookings', { method: 'POST', body: booking(changed), auth: false })).status, 400);
    }
    const entries = (await f.request('/api/admin/bookings')).data.bookings; assert.equal(entries.length, 1); assert.equal(entries[0].name, 'Test Guest');
    const update = await f.request(`/api/admin/bookings/${result.data.id}`, { method: 'PATCH', body: { status: 'confirmed', notes: 'Hotel confirmed by phone' } });
    assert.equal(update.status, 200); assert.equal(update.data.status, 'confirmed'); assert.equal(update.data.notes, 'Hotel confirmed by phone');
    assert.equal((await f.request(`/api/admin/bookings/${result.data.id}`, { method: 'PATCH', body: { status: 'invented', notes: '' } })).status, 400);
  });
  await t.test('availability enforcement, checkout boundary and staff override', async () => {
    let data = await f.site(); data.rooms[0].blockedDates = [{ from: '2099-10-11', to: '2099-10-13' }]; assert.equal((await f.save(data)).status, 200);
    // Use authenticated manual requests for no rate-limit test interference, then public availability checks.
    assert.equal((await f.request('/api/bookings', { method: 'POST', body: booking(), auth: false })).status, 409);
    assert.equal((await f.request('/api/bookings', { method: 'POST', body: booking({ date: '2099-10-10', endDate: '2099-10-11' }), auth: false })).status, 201);
    assert.equal((await f.request('/api/admin/bookings', { method: 'POST', body: booking() })).status, 201);
    data = await f.site(); data.settings.bookingsOpen = false; assert.equal((await f.save(data)).status, 200);
    assert.equal((await f.request('/api/bookings', { method: 'POST', body: booking({ itemId: undefined }), auth: false })).status, 409);
    assert.equal((await f.request('/api/bookings', { method: 'POST', body: booking({ type: 'general', itemId: undefined, date: undefined, endDate: undefined }), auth: false })).status, 201);
    data = await f.site(); data.settings.bookingsOpen = true; data.settings.diningOpen = false; assert.equal((await f.save(data)).status, 200);
    assert.equal((await f.request('/api/bookings', { method: 'POST', body: booking({ type: 'dining', itemId: undefined, time: '12:00' }), auth: false })).status, 409);
    data = await f.site(); data.packages[0].bookingOpen = false; assert.equal((await f.save(data)).status, 200);
    assert.equal((await f.request('/api/bookings', { method: 'POST', body: booking({ type: 'experience', itemId: data.packages[0].id }), auth: false })).status, 409);
    data = await f.site(); data.packages[0].bookingOpen = true; data.packages[0].blockedDates = [{ from: '2099-10-11', to: '2099-10-13' }]; assert.equal((await f.save(data)).status, 200);
    assert.equal((await f.request('/api/bookings', { method: 'POST', body: booking({ type: 'experience', itemId: data.packages[0].id }), auth: false })).status, 409);
  });
  await t.test('backup excludes credentials; traversal and private files are inaccessible', async () => {
    const result = await f.request('/api/admin/export'); assert.equal(result.status, 200); assert.ok(result.data.site); assert.ok(result.data.bookings.length); assert.equal(result.data.account, undefined); assert.ok(!JSON.stringify(result.data).includes(fixturePassword));
    for (const address of ['/.data/store.json', '/uploads/%2e%2e%2fstore.json', '/uploads/unknown.svg', '/server/app.mjs', '/cms/seed.json']) assert.equal((await f.request(address)).status, 404);
    await mkdir(f.config.distDir, { recursive: true }); await writeFile(path.join(f.config.distDir, 'index.html'), '<main>Hotel</main>');
    await symlink(path.join(f.config.dataDir, 'store.json'), path.join(f.config.distDir, 'private.json'));
    assert.equal((await f.request('/private.json')).status, 404); assert.equal((await f.request('/admin')).status, 200);
  });
  await t.test('restart persistence, account rotation and logout', async () => {
    const revision = (await f.site()).revision; await f.restart();
    assert.equal((await f.request('/api/auth/session')).data.authenticated, false); await f.login(); assert.equal((await f.site()).revision, revision);
    assert.ok((await f.request('/api/admin/bookings')).data.bookings.some(item => item.status === 'confirmed'));
    const changed = await f.request('/api/auth/password', { method: 'POST', body: { currentPassword: fixturePassword, username: 'new-admin', newPassword: 'different-test-password-98765' } }); assert.equal(changed.status, 200);
    assert.equal((await f.request('/api/admin/site')).status, 401);
    await assert.rejects(stat(path.join(f.config.dataDir, 'initial-admin.txt')), { code: 'ENOENT' });
    await f.login('new-admin', 'different-test-password-98765');
    assert.equal((await f.request('/api/auth/logout', { method: 'POST', body: {} })).status, 200); assert.equal((await f.request('/api/admin/site')).status, 401);
  });
});

test('India-time dining validation and phone normalization', () => {
  const now = Date.parse('2099-10-10T23:00:00+05:30');
  const dining = booking({ type: 'dining', itemId: undefined, date: '2099-10-10', endDate: undefined, time: '23:30' });
  assert.equal(validateBooking(dining, seed, { now }).time, '23:30');
  assert.throws(() => validateBooking({ ...dining, time: '22:59' }, seed, { now }), /future dining time/);
  assert.throws(() => validateBooking({ ...dining, time: undefined }, seed, { now }), /future dining time/);
  assert.throws(() => validateBooking({ ...dining, date: '2099-10-10', time: '23:59' }, seed, { now: Date.parse('2099-10-11T00:01:00+05:30') }), /future date/);
  assert.equal(validateBooking(booking({ method: 'Phone', contact: '+91 98765.43210' }), seed, { now }).contact, '+91 98765.43210');
  assert.throws(() => validateBooking(booking({ method: 'Phone', contact: '-------' }), seed, { now }), /valid phone/);
});

test('login and public enquiry rate limiting', async t => {
  const f = await fixture({ loginLimit: 2, bookingLimit: 2 }); t.after(() => f.close());
  for (let i = 0; i < 2; i++) assert.equal((await f.request('/api/auth/login', { method: 'POST', body: { username: 'test-admin', password: 'incorrect' } })).status, 401);
  assert.equal((await f.request('/api/auth/login', { method: 'POST', body: { username: 'test-admin', password: fixturePassword } })).status, 429);
  for (let i = 0; i < 2; i++) assert.equal((await f.request('/api/bookings', { method: 'POST', body: booking() })).status, 201);
  assert.equal((await f.request('/api/bookings', { method: 'POST', body: booking() })).status, 429);
});
