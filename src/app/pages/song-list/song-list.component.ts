import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService, Song } from '../../services/song.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { setTitle } from '../../store/actions/title.actions';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
})
export class SongListComponent implements OnInit {
  songs: Song[] = [];

  constructor(
    private songService: SongService,
    private router: Router,
    private store: Store,
    private translate: TranslateService
  ) {    
    this.updatePageTitle();
  }

  ngOnInit() {
    this.songService.getSongs().subscribe((data) => {
      this.songs = data;
    });
  }

  goToDetail(songId: number) {
    this.router.navigate(['/songs', songId]);
  }

  private updatePageTitle() {
    this.translate.get('SONGS').subscribe((translatedTitle: string) => {
      this.store.dispatch(setTitle({ title: translatedTitle }));
    });
  }
}
