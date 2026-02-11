/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";
import { environment } from "src/environments/environment";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "src/app/core/services/common.service";
import {
  PurchaseOrder_Status,
  PurchaseOrder_Type,
  warranty_list,
  terms,
  PurchaseOrder_notes,
  CONST_IDENTITY_TYPE_PO,
  attachment_thumb_images,
  CONST_AH_Group_ID,
  CONST_ShipAddressType,
  VAT_field_Name,
} from "src/assets/data/dropdown";
import Swal from "sweetalert2";
import * as moment from "moment";
import { AddRrPartsComponent } from "src/app/pages/admin-modules/common-template/add-rr-parts/add-rr-parts.component";
import { EmailComponent } from "src/app/pages/admin-modules/common-template/email/email.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import jspdf from "jspdf";
import html2canvas from "html2canvas";
import { FileSaverService } from "ngx-filesaver";
@Component({
  selector: "app-purchase-order-list",
  templateUrl: "./purchase-order-list.component.html",
  styleUrls: ["./purchase-order-list.component.scss"],
  providers: [NgxSpinnerService, DatePipe, BsModalRef],
})
export class PurchaseOrderListComponent implements OnInit {
  Currentdate = new Date();
  ResponseMessage;
  @Input() templateSettings: TemplateRef<HTMLElement>;
  @ViewChild("viewTemplate", null) viewTemplate: TemplateRef<HTMLElement>;
  @ViewChild("editTemplate", null) editTemplate: TemplateRef<HTMLElement>;
  @ViewChild("addTemplate", null) addTemplate: TemplateRef<HTMLElement>;

  dataTableMessage;
  tableData: any = [];
  number;
  baseUrl = `${environment.api.apiURL}`;
  POId;
  result;
  PurchaseOrderInfo;
  BillingAddress;
  ShippingAddress;
  PurchaseOrderCustomerRef: any = [];
  REMIT_Address: any;
  PurchaseOrderItem: any = [];
  NotesList: any = [];
  RRNotesList: any = [];
  ContactAddress;
  faxContactAddress;
  faxBillingAddress;
  faxShippingAddress;
  PhoneContactAddress;
  PhoneBillingAddress;
  PhoneShippingAddress;
  Status;
  status;
  vendorList;
  //ServerSide List
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  api_check: any;
  dataTable: any;
  RRId;
  //FILTER
  Created;
  VendorId;
  PONo;
  PuchaseOrderStatus;
  DateRequested;
  POType;
  RRNo;
  RequestedId;
  Duedate;
  DueDateTo;
  Requesteddate;
  RequestedDateTo;
  UserId;
  RequesteddateDate;
  RequestedDateToDate;
  DuedateDate;
  DueDateToDate;
  IsEmailSent;
  //itemdetails
  LeadTime;
  Rate;
  WarrantyPeriod;
  SubTotal;
  GrandTotal;
  AdditionalCharge;
  TotalTax;
  Discount;
  AHFees;
  Shipping;
  PurchaseOrderType;
  showSearch: boolean = true;
  PurchaseOrder_notes;
  //ADD
  model: any = [];
  partList: any = [];
  customerPartList: any = [];
  partNewList: any = [];
  AddressList;
  VendorAddressList;
  TermsList;
  warrantyList;
  adminList;
  PartItem: any = [];
  IsRushRepair;
  IsWarrantyRecovery;
  repairMessage;
  @Input() dateFilterField;
  POList: any = [];
  AttachmentList: any = [];
  attachmentThumb;
  @ViewChild("dataTable", { static: true }) table;
  ListHidden: boolean = false;
  MROId;
  ShipName;
  RRnumber;
  POnumber;
  VendorAddress;
  POTypeStyle;
  BillName;

  IsDisplayBaseCurrencyValue;
  VAT_field_Name;
  BaseCurrencySymbol;
  constructor(
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private cd_ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    public modalRef: BsModalRef,
    private _FileSaverService: FileSaverService
  ) {}
  currentRouter = this.router.url;

  ngOnInit(): void {
    this.IsDisplayBaseCurrencyValue = localStorage.getItem(
      "IsDisplayBaseCurrencyValue"
    );
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol");
    this.VAT_field_Name = VAT_field_Name;
    if (history.state.POId == undefined) {
      this.route.queryParams.subscribe((params) => {
        this.POId = params["POId"];
      });
    } else if (history.state.POId != undefined) {
      this.POId = history.state.POId;
    }
    this.NotesList = [];
    this.RRNotesList = [];
    this.PurchaseOrderInfo = "";
    this.PurchaseOrderItem = [];
    this.BillingAddress = "";
    this.ShippingAddress = "";
    this.ContactAddress = "";
    this.POTypeStyle = "";
    this.VendorAddress = "";
    this.PurchaseOrderCustomerRef = [];
    this.attachmentThumb = attachment_thumb_images;
    this.loadTemplate(this.POId);
  }

