import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '@app/database';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
  ) {}

  async findAll(hospitalId: string): Promise<Branch[]> {
    return this.branchRepo.find({
      where: { hospitalId },
      order: { isMainBranch: 'DESC', createdAt: 'ASC' },
    });
  }

  async findOne(hospitalId: string, id: string): Promise<Branch> {
    const branch = await this.branchRepo.findOne({ where: { id, hospitalId } });
    if (!branch) throw new NotFoundException('Branch not found.');
    return branch;
  }

  async create(hospitalId: string, dto: CreateBranchDto): Promise<Branch> {
    // If this branch is marked as main, unset existing main branch first
    if (dto.isMainBranch) {
      await this.branchRepo.update({ hospitalId, isMainBranch: true }, { isMainBranch: false });
    }

    const branch = this.branchRepo.create({ ...dto, hospitalId });
    return this.branchRepo.save(branch);
  }

  async update(hospitalId: string, id: string, dto: UpdateBranchDto): Promise<Branch> {
    const branch = await this.findOne(hospitalId, id);

    // If promoting this branch to main, demote others first
    if (dto.isMainBranch && !branch.isMainBranch) {
      await this.branchRepo.update({ hospitalId, isMainBranch: true }, { isMainBranch: false });
    }

    Object.assign(branch, dto);
    return this.branchRepo.save(branch);
  }

  async remove(hospitalId: string, id: string): Promise<void> {
    const branch = await this.findOne(hospitalId, id);
    if (branch.isMainBranch) {
      throw new BadRequestException('Cannot delete the main branch. Set another branch as main first.');
    }
    await this.branchRepo.remove(branch);
  }
}
