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
    }
  }
