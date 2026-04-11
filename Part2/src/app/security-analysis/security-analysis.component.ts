// 24832452 HongyuLiu

import { Component, Input } from '@angular/core';

// Security analysis page component
@Component({
  selector: 'app-security-analysis',
  templateUrl: './security-analysis.component.html'
})
export class SecurityAnalysisComponent {
  // Controls whether the security analysis section is currently visible
  @Input() currentSection = '';
}