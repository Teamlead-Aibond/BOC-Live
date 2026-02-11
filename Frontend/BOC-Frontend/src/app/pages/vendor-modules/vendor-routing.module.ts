/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VendorRrListComponent } from './repair-request/vendor-rr-list/vendor-rr-list.component';
import { PurchaseOrderListComponent } from './purchase-order/purchase-order-list/purchase-order-list.component';
import { VendorInvoiceComponent } from './vendor-bill/vendor-invoice/vendor-invoice.component';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { VendorProfileComponent } from './profile/vendor-profile/vendor-profile.component';
import { ChangePasswordComponent } from './change-password/change-password/change-password.component';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard/vendor-dashboard.component';
import { WarrantyComponent } from './warranty/warranty.component';
import { RepairRequestEditComponent } from './repair-request/repair-request-edit/repair-request-edit.component';
import { RushRepairListComponent } from './repair-request/rush-repair-list/rush-repair-list.component';
import { VendorWarrantyRepairListComponent } from './repair-request/vendor-warranty-repair-list/vendor-warranty-repair-list.component';
import { RRListComponent } from './repair-request/rr-list/rr-list.component';
import { VendorShippingTrackingComponent } from './vendor-shipping-tracking/vendor-shipping-tracking.component';
import { SearchResultComponent } from 'src/app/shared/search-result/search-result.component';
import { VendorPortalListPoComponent } from './vendor-portal-list-po/vendor-portal-list-po.component';
import { VendorPortalVendorbillListComponent } from './vendor-bill/vendor-portal-vendorbill-list/vendor-portal-vendorbill-list.component';

const routes: Routes = [
  { path: '', component: VendorDashboardComponent },  //
  { path: 'dashboard', component: VendorDashboardComponent}, //
  
  { path: 'RR-list', component: RRListComponent }, //
  { path: 'rr-list', component: VendorRrListComponent }, //
  { path: 'rush-RRList', component: RushRepairListComponent }, //
  { path: 'warranty-RRList', component: VendorWarrantyRepairListComponent }, //
  { path: 'po-list', component:  VendorPortalListPoComponent}, //
  { path: 'po-view', component: PurchaseOrderListComponent}, //
  { path: 'vendor-bill-view', component: VendorInvoiceComponent}, //
  { path: 'vendor-bill', component: VendorPortalVendorbillListComponent}, //
  { path: 'update-profile', component:UserProfileComponent }, //
  { path: 'Profile', component: VendorProfileComponent},  //
  { path: 'change-password', component: ChangePasswordComponent},//
  { path: 'warranty-list', component: WarrantyComponent}, //
  { path: 'RR-edit', component: RepairRequestEditComponent }, //
  { path: 'tracking', component: VendorShippingTrackingComponent },//
  { path: 'search-result', component:  SearchResultComponent} //

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