  getVendoraddress() {
    var postData = {
      IdentityId: this.PurchaseOrderInfo.VendorId,
      IdentityType: 2,
      Type: CONST_ShipAddressType,
    };
    this.commonService
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.VendorAddress = response.responseData[0];
      });
  }
  loadTemplate(POId) {
    this.PartItem = [];
    var postData = {
      POId: POId,
    };
    this.commonService.postHttpService(postData, "POView").subscribe(
      (response) => {
        if (response.status == true) {
          this.result = response.responseData;
          this.AttachmentList = this.result.AttachmentList || [];
          this.PurchaseOrderInfo = this.result.POInfo;
          this.PurchaseOrderItem = this.result.POItem;
          this.NotesList = this.result.NotesList;
          this.RRNotesList = this.result.RRNotesList;
          this.BillingAddress = this.result.BillingAddress[0] || "";
          this.ShippingAddress = this.result.ShippingAddress[0] || "";
          this.ContactAddress = this.result.ContactAddress[0] || "";
          this.PurchaseOrderCustomerRef = this.result.CustomerRef;
          this.RRId = this.PurchaseOrderInfo.RRId;
          this.MROId = this.PurchaseOrderInfo.MROId;
          this.REMIT_Address = this.result.RemitAddress[0];
          this.faxContactAddress = this.ContactAddress.Fax;
          this.faxShippingAddress = this.ShippingAddress.Fax;
          this.faxBillingAddress = this.BillingAddress.Fax;
          this.IsRushRepair = this.PurchaseOrderInfo.IsRushRepair;
          this.IsWarrantyRecovery = this.PurchaseOrderInfo.IsWarrantyRecovery;
          this.getVendoraddress();
          if (this.PurchaseOrderInfo.RRId != 0) {
            this.number = this.PurchaseOrderInfo.RRNo;
            this.RRnumber = this.PurchaseOrderInfo.RRNo;
          } else {
            this.number = this.PurchaseOrderInfo.PONo;
            this.POnumber = this.PurchaseOrderInfo.PONo;
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
          this.PhoneContactAddress = this.ContactAddress.PhoneNoPrimary;
          this.PhoneShippingAddress = this.ShippingAddress.PhoneNoPrimary;
          this.PhoneBillingAddress = this.BillingAddress.PhoneNoPrimary;
          this.Status = this.PurchaseOrderInfo.Status;
          this.PurchaseOrder_notes = PurchaseOrder_notes;
          this.POTypeStyle = PurchaseOrder_Type.find(
            (a) => a.PurchaseOrder_TypeId == this.PurchaseOrderInfo.POType
          );

          if (
            this.BillingAddress.IdentityId == this.PurchaseOrderInfo.VendorId
          ) {
            this.BillName = this.PurchaseOrderInfo.VendorName;
          } else if (
            this.BillingAddress.IdentityId == this.PurchaseOrderInfo.CustomerId
          ) {
            this.BillName = this.PurchaseOrderInfo.CompanyName;
          } else if (this.BillingAddress.IdentityId == CONST_AH_Group_ID) {
            this.BillName = "Aibond";
          }

          if (
            this.ShippingAddress.IdentityId == this.PurchaseOrderInfo.VendorId
          ) {
            this.ShipName = this.PurchaseOrderInfo.VendorName;
          } else if (
            this.ShippingAddress.IdentityId == this.PurchaseOrderInfo.CustomerId
          ) {
            this.ShipName = this.PurchaseOrderInfo.CompanyName;
          } else if (this.ShippingAddress.IdentityId == CONST_AH_Group_ID) {
            this.ShipName = "Aibond";
          }
          // console.log("result", this.result)
        } else {
        }
        this.cd_ref.detectChanges();
        this.spinner.hide();

        // if (this.initialState) {
        //   this.onPrint.next(true);
        // }
      },
      (error) => console.log(error)
    );
  }
  getPdfBase64(cb) {
    this.spinner.show();
    this.commonService.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        PurchaseOrderInfo: this.PurchaseOrderInfo,
        RemitToAddress: this.REMIT_Address,
        VendorAddress: this.VendorAddress,
        BillName: this.BillName,
        BillingAddress: this.BillingAddress,
        ShipName: this.ShipName,
        ShippingAddress: this.ShippingAddress,
        ContactAddress: this.ContactAddress,
        PurchaseOrderItem: this.PurchaseOrderItem,
        settingsView: "",
        NotesList: this.NotesList,
        RRNotesList: this.RRNotesList,
        Status: this.Status,
        Logo: base64,
      };

      this.commonService
        .postHttpService({ pdfObj }, "getPOPdfBase64")
        .subscribe((response) => {
          if (response.status == true) {
            cb(response.responseData.pdfBase64);
            this.spinner.hide();
          }
        });
    });
  }
  onprint() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.commonService.base64ToBlob(pdfBase64, "application/pdf");
      const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    });
  }
  hideAddress: boolean = true;
  pdf() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.commonService.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Purchase Order ${this.number}.pdf`);
    });
  }
}
