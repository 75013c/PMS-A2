import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-security-analysis',
  templateUrl: './security-analysis.component.html'
})
export class SecurityAnalysisComponent {
  @Input() currentSection = '';
}