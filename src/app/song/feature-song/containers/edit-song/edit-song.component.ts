import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { PopulateStore, Song } from 'shared/data-access';
import { HeaderStore, ProgressService } from 'src/app/shared/ui-common';
import { SongFormComponent } from 'src/app/song/ui-song/components/song-form/song-form.component';
import { SongsStore } from '../songs-list/songs-list.signal-store';
import { SongFormValue } from 'src/app/song/data-access-song/models/song.models';

@Component({
  selector: 'app-add-song',
  imports: [SongFormComponent],
  templateUrl: './edit-song.component.html',
  styleUrl: './edit-song.component.scss',
})
export class EditSongComponent implements OnInit {
  songsStore = inject(SongsStore);
  populateStore = inject(PopulateStore);
  headerStore = inject(HeaderStore);
  progressService = inject(ProgressService);
  songId = input<string>();

  populatedSongDetail = computed(() => {
    const song = this.songsStore.songDetail();
    const artists = this.populateStore.artists();
    const companies = this.populateStore.companies();

    if (!song || !artists.length || !companies.length) return null;

    const artist = artists.find((a) => Number(a.id) === Number(song.artist));
    const matchingCompanies = companies.filter((c) =>
      c.songs.includes(Number(song.id))
    );
    
    return { ...song, _artist: artist, _companies: matchingCompanies } as Song;
  });

  showLoadingDialog = effect(() => {
    this.songsStore.songDetail() || !this.songsStore.isLoading()
      ? this.progressService.closeDialog()
      : this.progressService.openDialog();
  });

  ngOnInit(): void {
    this.initializeHeader();
    if (!this.songsStore.songDetail()) {
      this.songsStore.getSongDetail(this.songId());
    }
  }

  initializeHeader(): void {
    this.headerStore.setHeader({ title: 'Editar canción', goBack: true });
  }

  onSubmit(formValue: SongFormValue): void {
    this.songsStore.editSong({ ...formValue, id: this.songId() || '' });
  }
}
