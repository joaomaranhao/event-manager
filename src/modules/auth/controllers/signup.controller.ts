import { EmailValidator } from '../../../interfaces/emailValidator'
import { HttpRequest } from '../../../interfaces/http'
import { SignUpService } from '../services/signup.service'

export class SignUpController {
  constructor (
    private emailValidator: EmailValidator,
    private signUpService: SignUpService
  ) {}

  async handle (httpRequest: HttpRequest): Promise<any> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return {
            statusCode: 400,
            body: new Error(`Missing param: ${field}`)
          }
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return {
          statusCode: 400,
          body: new Error('Invalid param: passwordConfirmation')
        }
      }
      const isValid = await this.emailValidator.isValid(email)
      if (!isValid) {
        return {
          statusCode: 400,
          body: new Error('Invalid param: email')
        }
      }

      const user = await this.signUpService.execute(name, email, password)

      if (user) {
        return {
          statusCode: 201,
          body: user
        }
      } else {
        return {
          statusCode: 403,
          body: new Error('Email already in use')
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new Error('Internal server error')
      }
    }
  }
}
