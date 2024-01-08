const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const NotFoundError = require('../../exceptions/NotFoundError')
const InvariantError = require('../../exceptions/InvariantError')
const { mapDBToAlbumModel } = require('../../utils')

class AlbumsService {
  constructor (cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async addAlbum ({ name, year }) {
    const id = `album-${nanoid(16)}`
    const createdAt = new Date().toISOString()

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5, $5) RETURNING id',
      values: [id, name, year, null, createdAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getAlbumById (id) {
    try {
      const result = await this._cacheService.get(`album:${id}`)
      const songsQuery = {
        text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
        values: [id]
      }

      const resultSongs = await this._pool.query(songsQuery)

      if (!result.rowCount) {
        throw new NotFoundError('Album tidak ditemukan')
      }

      return [mapDBToAlbumModel(JSON.parse(result)), resultSongs.rows]
    } catch {
      const query = {
        text: 'SELECT id, name, year, cover FROM albums WHERE id = $1',
        values: [id]
      }

      const result = await this._pool.query(query)
      await this._cacheService.set(`album:${id}`, JSON.stringify(result))

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

    await this._cacheService.delete(`album:${id}`)
  }

  async updateAlbumCoverById (id, { fileLocation }) {
    const updatedAt = new Date().toISOString()

    const query = {
      text: 'UPDATE albums SET cover = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [fileLocation, updatedAt, id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui Cover Album. Id tidak ditemukan')
    }

    await this._cacheService.delete(`album:${id}`)
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

    await this._cacheService.delete(`album:${id}`)
  }
}

module.exports = AlbumsService
