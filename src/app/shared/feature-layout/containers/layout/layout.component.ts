import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

  onToggleSidenav() {
    this.sidenavStore.toggleSidenav();
  }
}
