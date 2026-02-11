import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { CONST_AH_Group_ID } from 'src/assets/data/dropdown';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html',
  styleUrls: ['./ship.component.scss']
})
export class ShipComponent implements OnInit {
  RRId;
  model: any = {}
  submitted = false;
  CustomerId;
  customerAddressList;
  Ahgroup_AddressList;
  customerList;
  ShipFromName;
  vendorList;
  ShipToName;
  ShipViaList;
  public event: EventEmitter<any> = new EventEmitter();
  ShipToAddressList;
  VendorId;
  Currentdate = new Date();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.RRId = this.data.RRId;
    this.CustomerId = this.data.CustomerId;
    this.VendorId = this.data.VendorId
    this.model.ShippedBy = localStorage.getItem("UserName");
    this.getCustomerList();
    this.getVendorList();
    this.getShipViaList();

    const years = Number(this.datePipe.transform(this.Currentdate, 'yyyy'));
    const Month = Number(this.datePipe.transform(this.Currentdate, 'MM'));
    const Day = Number(this.datePipe.transform(this.Currentdate, 'dd'));
    this.model.ShipDate = {
      year: years,
      month: Month,
      day: Day
    }


  }

  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData;
    });
  }
  getVendorList() {
    this.commonService.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
    });
  }
  getShipViaList() {
    this.commonService.getHttpService('ShipViaList').subscribe(response => {
      this.ShipViaList = response.responseData;
    });
  }
  filterAndGetValue(object, getField, filterField, filterValue) {
    var value = object.filter(function (data) {
      return data[filterField] == filterValue;
    }, filterField, filterValue)
    return value[0][getField];
  }

  getCustomerAddressList() {
    var postData = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1
    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.customerAddressList = response.responseData.map(function (value) {
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
  setCustomerShipAddress(value) {
    if (value == 1) {
      var postData = {
        "IdentityId": this.CustomerId,
        "IdentityType": 1
      }
      this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
        this.customerAddressList = response.responseData.map(function (value) {
          return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
        });
        var ShippingAddress = response.responseData.map(function (value) {
          if (value.IsShippingAddress == 1) {
            return value.AddressId
          }
        });
        this.model.AddressId = ShippingAddress[0]

      });


      this.getAHgroupAddressList();
    }


  }

  setAhShipAddress(value) {
    if (this.VendorId == "") {
      Swal.fire({
        title: 'Please Assign Vendor to Proceed the Shipping',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
      this.modalRef.hide();

    }
    if (value == 0) {
      this.model.ShipToAddressId = "";
      this.Ahgroup_AddressList = [];
      var postData = {
        "IdentityId": CONST_AH_Group_ID,
        "IdentityType": 2
      }
      this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
        this.customerAddressList = response.responseData.map(function (value) {
          return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
        });
        var ShippingAddress = response.responseData.map(function (value) {
          if (value.IsShippingAddress == 1) {
            return value.AddressId
          }
        });
        this.model.AddressId = ShippingAddress[0]

      });


      var postData1 = {
        "IdentityId": this.VendorId,
        "IdentityType": 2
      }
      this.commonService.postHttpService(postData1, 'getAddressList').subscribe(response => {
        this.Ahgroup_AddressList = response.responseData.map(function (value) {
          return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "ShipToAddressId": value.AddressId }
        });
        var ShippingAddress = response.responseData.map(function (value) {
          if (value.IsShippingAddress == 1) {
            return value.AddressId
          }
        });
        this.model.ShipToAddressId = ShippingAddress[0]

      });
      if (this.VendorId > 0) {
        this.ShipToName = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", this.VendorId)

      }
    }


  }


  getAHgroupAddressList() {
    var postData = {
      "IdentityId": CONST_AH_Group_ID,
      "IdentityType": 2
    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.Ahgroup_AddressList = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "ShipToAddressId": value.AddressId }
      });
      var ShippingAddress = response.responseData.map(function (value) {
        if (value.IsShippingAddress == 1) {
          return value.AddressId
        }
      });
      this.model.ShipToAddressId = ShippingAddress[0]

    });


  }
  onSubmit() {
    this.submitted = true;

    if (this.model.Type == 1) {
      var CompanyName = this.filterAndGetValue(this.customerList, "CompanyName", "CustomerId", this.CustomerId)
      this.ShipToName = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", CONST_AH_Group_ID)
      var postData =
      {
        "RRId": this.RRId,
        "ShipFromIdentity": "1",
        "ShipFromId": this.CustomerId,
        "ShipFromName": CompanyName,
        "ShipFromAddressId": this.model.AddressId,
        "ShipViaId": this.model.ShipViaId,
        "TrackingNo": this.model.TrackingNo,
        "PackWeight": this.model.PackWeight,
        "ShippingCost": this.model.ShippingCost,
        "ShipDate": moment(this.model.ShipDate).format('YYYY-MM-DD'),
        "ShippedBy": this.model.ShippedBy,
        "ShipComment": this.model.ShipComment,
        "ShipToIdentity": "2",
        "ShipToId": CONST_AH_Group_ID,
        "ShipToName": this.ShipToName,
        "ReceiveAddressId": this.model.ShipToAddressId,
        "CreatedBy": localStorage.getItem("UserId")
      }
      this.commonService.postHttpService(postData, "RRShipping").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Ship saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Ship could not be saved!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    } else {

      var ShipFromName = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", CONST_AH_Group_ID)
      var ShipToName = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", this.VendorId)

      var postData1 =
      {
        "RRId": this.RRId,
        "ShipFromIdentity": "2",
        "ShipFromId": CONST_AH_Group_ID,
        "ShipFromName": ShipFromName,
        "ShipFromAddressId": this.model.AddressId,
        "ShipViaId": this.model.ShipViaId,
        "TrackingNo": this.model.TrackingNo,
        "PackWeight": this.model.PackWeight,
        "ShippingCost": this.model.ShippingCost,
        "ShipDate": moment(this.model.ShipDate).format('YYYY-MM-DD'),
        "ShippedBy": this.model.ShippedBy,
        "ShipComment": this.model.ShipComment,
        "ShipToIdentity": "2",
        "ShipToId": this.VendorId,
        "ShipToName": ShipToName,
        "ReceiveAddressId": this.model.ShipToAddressId,
        "CreatedBy": localStorage.getItem("UserId")
      }
      this.commonService.postHttpService(postData1, "RRShipping").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Ship saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Ship could not be saved!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
  }



  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}
