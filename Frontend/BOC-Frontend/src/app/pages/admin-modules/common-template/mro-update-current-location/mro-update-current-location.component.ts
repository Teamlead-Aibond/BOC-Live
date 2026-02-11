import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { CONST_AH_Group_ID, Const_Alert_pop_message, Const_Alert_pop_title, CONST_ShipAddressType } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mro-update-current-location',
  templateUrl: './mro-update-current-location.component.html',
  styleUrls: ['./mro-update-current-location.component.scss']
})
export class MroUpdateCurrentLocationComponent implements OnInit {

  MROId;
  model: any = {}
  submitted = false;
  CustomerId;
  VendorId;
  ah_groupId;
  customerAddressList;
  VendorName;
  CustomerName;
  vendorList;
  customerList;
  public event: EventEmitter<any> = new EventEmitter();
  AHName
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.MROId = this.data.MROId;
    this.CustomerId = this.data.CustomerId;
    this.VendorId = this.data.VendorId;
    this.ah_groupId = CONST_AH_Group_ID;
    this.VendorName = this.data.VendorName
    this.getCustomerList();


    this.getVendorList();

  }
  getVendorList() {
    this.commonService.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
    });
  }

  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData;
    });

  }

  setVendorShipAddress(value) {
    if (value == 1) {
      var postData = {
        "IdentityId": this.VendorId,
        "IdentityType": 2,
        "Type": CONST_ShipAddressType

      }
      // this.VendorName = ""
      // this.CustomerName = this.customerList.find(a => a.CustomerId == this.CustomerId).CompanyName

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


  }

  setAhShipAddress(value) {

    if (value == 0) {
      var postData = {
        "IdentityId": CONST_AH_Group_ID,
        "IdentityType": 2,
        "Type": CONST_ShipAddressType

      }
      // this.CustomerName = ""
      this.AHName = this.vendorList.find(a => a.VendorId == CONST_AH_Group_ID).VendorName
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


  }

  onSubmit(f: NgForm) {
    this.submitted = true;
    if (f.valid) {
      if (this.model.Type == 1) {
        var postData =
        {
          "MROId": this.MROId,
          "ShippingStatus": "2",
          "ShippingIdentityType": "2",
          "ShippingIdentityId": this.VendorId,
          "ShippingIdentityName": this.VendorName,
          "ShippingAddressId": this.model.AddressId
        }
        this.commonService.putHttpService(postData, "MROUpdatePartCurrentLocation").subscribe(response => {
          if (response.status == true) {
            this.triggerEvent(response.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Part Current Location Updated!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: 'Part Current Location could not be Updated!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      } else {
        var postData =
        {
          "MROId": this.MROId,
          "ShippingStatus": "2",
          "ShippingIdentityType": "2",
          "ShippingIdentityId": this.ah_groupId,
          "ShippingIdentityName": this.AHName,
          "ShippingAddressId": this.model.AddressId

        }
        this.commonService.putHttpService(postData, "MROUpdatePartCurrentLocation").subscribe(response => {
          if (response.status == true) {
            this.triggerEvent(response.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: 'Success!',
              text: 'Part Current Location Updated!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: 'Part Current Location could not be Updated!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));

      }
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
