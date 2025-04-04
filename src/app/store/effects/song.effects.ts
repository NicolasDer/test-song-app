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
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Injectable()
export class SongEffects {
  constructor(
    private actions$: Actions,
    private songService: SongService,
    private artistService: ArtistService,
    private companyService: CompanyService,
    private store: Store,
    private router: Router,
    private toastr: ToastrService
  ) {
    const minDelay = 1500;
    this.delay = (environment.apiDelay ? environment.apiDelay : 0) + minDelay;
  }
  delay: number;

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
            delay(this.delay),
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
        this.songService.addSong(action.song).pipe(
          delay(this.delay),
          switchMap((savedSong) => this.updateCompanies(savedSong, action)),
          catchError((error) => {
            this.toastr.error('Hubo un error COMPROBAR README.md', 'No se pudo crear la canción');
            return of(saveSongFailure({ error }));
          })
        )
      )
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
      catchError((error) => {
        this.toastr.error('Hubo un error COMPROBAR README.md', 'No se pudo crear la canción');
        return of(createSongFailure({ error }));
      })
    );
  }

  createSongSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createSongSuccess),
        map(() => {
          this.router.navigate(['/']);
          this.toastr.success('¡Éxito!', 'Canción creada correctamente');
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
          delay(this.delay),
          switchMap((savedSong) => {
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
                    })
                  );
              })
            );
          }),
          catchError((error) => {
            this.toastr.error('Hubo un error COMPROBAR README.md', 'No se pudo guardar la canción');
            return of(saveSongFailure({ error }));
          })
        )
      )
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
          this.toastr.success('¡Éxito!', 'Canción guardada correctamente');
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
          delay(this.delay),
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
                })
              );
          }),
          catchError((error) => {
            this.toastr.error('Hubo un error COMPROBAR README.md', 'No se pudo borrar la canción');
            return of(deleteSongFailure({ error }));
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
          this.toastr.success('¡Éxito!', 'Canción borrada correctamente');
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
            delay(this.delay),
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
            delay(this.delay),
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
