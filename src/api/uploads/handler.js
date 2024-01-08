class UploadsHandler {
  constructor (albumsService, storageService, validator) {
    this._albumsService = albumsService
    this._storageService = storageService
    this._validator = validator
  }

  async postUploadImageHandler (request, h) {
    const { id } = request.params
    const { cover } = request.payload
    this._validator.validateImageCover(cover.hapi.headers)

    const filename = await this._storageService.writeFile(cover, cover.hapi)
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`
    await this._albumsService.updateAlbumCoverById(id, { fileLocation })

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah'
    })

    response.code(201)
    return response
  }
}

module.exports = UploadsHandler
