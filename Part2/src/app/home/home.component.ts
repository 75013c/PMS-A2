import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  @Input() currentSection = '';
  @Input() totalCategoryCount = 0;
  @Input() totalItemCount = 0;
  @Input() totalQuantityCount = 0;
}