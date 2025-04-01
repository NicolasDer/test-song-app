import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { setTitle } from '../../store/actions/title.actions';
import { selectArtists, selectSongs } from '../../store/selectors/songs.selector';
import { SongCardComponent } from '../../components/song-card/song-card.component';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [TranslateModule, CommonModule, SongCardComponent],
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
})
export class SongListComponent {
  songs$ = this.store.pipe(select(selectSongs));
  artists$ = this.store.pipe(select(selectArtists));

  constructor(
    private songService: SongService,
    private router: Router,
    private store: Store,
    private translate: TranslateService
  ) {    
    this.updatePageTitle();
  }

  private updatePageTitle() {
    this.translate.get('SONGS').subscribe((translatedTitle: string) => {
      this.store.dispatch(setTitle({ title: translatedTitle }));
    });
  }
}
