import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderStore } from './header.signal-store';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  headerStore = inject(HeaderStore);

  toggleSidenav = output<void>();
  goBack = output<void>();
  changeLanguage = output<string>();

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }

  onGoBack() {
    this.goBack.emit();
  }

  onChangeLanguage($event: MatSelectChange<string>) {
    const language = $event.value;
    this.changeLanguage.emit(language);
  }
}
