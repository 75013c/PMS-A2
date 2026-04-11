import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormDataShape } from '../app.component';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html'
})
export class ManagementComponent {
  @Input() currentSection = '';
  @Input() currentPanel: 'add' | 'update' | 'delete' | '' = '';
  @Input() managementMessage = '';
  @Input() managementMessageType = '';
  @Input() addForm!: FormDataShape;
  @Input() updateForm!: FormDataShape;
  @Input() loadItemName = '';
  @Input() deleteItemName = '';
  @Input() pendingDeleteName = '';

  @Output() loadItemNameChange = new EventEmitter<string>();
  @Output() deleteItemNameChange = new EventEmitter<string>();

  @Output() setPanelEvent = new EventEmitter<'add' | 'update' | 'delete'>();
  @Output() clearAddFormEvent = new EventEmitter<void>();
  @Output() addItemEvent = new EventEmitter<void>();
  @Output() loadItemEvent = new EventEmitter<void>();
  @Output() clearUpdateFormEvent = new EventEmitter<void>();
  @Output() updateItemEvent = new EventEmitter<void>();
  @Output() requestDeleteEvent = new EventEmitter<void>();
  @Output() closeConfirmationEvent = new EventEmitter<void>();
  @Output() confirmDeleteEvent = new EventEmitter<void>();
}