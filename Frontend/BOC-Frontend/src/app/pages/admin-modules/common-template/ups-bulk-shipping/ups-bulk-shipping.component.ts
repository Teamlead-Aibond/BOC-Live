import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { UPS_ID, CONST_AH_Group_ID, CONST_ShipAddressType, UPS_Service } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import * as xml2js from 'xml2js';
import { BulkShippingPackingslipComponent } from '../bulk-shipping-packingslip/bulk-shipping-packingslip.component';
import { UpsLabelComponent } from '../ups-label/ups-label.component';
@Component({
  selector: 'app-ups-bulk-shipping',
  templateUrl: './ups-bulk-shipping.component.html',
  styleUrls: ['./ups-bulk-shipping.component.scss']
})
export class UpsBulkShippingComponent implements OnInit {
  UPSId
  ShipDetails: any = []
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
  ShipFromAddress: any = []
  ShipToAddress: any = []
  UPSInfo
  ShipFrom
  ShipTo
  ShipViaId
  PackWeight = 0
  refNo1: any = []
  refNo2: any = []
  UPSServiceList: any = []
  ShipperNumber: any;
  ShipToAddressId: any;
  ShipToAddressView: any;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private CommonmodalService: BsModalService,
    private datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.UPSInfo = this.data.UPSInfo;
    this.UPSId = UPS_ID;
    this.UPSServiceList = UPS_Service
    this.CustomerId = this.UPSInfo.CustomerId
    this.VendorId = this.UPSInfo.VendorId;
    this.ShipDetails = this.UPSInfo.ShippingArray;
    this.ShipFrom = this.UPSInfo.ShipFrom;
    this.ShipTo = this.UPSInfo.ShipTo;
    this.ShipViaId = this.UPSInfo.ShipViaId;
    this.ShipToAddressId = this.UPSInfo.ShipToAddressId;
    if (this.ShipFrom == 'Aibond') {
      this.getAHaddress()
    } else if (this.ShipFrom == 'Customer') {
      this.getCustomerAddress()
    } else if (this.ShipFrom == 'Vendor') {
      this.getVendorAddress()
    }

    if (this.ShipTo == 'Customer') {
      this.ShipperNumber = this.UPSInfo.CustomerShipper;
      this.getCustomerAddress();
      this.getCustomerList();
    } else if (this.ShipTo == 'Vendor') {
      this.ShipperNumber = this.UPSInfo.VendorShipper;
      this.getVendorAddress();
      this.getVendorList();
    }

    this.getAddressByAddressId();


    var PackWeight = 0

    for (let i = 0; i < this.ShipDetails.length; i++) {
      PackWeight = Number(PackWeight) + Number(this.ShipDetails[i].PackWeight);

      if (this.ShipTo == 'Customer') {
        this.refNo1.push(
          this.ShipDetails[i].CustomerPONo
        )
      }
      if (this.ShipTo == 'Vendor') {
        this.refNo1.push(
          this.ShipDetails[i].VendorRefNo
        )
      }
      this.refNo2.push(
        this.ShipDetails[i].RRNo
      )
    }


    this.PackWeight = PackWeight
    let refNo1 = [...new Set(this.refNo1)];
    let refNo2 = [...new Set(this.refNo2)];

