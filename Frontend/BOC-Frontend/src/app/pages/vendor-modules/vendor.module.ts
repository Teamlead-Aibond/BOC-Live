/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VendorRoutingModule } from './vendor-routing.module';
import { VendorRrListComponent } from './repair-request/vendor-rr-list/vendor-rr-list.component';
import { ModalModule, BsModalRef } from 'ngx-bootstrap';
import { RedZoomModule } from 'ngx-red-zoom';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxEditorModule } from 'ngx-editor';
import { NgbTypeaheadModule, NgbPaginationModule, NgbModule, NgbTooltipModule, NgbDropdownModule, NgbTabsetModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UiSwitchModule } from 'ngx-ui-switch';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { DashboardsModule } from '../dashboards/dashboards.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgxMaskModule } from 'ngx-mask';
import { Ng5SliderModule } from 'ng5-slider';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { QRCodeModule } from 'angularx-qrcode';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ExcelService } from 'src/app/core/services/excel.service';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { RepairRequestEditComponent } from './repair-request/repair-request-edit/repair-request-edit.component';
import { PurchaseOrderListComponent } from './purchase-order/purchase-order-list/purchase-order-list.component';
import { VendorInvoiceComponent } from './vendor-bill/vendor-invoice/vendor-invoice.component';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { VendorProfileComponent } from './profile/vendor-profile/vendor-profile.component';
import { ChangePasswordComponent } from './change-password/change-password/change-password.component';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard/vendor-dashboard.component';
import { WarrantyComponent } from './warranty/warranty.component';
import { ChartsModule } from 'ng2-charts';
import { NgxChartistModule } from 'ngx-chartist';
import { RushRepairListComponent } from './repair-request/rush-repair-list/rush-repair-list.component';
import { VendorWarrantyRepairListComponent } from './repair-request/vendor-warranty-repair-list/vendor-warranty-repair-list.component';
import { RRListComponent } from './repair-request/rr-list/rr-list.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { VendorShippingTrackingComponent } from './vendor-shipping-tracking/vendor-shipping-tracking.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { VendorPortalListPoComponent } from './vendor-portal-list-po/vendor-portal-list-po.component';
import { VendorPortalVendorbillListComponent } from './vendor-bill/vendor-portal-vendorbill-list/vendor-portal-vendorbill-list.component';



@NgModule({
  declarations: [VendorRrListComponent, PurchaseOrderListComponent, VendorInvoiceComponent, UserProfileComponent, VendorProfileComponent,
    ChangePasswordComponent, VendorDashboardComponent, WarrantyComponent,
    RepairRequestEditComponent,
    RushRepairListComponent,
    VendorWarrantyRepairListComponent,
    RRListComponent,
    VendorShippingTrackingComponent,
    VendorPortalListPoComponent,
    VendorPortalVendorbillListComponent
  ],
  imports: [
    CommonModule,
    NgxChartistModule,
    VendorRoutingModule,
    ModalModule.forRoot(),
    RedZoomModule,
    NgxImageZoomModule,
    NgSelectModule,
    NgxEditorModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    NgbModule,
    NgbTooltipModule,
    Ng2SearchPipeModule,
    UiSwitchModule,
    CommonModule,
    NgSelectModule,
    NgbDropdownModule,
    NgbTabsetModule,
    UIModule,
    DashboardsModule,
    NgApexchartsModule,
    NgSelectModule,
    FormsModule, ReactiveFormsModule,
    DataTablesModule,
    NgbDatepickerModule,
    NgxMaskModule,
    FormsModule, ReactiveFormsModule, Ng5SliderModule, FileUploadModule, ChartsModule,
    NgxDaterangepickerMd.forRoot({
      separator: ' - ',
      format: 'MM/DD/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
      displayFormat: 'MM/DD/YYYY', // default is format value
    }),
    QRCodeModule,
    RxReactiveFormsModule,
    DigitOnlyModule,
    NgxSpinnerModule,
    AutocompleteLibModule,
    PipesModule,
    SharedModule
  ],


  providers: [
    ExcelService,
    DatePipe,
    BsModalRef,
    NgxNavigationWithDataComponent
  ],

  
})
export class VendorModule { }
