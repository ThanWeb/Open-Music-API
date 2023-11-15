class PlaylistSongActivitiesHandler {
  constructor (playlistSongActivitiesService, playlistsService) {
    this._playlistSongActivitiesService = playlistSongActivitiesService
    this._playlistsService = playlistsService
  }

  async getPlaylistSongActivitiesHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistOwner(id, credentialId)
    const activities = await this._playlistSongActivitiesService.getPlaylistSongActivities(id)

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities
      }
    }
  }
}

module.exports = PlaylistSongActivitiesHandler
