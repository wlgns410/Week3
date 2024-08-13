import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaAdminService implements OnModuleInit {
  private readonly kafka = new Kafka({
    clientId: 'nestjs-admin',
    brokers: ['localhost:9092'],
  });

  async onModuleInit() {
    const admin = this.kafka.admin();
    await admin.connect();
    const topics = await admin.listTopics();

    if (!topics.includes('concert')) {
      await admin.createTopics({
        topics: [
          {
            topic: 'concert',
            numPartitions: 3,
            replicationFactor: 1,
          },
        ],
      });
      console.log('Kafka topics created successfully');
    } else {
      console.log('Topic "concert" already exists');
    }
    await admin.disconnect();
    console.log('Kafka topics created successfully');
  }
}
