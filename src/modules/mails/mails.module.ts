import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MailerModule} from "@nestjs-modules/mailer";
import { MailsController } from './mails.controller';
import {resolve} from "path";
import {PugAdapter} from "@nestjs-modules/mailer/dist/adapters/pug.adapter";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: `smtps://${config.getOrThrow('EMAIL_USER')}:${config.getOrThrow('EMAIL_PASSWORD')}@${config.getOrThrow('EMAIL_HOST_SEND')}`,
        defaults: {
          from: `"Duet Verify" ${config.getOrThrow('EMAIL_USER')}`,
        },
        preview: false,
        template: {
          dir: resolve(process.cwd(), 'templates'),
          adapter: new PugAdapter(),
          options: {
            strict: false,
          },
        },
      })
    }),
  ],
  providers: [
      MailsService
  ],
  exports: [
      MailsService
  ],
  controllers: [
      MailsController
  ]
})
export class MailsModule {}
