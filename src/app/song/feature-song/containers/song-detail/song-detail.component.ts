import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { SongsStore } from '../songs-list/songs-list.signal-store';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { HeaderStore, SkeletonComponent } from 'shared/ui';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { PopulateStore, Song } from 'shared/data-access';

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
  ],
  templateUrl: './song-detail.component.html',
  styleUrl: './song-detail.component.scss',
})
export class SongDetailComponent {
  songsStore = inject(SongsStore);
  headerStore = inject(HeaderStore);
  populateStore = inject(PopulateStore);

  deleteTooltip = signal($localize`Borrar canción`);
  editTooltip = signal($localize`Editar canción`);

  songId = input<string>();

  populatedSongDetail = computed(() => {
    const song = this.songsStore.songDetail();
    const artists = this.populateStore.artists();
    const companies = this.populateStore.companies();

    if (!song || artists.length === 0 || companies.length === 0) {
      return null;
    }

    const artist = artists.find((a) => Number(a.id) === song.artist);
    const company = companies.find((c) => c.songs.includes(Number(song.id)));

    const populatedSong: Song = {
      ...song,
      _artist: artist,
      _company: company,
    };

    return populatedSong;
  });

  setHeader = effect(() => {
    const songDetail = this.songsStore.songDetail();

    if (songDetail) {
      this.headerStore.setHeader({
        title: songDetail.title,
        goBack: true,
      });
    }
  });

  getSongDetail = effect(() => {
    const songId = this.songId();
    this.songsStore.getSongDetail(songId);
  });

  onDelete() {
    const songId = this.songId();
    this.songsStore.deleteSong(songId);
  }
}
