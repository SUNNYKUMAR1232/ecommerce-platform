import 'reflect-metadata';
import { Controller, Get, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

@Controller()
class HealthController {
  @Get('/health')
  health() {
    return { service: 'notification-service', status: 'ok' };
  }
}

@Module({
  controllers: [HealthController],
})
class AppModule {}

const port = Number(process.env.PORT ?? 8090);
const app = await NestFactory.create(AppModule);
await app.listen(port, '0.0.0.0');
