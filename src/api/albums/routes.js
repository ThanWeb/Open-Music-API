const Joi = require('joi')

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.postAlbumHandler(request, h),
    options: {
      tags: ['api'],
      description: 'Create new album',
      validate: {
        payload: Joi.object({
          name: 'Album Vol. 1',
          year: 2023
        })
      },
      response: {
        status: {
          201: Joi.object({
            status: 'success',
            message: 'Album berhasil ditambahkan',
            data: {
              albumId: 'album-cWYRIyDB3GQ4gr7Y'
            }
          })
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (request, h) => handler.getAlbumByIdHandler(request, h),
    options: {
      tags: ['api'],
      description: 'Read single album',
      validate: {
        params: Joi.object({
          id: Joi.string()
        })
      },
      response: {
        status: {
          200: Joi.object({
            status: 'success',
            data: {
              album: {
                id: 'album-cWYRIyDB3GQ4gr7Y',
                name: 'Album Vol. 1',
                year: 2023,
                songs: Joi.array().items(
                  Joi.object({
                    id: 'song-pphYSao120Aacz0p',
                    title: 'Song Number One',
                    performer: 'Just A Band'
                  })
                )
              }
            }
          })
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request, h) => handler.putAlbumByIdHandler(request, h),
    options: {
      tags: ['api'],
      description: 'Edit existing album',
      validate: {
        params: Joi.object({
          id: Joi.string()
        }),
        payload: Joi.object({
          name: 'Album Vol. 1 Revision',
          year: 2022
        })
      },
      response: {
        status: {
          200: Joi.object({
            status: 'success',
            message: 'Album berhasil diperbarui'
          })
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (request, h) => handler.deleteAlbumByIdHandler(request, h),
    options: {
      tags: ['api'],
      description: 'Delete existing album',
      validate: {
        params: Joi.object({
          id: Joi.string()
        })
      },
      response: {
        status: {
          200: Joi.object({
            status: 'success',
            message: 'Album berhasil dihapus'
          })
        }
      }
    }
  }
]

module.exports = routes
