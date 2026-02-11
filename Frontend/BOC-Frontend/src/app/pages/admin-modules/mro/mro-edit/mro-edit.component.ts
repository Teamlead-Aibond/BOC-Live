import { DatePipe } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import html2canvas from "html2canvas";
import { borderTopRightRadius } from "html2canvas/dist/types/css/property-descriptors/border-radius";
import jspdf from "jspdf";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { CommonService } from "src/app/core/services/common.service";
import {
  CONST_VIEW_ACCESS,
  CONST_CREATE_ACCESS,
  CONST_MODIFY_ACCESS,
  CONST_DELETE_ACCESS,
  CONST_APPROVE_ACCESS,
  CONST_VIEW_COST_ACCESS,
  CONST_ACCESS_LIMIT,
  CONST_VENDOR_STATUS_ASSIGNED,
  CONST_VENDOR_STATUS_QREQUESTED,
  CONST_VENDOR_STATUS_APPROVED,
  CONST_VENDOR_STATUS_REJECTED,
  CONST_VENDOR_STATUS_NOT_REPAIRABLE,
  CONST_CUSTOMER_QUOTE_DRAFT,
  CONST_CUSTOMER_QUOTE_SUBMITTED,
  CONST_CUSTOMER_QUOTE_ACCEPTED,
  CONST_CUSTOMER_QUOTE_REJECTED,
  CONST_CUSTOMER_QUOTE_VENDOR_REJECTED,
  array_rr_status,
  attachment_thumb_images,
  CONST_AH_Group_ID,
  Const_Alert_pop_title,
  Const_Alert_pop_message,
  CONST_IDENTITY_TYPE_CUSTOMER,
  CONST_IDENTITY_TYPE_RR,
  CONST_IDENTITY_TYPE_VENDOR,
  CONST_IDENTITY_TYPE_QUOTE,
  CONST_IDENTITY_TYPE_INVOICE,
  CONST_IDENTITY_TYPE_SO,
  CONST_IDENTITY_TYPE_PO,
  array_MRO_status,
  CONST_BillAddressType,
  CONST_ShipAddressType,
  CONST_IDENTITY_TYPE_MRO,
  CONST_MRO_GENERATED,
  CONST_MRO_NEED_SOURCED,
  CONST_MRO_AWAIT_VQUOTE,
  CONST_MRO_QUOTE_SUBMITTED,
  CONST_MRO_IN_PROGRESS,
  CONST_MRO_QUOTE_REJECTED,
  CONST_MRO_COMPLETED,
  CONST_MRO_NEED_RESOURCED,
  CONST_MRO_NOT_REPAIRABLE,
} from "src/assets/data/dropdown";
import Swal from "sweetalert2";
import { AddNotesComponent } from "../../common-template/add-notes/add-notes.component";
import { AddReferenceComponent } from "../../common-template/add-reference/add-reference.component";
import { AddRrPartsComponent } from "../../common-template/add-rr-parts/add-rr-parts.component";
import { CustomerReferenceComponent } from "../../common-template/customer-reference/customer-reference.component";
import { EditNotesComponent } from "../../common-template/edit-notes/edit-notes.component";
import { InvoicePrintComponent } from "../../common-template/invoice-print/invoice-print.component";
import { MroCustomerQuoteComponent } from "../../common-template/mro-customer-quote/mro-customer-quote.component";
import { MroEmailComponent } from "../../common-template/mro-email/mro-email.component";
import { MroFollowupComponent } from "../../common-template/mro-followup/mro-followup.component";
import { MroQrCodeComponent } from "../../common-template/mro-qr-code/mro-qr-code.component";
import { MroReceiveComponent } from "../../common-template/mro-receive/mro-receive.component";
import { MroShipComponent } from "../../common-template/mro-ship/mro-ship.component";
import { MroUpdateCurrentLocationComponent } from "../../common-template/mro-update-current-location/mro-update-current-location.component";
import { MroVendorInvoiceComponent } from "../../common-template/mro-vendor-invoice/mro-vendor-invoice.component";
import { MroVendorQuoteComponent } from "../../common-template/mro-vendor-quote/mro-vendor-quote.component";
import { PartCurrentLocationHistoryComponent } from "../../common-template/part-current-location-history/part-current-location-history.component";
import { PurchaseOrderViewComponent } from "../../common-template/purchase-order-view/purchase-order-view.component";
import { RejectAndResourceComponent } from "../../common-template/reject-and-resource/reject-and-resource.component";
import { RejectCustomerQuoteComponent } from "../../common-template/reject-customer-quote/reject-customer-quote.component";
import { RRAddAttachmentComponent } from "../../common-template/rr-add-attachment/rr-add-attachment.component";
import { RrCurrentHistoryComponent } from "../../common-template/rr-current-history/rr-current-history.component";
import { RrEditAttachmentComponent } from "../../common-template/rr-edit-attachment/rr-edit-attachment.component";
import { RrNotRepairableComponent } from "../../common-template/rr-not-repairable/rr-not-repairable.component";
import { RrShippingHistoryComponent } from "../../common-template/rr-shipping-history/rr-shipping-history.component";
import { SalesOrderPrintComponent } from "../../common-template/sales-order-print/sales-order-print.component";
import { SalesQuotePrintComponent } from "../../common-template/sales-quote-print/sales-quote-print.component";
import { ShipComponent } from "../../common-template/ship/ship.component";
import { UpsIntegrationComponent } from "../../common-template/ups-integration/ups-integration.component";
import { ViewFollowupComponent } from "../../common-template/view-followup/view-followup.component";

@Component({
  selector: "app-mro-edit",
  templateUrl: "./mro-edit.component.html",
  styleUrls: ["./mro-edit.component.scss"],
  providers: [BsModalService],
})
export class MroEditComponent implements OnInit {
  array_MRO_status;
  MROId;
  MROInfo;
  Quote;
  MRONo;

  vendor_reject_reasons;
  customer_quote_reject_reasons;
  ReceiveName;
  ShipToIdentityName;
  ShipFromIdentityName;
  AddressData;
  shippingDetails;
  // Access Rights
  accessRights: any = [];
  RR: any = [];
  RRVerify: any = [];
  RRAssignVendor: any = [];
  RRVendorQuote: any = [];
  RRCustomerQuote: any = [];
  RRShipParts: any = [];
  RRReceiveParts: any = [];
  RRTrackUPS: any = [];
  RRWarranty: any = [];
  RRDuplicate: any = [];
  InSalesOrder: any = [];
  RRPurchaseOrder: any = [];
  RRSalesInvoice: any = [];
  RRVendorBill: any = [];
  RRComplete: any = [];
  RRCustomerFollowup: any = [];
  RRVendorFollowup: any = [];
  RRNotes: any = [];
  RRAtachment: any = [];
  CustomerList: any = [];
  RRSalesOrder: any = [];
  CustomerReference: any = [];

  // Get the values for Access Rights
  VIEW_ACCESS = CONST_VIEW_ACCESS;
  CREATE_ACCESS = CONST_CREATE_ACCESS;
  MODIFY_ACCESS = CONST_MODIFY_ACCESS;
  DELETE_ACCESS = CONST_DELETE_ACCESS;
  APPROVE_ACCESS = CONST_APPROVE_ACCESS;
  VIEW_COST_ACCESS = CONST_VIEW_COST_ACCESS;
  ACCESS_LIMIT = CONST_ACCESS_LIMIT;

  // MRO Status
  MRO_GENERATED = CONST_MRO_GENERATED; //0
  MRO_NEED_SOURCED = CONST_MRO_NEED_SOURCED; //1
  MRO_AWAIT_VQUOTE = CONST_MRO_AWAIT_VQUOTE; //2
  MRO_NEED_RESOURCED = CONST_MRO_NEED_RESOURCED; //3
  MRO_QUOTE_SUBMITTED = CONST_MRO_QUOTE_SUBMITTED; //4
  MRO_IN_PROGRESS = CONST_MRO_IN_PROGRESS; //5
  MRO_QUOTE_REJECTED = CONST_MRO_QUOTE_REJECTED; //6
  MRO_COMPLETED = CONST_MRO_COMPLETED; //7
  MRO_NOT_REPAIRABLE = CONST_MRO_NOT_REPAIRABLE;

  //Vendor Status
  VENDOR_STATUS_ASSIGNED = CONST_VENDOR_STATUS_ASSIGNED;
  VENDOR_STATUS_QREQUESTED = CONST_VENDOR_STATUS_QREQUESTED;
  VENDOR_STATUS_APPROVED = CONST_VENDOR_STATUS_APPROVED;
  VENDOR_STATUS_REJECTED = CONST_VENDOR_STATUS_REJECTED;
  VENDOR_STATUS_NOT_REPAIRABLE = CONST_VENDOR_STATUS_NOT_REPAIRABLE;

  //Quote Status
  CUSTOMER_QUOTE_DRAFT = CONST_CUSTOMER_QUOTE_DRAFT;
  CUSTOMER_QUOTE_SUBMITTED = CONST_CUSTOMER_QUOTE_SUBMITTED;
  CUSTOMER_QUOTE_ACCEPTED = CONST_CUSTOMER_QUOTE_ACCEPTED;
  CUSTOMER_QUOTE_REJECTED = CONST_CUSTOMER_QUOTE_REJECTED;
  CUSTOMER_QUOTE_VENDOR_REJECTED = CONST_CUSTOMER_QUOTE_VENDOR_REJECTED;

  CustomerId;
  UserId;
  ContactPhone;
  ContactEmail;
  RRPartsId;
  PON;
  LPP;
  viewResult: any = [];
  ApprovedQuoteItems: any = [];
  VendorsInfo: any = [];
  QuoteInfo: any = [];
  QuoteItems: any = [];
  SubTotal;
  AdditionalCharge;
  TotalTax;
  Discount;
  Shipping;
  CustomerPONo;
  CustomerSONo;
  VendorPONo;
  CustomerInvoiceNo;
  VendorInvoiceNo;
  CustomerSODueDate;
  VendorPODueDate;
  CustomerInvoiceDueDate;
  VendorInvoiceDueDate;
  RRDescription;
  LeadTime;

