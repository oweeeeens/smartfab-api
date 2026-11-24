import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

/**
 * TypeORM does not create CHECK constraints for MySQL/MariaDB during synchronize.
 * This service reads the @Check(...) definitions declared on each entity and
 * adds any that are missing, so the database enforces the same rules as the
 * Lab 04 Data Dictionary (e.g. QuantityOnHand >= 0, Role IN (...)).
 */
@Injectable()
export class CheckConstraintsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CheckConstraintsService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    if (this.config.get<string>('DB_SYNCHRONIZE') !== 'true') return;
    await applyCheckConstraints(this.dataSource, this.logger);
  }
}

export async function applyCheckConstraints(
  dataSource: DataSource,
  logger?: Logger,
) {
  const existing: { CONSTRAINT_NAME: string }[] = await dataSource.query(
    'SELECT CONSTRAINT_NAME FROM information_schema.CHECK_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE()',
  );
  const existingNames = new Set(existing.map((row) => row.CONSTRAINT_NAME));

  for (const metadata of dataSource.entityMetadatas) {
    for (const check of metadata.checks) {
      if (!check.name || existingNames.has(check.name)) continue;
      await dataSource.query(
        `ALTER TABLE \`${metadata.tableName}\` ADD CONSTRAINT \`${check.name}\` CHECK (${check.expression})`,
      );
      logger?.log(
        `Added CHECK constraint ${check.name} on ${metadata.tableName}`,
      );
    }
  }
}
