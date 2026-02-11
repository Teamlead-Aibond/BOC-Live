/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderPdfComponent } from './orders/purchase-order-pdf/purchase-order-pdf.component';
import { PackingSlipComponent } from './quotes/packing-slip/packing-slip.component';
import { SearchResultComponent } from '../../shared/search-result/search-result.component';
import { CustomerAddComponent } from './customer/customer-add/customer-add.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { VendorAddComponent } from './vendor/vendor-add/vendor-add.component';
import { VendorEditComponent } from './vendor/vendor-edit/vendor-edit.component';
import { VendorViewComponent } from './vendor/vendor-view/vendor-view.component';
import { VendorScoreboardComponent } from './vendor/vendor-scoreboard/vendor-scoreboard.component';
import { AdminListComponent } from './admin/admin-list/admin-list.component';
import { AdminTableListComponent } from './admin/admin-table-list/admin-table-list.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { AssignPartsComponent } from './customer/assign-parts/assign-parts.component';
import { InvoicePdfComponent } from './invoice/invoice-pdf/invoice-pdf.component';
import { EditInvoiceComponent } from './invoice/edit-invoice/edit-invoice.component';
import { InvoiceSalesOrderComponent } from './invoice/invoice-sales-order/invoice-sales-order.component';
import { InvoicePurchaseOrderComponent } from './invoice/invoice-purchase-order/invoice-purchase-order.component';
import { AllSalesOrderComponent } from './invoice/all-sales-order/all-sales-order.component';
import { CustomerViewComponent } from './customer/customer-view/customer-view.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { SettingsComponent } from './settings/settings.component';
import { QuoteToCustomerComponent } from './quotes/quote-to-customer/quote-to-customer.component';
import { SalesQuotesListComponent } from './quotes/sales-quotes-list/sales-quotes-list.component';
import { SalesQuotesAddComponent } from './quotes/sales-quotes-add/sales-quotes-add.component';
import { SalesQuotesEditComponent } from './quotes/sales-quotes-edit/sales-quotes-edit.component';
import { SalesOrderEditComponent } from './orders/sales-order-edit/sales-order-edit.component';
import { SalesOrderPdfComponent } from './orders/sales-order-pdf/sales-order-pdf.component';
import { PurchaseOrderEditComponent } from './orders/purchase-order-edit/purchase-order-edit.component';
import { ListPurchaseOrderComponent } from './orders/list-purchase-order/list-purchase-order.component';
import { ListInvoiceComponent } from './invoice/list-invoice/list-invoice.component';
import { VendorInvoiceListComponent } from './invoice/vendor-invoice-list/vendor-invoice-list.component';
import { EditVendorInvoiceComponent } from './invoice/edit-vendor-invoice/edit-vendor-invoice.component';
import { CountriesListComponent } from './countries/countries-list/countries-list.component';
import { TermsListComponent } from './terms/terms-list/terms-list.component';
import { TermsCreateComponent } from './terms/terms-create/terms-create.component';
import { StateListComponent } from './state/state-list/state-list.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgxChartistModule } from 'ngx-chartist';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { WarehouseListComponent } from './warehouse/warehouse-list/warehouse-list.component';
import { BuildingListComponent } from './warehouse/building-list/building-list.component';
import { RoomListComponent } from './warehouse/room-list/room-list.component';
import { RowListComponent } from './warehouse/row-list/row-list.component';
import { ShelfListComponent } from './warehouse/shelf-list/shelf-list.component';
import { RfIdIntegrationComponent } from './rfid-integration/rfid-integration.component';
// import { RFIDTrackingComponent } from './rfid-tracking/rfid-tracking.component';
import { InventorySettingsComponent } from './inventory/inventory-settings/inventory-settings.component';
import { UpsSoapComponent } from './ups/ups-soap/ups-soap.component';
import { UpsAddressComponent } from './ups/ups-address/ups-address.component';
import { UpsCancelComponent } from './ups/ups-cancel/ups-cancel.component';
import { RepairAndSavingsReportComponent } from './inventory/repair-and-savings-report/repair-and-savings-report.component';
import { TotalPartListComponent } from './total-part-list/total-part-list.component';
import { TotalPartListStoreComponent } from './total-part-list-store/total-part-list-store.component';
import { PartsEditComponent } from './parts-edit/parts-edit.component';
import { PartsEditShopComponent } from './parts-edit-shop/parts-edit-shop.component';
import { MroAddComponent } from './mro/mro-add/mro-add.component';
import { MroListComponent } from './mro/mro-list/mro-list.component';
import { MroEditComponent } from './mro/mro-edit/mro-edit.component';
import { PartViewComponent } from './part-view/part-view.component';
import { PartViewShopComponent } from './part-view-shop/part-view-shop.component';
import { ListQuotesComponent } from './quotes/list-quotes/list-quotes.component';
import { ListSoComponent } from './orders/list-so/list-so.component';
import { ListPoComponent } from './orders/list-po/list-po.component';
import { InvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { ListVendorInvoiceComponent } from './invoice/list-vendor-invoice/list-vendor-invoice.component';
import { ImportPartsComponent } from './total-part-list/import-parts/import-parts.component';
import { AddMroComponent } from './mro/add-mro/add-mro.component';
import { EditMroComponent } from './mro/edit-mro/edit-mro.component';
import { AddSoComponent } from './orders/add-so/add-so.component';
import { AddPoComponent } from './orders/add-po/add-po.component';
import { AddInvoiceComponent } from './invoice/add-invoice/add-invoice.component';
import { AddVendorBillComponent } from './invoice/add-vendor-bill/add-vendor-bill.component';
import { DemoMroEditComponent } from './mro/demo-mro-edit/demo-mro-edit.component';
import { BlanketPoListComponent } from './advance-po/blanket-po-list/blanket-po-list.component';
import { PoReportComponent } from './advance-po/po-report/po-report.component';
import { SoBlanketListComponent } from './advance-po/so-blanket-list/so-blanket-list.component';
import { BlanketAddComponent } from './advance-po/blanket-add/blanket-add.component';
import { BlanketEditComponent } from './advance-po/blanket-edit/blanket-edit.component';
import { BlanketPoHistoryComponent } from './advance-po/blanket-po-history/blanket-po-history.component';
import { BlanketPoTopComponent } from './advance-po/blanket-po-top/blanket-po-top.component';
import { BlanketPoEdit2Component } from './advance-po/blanket-po-edit2/blanket-po-edit2.component';
import { BlanketPoExcludedPartsListComponent } from './advance-po/blanket-po-excluded-parts-list/blanket-po-excluded-parts-list.component';
import { MultiCurrencyMasterComponent } from './multi-currency-master/multi-currency-master.component';
import { CurrencyExchangeRateListComponent } from './currency-exchange-rate-list/currency-exchange-rate-list.component';
import { PartsVatCustomizationComponent } from './parts-vat-customization/parts-vat-customization.component';
import { ManageRRSubStatusListComponent } from './manage-rr-sub-status-list/manage-rr-sub-status-list.component';
import { ManagePartLocationListComponent } from './manage-part-location-list/manage-part-location-list.component';
import { ConsolidateInvoiceListComponent } from './invoice/consolidate-invoice-list/consolidate-invoice-list.component';
import { AddConsolidateInvoiceComponent } from './invoice/add-consolidate-invoice/add-consolidate-invoice.component';
import { ViewInvoiceConsolidateComponent } from './invoice/view-invoice-consolidate/view-invoice-consolidate.component';
import { EditConsolidateInvoiceComponent } from './invoice/edit-consolidate-invoice/edit-consolidate-invoice.component';
import { InvoiceEDIListComponent } from './invoice/invoice-edi-list/invoice-edi-list.component';
import { UserLoginLoglistComponent } from './user-login-loglist/user-login-loglist.component';
import { EmployeeListComponent } from './employee/employee-list.component';
import { EmployeeResponsibilityComponent } from './employee/employee-responsibility/employee-responsibility.component';
import { ProductListComponent } from './shop/product-list/product-list.component';
import { ProductSingleComponent } from './shop/product-single/product-single.component';
import { CartComponent } from './shop/cart/cart.component';
import { CheckoutComponent } from './shop/checkout/checkout.component';
import { OrderSuccessComponent } from './shop/order-success/order-success.component';
import { RequestAQuoteComponent } from './shop/request-a-quote/request-a-quote.component';
import { ViewOrderHistoryComponent } from './shop/view-order-history/view-order-history.component';
import { OrderHistoryComponent } from './shop/order-history/order-history.component';
import { ListRequestAQuoteComponent } from './shop/list-request-a-quote/list-request-a-quote.component';
import { StoreLocationComponent } from './store-location/store-location.component';
import { CustomerGroupComponent } from './customer-group/customer-group.component';
import { ShopDashboardComponent } from './shop/shop-dashboard/shop-dashboard.component';
import { RrVendorQuoteAttachmentListComponent } from './admin/rr-vendor-quote-attachment-list/rr-vendor-quote-attachment-list.component';
import { RrVendorQuoteAttachmentSelectedListComponent } from './admin/rr-vendor-quote-attachment-selected-list/rr-vendor-quote-attachment-selected-list.component';
import { FordPartlistComponent } from './ford-partlist/ford-partlist.component';
const routes: Routes = [
  { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'repair-request', loadChildren: () => import('./repair-request/repair-request.module').then(m => m.RepairRequestModule) },
  { path: 'inventory', loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule) },
  { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  { path: 'rr-vendorquote-attachmentlist', component: RrVendorQuoteAttachmentListComponent },
  { path: 'rr-vendorquote-attachment-selected-list/:id', component: RrVendorQuoteAttachmentSelectedListComponent },

  { path: 'purchaseorder-pdf', component: PurchaseOrderPdfComponent },
  { path: 'packing-slip', component: PackingSlipComponent },
  { path: 'search-result', component: SearchResultComponent },

  { path: 'repair-savings-report', component: RepairAndSavingsReportComponent }, 

  { path: 'customer/add', component: CustomerAddComponent }, // 
  { path: 'customer/edit', component: CustomerEditComponent },//
  { path: 'vendor-list', component: VendorListComponent },//
  { path: 'vendor-add', component: VendorAddComponent },  //
  { path: 'vendor/edit', component: VendorEditComponent }, //
  { path: 'vendor-view', component: VendorViewComponent },
  { path: 'vendor-scoreboard', component: VendorScoreboardComponent }, //

  {
    path: 'vendor/list', component: VendorListComponent, data: {
      shouldReuse: true,
      key: 'vendor-list'
    }
  },
  { path: 'vendor/add', component: VendorAddComponent },
  { path: 'vendor/view', component: VendorViewComponent }, //


  {
    path: 'list', component: AdminListComponent, data: {
      shouldReuse: true,
      key: 'admin-list'     //
    }
  },
  { path: 'admin-table-list', component: AdminTableListComponent }, //
  {
    path: 'customer/list', component: CustomerListComponent, data: {
      shouldReuse: true,
      key: 'customer-list'  //  
    }
  },
  { path: 'customer/assign-parts', component: AssignPartsComponent }, //  


  { path: 'invoice/pdf', component: InvoicePdfComponent },//
  { path: 'invoice/edit', component: EditInvoiceComponent },  //
  { path: 'invoice/salesorder', component: InvoiceSalesOrderComponent }, //
  { path: 'invoice/purchaseorder', component: InvoicePurchaseOrderComponent },//
  { path: 'orders/sales-list', component: AllSalesOrderComponent }, //

  { path: 'customer/view', component: CustomerViewComponent },///


  { path: 'admin-settings', component: AdminSettingsComponent }, //
  { path: 'settings', component: SettingsComponent }, //
  { path: 'sales-quote-pdf', component: QuoteToCustomerComponent }, //
  // { path: 'quotes/quote-print', component: QuotePrintComponent },
  // { path: 'quotes/po-print', component: PurchaseOrderPrintComponent },

  {
    path: 'sales-quote/list', component: SalesQuotesListComponent, data: {  //
      shouldReuse: true,
      key: 'sq-list'
    }
  },
  { path: 'sales-quote/add', component: SalesQuotesAddComponent },  //
  { path: 'sales-quote/edit', component: SalesQuotesEditComponent }, //
  { path: 'sales-order/edit', component: SalesOrderEditComponent }, //
  { path: 'sales-order/pdf', component: SalesOrderPdfComponent }, //
  { path: 'purchase-order/edit', component: PurchaseOrderEditComponent }, //
  { path: 'sales-order/add', component: AddSoComponent }, //
  { path: 'purchase-order/add', component: AddPoComponent }, //

  { path: 'orders/purchase-list', component: ListPurchaseOrderComponent },//
  {
    path: 'invoice/list', component: ListInvoiceComponent, data: {  //
      shouldReuse: true,
      key: 'po-list'
    }
  },
  {
    path: 'invoice/vendor-invoice-list', component: VendorInvoiceListComponent, data: { //
      shouldReuse: true,
      key: 'vi-list'
    }
  },
  { path: 'invoice/vendor-invoice-edit', component: EditVendorInvoiceComponent }, //
  { path: 'invoice/invoice-add', component: AddInvoiceComponent },  //
  { path: 'invoice/vendor-bill-add', component: AddVendorBillComponent }, //

  { path: 'user-roles/list', component: UserRolesComponent }, //

  { path: 'countries/list', component: CountriesListComponent }, //


  { path: 'terms/list', component: TermsListComponent }, //
  { path: 'terms/create', component: TermsCreateComponent }, //

  { path: 'state/list', component: StateListComponent },  //
  { path: 'parts-vat_tax-customization', component: PartsVatCustomizationComponent }, //


  { path: 'change_password', component: ChangePasswordComponent }, //
  { path: 'profile-update', component: UserProfileComponent },//

  { path: 'warehouse_list', component: WarehouseListComponent },//
  { path: 'building_list', component: BuildingListComponent },//
  { path: 'room_list', component: RoomListComponent },  //
  { path: 'row_list', component: RowListComponent },  //
  { path: 'manage_shelf', component: ShelfListComponent },//

  // For RFID Integration
  { path: 'rfid', component: RfIdIntegrationComponent },//
  // { path:'inventory/control', component: RFIDTrackingComponent},
  { path: 'inventory-settings', component: InventorySettingsComponent }, //
  { path: 'ups', component: UpsSoapComponent }, //
  { path: 'ups-address', component: UpsAddressComponent },  //
  { path: 'ups-cancel', component: UpsCancelComponent }, //
  { path: 'total-PartsList', component: TotalPartListComponent }, //
  { path: 'PartsList-amazonstore', component: TotalPartListStoreComponent },//
  { path: 'PartsList-fordstore', component: FordPartlistComponent }, //
  { path: 'parts-edit', component: PartsEditComponent, }, //
  { path: 'parts-add', component: PartsEditComponent, }, //
  { path: 'shop-parts-edit', component: PartsEditShopComponent, }, //
  { path: 'shop-parts-add', component: PartsEditShopComponent, }, //

  { path: 'parts-view', component: PartViewComponent },//
  { path: 'shop-parts-view', component: PartViewShopComponent },//

  { path: 'parts-import', component: ImportPartsComponent },//
  { path: 'currency-list', component: MultiCurrencyMasterComponent },//
  { path: 'currency-exchange-rate-list', component: CurrencyExchangeRateListComponent }, //




  {
    path: 'mro/list', component: MroListComponent, data: {  //
      shouldReuse: true,
      key: 'mro-list'
    },
  },
  { path: 'mro/add', component: AddMroComponent },//
  { path: 'mro/edit', component: EditMroComponent },  //

  { path: 'Quotes-List', component: ListQuotesComponent },//
  { path: 'SO-Order-List', component: ListSoComponent },  //
  { path: 'PO-Order-List', component: ListPoComponent },//
  { path: 'Invoice-List', component: InvoiceListComponent },  //
  { path: 'VendorBill-List', component: ListVendorInvoiceComponent },//
  { path: 'Blanket-PO-List', component: BlanketPoListComponent },//
  { path: 'PO-Report-List', component: PoReportComponent },//
  { path: 'SO-Report-List', component: SoBlanketListComponent }, //
  { path: 'Add-Blanket-PO', component: BlanketAddComponent }, //
  { path: 'Blanket-PO-Edit', component: BlanketEditComponent }, //
  { path: 'Blanket-PO-History', component: BlanketPoHistoryComponent },//
  { path: 'REPLENISH-Blanket-PO', component: BlanketPoTopComponent },//
  { path: 'Blanket-PO-Edit1', component: BlanketPoEdit2Component }, //
  { path: 'Blanket-PO-Excluded-Parts', component: BlanketPoExcludedPartsListComponent }, //
  { path: 'Sub-Status', component: ManageRRSubStatusListComponent },//
  { path: 'Part-Location', component: ManagePartLocationListComponent },//
  { path: 'ConsolidateInvoice-List', component: ConsolidateInvoiceListComponent },//
  { path: 'ConsolidateInvoice-Add', component: AddConsolidateInvoiceComponent }, //
  { path: 'ConsolidateInvoice-View', component: ViewInvoiceConsolidateComponent },//
  { path: 'ConsolidateInvoice-Edit', component: EditConsolidateInvoiceComponent }, //
  { path: 'EDI-Log', component: InvoiceEDIListComponent }, //
  { path: 'Login-LogList', component: UserLoginLoglistComponent }, //
  { path: 'Employee-List', component: EmployeeListComponent }, //
  { path: 'Employee-Responsibility-List', component: EmployeeResponsibilityComponent }, //
  { path: 'shop/product-list', component: ProductListComponent }, //
  // { path: 'shop/product-single', component: ProductSingleComponent },
  { path: 'shop/product-single/:id/:ShopPartItemId', component: ProductSingleComponent }, //
  { path: 'shop/dashboard', component: ShopDashboardComponent }, //
  { path: 'shop/cart', component: CartComponent }, //
  { path: 'shop/checkout', component: CheckoutComponent }, //
  { path: 'shop/order-success', component: OrderSuccessComponent },//
  { path: 'shop/request-a-quote', component: RequestAQuoteComponent },//
  { path: 'shop/list-request-a-quote', component: ListRequestAQuoteComponent },//
  { path: 'shop/order-history', component: OrderHistoryComponent }, //
  { path: 'shop/view-order-history/:id', component: ViewOrderHistoryComponent }, //
  { path: 'store-location', component: StoreLocationComponent }, //
  { path: 'customer-group', component: CustomerGroupComponent } //



];

@NgModule({
  imports: [NgxChartistModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

