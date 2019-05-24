import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [AuthModule, UserModule, PortfolioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
