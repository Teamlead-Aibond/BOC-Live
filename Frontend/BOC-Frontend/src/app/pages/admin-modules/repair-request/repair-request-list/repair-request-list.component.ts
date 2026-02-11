import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
} from "@angular/core";

import { cardData } from "./data";
import { DataTableDirective } from "angular-datatables";
import { concat, Observable, of, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import pdfMake from "pdfmake/build/pdfmake.min.js";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { NavigationEnd, Router } from "@angular/router";
import Swal from "sweetalert2";
import { environment } from "src/environments/environment";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { CommonService } from "src/app/core/services/common.service";
import * as moment from "moment";
import {
  CONST_VIEW_ACCESS,
  CONST_CREATE_ACCESS,
  CONST_MODIFY_ACCESS,
  CONST_DELETE_ACCESS,
  CONST_APPROVE_ACCESS,
  CONST_VIEW_COST_ACCESS,
  CONST_ACCESS_LIMIT,
  array_rr_status,
  shipping_status,
  shipping_category,
  warranty_type,
} from "src/assets/data/dropdown";
import { DatePipe } from "@angular/common";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { RrDuplicateComponent } from "../../common-template/rr-duplicate/rr-duplicate.component";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from "rxjs/operators";
import { Workbook } from "exceljs";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as fs from "file-saver";
import { SubStatusEditComponent } from "../../common-template/sub-status-edit/sub-status-edit.component";
import { RrAssigneeEditComponent } from "../../common-template/rr-assignee-edit/rr-assignee-edit.component";
import { BulkSubstatusAssignEditComponent } from "../../common-template/bulk-substatus-assign-edit/bulk-substatus-assign-edit.component";
import { RrEditPartLocationComponent } from "../../common-template/rr-edit-part-location/rr-edit-part-location.component";

@Component({
  selector: "app-repair-request-list",
  templateUrl: "./repair-request-list.component.html",
  styleUrls: ["./repair-request-list.component.scss"],
})
export class RepairRequestListComponent implements OnInit {
  ExcelData;
  RRReports: any = [];
  PartId;
  keywordForPartNo = "PartNo";
  partList: any[];
  isLoading: boolean = false;
  keywordForCustomer = "CompanyName";
  CustomersList: any[] = [];
  CustomerId;
  isLoadingCustomer: boolean = false;
  keywordForVendor = "VendorName";
  VendorsList: any[];
  VendorId = "";
  isLoadingVendor: boolean = false;
  keywordForRR = "RRNo";
  RRList: any[];
  RRId = "";
  isLoadingRR: boolean = false;
  keywordForVendorPO = "VendorPONo";
  VendorPOList: any[];
  RRIdVendorPO = "";
  isLoadingVendorPO: boolean = false;
  keywordForCustomerPONo = "CustomerPONo";
  CustomerPONoList: any[];
  RRIdCustomerPO;
  isLoadingCustomerPONo: boolean = false;
  keywordForCustomerSONo = "CustomerSONo";
  CustomerSONoList: any[];
  RRIdCustomerSO;
  isLoadingCustomerSONo: boolean = false;
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
  RRSalesOrder: any = [];
  RRPurchaseOrder: any = [];
  RRSalesInvoice: any = [];
  RRVendorBill: any = [];
  RRComplete: any = [];
  RRCustomerFollowup: any = [];
  RRVendorFollowup: any = [];
  RRNotes: any = [];
  RRAtachment: any = [];
  adminListddl: any = [];
  // Get the values for Access Rights
  VIEW_ACCESS = CONST_VIEW_ACCESS;
  CREATE_ACCESS = CONST_CREATE_ACCESS;
  MODIFY_ACCESS = CONST_MODIFY_ACCESS;
  DELETE_ACCESS = CONST_DELETE_ACCESS;
  APPROVE_ACCESS = CONST_APPROVE_ACCESS;
  VIEW_COST_ACCESS = CONST_VIEW_COST_ACCESS;

  ACCESS_LIMIT = CONST_ACCESS_LIMIT;

  model1;
  model2;
  FieldList = [
    {
      id: "1",
      FieldValue: "RRNo",
      FieldName: "Repair Request #",
      checked: true,
      targets: [0],
      visible: true,
      searchable: true,
    },
    {
      id: "2",
      FieldValue: "PartNo",
      checked: true,
      FieldName: "Part #",
      targets: [1],
      visible: true,
      searchable: true,
    },
    {
      id: "3",
      FieldValue: "Supplier",
      checked: false,
      FieldName: "Supplier",
      targets: [2],
      visible: false,
      searchable: true,
    },
    {
      id: "4",
      FieldValue: "Manufacturer",
      checked: false,
      FieldName: "Manufacturer",
      targets: [3],
      visible: false,
      searchable: true,
    },
    {
      id: "5",
      FieldValue: "ManufacturerPart",
      checked: false,
      FieldName: "Manufacturer Part #",
      targets: [4],
      visible: false,
      searchable: true,
    },
    {
      id: "6",
      FieldValue: "SerialNo",
      checked: true,
      FieldName: "Serial #",
      targets: [5],
      visible: true,
      searchable: true,
    },
    {
      id: "7",
      FieldValue: "Description",
      checked: true,
      FieldName: "Description",
      targets: [6],
      visible: true,
      searchable: true,
    },
    {
      id: "8",
      FieldValue: "StatusName",
      checked: false,
      FieldName: "Status",
      targets: [7],
      visible: false,
      searchable: true,
    },
    {
      id: "9",
      FieldValue: "Customer",
      checked: false,
      FieldName: "Customer",
      targets: [8],
      visible: false,
      searchable: true,
    },
    {
      id: "10",
      FieldValue: "Department",
      checked: false,
      FieldName: "Department",
      targets: [9],
      visible: false,
      searchable: true,
    },
    {
      id: "11",
      FieldValue: "CustomerPO",
      checked: false,
      FieldName: "Customer PO #",
      targets: [10],
      visible: false,
      searchable: true,
    },
    {
      id: "12",
      FieldValue: "RepairPrice",
      checked: false,
      FieldName: "Repair Price",
      targets: [11],
      visible: false,
      searchable: true,
    },
    {
      id: "13",
      FieldValue: "Quantity",
      checked: false,
      FieldName: "Quantity",
      targets: [12],
      visible: false,
      searchable: true,
    },
    {
      id: "14",
      FieldValue: "PriceOfNew",
      checked: false,
      FieldName: "Price Of New",
      targets: [13],
      visible: false,
      searchable: true,
    },
    {
      id: "15",
      FieldValue: "Cost",
      checked: false,
      FieldName: "Cost",
      targets: [14],
      visible: false,
      searchable: true,
    },
    {
      id: "16",
      FieldValue: "Shipping",
      checked: false,
      FieldName: "Shipping Cost",
      targets: [15],
      visible: false,
      searchable: true,
    },
    {
      id: "17",
      FieldValue: "AHReceivedDate",
      checked: false,
      FieldName: "AH Received Date",
      targets: [16],
      visible: false,
      searchable: true,
    },
    {
      id: "18",
      FieldValue: "QuoteSubmittedDate",
      checked: false,
      FieldName: "Quote Submitted Date",
      targets: [17],
      visible: false,
      searchable: true,
    },
    {
      id: "19",
      FieldValue: "ApprovedDate",
      checked: false,
      FieldName: "Approved Date (PO Receipt Date)",
      targets: [18],
      visible: false,
      searchable: true,
    },
    {
      id: "20",
      FieldValue: "VendorPONo",
      checked: false,
      FieldName: "Vendor PO #",
      targets: [19],
      visible: false,
      searchable: true,
    },
    {
      id: "21",
      FieldValue: "SalesOrderNo",
      checked: false,
      FieldName: "Sales Order #",
      targets: [20],
      visible: false,
      searchable: true,
    },
    {
      id: "22",
      FieldValue: "RejectedDate",
      checked: false,
      FieldName: "Rejected Date",
      targets: [21],
      visible: false,
      searchable: true,
    },
    {
      id: "23",
      FieldValue: "SalesOrderRequiredDate",
      checked: false,
      FieldName: "Sales Order Required Date",
      targets: [22],
      visible: false,
      searchable: true,
    },
    {
      id: "24",
      FieldValue: "DateCompleted",
      checked: false,
      FieldName: "Date Completed",
      targets: [23],
      visible: false,
      searchable: true,
    },
    {
      id: "25",
      FieldValue: "Invoice",
      checked: false,
      FieldName: "Invoice #",
      targets: [24],
      visible: false,
      searchable: true,
    },
    {
      id: "26",
      FieldValue: "RushNormal",
      checked: false,
      FieldName: "Rush / Normal",
      targets: [25],
      visible: false,
      searchable: true,
    },
    {
      id: "27",
      FieldValue: "WarrantyRecovery",
      checked: false,
      FieldName: "Warranty Recovery",
      targets: [26],
      visible: false,
      searchable: true,
    },
    {
      id: "28",
      FieldValue: "CustomerReference1",
      checked: false,
      FieldName: "Customer Reference 1",
      targets: [27],
      visible: false,
      searchable: true,
    },
    {
      id: "29",
      FieldValue: "CustomerReference2",
      checked: false,
      FieldName: "Customer Reference 2",
      targets: [28],
      visible: false,
      searchable: true,
    },
    {
      id: "30",
      FieldValue: "CustomerReference3",
      checked: false,
      FieldName: "Customer Reference 3",
      targets: [29],
      visible: false,
      searchable: true,
    },
    {
      id: "31",
      FieldValue: "CustomerReference4",
      checked: false,
      FieldName: "Customer Reference 4",
      targets: [30],
      visible: false,
      searchable: true,
    },
    {
      id: "32",
      FieldValue: "CustomerReference5",
      checked: false,
      FieldName: "Customer Reference 5",
      targets: [31],
      visible: false,
      searchable: true,
    },
    {
      id: "33",
      FieldValue: "CustomerReference6",
      checked: false,
      FieldName: "Customer Reference 6",
      targets: [32],
      visible: false,
      searchable: true,
    },
    {
      id: "34",
      FieldValue: "FollowUpStatus",
      checked: false,
      FieldName: "Follow Up Status",
      targets: [33],
      visible: false,
      searchable: true,
    },
    {
      id: "35",
      FieldValue: "CustomerPartNo1",
      checked: false,
      FieldName: "Customer Part #1",
      targets: [34],
      visible: false,
      searchable: true,
    },
    {
      id: "36",
      FieldValue: "CustomerPartNo2",
      checked: false,
      FieldName: "Customer Part #2",
      targets: [35],
      visible: false,
      searchable: true,
    },
    {
      id: "37",
      FieldValue: "CustomerStatedIssue",
      checked: false,
      FieldName: "Customer Stated Issue",
      targets: [36],
      visible: false,
      searchable: true,
    },
    {
      id: "38",
      FieldValue: "RootCause",
      checked: false,
      FieldName: "Root Cause",
      targets: [37],
      visible: false,
      searchable: true,
    },
    {
      id: "39",
      FieldValue: "VendorReferenceNo",
      checked: false,
      FieldName: "Vendor Reference #",
      targets: [38],
      visible: false,
      searchable: true,
    },
    {
      id: "40",
      FieldValue: "CustomerAssetName",
      checked: false,
      FieldName: "Customer Asset",
      targets: [39],
      visible: false,
      searchable: true,
    },
    {
      id: "41",
      FieldValue: "InternalNotes",
      checked: false,
      FieldName: "Internal Notes",
      targets: [40],
      visible: false,
      searchable: true,
    },
    {
      id: "42",
      FieldValue: "SubStatusId",
      checked: false,
      FieldName: "Sub Status",
      targets: [41],
      visible: false,
      searchable: true,
    },
    {
      id: "43",
      FieldValue: "AssigneeUserId",
      checked: false,
      FieldName: "Assignee",
      targets: [42],
      visible: false,
      searchable: true,
    },
    {
      id: "44",
      FieldValue: "RRPartLocationId",
      checked: false,
      FieldName: "RR Part Location",
      targets: [43],
      visible: false,
      searchable: true,
    },
    {
      id: "45",
      FieldValue: "PODueDate",
      checked: false,
      FieldName: "Purchase Order Due Date",
      targets: [44],
      visible: false,
      searchable: true,
    },
    {
      id: "46",
      FieldValue: "VendorRefNo",
      checked: false,
      FieldName: "Vendor Ref No",
      targets: [44],
      visible: false,
      searchable: true,
    },
  ];

  POFieldList = [
    {
      id: "1",
      FieldValue: "PONo",
      FieldName: "PO #",
      checked: false,
    },
    {
      id: "2",
      FieldValue: "POAmount",
      checked: false,
      FieldName: "PO Amount",
    },
  ];
  RRFieldList = [
    {
      id: "1",
      FieldValue: "RRNo",
      FieldName: "Repair Request #",
      checked: false,
    },
    {
      id: "2",
      FieldValue: "PartNo",
      checked: false,
      FieldName: "Part #",
    },
    {
      id: "3",
      FieldValue: "Supplier",
      checked: false,
      FieldName: "Supplier",
    },
    {
      id: "4",
      FieldValue: "Manufacturer",
      checked: false,
      FieldName: "Manufacturer",
    },
    {
      id: "5",
      FieldValue: "ManufacturerPartNo",
      checked: false,
      FieldName: "Manufacturer Part #",
    },
    {
      id: "6",
      FieldValue: "SerialNo",
      checked: false,
      FieldName: "Serial #",
    },
    {
      id: "7",
      FieldValue: "Description",
      checked: false,
      FieldName: "Description",
    },
    {
      id: "8",
      FieldValue: "Status",
      checked: false,
      FieldName: "Status",
    },
    {
      id: "9",
      FieldValue: "Customer",
      checked: false,
      FieldName: "Customer",
    },
    {
      id: "10",
      FieldValue: "Department",
      checked: false,
      FieldName: "Department",
    },
    {
      id: "11",
      FieldValue: "CustomerPONo",
      checked: false,
      FieldName: "Customer PO #",
    },
    {
      id: "12",
      FieldValue: "RepairPrice",
      checked: false,
      FieldName: "Repair Price",
    },
    {
      id: "13",
      FieldValue: "Quantity",
      checked: false,
      FieldName: "Quantity",
    },
    {
      id: "14",
      FieldValue: "PriceOfNew",
      checked: false,
      FieldName: "Price Of New",
    },
    {
      id: "15",
      FieldValue: "Cost",
      checked: false,
      FieldName: "Cost",
    },
    {
      id: "16",
      FieldValue: "ShippingCost",
      checked: false,
      FieldName: "Shipping Cost",
    },
    {
      id: "17",
      FieldValue: "AHReceivedDate",
      checked: false,
      FieldName: "AH Received Date",
    },
    {
      id: "18",
      FieldValue: "QuoteSubmittedDate",
      checked: false,
      FieldName: "Quote Submitted Date",
    },
    {
      id: "19",
      FieldValue: "ApprovedDate",
      checked: false,
      FieldName: "Approved Date (PO Receipt Date)",
    },
    {
      id: "20",
      FieldValue: "VendorPONo",
      checked: false,
      FieldName: "Vendor PO #",
    },
    {
      id: "21",
      FieldValue: "SalesOrderNo",
      checked: false,
      FieldName: "Sales Order #",
    },
    {
      id: "22",
      FieldValue: "RejectedDate",
      checked: false,
      FieldName: "Rejected Date",
    },
    {
      id: "23",
      FieldValue: "SalesOrderRequiredDate",
      checked: false,
      FieldName: "Sales Order Required Date",
    },
    {
      id: "24",
      FieldValue: "DateCompleted",
      checked: false,
      FieldName: "Date Completed",
    },
    {
      id: "25",
      FieldValue: "InvoiceNo",
      checked: false,
      FieldName: "Invoice #",
    },
    {
      id: "26",
      FieldValue: "RushNormal",
      checked: false,
      FieldName: "Rush / Normal",
    },
    {
      id: "27",
      FieldValue: "WarrantyRecovery",
      checked: false,
      FieldName: "Warranty Recovery",
    },
    {
      id: "28",
      FieldValue: "CustomerReference1",
      checked: false,
      FieldName: "Customer Reference 1",
    },
    {
      id: "29",
      FieldValue: "CustomerReference2",
      checked: false,
      FieldName: "Customer Reference 2",
    },
    {
      id: "30",
      FieldValue: "CustomerReference3",
      checked: false,
      FieldName: "Customer Reference 3",
    },
    {
      id: "31",
      FieldValue: "CustomerReference4",
      checked: false,
      FieldName: "Customer Reference 4",
    },
    {
      id: "32",
      FieldValue: "CustomerReference5",
      checked: false,
      FieldName: "Customer Reference 5",
    },
    {
      id: "33",
      FieldValue: "CustomerReference6",
      checked: false,
      FieldName: "Customer Reference 6",
    },
    {
      id: "34",
      FieldValue: "CustomerReference5",
      checked: false,
      FieldName: "Customer Reference 5",
    },
    {
      id: "35",
      FieldValue: "FollowUpStatus",
      checked: false,
      FieldName: "Follow Up Status",
    },
    {
      id: "36",
      FieldValue: "CustomerPart1",
      checked: false,
      FieldName: "Customer Part #1",
    },
    {
      id: "37",
      FieldValue: "CustomerPart2",
      checked: false,
      FieldName: "Customer Part #2",
    },
    {
      id: "38",
      FieldValue: "CustomerStatedIssue",
      checked: false,
      FieldName: "Customer Stated Issue",
    },
    {
      id: "39",
      FieldValue: "RootCause",
      checked: false,
      FieldName: "Root Cause",
    },
    {
      id: "40",
      FieldValue: "VendorReferenceNo",
      checked: false,
      FieldName: "Vendor Reference #",
    },
    {
      id: "41",
      FieldValue: "CustomerAssetName",
      checked: false,
      FieldName: "Customer Asset",
    },
    {
      id: "42",
      FieldValue: "InternalNotes",
      checked: false,
      FieldName: "Internal Notes",
    },
    {
      id: "43",
      FieldValue: "SubStatusId",
      checked: false,
      FieldName: "Sub Status",
    },
    {
      id: "44",
      FieldValue: "AssigneeUserId",
      checked: false,
      FieldName: "Assignee",
    },
    {
      id: "45",
      FieldValue: "RRPartLocationId",
      checked: false,
      FieldName: "RR Part Location",
    },
    {
      id: "46",
      FieldValue: "PODueDate",
      checked: false,
      FieldName: "Purchase Order Due Date",
    },
    {
      id: "46",
      FieldValue: "VendorRefNo",
      checked: false,
      FieldName: "Vendor Ref No",
    },
  ];
  // Datepicker
  selected: any;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean;
  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
    "Last 7 Days": [moment().subtract(6, "days"), moment()],
    "Last 15 Days": [moment().subtract(14, "days"), moment()],
    "Last 30 Days": [moment().subtract(29, "days"), moment()],
    "This Month": [moment().startOf("month"), moment().endOf("month")],
    "Last Month": [
      moment().subtract(1, "month").startOf("month"),
      moment().subtract(1, "month").endOf("month"),
    ],
  };

  invalidDates: moment.Moment[] = [
    moment().add(2, "days"),
    moment().add(3, "days"),
    moment().add(5, "days"),
  ];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some((d) => d.isSame(m, "day"));
  };
  dateFilter = { startDate: moment().subtract(29, "days"), endDate: moment() };

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dtTrigger: Subject<any> = new Subject();
  baseUrl = `${environment.api.apiURL}`;
  api_check: any;
  dataTable: any;

  @Input() dateFilterField;
  @ViewChild("dataTable", { static: true }) table;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  public RRNo: string;
  public PartNo: string;
  public SerialNo: string;
  public CompanyName: any = [];
  public FirstName: string;
  public LastName: string;
  public Status: string = "";
  public CustomerSONo: string;
  public CustomerPONo: string;
  public IsWarrantyRecovery: string;
  public IsRushRepair: string;
  public IsRepairTag: string;
  public VendorName: string;
  public VendorPONo: string;
  public RRDescription: string;
  public CustomerPartNo1: string;
  public ReferenceValue: string;
  public StatusChangeId: string = "";
  CustomerGroupId: any;
  StatusChangeTo;
  StatusChangeFrom;
  StatusChangeFromDate;
  StatusChangeToDate;
  // Card Data
  cardData: any;
  tableData: any = [];
  statData: any = [];
  Status0: string;
  Status1: string;
  Status2: string;
  Status3: string;
  Status4: string;
  Status5: string;
  Status6: string;
  Status7: string;
  RRvalue: string;
  RRtype: string;
  IsPartsDeliveredToCustomer: string = "";
  CustomerInvoiceId: string = "";
  VendorInvoiceId: string = "";
  ShippingStatus: string = "";
  ShippingStatusCategory = "";
  IsSOCreated = "";
  QuoteApprovedBy = "";
  //accessRights: Array<{}>;
  RRStatus: any = [];
  ShippingStatusList: any = [];
  ShippingStatusCategoryList: any = [];
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  RRfield;
  POfield;
  DownloadOptionRRList;
  WarrantyList: any = [];
  adminList: any;
  subStatusList: any = [];
  SubStatusId;
  AssigneeUserId;
  RRPartLocationId;
  RRPartLocationList: any = [];
  RRSubStatusEdit: boolean = false;
  RRAssignToEdit: boolean = false;
  RRSubStatusView: boolean = false;
  RRAssignToView: boolean = false;
  RRSubStatusAdd: boolean = false;
  RRAssignToAdd: boolean = false;
  RRPartLocationAdd: boolean = false;
  RRPartLocationEdit: boolean = false;
  RRPartLocationView: boolean = false;
  customerGroupList: any;
  emptyValue: any = "";
  initLoad: boolean = true;
  constructor(
    private http: HttpClient,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private CommonmodalService: BsModalService,
    public modalRef: BsModalRef,
    private cd_ref: ChangeDetectorRef,
    public service: CommonService,
    private datePipe: DatePipe
  ) {
    this.alwaysShowCalendars = true;
    this.showRangeLabelOnInput = true;
    this.keepCalendarOpeningWithRange = true;

    // Reload after reuse
    // this.router.onSameUrlNavigation = 'reload';
    // this.router.events.subscribe(event => {
    //   if (!(event instanceof NavigationEnd)) { return; }
    //   // Do what you need to do here, for instance :
    //   this.dtTrigger.next();
    // });
  }
  currentRouter = this.router.url;
  ngOnInit() {
    document.title = "RR List";
    this.dataTableMessage = "Loading...";
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Repair Request", path: "/admin/repair-request/list/" },
      { label: "List", path: "/", active: true },
    ];

    // Get Card Data
    this.cardData = cardData;
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
    this.DownloadOptionRRList = this.service.permissionCheck(
      "DownloadOptionRRList",
      CONST_VIEW_ACCESS
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
    this.RRPartLocationEdit = this.service.permissionCheck(
      "RRPartLocation",
      CONST_MODIFY_ACCESS
    );
    this.RRPartLocationView = this.service.permissionCheck(
      "RRPartLocation",
      CONST_VIEW_ACCESS
    );
    this.RRStatus = array_rr_status;
    this.ShippingStatusList = shipping_status;
    this.ShippingStatusCategoryList = shipping_category;
    this.WarrantyList = warranty_type;
    this.getList();
    this.FieldList.map((fl) => {
      if (fl.checked == true) {
        this.RRReports.push(fl);
      }
    });
  }
  getList() {
    var StatusName = history.state.StatusName;
    var StatusValue = history.state.Status;
    var FromDate = history.state.FromDate;
    var ToDate = history.state.ToDate;
    var DateType = history.state.DateType;
    var Number1 = history.state.Number1;
    var Number2 = history.state.Number2;
    var Current = history.state.Current;
    var Customer = history.state.Customer;
    var Location = history.state.Location;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };

    var url =
      this.baseUrl + "/api/v1.0/repairrequestnotes/getRRListByServerSide";
    const that = this;
    var filterData = {
      Status: StatusValue,
      FromDate: FromDate,
      ToDate: ToDate,
      Number1: Number1,
      Number2: Number2,
      Current: Current,
      CustomerId: Customer,
      CreatedByLocation: Location,
    };

    if (this.DownloadOptionRRList) {
      var buttons = {};
      buttons = {
        dom: {
          button: {
            className: "",
          },
        },
        buttons: [
          {
            extend: "colvis",
            className: "btn btn-xs btn-primary",
            text: "COLUMNS",
          },
          {
            extend: "excelHtml5",
            text: "EXCEL",
            className: "btn btn-xs btn-secondary",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "csvHtml5",
            text: "CSV",
            className: "btn btn-xs btn-secondary",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "pdfHtml5",
            text: "PDF",
            className: "btn btn-xs btn-secondary",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "print",
            className: "btn btn-xs btn-secondary",
            text: "PRINT",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "copy",
            className: "btn btn-xs btn-secondary",
            text: "COPY",
            exportOptions: {
              columns: ":visible",
            },
          },
        ],
      };
    } else {
      buttons = {
        dom: {
          button: {
            className: "",
          },
        },
        buttons: [],
      };
    }
    this.dtOptions = {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-12 col-sm-4 col-md-4 col-xl-4"l><"col-12 col-sm-4 col-md-4 col-xl-4"i><"col-12 col-sm-4 col-md-4 col-xl-4"p>>',
      pagingType: "full_numbers",
      pageLength: 10,
      lengthMenu: [
        [10, 25, 50, 100, -1],
        [10, 25, 50, 100, "All"],
      ],
      processing: true,
      serverSide: true,
      retrieve: true,
      order: [[0, "desc"]],
      serverMethod: "post",
      ajax: (dataTablesParameters: any, callback) => {
        that.api_check ? that.api_check.unsubscribe() : (that.api_check = null);

        that.api_check = that.http
          .post<any>(
            url,
            Object.assign(dataTablesParameters, filterData),
            httpOptions
          )
          .subscribe((resp) => {
            if (this.initLoad) {
              this.loadCustomers();
              this.getCustomerGroupList();
              this.getAdminList();
              this.getAdminList2();
              this.getSubStatusList();
              this.getPartLocationList();
              this.onStat();
            }
            this.initLoad = false;
            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: resp.responseData.data,
            });
          });
      },
      buttons: buttons,
      columnDefs: [
        {
          targets: [11],
          visible: false,
          searchable: true,
        },
        {
          targets: [12],
          visible: false,
          searchable: true,
        },
        {
          targets: [13],
          visible: false,
          searchable: true,
        },
        {
          targets: [14],
          visible: false,
          searchable: true,
        },
        {
          targets: [15],
          visible: false,
          searchable: true,
        },
        {
          targets: [16],
          visible: false,
          searchable: true,
        },
        {
          targets: [17],
          visible: false,
          searchable: true,
        },
        {
          targets: [18],
          visible: false,
          searchable: true,
        },
        {
          targets: [19],
          visible: false,
          searchable: true,
        },
        {
          targets: [20],
          visible: false,
          searchable: true,
        },
        {
          targets: [21],
          visible: false,
          searchable: true,
        },
        {
          targets: [22],
          visible: false,
          searchable: true,
        },
        {
          targets: [23],
          visible: false,
          searchable: true,
        },
        {
          targets: [24],
          visible: false,
          searchable: true,
        },
        {
          targets: [25],
          visible: false,
          searchable: true,
        },
        {
          targets: [26],
          visible: false,
          searchable: true,
        },
        {
          targets: [27],
          visible: false,
          searchable: true,
        },
        {
          targets: [28],
          visible: false,
          searchable: true,
        },
        {
          targets: [29],
          visible: false,
          searchable: true,
        },
        {
          targets: [30],
          visible: false,
          searchable: true,
        },
        {
          targets: [31],
          visible: false,
          searchable: true,
        },
        {
          targets: [32],
          visible: false,
          searchable: true,
        },
        {
          targets: [33],
          visible: false,
          searchable: true,
        },
        {
          targets: [34],
          visible: false,
          searchable: true,
        },
        {
          targets: [35],
          visible: false,
          searchable: true,
        },
        {
          targets: [36],
          visible: false,
          searchable: true,
        },
        {
          targets: [37],
          visible: false,
          searchable: true,
        },
        {
          targets: [38],
          visible: false,
          searchable: true,
        },
        {
          targets: [39],
          visible: false,
          searchable: true,
        },

        {
          targets: [43],
          visible: false,
          searchable: true,
        },
        {
          targets: [44],
          visible: false,
          searchable: true,
        },
        {
          targets: [45],
          visible: false,
          searchable: true,
        },
        {
          targets: [46],
          visible: false,
          searchable: true,
        },
        {
          targets: [47],
          visible: false,
          searchable: true,
        },
        {
          targets: [48],
          visible: false,
          searchable: true,
        },
        {
          targets: [49],
          visible: false,
          searchable: true,
        },

        {
          targets: [56],
          visible: false,
          searchable: true,
        },
        {
          targets: [58],
          visible: false,
          searchable: true,
        },
        {
          targets: [59],
          visible: false,
          searchable: true,
        },
        {
          targets: [60],
          visible: false,
          searchable: true,
        },
        {
          targets: [61],
          visible: false,
          searchable: true,
        },
      ],
      createdRow: function (row, data, index) {
        if (data.AddedFrom == 1) {
          // && data.Status == 0  && data.StatusId == 0
          $(row).addClass("bg-light");
        }
        if (data.Status == 5 && data.DueDatePassed == "1") {
          $(row).addClass("bg-dueDatealert");
        }

        if (data.Status == 5 && data.DueDateNears == "1") {
          $(row).addClass("bg-dueDatebeforealert");
        }

        // Set the Customer Type
        var cstyle1 = "badge-light-success";

        if (data.SerialNo) {
          var serialno = data.SerialNo;
          if (serialno.length > 20) serialno = serialno.substr(0, 24) + " ..";
          var html =
            '<span class="badge ' +
            cstyle1 +
            ' btn-xs">' +
            serialno +
            "</span>";
          $("td", row).eq(3).html(html);
        }

        //image row
        html =
          '<img  class="rounded-square img-thumbnail avatar-xl" src="assets/images/No Image Available.png">';
        if (
          data.RRImage != "" &&
          data.RRImage != "undefined" &&
          data.RRImage != null
        )
          html =
            '<img  class="rounded-square img-thumbnail avatar-xl" src="' +
            data.RRImage +
            '">';
        $("td", row).eq(1).html(html);

        var statusObj = array_rr_status.find((a) => a.id == data.Status);
        var html =
          '<span class="badge ' +
          (statusObj ? statusObj.cstyle : "") +
          ' btn-xs">' +
          (statusObj ? statusObj.title : "") +
          "</span>";
        $("td", row).eq(6).html(html);

        var html = `<a href="#/admin/repair-request/edit?RRId=${data.RRId}" target="_blank"  data-toggle='tooltip' title='RR View' data-placement='top'>${data.RRNo}</a>`;
        $("td", row).eq(0).html(html);

        var html = "";

        if (data.SubStatusId != 0 && data.AssigneeUserId != 0) {
          if (that.RRSubStatusView) {
            html += `<span class="badge badge-pink"> ${data.SubStatusName}</span>&nbsp;`;
          }
          if (that.RRSubStatusEdit && data.IsActive == 1) {
            html += `<a href="#" class="fa fa-edit text-secondary actionViewSubStatus" data-toggle='tooltip' title='Edit RR Sub Status' data-placement='top'></a> &nbsp;
          `;
          }
          if (that.RRAssignToView) {
            html += `<br><span class="mt-2 badge badge-secondary">${data.AssigneeName}</span>&nbsp;`;
          }
          if (that.RRAssignToEdit && data.IsActive == 1) {
            html += `<a href="#" class="fa fa-edit text-secondary actionViewAssignee" data-toggle='tooltip' title='Edit RR Assign To' data-placement='top'></a> &nbsp;`;
          }
          html += `<br><br><span class="mt-2" style="font-weight: bold;">Assigned By: ${data.SubTaskAssignedBy}</span>&nbsp;`;
        } else {
          if (that.RRAssignToAdd && that.RRSubStatusAdd && data.IsActive == 1) {
            html += `<button href="#" class="btn btn-xs btn-primary actionViewBulkEdit" data-toggle='tooltip' title='Edit RR Sub Status' data-placement='top'>Add Sub Status & Assign To</button> &nbsp;`;
          }
        }
        $("td", row).eq(7).html(html);

        var html1 = "";
        if (data.RRPartLocationId != 0) {
          if (that.RRPartLocationView) {
            html1 += `<span class="badge badge-purple"> ${data.RRPartLocationName}</span>&nbsp;`;
          }
          if (that.RRPartLocationEdit && data.IsActive == 1) {
            html1 += `<a href="#" class="fa fa-edit text-secondary actionEditRRPartLocation" data-toggle='tooltip' title='Edit RR Part Location' data-placement='top'></a> &nbsp;
          <br>`;
          }
        } else {
          if (that.RRPartLocationAdd && data.IsActive == 1) {
            html1 += `<button href="#" class="btn btn-sm btn-success actionAddRRPartLocation" data-toggle='tooltip' title='Add RR Part Location' data-placement='top'>Add RR Part Location</button> &nbsp;`;
          }
        }
        $("td", row).eq(8).html(html1);
      },
      columns: [
        {
          data: "RRNo",
          name: "RRNo",
          defaultContent: "",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            //RepairMessage show condition
            var repairMessage = "";
            var repairMessage1 = "";
            if (row.IsRushRepair == "true") {
              var repairMessage = "Rush Repair";
            }
            if (row.IsWarrantyRecovery == 1) {
              var repairMessage = "Warranty Repair";
            }
            if (row.IsWarrantyRecovery == 2) {
              var repairMessage = "Warranty New";
            }
            if (row.IsRushRepair == "true" && row.IsWarrantyRecovery == 1) {
              var repairMessage = "Rush Repair";
              var repairMessage1 = "Warranty Repair";
            }

            var content = row.RRNo;
            if (that.RR[that.MODIFY_ACCESS] == 1) {
              content = `<a href="#" class="actionView1" data-toggle='tooltip' title='RR View' data-placement='top'>${row.RRNo}</a>`;
            }

            return (
              content +
              "<br>" +
              '<span style="font-weight: bold;padding: 0px;color: red">' +
              repairMessage +
              "<br>" +
              repairMessage1 +
              "</span>"
            );
          },
        },
        { data: "RRImage", name: "RRImage", orderable: true, searchable: true },
        {
          data: "PartNo",
          name: "PartNo",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.PartId && row.PartId > 0) {
              return `<a href="#" class="actionView4" data-toggle='tooltip' title='Part View' data-placement='top'>${row.PartNo}</a>`;
            } else {
              return row.PartNo;
            }
          },
        },
        {
          data: "SerialNo",
          name: "SerialNo",
          orderable: true,
          searchable: true,
        },
        {
          data: "CompanyName",
          name: "CompanyName",
          orderable: true,
          searchable: true,
        },
        {
          data: "VendorName",
          name: "VendorName",
          orderable: true,
          searchable: true,
        },
        {
          data: "StatusName",
          name: "StatusName",
          orderable: true,
          searchable: true,
        },
        {
          data: "SubStatusId",
          name: "SubStatusId",
          orderable: true,
          searchable: true,
        },
        {
          data: "RRPartLocationId",
          name: "RRPartLocationId",
          orderable: true,
          searchable: true,
        },
        {
          data: "RRId",
          name: "RRId",
          className: "text-center",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var link = "";
            if (this.RRDuplicate[this.CREATE_ACCESS] == 1) {
              link += `<a href="#" class="fa fa-clone text-secondary actionView2" data-toggle='tooltip' title='RR Duplicate' data-placement='top'></a> &nbsp;`;
            }

            if (this.RR[this.MODIFY_ACCESS] == 1) {
              link += `<a href="#/admin/repair-request/edit?RRId=${row.RRId}" class="fa fa-edit text-secondary" target="_blank" data-toggle='tooltip' title='RR Edit' data-placement='top'></a> &nbsp;`;
            }

            if (this.RR[this.DELETE_ACCESS] == 1) {
              link += `<a href="#" class="fa fa-trash text-danger actionView3" data-toggle='tooltip' title='RR Delete' data-placement='top'></a>`;
            }
            return link;
          },
        },
        { data: "Created", name: "Created", orderable: true, searchable: true },
        { data: "Invoice", name: "Invoice", orderable: true, searchable: true },
        {
          data: "VendorPONo",
          name: "VendorPONo",
          orderable: true,
          searchable: true,
        },
        {
          data: "RRDescription",
          name: "RRDescription",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerSONo",
          name: "CustomerSONo",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerPartNo1",
          name: "CustomerPartNo1",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerPONo",
          name: "CustomerPONo",
          orderable: true,
          searchable: true,
        },
        {
          data: "ReferenceValue",
          name: "ReferenceValue",
          orderable: true,
          searchable: true,
        },
        {
          data: "IsWarrantyRecovery",
          name: "IsWarrantyRecovery",
          orderable: true,
          searchable: true,
        },
        {
          data: "IsRushRepair",
          name: "IsRushRepair",
          orderable: true,
          searchable: true,
        },
        {
          data: "IsRepairTag",
          name: "IsRepairTag",
          orderable: true,
          searchable: true,
        },
        {
          data: "SODueDatePassed",
          name: "SODueDatePassed",
          orderable: true,
          searchable: true,
        },
        {
          data: "PODueDatePassed",
          name: "PODueDatePassed",
          orderable: true,
          searchable: true,
        },
        {
          data: "InvDueDatePassed",
          name: "InvDueDatePassed",
          orderable: true,
          searchable: true,
        },
        {
          data: "SODueDateNears",
          name: "SODueDateNears",
          orderable: true,
          searchable: true,
        },
        {
          data: "PODueDateNears",
          name: "PODueDateNears",
          orderable: true,
          searchable: true,
        },
        {
          data: "InvDueDateNears",
          name: "InvDueDateNears",
          orderable: true,
          searchable: true,
        },
        {
          data: "MobileVerify",
          name: "MobileVerify",
          orderable: true,
          searchable: true,
        },
        {
          data: "IsPartsDeliveredToCustomer",
          name: "IsPartsDeliveredToCustomer",
          orderable: true,
          searchable: true,
        },
        {
          data: "VendorInvoiceId",
          name: "VendorInvoiceId",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerInvoiceId",
          name: "CustomerInvoiceId",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerId",
          name: "CustomerId",
          orderable: true,
          searchable: true,
        },
        {
          data: "VendorId",
          name: "VendorId",
          orderable: true,
          searchable: true,
        },
        { data: "PartId", name: "PartId", orderable: true, searchable: true },
        {
          data: "RRIdVendorPO",
          name: "RRIdVendorPO",
          orderable: true,
          searchable: true,
        },
        {
          data: "RRIdCustomerPO",
          name: "RRIdCustomerPO",
          orderable: true,
          searchable: true,
        },
        {
          data: "RRIdCustomerSO",
          name: "RRIdCustomerSO",
          orderable: true,
          searchable: true,
        },
        {
          data: "StatusChangeFrom",
          name: "StatusChangeFrom",
          orderable: true,
          searchable: true,
        },
        {
          data: "StatusChangeTo",
          name: "StatusChangeTo",
          orderable: true,
          searchable: true,
        },
        {
          data: "StatusChangeId",
          name: "StatusChangeId",
          orderable: true,
          searchable: true,
        },
        {
          data: "InvoiceAmountOrQuoteAmount",
          name: "InvoiceAmountOrQuoteAmount",
          orderable: true,
          searchable: true,
        },
        {
          data: "SONo",
          name: "SONo",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var link = "";
            if (row.SONo) {
              link += `<a href="#/admin/orders/sales-list?SOId=${row.CustomerSOId}" target="_blank"  data-toggle='tooltip' title='SO View' data-placement='top'>${row.SONo}</a>`;
            } else {
              return '<a  ngbTooltip="View">' + "-" + "</a>";
            }
            return link;
          },
        },
        {
          data: "PONo",
          name: "PONo",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var link = "";
            if (row.PONo) {
              link += `<a href="#/admin/orders/purchase-list?POId=${row.VendorPOId}" target="_blank"  data-toggle='tooltip' title='PO View' data-placement='top'>${row.PONo}</a>`;
            } else {
              return '<a  ngbTooltip="View">' + "-" + "</a>";
            }
            return link;
          },
        },
        {
          data: "InvoiceNo",
          name: "InvoiceNo",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var link = "";
            if (row.InvoiceNo) {
              link += `<a href="#/admin/invoice/list?InvoiceId=${row.CustomerInvoiceId}" target="_blank"  data-toggle='tooltip' title='Invoice View' data-placement='top'>${row.InvoiceNo}</a>`;
            } else {
              return '<a  ngbTooltip="View">' + "-" + "</a>";
            }
            return link;
          },
        },
        {
          data: "CustomerPONo",
          name: "CustomerPONo",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var link = "";
            if (row.CustomerBlanketPOId != 0) {
              link += `<a  href="#/admin/Blanket-PO-History?CustomerBlanketPOId=${row.CustomerBlanketPOId}"  target="_blank"   data-toggle= 'tooltip' title='Blanket PO' data-placement= 'top'>${row.CustomerPONo}</a>`;
            } else if (row.CustomerPONo != null) {
              link += `<a>${row.CustomerPONo}</a>`;
            }
            return link;
          },
        },

        {
          data: "ShippingStatus",
          name: "ShippingStatus",
          orderable: true,
          searchable: true,
        },
        {
          data: "ShippingStatusCategory",
          name: "ShippingStatusCategory",
          orderable: true,
          searchable: true,
        },
        {
          data: "QuoteApprovedBy",
          name: "QuoteApprovedBy",
          orderable: true,
          searchable: true,
        },
        {
          data: "IsSOCreated",
          name: "IsSOCreated",
          orderable: true,
          searchable: true,
        },
        { data: "Status", name: "Status", orderable: true, searchable: true },
        {
          data: "CustomerReference1",
          name: "CustomerReference1",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerReference2",
          name: "CustomerReference2",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerReference3",
          name: "CustomerReference3",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerReference4",
          name: "CustomerReference4",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerReference5",
          name: "CustomerReference5",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerReference6",
          name: "CustomerReference6",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerAssetName",
          name: "CustomerAssetName",
          orderable: true,
          searchable: true,
        },
        {
          data: "RepairPrice",
          name: "RepairPrice",
          orderable: true,
          searchable: true,
        },
        {
          data: "SubStatusId",
          name: "SubStatusId",
          orderable: true,
          searchable: true,
        },
        {
          data: "AssigneeUserId",
          name: "AssigneeUserId",
          orderable: true,
          searchable: true,
        },
        {
          data: "RRPartLocationId",
          name: "RRPartLocationId",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerGroupId",
          name: "CustomerGroupId",
          orderable: true,
          searchable: true,
        },
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $(".actionView1", row).unbind("click");
        if (this.RR[this.MODIFY_ACCESS] == 1) {
          $(".actionView1", row).bind("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.router.navigate(["/admin/repair-request/edit"], {
              queryParams: { RRId: data.RRId },
            });
          });
        }

        $(".actionView3", row).unbind("click");
        $(".actionView3", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDelete(data.RRId);
        });

        $(".actionView2", row).unbind("click");
        $(".actionView2", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onduplicate(data.RRId);
        });
        $(".actionView4", row).unbind("click");
        $(".actionView4", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(["/admin/parts-edit"], {
            state: { PartId: data.PartId, RRId: data.RRId },
          });
        });

        $(".actionViewSubStatus", row).unbind("click");
        $(".actionViewSubStatus", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onSubStatusEdit(
            data.RRId,
            data.SubStatusId,
            data.AssigneeUserId
          );
        });

        $(".actionViewAssignee", row).unbind("click");
        $(".actionViewAssignee", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onAssigneeEdit(data.RRId, data.AssigneeUserId, data.SubStatusId);
        });

        $(".actionViewBulkEdit", row).unbind("click");
        $(".actionViewBulkEdit", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onBulkEdit(data.RRId);
        });

        $(".actionAddRRPartLocation", row).unbind("click");
        $(".actionAddRRPartLocation", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onAddPartLocation(data.RRId);
        });
        $(".actionEditRRPartLocation", row).unbind("click");
        $(".actionEditRRPartLocation", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onEditPartLocation(data.RRId, data.RRPartLocationId);
        });
        return row;
      },
      preDrawCallback: function () {
        $("#datatable-angular-rr_processing").attr(
          "style",
          "display: block; z-index: 10000 !important"
        );
      },
      language: {
        paginate: {
          first: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          last: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          next: '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          previous: '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        },
        loadingRecords: "&nbsp;",
        processing: "Loading...",
      },
    };
    this.dataTable = $("#datatable-angular-rr");
    this.dataTable.DataTable(this.dtOptions);
  }
  getPartLocationList() {
    this.service.getHttpService("RRPartLocationDDl").subscribe(
      (response) => {
        if (response.status == true) {
          this.RRPartLocationList = response.responseData;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }
  getAccessRightsByFind(arr, code) {
    return arr.find((x) => x.code === code);
  }

  reLoad() {
    this.router.navigate([this.currentRouter]);
  }

  elementClicked = "Passed Due Date";
  elementClicked1 = "Due Date";

  onClick(e) {
    this.elementClicked = e.target.innerHTML;
    let obj = this;
    var table = $("#datatable-angular-rr").DataTable();
    obj.elementClicked1 = "Due Date";
    table.columns(18).search("");
    table.columns(19).search("");
    table.columns(20).search("");
    table.columns(21).search("");
    table.columns(22).search("");
    table.columns(23).search("");
    if (obj.elementClicked == "SO Due Date Passed") {
      table.columns(21).search("1");
    }

    if (obj.elementClicked == "PO Due Date Passed") {
      table.columns(22).search("1");
    }

    if (obj.elementClicked == "Invoice Due date passed") {
      table.columns(23).search("1");
    }

    table.draw();
  }
  onClickVerification(e) {
    if (e == true) {
      var table = $("#datatable-angular-rr").DataTable();
      table.columns(27).search("1");
      table.draw();
    } else {
      var table = $("#datatable-angular-rr").DataTable();
      table.columns(27).search("");
      table.draw();
    }
  }

  onClick1(e) {
    this.elementClicked1 = e.target.innerHTML;
    let obj = this;
    var table = $("#datatable-angular-rr").DataTable();
    obj.elementClicked = "Passed Due Date";
    table.columns(18).search("");
    table.columns(19).search("");
    table.columns(20).search("");
    table.columns(21).search("");
    table.columns(22).search("");
    table.columns(23).search("");
    if (obj.elementClicked1 == "SO Due date in 2 days") {
      table.columns(24).search("1");
    }
    if (obj.elementClicked1 == "PO Due date in 2 days") {
      table.columns(25).search("1");
    }
    if (obj.elementClicked1 == "Invoice Due in 2 days") {
      table.columns(26).search("1");
    }
    table.draw();
  }

  StatusChangeToDataFormat(StatusChangeTo) {
    if (StatusChangeTo != null) {
      const StatusChangeToYears = StatusChangeTo.year;
      const StatusChangeToDates = StatusChangeTo.day;
      const StatusChangeTomonths = StatusChangeTo.month;
      let StatusChangeToDate = new Date(
        StatusChangeToYears,
        StatusChangeTomonths - 1,
        StatusChangeToDates
      );
      this.StatusChangeToDate = moment(StatusChangeToDate).format("YYYY-MM-DD");
    } else {
      this.StatusChangeToDate = "";
    }
  }
  StatusChangeFromDataFormat(StatusChangeFrom) {
    if (StatusChangeFrom != null) {
      const StatusChangeFromYears = StatusChangeFrom.year;
      const StatusChangeFromDates = StatusChangeFrom.day;
      const StatusChangeFrommonths = StatusChangeFrom.month;
      let StatusChangeFromDate = new Date(
        StatusChangeFromYears,
        StatusChangeFrommonths - 1,
        StatusChangeFromDates
      );
      this.StatusChangeFromDate =
        moment(StatusChangeFromDate).format("YYYY-MM-DD");
    } else {
      this.StatusChangeFromDate = "";
    }
  }
  onFilter(event) {
    if (this.CustomerGroupId == null) {
      this.CustomerGroupId = "";
    }
    var vendorid = "";
    var vendorName = "";
    if (this.VendorId == "") {
      vendorid = "";
      vendorName = this.VendorName;
    } else if (this.VendorId != "") {
      vendorid = this.VendorId;
      vendorName = "";
    }
    // var Customerid = ""
    // var CustomerName = ""
    // if (this.CustomerId == '' || this.CustomerId == undefined || this.CustomerId == null) {
    //   Customerid = ""
    //   CustomerName = this.CompanyName
    // }
    // else if (this.CustomerId != "") {
    //   Customerid = this.CustomerId
    //   CustomerName = ''
    // }
    var partid = "";
    var partName = "";
    if (this.PartId == "" || this.PartId == undefined || this.PartId == null) {
      partid = "";
      partName = this.PartNo;
    } else if (this.PartId != "") {
      partid = this.PartId;
      partName = "";
    }
    var rrid = "";
    var RRNo = "";
    if (this.RRId == "" || this.RRId == undefined || this.RRId == null) {
      rrid = "";
      RRNo = this.RRNo;
    } else if (this.RRId != "") {
      rrid = this.RRId;
      RRNo = "";
    }

    var RRIdVendorPO = "";
    var VendorPONo = "";
    if (
      this.RRIdVendorPO == "" ||
      this.RRIdVendorPO == undefined ||
      this.RRIdVendorPO == null
    ) {
      RRIdVendorPO = "";
      VendorPONo = this.VendorPONo;
    } else if (this.RRIdVendorPO != "") {
      RRIdVendorPO = this.RRIdVendorPO;
      VendorPONo = "";
    }
    var RRIdCustomerPO = "";
    var CustomerPONo = "";
    if (
      this.RRIdCustomerPO == "" ||
      this.RRIdCustomerPO == undefined ||
      this.RRIdCustomerPO == null
    ) {
      RRIdCustomerPO = "";
      CustomerPONo = this.CustomerPONo;
    } else if (this.RRIdCustomerPO != "") {
      RRIdCustomerPO = this.RRIdCustomerPO;
      CustomerPONo = "";
    }

    var RRIdCustomerSO = "";
    var CustomerSONo = "";
    if (
      this.RRIdCustomerSO == "" ||
      this.RRIdCustomerSO == undefined ||
      this.RRIdCustomerSO == null
    ) {
      RRIdCustomerSO = "";
      CustomerSONo = this.CustomerSONo;
    } else if (this.RRIdCustomerSO != "") {
      RRIdCustomerSO = this.RRIdCustomerSO;
      CustomerSONo = "";
    }
    var table = $("#datatable-angular-rr").DataTable();
    table.columns(0).search(RRNo);
    table.columns(2).search(partName);
    table.columns(3).search(this.SerialNo);
    table.columns(4).search("");
    table.columns(5).search(vendorName);
    table.columns(49).search(this.Status);
    table.columns(12).search(VendorPONo);
    table.columns(13).search(this.RRDescription);
    table.columns(14).search(CustomerSONo);
    table.columns(15).search(this.CustomerPartNo1);
    table.columns(16).search(CustomerPONo);
    table.columns(17).search(this.ReferenceValue);
    table.columns(18).search(this.IsWarrantyRecovery);
    table.columns(19).search(this.IsRushRepair);
    table.columns(20).search(this.IsRepairTag);
    table.columns(28).search(this.IsPartsDeliveredToCustomer);
    table.columns(29).search(this.VendorInvoiceId);
    table.columns(30).search(this.CustomerInvoiceId);
    table.columns(31).search(this.CompanyName);
    table.columns(32).search(vendorid);
    table.columns(33).search(partid);
    table.columns(34).search(RRIdVendorPO);
    table.columns(35).search(RRIdCustomerPO);
    table.columns(36).search(RRIdCustomerSO);
    table.columns(37).search(this.StatusChangeFromDate);
    table.columns(38).search(this.StatusChangeToDate);
    table.columns(39).search(this.StatusChangeId);
    table.columns(9).search(rrid);
    table.columns(45).search(this.ShippingStatus);
    table.columns(46).search(this.ShippingStatusCategory);
    table.columns(47).search(this.QuoteApprovedBy);
    table.columns(48).search(this.IsSOCreated);
    table.columns(58).search(this.SubStatusId);
    table.columns(59).search(this.AssigneeUserId);
    table.columns(60).search(this.RRPartLocationId);
    table.columns(61).search(this.CustomerGroupId);
    table.draw();
  }

  onClear(event) {
    var table = $("#datatable-angular-rr").DataTable();
    this.RRNo = "";
    this.PartNo = "";
    this.SerialNo = "";
    this.CompanyName = "";
    this.Status = "";
    this.VendorPONo = "";
    this.VendorName = "";
    this.RRDescription = "";
    this.CustomerSONo = "";
    this.CustomerPartNo1 = "";
    this.CustomerPONo = "";
    this.ReferenceValue = "";
    this.IsWarrantyRecovery = "";
    this.IsRushRepair = "";
    this.IsRepairTag = "";
    this.IsPartsDeliveredToCustomer = "";
    this.VendorInvoiceId = "";
    this.CustomerInvoiceId = "";

    this.VendorId = "";
    this.VendorName = "";
    this.PartId = "";
    this.PartNo = "";
    this.CustomerId = "";
    this.CompanyName = "";
    var vendorid = "";
    var vendorName = "";
    var Customerid = "";
    var CustomerName = "";
    var partid = "";
    var partName = "";
    var rrid = "";
    var RRNo = "";
    var RRIdVendorPO = "";
    var VendorPONo = "";
    var RRIdCustomerSO = "";
    var CustomerSONo = "";
    var RRIdCustomerPO = "";
    var CustomerPONo = "";
    this.RRIdCustomerSO = "";
    this.RRIdVendorPO = "";
    this.RRIdVendorPO = "";
    this.RRId = "";
    this.StatusChangeFromDate = "";
    this.StatusChangeFrom = "";
    this.StatusChangeToDate = "";
    this.StatusChangeTo = "";
    this.StatusChangeId = "";
    this.ShippingStatus = "";
    this.ShippingStatusCategory = "";
    this.QuoteApprovedBy = "";
    this.IsSOCreated = "";
    this.SubStatusId = "";
    this.AssigneeUserId = "";
    this.RRPartLocationId = "";
    var CustomerGroupId = "";
    if (this.CustomerGroupId != null || this.CustomerGroupId != "") {
      this.CustomerGroupId = null;
      CustomerGroupId = "";
      this.loadCustomers();
    }
    table.columns(0).search(RRNo);
    table.columns(2).search(partName);
    table.columns(3).search(this.SerialNo);
    table.columns(4).search("");
    table.columns(5).search(vendorName);
    table.columns(49).search(this.Status);
    table.columns(12).search(VendorPONo);
    table.columns(13).search(this.RRDescription);
    table.columns(14).search(CustomerSONo);
    table.columns(15).search(this.CustomerPartNo1);
    table.columns(16).search(CustomerPONo);
    table.columns(17).search(this.ReferenceValue);
    table.columns(18).search(this.IsWarrantyRecovery);
    table.columns(19).search(this.IsRushRepair);
    table.columns(20).search(this.IsRepairTag);
    table.columns(28).search(this.IsPartsDeliveredToCustomer);
    table.columns(29).search(this.VendorInvoiceId);
    table.columns(30).search(this.CustomerInvoiceId);
    table.columns(31).search(this.CompanyName);
    table.columns(32).search(vendorid);
    table.columns(33).search(partid);
    table.columns(34).search(RRIdVendorPO);
    table.columns(35).search(RRIdCustomerPO);
    table.columns(36).search(RRIdCustomerSO);
    table.columns(37).search(this.StatusChangeFromDate);
    table.columns(38).search(this.StatusChangeToDate);
    table.columns(39).search(this.StatusChangeId);
    table.columns(9).search(rrid);
    table.columns(45).search(this.ShippingStatus);
    table.columns(46).search(this.ShippingStatusCategory);
    table.columns(47).search(this.QuoteApprovedBy);
    table.columns(48).search(this.IsSOCreated);
    table.columns(58).search(this.SubStatusId);
    table.columns(59).search(this.AssigneeUserId);
    table.columns(60).search(this.RRPartLocationId);
    table.columns(61).search(CustomerGroupId);
    table.draw();
  }

  onSearch() {
    var table = $("#datatable-angular-rr").DataTable();
    table.columns("").search("");
    table.columns(this.RRtype).search(this.RRvalue);
    table.draw();
  }
  onClearSearch(event) {
    var table = $("#datatable-angular-rr").DataTable();
    this.RRtype = "";
    this.RRvalue = "";
    table.columns(this.RRtype).search(this.RRvalue);
    table.draw();
    this.RRtype = undefined;
  }

  onStat() {
    var postData = {
      startDate: moment(this.dateFilter.startDate).format("YYYY-MM-DD"),
      endDate: moment(this.dateFilter.endDate).format("YYYY-MM-DD"),
    };
    this.service
      .postHttpService(postData, "getRepairStatistics")
      .subscribe((response) => {
        this.statData = response.responseData;
        this.Status0 = "0";
        this.Status1 = "0";
        this.Status2 = "0";
        this.Status3 = "0";
        this.Status4 = "0";
        this.Status5 = "0";
        this.Status6 = "0";
        this.Status7 = "0";
        if (this.statData.find((a) => a.Status == 0)) {
          this.Status0 = this.statData.find((a) => a.Status == 0).Count || "";
        }
        if (this.statData.find((a) => a.Status == 1)) {
          this.Status1 = this.statData.find((a) => a.Status == 1).Count || "";
        }
        if (this.statData.find((a) => a.Status == 2)) {
          this.Status2 = this.statData.find((a) => a.Status == 2).Count || "";
        }
        if (this.statData.find((a) => a.Status == 3)) {
          this.Status3 = this.statData.find((a) => a.Status == 3).Count || "";
        }
        if (this.statData.find((a) => a.Status == 4)) {
          this.Status4 = this.statData.find((a) => a.Status == 4).Count || "";
        }
        if (this.statData.find((a) => a.Status == 5)) {
          this.Status5 = this.statData.find((a) => a.Status == 5).Count || "";
        }
        if (this.statData.find((a) => a.Status == 6)) {
          this.Status6 = this.statData.find((a) => a.Status == 6).Count || "";
        }
        if (this.statData.find((a) => a.Status == 7)) {
          this.Status7 = this.statData.find((a) => a.Status == 7).Count || "";
        }
      });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  onCheckChange(e, fieldValue) {
    this.FieldList.map((fl) => {
      if (fl.FieldValue == fieldValue) {
        fl.checked = e.target.checked;
      }
    });
  }
  getFlag(country) {
    var flag =
      "assets/images/flags/" + country.toLowerCase().replace(" ", "_") + ".jpg";
    return flag;
  }

  editRepairRequest(Status) {
    if (Status == "Completed") {
      this.router.navigate(["/admin/repair-request/edit/status7"]);
    }
    if (Status == "Needs Sourcing") {
      this.router.navigate(["/admin/repair-request/edit/status2"]);
    }
    if (Status == "RR Generated") {
      this.router.navigate(["/admin/repair-request/edit/status1"]);
    }
    if (Status == "Submitted") {
      this.router.navigate(["/admin/repair-request/edit/status5"]);
    }
    if (Status == "Awaiting Vendor Quote") {
      this.router.navigate(["/admin/repair-request/edit/status3"]);
    }
    if (Status == "Needs to be Resourced") {
      this.router.navigate(["/admin/repair-request/edit/status4"]);
    }
    if (Status == "Repair In Progress") {
      this.router.navigate(["/admin/repair-request/edit/status6"]);
    }
  }

  onDelete(RRId) {
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
          RRId: RRId,
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
              var table = $("#datatable-angular-rr").DataTable();
              table.draw();
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

  //Duplicate
  onduplicate(RRId) {
    //var RRId= this.viewResult.RRId
    var RRId = RRId;
    this.modalRef = this.CommonmodalService.show(RrDuplicateComponent, {
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
  }

  selectPartEvent(item) {
    this.PartId = item.PartId;
  }
  clearPartEvent(item) {
    this.PartId = "";
    this.PartNo = "";
  }
  onChangePartSearch(val: string) {
    if (val) {
      this.isLoading = true;
      var postData = {
        PartNo: val,
      };
      this.service
        .postHttpService(postData, "getonSearchPartByPartNo")
        .subscribe(
          (response) => {
            if (response.status == true) {
              var data = response.responseData;
              this.partList = data.filter((a) =>
                a.PartNo.toLowerCase().includes(val.toLowerCase())
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

  onFocused(e, i) {
    // do something when input is focused
  }

  //AutoComplete for customer
  selectCustomerEvent($event) {
    this.CustomerId = $event.CustomerId;
  }

  onChangeCustomerSearch(val: string) {
    if (val) {
      this.isLoadingCustomer = true;
      var postData = {
        Customer: val,
      };
      this.service.postHttpService(postData, "getAllAutoComplete").subscribe(
        (response) => {
          if (response.status == true) {
            var data = response.responseData;
            this.CustomersList = data.filter((a) =>
              a.CompanyName.toLowerCase().includes(val.toLowerCase())
            );
          } else {
          }
          this.isLoadingCustomer = false;
          this.cd_ref.detectChanges();
        },
        (error) => {
          console.log(error);
          this.isLoadingCustomer = false;
        }
      );
    }
  }

  //AutoComplete for Vendor
  selectVendorEvent($event) {
    this.VendorId = $event.VendorId;
  }
  clearVendorEvent($event) {
    this.VendorId = "";
    this.VendorName = "";
  }

  onChangeVendorSearch(val: string) {
    if (val) {
      this.isLoadingVendor = true;
      var postData = {
        Vendor: val,
      };
      this.service
        .postHttpService(postData, "getAllAutoCompleteofVendor")
        .subscribe(
          (response) => {
            if (response.status == true) {
              var data = response.responseData;
              this.VendorsList = data.filter((a) =>
                a.VendorName.toLowerCase().includes(val.toLowerCase())
              );
            } else {
            }
            this.isLoadingVendor = false;
            this.cd_ref.detectChanges();
          },
          (error) => {
            console.log(error);
            this.isLoadingVendor = false;
          }
        );
    }
  }

  //AutoComplete for RR
  selectRREvent($event) {
    this.RRId = $event.RRId;
  }
  clearRREvent($event) {
    this.RRId = "";
    this.RRNo = "";
  }
  onChangeRRSearch(val: string) {
    if (val) {
      this.isLoadingRR = true;
      var postData = {
        RRNo: val,
      };
      this.service.postHttpService(postData, "RRNoAotoSuggest").subscribe(
        (response) => {
          if (response.status == true) {
            var data = response.responseData;
            this.RRList = data.filter((a) =>
              a.RRNo.toLowerCase().includes(val.toLowerCase())
            );
          } else {
          }
          this.isLoadingRR = false;
          this.cd_ref.detectChanges();
        },
        (error) => {
          console.log(error);
          this.isLoadingRR = false;
        }
      );
    }
  }

  //AutoComplete for VendorPO
  selectVendorPOEvent($event) {
    this.RRIdVendorPO = $event.RRId;
  }
  clearVendorPOEvent($event) {
    this.RRIdVendorPO = "";
    this.VendorPONo = "";
  }
  onChangeVendorPOSearch(val: string) {
    if (val) {
      this.isLoadingVendorPO = true;
      var postData = {
        VendorPONo: val,
      };
      this.service.postHttpService(postData, "VendorPOAutoSuggest").subscribe(
        (response) => {
          if (response.status == true) {
            var data = response.responseData;
            this.VendorPOList = data.filter((a) =>
              a.VendorPONo.toLowerCase().includes(val.toLowerCase())
            );
          } else {
          }
          this.isLoadingVendorPO = false;
          this.cd_ref.detectChanges();
        },
        (error) => {
          console.log(error);
          this.isLoadingVendorPO = false;
        }
      );
    }
  }

  //AutoComplete for CustomerPO
  selectCustomerPONoEvent($event) {
    this.RRIdCustomerPO = $event.RRId;
  }
  clearPOEvent($event) {
    this.RRIdCustomerPO = "";
    this.CustomerPONo = "";
  }
  onChangeCustomerPONoSearch(val: string) {
    if (val) {
      this.isLoadingCustomerPONo = true;
      var postData = {
        CustomerPONo: val,
      };
      this.service.postHttpService(postData, "CustomerPOAutoSuggest").subscribe(
        (response) => {
          if (response.status == true) {
            var data = response.responseData;
            this.CustomerPONoList = data.filter((a) =>
              a.CustomerPONo.toLowerCase().includes(val.toLowerCase())
            );
          } else {
          }
          this.isLoadingCustomerPONo = false;
          this.cd_ref.detectChanges();
        },
        (error) => {
          console.log(error);
          this.isLoadingCustomerPONo = false;
        }
      );
    }
  }

  //AutoComplete for CustomerSONo
  selectCustomerSONoEvent($event) {
    this.RRIdCustomerSO = $event.RRId;
  }
  clearSOEvent($event) {
    this.RRIdCustomerSO = "";
    this.CustomerSONo = "";
  }
  onChangeCustomerSONoSearch(val: string) {
    if (val) {
      this.isLoadingCustomerSONo = true;
      var postData = {
        CustomerSONo: val,
      };
      this.service.postHttpService(postData, "SONoAutoSuggest").subscribe(
        (response) => {
          if (response.status == true) {
            var data = response.responseData;
            this.CustomerSONoList = data.filter((a) =>
              a.CustomerSONo.toLowerCase().includes(val.toLowerCase())
            );
          } else {
          }
          this.isLoadingCustomerSONo = false;
          this.cd_ref.detectChanges();
        },
        (error) => {
          console.log(error);
          this.isLoadingCustomerSONo = false;
        }
      );
    }
  }

  loadCustomers() {
    this.customers$ = concat(
      this.searchCustomers().pipe(
        // default items
        catchError(() => of([])) // empty list on error
      ),
      this.customersInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap((term) => {
          if (term != null && term != undefined)
            return this.searchCustomers(term).pipe(
              catchError(() => of([])) // empty list on error
            );
          else return of([]);
        })
      )
    );
  }

  getCustomerGroupList() {
    this.service.getHttpService("ddCustomerGroup").subscribe((response) => {
      if (response.status) {
        this.customerGroupList = response.responseData;
      }
    });
  }

  searchCustomers(term: string = ""): Observable<any> {
    this.loadingCustomers = true;
    var postData = {
      Customer: term,
    };
    return this.service.postHttpService(postData, "getAllAutoComplete").pipe(
      map((response) => {
        this.CustomersList = response.responseData;
        this.loadingCustomers = false;
        return response.responseData;
      })
    );
  }

  selectAll() {
    let customerIds = this.CustomersList.map((a) => a.CustomerId);
    let cMerge = [...new Set([...customerIds, ...this.CompanyName])];
    this.CompanyName = cMerge;
  }

  onExcel() {
    // this.FieldList.map(fl => {
    //   if (fl.checked == true) {
    //     this.RRReports.push(fl)
    //   }
    // })

    this.RRReports = this.FieldList.filter((a) => a.checked);

    if (this.RRReports.length > 0) {
      var vendorid = "";
      var vendorName = "";
      if (this.VendorId == "") {
        vendorid = "";
        vendorName = this.VendorName;
      } else if (this.VendorId != "") {
        vendorid = this.VendorId;
        vendorName = "";
      }
      // var Customerid = ""
      // var CustomerName = ""
      // if (this.CustomerId == '' || this.CustomerId == undefined || this.CustomerId == null) {
      //   Customerid = ""
      //   CustomerName = this.CompanyName
      // }
      // else if (this.CustomerId != "") {
      //   Customerid = this.CustomerId
      //   CustomerName = ''
      // }
      var partid = "";
      var partName = "";
      if (
        this.PartId == "" ||
        this.PartId == undefined ||
        this.PartId == null
      ) {
        partid = "";
        partName = this.PartNo;
      } else if (this.PartId != "") {
        partid = this.PartId;
        partName = "";
      }
      var rrid = "";
      var RRNo = "";
      if (this.RRId == "" || this.RRId == undefined || this.RRId == null) {
        rrid = "";
        RRNo = this.RRNo;
      } else if (this.RRId != "") {
        rrid = this.RRId;
        RRNo = "";
      }

      var RRIdVendorPO = "";
      var VendorPONo = "";
      if (
        this.RRIdVendorPO == "" ||
        this.RRIdVendorPO == undefined ||
        this.RRIdVendorPO == null
      ) {
        RRIdVendorPO = "";
        VendorPONo = this.VendorPONo;
      } else if (this.RRIdVendorPO != "") {
        RRIdVendorPO = this.RRIdVendorPO;
        VendorPONo = "";
      }
      var RRIdCustomerPO = "";
      var CustomerPONo = "";
      if (
        this.RRIdCustomerPO == "" ||
        this.RRIdCustomerPO == undefined ||
        this.RRIdCustomerPO == null
      ) {
        RRIdCustomerPO = "";
        CustomerPONo = this.CustomerPONo;
      } else if (this.RRIdCustomerPO != "") {
        RRIdCustomerPO = this.RRIdCustomerPO;
        CustomerPONo = "";
      }

      var RRIdCustomerSO = "";
      var CustomerSONo = "";
      if (
        this.RRIdCustomerSO == "" ||
        this.RRIdCustomerSO == undefined ||
        this.RRIdCustomerSO == null
      ) {
        RRIdCustomerSO = "";
        CustomerSONo = this.CustomerSONo;
      } else if (this.RRIdCustomerSO != "") {
        RRIdCustomerSO = this.RRIdCustomerSO;
        CustomerSONo = "";
      }

      var postData = {
        RRNo: RRNo,
        RRId: rrid,
        RRDescription: this.RRDescription,
        PartNo: partName,
        PartId: partid,
        SerialNo: this.SerialNo,
        CustomerSONo: CustomerSONo,
        RRIdCustomerSO: RRIdCustomerSO,
        Status: this.Status,
        //"CompanyName": CustomerName,
        CustomerId: this.CompanyName,
        CustomerPartNo1: this.CustomerPartNo1,
        CustomerPONo: CustomerPONo,
        RRIdCustomerPO: RRIdCustomerPO,
        ReferenceValue: this.ReferenceValue,
        VendorName: vendorName,
        VendorId: vendorid,
        VendorPONo: VendorPONo,
        RRIdVendorPO: RRIdVendorPO,
        VendorInvoiceId: this.VendorInvoiceId,
        CustomerInvoiceId: this.CustomerInvoiceId,
        IsPartsDeliveredToCustomer: this.IsPartsDeliveredToCustomer,
        StatusChangeTo: this.StatusChangeToDate,
        StatusChangeFrom: this.StatusChangeFromDate,
        StatusChangeId: this.StatusChangeId,
        ShippingStatus: this.ShippingStatus,
        ShippingStatusCategory: this.ShippingStatusCategory,
        IsWarrantyRecovery: this.IsWarrantyRecovery,
        IsRushRepair: this.IsRushRepair,
        IsRepairTag: this.IsRepairTag,
        SubStatusId: this.SubStatusId,
        AssigneeUserId: this.AssigneeUserId,
        RRPartLocationId: this.RRPartLocationId,
        QuoteApprovedBy: this.QuoteApprovedBy,
        IsSOCreated: this.IsSOCreated,
        RRReports: this.RRReports,
      };
      this.service
        .postHttpService(postData, "getRepairRequestCustomReportExcel")
        .subscribe(
          (response) => {
            if (response.status == true) {
              this.ExcelData = response.responseData.ExcelData;
              this.generateExcelFormat();
              Swal.fire({
                title: "Success!",
                text: "Excel downloaded Successfully!",
                type: "success",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: "Excel could not be downloaded!",
                type: "warning",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            }
            this.cd_ref.detectChanges();
          },
          (error) => console.log(error)
        );
    } else {
      Swal.fire({
        type: "info",
        title: "Message",
        text: "Please checked the Custom Report Column",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }

  generateExcelFormat() {
    var data = [];
    var jsonData = this.ExcelData;
    for (var i = 0; i < jsonData.length; i++) {
      var obj = jsonData[i];
      var temparray = [];
      for (var key in obj) {
        var value = obj[key];
        temparray.push(value);
      }
      data.push(temparray);
    }

    //Excel Title, Header, Data
    const title = "Repair Request Custom Report";
    const header = [];
    this.RRReports.map((a) => {
      header.push(a.FieldName);
    });
    // console.log(header)
    //const header = [this.RRReports[0].FieldName,this.RRReports[1].FieldName,this.RRReports[2].FieldName,this.RRReports[3].FieldName,this.RRReports[4].FieldName,this.RRReports[5].FieldName,this.RRReports[6].FieldName,]
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Data");
    // //Add Row and formatting
    // let titleRow = worksheet.addRow([title]);
    // titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true }
    // worksheet.addRow([]);
    // let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')])
    // // //Add Image
    // // let logo = workbook.addImage({
    // //   filename: 'assets/images/ah_logo.png',
    // //    extension: 'png',
    // // });
    // // worksheet.addImage(logo, 'E1:F3');
    // worksheet.mergeCells('A1:D2');
    // //Blank Row
    // worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.font = { bold: true };

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "FF0000FF" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    data.forEach((d) => {
      let row = worksheet.addRow(d);
    });
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 30;
    worksheet.getColumn(9).width = 30;
    worksheet.getColumn(10).width = 30;
    worksheet.getColumn(11).width = 30;
    worksheet.getColumn(12).width = 30;
    worksheet.getColumn(13).width = 30;

    worksheet.addRow([]);
    //Footer Row
    // let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
    // footerRow.getCell(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'FFCCFFE5' }
    // };
    // footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    // //Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:L${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      var currentDate = this.datePipe.transform(
        new Date(),
        "M-d-yyyy hh-mm-ss a"
      );
      var filename = "Repair Request Custom Report" + currentDate + ".xlsx";
      fs.saveAs(blob, filename);
    });
  }

  onCustomReportSelectAll(e) {
    if (e.target.checked == true) {
      this.FieldList.map((item: any) => {
        item.checked = e.target.checked;
      });
    } else {
      this.FieldList.map((item: any) => {
        if (
          item.FieldValue == "RRNo" ||
          item.FieldValue == "PartNo" ||
          item.FieldValue == "SerialNo" ||
          item.FieldValue == "Description"
        ) {
          item.checked = true;
        } else {
          item.checked = e.target.checked;
        }
      });
    }
  }

  getAdminList() {
    this.service.getHttpService("getAllActiveAdmin").subscribe((response) => {
      //getAdminListDropdown
      this.adminList = response.responseData;
    });
  }
  getAdminList2() {
    this.service.getHttpService("getAllActiveAdmin").subscribe((response) => {
      //getAdminListDropdown
      this.adminListddl = response.responseData.map(function (value) {
        return {
          title: value.FirstName + " " + value.LastName,
          UserId: value.UserId,
        };
      });
    });
  }
  getSubStatusList() {
    this.service.getHttpService("RRSubStatusDDl").subscribe((response) => {
      this.subStatusList = response.responseData;
    });
  }

  onSubStatusEdit(RRId, SubStatusId, AssigneeUserId) {
    this.modalRef = this.CommonmodalService.show(SubStatusEditComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { SubStatusId, RRId, AssigneeUserId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.onFilter("");
    });
  }
  onAssigneeEdit(RRId, AssigneeUserId, SubStatusId) {
    this.modalRef = this.CommonmodalService.show(RrAssigneeEditComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { AssigneeUserId, RRId, SubStatusId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.onFilter("");
      this.reLoad();
    });
  }

  onBulkEdit(RRId) {
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
      this.onFilter("");
      this.reLoad();
    });
  }

  onEditPartLocation(RRId, RRPartLocationId) {
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
      this.onFilter("");
    });
  }

  onAddPartLocation(RRId) {
    var RRPartLocationId = null;
    var RRId = RRId;
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
      this.onFilter("");
    });
  }

  changeCustomerGroup(event) {
    // console.log(event);
    if (event && event.CustomerGroupId > 0) {
      this.customers$ = concat(
        this.searchCustomersWithGroup().pipe(
          // default items
          catchError(() => of([])) // empty list on error
        ),
        this.customersInput$.pipe(
          distinctUntilChanged(),
          debounceTime(800),
          switchMap((term) => {
            if (term != null && term != undefined)
              return this.searchCustomersWithGroup(term).pipe(
                catchError(() => of([])) // empty list on error
              );
            else return of([]);
          })
        )
      );
    } else {
      this.loadCustomers();
    }
  }
  searchCustomersWithGroup(term: string = ""): Observable<any> {
    this.loadingCustomers = true;
    var postData = {
      Customer: term,
      CustomerGroupId: this.CustomerGroupId,
    };
    return this.service.postHttpService(postData, "getAllAutoComplete").pipe(
      map((response) => {
        this.CustomersList = response.responseData;
        this.loadingCustomers = false;
        return response.responseData;
      })
    );
  }
}
