const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const NotFoundError = require('../../exceptions/NotFoundError')
const InvariantError = require('../../exceptions/InvariantError')

class PlaylistSongsService {
  constructor () {
    this._pool = new Pool()
  }

  async addPlaylistSong ({ playlistId, songId }) {
    const id = `playlist-song-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke dalam Playlist')
    }

    return result.rows[0].id
  }

  async getPlaylistSongs (playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
      INNER JOIN songs
      ON playlist_songs.song_id = songs.id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId]
    }

    const result = await this._pool.query(query)
    return result.rows
  }

  async deletePlaylistSongById (songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Lagu di dalam Playlist gagal dihapus. Id tidak ditemukan')
    }
  }
}

module.exports = PlaylistSongsService
