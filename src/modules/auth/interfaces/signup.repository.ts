export interface SignUpRepository {

  findUserByEmail: (email: string) => Promise<any>
  hashPassword: (password: string) => Promise<string>
  createUser: (name: string, email: string, password: string) => Promise<any>

}
