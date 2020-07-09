import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const config = require('config');

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);


  // NODE_ENV
  const serverConfig = config.get('server');

  const port = serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`)

}
bootstrap();
