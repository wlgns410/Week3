import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KeyBasedConsumerService implements OnModuleInit {
  private readonly kafka = new Kafka({
    clientId: 'nestjs-key-consumer',
    brokers: ['localhost:9092'],
  });

  private readonly consumer = this.kafka.consumer({
    groupId: 'nestjs-consumer-group',
  });

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'concert', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        console.log({
          partition,
          key: message.key?.toString(),
          value: message.value?.toString(),
        });
      },
    });
  }
}
