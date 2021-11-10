module.exports = class unauthorizedError extends Error {
  constructor (paramName) {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}
