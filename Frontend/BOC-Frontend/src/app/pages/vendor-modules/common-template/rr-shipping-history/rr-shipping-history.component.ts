import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import {
  CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_ACCESS_LIMIT
} from 'src/assets/data/dropdown';
import { ReceiveToShipComponent } from 'src/app/pages/admin-modules/common-template/receive-to-ship/receive-to-ship.component';
import { PackingSlipComponent } from 'src/app/pages/admin-modules/quotes/packing-slip/packing-slip.component';
import { UpsIntegrationComponent } from 'src/app/pages/admin-modules/common-template/ups-integration/ups-integration.component';

@Component({
  selector: 'app-rr-shipping-history',
  templateUrl: './rr-shipping-history.component.html',
  styleUrls: ['./rr-shipping-history.component.scss'],
  providers: [DatePipe]

})
export class RrShippingHistoryComponent implements OnInit {

  // Access Rights
  accessRights: any = [];  
  RRShipParts: any = [];
  RRTrackUPS: any = [];

  // Get the values for Access Rights
  VIEW_ACCESS = CONST_VIEW_ACCESS;
  CREATE_ACCESS = CONST_CREATE_ACCESS;
  MODIFY_ACCESS = CONST_MODIFY_ACCESS;
  DELETE_ACCESS = CONST_DELETE_ACCESS;
  APPROVE_ACCESS = CONST_APPROVE_ACCESS;
  VIEW_COST_ACCESS = CONST_VIEW_COST_ACCESS;

  RRShippingHistory: any = [];
  RRId;
  PartId;
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
  constructor(public modalRef: BsModalRef,
    private CommonmodalService: BsModalService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }


  ngOnInit(): void {

    // Access Rights
    this.accessRights = JSON.parse(localStorage.getItem("accessRights"));
    this.RRShipParts = this.accessRights["RRShipParts"].split(",");
    this.RRTrackUPS = this.accessRights["RRTrackUPS"].split(",");

    this.RRShippingHistory = this.data.RRShippingHistory;
    this.PartId = this.data.PartId;
    this.RRId = this.data.RRId;

    for (var i = 0; i < this.RRShippingHistory.length; i++) {

      const years = Number(this.datePipe.transform(this.RRShippingHistory[i].ShipDate, 'yyyy'));
      const Month = Number(this.datePipe.transform(this.RRShippingHistory[i].ShipDate, 'MM'));
      const Day = Number(this.datePipe.transform(this.RRShippingHistory[i].ShipDate, 'dd'));
      this.RRShippingHistory.every(function (item: any) {
        return item.ShipDateFromat = {
          year: years,
          month: Month,
          day: Day
        };
      })
    }
  }

  onRRShippingReceive() {
    this.modalRef.hide();
    var RRShippingHistory = this.RRShippingHistory
    var RRId = this.RRId;
    this.modalRef = this.CommonmodalService.show(ReceiveToShipComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { RRShippingHistory, RRId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';
  }


 


  

  PackingSlip(shippingDetails) {
    this.modalRef.hide();
    this.modalRef = this.CommonmodalService.show(PackingSlipComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { shippingDetails },
          class: 'modal-xl'
        }, class: 'gray modal-xl'
      });

    this.modalRef.content.closeBtnName = 'Close';
  }

  // Track UPS
  trackShipUPS(trackingNumber) {
    var PartId = this.PartId;
    this.modalRef = this.CommonmodalService.show(UpsIntegrationComponent,
      {
        
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { PartId, trackingNumber },
          class: 'modal-xl'
        }, class: 'gray modal-xl'
      });
    this.modalRef.content.closeBtnName = 'Close';
  }


}
