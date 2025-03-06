import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Company, PopulateStore } from 'shared/data-access';
import { API_URL } from 'util-environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  #http = inject(HttpClient);
  readonly #API_URL = inject(API_URL);
  populateStore = inject(PopulateStore);

  editCompanies(songId: string | undefined, companies: string[] | undefined) {
    if (!songId) return;
    const songNumber = Number(songId);
    if (isNaN(songNumber)) return;

    const selectedCompanyIds: string[] = companies || [];

    const allCompanies = this.populateStore.companies();

    for (const company of allCompanies) {
      let newSongsArray: number[];

      if (selectedCompanyIds.includes(company.id)) {
        newSongsArray = company.songs.includes(songNumber)
          ? company.songs
          : [...company.songs, songNumber];
      } else {
        newSongsArray = company.songs.filter((song) => song !== songNumber);
      }

      this.#http
        .patch<Company>(`${this.#API_URL}/companies/${company.id}`, {
          songs: newSongsArray,
        })
        .subscribe();
    }
  }
}
