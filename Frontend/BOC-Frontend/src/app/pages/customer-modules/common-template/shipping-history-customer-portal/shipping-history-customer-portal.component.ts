import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { ReceiveToShipComponent } from 'src/app/pages/admin-modules/common-template/receive-to-ship/receive-to-ship.component';
import { UpsIntegrationComponent } from 'src/app/pages/admin-modules/common-template/ups-integration/ups-integration.component';
import { PackingSlipComponent } from 'src/app/pages/admin-modules/quotes/packing-slip/packing-slip.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shipping-history-customer-portal',
  templateUrl: './shipping-history-customer-portal.component.html',
  styleUrls: ['./shipping-history-customer-portal.component.scss'],
  providers:[DatePipe]
})
export class ShippingHistoryCustomerPortalComponent implements OnInit {


    // Access Rights
    accessRights: any = [];  
    RRShipParts: any = [];
    RRTrackUPS: any = [];
  
   
  
    RRShippingHistory: any = [];
    CustomerRRShippingHistory:any=[]
    RRId;
    PartId;
    CustomerId
    shippingDetails;
    submitted = false;
    model: any = {}
    TrackingNo;
    PackageWeight;
    ShippingCost;
    ShipDate;
    ReceiveData;
    ShipComment;
    shipDate;
    public event: EventEmitter<any> = new EventEmitter();
    constructor(public modalRef: BsModalRef, public modalRef1: BsModalRef,
      private CommonmodalService: BsModalService,
      private fb: FormBuilder,
      private datePipe: DatePipe,
      private cd_ref: ChangeDetectorRef,
      private commonService: CommonService,
      @Inject(BsModalRef) public data: any, ) { }
  
  
    ngOnInit(): void {
  
     
  
      this.RRShippingHistory = this.data.RRShippingHistory;
      this.PartId = this.data.PartId;
      this.RRId = this.data.RRId;
      this.CustomerId = this.data.CustomerId
  
      for (var i = 0; i < this.RRShippingHistory.length; i++) {
        if(this.RRShippingHistory[i].ShipToId==this.CustomerId){
          this.CustomerRRShippingHistory=[this.RRShippingHistory[i]]

        }
  
        
      }
    }
  
   
  
  
  
  
    triggerEvent(item: string) {
      this.event.emit({ data: item, res: 200 });
    }
  
  
    
  
  
  
}
