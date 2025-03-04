import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SongsStore } from './songs-list.signal-store';
import { HeaderStore } from 'shared/ui';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-songs-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './songs-list.component.html',
  styleUrl: './songs-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongsListComponent implements OnInit {
  songStore = inject(SongsStore);
  headerStore = inject(HeaderStore);

  tooltip = signal<string>('');

  ngOnInit(): void {
    const songsTitle = $localize`Canciones`;
    this.headerStore.setTitle(songsTitle);

    const tooltip = $localize`Añadir canción`;
    this.tooltip.set(tooltip);

    this.songStore.getSongs();
  }
}
