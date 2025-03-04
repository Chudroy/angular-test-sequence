import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { SongsStore } from './songs-list.signal-store';

@Component({
  selector: 'app-songs-list',
  imports: [],
  templateUrl: './songs-list.component.html',
  styleUrl: './songs-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongsListComponent implements OnInit {
  songStore = inject(SongsStore);

  ngOnInit(): void {
    this.songStore.getSongs();
  }
}
