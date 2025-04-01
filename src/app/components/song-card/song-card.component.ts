import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Song } from '../../models/song.model';
import { CommonModule } from '@angular/common';
import { Artist } from '../../models/artist.model';

@Component({
  selector: 'app-song-card',
  imports: [CommonModule],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.scss',
})
export class SongCardComponent {
  @Input() song: Song | undefined;
  @Input() artist: Artist | undefined;
  constructor(private router: Router) {}

  goToDetail(songId: number) {
    this.router.navigate(['/songs', songId]);
  }
}
