import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

// Public schema entities
import { Hospital } from './entities/public/hospital.entity';
import { User } from './entities/public/user.entity';
import { Branch } from './entities/public/branch.entity';
import { DepartmentTemplate } from './entities/public/department-template.entity';
import { UserBranch } from './entities/public/user-branch.entity';
import { HospitalRole } from './entities/public/hospital-role.entity';

// Hospital schema entities
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

const entities = [
  // Public
  Hospital,
  User,
  Branch,
  DepartmentTemplate,
  UserBranch,
  HospitalRole,
  // Hospital schema
  Department,
  Doctor,
  Patient,
  Appointment,
  Prescription,
  Medicine,
  MedicineStock,
  Invoice,
  LabOrder,
  Notification,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('POSTGRESQL_DATABASE_URL'),
        entities,
        // migrations: [__dirname + '/migrations/**/*{.ts,.js}'], // TODO: enable after MVP
        synchronize: true,
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
