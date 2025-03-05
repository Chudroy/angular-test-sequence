import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-skeleton',
  imports: [MatCardModule],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {
  skeletons = input.required<number>();

  skeletonArray = computed(() => {
    const array = new Array(this.skeletons());

    return array;
  });
}
