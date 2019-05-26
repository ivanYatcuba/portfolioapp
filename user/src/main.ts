import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import * as helmet from 'helmet';

import { UserModule } from './user.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(UserModule, { cors: true });
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 4001
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const message = errors.map(it => {
          return {
            field: it.property,
            constraints: it.constraints
          }
        });
        return new UnprocessableEntityException(message)
      }

    }),
  );
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  const rateLimit = require("express-rate-limit");
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });

  app.use(
    limiter,
    helmet());


  const options = new DocumentBuilder()
    .setTitle('Portfolio App User')
    .setDescription('Portfolio App User api')
    .setVersion('1.0')
    .addTag('user')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/doc', app, document);

  app.startAllMicroservices(() => console.log('All microservices are listening...'));
  await app.listen(4000);
}
bootstrap();