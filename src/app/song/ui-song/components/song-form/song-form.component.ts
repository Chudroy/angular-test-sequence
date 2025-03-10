import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_FORMATS, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map, Observable, startWith } from 'rxjs';
import { Song } from 'shared/data-access';
import { SongFormValue } from 'src/app/song/data-access-song/models/song.models';
import { LUXON_DATE_FORMATS } from 'util-environment';
import { artistIdValidator } from 'util-song';

@Component({
  selector: 'app-song-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,
    MatOptionModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    TranslatePipe,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  providers: [
    provideLuxonDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: LUXON_DATE_FORMATS },
  ],
  templateUrl: './song-form.component.html',
  styleUrl: './song-form.component.scss',
})
export class SongFormComponent implements OnInit {
  fb = inject(FormBuilder);

  song = input<Song>();
  artistIdMap = input.required<{ id: string; name: string }[]>();
  companyIdMap = input.required<{ id: string; name: string }[]>();

  songFormSubmitted = output<SongFormValue>();

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  songForm = this.fb.group({
    title: new FormControl<string | null>(null, Validators.required),
    artist: new FormControl<string | null>(null, [
      Validators.required,
      artistIdValidator,
    ]),
    year: new FormControl<string | null>(null, Validators.required),
    rating: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
    ]),
    genre: new FormControl<string[]>([], Validators.required),
    companies: new FormControl<string[]>([]),
  });

  filteredArtists!: Observable<{ id: string; name: string }[] | undefined>;

  populateSongForm = effect(() => {
    const currentSong = this.song();
    if (currentSong) {
      this.songForm.patchValue({
        title: currentSong.title,
        artist: currentSong._artist?.id || currentSong.artist,
        year: currentSong.year.toString(),
        rating: currentSong.rating,
        genre: currentSong.genre,
        companies: currentSong._companies?.map((c) => c.id.toString()),
      });
    } else {
      this.getControl('artist').disable();
    }
  });

  ngOnInit(): void {
    this.filteredArtists = this.getControl('artist').valueChanges.pipe(
      startWith(''),
      filter((value): value is string => Boolean(value)),
      map((value) =>
        this.filterArtists(
          typeof value === 'string' ? value : this.displayArtist(value)
        )
      )
    );
  }

  displayArtist = (artistId: string): string => {
    const artist = this.artistIdMap()?.find((a) => a.id === artistId);
    return artist ? artist.name : '';
  };

  private filterArtists(value: string): { id: string; name: string }[] {
    const lowerValue = value.toLowerCase();
    return (
      this.artistIdMap()?.filter((artist) =>
        artist.name.toLowerCase().includes(lowerValue)
      ) || []
    );
  }

  addGenre(event: MatChipInputEvent): void {
    const newGenre = (event.value || '').trim();
    if (newGenre) {
      const genres = this.songForm.value.genre || [];
      this.songForm.patchValue({ genre: [...genres, newGenre] });
    }
    event.chipInput?.clear();
  }

  removeGenre(genre: string): void {
    const updatedGenres = this.songForm.value.genre?.filter((g) => g !== genre);
    this.songForm.patchValue({ genre: updatedGenres });
  }

  addCompany(event: MatChipInputEvent): void {
    const newCompany = (event.value || '').trim();
    if (newCompany) {
      const companies = this.songForm.value.companies || [];
      this.songForm.patchValue({ companies: [...companies, newCompany] });
    }
    event.chipInput?.clear();
  }

  removeCompany(company: string): void {
    const updatedCompanies = this.songForm.value.companies?.filter(
      (c) => c !== company
    );
    this.songForm.patchValue({ companies: updatedCompanies });
  }

  onSubmit(): void {
    if (this.songForm.valid) {
      this.songFormSubmitted.emit(this.songForm.value as SongFormValue);
    }
  }

  getControl(name: string): FormControl {
    const control = this.songForm.get(name);
    if (!control) throw new Error(`Control ${name} not found`);
    return control as FormControl;
  }
}
