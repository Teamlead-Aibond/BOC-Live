/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerAddComponent } from './customer/customer-add/customer-add.component';
import { CustomerViewComponent } from './customer/customer-view/customer-view.component';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { VendorAddComponent } from './vendor/vendor-add/vendor-add.component';
import { VendorViewComponent } from './vendor/vendor-view/vendor-view.component';
import { AdminListComponent } from './admin/admin-list/admin-list.component';
//import { RepairRequestEditComponent } from './repair-request/repair-request-edit/repair-request-edit.component';
//import { RepairRequestEditTabComponent } from './repair-request/repair-request-edit-tab/repair-request-edit-tab.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { SalesQuotesListComponent } from './quotes/sales-quotes-list/sales-quotes-list.component';
import { SalesQuotesEditComponent } from './quotes/sales-quotes-edit/sales-quotes-edit.component';
import { SalesOrderEditComponent } from './orders/sales-order-edit/sales-order-edit.component';
import { PurchaseOrderEditComponent } from './orders/purchase-order-edit/purchase-order-edit.component';
//import { RepairRequestEditStatusComponent } from './repair-request/repair-request-edit-status/repair-request-edit-status.component';
import { VendorEditComponent } from './vendor/vendor-edit/vendor-edit.component';
import { SettingsComponent } from './settings/settings.component';
/* import { RepairRequestRrgeneratedComponent } from './repair-request/repair-request-rrgenerated/repair-request-rrgenerated.component';
import { RrNeedtosourcedComponent } from './repair-request/rr-needtosourced/rr-needtosourced.component';
import { AwaitingSupplierCodeComponent } from './repair-request/awaiting-supplier-code/awaiting-supplier-code.component';
import { NeedToResourcedComponent } from './repair-request/need-to-resourced/need-to-resourced.component';
import { QuoteSubmittedComponent } from './repair-request/quote-submitted/quote-submitted.component';
import { RrInprogressComponent } from './repair-request/rr-inprogress/rr-inprogress.component'; */
import { InvoiceSalesOrderComponent } from './invoice/invoice-sales-order/invoice-sales-order.component';
import { InvoicePurchaseOrderComponent } from './invoice/invoice-purchase-order/invoice-purchase-order.component';
import { AllSalesOrderComponent } from './invoice/all-sales-order/all-sales-order.component';
import { EditInvoiceComponent } from './invoice/edit-invoice/edit-invoice.component';
import { ListPurchaseOrderComponent } from './orders/list-purchase-order/list-purchase-order.component';
import { ListInvoiceComponent } from './invoice/list-invoice/list-invoice.component';
import { VendorInvoiceListComponent } from './invoice/vendor-invoice-list/vendor-invoice-list.component';
import { AddressComponent } from './common-template/address/address.component';
import { AttachementComponent } from './common-template/attachement/attachement.component';
import { EditAddressComponent } from './common-template/edit-address/edit-address.component';
import { ContactAddComponent } from './common-template/contact-add/contact-add.component';
import { EditContactComponent } from './common-template/edit-contact/edit-contact.component';
import { AddDepartmentComponent } from './common-template/add-department/add-department.component';
import { EditDepartmentComponent } from './common-template/edit-department/edit-department.component';
import { AddAssetComponent } from './common-template/add-asset/add-asset.component';
import { EditAssetComponent } from './common-template/edit-asset/edit-asset.component';
import { EditAttachmentComponent } from './common-template/edit-attachment/edit-attachment.component';
import { AddUserComponent } from './common-template/add-user/add-user.component';
import { EditUserComponent } from './common-template/edit-user/edit-user.component';
import { VendorScoreboardComponent } from './vendor/vendor-scoreboard/vendor-scoreboard.component';
import { AddNotesComponent } from './common-template/add-notes/add-notes.component';
import { CopyLinkComponent } from './common-template/copy-link/copy-link.component';
import { VendorQuoteAttachmentComponent } from './common-template/vendor-quote-attachment/vendor-quote-attachment.component'
import { FollowupComponent } from './common-template/followup/followup.component';
import { ShipComponent } from './common-template/ship/ship.component';
import { RRAddAttachmentComponent } from './common-template/rr-add-attachment/rr-add-attachment.component';
import { RRAddVendorQuoteAttachmentComponent } from './common-template/rr-add-vendor-quote-attachment/rr-add-vendor-quote-attachment.component';
import { QrCodeComponent } from './common-template/qr-code/qr-code.component';
import { AddReferenceComponent } from './common-template/add-reference/add-reference.component';
import { RrCurrentHistoryComponent } from './common-template/rr-current-history/rr-current-history.component';
import { StockLogComponent } from './common-template/stock-log/stock-log.component';
import { ReceiveToShipComponent } from './common-template/receive-to-ship/receive-to-ship.component';
import { RrShippingHistoryComponent } from './common-template/rr-shipping-history/rr-shipping-history.component';
import { ShipToVendorComponent } from './common-template/ship-to-vendor/ship-to-vendor.component';
import { AdminTableListComponent } from './admin/admin-table-list/admin-table-list.component';
import { EditNotesComponent } from './common-template/edit-notes/edit-notes.component';
import { RrEditAttachmentComponent } from './common-template/rr-edit-attachment/rr-edit-attachment.component';
import { VendorQuoteComponent } from './common-template/vendor-quote/vendor-quote.component';
import { ViewFollowupComponent } from './common-template/view-followup/view-followup.component';
import { viewCFComponent } from './common-template/viewCF/viewCF.component';
import { CustomerReferenceComponent } from './common-template/customer-reference/customer-reference.component';
import { EditCustomerReferenceComponent } from './common-template/edit-customer-reference/edit-customer-reference.component';
import { SalesQuotesAddComponent } from './quotes/sales-quotes-add/sales-quotes-add.component';
import { CustomerQuoteComponent } from './common-template/customer-quote/customer-quote.component';
import { CountriesListComponent } from './countries/countries-list/countries-list.component';
import { TermsListComponent } from './terms/terms-list/terms-list.component';
import { TermsCreateComponent } from './terms/terms-create/terms-create.component';
import { StateListComponent } from './state/state-list/state-list.component';
import { StateAddComponent } from './common-template/state-add/state-add.component';
import { StateEditComponent } from './common-template/state-edit/state-edit.component';
import { RrDuplicateComponent } from './common-template/rr-duplicate/rr-duplicate.component';
import { CountriesAddComponent } from './common-template/countries-add/countries-add.component';
import { CountriesEditComponent } from './common-template/countries-edit/countries-edit.component';
import { AssignPartsComponent } from './customer/assign-parts/assign-parts.component';
import { AssignPartComponent } from './common-template/assign-part/assign-part.component';
import { TermsAddComponent } from './common-template/terms-add/terms-add.component';
import { TermsEditComponent } from './common-template/terms-edit/terms-edit.component';
import { AddRrPartsComponent } from './common-template/add-rr-parts/add-rr-parts.component';
import { EditAssignPartsComponent } from './common-template/edit-assign-parts/edit-assign-parts.component';
import { PurchaseOrderPdfComponent } from './orders/purchase-order-pdf/purchase-order-pdf.component';
import { QuoteToCustomerComponent } from './quotes/quote-to-customer/quote-to-customer.component';
import { InvoicePdfComponent } from './invoice/invoice-pdf/invoice-pdf.component';
import { SalesOrderPdfComponent } from './orders/sales-order-pdf/sales-order-pdf.component';
import { EmailComponent } from './common-template/email/email.component';
import { EditVendorInvoiceComponent } from './invoice/edit-vendor-invoice/edit-vendor-invoice.component';
import { PackingSlipComponent } from './quotes/packing-slip/packing-slip.component';
import { RedZoomModule } from 'ngx-red-zoom';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxEditorModule } from 'ngx-editor';
import { NgbTypeaheadModule, NgbPaginationModule, NgbModule, NgbTooltipModule, NgbDropdownModule, NgbTabsetModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UiSwitchModule } from 'ngx-ui-switch';
import { UIModule } from 'src/app/shared/ui/ui.module';
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
import { AdminRoutingModule } from './admin-routing.module';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { RrLogComponent } from './common-template/rr-log/rr-log.component';

