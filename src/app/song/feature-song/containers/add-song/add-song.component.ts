import { Component, inject } from '@angular/core';
import { PopulateStore } from 'shared/data-access';
import { HeaderStore } from 'shared/ui';
import { SongFormValue } from 'src/app/song/data-access-song/models/song.models';
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
  populateStore = inject(PopulateStore);

  ngOnInit(): void {
    this.initializeHeader();
  }

  initializeHeader() {
    const title = `Añadir canción`;
    this.headerStore.setHeader({
      title,
      goBack: true,
    });
  }

  onSubmit($event: SongFormValue): void {
    this.songsStore.addSong($event);
  }
}
