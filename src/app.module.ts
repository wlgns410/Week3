import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConcertModule } from './modules/concert.module';
import { UserModule } from './modules/user.module';
import { TicketingModule } from './modules/ticketing.module';
import { DatabaseModule } from './libs/datasource/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConcertModule,
    TicketingModule,
    UserModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
