import { Result } from 'true-myth'
import type { AuthService, AuthServiceError } from './interface'
import type { User } from './types'
import { Logger } from '../logger'
import DoctorRepository from '../doctor/repository'
import { AuthRepository } from '.'
import PatientRepository from '../patient/repository'
import { verifyAccessToken } from './utils/token-utils'

class AuthServiceImpl implements AuthService {
  logger = Logger.getSubLogger({ name: 'AuthServiceImplLogger' })

  async getUserWithProfile(
    token: string
  ): Promise<Result<User, AuthServiceError>> {
    const jwtData = await verifyAccessToken(token)

    if (!jwtData) return Result.err('INVALID_OR_EXPIRED_TOKEN')

    const { userId } = jwtData

    const findUserResult = await AuthRepository.findUserById({ id: userId })

    if (findUserResult.isErr) return Result.err('FAILED_TO_FETCH_USER')

    const user = findUserResult.value

    if (!user) return Result.err('INVALID_OR_EXPIRED_TOKEN')

    if (!user.is_verified) return Result.err('USER_NOT_VERIFIED')

    const findPatientProfileResult = await PatientRepository.findByUserId(
      user.id
    )

    if (findPatientProfileResult.isErr)
      return Result.err('FAILED_TO_FETCH_USER')

    const patientProfile = findPatientProfileResult.value

    const findDoctorProfileResult = await DoctorRepository.findByUserId(user.id)
    if (findDoctorProfileResult.isErr) return Result.err('FAILED_TO_FETCH_USER')

    const doctorProfile = findDoctorProfileResult.value

    const profiles = {
      patient: patientProfile,
      doctor: doctorProfile
    }

    return Result.ok({
      data: user,
      profiles
    })
  }
}

export { AuthServiceImpl }
