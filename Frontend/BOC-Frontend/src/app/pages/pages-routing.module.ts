/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  // { path: '', redirectTo: 'admin' },
  { path: 'admin', loadChildren: () => import('./admin-modules/admin.module').then(m => m.AdminModule) },
  { path: 'vendor', loadChildren: () => import('./vendor-modules/vendor.module').then(m => m.VendorModule) },
  { path: 'customer', loadChildren: () => import('./customer-modules/customer.module').then(m => m.CustomerModule) }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PagesRoutingModule {
}
