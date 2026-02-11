/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */

import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { CommonService } from "src/app/core/services/common.service";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";
import { RejectquoteComponent } from "../../common-template/rejectquote/rejectquote.component";
import {
  CONST_AH_Group_ID,
  CONST_ContactAddressType,
  CONST_COST_HIDE_VALUE,
  CONST_IDENTITY_TYPE_RR,
  CONST_RRS_COMPLETED,
  Quote_notes,
  Quote_type,
  rr_status_customer,
  VAT_field_Name,
} from "src/assets/data/dropdown";
import { FileSaverService } from "ngx-filesaver";
import { BlanketPoCustomerPortalComponent } from "../../common-template/blanket-po-customer-portal/blanket-po-customer-portal.component";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ShippingHistoryCustomerPortalComponent } from "../../common-template/shipping-history-customer-portal/shipping-history-customer-portal.component";
import { CustomerAddWarrantyComponent } from "../../common-template/customer-add-warranty/customer-add-warranty.component";
import { CustomerPortalQrCodeComponent } from "../../common-template/customer-portal-qr-code/customer-portal-qr-code.component";
import { RRCustomerAttachmentComponent } from "../../common-template/rr-customer-attachment/rr-customer-attachment.component";
import { RrCustomerAttachementEditComponent } from "../../common-template/rr-customer-attachement-edit/rr-customer-attachement-edit.component";
import { EditCustomerRefCustomerportalComponent } from "../../common-template/edit-customer-ref-customerportal/edit-customer-ref-customerportal.component";

@Component({
  selector: "app-customer-rr-edit",
  templateUrl: "./customer-rr-edit.component.html",
  styleUrls: ["./customer-rr-edit.component.scss"],
  providers: [BsModalRef],
})
export class CustomerRrEditComponent implements OnInit {
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
  IsInvoiceApproved;
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
  QuoteInfo: any;
  QuoteItems: any;
  ApprovedQuoteInfo: any;
  ApprovedQuoteItems: any;
  CustomerRefInfo: any;
  RRStatusHistory: any;
  RRShippingHistory: any;
  RRPartsInfo: any;
  RRNotesInfo: any;
  AttachmentList: any = [];
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
  CustomerBillTo = "";
  CustomerShipTo = "";

  ViewSubTotal: any;
  ViewAdditionalCharge: any;
  ViewTotalTax: any;
  ViewDiscount: any;
  ViewShipping: any;
  ViewQuoteGrandTotal: any;
  ViewQuoteRouteCause: any;

  RejectedQuoteItemSubTotal: any;
  RejectedQuoteItemAdditionalCharge: any;
  RejectedQuoteItemTotalTax: any;
  RejectedQuoteItemDiscount: any;
  RejectedQuoteItemShipping: any;
  RejectedQuoteItemGrandTotal: any;
  RejectedQuoteItemQuoteRouteCause: any;
  CustomerPartNo1;
  CustomerPartNo2;
  showVendor;
  SubmittedQuote: any = [];
  SubmittedQuoteItem: any = [];
  RejectedQuoteItem: any = [];
  RRStatusNameStyle;

  //Print variable
  result;
  SalesQuoteInfo;
  QuoteItem: any = [];
  NotesList: any = [];
  RRNotesList: any = [];
  TermsName;
  AHAddressList;
  AHGroupWebsite;
  ShippingAddress;
  BillingAddress;
  CustomerAddress;
  faxCustomerAddress;
  faxBillingAddress;
  faxShippingAddress;
  PhoneCustomerAddress;
  PhoneBillingAddress;
  PhoneShippingAddress;
  IsRushRepair;
  IsWarrantyRecovery;
  QuoteTypeStyle;
  RRnumber;
  QTnumber;
  number;
  QuoteTypeList;
  Quote_notes;
  CustomerBillToId;
  SalesQuotesCustomerRef: any = [];
  IsSOViewCostEnabled: boolean;
  IsSONotesEnabled: boolean;
  settingsView: any;
  TaxPercent: any;
  showActions: boolean = false;
  showPrint: boolean = false;
  BillName;
  ShipName;
  ApprovedQuoteWarranty = 0;

