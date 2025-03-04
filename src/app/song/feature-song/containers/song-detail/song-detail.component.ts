import { Component, effect, inject, input, signal } from '@angular/core';
import { SongsStore } from '../songs-list/songs-list.signal-store';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { HeaderStore } from 'shared/ui';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-song-detail',
  imports: [
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    RouterModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  templateUrl: './song-detail.component.html',
  styleUrl: './song-detail.component.scss',
})
export class SongDetailComponent {
  songsStore = inject(SongsStore);
  headerStore = inject(HeaderStore);

  deleteTooltip = signal($localize`Borrar canción`);
  editTooltip = signal($localize`Editar canción`);

  songId = input<string>();

  setHeader = effect(() => {
    const songDetail = this.songsStore.songDetail();

    if (songDetail) {
      this.headerStore.setTitle(songDetail.title);
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
