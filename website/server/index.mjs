import { createCmsServer } from './app.mjs';

const app = await createCmsServer();
const port = Number(process.env.API_PORT || 5180);
await app.listen(port, '127.0.0.1');
console.log(`The Mud House CMS is ready at http://127.0.0.1:${port}`);
console.log('First-run administrator credentials are stored privately in .data/initial-admin.txt.');
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => { await app.close(); process.exit(0); });
