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


  /**
   * Updates the songs array for each company based on the provided song ID and selected companies.
   * For companies in the selected list, the song ID is added if it's not already present.
   * For companies not in the selected list, the song ID is removed if it exists.
   *
   * @param songId - The ID of the song as a string.
   * @param companies - An array of company IDs (as strings) that should include the song.
   */
  editCompanies(songId: string | undefined, companies: string[] | undefined): void {
    if (!songId) return;
    const songNumber = Number(songId);
    if (isNaN(songNumber)) return;

    const selectedCompanyIds: string[] = companies || [];
    const allCompanies = this.populateStore.companies();

    for (const company of allCompanies) {
      const newSongsArray = selectedCompanyIds.includes(company.id)
        ? this.addSongIfMissing(company.songs, songNumber)
        : this.removeSong(company.songs, songNumber);

      this.updateCompanySongs(company.id, newSongsArray);
    }

    // Delay fetchData to avoid race conditions with json-server updates.
    setTimeout(() => {
      this.populateStore.fetchData();
    }, 2000);
  }

  /**
   * Adds the song to the array if it's not already included.
   *
   * @param songs - The current array of song IDs.
   * @param song - The song ID to add.
   * @returns A new array with the song added if it was missing.
   */
  private addSongIfMissing(songs: number[], song: number): number[] {
    return songs.includes(song) ? songs : [...songs, song];
  }

  /**
   * Removes the song from the array if it exists.
   *
   * @param songs - The current array of song IDs.
   * @param song - The song ID to remove.
   * @returns A new array with the song removed.
   */
  private removeSong(songs: number[], song: number): number[] {
    return songs.filter((s) => s !== song);
  }

  /**
   * Sends an HTTP PATCH request to update the company's songs array.
   *
   * @param companyId - The ID of the company.
   * @param songs - The updated array of song IDs.
   */
  private updateCompanySongs(companyId: string, songs: number[]): void {
    this.#http
      .patch<Company>(`${this.#API_URL}/companies/${companyId}`, { songs })
      .subscribe();
  }
}
