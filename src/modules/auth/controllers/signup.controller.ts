import { EmailValidator } from '../../../interfaces/emailValidator'
import { HttpRequest } from '../../../interfaces/http'

export class SignUpController {
  constructor (private emailValidator: EmailValidator) {}

  async handle (httpRequest: HttpRequest): Promise<any> {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return {
          statusCode: 400,
          body: new Error(`Missing param: ${field}`)
        }
      }
    }

    const { email, password, passwordConfirmation } = httpRequest.body
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
  }
}
