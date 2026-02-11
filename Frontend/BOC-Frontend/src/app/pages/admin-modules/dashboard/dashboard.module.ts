import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { AhDashboardComponent } from './ah-dashboard/ah-dashboard.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { DataTablesModule } from 'angular-datatables';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { AhNewDashboardComponent } from './ah-new-dashboard/ah-new-dashboard.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [
    AhDashboardComponent,
    CustomerDashboardComponent,
    AhNewDashboardComponent,
    
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    DataTablesModule,
    NgbDatepickerModule,
    NgxDaterangepickerMd,
    NgApexchartsModule,
    PipesModule,
    AutocompleteLibModule,
    FormsModule, ReactiveFormsModule,
    CommonModule,
    UIModule,
    SharedModule,
    NgSelectModule,
    NgxSpinnerModule

  ]
})
export class DashboardModule { }
