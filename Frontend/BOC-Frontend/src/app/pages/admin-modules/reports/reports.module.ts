import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from '../inventory/reports/reports.component';
import { InventoryReportsComponent } from './inventory-reports/inventory-reports.component';
import { InvoiceByCustomerReportComponent } from './invoice-reports/invoice-by-customer-report/invoice-by-customer-report.component';
import { InvoiceByPartsComponent } from './invoice-reports/invoice-by-parts/invoice-by-parts.component';
import { MonthlyInvoiceReportComponent } from './invoice-reports/monthly-invoice-report/monthly-invoice-report.component';
import { MonthlyPoReportComponent } from './po-reports/monthly-po-report/monthly-po-report.component';
import { PoByItemComponent } from './po-reports/po-by-item/po-by-item.component';
import { PoByVendorReportComponent } from './po-reports/po-by-vendor-report/po-by-vendor-report.component';
import { BpiReportComponent } from './rr-reports/bpi-report/bpi-report.component';
import { CostofnewRrReportComponent } from './rr-reports/costofnew-rr-report/costofnew-rr-report.component';
import { FailureTrendAnalysisReportComponent } from './rr-reports/failure-trend-analysis-report/failure-trend-analysis-report.component';
import { FollowupReportComponent } from './rr-reports/followup-report/followup-report.component';
import { LppRrReportComponent } from './rr-reports/lpp-rr-report/lpp-rr-report.component';
import { MonthlyRepairStatusComponent } from './rr-reports/monthly-repair-status/monthly-repair-status.component';
import { OntimeDeliveryRrReportComponent } from './rr-reports/ontime-delivery-rr-report/ontime-delivery-rr-report.component';
import { OpenorderBySuppplierReportComponent } from './rr-reports/openorder-by-suppplier-report/openorder-by-suppplier-report.component';
import { OpenorderBySuppplierWithoutVatReportComponent } from './rr-reports/openorder-by-suppplier-without-vat-report/openorder-by-suppplier-without-vat-report.component';
import { OpenorderRrReportComponent } from './rr-reports/openorder-rr-report/openorder-rr-report.component';
import { ProcessFitnessReportComponent } from './rr-reports/process-fitness-report/process-fitness-report.component';
import { RrReportsComponent } from './rr-reports/rr-reports.component';
import { SoByCustomerReportComponent } from './so-reports/so-by-customer-report/so-by-customer-report.component';
import { SoByPartsComponent } from './so-reports/so-by-parts/so-by-parts.component';
import { SoMonthlyReportComponent } from './so-reports/so-monthly-report/so-monthly-report.component';
import { SidebarModule } from 'ng-sidebar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { DataTablesModule } from 'angular-datatables';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { InvoiceMonthlyDetailedReportComponent } from './invoice-reports/invoice-monthly-detailed-report/invoice-monthly-detailed-report.component';
import { PoMonthlyDetailedReportComponent } from './po-reports/po-monthly-detailed-report/po-monthly-detailed-report.component';
import { SoMonthlyDetailedReportComponent } from './so-reports/so-monthly-detailed-report/so-monthly-detailed-report.component';
import { AmazonRawReportComponent } from './customer-reports/amazon-raw-report/amazon-raw-report.component';
import { GmReportComponent } from './customer-reports/gm-report/gm-report.component';

import { InvoiceMonthlyDetailedReportComponent as InvoiceMonthlyDetailedReportComponentNew } from './invoice-reports/invoice-monthly-detailed-report-new/invoice-monthly-detailed-report.component';
import { MonthlyInvoiceReportComponent as MonthlyInvoiceReportComponentNew } from './invoice-reports/monthly-invoice-report-new/monthly-invoice-report.component';

