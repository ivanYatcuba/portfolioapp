import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import * as helmet from 'helmet';

import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
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
    .setTitle('Portfolio App')
    .setDescription('Portfolio App api')
    .setVersion('1.0')
    .addTag('test app')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/doc', app, document);

  await app.listen(3000);
}
bootstrap();