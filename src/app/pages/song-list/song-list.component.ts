import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService, Song } from '../../services/song.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [ TranslateModule, CommonModule],
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  songs: Song[] = [];

  constructor(private songService: SongService) {}

  ngOnInit() {
    this.songService.getSongs().subscribe((data) => {
      this.songs = data;
    });
  }
}
