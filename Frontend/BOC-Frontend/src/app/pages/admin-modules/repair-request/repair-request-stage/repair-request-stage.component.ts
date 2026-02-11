import {
  Component,
  OnInit,
  ChangeDetectorRef,
  EventEmitter,
  ElementRef,
  ViewChild,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ValidationErrors,
} from "@angular/forms";
import Swal from "sweetalert2";
import { CommonService } from "src/app/core/services/common.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import {
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { QrCodeComponent } from "../../common-template/qr-code/qr-code.component";
import { FollowupComponent } from "../../common-template/followup/followup.component";
import { RRAddAttachmentComponent } from "../../common-template/rr-add-attachment/rr-add-attachment.component";
import { AddNotesComponent } from "../../common-template/add-notes/add-notes.component";
import { VendorQuoteAttachmentComponent } from "../../common-template/vendor-quote-attachment/vendor-quote-attachment.component";
import { ShipComponent } from "../../common-template/ship/ship.component";
import { AddReferenceComponent } from "../../common-template/add-reference/add-reference.component";
import { RrCurrentHistoryComponent } from "../../common-template/rr-current-history/rr-current-history.component";
import { ReceiveToShipComponent } from "../../common-template/receive-to-ship/receive-to-ship.component";
import { RrShippingHistoryComponent } from "../../common-template/rr-shipping-history/rr-shipping-history.component";
import { ShipToVendorComponent } from "../../common-template/ship-to-vendor/ship-to-vendor.component";
import { EditNotesComponent } from "../../common-template/edit-notes/edit-notes.component";
import { RrEditAttachmentComponent } from "../../common-template/rr-edit-attachment/rr-edit-attachment.component";
import { VendorQuoteComponent } from "../../common-template/vendor-quote/vendor-quote.component";
import { ViewFollowupComponent } from "../../common-template/view-followup/view-followup.component";
import {
  attachment_thumb_images,
  CONST_IDENTITY_TYPE_CUSTOMER,
  CONST_IDENTITY_TYPE_VENDOR,
  CONST_IDENTITY_TYPE_RR,
  CONST_IDENTITY_TYPE_QUOTE,
  CONST_IDENTITY_TYPE_SO,
  CONST_IDENTITY_TYPE_PO,
  CONST_IDENTITY_TYPE_INVOICE,
  array_rr_status,
  vendor_reject_reasons,
  CONST_VIEW_ACCESS,
  CONST_CREATE_ACCESS,
  CONST_MODIFY_ACCESS,
  CONST_DELETE_ACCESS,
  CONST_APPROVE_ACCESS,
  CONST_VIEW_COST_ACCESS,
  CONST_ACCESS_LIMIT,
  CONST_AH_Group_ID,
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
  CONST_RRS_GENERATED,
  CONST_RRS_NEED_SOURCED,
  CONST_RRS_AWAIT_VQUOTE,
  CONST_RRS_NEED_RESOURCED,
  CONST_RRS_QUOTE_SUBMITTED,
  CONST_RRS_IN_PROGRESS,
  CONST_RRS_QUOTE_REJECTED,
  CONST_RRS_COMPLETED,
  CONST_RRS_NOT_REPAIRABLE,
  Const_Alert_pop_title,
  Const_Alert_pop_message,
  CONST_ShipAddressType,
  CONST_COST_HIDE_VALUE,
  CONST_BillAddressType,
  warranty_type,
  VAT_field_Name,
} from "src/assets/data/dropdown";
import { CustomerQuoteComponent } from "../../common-template/customer-quote/customer-quote.component";
import { DatePipe } from "@angular/common";
import { AddRrPartsComponent } from "../../common-template/add-rr-parts/add-rr-parts.component";
import { UpsIntegrationComponent } from "../../common-template/ups-integration/ups-integration.component";
import { AddWarrantyComponent } from "../../common-template/add-warranty/add-warranty.component";
import { EditWarrantyComponent } from "../../common-template/edit-warranty/edit-warranty.component";
import { CustomerReferenceComponent } from "../../common-template/customer-reference/customer-reference.component";
import { PartCurrentLocationHistoryComponent } from "../../common-template/part-current-location-history/part-current-location-history.component";
import { UpdatePartCurrentLocationComponent } from "../../common-template/update-part-current-location/update-part-current-location.component";
import { RejectAndResourceComponent } from "../../common-template/reject-and-resource/reject-and-resource.component";
import { RejectCustomerQuoteComponent } from "../../common-template/reject-customer-quote/reject-customer-quote.component";
import { RrNotRepairableComponent } from "../../common-template/rr-not-repairable/rr-not-repairable.component";
import { RrVendorInvoiceComponent } from "../../common-template/rr-vendor-invoice/rr-vendor-invoice.component";
import { EmailComponent } from "../../common-template/email/email.component";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import { PurchaseOrderViewComponent } from "../../common-template/purchase-order-view/purchase-order-view.component";
import { SalesQuotePrintComponent } from "../../common-template/sales-quote-print/sales-quote-print.component";
import { SalesOrderPrintComponent } from "../../common-template/sales-order-print/sales-order-print.component";
import { InvoicePrintComponent } from "../../common-template/invoice-print/invoice-print.component";
import { Location } from "@angular/common";
import { RevertComponent } from "../../common-template/revert/revert.component";
import { RevertHistoryComponent } from "../../common-template/revert-history/revert-history.component";
import { AddPartToInventoryComponent } from "../../common-template/add-part-to-inventory/add-part-to-inventory.component";
import { EditReferenceComponent } from "../../common-template/edit-reference/edit-reference.component";
import { config } from "rxjs";
import { Button } from "protractor";
import { BlanketPoCustomerComponent } from "../../common-template/blanket-po-customer/blanket-po-customer.component";
import { BlanketPoCustomerEditComponent } from "../../common-template/blanket-po-customer-edit/blanket-po-customer-edit.component";
import { RRFollowupNotesComponent } from "../../common-template/rr-followup-notes/rr-followup-notes.component";
import { UpdatePreferredVendorComponent } from "../../common-template/update-preferred-vendor/update-preferred-vendor.component";
import { RrEditPartLocationComponent } from "../../common-template/rr-edit-part-location/rr-edit-part-location.component";
import { PartLocationHistoryComponent } from "../../common-template/part-location-history/part-location-history.component";
import { SubstatusHistoryComponent } from "../../common-template/substatus-history/substatus-history.component";
import { AssigneeHistoryComponent } from "../../common-template/assignee-history/assignee-history.component";
import { BulkSubstatusAssignEditComponent } from "../../common-template/bulk-substatus-assign-edit/bulk-substatus-assign-edit.component";
import { InventoryShopComponent } from "../../common-template/inventory-shop/inventory-shop.component";
import { LockVendorShippingAddComponent } from "../lock-vendor-shipping-add/lock-vendor-shipping-add.component";
import { GmRepairTrackerComponent } from "../gm-repair-tracker/gm-repair-tracker.component";
import { ViewGmRepairTrackerComponent } from "../view-gm-repair-tracker/view-gm-repair-tracker.component";
import { WorksheetRepairTrackerComponent } from "../worksheet-repair-tracker/worksheet-repair-tracker.component";
import { LocalStorageService } from "../../inventory/local-storage.service";
import { OutgoingRepairTrackerComponent } from "../outgoing-repair-tracker/outgoing-repair-tracker.component";
import { OutgoingRepairTrackerSideComponent } from "../outgoing-repair-tracker-side/outgoing-repair-tracker-side.component";
import { IncomingRepairTrackerSideComponent } from "../incoming-repair-tracker-side/incoming-repair-tracker-side.component";
import { FileSaverService } from "ngx-filesaver";

@Component({
  selector: "app-repair-request-stage",
  templateUrl: "./repair-request-stage.component.html",
  styleUrls: ["./repair-request-stage.component.scss"],
  host: { "[class.example]": "true" },
  providers: [NgbModalConfig, NgbModal],
})
export class RepairRequestStageComponent implements OnInit {
  editMode = false;
  IsReverted;
  preferredvendorMessage;
  array_rr_status;
  vendor_reject_reasons;
  customer_quote_reject_reasons;
  ReceiveName;
  ShipToIdentityName;
  ShipFromIdentityName;
  AddressData;
  shippingDetails;
  AddVendorbtnDisabled: boolean = false;

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
  NotRepairableEnabled;
  RevertShippingEnabled;
  CustomerReferenceAddEnabled;
  CustomerReferenceDeleteEnabled;
  CustomerReferenceViewEnabled;
  // Get the values for Access Rights
  VIEW_ACCESS = CONST_VIEW_ACCESS;
  CREATE_ACCESS = CONST_CREATE_ACCESS;
  MODIFY_ACCESS = CONST_MODIFY_ACCESS;
  DELETE_ACCESS = CONST_DELETE_ACCESS;
  APPROVE_ACCESS = CONST_APPROVE_ACCESS;
  VIEW_COST_ACCESS = CONST_VIEW_COST_ACCESS;
  ACCESS_LIMIT = CONST_ACCESS_LIMIT;
  IsDeleteEnabled;
  // RR Status
  RRS_GENERATED = CONST_RRS_GENERATED; //0
  RRS_NEED_SOURCED = CONST_RRS_NEED_SOURCED; //1
  RRS_AWAIT_VQUOTE = CONST_RRS_AWAIT_VQUOTE; //2
  RRS_NEED_RESOURCED = CONST_RRS_NEED_RESOURCED; //3
  RRS_QUOTE_SUBMITTED = CONST_RRS_QUOTE_SUBMITTED; //4
  RRS_IN_PROGRESS = CONST_RRS_IN_PROGRESS; //5
  RRS_QUOTE_REJECTED = CONST_RRS_QUOTE_REJECTED; //6
  RRS_COMPLETED = CONST_RRS_COMPLETED; //7
  RRS_NOT_REPAIRABLE = CONST_RRS_NOT_REPAIRABLE; //8

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
  CustomerName;
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
  VendorInvoiceId;
  CustomerInvoiceNo;
  VendorInvoiceNo;
  CustomerSODueDate;
  VendorPODueDate;
  CustomerInvoiceDueDate;
  VendorInvoiceDueDate;
  RRDescription;
  LeadTime;
  IsSOApproved;
  IsPoApproved;
  IsInvoiceApproved;
  IsVendorBillApproved;
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
  isLoading: boolean = false;
  departmentList;
  assetList;
  customerReferenceList: any = [];
  partList;
  adminList;
  admin;
  PriorityNotes = "";

  repairMessage = "";

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
  RRVendorAttachmentList: any = [];
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
  RRNotesInfo: any = [];
  FollowupNotesInfo: any = [];
  AttachmentList: any = [];
  VendorFollowup: any = [];
  ShippingStatus;
  RRStatusHistory;
  RRRevertHistory;
  ShippingIdentityType;
  RRShippingHistory: any = [];
  attachmentThumb;
  showsave: boolean = true;
  spinner: boolean = false;
  spinnerPDF: boolean = false;
  showPDFIcon: boolean = false;
  incomingView: boolean = false;
  outgoingView: boolean = false;
  disablesave: boolean = false;
  RRGMTrackerInfo = [];

  ShippingIdentityId;
  CONST_AH_Group_ID;
  FromIdentityName;
  ToIdentityName;
  ReceiveIdentityTypeName;

  // Button Enable/Disable
  showAddWarranty = false;
  ahAddress;
  vendoraddress;

  keyword = "CompanyName";
  CompanyName;
  IsEditCusRefEnabled;

  CreatedBy;
  @ViewChild("videoPlayer", { static: false }) videoplayer: any;
  public startedPlay: boolean = false;
  public show: boolean = false;
  RRCustomerAttachment: any = [];
  RevertStatusForRR;
  WarrantyList: any = [];
  ApprovedQuoteInfo;
  IsDisplayBaseCurrencyValue;
  Symbol;
  BaseCurrencySymbol;
  VAT_field_Name;
  PONExchangeRate = 1;
  IsActive;
  ActiveInActiveRREnable: boolean = false;
  subStatusList: any = [];
  SubStatusId;
  AssigneeUserId;
  RRPartLocation;
  RRPartLocationId;
  SubStatusName;
  AssigneeName;
  RRSubStatusEdit: boolean = false;
  RRAssignToEdit: boolean = false;
  RRSubStatusView: boolean = false;
  RRAssignToView: boolean = false;
  RRPartLocationEdit: boolean = false;
  RRPartLocationView: boolean = false;
  RRSubStatusDelete: boolean = false;
  RRAssignToDelete: boolean = false;
  RRPartLocationDelete: boolean = false;
  RRSubStatusAdd: boolean = false;
  RRAssignToAdd: boolean = false;
  RRPartLocationAdd: boolean = false;
  GMRepairTrackerInfoAdd: boolean;
  GMRepairTrackerInfoEdit: boolean;
  GMRepairTrackerInfoDelete: boolean;
  GMRepairTrackerInfoView: boolean;
  Worksheet: any;
  IncomingChecklistAdd: boolean = true;
  IncomingChecklistEdit: boolean = false;
  OutgoingChecklistAdd: boolean = true;
  OutgoingChecklistEdit: boolean = false;
  MovePartsToStoreFromRRView: boolean = false;
  selectedworksheet: any;
  PartsMovedToStore: number = 0;
  VendorQuoteAttachment: any;
  suggestedVendors: any;
  constructor(
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    public router: Router,
    private modalService: NgbModal,
    public navCtrl: NgxNavigationWithDataComponent,
    private service: CommonService,
    private datePipe: DatePipe,
    private CommonmodalService: BsModalService,
    public modalRef: BsModalRef,
    private location: Location,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private _FileSaverService: FileSaverService
  ) { }

  currentRouter = decodeURIComponent(this.router.url);
  ngOnInit() {
    document.title = "RR Edit";
    this.VAT_field_Name = VAT_field_Name;
    this.IsDisplayBaseCurrencyValue = localStorage.getItem(
      "IsDisplayBaseCurrencyValue"
    );
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol");
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Repair Requests", path: "/admin/repair-request/list/" },
      { label: "Edit", path: "/", active: true },
    ];
    this.CreatedBy = localStorage.getItem("UserId");
    this.attachmentThumb = attachment_thumb_images;
    // this.selectedworksheet = this.localStorageService.getData('selectedworksheet');
    // if(this.selectedworksheet == null){
    //   this.IncomingChecklistAdd = true;
    //   this.IncomingChecklistEdit = false;
    // }else{
    //   this.IncomingChecklistAdd = false;
    //   this.IncomingChecklistEdit = true;
    // }
    if (history.state.RRId == undefined) {
      this.route.queryParams.subscribe((params) => {
        this.RRId = params["RRId"];
      });
    } else if (history.state.RRId != undefined) {
      this.RRId = history.state.RRId;
    }
    this.array_rr_status = array_rr_status;
    this.WarrantyList = warranty_type;

