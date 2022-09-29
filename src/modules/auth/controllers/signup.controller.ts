export class SignUpController {
  handle (httpRequest: any): any {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return {
          statusCode: 400,
          body: new Error(`Missing param: ${field}`)
        }
      }
    }

    const { password, passwordConfirmation } = httpRequest.body
    if (password !== passwordConfirmation) {
      return {
        statusCode: 400,
        body: new Error('Invalid param: passwordConfirmation')
      }
    }
  }
}