  /* show1: boolean = true;
  show2: boolean = true;
  show3: boolean = true; */

  RRId;
  [x: string]: any;
  addMissingPart: boolean = false;
  selectValue: string[];
  // bread crumb items
  breadCrumbItems: Array<{}>;
  EditForm: FormGroup;
  submitted = false;

  customerList: any = [];
  departmentList;
  assetList;
  customerReferenceList: any = [];
  partList;
  adminList;
  admin;
  PriorityNotes = "";

  repairMessage;

  RRNo;
  Status;
  StatusName;
  RRInfo: any = [];
  RRParts: any = [];
  notesArr: any = [];
  RRImagesList: any = [];
  RRImages: any = [];
  RRTracking: any = [];
  trackingNumber = "";
  currentImage: FormControl;

  data = [];
  RRImage;
  url: any = [];

  public event: EventEmitter<any> = new EventEmitter();
  //ContactPhone: any;
  //ContactEmail: any;

  ManufacturerPartNo: any;
  Manufacturer: any;
  Description: any;
  SerialNo: any;
  Quantity: any;
  PartNo: any;
  Price: any;
  Rate: any;
  rrStatusList;
  CustomerRefInfo: any = [];
  WarrantyInfo: any = [];
  //public RRQrCode: string = null;
  model: any = {};
  PartId;
  addButton = false;
  selectedVendor = false;
  showVendor = false;
  selectVendor;
  VendorId;
  VendorName;
  VendorCode;
  VendorSize;
  QuoteGrandTotal;
  VendorGrandTotal;
  VendorStatus;
  QuoteId;
  QuoteNo;
  QuoteCustomerStatus;
  ApprovedQuoteId = 0;
  ApprovedVendorId;
  ApprovedRRVendorId;
  ApprovedQuoteStatus = 0;
  ApprovedQuoteWarranty = 0;

  customerAddressList;
  CustomerShipToId;
  CustomerBillToId;
  CustomerSOId;
  VendorPOId;
  CustomerInvoiceId;
  IsAllowQuoteBeforeShip;
  ManufactuerName;

  RRVendorId;
  vendorList: any = [];
  MRONotesInfo: any = [];
  AttachmentList: any = [];
  VendorFollowup: any = [];
  ShippingStatus;
  RRStatusHistory;
  ShippingIdentityType;
  RRShippingHistory: any = [];
  attachmentThumb;
  showsave: boolean = true;
  spinner: boolean = false;
  disablesave: boolean = false;

  ShippingIdentityId;
  CONST_AH_Group_ID;
  FromIdentityName;
  ToIdentityName;
  ReceiveIdentityTypeName;
  ahAddress;
  vendoraddress;
  // Button Enable/Disable
  showAddWarranty = false;
  IsSOApproved;
  IsPoApproved;
  IsInvoiceApproved;
  IsVendorBillApproved;
  IsMROEdit: any;
  constructor(
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    public router: Router,
    private modalService: NgbModal,
    public navCtrl: NgxNavigationWithDataComponent,
    private service: CommonService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private CommonmodalService: BsModalService,
    public modalRef: BsModalRef
  ) {
    this.IsMROEdit = this.service.permissionCheck("MRO", CONST_MODIFY_ACCESS);
  }

  currentRouter = decodeURIComponent(this.router.url);
  ngOnInit() {
    if (this.IsMROEdit) {
      this.breadCrumbItems = [
        { label: "Aibond", path: "/" },
        { label: "MRO", path: "/admin/mro/list/" },
        { label: "Edit", path: "/", active: true },
      ];
      if (history.state.MROId == undefined) {
        this.route.queryParams.subscribe((params) => {
          this.MROId = params["MROId"];
        });
      } else if (history.state.MROId != undefined) {
        this.MROId = history.state.MROId;
      }
      //this.MROId = this.navCtrl.get('MROId');
      this.array_MRO_status = array_MRO_status;
      this.ahAddress = "";
      this.vendoraddress = "";
      // Redirect to the List page if the View Id is not available
      if (this.MROId == "" || this.MROId == "undefined" || this.MROId == null) {
        this.navCtrl.navigate("/admin/mro/list/");
        return false;
      }
      this.attachmentThumb = attachment_thumb_images;

      // // Access Rights
      // this.accessRights = JSON.parse(localStorage.getItem("accessRights"));
      //   this.RR = this.accessRights["RR"].split(",");
      // this.RRVerify = this.accessRights["RRVerify"].split(",");
      // this.RRAssignVendor = this.accessRights["RRAssignVendor"].split(",");
      // this.RRVendorQuote = this.accessRights["RRVendorQuote"].split(",");
      // this.RRCustomerQuote = this.accessRights["RRCustomerQuote"].split(",");
      // this.RRShipParts = this.accessRights["RRShipParts"].split(",");
      // this.RRReceiveParts = this.accessRights["RRReceiveParts"].split(",");
      // this.RRTrackUPS = this.accessRights["RRTrackUPS"].split(",");
      // this.RRWarranty = this.accessRights["RRWarranty"].split(",");
      // this.RRDuplicate = this.accessRights["RRDuplicate"].split(",");
      // this.RRSalesOrder = this.accessRights["RRSalesOrder"].split(",");
      // this.RRPurchaseOrder = this.accessRights["RRPurchaseOrder"].split(",");
      // this.RRSalesInvoice = this.accessRights["RRSalesInvoice"].split(",");
      // this.RRVendorBill = this.accessRights["RRVendorBill"].split(",");
      // this.RRComplete = this.accessRights["RRComplete"].split(",");
      // this.RRCustomerFollowup = this.accessRights["RRCustomerFollowup"].split(",");
      // this.RRVendorFollowup = this.accessRights["RRVendorFollowup"].split(",");
      // this.RRNotes = this.accessRights["RRNotes"].split(",");
      // this.RRAtachment = this.accessRights["RRAtachment"].split(",");
      // this.CustomerReference = this.accessRights["CustomerReference"].split(",");

      this.CONST_AH_Group_ID = CONST_AH_Group_ID;
      this.EditForm = this.fb.group({
        CustomerId: ["", Validators.required],
        Notes: [""],
        CustomerShipToId: [null, Validators.required],
        CustomerBillToId: [null, Validators.required],
        TermsId: ["", Validators.required],
        TaxType: ["", Validators.required],
        TotalValue: [""],
        ProcessFee: [""],
        TotalTax: [""],
        TaxPercent: [""],
        Discount: [""],
        ShippingFee: [""],
        GrandTotal: [""],

        CustomerPONo: [""],
        CustomerSONo: [""],
        VendorPONo: [""],
        CustomerInvoiceNo: [""],
        VendorInvoiceNo: [""],
        CustomerSODueDate: [""],
        VendorPODueDate: [""],
        CustomerInvoiceDueDate: [""],
        VendorInvoiceDueDate: [""],
      });

      this.Quote = "";
      this.getCustomerList();
      this.getVendorList();
      this.getViewContent();
      this.getAdminList();
    }
  }

  partCurrentLocation() {
    this.shippingDetails =
      this.RRShippingHistory[this.viewResult.MROShippingHistory.length - 1];
    this.ShipToIdentityName = this.shippingDetails.ShipToIdentityName;
    this.ShipFromIdentityName = this.shippingDetails.ShipFromIdentityName;
    this.ShipFromAddressId = this.shippingDetails.ShipFromAddressId;

    if (this.ShipToIdentityName == "Vendor") {
      this.ReceiveIdentityType = 2;
      if (this.vendorList.length > 0) {
        this.ReceiveName = this.vendorList.find(
          (a) => a.VendorId == this.shippingDetails.ShipToId
        ).VendorName;
      }
    } else {
      this.ReceiveIdentityType = 1;
      if (this.CustomerList.length > 0) {
        this.ReceiveName = this.CustomerList.find(
          (a) => a.CustomerId == this.shippingDetails.ShipToId
        ).CompanyName;
      }
    }

    if (
      this.ShipFromIdentityName == "Vendor" &&
      this.shippingDetails.ShipFromId != CONST_AH_Group_ID
    ) {
      this.FromIdentityName = "Vendor";
    } else if (
      this.ShipFromIdentityName == "Vendor" &&
      this.shippingDetails.ShipFromId == CONST_AH_Group_ID
    ) {
      this.FromIdentityName = "Aibond";
    } else if (this.ShipFromIdentityName == "Customer") {
      this.FromIdentityName = "Customer";
    }

    if (
      this.ShipToIdentityName == "Vendor" &&
      this.shippingDetails.ShipToId != CONST_AH_Group_ID
    ) {
      this.ToIdentityName = "Vendor";
    } else if (
      this.ShipToIdentityName == "Vendor" &&
      this.shippingDetails.ShipToId == CONST_AH_Group_ID
    ) {
      this.ToIdentityName = "Aibond";
    } else if (this.ShipToIdentityName == "Customer") {
      this.ToIdentityName = "Customer";
    }

    if (this.shippingDetails.ReceiveIdentityType == "Vendor") {
      this.ReceiveIdentityTypeName = "Vendor";
    } else if (this.shippingDetails.ReceiveIdentityType == "Customer") {
      this.ReceiveIdentityTypeName = "Customer";
    }
    this.getAddressList();
  }

