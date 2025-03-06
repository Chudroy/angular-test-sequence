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
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map, Observable, startWith } from 'rxjs';
import { Song } from 'shared/data-access';
import { SongFormValue } from 'src/app/song/data-access-song/models/song.models';
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
  providers: [provideLuxonDateAdapter()],
  templateUrl: './song-form.component.html',
  styleUrl: './song-form.component.scss',
})
export class SongFormComponent implements OnInit {
  fb = inject(FormBuilder);

  song = input<Song>();

  artistIdMap = input.required<
    {
      id: string;
      name: string;
    }[]
  >();

  companyIdMap = input.required<
    {
      id: string;
      name: string;
    }[]
  >();

  filteredArtists!: Observable<{ id: string; name: string }[] | undefined>;

  songFormSubmitted = output<SongFormValue>();

  populateSongForm = effect(() => {
    const song = this.song();

    if (song) {
      this.songForm.patchValue({
        title: song.title,
        artist: song._artist?.id || song.artist,
        year: song.year.toString(),
        rating: song.rating,
        genre: song.genre,
        companies: song._companies?.map((c) => {
          console.log(c);

          return c.id.toString();
        }),
      });
    }
  });

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  readonly countries: string[] = [
    'Colombia',
    'England',
    'Greece',
    'Philippines',
    'China',
  ];

  songForm = this.fb.group({
    title: new FormControl<string | null>(null, Validators.required),
    artist: new FormControl<string | null>(null, [
      Validators.required,
      artistIdValidator,
    ]),
    year: new FormControl<string | null>(null, [Validators.required]),
    rating: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
    ]),
    genre: new FormControl<string[]>([], Validators.required),
    companies: new FormControl<string[]>([]),
  });

  ngOnInit() {
    this.filteredArtists = this.songForm.get('artist')!.valueChanges.pipe(
      startWith(''),
      filter((value): value is string => (value ? true : false)),
      map((value) => {
        // When user types, value is a string.
        // When an option is selected, value becomes the artist id.
        const searchValue =
          typeof value === 'string' ? value : this.displayArtist(value);
        return searchValue
          ? this._filter(searchValue)
          : this.artistIdMap()?.slice();
      })
    );
  }

  // https://stackoverflow.com/questions/49939310/binding-this-in-angular-material-autocomplete-displaywith-using-angular-5
  displayArtist = (artistId: string): string => {
    const artist = this.artistIdMap()?.find((a) => a.id === artistId);
    return artist ? artist.name : '';
  };

  private _filter(value: string): { id: string; name: string }[] {
    const filterValue = value.toLowerCase();
    return (
      this.artistIdMap()?.filter((artist) =>
        artist.name.toLowerCase().includes(filterValue)
      ) || []
    );
  }

  addGenre(event: MatChipInputEvent): void {
    const inputValue = (event.value || '').trim();
    if (inputValue) {
      const currentGenres = this.songForm.value.genre;
      this.songForm.patchValue({
        genre: [...(currentGenres || []), inputValue],
      });
    }
    event.chipInput?.clear();
  }

  removeGenre(genre: string): void {
    const currentGenres = this.songForm.value.genre;
    const updatedGenres = currentGenres?.filter((g: string) => g !== genre);
    this.songForm.patchValue({ genre: updatedGenres });
  }

  addCompany(event: MatChipInputEvent): void {
    const inputValue = (event.value || '').trim();
    if (inputValue) {
      const currentCompanies = this.songForm.value.companies;
      this.songForm.patchValue({
        companies: [...(currentCompanies || []), inputValue],
      });
    }
    event.chipInput?.clear();
  }

  removeCompany(company: string): void {
    const currentCompanies = this.songForm.value.companies;
    const updatedCompanies = currentCompanies?.filter(
      (c: string) => c !== company
    );
    this.songForm.patchValue({ companies: updatedCompanies });
  }

  onSubmit(): void {
    if (this.songForm.valid) {
      this.songFormSubmitted.emit(
        this.songForm.value as unknown as SongFormValue
      );
    }
  }

  getControl(name: string): FormControl {
    const ctrl = this.songForm.get(name);

    if (!ctrl) {
      throw new Error(`Control ${name} not found`);
    }

    return ctrl as FormControl;
  }
}
