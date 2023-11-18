const Joi = require('joi')

const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (request, h) => handler.postAuthenticationHandler(request, h),
    options: {
      tags: ['api'],
      description: 'Login',
      validate: {
        payload: Joi.object({
          username: 'username',
          password: 'secret'
        })
      },
      response: {
        status: {
          201: Joi.object({
            status: 'success',
            message: 'Authentication berhasil ditambahkan',
            data: {
              accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItWVRJVWU3NUJrT18xV0IweSIsImlhdCI6MTcwMDIwODA4Mn0.K6W4ZvKqKbNfwqAJA75hQtSJcuxLhzTrnREMLLF9t0E',
              refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItUU51ZzRtYmZ3UU50cjFndiIsImlhdCI6MTcwMDIwODA4NX0.Mv65VG7VWIpxG-pTvqLvKxHjDfzhKqYWfK7UbAPu15w'
            }
          })
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (request, h) => handler.putAuthenticationHandler(request, h),
    options: {
      tags: ['api'],
      description: 'Refresh Authentication',
      validate: {
        payload: Joi.object({
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItUU51ZzRtYmZ3UU50cjFndiIsImlhdCI6MTcwMDIwODA4NX0.Mv65VG7VWIpxG-pTvqLvKxHjDfzhKqYWfK7UbAPu15w'
        })
      },
      response: {
        status: {
          200: Joi.object({
            status: 'success',
            message: 'Access Token berhasil diperbarui',
            data: {
              accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItWVRJVWU3NUJrT18xV0IweSIsImlhdCI6MTcwMDIwODA4Mn0.K6W4ZvKqKbNfwqAJA75hQtSJcuxLhzTrnREMLLF9t0E'
            }
          })
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (request, h) => handler.deleteAuthenticationHandler(request, h),
    options: {
      tags: ['api'],
      description: 'Delete Authentication',
      validate: {
        payload: Joi.object({
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItUU51ZzRtYmZ3UU50cjFndiIsImlhdCI6MTcwMDIwODA4NX0.Mv65VG7VWIpxG-pTvqLvKxHjDfzhKqYWfK7UbAPu15w'
        })
      },
      response: {
        status: {
          200: Joi.object({
            status: 'success',
            message: 'Refresh token berhasil dihapus'
          })
        }
      }
    }
  }
]

module.exports = routes
