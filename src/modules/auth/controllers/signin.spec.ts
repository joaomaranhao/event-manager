import { SignInRepository } from '../interfaces/signinRepository'
import { SignInService } from '../services/signin.service'
import { SignInController } from './signin.controller'

type SignInResponse = {
  accessToken: string
  refreshToken: string
}

class SignInRepositoryStub implements SignInRepository {
  async findUserByEmail (email: string): Promise<any> {
    return new Promise(resolve => resolve({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'hashed_password'
    }))
  }

  async comparePassword (password: string, hashedPassword: string): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }

  async generateAccessToken (userId: string): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  }

  async generateRefreshToken (userId: string): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  }
}

class SignInServiceStub extends SignInService {
  async execute (email: string, password: string): Promise<SignInResponse | null> {
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
  const signInRepositoryStub = new SignInRepositoryStub()
  const signInServiceStub = new SignInServiceStub(signInRepositoryStub)
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

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: password'))
  })

  it('should call SignInService with correct values', async () => {
    const { sut, signInServiceStub } = makeSut()
    const signInSpy = jest.spyOn(signInServiceStub, 'execute')
    const httpRequest = {
      body: {
        email: 'valid_mail@mail.com',
        password: 'valid_password'
      }
    }
    await sut.handle(httpRequest)
    expect(signInSpy).toHaveBeenCalledWith('valid_mail@mail.com', 'valid_password')
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, signInServiceStub } = makeSut()
    jest.spyOn(signInServiceStub, 'execute').mockResolvedValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest = {
      body: {
        email: 'incorrect_mail@mail.com',
        password: 'incorrect_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new Error('Unauthorized'))
  })

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'correct_mail@mail.com',
        password: 'correct_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      accessToken: 'any_token',
      refreshToken: 'any_refresh_token'
    })
  })
})
