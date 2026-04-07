import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

import { Hospital } from './entities/public/hospital.entity';
import { User } from './entities/public/user.entity';
import { Branch } from './entities/public/branch.entity';
import { DepartmentTemplate } from './entities/public/department-template.entity';
import { UserBranch } from './entities/public/user-branch.entity';
import { HospitalRole } from './entities/public/hospital-role.entity';
import { Department } from './entities/hospital/department.entity';
import { Doctor } from './entities/hospital/doctor.entity';
import { Patient } from './entities/hospital/patient.entity';
import { Appointment } from './entities/hospital/appointment.entity';
import { Prescription } from './entities/hospital/prescription.entity';
import { Medicine } from './entities/hospital/medicine.entity';
import { MedicineStock } from './entities/hospital/medicine-stock.entity';
import { Invoice } from './entities/hospital/invoice.entity';
import { LabOrder } from './entities/hospital/lab-order.entity';
import { Notification } from './entities/hospital/notification.entity';

@Injectable()
export class DatabaseService {
  constructor(public readonly dataSource: DataSource) {}

  private repo<T extends ObjectLiteral>(
    target: EntityTarget<T>,
  ): Repository<T> {
    return this.dataSource.getRepository(target);
  }

  // ─── Public schema ────────────────────────────────────────────────────────

  get hospitalRepo(): Repository<Hospital> {
    return this.repo(Hospital);
  }

  get userRepo(): Repository<User> {
    return this.repo(User);
  }

  get branchRepo(): Repository<Branch> {
    return this.repo(Branch);
  }

  get departmentTemplateRepo(): Repository<DepartmentTemplate> {
    return this.repo(DepartmentTemplate);
  }

  get userBranchRepo(): Repository<UserBranch> {
    return this.repo(UserBranch);
  }

  get hospitalRoleRepo(): Repository<HospitalRole> {
    return this.repo(HospitalRole);
  }

  // ─── Hospital schema ──────────────────────────────────────────────────────

  get departmentRepo(): Repository<Department> {
    return this.repo(Department);
  }

  get doctorRepo(): Repository<Doctor> {
    return this.repo(Doctor);
  }

  get patientRepo(): Repository<Patient> {
    return this.repo(Patient);
  }

  get appointmentRepo(): Repository<Appointment> {
    return this.repo(Appointment);
  }

  get prescriptionRepo(): Repository<Prescription> {
    return this.repo(Prescription);
  }

  get medicineRepo(): Repository<Medicine> {
    return this.repo(Medicine);
  }

  get medicineStockRepo(): Repository<MedicineStock> {
    return this.repo(MedicineStock);
  }

  get invoiceRepo(): Repository<Invoice> {
    return this.repo(Invoice);
  }

  get labOrderRepo(): Repository<LabOrder> {
    return this.repo(LabOrder);
  }

  get notificationRepo(): Repository<Notification> {
    return this.repo(Notification);
  }
}
