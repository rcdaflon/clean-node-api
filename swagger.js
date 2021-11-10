const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./server/route/*.js']

swaggerAutogen(outputFile, endpointsFiles)
