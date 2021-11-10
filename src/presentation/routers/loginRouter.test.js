/* globals describe, test, expect */
const generate = require('../helpers/generateParam')
const LoginRouter = require('./loginRouter')
const MissingParamError = require('../helpers/missingParamError')

describe('Login Router', () => {
  test('Should return 400 if no email was provided', () => {
    const sut = new LoginRouter() // sut === system under test
    const httpRequest = {
      body: {
        password: generate()
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password was provided', () => {
    const sut = new LoginRouter() // sut === system under test
    const httpRequest = {
      body: {
        email: generate()
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 500 if no httpRequest was provided', () => {
    const sut = new LoginRouter() // sut === system under test
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if httpRequest has no body', () => {
    const sut = new LoginRouter() // sut === system under test
    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })
})
