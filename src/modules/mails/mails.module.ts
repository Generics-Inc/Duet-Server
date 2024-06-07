import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";


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
        preview: true,
        template: {
          dir: process.cwd() + '/src/modules/mails/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
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
  ]
})
export class MailsModule {}
