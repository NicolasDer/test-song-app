import { createAction, props } from '@ngrx/store';
import { Song } from '../../models/song.model';
import { Artist } from '../../models/artist.model';
import { Company } from '../../models/company.model';
import { SongForm } from '../../models/song-form.model';

export const loadSongs = createAction('[Song] Load Songs');
export const loadSongsSuccess = createAction('[Song] Load Songs Success', props<{ songs: Song[] }>());
export const loadSongsFailure = createAction('[Song] Load Songs Failure', props<{ error: any }>());
export const setSongsLoaded = createAction('[Songs] Set Songs Loaded', props<{ loaded: boolean }>());

export const createSong = createAction('[Song] Create Song', props<{ song: SongForm }>());
export const createSongSuccess = createAction('[Song] Create Song Success', props<{ song: Song }>());
export const createSongFailure = createAction('[Song] Create Song Failure', props<{ error: any }>());

export const saveSong = createAction('[Song] Save Song', props<{ song: SongForm }>());
export const saveSongSuccess = createAction('[Song] Save Song Success', props<{ song: Song }>());
export const saveSongFailure = createAction('[Song] Save Song Failure', props<{ error: any }>());

export const deleteSong = createAction('[Song] Delete Song', props<{ songId: string }>());
export const deleteSongSuccess = createAction('[Song] Delete Song Success', props<{ songId: string }>());
export const deleteSongFailure = createAction('[Song] Delete Song Failure', props<{ error: any }>());

export const loadArtists = createAction('[Artist] Load Artists');
export const loadArtistsSuccess = createAction('[Artist] Load Artists Success', props<{ artists: Artist[] }>());
export const loadArtistsFailure = createAction('[Artist] Load Artists Failure', props<{ error: any }>());
export const setArtistsLoaded = createAction('[Artists] Set Artists Loaded', props<{ loaded: boolean }>());

export const loadCompanies = createAction('[Company] Load Companies');
export const loadCompaniesSuccess = createAction('[Company] Load Companies Success', props<{ companies: Company[] }>());
export const loadCompaniesFailure = createAction('[Company] Load Companies Failure', props<{ error: any }>());
export const setCompaniesLoaded = createAction('[Companies] Set Companies Loaded', props<{ loaded: boolean }>());

export const saveCompany = createAction('[Company] Save Company', props<{ company: Company }>());
export const saveCompanySuccess = createAction('[Company] Save Company Success', props<{ company: Company }>());
export const saveCompanyFailure = createAction('[Company] Save Company Failure', props<{ error: any }>());
