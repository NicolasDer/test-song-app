import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { setTitle } from '../../store/actions/title.actions';
import {
  selectArtists,
  selectLoadingState,
  selectSongs,
} from '../../store/selectors/songs.selector';
import { SongCardComponent } from '../../components/song-card/song-card.component';
import { IconButtonComponent } from '../../components/icon-button/icon-button.component';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { of } from 'rxjs';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    SongCardComponent,
    IconButtonComponent,
    NgxSkeletonLoaderComponent,
  ],
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
})
export class SongListComponent {
  songs$ = this.store.pipe(select(selectSongs));
  artists$ = this.store.pipe(select(selectArtists));
  loading$ = this.store.pipe(select(selectLoadingState));

  constructor(
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

  newSong() {
    this.router.navigate(['/songs/create']);
  }
}
