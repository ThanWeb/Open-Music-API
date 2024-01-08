const InvariantError = require('../../exceptions/InvariantError')
const { ImageCoverSchema } = require('./schema')

const UploadsValidator = {
  validateImageCover: (headers) => {
    const validationResult = ImageCoverSchema.validate(headers)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = UploadsValidator
