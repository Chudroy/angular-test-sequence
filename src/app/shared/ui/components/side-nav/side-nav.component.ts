import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { SidenavStore } from './side-nav.signal-store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-side-nav',
  imports: [
    MatSidenavModule,
    MatListModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {
  sidenavStore = inject(SidenavStore);

  toggleSidenav($event: void) {
    this.sidenavStore.toggleSidenav();
  }
}
