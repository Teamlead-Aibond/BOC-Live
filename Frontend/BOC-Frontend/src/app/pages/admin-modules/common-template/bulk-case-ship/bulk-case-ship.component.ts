import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { CONST_AH_Group_ID, CONST_ShipAddressType, Const_Alert_pop_title, Const_Alert_pop_message, UPS_ID, shipDescription, UPS_AH_Account_No, UPS_Service } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { PackingSlipComponent } from '../../quotes/packing-slip/packing-slip.component';
import { UpsLabelComponent } from '../ups-label/ups-label.component';
import * as xml2js from 'xml2js';

@Component({
  selector: 'app-bulk-case-ship',
  templateUrl: './bulk-case-ship.component.html',
  styleUrls: ['./bulk-case-ship.component.scss']
})
export class BulkCaseShipComponent implements OnInit {

  CustomerName;
  VendorName
  ahName;
  RRShippingHistory: any = [];
  RRId;
  shippingDetails;
  submitted = false;
  model: any = {}
  AddressList;
  vendorList;
  ShipFromId;
  ShipToName;
  ShipFromName;
  ShipFromAddressId;
  ShipViaList;
  VendorId;
  ShipToAddressList;
  ShippingIdentityId;
  CustomerId;
  Currentdate = new Date();
  ShippingStatus;
  ah_groupId;
  ShippingIdentityType;
  customerList;
  ShipFromAddressList;
  ShipToIdentityName;
  ReceiveIdentityType;
  ShippingAddressId;
  ShippingIdentityName;
  Status;
  btnDisabled: boolean = false;
  public event: EventEmitter<any> = new EventEmitter();

  showVendorName: boolean = false;
  showahName: boolean = false;
  showCustomerName: boolean = false;
  ShipDetails
  ShipFromAddress: any = []
  ShipToAddress: any = []

  //UPS Variable
  access = "0D90D48B4B528035";
  userid = "ahdshipping1";
  passwd = "American@2020";
  // wsdl = "http://localhost/Shipping_Pkg/ShippingPACKAGE/PACKAGEWebServices/SCHEMA-WSDLs/Ship.wsdl";
  wsdl = "assets/xml/Ship-copy.wsdl";
  operation = "ProcessShipment";
  endpointurl = "https://wwwcie.ups.com/webservices/Ship";
  outputFileName = "XOLTResult.xml";
  outputFileNameJson = "XOLTResult.json";
  shipperNumber = "425597";
  shipRequestOption = "nonvalidate";
  shipperName = 'ShipperName';
  shipperAttentionName = 'ShipperZs Attn Name';
  shipperTaxIdentificationNumber = '123456';
  shipperAddressLine = '2311 York Rd';
  shipperCity = 'Timonium';
  shipperStateProvinceCode = 'MD';
  shipperPostalCode = '21093';
  shipperCountryCode = 'US';
  shipperPhoneNumber = '1115554758';
  shipperPhoneExtension = '1';
  ShipAccountNumber
  ups_gif_image: any;
  ups_html_image: any;
  ups_html_image_decode: any;
  ups_status: any;
  ups_tracking_number: any;
  ups_trans_code: any;
  ups_trans_value: any;
  ups_service_value: any;
  ups_service_code: any;
  ups_total_value: any;
  ups_total_code: any;
  ups_unit_code: any;
  ups_unit_des: any;
  ups_unit_weight: any;
  error: any;
  Form: FormGroup
  xml: any;
  ShippingHistoryId
  UPSId
  UPSServiceList: any = []
  settingsView
  IsUPSEnable
  IsUserUPSEnable
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private CommonmodalService: BsModalService,
    private datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.settingsView = ""
    this.ShipDetails = this.data.ShipDetails;
    this.UPSId = UPS_ID
    this.UPSServiceList = UPS_Service
    this.IsUserUPSEnable = localStorage.getItem('IsUserUPSEnable')
    this.getAdminSettingsView()


    this.RRId = this.ShipDetails.RRId;
    this.VendorId = this.ShipDetails.VendorId;
    this.CustomerId = this.ShipDetails.CustomerId
    this.ShippingIdentityId = this.ShipDetails.ShippingIdentityId
    this.ShippingAddressId = this.ShipDetails.ShippingAddressId
    this.ShippingIdentityName = this.ShipDetails.ShippingIdentityName
    this.ShippingStatus = this.ShipDetails.ShippingStatus;
    this.Status = this.ShipDetails.Status


    this.model.ShippedBy = localStorage.getItem("UserName");
    this.ah_groupId = CONST_AH_Group_ID
    if (this.ShipDetails.ShipFromId != null) {
      this.shippingDetails = this.ShipDetails
      this.ShipFromId = this.shippingDetails.ShipToId;
      this.ShipFromAddressId = this.shippingDetails.ReceiveAddressId;
      this.ShipFromName = this.shippingDetails.ShipToName;
      this.ShipToIdentityName = this.shippingDetails.ShipToIdentityName
      if (this.ShipToIdentityName == "Vendor") {
        this.ShippingIdentityType = 2
      }
      else {
        this.ShippingIdentityType = 1

      }
    }
    else {
      this.ShipFromId = this.ShippingIdentityId
      this.ShipFromAddressId = this.ShippingAddressId
      this.ShipFromName = this.ShippingIdentityName
      this.ShippingIdentityType = this.ShipDetails.ShippingIdentityType
    }


    const years = Number(this.datePipe.transform(this.Currentdate, 'yyyy'));
    const Month = Number(this.datePipe.transform(this.Currentdate, 'MM'));
    const Day = Number(this.datePipe.transform(this.Currentdate, 'dd'));
    this.model.ShipDate = {
      year: years,
      month: Month,
      day: Day
    }

