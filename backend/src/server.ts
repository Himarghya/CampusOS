import { createApp } from './app';
import { config } from './config';
import { logger } from './lib/logger';

const app = createApp();

app.listen(config.port, () => {
  logger.info(`CampusOS Backend API is running on http://localhost:${config.port}`);
  logger.info(`Environment: ${config.env}`);
});
