import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { AhDashboardComponent } from './ah-dashboard/ah-dashboard.component';
import { AhNewDashboardComponent } from './ah-new-dashboard/ah-new-dashboard.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard/ah-dashboard' },
  { path: 'dashboard/ah-old-dashboard', component: AhDashboardComponent },
  { path: 'dashboard/customer-dashboard', component: CustomerDashboardComponent },
  { path: 'dashboard/ah-dashboard', component: AhNewDashboardComponent },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule {
}
