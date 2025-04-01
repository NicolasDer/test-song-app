import { createReducer, on } from '@ngrx/store';
import {
  loadSongsSuccess,
  loadArtistsSuccess,
  loadCompaniesSuccess,
  loadSongsFailure,
  loadArtistsFailure,
  loadCompaniesFailure,
} from '../actions/song.actions';
import { AppState } from '../state/song.state';
import { Song } from '../../models/song.model';
import { Artist } from '../../models/artist.model';
import { Company } from '../../models/company.model';

export const initialState: AppState = {
  songs: [],
  artists: [],
  companies: [],
  songsLoaded: false,
  artistsLoaded: false,
  companiesLoaded: false,
};

export const appReducer = createReducer(
  initialState,
  on(loadSongsSuccess, (state, { songs }) => ({
    ...state,
    songs: songs.reduce((acc, song) => {
      acc[song.id] = song;
      return acc;
    }, {} as { [id: number]: Song }),
  })),
  on(loadArtistsSuccess, (state, { artists }) => ({
    ...state,
    artists: artists.reduce((acc, artist) => {
      acc[artist.id] = artist;
      return acc;
    }, {} as { [id: number]: Artist }),
  })),
  on(loadCompaniesSuccess, (state, { companies }) => ({
    ...state,
    companies: companies.reduce((acc, company) => {
      acc[company.id] = company;
      return acc;
    }, {} as { [id: number]: Company }),
  })),
  on(loadSongsFailure, (state) => ({ ...state, songsLoaded: false })),
  on(loadArtistsFailure, (state) => ({ ...state, artistsLoaded: false })),
  on(loadCompaniesFailure, (state) => ({ ...state, companiesLoaded: false }))
);
