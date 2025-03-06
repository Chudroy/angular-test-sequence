import { Component, inject } from '@angular/core';
import { Song } from 'shared/data-access';
import { HeaderStore } from 'shared/ui';
import { SongFormComponent } from 'src/app/song/ui-song/components/song-form/song-form.component';
import { SongsStore } from '../songs-list/songs-list.signal-store';

@Component({
  selector: 'app-add-song',
  imports: [SongFormComponent],
  templateUrl: './add-song.component.html',
  styleUrl: './add-song.component.scss',
})
export class AddSongComponent {
  headerStore = inject(HeaderStore);
  songsStore = inject(SongsStore);

  ngOnInit(): void {
    const title = `Añadir canción`;
    this.headerStore.setHeader({
      title,
      goBack: true,
    });
  }

  onSubmit($event: Song): void {
    this.songsStore.addSong($event);
  }
}
