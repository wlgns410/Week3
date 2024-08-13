import { Transport, KafkaOptions } from '@nestjs/microservices';

export const KAFKA_OPTION: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'nestjs',
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'nestjs-consumer',
      allowAutoTopicCreation: true,
      rebalanceTimeout: 1000,
    },
    producer: {
      allowAutoTopicCreation: true,
    },
  },
};
