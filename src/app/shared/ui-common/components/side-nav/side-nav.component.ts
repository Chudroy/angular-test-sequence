import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { SidenavStore } from './side-nav.signal-store';

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

  toggleSidenav() {
    this.sidenavStore.toggleSidenav();
  }
}
