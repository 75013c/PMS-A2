import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InventoryItem } from '../app.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  @Input() currentSection = '';
  @Input() searchMessage = '';
  @Input() searchMessageType = '';
  @Input() searchKeyword = '';
  @Input() searchResultsInfo = '';
  @Input() searchResults: InventoryItem[] = [];

  @Output() searchKeywordChange = new EventEmitter<string>();
  @Output() clearSearchEvent = new EventEmitter<void>();
  @Output() searchItemEvent = new EventEmitter<void>();

  getBadgeClass(status: string): string {
    if (status === 'In Stock') {
      return 'badge-green';
    }

    if (status === 'Low Stock') {
      return 'badge-yellow';
    }

    return 'badge-red';
  }
}