import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";
import useLog from "./composables/useLog";
import {GuardianFilter} from "./errors/GuardianFilter";
import {AsyncApiDocumentBuilder, AsyncApiModule, AsyncServerObject} from "nestjs-asyncapi";

async function bootstrap() {
  const PORT = +process.env.API_PORT || 8000;
  const app = await NestFactory.create(AppModule, {cors: true});

  app.useGlobalFilters(new GuardianFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle("Loregram Nest API")
    .setDescription("Документация к REST API")
    .setVersion(process.env.npm_package_version)
    .addTag('App')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  const socketsServer: AsyncServerObject = {
    url: 'ws://localhost:4000',
    protocol: 'socket.io',
    protocolVersion: '4',
    description: 'Позволяет вам подключаться по протоколу webSocket к нашему Socket.IO серверу.'
  };

  const socketsConfig = new AsyncApiDocumentBuilder()
      .setTitle('Loregram Sockets Nest API')
      .setDescription('Документация событий сервера Loregram на базе webSockets')
      .setVersion(process.env.npm_package_version)
      .addServer('app', socketsServer)
      .build();
  const socketsDocument = AsyncApiModule.createDocument(app, socketsConfig);
  //await AsyncApiModule.setup('/api/swaggerEvents', app, socketsDocument);

  await app.listen(PORT, () => useLog(`Сервер запущен. Порт: ${PORT}`));
}
bootstrap().then();
