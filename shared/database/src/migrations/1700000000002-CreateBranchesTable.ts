import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBranchesTable1700000000002 implements MigrationInterface {
  name = 'CreateBranchesTable1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "branches" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "hospitalId" VARCHAR NOT NULL,
        "name" VARCHAR NOT NULL,
        "address" VARCHAR,
        "city" VARCHAR,
        "phone" VARCHAR,
        "email" VARCHAR,
        "isMainBranch" BOOLEAN NOT NULL DEFAULT false,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_branches_hospitalId" ON "branches" ("hospitalId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_branches_hospitalId"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "branches"`);
  }
}
