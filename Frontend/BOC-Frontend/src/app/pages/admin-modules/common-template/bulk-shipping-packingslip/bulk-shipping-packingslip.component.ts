import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FileSaverService } from 'ngx-filesaver';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import { CONST_AH_Group_ID, CONST_ContactAddressType, CONST_ShipAddressType } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-bulk-shipping-packingslip',
  templateUrl: './bulk-shipping-packingslip.component.html',
  styleUrls: ['./bulk-shipping-packingslip.component.scss'], 
  providers: [
    NgxSpinnerService,
  ]
})
export class BulkShippingPackingslipComponent implements OnInit {

    BulkShipId;
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
    shipfrom:boolean = false
    public event: EventEmitter<any> = new EventEmitter();
    AddressList:any=[]
    ShipToAddressId: any;
  ShipToAddressView: any;
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
      this.BulkShipId = this.data.BulkShipId;
      this.ShipToAddressId = this.data.ShipToAddressId ? this.data.ShipToAddressId : 0;
      this.getAhGroupaddress()
      this.getPackingSlip()
      this.getAddressByAddressId()
    }

    getAddressByAddressId(){
      if(this.ShipToAddressId > 0){
        var postData = {
          AddressId: this.ShipToAddressId
        };
        this.commonService.postHttpService(postData, 'getAddressView').subscribe(response => {
          this.ShipToAddressView = response.responseData;
        })
      }
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
   
    getPackingSlip() {
      var postData = {
        "BulkShipId": this.BulkShipId
      }
      this.commonService.postHttpService(postData, "BulkShipPackingSlip").subscribe(response => {
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
          var shiptoAddress=[]
          shiptoAddress.push(
            {
           "StreetAddress":this.RRShippingHistory.ReceiveStreetAddress,
         "SuiteOrApt":this.RRShippingHistory.ReceiveSuiteOrApt,
         "City":this.RRShippingHistory.ReceiveCity,
         "CountryName" :this.RRShippingHistory.ReceiveCountry,
         "Zip":this.RRShippingHistory.ReceiveZip,
         "StateName":this.RRShippingHistory.ReceiveState
            }
        )
        this.ShipToAddress = shiptoAddress[0];
        // console.log(this.ShipToAddress)
        // this.PartItem.forEach(function (item) {
        //   item.CustomerPONo = response.responseData && response.responseData.RRInfo && response.responseData.RRInfo[0].CustomerPONo ? response.responseData.RRInfo[0].CustomerPONo : '-';
        // });
          //  console.log(this.PartItem);
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
  
        } else { }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
  
    }
   
    hideAddress: boolean = true
    generatePDF() {
      this.getPdfBase64((pdfBase64) => {
        let blob = this.commonService.base64ToBlob(pdfBase64, "application/pdf");
        this._FileSaverService.save(blob, `Bulk Packing Slip.pdf`);
     })
    }
  
    getPdfBase64(cb) {
      this.commonService.getLogoAsBas64().then((base64) => {
  
        let title = "", svg = "";
  
        // let showCustomerRef = this.RRShippingHistory.ReceiveIdentityType == 'Customer' && (this.Status == '5' || this.Status == '7')
  
        // svg = $(".scaled svg")[0].outerHTML;
  
        // if (this.RRShippingHistory.ShipToIdentityName == 'Vendor') {
        //   if (this.RRShippingHistory.ShipToId != this.CONST_AH_Group_ID) {
        //     title = "Packing List - Evaluation";
        //   } else {
        //     title = "Packing List";
        //   }
        // } else {
        //   if (this.Status == '5' || this.Status == '7') {
        //     title = "Packing List - Repaired Unit";
        //   } else {
        //     title = "Packing List - Unit Returned Not Repaired"
        //   }
        // }
  
        let pdfObj = {
          AHAddressList: this.AHAddressList,
          RRShippingHistory: this.RRShippingHistory,
          ShipToAddress: this.ShipToAddressView && this.ShipToAddressView.length > 0 ? this.ShipToAddressView[0] : this.ShipToAddress,
          RRInfo: this.RRInfo,
          PartItem: this.PartItem.map((a, i) => { a.RowIndex = i + 1; return a; }),
          Logo: base64,
          BulkShipId: this.BulkShipId
        }
  
        this.commonService.postHttpService({ pdfObj }, "BulkShipping-Pdf").subscribe(response => {
          if (response.status == true) {
            cb(response.responseData.pdfBase64);
          }
        });
      })
    }
  }
  


