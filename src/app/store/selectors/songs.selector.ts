import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../state/song.state';

export const selectSongsState = createFeatureSelector<AppState>('songs');

export const selectSongs = createSelector(
  selectSongsState,
  (state: AppState) => state.songs
);

export const selectSongById = (id: number) =>
  createSelector(selectSongsState, (state: AppState) => state.songs[id]);

export const selectSongsLoaded = createSelector(
  selectSongsState,
  (state: AppState) => state.songsLoaded
);

export const selectArtists = createSelector(
  selectSongsState,
  (state: AppState) => state.artists
);

export const selectArtistById = (id: number) =>
  createSelector(selectSongsState, (state: AppState) => state.artists[id]);

export const selectArtistsLoaded = createSelector(
  selectSongsState,
  (state: AppState) => state.artistsLoaded
);

export const selectCompanies = createSelector(
  selectSongsState,
  (state: AppState) => state.companies
);

export const selectCompaniesForSong = (songId: number) =>
  createSelector(selectSongsState, (state: AppState) =>
    Object.values(state.companies).filter((company) =>
      company.songs.includes(songId)
    )
  );

export const selectCompaniesLoaded = createSelector(
  selectSongsState,
  (state: AppState) => state.companiesLoaded
);
