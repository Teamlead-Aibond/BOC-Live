import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { ReportsComponent } from '../inventory/reports/reports.component';
import { AmazonRawReportComponent } from './customer-reports/amazon-raw-report/amazon-raw-report.component';
import { GmReportComponent } from './customer-reports/gm-report/gm-report.component';
import { InventoryReportsComponent } from './inventory-reports/inventory-reports.component';
import { InvoiceByCustomerReportComponent } from './invoice-reports/invoice-by-customer-report/invoice-by-customer-report.component';
import { InvoiceByPartsComponent } from './invoice-reports/invoice-by-parts/invoice-by-parts.component';
import { InvoiceMonthlyDetailedReportComponent } from './invoice-reports/invoice-monthly-detailed-report/invoice-monthly-detailed-report.component';
import { MonthlyInvoiceReportComponent } from './invoice-reports/monthly-invoice-report/monthly-invoice-report.component';
import { MonthlyPoReportComponent } from './po-reports/monthly-po-report/monthly-po-report.component';
import { PoByItemComponent } from './po-reports/po-by-item/po-by-item.component';
import { PoByVendorReportComponent } from './po-reports/po-by-vendor-report/po-by-vendor-report.component';
import { PoMonthlyDetailedReportComponent } from './po-reports/po-monthly-detailed-report/po-monthly-detailed-report.component';
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
import { SoMonthlyDetailedReportComponent } from './so-reports/so-monthly-detailed-report/so-monthly-detailed-report.component';
import { SoMonthlyReportComponent } from './so-reports/so-monthly-report/so-monthly-report.component';

import { InvoiceMonthlyDetailedReportComponent as InvoiceMonthlyDetailedReportComponentNew } from './invoice-reports/invoice-monthly-detailed-report-new/invoice-monthly-detailed-report.component';
import { MonthlyInvoiceReportComponent as MonthlyInvoiceReportComponentNew } from './invoice-reports/monthly-invoice-report-new/monthly-invoice-report.component';

import { SoMonthlyDetailedReportComponent as SoMonthlyDetailedReportComponentNew } from './so-reports/so-monthly-detailed-report-new/so-monthly-detailed-report.component';
import { SoMonthlyReportComponent as SoMonthlyReportComponentNew } from './so-reports/so-monthly-report-new/so-monthly-report.component';
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
import { SoMonthlyDetailedCurrencyReportComponent } from './so-reports/so-monthly-detailed-currency-report/so-monthly-detailed-currency-report.component';
import { SoMonthlyCurrencyReportComponent } from './so-reports/so-monthly-currency-report/so-monthly-currency-report.component';
import { GmRepairTrackerReportComponent } from './customer-reports/gm-repair-tracker-report/gm-repair-tracker-report.component';
import { DanaOpenOrderReportComponent } from './customer-reports/dana-open-order-report/dana-open-order-report.component';
import { RmaReportComponent } from './rr-reports/rma-report/rma-report.component';

const routes: Routes = [
  { path: '', component: ReportsComponent },
  { path: 'customize-report', component: RrReportsComponent },

  { path: 'RR-MonthlyRepairStatus', component: MonthlyRepairStatusComponent },
  { path: 'RR-FailureTrendAnalysis', component: FailureTrendAnalysisReportComponent },
  { path: 'RR-costofnew', component: CostofnewRrReportComponent },
  { path: 'RR-LPP', component: LppRrReportComponent },
  { path: 'RR-OnTimeDelivery', component: OntimeDeliveryRrReportComponent },
  { path: 'RR-OpenOrder', component: OpenorderRrReportComponent },
  { path: 'RR-ProcessFitness', component: ProcessFitnessReportComponent },
  { path: 'RR-OpenOrderBySupplier', component: OpenorderBySuppplierReportComponent },
  { path: 'RR-OpenOrderBySupplierWithoutVat', component: OpenorderBySuppplierWithoutVatReportComponent },
  { path: 'RR-FollowupReport', component: FollowupReportComponent },
  { path: 'RR-BPIReport', component: BpiReportComponent },
  { path: 'SO-ByCustomer', component: SoByCustomerReportComponent },
  { path: 'SO-ByParts', component: SoByPartsComponent },
  { path: 'SO-Monthly', component: SoMonthlyReportComponent },
  { path: 'PO-Monthly', component: MonthlyPoReportComponent },
  { path: 'PO-ByVendor', component: PoByVendorReportComponent },
  { path: 'PO-ByItem', component: PoByItemComponent },
  { path: 'Invoice-ByCustomer', component: InvoiceByCustomerReportComponent },
  { path: 'Invoice-ByParts', component: InvoiceByPartsComponent },
  { path: 'Invoice-Monthly', component: MonthlyInvoiceReportComponent },
  { path: 'Monthly-Invoice-Report', component: InvoiceMonthlyDetailedReportComponent },
  { path: 'Invoice-Monthly-New', component: MonthlyInvoiceReportComponentNew },
  { path: 'Monthly-Invoice-Report-New', component: InvoiceMonthlyDetailedReportComponentNew },
  { path: 'Monthly-PO-Report', component: PoMonthlyDetailedReportComponent },
  { path: 'Inventory', component: InventoryReportsComponent },
  { path: 'Monthly-SO-Report', component: SoMonthlyDetailedReportComponent },
  { path: 'SO-Monthly-New', component: SoMonthlyReportComponentNew },
  { path: 'Monthly-SO-Report-New', component: SoMonthlyDetailedReportComponentNew },
  { path: 'Amazon-raw-Report', component: AmazonRawReportComponent },
  { path: 'GM-Report', component: GmReportComponent },
  { path: 'dana-cost-saving-Report', component: DanaCostSavingReportComponent },
  { path: 'so-vat-tax-report', component: VatTaxReportComponent },
  { path: 'po-vat-tax-report', component: PoVatTaxReportComponent },
  { path: 'payable-tax-report', component: PayableTaxReportComponent },
  { path: 'reject-report', component: RejectReportComponent },
  { path: 'subtask-report', component: SubTaskReportComponent },
  { path: 'shipvia-report', component: ShipviaReportComponent },
  { path: 'rr-created-by-user-report', component: RRCreatedByUserReportComponent },
  { path: 'Monthly-Invoice-Currency-Report', component: MonthlyInvoiceCurrencyReportComponent },
  { path: 'Monthly-Invoice-Detaliled-Currency-Report', component: MonthlyInvoiceDetailedCurrencyReportComponent },
  { path: 'Report-By-Location', component: ReportByStartingLocationComponent },
  { path: 'Monthly-SO-Currency-Report', component: SoMonthlyCurrencyReportComponent },
  { path: 'Monthly-SO-Detaliled-Currency-Report', component: SoMonthlyDetailedCurrencyReportComponent },
  { path: 'gm-repair-tracker-report', component: GmRepairTrackerReportComponent },
  { path: 'rma-report', component: RmaReportComponent },
  { path: 'dana-open-order-report', component: DanaOpenOrderReportComponent },

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ReportsRoutingModule {
}
