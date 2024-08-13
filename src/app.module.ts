import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConcertModule } from './modules/concert.module';
import { UserModule } from './modules/user.module';
import { TicketingModule } from './modules/ticketing.module';
import { DatabaseModule } from './libs/datasource/module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm-config';
import { CommonModule } from './common/common.module';
import { RedisModule } from './redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_OPTION } from './kafka/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    ScheduleModule.forRoot(),
    ConcertModule,
    TicketingModule,
    UserModule,
    DatabaseModule,
    CommonModule,
    RedisModule,
    JwtModule.register({
      secret: 'test',
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...KAFKA_OPTION,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
