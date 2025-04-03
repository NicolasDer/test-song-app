import { createReducer, on } from '@ngrx/store';
import {
  loadSongsSuccess,
  loadArtistsSuccess,
  loadCompaniesSuccess,
  loadSongsFailure,
  loadArtistsFailure,
  loadCompaniesFailure,
  saveSongSuccess,
  createSongSuccess,
  saveCompanySuccess,
  deleteSongSuccess,
} from '../actions/song.actions';
import { AppState } from '../state/song.state';
import { Song } from '../../models/song.model';
import { Artist } from '../../models/artist.model';
import { Company } from '../../models/company.model';

export const initialState: AppState = {
  songs: {},
  artists: {},
  companies: {},
  songsLoaded: false,
  artistsLoaded: false,
  companiesLoaded: false,
};

export const appReducer = createReducer(
  initialState,
  on(loadSongsSuccess, (state, { songs }) => ({
    ...state,
    songs: songs.reduce((acc, song) => {
      acc[song?.id || '0'] = song;
      return acc;
    }, {} as { [id: string]: Song }),
  })),
  on(createSongSuccess, (state, { song }) => ({
    ...state,
    songs: {
      ...state.songs,
      [song?.id || '0']: song,
    },
  })),
  on(saveSongSuccess, (state, { song }) => ({
    ...state,
    songs: {
      ...state.songs,
      [song?.id || '0']: song,
    },
  })),
  on(deleteSongSuccess, (state, { songId }) => {
    const newState = {
      ...state,
      songs: {
        ...state.songs,
      },
    };
    delete newState.songs[songId];
    return newState;
  }),
  on(loadArtistsSuccess, (state, { artists }) => ({
    ...state,
    artists: artists.reduce((acc, artist) => {
      acc[artist?.id || '0'] = artist;
      return acc;
    }, {} as { [id: string]: Artist }),
  })),
  on(loadCompaniesSuccess, (state, { companies }) => ({
    ...state,
    companies: companies.reduce((acc, company) => {
      acc[company?.id || '0'] = company;
      return acc;
    }, {} as { [id: string]: Company }),
  })),
  on(saveCompanySuccess, (state, { company }) => ({
    ...state,
    companies: {
      ...state.companies,
      [company?.id || '0']: company,
    },
  })),
  on(loadSongsFailure, (state) => ({ ...state, songsLoaded: false })),
  on(loadArtistsFailure, (state) => ({ ...state, artistsLoaded: false })),
  on(loadCompaniesFailure, (state) => ({ ...state, companiesLoaded: false }))
);
