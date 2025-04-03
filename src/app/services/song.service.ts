import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Song } from '../models/song.model';
import { SongForm } from '../models/song-form.model';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = environment.apiUrl + '/songs'; // Endpoint de JSON Server

  constructor(private http: HttpClient) {}

  getSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.apiUrl);
  }

  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/${id}?_expand=artist&_expand=company`);
  }

  addSong(song: SongForm): Observable<Song> {
    const { id, companies, ...dataToSend} = song;
    if (environment.apiErrors) {
      return throwError(() => new Error('Simulación de error debido a la configuración.'));
    }
    return this.http.post<Song>(this.apiUrl, dataToSend);
  }

  updateSong(song: SongForm): Observable<Song> {
    const { companies, ...dataToSend} = song;
    if (environment.apiErrors) {
      return throwError(() => new Error('Simulación de error debido a la configuración.'));
    }
    return this.http.put<Song>(`${this.apiUrl}/${song.id}`, dataToSend);
  }

  deleteSong(id: string): Observable<void> {
    if (environment.apiErrors) {
      return throwError(() => new Error('Simulación de error debido a la configuración.'));
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