    this.model.refNo1 = refNo1.toString()
    this.model.refNo2 = refNo2.toString()



  }

  filterAndGetValue(object, getField, filterField, filterValue) {
    var value = object.filter(function (data) {
      return data[filterField] == filterValue;
    }, filterField, filterValue)
    return value[0][getField];
  }
  getAddressByAddressId() {
    if (this.ShipToAddressId > 0) {
      var postData = {
        AddressId: this.ShipToAddressId
      };
      this.commonService.postHttpService(postData, 'getAddressView').subscribe(response => {
        this.ShipToAddressView = response.responseData;
      })
    }
  }
  getAHaddress() {
    this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(response => {
      if (response.status == true) {
        let obj = this
        response.responseData.AHGroupVendorAddress.map(function (value) {
          if (value.IsShippingAddress == 1) {
            obj.ShipFromAddress = value
          }
        });


      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  getCustomerAddress() {
    var postData = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      "Type": CONST_ShipAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {

      var ShippingAddress = response.responseData.map(function (value) {
        if (value.IsShippingAddress == 1) {
          return value
        }
      });
      this.ShipToAddress = ShippingAddress[0]


    });
  }
  getVendorAddress() {
    var postData = {
      "IdentityId": this.VendorId,
      "IdentityType": 2,
      "Type": CONST_ShipAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      var ShippingAddress = response.responseData.map(function (value) {
        if (value.IsShippingAddress == 1) {
          return value
        }
      });
      this.ShipToAddress = ShippingAddress[0]
    });
  }

  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData;
      this.CustomerName = this.customerList.find(a => a.CustomerId == this.CustomerId).CompanyName
      this.ShipToName = this.CustomerName
    });
  }
  getVendorList() {
    this.commonService.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
      this.VendorName = this.vendorList.find(a => a.VendorId == this.VendorId).VendorName
      this.ShipToName = this.VendorName
    });
  }


  onSubmit(f: NgForm) {
    var ShipToName = this.ShipToName
    var ShipFromAddressLine = this.ShipFromAddress.StreetAddress
    var ShipFromCity = this.ShipFromAddress.City
    var ShipFromCountryCode = this.ShipFromAddress.CountryCode
    var ShipFromStateCode = this.ShipFromAddress.StateCode
    var ShipFromPostalCode = this.ShipFromAddress.Zip
    var ShipFromNumber = this.ShipFromAddress.PhoneNoPrimary

    if (this.ShipToAddressView.length > 0) {
      // console.log(this.ShipToAddressId);
      // console.log(this.ShipToAddressView);
      // console.log("ShipToAddressView");
      var ShipToAddressLine = this.ShipToAddressView[0].StreetAddress
      var ShipToCity = this.ShipToAddressView[0].City
      var ShipToCountryCode = this.ShipToAddressView[0].CountryCode
      var ShipToStateCode = this.ShipToAddressView[0].StateCode
      var ShipToPostalCode = this.ShipToAddressView[0].Zip
      var ShipToNumber = this.ShipToAddressView[0].PhoneNoPrimary
    } else {
      var ShipToAddressLine = this.ShipToAddress.StreetAddress
      var ShipToCity = this.ShipToAddress.City
      var ShipToCountryCode = this.ShipToAddress.CountryCode
      var ShipToStateCode = this.ShipToAddress.StateCode
      var ShipToPostalCode = this.ShipToAddress.Zip
      var ShipToNumber = this.ShipToAddress.PhoneNoPrimary
    }

    var UPS_Service_Description = this.filterAndGetValue(this.UPSServiceList, "UPS_Service_Description", "UPS_Service_Code", this.model.UPSService)
    this.Form = this.fb.group({
      ShipToName: [ShipToName],
      ShipToAttentionName: [ShipToName],
      ShipToAddressLine: [ShipToAddressLine],
      ShipToCity: [ShipToCity],
      ShipToStateCode: [ShipToStateCode],
      ShipToPostalCode: [ShipToPostalCode],
      ShipToCountryCode: [ShipToCountryCode],
      ShipToNumber: [ShipToNumber],

      ShipFromName: ["Aibond"],
      ShipFromAttentionName: ["Aibond"],
      ShipFromAddressLine: [ShipFromAddressLine],
      ShipFromCity: [ShipFromCity],
      ShipFromStateCode: [ShipFromStateCode],
      ShipFromPostalCode: [ShipFromPostalCode],
      ShipFromCountryCode: [ShipFromCountryCode],
      ShipFromNumber: [ShipFromNumber],
      Weight: [this.PackWeight],
      refNo1: [this.model.refNo1],
      refNo2: [this.model.refNo2],
      UPS_Service_Code: [this.model.UPSService],
      UPS_Service_Description: [UPS_Service_Description],
      UPS_Shipper_number: this.ShipperNumber
    })

    console.log(this.Form.value)
    if (f.valid) {
      this.commonService.postHttpService(this.Form.value, "UPSGenerateLabel").subscribe(response => {
        const parser = new xml2js.Parser({ strict: true, trim: true });
        parser.parseString(response.responseData, (err, result) => {
          this.xml = result;
        });
        this.getResult(this.xml)
        if (this.ups_status != 'fail') {
          var postData = {
            "ShipFrom": this.ShipFrom,
            "ShipTo": this.ShipTo,
            "ShipViaId": this.ShipViaId,
            "CustomerId": this.CustomerId,
            "VendorId": this.VendorId,
            "ShippingArray": this.ShipDetails,
            "ShipToAddressId": this.ShipToAddressId
          }
          this.commonService.postHttpService(postData, "BulkShipping").subscribe(response => {
            if (response.status == true) {

              //CREATE UPS
              var postDataCREATEUPS = {
                "ShippingHistoryId": response.responseData.SHID,
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
              this.commonService.postHttpService(postDataCREATEUPS, "UPSBulkCreate").subscribe(response => {

                if (response.status == true) {

                }
                else {

                }
                this.cd_ref.detectChanges();
              }, error => console.log(error));

              this.triggerEvent(response.responseData);
              this.modalRef.hide();
              var BulkShipId = response.responseData.BulkShipId;
              var ShipToAddressId = this.ShipToAddressId;
              this.modalRef = this.CommonmodalService.show(BulkShippingPackingslipComponent,
                {
                  backdrop: 'static',
                  ignoreBackdropClick: false,
                  initialState: {
                    data: { BulkShipId, ShipToAddressId },
                    class: 'modal-xl'
                  }, class: 'gray modal-xl'
                });

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
  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

}