    this.getVendorList();
    this.getCustomerList();
    this.getShipViaList();
    if (this.ShipFromId == CONST_AH_Group_ID) {
      this.getAHaddress()
    } else {
      this.getShipFromAddressList();
    }
  }
  getAdminSettingsView() {
    var postData = {}
    this.commonService.postHttpService(postData, "getSettingsGeneralView").subscribe(response => {
      if (response.status == true) {
        this.settingsView = response.responseData;
        this.IsUPSEnable = this.settingsView.IsUPSEnable

      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  getVendorList() {
    this.commonService.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
      // if (this.ShipFromId == this.ah_groupId && this.shippingDetails.ShipIdentityType == "Customer") {
      //   if (this.VendorId != '') {


      //     this.ShipToName = this.vendorList.find(a => a.VendorId == this.VendorId).VendorName

      //   }
      // }

      this.VendorName = this.vendorList.find(a => a.VendorId == this.VendorId).VendorName

    });
  }

  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData;
      // if (this.ShipFromId == this.ah_groupId && this.ShippingStatus == 2 && this.shippingDetails.ShipIdentityType != "Customer") {
      //   // if (this.CustomerId != '') {


      //   //   this.ShipToName = this.customerList.find(a => a.CustomerId == this.CustomerId).CompanyName

      //   // } else {
      //   //   this.ShipToName = ""

      //   // }
      // }
      this.CustomerName = this.customerList.find(a => a.CustomerId == this.CustomerId).CompanyName

    });
  }

  getAHaddress() {
    this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(response => {
      if (response.status == true) {
        this.ShipFromAddressList = response.responseData.AHGroupVendorAddress.map(function (value) {
          return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "Address": value.AddressId }
        });
        this.ShipFromAddress = response.responseData.AHGroupVendorAddress
        // this.model.Address =this.ShipFromAddressList[0].Address
        let obj = this
        if (this.RRShippingHistory.length == 0) {
          response.responseData.AHGroupVendorAddress.map(function (value) {
            if (value.AddressId == obj.ShippingAddressId) {
              return obj.model.Address = value.AddressId
            }
          });
        } else {
          response.responseData.AHGroupVendorAddress.map(function (value) {
            if (value.AddressId == obj.shippingDetails.ReceiveAddressId) {
              return obj.model.Address = value.AddressId
            }
          });
        }
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  filterAndGetValue(object, getField, filterField, filterValue) {
    var value = object.filter(function (data) {
      return data[filterField] == filterValue;
    }, filterField, filterValue)
    return value[0][getField];
  }
  getShipViaList() {
    this.commonService.getHttpService('ShipViaList').subscribe(response => {
      this.ShipViaList = response.responseData;
    });
  }


  getShipFromAddressList() {

    var postData = {
      "IdentityId": this.ShipFromId,
      "IdentityType": this.ShippingIdentityType,
      "Type": CONST_ShipAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.ShipFromAddressList = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "Address": value.AddressId }
      });
      this.ShipFromAddress = response.responseData
      var ShippingAddress = response.responseData.map(function (value) {
        if (value.IsShippingAddress == 1) {
          return value.AddressId
        }
      });
      this.model.Address = ShippingAddress[0]
      // console.log(this.model.Address)

    });




  }


  setShipVendorAddressList(value) {
    if (this.VendorId == "") {
      Swal.fire({
        title: 'Please Assign Vendor to Proceed the Shipping',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
      this.modalRef.hide();

    } else {
      if (value == 0) {
        var postData = {
          "IdentityId": this.VendorId,
          "IdentityType": 2,
          "Type": 0

        }
        this.showCustomerName = false
        this.showVendorName = true
        this.showahName = false

        // this.ahName = ""
        // this.CustomerName = ""
        // this.VendorName = this.vendorList.find(a => a.VendorId == this.VendorId).VendorName

        this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
          this.ShipToAddressList = response.responseData.map(function (value) {
            return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "ShipToAddressId": value.AddressId }
          });
          var ShippingAddress = response.responseData.map(function (value) {
            if (value.IsShippingAddress == 1) {
              return value.AddressId
            }
          });
          this.model.ShipToAddressId = ShippingAddress[0]
          this.ShipToAddress = response.responseData
        });
      }
    }
    this.model.refNo1 = this.data.VendorRefNo
    this.model.refNo2 = this.data.RRNo
    this.ShipAccountNumber = this.data.UPS_Vendor_Account_No ? this.data.UPS_Vendor_Account_No : UPS_AH_Account_No
  }
  getShipToAddressList() {

    // if (this.ShipFromId == this.ah_groupId && this.shippingDetails.ShipIdentityType == "Customer") {
    //   var postData = {
    //     "IdentityId": this.VendorId,
    //     "IdentityType": 2
    //   }
    //   this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
    //     this.ShipToAddressList = response.responseData.map(function (value) {
    //       return { title: value.StreetAddress + " , " + value.City + " , " + value.CountryName + " ," + value.StateName + ".-" + value.Zip, "ShipToAddressId": value.AddressId }
    //     });
    //     var ShippingAddress = response.responseData.map(function (value) {
    //       if (value.IsShippingAddress == 1) {
    //         return value.AddressId
    //       }
    //     });
    //     this.model.ShipToAddressId = ShippingAddress[0]

    //   });

    // }

    // if (this.ShipFromId == this.ah_groupId && this.ShippingStatus == 2 && this.ShipFromId != this.VendorId && this.shippingDetails.ShipIdentityType != "Customer") {
    //   var postData = {
    //     "IdentityId": this.CustomerId,
    //     "IdentityType": 1
    //   }
    //   this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
    //     this.ShipToAddressList = response.responseData.map(function (value) {
    //       return { title: value.StreetAddress + " , " + value.City + " , " + value.CountryName + " ," + value.StateName + ".-" + value.Zip, "ShipToAddressId": value.AddressId }
    //     });
    //     var ShippingAddress = response.responseData.map(function (value) {
    //       if (value.IsShippingAddress == 1) {
    //         return value.AddressId
    //       }
    //     });
    //     this.model.ShipToAddressId = ShippingAddress[0]

    //   });

    // }
  }

  setCustomerShipAddress(value) {
    if (value == 1) {
      var postData = {
        "IdentityId": this.CustomerId,
        "IdentityType": 1,
        "Type": CONST_ShipAddressType
      }
      this.showCustomerName = true
      this.showVendorName = false
      this.showahName = false
      // this.VendorName = ""
      // this.CustomerName = this.customerList.find(a => a.CustomerId == this.CustomerId).CompanyName

      this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
        this.ShipToAddressList = response.responseData.map(function (value) {
          return { title: value.StreetAddress + " , " + value.City + " , " + value.CountryName + " ," + value.StateName + ".-" + value.Zip, "ShipToAddressId": value.AddressId }
        });
        this.ShipToAddress = response.responseData
        var ShippingAddress = response.responseData.map(function (value) {
          if (value.IsShippingAddress == 1) {
            return value.AddressId
          }
        });
        this.model.ShipToAddressId = ShippingAddress[0]
        this.ShipToAddress = response.responseData
      });
    }
    this.model.refNo1 = this.data.CustomerPONo
    this.model.refNo2 = this.data.RRNo
    this.ShipAccountNumber = this.data.UPS_Customer_Account_No ? this.data.UPS_Customer_Account_No : UPS_AH_Account_No
  }
  setAhShipAddresCustomerShipFromId(value) {
    // if (this.VendorId == "") {
    //   Swal.fire({
    //     title: 'Please Assign Vendor to Proceed the Shipping',
    //     confirmButtonClass: 'btn btn-confirm mt-2'
    //   });
    //   this.modalRef.hide();

    // }
    if (value == 1) {
      var postData = {
        "IdentityId": CONST_AH_Group_ID,
        "IdentityType": 2,
        "Type": CONST_ShipAddressType

      }
      this.showahName = true
      this.showVendorName = false
      // this.VendorName = ""
      // this.ahName = this.vendorList.find(a => a.VendorId == CONST_AH_Group_ID).VendorName
      this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(response => {
        if (response.status == true) {
          this.ShipToAddressList = response.responseData.AHGroupVendorAddress.map(function (value) {
            return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "ShipToAddressId": value.AddressId }
          });
          this.model.ShipToAddressId = this.ShipToAddressList[0].ShipToAddressId
          this.ShipToAddress = response.responseData.AHGroupVendorAddress
        }
        else {

        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
      // this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      //   this.ShipToAddressList = response.responseData.map(function (value) {
      //     return { title: value.StreetAddress + " , " + value.City + " , " + value.CountryName + " ," + value.StateName + ".-" + value.Zip, "ShipToAddressId": value.AddressId }
      //   });
      //   var ShippingAddress = response.responseData.map(function (value) {
      //     if (value.IsShippingAddress == 1) {
      //       return value.AddressId
      //     }
      //   });
      //   this.model.ShipToAddressId = ShippingAddress[0]

      // });
    }
  }
  setAhShipAddress(value) {
    // if (this.VendorId == "") {
    //   // Swal.fire({
    //   //   title: 'Please Assign Vendor to Proceed the Shipping',
    //   //   confirmButtonClass: 'btn btn-confirm mt-2'
    //   // });
    //   // this.modalRef.hide();

    // }
    if (value == 0) {
      var postData = {
        "IdentityId": CONST_AH_Group_ID,
        "IdentityType": 2,
        "Type": CONST_ShipAddressType

      }
      this.showCustomerName = false
      this.showahName = true
      // this.CustomerName = ""
      // this.VendorName = this.vendorList.find(a => a.VendorId == CONST_AH_Group_ID).VendorName

      this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(response => {
        if (response.status == true) {
          this.ShipToAddressList = response.responseData.AHGroupVendorAddress.map(function (value) {
            return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "ShipToAddressId": value.AddressId }
          });
          this.model.ShipToAddressId = this.ShipToAddressList[0].ShipToAddressId
          this.ShipToAddress = response.responseData.AHGroupVendorAddress
        }
        else {

        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));

      // this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      //   this.ShipToAddressList = response.responseData.map(function (value) {
      //     return { title: value.StreetAddress + " , " + value.City + " , " + value.CountryName + " ," + value.StateName + ".-" + value.Zip, "ShipToAddressId": value.AddressId }
      //   });
      //   var ShippingAddress = response.responseData.map(function (value) {
      //     if (value.IsShippingAddress == 1) {
      //       return value.AddressId
      //     }
      //   });
      //   this.model.ShipToAddressId = ShippingAddress[0]

      // });
    }
  }
  setAhShipToAddress(value) {
    // if (this.VendorId == "") {
    //   Swal.fire({
    //     title: 'Please Assign Vendor to Proceed the Shipping',
    //     confirmButtonClass: 'btn btn-confirm mt-2'
    //   });
    //   this.modalRef.hide();

    // }
    if (value == 2) {
      var postData = {
        "IdentityId": CONST_AH_Group_ID,
        "IdentityType": 2,
        "Type": CONST_ShipAddressType

      }
      this.showahName = true
      this.showCustomerName = false
      this.showVendorName = false
      // this.VendorName = ""
      // this.ahName = this.vendorList.find(a => a.VendorId == CONST_AH_Group_ID).VendorName
      this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(response => {
        if (response.status == true) {
          this.ShipToAddressList = response.responseData.AHGroupVendorAddress.map(function (value) {
            return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "ShipToAddressId": value.AddressId }
          });
          this.model.ShipToAddressId = this.ShipToAddressList[0].ShipToAddressId
          this.ShipToAddress = response.responseData.AHGroupVendorAddress
        }
        else {

        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
      this.model.BillToType = 1
      // this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      //   this.ShipToAddressList = response.responseData.map(function (value) {
      //     return { title: value.StreetAddress + " , " + value.City + " , " + value.CountryName + " ," + value.StateName + ".-" + value.Zip, "ShipToAddressId": value.AddressId }
      //   });
      //   var ShippingAddress = response.responseData.map(function (value) {
      //     if (value.IsShippingAddress == 1) {
      //       return value.AddressId
      //     }
      //   });
      //   this.model.ShipToAddressId = ShippingAddress[0]

      // });
    }
  }
  onSubmit(f: NgForm) {
    const ShipDateYears = this.model.ShipDate.year;
    const ShipDateDates = this.model.ShipDate.day;
    const ShipDatemonths = this.model.ShipDate.month;
    let shipDate = new Date(ShipDateYears, ShipDatemonths - 1, ShipDateDates);
    let ShipDate = moment(shipDate).format('YYYY-MM-DD');
    if (f.valid) {
      if (this.model.ShipToAddressId != this.model.Address) {

        this.btnDisabled = true;
        if (this.model.ShowCustomerReference == true) {
          var ShowCustomerReference = 1
        }
        else {
          ShowCustomerReference = 0
        }

        if (this.model.ShowRootCause == true) {
          var ShowRootCause = 1
        }
        else {
          ShowRootCause = 0
        }

        var ShipToName = this.CustomerName || this.VendorName
        var ShipFromAddressLine = this.filterAndGetValue(this.ShipFromAddress, "StreetAddress", "AddressId", this.model.Address)
        var ShipFromCity = this.filterAndGetValue(this.ShipFromAddress, "City", "AddressId", this.model.Address)
        var ShipFromCountryCode = this.filterAndGetValue(this.ShipFromAddress, "CountryCode", "AddressId", this.model.Address)
        var ShipFromStateCode = this.filterAndGetValue(this.ShipFromAddress, "StateCode", "AddressId", this.model.Address)
        var ShipFromPostalCode = this.filterAndGetValue(this.ShipFromAddress, "Zip", "AddressId", this.model.Address)
        var ShipFromNumber = this.filterAndGetValue(this.ShipFromAddress, "PhoneNoPrimary", "AddressId", this.model.Address)


        var ShipToAddressLine = this.filterAndGetValue(this.ShipToAddress, "StreetAddress", "AddressId", this.model.ShipToAddressId)
        var ShipToCity = this.filterAndGetValue(this.ShipToAddress, "City", "AddressId", this.model.ShipToAddressId)
        var ShipToCountryCode = this.filterAndGetValue(this.ShipToAddress, "CountryCode", "AddressId", this.model.ShipToAddressId)
        var ShipToStateCode = this.filterAndGetValue(this.ShipToAddress, "StateCode", "AddressId", this.model.ShipToAddressId)
        var ShipToPostalCode = this.filterAndGetValue(this.ShipToAddress, "Zip", "AddressId", this.model.ShipToAddressId)
        var ShipToNumber = this.filterAndGetValue(this.ShipToAddress, "PhoneNoPrimary", "AddressId", this.model.ShipToAddressId)
        if (this.model.UPSService) {
          var UPS_Service_Description = this.filterAndGetValue(this.UPSServiceList, "UPS_Service_Description", "UPS_Service_Code", this.model.UPSService)
        }

        this.Form = this.fb.group({
          ShipToName: [ShipToName],
          ShipToAttentionName: [ShipToName],
          ShipToAddressLine: [ShipToAddressLine],
          ShipToCity: [ShipToCity],
          ShipToStateCode: [ShipToStateCode],
          ShipToPostalCode: [ShipToPostalCode],
          ShipToCountryCode: [ShipToCountryCode],
          ShipToNumber: [ShipToNumber],

          ShipFromName: [this.ShipFromName],
          ShipFromAttentionName: [this.ShipFromName],
          ShipFromAddressLine: [ShipFromAddressLine],
          ShipFromCity: [ShipFromCity],
          ShipFromStateCode: [ShipFromStateCode],
          ShipFromPostalCode: [ShipFromPostalCode],
          ShipFromCountryCode: [ShipFromCountryCode],
          ShipFromNumber: [ShipFromNumber],
          Weight: [this.model.PackWeight],
          refNo1: [this.model.refNo1],
          refNo2: [this.model.refNo2],
          UPS_Service_Code: [this.model.UPSService],
          UPS_Service_Description: [UPS_Service_Description]
        })



        //not ups case
        if (this.model.Type == 0) {
          var ShipToName1 = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", CONST_AH_Group_ID)
          var postDataAH = {
            "RRId": this.RRId,
            "ShipFromIdentity": "2",
            "ShipFromId": this.ShipFromId,
            "ShipFromName": this.ShipFromName,
            "ShipFromAddressId": this.model.Address,
            "ShipViaId": this.model.ShipViaId,
            "TrackingNo": this.model.TrackingNo,
            "PackWeight": this.model.PackWeight,
            "ShippingCost": this.model.ShippingCost,
            "ShipDate": ShipDate,
            "ShippedBy": this.model.ShippedBy,
            "ShipComment": this.model.ShipComment,
            "ShipToIdentity": "2",
            "ShipToId": CONST_AH_Group_ID,
            "ShipToName": ShipToName1,
            "ShipToAddressId": this.model.ShipToAddressId,
            "CreatedBy": localStorage.getItem("UserId"),
            "ShowCustomerReference": ShowCustomerReference,
            "ShowRootCause": ShowRootCause,
            "ShipDetails": this.ShipDetails
          }
          this.commonService.postHttpService(postDataAH, "RRShipping").subscribe(response => {

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

        //UPS Case avaliable
        if (this.model.Type == 1 && this.ShipFromId == this.ah_groupId && this.model.ShipViaId == this.UPSId && this.IsUPSEnable == '1' && this.IsUserUPSEnable == 1) {

          if (this.model.Type == 1) {
            // this.soapserviceService.postHttpService(this.post(this.Form.value), this.endpointurl, '').subscribe(
            //   (response: any) => {
            this.commonService.postHttpService(this.Form.value, "UPSGenerateLabel").subscribe(response => {
              const parser = new xml2js.Parser({ strict: true, trim: true });
              parser.parseString(response.responseData, (err, result) => {
                this.xml = result;
              });
              this.getResult(this.xml)
              if (this.ups_status != 'fail') {
                if (this.model.Type == 1) {
                  var CompanyName = this.filterAndGetValue(this.customerList, "CompanyName", "CustomerId", this.CustomerId)
                  // Swal.fire({
                  //   title: 'Are you sure?',
                  //   text: 'You won\'t be able to revert this!',
                  //   type: 'warning',
                  //   showCancelButton: true,
                  //   confirmButtonText: 'Yes, create it!',
                  //   cancelButtonText: 'No, cancel!',
                  //   confirmButtonClass: 'btn btn-success mt-2',
                  //   cancelButtonClass: 'btn btn-danger ml-2 mt-2',
                  //   buttonsStyling: false
                  // }).then((result) => {
                  //   if (result.value) {
                  var postDataCustomer = {
                    "RRId": this.RRId,
                    "ShipFromIdentity": "2",
                    "ShipFromId": this.ShipFromId,
                    "ShipFromName": this.ShipFromName,
                    "ShipFromAddressId": this.model.Address,
                    "ShipViaId": this.model.ShipViaId,
                    "TrackingNo": this.model.TrackingNo,
                    "PackWeight": this.model.PackWeight,
                    "ShippingCost": this.model.ShippingCost,
                    "ShipDate": ShipDate,
                    "ShippedBy": this.model.ShippedBy,
                    "ShipComment": this.model.ShipComment,
                    "ShipToIdentity": "1",
                    "ShipToId": this.CustomerId,
                    "ShipToName": CompanyName,
                    "ShipToAddressId": this.model.ShipToAddressId,
                    "CreatedBy": localStorage.getItem("UserId"),
                    "ShowCustomerReference": ShowCustomerReference,
                    "ShowRootCause": ShowRootCause,
                    "ShipDetails": this.ShipDetails


                  }
                  this.commonService.postHttpService(postDataCustomer, "RRShipping").subscribe(response => {

                    if (response.status == true) {
                      this.ShippingHistoryId = response.responseData.ShippingHistoryId
                      this.RRId = response.responseData.RRId
                      //CREATE UPS
                      var postDataCREATEUPS = {
                        "ShippingHistoryId": this.ShippingHistoryId,
                        "UPSTrackingNo": this.ups_tracking_number,
                        "TransportationCharges": this.ups_trans_value,
                        "ServiceOptionsCharges": this.ups_service_value,
                        "OverallTotalCharges": this.ups_total_value,
                        "BillingWeightCode": this.ups_unit_code,
                        "BillingWeight": this.ups_unit_weight,
                        "UPSStatus": this.ups_status,
                        "UPSShippingLabel": this.ups_gif_image,
                        "UPSShippingLabelHtml": this.ups_html_image,
                      }
                      this.commonService.postHttpService(postDataCREATEUPS, "UPSCreate").subscribe(response => {

                        if (response.status == true) {

                        }
                        else {

                        }
                        this.cd_ref.detectChanges();
                      }, error => console.log(error));
                      this.triggerEvent(response.responseData);
                      this.modalRef.hide();
                      var result = this.xml

                      this.modalRef = this.CommonmodalService.show(UpsLabelComponent,
                        {
                          backdrop: 'static',
                          ignoreBackdropClick: false,
                          initialState: {
                            data: { result },
                            class: 'modal-xl'
                          }, class: 'gray modal-xl'
                        });

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


                  if (this.Status == 5) {
                    var postData = {
                      RRId: this.RRId,

                    }
                    this.commonService.postHttpService(postData, 'RRCreateInvoice').subscribe(response => {
                      if (response.status == true) {
                        Swal.fire({
                          title: 'Created Customer Invoice!',
                          text: 'Customer Invoice has been created.',
                          type: 'success'
                        });
                      }
                    });

                    var postData = {
                      RRId: this.RRId,

                    }
                    this.commonService.postHttpService(postData, 'RRComplete').subscribe(response => {
                      if (response.status == true) {
                        Swal.fire({
                          title: 'Completed!',
                          text: 'Repair Request has been completed.',
                          type: 'success'
                        });
                      }
                    });
                  }

                }



              } else {
                this.btnDisabled = false;
                Swal.fire({
                  type: 'error',
                  text: this.error,
                  confirmButtonClass: 'btn btn-confirm mt-2',
                });
              }
            },
              (error: any) => {
                console.log(error)
              })
          }
        } else {
          if (this.model.Type == 1) {
            var CompanyName = this.filterAndGetValue(this.customerList, "CompanyName", "CustomerId", this.CustomerId)
            // Swal.fire({
            //   title: 'Are you sure?',
            //   text: 'You won\'t be able to revert this!',
            //   type: 'warning',
            //   showCancelButton: true,
            //   confirmButtonText: 'Yes, create it!',
            //   cancelButtonText: 'No, cancel!',
            //   confirmButtonClass: 'btn btn-success mt-2',
            //   cancelButtonClass: 'btn btn-danger ml-2 mt-2',
            //   buttonsStyling: false
            // }).then((result) => {
            //   if (result.value) {
            var postDataCustomer = {
              "RRId": this.RRId,
              "ShipFromIdentity": "2",
              "ShipFromId": this.ShipFromId,
              "ShipFromName": this.ShipFromName,
              "ShipFromAddressId": this.model.Address,
              "ShipViaId": this.model.ShipViaId,
              "TrackingNo": this.model.TrackingNo,
              "PackWeight": this.model.PackWeight,
              "ShippingCost": this.model.ShippingCost,
              "ShipDate": ShipDate,
              "ShippedBy": this.model.ShippedBy,
              "ShipComment": this.model.ShipComment,
              "ShipToIdentity": "1",
              "ShipToId": this.CustomerId,
              "ShipToName": CompanyName,
              "ShipToAddressId": this.model.ShipToAddressId,
              "CreatedBy": localStorage.getItem("UserId"),
              "ShowCustomerReference": ShowCustomerReference,
              "ShowRootCause": ShowRootCause,
              "ShipDetails": this.ShipDetails

            }
            this.commonService.postHttpService(postDataCustomer, "RRShipping").subscribe(response => {

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


            if (this.Status == 5) {
              var postData = {
                RRId: this.RRId,

              }
              this.commonService.postHttpService(postData, 'RRCreateInvoice').subscribe(response => {
                console.log('RRCreateInvoice', response)
                if (response.status == true) {
                  Swal.fire({
                    title: 'Created Customer Invoice!',
                    text: 'Customer Invoice has been created.',
                    type: 'success'
                  });
                }
              });

              var postData = {
                RRId: this.RRId,

              }
              this.commonService.postHttpService(postData, 'RRComplete').subscribe(response => {
                if (response.status == true) {
                  Swal.fire({
                    title: 'Completed!',
                    text: 'Repair Request has been completed.',
                    type: 'success'
                  });
                }
              });
            }

          }
        }


        // UPS Case avaliable
        if (this.model.Type1 == 0 && this.ShipFromId == this.ah_groupId && this.model.ShipViaId == this.UPSId && this.IsUPSEnable == '1' && this.IsUserUPSEnable == 1) {
          if (this.model.Type1 == 0) {
            // this.soapserviceService.postHttpService(this.post(this.Form.value), this.endpointurl, '').subscribe(
            //   (response: any) => {
            this.commonService.postHttpService(this.Form.value, "UPSGenerateLabel").subscribe(response => {
              const parser = new xml2js.Parser({ strict: true, trim: true });
              parser.parseString(response.responseData, (err, result) => {
                this.xml = result;
              });
              this.getResult(this.xml)
              if (this.ups_status != 'fail') {
                var ShipToNameType1 = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", this.VendorId)

                var postDataVendor = {
                  "RRId": this.RRId,
                  "ShipFromIdentity": "2",
                  "ShipFromId": this.ShipFromId,
                  "ShipFromName": this.ShipFromName,
                  "ShipFromAddressId": this.model.Address,
                  "ShipViaId": this.model.ShipViaId,
                  "TrackingNo": this.model.TrackingNo,
                  "PackWeight": this.model.PackWeight,
                  "ShippingCost": this.model.ShippingCost,
                  "ShipDate": ShipDate,
                  "ShippedBy": this.model.ShippedBy,
                  "ShipComment": this.model.ShipComment,
                  "ShipToIdentity": "2",
                  "ShipToId": this.VendorId,
                  "ShipToName": ShipToNameType1,
                  "ShipToAddressId": this.model.ShipToAddressId,
                  "CreatedBy": localStorage.getItem("UserId"),
                  "ShowCustomerReference": ShowCustomerReference,
                  "ShowRootCause": ShowRootCause,
                  "ShipDetails": this.ShipDetails


                }
                this.commonService.postHttpService(postDataVendor, "RRShipping").subscribe(response => {

                  if (response.status == true) {
                    this.ShippingHistoryId = response.responseData.ShippingHistoryId
                    this.RRId = response.responseData.RRId
                    //CREATE UPS
                    var postDataCREATEUPS = {
                      "ShippingHistoryId": this.ShippingHistoryId,
                      "UPSTrackingNo": this.ups_tracking_number,
                      "TransportationCharges": this.ups_trans_value,
                      "ServiceOptionsCharges": this.ups_service_value,
                      "OverallTotalCharges": this.ups_total_value,
                      "BillingWeightCode": this.ups_unit_code,
                      "BillingWeight": this.ups_unit_weight,
                      "UPSStatus": this.ups_status,
                      "UPSShippingLabel": this.ups_gif_image,
                      "UPSShippingLabelHtml": this.ups_html_image,
                    }
                    this.commonService.postHttpService(postDataCREATEUPS, "UPSCreate").subscribe(response => {

                      if (response.status == true) {

                      }
                      else {

                      }
                      this.cd_ref.detectChanges();
                    }, error => console.log(error));
                    this.triggerEvent(response.responseData);
                    this.modalRef.hide();
                    var result = this.xml

                    this.modalRef = this.CommonmodalService.show(UpsLabelComponent,
                      {
                        backdrop: 'static',
                        ignoreBackdropClick: false,
                        initialState: {
                          data: { result },
                          class: 'modal-xl'
                        }, class: 'gray modal-xl'
                      });

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
                this.btnDisabled = false;
                Swal.fire({
                  type: 'error',
                  text: this.error,
                  confirmButtonClass: 'btn btn-confirm mt-2',
                });
              }
            },
              (error: any) => {
                console.log(error)
              })
          }
        } else {

          if (this.model.Type1 == 0) {
            var ShipToNameType1 = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", this.VendorId)

            var postDataVendor = {
              "RRId": this.RRId,
              "ShipFromIdentity": "2",
              "ShipFromId": this.ShipFromId,
              "ShipFromName": this.ShipFromName,
              "ShipFromAddressId": this.model.Address,
              "ShipViaId": this.model.ShipViaId,
              "TrackingNo": this.model.TrackingNo,
              "PackWeight": this.model.PackWeight,
              "ShippingCost": this.model.ShippingCost,
              "ShipDate": ShipDate,
              "ShippedBy": this.model.ShippedBy,
              "ShipComment": this.model.ShipComment,
              "ShipToIdentity": "2",
              "ShipToId": this.VendorId,
              "ShipToName": ShipToNameType1,
              "ShipToAddressId": this.model.ShipToAddressId,
              "CreatedBy": localStorage.getItem("UserId"),
              "ShowCustomerReference": ShowCustomerReference,
              "ShowRootCause": ShowRootCause,
              "ShipDetails": this.ShipDetails


            }
            this.commonService.postHttpService(postDataVendor, "RRShipping").subscribe(response => {

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

        if (this.model.Type1 == 1 && this.ShipFromId != this.ah_groupId) {
          var CompanyName = this.filterAndGetValue(this.customerList, "CompanyName", "CustomerId", this.CustomerId)
          var postDataCustomer1 = {
            "RRId": this.RRId,
            "ShipFromIdentity": "2",
            "ShipFromId": this.ShipFromId,
            "ShipFromName": this.ShipFromName,
            "ShipFromAddressId": this.model.Address,
            "ShipViaId": this.model.ShipViaId,
            "TrackingNo": this.model.TrackingNo,
            "PackWeight": this.model.PackWeight,
            "ShippingCost": this.model.ShippingCost,
            "ShipDate": ShipDate,
            "ShippedBy": this.model.ShippedBy,
            "ShipComment": this.model.ShipComment,
            "ShipToIdentity": "1",
            "ShipToId": this.CustomerId,
            "ShipToName": CompanyName,
            "ShipToAddressId": this.model.ShipToAddressId,
            "CreatedBy": localStorage.getItem("UserId"),
            "ShowCustomerReference": ShowCustomerReference,
            "ShowRootCause": ShowRootCause,
            "ShipDetails": this.ShipDetails

          }
          this.commonService.postHttpService(postDataCustomer1, "RRShipping").subscribe(response => {

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

        //New one UPS Case avaliable
        if (this.ShipFromId == this.ah_groupId && this.model.Type1 == 1 && this.model.ShipViaId == this.UPSId && this.IsUPSEnable == '1' && this.IsUserUPSEnable == 1) {
          // this.soapserviceService.postHttpService(this.post(this.Form.value), this.endpointurl, '').subscribe(
          //   (response: any) => {
          this.commonService.postHttpService(this.Form.value, "UPSGenerateLabel").subscribe(response => {
            const parser = new xml2js.Parser({ strict: true, trim: true });
            parser.parseString(response.responseData, (err, result) => {
              this.xml = result;
            });
            this.getResult(this.xml)
            if (this.ups_status != 'fail') {
              if (this.ShipFromId == this.ah_groupId && this.model.Type1 == 1) {
                var CompanyName = this.filterAndGetValue(this.customerList, "CompanyName", "CustomerId", this.CustomerId)
                var postDataCustomership = {
                  "RRId": this.RRId,
                  "ShipFromIdentity": "2",
                  "ShipFromId": this.ShipFromId,
                  "ShipFromName": this.ShipFromName,
                  "ShipFromAddressId": this.model.Address,
                  "ShipViaId": this.model.ShipViaId,
                  "TrackingNo": this.model.TrackingNo,
                  "PackWeight": this.model.PackWeight,
                  "ShippingCost": this.model.ShippingCost,
                  "ShipDate": ShipDate,
                  "ShippedBy": this.model.ShippedBy,
                  "ShipComment": this.model.ShipComment,
                  "ShipToIdentity": "1",
                  "ShipToId": this.CustomerId,
                  "ShipToName": CompanyName,
                  "ShipToAddressId": this.model.ShipToAddressId,
                  "CreatedBy": localStorage.getItem("UserId"),
                  "ShowCustomerReference": ShowCustomerReference,
                  "ShowRootCause": ShowRootCause,
                  "ShipDetails": this.ShipDetails


                }
                this.commonService.postHttpService(postDataCustomership, "RRShipping").subscribe(response => {

                  if (response.status == true) {
                    this.ShippingHistoryId = response.responseData.ShippingHistoryId
                    this.RRId = response.responseData.RRId
                    //CREATE UPS
                    var postDataCREATEUPS = {
                      "ShippingHistoryId": this.ShippingHistoryId,
                      "UPSTrackingNo": this.ups_tracking_number,
                      "TransportationCharges": this.ups_trans_value,
                      "ServiceOptionsCharges": this.ups_service_value,
                      "OverallTotalCharges": this.ups_total_value,
                      "BillingWeightCode": this.ups_unit_code,
                      "BillingWeight": this.ups_unit_weight,
                      "UPSStatus": this.ups_status,
                      "UPSShippingLabel": this.ups_gif_image,
                      "UPSShippingLabelHtml": this.ups_html_image,
                    }
                    this.commonService.postHttpService(postDataCREATEUPS, "UPSCreate").subscribe(response => {

                      if (response.status == true) {

                      }
                      else {

                      }
                      this.cd_ref.detectChanges();
                    }, error => console.log(error));
                    this.triggerEvent(response.responseData);
                    this.modalRef.hide();
                    var result = this.xml

                    this.modalRef = this.CommonmodalService.show(UpsLabelComponent,
                      {
                        backdrop: 'static',
                        ignoreBackdropClick: false,
                        initialState: {
                          data: { result },
                          class: 'modal-xl'
                        }, class: 'gray modal-xl'
                      });

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

                if (this.Status == 5) {

                  var postData = {
                    RRId: this.RRId,

                  }
                  this.commonService.postHttpService(postData, 'RRCreateInvoice').subscribe(response => {
                    console.log('RRCreateInvoice', response)
                    if (response.status == true) {
                      Swal.fire({
                        title: 'Created Customer Invoice!',
                        text: 'Customer Invoice has been created.',
                        type: 'success'
                      });
                    }
                  });

                  var postData = {
                    RRId: this.RRId,

                  }
                  this.commonService.postHttpService(postData, 'RRComplete').subscribe(response => {
                    if (response.status == true) {
                      Swal.fire({
                        title: 'Completed!',
                        text: 'Repair Request has been completed.',
                        type: 'success'
                      });
                    }
                  });
                }

              }
            } else {
              this.btnDisabled = false;
              Swal.fire({
                type: 'error',
                text: this.error,
                confirmButtonClass: 'btn btn-confirm mt-2',
              });
            }
          },
            (error: any) => {
              console.log(error)
            })

        } else {
          if (this.ShipFromId == this.ah_groupId && this.model.Type1 == 1) {
            var CompanyName = this.filterAndGetValue(this.customerList, "CompanyName", "CustomerId", this.CustomerId)
            var postDataCustomership = {
              "RRId": this.RRId,
              "ShipFromIdentity": "2",
              "ShipFromId": this.ShipFromId,
              "ShipFromName": this.ShipFromName,
              "ShipFromAddressId": this.model.Address,
              "ShipViaId": this.model.ShipViaId,
              "TrackingNo": this.model.TrackingNo,
              "PackWeight": this.model.PackWeight,
              "ShippingCost": this.model.ShippingCost,
              "ShipDate": ShipDate,
              "ShippedBy": this.model.ShippedBy,
              "ShipComment": this.model.ShipComment,
              "ShipToIdentity": "1",
              "ShipToId": this.CustomerId,
              "ShipToName": CompanyName,
              "ShipToAddressId": this.model.ShipToAddressId,
              "CreatedBy": localStorage.getItem("UserId"),
              "ShowCustomerReference": ShowCustomerReference,
              "ShowRootCause": ShowRootCause,
              "ShipDetails": this.ShipDetails


            }
            this.commonService.postHttpService(postDataCustomership, "RRShipping").subscribe(response => {

              if (response.status == true) {
                this.ShippingHistoryId = response.responseData.ShippingHistoryId
                this.RRId = response.responseData.RRId
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

            if (this.Status == 5) {

              var postData = {
                RRId: this.RRId,

              }
              this.commonService.postHttpService(postData, 'RRCreateInvoice').subscribe(response => {
                console.log('RRCreateInvoice', response)
                if (response.status == true) {
                  Swal.fire({
                    title: 'Created Customer Invoice!',
                    text: 'Customer Invoice has been created.',
                    type: 'success'
                  });
                }
              });

              var postData = {
                RRId: this.RRId,

              }
              this.commonService.postHttpService(postData, 'RRComplete').subscribe(response => {
                if (response.status == true) {
                  Swal.fire({
                    title: 'Completed!',
                    text: 'Repair Request has been completed.',
                    type: 'success'
                  });
                }
              });
            }

          }
        }


        //inCase of Customer ship from id
        if (this.model.Type0 == 1) {
          var ShipToName1 = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", CONST_AH_Group_ID)
          var postDataAH1 = {
            "RRId": this.RRId,
            "ShipFromIdentity": "1",
            "ShipFromId": this.ShipFromId,
            "ShipFromName": this.ShipFromName,
            "ShipFromAddressId": this.model.Address,
            "ShipViaId": this.model.ShipViaId,
            "TrackingNo": this.model.TrackingNo,
            "PackWeight": this.model.PackWeight,
            "ShippingCost": this.model.ShippingCost,
            "ShipDate": ShipDate,
            "ShippedBy": this.model.ShippedBy,
            "ShipComment": this.model.ShipComment,
            "ShipToIdentity": "2",
            "ShipToId": CONST_AH_Group_ID,
            "ShipToName": ShipToName1,
            "ShipToAddressId": this.model.ShipToAddressId,
            "CreatedBy": localStorage.getItem("UserId"),
            "ShowCustomerReference": ShowCustomerReference,
            "ShowRootCause": ShowRootCause,
            "ShipDetails": this.ShipDetails


          }
          this.commonService.postHttpService(postDataAH1, "RRShipping").subscribe(response => {

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
        if (this.model.Type0 == 0) {
          var ShipToNameType0 = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", this.VendorId)

          var postDataCustomer1 = {
            "RRId": this.RRId,
            "ShipFromIdentity": "1",
            "ShipFromId": this.ShipFromId,
            "ShipFromName": this.ShipFromName,
            "ShipFromAddressId": this.model.Address,
            "ShipViaId": this.model.ShipViaId,
            "TrackingNo": this.model.TrackingNo,
            "PackWeight": this.model.PackWeight,
            "ShippingCost": this.model.ShippingCost,
            "ShipDate": ShipDate,
            "ShippedBy": this.model.ShippedBy,
            "ShipComment": this.model.ShipComment,
            "ShipToIdentity": "2",
            "ShipToId": this.VendorId,
            "ShipToName": ShipToNameType0,
            "ShipToAddressId": this.model.ShipToAddressId,
            "CreatedBy": localStorage.getItem("UserId"),
            "ShowCustomerReference": ShowCustomerReference,
            "ShowRootCause": ShowRootCause,
            "ShipDetails": this.ShipDetails

          }
          this.commonService.postHttpService(postDataCustomer1, "RRShipping").subscribe(response => {

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

        //Ship From is ah and ship to is ah case
        if (this.model.Type1 == 2) {
          var ShipToName1 = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", CONST_AH_Group_ID)
          var postDataAH2 = {
            "RRId": this.RRId,
            "ShipFromIdentity": "2",
            "ShipFromId": this.ShipFromId,
            "ShipFromName": this.ShipFromName,
            "ShipFromAddressId": this.model.Address,
            "ShipViaId": this.model.ShipViaId,
            "TrackingNo": this.model.TrackingNo,
            "PackWeight": this.model.PackWeight,
            "ShippingCost": this.model.ShippingCost,
            "ShipDate": ShipDate,
            "ShippedBy": this.model.ShippedBy,
            "ShipComment": this.model.ShipComment,
            "ShipToIdentity": "2",
            "ShipToId": CONST_AH_Group_ID,
            "ShipToName": ShipToName1,
            "ShipToAddressId": this.model.ShipToAddressId,
            "CreatedBy": localStorage.getItem("UserId"),
            "ShowCustomerReference": ShowCustomerReference,
            "ShowRootCause": ShowRootCause,
            "ShipDetails": this.ShipDetails
          }
          this.commonService.postHttpService(postDataAH2, "RRShipping").subscribe(response => {

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
      else {
        this.btnDisabled = false;
        Swal.fire({
          type: 'error',
          title: 'Invalid Address',
          text: 'From Address and To Address Should be Different',
          confirmButtonClass: 'btn btn-confirm mt-2',
        });

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
  onSubmit1(f: NgForm) {
    const ShipDateYears = this.model.ShipDate.year;
    const ShipDateDates = this.model.ShipDate.day;
    const ShipDatemonths = this.model.ShipDate.month;
    let shipDate = new Date(ShipDateYears, ShipDatemonths - 1, ShipDateDates);
    let ShipDate = moment(shipDate).format('YYYY-MM-DD');

    if (f.valid) {
      if (this.model.ShipToAddressId != this.model.Address) {
        this.btnDisabled = true;
        if (this.model.ShowCustomerReference == true) {
          var ShowCustomerReference = 1
        }
        else {
          ShowCustomerReference = 0
        }

        if (this.model.ShowRootCause == true) {
          var ShowRootCause = 1
        }
        else {
          ShowRootCause = 0
        }
        var ShipToName = this.CustomerName || this.VendorName
        var ShipFromAddressLine = this.filterAndGetValue(this.ShipFromAddress, "StreetAddress", "AddressId", this.model.Address)
        var ShipFromCity = this.filterAndGetValue(this.ShipFromAddress, "City", "AddressId", this.model.Address)
        var ShipFromCountryCode = this.filterAndGetValue(this.ShipFromAddress, "CountryCode", "AddressId", this.model.Address)
        var ShipFromStateCode = this.filterAndGetValue(this.ShipFromAddress, "StateCode", "AddressId", this.model.Address)
        var ShipFromPostalCode = this.filterAndGetValue(this.ShipFromAddress, "Zip", "AddressId", this.model.Address)
        var ShipFromNumber = this.filterAndGetValue(this.ShipFromAddress, "PhoneNoPrimary", "AddressId", this.model.Address)


        var ShipToAddressLine = this.filterAndGetValue(this.ShipToAddress, "StreetAddress", "AddressId", this.model.ShipToAddressId)
        var ShipToCity = this.filterAndGetValue(this.ShipToAddress, "City", "AddressId", this.model.ShipToAddressId)
        var ShipToCountryCode = this.filterAndGetValue(this.ShipToAddress, "CountryCode", "AddressId", this.model.ShipToAddressId)
        var ShipToStateCode = this.filterAndGetValue(this.ShipToAddress, "StateCode", "AddressId", this.model.ShipToAddressId)
        var ShipToPostalCode = this.filterAndGetValue(this.ShipToAddress, "Zip", "AddressId", this.model.ShipToAddressId)
        var ShipToNumber = this.filterAndGetValue(this.ShipToAddress, "PhoneNoPrimary", "AddressId", this.model.ShipToAddressId)
        if (this.model.UPSService) {
          var UPS_Service_Description = this.filterAndGetValue(this.UPSServiceList, "UPS_Service_Description", "UPS_Service_Code", this.model.UPSService)
        }
        this.Form = this.fb.group({
          ShipToName: [ShipToName],
          ShipToAttentionName: [ShipToName],
          ShipToAddressLine: [ShipToAddressLine],
          ShipToCity: [ShipToCity],
          ShipToStateCode: [ShipToStateCode],
          ShipToPostalCode: [ShipToPostalCode],
          ShipToCountryCode: [ShipToCountryCode],
          ShipToNumber: [ShipToNumber],

          ShipFromName: [this.ShipFromName],
          ShipFromAttentionName: [this.ShipFromName],
          ShipFromAddressLine: [ShipFromAddressLine],
          ShipFromCity: [ShipFromCity],
          ShipFromStateCode: [ShipFromStateCode],
          ShipFromPostalCode: [ShipFromPostalCode],
          ShipFromCountryCode: [ShipFromCountryCode],
          ShipFromNumber: [ShipFromNumber],
          Weight: [this.model.PackWeight],
          refNo1: [this.model.refNo1],
          refNo2: [this.model.refNo2],
          UPS_Service_Code: [this.model.UPSService],
          UPS_Service_Description: [UPS_Service_Description]
        })

        //not ups case
        if (this.model.Type == 0) {
          var ShipToName1 = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", CONST_AH_Group_ID)
          var postDataAH = {
            "RRId": this.RRId,
            "ShipFromIdentity": "2",
            "ShipFromId": this.ShipFromId,
            "ShipFromName": this.ShipFromName,
            "ShipFromAddressId": this.model.Address,
            "ShipViaId": this.model.ShipViaId,
            "TrackingNo": this.model.TrackingNo,
            "PackWeight": this.model.PackWeight,
            "ShippingCost": this.model.ShippingCost,
            "ShipDate": ShipDate,
            "ShippedBy": this.model.ShippedBy,
            "ShipComment": this.model.ShipComment,
            "ShipToIdentity": "2",
            "ShipToId": CONST_AH_Group_ID,
            "ShipToName": ShipToName1,
            "ShipToAddressId": this.model.ShipToAddressId,
            "CreatedBy": localStorage.getItem("UserId"),
            "ShowCustomerReference": ShowCustomerReference,
            "ShowRootCause": ShowRootCause,
            "ShipDetails": this.ShipDetails
          }
          this.commonService.postHttpService(postDataAH, "RRShipping").subscribe(response => {

            if (response.status == true) {


              this.triggerEvent(response.responseData);
              this.modalRef.hide();
              var shippingDetails = {

                "ShippingHistoryId": response.responseData.ShippingHistoryId,
                "RRId": response.responseData.RRId
              }
              this.modalRef = this.CommonmodalService.show(PackingSlipComponent,
                {
                  backdrop: 'static',
                  ignoreBackdropClick: false,
                  initialState: {
                    data: { shippingDetails },
                    class: 'modal-xl'
                  }, class: 'gray modal-xl'
                });

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

        //UPS Case avaliable
        if (this.model.Type == 1 && this.ShipFromId == this.ah_groupId && this.model.ShipViaId == this.UPSId && this.IsUPSEnable == '1' && this.IsUserUPSEnable == 1) {

          if (this.model.Type == 1) {
            // this.soapserviceService.postHttpService(this.post(this.Form.value), this.endpointurl, '').subscribe(
            //   (response: any) => {
            this.commonService.postHttpService(this.Form.value, "UPSGenerateLabel").subscribe(response => {
              const parser = new xml2js.Parser({ strict: true, trim: true });
              parser.parseString(response.responseData, (err, result) => {
                this.xml = result;
              });
              this.getResult(this.xml)
              if (this.ups_status != 'fail') {
                if (this.model.Type == 1) {
                  var CompanyName = this.filterAndGetValue(this.customerList, "CompanyName", "CustomerId", this.CustomerId)
                  // Swal.fire({
                  //   title: 'Are you sure?',
                  //   text: 'You won\'t be able to revert this!',
                  //   type: 'warning',
                  //   showCancelButton: true,
                  //   confirmButtonText: 'Yes, create it!',
                  //   cancelButtonText: 'No, cancel!',
                  //   confirmButtonClass: 'btn btn-success mt-2',
                  //   cancelButtonClass: 'btn btn-danger ml-2 mt-2',
                  //   buttonsStyling: false
                  // }).then((result) => {
                  //   if (result.value) {
                  var postDataCustomer = {
                    "RRId": this.RRId,
                    "ShipFromIdentity": "2",
                    "ShipFromId": this.ShipFromId,
                    "ShipFromName": this.ShipFromName,
                    "ShipFromAddressId": this.model.Address,
                    "ShipViaId": this.model.ShipViaId,
                    "TrackingNo": this.model.TrackingNo,
                    "PackWeight": this.model.PackWeight,
                    "ShippingCost": this.model.ShippingCost,
                    "ShipDate": ShipDate,
                    "ShippedBy": this.model.ShippedBy,
                    "ShipComment": this.model.ShipComment,
                    "ShipToIdentity": "1",
                    "ShipToId": this.CustomerId,
                    "ShipToName": CompanyName,
                    "ShipToAddressId": this.model.ShipToAddressId,
                    "CreatedBy": localStorage.getItem("UserId"),
                    "ShowCustomerReference": ShowCustomerReference,
                    "ShowRootCause": ShowRootCause,
                    "ShipDetails": this.ShipDetails


                  }
                  this.commonService.postHttpService(postDataCustomer, "RRShipping").subscribe(response => {

                    if (response.status == true) {
                      this.ShippingHistoryId = response.responseData.ShippingHistoryId
                      this.RRId = response.responseData.RRId
                      //CREATE UPS
                      var postDataCREATEUPS = {
                        "ShippingHistoryId": this.ShippingHistoryId,
                        "UPSTrackingNo": this.ups_tracking_number,
                        "TransportationCharges": this.ups_trans_value,
                        "ServiceOptionsCharges": this.ups_service_value,
                        "OverallTotalCharges": this.ups_total_value,
                        "BillingWeightCode": this.ups_unit_code,
                        "BillingWeight": this.ups_unit_weight,
                        "UPSStatus": this.ups_status,
                        "UPSShippingLabel": this.ups_gif_image,
                        "UPSShippingLabelHtml": this.ups_html_image,
                      }
                      this.commonService.postHttpService(postDataCREATEUPS, "UPSCreate").subscribe(response => {

                        if (response.status == true) {

                        }
                        else {

                        }
                        this.cd_ref.detectChanges();
                      }, error => console.log(error));
                      this.triggerEvent(response.responseData);
                      this.modalRef.hide();
                      var result = this.xml

                      var shippingDetails = {

                        "ShippingHistoryId": response.responseData.ShippingHistoryId,
                        "RRId": response.responseData.RRId
                      }
                      this.modalRef = this.CommonmodalService.show(PackingSlipComponent,
                        {
                          backdrop: 'static',
                          ignoreBackdropClick: false,
                          initialState: {
                            data: { shippingDetails },
                            class: 'modal-xl'
                          }, class: 'gray modal-xl'
                        });

                      this.modalRef = this.CommonmodalService.show(UpsLabelComponent,
                        {
                          backdrop: 'static',
                          ignoreBackdropClick: false,
                          initialState: {
                            data: { result },
                            class: 'modal-xl'
                          }, class: 'gray modal-xl'
                        });

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


                  if (this.Status == 5) {
                    var postData = {
                      RRId: this.RRId,

                    }
                    this.commonService.postHttpService(postData, 'RRCreateInvoice').subscribe(response => {
                      if (response.status == true) {
                        Swal.fire({
                          title: 'Created Customer Invoice!',
                          text: 'Customer Invoice has been created.',
                          type: 'success'
                        });
                      }
                    });

                    var postData = {
                      RRId: this.RRId,

                    }
                    this.commonService.postHttpService(postData, 'RRComplete').subscribe(response => {
                      if (response.status == true) {
                        Swal.fire({
                          title: 'Completed!',
                          text: 'Repair Request has been completed.',
                          type: 'success'
                        });
                      }
                    });
                  }

                }



              } else {
                this.btnDisabled = false;
                Swal.fire({
                  type: 'error',
                  text: this.error,
                  confirmButtonClass: 'btn btn-confirm mt-2',
                });
              }
            },
              (error: any) => {
                console.log(error)
              })
          }
        } else {
          if (this.model.Type == 1) {
            var CompanyName = this.filterAndGetValue(this.customerList, "CompanyName", "CustomerId", this.CustomerId)
            // Swal.fire({
            //   title: 'Are you sure?',
            //   text: 'You won\'t be able to revert this!',
            //   type: 'warning',
            //   showCancelButton: true,
            //   confirmButtonText: 'Yes, create it!',
            //   cancelButtonText: 'No, cancel!',
            //   confirmButtonClass: 'btn btn-success mt-2',
            //   cancelButtonClass: 'btn btn-danger ml-2 mt-2',
            //   buttonsStyling: false
            // }).then((result) => {
            //   if (result.value) {
            var postDataCustomer = {
              "RRId": this.RRId,
              "ShipFromIdentity": "2",
              "ShipFromId": this.ShipFromId,
              "ShipFromName": this.ShipFromName,
              "ShipFromAddressId": this.model.Address,
              "ShipViaId": this.model.ShipViaId,
              "TrackingNo": this.model.TrackingNo,
              "PackWeight": this.model.PackWeight,
              "ShippingCost": this.model.ShippingCost,
              "ShipDate": ShipDate,
              "ShippedBy": this.model.ShippedBy,
              "ShipComment": this.model.ShipComment,
              "ShipToIdentity": "1",
              "ShipToId": this.CustomerId,
              "ShipToName": CompanyName,
              "ShipToAddressId": this.model.ShipToAddressId,
              "CreatedBy": localStorage.getItem("UserId"),
              "ShowCustomerReference": ShowCustomerReference,
              "ShowRootCause": ShowRootCause,
              "ShipDetails": this.ShipDetails

            }
            this.commonService.postHttpService(postDataCustomer, "RRShipping").subscribe(response => {

              if (response.status == true) {
                this.triggerEvent(response.responseData);
                this.modalRef.hide();

                var shippingDetails = {

                  "ShippingHistoryId": response.responseData.ShippingHistoryId,
                  "RRId": response.responseData.RRId
                }
                this.modalRef = this.CommonmodalService.show(PackingSlipComponent,
                  {
                    backdrop: 'static',
                    ignoreBackdropClick: false,
                    initialState: {
                      data: { shippingDetails },
                      class: 'modal-xl'
                    }, class: 'gray modal-xl'
                  });
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


            if (this.Status == 5) {
              var postData = {
                RRId: this.RRId,

              }
              this.commonService.postHttpService(postData, 'RRCreateInvoice').subscribe(response => {
                console.log('RRCreateInvoice', response)
                if (response.status == true) {
                  Swal.fire({
                    title: 'Created Customer Invoice!',
                    text: 'Customer Invoice has been created.',
                    type: 'success'
                  });
                }
              });

              var postData = {
                RRId: this.RRId,

              }
              this.commonService.postHttpService(postData, 'RRComplete').subscribe(response => {
                if (response.status == true) {
                  Swal.fire({
                    title: 'Completed!',
                    text: 'Repair Request has been completed.',
                    type: 'success'
                  });
                }
              });
            }

          }
        }


        // UPS Case avaliable
        if (this.model.Type1 == 0 && this.ShipFromId == this.ah_groupId && this.model.ShipViaId == this.UPSId && this.IsUPSEnable == '1' && this.IsUserUPSEnable == 1) {

          if (this.model.Type1 == 0) {
            // this.soapserviceService.postHttpService(this.post(this.Form.value), this.endpointurl, '').subscribe(
            //   (response: any) => {
            this.commonService.postHttpService(this.Form.value, "UPSGenerateLabel").subscribe(response => {
              const parser = new xml2js.Parser({ strict: true, trim: true });
              parser.parseString(response.responseData, (err, result) => {
                this.xml = result;
              });
              this.getResult(this.xml)
              if (this.ups_status != 'fail') {
                if (this.model.Type1 == 0) {
                  var ShipToNameType1 = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", this.VendorId)

                  var postDataVendor = {
                    "RRId": this.RRId,
                    "ShipFromIdentity": "2",
                    "ShipFromId": this.ShipFromId,
                    "ShipFromName": this.ShipFromName,
                    "ShipFromAddressId": this.model.Address,
                    "ShipViaId": this.model.ShipViaId,
                    "TrackingNo": this.model.TrackingNo,
                    "PackWeight": this.model.PackWeight,
                    "ShippingCost": this.model.ShippingCost,
                    "ShipDate": ShipDate,
                    "ShippedBy": this.model.ShippedBy,
                    "ShipComment": this.model.ShipComment,
                    "ShipToIdentity": "2",
                    "ShipToId": this.VendorId,
                    "ShipToName": ShipToNameType1,
                    "ShipToAddressId": this.model.ShipToAddressId,
                    "CreatedBy": localStorage.getItem("UserId"),
                    "ShowCustomerReference": ShowCustomerReference,
                    "ShowRootCause": ShowRootCause,
                    "ShipDetails": this.ShipDetails


                  }
                  this.commonService.postHttpService(postDataVendor, "RRShipping").subscribe(response => {

                    if (response.status == true) {
                      this.ShippingHistoryId = response.responseData.ShippingHistoryId
                      this.RRId = response.responseData.RRId

                      //CREATE UPS
                      var postDataCREATEUPS = {
                        "ShippingHistoryId": this.ShippingHistoryId,
                        "UPSTrackingNo": this.ups_tracking_number,
                        "TransportationCharges": this.ups_trans_value,
                        "ServiceOptionsCharges": this.ups_service_value,
                        "OverallTotalCharges": this.ups_total_value,
                        "BillingWeightCode": this.ups_unit_code,
                        "BillingWeight": this.ups_unit_weight,
                        "UPSStatus": this.ups_status,
                        "UPSShippingLabel": this.ups_gif_image,
                        "UPSShippingLabelHtml": this.ups_html_image,
                      }
                      this.commonService.postHttpService(postDataCREATEUPS, "UPSCreate").subscribe(response => {

                        if (response.status == true) {

                        }
                        else {

                        }
                        this.cd_ref.detectChanges();
                      }, error => console.log(error));
                      this.triggerEvent(response.responseData);
                      this.modalRef.hide();
                      var result = this.xml

                      this.modalRef = this.CommonmodalService.show(UpsLabelComponent,
                        {
                          backdrop: 'static',
                          ignoreBackdropClick: false,
                          initialState: {
                            data: { result },
                            class: 'modal-xl'
                          }, class: 'gray modal-xl'
                        });

                      var shippingDetails = {

                        "ShippingHistoryId": response.responseData.ShippingHistoryId,
                        "RRId": response.responseData.RRId
                      }
                      this.modalRef = this.CommonmodalService.show(PackingSlipComponent,
                        {
                          backdrop: 'static',
                          ignoreBackdropClick: false,
                          initialState: {
                            data: { shippingDetails },
                            class: 'modal-xl'
                          }, class: 'gray modal-xl'
                        });

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
              else {
                this.btnDisabled = false;
                Swal.fire({
                  type: 'error',
                  text: this.error,
                  confirmButtonClass: 'btn btn-confirm mt-2',
                });
              }
            },
              (error: any) => {
                console.log(error)
              })
          }
        } else {
          if (this.model.Type1 == 0) {
            var ShipToNameType1 = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", this.VendorId)

            var postDataVendor = {
              "RRId": this.RRId,
              "ShipFromIdentity": "2",
              "ShipFromId": this.ShipFromId,
              "ShipFromName": this.ShipFromName,
              "ShipFromAddressId": this.model.Address,
              "ShipViaId": this.model.ShipViaId,
              "TrackingNo": this.model.TrackingNo,
              "PackWeight": this.model.PackWeight,
              "ShippingCost": this.model.ShippingCost,
              "ShipDate": ShipDate,
              "ShippedBy": this.model.ShippedBy,
              "ShipComment": this.model.ShipComment,
              "ShipToIdentity": "2",
              "ShipToId": this.VendorId,
              "ShipToName": ShipToNameType1,
              "ShipToAddressId": this.model.ShipToAddressId,
              "CreatedBy": localStorage.getItem("UserId"),
              "ShowCustomerReference": ShowCustomerReference,
              "ShowRootCause": ShowRootCause,
              "ShipDetails": this.ShipDetails


            }
            this.commonService.postHttpService(postDataVendor, "RRShipping").subscribe(response => {

              if (response.status == true) {
                this.triggerEvent(response.responseData);
                this.modalRef.hide();
                var shippingDetails = {

                  "ShippingHistoryId": response.responseData.ShippingHistoryId,
                  "RRId": response.responseData.RRId
                }
                this.modalRef = this.CommonmodalService.show(PackingSlipComponent,
                  {
                    backdrop: 'static',
                    ignoreBackdropClick: false,
                    initialState: {
                      data: { shippingDetails },
                      class: 'modal-xl'
                    }, class: 'gray modal-xl'
                  });

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

        if (this.model.Type1 == 1 && this.ShipFromId != this.ah_groupId) {
          var CompanyName = this.filterAndGetValue(this.customerList, "CompanyName", "CustomerId", this.CustomerId)
          var postDataCustomer1 = {
            "RRId": this.RRId,
            "ShipFromIdentity": "2",
            "ShipFromId": this.ShipFromId,
            "ShipFromName": this.ShipFromName,
            "ShipFromAddressId": this.model.Address,
            "ShipViaId": this.model.ShipViaId,
            "TrackingNo": this.model.TrackingNo,
            "PackWeight": this.model.PackWeight,
            "ShippingCost": this.model.ShippingCost,
            "ShipDate": ShipDate,
            "ShippedBy": this.model.ShippedBy,
            "ShipComment": this.model.ShipComment,
            "ShipToIdentity": "1",
            "ShipToId": this.CustomerId,
            "ShipToName": CompanyName,
            "ShipToAddressId": this.model.ShipToAddressId,
            "CreatedBy": localStorage.getItem("UserId"),
            "ShowCustomerReference": ShowCustomerReference,
            "ShowRootCause": ShowRootCause,
            "ShipDetails": this.ShipDetails

          }
          this.commonService.postHttpService(postDataCustomer1, "RRShipping").subscribe(response => {

            if (response.status == true) {
              this.triggerEvent(response.responseData);
              this.modalRef.hide();
              var shippingDetails = {

                "ShippingHistoryId": response.responseData.ShippingHistoryId,
                "RRId": response.responseData.RRId
              }
              this.modalRef = this.CommonmodalService.show(PackingSlipComponent,
                {
                  backdrop: 'static',
                  ignoreBackdropClick: false,
                  initialState: {
                    data: { shippingDetails },
                    class: 'modal-xl'
                  }, class: 'gray modal-xl'
                });

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
        //New one  UPS Case avaliable
        if (this.ShipFromId == this.ah_groupId && this.model.Type1 == 1 && this.model.ShipViaId == this.UPSId && this.IsUPSEnable == '1' && this.IsUserUPSEnable == 1) {
          // this.soapserviceService.postHttpService(this.post(this.Form.value), this.endpointurl, '').subscribe(
          //   (response: any) => {
          this.commonService.postHttpService(this.Form.value, "UPSGenerateLabel").subscribe(response => {
            const parser = new xml2js.Parser({ strict: true, trim: true });
            parser.parseString(response.responseData, (err, result) => {
              this.xml = result;
            });
            this.getResult(this.xml)
            if (this.ups_status != 'fail') {
              var CompanyName = this.filterAndGetValue(this.customerList, "CompanyName", "CustomerId", this.CustomerId)
              var postDataCustomership = {
                "RRId": this.RRId,
                "ShipFromIdentity": "2",
                "ShipFromId": this.ShipFromId,
                "ShipFromName": this.ShipFromName,
                "ShipFromAddressId": this.model.Address,
                "ShipViaId": this.model.ShipViaId,
                "TrackingNo": this.model.TrackingNo,
                "PackWeight": this.model.PackWeight,
                "ShippingCost": this.model.ShippingCost,
                "ShipDate": ShipDate,
                "ShippedBy": this.model.ShippedBy,
                "ShipComment": this.model.ShipComment,
                "ShipToIdentity": "1",
                "ShipToId": this.CustomerId,
                "ShipToName": CompanyName,
                "ShipToAddressId": this.model.ShipToAddressId,
                "CreatedBy": localStorage.getItem("UserId"),
                "ShowCustomerReference": ShowCustomerReference,
                "ShowRootCause": ShowRootCause,
                "ShipDetails": this.ShipDetails


              }
              this.commonService.postHttpService(postDataCustomership, "RRShipping").subscribe(response => {

                if (response.status == true) {
                  this.ShippingHistoryId = response.responseData.ShippingHistoryId
                  this.RRId = response.responseData.RRId

                  //CREATE UPS
                  var postDataCREATEUPS = {
                    "ShippingHistoryId": this.ShippingHistoryId,
                    "UPSTrackingNo": this.ups_tracking_number,
                    "TransportationCharges": this.ups_trans_value,
                    "ServiceOptionsCharges": this.ups_service_value,
                    "OverallTotalCharges": this.ups_total_value,
                    "BillingWeightCode": this.ups_unit_code,
                    "BillingWeight": this.ups_unit_weight,
                    "UPSStatus": this.ups_status,
                    "UPSShippingLabel": this.ups_gif_image,
                    "UPSShippingLabelHtml": this.ups_html_image,
                  }
                  this.commonService.postHttpService(postDataCREATEUPS, "UPSCreate").subscribe(response => {

                    if (response.status == true) {

                    }
                    else {

                    }
                    this.cd_ref.detectChanges();
                  }, error => console.log(error));
                  this.triggerEvent(response.responseData);
                  this.modalRef.hide();
                  var result = this.xml

                  this.modalRef = this.CommonmodalService.show(UpsLabelComponent,
                    {
                      backdrop: 'static',
                      ignoreBackdropClick: false,
                      initialState: {
                        data: { result },
                        class: 'modal-xl'
                      }, class: 'gray modal-xl'
                    });

                  var shippingDetails = {

                    "ShippingHistoryId": response.responseData.ShippingHistoryId,
                    "RRId": response.responseData.RRId
                  }
                  this.modalRef = this.CommonmodalService.show(PackingSlipComponent,
                    {
                      backdrop: 'static',
                      ignoreBackdropClick: false,
                      initialState: {
                        data: { shippingDetails },
                        class: 'modal-xl'
                      }, class: 'gray modal-xl'
                    });

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

              if (this.Status == 5) {

                var postData = {
                  RRId: this.RRId,

                }
                this.commonService.postHttpService(postData, 'RRCreateInvoice').subscribe(response => {
                  console.log('RRCreateInvoice', response)
                  if (response.status == true) {
                    Swal.fire({
                      title: 'Created Customer Invoice!',
                      text: 'Customer Invoice has been created.',
                      type: 'success'
                    });
                  }
                });

                var postData = {
                  RRId: this.RRId,

                }
                this.commonService.postHttpService(postData, 'RRComplete').subscribe(response => {
                  if (response.status == true) {
                    Swal.fire({
                      title: 'Completed!',
                      text: 'Repair Request has been completed.',
                      type: 'success'
                    });
                  }
                });
              }
            } else {
              this.btnDisabled = false;
              Swal.fire({
                type: 'error',
                text: this.error,
                confirmButtonClass: 'btn btn-confirm mt-2',
              });
            }
          },
            (error: any) => {
              console.log(error)
            })
        } else {
          if (this.ShipFromId == this.ah_groupId && this.model.Type1 == 1) {
            var CompanyName = this.filterAndGetValue(this.customerList, "CompanyName", "CustomerId", this.CustomerId)
            var postDataCustomership = {
              "RRId": this.RRId,
              "ShipFromIdentity": "2",
              "ShipFromId": this.ShipFromId,
              "ShipFromName": this.ShipFromName,
              "ShipFromAddressId": this.model.Address,
              "ShipViaId": this.model.ShipViaId,
              "TrackingNo": this.model.TrackingNo,
              "PackWeight": this.model.PackWeight,
              "ShippingCost": this.model.ShippingCost,
              "ShipDate": ShipDate,
              "ShippedBy": this.model.ShippedBy,
              "ShipComment": this.model.ShipComment,
              "ShipToIdentity": "1",
              "ShipToId": this.CustomerId,
              "ShipToName": CompanyName,
              "ShipToAddressId": this.model.ShipToAddressId,
              "CreatedBy": localStorage.getItem("UserId"),
              "ShowCustomerReference": ShowCustomerReference,
              "ShowRootCause": ShowRootCause,
              "ShipDetails": this.ShipDetails


            }
            this.commonService.postHttpService(postDataCustomership, "RRShipping").subscribe(response => {

              if (response.status == true) {
                this.ShippingHistoryId = response.responseData.ShippingHistoryId
                this.RRId = response.responseData.RRId


                this.triggerEvent(response.responseData);
                this.modalRef.hide();



                var shippingDetails = {

                  "ShippingHistoryId": response.responseData.ShippingHistoryId,
                  "RRId": response.responseData.RRId
                }
                this.modalRef = this.CommonmodalService.show(PackingSlipComponent,
                  {
                    backdrop: 'static',
                    ignoreBackdropClick: false,
                    initialState: {
                      data: { shippingDetails },
                      class: 'modal-xl'
                    }, class: 'gray modal-xl'
                  });

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

            if (this.Status == 5) {

              var postData = {
                RRId: this.RRId,

              }
              this.commonService.postHttpService(postData, 'RRCreateInvoice').subscribe(response => {
                console.log('RRCreateInvoice', response)
                if (response.status == true) {
                  Swal.fire({
                    title: 'Created Customer Invoice!',
                    text: 'Customer Invoice has been created.',
                    type: 'success'
                  });
                }
              });

              var postData = {
                RRId: this.RRId,

              }
              this.commonService.postHttpService(postData, 'RRComplete').subscribe(response => {
                if (response.status == true) {
                  Swal.fire({
                    title: 'Completed!',
                    text: 'Repair Request has been completed.',
                    type: 'success'
                  });
                }
              });
            }
          }
        }
        //inCase of Customer ship from id
        if (this.model.Type0 == 1) {
          var ShipToName1 = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", CONST_AH_Group_ID)
          var postDataAH1 = {
            "RRId": this.RRId,
            "ShipFromIdentity": "1",
            "ShipFromId": this.ShipFromId,
            "ShipFromName": this.ShipFromName,
            "ShipFromAddressId": this.model.Address,
            "ShipViaId": this.model.ShipViaId,
            "TrackingNo": this.model.TrackingNo,
            "PackWeight": this.model.PackWeight,
            "ShippingCost": this.model.ShippingCost,
            "ShipDate": ShipDate,
            "ShippedBy": this.model.ShippedBy,
            "ShipComment": this.model.ShipComment,
            "ShipToIdentity": "2",
            "ShipToId": CONST_AH_Group_ID,
            "ShipToName": ShipToName1,
            "ShipToAddressId": this.model.ShipToAddressId,
            "CreatedBy": localStorage.getItem("UserId"),
            "ShowCustomerReference": ShowCustomerReference,
            "ShowRootCause": ShowRootCause,
            "ShipDetails": this.ShipDetails


          }
          this.commonService.postHttpService(postDataAH1, "RRShipping").subscribe(response => {

            if (response.status == true) {
              this.triggerEvent(response.responseData);
              this.modalRef.hide();
              var shippingDetails = {

                "ShippingHistoryId": response.responseData.ShippingHistoryId,
                "RRId": response.responseData.RRId
              }
              this.modalRef = this.CommonmodalService.show(PackingSlipComponent,
                {
                  backdrop: 'static',
                  ignoreBackdropClick: false,
                  initialState: {
                    data: { shippingDetails },
                    class: 'modal-xl'
                  }, class: 'gray modal-xl'
                });

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
        if (this.model.Type0 == 0) {
          var ShipToNameType0 = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", this.VendorId)

          var postDataCustomer2 = {
            "RRId": this.RRId,
            "ShipFromIdentity": "1",
            "ShipFromId": this.ShipFromId,
            "ShipFromName": this.ShipFromName,
            "ShipFromAddressId": this.model.Address,
            "ShipViaId": this.model.ShipViaId,
            "TrackingNo": this.model.TrackingNo,
            "PackWeight": this.model.PackWeight,
            "ShippingCost": this.model.ShippingCost,
            "ShipDate": ShipDate,
            "ShippedBy": this.model.ShippedBy,
            "ShipComment": this.model.ShipComment,
            "ShipToIdentity": "2",
            "ShipToId": this.VendorId,
            "ShipToName": ShipToNameType0,
            "ShipToAddressId": this.model.ShipToAddressId,
            "CreatedBy": localStorage.getItem("UserId"),
            "ShowCustomerReference": ShowCustomerReference,
            "ShowRootCause": ShowRootCause,
            "ShipDetails": this.ShipDetails


          }
          this.commonService.postHttpService(postDataCustomer2, "RRShipping").subscribe(response => {

            if (response.status == true) {
              this.triggerEvent(response.responseData);
              this.modalRef.hide();
              var shippingDetails = {

                "ShippingHistoryId": response.responseData.ShippingHistoryId,
                "RRId": response.responseData.RRId
              }

              this.modalRef = this.CommonmodalService.show(PackingSlipComponent,
                {
                  backdrop: 'static',
                  ignoreBackdropClick: false,
                  initialState: {
                    data: { shippingDetails },
                    class: 'modal-xl'
                  }, class: 'gray modal-xl'
                });

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

        //Ship From is ah and ship to is ah case
        if (this.model.Type1 == 2) {
          var ShipToName1 = this.filterAndGetValue(this.vendorList, "VendorName", "VendorId", CONST_AH_Group_ID)
          var postDataAH2 = {
            "RRId": this.RRId,
            "ShipFromIdentity": "2",
            "ShipFromId": this.ShipFromId,
            "ShipFromName": this.ShipFromName,
            "ShipFromAddressId": this.model.Address,
            "ShipViaId": this.model.ShipViaId,
            "TrackingNo": this.model.TrackingNo,
            "PackWeight": this.model.PackWeight,
            "ShippingCost": this.model.ShippingCost,
            "ShipDate": ShipDate,
            "ShippedBy": this.model.ShippedBy,
            "ShipComment": this.model.ShipComment,
            "ShipToIdentity": "2",
            "ShipToId": CONST_AH_Group_ID,
            "ShipToName": ShipToName1,
            "ShipToAddressId": this.model.ShipToAddressId,
            "CreatedBy": localStorage.getItem("UserId"),
            "ShowCustomerReference": ShowCustomerReference,
            "ShowRootCause": ShowRootCause,
            "ShipDetails": this.ShipDetails
          }
          this.commonService.postHttpService(postDataAH2, "RRShipping").subscribe(response => {

            if (response.status == true) {
              this.triggerEvent(response.responseData);
              this.modalRef.hide();
              var shippingDetails = {

                "ShippingHistoryId": response.responseData.ShippingHistoryId,
                "RRId": response.responseData.RRId
              }

              this.modalRef = this.CommonmodalService.show(PackingSlipComponent,
                {
                  backdrop: 'static',
                  ignoreBackdropClick: false,
                  initialState: {
                    data: { shippingDetails },
                    class: 'modal-xl'
                  }, class: 'gray modal-xl'
                });

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
      else {
        this.btnDisabled = false;
        Swal.fire({
          type: 'error',
          title: 'Invalid Address',
          text: 'From Address and To Address Should be Different',
          confirmButtonClass: 'btn btn-confirm mt-2',
        });

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


  post(val) {
    console.log(val);
    let postData = '<?xml version="1.0" encoding="UTF-8"?>';
    postData += '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://www.ups.com/XMLSchema/XOLTWS/Common/v1.0" xmlns:ns2="http://www.ups.com/XMLSchema/XOLTWS/Ship/v1.0" xmlns:ns3="http://www.ups.com/XMLSchema/XOLTWS/UPSS/v1.0">';
    postData += '<SOAP-ENV:Header>';
    postData += '<ns3:UPSSecurity>';
    postData += '<ns3:UsernameToken>';
    postData += '<ns3:Username>' + this.userid + '</ns3:Username>';
    postData += '<ns3:Password>' + this.passwd + '</ns3:Password>';
    postData += '</ns3:UsernameToken>';
    postData += '<ns3:ServiceAccessToken>';
    postData += '<ns3:AccessLicenseNumber>' + this.access + '</ns3:AccessLicenseNumber>';
    postData += '</ns3:ServiceAccessToken>';
    postData += '</ns3:UPSSecurity>';
    postData += '</SOAP-ENV:Header>';
    postData += '<SOAP-ENV:Body>';
    postData += '<ns2:ShipmentRequest>';
    postData += '<ns1:Request>';
    postData += '<ns1:RequestOption>' + this.shipRequestOption + '</ns1:RequestOption>';
    postData += '</ns1:Request>';
    postData += '<ns2:Shipment>';
    postData += '<ns2:Description>' + shipDescription + '</ns2:Description>';
    postData += '<ns2:Shipper>';
    postData += '<ns2:Name>' + val.ShipFromName + '</ns2:Name>';
    postData += '<ns2:AttentionName>' + val.ShipFromAttentionName + '</ns2:AttentionName>';
    postData += '<ns2:TaxIdentificationNumber>' + this.shipperTaxIdentificationNumber + '</ns2:TaxIdentificationNumber>';
    postData += '<ns2:Phone>';
    postData += '<ns2:Number>' + val.ShipFromNumber + '</ns2:Number>';
    postData += '<ns2:Extension>' + this.shipperPhoneExtension + '</ns2:Extension>';
    postData += '</ns2:Phone>';
    postData += '<ns2:ShipperNumber>' + this.shipperNumber + '</ns2:ShipperNumber>';
    postData += '<ns2:Address>';
    postData += '<ns2:AddressLine>' + val.ShipFromAddressLine + '</ns2:AddressLine>';
    postData += '<ns2:City>' + val.ShipFromCity + '</ns2:City>';
    postData += '<ns2:StateProvinceCode>' + val.ShipFromStateCode + '</ns2:StateProvinceCode>';
    postData += '<ns2:PostalCode>' + val.ShipFromPostalCode + '</ns2:PostalCode>';
    postData += '<ns2:CountryCode>' + val.ShipFromCountryCode + '</ns2:CountryCode>';
    postData += '</ns2:Address>';
    postData += '</ns2:Shipper>';
    postData += '<ns2:ShipTo>';
    postData += '<ns2:Name>' + val.ShipToName + '</ns2:Name>';
    postData += '<ns2:AttentionName>' + val.ShipToAttentionName + '</ns2:AttentionName>';
    postData += '<ns2:Phone>';
    postData += '<ns2:Number>' + val.ShipToNumber + '</ns2:Number>';
    postData += '</ns2:Phone>';
    postData += '<ns2:Address>';
    postData += '<ns2:AddressLine>' + val.ShipToAddressLine + '</ns2:AddressLine>';
    postData += '<ns2:City>' + val.ShipToCity + '</ns2:City>';
    postData += '<ns2:StateProvinceCode>' + val.ShipToStateCode + '</ns2:StateProvinceCode>';
    postData += '<ns2:PostalCode>' + val.ShipToPostalCode + '</ns2:PostalCode>';
    postData += '<ns2:CountryCode>' + val.ShipToCountryCode + '</ns2:CountryCode>';
    postData += '</ns2:Address>';
    postData += '</ns2:ShipTo>';
    postData += '<ns2:ShipFrom>';
    postData += '<ns2:Name>' + val.ShipFromName + '</ns2:Name>';
    postData += '<ns2:AttentionName>' + val.ShipFromAttentionName + '</ns2:AttentionName>';
    postData += '<ns2:Phone>';
    postData += '<ns2:Number>' + val.ShipFromNumber + '</ns2:Number>';
    postData += '</ns2:Phone>';
    postData += '<ns2:Address>';
    postData += '<ns2:AddressLine>' + val.ShipFromAddressLine + '</ns2:AddressLine>';
    postData += '<ns2:City>' + val.ShipFromCity + '</ns2:City>';
    postData += '<ns2:StateProvinceCode>' + val.ShipFromStateCode + '</ns2:StateProvinceCode>';
    postData += '<ns2:PostalCode>' + val.ShipFromPostalCode + '</ns2:PostalCode>';
    postData += '<ns2:CountryCode>' + val.ShipFromCountryCode + '</ns2:CountryCode>';
    postData += '</ns2:Address>';
    postData += '</ns2:ShipFrom>';
    postData += '<ns2:PaymentInformation>';
    postData += '<ns2:ShipmentCharge>';
    postData += '<ns2:Type>01</ns2:Type>';
    postData += '<ns2:BillShipper>';
    postData += '<ns2:AccountNumber>' + this.ShipAccountNumber + '</ns2:AccountNumber>';
    postData += '</ns2:BillShipper>';
    postData += '</ns2:ShipmentCharge>';
    postData += '</ns2:PaymentInformation>';
    postData += '<ns2:ReferenceNumber>';
    postData += '<ns2:Code>01</ns2:Code>';
    postData += '<ns2:Value>' + val.refNo1 + '</ns2:Value>';
    postData += '</ns2:ReferenceNumber>';
    postData += '<ns2:ReferenceNumber>';
    postData += '<ns2:Code>02</ns2:Code>';
    postData += '<ns2:Value>' + val.refNo2 + '</ns2:Value>';
    postData += '</ns2:ReferenceNumber>';
    postData += '<ns2:Service>';
    postData += '<ns2:Code>08</ns2:Code>';
    postData += '<ns2:Description>Expedited</ns2:Description>';
    postData += '</ns2:Service>';
    postData += '<ns2:Package>';
    postData += '<ns2:Description></ns2:Description>';
    postData += '<ns2:Packaging>';
    postData += '<ns2:Code>02</ns2:Code>';
    postData += '<ns2:Description>Nails</ns2:Description>';
    postData += '</ns2:Packaging>';
    // postData += '<ns2:Dimensions>';
    // postData += '<ns2:UnitOfMeasurement>';
    // postData += '<ns2:Code>IN</ns2:Code>';
    // postData += '<ns2:Description>Inches</ns2:Description>';
    // postData += '</ns2:UnitOfMeasurement>';
    // postData += '<ns2:Length>7</ns2:Length>';
    // postData += '<ns2:Width>5</ns2:Width>';
    // postData += '<ns2:Height>2</ns2:Height>';
    // postData += '</ns2:Dimensions>';
    postData += '<ns2:PackageWeight>';
    postData += '<ns2:UnitOfMeasurement>';
    postData += '<ns2:Code>LBS</ns2:Code>';
    postData += '<ns2:Description>Pounds</ns2:Description>';
    postData += '</ns2:UnitOfMeasurement>';
    postData += '<ns2:Weight>' + val.Weight + '</ns2:Weight>';
    postData += '</ns2:PackageWeight>';
    postData += '</ns2:Package>';
    postData += '</ns2:Shipment>';
    postData += '</ns2:ShipmentRequest>';
    postData += '</SOAP-ENV:Body>';
    postData += '</SOAP-ENV:Envelope>';
    // console.log(postData);
    return postData;
  }
  getResult(val) {
    if (val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse']) {
      this.error = '';
      this.ups_status = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['common:Response'][0]['common:ResponseStatus'][0]['common:Description'][0];
      this.ups_tracking_number = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentIdentificationNumber'][0];

      this.ups_gif_image = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:PackageResults'][0]['ship:ShippingLabel'][0]['ship:GraphicImage'][0];
      this.ups_html_image = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:PackageResults'][0]['ship:ShippingLabel'][0]['ship:HTMLImage'][0];
      // this.ups_html_image_decode = atob(this.ups_html_image); 
      this.ups_trans_code = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:TransportationCharges'][0]['ship:CurrencyCode'][0];
      this.ups_trans_value = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:TransportationCharges'][0]['ship:MonetaryValue'][0];

      this.ups_service_code = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:ServiceOptionsCharges'][0]['ship:CurrencyCode'][0];
      this.ups_service_value = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:ServiceOptionsCharges'][0]['ship:MonetaryValue'][0];

      this.ups_total_code = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:TotalCharges'][0]['ship:CurrencyCode'][0];
      this.ups_total_value = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:TotalCharges'][0]['ship:MonetaryValue'][0];

      this.ups_unit_code = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:BillingWeight'][0]['ship:UnitOfMeasurement'][0]['ship:Code'][0];
      this.ups_unit_des = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:BillingWeight'][0]['ship:UnitOfMeasurement'][0]['ship:Description'][0];
      this.ups_unit_weight = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:BillingWeight'][0]['ship:Weight'][0];
    } else {
      this.ups_status = 'fail';
      this.ups_gif_image = '';
      this.error = val['soapenv:Envelope']['soapenv:Body'][0]['soapenv:Fault'][0]['detail'][0]['err:Errors'][0]['err:ErrorDetail'][0]['err:PrimaryErrorCode'][0]['err:Description'][0];
    }
  }

}
