import { Component, computed, effect, inject, input } from '@angular/core';
import { PopulateStore, Song } from 'shared/data-access';
import { HeaderStore, ProgressService } from 'shared/ui';
import { SongFormComponent } from 'src/app/song/ui-song/components/song-form/song-form.component';
import { SongsStore } from '../songs-list/songs-list.signal-store';
import { SongFormValue } from 'src/app/song/data-access-song/models/song.models';

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
  progressService = inject(ProgressService);

  songId = input<string>();

  populatedSongDetail = computed(() => {
    const song = this.songsStore.songDetail();
    const artists = this.populateStore.artists();
    const companies = this.populateStore.companies();

    if (!song || artists.length === 0 || companies.length === 0) {
      return null;
    }

    const artist = artists.find((a) => Number(a.id) === Number(song.artist));
    const matchingCompanies = companies.filter((c) =>
      c.songs.includes(Number(song.id))
    );

    const populatedSong: Song = {
      ...song,
      _artist: artist,
      _companies: matchingCompanies,
    };

    

    return populatedSong;
  });

  showLoadingDialog = effect(() => {
    if (!this.songsStore.songDetail() && this.songsStore.isLoading()) {
      this.progressService.openDialog();
    } else {
      this.progressService.closeDialog();
    }
  });

  ngOnInit(): void {
    const title = `Editar canción`;
    this.headerStore.setHeader({
      title,
      goBack: true,
    });

    if (!this.songsStore.songDetail()) {
      const songId = this.songId();
      this.songsStore.getSongDetail(songId);
    }
  }

  onSubmit($event: SongFormValue): void {
    const song: SongFormValue = {
      ...$event,
      id: this.songId() || '',
    };

    this.songsStore.editSong(song);
  }
}
