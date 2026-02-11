/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerRrListComponent } from './repaire-request/customer-rr-list/customer-rr-list.component';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
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
// import { PagesRoutingModule } from '../pages-routing.module';
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
import { SalesOrderListComponent } from './sales-order/sales-order-list/sales-order-list.component';
import { InvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { CustomerProfileComponent } from './profile/customer-profile/customer-profile.component';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { ChangePasswordComponent } from './change-password/change-password/change-password.component';
import { SalesQuotesListComponent } from './quotes/sales-quotes-list/sales-quotes-list.component';
import { CustomerDashboardComponent } from './customer-dashbard/customer-dashboard/customer-dashboard.component';
import { WarrantyListComponent } from './warranty-list/warranty-list.component';
import { CustomerRrEditComponent } from './repaire-request/customer-rr-edit/customer-rr-edit.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { CustomerShippingTrackingComponent } from './customer-shipping-tracking/customer-shipping-tracking.component';
import { CustomerNavRRListComponent } from './customer-nav-rr-list/customer-nav-rr-list.component';
import { GridInvoiceListComponent } from './invoice/grid-invoice-list/grid-invoice-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InvoiceViewComponent } from './common-template/invoice-view/invoice-view.component';
import { ListBlanketBycustomerComponent } from './po-advance/list-blanket-bycustomer/list-blanket-bycustomer.component';
import { ListPoBlanketComponent } from './po-advance/list-po-blanket/list-po-blanket.component';
import { TopHistoryComponent } from './po-advance/top-history/top-history.component';

@NgModule({
  declarations: [CustomerRrListComponent, SalesOrderListComponent, InvoiceListComponent, CustomerProfileComponent, UserProfileComponent,
       ChangePasswordComponent, SalesQuotesListComponent, CustomerDashboardComponent, WarrantyListComponent,CustomerRrEditComponent, CustomerShippingTrackingComponent, CustomerNavRRListComponent, GridInvoiceListComponent,InvoiceViewComponent, ListBlanketBycustomerComponent, ListPoBlanketComponent, TopHistoryComponent,
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
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
    // PagesRoutingModule,
    FormsModule, ReactiveFormsModule,
    DataTablesModule,
    NgbDatepickerModule,
    NgxMaskModule,
    FormsModule, ReactiveFormsModule, Ng5SliderModule, FileUploadModule,
    NgxDaterangepickerMd.forRoot({
      separator: ' - ',
      format: 'MM/DD/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
      displayFormat: 'MM/DD/YYYY', // default is format value
    }),
    RxReactiveFormsModule,
    DigitOnlyModule,
    NgxSpinnerModule,
    AutocompleteLibModule,
    PipesModule,
    SharedModule,
    QRCodeModule,

     
  ],
  providers: [
    ExcelService,
    DatePipe,
    BsModalRef,
    NgxNavigationWithDataComponent
  ],
 
})
export class CustomerModule { }
