exports.up = (pgm) => {
  pgm.addConstraint('songs', 'fk-songs.album_id-albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE')
  pgm.addConstraint('playlist_songs', 'fk-playlist_songs.song_id-songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE')
  pgm.addConstraint('playlist_songs', 'fk-playlist_songs.playlist_id-playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE')
  pgm.addConstraint('playlists', 'fk-playlists.owner-users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')
  pgm.addConstraint('playlist_song_activities', 'fk-playlist_song_activities.playlist_id-playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE')
  pgm.addConstraint('collaborations', 'fk-collaborations.playlist_id-playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE')
  pgm.addConstraint('collaborations', 'fk-collaborations.user_id-users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk-songs.album_id-albums.id')
  pgm.dropConstraint('playlist_songs', 'fk-playlist_songs.song_id-songs.id')
  pgm.dropConstraint('playlist_songs', 'fk-playlist_songs.playlist_id-playlists.id')
  pgm.dropConstraint('playlists', 'fk-playlists.owner-users.id')
  pgm.dropConstraint('playlist_song_activities', 'fk-playlist_song_activities.playlist_id-playlists.id')
  pgm.dropConstraint('collaborations', 'fk-collaborations.playlist_id-playlists.id')
  pgm.dropConstraint('collaborations', 'fk-collaborations.user_id-users.id')
}
