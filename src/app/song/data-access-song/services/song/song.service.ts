import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Song } from 'src/app/shared/data-access';
import { API_URL } from 'util-environment';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  #http = inject(HttpClient);
  readonly #API_URL = inject(API_URL);
  readonly #SONGS_URL = this.#API_URL + '/songs';

  readonly #GET_SONGS_URL = this.#API_URL + '/songs?_sort=-rating';

  readonly #SONG_DETAIL_URL = (songId: string) =>
    `${this.#API_URL}/songs/${songId}`;

  readonly #EDIT_SONG_URL = (songId: string) =>
    `${this.#API_URL}/songs/${songId}`;

  readonly DELETE_SONG_URL = (songId: string) =>
    `${this.#API_URL}/songs/${songId}`;

  getSongs(): Observable<Song[]> {
    return this.#http.get<Song[]>(this.#GET_SONGS_URL).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  getSongDetail(songId: string) {
    return this.#http.get<Song>(this.#SONG_DETAIL_URL(songId)).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  addSong(song: Song) {
    return this.#http.post<Song>(this.#SONGS_URL, song).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  editSong(song: Song) {
    return this.#http.patch<Song>(this.#EDIT_SONG_URL(song.id), song).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  deleteSong(songId: string) {
    return this.#http.delete(this.DELETE_SONG_URL(songId)).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }
}
