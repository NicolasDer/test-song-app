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
  saveCompanyFailure,
  createSongFailure,
  saveSongFailure,
  deleteSongFailure,
  saveSong,
  loadSongs,
  createSong,
  deleteSong,
  loadArtists,
  loadCompanies,
  saveCompany,
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
  loading: false,
};

export const appReducer = createReducer(
  initialState,  
  on( loadSongs, (state) => ({
    ...state,
    loading:true,
  })),
  on(loadSongsSuccess, (state, { songs }) => ({
    ...state,
    songs: songs.reduce((acc, song) => {
      acc[song?.id || '0'] = song;
      return acc;
    }, {} as { [id: string]: Song }),
    loading: false,
    songsLoaded: true,
  })), 
  on( createSong, (state) => ({
    ...state,
    loading:true,
  })),
  on(createSongSuccess, (state, { song }) => ({
    ...state,
    songs: {
      ...state.songs,
      [song?.id || '0']: song,
    },
    loading: false,
  })),
  on( createSongFailure, (state) => ({
    ...state,
    loading:true,
  })), 
  on( saveSong, (state) => ({
    ...state,
    loading:true,
  })),
  on(saveSongSuccess, (state, { song }) => ({
    ...state,
    songs: {
      ...state.songs,
      [song?.id || '0']: song,
    },
    loading: false,
  })),
  on( saveSongFailure, (state) => ({
    ...state,
    loading:true,
  })), 
  on( deleteSong, (state) => ({
    ...state,
    loading:true,
  })),
  on(deleteSongSuccess, (state, { songId }) => {
    const newState = {
      ...state,
      songs: {
        ...state.songs,
      },
      loading: false,
    };
    delete newState.songs[songId];
    return newState;
  }),
  on( deleteSongFailure, (state) => ({
    ...state,
    loading:true,
  })), 
  on( loadArtists, (state) => ({
    ...state,
    loading:true,
  })),
  on(loadArtistsSuccess, (state, { artists }) => ({
    ...state,
    artists: artists.reduce((acc, artist) => {
      acc[artist?.id || '0'] = artist;
      return acc;
    }, {} as { [id: string]: Artist }),
    loading: false,
    artistsLoaded: true,
  })), 
  on( loadCompanies, (state) => ({
    ...state,
    loading:true,
  })),
  on(loadCompaniesSuccess, (state, { companies }) => ({
    ...state,
    companies: companies.reduce((acc, company) => {
      acc[company?.id || '0'] = company;
      return acc;
    }, {} as { [id: string]: Company }),
    loading: false,
    companiesLoaded: true,
  })), 
  on( saveCompany, (state) => ({
    ...state,
    loading:true,
  })),
  on(saveCompanySuccess, (state, { company }) => ({
    ...state,
    companies: {
      ...state.companies,
      [company?.id || '0']: company,
    },
    loading: false,
  })),
  on( saveCompanyFailure, (state) => ({
    ...state,
    loading:false,
  })),
  on(loadSongsFailure, (state) => ({ ...state, songsLoaded: false, loading: false })),
  on(loadArtistsFailure, (state) => ({ ...state, artistsLoaded: false, loading: false })),
  on(loadCompaniesFailure, (state) => ({ ...state, companiesLoaded: false, loading: false }))
);