    // Redirect to the List page if the View Id is not available
    if (this.RRId == "" || this.RRId == "undefined" || this.RRId == null) {
      this.navCtrl.navigate("/admin/repair-request/list/");
      return false;
    }
    this.attachmentThumb = attachment_thumb_images;
    this.ahAddress = "";
    this.vendoraddress = "";
    // Access Rights
    this.accessRights = JSON.parse(localStorage.getItem("accessRights"));

    this.RR = this.accessRights["RR"].split(",");
    this.RRVerify = this.accessRights["RRVerify"].split(",");
    this.RRAssignVendor = this.accessRights["RRAssignVendor"].split(",");
    this.RRVendorQuote = this.accessRights["RRVendorQuote"].split(",");
    this.RRCustomerQuote = this.accessRights["RRCustomerQuote"].split(",");
    this.RRShipParts = this.accessRights["RRShipParts"].split(",");
    this.RRReceiveParts = this.accessRights["RRReceiveParts"].split(",");
    this.RRTrackUPS = this.accessRights["RRTrackUPS"].split(",");
    this.RRWarranty = this.accessRights["RRWarranty"].split(",");
    this.RRDuplicate = this.accessRights["RRDuplicate"].split(",");
    this.RRSalesOrder = this.accessRights["RRSalesOrder"].split(",");
    this.RRPurchaseOrder = this.accessRights["RRPurchaseOrder"].split(",");
    this.RRSalesInvoice = this.accessRights["RRSalesInvoice"].split(",");
    this.RRVendorBill = this.accessRights["RRVendorBill"].split(",");
    this.RRComplete = this.accessRights["RRComplete"].split(",");
    this.RRCustomerFollowup =
      this.accessRights["RRCustomerFollowup"].split(",");
    this.RRVendorFollowup = this.accessRights["RRVendorFollowup"].split(",");
    this.RRNotes = this.accessRights["RRNotes"].split(",");
    this.RRAtachment = this.accessRights["RRAtachment"].split(",");
    this.CustomerReference = this.accessRights["CustomerReference"].split(",");
    this.IsEditCusRefEnabled = this.service.permissionCheck(
      "CustomerReference",
      CONST_MODIFY_ACCESS
    );
    this.IsDeleteEnabled = this.service.permissionCheck(
      "RR",
      CONST_DELETE_ACCESS
    );

    this.NotRepairableEnabled = this.service.permissionCheck(
      "NotRepairable",
      this.VIEW_ACCESS
    );
    this.RevertShippingEnabled = this.service.permissionCheck(
      "RevertShipping",
      this.VIEW_ACCESS
    );
    this.CustomerReferenceAddEnabled = this.service.permissionCheck(
      "CustomerReference",
      this.CREATE_ACCESS
    );
    this.CustomerReferenceDeleteEnabled = this.service.permissionCheck(
      "CustomerReference",
      this.DELETE_ACCESS
    );
    this.CustomerReferenceViewEnabled = this.service.permissionCheck(
      "CustomerReference",
      this.VIEW_ACCESS
    );
    this.RevertStatusForRR = this.service.permissionCheck(
      "RevertStatusForRR",
      this.VIEW_ACCESS
    );

    this.ActiveInActiveRREnable = this.service.permissionCheck(
      "ActiveInActiveRR",
      this.VIEW_ACCESS
    );
    this.RRSubStatusEdit = this.service.permissionCheck(
      "RRSubStatus",
      CONST_MODIFY_ACCESS
    );
    this.RRAssignToEdit = this.service.permissionCheck(
      "RRAssignTo",
      CONST_MODIFY_ACCESS
    );
    this.RRSubStatusView = this.service.permissionCheck(
      "RRSubStatus",
      CONST_VIEW_ACCESS
    );
    this.RRAssignToView = this.service.permissionCheck(
      "RRAssignTo",
      CONST_VIEW_ACCESS
    );
    this.RRPartLocationEdit = this.service.permissionCheck(
      "RRPartLocation",
      CONST_MODIFY_ACCESS
    );
    this.RRPartLocationView = this.service.permissionCheck(
      "RRPartLocation",
      CONST_VIEW_ACCESS
    );

    this.RRSubStatusDelete = this.service.permissionCheck(
      "RRSubStatus",
      CONST_DELETE_ACCESS
    );
    this.RRAssignToDelete = this.service.permissionCheck(
      "RRAssignTo",
      CONST_DELETE_ACCESS
    );
    this.RRPartLocationDelete = this.service.permissionCheck(
      "RRPartLocation",
      CONST_DELETE_ACCESS
    );
    this.RRSubStatusAdd = this.service.permissionCheck(
      "RRSubStatus",
      CONST_CREATE_ACCESS
    );
    this.RRAssignToAdd = this.service.permissionCheck(
      "RRAssignTo",
      CONST_CREATE_ACCESS
    );
    this.RRPartLocationAdd = this.service.permissionCheck(
      "RRPartLocation",
      CONST_CREATE_ACCESS
    );

    this.GMRepairTrackerInfoAdd = this.service.permissionCheck(
      "GMRepairTrackerInfo",
      CONST_CREATE_ACCESS
    );
    this.GMRepairTrackerInfoEdit = this.service.permissionCheck(
      "GMRepairTrackerInfo",
      CONST_MODIFY_ACCESS
    );
    this.GMRepairTrackerInfoDelete = this.service.permissionCheck(
      "GMRepairTrackerInfo",
      CONST_DELETE_ACCESS
    );
    this.GMRepairTrackerInfoView = this.service.permissionCheck(
      "GMRepairTrackerInfo",
      CONST_VIEW_ACCESS
    );
    this.MovePartsToStoreFromRRView = this.service.permissionCheck(
      "MovePartsToStoreFromRR",
      CONST_VIEW_ACCESS
    );

    this.CONST_AH_Group_ID = CONST_AH_Group_ID;
    this.EditForm = this.fb.group({
      CustomerId: [""],
      CompanyName: ["", Validators.required],
      DepartmentId: [""],
      AssetId: [""],
      CustomerShipToId: [""],
      CustomerBillToId: [""],
      PartId: ["", Validators.required],
      RRPartsId: [""],
      IsRushRepair: [false],
      IsCriticalSpare: [false],
      IsWarrantyRecovery: [""],
      IsRepairTag: [false],
      IsWarrantyDenied: [false],
      RRDescription: ["", Validators.required],
      StatedIssue: ["", Validators.required],

      UserId: [""],
      ContactPhone: [""],
      ContactEmail: [""],
      LeadTime: [""],
      CustomerPartNo1: [""],
      CustomerPartNo2: [""],
      CustomerPONo: [""],
      CustomerSONo: [""],
      VendorPONo: [""],
      CustomerInvoiceNo: [""],
      VendorInvoiceNo: [""],
      CustomerSODueDate: [""],
      VendorPODueDate: [""],
      CustomerInvoiceDueDate: [""],
      VendorInvoiceDueDate: [""],

      PartNo: [""],
      Price: [""],
      Rate: [""],
      Description: [""],
      Manufacturer: [""],
      ManufacturerPartNo: [""],
      SerialNo: ["", Validators.required],
      Quantity: ["", Validators.required],
    });

    this.getCountryList();
    this.getViewContent();
    this.getAdminList();
    this.getSubStatusList();
    this.LocationName = localStorage.getItem("LocationName");
    this.Location = localStorage.getItem("Location");