  RRS_COMPLETED = CONST_RRS_COMPLETED; //7
  RRCustomerAttachment: any = [];
  IsDisplayBaseCurrencyValue;
  VAT_field_Name;
  BaseCurrencySymbol;
  constructor(
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    public router: Router,
    private modalService: NgbModal,
    public navCtrl: NgxNavigationWithDataComponent,
    private service: CommonService,
    private datePipe: DatePipe,
    private _FileSaverService: FileSaverService,
    private CommonmodalService: BsModalService,
    public modalRef: BsModalRef,
    private route: ActivatedRoute
  ) {}

  currentRouter = decodeURIComponent(this.router.url);
  ngOnInit() {
    this.IsDisplayBaseCurrencyValue = localStorage.getItem(
      "IsDisplayBaseCurrencyValue"
    );
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol");
    this.VAT_field_Name = VAT_field_Name;
    this.breadCrumbItems = [
      { label: "Repair Requests", path: "#/customer/RR-List" },
      { label: "View", path: "/", active: true },
    ];

    if (history.state.RRId == undefined) {
      this.route.queryParams.subscribe((params) => {
        this.RRId = params["RRId"];
      });
    } else if (history.state.RRId != undefined) {
      this.RRId = history.state.RRId;
    }

    // Redirect to the List page if the View Id is not available
    if (this.RRId == "" || this.RRId == "undefined" || this.RRId == null) {
      this.navCtrl.navigate("/customer/RR-List/");
      return false;
    }

    this.RRStatusNameStyle = "";
    this.QuoteTypeList = Quote_type;
    this.getViewContent();
  }

