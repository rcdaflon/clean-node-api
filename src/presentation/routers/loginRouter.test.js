/* globals describe, test, expect */
const crypto = require('crypto')

const generate = function () {
  return crypto.randomBytes(8).toString('hex')
}

class LoginRouter {
  route (httpRequest) {
    if (!httpRequest.body.email || !httpRequest.body.password) {
      return {
        statusCode: 400
      }
    }
  }
}

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
})