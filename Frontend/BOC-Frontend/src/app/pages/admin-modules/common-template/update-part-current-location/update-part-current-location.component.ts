import { Component, OnInit, Inject, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, NgForm } from '@angular/forms';
import { CONST_AH_Group_ID, Const_Alert_pop_message, Const_Alert_pop_title, CONST_ShipAddressType } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-part-current-location',
  templateUrl: './update-part-current-location.component.html',
  styleUrls: ['./update-part-current-location.component.scss']
})
export class UpdatePartCurrentLocationComponent implements OnInit {
  RRId;
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
  editMode
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.getVendorList();
    this.RRId = this.data.RRId;
    this.CustomerId = this.data.CustomerId;
    this.VendorId = this.data.VendorId;
    this.ah_groupId = CONST_AH_Group_ID;
    this.CustomerName = this.data.CustomerName;
    this.editMode = this.data.editMode
    this.getCustomerList();




    if (this.editMode == 1) {
      if (this.data.ShippingIdentityType == 1) {
        this.model.Type = "1"
      } else {
        this.model.Type = "0"
      }
      if (this.data.ShippingIdentityType == 1) {
        this.setCustomerShipAddress(1)
      } else {

        this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(response => {
          if (response.status == true) {
            this.customerAddressList = response.responseData.AHGroupVendorAddress.map(function (value) {
              return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
            });
            let obj = this
            response.responseData.AHGroupVendorAddress.map(function (value) {
              if (value.AddressId == obj.data.ShippingAddressId) {
                return obj.model.AddressId = value.AddressId
              }
            });

          }
          else {

          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));

      }
    }

  }


  getVendorList() {
    this.commonService.getHttpService('getVendorListDropdown').subscribe(response => {
      if (response.status == true) {
        this.vendorList = response.responseData;
        this.VendorName = this.vendorList.find(a => a.VendorId == CONST_AH_Group_ID).VendorName
      }
    });

  }

  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData;
    });

  }

  setCustomerShipAddress(value) {
    if (value == 1) {
      var postData = {
        "IdentityId": this.CustomerId,
        "IdentityType": 1,
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



      this.VendorName = this.vendorList.find(a => a.VendorId == CONST_AH_Group_ID).VendorName

    }


  }

  getAHaddress(value) {
    if (value == 0) {
      this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(response => {
        if (response.status == true) {
          this.customerAddressList = response.responseData.AHGroupVendorAddress.map(function (value) {
            return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
          });

          this.model.AddressId = this.customerAddressList[0].AddressId
        }
        else {
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
  }
  onSubmit(f: NgForm) {
    this.submitted = true;
    if (f.valid) {
      if (this.model.Type == 1) {
        var postData =
        {
          "RRId": this.RRId,
          "ShippingStatus": "2",
          "ShippingIdentityType": "1",
          "ShippingIdentityId": this.CustomerId,
          "ShippingIdentityName": this.CustomerName,
          "ShippingAddressId": this.model.AddressId
        }
        this.commonService.putHttpService(postData, "UpdatePartCurrentLocation").subscribe(response => {
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
        this.VendorName = this.vendorList.find(a => a.VendorId == CONST_AH_Group_ID).VendorName
        if (this.VendorName != '' && this.VendorName != undefined && this.VendorName != null) {
          var postData =
          {
            "RRId": this.RRId,
            "ShippingStatus": "2",
            "ShippingIdentityType": "2",
            "ShippingIdentityId": this.ah_groupId,
            "ShippingIdentityName": this.VendorName,
            "ShippingAddressId": this.model.AddressId

          }
          this.commonService.putHttpService(postData, "UpdatePartCurrentLocation").subscribe(response => {
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