import { UpsIntegrationComponent } from './common-template/ups-integration/ups-integration.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgxChartistModule } from 'ngx-chartist';
import { ChartsModule } from 'ng2-charts';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { AddWarrantyComponent } from './common-template/add-warranty/add-warranty.component';
import { EditWarrantyComponent } from './common-template/edit-warranty/edit-warranty.component';
import { AccessRightsComponent } from './common-template/access-rights/access-rights.component';
import { UserAccessRightsComponent } from './user-access-rights/user-access-rights.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { UserRoleAddComponent } from './common-template/user-role-add/user-role-add.component';
import { UserRoleEditComponent } from './common-template/user-role-edit/user-role-edit.component';
import { WarehouseListComponent } from './warehouse/warehouse-list/warehouse-list.component';
import { BuildingListComponent } from './warehouse/building-list/building-list.component';
import { RoomListComponent } from './warehouse/room-list/room-list.component';
import { RowListComponent } from './warehouse/row-list/row-list.component';
import { ShelfListComponent } from './warehouse/shelf-list/shelf-list.component';
import { RfIdIntegrationComponent } from './rfid-integration/rfid-integration.component';
import { RfIdIntegrationService } from './rfid-integration/rfid-integration.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { SidebarModule } from 'ng-sidebar';
// import { RFIDTrackingComponent } from './rfid-tracking/rfid-tracking.component';
import { InventoryPackingSlipComponent } from './common-template/inventory-packing-slip/inventory-packing-slip.component';
import { ToastsContainer } from './inventory/inventory-rfid-dashboard/toasts-container.component';
import { InventorySettingsComponent } from './inventory/inventory-settings/inventory-settings.component';
import { UpsSoapComponent } from './ups/ups-soap/ups-soap.component';
import { UpsAddressComponent } from './ups/ups-address/ups-address.component';
import { UpsCancelComponent } from './ups/ups-cancel/ups-cancel.component';
import { RepairAndSavingsReportComponent } from './inventory/repair-and-savings-report/repair-and-savings-report.component';
import { BarcodePrintComponent } from './common-template/barcode-print/barcode-print.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { PartCurrentLocationHistoryComponent } from './common-template/part-current-location-history/part-current-location-history.component';
import { UpdatePartCurrentLocationComponent } from './common-template/update-part-current-location/update-part-current-location.component';
import { RejectAndResourceComponent } from './common-template/reject-and-resource/reject-and-resource.component';
import { RejectCustomerQuoteComponent } from './common-template/reject-customer-quote/reject-customer-quote.component';
import { RrNotRepairableComponent } from './common-template/rr-not-repairable/rr-not-repairable.component';
import { RrVendorInvoiceComponent } from './common-template/rr-vendor-invoice/rr-vendor-invoice.component';
import { PurchaseOrderViewComponent } from './common-template/purchase-order-view/purchase-order-view.component';
import { QuotePrintComponent } from './quotes/quote-print/quote-print.component';
import { PurchaseOrderPrintComponent } from './quotes/purchase-order-print/purchase-order-print.component';
import { SalesQuotePrintComponent } from './common-template/sales-quote-print/sales-quote-print.component';
import { SalesOrderPrintComponent } from './common-template/sales-order-print/sales-order-print.component';
import { InvoicePrintComponent } from './common-template/invoice-print/invoice-print.component';
import { MroAddComponent } from './mro/mro-add/mro-add.component';
import { MroListComponent } from './mro/mro-list/mro-list.component';
import { TotalPartListComponent } from './total-part-list/total-part-list.component';
import { TotalPartListStoreComponent } from './total-part-list-store/total-part-list-store.component';
import { PartsEditComponent } from './parts-edit/parts-edit.component';
import { PartsEditShopComponent } from './parts-edit-shop/parts-edit-shop.component';
import { MroEditComponent } from './mro/mro-edit/mro-edit.component';
import { UserChangePasswordComponent } from './common-template/user-change-password/user-change-password.component';
import { PartViewComponent } from './part-view/part-view.component';
import { PartViewShopComponent } from './part-view-shop/part-view-shop.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MroVendorQuoteComponent } from './common-template/mro-vendor-quote/mro-vendor-quote.component';
import { MroCustomerQuoteComponent } from './common-template/mro-customer-quote/mro-customer-quote.component';
import { MroAddCustomerQuoteComponent } from './common-template/mro-add-customer-quote/mro-add-customer-quote.component';
import { MroShipComponent } from './common-template/mro-ship/mro-ship.component';
import { MroReceiveComponent } from './common-template/mro-receive/mro-receive.component';
import { MroUpdateCurrentLocationComponent } from './common-template/mro-update-current-location/mro-update-current-location.component';
import { MroVendorInvoiceComponent } from './common-template/mro-vendor-invoice/mro-vendor-invoice.component';
import { MroQrCodeComponent } from './common-template/mro-qr-code/mro-qr-code.component';
import { ListQuotesComponent } from './quotes/list-quotes/list-quotes.component';
import { ListSoComponent } from './orders/list-so/list-so.component';
import { ListPoComponent } from './orders/list-po/list-po.component';
import { InvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { ListVendorInvoiceComponent } from './invoice/list-vendor-invoice/list-vendor-invoice.component';
import { MroFollowupComponent } from './common-template/mro-followup/mro-followup.component';
import { MroEmailComponent } from './common-template/mro-email/mro-email.component';
import { RevertComponent } from './common-template/revert/revert.component';
import { RevertHistoryComponent } from './common-template/revert-history/revert-history.component';
import { WarehouseComponent } from './common-template/warehouse/warehouse.component';
import { BuildingComponent } from './common-template/building/building.component';
import { RoomComponent } from './common-template/room/room.component';
import { AddPartToInventoryComponent } from './common-template/add-part-to-inventory/add-part-to-inventory.component';
import { ShelfComponent } from './common-template/shelf/shelf.component';
import { RowComponent } from './common-template/row/row.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImportPartsComponent } from './total-part-list/import-parts/import-parts.component';
import { DragDropModule, DragDropRegistry } from "@angular/cdk/drag-drop";
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { Platform } from '@angular/cdk/platform';
import { EditReferenceComponent } from './common-template/edit-reference/edit-reference.component';
import { AddMroComponent } from './mro/add-mro/add-mro.component';
import { EditMroComponent } from './mro/edit-mro/edit-mro.component';
import { UpdateQuoteMroComponent } from './common-template/update-quote-mro/update-quote-mro.component';
import { CreateMroSoComponent } from './common-template/create-mro-so/create-mro-so.component';
import { CreateMroPoComponent } from './common-template/create-mro-po/create-mro-po.component';
import { UpdateVendorMroComponent } from './common-template/update-vendor-mro/update-vendor-mro.component';
import { AddSoComponent } from './orders/add-so/add-so.component';
import { AddPoComponent } from './orders/add-po/add-po.component';
import { AddInvoiceComponent } from './invoice/add-invoice/add-invoice.component';
import { AddVendorBillComponent } from './invoice/add-vendor-bill/add-vendor-bill.component';
import { DemoMroEditComponent } from './mro/demo-mro-edit/demo-mro-edit.component';
import { MroShipReceiveComponent } from './common-template/mro-ship-receive/mro-ship-receive.component';
import { MroShippingHistoryComponent } from './common-template/mro-shipping-history/mro-shipping-history.component';
import { BlanketPoListComponent } from './advance-po/blanket-po-list/blanket-po-list.component';
import { PoReportComponent } from './advance-po/po-report/po-report.component';
import { SoBlanketListComponent } from './advance-po/so-blanket-list/so-blanket-list.component';
import { BlanketAddComponent } from './advance-po/blanket-add/blanket-add.component';
import { BlanketEditComponent } from './advance-po/blanket-edit/blanket-edit.component';
import { BlanketPoCustomerComponent } from './common-template/blanket-po-customer/blanket-po-customer.component';
import { CustomerRefQrCodeComponent } from './common-template/customer-ref-qr-code/customer-ref-qr-code.component';
import { CustomerRefMultiQrCodeComponent } from './common-template/customer-ref-multi-qr-code/customer-ref-multi-qr-code.component';
import { CreatePoInsoComponent } from './common-template/create-po-inso/create-po-inso.component';
import { BlanketPoCustomerEditComponent } from './common-template/blanket-po-customer-edit/blanket-po-customer-edit.component';
import { BlanketPoHistoryComponent } from './advance-po/blanket-po-history/blanket-po-history.component';
import { BlanketPoTopComponent } from './advance-po/blanket-po-top/blanket-po-top.component';
import { BlanketPoEdit2Component } from './advance-po/blanket-po-edit2/blanket-po-edit2.component';
import { BlanketPoNonRrComponent } from './common-template/blanket-po-non-rr/blanket-po-non-rr.component';
import { BalnketPoMroComponent } from './common-template/balnket-po-mro/balnket-po-mro.component';
import { BlanketPoNonRrEditComponent } from './common-template/blanket-po-non-rr-edit/blanket-po-non-rr-edit.component';
import { BlanketPoInvoiceEditComponent } from './common-template/blanket-po-invoice-edit/blanket-po-invoice-edit.component';
import { MroCurrentHistoryComponent } from './common-template/mro-current-history/mro-current-history.component';
import { MroDuplicateComponent } from './common-template/mro-duplicate/mro-duplicate.component';
import { RejectedMroComponent } from './common-template/rejected-mro/rejected-mro.component';
import { QuoteDuplicateComponent } from './common-template/quote-duplicate/quote-duplicate.component';
import { RRFollowupNotesComponent } from './common-template/rr-followup-notes/rr-followup-notes.component';
import { BulkShippingPackingslipComponent } from './common-template/bulk-shipping-packingslip/bulk-shipping-packingslip.component';
import { BulkCaseShipComponent } from './common-template/bulk-case-ship/bulk-case-ship.component';
import { BulkCaseReceiveComponent } from './common-template/bulk-case-receive/bulk-case-receive.component';
import { BulkCaseUpdatepartLocationComponent } from './common-template/bulk-case-updatepart-location/bulk-case-updatepart-location.component';
import { PartsPickedupComponent } from './common-template/parts-pickedup/parts-pickedup.component';
import { BlanketPoExcludedPartsListComponent } from './advance-po/blanket-po-excluded-parts-list/blanket-po-excluded-parts-list.component';
import { UpsLabelComponent } from './common-template/ups-label/ups-label.component';
import { UpsBulkShippingComponent } from './common-template/ups-bulk-shipping/ups-bulk-shipping.component';
import { MultiCurrencyMasterComponent } from './multi-currency-master/multi-currency-master.component';
import { MultiCurrencyComponent } from './common-template/multi-currency/multi-currency.component';
import { CurrencyExchangeRateListComponent } from './currency-exchange-rate-list/currency-exchange-rate-list.component';
import { CurrencyExchangeRateComponent } from './common-template/currency-exchange-rate/currency-exchange-rate.component';
import { PartsVatCustomizationComponent } from './parts-vat-customization/parts-vat-customization.component';
import { UpdatePreferredVendorComponent } from './common-template/update-preferred-vendor/update-preferred-vendor.component';
import { ManageRRSubStatusListComponent } from './manage-rr-sub-status-list/manage-rr-sub-status-list.component';
import { ManageRrSubStatusComponent } from './common-template/manage-rr-sub-status/manage-rr-sub-status.component';
import { ManagePartLocationListComponent } from './manage-part-location-list/manage-part-location-list.component';
import { ManageRrPartLocationComponent } from './common-template/manage-rr-part-location/manage-rr-part-location.component';
import { RrEditPartLocationComponent } from './common-template/rr-edit-part-location/rr-edit-part-location.component';
import { PartLocationHistoryComponent } from './common-template/part-location-history/part-location-history.component';
import { SubstatusHistoryComponent } from './common-template/substatus-history/substatus-history.component';
import { AssigneeHistoryComponent } from './common-template/assignee-history/assignee-history.component';
import { SubStatusEditComponent } from './common-template/sub-status-edit/sub-status-edit.component';
import { RrAssigneeEditComponent } from './common-template/rr-assignee-edit/rr-assignee-edit.component';
import { BulkSubstatusAssignEditComponent } from './common-template/bulk-substatus-assign-edit/bulk-substatus-assign-edit.component';
import { VQAttachmentAssignComponent } from './common-template/vq-attachment-assign/vq-attachment-assign.component';
import { UploadEDIComponent } from './common-template/upload-edi/upload-edi.component';
import { QrcodePrintComponent } from './common-template/qrcode-print/qrcode-print.component';
import { MultiQrcodePrintComponent } from './common-template/multi-qrcode-print/multi-qrcode-print.component';
import { ConsolidateInvoiceListComponent } from './invoice/consolidate-invoice-list/consolidate-invoice-list.component';
import { AddConsolidateInvoiceComponent } from './invoice/add-consolidate-invoice/add-consolidate-invoice.component';
import { ConsolidateInvoiceViewComponent } from './common-template/consolidate-invoice-view/consolidate-invoice-view.component';
import { ViewInvoiceConsolidateComponent } from './invoice/view-invoice-consolidate/view-invoice-consolidate.component';
import { EditConsolidateInvoiceComponent } from './invoice/edit-consolidate-invoice/edit-consolidate-invoice.component';
import { InvoiceEDIListComponent } from './invoice/invoice-edi-list/invoice-edi-list.component';
import { UserLoginLoglistComponent } from './user-login-loglist/user-login-loglist.component';
import { EmployeeListComponent } from './employee/employee-list.component';
import { EmployeeComponent } from './employee/employee/employee.component';
import { EmployeeResponsibilityComponent } from './employee/employee-responsibility/employee-responsibility.component';
import { ResponsibilityComponent } from './employee/responsibility/responsibility.component';
import { ProductListComponent } from './shop/product-list/product-list.component';
import { ProductSingleComponent } from './shop/product-single/product-single.component';
import { CartComponent } from './shop/cart/cart.component';
import { ShopDashboardComponent } from './shop/shop-dashboard/shop-dashboard.component';
import { CheckoutComponent } from './shop/checkout/checkout.component';
import { OrderSuccessComponent } from './shop/order-success/order-success.component';
import { RequestAQuoteComponent } from './shop/request-a-quote/request-a-quote.component';
import { InventoryShopComponent } from './common-template/inventory-shop/inventory-shop.component';

import { QrCodeLoopComponent } from './common-template/qr-code-loop/qr-code-loop.component';
import { ViewOrderHistoryComponent } from './shop/view-order-history/view-order-history.component';
import { OrderHistoryComponent } from './shop/order-history/order-history.component';
import { PartQuantityPopupComponent } from './total-part-list/part-quantity-popup/part-quantity-popup.component';
import { ListRequestAQuoteComponent } from './shop/list-request-a-quote/list-request-a-quote.component';
import { LockVendorShippingAddComponent } from './repair-request/lock-vendor-shipping-add/lock-vendor-shipping-add.component';
import { GmRepairTrackerComponent } from './repair-request/gm-repair-tracker/gm-repair-tracker.component';
import { ViewGmRepairTrackerComponent } from './repair-request/view-gm-repair-tracker/view-gm-repair-tracker.component';
import { CustomCarouselComponent } from './shop/custom-carousel/custom-carousel.component';
import { WorksheetRepairTrackerComponent } from './repair-request/worksheet-repair-tracker/worksheet-repair-tracker.component';
import { OutgoingRepairTrackerComponent } from './repair-request/outgoing-repair-tracker/outgoing-repair-tracker.component';
import { OutgoingRepairTrackerSideComponent } from './repair-request/outgoing-repair-tracker-side/outgoing-repair-tracker-side.component';
import { IncomingRepairTrackerSideComponent } from './repair-request/incoming-repair-tracker-side/incoming-repair-tracker-side.component';
import { PartQuantityStorePopupComponent } from './total-part-list-store/part-quantity-store-popup/part-quantity-store-popup.component';
import { StoreLocationComponent } from './store-location/store-location.component';
import { StoreLocationModalComponent } from './common-template/store-location-modal/store-location-modal.component';
import { CustomerGroupComponent } from './customer-group/customer-group.component';
import { CustomerGroupAddComponent } from './common-template/customer-group-add/customer-group-add.component';
import { RrVendorQuoteAttachmentListComponent } from './admin/rr-vendor-quote-attachment-list/rr-vendor-quote-attachment-list.component';
import { RrVendorQuoteAttachmentSelectedListComponent } from './admin/rr-vendor-quote-attachment-selected-list/rr-vendor-quote-attachment-selected-list.component';
import { VQAttachmentFeedbackComponent } from './common-template/vq-attachment-feedback/vq-attachment-feedback.component';
import { FordPartlistComponent } from './ford-partlist/ford-partlist.component';
@NgModule({
  declarations: [
    RrVendorQuoteAttachmentListComponent, RrVendorQuoteAttachmentSelectedListComponent,
    CustomerListComponent, CustomerAddComponent, CustomerViewComponent, CustomCarouselComponent,
    VendorListComponent, VendorAddComponent, VendorViewComponent,
    PartViewComponent,
    PartViewShopComponent,
    AdminListComponent,
    CustomerEditComponent,
    AdminSettingsComponent,
    SalesQuotesListComponent, SalesQuotesEditComponent, SalesOrderEditComponent, PurchaseOrderEditComponent,
    VendorEditComponent,
    SettingsComponent, InvoiceSalesOrderComponent, InvoicePurchaseOrderComponent, AllSalesOrderComponent, EditInvoiceComponent,
    ListPurchaseOrderComponent, ListInvoiceComponent, VendorInvoiceListComponent, AddressComponent, AttachementComponent, EditAddressComponent,
    ContactAddComponent, EditContactComponent, AddDepartmentComponent, EditDepartmentComponent, AddAssetComponent, EditAssetComponent, EditAttachmentComponent, AddUserComponent,
    EditUserComponent, VendorScoreboardComponent, AddNotesComponent, CopyLinkComponent, VendorQuoteAttachmentComponent, FollowupComponent, ShipComponent, RRAddAttachmentComponent, RRAddVendorQuoteAttachmentComponent, QrCodeComponent, QrCodeLoopComponent,
    AddReferenceComponent, RrCurrentHistoryComponent, StockLogComponent, ReceiveToShipComponent, RrShippingHistoryComponent, ShipToVendorComponent, AdminTableListComponent, EditNotesComponent,
    RrEditAttachmentComponent, VendorQuoteComponent, ViewFollowupComponent, viewCFComponent, CustomerReferenceComponent, EditCustomerReferenceComponent, SalesQuotesAddComponent,
    CustomerQuoteComponent, CountriesListComponent, TermsListComponent, TermsCreateComponent, StateListComponent,
    StateAddComponent, StateEditComponent, RrDuplicateComponent, CountriesAddComponent, CountriesEditComponent, AssignPartsComponent, AssignPartComponent, TermsAddComponent, TermsEditComponent,
    AddRrPartsComponent, EditAssignPartsComponent, PurchaseOrderPdfComponent, QuoteToCustomerComponent, InvoicePdfComponent, SalesOrderPdfComponent, EmailComponent, EditVendorInvoiceComponent,
    PackingSlipComponent, RrLogComponent,
    UpsIntegrationComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    AddWarrantyComponent,
    EditWarrantyComponent, AccessRightsComponent,
    UserAccessRightsComponent, UserRolesComponent, UserRoleAddComponent, UserRoleEditComponent,
    WarehouseListComponent, BuildingListComponent, RoomListComponent, RowListComponent, ShelfListComponent,
    RfIdIntegrationComponent,
    InventoryPackingSlipComponent,
    ToastsContainer,
    InventorySettingsComponent,
    UpsSoapComponent,
    UpsAddressComponent,
    UpsCancelComponent,
    RepairAndSavingsReportComponent,
    BarcodePrintComponent,
    PartCurrentLocationHistoryComponent,
    UpdatePartCurrentLocationComponent,
    RejectAndResourceComponent,
    RejectCustomerQuoteComponent,
    RrNotRepairableComponent,
    RrVendorInvoiceComponent,
    PurchaseOrderViewComponent,
    QuotePrintComponent,
    PurchaseOrderPrintComponent,
    SalesQuotePrintComponent,
    SalesOrderPrintComponent,
    TotalPartListComponent,
    TotalPartListStoreComponent,
    PartsEditComponent,
    PartsEditShopComponent,
    InvoicePrintComponent,
    MroAddComponent,
    MroListComponent,
    MroEditComponent,
    UserChangePasswordComponent,
    MroVendorQuoteComponent,
    MroCustomerQuoteComponent,
    MroAddCustomerQuoteComponent,
    MroShipComponent,
    MroReceiveComponent,
    MroUpdateCurrentLocationComponent,
    MroVendorInvoiceComponent,
    MroQrCodeComponent,
    ListQuotesComponent,
    ListSoComponent,
    ListPoComponent,
    InvoiceListComponent,
    ListVendorInvoiceComponent,
    MroFollowupComponent,
    MroEmailComponent,
    RevertComponent,
    RevertHistoryComponent,
    WarehouseComponent,
    BuildingComponent,
    RoomComponent,
    ShelfComponent,
    AddPartToInventoryComponent,
    RowComponent,
    ImportPartsComponent,
    EditReferenceComponent,
    AddMroComponent,
    EditMroComponent,
    UpdateQuoteMroComponent,
    CreateMroSoComponent,
    CreateMroPoComponent,
    UpdateVendorMroComponent,
    AddSoComponent,
    AddPoComponent,
    AddInvoiceComponent,
    AddVendorBillComponent,
    DemoMroEditComponent,
    MroShipReceiveComponent,
    MroShippingHistoryComponent,
    BlanketPoListComponent,
    PoReportComponent,
    SoBlanketListComponent,
    BlanketAddComponent,
    BlanketEditComponent,
    BlanketPoCustomerComponent,
    CustomerRefQrCodeComponent,
    CustomerRefMultiQrCodeComponent,
    CreatePoInsoComponent,
    BlanketPoCustomerEditComponent,
    BlanketPoHistoryComponent,
    BlanketPoTopComponent,
    BlanketPoEdit2Component,
    BlanketPoNonRrComponent,
    BalnketPoMroComponent,
    BlanketPoNonRrEditComponent,
    BlanketPoInvoiceEditComponent,
    MroCurrentHistoryComponent,
    MroDuplicateComponent,
    RejectedMroComponent,
    QuoteDuplicateComponent,
    RRFollowupNotesComponent,
    BulkShippingPackingslipComponent,
    BulkCaseShipComponent,
    BulkCaseReceiveComponent,
    BulkCaseUpdatepartLocationComponent,
    PartsPickedupComponent,
    BlanketPoExcludedPartsListComponent,
    UpsLabelComponent,
    UpsBulkShippingComponent,
    MultiCurrencyMasterComponent,
    MultiCurrencyComponent,
    CurrencyExchangeRateListComponent,
    CurrencyExchangeRateComponent,
    PartsVatCustomizationComponent,
    UpdatePreferredVendorComponent,
    ManageRRSubStatusListComponent,
    ManageRrSubStatusComponent,
    ManagePartLocationListComponent,
    ManageRrPartLocationComponent,
    RrEditPartLocationComponent,
    PartLocationHistoryComponent,
    SubstatusHistoryComponent,
    AssigneeHistoryComponent,
    SubStatusEditComponent,
    RrAssigneeEditComponent,
    BulkSubstatusAssignEditComponent,
    VQAttachmentAssignComponent,
    VQAttachmentFeedbackComponent,
    UploadEDIComponent,
    QrcodePrintComponent,
    MultiQrcodePrintComponent,
    ConsolidateInvoiceListComponent,
    AddConsolidateInvoiceComponent,
    ConsolidateInvoiceViewComponent,
    ViewInvoiceConsolidateComponent,
    EditConsolidateInvoiceComponent,
    InvoiceEDIListComponent,
    UserLoginLoglistComponent,
    EmployeeListComponent,
    EmployeeComponent,
    EmployeeResponsibilityComponent,
    ResponsibilityComponent,
    ProductListComponent,
    ProductSingleComponent,
    CartComponent,
    ShopDashboardComponent,
    CheckoutComponent,
    OrderSuccessComponent,
    ViewOrderHistoryComponent,
    OrderHistoryComponent,
    RequestAQuoteComponent,
    InventoryShopComponent,
    PartQuantityPopupComponent,
    PartQuantityStorePopupComponent,
    ListRequestAQuoteComponent,
    LockVendorShippingAddComponent,
    GmRepairTrackerComponent,
    ViewGmRepairTrackerComponent,
    WorksheetRepairTrackerComponent,
    OutgoingRepairTrackerComponent,
    OutgoingRepairTrackerSideComponent,
    IncomingRepairTrackerSideComponent,
    StoreLocationComponent,
    StoreLocationModalComponent,
    CustomerGroupComponent,
    CustomerGroupAddComponent,
    FordPartlistComponent
  ],
  imports: [
    ChartsModule,
    NgxChartistModule,
    AdminRoutingModule,
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
    NgbDropdownModule,
    NgbTabsetModule,
    UIModule,
    SharedModule,
    NgApexchartsModule,
    // PagesRoutingModule,
    FormsModule, ReactiveFormsModule,
    DataTablesModule,
    NgbDatepickerModule,
    NgxMaskModule,
    Ng5SliderModule, FileUploadModule,
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
    ClickOutsideModule,
    SidebarModule.forRoot(),
    NgxBarcodeModule,
    PipesModule,
    DragDropModule

  ],
  providers: [
    ExcelService,
    DatePipe,
    BsModalRef,
    RfIdIntegrationService,
    NgxNavigationWithDataComponent,
    ViewportRuler,
    Platform,
    DragDropRegistry,
    ScrollDispatcher

  ],
  entryComponents: [
    AddressComponent,
    AttachementComponent,
    EditAddressComponent,
    ContactAddComponent,
    EditContactComponent,
    AddDepartmentComponent,
    EditDepartmentComponent,
    AddAssetComponent,
    EditAssetComponent,
    EditAttachmentComponent,
    AddUserComponent, EditUserComponent,
    AddNotesComponent, CopyLinkComponent,
    VendorQuoteAttachmentComponent,
    FollowupComponent,
    ShipComponent, AddReferenceComponent,
    RRAddAttachmentComponent, RRAddVendorQuoteAttachmentComponent, QrCodeComponent, QrCodeLoopComponent,
    RrCurrentHistoryComponent, StockLogComponent,
    ReceiveToShipComponent, RrShippingHistoryComponent,
    ShipToVendorComponent, EditNotesComponent, RrEditAttachmentComponent,
    VendorQuoteComponent, ViewFollowupComponent, viewCFComponent, CustomerReferenceComponent, EditCustomerReferenceComponent,
    CustomerQuoteComponent, StateAddComponent, RrDuplicateComponent, CountriesAddComponent, BarcodePrintComponent, CountriesEditComponent,
    AssignPartComponent,
    StateEditComponent, TermsAddComponent, AddRrPartsComponent, TermsEditComponent, EditAssignPartsComponent,
    EmailComponent, PackingSlipComponent, RrLogComponent,
    UpsIntegrationComponent,
    AddWarrantyComponent, EditWarrantyComponent, AccessRightsComponent, InventoryPackingSlipComponent,
    UserRoleAddComponent, UserRoleEditComponent,
    PartCurrentLocationHistoryComponent, UpdatePartCurrentLocationComponent,
    RejectAndResourceComponent, RejectCustomerQuoteComponent, RrNotRepairableComponent, RrVendorInvoiceComponent,
    PurchaseOrderViewComponent,
    SalesQuotePrintComponent,
    SalesOrderPrintComponent,
    InvoicePrintComponent,
    UserChangePasswordComponent,
    MroVendorQuoteComponent,
    MroCustomerQuoteComponent,
    MroAddCustomerQuoteComponent,
    MroShipComponent,
    MroReceiveComponent,
    MroUpdateCurrentLocationComponent,
    MroVendorInvoiceComponent,
    MroQrCodeComponent, MroFollowupComponent, MroEmailComponent,
    RevertComponent,
    RevertHistoryComponent,
    WarehouseComponent,
    BuildingComponent,
    RoomComponent,
    ShelfComponent,
    AddPartToInventoryComponent,
    RowComponent,
    EditReferenceComponent,
    CreateMroSoComponent,
    CreateMroPoComponent,
    UpdateQuoteMroComponent,
    UpdateVendorMroComponent,
    MroShipReceiveComponent,
    MroShippingHistoryComponent,
    BlanketPoCustomerComponent,
    CustomerRefQrCodeComponent,
    CustomerRefMultiQrCodeComponent,
    CreatePoInsoComponent,
    BlanketPoCustomerEditComponent,
    BlanketPoNonRrComponent,
    BalnketPoMroComponent,
    BlanketPoNonRrEditComponent,
    BlanketPoInvoiceEditComponent,
    MroCurrentHistoryComponent,
    MroDuplicateComponent,
    RejectedMroComponent,
    QuoteDuplicateComponent,
    RRFollowupNotesComponent,
    BulkShippingPackingslipComponent,
    BulkCaseShipComponent,
    BulkCaseReceiveComponent,
    BulkCaseUpdatepartLocationComponent,
    PartsPickedupComponent,
    UpsLabelComponent,
    UpsBulkShippingComponent,
    MultiCurrencyComponent,
    CurrencyExchangeRateComponent,
    UpdatePreferredVendorComponent,
    ManageRrSubStatusComponent,
    ManageRrPartLocationComponent,
    RrEditPartLocationComponent,
    PartLocationHistoryComponent,
    SubstatusHistoryComponent,
    AssigneeHistoryComponent,
    SubStatusEditComponent,
    RrAssigneeEditComponent,
    BulkSubstatusAssignEditComponent,
    VQAttachmentAssignComponent,
    VQAttachmentFeedbackComponent,
    UploadEDIComponent,
    QrcodePrintComponent,
    MultiQrcodePrintComponent,
    ConsolidateInvoiceViewComponent,
    EmployeeComponent,
    ResponsibilityComponent,
    InventoryShopComponent,
    PartQuantityPopupComponent,
    PartQuantityStorePopupComponent,
    LockVendorShippingAddComponent,
    GmRepairTrackerComponent,
    ViewGmRepairTrackerComponent,
    WorksheetRepairTrackerComponent,
    OutgoingRepairTrackerComponent,
    OutgoingRepairTrackerSideComponent,
    IncomingRepairTrackerSideComponent,
    StoreLocationModalComponent,
    CustomerGroupAddComponent
  ],


})
export class AdminModule { }

