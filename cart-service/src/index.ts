import Fastify from 'fastify';

const server = Fastify({ logger: true });
const port = Number(process.env.PORT ?? 8085);

server.get('/health', async () => ({ service: 'cart-service', status: 'ok' }));

await server.listen({ host: '0.0.0.0', port });
