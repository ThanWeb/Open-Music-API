const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const NotFoundError = require('../exceptions/NotFoundError')
const InvariantError = require('../exceptions/InvariantError')
const AuthorizationError = require('../exceptions/AuthorizationError')
const { mapDBToPlaylistModel } = require('../utils')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async addPlaylist ({ name, owner }) {
    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, owner, createdAt, updatedAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getPlaylists (owner) {
    const query = {
      text: `SELECT * FROM playlists
      WHERE playlists.owner = $1
      GROUP BY playlists.id`,
      values: [owner]
    }

    const result = await this._pool.query(query)
    return result.rows.map(mapDBToPlaylistModel)
  }

  async deletePlaylistById (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan')
    }
  }

  async verifyPlaylistOwner (id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    const playlist = result.rows[0]

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }
}

module.exports = PlaylistsService