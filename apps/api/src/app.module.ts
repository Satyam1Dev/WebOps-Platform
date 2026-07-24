import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Configuration
import { configuration, envValidationSchema } from './config';

// Core Modules
import { PrismaModule } from './prisma/prisma.module';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

// App
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // ============================
    // Global Configuration
    // ============================
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),

    // ============================
    // Core Infrastructure
    // ============================
    PrismaModule,

    // ============================
    // Feature Modules
    // ============================
    UsersModule,
    AuthModule,

    // Future Modules
    // RbacModule,
    // AuditModule,
    // NotificationModule,
    // EventsModule,
    // ReportsModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
