import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

import { Song } from 'shared/data-access';
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
  ],
  providers: [provideLuxonDateAdapter()],
  templateUrl: './song-form.component.html',
  styleUrl: './song-form.component.scss',
})
export class SongFormComponent {
  fb = inject(FormBuilder);

  song = input<Song>();

  songFormSubmitted = output<Song>();

  populateSongForm = effect(() => {
    const song = this.song();

    if (song) {
      this.songForm.patchValue({
        title: song.title,
        artist: song._artist?.name,
        country: song._company ? song._company.country : null,
        year: song.year.toString(),
        rating: song.rating,
        genres: song.genre,
        companies: song._company ? [song._company.name] : [],
      });

      this.songForm.get('artist')?.disable();
      this.songForm.get('country')?.disable();
      this.songForm.get('companies')?.disable();
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
    artist: new FormControl<string | null>(null, Validators.required),
    country: new FormControl<string | null>(null, Validators.required),
    year: new FormControl<string | null>(null, [Validators.required]),
    rating: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
    ]),
    genres: new FormControl<string[]>([], Validators.required),
    companies: new FormControl<string[]>([], Validators.required),
  });

  addGenre(event: MatChipInputEvent): void {
    const inputValue = (event.value || '').trim();
    if (inputValue) {
      const currentGenres = this.songForm.value.genres;
      this.songForm.patchValue({
        genres: [...(currentGenres || []), inputValue],
      });
    }
    event.chipInput?.clear();
  }

  removeGenre(genre: string): void {
    const currentGenres = this.songForm.value.genres;
    const updatedGenres = currentGenres?.filter((g: string) => g !== genre);
    this.songForm.patchValue({ genres: updatedGenres });
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
      this.songFormSubmitted.emit(this.songForm.value as unknown as Song);
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
