import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DatabaseService, Hospital, User, UserRole } from '@app/database';
import { ExceptionService, PaginationDto } from '@app/common';
import { SupabaseAuthService } from '@app/supabase-auth';
import {
  CreateHospitalDto,
  FindHospitalsFilterDto,
  SetupSuperAdminDto,
  UpdateHospitalDto,
} from './dto/admin.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly exception: ExceptionService,
    private readonly supabaseAuth: SupabaseAuthService,
  ) {}

  // ─── Setup ────────────────────────────────────────────────────────────────

  async setupSuperAdmin(dto: SetupSuperAdminDto): Promise<{ message: string }> {
    const expectedKey = process.env.ONBOARD_SECRET_KEY;
    if (!expectedKey || dto.setupKey !== expectedKey) {
      this.exception.exception(HttpStatus.FORBIDDEN, 'Invalid setup key.');
    }

    const existing = await this.db.userRepo.findOne({
      where: { role: UserRole.SUPER_ADMIN },
    });
    if (existing) {
      this.exception.exception(
        HttpStatus.CONFLICT,
        'A super admin account already exists.',
      );
    }

    const existingEmail = await this.db.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      this.exception.exception(
        HttpStatus.CONFLICT,
        'An account with this email already exists.',
      );
    }

    const authUser = await this.supabaseAuth.createUser(
      dto.email,
      dto.password,
      {
        first_name: dto.firstName,
        last_name: dto.lastName,
        role: 'super_admin',
      },
    );

    try {
      await this.db.userRepo.save(
        this.db.userRepo.create({
          supabaseId: authUser.id,
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: UserRole.SUPER_ADMIN,
          isActive: true,
        }),
      );
    } catch (err) {
      try {
        await this.supabaseAuth.deleteUser(authUser.id);
      } catch (deleteErr) {
        this.logger.error(
          `Failed to delete Supabase user ${authUser.id} after DB error`,
          deleteErr,
        );
      }
      this.logger.error('Failed to create super admin user record', err);
      this.exception.exception(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Setup failed. Please try again.',
      );
    }

    this.logger.log(`Super admin created: ${dto.email}`);
    return { message: 'Super admin account created successfully.' };
  }

  // ─── Hospitals ────────────────────────────────────────────────────────────

  async createHospital(
    dto: CreateHospitalDto,
  ): Promise<{ hospitalId: string; slug: string }> {
    const {
      hospital: h,
      adminEmail,
      adminPassword,
      adminFirstName,
      adminLastName,
    } = dto;
    const slug = this.toSlug(h.name);

    if (await this.db.hospitalRepo.findOne({ where: { slug } })) {
      this.exception.exception(
        HttpStatus.CONFLICT,
        `A hospital named "${h.name}" is already registered.`,
      );
    }
    if (await this.db.userRepo.findOne({ where: { email: adminEmail } })) {
      this.exception.exception(
        HttpStatus.CONFLICT,
        'An account with this email is already registered.',
      );
    }

    const authUser = await this.supabaseAuth.createUser(
      adminEmail,
      adminPassword,
      {
        first_name: adminFirstName,
        last_name: adminLastName,
        role: 'hospital_admin',
      },
    );

    const queryRunner = this.db.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedHospital = await queryRunner.manager.save(
        queryRunner.manager.create(Hospital, {
          name: h.name,
          slug,
          type: h.type ?? undefined,
          phone: h.phone ?? undefined,
          email: h.email ?? undefined,
          address: h.address ?? undefined,
          city: h.city ?? undefined,
          country: h.country ?? undefined,
          website: h.website ?? undefined,
          status: 1, // active
        }),
      );

      await queryRunner.manager.save(
        queryRunner.manager.create(User, {
          supabaseId: authUser.id,
          email: adminEmail,
          firstName: adminFirstName,
          lastName: adminLastName,
          role: UserRole.HOSPITAL_ADMIN,
          tenantId: savedHospital.id,
          isActive: true,
        }),
      );

      await this.supabaseAuth.updateUserMetadata(authUser.id, {
        tenant_id: savedHospital.id,
      });

      await queryRunner.commitTransaction();
      this.logger.log(`Hospital created: "${h.name}" (${savedHospital.id})`);
      return { hospitalId: savedHospital.id, slug };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      try {
        await this.supabaseAuth.deleteUser(authUser.id);
      } catch (deleteErr) {
        this.logger.error(
          `Failed to delete Supabase user ${authUser.id} after rollback`,
          deleteErr,
        );
      }
      this.logger.error('Hospital creation failed', err);
      this.exception.exception(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Hospital creation failed. Please try again.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  findAllHospitals(
    filterDto: FindHospitalsFilterDto,
    pagination: PaginationDto,
  ): Promise<[Hospital[], number]> {
    const query = this.db.hospitalRepo
      .createQueryBuilder('hospital')
      .where(
        filterDto.status !== undefined ? 'hospital.status = :status' : '1=1',
        { status: filterDto.status },
      )
      .orderBy('hospital.createdAt', 'DESC');

    if (pagination.page !== -1) {
      query.skip(pagination.skip).take(pagination.limit);
    }

    return query.getManyAndCount();
  }

  async getStatusCounts(): Promise<{
    activeCount: number;
    inactiveCount: number;
  }> {
    const [activeCount, inactiveCount] = await Promise.all([
      this.db.hospitalRepo.count({ where: { status: 1 } }),
      this.db.hospitalRepo.count({ where: { status: 0 } }),
    ]);
    return { activeCount, inactiveCount };
  }

  async updateHospital(id: string, dto: UpdateHospitalDto): Promise<Hospital> {
    const hospital = await this.db.hospitalRepo.findOne({ where: { id } });
    if (!hospital)
      this.exception.exception(HttpStatus.NOT_FOUND, 'Hospital not found.');

    if (dto.name && dto.name !== hospital.name) {
      const slug = this.toSlug(dto.name);
      const conflict = await this.db.hospitalRepo.findOne({ where: { slug } });
      if (conflict && conflict.id !== id) {
        this.exception.exception(
          HttpStatus.CONFLICT,
          `A hospital named "${dto.name}" already exists.`,
        );
      }
      hospital.slug = slug;
    }

    Object.assign(hospital, dto);
    return this.db.hospitalRepo.save(hospital);
  }

  async updateHospitalStatus(id: string, status: number): Promise<Hospital> {
    const hospital = await this.db.hospitalRepo.findOne({ where: { id } });
    if (!hospital)
      this.exception.exception(HttpStatus.NOT_FOUND, 'Hospital not found.');
    hospital.status = status;
    return await this.db.hospitalRepo.save(hospital!);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private toSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
