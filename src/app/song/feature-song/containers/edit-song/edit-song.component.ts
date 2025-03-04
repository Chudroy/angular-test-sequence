import { Component, inject, input } from '@angular/core';
import { Song } from 'data-access-song';
import { HeaderStore } from 'shared/ui';
import { SongFormComponent } from 'src/app/song/ui-song/components/song-form/song-form.component';
import { SongsStore } from '../songs-list/songs-list.signal-store';

@Component({
  selector: 'app-add-song',
  imports: [SongFormComponent],
  templateUrl: './edit-song.component.html',
  styleUrl: './edit-song.component.scss',
})
export class EditSongComponent {
  songsStore = inject(SongsStore);
  headerStore = inject(HeaderStore);

  songId = input<string>();

  ngOnInit(): void {
    const title = $localize`Editar canción`;
    this.headerStore.setTitle(title);

    if (!this.songsStore.songDetail()) {
      const songId = this.songId();
      this.songsStore.getSongDetail(songId);
    }
  }

  onSubmit($event: Song): void {
    console.log('Form Data:', $event);
  }
}
