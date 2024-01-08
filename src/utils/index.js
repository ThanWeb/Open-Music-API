/* eslint-disable camelcase */

const mapDBToAlbumModel = ({
  id,
  name,
  year,
  cover,
  created_at,
  updated_at
}) => ({
  id,
  name,
  year,
  cover,
  createdAt: created_at,
  updatedAt: updated_at
})

const mapDBToSongModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
  created_at,
  updated_at
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
  createdAt: created_at,
  updatedAt: updated_at
})

module.exports = { mapDBToAlbumModel, mapDBToSongModel }
