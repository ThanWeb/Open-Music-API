class UsersHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator
  }

  async postUserHandler (request, h) {
    this._validator.validateUserPayload(request.payload)

    const { username, password, fullname } = request.payload
    const userId = await this._service.addUser({ username, password, fullname })

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId
      }
    })

    response.code(201)
    return response
  }

  async getUserByIdHandler (request, h) {
    const { id } = request.params
    const { source, user } = await this._service.getUserById(id)

    const response = h.response({
      status: 'success',
      data: {
        user
      }
    })

    if (source) response.header('X-Data-Source', source)

    return response
  }

  async getUsersByUsernameHandler (request, h) {
    const { username = '' } = request.query
    const users = await this._service.getUsersByUsername(username)

    return {
      status: 'success',
      data: {
        users
      }
    }
  }
}

module.exports = UsersHandler
