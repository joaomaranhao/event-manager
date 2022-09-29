import { SignInService } from '../services/signin.service'
import { SignInController } from './signin.controller'

type SignInResponse = {
  accessToken: string
  refreshToken: string
}

class SignInServiceStub implements SignInService {
  async signIn (email: string, password: string): Promise<SignInResponse> {
    return new Promise(resolve => resolve({
      accessToken: 'any_token',
      refreshToken: 'any_refresh_token'
    }))
  }
}

type SutTypes = {
  sut: SignInController
  signInServiceStub: SignInServiceStub
}

const makeSut = (): SutTypes => {
  const signInServiceStub = new SignInServiceStub()
  const sut = new SignInController(signInServiceStub)
  return {
    sut,
    signInServiceStub
  }
}

describe('SignInController', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: email'))
  })
})
