import { Module } from '@nestjs/common';
import { KeyBasedProducerService } from './key-base.producer';
import { KeyBasedConsumerService } from './key-base.consumer';
import { RoundRobinProducerService } from './round-base.producer';
import { RoundRobinConsumerService } from './round-base.consumer';

@Module({
  providers: [
    KeyBasedProducerService,
    KeyBasedConsumerService,
    RoundRobinProducerService,
    RoundRobinConsumerService,
  ],
  exports: [
    KeyBasedProducerService,
    KeyBasedConsumerService,
    RoundRobinProducerService,
    RoundRobinConsumerService,
  ],
})
export class KafkaServiceModule {}
