import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { PackingSlipComponent } from '../../quotes/packing-slip/packing-slip.component';
import { UpsIntegrationComponent } from '../ups-integration/ups-integration.component';

@Component({
  selector: 'app-mro-shipping-history',
  templateUrl: './mro-shipping-history.component.html',
  styleUrls: ['./mro-shipping-history.component.scss']
})
export class MroShippingHistoryComponent implements OnInit {


  
  
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
    MROShippingHistoryId
    shippingItem
    RecevingItem;
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
  
      // // Access Rights
      // this.accessRights = JSON.parse(localStorage.getItem("accessRights"));
      // this.RRShipParts = this.accessRights["RRShipParts"].split(",");
      // this.RRTrackUPS = this.accessRights["RRTrackUPS"].split(",");
  
      this.MROShippingHistoryId = this.data.MROShippingHistoryId;
      // this.RecevingItem = this.data.RecevingItem;
      this.RRShippingHistory = [this.data.shippingItem];
  
     
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
  
   
  
  
    onSubmit(shippingDetails) {
  
      const years = shippingDetails.ShipDateFromat.year;
      const dates = shippingDetails.ShipDateFromat.day;
      const months = shippingDetails.ShipDateFromat.month;
      let shipDate = new Date(years, months - 1, dates);
      var postData = {
        "MROShippingHistoryId": shippingDetails.MROShippingHistoryId,
        "TrackingNo": shippingDetails.TrackingNo,
        "PackWeight": shippingDetails.PackWeight,
        "ShipDate": moment(shipDate).format('YYYY-MM-DD'),
        "ShippingCost": shippingDetails.ShippingCost,
        "ShipComment":shippingDetails.ShipComment
      }
      this.commonService.putHttpService(postData, "MROShippingHistoryUpdate").subscribe(response => {
  
        if (response.status == true) {
  
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
  
          Swal.fire({
            title: 'Success!',
            text: 'Ship Updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Ship could not be updated!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
  
  
  
    triggerEvent(item: string) {
      this.event.emit({ data: item, res: 200 });
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
      this.modalRef1 = this.CommonmodalService.show(UpsIntegrationComponent,
        {
          backdrop: 'static',
          ignoreBackdropClick:false,
          initialState: {
            data: { PartId, trackingNumber },
            class: 'modal-xl'
          }, class: 'gray modal-xl'
        });
      this.modalRef1.content.closeBtnName = 'Close';
    }
  
  
  
  
}
