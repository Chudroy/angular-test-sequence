import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent, SideNavComponent, SidenavStore } from 'shared/ui';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, HeaderComponent, SideNavComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  sidenavStore = inject(SidenavStore);
  location = inject(Location);
  translateService = inject(TranslateService);

  onToggleSidenav() {
    this.sidenavStore.toggleSidenav();
  }

  onGoBack() {
    this.location.back();
  }

  onChangeLanguage($event: string) {
    const language = $event;
    this.translateService.use(language);
  }
}
