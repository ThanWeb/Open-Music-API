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
    const { source, likes } = await this._albumLikesService.getAlbumLikesById(id)

    const response = h.response({
      status: 'success',
      data: {
        likes
      }
    })

    if (source) response.header('X-Data-Source', source)

    return response
  }
}

module.exports = AlbumLikesHandler
