/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, ViewChild, Input, TemplateRef, ChangeDetectorRef, ViewChildren, QueryList, Inject, EventEmitter } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/core/services/common.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { SalesQuote_Status, Quote_type, terms, warranty_list, taxtype, Quote_notes, CONST_IDENTITY_TYPE_QUOTE, CONST_AH_Group_ID, CONST_ContactAddressType, CONST_ShipAddressType } from 'src/assets/data/dropdown';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddRrPartsComponent } from '../../common-template/add-rr-parts/add-rr-parts.component';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { EmailComponent } from '../../common-template/email/email.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-packing-slip',
  templateUrl: './packing-slip.component.html',
  styleUrls: ['./packing-slip.component.scss'],
  providers: [
    NgxSpinnerService,
  ]
})
export class PackingSlipComponent implements OnInit {
  shippingDetails;
  viewResult;
  RRInfo;
  Number;
  RRShippingHistory;
  repairMessage;
  PartItem: any = [];
  RRVendorNote: any = [];
  CustomerNote: any = [];
  CustomerRef: any = [];
  AHAddressList;
  Status;
  CONST_AH_Group_ID;
  ShipToAddress;
  shipfrom: boolean = false
  public event: EventEmitter<any> = new EventEmitter();
  AddressList: any = []
  constructor(public modalRef: BsModalRef, private cd_ref: ChangeDetectorRef,
    private CommonmodalService: BsModalService,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,
    private _FileSaverService: FileSaverService) { }

  ngOnInit(): void {
    this.RRShippingHistory = "";
    this.RRInfo = "";
    this.PartItem = [];
    this.viewResult = []
    this.AHAddressList = "";
    this.ShipToAddress = ""
    this.shippingDetails = this.data.shippingDetails;
    if ('MROId' in this.shippingDetails) {
      this.getPackingSlipMro()
    } else {
      this.getPackingSlip();
    }
    if (this.shippingDetails.ShipToId != CONST_AH_Group_ID) {
      this.getAhGroupaddress()
    } else {
      this.getAHaddress();
    }
  }

