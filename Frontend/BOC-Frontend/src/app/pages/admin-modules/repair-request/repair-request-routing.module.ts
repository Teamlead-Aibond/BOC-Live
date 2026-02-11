import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { BulkShippingListComponent } from './bulk-shipping-list/bulk-shipping-list.component';
import { BulkShippingComponent } from './bulk-shipping/bulk-shipping.component';
import { RepairRequestAddComponent } from './repair-request-add/repair-request-add.component';
import { RepairRequestListComponent } from './repair-request-list/repair-request-list.component';
import { RepairRequestStageComponent } from './repair-request-stage/repair-request-stage.component';
import { ShippingListComponent } from './shipping-list/shipping-list.component';
import { ViewAllRepairRequestComponent } from './view-all-repair-request/view-all-repair-request.component';
import { RepairRequestWorkchainListComponent } from './repair-request-workchain-list/repair-request-list.component';
import { BasicRrListComponent } from './basic-rr-list/basic-rr-list.component';
import { RepairRequestPatchComponent } from './repair-request-patch/repair-request-patch.component';
import { RepairRequesPatchtListComponent } from './repair-request-patch-list/repair-request-patch-list.component';

const routes: Routes = [
  {
    path: 'repair-request-list', component: RepairRequestListComponent
  },
  {
    path: 'repair-request-add', component: RepairRequestAddComponent
  },
  { path: 'view-all-repair-request', component: ViewAllRepairRequestComponent },
  {
    path: 'list', component: RepairRequestListComponent, data: {
      shouldReuse: true,
      key: 'repair-request-list'
    }
  },
  { path: 'add', component: RepairRequestAddComponent },
  {
    path: 'edit', component: RepairRequestStageComponent
  },
  {
    path: 'bulk-shipping', component: BulkShippingComponent
  },
  {
    path: 'bulk-shipping-list', component: BulkShippingListComponent
  },
  {
    path: 'shipping-list', component: ShippingListComponent
  },
  {
    path: 'repair-request-workchain-list', component: RepairRequestWorkchainListComponent
  },
  {
    path: 'workchain-list', component: RepairRequestWorkchainListComponent, data: {
      shouldReuse: true,
      key: 'repair-request-workchain-list'
    }
  },

  {
    path: 'basic-RR-list', component:BasicRrListComponent 
  },
  { path: 'add-batch', component: RepairRequestPatchComponent },
  { path: 'batch-list', component: RepairRequesPatchtListComponent },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RepairRequestRoutingModule {
}
