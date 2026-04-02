import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('POSTGRESQL_DATABASE_URL'),
        entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
        // migrations: [__dirname + '/migrations/**/*{.ts,.js}'], // TODO: enable after MVP
        synchronize: true,
        logging: config.get<string>('NODE_ENV') === 'development',
        autoLoadEntities: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
