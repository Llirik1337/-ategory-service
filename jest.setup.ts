import { NatsServerBuilder, NatsServer } from 'nats-memory-server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { RedisMemoryServer } from 'redis-memory-server';

let natsServer: NatsServer;

let mongodbServer: MongoMemoryServer;

let redisServer: RedisMemoryServer;

async function createNatsServer() {
  natsServer = await NatsServerBuilder.create()
    .setVerbose(false)
    .build()
    .start();

  process.env.NATS_URL = natsServer.getUrl();
}

async function createMongoServer() {
  mongodbServer = await MongoMemoryServer.create();
  process.env.MONGODB_URL = mongodbServer.getUri();
}

async function createRedisServer() {
  redisServer = new RedisMemoryServer({ autoStart: false });

  await redisServer.start();

  const [host, port] = await Promise.all([
    redisServer.getHost(),
    redisServer.getPort(),
  ]);

  process.env.REDIS_URL = `${host}:${port}`;
}

beforeAll(async () => {
  await createNatsServer();
  await createMongoServer();
  await createRedisServer();
});

afterAll(async () => {
  await Promise.all([
    natsServer.stop(),
    mongodbServer.stop(),
    redisServer.stop(),
  ]);
});
