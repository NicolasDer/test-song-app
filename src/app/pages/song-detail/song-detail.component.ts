import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SongService } from '../../services/song.service';
import { Store } from '@ngrx/store';
import { setTitle } from '../../store/actions/title.actions';

@Component({
  selector: 'app-song-detail',
  standalone: true,
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss'],
})
export class SongDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private store: Store
  ) {
    const songId = this.route.snapshot.paramMap.get('id');
    if (songId) {
      this.songService.getSongById(Number(songId)).subscribe((song) => {
        this.store.dispatch(setTitle({ title: song.title }));
      });
    }
  }
}
