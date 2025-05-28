import type {
  User as DbUser,
  DoctorProfile,
  PatientProfile
} from '../database/schema'

export type User = {
  data: DbUser
  profiles: {
    doctor: DoctorProfile | null
    patient: PatientProfile | null
  }
}
