import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { SongsStore } from './songs-list.signal-store';
import { HeaderStore } from 'shared/ui';

@Component({
  selector: 'app-songs-list',
  imports: [],
  templateUrl: './songs-list.component.html',
  styleUrl: './songs-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongsListComponent implements OnInit {
  songStore = inject(SongsStore);
  headerStore = inject(HeaderStore);

  ngOnInit(): void {
    const songsTitle = $localize`Canciones`;
    this.headerStore.setTitle(songsTitle);
    this.songStore.getSongs();
  }
}
