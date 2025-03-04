import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { API_URL } from 'util-environment';
import { Song } from '../../models/song.models';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  #http = inject(HttpClient);
  readonly #API_URL = inject(API_URL);
  readonly #SONGS_URL = this.#API_URL + '/songs?_embed=artist';

  getSongs(): Observable<Song[]> {
    return this.#http.get<Song[]>(this.#SONGS_URL).pipe(
      tap((songs) => console.log(songs)),
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }
}
