import { HttpRequest } from '../../../interfaces/http'
import { SignInService } from '../services/signin.service'

export class SignInController {
  constructor (
    private signInService: SignInService
  ) {}

  async handle (httpRequest: HttpRequest): Promise<any> {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return {
            statusCode: 400,
            body: new Error(`Missing param: ${field}`)
          }
        }
      }
      const { email, password } = httpRequest.body

      const credentials = await this.signInService.execute(email, password)

      if (credentials) {
        const { accessToken, refreshToken } = credentials
        return {
          statusCode: 200,
          body: {
            accessToken,
            refreshToken
          }
        }
      } else {
        return {
          statusCode: 401,
          body: new Error('Unauthorized')
        }
      }
    }
  }
