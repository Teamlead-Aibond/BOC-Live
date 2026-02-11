import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';
import { SearchResultComponent } from './search-result/search-result.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbDatepickerModule, NgbTooltipModule, NgbTabsetModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FileSaverModule } from 'ngx-filesaver';
import { PagesRoutingModule } from '../pages/pages-routing.module';
import { PipesModule } from './pipes/pipes.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    SearchResultComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    NgbTabsetModule,
    NgxSpinnerModule,
    NgbPaginationModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    FileSaverModule,
    PipesModule
  ],
})
export class SharedModule { }
