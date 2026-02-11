/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { DatePipe } from '@angular/common';
import { CONST_AH_Group_ID, VAT_field_Name } from 'src/assets/data/dropdown';
import { RrShippingHistoryComponent } from '../../common-template/rr-shipping-history/rr-shipping-history.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-repair-request-edit',
  templateUrl: './repair-request-edit.component.html',
  styleUrls: ['./repair-request-edit.component.scss'],
  providers:[BsModalRef]
})
export class RepairRequestEditComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  RRId;
  viewResult: any;
  repairMessage: string;
  RRNo: any;
  CustomerId: any;
  PriorityNotes: any;
  StatusName: any;
  ShippingStatus: any;
  ShippingIdentityType: any;
  VendorPONo: any;
  Status: any;
  CustomerPONo: any;
  CustomerSONo: any;
  CustomerInvoiceNo: any;
  VendorInvoiceNo: any;
  VendorId: any;
  VendorSize: any;
  VendorName: any;
  VendorCode: any;
  CustomerPartNo1;
  CustomerPartNo2;
  RRImages: any = [];
  VendorPOId: any;
  CustomerSOId: any;
  CustomerInvoiceId: any;
  VendorInvoiceId: any;
  CustomerSODueDate: string;
  VendorPODueDate: string;
  CustomerInvoiceDueDate: string;
  VendorInvoiceDueDate: string;
  CustomerShipToId: any;
  VendorsInfo: any;
  VendorPartsInfo: any;
  QuoteItems: any;
  ApprovedQuoteInfo: any;
  ApprovedQuoteItems: any;
  CustomerRefInfo: any;
  RRStatusHistory: any;
  RRShippingHistory: any=[];
  RRPartsInfo: any;
  RRNotesInfo: any;
  AttachmentList: any;
  VendorFollowup: any;
  WarrantyInfo: any;
  currentImage: any;
  PartNo: any;
  LeadTime: any;
  RRPartsId: any;
  Description: any;
  Manufacturer: any;
  ManufacturerPartNo: any;
  SerialNo: any;
  Quantity: any;
  Price: any;
  Rate: any;
  RRDescription: any;
  StatedIssue: any;
  AssetId: any;
  DepartmentId: any;
  CustomerAssetName: any;
  CustomerDepartmentName: any;
  ContactPhone: any;
  ContactEmail: any;
  ApprovedQuoteId: any;
  ApprovedVendorId: any;
  ApprovedQuoteStatus: any;
  QuoteId: any;
  QuoteNo: any;
  QuoteCustomerStatus: any;
  SubTotal: any;
  AdditionalCharge: any;
  TotalTax: any;
  Discount: any;
  Shipping: any;
  QuoteGrandTotal: any;
  QuoteRouteCause: any;
  QuoteLeadTime: any;
  QuoteWarrantyPeriod: any;
  QuotePrice: any;
  UserName: any;
  CustomerBillTo: string;
  CustomerShipTo: any;
  CompanyName: any;
  Warranty: boolean;

  ShippingIdentityId;
  CONST_AH_Group_ID;

  IsDisplayBaseCurrencyValue 
  VAT_field_Name
  BaseCurrencySymbol
  constructor(private fb: FormBuilder, private cd_ref: ChangeDetectorRef,
    public router: Router, private modalService: NgbModal, public navCtrl: NgxNavigationWithDataComponent,
    private service: CommonService,
    private datePipe: DatePipe,private route: ActivatedRoute,
    private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, ) {
  }

  currentRouter = this.router.url;
  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Repair Requests', path: '#/vendor/rr-list' }, { label: 'Edit', path: '/', active: true }];
    this.IsDisplayBaseCurrencyValue =localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")
    this.VAT_field_Name = VAT_field_Name
    if (history.state.RRId == undefined) {
      this.route.queryParams.subscribe(
        params => {
          this.RRId = params['RRId'];
        }
      )
    }
    else if (history.state.RRId != undefined) {
      this.RRId = history.state.RRId

    }
    // this.RRId = this.navCtrl.get('RRId'); 

    // Redirect to the List page if the View Id is not available
    if (this.RRId == '' || this.RRId == 'undefined' || this.RRId == null) {
      this.navCtrl.navigate('/vendor/rr-list/');
      return false;
    }

    this.CONST_AH_Group_ID = CONST_AH_Group_ID;

    this.getViewContent();
  }

  getViewContent() {
    var postData = {
      RRId: this.RRId
    }
    this.service.postHttpService(postData, "VendorRRView").subscribe(response => {
      this.viewResult = response.responseData;

      // For QR Code 
      this.RRNo = this.viewResult.RRInfo[0].RRNo;
      this.CustomerId = this.viewResult.RRInfo[0].CustomerId;
      this.RRDescription = this.viewResult.RRInfo[0].RRDescription;
      this.StatedIssue = this.viewResult.RRInfo[0].StatedIssue || '-';
      this.CustomerAssetName = this.viewResult.RRInfo[0].CustomerAssetName;
      this.CustomerDepartmentName = this.viewResult.RRInfo[0].CustomerDepartmentName;
      this.ContactPhone = this.viewResult.RRInfo[0].ContactPhone;
      this.ContactEmail = this.viewResult.RRInfo[0].ContactEmail;
      this.UserName = this.viewResult.RRInfo[0].UserName;
      this.CompanyName = this.viewResult.RRInfo[0].CompanyName;

      var BillTo = this.viewResult.RRInfo[0].BillToSuiteOrApt;
      if (this.viewResult.RRInfo[0].BillToStreetAddress != '') BillTo += ', ' + this.viewResult.RRInfo[0].BillToStreetAddress;
      if (this.viewResult.RRInfo[0].BillToState != '') BillTo += ', ' + this.viewResult.RRInfo[0].BillToState;
      if (this.viewResult.RRInfo[0].ShipToState != '') BillTo += ', ' + this.viewResult.RRInfo[0].ShipToState;
      if (this.viewResult.RRInfo[0].BillToCountry != '') BillTo += ', ' + this.viewResult.RRInfo[0].BillToCountry;
      if (this.viewResult.RRInfo[0].ShipToZip != '') BillTo += ', ' + this.viewResult.RRInfo[0].ShipToZip;
      if (this.viewResult.RRInfo[0].BillToPhoneNoPrimary != '') BillTo += ', ' + this.viewResult.RRInfo[0].BillToPhoneNoPrimary;
      this.CustomerBillTo = BillTo;

      var ShipTo = this.viewResult.RRInfo[0].ShipToSuiteOrApt;
      if (this.viewResult.RRInfo[0].ShipToStreetAddress != '') ShipTo += ', ' + this.viewResult.RRInfo[0].ShipToStreetAddress;
      if (this.viewResult.RRInfo[0].ShipToCity != '') ShipTo += ', ' + this.viewResult.RRInfo[0].ShipToCity;
      if (this.viewResult.RRInfo[0].ShipToState != '') ShipTo += ', ' + this.viewResult.RRInfo[0].ShipToState;
      if (this.viewResult.RRInfo[0].ShipToCountry != '') ShipTo += ', ' + this.viewResult.RRInfo[0].ShipToCountry;
      if (this.viewResult.RRInfo[0].ShipToZip != '') ShipTo += ', ' + this.viewResult.RRInfo[0].ShipToZip;
      if (this.viewResult.RRInfo[0].ShipToPhoneNoPrimary != '') ShipTo += ', ' + this.viewResult.RRInfo[0].ShipToPhoneNoPrimary;
      this.CustomerShipTo = ShipTo;

      this.PriorityNotes = this.viewResult.RRInfo[0].PriorityNotes;
      this.StatusName = this.viewResult.RRInfo[0].StatusName;
      this.ShippingStatus = this.viewResult.RRInfo[0].ShippingStatus;
      this.ShippingIdentityType = this.viewResult.RRInfo[0].ShippingIdentityType;      
      this.ShippingIdentityId = this.viewResult.RRInfo[0].ShippingIdentityId;
      this.VendorPONo = this.viewResult.RRInfo[0].VendorPONo;
      this.Status = this.viewResult.RRInfo[0].Status;

      this.CustomerPONo = this.viewResult.RRInfo[0].CustomerPONo || '';
      this.CustomerSONo = this.viewResult.RRInfo[0].CustomerSONo || '';
      this.CustomerInvoiceNo = this.viewResult.RRInfo[0].CustomerInvoiceNo || '';
      this.VendorInvoiceNo = this.viewResult.RRInfo[0].VendorInvoiceNo || '';

      this.VendorPOId = this.viewResult.RRInfo[0].VendorPOId || '';
      this.CustomerSOId = this.viewResult.RRInfo[0].CustomerSOId || '';
      this.CustomerInvoiceId = this.viewResult.RRInfo[0].CustomerInvoiceId || '';
      this.VendorInvoiceId = this.viewResult.RRInfo[0].VendorInvoiceId || '';

      this.CustomerSODueDate = (this.viewResult.RRInfo[0].CustomerSODueDate) ? this.datePipe.transform(this.viewResult.RRInfo[0].CustomerSODueDate, 'MM/dd/yyyy') : '';
      this.VendorPODueDate = (this.viewResult.RRInfo[0].VendorPODueDate) ? this.datePipe.transform(this.viewResult.RRInfo[0].VendorPODueDate, 'MM/dd/yyyy') : '';
      this.CustomerInvoiceDueDate = (this.viewResult.RRInfo[0].CustomerInvoiceDueDate) ? this.datePipe.transform(this.viewResult.RRInfo[0].CustomerInvoiceDueDate, 'MM/dd/yyyy') : '';
      this.VendorInvoiceDueDate = (this.viewResult.RRInfo[0].VendorInvoiceDueDate) ? this.datePipe.transform(this.viewResult.RRInfo[0].VendorInvoiceDueDate, 'MM/dd/yyyy') : '';

      this.CustomerShipToId = this.viewResult.RRInfo[0].CustomerShipToId || '';
      this.CustomerShipToId = this.viewResult.RRInfo[0].CustomerBillToId || '';

      this.VendorsInfo = this.viewResult.VendorsInfo || [];
      this.VendorPartsInfo = this.viewResult.VendorPartsInfo || [];

      this.QuoteItems = this.viewResult.QuoteItems || [];

      this.ApprovedQuoteItems = this.viewResult.ApprovedQuoteItems || [];

      this.CustomerRefInfo = this.viewResult.CustomerRefInfo || [];
      this.RRStatusHistory = this.viewResult.RRStatusHistory || [];
      this.RRShippingHistory = this.viewResult.RRShippingHistory || [];
      this.RRPartsInfo = this.viewResult.RRPartsInfo || [];
      this.RRNotesInfo = this.viewResult.RRNotesInfo || [];
      this.AttachmentList = this.viewResult.AttachmentList || [];
      this.VendorFollowup = this.viewResult.FollowUpHistory || [];
      this.WarrantyInfo = this.viewResult.WarrantyInfo || [];

      // Approved Vendor Details
      this.VendorId = this.viewResult.RRInfo[0].VendorId;
      this.VendorSize = this.viewResult.VendorsInfo.length;
      if (this.VendorId > 0) {
        this.VendorName = this.viewResult.RRInfo[0].VendorName;
        this.VendorCode = this.viewResult.RRInfo[0].VendorCode;
      }

      //this.getCustomerProperties(this.viewResult.RRInfo[0].CustomerId, {"PriorityNotes": this.PriorityNotes});
      //this.getCustomerAddressList(this.viewResult.RRInfo[0].CustomerId);

      if (this.viewResult.RRImages.length > 0) {
        for (let val of this.viewResult.RRImages) {
          let img = val.ImagePath;
          let RRImageId = val.RRImageId;
          this.RRImages.push({ img, RRImageId });
        }
        this.currentImage = new FormControl(this.RRImages[0]);
      }
      /********** RR Notes Group - End ***********/

      this.PartId = this.viewResult.RRPartsInfo[0].PartId;
      this.PartNo = this.viewResult.RRPartsInfo[0].PartNo;
      this.LeadTime = this.viewResult.RRPartsInfo[0].LeadTime;
      this.RRPartsId = this.viewResult.RRPartsInfo[0].RRPartsId;
      this.Description = this.viewResult.RRPartsInfo[0].Description;
      this.Manufacturer = this.viewResult.RRPartsInfo[0].Manufacturer;
      this.ManufacturerPartNo = this.viewResult.RRPartsInfo[0].ManufacturerPartNo;
      this.SerialNo = this.viewResult.RRPartsInfo[0].SerialNo;
      this.Quantity = this.viewResult.RRPartsInfo[0].Quantity;
      this.Price = this.viewResult.RRPartsInfo[0].Price;
      this.Rate = this.viewResult.RRPartsInfo[0].Rate;

      //this.getPartPrice(this.PartId);

      //RepairMessage show condition
      if (this.viewResult.RRInfo[0].IsRushRepair == 1) {
        this.repairMessage = "Rush Repair"
      }
      if (this.viewResult.RRInfo[0].IsWarrantyRecovery == 1) {
        this.repairMessage = "Warranty Repair"
      }
      if (this.viewResult.RRInfo[0].IsWarrantyRecovery == 2) {
        this.repairMessage = "Warranty New"
      }
      if (this.viewResult.RRInfo[0].IsRepairTag == 1) {
        this.repairMessage = "Repair Tag"
      }
      if (this.viewResult.RRInfo[0].IsRushRepair == 1 && this.viewResult.RRInfo[0].IsWarrantyRecovery == 1) {
        this.repairMessage = "Rush Repair, Warranty Repair"
      }

      if (this.viewResult.VendorsInfo.length > 0) { // Vendor Quote details
        for (var i = 0; i < this.viewResult.VendorsInfo.length; i++) {
          if (this.viewResult.VendorsInfo[i].Status == 2) {
            this.ApprovedVendorId = this.viewResult.VendorsInfo[i].VendorId;
            this.ApprovedQuoteStatus = this.viewResult.VendorsInfo[i].Status;            

            this.SubTotal = this.viewResult.VendorsInfo[i].SubTotal;
            this.AdditionalCharge = this.viewResult.VendorsInfo[i].AdditionalCharge;
            this.TotalTax = this.viewResult.VendorsInfo[i].TotalTax;
            this.Discount = this.viewResult.VendorsInfo[i].Discount;
            this.Shipping = this.viewResult.VendorsInfo[i].Shipping;
            this.QuoteGrandTotal = this.viewResult.VendorsInfo[i].GrandTotal;
            continue;
          }
        }

        //this.AdditionalCharge = this.viewResult.VendorsInfo[0].AdditionalCharge;
        //this.Discount = this.viewResult.VendorsInfo[0].Discount;
        //this.QuoteGrandTotal = this.viewResult.VendorsInfo[0].GrandTotal;
        this.QuoteLeadTime = this.viewResult.VendorsInfo[0].LeadTime;
        this.QuoteRouteCause = this.viewResult.VendorsInfo[0].RouteCause;
        //this.Shipping = this.viewResult.VendorsInfo[0].Shipping;
        //this.SubTotal = this.viewResult.VendorsInfo[0].SubTotal;
        //this.TotalTax = this.viewResult.VendorsInfo[0].TotalTax;
        this.QuoteWarrantyPeriod = this.viewResult.VendorsInfo[0].WarrantyPeriod;
      } else { }

      this.Warranty = false;
      if (this.viewResult.WarrantyInfo.length > 0 && this.viewResult.WarrantyInfo[0].VendorId == this.VendorId) {
        this.Warranty = true;
      }


      /* if (response.status == true) {
        this.viewResult = response.responseData;

        this.getCustomerProperties(this.viewResult.RRInfo[0].CustomerId, {"PriorityNotes": this.PriorityNotes});
        this.getCustomerAddressList(this.viewResult.RRInfo[0].CustomerId);
        
        if (this.viewResult.RRImages.length > 0) {
          for (let val of this.viewResult.RRImages) {
            let img = val.ImagePath;
            let RRImageId = val.RRImageId;
            this.RRImages.push({ img, RRImageId });
          }
          this.currentImage = new FormControl(this.RRImages[0]);
        }              

        //RepairMessage show condition
        if (this.viewResult.RRInfo[0].IsRushRepair == 1) {
          this.repairMessage = "Rush Repair"
        }
        if (this.viewResult.RRInfo[0].IsWarrantyRecovery == 1) {
          this.repairMessage = "Warranty Repair"
        }
        if (this.viewResult.RRInfo[0].IsRepairTag == 1) {
          this.repairMessage = "Repair Tag"
        }
        if (this.viewResult.RRInfo[0].IsRushRepair == 1 && this.viewResult.RRInfo[0].IsWarrantyRecovery == 1) {
          this.repairMessage = "Rush Repair, Warranty Repair"
        }
        
      } else { } */
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  getPartPrice(PartId: (PartId: any) => void) {
    throw new Error("Method not implemented.");
  }
  PartId(PartId: any) {
    throw new Error("Method not implemented.");
  }

  goToVendorPOView() {
    this.navCtrl.navigate('vendor/po-list', { POId: this.VendorPOId });
  }

  //RRShipping History
  shippingHistory() {
    var RRShippingHistory = this.RRShippingHistory;
    var PartId = this.PartId;
    var RRId = this.RRId;

    this.modalRef = this.CommonmodalService.show(RrShippingHistoryComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { RRShippingHistory, RRId, PartId },
          class: 'modal-xl'
        }, class: 'gray modal-xl'
      });

    this.modalRef.content.closeBtnName = 'Close';
  }
}
