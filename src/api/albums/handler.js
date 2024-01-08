class AlbumsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator
  }

  async postAlbumHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)

    const { name = 'Untitled', year = 2000 } = request.payload
    const albumId = await this._service.addAlbum({ name, year })

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId
      }
    })

    response.code(201)
    return response
  }

  async getAlbumByIdHandler (request, h) {
    const { id } = request.params
    const album = await this._service.getAlbumById(id)

    return {
      status: 'success',
      data: {
        album: {
          id: album[0].id,
          name: album[0].name,
          year: album[0].year,
          coverUrl: album[0].cover ?? null,
          songs: album[1]
        }
      }
    }
  }

  async putAlbumByIdHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)

    const { name, year } = request.payload
    const { id } = request.params

    await this._service.editAlbumById(id, { name, year })

    return {
      status: 'success',
      message: 'Album berhasil diperbarui'
    }
  }

  async deleteAlbumByIdHandler (request, h) {
    const { id } = request.params
    await this._service.deleteAlbumById(id)

    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    }
  }
}

module.exports = AlbumsHandler
