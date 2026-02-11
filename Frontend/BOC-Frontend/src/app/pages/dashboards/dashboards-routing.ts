/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultDashboardComponent } from './default/default.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';

const routes: Routes = [
    {
        path: 'dashboard1',
        component: DefaultDashboardComponent //
    },
    {
        path: 'dashboard2',
        component: Dashboard2Component
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
