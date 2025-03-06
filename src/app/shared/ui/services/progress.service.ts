import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProgressDialogComponent } from '../components/progress-dialog/progress-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  dialog = inject(MatDialog);
  dialogRef!: MatDialogRef<ProgressDialogComponent, any>;

  openDialog(): void {
    this.dialogRef = this.dialog.open(ProgressDialogComponent, {
      minWidth: '150px',
      height: '150px',
      disableClose: true,
    });
  }

  closeDialog() {
    if (!this.dialogRef) {
      throw Error("Dialog hasn't been opened");
    }
    this.dialogRef.close();
  }
}
