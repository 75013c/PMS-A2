// 24832452 HongyuLiu

import { Component, Input } from '@angular/core';

// Home page component
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  // Controls whether the home section is currently visible
  @Input() currentSection = '';

  // Total number of item categories
  @Input() totalCategoryCount = 0;

  // Total number of inventory records
  @Input() totalItemCount = 0;

  // Total quantity of all inventory items
  @Input() totalQuantityCount = 0;
}