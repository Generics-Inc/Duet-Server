require('module-alias/register');

import * as CookieParser from 'cookie-parser';
import {AsyncApiDocumentBuilder, AsyncApiModule, AsyncServerObject} from "nestjs-asyncapi";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {Logger, ValidationPipe} from "@nestjs/common";
import {NestFactory} from '@nestjs/core';
import {AppModule} from "@modules/app/app.module";
import {GuardianFilter} from "./errors";

async function bootstrap() {
    const PORT = +process.env.API_PORT || 8000;
    const logger = new Logger('App');
    const app = await NestFactory.create(AppModule, {cors: true});

    app.setGlobalPrefix('api');
    app.useGlobalFilters(new GuardianFilter());
    app.use(CookieParser());
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true
    }));

    const config = new DocumentBuilder()
        .setTitle("DUET Nest API")
        .setDescription("Документация к REST API")
        .setVersion(process.env.npm_package_version)
        .addApiKey({
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            bearerFormat: 'JWT',
            scheme: 'bearer',
            description: 'Введите свой access токен в формате "Bearer xxx"'
        }, 'AccessToken')
        .addApiKey({
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            bearerFormat: 'JWT',
            scheme: 'bearer',
            description: 'Введите свой refresh токен в формате "Bearer xxx"'
        }, 'RefreshToken')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/swagger', app, document);

    const socketsServer: AsyncServerObject = {
        url: 'ws://localhost:4000',
        protocol: 'socket.io',
        protocolVersion: '4',
        description: 'Подключаться по протоколу webSocket к Socket.IO сервера'
    };

    const socketsConfig = new AsyncApiDocumentBuilder()
        .setTitle('DUET Sockets Nest API')
        .setDescription('Документация к webSockets')
        .setVersion(process.env.npm_package_version)
        .addServer('app', socketsServer)
        .build();
    const socketsDocument = AsyncApiModule.createDocument(app, socketsConfig);
    await AsyncApiModule.setup('/swaggerWebSocket', app, socketsDocument);

    await app.listen(PORT, () => logger.log(`Server was started at http://localhost:${PORT}`));
}

bootstrap().then();
