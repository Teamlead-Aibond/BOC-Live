import { DatePipe } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { Workbook } from "exceljs";
import * as moment from "moment";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { Subject, Observable, of, concat } from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  debounceTime,
  switchMap,
  map,
} from "rxjs/operators";
import { CommonService } from "src/app/core/services/common.service";
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
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { BulkSubstatusAssignEditComponent } from "../../common-template/bulk-substatus-assign-edit/bulk-substatus-assign-edit.component";
import { RrAssigneeEditComponent } from "../../common-template/rr-assignee-edit/rr-assignee-edit.component";
import { RrDuplicateComponent } from "../../common-template/rr-duplicate/rr-duplicate.component";
import { RrEditPartLocationComponent } from "../../common-template/rr-edit-part-location/rr-edit-part-location.component";
import { SubStatusEditComponent } from "../../common-template/sub-status-edit/sub-status-edit.component";
import { viewCFComponent } from "../../common-template/viewCF/viewCF.component";
import { cardData } from "../repair-request-list/data";

@Component({
  selector: "app-basic-rr-list",
  templateUrl: "./basic-rr-list.component.html",
  styleUrls: ["./basic-rr-list.component.scss"],
})
export class BasicRrListComponent implements OnInit {
  rrNo;
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

  // Datepicker
  selected: any;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean;
  customerGroupList: any;
  IsShowMore: boolean = false;
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
  CustomerGroupId: any;
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
    document.title = "Basic RR List";
    this.dataTableMessage = "Loading...";
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Repair Request", path: "/admin/repair-request/basic-RR-list/" },
      { label: "Basic List", path: "/", active: true },
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
    this.onList();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      this.onList();
    });
  }

  onList() {
    const that = this;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };

    var url =
      this.baseUrl + "/api/v1.0/repairrequestnotes/getRRListByServerSideBasic";

    var vendorid = "";
    var vendorName = "";
    var CustomerGroupId = "";

    if (this.VendorId == "") {
      vendorid = "";
      vendorName = this.VendorName;
    } else if (this.VendorId != "") {
      vendorid = this.VendorId;
      vendorName = "";
    }
    var partid = "";
    var partName = "";
    if (this.PartId == "" || this.PartId == undefined || this.PartId == null) {
      partid = "";
      partName = this.PartNo;
    } else if (this.PartId != "") {
      partid = this.PartId;
      partName = "";
    }
    if (this.CustomerGroupId) {
      CustomerGroupId = this.CustomerGroupId;
    }
    // var rrid = ""
    // var RRNo = ""
    // if (this.RRId == '' || this.RRId == undefined || this.RRId == null) {
    //   rrid = ""
    //   RRNo = this.RRNo
    // }
    // else if (this.RRId != "") {
    //   rrid = this.RRId
    //   RRNo = ''
    // }

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
    var filterData = {
      // "Status": StatusValue,
      // "FromDate": FromDate,
      // "ToDate": ToDate,
      // "Number1": Number1,
      // "Number2": Number2,
      // "Current": Current,
      // "CustomerId": Customer,
      // "CreatedByLocation": Location,
      RRNo: this.rrNo || this.RRNo,
      RRId: this.RRId || "",
      RRDescription: this.RRDescription || "",
      PartId: partid || "",
      PartName: partName || "",
      SerialNo: this.SerialNo || "",
      RRIdCustomerSO: RRIdCustomerSO || "",
      CustomerSONo: CustomerSONo || "",
      Status: this.Status || "",
      CustomerId: this.CompanyName || "",
      CustomerPartNo1: this.CustomerPartNo1 || "",
      CustomerPONo: this.CustomerPONo || "",
      ReferenceValue: this.ReferenceValue || "",
      VendorId: vendorid || "",
      VendorName: vendorName || "",
      VendorPONo: VendorPONo || "",
      RRIdVendorPO: RRIdVendorPO || "",
      VendorInvoiceId: this.VendorInvoiceId || "",
      CustomerInvoiceId: this.CustomerInvoiceId || "",
      IsPartsDeliveredToCustomer: this.IsPartsDeliveredToCustomer || "",
      StatusChangeFrom: this.StatusChangeFromDate || "",
      StatusChangeTo: this.StatusChangeToDate || "",
      StatusChangeId: this.StatusChangeId || "",
      ShippingStatus: this.ShippingStatus || "",
      ShippingStatusCategory: this.ShippingStatusCategory || "",
      IsSOCreated: this.IsSOCreated || "",
      IsWarrantyRecovery: this.IsWarrantyRecovery || "",
      SubStatusId: this.SubStatusId || "",
      AssigneeUserId: this.AssigneeUserId || "",
      RRPartLocationId: this.RRPartLocationId || "",
      IsRushRepair: this.IsRushRepair || "",
      IsRepairTag: this.IsRepairTag || "",
      CustomerGroupId: CustomerGroupId,
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
              this.getPartLocationList();
              this.getSubStatusList();
            }
            this.initLoad = false;
            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: resp.responseData.data,
            });
            this.dtTrigger.next();
          });
      },
      buttons: buttons,
      columnDefs: [
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
        // { data: 'InvoiceAmountOrQuoteAmount', name: 'InvoiceAmountOrQuoteAmount', orderable: true, searchable: true },
        {
          data: "InvoiceAmountOrQuoteAmount",
          name: "InvoiceAmountOrQuoteAmount",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            return `<span id="PRICE_${row.RRId}"><a href="#" class="callPrice" data-toggle='Click hear to view the price!' title='View Price' data-placement='top'>Click Here!</a></span> `;
          },
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
          data: "CustomerReference",
          name: "CustomerReference",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            return `<a href="#" class="callCustomerReference" data-toggle='Click hear to view the Customer Reference!' title='Customer Reference' data-placement='top'>Click Here!</a> `;
          },
        },
        {
          data: "AssigneeUserId",
          name: "AssigneeUserId",
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
        $(".callPrice", row).unbind("click");
        $(".callPrice", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.callPrice(data.RRId);
        });
        $(".callCustomerReference", row).unbind("click");
        $(".callCustomerReference", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.callCustomerReference(data.RRId);
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

  reLoad() {
    this.router.navigate([this.currentRouter]);
  }
  callCustomerReference(RRId) {
    console.log("callCustomerReference - " + RRId);
    var postData = {
      RRId: RRId,
    };
    this.service
      .postHttpService(postData, "getRRCustomerReference")
      .subscribe((response) => {
        if (response.status == true) {
          console.log(response.responseData);
          var CustomerReference = response.responseData;
          var RRNo = "RR" + RRId;
          this.modalRef = this.CommonmodalService.show(viewCFComponent, {
            backdrop: "static",
            ignoreBackdropClick: false,
            initialState: {
              data: { CustomerReference, RRNo },
              class: "modal-lg",
            },
            class: "gray modal-lg",
          });

          this.modalRef.content.closeBtnName = "Close";

          this.modalRef.content.event.subscribe((res) => {});
          // var table = $('#datatable-angular-rr').DataTable();
          // table.draw();
        } else {
          Swal.fire({
            title: "Info!",
            text: response.message,
            type: "error",
          });
        }
      });
  }

  callPrice(RRId) {
    console.log("callPrice - " + RRId);
    var postData = {
      RRId: RRId,
    };
    this.service
      .postHttpService(postData, "getRRPrice")
      .subscribe((response) => {
        if (response.status == true) {
          console.log(response.responseData);
          document.getElementById("PRICE_" + RRId).innerHTML =
            response.responseData.InvoiceAmountOrQuoteAmount;
        } else {
          Swal.fire({
            title: "Info!",
            text: response.message,
            type: "error",
          });
        }
      });
  }

  onFilter(event) {
    this.rerender();
  }

  onClear(event) {
    this.rrNo = "";
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
    this.CustomerGroupId = null;
    this.rerender();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getFlag(country) {
    var flag =
      "assets/images/flags/" + country.toLowerCase().replace(" ", "_") + ".jpg";
    return flag;
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
    this.rrNo = $event.RRNo;
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

  getCustomerGroupList() {
    this.service.getHttpService("ddCustomerGroup").subscribe((response) => {
      if (response.status) {
        this.customerGroupList = response.responseData;
      }
    });
  }

  selectAll() {
    let customerIds = this.CustomersList.map((a) => a.CustomerId);
    let cMerge = [...new Set([...customerIds, ...this.CompanyName])];
    this.CompanyName = cMerge;
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

  onShow(event) {
    this.IsShowMore = !this.IsShowMore;
    console.log(event);
  }
}
