import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, SideNavComponent, SidenavStore } from 'shared/ui';
import { Location } from '@angular/common';
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

  onToggleSidenav() {
    this.sidenavStore.toggleSidenav();
  }

  onGoBack() {
    this.location.back();
  }
}
