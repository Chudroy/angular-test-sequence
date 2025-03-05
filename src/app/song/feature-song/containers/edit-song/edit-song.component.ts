import { Component, computed, inject, input } from '@angular/core';
import { HeaderStore } from 'shared/ui';
import { SongFormComponent } from 'src/app/song/ui-song/components/song-form/song-form.component';
import { SongsStore } from '../songs-list/songs-list.signal-store';
import { PopulateStore, Song } from 'shared/data-access';

@Component({
  selector: 'app-add-song',
  imports: [SongFormComponent],
  templateUrl: './edit-song.component.html',
  styleUrl: './edit-song.component.scss',
})
export class EditSongComponent {
  songsStore = inject(SongsStore);
  populateStore = inject(PopulateStore);
  headerStore = inject(HeaderStore);

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

  ngOnInit(): void {
    const title = $localize`Editar canción`;
    this.headerStore.setHeader({
      title,
      goBack: true,
    });

    if (!this.songsStore.songDetail()) {
      const songId = this.songId();
      this.songsStore.getSongDetail(songId);
    }
  }

  onSubmit($event: Song): void {
    const song: Song = {
      ...$event,
      id: this.songId() || '',
    };

    this.songsStore.editSong(song);
  }
}
