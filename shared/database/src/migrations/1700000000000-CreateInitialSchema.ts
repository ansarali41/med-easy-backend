import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1700000000000 implements MigrationInterface {
  name = 'CreateInitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // ─── Enums ────────────────────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TYPE "public"."users_role_enum" AS ENUM(
        'super_admin',
        'hospital_admin',
        'doctor',
        'nurse',
        'receptionist',
        'pharmacist',
        'lab_technician',
        'patient'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."appointments_status_enum" AS ENUM(
        'pending',
        'confirmed',
        'in_progress',
        'completed',
        'cancelled',
        'no_show'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."prescriptions_status_enum" AS ENUM(
        'draft',
        'finalized',
        'dispensed',
        'cancelled'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."invoices_status_enum" AS ENUM(
        'pending',
        'paid',
        'partial',
        'cancelled'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."lab_orders_status_enum" AS ENUM(
        'pending',
        'in_progress',
        'completed',
        'cancelled'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."notifications_type_enum" AS ENUM(
        'email',
        'in_app',
        'sms'
      )
    `);

    // ─── Tables ───────────────────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE "hospitals" (
        "id"        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        "name"      VARCHAR     NOT NULL,
        "slug"      VARCHAR     NOT NULL UNIQUE,
        "type"      VARCHAR,
        "phone"     VARCHAR,
        "email"     VARCHAR,
        "address"   VARCHAR,
        "city"      VARCHAR,
        "country"   VARCHAR,
        "website"   VARCHAR,
        "isActive"  BOOLEAN     NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP   NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP   NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"          UUID                      PRIMARY KEY DEFAULT gen_random_uuid(),
        "supabaseId"  VARCHAR                   NOT NULL UNIQUE,
        "email"       VARCHAR                   NOT NULL,
        "firstName"   VARCHAR,
        "lastName"    VARCHAR,
        "role"        "public"."users_role_enum" NOT NULL DEFAULT 'patient',
        "tenantId"    VARCHAR,
        "isActive"    BOOLEAN                   NOT NULL DEFAULT true,
        "createdAt"   TIMESTAMP                 NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP                 NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "doctors" (
        "id"              UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId"          VARCHAR   NOT NULL,
        "firstName"       VARCHAR   NOT NULL,
        "lastName"        VARCHAR   NOT NULL,
        "email"           VARCHAR   NOT NULL UNIQUE,
        "phone"           VARCHAR,
        "specialization"  VARCHAR,
        "departmentId"    VARCHAR,
        "licenseNumber"   VARCHAR,
        "isActive"        BOOLEAN   NOT NULL DEFAULT true,
        "createdAt"       TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"       TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "patients" (
        "id"          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId"      VARCHAR   NOT NULL,
        "firstName"   VARCHAR   NOT NULL,
        "lastName"    VARCHAR   NOT NULL,
        "email"       VARCHAR   NOT NULL UNIQUE,
        "phone"       VARCHAR,
        "dateOfBirth" DATE,
        "gender"      VARCHAR,
        "address"     VARCHAR,
        "bloodGroup"  VARCHAR,
        "isActive"    BOOLEAN   NOT NULL DEFAULT true,
        "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "departments" (
        "id"          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
        "name"        VARCHAR   NOT NULL,
        "description" VARCHAR,
        "isActive"    BOOLEAN   NOT NULL DEFAULT true,
        "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "department_templates" (
        "id"          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
        "name"        VARCHAR   NOT NULL,
        "description" VARCHAR,
        "isActive"    BOOLEAN   NOT NULL DEFAULT true,
        "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "appointments" (
        "id"            UUID                               PRIMARY KEY DEFAULT gen_random_uuid(),
        "patientId"     VARCHAR                            NOT NULL,
        "doctorId"      VARCHAR                            NOT NULL,
        "departmentId"  VARCHAR,
        "scheduledAt"   TIMESTAMP                          NOT NULL,
        "status"        "public"."appointments_status_enum" NOT NULL DEFAULT 'pending',
        "notes"         VARCHAR,
        "cancelReason"  VARCHAR,
        "queuePosition" INTEGER,
        "createdAt"     TIMESTAMP                          NOT NULL DEFAULT now(),
        "updatedAt"     TIMESTAMP                          NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "prescriptions" (
        "id"            UUID                                PRIMARY KEY DEFAULT gen_random_uuid(),
        "patientId"     VARCHAR                             NOT NULL,
        "doctorId"      VARCHAR                             NOT NULL,
        "appointmentId" VARCHAR,
        "status"        "public"."prescriptions_status_enum" NOT NULL DEFAULT 'draft',
        "notes"         VARCHAR,
        "pdfUrl"        VARCHAR,
        "createdAt"     TIMESTAMP                           NOT NULL DEFAULT now(),
        "updatedAt"     TIMESTAMP                           NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "medicines" (
        "id"          UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
        "name"        VARCHAR          NOT NULL,
        "genericName" VARCHAR,
        "category"    VARCHAR,
        "unit"        VARCHAR,
        "price"       DECIMAL(10, 2)   NOT NULL DEFAULT 0,
        "isActive"    BOOLEAN          NOT NULL DEFAULT true,
        "createdAt"   TIMESTAMP        NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP        NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "medicine_stocks" (
        "id"                UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
        "medicineId"        VARCHAR   NOT NULL,
        "quantity"          INTEGER   NOT NULL DEFAULT 0,
        "lowStockThreshold" INTEGER   NOT NULL DEFAULT 10,
        "batchNumber"       VARCHAR,
        "expiryDate"        DATE,
        "createdAt"         TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"         TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "invoices" (
        "id"            UUID                           PRIMARY KEY DEFAULT gen_random_uuid(),
        "patientId"     VARCHAR                        NOT NULL,
        "appointmentId" VARCHAR,
        "totalAmount"   DECIMAL(10, 2)                 NOT NULL DEFAULT 0,
        "paidAmount"    DECIMAL(10, 2)                 NOT NULL DEFAULT 0,
        "status"        "public"."invoices_status_enum" NOT NULL DEFAULT 'pending',
        "notes"         VARCHAR,
        "createdAt"     TIMESTAMP                      NOT NULL DEFAULT now(),
        "updatedAt"     TIMESTAMP                      NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "lab_orders" (
        "id"            UUID                              PRIMARY KEY DEFAULT gen_random_uuid(),
        "patientId"     VARCHAR                           NOT NULL,
        "doctorId"      VARCHAR                           NOT NULL,
        "appointmentId" VARCHAR,
        "testName"      VARCHAR                           NOT NULL,
        "status"        "public"."lab_orders_status_enum" NOT NULL DEFAULT 'pending',
        "notes"         VARCHAR,
        "createdAt"     TIMESTAMP                         NOT NULL DEFAULT now(),
        "updatedAt"     TIMESTAMP                         NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id"        UUID                                  PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId"    VARCHAR                               NOT NULL,
        "title"     VARCHAR                               NOT NULL,
        "message"   TEXT                                  NOT NULL,
        "type"      "public"."notifications_type_enum"    NOT NULL DEFAULT 'in_app',
        "isRead"    BOOLEAN                               NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP                             NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "lab_orders"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "invoices"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "medicine_stocks"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "medicines"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "prescriptions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "appointments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "department_templates"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "departments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "patients"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "doctors"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "hospitals"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."notifications_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."lab_orders_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."invoices_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."prescriptions_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."appointments_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_role_enum"`);
  }
}
