import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { RFIDCheckResolver } from 'src/app/core/resolvers/rfid.check.resolver';
import { CreateIndentComponent } from './create-indent/create-indent.component';
import { DamageAddComponent } from './damage-add/damage-add.component';
import { DamageListComponent } from './damage-list/damage-list.component';
import { IndentComponent } from './indent/indent.component';
import { InventoryAddComponent } from './inventory-add/inventory-add.component';
import { InventoryDashboardComponent } from './inventory-dashboard/inventory-dashboard.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryRfidDashboardV1Component } from './inventory-rfid-dashboard-v1/inventory-rfid-dashboard-v1.component';
import { InventoryRfidDashboardComponent } from './inventory-rfid-dashboard/inventory-rfid-dashboard.component';
import { InventoryRfidV1Component } from './inventory-rfid-v1/inventory-rfid-v1.component';
import { InventoryViewComponent } from './inventory-view/inventory-view.component';
import { PartTrackingNewComponent } from './part-tracking-new/part-tracking-new.component';
import { PartTrackingComponent } from './part-tracking/part-tracking.component';
import { ReceiveProductComponent } from './receive-product/receive-product.component';
import { RoomTrackingComponent } from './room-tracking/room-tracking.component';
import { StockInListComponent } from './stock-in/stock-in-list/stock-in-list.component';
import { StockInComponent } from './stock-in/stock-in.component';
import { StockHistoryListComponent } from './stock-out/stock-history-list/stock-history-list.component';
import { StockOutListComponent } from './stock-out/stock-out-list/stock-out-list.component';
import { StockOutComponent } from './stock-out/stock-out.component';
import { TransferProductComponent } from './transfer-product/transfer-product.component';

const routes: Routes = [
  {
    path: '', // This place is empty
    redirectTo: 'RFID-dashboard',
    pathMatch: 'full',
  },
  { path: 'RFID-dashboard', component: InventoryRfidDashboardComponent },
  { path: 'RFID-dashboardv1', component: InventoryRfidDashboardV1Component },
  {
    path: 'list', component: InventoryListComponent, data: {
      key: 'inventory-list'
    }
  },

  {
    path: 'view',
    component: InventoryViewComponent,
    resolve: {
      isRFIDEnabled: RFIDCheckResolver
    }
  },

  {
    path: 'edit',
    component: InventoryAddComponent,
    resolve: {
      isRFIDEnabled: RFIDCheckResolver
    }
  },
  {
    path: 'add',
    component: InventoryAddComponent,
    resolve: {
      isRFIDEnabled: RFIDCheckResolver
    }
  },
  { path: 'dashboard', component: InventoryDashboardComponent },

  {
    path: 'stockin-add',
    component: StockInComponent,
    resolve: {
      isRFIDEnabled: RFIDCheckResolver
    }
  },
  {
    path: 'stockin-list',
    component: StockInListComponent,
    resolve: {
      isRFIDEnabled: RFIDCheckResolver
    }
  },


  {
    path: 'stockout-add', component: StockOutComponent,
    resolve: {
      isRFIDEnabled: RFIDCheckResolver
    }
  },
  {
    path: 'stockout-list', component: StockOutListComponent,
    resolve: {
      isRFIDEnabled: RFIDCheckResolver
    }
  },
  {
    path: 'stockout-Historylist', component: StockHistoryListComponent,
    resolve: {
      isRFIDEnabled: RFIDCheckResolver
    }
  },

  { path: 'transfer-product', component: TransferProductComponent },
  { path: 'indent', component: IndentComponent },
  { path: 'create-indent', component: CreateIndentComponent },
  { path: 'damage-list', component: DamageListComponent },
  { path: 'damage-add', component: DamageAddComponent },
  { path: 'part-location', component: RoomTrackingComponent },
  { path: 'part-tracking', component: PartTrackingComponent },
  { path: 'part-tracking-new', component: PartTrackingNewComponent },
  { path: 'receive-product', component: ReceiveProductComponent },
  { path: 'RFID-dashboardv2', component: InventoryRfidV1Component },

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InventoryRoutingModule {
}
