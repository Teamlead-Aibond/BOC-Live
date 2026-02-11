import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryRfidDashboardComponent } from './inventory-rfid-dashboard/inventory-rfid-dashboard.component';
import { InventoryRfidDashboardV1Component } from './inventory-rfid-dashboard-v1/inventory-rfid-dashboard-v1.component';
import { CreateIndentComponent } from './create-indent/create-indent.component';
import { DamageAddComponent } from './damage-add/damage-add.component';
import { DamageListComponent } from './damage-list/damage-list.component';
import { IndentComponent } from './indent/indent.component';
import { InventoryAddComponent } from './inventory-add/inventory-add.component';
import { InventoryDashboardComponent } from './inventory-dashboard/inventory-dashboard.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryViewComponent } from './inventory-view/inventory-view.component';
import { PartTrackingComponent } from './part-tracking/part-tracking.component';
import { ReceiveProductComponent } from './receive-product/receive-product.component';
import { RoomTrackingComponent } from './room-tracking/room-tracking.component';
import { StockInListComponent } from './stock-in/stock-in-list/stock-in-list.component';
import { StockInComponent } from './stock-in/stock-in.component';
import { StockHistoryListComponent } from './stock-out/stock-history-list/stock-history-list.component';
import { StockOutListComponent } from './stock-out/stock-out-list/stock-out-list.component';
import { StockOutComponent } from './stock-out/stock-out.component';
import { TransferProductComponent } from './transfer-product/transfer-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgbTooltipModule, NgbAccordionModule, NgbTabsetModule, NgbDatepickerModule, NgbAlert, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { DataTablesModule } from 'angular-datatables';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { RedZoomModule } from 'ngx-red-zoom';
import { UiSwitchModule } from 'ngx-ui-switch';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { PartTrackingNewComponent } from './part-tracking-new/part-tracking-new.component';
import { InventoryRfidV1Component } from './inventory-rfid-v1/inventory-rfid-v1.component';



@NgModule({
  declarations: [
    InventoryRfidDashboardComponent,
    InventoryRfidDashboardV1Component,
    InventoryListComponent,
    InventoryViewComponent,
    InventoryAddComponent,
    InventoryDashboardComponent,
    StockInComponent,
    StockInListComponent,
    StockOutComponent,
    StockOutListComponent,
    StockHistoryListComponent,
    TransferProductComponent,
    IndentComponent,
    CreateIndentComponent,
    DamageListComponent,
    DamageAddComponent,
    RoomTrackingComponent,
    PartTrackingComponent,
    ReceiveProductComponent,
    PartTrackingNewComponent,
    InventoryRfidV1Component,
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
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
    NgxDaterangepickerMd.forRoot({
      separator: ' - ',
      format: 'MM/DD/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
      displayFormat: 'MM/DD/YYYY', // default is format value
    }),
    RedZoomModule,
    DataTablesModule,
    FileUploadModule,
    NgApexchartsModule,
    NgbModule,
    PipesModule
  ],
  providers: [
    BsModalService
  ]
})
export class InventoryModule { }
