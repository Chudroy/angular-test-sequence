import { AbstractControl, ValidationErrors } from '@angular/forms';

export function artistIdValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (control.value === null || control.value === undefined) {
    return null;
  }

  // Cast the value to a number.
  const artistId = Number(control.value);

  // Check if the value is not a number, zero, or a negative number.
  if (isNaN(artistId) || artistId <= 0) {
    return { invalidArtist: 'Artist selection must be a positive number' };
  }

  return null;
}
