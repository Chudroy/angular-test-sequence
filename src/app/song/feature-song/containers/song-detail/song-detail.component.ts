import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PopulateStore, Song } from 'shared/data-access';
import { HeaderStore, SkeletonComponent } from 'shared/ui';
import { SongsStore } from '../songs-list/songs-list.signal-store';

@Component({
  selector: 'app-song-detail',
  imports: [
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    RouterModule,
    MatTooltipModule,
    MatButtonModule,
    SkeletonComponent,
    DatePipe,
  ],
  templateUrl: './song-detail.component.html',
  styleUrl: './song-detail.component.scss',
})
export class SongDetailComponent {
  songsStore = inject(SongsStore);
  headerStore = inject(HeaderStore);
  populateStore = inject(PopulateStore);

  deleteTooltip = signal('Borrar canción');
  editTooltip = signal('Editar canción');

  songId = input<string>();

  populatedSongDetail = computed(() => {
    const song = this.songsStore.songDetail();
    const artists = this.populateStore.artists();
    const companies = this.populateStore.companies();

    if (!song || artists.length === 0 || companies.length === 0) {
      return null;
    }

    const artist = artists.find((a) => Number(a.id) === Number(song.artist));

    const matchingCompanies = companies.filter((c) =>
      c.songs.includes(Number(song.id))
    );

    return {
      ...song,
      _artist: artist,
      _companies: matchingCompanies,
    } as Song;
  });

  setHeader = effect(() => {
    const songDetail = this.songsStore.songDetail();
    this.headerStore.setGoBack(true);

    if (songDetail) {
      this.headerStore.setTitle(songDetail.title);
    }
  });

  getSongDetail = effect(() => {
    const currentSongId = this.songId();
    this.songsStore.getSongDetail(currentSongId);
  });

  onDelete(): void {
    const currentSongId = this.songId();
    this.songsStore.deleteSong(currentSongId);
  }
}
