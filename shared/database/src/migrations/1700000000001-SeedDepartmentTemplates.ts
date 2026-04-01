import { MigrationInterface, QueryRunner } from 'typeorm';

const DEFAULT_DEPARTMENTS = [
  { name: 'General Medicine', description: 'General outpatient and inpatient care' },
  { name: 'Emergency', description: '24/7 emergency medical services' },
  { name: 'Surgery', description: 'Surgical procedures and post-operative care' },
  { name: 'Pediatrics', description: 'Medical care for infants, children and adolescents' },
  { name: 'Obstetrics & Gynecology', description: "Women's health and maternity care" },
  { name: 'Cardiology', description: 'Heart and cardiovascular system care' },
  { name: 'Orthopedics', description: 'Bone, joint and musculoskeletal care' },
  { name: 'Radiology', description: 'Medical imaging and diagnostics' },
  { name: 'Pharmacy', description: 'Medication dispensing and management' },
  { name: 'Laboratory', description: 'Diagnostic laboratory services' },
];

export class SeedDepartmentTemplates1700000000001 implements MigrationInterface {
  name = 'SeedDepartmentTemplates1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const dept of DEFAULT_DEPARTMENTS) {
      await queryRunner.query(
        `INSERT INTO "department_templates" ("name", "description") VALUES ($1, $2)`,
        [dept.name, dept.description],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "department_templates"`);
  }
}
