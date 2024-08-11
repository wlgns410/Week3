import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class RoundRobinProducerService {
  private readonly kafka = new Kafka({
    clientId: 'nestjs-round-robin-producer',
    brokers: ['localhost:9092'],
  });

  private readonly producer = this.kafka.producer();

  async produceMessage(message: string) {
    await this.producer.connect();

    await this.producer.send({
      topic: 'concert',
      messages: [{ value: message }],
    });

    await this.producer.disconnect();
    console.log(
      `Message sent to topic 'concert' with round-robin partitioning`,
    );
  }
}
