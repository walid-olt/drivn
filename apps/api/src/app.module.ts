import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppConfigModule } from './config/';
import { UserModule } from './user/user.module';
import { RequestLogger } from './logger/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
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
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLogger).forRoutes('*');
  }
}
