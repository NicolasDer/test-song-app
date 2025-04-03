import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../../services/song.service';
import { select, Store } from '@ngrx/store';
import { setTitle } from '../../store/actions/title.actions';
import { Song } from '../../models/song.model';
import { CommonModule } from '@angular/common';
import { combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';
import { Artist } from '../../models/artist.model';
import {
  selectArtistById,
  selectCompaniesForSong,
  selectSongById,
} from '../../store/selectors/songs.selector';
import { Company } from '../../models/company.model';
import { SongCardComponent } from '../../components/song-card/song-card.component';
import { IconButtonComponent } from '../../components/icon-button/icon-button.component';
import { deleteSong } from '../../store/actions/song.actions';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-song-detail',
  standalone: true,
  imports: [
    CommonModule,
    SongCardComponent,
    IconButtonComponent,
    TranslateModule,
  ],
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss'],
})
export class SongDetailComponent {
  songDetails$: Observable<{
    song: Song | undefined;
    artist: Artist | undefined;
    companies: Company[];
  }> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const songId = this.route.snapshot.paramMap.get('id') || '';

    const song$ = this.store.pipe(select(selectSongById(songId)));
    const companies$ = this.store.pipe(select(selectCompaniesForSong(songId)));

    this.songDetails$ = song$.pipe(
      switchMap((song) => {
        if (!song) {
          return of({ song: undefined, artist: undefined, companies: [] });
        }

        const artist$ = this.store.pipe(
          select(selectArtistById(`${song.artist}`))
        );
        return combineLatest([artist$, companies$]).pipe(
          map(([artist, companies]) => ({
            song,
            artist,
            companies,
          }))
        );
      }),
      tap((details) => {
        if (details.song && details.artist) {
          const title = `${details.song.title} (${details.artist.name})`;
          this.store.dispatch(setTitle({ title: title }));
        }
      })
    );
    this.cdr.detectChanges();
  }

  deleteSong(songId: string | undefined) {
    if (songId) {
      this.store.dispatch(deleteSong({ songId }));
    }
  }

  editSong(songId: string | undefined) {
    this.router.navigate(['/songs/edit', songId]);
  }
}
