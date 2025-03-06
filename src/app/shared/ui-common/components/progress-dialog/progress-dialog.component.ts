import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-progress-dialog',
  imports: [MatProgressSpinnerModule],
  templateUrl: './progress-dialog.component.html',
  styleUrl: './progress-dialog.component.scss',
})
export class ProgressDialogComponent {}
