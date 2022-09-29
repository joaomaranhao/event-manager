import { SignInRepository } from '../interfaces/signinRepository'
import { SignInResponse } from '../interfaces/signinResponse'

export class SignInService {
  constructor (private signInRepository: SignInRepository) {}
  async execute (email: string, password: string): Promise<SignInResponse | null> {
    const user = await this.signInRepository.findUserByEmail(email)
    if (!user) {
      return new Promise((resolve, reject) => reject(new Error('Email not found')))
    }
    const isValidPassword = await this.signInRepository.comparePassword(password, user.password)
    if (!isValidPassword) {
      return new Promise((resolve, reject) => reject(new Error('Invalid credentials')))
    }
    const accessToken = await this.signInRepository.generateAccessToken(user.id)
    const refreshToken = await this.signInRepository.generateRefreshToken(user.id)
    return { accessToken, refreshToken }
  }
}
