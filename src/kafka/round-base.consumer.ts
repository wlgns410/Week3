import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, EachMessagePayload } from 'kafkajs';

@Injectable()
export class RoundRobinConsumerService implements OnModuleInit {
  private readonly kafka = new Kafka({
    clientId: 'nestjs-round-robin-consumer',
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
          value: message.value?.toString(),
        });
      },
    });
  }
}
