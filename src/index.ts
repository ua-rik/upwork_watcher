import Fastify from 'fastify';
import run from './service';
import logger from './lib/log';

const app = Fastify({ logger });

app.get('/health', async () => ({ status: 'ok' }));
app.get('/run', async () => {
  await run();
  return { status: 'done' };
});

const port = Number(process.env.PORT || 3000);
app
  .listen({ port, host: '0.0.0.0' })
  .then(() => {
    app.log.info(`listening on ${port}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
