require('dotenv').config()

const Hapi = require('@hapi/hapi')

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      const response = h.response({
        error: false,
        message: 'Welcome Open Music API'
      })
      response.code(201)
      return response
    }
  })

  await server.start()
  console.log(`Server run at ${server.info.uri}`)
}

init()
