const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const NotFoundError = require('../exceptions/NotFoundError')
const InvariantError = require('../exceptions/InvariantError')
const { mapDBToAlbumModel } = require('../utils')

class AlbumsService {
  constructor () {
    this._pool = new Pool()
  }

  async addAlbum ({ name, year }) {
    const id = `album-${nanoid(16)}`
    const createdAt = new Date().toISOString()

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, name, year, createdAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getAlbumById (id) {
    const query = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    const songsQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id]
    }

    const resultSongs = await this._pool.query(songsQuery)

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    return [result.rows.map(mapDBToAlbumModel)[0], resultSongs.rows]
  }

  async editAlbumById (id, { name, year }) {
    const updatedAt = new Date().toISOString()

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui Album. Id tidak ditemukan')
    }
  }

  async deleteAlbumById (id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan')
    }
  }
}

module.exports = AlbumsService
