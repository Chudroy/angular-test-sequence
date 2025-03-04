import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, inject } from '@angular/core';
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
import { Song } from 'data-access-song';
import { HeaderStore } from 'shared/ui';
import { SongFormComponent } from 'src/app/song/ui-song/components/song-form/song-form.component';

@Component({
  selector: 'app-add-song',
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
    SongFormComponent,
  ],
  providers: [provideLuxonDateAdapter()],
  templateUrl: './edit-song.component.html',
  styleUrl: './edit-song.component.scss',
})
export class AddSongComponent {
  headerStore = inject(HeaderStore);

  ngOnInit(): void {
    const title = $localize`Editar canción`;
    this.headerStore.setTitle(title);
  }

  onSubmit($event: Song): void {
    console.log('Form Data:', $event);
  }
}
