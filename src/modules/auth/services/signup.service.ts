import { SignUpRepository } from '../interfaces/signup.repository'

export class SignUpService {
  constructor (private signUpRepository: SignUpRepository) {}

  async execute (name: string, email: string, password: string): Promise<any> {
    const user = await this.signUpRepository.findUserByEmail(email)
    if (user) {
      return new Promise((resolve, reject) => reject(new Error('Email already in use')))
    }
    const hashedPassword = await this.signUpRepository.hashPassword(password)

    const newUser = await this.signUpRepository.createUser(name, email, hashedPassword)
    const { id, name: userName, email: userEmail } = newUser
    return { id, name: userName, email: userEmail }
  }
}
