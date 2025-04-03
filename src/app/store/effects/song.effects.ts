import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  delay,
  map,
  mergeMap,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs/operators';
import {
  loadSongs,
  loadSongsSuccess,
  loadSongsFailure,
  loadArtists,
  loadArtistsSuccess,
  loadCompanies,
  loadCompaniesSuccess,
  loadArtistsFailure,
  loadCompaniesFailure,
  saveSong,
  saveSongSuccess,
  saveSongFailure,
  createSong,
  createSongSuccess,
  createSongFailure,
  saveCompany,
  saveCompanySuccess,
  saveCompanyFailure,
  deleteSong,
  deleteSongSuccess,
  deleteSongFailure,
} from '../actions/song.actions';
import { SongService } from '../../services/song.service';
import { Store, select } from '@ngrx/store';
import {
  selectArtists,
  selectArtistsLoaded,
  selectCompanies,
  selectCompaniesByIds,
  selectCompaniesForSong,
  selectCompaniesLoaded,
  selectSongs,
  selectSongsLoaded,
} from '../selectors/songs.selector';
import { of } from 'rxjs';
import { ArtistService } from '../../services/artist.service';
import { CompanyService } from '../../services/company.service';
import { Router } from '@angular/router';
import { Company } from '../../models/company.model';
import { Song } from '../../models/song.model';

@Injectable()
export class SongEffects {
  constructor(
    private actions$: Actions,
    private songService: SongService,
    private artistService: ArtistService,
    private companyService: CompanyService,
    private store: Store,
    private router: Router
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
            delay(2000),
            map((songs) => {
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

  createSong$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createSong),
      mergeMap((action) =>
        this.songService
          .addSong(action.song)
          .pipe(map((savedSong) => this.updateCompanies(savedSong, action)))
      ),
      mergeMap((actions) => actions)
    )
  );

  private updateCompanies(
    savedSong: Song,
    action: ReturnType<typeof createSong>
  ) {
    const companies = action.song.companies;

    return this.store.select(selectCompaniesByIds(companies)).pipe(
      take(1),
      mergeMap((companiesList) => {
        const updatedCompanies = companiesList.map(
          (company) =>
            ({
              ...company,
              songs: [...company.songs, savedSong.id],
            } as Company)
        );

        const companyActions = updatedCompanies.map((company) =>
          saveCompany({ company })
        );

        return [createSongSuccess({ song: savedSong }), ...companyActions];
      }),
      catchError((error) => of(createSongFailure({ error })))
    );
  }

  createSongSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createSongSuccess),
        map(() => {
          this.router.navigate(['/']);
          return { type: '[Song] No Action' };
        })
      ),
    { dispatch: false }
  );

  saveSong$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveSong),
      mergeMap((action) =>
        this.songService.updateSong(action.song).pipe(
          map((savedSong) => {
            const companies = action.song.companies;

            return this.store.select(selectCompaniesByIds(companies)).pipe(
              take(1),
              mergeMap((companiesList) => {
                return this.store
                  .select(selectCompaniesForSong(savedSong?.id || '0'))
                  .pipe(
                    take(1),
                    mergeMap((companiesForSongList) => {
                      const { addedCompanies, deletedCompanies } =
                        this.getUniqueCompanies(
                          companiesForSongList,
                          companiesList
                        );
                      console.log(deletedCompanies);
                      const updatedCompanies = addedCompanies
                        .map(
                          (company) =>
                            ({
                              ...company,
                              songs: [...company.songs, savedSong.id],
                            } as Company)
                        )
                        .concat(
                          ...deletedCompanies.map(
                            (company) =>
                              ({
                                ...company,
                                songs: company.songs.filter(
                                  (id) => id !== savedSong.id
                                ),
                              } as Company)
                          )
                        );

                      const companyActions = updatedCompanies.map((company) =>
                        saveCompany({ company })
                      );

                      return [
                        saveSongSuccess({ song: savedSong }),
                        ...companyActions,
                      ];
                    }),
                    catchError((error) => of(saveSongFailure({ error })))
                  );
              })
            );
          })
        )
      ),
      mergeMap((actions) => actions)
    )
  );

  getUniqueCompanies(
    oldCompanies: Company[],
    newCompanies: Company[]
  ): { addedCompanies: Company[]; deletedCompanies: Company[] } {
    const setOldCompanies = new Set(oldCompanies.map((item) => item.id));
    const setNewCompanies = new Set(newCompanies.map((item) => item.id));
    const addedCompanies = newCompanies.filter(
      (c) => !setOldCompanies.has(c.id)
    );
    const deletedCompanies = oldCompanies.filter(
      (c) => !setNewCompanies.has(c.id)
    );
    return { addedCompanies, deletedCompanies };
  }

  saveSongSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(saveSongSuccess),
        map((action) => {
          this.router.navigate(['/songs', action.song.id]);
          return { type: '[Song] No Action' };
        })
      ),
    { dispatch: false }
  );

  deleteSong$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteSong),
      mergeMap((action) =>
        this.songService.deleteSong(action.songId).pipe(
          switchMap(() => {
            return this.store
              .select(selectCompaniesForSong(action.songId))
              .pipe(
                take(1),
                mergeMap((companies) => {
                  const updatedCompanies = companies.map((company) => ({
                    ...company,
                    songs: company.songs.filter(
                      (songId) => songId != action.songId
                    ),
                  }));
                  const companyActions = updatedCompanies.map((company) =>
                    saveCompany({ company })
                  );

                  return [
                    deleteSongSuccess({ songId: action.songId }),
                    ...companyActions,
                  ];
                }),
                catchError((error) => of(deleteSongFailure({ error })))
              );
          })
        )
      )
    )
  );

  deleteSongSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteSongSuccess),
        map((action) => {
          this.router.navigate(['/']);
          return { type: '[Song] No Action' };
        })
      ),
    { dispatch: false }
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
            delay(2000),
            map((artists) => {
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
            delay(2000),
            map((companies) => {
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

  saveCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveCompany),
      mergeMap((action) =>
        this.companyService.updateCompany(action.company).pipe(
          map((savedCompany) => saveCompanySuccess({ company: savedCompany })),
          catchError((error) => of(saveCompanyFailure({ error })))
        )
      )
    )
  );
}
