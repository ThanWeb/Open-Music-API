const {
  PostPlaylistPayloadSchema,
  GetPlaylistSongsPayloadSchema
} = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateGetPlaylistSongsPayload: (payload) => {
    const validationResult = GetPlaylistSongsPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = PlaylistsValidator
