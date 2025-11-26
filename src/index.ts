import { bootstrapServer } from './server.js';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      startTime?: number;
    }
  }
}

const main = async () => {
    await bootstrapServer();
}

main();