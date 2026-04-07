export * from './database.module';
export * from './database.service';
export * from './entities/base.entity';

// Public schema — global/system entities
export * from './entities/public/hospital.entity';
export * from './entities/public/user.entity';
export * from './entities/public/branch.entity';
export * from './entities/public/department-template.entity';
export * from './entities/public/user-branch.entity';
export * from './entities/public/hospital-role.entity';

// Hospital schema — clinical/domain entities
export * from './entities/hospital/department.entity';
export * from './entities/hospital/doctor.entity';
export * from './entities/hospital/patient.entity';
export * from './entities/hospital/appointment.entity';
export * from './entities/hospital/prescription.entity';
export * from './entities/hospital/medicine.entity';
export * from './entities/hospital/medicine-stock.entity';
export * from './entities/hospital/invoice.entity';
export * from './entities/hospital/lab-order.entity';
export * from './entities/hospital/notification.entity';
