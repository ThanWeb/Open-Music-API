const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const NotFoundError = require('../../exceptions/NotFoundError')
const InvariantError = require('../../exceptions/InvariantError')
const ClientError = require('../../exceptions/ClientError')

class AlbumLikesService {
  constructor () {
    this._pool = new Pool()
  }

  async addAlbumLike ({ credentialId, albumId }) {
    const id = `user_album_like-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, credentialId, albumId]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Like pada Album gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async deleteAlbumLikeById ({ credentialId, albumId }) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id RETURNING id',
      values: [credentialId, albumId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Like pada Album gagal dibatalkan')
    }
  }

  async getAlbumLikeById ({ credentialId, albumId }) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [credentialId, albumId]
    }

    const result = await this._pool.query(query)

    if (result.rowCount) {
      throw new ClientError('Album sudah diberikan Like')
    }
  }

  async getAlbumLikesById (id) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Jumlah Like pada Album tidak ditemukan')
    }

    return result.rowCount
  }
}

module.exports = AlbumLikesService
