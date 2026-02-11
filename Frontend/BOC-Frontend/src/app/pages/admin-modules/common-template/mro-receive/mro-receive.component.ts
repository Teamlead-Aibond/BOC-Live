import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { CONST_AH_Group_ID, Const_Alert_pop_message, Const_Alert_pop_title, CONST_ShipAddressType } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mro-receive',
  templateUrl: './mro-receive.component.html',
  styleUrls: ['./mro-receive.component.scss']
})
export class MroReceiveComponent implements OnInit {

  RRShippingHistory;
  MROId;
  shippingDetails;
  submitted = false;
  model: any = {}
  AddressList;
  ShipToIdentityName
  ReceiveIdentityType;
  ShippingIdentityType;
  Currentdate = new Date();
  AddressData;
  ShipFromAddressId;
  From
  To;
  CustomerId;
  Status;
  btnDisabled: boolean = false;
  ReceiveDateError: boolean = false;

  public event: EventEmitter<any> = new EventEmitter();
  CustomerName
  MROShippingHistoryId;
  shippingItem;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder, private datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.CustomerName = this.data.CustomerName;
    this.CustomerId = this.data.CustomerId;
    this.MROShippingHistoryId = this.data.MROShippingHistoryId
    this.model.ReceivedBy = localStorage.getItem("UserName");
    this.MROId = this.data.MROId;
    this.shippingDetails = this.data.shippingItem
    const years = Number(this.datePipe.transform(this.Currentdate, 'yyyy'));
    const Month = Number(this.datePipe.transform(this.Currentdate, 'MM'));
    const Day = Number(this.datePipe.transform(this.Currentdate, 'dd'));
    this.model.ReceiveDate = {
      year: years,
      month: Month,
      day: Day
    }


    this.getAddressList();

  }

  onReceivedateValidation(ReceiveDate) {
    const ReceiveDateYears = ReceiveDate.year;
    const ReceiveDateDates = ReceiveDate.day;
    const ReceiveDatemonths = ReceiveDate.month;
    let receiveDate = new Date(ReceiveDateYears, ReceiveDatemonths - 1, ReceiveDateDates);
    let Receivedate = moment(receiveDate).format('YYYY-MM-DD');
    if (Receivedate < this.shippingDetails.ShipDate) {
      this.ReceiveDateError = true
    }
    else {
      this.ReceiveDateError = false
    }
  }
  getAddressList() {
    var postData = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      "Type": CONST_ShipAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.AddressList = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });



      var ShippingAddress = response.responseData.map(function (value) {
        if (value.IsShippingAddress == 1) {
          return value.AddressId
        }
      });
      this.model.AddressId = ShippingAddress[0]

    });

  }
  getAddressFromList() {
    var postData = {
      "IdentityId": this.shippingDetails.ShipFromId,
      "IdentityType": 2,
      "Type": CONST_ShipAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      // this.AddressList = response.responseData.map(function (value) {
      //   return { title: value.StreetAddress + " , " + value.City + " , " + value.CountryName + " ," + value.StateName + ".-" + value.Zip, "AddressId": value.AddressId }
      // });



      var Obj = this

      var ShippingAddress = this.AddressList.map(function (value) {
        if (value.AddressId == Obj.ShipFromAddressId) {
          return value.title
        }
      });
      this.AddressData = ShippingAddress[0]

    });


  }




  onSubmit(f: NgForm) {
    this.submitted = true;
    const ReceiveDateYears = this.model.ReceiveDate.year;
    const ReceiveDateDates = this.model.ReceiveDate.day;
    const ReceiveDatemonths = this.model.ReceiveDate.month;
    let receiveDate = new Date(ReceiveDateYears, ReceiveDatemonths - 1, ReceiveDateDates);
    let ReceiveDate = moment(receiveDate).format('YYYY-MM-DD');
    if (f.valid && this.ReceiveDateError == false) {
      this.btnDisabled = true;
      var postData = {
        "MROId": this.MROId,
        "MROShippingHistoryId": this.MROShippingHistoryId,
        "ReceiveAddressId": this.model.AddressId,
        "ReceivedBy": this.model.ReceivedBy,
        "ReceiveDate": ReceiveDate,
        "ReceiveComment": this.model.ReceiveComment,
      }

      this.commonService.putHttpService(postData, "Receive").subscribe(response => {

        if (response.status == true) {

          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Ship Receive saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Ship Receive could not be saved!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
    else {
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });

    }



  }



  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }



}
