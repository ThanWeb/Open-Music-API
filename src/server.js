require('dotenv').config()

const Jwt = require('@hapi/jwt')
const Hapi = require('@hapi/hapi')

const albums = require('./api/albums')
const AlbumsValidator = require('./validator/albums')
const AlbumsService = require('./services/AlbumsService')

const songs = require('./api/songs')
const SongsValidator = require('./validator/songs')
const SongsService = require('./services/SongsService')

const users = require('./api/users')
const UsersService = require('./services/UsersService')
const UsersValidator = require('./validator/users')

const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/AuthenticationsService')
const TokenManager = require('./token/TokenManager')
const AuthenticationsValidator = require('./validator/authentications')

const playlists = require('./api/playlists')
const PlaylistsService = require('./services/PlaylistsService')
const PlaylistsValidator = require('./validator/playlists')

const playlistSongs = require('./api/playlistSongs')
const PlaylistSongsService = require('./services/PlaylistSongsService')
const PlaylistSongsValidator = require('./validator/playlistSongs')

const playlistSongActivities = require('./api/playlistSongActivities')
const PlaylistSongActivitiesService = require('./services/PlaylistSongActivitiesService')

const collaborations = require('./api/collaborations')
const CollaborationsService = require('./services/CollaborationsService')
const CollaborationsValidator = require('./validator/collaborations')

const ClientError = require('./exceptions/ClientError')

const init = async () => {
  const albumsService = new AlbumsService()
  const songsService = new SongsService()
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()
  const collaborationsService = new CollaborationsService()
  const playlistsService = new PlaylistsService(collaborationsService)
  const playlistSongsService = new PlaylistSongsService()
  const playlistSongActivitiesService = new PlaylistSongActivitiesService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: Jwt
    }
  ])

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register(require('@hapi/vision'))

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: './template'
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      return h.view('index')
    }
  })

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator
      }
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator
      }
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator
      }
    },
    {
      plugin: playlistSongs,
      options: {
        playlistSongsService,
        playlistsService,
        songsService,
        playlistSongActivitiesService,
        validator: PlaylistSongsValidator
      }
    },
    {
      plugin: playlistSongActivities,
      options: {
        playlistSongActivitiesService,
        playlistsService
      }
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator
      }
    }
  ])

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
