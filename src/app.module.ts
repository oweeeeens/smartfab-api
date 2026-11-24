import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './database/entities.js';
import { CheckConstraintsService } from './database/check-constraints.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { MachinesModule } from './machines/machines.module.js';
import { MaintenanceRequestsModule } from './maintenance-requests/maintenance-requests.module.js';
import { PartUsagesModule } from './part-usages/part-usages.module.js';
import { SparePartsModule } from './spare-parts/spare-parts.module.js';
import { ProductionLogsModule } from './production-logs/production-logs.module.js';

@Module({
  imports: [
    // Loads variables from .env and makes ConfigService available everywhere
    ConfigModule.forRoot({ isGlobal: true }),

    // MySQL connection through TypeORM, configured from environment variables
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 3306)),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'smartfab'),
        entities,
        synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
      }),
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    MachinesModule,
    MaintenanceRequestsModule,
    PartUsagesModule,
    SparePartsModule,
    ProductionLogsModule,
  ],
  providers: [CheckConstraintsService],
})
export class AppModule {}
