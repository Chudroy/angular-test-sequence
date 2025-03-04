import { Component, inject } from '@angular/core';
import { Song } from 'data-access-song';
import { HeaderStore } from 'shared/ui';
import { SongFormComponent } from 'src/app/song/ui-song/components/song-form/song-form.component';

@Component({
  selector: 'app-add-song',
  imports: [SongFormComponent],
  templateUrl: './add-song.component.html',
  styleUrl: './add-song.component.scss',
})
export class AddSongComponent {
  headerStore = inject(HeaderStore);

  ngOnInit(): void {
    const title = $localize`Añadir canción`;
    this.headerStore.setTitle(title);
  }

  onSubmit($event: Song): void {
    console.log('Form Data:', $event);
  }
}
