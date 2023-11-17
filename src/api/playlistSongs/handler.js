class PlaylistSongsHandler {
  constructor (playlistSongsService, playlistsService, songsService, playlistSongActivitiesService, validator) {
    this._playlistSongsService = playlistSongsService
    this._playlistsService = playlistsService
    this._songsService = songsService
    this._playlistSongActivitiesService = playlistSongActivitiesService
    this._validator = validator
  }

  async postPlaylistSongHandler (request, h) {
    this._validator.validatePlaylistSongPayload(request.payload)

    const { id } = request.params
    const { songId } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess(id, credentialId)
    await this._songsService.getSongById(songId)

    await this._playlistSongsService.addPlaylistSong({
      playlistId: id, songId
    })

    await this._playlistSongActivitiesService.addPlaylistSongActivity({
      playlistId: id, songId, userId: credentialId, action: 'add'
    })

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan di dalam Playlist'
    })

    response.code(201)
    return response
  }

  async getPlaylistSongsHandler (request, h) {
    const playlistId = request.params.id
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    const { id, name, username } = await this._playlistsService.getPlaylistById(playlistId, credentialId)
    const songs = await this._playlistSongsService.getPlaylistSongs(playlistId)

    return {
      status: 'success',
      data: {
        playlist: {
          id,
          name,
          username,
          songs
        }
      }
    }
  }

  async deletePlaylistSongByIdHandler (request, h) {
    this._validator.validatePlaylistSongPayload(request.payload)

    const { id } = request.params
    const { songId } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess(id, credentialId)
    await this._songsService.getSongById(songId)
    await this._playlistSongsService.deletePlaylistSongById(songId, id)

    await this._playlistSongActivitiesService.addPlaylistSongActivity({
      playlistId: id, songId, userId: credentialId, action: 'delete'
    })

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    }
  }
}

module.exports = PlaylistSongsHandler
