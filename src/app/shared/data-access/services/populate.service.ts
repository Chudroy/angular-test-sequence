import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, tap } from 'rxjs';
import { API_URL } from 'util-environment';
import { Artist, Company, Song } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PopulateService {
  #http = inject(HttpClient);
  readonly #API_URL = inject(API_URL);
  readonly #SONGS_URL = `${this.#API_URL}/songs`;
  readonly #ARTISTS_URL = `${this.#API_URL}/artists`;
  readonly #COMPANIES_URL = `${this.#API_URL}/companies`;

  fetchData() {
    return forkJoin({
      songs: this.#http.get<Song[]>(this.#SONGS_URL),
      artists: this.#http.get<Artist[]>(this.#ARTISTS_URL),
      companies: this.#http.get<Company[]>(this.#COMPANIES_URL),
    });
  }
}
