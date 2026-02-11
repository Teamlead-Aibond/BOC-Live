import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepairRequestRoutingModule } from './repair-request-routing.module';
import { RepairRequestAddComponent } from './repair-request-add/repair-request-add.component';
import { RepairRequestListComponent } from './repair-request-list/repair-request-list.component';
import { RepairRequestViewComponent } from './repair-request-view/repair-request-view.component';
import { ViewAllRepairRequestComponent } from './view-all-repair-request/view-all-repair-request.component';
import { RepairRequestStageComponent } from './repair-request-stage/repair-request-stage.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbAccordionModule, NgbDatepickerModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RedZoomModule } from 'ngx-red-zoom';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DataTablesModule } from 'angular-datatables';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { BulkShippingComponent } from './bulk-shipping/bulk-shipping.component';
import { BulkShippingListComponent } from './bulk-shipping-list/bulk-shipping-list.component';
import { ShippingListComponent } from './shipping-list/shipping-list.component';
import { RepairRequestWorkchainListComponent } from './repair-request-workchain-list/repair-request-list.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { BasicRrListComponent } from './basic-rr-list/basic-rr-list.component';
import { RepairRequestPatchComponent } from './repair-request-patch/repair-request-patch.component';
import { RepairRequesPatchtListComponent } from './repair-request-patch-list/repair-request-patch-list.component';

@NgModule({
  declarations: [
    RepairRequestListComponent,
    RepairRequestWorkchainListComponent,
    RepairRequestAddComponent,
    RepairRequestPatchComponent,
    RepairRequestViewComponent,
    ViewAllRepairRequestComponent,
    RepairRequestStageComponent,
    BulkShippingComponent,
    BulkShippingListComponent,
    ShippingListComponent,
    BasicRrListComponent,
    RepairRequesPatchtListComponent,    
  ],
  imports: [
    CommonModule,
    RepairRequestRoutingModule,
    UIModule,
    UiSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    NgSelectModule,
    NgbTooltipModule,
    NgbAccordionModule,
    NgbTabsetModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    NgxDaterangepickerMd.forRoot({
      separator: ' - ',
      format: 'MM/DD/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
      displayFormat: 'MM/DD/YYYY', // default is format value
    }),
    RedZoomModule,
    DataTablesModule,
    FileUploadModule,
    AutocompleteLibModule,
    PipesModule,
    NgbDropdownModule,

  ],
  providers: [
    BsModalRef,
  ]
})
export class RepairRequestModule { }