  getViewContent() {
    var postData = {
      RRId: this.RRId,
    };
    this.service.postHttpService(postData, "CustomerRRView").subscribe(
      (response) => {
        this.viewResult = response.responseData;
        // For QR Code
        this.RRNo = this.viewResult.RRInfo[0].RRNo;
        this.CustomerId = this.viewResult.RRInfo[0].CustomerId;
        this.RRDescription = this.viewResult.RRInfo[0].RRDescription;
        this.StatedIssue = this.viewResult.RRInfo[0].StatedIssue;
        this.CustomerAssetName = this.viewResult.RRInfo[0].CustomerAssetName;
        this.CustomerDepartmentName =
          this.viewResult.RRInfo[0].CustomerDepartmentName;
        this.ContactPhone = this.viewResult.RRInfo[0].ContactPhone;
        this.ContactEmail = this.viewResult.RRInfo[0].ContactEmail;
        this.UserName = this.viewResult.RRInfo[0].UserName;

        var BillTo = this.viewResult.RRInfo[0].BillToSuiteOrApt;
        if (this.viewResult.RRInfo[0].BillToStreetAddress != "")
          BillTo += ", " + this.viewResult.RRInfo[0].BillToStreetAddress;
        if (this.viewResult.RRInfo[0].BillToState != "")
          BillTo += ", " + this.viewResult.RRInfo[0].BillToState;
        if (this.viewResult.RRInfo[0].ShipToState != "")
          BillTo += ", " + this.viewResult.RRInfo[0].ShipToState;
        if (this.viewResult.RRInfo[0].BillToCountry != "")
          BillTo += ", " + this.viewResult.RRInfo[0].BillToCountry;
        if (this.viewResult.RRInfo[0].ShipToZip != "")
          BillTo += ", " + this.viewResult.RRInfo[0].ShipToZip;
        if (this.viewResult.RRInfo[0].BillToPhoneNoPrimary != "")
          BillTo += ", " + this.viewResult.RRInfo[0].BillToPhoneNoPrimary;
        this.CustomerBillTo = BillTo;

        var ShipTo = this.viewResult.RRInfo[0].ShipToSuiteOrApt;
        if (this.viewResult.RRInfo[0].ShipToStreetAddress != "")
          ShipTo += ", " + this.viewResult.RRInfo[0].ShipToStreetAddress;
        if (this.viewResult.RRInfo[0].ShipToCity != "")
          ShipTo += ", " + this.viewResult.RRInfo[0].ShipToCity;
        if (this.viewResult.RRInfo[0].ShipToState != "")
          ShipTo += ", " + this.viewResult.RRInfo[0].ShipToState;
        if (this.viewResult.RRInfo[0].ShipToCountry != "")
          ShipTo += ", " + this.viewResult.RRInfo[0].ShipToCountry;
        if (this.viewResult.RRInfo[0].ShipToZip != "")
          ShipTo += ", " + this.viewResult.RRInfo[0].ShipToZip;
        if (this.viewResult.RRInfo[0].ShipToPhoneNoPrimary != "")
          ShipTo += ", " + this.viewResult.RRInfo[0].ShipToPhoneNoPrimary;
        this.CustomerShipTo = ShipTo;

        this.PriorityNotes = this.viewResult.RRInfo[0].PriorityNotes;
        this.StatusName = this.viewResult.RRInfo[0].StatusName;
        this.ShippingStatus = this.viewResult.RRInfo[0].ShippingStatus;
        this.ShippingIdentityType =
          this.viewResult.RRInfo[0].ShippingIdentityType;
        this.VendorPONo = this.viewResult.RRInfo[0].VendorPONo;
        this.Status = this.viewResult.RRInfo[0].Status;
        this.RRStatusNameStyle = rr_status_customer.find(
          (a) => a.id == this.Status
        );
        this.CustomerPONo = this.viewResult.RRInfo[0].CustomerPONo || "";
        this.CustomerSONo = this.viewResult.RRInfo[0].CustomerSONo || "";
        this.CustomerInvoiceNo =
          this.viewResult.RRInfo[0].CustomerInvoiceNo || "";
        this.VendorInvoiceNo = this.viewResult.RRInfo[0].VendorInvoiceNo || "";

        this.VendorPOId = this.viewResult.RRInfo[0].VendorPOId || "";
        this.CustomerSOId = this.viewResult.RRInfo[0].CustomerSOId || "";
        this.CustomerInvoiceId =
          this.viewResult.RRInfo[0].CustomerInvoiceId || "";
        this.VendorInvoiceId = this.viewResult.RRInfo[0].VendorInvoiceId || "";

        this.CustomerSODueDate = this.viewResult.RRInfo[0].CustomerSODueDate
          ? this.datePipe.transform(
              this.viewResult.RRInfo[0].CustomerSODueDate,
              "MM/dd/yyyy"
            )
          : "";
        this.VendorPODueDate = this.viewResult.RRInfo[0].VendorPODueDate
          ? this.datePipe.transform(
              this.viewResult.RRInfo[0].VendorPODueDate,
              "MM/dd/yyyy"
            )
          : "";
        this.CustomerInvoiceDueDate = this.viewResult.RRInfo[0]
          .CustomerInvoiceDueDate
          ? this.datePipe.transform(
              this.viewResult.RRInfo[0].CustomerInvoiceDueDate,
              "MM/dd/yyyy"
            )
          : "";
        this.VendorInvoiceDueDate = this.viewResult.RRInfo[0]
          .VendorInvoiceDueDate
          ? this.datePipe.transform(
              this.viewResult.RRInfo[0].VendorInvoiceDueDate,
              "MM/dd/yyyy"
            )
          : "";

        this.CustomerShipToId =
          this.viewResult.RRInfo[0].CustomerShipToId || "";
        this.CustomerShipToId =
          this.viewResult.RRInfo[0].CustomerBillToId || "";

        this.VendorsInfo = this.viewResult.VendorsInfo || [];
        this.VendorPartsInfo = this.viewResult.VendorPartsInfo || [];

        this.QuoteInfo = this.viewResult.QuoteInfo || [];
        this.QuoteItems = this.viewResult.QuoteItems || [];

        this.ApprovedQuoteInfo = this.viewResult.ApprovedQuoteInfo || [];
        this.ApprovedQuoteItems = this.viewResult.ApprovedQuoteItems || [];

        this.CustomerRefInfo = this.viewResult.CustomerRefInfo || [];
        this.RRStatusHistory = this.viewResult.RRStatusHistory || [];
        this.RRShippingHistory = this.viewResult.RRShippingHistory || [];
        this.RRPartsInfo = this.viewResult.RRPartsInfo || [];
        this.RRNotesInfo = this.viewResult.RRNotesInfo || [];
        this.AttachmentList = this.viewResult.AttachmentList || [];
        this.VendorFollowup = this.viewResult.FollowUpHistory || [];
        this.WarrantyInfo = this.viewResult.WarrantyInfo || [];
        this.RRCustomerAttachment = this.viewResult.RRCustomerAttachment;

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

        this.PartId = this.viewResult.RRPartsInfo[0].PartId;
        this.PartNo = this.viewResult.RRPartsInfo[0].PartNo;
        this.LeadTime = this.viewResult.RRPartsInfo[0].LeadTime;
        this.RRPartsId = this.viewResult.RRPartsInfo[0].RRPartsId;
        this.Description = this.viewResult.RRPartsInfo[0].Description;
        this.Manufacturer = this.viewResult.RRPartsInfo[0].Manufacturer;
        this.ManufacturerPartNo =
          this.viewResult.RRPartsInfo[0].ManufacturerPartNo;
        this.SerialNo = this.viewResult.RRPartsInfo[0].SerialNo;
        this.Quantity = this.viewResult.RRPartsInfo[0].Quantity;
        this.Price = this.viewResult.RRPartsInfo[0].Price;
        this.Rate = this.viewResult.RRPartsInfo[0].Rate;
        this.SubmittedQuote = this.viewResult.SubmittedQuote;
        this.SubmittedQuoteItem = this.viewResult.SubmittedQuoteItem;
        this.RejectedQuoteItem = this.viewResult.RejectedQuoteItem;

        //this.getPartPrice(this.PartId);

        //RepairMessage show condition
        if (this.viewResult.RRInfo[0].IsRushRepair == 1) {
          this.repairMessage = "Rush Repair";
        }
        if (this.viewResult.RRInfo[0].IsWarrantyRecovery == 1) {
          this.repairMessage = "Warranty Repair";
        }
        if (this.viewResult.RRInfo[0].IsWarrantyRecovery == 2) {
          this.repairMessage = "Warranty New";
        }
        if (this.viewResult.RRInfo[0].IsRepairTag == 1) {
          this.repairMessage = "Repair Tag";
        }
        if (
          this.viewResult.RRInfo[0].IsRushRepair == 1 &&
          this.viewResult.RRInfo[0].IsWarrantyRecovery == 1
        ) {
          this.repairMessage = "Rush Repair, Warranty Repair";
        }

        if (this.viewResult.QuoteInfo.length > 0) {
          // Customer quote is created
          for (var i = 0; i < this.viewResult.QuoteInfo.length; i++) {
            if (this.viewResult.QuoteInfo[i].QuoteCustomerStatus == 2) {
              this.ApprovedQuoteId = this.viewResult.QuoteInfo[i].QuoteId;
              this.ApprovedVendorId = this.viewResult.QuoteInfo[i].VendorId;
              this.ApprovedQuoteStatus =
                this.viewResult.QuoteInfo[i].QuoteCustomerStatus;
              this.ApprovedQuoteWarranty =
                this.viewResult.QuoteInfo[i].WarrantyPeriod;

              continue;
            }
          }

          this.QuoteId = this.viewResult.QuoteInfo[0].QuoteId;
          this.QuoteNo = this.viewResult.QuoteInfo[0].QuoteNo;
          this.QuoteCustomerStatus =
            this.viewResult.QuoteInfo[0].QuoteCustomerStatus;
          this.SubTotal = this.viewResult.QuoteInfo[0].TotalValue;
          this.AdditionalCharge = this.viewResult.QuoteInfo[0].ProcessFee;
          this.TotalTax = this.viewResult.QuoteInfo[0].TotalTax;
          this.Discount = this.viewResult.QuoteInfo[0].Discount;
          this.Shipping = this.viewResult.QuoteInfo[0].ShippingFee;
          this.QuoteGrandTotal = this.viewResult.QuoteInfo[0].GrandTotal;
          this.QuoteRouteCause = this.viewResult.QuoteInfo[0].RouteCause;

          this.QuoteLeadTime = this.viewResult.QuoteInfo[0].LeadTime;
          this.QuoteWarrantyPeriod =
            this.viewResult.QuoteInfo[0].WarrantyPeriod;
          this.QuotePrice = this.viewResult.QuoteInfo[0].Price;

          if (this.viewResult.SubmittedQuote.length > 0) {
            this.ViewSubTotal = this.viewResult.SubmittedQuote[0].TotalValue;
            this.ViewAdditionalCharge =
              this.viewResult.SubmittedQuote[0].ProcessFee;
            this.ViewTotalTax = this.viewResult.SubmittedQuote[0].TotalTax;
            this.ViewDiscount = this.viewResult.SubmittedQuote[0].Discount;
            this.ViewShipping = this.viewResult.SubmittedQuote[0].ShippingFee;
            this.ViewQuoteGrandTotal =
              this.viewResult.SubmittedQuote[0].GrandTotal;
            this.ViewQuoteRouteCause =
              this.viewResult.SubmittedQuote[0].RouteCause;
          }

          if (this.viewResult.RejectedQuote.length > 0) {
            this.RejectedQuoteItemSubTotal =
              this.viewResult.RejectedQuote[0].TotalValue;
            this.RejectedQuoteItemAdditionalCharge =
              this.viewResult.RejectedQuote[0].ProcessFee;
            this.RejectedQuoteItemTotalTax =
              this.viewResult.RejectedQuote[0].TotalTax;
            this.RejectedQuoteItemDiscount =
              this.viewResult.RejectedQuote[0].Discount;
            this.RejectedQuoteItemShipping =
              this.viewResult.RejectedQuote[0].ShippingFee;
            this.RejectedQuoteItemGrandTotal =
              this.viewResult.RejectedQuote[0].GrandTotal;
            this.RejectedQuoteItemQuoteRouteCause =
              this.viewResult.RejectedQuote[0].RouteCause;
          }
          this.IsInvoiceApproved =
            this.viewResult.RRInfo[0].IsInvoiceApproved || 0;
          this.CustomerInvoiceDueDate = this.viewResult.RRInfo[0]
            .CustomerInvoiceDueDate
            ? this.datePipe.transform(
                this.viewResult.RRInfo[0].CustomerInvoiceDueDate,
                "MM/dd/yyyy"
              )
            : "";

          this.loadTemplate(this.QuoteId, false);
          this.getAHGroupaddress();
          this.getAdminSettingsView();
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }
  getPartPrice(PartId: (PartId: any) => void) {
    throw new Error("Method not implemented.");
  }
  PartId(PartId: any) {
    throw new Error("Method not implemented.");
  }

  // //Approve Quote
  // ApproveQuote(QuoteId) {
  //   console.log(this.CustomerPONo)
  //   if (this.CustomerPONo == '' || this.CustomerPONo == null) {
  //     Swal.fire({
  //       title: 'Alert',
  //       text: 'Please enter the Customer PO #!',
  //       type: 'warning'
  //     });
  //     //this.CustomerPONoElement.nativeElement.focus();
  //     return false;
  //   } else {
  //     Swal.fire({
  //       title: 'Are you sure?',
  //       text: 'You won\'t be able to revert this!',
  //       type: 'warning',
  //       showCancelButton: true,
  //       confirmButtonText: 'Yes, approve it!',
  //       cancelButtonText: 'No, cancel!',
  //       confirmButtonClass: 'btn btn-success mt-2',
  //       cancelButtonClass: 'btn btn-danger ml-2 mt-2',
  //       buttonsStyling: false
  //     }).then((result) => {
  //       if (result.value) {
  //         var postData = {
  //           RRId: this.RRId,
  //           QuoteId: QuoteId,
  //           CustomerPONo: this.CustomerPONo
  //         }
  //         this.service.postHttpService(postData, 'CustomerQuoteApprove').subscribe(response => {
  //           if (response.status == true) {
  //             Swal.fire({
  //               title: 'Approved!',
  //               text: 'Quote has been approved.',
  //               type: 'success'
  //             });
  //             this.reLoad();
  //           }
  //         });
  //       } else if (
  //         result.dismiss === Swal.DismissReason.cancel
  //       ) {
  //         Swal.fire({
  //           title: 'Cancelled',
  //           text: 'Quote has not approved.',
  //           type: 'error'
  //         });
  //       }
  //     });
  //   }
  // }

  //Approve Quote
  ApproveQuote(QuoteId, GrandTotal) {
    var RRId = this.RRId;
    var CustomerId = this.CustomerId;
    this.modalRef = this.CommonmodalService.show(
      BlanketPoCustomerPortalComponent,
      {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: { RRId, QuoteId, CustomerId, GrandTotal },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      }
    );

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }
  //Reject Customer Quote
  RejectCustomerQuote(QuoteId, RRVendorId) {
    var RRId = this.RRId;
    this.modalRef = this.CommonmodalService.show(RejectquoteComponent, {
      initialState: {
        data: { RRId, QuoteId, RRVendorId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  // reLoad() {
  //   this.router.navigate([this.currentRouter])
  // }
  reLoad() {
    this.router.navigate([this.currentRouter.split("?")[0]], {
      queryParams: { RRId: this.RRId },
    });
  }
  onInvoiceView() {
    this.router.navigate(["customer/invoice-view"], {
      state: {
        InvoiceId: this.viewResult.RRInfo[0].CustomerInvoiceId,
        IsDeleted: this.viewResult.RRInfo[0].IsDeleted,
      },
    });
  }
  onviewQuote(viewQuote: any) {
    this.modalService.open(viewQuote, { size: "lg" });
  }

  hideAddress: boolean = true;
  generatePDF() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Sales Quote ${this.RRNo}.pdf`);
    });
  }
  getPdfBase64(cb) {
    this.service.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        SalesQuoteInfo: this.SalesQuoteInfo,
        AHAddressList: this.AHAddressList,
        RRnumber: this.RRnumber,
        QTnumber: this.QTnumber,
        BillName: this.BillName,
        BillingAddress: this.BillingAddress,
        ShipName: this.ShipName,
        ShippingAddress: this.ShippingAddress,
        SalesQuotesCustomerRef: this.SalesQuotesCustomerRef,
        QuoteItem: this.QuoteItem,
        IsSONotesEnabled: this.IsSONotesEnabled,
        settingsView: this.settingsView,
        NotesList: this.NotesList,
        RRNotesList: this.RRNotesList,
        AHGroupWebsite: this.AHGroupWebsite,
        RRId: this.RRId,
        Logo: base64,
      };

      this.service
        .postHttpService({ pdfObj }, "getSQPdfBase64")
        .subscribe((response) => {
          if (response.status == true) {
            cb(response.responseData.pdfBase64);
          }
        });
    });
  }

  getAHGroupaddress() {
    var postData = {
      IdentityId: CONST_AH_Group_ID,
      IdentityType: 2,
      Type: CONST_ContactAddressType,
    };
    this.service
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.AHAddressList = response.responseData[0];
      });
  }

  getAdminSettingsView() {
    var postData = {};
    this.service.postHttpService(postData, "getSettingsGeneralView").subscribe(
      (response) => {
        if (response.status == true) {
          this.settingsView = response.responseData;
          this.TaxPercent = this.settingsView.TaxPercent;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  loadTemplate(QuoteId, IsDeleted) {
    this.TermsName = "";
    var postData = {
      QuoteId: QuoteId,
      IsDeleted: IsDeleted,
    };

    this.service.postHttpService(postData, "getSalesQuotesView").subscribe(
      (response) => {
        if (response.status == true) {
          this.result = response.responseData;
          this.SalesQuoteInfo = this.result.BasicInfo[0];
          this.QuoteItem = this.result.QuoteItem;
          this.TermsName = this.SalesQuoteInfo.Terms;
          this.AttachmentList = this.result.AttachmentList;
          this.BillingAddress = this.result.BillingAddress[0] || "";
          this.ShippingAddress = this.result.ShippingAddress[0] || "";
          this.CustomerAddress = this.result.ContactAddress[0] || "";
          this.NotesList = this.result.NotesList;
          this.RRNotesList = this.result.RRNotesList;
          this.RRId = this.SalesQuoteInfo.RRId;
          this.faxCustomerAddress = this.CustomerAddress.Fax;
          this.faxShippingAddress = this.ShippingAddress.Fax;
          this.faxBillingAddress = this.BillingAddress.Fax;
          this.IsRushRepair = this.SalesQuoteInfo.IsRushRepair;
          this.IsWarrantyRecovery = this.SalesQuoteInfo.IsWarrantyRecovery;

          this.QuoteTypeStyle = this.QuoteTypeList.find(
            (a) => a.Quote_TypeId == this.SalesQuoteInfo.QuoteType
          );

          if (this.SalesQuoteInfo.RRId != 0) {
            this.RRnumber = this.SalesQuoteInfo.RRNo;
            this.number = this.SalesQuoteInfo.RRNo;
          } else {
            this.QTnumber = this.SalesQuoteInfo.QuoteNo;
            this.number = this.SalesQuoteInfo.QuoteNo;
          }
          if (this.IsRushRepair == 1) {
            this.repairMessage = "Rush Repair";
          }
          if (this.IsWarrantyRecovery == 1) {
            this.repairMessage = "Warranty Repair";
          }
          if (this.IsWarrantyRecovery == 2) {
            this.repairMessage = "Warranty New";
          }
          if (this.IsRushRepair == 1 && this.IsWarrantyRecovery == 1) {
            this.repairMessage = "Rush Repair, Warranty Repair";
          }

          this.PhoneCustomerAddress = this.CustomerAddress.Phone;
          this.PhoneShippingAddress = this.ShippingAddress.Phone;
          this.PhoneBillingAddress = this.BillingAddress.Phone;
          this.Quote_notes = Quote_notes;
          this.CustomerBillToId = this.SalesQuoteInfo.CustomerBillToId;
          this.CustomerShipToId = this.SalesQuoteInfo.CustomerShipToId;
          this.SalesQuotesCustomerRef = this.result.CustomerReference || [];

          if (!this.IsSOViewCostEnabled) {
            this.SalesQuoteInfo.TotalValue = CONST_COST_HIDE_VALUE;
            this.SalesQuoteInfo.ProcessFee = CONST_COST_HIDE_VALUE;
            this.SalesQuoteInfo.TotalTax = CONST_COST_HIDE_VALUE;
            this.SalesQuoteInfo.Discount = CONST_COST_HIDE_VALUE;
            this.SalesQuoteInfo.ShippingFee = CONST_COST_HIDE_VALUE;
            this.SalesQuoteInfo.GrandTotal = CONST_COST_HIDE_VALUE;
          }
          if (this.BillingAddress.IdentityId == this.SalesQuoteInfo.VendorId) {
            this.BillName = this.SalesQuoteInfo.VendorName;
          } else if (this.BillingAddress.IdentityType == "Customer") {
            this.BillName = this.SalesQuoteInfo.CompanyName;
          } else if (this.BillingAddress.IdentityId == CONST_AH_Group_ID) {
            this.BillName = "Aibond";
          }

          if (this.ShippingAddress.IdentityId == this.SalesQuoteInfo.VendorId) {
            this.ShipName = this.SalesQuoteInfo.VendorName;
          } else if (this.ShippingAddress.IdentityType == "Customer") {
            this.ShipName = this.SalesQuoteInfo.CompanyName;
          } else if (this.ShippingAddress.IdentityId == CONST_AH_Group_ID) {
            this.ShipName = "Aibond";
          }
          this.getPON();
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  getPON() {
    for (let x in this.QuoteItem) {
      if (!this.IsSOViewCostEnabled) {
        this.QuoteItem[x].Rate = CONST_COST_HIDE_VALUE;
        this.QuoteItem[x].Price = CONST_COST_HIDE_VALUE;
      }

      this.PartId = this.QuoteItem[x].PartId;
      var postData1 = {
        PartId: this.PartId,
        CustomerId: this.SalesQuoteInfo.IdentityId,
      };
      this.service
        .postHttpService(postData1, "getPON&LPP")
        .subscribe((response) => {
          if (response.status == true) {
            this.QuoteItem[x].PON = response.responseData.PartInfo.PON || "";
            this.QuoteItem[x].LPPList = response.responseData.LPPInfo || [];
            if (response.responseData.RecommendedPrice) {
              this.QuoteItem[x].RecommendedPrice =
                response.responseData.RecommendedPrice.RecommendedPrice || "";
            }
          } else {
            this.QuoteItem[x].PON = "";
            this.QuoteItem[x].LPPList = [];
            this.QuoteItem[x].RecommendedPrice = "";
          }
        });
    }
  }

  //RRShipping History
  shippingHistory() {
    var RRShippingHistory = this.RRShippingHistory;
    var PartId = this.PartId;
    var RRId = this.RRId;
    var CustomerId = this.CustomerId;
    this.modalRef = this.CommonmodalService.show(
      ShippingHistoryCustomerPortalComponent,
      {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: { RRShippingHistory, RRId, PartId, CustomerId },
          class: "modal-xl",
        },
        class: "gray modal-xl",
      }
    );

    this.modalRef.content.closeBtnName = "Close";
  }

  //WarrantySection
  addWarranty() {
    var RRId = this.RRId;
    var warrantyPeriod = 0;
    if (this.ApprovedQuoteWarranty) warrantyPeriod = this.ApprovedQuoteWarranty;
    //var src = 'AHOms';
    this.modalRef = this.CommonmodalService.show(CustomerAddWarrantyComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { RRId, warrantyPeriod },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  viewQrCode() {
    //var RRId= this.viewResult.RRId
    var RRId = this.RRId;
    var RepairRequestNo = this.RRNo;
    var PartNo = this.viewResult.RRInfo[0].PartNo;
    var SerialNo = this.viewResult.RRInfo[0].SerialNo;
    var CompanyName = this.viewResult.RRInfo[0].CompanyName;
    var CustomerRefList = this.viewResult.CustomerRefInfo.filter(
      (a) => a.IsDisplayOnQRCode == 1
    );
    var IsDisplayPOInQR = this.viewResult.RRInfo[0].IsDisplayPOInQR;
    var CustomerPONo = this.viewResult.RRInfo[0].CustomerPONo;
    this.modalRef = this.CommonmodalService.show(
      CustomerPortalQrCodeComponent,
      {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: {
            RRId,
            RepairRequestNo,
            SerialNo,
            PartNo,
            CustomerRefList,
            CompanyName,
            IsDisplayPOInQR,
            CustomerPONo,
          },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      }
    );

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {});
  }

  //AttachementSection
  addAttachment() {
    var CustomerId = this.CustomerId;
    var RRId = this.RRId;
    this.modalRef = this.CommonmodalService.show(
      RRCustomerAttachmentComponent,
      {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: { RRId, CustomerId },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      }
    );

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.RRCustomerAttachment.push(res.data);
    });
  }

  editAttachment(attachment, i) {
    var CustomerId = this.CustomerId;
    var RRId = this.RRId;
    this.modalRef = this.CommonmodalService.show(
      RrCustomerAttachementEditComponent,
      {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: { attachment, i, RRId, CustomerId },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      }
    );

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.RRCustomerAttachment[i] = res.data;
    });
  }

  deleteAttachment(RRCustomerAttachmentId, i) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          RRCustomerAttachmentId: RRCustomerAttachmentId,
        };
        this.service
          .postHttpService(postData, "RRDeleteCustomerAttachment")
          .subscribe((response) => {
            if (response.status == true) {
              this.RRCustomerAttachment.splice(i, 1);
              Swal.fire({
                title: "Deleted!",
                text: "Attachment has been deleted.",
                type: "success",
              });
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Attachment is safe:)",
          type: "error",
        });
      }
    });
  }

  deleteReference(RRReferenceId, i) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          RRReferenceId: RRReferenceId,
        };
        this.service
          .postHttpService(postData, "CRDelete")
          .subscribe((response) => {
            if (response.status == true) {
              this.CustomerRefInfo.splice(i, 1);
              Swal.fire({
                title: "Deleted!",
                text: "Reference has been deleted.",
                type: "success",
              });
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Reference is safe:)",
          type: "error",
        });
      }
    });
  }
  editReference(ref, i) {
    this.modalRef = this.CommonmodalService.show(
      EditCustomerRefCustomerportalComponent,
      {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: { ref, i },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      }
    );

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.CustomerRefInfo[i] = res.data;
      this.reLoad();
    });
  }
}
