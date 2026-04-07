import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Branch,
  Hospital,
  HospitalRole,
  User,
  UserBranch,
  UserRole,
} from '@app/database';
import { SupabaseAuthService } from '@app/supabase-auth';
import {
  CreateBranchDto,
  CreateHospitalRoleDto,
  CreatePatientDto,
  CreateStaffDto,
  ToggleLoginDto,
  UpdateBranchDto,
  UpdateHospitalRoleDto,
} from './dto/hospital-admin.dto';

@Injectable()
export class HospitalAdminService {
  private readonly logger = new Logger(HospitalAdminService.name);

  constructor(
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(Hospital)
    private readonly hospitalRepo: Repository<Hospital>,
    @InjectRepository(HospitalRole)
    private readonly roleRepo: Repository<HospitalRole>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserBranch)
    private readonly userBranchRepo: Repository<UserBranch>,
    private readonly supabaseAuth: SupabaseAuthService,
  ) {}

  // ─── Branches ─────────────────────────────────────────────────────────────

  async getBranches(hospitalId: string): Promise<Branch[]> {
    return this.branchRepo.find({
      where: { hospitalId },
      order: { isMainBranch: 'DESC', createdAt: 'ASC' },
    });
  }

  async createBranch(hospitalId: string, dto: CreateBranchDto): Promise<Branch> {
    if (dto.isMainBranch) {
      await this.branchRepo.update({ hospitalId, isMainBranch: true }, { isMainBranch: false });
    }
    const branch = this.branchRepo.create({ ...dto, hospitalId });
    return this.branchRepo.save(branch);
  }

  async updateBranch(hospitalId: string, id: string, dto: UpdateBranchDto): Promise<Branch> {
    const branch = await this.branchRepo.findOne({ where: { id, hospitalId } });
    if (!branch) throw new NotFoundException('Branch not found.');

    if (dto.isMainBranch && !branch.isMainBranch) {
      await this.branchRepo.update({ hospitalId, isMainBranch: true }, { isMainBranch: false });
    }

    Object.assign(branch, dto);
    return this.branchRepo.save(branch);
  }

  async deleteBranch(hospitalId: string, id: string): Promise<void> {
    const branch = await this.branchRepo.findOne({ where: { id, hospitalId } });
    if (!branch) throw new NotFoundException('Branch not found.');
    if (branch.isMainBranch) {
      throw new BadRequestException('Cannot delete the main branch. Set another branch as main first.');
    }
    await this.branchRepo.remove(branch);
  }

  // ─── Custom Roles ─────────────────────────────────────────────────────────

  async getRoles(hospitalId: string): Promise<HospitalRole[]> {
    return this.roleRepo.find({
      where: { hospitalId, isActive: true },
      order: { createdAt: 'ASC' },
    });
  }

  async createRole(hospitalId: string, dto: CreateHospitalRoleDto): Promise<HospitalRole> {
    const role = this.roleRepo.create({ ...dto, hospitalId });
    return this.roleRepo.save(role);
  }

  async updateRole(hospitalId: string, id: string, dto: UpdateHospitalRoleDto): Promise<HospitalRole> {
    const role = await this.roleRepo.findOne({ where: { id, hospitalId } });
    if (!role) throw new NotFoundException('Role not found.');
    Object.assign(role, dto);
    return this.roleRepo.save(role);
  }

  async deleteRole(hospitalId: string, id: string): Promise<void> {
    const role = await this.roleRepo.findOne({ where: { id, hospitalId } });
    if (!role) throw new NotFoundException('Role not found.');
    role.isActive = false;
    await this.roleRepo.save(role);
  }

  // ─── Staff ────────────────────────────────────────────────────────────────

  async getStaff(hospitalId: string, branchId: string): Promise<User[]> {
    await this.validateBranch(hospitalId, branchId);
    const userBranches = await this.userBranchRepo.find({ where: { branchId, hospitalId } });
    if (!userBranches.length) return [];

    const userIds = userBranches.map((ub) => ub.userId);
    return this.userRepo
      .createQueryBuilder('u')
      .where('u.id IN (:...userIds)', { userIds })
      .andWhere('u.role != :patientRole', { patientRole: UserRole.PATIENT })
      .getMany();
  }

  async createStaff(hospitalId: string, branchId: string, dto: CreateStaffDto): Promise<User> {
    await this.validateBranch(hospitalId, branchId);

    const role = await this.roleRepo.findOne({ where: { id: dto.hospitalRoleId, hospitalId, isActive: true } });
    if (!role) throw new NotFoundException('Hospital role not found.');

    const loginEnabled = dto.canLogin !== false;

    if (loginEnabled) {
      if (!dto.email) throw new BadRequestException('Email is required when login is enabled.');
      if (!dto.password) throw new BadRequestException('Password is required when login is enabled.');
      const existing = await this.userRepo.findOne({ where: { email: dto.email } });
      if (existing) throw new ConflictException('An account with this email already exists.');
    }

    let supabaseId: string | null = null;

    if (loginEnabled) {
      const authUser = await this.supabaseAuth.createUser(dto.email!, dto.password!, {
        first_name: dto.firstName,
        last_name: dto.lastName,
        role: 'staff',
        hospital_role_id: dto.hospitalRoleId,
        tenant_id: hospitalId,
      });
      supabaseId = authUser.id;
    }

    try {
      const user = this.userRepo.create({
        supabaseId: supabaseId ?? undefined,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: UserRole.DOCTOR,
        tenantId: hospitalId,
        isActive: true,
        canLogin: loginEnabled,
      });
      const savedUser = await this.userRepo.save(user);

      const userBranch = this.userBranchRepo.create({ userId: savedUser.id, branchId, hospitalId });
      await this.userBranchRepo.save(userBranch);

      return savedUser;
    } catch (err) {
      if (supabaseId) {
        try {
          await this.supabaseAuth.deleteUser(supabaseId);
          this.logger.warn(`Compensated: deleted Supabase user ${supabaseId} after DB error`);
        } catch (deleteErr) {
          this.logger.error(`Failed to delete Supabase user ${supabaseId} after DB error`, deleteErr);
        }
      }
      this.logger.error('Staff creation failed', err);
      throw new InternalServerErrorException('Staff creation failed. Please try again.');
    }
  }

  // ─── Patients ─────────────────────────────────────────────────────────────

  async getPatients(hospitalId: string, branchId: string): Promise<User[]> {
    await this.validateBranch(hospitalId, branchId);
    const userBranches = await this.userBranchRepo.find({ where: { branchId, hospitalId } });
    if (!userBranches.length) return [];

    const userIds = userBranches.map((ub) => ub.userId);
    return this.userRepo
      .createQueryBuilder('u')
      .where('u.id IN (:...userIds)', { userIds })
      .andWhere('u.role = :patientRole', { patientRole: UserRole.PATIENT })
      .getMany();
  }

  async createPatient(hospitalId: string, branchId: string, dto: CreatePatientDto): Promise<User> {
    await this.validateBranch(hospitalId, branchId);

    const loginEnabled = dto.canLogin !== false;

    if (loginEnabled) {
      if (!dto.email) throw new BadRequestException('Email is required when login is enabled.');
      if (!dto.password) throw new BadRequestException('Password is required when login is enabled.');
      const existing = await this.userRepo.findOne({ where: { email: dto.email } });
      if (existing) throw new ConflictException('An account with this email already exists.');
    }

    let supabaseId: string | null = null;

    if (loginEnabled) {
      const authUser = await this.supabaseAuth.createUser(dto.email!, dto.password!, {
        first_name: dto.firstName,
        last_name: dto.lastName,
        role: 'patient',
        tenant_id: hospitalId,
      });
      supabaseId = authUser.id;
    }

    try {
      const user = this.userRepo.create({
        supabaseId: supabaseId ?? undefined,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: UserRole.PATIENT,
        tenantId: hospitalId,
        isActive: true,
        canLogin: loginEnabled,
      });
      const savedUser = await this.userRepo.save(user);

      const userBranch = this.userBranchRepo.create({ userId: savedUser.id, branchId, hospitalId });
      await this.userBranchRepo.save(userBranch);

      return savedUser;
    } catch (err) {
      if (supabaseId) {
        try {
          await this.supabaseAuth.deleteUser(supabaseId);
          this.logger.warn(`Compensated: deleted Supabase user ${supabaseId} after DB error`);
        } catch (deleteErr) {
          this.logger.error(`Failed to delete Supabase user ${supabaseId} after DB error`, deleteErr);
        }
      }
      this.logger.error('Patient creation failed', err);
      throw new InternalServerErrorException('Patient creation failed. Please try again.');
    }
  }

  // ─── Login Access ─────────────────────────────────────────────────────────

  async toggleLoginAccess(hospitalId: string, userId: string, dto: ToggleLoginDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId, tenantId: hospitalId } });
    if (!user) throw new NotFoundException('User not found.');

    if (dto.canLogin) {
      // Enabling login
      if (user.canLogin) throw new BadRequestException('Login is already enabled for this user.');
      if (!dto.password) throw new BadRequestException('Password is required to enable login.');

      const email = dto.email ?? user.email;
      if (!email) throw new BadRequestException('Email is required to enable login.');

      const authUser = await this.supabaseAuth.createUser(email, dto.password, {
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role,
        tenant_id: hospitalId,
      });

      user.supabaseId = authUser.id;
      user.email = email;
      user.canLogin = true;
    } else {
      // Disabling login
      if (!user.canLogin) throw new BadRequestException('Login is already disabled for this user.');

      if (user.supabaseId) {
        try {
          await this.supabaseAuth.deleteUser(user.supabaseId);
        } catch (err) {
          this.logger.warn(`Could not delete Supabase user ${user.supabaseId}: ${err}`);
        }
        user.supabaseId = null;
      }
      user.canLogin = false;
    }

    return this.userRepo.save(user);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async validateBranch(hospitalId: string, branchId: string): Promise<Branch> {
    const branch = await this.branchRepo.findOne({ where: { id: branchId, hospitalId } });
    if (!branch) throw new NotFoundException('Branch not found or does not belong to this hospital.');
    return branch;
  }
}
