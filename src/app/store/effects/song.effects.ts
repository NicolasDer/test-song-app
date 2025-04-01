import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  loadSongs,
  loadSongsSuccess,
  loadSongsFailure,
  loadArtists,
  loadArtistsSuccess,
  loadCompanies,
  loadCompaniesSuccess,
  setSongsLoaded,
  setArtistsLoaded,
  loadArtistsFailure,
  setCompaniesLoaded,
  loadCompaniesFailure,
} from '../actions/song.actions';
import { SongService } from '../../services/song.service';
import { Store, select } from '@ngrx/store';
import {
  selectArtists,
  selectArtistsLoaded,
  selectCompanies,
  selectCompaniesLoaded,
  selectSongs,
  selectSongsLoaded,
} from '../selectors/songs.selector';
import { of } from 'rxjs';
import { ArtistService } from '../../services/artist.service';
import { CompanyService } from '../../services/company.service';

@Injectable()
export class SongEffects {
  constructor(
    private actions$: Actions,
    private songService: SongService,
    private artistService: ArtistService,
    private companyService: CompanyService,
    private store: Store
  ) {}

  loadSongs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSongs),
      withLatestFrom(
        this.store.pipe(select(selectSongs)),
        this.store.pipe(select(selectSongsLoaded))
      ),
      switchMap(([action, songs, songsLoaded]) => {
        if (songsLoaded) {
          return of();
        } else {
          return this.songService.getSongs().pipe(
            map((songs) => {
              this.store.dispatch(setSongsLoaded({ loaded: true }));
              return loadSongsSuccess({ songs });
            }),
            catchError((error) => {
              return of(loadSongsFailure({ error }));
            })
          );
        }
      })
    )
  );

  loadArtists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadArtists),
      withLatestFrom(
        this.store.pipe(select(selectArtists)),
        this.store.pipe(select(selectArtistsLoaded))
      ),
      switchMap(([action, artists, artistsLoaded]) => {
        if (artistsLoaded) {
          return of();
        } else {
          return this.artistService.getArtists().pipe(
            map((artists) => {
              this.store.dispatch(setArtistsLoaded({ loaded: true }));
              return loadArtistsSuccess({ artists });
            }),
            catchError((error) => {
              return of(loadArtistsFailure({ error }));
            })
          );
        }
      })
    )
  );

  loadCompanies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCompanies),
      withLatestFrom(
        this.store.pipe(select(selectCompanies)),
        this.store.pipe(select(selectCompaniesLoaded))
      ),
      switchMap(([action, companies, companiesLoaded]) => {
        if (companiesLoaded) {
          return of();
        } else {
          return this.companyService.getCompanies().pipe(
            map((companies) => {
              this.store.dispatch(setCompaniesLoaded({ loaded: true }));
              return loadCompaniesSuccess({ companies });
            }),
            catchError((error) => {
              return of(loadCompaniesFailure({ error }));
            })
          );
        }
      })
    )
  );
}