    //
    this.localStorageService.removeData("selectedincomingWorksheet");
  }
  pauseVideo(videoplayer) {
    videoplayer.nativeElement.play();
    // this.startedPlay = true;
    // if(this.startedPlay == true)
    // {
    setTimeout(() => {
      videoplayer.nativeElement.pause();
      if (videoplayer.nativeElement.paused) {
        this.show = !this.show;
      }
    }, 5000);
    // }
  }

  //AutoSuggestuiion for customer
  selectEvent($event) {
    this.getCustomerProperties($event.CustomerId, $event.PriorityNotes);
    this.getCustomerAddressList($event.CustomerId),
      this.EditForm.patchValue({
        CustomerId: $event.CustomerId,
        CompanyName: $event.CompanyName,
      });
  }

  onChangeSearch(val: string) {
    if (val) {
      this.isLoading = true;
      var postData = {
        Customer: val,
      };
      this.service.postHttpService(postData, "getAllAutoComplete").subscribe(
        (response) => {
          if (response.status == true) {
            this.CustomerList = response.responseData;
            this.customerList = this.CustomerList.filter((a) =>
              a.CompanyName.toLowerCase().includes(val.toLowerCase())
            );
          } else {
          }
          this.isLoading = false;
          this.cd_ref.detectChanges();
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      );
    }
  }
  clearEvent($event) {
    this.EditForm.patchValue({
      CustomerId: "",
      CompanyName: "",
    });
    // console.log(this.EditFormControl)
  }

  onFocused(e, i) {
    // do something when input is focused
  }
  partCurrentLocation() {
    this.shippingDetails =
      this.RRShippingHistory[this.viewResult.RRShippingHistory.length - 1];
    this.ShipToIdentityName = this.shippingDetails.ShipToIdentityName;
    this.ShipFromIdentityName = this.shippingDetails.ShipFromIdentityName;
    this.ShipFromAddressId = this.shippingDetails.ShipFromAddressId;

    if (this.ShipToIdentityName == "Vendor") {
      this.ReceiveIdentityType = 2;
      this.ReceiveName = this.viewResult.RRInfo[0].VendorName;
      // if (this.vendorList.length > 0) {
      //   this.ReceiveName = this.vendorList.find(a => a.VendorId == this.shippingDetails.ShipToId).VendorName;
      // }
    } else {
      this.ReceiveIdentityType = 1;
      this.ReceiveName = this.CompanyName;
      // if (this.CustomerList.length > 0) {
      // }
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
            title: `${value.StreetAddress} ${value.SuiteOrApt}, ${value.City}, ${value.StateName}, ${value.CountryName}, - ${value.Zip}`,
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

  getExchangeRate(From, To) {
    var postData = {
      LocalCurrencyCode: From,
      BaseCurrencyCode: To,
    };
    this.service.postHttpService(postData, "Exchange").subscribe(
      (response) => {
        if (response.status == true) {
          this.PONExchangeRate = response.responseData.ExchangeRate;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }
  getViewContent() {
    var postData = {
      RRId: this.RRId,
    };
    this.service.postHttpService(postData, "RepairRequestView").subscribe(
      (response) => {
        if (response.status == true) {
          this.viewResult = response.responseData;
          this.RRInfo = this.viewResult.RRInfo;
          this.SubStatusId = this.RRInfo[0].SubStatusId;
          this.AssigneeUserId = this.RRInfo[0].AssigneeUserId;
          this.RRPartLocation = this.RRInfo[0].RRPartLocation;
          this.RRPartLocationId = this.RRInfo[0].RRPartLocationId;
          this.SubStatusName = this.RRInfo[0].SubStatusName;
          this.AssigneeName = this.RRInfo[0].AssigneeUserName;
          this.IsActive = this.RRInfo[0].IsActive;
          this.Symbol = this.RRInfo[0].CustomerCurrencySymbol;
          this.Status = this.viewResult.RRInfo[0].Status;
          this.IsReverted = this.viewResult.RRInfo[0].IsReverted;
          this.CustomerName = this.viewResult.RRInfo[0].CompanyName;
          //this.checkInventoryShopMove(response.responseData.ShopPartItems);
          this.PartsMovedToStore = this.RRInfo[0].IsPartMovedToStore;

          if (
            this.RRInfo[0].CustomerCurrencyCode &&
            this.RRInfo[0].DefaultCurrency
          ) {
            this.getExchangeRate(
              this.RRInfo[0].CustomerCurrencyCode,
              this.RRInfo[0].DefaultCurrency
            );
          }
          if (this.Status == this.RRS_GENERATED) {
            this.EditForm.patchValue({
              CompanyName: this.viewResult.RRInfo[0].CompanyName,
              CustomerId: this.viewResult.RRInfo[0].CustomerId,
              DepartmentId: this.viewResult.RRInfo[0].DepartmentId,
              AssetId: this.viewResult.RRInfo[0].AssetId,
              UserId: this.viewResult.RRInfo[0].UserId,
              ContactPhone: this.viewResult.RRInfo[0].ContactPhone,
              ContactEmail: this.viewResult.RRInfo[0].ContactEmail,
              IsRushRepair: this.viewResult.RRInfo[0].IsRushRepair,
              IsWarrantyRecovery: this.viewResult.RRInfo[0].IsWarrantyRecovery,
              IsRepairTag: this.viewResult.RRInfo[0].IsRepairTag,
              IsWarrantyDenied: this.viewResult.RRInfo[0].IsWarrantyDenied,
              RRDescription: this.getReplace(
                this.viewResult.RRInfo[0].RRDescription
              ),
              StatedIssue: this.viewResult.RRInfo[0].StatedIssue,

              CustomerPONo: this.viewResult.RRInfo[0].CustomerPONo,
              CustomerShipToId: this.viewResult.RRInfo[0].CustomerShipToId,
              CustomerBillToId: this.viewResult.RRInfo[0].CustomerBillToId,
              CustomerSONo: this.viewResult.RRInfo[0].CustomerSONo,
              VendorPONo: this.viewResult.RRInfo[0].VendorPONo,
              CustomerInvoiceNo: this.viewResult.RRInfo[0].CustomerInvoiceNo,
              VendorInvoiceNo: this.viewResult.RRInfo[0].VendorInvoiceNo,
              VendorPODueDate: this.VendorPODueDate,
              CustomerSODueDate: this.CustomerSODueDate,
              CustomerInvoiceDueDate: this.CustomerInvoiceDueDate,
              VendorInvoiceDueDate: this.VendorInvoiceDueDate,
            });
          }
          this.vendorList = this.viewResult.PreferredVendorList;
          this.RRGMTrackerInfo = this.viewResult.RRGMTracker;

          if (this.vendorList == "") {
            this.vendorList = [];
            this.preferredvendorMessage = "Error";
          } else {
            // this.vendorList = this.viewResult.PreferredVendorList
            this.vendorList = this.viewResult.PreferredVendorList.map(function (
              value
            ) {
              var select_title = value.VendorName;
              if (value.VendorTypeName == "OEM") {
                select_title = select_title + " (OEM)";
              }
              if (value.Directed != "-") {
                select_title = select_title + " - Directed Vendor";
              }
              return { title: select_title, VendorId: value.VendorId };

              /* if (value.Directed == '-' && value.VendorTypeName == '-') {
               return { title: value.VendorName, VendorId: value.VendorId }
             }
             else if (value.Directed != '-' && value.VendorTypeName == 'OEM') {
               return { title: value.VendorName + ' (' + (value.VendorTypeName == 'OEM' ? value.VendorTypeName : '') + ')' + " - Directed Vendor", "VendorId": value.VendorId }
             }
             else if (value.Directed != '-' && value.VendorTypeName == '-') {
               return { title: value.VendorName + " - Directed Vendor", "VendorId": value.VendorId }
             }
             else if (value.Directed == '-' && value.VendorTypeName == 'OEM') {
               return { title: value.VendorName + ' (' + (value.VendorTypeName == 'OEM' ? value.VendorTypeName : '') + ')', "VendorId": value.VendorId }
             }*/
            });
          }

          // For QR Code
          this.RRNo = this.viewResult.RRInfo[0].RRNo;
          this.CustomerId = this.viewResult.RRInfo[0].CustomerId;
          this.PriorityNotes = this.viewResult.RRInfo[0].PriorityNotes;
          this.StatusName = this.viewResult.RRInfo[0].StatusName;
          this.ShippingStatus = this.viewResult.RRInfo[0].ShippingStatus;
          this.ShippingIdentityType =
            this.viewResult.RRInfo[0].ShippingIdentityType;
          this.ShippingIdentityId =
            this.viewResult.RRInfo[0].ShippingIdentityId;
          this.VendorPONo = this.viewResult.RRInfo[0].VendorPONo;
          this.IsAllowQuoteBeforeShip =
            this.viewResult.RRInfo[0].IsAllowQuoteBeforeShip;

          this.CustomerPONo = this.viewResult.RRInfo[0].CustomerPONo || "";
          this.CustomerSONo = this.viewResult.RRInfo[0].CustomerSONo || "";
          this.CustomerInvoiceNo =
            this.viewResult.RRInfo[0].CustomerInvoiceNo || "";
          this.VendorInvoiceNo =
            this.viewResult.RRInfo[0].VendorInvoiceNo || "";
          this.IsPoApproved = this.viewResult.RRInfo[0].IsPoApproved || 0;
          this.IsSOApproved = this.viewResult.RRInfo[0].IsSOApproved || 0;
          this.IsInvoiceApproved =
            this.viewResult.RRInfo[0].IsInvoiceApproved || 0;
          this.IsVendorBillApproved =
            this.viewResult.RRInfo[0].IsVendorBillApproved || 0;
          this.VendorPOId = this.viewResult.RRInfo[0].VendorPOId || "";
          this.CustomerSOId = this.viewResult.RRInfo[0].CustomerSOId || "";
          this.CustomerInvoiceId =
            this.viewResult.RRInfo[0].CustomerInvoiceId || "";
          this.VendorInvoiceId =
            this.viewResult.RRInfo[0].VendorInvoiceId || "";

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
          this.CustomerBillToId =
            this.viewResult.RRInfo[0].CustomerBillToId || "";

          this.VendorsInfo = this.viewResult.VendorsInfo || [];
          this.VendorPartsInfo = this.viewResult.VendorPartsInfo || [];

          this.QuoteInfo = this.viewResult.QuoteInfo || [];
          this.QuoteItems = this.viewResult.QuoteItems || [];

          this.ApprovedQuoteInfo = this.viewResult.ApprovedQuoteInfo || [];
          this.ApprovedQuoteItems = this.viewResult.ApprovedQuoteItems || [];

          this.CustomerRefInfo = this.viewResult.CustomerRefInfo || [];
          this.RRStatusHistory = this.viewResult.RRStatusHistory || [];
          this.RRRevertHistory = this.viewResult.RevertLog[0];
          this.RRShippingHistory = this.viewResult.RRShippingHistory || [];
          this.RRPartsInfo = this.viewResult.RRPartsInfo || [];
          this.RRNotesInfo = this.viewResult.RRNotesInfo || [];
          this.FollowupNotesInfo = this.viewResult.RRFollowUpNotes[0] || [];
          this.AttachmentList = this.viewResult.AttachmentList || [];
          this.RRCustomerAttachment =
            this.viewResult.RRCustomerAttachment[0] || [];
          this.VendorFollowup = this.viewResult.FollowUpHistory || [];
          this.WarrantyInfo = this.viewResult.WarrantyInfo || [];
          this.VendorQuoteAttachment =
            this.viewResult.VendorQuoteAttachment || null;
          if (this.viewResult.RRShippingHistory.length > 0) {
            this.partCurrentLocation();
          }
          // Get the Shipping Track Number
          if (this.viewResult.RRShippingHistory.length > 0) {
            for (let val of this.viewResult.RRShippingHistory) {
              if (val.TrackingNo && val.IsShipViaUPS == 1)
                this.RRTracking.push(val.TrackingNo);
            }
            this.trackingNumber = this.RRTracking[this.RRTracking.length - 1];
          }

          // Approved Vendor Details
          this.VendorId = this.viewResult.RRInfo[0].VendorId;
          this.RRVendorId = this.viewResult.RRInfo[0].RRVendorId;
          this.VendorSize = this.viewResult.VendorsInfo.length;
          if (this.VendorId > 0) {
            this.addButton = false;
            this.VendorName = this.viewResult.RRInfo[0].VendorName;
            this.VendorCode = this.viewResult.RRInfo[0].VendorCode;
          } else {
            this.addButton = true;
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
            this.getAHaddress();
          }
          //Dropdown values from RRview
          this.assetList = this.viewResult.CustomerAssetList;
          this.departmentList = this.viewResult.CustomerDeptList;
          this.customerReferenceList = this.viewResult.CReferenceLabelList;
          this.customerAddressList = this.viewResult.CustomerAddressList.map(
            function (value) {
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
            }
          );

          if (this.Status == this.RRS_GENERATED) {
            this.getPartList(this.CustomerId);
            // this.getCustomerProperties(this.viewResult.RRInfo[0].CustomerId, { "PriorityNotes": this.PriorityNotes });
            // this.getCustomerAddressList(this.viewResult.RRInfo[0].CustomerId);
          }
          /********** RR Notes Group - Start ***********/
          if (this.viewResult.RRNotesInfo.length > 0) {
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
            this.notesArr = groupBy(this.viewResult.RRNotesInfo, "NotesType");
          }
          if (this.viewResult.RRImages.length > 0) {
            for (let val of this.viewResult.RRImages) {
              let img = val.ImagePath;
              let RRImageId = val.RRImageId;
              let IsPrimaryImage = val.IsPrimaryImage;
              this.RRImages.push({ img, RRImageId, IsPrimaryImage });
            }
            this.currentImage = new FormControl(this.RRImages[0]);
          }

          this.RRVendorAttachmentList =
            this.viewResult.RRVendorAttachmentList[0];
          // console.log(this.RRVendorAttachmentList)
          /********** RR Notes Group - End ***********/

          if (this.Status > 0) {
            this.showVendor = true;

            // Set the Vendor ID
            if (this.viewResult.VendorsInfo.length > 0) {
              // Vendor is assigned
              //this.VendorId = this.viewResult.VendorsInfo[0].VendorId;
              //this.VendorName = this.viewResult.VendorsInfo[0].VendorName;
              /* this.RRVendorId = this.viewResult.VendorsInfo[0].RRVendorId;
            this.VendorGrandTotal = this.viewResult.VendorsInfo[0].GrandTotal;
            this.VendorStatus = this.viewResult.VendorsInfo[0].Status;
            this.VendorRouteCause = this.viewResult.VendorsInfo[0].RouteCause;
            this.VendorLeadTime = this.viewResult.VendorPartsInfo[0].LeadTime; */

              this.selectedVendor = true;
            } else {
              // Vendor is not assigned
              this.addButton = true;
              this.selectedVendor = false;
            }
          } else {
            //this.getPartDetails(this.viewResult.RRPartsInfo[0].PartId);
          }

          if (this.viewResult.QuoteInfo.length > 0) {
            // Customer quote is created
            for (var i = 0; i < this.viewResult.QuoteInfo.length; i++) {
              if (
                this.viewResult.QuoteInfo[i].QuoteCustomerStatus == 2 &&
                this.VendorId == this.viewResult.QuoteInfo[i].VendorId &&
                this.RRVendorId == this.viewResult.QuoteInfo[i].RRVendorId
              ) {
                // Check the current Vendor status
                this.ApprovedQuoteId = this.viewResult.QuoteInfo[i].QuoteId;
                this.ApprovedVendorId = this.viewResult.QuoteInfo[i].VendorId;
                this.ApprovedRRVendorId =
                  this.viewResult.QuoteInfo[i].RRVendorId;
                this.ApprovedQuoteStatus =
                  this.viewResult.QuoteInfo[i].QuoteCustomerStatus;
                this.ApprovedQuoteWarranty =
                  this.viewResult.QuoteInfo[i].WarrantyPeriod;

                this.SubTotal = this.viewResult.QuoteInfo[i].TotalValue;
                this.AdditionalCharge = this.viewResult.QuoteInfo[i].ProcessFee;
                this.TotalTax = this.viewResult.QuoteInfo[i].TotalTax;
                this.Discount = this.viewResult.QuoteInfo[i].Discount;
                this.Shipping = this.viewResult.QuoteInfo[i].ShippingFee;
                this.QuoteGrandTotal = this.viewResult.QuoteInfo[i].GrandTotal;
                //continue;
              }

              this.viewResult.QuoteInfo[i].LeadTimes =
                this.viewResult.QuoteItems.filter(
                  (a) => a.QuoteId == this.viewResult.QuoteInfo[i].QuoteId
                ).map((a) =>
                  a.LeadTime > 0
                    ? "Part # : " + a.PartNo + " - " + a.LeadTime + " Day(s)"
                    : " - "
                );
            }

            //this.QuoteId = this.viewResult.QuoteInfo[0].QuoteId;
            /* this.QuoteCustomerStatus = this.viewResult.QuoteInfo[0].QuoteCustomerStatus;
            this.QuoteNo = this.viewResult.QuoteInfo[0].QuoteNo;
           this.SubTotal = this.viewResult.QuoteInfo[0].TotalValue;
           this.AdditionalCharge = this.viewResult.QuoteInfo[0].ProcessFee;
           this.TotalTax = this.viewResult.QuoteInfo[0].TotalTax;
           this.Discount = this.viewResult.QuoteInfo[0].Discount;
           this.Shipping = this.viewResult.QuoteInfo[0].ShippingFee;
           this.QuoteGrandTotal = this.viewResult.QuoteInfo[0].GrandTotal;
           this.QuoteRouteCause = this.viewResult.QuoteInfo[0].RouteCause;
           this.QuoteLeadTime = this.viewResult.QuoteInfo[0].LeadTime;
           this.QuoteWarrantyPeriod = this.viewResult.QuoteInfo[0].WarrantyPeriod;
           this.QuotePrice = this.viewResult.QuoteInfo[0].Price; */
          } else {
          }

          if (this.viewResult.RRPartsInfo.length > 0) {
            this.PartId = this.viewResult.RRPartsInfo[0].PartId;
            this.PartNo = this.viewResult.RRPartsInfo[0].PartNo;
            this.LeadTime = this.viewResult.RRPartsInfo[0].LeadTime;
            this.RRPartsId = this.viewResult.RRPartsInfo[0].RRPartsId;
            this.Description = this.getReplace(
              this.viewResult.RRPartsInfo[0].Description
            );
            this.Manufacturer = this.viewResult.RRPartsInfo[0].Manufacturer;
            this.ManufacturerPartNo =
              this.viewResult.RRPartsInfo[0].ManufacturerPartNo;
            this.ManufactuerName =
              this.viewResult.RRPartsInfo[0].ManufacturerName;
            this.SerialNo = this.viewResult.RRPartsInfo[0].SerialNo;
            this.Quantity = this.viewResult.RRPartsInfo[0].Quantity;
            this.Price = this.viewResult.RRPartsInfo[0].Price;
            this.Rate = this.viewResult.RRPartsInfo[0].Rate;
            // if (this.PartNo && this.Description) {
            //   this.getPreferedVendor();
            // }
          } else {
            this.addMissingPart = true;
            this.SerialNo = this.viewResult.RRInfo[0].SerialNo;
          }

          this.LPPList = [];
          for (var x in this.viewResult.LPPInfo) {
            this.LPPList.push(this.viewResult.LPPInfo[x].LPP);
          }
          this.LPP = this.LPPList.join(", ");
          this.PON = this.viewResult.RRInfo[0].PartPON;

          // this.getPartPrice(this.PartId);

          //RepairMessage show condition
          if (this.viewResult.RRInfo[0].IsRushRepair == 1) {
            this.repairMessage += `Rush Repair,`;
          }
          if (this.viewResult.RRInfo[0].IsWarrantyRecovery == 1) {
            this.repairMessage += "Warranty Repair,";
          }
          if (this.viewResult.RRInfo[0].IsWarrantyRecovery == 2) {
            this.repairMessage += "Warranty New,";
          }
          if (this.viewResult.RRInfo[0].IsRepairTag == 1) {
            this.repairMessage += "Repair Tag,";
          }
          if (this.viewResult.RRInfo[0].IsWarrantyDenied == 1) {
            this.repairMessage += "Warranty Denied,";
          }
          // if (this.viewResult.RRInfo[0].IsRushRepair == 1 && this.viewResult.RRInfo[0].IsWarrantyRecovery == 1) {
          //   this.repairMessage = "Rush Repair, Warranty Repair"
          // }

          // Set the form value
          this.EditForm.patchValue({
            CompanyName: this.viewResult.RRInfo[0].CompanyName,
            CustomerId: this.viewResult.RRInfo[0].CustomerId,
            DepartmentId: this.viewResult.RRInfo[0].DepartmentId,
            AssetId: this.viewResult.RRInfo[0].AssetId,
            UserId: this.viewResult.RRInfo[0].UserId,
            ContactPhone: this.viewResult.RRInfo[0].ContactPhone,
            ContactEmail: this.viewResult.RRInfo[0].ContactEmail,
            IsRushRepair: this.viewResult.RRInfo[0].IsRushRepair,
            IsCriticalSpare: this.viewResult.RRInfo[0].IsCriticalSpare,
            IsWarrantyDenied: this.viewResult.RRInfo[0].IsWarrantyDenied,
            IsWarrantyRecovery: this.viewResult.RRInfo[0].IsWarrantyRecovery,
            IsRepairTag: this.viewResult.RRInfo[0].IsRepairTag,
            RRDescription: this.getReplace(
              this.viewResult.RRInfo[0].RRDescription
            ),
            StatedIssue: this.viewResult.RRInfo[0].StatedIssue,

            CustomerPONo: this.viewResult.RRInfo[0].CustomerPONo,
            CustomerShipToId: this.viewResult.RRInfo[0].CustomerShipToId,
            CustomerBillToId: this.viewResult.RRInfo[0].CustomerBillToId,
            CustomerSONo: this.viewResult.RRInfo[0].CustomerSONo,
            VendorPONo: this.viewResult.RRInfo[0].VendorPONo,
            CustomerInvoiceNo: this.viewResult.RRInfo[0].CustomerInvoiceNo,
            VendorInvoiceNo: this.viewResult.RRInfo[0].VendorInvoiceNo,
            VendorPODueDate: this.VendorPODueDate,
            CustomerSODueDate: this.CustomerSODueDate,
            CustomerInvoiceDueDate: this.CustomerInvoiceDueDate,
            VendorInvoiceDueDate: this.VendorInvoiceDueDate,
          });

          if (this.viewResult.RRPartsInfo.length > 0) {
            // RR Parts Info
            this.EditForm.patchValue({
              RRPartsId: this.viewResult.RRPartsInfo[0].RRPartsId,
              PartId: this.viewResult.RRPartsInfo[0].PartId,
              LeadTime: this.viewResult.RRPartsInfo[0].LeadTime,
              CustomerPartNo1: this.viewResult.RRPartsInfo[0].CustomerPartNo1,
              CustomerPartNo2: this.viewResult.RRPartsInfo[0].CustomerPartNo2,
              PartNo: this.viewResult.RRPartsInfo[0].PartNo,
              Description: this.getReplace(
                this.viewResult.RRPartsInfo[0].Description
              ),
              Manufacturer: this.viewResult.RRPartsInfo[0].Manufacturer,
              ManufacturerPartNo:
                this.viewResult.RRPartsInfo[0].ManufacturerPartNo,
              SerialNo: this.viewResult.RRPartsInfo[0].SerialNo,
              Quantity: this.viewResult.RRPartsInfo[0].Quantity,
              Price: this.viewResult.RRPartsInfo[0].Price,
              Rate: this.viewResult.RRPartsInfo[0].Rate,
            });
          }
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  getAHaddress() {
    this.service.getHttpService("getAHGroupVendorAddress").subscribe(
      (response) => {
        if (response.status == true) {
          this.customerAddressList =
            response.responseData.AHGroupVendorAddress.map(function (value) {
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
                Address: value.AddressId,
              };
            });

          // this.model.Address =this.ShipFromAddressList[0].Address
          let obj = this;
          if (this.RRShippingHistory.length == 0) {
            response.responseData.AHGroupVendorAddress.map(function (value) {
              if (
                value.AddressId == obj.viewResult.RRInfo[0].ShippingAddressId
              ) {
                return (obj.ahAddress = value);
              }
            });
          } else {
            response.responseData.AHGroupVendorAddress.map(function (value) {
              if (value.AddressId == obj.shippingDetails.ReceiveAddressId) {
                return (obj.ahAddress = value);
              }
            });
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
        let obj = this;
        var ShippingAddress = response.responseData.map(function (value) {
          if (value.AddressId == obj.shippingDetails.ReceiveAddressId) {
            return value;
          }
        });
        this.ahAddress = ShippingAddress[0];
      });
  }
  getahaddress1() {
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
        let obj = this;
        var ShippingAddress = response.responseData.map(function (value) {
          if (value.AddressId == obj.viewResult.RRInfo[0].ShippingAddressId) {
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
      });
  }
  addMissingPartClick(PartNo, SerialNo) {
    var CustomerId = this.CustomerId;
    this.modalRef = this.CommonmodalService.show(AddRrPartsComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { CustomerId, PartNo },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((modelResponse) => {
      // Display the details
      this.RRDescription = modelResponse.data.Description
        ? this.getReplace(modelResponse.data.Description)
        : "";
      this.Description = modelResponse.data.Description
        ? this.getReplace(modelResponse.data.Description)
        : "";
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

      if (this.viewResult.RRInfo[0].CreatedByLocation == this.Location) {
        if (this.Status > 0) {
          postData = {
            RRId: this.RRId,
            //"CustomerId": this.EditForm.value.CustomerId, // readonly from status 1 onwards
            DepartmentId: this.EditForm.value.DepartmentId,
            AssetId: this.EditForm.value.AssetId,
            CustomerPONo: this.EditForm.value.CustomerPONo,
            CustomerSONo: this.EditForm.value.CustomerSONo,
            VendorPONo: this.EditForm.value.VendorPONo,
            CustomerInvoiceNo: this.EditForm.value.CustomerInvoiceNo,
            VendorInvoiceNo: this.EditForm.value.VendorInvoiceNo,
            VendorPODueDate: this.EditForm.value.VendorPODueDate
              ? this.datePipe.transform(
                this.EditForm.value.VendorPODueDate,
                "yyyy-MM-dd"
              )
              : "",
            CustomerSODueDate: this.EditForm.value.CustomerSODueDate
              ? this.datePipe.transform(
                this.EditForm.value.CustomerSODueDate,
                "yyyy-MM-dd"
              )
              : "",
            CustomerInvoiceDueDate: this.EditForm.value.CustomerInvoiceDueDate
              ? this.datePipe.transform(
                this.EditForm.value.CustomerInvoiceDueDate,
                "yyyy-MM-dd"
              )
              : "",
            VendorInvoiceDueDate: this.EditForm.value.VendorInvoiceDueDate
              ? this.datePipe.transform(
                this.EditForm.value.VendorInvoiceDueDate,
                "yyyy-MM-dd"
              )
              : "",
            CustomerBillToId: this.EditForm.value.CustomerBillToId,
            CustomerShipToId: this.EditForm.value.CustomerShipToId,
            IsRushRepair: this.EditForm.value.IsRushRepair == true ? 1 : 0,
            IsCriticalSpare:
              this.EditForm.value.IsCriticalSpare == true ? 1 : 0,
            IsWarrantyRecovery: this.EditForm.value.IsWarrantyRecovery,
            IsWarrantyDenied:
              this.EditForm.value.IsWarrantyDenied == true ? 1 : 0,
            IsRepairTag: this.EditForm.value.IsRepairTag == true ? 1 : 0,
            RRDescription: this.setReplace(this.EditForm.value.RRDescription),
            StatedIssue: this.EditForm.value.StatedIssue,
            UserId: this.EditForm.value.UserId,
            ContactPhone: this.EditForm.value.ContactPhone,
            ContactEmail: this.EditForm.value.ContactEmail,
            PartId: this.EditForm.value.PartId,
            CustomerReferenceList: this.CustomerRefInfo,
            PartNo: this.EditForm.value.PartNo,
            PartPON: this.PON,
            RRParts: {
              PartId: this.EditForm.value.PartId,
              RRPartsId: this.EditForm.value.RRPartsId,
              LeadTime: this.EditForm.value.LeadTime,
              CustomerPartNo1: this.EditForm.value.CustomerPartNo1,
              CustomerPartNo2: this.EditForm.value.CustomerPartNo2,
            },
            RRImagesList: this.RRImagesList,
          };
          this.service.putHttpService(postData, "RepairRequestEdit2").subscribe(
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
            RRId: this.RRId,
            CustomerId: this.EditForm.value.CustomerId,
            DepartmentId: this.EditForm.value.DepartmentId,
            AssetId: this.EditForm.value.AssetId,
            CustomerPONo: this.EditForm.value.CustomerPONo,
            CustomerBillToId: this.EditForm.value.CustomerBillToId,
            CustomerShipToId: this.EditForm.value.CustomerShipToId,
            IsRushRepair: this.EditForm.value.IsRushRepair == true ? 1 : 0,
            IsCriticalSpare:
              this.EditForm.value.IsCriticalSpare == true ? 1 : 0,
            IsWarrantyRecovery: this.EditForm.value.IsWarrantyRecovery,
            IsRepairTag: this.EditForm.value.IsRepairTag == true ? 1 : 0,
            IsWarrantyDenied:
              this.EditForm.value.IsWarrantyDenied == true ? 1 : 0,
            RRDescription: this.setReplace(this.EditForm.value.RRDescription),
            StatedIssue: this.EditForm.value.StatedIssue,
            UserId: this.EditForm.value.UserId,
            ContactPhone: this.EditForm.value.ContactPhone,
            ContactEmail: this.EditForm.value.ContactEmail,
            PartId: this.EditForm.value.PartId,
            PartNo: this.EditForm.value.PartNo,
            CustomerReferenceList: this.CustomerRefInfo,
            PartPON: this.PON,
            RRParts: {
              PartId: this.EditForm.value.PartId,
              RRPartsId: this.EditForm.value.RRPartsId,
              LeadTime: this.EditForm.value.LeadTime,
              CustomerPartNo1: this.EditForm.value.CustomerPartNo1,
              CustomerPartNo2: this.EditForm.value.CustomerPartNo2,
              PartNo: this.EditForm.value.PartNo,
              ManufacturerPartNo: this.EditForm.value.ManufacturerPartNo,
              SerialNo: this.EditForm.value.SerialNo,
              Quantity: this.EditForm.value.Quantity,
              Price: this.EditForm.value.Price,
              Rate: this.EditForm.value.Rate,
              Description: this.setReplace(this.EditForm.value.Description),
              Manufacturer: this.EditForm.value.Manufacturer,
            },
            RRImagesList: this.RRImagesList,
            nextstep: nextStep,
          };

          this.service.putHttpService(postData, "RepairRequestEdit").subscribe(
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
          type: "info",
          title: "AH Country Mismatch",
          html:
            '<b style=" font-size: 14px !important;">' +
            `RR Added from  : <span class="badge badge-primary btn-xs">${this.viewResult.RRInfo[0].CreatedByLocationName}</span> country . Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!` +
            "</b>",
          confirmButtonClass: "btn btn-confirm mt-2",
        });
      }
    } else {
      Object.keys(this.EditForm.controls).forEach((key) => {
        const controlErrors: ValidationErrors = this.EditForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach((keyError) => {
            console.log(
              "Key control: " +
              key +
              ", keyError: " +
              keyError +
              ", err value: ",
              controlErrors[keyError]
            );
          });
        }
      });
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
    this.service.getHttpService("getAllActiveAdmin").subscribe((response) => {
      //getAdminListDropdown
      this.adminList = response.responseData.map(function (value) {
        return {
          title: value.FirstName + " " + value.LastName,
          UserId: value.UserId,
        };
      });
    });
  }
  getPartList(CustomerId) {
    // this.service.getHttpService('getPartListDropdown').subscribe(response => {
    //   this.partList = response.responseData;
    // });
    // Customer Parts List
    var postData = { CustomerId: CustomerId };
    this.service
      .postHttpService(postData, "getPartListDropdown")
      .subscribe((response) => {
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

        this.RRDescription = this.getReplace(
          response.responseData[0].Description
        );
        this.Description = this.getReplace(
          response.responseData[0].Description
        );
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
    if (CustomerId == null || CustomerId == "" || CustomerId == 0) {
      return false;
    }

    // Initially reset the values
    this.assetList = [];
    this.customerReferenceList = [];
    this.partList = [];
    this.PriorityNotes = event.PriorityNotes || "";
    this.RRDescription = "";
    this.Description = "";
    this.Manufacturer = "";
    this.PartNo = "";
    this.PON = "";
    this.LPP = "";
    this.SerialNo = "";
    this.LeadTime = "";
    this.ManufacturerPartNo = "";

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

  getCustomerAddressList(CustomerId) {
    var postData = {
      IdentityId: CustomerId,
      IdentityType: CONST_IDENTITY_TYPE_CUSTOMER,
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
            IsShippingAddress: value.IsShippingAddress,
            IsBillingAddress: value.IsBillingAddress,
          };
        });

        let obj = this;
        //shippingAddress
        var ShippingAddress = obj.customerAddressList.filter(function (value) {
          if (value.IsShippingAddress == 1) {
            return value.AddressId;
          }
        }, obj);
        this.EditForm.patchValue({
          CustomerShipToId: ShippingAddress[0].AddressId,
        });

        //BillingAddress
        var BillingAddress = obj.customerAddressList.filter(function (value) {
          if (value.IsBillingAddress == 1) {
            return value.AddressId;
          }
        }, obj);
        this.EditForm.patchValue({
          CustomerBillToId: BillingAddress[0].AddressId,
        });
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
              IsPrimaryImage: false,
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
  //BacktoList
  Back() {
    this.router.navigate(["/admin/repair-request/list"]);
  }

  //QR Code
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
    var IsRushRepair = this.viewResult.RRInfo[0].IsRushRepair;
    var IsWarrantyRecovery = this.viewResult.RRInfo[0].IsWarrantyRecovery;
    this.modalRef = this.CommonmodalService.show(QrCodeComponent, {
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
          IsRushRepair,
          IsWarrantyRecovery,
        },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => { });
  }

  //Notes Section
  addNotes() {
    var IdentityId = this.RRId;
    var IdentityType = CONST_IDENTITY_TYPE_RR;
    this.modalRef = this.CommonmodalService.show(AddNotesComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { IdentityId, IdentityType },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.RRNotesInfo.push(res.data);
      this.reLoad();
    });
  }

  editNotes(note, i) {
    var IdentityId = this.RRId;
    var IdentityType = CONST_IDENTITY_TYPE_RR;
    this.modalRef = this.CommonmodalService.show(EditNotesComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { note, i, IdentityId, IdentityType },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.RRNotesInfo[i] = res.data;
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
              this.RRNotesInfo.splice(i, 1);
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
    var IdentityType = CONST_IDENTITY_TYPE_RR;
    var IdentityId = this.RRId;
    this.modalRef = this.CommonmodalService.show(RRAddAttachmentComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
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
    var IdentityType = CONST_IDENTITY_TYPE_RR;
    var IdentityId = this.RRId;
    this.modalRef = this.CommonmodalService.show(RrEditAttachmentComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
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
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { CustomerId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((modelResponse) => {
      this.RRDescription = modelResponse.data.Description
        ? this.getReplace(modelResponse.data.Description)
        : "";
      this.Description = modelResponse.data.Description
        ? this.getReplace(modelResponse.data.Description)
        : "";
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
    this.router.navigate([this.currentRouter.split("?")[0]], {
      queryParams: { RRId: this.RRId },
    });
    // window.location.reload()
    //this.router.onSameUrlNavigation = 'reload';
    //this.router.navigate([this.currentRouter])
  }

  // Vendor Quote
  vendorQuote(
    VendorId,
    RRVendorId,
    VendorStatus,
    VendorTypeName,
    Directed,
    IsRMARequired,
    IsFlatRateRepair
  ) {
    // console.log(this.CustomerShipToId);
    // console.log(this.CustomerBillToId);
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
      var RRId = this.RRId;
      var PartId = this.PartId;
      var CustomerId = this.CustomerId;
      var CustomerShipToId = this.CustomerShipToId;
      var CustomerBillToId = this.CustomerBillToId;
      // var VendorTypeId=this.viewResult.RRInfo[0].VendorTypeId
      // var VendorTypeName=this.viewResult.RRInfo[0].VendorTypeName
      // var Directed=this.viewResult.RRInfo[0].Directed
      var IsWarrantyRecovery = this.viewResult.RRInfo[0].IsWarrantyRecovery;
      var IsWarrantyDenied = this.viewResult.RRInfo[0].IsWarrantyDenied;
      var RRPartInfoPartId =
        this.viewResult.RRPartsInfo.length > 0
          ? this.viewResult.RRPartsInfo[0].PartId
          : 0;
      this.modalRef = this.CommonmodalService.show(VendorQuoteComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: {
            RRId,
            PartId,
            RRVendorId,
            Status,
            VendorId,
            CustomerId,
            CustomerShipToId,
            CustomerBillToId,
            VendorTypeName,
            Directed,
            IsRMARequired,
            IsFlatRateRepair,
            IsWarrantyRecovery,
            IsWarrantyDenied,
            RRPartInfoPartId,
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
  CreateCustomerQuote(VendorId, RRVendorId, GrandTotal, CurrencySymbol) {
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
      if (!this.viewResult.RRInfo[0].IsWarrantyDenied) {
        if (
          this.viewResult.RRInfo[0].IsWarrantyRecovery == 2 ||
          this.viewResult.RRInfo[0].IsWarrantyRecovery == 1
        ) {
          if (GrandTotal != 0) {
            Swal.fire({
              title: "Warranty Error!",
              text: `You have selected the Warranty Selection as Warranty New. The quote amount should be ${CurrencySymbol} 0. If you want to add the quote amount, Please change the Warranty selection and save the RR.`,
              type: "warning",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
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
                  RRId: this.RRId,
                  CustomerId: this.CustomerId,
                  VendorId: VendorId,
                  RRVendorId: RRVendorId,
                  CustomerShipToId: this.CustomerShipToId,
                  CustomerBillToId: this.CustomerBillToId,
                };
                this.service
                  .postHttpService(postData, "RRCustomerQuoteCreate")
                  .subscribe((response) => {
                    if (response.status == true) {
                      Swal.fire({
                        title: "Created!",
                        text: "Quote for Customer has been created.",
                        type: "success",
                      });
                      this.reLoad();
                      this.EditCustomerQuote(
                        response.responseData.id,
                        VendorId,
                        ""
                      );
                    } else {
                      Swal.fire({
                        title: "Error",
                        text: response.message,
                        type: "warning",
                      });
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
        } else {
          if (GrandTotal == 0) {
            Swal.fire({
              title: `Warning! Quote amount is ${CurrencySymbol} 0!`,
              text: `You have not selected the Warranty Recovery as Warranty New or Warranty Repair in RR. Do you still want to proceed with ${CurrencySymbol} 0 amount?`,
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
                  RRId: this.RRId,
                  CustomerId: this.CustomerId,
                  VendorId: VendorId,
                  RRVendorId: RRVendorId,
                  CustomerShipToId: this.CustomerShipToId,
                  CustomerBillToId: this.CustomerBillToId,
                };
                this.service
                  .postHttpService(postData, "RRCustomerQuoteCreate")
                  .subscribe((response) => {
                    if (response.status == true) {
                      Swal.fire({
                        title: "Created!",
                        text: "Quote for Customer has been created.",
                        type: "success",
                      });
                      this.reLoad();
                      this.EditCustomerQuote(
                        response.responseData.id,
                        VendorId,
                        ""
                      );
                    } else {
                      Swal.fire({
                        title: "Error",
                        text: response.message,
                        type: "warning",
                      });
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
                  RRId: this.RRId,
                  CustomerId: this.CustomerId,
                  VendorId: VendorId,
                  RRVendorId: RRVendorId,
                  CustomerShipToId: this.CustomerShipToId,
                  CustomerBillToId: this.CustomerBillToId,
                };
                this.service
                  .postHttpService(postData, "RRCustomerQuoteCreate")
                  .subscribe((response) => {
                    if (response.status == true) {
                      Swal.fire({
                        title: "Created!",
                        text: "Quote for Customer has been created.",
                        type: "success",
                      });
                      this.reLoad();
                      this.EditCustomerQuote(
                        response.responseData.id,
                        VendorId,
                        ""
                      );
                    } else {
                      Swal.fire({
                        title: "Error",
                        text: response.message,
                        type: "warning",
                      });
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
              RRId: this.RRId,
              CustomerId: this.CustomerId,
              VendorId: VendorId,
              RRVendorId: RRVendorId,
              CustomerShipToId: this.CustomerShipToId,
              CustomerBillToId: this.CustomerBillToId,
            };
            this.service
              .postHttpService(postData, "RRCustomerQuoteCreate")
              .subscribe((response) => {
                if (response.status == true) {
                  Swal.fire({
                    title: "Created!",
                    text: "Quote for Customer has been created.",
                    type: "success",
                  });
                  this.reLoad();
                  this.EditCustomerQuote(
                    response.responseData.id,
                    VendorId,
                    ""
                  );
                } else {
                  Swal.fire({
                    title: "Error",
                    text: response.message,
                    type: "warning",
                  });
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
  }

  // Edit Customer Quote
  EditCustomerQuote(QuoteId, VendorId, QuoteCustomerStatus) {
    var RRId = this.RRId;
    //var VendorId = this.VendorId;
    var VendorName = this.VendorName; // check this later
    var Status = this.Status;
    this.VendorId = VendorId;
    this.QuoteCustomerStatus = QuoteCustomerStatus;
    var CustomerId = this.CustomerId;
    var RRPartInfoPartId =
      this.viewResult.RRPartsInfo.length > 0
        ? this.viewResult.RRPartsInfo[0].PartId
        : 0;
    this.modalRef = this.CommonmodalService.show(CustomerQuoteComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: {
          RRId,
          QuoteId,
          VendorName,
          QuoteCustomerStatus,
          Status,
          VendorId,
          CustomerId,
          RRPartInfoPartId,
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
          RRId: this.RRId,
          QuoteId: QuoteId,
          CustomerId: this.CustomerId,
          RRVendorId: RRVendorId,
        };

        this.service
          .postHttpService(postData, "RRCustomerQuoteSubmit")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Submitted!",
                text: "Quote for Customer has been submitted.",
                type: "success",
              });
              this.reLoad();
            } else {
              Swal.fire({
                title: "Error",
                text: response.message,
                type: "warning",
              });
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
  ApproveQuote(QuoteId, GrandTotal, CurrencySymbol) {
    var RRId = this.RRId;
    var CustomerId = this.CustomerId;
    var LocalCurrencyCode = this.QuoteInfo[0].LocalCurrencyCode;
    var ExchangeRate = this.QuoteInfo[0].ExchangeRate;
    var Status = this.RRInfo[0].Status;
    this.modalRef = this.CommonmodalService.show(BlanketPoCustomerComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: {
          RRId,
          QuoteId,
          CustomerId,
          GrandTotal,
          CurrencySymbol,
          ExchangeRate,
          LocalCurrencyCode,
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
    // if (this.CustomerPONo == '' || this.CustomerPONo == null) {
    //   Swal.fire({
    //     title: 'Alert',
    //     text: 'Please enter the Customer PO #!',
    //     type: 'warning'
    //   });
    //   return false;
    // } else {
    //   Swal.fire({
    //     title: 'Are you sure?',
    //     text: 'You won\'t be able to revert this!',
    //     type: 'warning',
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes, approve it!',
    //     cancelButtonText: 'No, cancel!',
    //     confirmButtonClass: 'btn btn-success mt-2',
    //     cancelButtonClass: 'btn btn-danger ml-2 mt-2',
    //     buttonsStyling: false
    //   }).then((result) => {
    //     if (result.value) {
    //       var postData = {
    //         RRId: this.RRId,
    //         QuoteId: QuoteId,
    //         CustomerPONo: this.CustomerPONo
    //       }
    //       this.service.postHttpService(postData, 'RRCustomerQuoteApprove').subscribe(response => {
    //         if (response.status == true) {
    //           Swal.fire({
    //             title: 'Approved!',
    //             text: 'Quote has been approved.',
    //             type: 'success'
    //           });
    //           this.reLoad();
    //         }
    //       });
    //     } else if (
    //       result.dismiss === Swal.DismissReason.cancel
    //     ) {
    //       Swal.fire({
    //         title: 'Cancelled',
    //         text: 'Quote has not approved.',
    //         type: 'error'
    //       });
    //     }
    //   });
    // }
  }

  //Reject Vendor
  RejectVendor(RRVendorId, RRInfoVendorId) {
    var RRId = this.RRId;
    var RRInfoStatus = this.Status;
    var VendorId = this.VendorId;

    this.modalRef = this.CommonmodalService.show(RejectAndResourceComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { RRId, RRVendorId, RRInfoStatus, VendorId, RRInfoVendorId },
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
    var RRId = this.RRId;
    this.modalRef = this.CommonmodalService.show(RejectCustomerQuoteComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
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
          RRId: this.RRId,
          RRVendorId: RRVendorId,
        };
        this.service
          .putHttpService(postData, "RRVendorRemove")
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
    if (this.viewResult.RRInfo[0].CreatedByLocation == this.Location) {
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
              RRId: this.RRId,
              QuoteId: QuoteId,
              CustomerId: this.CustomerId,
              CustomerShipToId: this.CustomerShipToId,
              CustomerBillToId: this.CustomerBillToId,
            };
            this.service
              .postHttpService(postData, "RRCreateSO")
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
    } else {
      Swal.fire({
        type: "info",
        title: "AH Country Mismatch",
        html:
          '<b style=" font-size: 14px !important;">' +
          `RR Added from  : <span class="badge badge-primary btn-xs">${this.viewResult.RRInfo[0].CreatedByLocationName}</span> country . Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!` +
          "</b>",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }

  //Create PO
  CreatePO(QuoteId) {
    if (this.viewResult.RRInfo[0].CreatedByLocation == this.Location) {
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
            RRId: this.RRId,
            QuoteId: QuoteId,
            CustomerId: this.CustomerId,
          };
          this.service
            .postHttpService(postData, "RRCreatePO")
            .subscribe((response) => {
              if (response.status == true) {
                Swal.fire({
                  title: "Created PO!",
                  text: "Purchase Order has been created.",
                  type: "success",
                });
                this.reLoad();
              } else {
                Swal.fire({
                  title: "Message",
                  text: response.message,
                  type: "error",
                });
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
    } else {
      Swal.fire({
        type: "info",
        title: "AH Country Mismatch",
        html:
          '<b style=" font-size: 14px !important;">' +
          `RR Added from  : <span class="badge badge-primary btn-xs">${this.viewResult.RRInfo[0].CreatedByLocationName}</span> country . Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!` +
          "</b>",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
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
          RRId: this.RRId,
          QuoteId: QuoteId,
          CustomerId: this.CustomerId,
        };
        this.service
          .postHttpService(postData, "RRCreateInvoice")
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
      backdrop: "static",
      ignoreBackdropClick: false,
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
  CreateVendorInvoice(QuoteId, CurrencySymbol) {
    if (this.viewResult.RRInfo[0].CreatedByLocation == this.Location) {
      var RRId = this.RRId;
      var CustomerId = this.CustomerId;
      var POId = this.VendorPOId;
      var SOId = this.CustomerSOId;
      var POAmount = this.viewResult.RRInfo[0].POAmount;
      var IsInvoiceApproved = this.IsInvoiceApproved;

      this.modalRef = this.CommonmodalService.show(RrVendorInvoiceComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: {
            RRId,
            QuoteId,
            CustomerId,
            POId,
            SOId,
            POAmount,
            IsInvoiceApproved,
            CurrencySymbol,
          },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";

      this.modalRef.content.event.subscribe((res) => {
        this.reLoad();
      });
    } else {
      Swal.fire({
        type: "info",
        title: "AH Country Mismatch",
        html:
          '<b style=" font-size: 14px !important;">' +
          `RR Added from  : <span class="badge badge-primary btn-xs">${this.viewResult.RRInfo[0].CreatedByLocationName}</span> country . Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!` +
          "</b>",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
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
    var RRId = this.RRId;
    var IdentityType = CONST_IDENTITY_TYPE_CUSTOMER;
    var IdentityTypeName = "Customer";
    var IdentityId = this.CustomerId;
    var followupName = "Customer Followup";
    this.modalRef = this.CommonmodalService.show(FollowupComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: {
          RRId,
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
    var RRId = this.RRId;
    var IdentityType = CONST_IDENTITY_TYPE_VENDOR;
    var IdentityId = this.VendorId;
    var IdentityTypeName = "Vendor";
    var followupName = "Vendor Followup";
    this.modalRef = this.CommonmodalService.show(FollowupComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: {
          RRId,
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
    var RRId = this.RRId;
    this.modalRef = this.CommonmodalService.show(ViewFollowupComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { FollowupId, i, RRId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((res) => { });
  }

  //ShippingDetails
  onShip() {
    var RRId = this.RRId;
    var CustomerId = this.viewResult.RRInfo[0].CustomerId;
    var VendorId = this.VendorId;
    this.modalRef = this.CommonmodalService.show(ShipComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
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
    var RRId = this.RRId;
    this.modalRef = this.CommonmodalService.show(AddReferenceComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { CustomerId, RRId },
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
      backdrop: "static",
      ignoreBackdropClick: false,
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
  editReference(ref, i) {
    this.modalRef = this.CommonmodalService.show(EditReferenceComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { ref, i },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.CustomerRefInfo[i] = res.data;
    });
  }

  //RRCurrent History
  RRcurrentstatus() {
    var currentHistory = this.RRStatusHistory;
    this.modalRef = this.CommonmodalService.show(RrCurrentHistoryComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
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
    var CustomerId = this.CustomerId;
    var VendorId = this.VendorId;
    this.modalRef = this.CommonmodalService.show(RrShippingHistoryComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { RRShippingHistory, RRId, PartId, CustomerId, VendorId },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";
  }

  //Delete RR Record
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
          RRId: this.RRId,
        };
        this.service
          .postHttpService(postData, "RepairRequestDelete")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "Repair Request has been deleted.",
                type: "success",
              });
              this.navCtrl.navigate("/admin/repair-request/list/");
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Repair Request  is safe:)",
          type: "error",
        });
      }
    });
  }

  onAddPartToInventory() {
    this.modalRef = this.CommonmodalService.show(AddPartToInventoryComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { RRInfo: this.RRInfo[0] },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";
  }

  async onInventoryShop() {
    var postData = {
      RRId: this.RRId,
    };
    this.service
      .postHttpService(postData, "RepairRequestView")
      .subscribe((response) => {
        if (response.status == true) {
          this.modalRef = this.CommonmodalService.show(InventoryShopComponent, {
            backdrop: "static",
            ignoreBackdropClick: false,
            initialState: {
              data: {
                RRInfo: response.responseData.RRInfo[0],
                ShopPartItems: response.responseData.ShopPartItems,
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
      });
  }
  //Delete RR Image
  onImageDelete(i, RRImageId) {
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
          RRImageId: RRImageId,
        };
        this.service
          .postHttpService(postData, "RepairRequestImageDelete")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "Repair Request Image has been deleted.",
                type: "success",
              });
              this.RRImages.splice(i, 1);
              if (this.RRImages[0] != "") {
                this.currentImage = new FormControl(this.RRImages[0]);
              }
              //this.navCtrl.navigate('/admin/repair-request/list/');
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Repair Request Image is safe:)",
          type: "error",
        });
      }
    });
  }

  //Use image
  onImage(i, RRImageId, img) {
    Swal.fire({
      title: "Are you sure?",
      text: "To Use this Image as Primary Image",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          RRImageId: RRImageId,
          RRId: this.RRId,
        };
        this.service
          .postHttpService(postData, "SetAsPrimaryImage")
          .subscribe((response) => {
            if (response.status == true) {
              this.currentImage = new FormControl(img);
              Swal.fire({
                title: "Success",
                text: "Image has been Updated as Primary Image.",
                type: "success",
              });
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        this.reLoad();
        Swal.fire({
          title: "Cancelled",
          text: "Image is safe:)",
          type: "error",
        });
      }
    });
  }

  //RRShipping History
  onRRShippingReceive() {
    var CustomerShipIdLocked =
      this.QuoteInfo[0] && this.QuoteInfo[0].CustomerShipIdLocked
        ? this.QuoteInfo[0].CustomerShipIdLocked
        : 0;
    var VendorShipIdLocked =
      this.viewResult.VendorsInfo[0] &&
        this.viewResult.VendorsInfo[0].VendorShipIdLocked
        ? this.viewResult.VendorsInfo[0].VendorShipIdLocked
        : 0;
    var ShippingStatus = this.ShippingStatus;
    var RRShippingHistory = this.RRShippingHistory;
    var RRId = this.RRId;
    var CustomerId = this.CustomerId;
    var Status = this.Status;
    this.modalRef = this.CommonmodalService.show(ReceiveToShipComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: {
          RRShippingHistory,
          RRId,
          CustomerId,
          Status,
          ShippingStatus,
          CustomerShipIdLocked,
          VendorShipIdLocked,
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
  getCountryList() {
    this.service.getconutryList().subscribe(
      (response) => {
        if (response.status == true) {
          this.countryList = response.responseData;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
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
    let obj = this;
    this.VendorName = this.filterAndGetValue(
      obj.viewResult.PreferredVendorList,
      "VendorName",
      "VendorId",
      this.VendorId
    );
    this.VendorLocation = this.filterAndGetValue(
      obj.viewResult.PreferredVendorList,
      "VendorLocation",
      "VendorId",
      this.VendorId
    );
    var CountryId = this.countryList.find(
      (a) => a.CountryId == this.VendorLocation
    );
    if (CountryId) {
      this.VendorLocationName = this.countryList.find(
        (a) => a.CountryId == this.VendorLocation
      ).CountryName;
      if (this.VendorLocation != this.Location) {
        this.AddVendorbtnDisabled = true;

        Swal.fire({
          title: "Country Mismatch",
          html:
            '<b style=" font-size: 14px !important;">' +
            `Vendor Country : <span class="badge badge-primary btn-xs">${this.VendorLocationName}</span> , AH Country : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Are you Sure to Process this!` +
            "</b>",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, Process it!",
          cancelButtonText: "No, cancel!",
          confirmButtonClass: "btn btn-success mt-2",
          cancelButtonClass: "btn btn-danger ml-2 mt-2",
          buttonsStyling: false,
        }).then((result) => {
          if (result.value) {
            console.log("RRVendorId", this.RRVendorId);
            var postData = {
              RRId: this.RRId,
              VendorId: this.VendorId,
              VendorName: this.VendorName,
              PartId: this.PartId,
            };
            this.service.postHttpService(postData, "RRAssignVendor").subscribe(
              (response) => {
                if (response.status == true) {
                  // this.reLoad();

                  let RRVendorId = response.responseData.RRVendorId; // this.RRVendorId
                  let VendorId = this.VendorId;
                  this.modalRef = this.CommonmodalService.show(
                    LockVendorShippingAddComponent,
                    {
                      backdrop: "static",
                      ignoreBackdropClick: false,
                      initialState: {
                        data: { RRVendorId, VendorId },
                        class: "modal-lg",
                      },
                      class: "gray modal-lg",
                    }
                  );

                  this.modalRef.content.closeBtnName = "Close";
                  this.modalRef.content.event.subscribe((res) => {
                    this.reLoad();
                  });
                } else {
                  this.AddVendorbtnDisabled = false;
                }
                this.cd_ref.detectChanges();
              },
              (error) => console.log(error)
            );
          } else if (
            // Read more about handling dismissals
            result.dismiss === Swal.DismissReason.cancel
          ) {
            this.reLoad();
          }
        });
      } else {
        this.AddVendorbtnDisabled = true;
        var postData = {
          RRId: this.RRId,
          VendorId: this.VendorId,
          VendorName: this.VendorName,
          PartId: this.PartId,
        };
        this.service.postHttpService(postData, "RRAssignVendor").subscribe(
          (response) => {
            if (response.status == true) {
              // this.reLoad();
              let RRVendorId = response.responseData.RRVendorId; // this.RRVendorId
              let VendorId = this.VendorId;
              this.modalRef = this.CommonmodalService.show(
                LockVendorShippingAddComponent,
                {
                  backdrop: "static",
                  ignoreBackdropClick: false,
                  initialState: {
                    data: { RRVendorId, VendorId },
                    class: "modal-lg",
                  },
                  class: "gray modal-lg",
                }
              );

              this.modalRef.content.closeBtnName = "Close";
              this.modalRef.content.event.subscribe((res) => {
                this.reLoad();
              });
            } else {
              this.AddVendorbtnDisabled = false;
            }
            this.cd_ref.detectChanges();
          },
          (error) => console.log(error)
        );
      }
    } else {
      Swal.fire({
        title: "Message",
        text: "Vendor Country Not Avaliable,Please contact admin to update a Country",
        type: "info",
      });
      return false;
    }
    this.countryList.map((a) => { });
  }

  //ShiptoVendor
  onShiptoVendor() {
    var VendorShipIdLocked = 0;
    var CustomerShipIdLocked = 0;
    var RRShippingHistory = this.RRShippingHistory;
    var RRId = this.RRId;
    var VendorId = this.VendorId;
    var CustomerId = this.CustomerId;
    var ShippingStatus = this.ShippingStatus;
    var ShippingIdentityType = this.ShippingIdentityType;
    var ShippingIdentityName = this.viewResult.RRInfo[0].ShippingIdentityName;
    var ShippingIdentityId = this.ShippingIdentityId;
    var ShippingAddressId = this.viewResult.RRInfo[0].ShippingAddressId;
    var Status = this.Status;
    var RRNo = this.viewResult.RRInfo[0].RRNo;
    CustomerShipIdLocked =
      this.QuoteInfo[0] && this.QuoteInfo[0].CustomerShipIdLocked
        ? this.QuoteInfo[0].CustomerShipIdLocked
        : 0;
    var VendorsInfo = [];
    VendorsInfo = this.viewResult.VendorsInfo;
    if (VendorsInfo.length > 0) {
      var VendorRefNo = this.viewResult.VendorsInfo[0].VendorRefNo;
      var UPS_Vendor_Account_No =
        this.viewResult.VendorsInfo[0].VendorUPSShipperNumber;
      VendorShipIdLocked =
        this.viewResult.VendorsInfo[0] &&
          this.viewResult.VendorsInfo[0].VendorShipIdLocked
          ? this.viewResult.VendorsInfo[0].VendorShipIdLocked
          : 0;
    }
    var CustomerPONo = this.viewResult.RRInfo[0].CustomerPONo;
    var UPS_Customer_Account_No =
      this.viewResult.RRInfo[0].CustomerUPSShipperNumber;
    this.modalRef = this.CommonmodalService.show(ShipToVendorComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: {
          RRShippingHistory,
          RRId,
          VendorId,
          ShippingAddressId,
          ShippingIdentityName,
          ShippingIdentityId,
          CustomerId,
          ShippingStatus,
          ShippingIdentityType,
          Status,
          RRNo,
          VendorRefNo,
          CustomerPONo,
          UPS_Vendor_Account_No,
          UPS_Customer_Account_No,
          CustomerShipIdLocked,
          VendorShipIdLocked,
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

  partHistory() {
    var History = this.RRShippingHistory;
    var ShippingStatus = this.ShippingStatus;

    this.modalRef = this.CommonmodalService.show(
      PartCurrentLocationHistoryComponent,
      {
        backdrop: "static",
        ignoreBackdropClick: false,
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
  onUpdatePartCurrentLocation(value) {
    var editMode = value;
    var RRId = this.RRId;
    var VendorId = this.VendorId;
    var CustomerId = this.CustomerId;
    var CustomerName = this.viewResult.RRInfo[0].CompanyName;
    var ShippingIdentityType = this.ShippingIdentityType;
    var ShippingAddressId = this.viewResult.RRInfo[0].ShippingAddressId;
    this.modalRef = this.CommonmodalService.show(
      UpdatePartCurrentLocationComponent,
      {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: {
            RRId,
            VendorId,
            CustomerId,
            CustomerName,
            editMode,
            ShippingIdentityType,
            ShippingAddressId,
          },
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
          RRId: this.RRId,
        };
        this.service
          .postHttpService(postData, "RevertRRShipping")
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
      backdrop: "static",
      ignoreBackdropClick: false,
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

  //WarrantySection
  addWarranty() {
    var RRId = this.RRId;
    var warrantyPeriod = 0;
    if (this.ApprovedQuoteWarranty) warrantyPeriod = this.ApprovedQuoteWarranty;
    //var src = 'AHOms';
    this.modalRef = this.CommonmodalService.show(AddWarrantyComponent, {
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
  editWarranty(warranty, i) {
    var RRId = this.RRId;
    this.modalRef = this.CommonmodalService.show(EditWarrantyComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { RRId, warranty, i },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((res) => {
      this.WarrantyInfo[i] = res.data;
      this.reLoad();
    });
  }
  deleteWarranty(WarrantyId, i) {
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
          WarrantyId: WarrantyId,
        };
        this.service
          .postHttpService(postData, "DeleteWarranty")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "Warranty has been deleted.",
                type: "success",
              });
              this.WarrantyInfo.splice(i, 1);
              this.reLoad();
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Warranty is safe:)",
          type: "error",
        });
      }
    });
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
    //this.router.navigate( ['admin/sales-quote/list'], { queryParams: { QuoteId: QuoteId}});
  }

  sendEmailCustomerQuote(QuoteId) {
    var RRId = this.RRId;
    var IdentityId = QuoteId;
    var IdentityType = CONST_IDENTITY_TYPE_QUOTE;
    var followupName = "Quotes";
    this.modalRef = this.CommonmodalService.show(EmailComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
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

  previewInvoice(InvoiceId) {
    const initialState = { InvoiceId };
    this.modalRef = this.CommonmodalService.show(InvoicePrintComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
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
        pdf.save(`Customer Invoice ${this.RRNo}????????.pdf`);
        this.hideAddress = true;
      });
    });

    this.modalRef.content.onEmail.subscribe((attachment) => {
      let ImportedAttachment = attachment;

      var RRId = this.RRId;
      var IdentityId = InvoiceId;
      var IdentityType = CONST_IDENTITY_TYPE_INVOICE;
      var followupName = "Invoice";
      this.modalRef.hide();
      this.modalRef = this.CommonmodalService.show(EmailComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: {
            followupName,
            IdentityId,
            IdentityType,
            RRId,
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

    this.modalRef.content.closeClicked.subscribe(() => {
      this.modalRef.hide();
    });
  }

  previewSO(SOId) {
    const initialState = { SOId };
    this.modalRef = this.CommonmodalService.show(SalesOrderPrintComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
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

      var RRId = this.RRId;
      var IdentityId = SOId;
      var IdentityType = CONST_IDENTITY_TYPE_SO;
      var followupName = "Sales Order";
      this.modalRef.hide();
      this.modalRef = this.CommonmodalService.show(EmailComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: {
            followupName,
            IdentityId,
            IdentityType,
            RRId,
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

    this.modalRef.content.closeClicked.subscribe(() => {
      this.modalRef.hide();
    });
  }
  previewCustomerQuote(quote) {
    const { QuoteId, QuoteNo } = quote;
    const initialState = { QuoteId };
    this.modalRef = this.CommonmodalService.show(SalesQuotePrintComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
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
        pdf.save(`Repair Quote ${this.RRNo}.pdf`);
        this.hideAddress = true;
      });
    });

    this.modalRef.content.onEmail.subscribe((attachment) => {
      let ImportedAttachment = attachment;

      var RRId = this.RRId;
      var IdentityId = QuoteId;
      var IdentityType = CONST_IDENTITY_TYPE_QUOTE;
      var followupName = "Quotes";
      this.modalRef.hide();
      this.modalRef = this.CommonmodalService.show(EmailComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: {
            followupName,
            IdentityId,
            IdentityType,
            RRId,
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

    this.modalRef.content.closeClicked.subscribe(() => {
      this.modalRef.hide();
    });
  }

  sendEmailSO(SOId) {
    var RRId = this.RRId;
    var IdentityId = SOId;
    var IdentityType = CONST_IDENTITY_TYPE_SO;
    var followupName = "Sales Order";
    this.modalRef = this.CommonmodalService.show(EmailComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
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

  printPO(POId) {
    const initialState = { POId };
    this.modalRef = this.CommonmodalService.show(PurchaseOrderViewComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
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
        pdf.save(`Purchase Order ${this.RRNo}.pdf`);
        this.hideAddress = true;
      });
    });
  }

  previewPO(POId) {
    const initialState = { POId };
    this.modalRef = this.CommonmodalService.show(PurchaseOrderViewComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        initialState,
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.onEdit.subscribe(() => {
      this.modalRef.hide();
      this.router.navigate(["/admin/purchase-order/edit"], {
        state: { POId: POId },
      });
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

      var RRId = this.RRId;
      var IdentityId = POId;
      var IdentityType = CONST_IDENTITY_TYPE_PO;
      var followupName = "Purchase Order";
      this.modalRef.hide();
      this.modalRef = this.CommonmodalService.show(EmailComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: {
            followupName,
            IdentityId,
            IdentityType,
            RRId,
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

    this.modalRef.content.closeClicked.subscribe(() => {
      this.modalRef.hide();
    });
  }

  sendEmailPO(POId) {
    const initialState = { POId };
    this.modalRef = this.CommonmodalService.show(PurchaseOrderViewComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
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
          filename: `Purchase Order ${this.RRNo}.pdf`,
        };
        // pdf.save('purchase-order.pdf');

        var RRId = this.RRId;
        var IdentityId = POId;
        var IdentityType = CONST_IDENTITY_TYPE_PO;
        var followupName = "Purchase Order";
        this.modalRef.hide();
        this.modalRef = this.CommonmodalService.show(EmailComponent, {
          backdrop: "static",
          ignoreBackdropClick: false,
          initialState: {
            data: {
              followupName,
              IdentityId,
              IdentityType,
              RRId,
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
    const initialState = { InvoiceId };
    this.modalRef = this.CommonmodalService.show(InvoicePrintComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
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
          filename: `Invoice ${this.viewResult.RRInfo[0].InvoiceNo}.pdf`,
        };
        // pdf.save('purchase-order.pdf');

        var RRId = this.RRId;
        var IdentityId = InvoiceId;
        var IdentityType = CONST_IDENTITY_TYPE_INVOICE;
        var followupName = "Invoice";
        this.modalRef.hide();
        this.modalRef = this.CommonmodalService.show(EmailComponent, {
          backdrop: "static",
          ignoreBackdropClick: false,
          initialState: {
            data: {
              followupName,
              IdentityId,
              IdentityType,
              RRId,
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

  updateVendorReference(RRVendorId, e) {
    if (e.VendorRefNo == "") {
      return false;
    }

    var postData = {
      RRVendorId: RRVendorId,
      VendorRefNo: e.target.value.trim(),
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

  onAddMro() {
    var Type = "RR";
    this.router.navigate(["/admin/mro/add"], {
      state: {
        CustomerId: this.CustomerId,
        Type: Type,
        PartNo: this.viewResult.RRPartsInfo[0].PartNo,
        RRId: this.RRId,
        RRNo: this.viewResult.RRInfo[0].RRNo,
        CustomerName: this.viewResult.RRInfo[0].CompanyName,
        PartId: this.viewResult.RRPartsInfo[0].PartId,
      },
    });
  }

  onmapPreferredVendor() {
    var RRId = this.RRId;
    var PartId = this.PartId;
    this.modalRef = this.CommonmodalService.show(
      UpdatePreferredVendorComponent,
      {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: { PartId, RRId },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      }
    );

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
    // this.router.navigate(['/admin/parts-edit'], { state: { PartId: this.PartId, RRId: this.RRId, } });
  }

  goBack(event) {
    event.preventDefault();
    this.router.navigate(["/admin/repair-request/list"], {
      state: { reload: false },
    });
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
  onRevert() {
    if (
      this.viewResult.RRInfo[0].IsCSVProcessedInvoice == 0 &&
      this.viewResult.RRInfo[0].IsCSVProcessedVendorInvoice == 0
    ) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this Repair Request!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Revert it!",
        cancelButtonText: "No, cancel!",
        confirmButtonClass: "btn btn-success mt-2",
        cancelButtonClass: "btn btn-danger ml-2 mt-2",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          var RRId = this.RRId;
          var Name = "Repair Request Status Revert";
          this.modalRef = this.CommonmodalService.show(RevertComponent, {
            backdrop: "static",
            ignoreBackdropClick: false,
            initialState: {
              data: { Name, RRId },
              class: "modal-lg",
            },
            class: "gray modal-lg",
          });

          this.modalRef.content.closeBtnName = "Close";

          this.modalRef.content.event.subscribe((res) => {
            this.reLoad();
          });
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          Swal.fire({
            title: "Cancelled",
            text: "Repair Request  is safe:)",
            type: "error",
          });
        }
      });
    } else {
      Swal.fire({
        title: "Message",
        text: "Vendor bill or Invoice is processed. Please contact admin",
        type: "info",
      });
    }
  }
  onRevertHistory() {
    var RRRevertHistory = this.RRRevertHistory;
    this.modalRef = this.CommonmodalService.show(RevertHistoryComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { RRRevertHistory },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";
  }

  onChangeCustomerPO() {
    this.ApprovedQuoteStatus = 0;
    this.editMode = true;
  }
  onSaveCustomerPO() {
    var postData = {
      CustomerPONo: this.CustomerPONo,
      RRId: this.RRId,
      SOId: this.CustomerSOId,
      InvoiceId: this.CustomerInvoiceId,
    };
    this.service.postHttpService(postData, "SaveCustomerPONo").subscribe(
      (response) => {
        if (response.status == true) {
          this.CustomerPONo = response.responseData.CustomerPONo;
          this.editMode = false;
          Swal.fire({
            title: "Success!",
            text: "Customer PO No Updated Successfully!",
            type: "success",
            confirmButtonClass: "btn btn-confirm mt-2",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: response.message,
            type: "warning",
            confirmButtonClass: "btn btn-confirm mt-2",
          });
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  onPONUpdate() {
    var postData = {
      RRId: this.RRId,
      PartPON: parseFloat(this.PON),
      PartPONLocalCurrency: this.RRInfo[0].CustomerCurrencyCode,
      PartPONBaseCurrency: this.RRInfo[0].DefaultCurrency,
      BasePartPON: this.PON * this.PONExchangeRate,
      PartPONExchangeRate: this.PONExchangeRate,
    };
    this.service.putHttpService(postData, "UpdatePON").subscribe(
      (response) => {
        if (response.status == true) {
          Swal.fire({
            title: "Success!",
            text: "PON Updated Successfully!",
            type: "success",
            confirmButtonClass: "btn btn-confirm mt-2",
          });
          this.reLoad();
        } else {
          Swal.fire({
            title: "Error!",
            text: response.message,
            type: "warning",
            confirmButtonClass: "btn btn-confirm mt-2",
          });
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  onCustomerPOEdit(QuoteId, GrandTotal, CurrencySymbol) {
    var RRId = this.RRId;
    var CustomerId = this.CustomerId;
    if (this.viewResult.RRInfo[0].CustomerBlanketPOId == 0) {
      var ApproveType = "0";
    } else {
      var ApproveType = "1";
    }
    var CustomerBlanketPOId = this.viewResult.RRInfo[0].CustomerBlanketPOId;
    var CustomerPONo = this.CustomerPONo;
    var LocalCurrencyCode = this.QuoteInfo[0].LocalCurrencyCode;
    var ExchangeRate = this.QuoteInfo[0].ExchangeRate;
    var Consolidated = this.viewResult.RRInfo[0].Consolidated;
    var GrandTotal = GrandTotal.toFixed(2);
    this.modalRef = this.CommonmodalService.show(
      BlanketPoCustomerEditComponent,
      {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: {
            RRId,
            CustomerId,
            QuoteId,
            GrandTotal,
            ApproveType,
            CustomerBlanketPOId,
            CustomerPONo,
            CurrencySymbol,
            LocalCurrencyCode,
            ExchangeRate,
            Consolidated,
          },
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

  //Followup Notes Section
  addFollowupNotes() {
    var FollowUpNoteId = "";
    var IdentityId = this.RRId;
    this.modalRef = this.CommonmodalService.show(RRFollowupNotesComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { IdentityId, FollowUpNoteId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.FollowupNotesInfo.push(res.data);
      this.reLoad();
    });
  }

  editFollowUpNotes(note, i) {
    var IdentityId = this.RRId;
    var FollowUpNoteId = note.FollowUpNoteId;
    this.modalRef = this.CommonmodalService.show(RRFollowupNotesComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { note, i, IdentityId, FollowUpNoteId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.FollowupNotesInfo[i] = res.data;
      this.reLoad();
    });
  }

  deleteFollowupNotes(FollowUpNoteId, i) {
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
          FollowUpNoteId: FollowUpNoteId,
        };
        this.service
          .postHttpService(postData, "FollowpNotesDelete")
          .subscribe((response) => {
            if (response.status == true) {
              this.FollowupNotesInfo.splice(i, 1);
              Swal.fire({
                title: "Deleted!",
                text: "Followup Notes has been deleted.",
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
          text: "Followup Notes is safe:)",
          type: "error",
        });
      }
    });
  }

  //Vendor Attachement Delete
  onVendorAttachementDelete(i, RRVendorAttachmentId) {
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
          RRVendorAttachmentId: RRVendorAttachmentId,
        };
        this.service
          .postHttpService(postData, "RRVendorAttachmentstDelete")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "Vendor Attachment has been deleted.",
                type: "success",
              });
              this.RRVendorAttachmentList.splice(i, 1);
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Vendor Attachment is safe:)",
          type: "error",
        });
      }
    });
  }

  getReplace(val) {
    // var firstdata = val.replace(/\'/g, "'");
    // console.log(firstdata)
    // var data = firstdata.replace(/\\/g, "");
    // console.log(data)
    // return data;
    if (val) {
      var firstdata = val.replace("\\", "");
      var data = firstdata.replace(/\'/g, "'");
      // console.log(data)
      return data;
    } else {
      return val;
    }
  }
  setReplace(val) {
    if (val) {
      var firstdata = val.replace("\\", "");
      var data = firstdata.replace("'", "\\'");
      console.log("data", data);
      return data;
    } else {
      return val;
    }
    // var data = val.replace(/'/g, "\'");
    // var data = val.replace("'","\\'")

    // console.log("data", data)
    // return data;
  }

  onInActiveorActiveRR(data) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          RRId: this.RRId,
          IsActive: data,
        };
        this.service
          .postHttpService(postData, "ActiveInActiveRR")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Success",
                text: "RR Status Changed Successfully!",
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
          text: "RR Status  is safe:)",
          type: "error",
        });
      }
    });
  }

  getSubStatusList() {
    this.service.getHttpService("RRSubStatusDDl").subscribe((response) => {
      this.subStatusList = response.responseData;
    });
  }

  onEditRRPartLocation() {
    var RRPartLocationId = this.viewResult.RRInfo[0].RRPartLocationId;
    var RRId = this.RRId;
    this.modalRef = this.CommonmodalService.show(RrEditPartLocationComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { RRPartLocationId, RRId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  onRPartLocationHistory() {
    var History = this.viewResult.RRLocationHistory;
    this.modalRef = this.CommonmodalService.show(PartLocationHistoryComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { History },
      },
    });
    this.modalRef.content.closeBtnName = "Close";
  }

  onSubStatusChange(SubStatusId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          SubStatusId: SubStatusId,
          RRId: this.RRId,
          AssigneeUserId: this.AssigneeUserId,
        };
        this.service
          .postHttpService(postData, "RRSubStatusEdit")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Success",
                text: "Sub Status Changed Successfully!",
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
          text: "Sub Status  is safe:)",
          type: "error",
        });
      }
    });
  }

  onAssigneeChange(AssigneeUserId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          AssigneeUserId: AssigneeUserId,
          RRId: this.RRId,
          SubStatusId: this.SubStatusId,
        };
        this.service
          .postHttpService(postData, "RRAssigneeEdit")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Success",
                text: "RR Assignee Changed Successfully!",
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
          text: "RR Assignee is safe:)",
          type: "error",
        });
      }
    });
  }

  onRRSubStatusHistory() {
    var History = this.viewResult.RRSubStatusHistory;
    this.modalRef = this.CommonmodalService.show(SubstatusHistoryComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { History },
      },
    });
    this.modalRef.content.closeBtnName = "Close";
  }

  onRRAssigneeHistory() {
    var History = this.viewResult.RRAssigneeHistory;
    this.modalRef = this.CommonmodalService.show(AssigneeHistoryComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { History },
      },
    });
    this.modalRef.content.closeBtnName = "Close";
  }

  onRRSubStatusAssignToReset() {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Reset the RR Sub Status & Assign To!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          SubStatusId: 0,
          AssigneeUserId: 0,
          RRIds: this.RRId,
        };
        this.service
          .postHttpService(postData, "BulkEditSubStatusAssignee")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Success",
                text: "Sub Status & Assign To is Reseted!",
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
          text: "RR Sub Status & Assign To is safe:)",
          type: "error",
        });
      }
    });
  }

  onRRPartLocationDelete() {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Reset the RR Part Location!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          RRPartLocationId: 0,
          RRId: this.RRId,
        };
        this.service
          .postHttpService(postData, "RRPartLocationEdit")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Success",
                text: "RR Part Location is Reseted!",
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
          text: "RR Part Location is safe:)",
          type: "error",
        });
      }
    });
  }

  onBulkEdit() {
    var RRId = this.RRId;
    var checkedList = [];
    checkedList.push({ RRId });
    var bulkData = checkedList;
    this.modalRef = this.CommonmodalService.show(
      BulkSubstatusAssignEditComponent,
      {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: { bulkData },
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

  onUpdateRRDepartmentWarranty() {
    var postData = {
      RRId: this.RRId,
      IsRepairTag: this.EditForm.value.IsRepairTag == true ? 1 : 0,
      IsRushRepair: this.EditForm.value.IsRushRepair == true ? 1 : 0,
      IsCriticalSpare: this.EditForm.value.IsCriticalSpare == true ? 1 : 0,
      IsWarrantyRecovery: this.EditForm.value.IsWarrantyRecovery,
      DepartmentId: this.EditForm.value.DepartmentId,
      AssetId: this.EditForm.value.AssetId,
      IsWarrantyDenied: this.EditForm.value.IsWarrantyDenied == true ? 1 : 0,
    };
    this.service
      .putHttpService(postData, "UpdateRRDepartmentWarranty")
      .subscribe(
        (response) => {
          if (response.status == true) {
            Swal.fire({
              title: "Success!",
              text: "Record Updated Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
            this.reLoad();
          } else {
            Swal.fire({
              title: "Error!",
              text: response.message,
              type: "warning",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  addRepair() {
    let RRGMTrackerId = "";
    let RRId = this.RRId;

    this.modalRef = this.CommonmodalService.show(GmRepairTrackerComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { RRGMTrackerId, RRId },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }
  editRepair() {
    let RRGMTrackerId = "";
    let RRId = this.RRId;
    if (this.RRGMTrackerInfo.length > 0) {
      RRGMTrackerId = this.RRGMTrackerInfo[0].RRGMTrackerId;
    }

    this.modalRef = this.CommonmodalService.show(GmRepairTrackerComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { RRGMTrackerId, RRId },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }
  viewRepair() {
    let RRGMTrackerId = "";
    if (this.RRGMTrackerInfo.length > 0) {
      RRGMTrackerId = this.RRGMTrackerInfo[0].RRGMTrackerId;
    }
    this.modalRef = this.CommonmodalService.show(ViewGmRepairTrackerComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { RRGMTrackerId },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }
  deleteRepair() {
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
        let RRGMTrackerId = "";
        if (this.RRGMTrackerInfo.length > 0) {
          RRGMTrackerId = this.RRGMTrackerInfo[0].RRGMTrackerId;
        }
        var postData = {
          RRGMTrackerId: RRGMTrackerId,
        };
        this.service
          .postHttpService(postData, "deleteGMRepairTrackerInfo")
          .subscribe((response) => {
            if (response.status == true) {
              this.reLoad();
              Swal.fire({
                title: "Deleted!",
                text: "Record has been deleted.",
                type: "success",
              });
            } else {
              Swal.fire({
                title: "Warning!",
                text: response.message,
                type: "warning",
              });
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Record is safe :)",
          type: "error",
        });
      }
    });
  }

  unlockShippingAddress(type) {
    Swal.fire({
      title: "Are you sure?",
      text:
        type == 0
          ? "Do you want to unlock the customer shipping address?"
          : "Do you want to unlock the vendor shipping address?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, unlock it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {};
        var URL = "";
        if (type === 0) {
          postData = {
            QuoteId: this.viewResult.QuoteInfo[0].QuoteId,
          };
          URL = "unlockCustomerShipAddress";
        } else {
          postData = {
            RRId: this.RRId,
          };
          URL = "unlockVendorShipAddress";
        }
        this.service.postHttpService(postData, URL).subscribe((response) => {
          if (response.status == true) {
            this.getViewContent();
            Swal.fire({
              title: "Unlocked!",
              text: response.responseData.msg,
              type: "success",
            });
          }
        });
      }
      // else if (
      //   // Read more about handling dismissals
      //   result.dismiss === Swal.DismissReason.cancel
      // ) {
      //   Swal.fire({
      //     title: 'Cancelled',
      //     text: 'MRO Record is safe :)',
      //     type: 'error'
      //   });
      // }
    });
  }

  IncomingChecklist(type = 0) {
    if (type == 0) {
      this.localStorageService.removeData("worksheetformdata");
      this.localStorageService.removeData("selectedworksheet");
    }
    let RRId = this.RRId;
    let RRNo = this.RRNo;
    let Type = type;
    let CustomerName = this.CustomerName;
    let RRImages = this.RRImages;
    // let RRInfo = this.RRInfo[0];
    let RRInfo = this.RRInfo && this.RRInfo[0] ? this.RRInfo[0] : [];
    let RRDescription = this.RRDescription;
    let comments =
      this.QuoteInfo && this.QuoteInfo[0] && this.QuoteInfo[0].RouteCause
        ? this.QuoteInfo[0].RouteCause
        : "-";
    // let PartNo = this.QuoteInfo && this.QuoteInfo[0] && this.QuoteInfo[0].RouteCause ? this.QuoteInfo[0].RouteCause : '';
    // let SerialNo = this.QuoteInfo && this.QuoteInfo[0] && this.QuoteInfo[0].RouteCause ? this.QuoteInfo[0].RouteCause : '';

    this.service.getHttpService("getWorksheetList").subscribe((response) => {
      console.log(response);
      if (response.status == true) {
        // this.IncomingChecklistAdd = this.selectedworksheet === null ? true : false;
        // this.IncomingChecklistEdit = this.selectedworksheet !== null ? true : false;
        this.IncomingChecklistAdd = false;
        this.IncomingChecklistEdit = true;
        this.Worksheet = response.responseData;
        let Worksheet = response.responseData;
        this.modalRef = this.CommonmodalService.show(
          IncomingRepairTrackerSideComponent,
          {
            backdrop: "static",
            ignoreBackdropClick: false,
            initialState: {
              data: {
                Worksheet,
                RRId,
                Type,
                CustomerName,
                RRImages,
                RRInfo,
                RRDescription,
                RRNo,
                comments,
              },
              class: "modal-xl",
            },
            class: "gray modal-xl",
          }
        );

        this.modalRef.content.closeBtnName = "Close";

        this.modalRef.content.event.subscribe((res) => {
          console.log(res);
          if (res.data == "true") {
            this.incomingView = true;
          }
        });
      }
    });
  }

  removeIncomingChecklist() {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this checklist",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.localStorageService.removeData("worksheetformdata");
        this.localStorageService.removeData("selectedworksheet");
        this.localStorageService.removeData("routecausecomments");
        this.localStorageService.removeData("Worksheetincoming");
        this.IncomingChecklistAdd = true;
        this.IncomingChecklistEdit = false;
        this.incomingView = false;
        Swal.fire({
          title: "Deleted!",
          text: "Checklist has been deleted.",
          type: "success",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Checklist is safe :)",
          type: "error",
        });
      }
    });
  }
  OutgoingChecklist(type = 0) {
    if (type == 0) {
      this.localStorageService.removeData("worksheetformdataoutgoing");
      this.localStorageService.removeData("selectedworksheetoutgoing");
      this.localStorageService.removeData("finaltestcomments");
    }
    let RRId = this.RRId;
    let RRNo = this.RRNo;
    let Type = type;
    let CustomerName = this.CustomerName;
    let RRImages = this.RRImages;
    let RRInfo = this.RRInfo && this.RRInfo[0] ? this.RRInfo[0] : [];
    let RRDescription = this.RRDescription;
    let comments =
      this.QuoteInfo && this.QuoteInfo[0] && this.QuoteInfo[0].RouteCause
        ? this.QuoteInfo[0].RouteCause
        : "-";
    this.service.getHttpService("getWorksheetList").subscribe((response) => {
      console.log(response);
      if (response.status == true) {
        // this.IncomingChecklistAdd = this.selectedworksheet === null ? true : false;
        // this.IncomingChecklistEdit = this.selectedworksheet !== null ? true : false;
        this.OutgoingChecklistAdd = false;
        this.OutgoingChecklistEdit = true;
        this.Worksheet = response.responseData;
        let Worksheet = response.responseData;
        this.modalRef = this.CommonmodalService.show(
          OutgoingRepairTrackerSideComponent,
          {
            backdrop: "static",
            ignoreBackdropClick: false,
            initialState: {
              data: {
                Worksheet,
                RRId,
                Type,
                CustomerName,
                RRImages,
                RRInfo,
                RRDescription,
                RRNo,
                comments,
              },
              class: "modal-xl",
            },
            class: "gray modal-xl",
          }
        );

        this.modalRef.content.closeBtnName = "Close";

        this.modalRef.content.event.subscribe((res) => {
          console.log(res);
          if (res.data == "true") {
            this.outgoingView = true;
          }
        });
      }
    });
  }

  removeOutgoingChecklist() {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this checklist!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.localStorageService.removeData("worksheetformdataoutgoing");
        this.localStorageService.removeData("selectedworksheetoutgoing");
        this.localStorageService.removeData("Worksheetoutgoing");
        this.localStorageService.removeData("finaltestcomments");
        this.OutgoingChecklistAdd = true;
        this.OutgoingChecklistEdit = false;
        this.outgoingView = false;
        Swal.fire({
          title: "Deleted!",
          text: "Checklist has been deleted.",
          type: "success",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Checklist is safe :)",
          type: "error",
        });
      }
    });
  }

  callBothPdf() {
    this.getBothPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Repair Report ${this.RRNo}.pdf`);
      Swal.fire({
        title: "Success!",
        text: "Incoming checklist downloaded successfully!",
        type: "success",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    });
  }

  getBothPdfBase64(cb) {
    this.spinnerPDF = true;
    this.service.getLogoAsBas64().then((base64) => {
      var worksheetformdataincoming =
        this.localStorageService.getData("worksheetformdata");
      var routecausecomments =
        this.localStorageService.getData("routecausecomments");
      var Worksheetincoming =
        this.localStorageService.getData("Worksheetincoming");
      var selectedincomingWorksheet = this.localStorageService.getData(
        "selectedincomingWorksheet"
      );

      var worksheetformdataoutgoing = this.localStorageService.getData(
        "worksheetformdataoutgoing"
      );
      var finaltestcomments =
        this.localStorageService.getData("finaltestcomments");
      var Worksheetoutgoing =
        this.localStorageService.getData("Worksheetoutgoing");
      var selectedoutgoingWorksheet = this.localStorageService.getData(
        "selectedoutgoingWorksheet"
      );

      var overallType = 1;
      if (worksheetformdataincoming == null) {
        overallType = 1;
      } else {
        overallType = 2;
      }
      let pdfObj = {
        overallType: overallType,
        RRId: this.RRId,
        CustomerName: this.CustomerName,
        RRInfo: this.RRInfo,
        RRDescription: this.RRDescription,
        RRNo: this.RRNo,
        Logo: base64,
        incomingTitle: "Incoming Checklist",
        incomingTitle1: "Part as received (Photos from RR#)",
        incomingTitle2: "Root Cause",
        outgoingTitle: "Outgoing Checklist",
        outgoingTitle1: "Part as Shipped",
        outgoingTitle2: "Final Test",
        incomingWorksheetId: 0,
        outgoingWorksheetId: 0,
        incomingRRImages: this.RRImages,
        outgoingRRImages: this.RRImages, //ToDo

        incomingWorksheet: Worksheetincoming,
        incomingViewresult: selectedincomingWorksheet,
        incomingComments:
          routecausecomments && routecausecomments != null
            ? routecausecomments
            : "-",

        outgoingWorksheet: Worksheetoutgoing,
        outgoingViewresult: selectedoutgoingWorksheet,
        outgoingComments:
          finaltestcomments && finaltestcomments != null
            ? finaltestcomments
            : "-",
      };

      this.service
        .postHttpService({ pdfObj }, "getChecklistBothPdfBase64")
        .subscribe((response) => {
          if (response.status == true) {
            cb(response.responseData.pdfBase64);
          }
          this.spinnerPDF = false;
        });
    });
  }

  onVendorAttachment() {
    var IdentityId = this.RRId;
    var IdentityType = CONST_IDENTITY_TYPE_RR;
    var VendorQuoteAttachment = this.VendorQuoteAttachment;
    this.modalRef = this.CommonmodalService.show(
      VendorQuoteAttachmentComponent,
      {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: { IdentityId, IdentityType, VendorQuoteAttachment },
          class: "modal-xl",
        },
        class: "gray modal-xl",
      }
    );

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.RRNotesInfo.push(res.data);
      this.reLoad();
    });
  }

  /*checkInventoryShopMove(ShopPartItems){
    ShopPartItems.forEach(item => {
      if(item.IsEcommerceProduct == 0){
        this.PartsMovedToStore = true;
      }
    });
    // this.PartsMovedToStore = true;
  }
*/

  getPreferedVendor() {
    const postData = new FormData();
    postData.append("Part No", this.PartNo);
    postData.append("Description", this.Description);

    this.service
      .postMEMSHttpService(postData, "MEMSPREDICTPOST")
      .subscribe((response) => {
        this.suggestedVendors =
          response && response.vendors ? response.vendors : "";
      });
  }
}