import { SoMonthlyReportComponent as SoMonthlyReportComponentNew } from './so-reports/so-monthly-report-new/so-monthly-report.component';
import { SoMonthlyDetailedReportComponent as SoMonthlyDetailedReportComponentNew } from './so-reports/so-monthly-detailed-report-new/so-monthly-detailed-report.component';
import { DanaCostSavingReportComponent } from './customer-reports/dana-cost-saving-report/dana-cost-saving-report.component';
import { VatTaxReportComponent } from './vat-tax-report/vat-tax-report.component';
import { PoVatTaxReportComponent } from './po-vat-tax-report/po-vat-tax-report.component';
import { PayableTaxReportComponent } from './payable-tax-report/payable-tax-report.component';
import { RejectReportComponent } from './reject-report/reject-report.component';
import { SubTaskReportComponent } from './sub-task-report/sub-task-report.component';
import { ShipviaReportComponent } from './shipvia-report/shipvia-report.component';
import { RRCreatedByUserReportComponent } from './rr-created-by-user-report/rr-created-by-user-report.component';
import { MonthlyInvoiceCurrencyReportComponent } from './invoice-reports/monthly-invoice-currency-report/monthly-invoice-currency-report.component';
import { MonthlyInvoiceDetailedCurrencyReportComponent } from './invoice-reports/monthly-invoice-detailed-currency-report/monthly-invoice-detailed-currency-report.component';
import { ReportByStartingLocationComponent } from './report-by-starting-location/report-by-starting-location.component';
import { SoMonthlyCurrencyReportComponent } from './so-reports/so-monthly-currency-report/so-monthly-currency-report.component';
import { SoMonthlyDetailedCurrencyReportComponent } from './so-reports/so-monthly-detailed-currency-report/so-monthly-detailed-currency-report.component';
import { GmRepairTrackerReportComponent } from './customer-reports/gm-repair-tracker-report/gm-repair-tracker-report.component';
import { RmaReportComponent } from './rr-reports/rma-report/rma-report.component';
import { DanaOpenOrderReportComponent } from './customer-reports/dana-open-order-report/dana-open-order-report.component';
@NgModule({
  declarations: [
    ReportsComponent,
    RrReportsComponent,
    MonthlyRepairStatusComponent,
    FailureTrendAnalysisReportComponent,
    CostofnewRrReportComponent,
    LppRrReportComponent,
    OntimeDeliveryRrReportComponent,
    OpenorderRrReportComponent,
    ProcessFitnessReportComponent,
    OpenorderBySuppplierReportComponent,
    OpenorderBySuppplierWithoutVatReportComponent,
    FollowupReportComponent,
    BpiReportComponent,
    SoByCustomerReportComponent,
    SoByPartsComponent,
    SoMonthlyReportComponent,
    MonthlyPoReportComponent,
    PoByVendorReportComponent,
    PoByItemComponent,
    InvoiceByCustomerReportComponent,
    InvoiceByPartsComponent,
    MonthlyInvoiceReportComponent,
    InventoryReportsComponent,
    InvoiceMonthlyDetailedReportComponent,
    PoMonthlyDetailedReportComponent,
    SoMonthlyDetailedReportComponent,
    AmazonRawReportComponent,
    GmReportComponent,
    InvoiceMonthlyDetailedReportComponentNew,
    MonthlyInvoiceReportComponentNew,
    SoMonthlyReportComponentNew,
    SoMonthlyDetailedReportComponentNew,
    DanaCostSavingReportComponent,
    VatTaxReportComponent,
    PoVatTaxReportComponent,
    PayableTaxReportComponent,
    RejectReportComponent,
    SubTaskReportComponent,
    ShipviaReportComponent,
    RRCreatedByUserReportComponent,
    MonthlyInvoiceCurrencyReportComponent,
    MonthlyInvoiceDetailedCurrencyReportComponent,
    ReportByStartingLocationComponent,
    SoMonthlyCurrencyReportComponent,
    SoMonthlyDetailedCurrencyReportComponent,
    GmRepairTrackerReportComponent,
    RmaReportComponent,
    DanaOpenOrderReportComponent,

  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    DataTablesModule,
    NgbDatepickerModule,
    NgxDaterangepickerMd,
    NgApexchartsModule,
    SidebarModule,
    NgSelectModule,
    AutocompleteLibModule,
    NgbModule,
    PipesModule
  ]
})
export class ReportsModule { }
