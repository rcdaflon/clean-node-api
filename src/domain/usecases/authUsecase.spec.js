const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const generateParam = require('../../utils/helpers/generateParam')
const AuthUseCase = require('./authUsecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    password: 'hashed_password'
  }
  return loadUserByEmailRepositorySpy
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy)
  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy
  }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const generatedEmail = generateParam()
    await sut.auth(generatedEmail, generateParam())
    expect(loadUserByEmailRepositorySpy.email).toBe(generatedEmail)
  })

  test('Should throw if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth(generateParam(), generateParam())
    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
  })

  test('Should throw if LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth(generateParam(), generateParam())
    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
  })

  test('Should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth(generateParam(), generateParam())
    expect(accessToken).toBeNull()
  })

  test('Should return null if an invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const accessToken = await sut.auth(generateParam(), generateParam())
    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth(generateParam(), 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })
})
