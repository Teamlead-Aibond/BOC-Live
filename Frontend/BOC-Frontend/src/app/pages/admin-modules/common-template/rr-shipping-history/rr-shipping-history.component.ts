import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, NgForm, NgModel } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { ReceiveToShipComponent } from '../receive-to-ship/receive-to-ship.component';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { PackingSlipComponent } from '../../quotes/packing-slip/packing-slip.component';
import { UpsIntegrationComponent } from '../ups-integration/ups-integration.component';
import {
  CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_ACCESS_LIMIT, CONST_AH_Group_ID
} from 'src/assets/data/dropdown';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SoapserviceService } from 'src/app/core/services/soapservice.service';
import * as xml2js from 'xml2js';


@Component({
  selector: 'app-rr-shipping-history',
  templateUrl: './rr-shipping-history.component.html',
  styleUrls: ['./rr-shipping-history.component.scss'],
  providers: [DatePipe]

})
export class RrShippingHistoryComponent implements OnInit {
  @ViewChild('UPSLabel', null) UPSLabelComponent: NgModel;
  viewUPSData
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
  model: any = {}
  TrackingNo;
  PackageWeight;
  ShippingCost;
  ShipDate;
  ReceiveData;
  ShipComment;
  shipDate;
  public event: EventEmitter<any> = new EventEmitter();

  //UPSCancel
  access = "0D90D48B4B528035";
  userid = "ahdshipping1";
  passwd = "American@2020";
  endpointurl = "https://wwwcie.ups.com/ups.app/xml/Void";
  endpointurlStatus = "https://wwwcie.ups.com/ups.app/xml/Track";
  shipperNumber = "425597";
  Form: FormGroup;
  submitted = false;
  success: any;
  error: any;
  AddressValidationResult: any;
  xml: any;
  ShipmentIN: any;
  credentials: any;
  constructor(public modalRef: BsModalRef, public modalRef1: BsModalRef,
    private CommonmodalService: BsModalService,
    private fb: FormBuilder,
    private datePipe: DatePipe, private modalService: NgbModal,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, private soapserviceService: SoapserviceService,) { }


