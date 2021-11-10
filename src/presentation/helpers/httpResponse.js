const UnauthorizedError = require('./unauthorizedError')
const ServerError = require('./serverError')

module.exports = class HttpResponse {
  static badRequest (err) {
    return {
      statusCode: 400,
      body: err
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static ok (data) {
    return {
      statusCode: 200,
      body: data
    }
  }
}
