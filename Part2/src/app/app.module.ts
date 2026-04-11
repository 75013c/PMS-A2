// 24832452 HongyuLiu

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SecurityAnalysisComponent } from './security-analysis/security-analysis.component';
import { HelpComponent } from './help/help.component';
import { ManagementComponent } from './management/management.component';
import { SearchComponent } from './search/search.component';
import { InventoryComponent } from './inventory/inventory.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SecurityAnalysisComponent,
    HelpComponent,
    ManagementComponent,
    SearchComponent,
    InventoryComponent
  ],
  imports: [BrowserModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}