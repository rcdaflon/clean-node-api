const HttpResponse = require('../helpers/httpResponse')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest('email')
      }
      if (!password) {
        return HttpResponse.badRequest('password')
      }
      const accessToken = await this.authUseCase.auth(email, password)
      if (!accessToken) {
        return HttpResponse.unauthorizedError()
      }
      return HttpResponse.ok({ accessToken })
    } catch (err) {
      return HttpResponse.serverError()
    }
  }
}