  ngOnInit(): void {

    // Access Rights
    this.accessRights = JSON.parse(localStorage.getItem("accessRights"));
    this.RRShipParts = this.accessRights["RRShipParts"].split(",");
    this.RRTrackUPS = this.accessRights["RRTrackUPS"].split(",");

    this.RRShippingHistory = this.data.RRShippingHistory.map(a => { a.UPSStatus = ''; return a; });
    this.PartId = this.data.PartId;
    this.RRId = this.data.RRId;
    // var i;
    for (var i = 0; i < this.RRShippingHistory.length; i++) {

      const years = Number(this.datePipe.transform(this.RRShippingHistory[i].ShipDate, 'yyyy'));
      const Month = Number(this.datePipe.transform(this.RRShippingHistory[i].ShipDate, 'MM'));
      const Day = Number(this.datePipe.transform(this.RRShippingHistory[i].ShipDate, 'dd'));
      this.RRShippingHistory[i].ShipDateFromat = {
        year: years,
        month: Month,
        day: Day
      };

      // this.RRShippingHistory.every(function (item: any) {
      //   return item.ShipDateFromat = {
      //     year: years,
      //     month: Month,
      //     day: Day
      //   };
      // })

      if ((this.RRShippingHistory[i].ShipFromId == CONST_AH_Group_ID && this.RRShippingHistory[i].ShipToId == this.data.VendorId) || (this.RRShippingHistory[i].ShipFromId == CONST_AH_Group_ID && this.RRShippingHistory[i].ShipToId == this.data.CustomerId) && this.RRShippingHistory[i].ShipViaName == 'UPS') {

        var postData = {
          "ShippingHistoryId": this.RRShippingHistory[i].ShippingHistoryId,
        }
        let obj = this
        this.commonService.postHttpServiceWithIndex(postData, i, "UPSView").subscribe(response => {
          if (response.status == true) {
            obj.RRShippingHistory[response.idx].UPSStatus = response.responseData.UPSStatus
          }
          else {

          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      }
    }


    console.log(this.RRShippingHistory)
  }

  onRRShippingReceive() {
    this.modalRef.hide();
    var RRShippingHistory = this.RRShippingHistory
    var RRId = this.RRId;
    this.modalRef = this.CommonmodalService.show(ReceiveToShipComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { RRShippingHistory, RRId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';
  }


  onSubmit(shippingDetails) {

    const years = shippingDetails.ShipDateFromat.year;
    const dates = shippingDetails.ShipDateFromat.day;
    const months = shippingDetails.ShipDateFromat.month;
    let shipDate = new Date(years, months - 1, dates);
    var postData = {
      "ShippingHistoryId": shippingDetails.ShippingHistoryId,
      "TrackingNo": shippingDetails.TrackingNo,
      "PackWeight": shippingDetails.PackWeight,
      "ShipDate": moment(shipDate).format('YYYY-MM-DD'),
      "ShippingCost": shippingDetails.ShippingCost,
      "ShipComment": shippingDetails.ShipComment
    }
    this.commonService.putHttpService(postData, "RRupdateShipping").subscribe(response => {

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
        ignoreBackdropClick: false,
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
        ignoreBackdropClick: false,
        initialState: {
          data: { PartId, trackingNumber },
          class: 'modal-xl'
        }, class: 'gray modal-xl'
      });
    this.modalRef1.content.closeBtnName = 'Close';
  }

  onCancelUPS(shippingDetails) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          ShipmentIdentificationNumber: shippingDetails.TrackingNo,
          CustomerContext: 'No need!'
        }
        const data = this.post(postData, 'Void');
        // this.soapserviceService.postHttpService(postData, 'https://wwwcie.ups.com/ups.app/xml/Void', '').subscribe(
        //   // this.soapserviceService.postHttpServiceXML(data, url, '').subscribe(
        //     (response: any) => {
        this.commonService.postHttpService(postData, 'UPSCancelLabel').subscribe(response => {
          const parser = new xml2js.Parser({ strict: true, trim: true });
          parser.parseString(response.responseData, (err, result) => {
            var xml = result;
            this.getResult(xml, 'Void')
          });

        },
          (error: any) => {
            console.log(error)
          })
        var postDataUPSCancel = {
          ShippingHistoryId: shippingDetails.ShippingHistoryId,
        }
        this.commonService.postHttpService(postDataUPSCancel, 'UPSCancel').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Cancelled!',
              text: 'UPS has been Cancelled.',
              type: 'success'
            });
            this.modalRef.hide();
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Not Cancelled Yet',
          text: 'UPS is safe:)',
          type: 'error'
        });
      }
    });


  }

  post(val, pass) {
    console.log(pass);
    let postData = '<?xml version="1.0" encoding="UTF-8"?>';
    if (pass == 'Void') {
      postData += '<AccessRequest xml:lang="en-US">';
      postData += '<AccessLicenseNumber>' + this.access + '</AccessLicenseNumber>';
      postData += '<UserId>' + this.userid + '</UserId>';
      postData += '<Password>' + this.passwd + '</Password>';
      postData += '</AccessRequest>';
      postData += '<?xml version="1.0" encoding="UTF-8"?>';
      postData += '<VoidShipmentRequest>';
      postData += '<Request>';
      postData += '<TransactionReference>';
      postData += '<CustomerContext>' + val.CustomerContext + '</CustomerContext>';
      postData += '<XpciVersion>1.0</XpciVersion>';
      postData += '</TransactionReference>';
      postData += '<RequestAction>1</RequestAction>';
      postData += '<RequestOption>1</RequestOption>';
      postData += '</Request>';
      postData += '<ShipmentIdentificationNumber>' + val.ShipmentIdentificationNumber + '</ShipmentIdentificationNumber>';
      postData += '</VoidShipmentRequest>';
    } else {
      postData += '<AccessRequest xml:lang="en-US">';
      postData += '<AccessLicenseNumber>' + this.access + '</AccessLicenseNumber>';
      postData += '<UserId>' + this.userid + '</UserId>';
      postData += '<Password>' + this.passwd + '</Password>';
      postData += '</AccessRequest>';
      postData += '<?xml version="1.0"?>';
      postData += '<TrackRequest xml:lang="en-US">';
      postData += '<Request>';
      postData += '<TransactionReference>';
      postData += '<CustomerContext>' + val.CustomerContext + '</CustomerContext>';
      postData += '</TransactionReference>';
      postData += '<RequestAction>Track</RequestAction>';
      postData += '<RequestOption>activity</RequestOption>';
      postData += '</Request>';
      postData += '<TrackingNumber>' + val.ShipmentIdentificationNumber + '</TrackingNumber>';
      postData += '</TrackRequest>';
    }
    console.log(postData);
    return postData;
  }
  getResult(val, pass) {
    this.ShipmentIN = this.Form.value.ShipmentIdentificationNumber;
    if (pass == 'Void') {
      if (val['VoidShipmentResponse']['Response'][0]['ResponseStatusDescription'] == 'Success') {
        this.error = '';
        this.success = "Successfully canceld!";
      } else {
        this.success = '';
        this.error = val['VoidShipmentResponse']['Response'][0]['Error'][0]['ErrorDescription'];
      }
    } else {
      if (val['TrackResponse']['Response'][0]['ResponseStatusDescription'] == 'Success') {
        this.error = '';
        this.success = val['TrackResponse']['Shipment'][0]['Package'];
      } else {
        this.success = '';
        this.error = val['TrackResponse']['Response'][0]['Error'][0]['ErrorDescription'];
      }
    }
  }
  onGenerateUPS(shippingDetails) {
    this.modalRef.hide();
    var postData = {
      "ShippingHistoryId": shippingDetails.ShippingHistoryId,
    }
    this.commonService.postHttpService(postData, "UPSView").subscribe(response => {

      if (response.status == true) {
        this.viewUPSData = response.responseData

        this.modalService.open(this.UPSLabelComponent, { size: 'xl' });

      }
      else {
        Swal.fire({
          title: 'Error!',
          text: response.message,
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  onTracking(shippingDetails) {
    console.log(shippingDetails)
    this.modalRef.hide();
    var trackingNumber = shippingDetails.TrackingNo
    this.modalRef1 = this.CommonmodalService.show(UpsIntegrationComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { trackingNumber },
          class: 'modal-xl'
        }, class: 'gray modal-xl'
      });
    this.modalRef1.content.closeBtnName = 'Close';
  }
  onPrint(url){   
    var w = window.open("about:blank");
    var image = new Image();
    image.src = url
    w.document.write(image.outerHTML);
    w.print();
  
  }
}
