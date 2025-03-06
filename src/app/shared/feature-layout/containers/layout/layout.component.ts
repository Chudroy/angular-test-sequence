import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, SideNavComponent, SidenavStore } from 'src/app/shared/ui-common';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

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
