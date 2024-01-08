class AlbumLikesHandler {
  constructor (albumsService, albumLikesService) {
    this._albumsService = albumsService
    this._albumLikesService = albumLikesService
  }

  async postAlbumLikeByIdHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._albumsService.getAlbumById(id)
    await this._albumLikesService.getAlbumLikeById({ credentialId, albumId: id })
    await this._albumLikesService.addAlbumLike({ credentialId, albumId: id })

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai Album'
    })

    response.code(201)
    return response
  }

  async deleteAlbumLikeByIdHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._albumLikesService.deleteAlbumLikeById({ credentialId, albumId: id })

    return {
      status: 'success',
      message: 'Batal menyukai Album'
    }
  }

  async getAlbumLikesByIdHandler (request, h) {
    const { id } = request.params
    const likes = await this._albumLikesService.getAlbumLikesById(id)

    return {
      status: 'success',
      data: {
        likes
      }
    }
  }
}

module.exports = AlbumLikesHandler
