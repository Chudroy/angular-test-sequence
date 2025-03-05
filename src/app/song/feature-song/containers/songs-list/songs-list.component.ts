import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PopulateStore } from 'shared/data-access';
import { HeaderStore, SkeletonComponent } from 'shared/ui';
import { SongsStore } from './songs-list.signal-store';

@Component({
  selector: 'app-songs-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatIconModule,
    RouterModule,
    SkeletonComponent
  ],
  templateUrl: './songs-list.component.html',
  styleUrl: './songs-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongsListComponent implements OnInit {
  songStore = inject(SongsStore);
  populateStore = inject(PopulateStore);
  headerStore = inject(HeaderStore);

  tooltip = signal<string>('');

  populatedSongs = computed(() => {
    const songs = this.songStore.songs();
    const artists = this.populateStore.artists();

    if (songs.length === 0 || artists.length === 0) return [];

    const populatedSongs = songs.map((song) => ({
      ...song,
      _artist: artists.find((artist) => Number(artist.id) === song.artist),
    }));

    return populatedSongs;
  });

  ngOnInit(): void {
    const songsTitle = $localize`Canciones`;
    this.headerStore.setHeader({
      title: songsTitle,
      goBack: false,
    });

    const tooltip = $localize`Añadir canción`;
    this.tooltip.set(tooltip);

    this.songStore.getSongs();
  }
}
