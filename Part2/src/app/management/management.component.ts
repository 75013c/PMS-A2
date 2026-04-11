// 24832452 HongyuLiu

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormDataShape } from '../app.component';

// Management section component
@Component({
  selector: 'app-management',
  templateUrl: './management.component.html'
})
export class ManagementComponent {
  // Controls whether the management section is currently visible
  @Input() currentSection = '';

  // Controls which management panel is currently visible
  @Input() currentPanel: 'add' | 'update' | 'delete' | '' = '';

  // Message content shown in the management section
  @Input() managementMessage = '';

  // Message type used to control management message styling
  @Input() managementMessageType = '';

  // Form model for adding a new item
  @Input() addForm!: FormDataShape;

  // Form model for updating an existing item
  @Input() updateForm!: FormDataShape;

  // Item name used to load an item into the update form
  @Input() loadItemName = '';

  // Item name used for delete lookup
  @Input() deleteItemName = '';

  // Item name currently waiting for delete confirmation
  @Input() pendingDeleteName = '';

  // Event emitted when the load item name changes
  @Output() loadItemNameChange = new EventEmitter<string>();

  // Event emitted when the delete item name changes
  @Output() deleteItemNameChange = new EventEmitter<string>();

  // Event emitted to switch the visible management panel
  @Output() setPanelEvent = new EventEmitter<'add' | 'update' | 'delete'>();

  // Event emitted to clear the add form
  @Output() clearAddFormEvent = new EventEmitter<void>();

  // Event emitted to add a new item
  @Output() addItemEvent = new EventEmitter<void>();

  // Event emitted to load an item for editing
  @Output() loadItemEvent = new EventEmitter<void>();

  // Event emitted to clear the update form
  @Output() clearUpdateFormEvent = new EventEmitter<void>();

  // Event emitted to update an existing item
  @Output() updateItemEvent = new EventEmitter<void>();

  // Event emitted to begin the delete process
  @Output() requestDeleteEvent = new EventEmitter<void>();

  // Event emitted to close the delete confirmation dialog
  @Output() closeConfirmationEvent = new EventEmitter<void>();

  // Event emitted to confirm deletion of an item
  @Output() confirmDeleteEvent = new EventEmitter<void>();
}