  getAddressList() {
    var postData = {
      IdentityId: this.shippingDetails.ShipToId,
      IdentityType: this.ReceiveIdentityType,
    };
    this.service
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.AddressList = response.responseData.map(function (value) {
          return {
            title: `${value.StreetAddress} ${value.SuiteOrApt}, ${value.City},  ${value.StateName}, ${value.CountryName},- ${value.Zip}`,
            AddressId: value.AddressId,
          };
        });

        var Obj = this;

        var ShippingAddress = this.AddressList.map(function (value) {
          if (value.AddressId == Obj.shippingDetails.ReceiveAddressId) {
            return value.title;
          }
        });
        this.AddressData = ShippingAddress[0];
      });
  }

  getAddressFromList() {
    var postData = {
      IdentityId: this.shippingDetails.ShipFromId,
      IdentityType: this.ShippingIdentityType,
    };
    this.commonService
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.AddressList = response.responseData.map(function (value) {
          return {
            title:
              value.StreetAddress +
              " " +
              value.SuiteOrApt +
              ", " +
              value.City +
              " , " +
              value.StateName +
              " ," +
              value.CountryName +
              ". - " +
              value.Zip,
            AddressId: value.AddressId,
          };
        });
        var Obj = this;

        var ShippingAddress = this.AddressList.map(function (value) {
          if (value.AddressId == Obj.ShipFromAddressId) {
            return value.title;
          }
        });
        this.AddressData = ShippingAddress[0];
      });
  }

  openModal(content: string) {
    this.modalService.open(content);
  }

  getViewContent() {
    var postData = {
      MROId: this.MROId,
    };
    this.service.postHttpService(postData, "viewMRO").subscribe(
      (response) => {
        if (response.status == true) {
          this.viewResult = response.responseData;
          this.MROInfo = this.viewResult.MROInfo[0];
          this.Quote = this.viewResult.Quote[0];
          // For QR Code
          this.MRONo = this.MROInfo.MRONo;
          this.CustomerId = this.MROInfo.CustomerId;
          this.StatusName = this.MROInfo.StatusName;
          this.ShippingStatus = this.MROInfo.ShippingStatus;
          this.ShippingIdentityType = this.MROInfo.ShippingIdentityType;
          this.ShippingIdentityId = this.MROInfo.ShippingIdentityId;
          this.Status = this.MROInfo.Status;
          this.VendorPONo = this.MROInfo.VendorPONo;

          this.CustomerPONo = this.MROInfo.CustomerPONo || "";
          this.CustomerSONo = this.MROInfo.CustomerSONo || "";
          this.CustomerInvoiceNo = this.MROInfo.CustomerInvoiceNo || "";
          this.VendorInvoiceNo = this.MROInfo.VendorInvoiceNo || "";
          this.IsPoApproved = this.MROInfo.IsPoApproved || 0;
          this.IsSOApproved = this.MROInfo.IsSOApproved || 0;
          this.IsInvoiceApproved = this.MROInfo.IsInvoiceApproved || 0;
          this.IsVendorBillApproved = this.MROInfo.IsVendorBillApproved || 0;
          this.VendorPOId = this.MROInfo.VendorPOId || "";
          this.CustomerSOId = this.MROInfo.CustomerSOId || "";
          this.CustomerInvoiceId = this.MROInfo.CustomerInvoiceId || "";
          this.VendorInvoiceId = this.MROInfo.VendorInvoiceId || "";

          if (
            this.MROInfo.CustomerSODueDate != "" &&
            this.MROInfo.CustomerSODueDate != "0000-00-00 00:00:00"
          ) {
            this.CustomerSODueDate = this.MROInfo.CustomerSODueDate
              ? this.datePipe.transform(
                  this.MROInfo.CustomerSODueDate,
                  "MM/dd/yyyy"
                )
              : "";
          }
          if (
            this.MROInfo.VendorPODueDate != "" &&
            this.MROInfo.VendorPODueDate != "0000-00-00 00:00:00"
          ) {
            this.VendorPODueDate = this.MROInfo.VendorPODueDate
              ? this.datePipe.transform(
                  this.MROInfo.VendorPODueDate,
                  "MM/dd/yyyy"
                )
              : "";
          }
          if (
            this.MROInfo.CustomerInvoiceDueDate != "" &&
            this.MROInfo.CustomerInvoiceDueDate != "0000-00-00 00:00:00"
          ) {
            this.CustomerInvoiceDueDate = this.MROInfo.CustomerInvoiceDueDate
              ? this.datePipe.transform(
                  this.MROInfo.CustomerInvoiceDueDate,
                  "MM/dd/yyyy"
                )
              : "";
          }
          if (
            this.MROInfo.VendorInvoiceDueDate != "" &&
            this.MROInfo.VendorInvoiceDueDate != "0000-00-00 00:00:00"
          ) {
            this.VendorInvoiceDueDate = this.MROInfo.VendorInvoiceDueDate
              ? this.datePipe.transform(
                  this.MROInfo.VendorInvoiceDueDate,
                  "MM/dd/yyyy"
                )
              : "";
          }
          this.CustomerShipToId = this.Quote.CustomerShipToId || "";
          this.CustomerBillToId = this.Quote.CustomerBillToId || "";

          this.VendorsInfo = this.viewResult.MROVendor || [];

          this.QuoteInfo = this.viewResult.Quote || [];
          this.QuoteItems = this.viewResult.QuoteItem || [];

          this.ApprovedQuoteInfo = this.viewResult.MROApprovedQuote || [];
          this.ApprovedQuoteItems = this.viewResult.MROApprovedQuoteItem || [];

          this.MRONotesInfo = this.viewResult.MRONote || [];
          this.AttachmentList = this.viewResult.MROAttachment || [];

          this.getCustomerProperties(this.MROInfo.CustomerId, {
            PriorityNotes: this.PriorityNotes,
          });

          //Set the form value
          this.EditForm.patchValue({
            CustomerId: this.MROInfo.CustomerId,
            CustomerBillToId: this.MROInfo.CustomerBillToId,
            CustomerShipToId: this.MROInfo.CustomerShipToId,
            Notes: this.Quote.Notes,
            TermsId: this.Quote.TermsId,
            TaxType: this.Quote.TaxType,
            TotalValue: this.Quote.TotalTax,
            ProcessFee: this.Quote.ProcessFee,
            TotalTax: this.Quote.TotalTax,
            TaxPercent: this.Quote.TaxPercent,
            Discount: this.Quote.Discount,
            ShippingFee: this.Quote.ShippingFee,
            GrandTotal: this.Quote.GrandTotal,

            CustomerPONo: this.MROInfo.CustomerPONo,
            CustomerSONo: this.MROInfo.CustomerSONo,
            VendorPONo: this.MROInfo.VendorPONo,
            CustomerInvoiceNo: this.MROInfo.CustomerInvoiceNo,
            VendorInvoiceNo: this.MROInfo.VendorInvoiceNo,
            VendorPODueDate: this.VendorPODueDate,
            CustomerSODueDate: this.CustomerSODueDate,
            CustomerInvoiceDueDate: this.CustomerInvoiceDueDate,
            VendorInvoiceDueDate: this.VendorInvoiceDueDate,
          });

          this.VendorsInfo = this.viewResult.MROVendor || [];

          // Approved Vendor Details
          this.VendorId = this.MROInfo.VendorId;
          this.RRVendorId = this.MROInfo.RRVendorId;
          this.VendorSize = this.VendorsInfo.length;
          if (this.VendorId > 0) {
            this.addButton = false;
            this.VendorName = this.MROInfo.VendorName;
            this.VendorCode = this.MROInfo.VendorCode;
          } else {
            this.addButton = true;
          }
          if (this.Status > 0) {
            this.showVendor = true;

            // Set the Vendor ID
            if (this.VendorsInfo.length > 0) {
              // Vendor is assigned
              this.selectedVendor = true;
            } else {
              // Vendor is not assigned
              this.addButton = true;
              this.selectedVendor = false;
            }
          } else {
          }

          //Current location address
          if (
            this.ShippingStatus == 2 &&
            this.ShippingIdentityId != CONST_AH_Group_ID &&
            this.ShippingIdentityType == 2
          ) {
            this.getVendoraddress();
          }
          if (
            this.ShippingStatus == 2 &&
            this.ShippingIdentityId == CONST_AH_Group_ID
          ) {
            this.getahaddress();
          }
          /********** RR Notes Group - Start ***********/
          if (this.MRONotesInfo.length > 0) {
            // Accepts the array and key
            const groupBy = (array, key) => {
              // Return the end result
              return array.reduce((result, currentValue) => {
                // If an array already present for key, push it to the array. Else create an array and push the object
                (result[currentValue[key]] =
                  result[currentValue[key]] || []).push(currentValue);
                // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
                return result;
              }, {}); // empty object is the initial value for result object
            };

            // Group by color as key to the person array
            this.notesArr = groupBy(this.MRONotesInfo, "NotesType");
          }

          if (this.QuoteInfo.length > 0) {
            // Customer quote is created
            for (var i = 0; i < this.QuoteInfo.length; i++) {
              if (
                this.QuoteInfo[i].QuoteCustomerStatus == 2 &&
                this.VendorId == this.QuoteInfo[i].VendorId &&
                this.RRVendorId == this.QuoteInfo[i].RRVendorId
              ) {
                // Check the current Vendor status
                this.ApprovedQuoteId = this.QuoteInfo[i].QuoteId;
                this.ApprovedVendorId = this.QuoteInfo[i].VendorId;
                this.ApprovedRRVendorId = this.QuoteInfo[i].RRVendorId;
                this.ApprovedQuoteStatus =
                  this.QuoteInfo[i].QuoteCustomerStatus;
                this.ApprovedQuoteWarranty = this.QuoteInfo[i].WarrantyPeriod;

                this.SubTotal = this.QuoteInfo[i].TotalValue;
                this.AdditionalCharge = this.QuoteInfo[i].ProcessFee;
                this.TotalTax = this.QuoteInfo[i].TotalTax;
                this.Discount = this.QuoteInfo[i].Discount;
                this.Shipping = this.QuoteInfo[i].ShippingFee;
                this.QuoteGrandTotal = this.QuoteInfo[i].GrandTotal;
                //continue;
              }

              this.QuoteInfo[i].LeadTimes = this.QuoteItems.filter(
                (a) => a.QuoteId == this.QuoteInfo[i].QuoteId
              ).map((a) =>
                a.LeadTime > 0
                  ? "Part # : " + a.PartNo + " - " + a.LeadTime + " Day(s)"
                  : " - "
              );
            }
          } else {
          }
          // this.CustomerRefInfo = this.viewResult.MROCustomerReference || [];
          // this.RRStatusHistory = this.viewResult.RRStatusHistory || [];
          this.RRShippingHistory = this.viewResult.MROShippingHistory || [];
          // this.RRPartsInfo = this.viewResult.RRPartsInfo || [];
          this.VendorFollowup = this.viewResult.MROFollowUp || [];
          // this.WarrantyInfo = this.viewResult.WarrantyInfo || [];
          if (this.RRShippingHistory.length > 0) {
            this.partCurrentLocation();
          }

          // Get the Shipping Track Number
          if (this.RRShippingHistory.length > 0) {
            for (let val of this.RRShippingHistory) {
              if (val.TrackingNo && val.IsShipViaUPS == 1)
                this.RRTracking.push(val.TrackingNo);
            }
            this.trackingNumber = this.RRTracking[this.RRTracking.length - 1];
          }
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  getahaddress() {
    var postData = {
      IdentityId: CONST_AH_Group_ID,
      IdentityType: 2,
      Type: CONST_ShipAddressType,
    };
    this.service
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.customerAddressList = response.responseData.map(function (value) {
          return {
            title:
              value.StreetAddress +
              " " +
              value.SuiteOrApt +
              ", " +
              value.City +
              " , " +
              value.StateName +
              " ," +
              value.CountryName +
              ". - " +
              value.Zip,
            AddressId: value.AddressId,
          };
        });
        var ShippingAddress = response.responseData.map(function (value) {
          if (value.IsShippingAddress == 1) {
            return value;
          }
        });
        this.ahAddress = ShippingAddress[0];
      });
  }
  getVendoraddress() {
    var postData = {
      IdentityId: this.VendorId,
      IdentityType: 2,
      Type: CONST_ShipAddressType,
    };
    this.service
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.customerAddressList = response.responseData.map(function (value) {
          return {
            title:
              value.StreetAddress +
              " " +
              value.SuiteOrApt +
              ", " +
              value.City +
              " , " +
              value.StateName +
              " ," +
              value.CountryName +
              ". - " +
              value.Zip,
            AddressId: value.AddressId,
          };
        });
        var ShippingAddress = response.responseData.map(function (value) {
          if (value.IsShippingAddress == 1) {
            return value;
          }
        });
        this.vendoraddress = ShippingAddress[0];
        console.log(this.vendoraddress);
      });
  }
  addMissingPartClick(PartNo, SerialNo) {
    var CustomerId = this.CustomerId;
    this.modalRef = this.CommonmodalService.show(AddRrPartsComponent, {
      initialState: {
        data: { CustomerId, PartNo },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((modelResponse) => {
      // Display the details
      this.RRDescription = modelResponse.data.Description || "";
      this.Description = modelResponse.data.Description || "";
      this.Manufacturer = modelResponse.data.ManufacturerId;
      this.ManufactuerName = modelResponse.data.ManufacturerName;
      this.PartId = modelResponse.data.PartId;
      this.PartNo = modelResponse.data.PartNo;
      this.PON = modelResponse.data.NewPrice;
      // this.LPP = modelResponse.data.LastPricePaid;
      this.ManufacturerPartNo = modelResponse.data.ManufacturerPartNo || "";
      this.SerialNo = SerialNo;
      this.Quantity = modelResponse.data.Quantity;
      this.addMissingPart = false;

      // Update the Customer Parts List
      this.partNewList = [];
      this.partList = [];
      var postData = { CustomerId: CustomerId };
      this.service
        .postHttpService(postData, "getPartListDropdown")
        .subscribe((response) => {
          this.partNewList.push({ PartId: 0, PartNo: "+ Add New" });
          for (var i in response.responseData) {
            this.partNewList.push({
              PartId: response.responseData[i].PartId,
              PartNo: response.responseData[i].PartNo,
            });
          }
          this.partList = this.partNewList;
        });
    });
  }

  onSubmit(type = 0) {
    if (this.disablesave) {
      return;
    }
    this.spinner = true;
    this.disablesave = true;
    var nextStep = "";
    if (type == 1) {
      if (this.addMissingPart) {
        Swal.fire({
          title: "Success!",
          text: "Cannot Verify. Please Add Part!",
          type: "success",
          confirmButtonClass: "btn btn-confirm mt-2",
        });
      }
      nextStep = "needssourced";
    }
    this.submitted = true;
    if (this.EditForm.valid) {
      //this.data = this.EditForm.value;

      var postData; //alert(this.Status);

      if (this.Status > 0) {
        postData = {
          MROId: this.MROId,
          CustomerPONo: this.EditForm.value.CustomerPONo,
          CustomerSONo: this.EditForm.value.CustomerSONo,
          CustomerSODueDate: this.EditForm.value.CustomerSODueDate,
          VendorPONo: this.EditForm.value.VendorPONo,
          VendorPODueDate: this.EditForm.value.VendorPODueDate,
          CustomerInvoiceNo: this.EditForm.value.CustomerInvoiceNo,
          CustomerInvoiceDueDate: this.EditForm.value.CustomerInvoiceDueDate,
          Notes: this.EditForm.value.Notes,
          CustomerId: this.EditForm.value.CustomerId,
          CustomerBillToId: this.EditForm.value.CustomerBillToId,
          CustomerShipToId: this.EditForm.value.CustomerShipToId,
        };
        this.service.putHttpService(postData, "UpdateMROStep2").subscribe(
          (response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Success!",
                text: "Record saved Successfully!",
                type: "success",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
              this.reLoad();
            } else {
              Swal.fire({
                title: "Error!",
                text: "Record could not be saved!",
                type: "warning",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            }
            this.spinner = false;
            this.disablesave = false;
            this.cd_ref.detectChanges();
          },
          (error) => {
            console.log(error);
            this.spinner = false;
            this.disablesave = false;
          }
        );
      } else {
        postData = {
          MROId: this.MROId,
          // "CustomerId": this.EditForm.value.CustomerId,
          // "DepartmentId": this.EditForm.value.DepartmentId,
          // "AssetId": this.EditForm.value.AssetId,
          // "CustomerPONo": this.EditForm.value.CustomerPONo,
          // "CustomerBillToId": this.EditForm.value.CustomerBillToId,
          // "CustomerShipToId": this.EditForm.value.CustomerShipToId,
          // "IsRushRepair": this.EditForm.value.IsRushRepair,
          // "IsWarrantyRecovery": this.EditForm.value.IsWarrantyRecovery,
          // "IsRepairTag": this.EditForm.value.IsRepairTag,
          // "RRDescription": this.EditForm.value.RRDescription,
          // "StatedIssue": this.EditForm.value.StatedIssue,
          // "UserId": this.EditForm.value.UserId,
          // "ContactPhone": this.EditForm.value.ContactPhone,
          // "ContactEmail": this.EditForm.value.ContactEmail,
          // "PartId": this.EditForm.value.PartId,
          // "CustomerReferenceList": this.CustomerRefInfo,
          // "RRParts": {
          //   "PartId": this.EditForm.value.PartId,
          //   "RRPartsId": this.EditForm.value.RRPartsId,
          //   "LeadTime": this.EditForm.value.LeadTime,
          //   "CustomerPartNo1": this.EditForm.value.CustomerPartNo1,
          //   "CustomerPartNo2": this.EditForm.value.CustomerPartNo2,
          //   "PartNo": this.EditForm.value.PartNo,
          //   "ManufacturerPartNo": this.EditForm.value.ManufacturerPartNo,
          //   "SerialNo": this.EditForm.value.SerialNo,
          //   "Quantity": this.EditForm.value.Quantity,
          //   "Price": this.EditForm.value.Price,
          //   "Rate": this.EditForm.value.Rate,
          //   "Description": this.EditForm.value.Description,
          //   "Manufacturer": this.EditForm.value.Manufacturer,
          // },
          // "RRImagesList": this.RRImagesList,
          nextstep: nextStep,
        };

        this.service.postHttpService(postData, "updateMRO").subscribe(
          (response) => {
            if (response.status == true) {
              this.addMissingPart = false;
              Swal.fire({
                title: "Success!",
                text: "Record saved Successfully!",
                type: "success",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
              this.reLoad();
            } else {
              Swal.fire({
                title: "Error!",
                text: "Record could not be saved!",
                type: "warning",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            }
            this.spinner = false;
            this.disablesave = false;
            this.cd_ref.detectChanges();
          },
          (error) => {
            console.log(error);
            this.spinner = false;
            this.disablesave = false;
          }
        );
      }
    } else {
      Swal.fire({
        type: "error",
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: "btn btn-confirm mt-2",
      });
      this.spinner = false;
      this.disablesave = false;
    }
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  getCustomerList() {
    this.service
      .getHttpService("getCustomerListDropdown")
      .subscribe((response) => {
        this.customerList = response.responseData.map(function (value) {
          return {
            title: value.CompanyName,
            CustomerId: value.CustomerId,
            PriorityNotes: value.PriorityNotes,
          };
          //return { title: value.CustomerCode + " - " + value.CompanyName, "CustomerId": value.CustomerId, "PriorityNotes": value.PriorityNotes }
        });
        this.CustomerList = response.responseData;
      });
  }

  getDepartmentList() {
    this.service
      .getHttpService("getDepartmentListDropdown")
      .subscribe((response) => {
        this.departmentList = response.responseData;
      });
  }
  getAdminList() {
    this.service.getHttpService("getUserList").subscribe((response) => {
      //getAdminListDropdown
      this.adminList = response.responseData;
    });
  }
  getPartList() {
    this.service.getHttpService("getPartListDropdown").subscribe((response) => {
      this.partList = response.responseData;
    });
  }
  getPartDetails(PartId) {
    var postData = { PartId: PartId };
    this.service
      .postHttpService(postData, "getPartDetails")
      .subscribe((response) => {
        // Initially reset the values
        this.Description = "";
        this.Manufacturer = "";
        this.PartNo = "";
        this.PON = "";
        this.LPP = "";
        this.SerialNo = "";
        this.LeadTime = "";
        this.ManufacturerPartNo = "";

        this.RRDescription = response.responseData[0].Description;
        this.Description = response.responseData[0].Description;
        this.Manufacturer = response.responseData[0].Manufacturer;
        this.PartNo = response.responseData[0].PartNo;
        //this.PON = response.responseData[0].Price;
        //this.LPP = response.responseData[0].LastPricePaid;
        this.ManufacturerPartNo = response.responseData[0].ManufacturerPartNo;
        this.SerialNo = response.responseData[0].SerialNo;
        this.Quantity = response.responseData[0].Quantity;
      });
    this.getPartPrice(PartId);
  }

  getPartPrice(PartId) {
    this.LPPList = [];
    var postData = { PartId: PartId, CustomerId: this.CustomerId };
    this.service
      .postHttpService(postData, "RRGetPartPrice")
      .subscribe((response) => {
        if (response.responseData) {
          for (var i in response.responseData.LPPInfo) {
            this.LPPList.push(response.responseData.LPPInfo[i].LPP);
          }
          this.LPP = this.LPPList.join(", ");
          this.PON = response.responseData.PartInfo.PON;
        }
      });
  }

  getCustomerProperties(CustomerId, event) {
    // this.PriorityNotes = event.PriorityNotes || '';
    if (!CustomerId) {
      this.assetList = [];
      this.customerReferenceList = [];
      return false;
    }
    var postData = { CustomerId: CustomerId };

    //assetList dropdown
    this.service
      .postHttpService(postData, "getAssetListDropdown")
      .subscribe((response) => {
        this.assetList = response.responseData;
      });

    //departmentList dropdown
    this.service
      .postHttpService(postData, "getCustomerDepartmentListDropdown")
      .subscribe((response) => {
        this.departmentList = response.responseData;
      });

    //referenceList dropdown
    this.service
      .postHttpService(postData, "getCustomerReferenceListDropdown")
      .subscribe((response) => {
        this.customerReferenceList = response.responseData;
      });

    // Customer Parts List
    this.service
      .postHttpService(postData, "getPartListDropdown")
      .subscribe((response) => {
        this.partList = response.responseData;
      });

    var postData1 = {
      IdentityId: CustomerId,
      IdentityType: 1,
      Type: CONST_BillAddressType,
    };
    //CustomerAddressLoad
    this.service
      .postHttpService(postData1, "getAddressList")
      .subscribe((response) => {
        this.AddressList = response.responseData;
        this.customerAddressList = response.responseData.map(function (value) {
          return {
            title:
              value.StreetAddress +
              " " +
              value.SuiteOrApt +
              ", " +
              value.City +
              " , " +
              value.StateName +
              " ," +
              value.CountryName +
              ". - " +
              value.Zip,
            AddressId: value.AddressId,
          };
        });
      });
    var postData2 = {
      IdentityId: CustomerId,
      IdentityType: 1,
      Type: CONST_ShipAddressType,
    };
    //CustomerAddressLoad
    this.service
      .postHttpService(postData2, "getAddressList")
      .subscribe((response) => {
        this.AddressList = response.responseData;
        this.customerAddressList = response.responseData.map(function (value) {
          return {
            title:
              value.StreetAddress +
              " " +
              value.SuiteOrApt +
              ", " +
              value.City +
              " , " +
              value.StateName +
              " ," +
              value.CountryName +
              ". - " +
              value.Zip,
            AddressId: value.AddressId,
          };
        });
      });
  }

  getAdminView(event, UserId) {
    var postData = { UserId: UserId };
    this.service
      .postHttpService(postData, "getUserView")
      .subscribe((response) => {
        this.ContactPhone = response.responseData.PhoneNo;
        this.ContactEmail = response.responseData.Email;
      });
  }

  getVendorList() {
    this.service
      .getHttpService("getVendorListDropdown")
      .subscribe((response) => {
        this.vendorList = response.responseData;
      });
  }

  fileProgressMultiple(event: any) {
    const formData = new FormData();
    var filesarray = event.target.files;
    for (var i = 0; i < filesarray.length; i++) {
      formData.append("files", filesarray[i]);
    }
    this.spinner = true;
    this.showsave = false;
    this.service.postHttpImageService(formData, "RRImageupload").subscribe(
      (response) => {
        if (response.status == true) {
          this.imageresult = response.responseData;

          for (var x in this.imageresult) {
            this.RRImagesList.push({
              IdentityType: CONST_IDENTITY_TYPE_RR, // For RR
              path: this.imageresult[x].location,
              originalname: this.imageresult[x].originalname,
              mimetype: this.imageresult[x].mimetype,
              size: this.imageresult[x].size,
            });
          }
        }
        this.spinner = false;
        this.showsave = true;

        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  //get form validation control
  get EditFormControl() {
    return this.EditForm.controls;
  }

  //QR Code
  viewQrCode() {
    //var RRId= this.viewResult.RRId
    var MROId = this.MROId;
    var MRONo = this.MRONo;
    // var PartNo = this.viewResult.RRInfo[0].PartNo
    // var SerialNo = this.viewResult.RRInfo[0].SerialNo
    this.modalRef = this.CommonmodalService.show(MroQrCodeComponent, {
      initialState: {
        data: { MROId, MRONo },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {});
  }

  //Notes Section
  addNotes() {
    var IdentityId = this.MROId;
    var IdentityType = CONST_IDENTITY_TYPE_MRO;
    this.modalRef = this.CommonmodalService.show(AddNotesComponent, {
      initialState: {
        data: { IdentityId, IdentityType },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.MRONotesInfo.push(res.data);
      this.reLoad();
    });
  }

  editNotes(note, i) {
    var IdentityId = this.MROId;
    var IdentityType = CONST_IDENTITY_TYPE_MRO;
    this.modalRef = this.CommonmodalService.show(EditNotesComponent, {
      initialState: {
        data: { note, i, IdentityId, IdentityType },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.MRONotesInfo[i] = res.data;
      this.reLoad();
    });
  }

  deleteNotes(NotesId, i) {
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
          NotesId: NotesId,
        };
        this.service
          .postHttpService(postData, "NotesDelete")
          .subscribe((response) => {
            if (response.status == true) {
              this.MRONotesInfo.splice(i, 1);
              Swal.fire({
                title: "Deleted!",
                text: "Notes has been deleted.",
                type: "success",
              });
            }
          });
        this.reLoad();
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Notes is safe:)",
          type: "error",
        });
      }
    });
  }

  //AttachementSection
  addAttachment() {
    var IdentityId = this.MROId;
    var IdentityType = CONST_IDENTITY_TYPE_MRO;
    this.modalRef = this.CommonmodalService.show(RRAddAttachmentComponent, {
      initialState: {
        data: { IdentityId, IdentityType },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.AttachmentList.push(res.data);
    });
  }

  editAttachment(attachment, i) {
    var IdentityId = this.MROId;
    var IdentityType = CONST_IDENTITY_TYPE_MRO;
    this.modalRef = this.CommonmodalService.show(RrEditAttachmentComponent, {
      initialState: {
        data: { attachment, i, IdentityType, IdentityId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.AttachmentList[i] = res.data;
    });
  }

  deleteAttachment(AttachmentId, i) {
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
          AttachmentId: AttachmentId,
        };
        this.service
          .postHttpService(postData, "AttachmentDelete")
          .subscribe((response) => {
            if (response.status == true) {
              this.AttachmentList.splice(i, 1);
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

  //RRPartsSession
  addRepairParts() {
    var CustomerId = this.CustomerId;
    this.modalRef = this.CommonmodalService.show(AddRrPartsComponent, {
      initialState: {
        data: { CustomerId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((modelResponse) => {
      this.RRDescription = modelResponse.data.Description || "";
      this.Description = modelResponse.data.Description || "";
      this.Manufacturer = modelResponse.data.ManufacturerId;
      this.ManufactuerName = modelResponse.data.ManufacturerName;
      this.PartId = modelResponse.data.PartId;
      this.PartNo = modelResponse.data.PartNo;
      this.PON = modelResponse.data.NewPrice;
      // this.LPP = modelResponse.data.LastPricePaid;
      this.ManufacturerPartNo = modelResponse.data.ManufacturerPartNo || "";
      //this.SerialNo = response.data.SerialNo;
      this.Quantity = modelResponse.data.Quantity;

      // Update the Customer Parts List
      this.partNewList = [];
      this.partList = [];
      var postData = { CustomerId: CustomerId };
      this.service
        .postHttpService(postData, "getPartListDropdown")
        .subscribe((response) => {
          this.partNewList.push({ PartId: 0, PartNo: "+ Add New" });
          for (var i in response.responseData) {
            this.partNewList.push({
              PartId: response.responseData[i].PartId,
              PartNo: response.responseData[i].PartNo,
            });
          }
          this.partList = this.partNewList;
        });
    });
  }
  // ------- Vendor Quote Section - Start-------- //

  reLoad() {
    // window.location.reload()
    //this.router.navigate([this.currentRouter])
    this.router.navigate([this.currentRouter.split("?")[0]], {
      queryParams: { MROId: this.MROId },
    });
  }

  // Vendor Quote
  vendorQuote(VendorId, RRVendorId, VendorStatus) {
    if (
      this.CustomerShipToId == "" ||
      this.CustomerShipToId == null ||
      this.CustomerBillToId == "" ||
      this.CustomerBillToId == null
    ) {
      Swal.fire({
        title: "Alert",
        text: "Please select Ship To & Bill To!",
        type: "warning",
      });
      //this.CustomerPONoElement.nativeElement.focus();
      return false;
    } else {
      var RRVendorId = RRVendorId;
      var VendorId = VendorId;
      var VendorStatus = VendorStatus;
      var Status = this.Status;
      var MROId = this.MROId;
      var PartId = this.PartId;
      var CustomerId = this.CustomerId;
      var CustomerShipToId = this.CustomerShipToId;
      var CustomerBillToId = this.CustomerBillToId;

      this.modalRef = this.CommonmodalService.show(MroVendorQuoteComponent, {
        initialState: {
          data: {
            MROId,
            PartId,
            RRVendorId,
            Status,
            VendorId,
            CustomerId,
            CustomerShipToId,
            CustomerBillToId,
          },
          class: "modal-xl",
        },
        class: "gray modal-xl",
      });

      this.modalRef.content.closeBtnName = "Close";

      this.modalRef.content.event.subscribe((response) => {
        this.reLoad();
        if (response.data != "save") {
          this.EditCustomerQuote(response.data.id, VendorId, "");
        }
      });
    }
  }

  //Submit Vendor Quote
  SubmitVendorQuote(RRVendorId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          RRId: this.RRId,
          RRVendorId: RRVendorId,
          //RRVendorId: this.RRVendorId
        };
        this.service
          .putHttpService(postData, "RRVendorQuoteSubmit")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Submitted!",
                text: "Vendor Quote has been submitted.",
                type: "success",
              });
              this.reLoad();
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Vendor Quote has not submitted.",
          type: "error",
        });
      }
    });
  }

  //QuoteSubmitted
  onQuotesSubmit(RRVendorId, RRId) {
    var postData = {
      RRVendorId: RRVendorId,
      RRId: RRId,
    };

    this.commonService.postHttpService(postData, "QuoteSubmitted").subscribe(
      (response) => {
        if (response.status == true) {
          Swal.fire({
            title: "Success!",
            text: "Quote Submitted Successfully!",
            type: "success",
            confirmButtonClass: "btn btn-confirm mt-2",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Quote Submitted not be saved!",
            type: "warning",
            confirmButtonClass: "btn btn-confirm mt-2",
          });
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  //Create Quote for Customer
  CreateCustomerQuote(VendorId, RRVendorId) {
    if (
      this.CustomerShipToId == "" ||
      this.CustomerShipToId == null ||
      this.CustomerBillToId == "" ||
      this.CustomerBillToId == null
    ) {
      Swal.fire({
        title: "Alert",
        text: "Please select Ship To & Bill To!",
        type: "warning",
      });
      //this.CustomerPONoElement.nativeElement.focus();
      return false;
    } else {
      Swal.fire({
        title: "Do you wish to proceed?",
        text: "You won't be able to revert this! ",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, create it!",
        cancelButtonText: "No, cancel!",
        confirmButtonClass: "btn btn-success mt-2",
        cancelButtonClass: "btn btn-danger ml-2 mt-2",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          var postData = {
            MROId: this.MROId,
            CustomerId: this.CustomerId,
            VendorId: VendorId,
            RRVendorId: RRVendorId,
            CustomerShipToId: this.CustomerShipToId,
            CustomerBillToId: this.CustomerBillToId,
          };
          this.service
            .postHttpService(postData, "MROCustomerQuoteCreate")
            .subscribe((response) => {
              if (response.status == true) {
                Swal.fire({
                  title: "Created!",
                  text: "Quote for Customer has been created.",
                  type: "success",
                });
                this.reLoad();
                this.EditCustomerQuote(response.responseData.id, VendorId, "");
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: "Cancelled",
            text: "Quote for Customer has not created.",
            type: "error",
          });
        }
      });
    }
  }

  // Edit Customer Quote
  EditCustomerQuote(QuoteId, VendorId, QuoteCustomerStatus) {
    var MROId = this.MROId;
    //var VendorId = this.VendorId;
    var VendorName = this.VendorName; // check this later
    var Status = this.Status;
    this.VendorId = VendorId;
    this.QuoteCustomerStatus = QuoteCustomerStatus;
    var CustomerId = this.CustomerId;

    this.modalRef = this.CommonmodalService.show(MroCustomerQuoteComponent, {
      initialState: {
        data: {
          MROId,
          QuoteId,
          VendorName,
          QuoteCustomerStatus,
          Status,
          VendorId,
          CustomerId,
        },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  //Submit Quote for Customer
  SubmitCustomerQuote(QuoteId, RRVendorId) {
    Swal.fire({
      title: "Are you sure?",
      text: "Please make sure you have reviewed the quote before submitting the quote for customer! ",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          MROId: this.MROId,
          QuoteId: QuoteId,
          CustomerId: this.CustomerId,
          RRVendorId: RRVendorId,
        };

        this.service
          .postHttpService(postData, "SubmitMROQuoteToCustomer")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Submitted!",
                text: "Quote for Customer has been submitted.",
                type: "success",
              });
              this.reLoad();
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Quote for Custome has not submitted.",
          type: "error",
        });
      }
    });
  }

  //Approve Quote
  ApproveQuote(QuoteId) {
    if (this.CustomerPONo == "" || this.CustomerPONo == null) {
      Swal.fire({
        title: "Alert",
        text: "Please enter the Customer PO #!",
        type: "warning",
      });
      //this.CustomerPONoElement.nativeElement.focus();
      return false;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, approve it!",
        cancelButtonText: "No, cancel!",
        confirmButtonClass: "btn btn-success mt-2",
        cancelButtonClass: "btn btn-danger ml-2 mt-2",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          var postData = {
            MROId: this.MROId,
            QuoteId: QuoteId,
            CustomerPONo: this.CustomerPONo,
          };
          this.service
            .postHttpService(postData, "ApproveMROCustomerQuote")
            .subscribe((response) => {
              if (response.status == true) {
                Swal.fire({
                  title: "Approved!",
                  text: "Quote has been approved.",
                  type: "success",
                });
                this.reLoad();
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: "Cancelled",
            text: "Quote has not approved.",
            type: "error",
          });
        }
      });
    }
  }

  //Reject Vendor
  RejectVendor(RRVendorId, RRInfoVendorId) {
    var MROId = this.MROId;
    var RRInfoStatus = this.Status;
    var VendorId = this.VendorId;

    this.modalRef = this.CommonmodalService.show(RejectAndResourceComponent, {
      initialState: {
        data: { MROId, RRVendorId, RRInfoStatus, VendorId, RRInfoVendorId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  //Reject Customer Quote
  RejectCustomerQuote(QuoteId, RRVendorId) {
    var MROId = this.MROId;
    this.modalRef = this.CommonmodalService.show(RejectCustomerQuoteComponent, {
      initialState: {
        data: { MROId, QuoteId, RRVendorId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  //Reject Vendor Quote
  /* RejectVendorQuote1(RRVendorId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          RRId: this.RRId,
          RRVendorId: this.RRVendorId
        }
        this.service.putHttpService(postData, 'RRVendorQuoteReject').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Rejected!',
              text: 'Vendor has been rejected.',
              type: 'success'
            });
            this.reLoad();
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Vendor has not rejected.',
          type: 'error'
        });
      }
    });
  }
 
  //Reject Quote
  RejectQuote1(QuoteId, RRVendorId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          RRId: this.RRId,
          QuoteId: QuoteId,
          RRVendorId: RRVendorId,
          QuoteRejectedType: 1
        }
        this.service.postHttpService(postData, 'RRCustomerQuoteReject').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Rejected!',
              text: 'Quote has been rejected.',
              type: 'success'
            });
            this.reLoad();
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Quote has not rejected.',
          type: 'error'
        });
      }
    });
  } */

  //Remove Vendor Quote
  removeVendor(RRVendorId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          MROId: this.MROId,
          RRVendorId: RRVendorId,
        };
        this.service
          .putHttpService(postData, "MROVendorRemove")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Removed!",
                text: "Vendor has been removed.",
                type: "success",
              });
              this.reLoad();
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Vendor is not removed.",
          type: "error",
        });
      }
    });
  }

  //Create SO
  CreateSO(QuoteId) {
    if (
      this.CustomerShipToId == "" ||
      this.CustomerShipToId == null ||
      this.CustomerBillToId == "" ||
      this.CustomerBillToId == null
    ) {
      Swal.fire({
        title: "Alert",
        text: "Please select Ship To & Bill To!",
        type: "warning",
      });
      //this.CustomerPONoElement.nativeElement.focus();
      return false;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, create it!",
        cancelButtonText: "No, cancel!",
        confirmButtonClass: "btn btn-success mt-2",
        cancelButtonClass: "btn btn-danger ml-2 mt-2",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          var postData = {
            MROId: this.MROId,
            QuoteId: QuoteId,
            CustomerId: this.CustomerId,
            CustomerShipToId: this.CustomerShipToId,
            CustomerBillToId: this.CustomerBillToId,
          };
          this.service
            .postHttpService(postData, "MROAutoSOCreate")
            .subscribe((response) => {
              if (response.status == true) {
                Swal.fire({
                  title: "Created SO!",
                  text: "Sales Order has been created.",
                  type: "success",
                });
                this.reLoad();
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: "Cancelled",
            text: "Sales Order has not created.",
            type: "error",
          });
        }
      });
    }
  }

  //Create PO
  CreatePO(QuoteId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          MROId: this.MROId,
          QuoteId: QuoteId,
          CustomerId: this.CustomerId,
        };
        this.service
          .postHttpService(postData, "MROAutoPOCreate")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Created PO!",
                text: "Purchase Order has been created.",
                type: "success",
              });
              this.reLoad();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Purchase Order has not created.",
          type: "error",
        });
      }
    });
  }

  //Create Invoice
  CreateInvoice(QuoteId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          MROId: this.MROId,
          QuoteId: QuoteId,
          CustomerId: this.CustomerId,
        };
        this.service
          .postHttpService(postData, "MROAutoInvoiceCreate")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Created Customer Invoice!",
                text: "Customer Invoice has been created.",
                type: "success",
              });
              this.reLoad();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Customer Invoice has not created.",
          type: "error",
        });
      }
    });
  }

  //Complete
  CompleteRR(QuoteId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, complete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          RRId: this.RRId,
          QuoteId: QuoteId,
          CustomerId: this.CustomerId,
        };
        this.service
          .postHttpService(postData, "RRComplete")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Completed!",
                text: "Repair Request has been completed.",
                type: "success",
              });
              this.reLoad();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Repair Request has not completed.",
          type: "error",
        });
      }
    });
  }

  //Not Repairable
  NotRepairableRR() {
    var RRId = this.RRId;

    this.modalRef = this.CommonmodalService.show(RrNotRepairableComponent, {
      initialState: {
        data: { RRId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
    /* Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, this part is Not Repairable!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          RRId: this.RRId,
          RejectedStatusType: 1
        }
        this.service.postHttpService(postData, 'RRNotRepairable').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Not Repairable!',
              text: 'The Part is not Repairable!',
              type: 'success'
            });
            this.reLoad();
          }
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'The Part is Repairable!',
          type: 'error'
        });
      }
    }); */
  }

  //Create Invoice
  CreateVendorInvoice(QuoteId) {
    var MROId = this.MROId;
    var CustomerId = this.CustomerId;
    var POId = this.VendorPOId;
    var SOId = this.CustomerSOId;
    var POAmount = this.MROInfo.POAmount;
    var IsInvoiceApproved = this.IsInvoiceApproved;
    this.modalRef = this.CommonmodalService.show(MroVendorInvoiceComponent, {
      initialState: {
        data: {
          MROId,
          QuoteId,
          CustomerId,
          POId,
          SOId,
          POAmount,
          IsInvoiceApproved,
        },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });

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
    //     var postData = {
    //       RRId: this.RRId,
    //       QuoteId: QuoteId,
    //       CustomerId: this.CustomerId,
    //       POId: this.VendorPOId,
    //       SOId: this.CustomerSOId
    //     }
    //     this.service.postHttpService(postData, 'RRCreateVendorInvoice').subscribe(response => {
    //       if (response.status == true) {
    //         Swal.fire({
    //           title: 'Created Vendor Bill!',
    //           text: 'Vendor Bill has been created.',
    //           type: 'success'
    //         });
    //         this.reLoad();
    //       }
    //     });
    //   } else if (
    //     result.dismiss === Swal.DismissReason.cancel
    //   ) {
    //     Swal.fire({
    //       title: 'Cancelled',
    //       text: 'Vendor Bill has not created.',
    //       type: 'error'
    //     });
    //   }
    // });
  }

  // ------- Vendor Quote Section - End-------- //

  //CustomerFollowup
  onCustomerFollowup() {
    var MROId = this.MROId;
    var IdentityType = CONST_IDENTITY_TYPE_CUSTOMER;
    var IdentityTypeName = "Customer";
    var IdentityId = this.CustomerId;
    var followupName = "Customer Followup";
    this.modalRef = this.CommonmodalService.show(MroFollowupComponent, {
      initialState: {
        data: {
          MROId,
          IdentityType,
          IdentityId,
          followupName,
          IdentityTypeName,
        },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.VendorFollowup.push(res.data);
    });
  }

  deleteFollowup(FollowupId, i) {
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
          FollowupId: FollowupId,
        };
        this.service
          .postHttpService(postData, "DeleteFollowup")
          .subscribe((response) => {
            if (response.status == true) {
              this.VendorFollowup.splice(i, 1);
              Swal.fire({
                title: "Deleted!",
                text: "Followup has been deleted.",
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
          text: "Followup is safe:)",
          type: "error",
        });
      }
    });
  }

  //VendorFollowup
  onVendorFollowup() {
    var MROId = this.MROId;
    var IdentityType = CONST_IDENTITY_TYPE_VENDOR;
    var IdentityId = this.VendorId;
    var IdentityTypeName = "Vendor";
    var followupName = "Vendor Followup";
    this.modalRef = this.CommonmodalService.show(MroFollowupComponent, {
      initialState: {
        data: {
          MROId,
          followupName,
          IdentityType,
          IdentityId,
          IdentityTypeName,
        },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.VendorFollowup.push(res.data);
    });
  }

  //ViewFolloup&edit notes
  editFollowupNotes(FollowupId, i) {
    var MROId = this.MROId;
    this.modalRef = this.CommonmodalService.show(ViewFollowupComponent, {
      initialState: {
        data: { FollowupId, i, MROId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((res) => {});
  }

  //ShippingDetails
  onShip() {
    var RRId = this.RRId;
    var CustomerId = this.viewResult.RRInfo[0].CustomerId;
    var VendorId = this.VendorId;
    this.modalRef = this.CommonmodalService.show(ShipComponent, {
      initialState: {
        data: { RRId, CustomerId, VendorId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  //addReference
  addReference() {
    var CustomerId = this.CustomerId;
    var MROId = this.MROId;
    this.modalRef = this.CommonmodalService.show(AddReferenceComponent, {
      initialState: {
        data: { CustomerId, MROId },
        class: "modal-lg",
        centered: true,
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.CustomerRefInfo.push(res.data);
    });
  }

  public addReferenceType() {
    var IdentityId = this.CustomerId;
    this.modalRef = this.CommonmodalService.show(CustomerReferenceComponent, {
      initialState: {
        data: { IdentityId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.customerReferenceList.push(res.data);
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

  //RRCurrent History
  RRcurrentstatus() {
    var currentHistory = this.RRStatusHistory;
    this.modalRef = this.CommonmodalService.show(RrCurrentHistoryComponent, {
      initialState: {
        data: { currentHistory },
      },
    });
    this.modalRef.content.closeBtnName = "Close";
  }

  //RRShipping History
  shippingHistory() {
    var RRShippingHistory = this.RRShippingHistory;
    var PartId = this.PartId;
    var RRId = this.RRId;

    this.modalRef = this.CommonmodalService.show(RrShippingHistoryComponent, {
      initialState: {
        data: { RRShippingHistory, RRId, PartId },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";
  }

  //Delete MRO Record
  onDelete() {
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
          MROId: this.MROId,
        };
        this.service
          .postHttpService(postData, "MRODelete")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "MRO has been deleted.",
                type: "success",
              });
              this.navCtrl.navigate("/admin/mro/list/");
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "MRO  is safe:)",
          type: "error",
        });
      }
    });
  }

  //RRShipping History
  onRRShippingReceive() {
    var RRShippingHistory = this.RRShippingHistory;
    var MROId = this.MROId;
    var CustomerId = this.CustomerId;
    var Status = this.Status;
    this.modalRef = this.CommonmodalService.show(MroReceiveComponent, {
      initialState: {
        data: { RRShippingHistory, MROId, CustomerId, Status },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }
  filterAndGetValue(object, getField, filterField, filterValue) {
    var value = object.filter(
      function (data) {
        return data[filterField] == filterValue;
      },
      filterField,
      filterValue
    );
    return value[0][getField];
  }

  addVendor() {
    // Vendor selection is mandatory
    if (
      this.VendorId == "" ||
      this.VendorId == undefined ||
      this.VendorId == null
    ) {
      this.selectVendor = "Error";
      return false;
    }
    this.VendorName = this.filterAndGetValue(
      this.vendorList,
      "VendorName",
      "VendorId",
      this.VendorId
    );

    var postData = {
      MROId: this.MROId,
      VendorId: this.VendorId,
      VendorName: this.VendorName,
    };
    this.service.postHttpService(postData, "MROAssignVendor").subscribe(
      (response) => {
        if (response.status == true) {
          this.reLoad();
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  assignAHVendor() {
    var postData = {
      MROId: this.MROId,
    };
    this.service
      .postHttpService(postData, "MROInventoryAssignVendor")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.reLoad();
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  //ShiptoVendor
  onShiptoVendor() {
    var RRShippingHistory = this.RRShippingHistory;
    var MROId = this.MROId;
    var VendorId = this.VendorId;
    var CustomerId = this.CustomerId;
    var ShippingStatus = this.ShippingStatus;
    var ShippingIdentityType = this.ShippingIdentityType;
    var ShippingIdentityName = this.MROInfo.ShippingIdentityName;
    var ShippingIdentityId = this.ShippingIdentityId;
    var ShippingAddressId = this.MROInfo.ShippingAddressId;
    var Status = this.Status;
    this.modalRef = this.CommonmodalService.show(MroShipComponent, {
      initialState: {
        data: {
          RRShippingHistory,
          MROId,
          VendorId,
          ShippingAddressId,
          ShippingIdentityName,
          ShippingIdentityId,
          CustomerId,
          ShippingStatus,
          ShippingIdentityType,
          Status,
        },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  partHistory() {
    var History = this.RRShippingHistory;
    var ShippingStatus = this.ShippingStatus;

    this.modalRef = this.CommonmodalService.show(
      PartCurrentLocationHistoryComponent,
      {
        initialState: {
          data: { History, ShippingStatus },
          class: "modal-xl",
        },
        class: "gray parthistory modal-xl",
      }
    );

    this.modalRef.content.closeBtnName = "Close";

    // this.modalRef.content.event.subscribe(res => {

    // });
  }
  onUpdatePartCurrentLocation() {
    var MROId = this.MROId;
    var VendorId = this.VendorId;
    var CustomerId = this.CustomerId;
    var VendorName = this.MROInfo.VendorName;
    this.modalRef = this.CommonmodalService.show(
      MroUpdateCurrentLocationComponent,
      {
        initialState: {
          data: { MROId, VendorId, CustomerId, VendorName },
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

  onRevertShippingCycle() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Revert it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          MROId: this.MROId,
        };
        this.service
          .postHttpService(postData, "RevertMROShipping")
          .subscribe((response) => {
            if (response.status == true) {
              this.reLoad();
              Swal.fire({
                title: "Reverted!",
                text: "Shipping Revert has been Sucessfully.",
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
          text: "Shipping Revert  is safe:)",
          type: "error",
        });
      }
    });
  }
  // Track UPS
  trackUPS(trackingNumber) {
    var PartId = this.PartId;
    //var src = 'AHOms';
    this.modalRef = this.CommonmodalService.show(UpsIntegrationComponent, {
      initialState: {
        data: { PartId, trackingNumber },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });
    this.modalRef.content.closeBtnName = "Close";
    /* this.modalRef.content.event.subscribe(res => {
      this.reLoad();
    }); */
  }

  viewVendor(VendorId) {
    this.navCtrl.navigate("/admin/vendor/view", { VendorId: VendorId });
  }

  goToCustomerSOView() {
    this.router.navigate(["admin/orders/sales-list"], {
      state: { SOId: this.CustomerSOId },
    });
  }

  goToVendorPOView() {
    this.router.navigate(["/admin/orders/purchase-list"], {
      state: { POId: this.VendorPOId },
    });
  }

  goToCustomerInvoiceView() {
    this.router.navigate(["/admin/invoice/list"], {
      state: { InvoiceId: this.CustomerInvoiceId },
    });
  }

  goToVendorInvoiceView() {
    this.router.navigate(["/admin/invoice/vendor-invoice-list"], {
      state: { VendorInvoiceId: this.VendorInvoiceId },
    });
  }

  goToCustomerQuote(QuoteId) {
    this.router.navigate(["admin/sales-quote/list"], {
      state: { QuoteId: QuoteId },
    });
  }

  sendEmailCustomerQuote(QuoteId) {
    var MROId = this.MROId;
    var IdentityId = QuoteId;
    var IdentityType = CONST_IDENTITY_TYPE_QUOTE;
    var followupName = "Quotes";
    this.modalRef = this.CommonmodalService.show(MroEmailComponent, {
      initialState: {
        data: { followupName, IdentityId, IdentityType, MROId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  previewInvoice(InvoiceId) {
    const initialState = { InvoiceId };
    this.modalRef = this.CommonmodalService.show(InvoicePrintComponent, {
      initialState: {
        initialState,
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.onEdit.subscribe(() => {
      this.modalRef.hide();
      this.navCtrl.navigate("admin/invoice/edit", { InvoiceId: InvoiceId });
    });

    this.modalRef.content.onPrint.subscribe((result) => {
      window.scrollTo(0, 0);
      var data = document.getElementById("contentToConvert");
      html2canvas(data).then((canvas) => {
        // this.modalRef.hide();
        var imgWidth = 208;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL("image/png");
        let pdf = new jspdf("p", "mm", "a4");

        var position = 10;
        pdf.addImage(
          contentDataURL,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        pdf.save(`Customer Invoice ${this.RRNo}​​​​​​​​.pdf`);
        this.hideAddress = true;
      });
    });

    this.modalRef.content.onEmail.subscribe((attachment) => {
      let ImportedAttachment = attachment;

      var MROId = this.MROId;
      var IdentityId = InvoiceId;
      var IdentityType = CONST_IDENTITY_TYPE_INVOICE;
      var followupName = "Invoice";
      this.modalRef.hide();
      this.modalRef = this.CommonmodalService.show(MroEmailComponent, {
        initialState: {
          data: {
            followupName,
            IdentityId,
            IdentityType,
            MROId,
            ImportedAttachment,
          },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";

      this.modalRef.content.event.subscribe((res) => {
        this.reLoad();
      });
    });
  }

  previewSO(SOId) {
    const initialState = { SOId };
    this.modalRef = this.CommonmodalService.show(SalesOrderPrintComponent, {
      initialState: {
        initialState,
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.onPrint.subscribe((result) => {
      window.scrollTo(0, 0);
      var data = document.getElementById("contentToConvert");

      html2canvas(data).then((canvas) => {
        // this.modalRef.hide();
        var imgWidth = 208;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL("image/png");
        let pdf = new jspdf("p", "mm", "a4");

        var position = 10;
        pdf.addImage(
          contentDataURL,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        pdf.save(`Customer Sales Order ${this.RRNo}.pdf`);
        this.hideAddress = true;
      });
    });

    this.modalRef.content.onEmail.subscribe((attachment) => {
      let ImportedAttachment = attachment;

      var MROId = this.MROId;
      var IdentityId = SOId;
      var IdentityType = CONST_IDENTITY_TYPE_SO;
      var followupName = "Sales Order";
      this.modalRef.hide();
      this.modalRef = this.CommonmodalService.show(MroEmailComponent, {
        initialState: {
          data: {
            followupName,
            IdentityId,
            IdentityType,
            MROId,
            ImportedAttachment,
          },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";

      this.modalRef.content.event.subscribe((res) => {
        this.reLoad();
      });
    });
  }

  previewCustomerQuote(quote) {
    const { QuoteId, QuoteNo } = quote;
    const initialState = { QuoteId };
    this.modalRef = this.CommonmodalService.show(SalesQuotePrintComponent, {
      initialState: {
        initialState,
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.onPrint.subscribe((result) => {
      window.scrollTo(0, 0);
      var data = document.getElementById("contentToConvert");

      html2canvas(data).then((canvas) => {
        // this.modalRef.hide();
        var imgWidth = 208;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL("image/png");
        let pdf = new jspdf("p", "mm", "a4");

        var position = 10;
        pdf.addImage(
          contentDataURL,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        pdf.save(`Customer Quote ${this.RRNo}.pdf`);
        this.hideAddress = true;
      });
    });

    this.modalRef.content.onEmail.subscribe((attachment) => {
      let ImportedAttachment = attachment;

      var MROId = this.MROId;
      var IdentityId = QuoteId;
      var IdentityType = CONST_IDENTITY_TYPE_QUOTE;
      var followupName = "Quotes";
      this.modalRef.hide();
      this.modalRef = this.CommonmodalService.show(MroEmailComponent, {
        initialState: {
          data: {
            followupName,
            IdentityId,
            IdentityType,
            MROId,
            ImportedAttachment,
          },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";

      this.modalRef.content.event.subscribe((res) => {
        this.reLoad();
      });
    });
  }
  previewPO(POId) {
    const initialState = { POId };
    this.modalRef = this.CommonmodalService.show(PurchaseOrderViewComponent, {
      initialState: {
        initialState,
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.onEdit.subscribe(() => {
      this.modalRef.hide();
      this.navCtrl.navigate("/admin/purchase-order/edit", { POId: POId });
    });

    this.modalRef.content.onPrint.subscribe((result) => {
      window.scrollTo(0, 0);
      var data = document.getElementById("contentToConvert");

      html2canvas(data).then((canvas) => {
        // this.modalRef.hide();
        var imgWidth = 208;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL("image/png");
        let pdf = new jspdf("p", "mm", "a4");

        var position = 10;
        pdf.addImage(
          contentDataURL,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        pdf.save(`Purchase Order ${this.RRNo}.pdf`);
        this.hideAddress = true;
      });
    });

    this.modalRef.content.onEmail.subscribe((attachment) => {
      var data = document.getElementById("contentToConvert");

      let ImportedAttachment = attachment;

      var MROId = this.MROId;
      var IdentityId = POId;
      var IdentityType = CONST_IDENTITY_TYPE_PO;
      var followupName = "Purchase Order";
      this.modalRef.hide();
      this.modalRef = this.CommonmodalService.show(MroEmailComponent, {
        initialState: {
          data: {
            followupName,
            IdentityId,
            IdentityType,
            MROId,
            ImportedAttachment,
          },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";

      this.modalRef.content.event.subscribe((res) => {
        this.reLoad();
      });
    });
  }

  sendEmailSO(SOId) {
    var MROId = this.MROId;
    var IdentityId = SOId;
    var IdentityType = CONST_IDENTITY_TYPE_SO;
    var followupName = "Sales Order";
    this.modalRef = this.CommonmodalService.show(MroEmailComponent, {
      initialState: {
        data: { followupName, IdentityId, IdentityType, MROId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  printPO(POId) {
    const initialState = { POId };
    this.modalRef = this.CommonmodalService.show(PurchaseOrderViewComponent, {
      initialState: {
        initialState,
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.onPrint.subscribe((result) => {
      window.scrollTo(0, 0);
      var data = document.getElementById("contentToConvert");

      html2canvas(data).then((canvas) => {
        this.modalRef.hide();
        var imgWidth = 208;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL("image/png");
        let pdf = new jspdf("p", "mm", "a4");

        var position = 10;
        pdf.addImage(
          contentDataURL,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        pdf.save(`Purchase Order ${this.MRONo}.pdf`);
        this.hideAddress = true;
      });
    });
  }

  sendEmailPO(POId) {
    const initialState = { POId };
    this.modalRef = this.CommonmodalService.show(PurchaseOrderViewComponent, {
      initialState: {
        initialState,
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.onPrint.subscribe((result) => {
      window.scrollTo(0, 0);
      var data = document.getElementById("contentToConvert");

      html2canvas(data).then((canvas) => {
        var imgWidth = 208;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL("image/png");
        let pdf = new jspdf("p", "mm", "a4");

        var position = 10;
        pdf.addImage(
          contentDataURL,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        let base64PDF = pdf.output("datauristring");
        let ImportedAttachment = {
          path: base64PDF,
          filename: `Purchase Order ${this.MRONo}.pdf`,
        };
        // pdf.save('purchase-order.pdf');

        var MROId = this.MROId;
        var IdentityId = POId;
        var IdentityType = CONST_IDENTITY_TYPE_PO;
        var followupName = "Purchase Order";
        this.modalRef.hide();
        this.modalRef = this.CommonmodalService.show(MroEmailComponent, {
          initialState: {
            data: {
              followupName,
              IdentityId,
              IdentityType,
              MROId,
              ImportedAttachment,
            },
            class: "modal-lg",
          },
          class: "gray modal-lg",
        });

        this.modalRef.content.closeBtnName = "Close";

        this.modalRef.content.event.subscribe((res) => {
          this.reLoad();
        });
        this.hideAddress = true;
      });
    });
  }
  //Email
  sendEmailInvoice(InvoiceId) {
    var RRId = this.RRId;
    var IdentityId = InvoiceId;
    var IdentityType = CONST_IDENTITY_TYPE_INVOICE;
    var followupName = "Invoice";
    this.modalRef = this.CommonmodalService.show(MroEmailComponent, {
      initialState: {
        data: { followupName, IdentityId, IdentityType, RRId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  updateVendorReference(RRVendorId, e) {
    if (e.VendorRefNo == "") {
      return false;
    }

    var postData = {
      RRVendorId: RRVendorId,
      VendorRefNo: e.target.value,
    };
    this.service.postHttpService(postData, "UpdateRRVendorRefNo").subscribe(
      (response) => {
        if (response.status == true) {
          //this.reLoad();
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  deleteQuotes(QuoteId, i) {
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
          QuoteId: QuoteId,
        };
        this.service
          .postHttpService(postData, "DeleteQuote")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "Quote has been deleted.",
                type: "success",
              });
              this.QuoteInfo.splice(i, 1);
              this.reLoad();
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Quote is safe:)",
          type: "error",
        });
      }
    });
  }
}