  getAHaddress() {
    this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(response => {
      if (response.status == true) {
        this.AddressList = response.responseData.AHGroupVendorAddress
        //this.model.AddressId =this.AddressList[0].AddressId
        for (var i = 0; i <= this.AddressList.length; i++) {
          console.log(this.AddressList[i])
          if (this.shippingDetails.ReceiveAddressId == this.AddressList[i].AddressId) {
            this.AHAddressList = this.AddressList[i]
          }

        }



      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  getAhGroupaddress() {
    var postData = {
      "IdentityId": CONST_AH_Group_ID,
      "IdentityType": 2,
      "Type": CONST_ContactAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.AHAddressList = response.responseData[0];
    })
  }
  getPackingSlipMro() {
    var postData = {
      "MROId": this.shippingDetails.MROId,
      "MROShippingHistoryId": this.shippingDetails.MROShippingHistoryId,
      "SOId": this.shippingDetails.SOId,
      "SOItemId": this.shippingDetails.SOItemId
    }
    this.commonService.postHttpService(postData, "PackingSlipMRO").subscribe(response => {
      if (response.status == true) {
        this.viewResult = response.responseData;
        this.RRInfo = this.viewResult.MROInfo[0];
        this.Status = this.RRInfo.Status;
        this.Number = this.RRInfo.MRONo
        this.CONST_AH_Group_ID = CONST_AH_Group_ID
        this.RRShippingHistory = this.viewResult.MROShippingHistory[0];
        this.PartItem = this.viewResult.ShippedItem;
        this.CustomerNote = this.viewResult.CustomerNote || [];
        this.RRVendorNote = this.viewResult.VendorNote || [];
        this.CustomerRef = this.viewResult.CustomerReference || []
        if (this.RRInfo.IsRushRepair == 1) {
          this.repairMessage = "Rush Repair"
        }
        if (this.RRInfo.IsWarrantyRecovery == 1) {
          this.repairMessage = "Warranty Repair"
        }
        if (this.RRInfo.IsWarrantyRecovery == 2) {
          this.repairMessage = "Warranty New"
        }
        if (this.RRInfo.IsRushRepair == 1 && this.RRInfo.IsWarrantyRecovery == 1) {
          this.repairMessage = "Rush Repair, Warranty Repair"
        }


        var shiptoAddress = []
        shiptoAddress.push(
          {
            "StreetAddress": this.RRShippingHistory.ReceiveStreetAddress,
            "SuiteOrApt": this.RRShippingHistory.ReceiveSuiteOrApt,
            "City": this.RRShippingHistory.ReceiveCity,
            "CountryName": this.RRShippingHistory.ReceiveCountry,
            "Zip": this.RRShippingHistory.ReceiveZip,
            "StateName": this.RRShippingHistory.ReceiveState
          }
        )
        this.ShipToAddress = shiptoAddress[0]
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }
  getPackingSlip() {
    var postData = {
      "RRId": this.shippingDetails.RRId,
      "ShippingHistoryId": this.shippingDetails.ShippingHistoryId
    }
    this.commonService.postHttpService(postData, "PackingSlip").subscribe(response => {
      if (response.status == true) {
        this.viewResult = response.responseData;
        this.RRInfo = this.viewResult.RRInfo[0];
        this.Status = this.RRInfo.Status;
        this.Number = this.RRInfo.RRNo

        this.CONST_AH_Group_ID = CONST_AH_Group_ID
        this.RRShippingHistory = this.viewResult.RRShippingHistory[0];
        this.PartItem = this.viewResult.RRPartsInfo;
        this.CustomerNote = this.viewResult.CustomerNote || [];
        this.RRVendorNote = this.viewResult.RRVendorNote || [];
        this.CustomerRef = this.viewResult.CustomerReference || []
        var shiptoAddress = []
        shiptoAddress.push(
          {
            "StreetAddress": this.RRShippingHistory.ReceiveStreetAddress,
            "SuiteOrApt": this.RRShippingHistory.ReceiveSuiteOrApt,
            "City": this.RRShippingHistory.ReceiveCity,
            "CountryName": this.RRShippingHistory.ReceiveCountry,
            "Zip": this.RRShippingHistory.ReceiveZip,
            "StateName": this.RRShippingHistory.ReceiveState
          }
        )
        this.ShipToAddress = shiptoAddress[0]
        // console.log(this.ShipToAddress)


        if (this.RRInfo.IsRushRepair == 1) {
          this.repairMessage = "Rush Repair"
        }
        if (this.RRInfo.IsWarrantyRecovery == 1) {
          this.repairMessage = "Warranty Repair"
        }
        if (this.RRInfo.IsRushRepair == 1 && this.RRInfo.IsWarrantyRecovery == 1) {
          this.repairMessage = "Rush Repair, Warranty Repair"
        }

      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }
  getshiptoaddress() {
    if (this.RRShippingHistory.ShipToIdentityName == 'Vendor') {
      var IdentityType = 2
    }
    else {
      var IdentityType = 1
    }

    var postData = {
      "IdentityId": this.RRShippingHistory.ShipToId,
      "IdentityType": IdentityType,
      "Type": CONST_ShipAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.ShipToAddress = response.responseData[0]
      // console.log(this.ShipToAddress)

    });
  }
  hideAddress: boolean = true
  generatePDF() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.commonService.base64ToBlob(pdfBase64, "application/pdf");
      if ('MROId' in this.shippingDetails) {
        this._FileSaverService.save(blob, `Packing Slip ${this.Number}.pdf`);

      } else {
        this._FileSaverService.save(blob, `Packing Slip ${this.Number}.pdf`);

      }
    })
  }

  getPdfBase64(cb) {
    this.commonService.getLogoAsBas64().then((base64) => {

      let title = "", svg = "", svgpo = "";
      // console.log(this.RRShippingHistory);
      let showCustomerRef = this.RRShippingHistory.ReceiveIdentityType == 'Customer' && (this.Status == '5' || this.Status == '7')
      // console.log(this.RRInfo);
      svg = $(".scaled svg")[0].outerHTML;

      if(this.RRShippingHistory.ShipToIdentityName == "Customer" && this.RRInfo.CustomerPONo !=""){
        svgpo = $(".scaled_po svg")[0].outerHTML;
      }
      

      if (this.RRShippingHistory.ShipToIdentityName == 'Vendor') {
        if (this.RRShippingHistory.ShipToId != this.CONST_AH_Group_ID) {
          title = "Packing List - Evaluation";
        } else {
          title = "Packing List";
        }
      } else {
        if (this.Status == '5' || this.Status == '7') {
          title = "Packing List - Repaired Unit";
        } else {
          title = "Packing List - Unit Returned Not Repaired"
        }
      }

      let pdfObj = {
        Title: title,
        AHAddressList: this.AHAddressList,
        BarcodeSVG: svg,
        BarcodeSVGPO: svgpo,
        RRShippingHistory: this.RRShippingHistory,
        ShipToAddress: this.ShipToAddress,
        ShowCustomerRef: showCustomerRef,
        CustomerRef: this.CustomerRef,
        RRInfo: this.RRInfo,
        PartItem: this.PartItem.map((a, i) => { a.RowIndex = i + 1; return a; }),
        Logo: base64
      }

      this.commonService.postHttpService({ pdfObj }, "getPSPdfBase64").subscribe(response => {
        if (response.status == true) {
          cb(response.responseData.pdfBase64);
        }
      });
    })
  }
}
