import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from './config/';
import { Env } from './config/env';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => ({
        uri: configService.get('MONGO_URI'),
      }),
    }),
  ],
})
export class AppModule {}
