import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { KAFKA_OPTION } from './kafka/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    ...KAFKA_OPTION,
  });

  const config = new DocumentBuilder()
    .setTitle('concert')
    .setDescription('The concert API description')
    .setVersion('1.0')
    .addTag('concert')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(5001);
}
bootstrap();
