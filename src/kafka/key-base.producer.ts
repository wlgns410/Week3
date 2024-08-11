import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KeyBasedProducerService {
  private readonly kafka = new Kafka({
    clientId: 'nestjs-key-producer',
    brokers: ['localhost:9092'],
  });

  private readonly producer = this.kafka.producer();

  async produceMessage(key: string, message: string) {
    await this.producer.connect();

    await this.producer.send({
      topic: 'concert',
      messages: [{ key: key, value: message }],
    });

    await this.producer.disconnect();
    console.log(`Message sent to topic 'concert' with key: ${key}`);
  }
}
