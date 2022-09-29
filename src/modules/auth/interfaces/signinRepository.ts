export interface SignInRepository {
  findUserByEmail: (email: string) => Promise<any>
  comparePassword: (password: string, hashedPassword: string) => Promise<boolean>
  generateAccessToken: (userId: string) => Promise<string>
  generateRefreshToken: (userId: string) => Promise<string>
}
