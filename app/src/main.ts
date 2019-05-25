import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  await app.listen(3000);
}
bootstrap();