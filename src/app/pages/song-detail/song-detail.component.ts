import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SongService } from '../../services/song.service';
import { select, Store } from '@ngrx/store';
import { setTitle } from '../../store/actions/title.actions';
import { Song } from '../../models/song.model';
import { CommonModule } from '@angular/common';
import { combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';
import { Artist } from '../../models/artist.model';
import { selectArtistById, selectCompaniesForSong, selectSongById } from '../../store/selectors/songs.selector';
import { Company } from '../../models/company.model';
import { SongCardComponent } from '../../components/song-card/song-card.component';

@Component({
  selector: 'app-song-detail',
  standalone: true,
  imports: [CommonModule, SongCardComponent],
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss'],
})
export class SongDetailComponent {
  songDetails$: Observable<{ song: Song | undefined, artist: Artist | undefined, companies: Company[] }> | null = null;

  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) {
  }

  ngOnInit(){
    const songId = Number(this.route.snapshot.paramMap.get('id'));

    const song$ = this.store.pipe(select(selectSongById(songId)));
    const companies$ = this.store.pipe(select(selectCompaniesForSong(songId)));

    this.songDetails$ = song$.pipe(
      switchMap(song => {
        if (!song) {
          return of({ song: undefined, artist: undefined, companies: [] });
        }

        const artist$ = this.store.pipe(select(selectArtistById(song.artist)));
        return combineLatest([artist$, companies$]).pipe(
          map(([artist, companies]) => ({
            song,
            artist,
            companies
          }))
        );
      }),
      tap((details) =>{
        console.log("trying to write")
        if (details.song && details.artist) {
          console.log("writing")
          const title = `${details.song.title} (${details.artist.name})`;
          this.store.dispatch(setTitle({ title: title }));
        }
      })
    );
  }
}
