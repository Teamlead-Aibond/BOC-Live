/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CustomerRrListComponent } from './repaire-request/customer-rr-list/customer-rr-list.component';
import { SalesOrderListComponent } from './sales-order/sales-order-list/sales-order-list.component';
import { InvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { CustomerProfileComponent } from './profile/customer-profile/customer-profile.component';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { ChangePasswordComponent } from './change-password/change-password/change-password.component';
import { SalesQuotesListComponent } from './quotes/sales-quotes-list/sales-quotes-list.component';
import { CustomerDashboardComponent } from './customer-dashbard/customer-dashboard/customer-dashboard.component';
import { WarrantyListComponent } from './warranty-list/warranty-list.component';
import { CustomerRrEditComponent } from './repaire-request/customer-rr-edit/customer-rr-edit.component';
import { CustomerShippingTrackingComponent } from './customer-shipping-tracking/customer-shipping-tracking.component';
import { CustomerNavRRListComponent } from './customer-nav-rr-list/customer-nav-rr-list.component';
import { GridInvoiceListComponent } from './invoice/grid-invoice-list/grid-invoice-list.component';
import { SearchResultComponent } from 'src/app/shared/search-result/search-result.component';
import { InvoiceViewComponent } from './common-template/invoice-view/invoice-view.component';
import { ListBlanketBycustomerComponent } from './po-advance/list-blanket-bycustomer/list-blanket-bycustomer.component';
import { ListPoBlanketComponent } from './po-advance/list-po-blanket/list-po-blanket.component';
import { TopHistoryComponent } from './po-advance/top-history/top-history.component';
import { ProductListComponent } from '../admin-modules/shop/product-list/product-list.component';
import { ProductSingleComponent } from '../admin-modules/shop/product-single/product-single.component';
import { CartComponent } from '../admin-modules/shop/cart/cart.component';
import { CheckoutComponent } from '../admin-modules/shop/checkout/checkout.component';
import { OrderSuccessComponent } from '../admin-modules/shop/order-success/order-success.component';
import { RequestAQuoteComponent } from '../admin-modules/shop/request-a-quote/request-a-quote.component';

const routes: Routes = [
  { path: '', component: CustomerDashboardComponent },//
  { path: 'dashboard', component: CustomerDashboardComponent },//
  { path: 'RR-List', component: CustomerRrListComponent }, //
  { path: 'SO-List', component: SalesOrderListComponent },//
  { path: 'Invoice-List', component: GridInvoiceListComponent }, //
  { path: 'Update-Profile', component: UserProfileComponent },//
  { path: 'Profile', component: CustomerProfileComponent },//
  { path: 'Change-Password', component: ChangePasswordComponent },//
  { path: 'Quotes-List', component: SalesQuotesListComponent },//
  { path: 'Warranty-List', component: WarrantyListComponent }, // 
  { path: 'RR-edit', component: CustomerRrEditComponent }, //
  { path: 'Tracking', component: CustomerShippingTrackingComponent },//
  { path: 'rr-list', component:  CustomerNavRRListComponent}, //
  { path: 'search-result', component:  SearchResultComponent}, //
  { path: 'invoice-view', component:  InvoiceViewComponent}, //
  { path: 'list-blanket-po', component:  ListBlanketBycustomerComponent}, //
  { path: 'REPLENISH-history', component:  TopHistoryComponent}, //
  { path: 'list-blanket-so', component:  ListPoBlanketComponent}, //
  // { path: 'shop/product-list', component: ProductListComponent },
  // { path: 'shop/product-single', component: ProductSingleComponent },
  // { path: 'shop/cart', component: CartComponent },
  // { path: 'shop/checkout', component: CheckoutComponent },
  // { path: 'shop/order-success', component: OrderSuccessComponent },
  // { path: 'shop/request-a-quote', component: RequestAQuoteComponent }

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
