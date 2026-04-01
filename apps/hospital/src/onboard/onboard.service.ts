import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DepartmentTemplate, Hospital, User, UserRole } from '@app/database';
import { SupabaseAuthService } from '@app/supabase-auth';
import { OnboardHospitalDto, OnboardResponseDto } from './dto/onboard.dto';

@Injectable()
export class OnboardService {
  private readonly logger = new Logger(OnboardService.name);

  constructor(
    @InjectRepository(Hospital)
    private readonly hospitalRepo: Repository<Hospital>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(DepartmentTemplate)
    private readonly departmentTemplateRepo: Repository<DepartmentTemplate>,
    private readonly dataSource: DataSource,
    private readonly supabaseAuth: SupabaseAuthService,
  ) {}

  async onboard(dto: OnboardHospitalDto): Promise<OnboardResponseDto> {
    const {
      hospital: h,
      adminEmail,
      adminPassword,
      adminFirstName,
      adminLastName,
    } = dto;

    const slug = this.toSlug(h.name);

    // Pre-flight checks before touching any external state
    const existing = await this.hospitalRepo.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException(
        `A hospital named "${h.name}" is already registered.`,
      );
    }

    const existingUser = await this.userRepo.findOne({
      where: { email: adminEmail },
    });
    if (existingUser) {
      throw new ConflictException(
        'An account with this email is already registered.',
      );
    }

    // Load department templates seeded via migration
    const departmentTemplates = await this.departmentTemplateRepo.find({
      where: { isActive: true },
    });

    // Step 1: Create the Supabase auth user (outside DB transaction)
    const authUser = await this.supabaseAuth.createUser(
      adminEmail,
      adminPassword,
      {
        first_name: adminFirstName,
        last_name: adminLastName,
        role: 'hospital_admin',
      },
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Step 2: Create hospital record
      const hospital = queryRunner.manager.create(Hospital, {
        name: h.name,
        slug,
        type: h.type,
        phone: h.phone,
        email: h.email,
        address: h.address,
        city: h.city,
        country: h.country,
        website: h.website ?? undefined,
      });
      const savedHospital = await queryRunner.manager.save(hospital);

      // Step 3: Create admin user record linked to the Supabase auth user
      const user = queryRunner.manager.create(User, {
        supabaseId: authUser.id,
        email: adminEmail,
        firstName: adminFirstName,
        lastName: adminLastName,
        role: UserRole.HOSPITAL_ADMIN,
        tenantId: savedHospital.id,
      });
      await queryRunner.manager.save(user);

      // Step 4: Create tenant schema
      const schemaName = `tenant_${savedHospital.id}`;
      await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

      // Step 5: Create departments table in tenant schema
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "${schemaName}".departments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR NOT NULL,
          description VARCHAR,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        )
      `);

      // Step 6: Seed departments from migration-seeded templates
      for (const dept of departmentTemplates) {
        await queryRunner.query(
          `INSERT INTO "${schemaName}".departments (name, description) VALUES ($1, $2)`,
          [dept.name, dept.description],
        );
      }

      await queryRunner.commitTransaction();

      this.logger.log(
        `Onboarded: "${h.name}" (${savedHospital.id}) — schema: ${schemaName}`,
      );

      return { hospitalId: savedHospital.id, slug };
    } catch (err) {
      await queryRunner.rollbackTransaction();

      // Compensate: remove the Supabase auth user so there is no orphaned account
      try {
        await this.supabaseAuth.deleteUser(authUser.id);
        this.logger.warn(
          `Compensated: deleted Supabase user ${authUser.id} after DB rollback`,
        );
      } catch (deleteErr) {
        this.logger.error(
          `Failed to delete Supabase user ${authUser.id} after DB rollback — manual cleanup needed`,
          deleteErr,
        );
      }

      this.logger.error('Onboarding failed, transaction rolled back', err);
      throw new InternalServerErrorException(
        'Onboarding failed. Please try again.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  private toSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
