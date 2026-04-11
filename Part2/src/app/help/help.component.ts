// Student ID and name
// 24832452 HongyuLiu

import { Component, Input } from '@angular/core';

// Help page component
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
})
export class HelpComponent {
  // Controls whether the help section is currently visible
  @Input() currentSection = '';
}