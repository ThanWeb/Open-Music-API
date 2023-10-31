require('dotenv').config()

const albums = require('./api/albums')
const AlbumsValidator = require('./validator/albums')
const AlbumsService = require('./services/AlbumsService')

const songs = require('./api/songs')
const SongsValidator = require('./validator/songs')
const SongsService = require('./services/SongsService')

const ClientError = require('./exceptions/ClientError')

const Hapi = require('@hapi/hapi')

const init = async () => {
  const albumsService = new AlbumsService()
  const songsService = new SongsService()

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
        status: 'success',
        message: 'Welcome to Open Music API'
      })
      response.code(201)
      return response
    }
  })

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator
    }
  })

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator
    }
  })

  server.ext('onPreResponse', (request, h) => {
    const { response } = request
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })

        newResponse.code(response.statusCode)
        return newResponse
      }

      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      })

      newResponse.code(500)
      return newResponse
    }

    return h.continue
  })

  await server.start()
  console.log(`Server run at ${server.info.uri}`)
}

init()
