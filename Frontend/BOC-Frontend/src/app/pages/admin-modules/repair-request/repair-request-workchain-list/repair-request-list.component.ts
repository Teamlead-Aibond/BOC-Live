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
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexNoData,
} from "ng-apexcharts";
import { BulkSubstatusAssignEditComponent } from "../../common-template/bulk-substatus-assign-edit/bulk-substatus-assign-edit.component";
import { SubStatusEditComponent } from "../../common-template/sub-status-edit/sub-status-edit.component";
import { RrAssigneeEditComponent } from "../../common-template/rr-assignee-edit/rr-assignee-edit.component";
import { RrEditPartLocationComponent } from "../../common-template/rr-edit-part-location/rr-edit-part-location.component";
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  noData: ApexNoData;
};
@Component({
  selector: "app-repair-request-workchain-list",
  templateUrl: "./repair-request-list.component.html",
  styleUrls: ["./repair-request-list.component.scss"],
})
export class RepairRequestWorkchainListComponent implements OnInit {
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
  RRNos;
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

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dtTrigger: Subject<any> = new Subject();
  baseUrl = `${environment.api.apiURL}`;
  api_check: any;
  dataTable: any;
  recordsFiltered;
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
  isAllChecked: any;
  uncheckedQuoteIds: any = [];
  checkedList: any;
  BulkDataItem: any;
  gridCheckAll: boolean;
  adminList: any;
  subStatusList: any = [];
  subStatusid;
  Assignee;
  basicColumChart: any;
  @ViewChild("chart", { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  workchainChartSeries: any = [];
  workchainChartlabels: any = [];
  chartDisplay: boolean = true;
  RRSubStatusEdit: boolean = false;
  RRAssignToEdit: boolean = false;
  RRSubStatusView: boolean = false;
  RRAssignToView: boolean = false;
  RRSubStatusAdd: boolean = false;
  RRAssignToAdd: boolean = false;
  RRPartLocationId;
  RRPartLocationList: any = [];
  RRPartLocationAdd: boolean = false;
  RRPartLocationEdit: boolean = false;
  RRPartLocationView: boolean = false;
  result: any = [];
  StatusName;
  BulkDataItemLength: any = 0;
  isClosed: boolean = true;
  constructor(
    private http: HttpClient,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private CommonmodalService: BsModalService,
    public modalRef: BsModalRef,
    private cd_ref: ChangeDetectorRef,
    public service: CommonService,
    private datePipe: DatePipe
  ) {}
  currentRouter = this.router.url;
  ngOnInit() {
    document.title = "Workchain List";
    this.dataTableMessage = "Loading...";
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "My Workchain", path: "/admin/repair-request/workchain-list" },
      { label: "List", path: "/", active: true },
    ];

    // Get Card Data
    this.cardData = cardData;

    this.loadCustomers();
    this.getAdminList();
    this.getSubStatusList();
    this.getPartLocationList();
    this.getChartValues();
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
    this.onclientSide();
  }

  onclientSide() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      responsive: true,
      processing: true,
      retrieve: true,
      language: {
        paginate: {
          first: "«",
          previous: "‹",
          next: "›",
          last: "»",
        },
        aria: {
          paginate: {
            first: "First",
            previous: "Previous",
            next: "Next",
            last: "Last",
          },
        },
      },
      dom: '<" row"<"col-12 col-xl-6"B> <"col-12 col-xl-6"f>>rt<"row"<"help-block col-12 col-xl-4"l><"col-12 col-xl-4"i><"col-12 col-xl-4"p>>',
      buttons: {
        dom: {
          button: {
            className: "",
          },
        },
        buttons: [
          {
            extend: "colvis",
            className: "btn btn-sm btn-primary",
            text: "COLUMNS",
          },
          {
            extend: "excelHtml5",
            text: "EXCEL",
            className: "btn btn-sm btn-secondary",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "csvHtml5",
            text: "CSV",
            className: "btn btn-sm btn-secondary",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "pdfHtml5",
            text: "PDF",
            className: "btn btn-sm btn-secondary",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "print",
            className: "btn btn-sm btn-secondary",
            text: "PRINT",
            exportOptions: {
              columns: ":visible",
              //columns: [ 0, 1, 2, 3 ]
            },
          },
          {
            extend: "copy",
            className: "btn btn-sm btn-secondary",
            text: "COPY",
            exportOptions: {
              columns: ":visible",
            },
          },
        ],
      },
    };
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

    if (this.RRNos != undefined) {
      var rrNo = this.RRNos.replace("\n", "").toString();
      var RRNos = rrNo.split(" ");
    } else {
      RRNos = "";
    }
    var postData = {
      AssigneeUserId: localStorage.getItem("UserId"),
      fromMyWorkChain: 1,
      RRNo: RRNo || RRNos.toString(),
      RRId: rrid,
      RRDescription: this.RRDescription,
      PartNo: partName,
      PartId: partid,
      SerialNo: this.SerialNo,
      CustomerSONo: CustomerSONo,
      RRIdCustomerSO: RRIdCustomerSO,
      Status: this.Status,
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
      SubStatusId: this.subStatusid,
      RRPartLocationId: this.RRPartLocationId,
      QuoteApprovedBy: this.QuoteApprovedBy,
      IsSOCreated: this.IsSOCreated,
    };
    this.service
      .postHttpService(postData, "getRRMyWorksListByServerSide")
      .subscribe((response) => {
        if (response.status == true) {
          this.BulkDataItem = response.responseData.data;
          this.BulkDataItemLength = this.BulkDataItem.length;
          this.BulkDataItem.forEach((item) => {
            item.checked = this.isQuoteChecked(item.InvoiceId);
          });

          if (this.BulkDataItem.length == 0) this.dataTableMessage = "No data!";
        } else {
          this.dataTableMessage = "No data!";
        }
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
      });
  }
  onClearSearch() {
    this.reLoad();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.onclientSide();
    });
  }
  getAccessRightsByFind(arr, code) {
    return arr.find((x) => x.code === code);
  }
  reLoad() {
    this.router.navigate([this.currentRouter]);
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
    this.RRIdVendorPO = $event.VendorPONo;
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
    this.RRIdCustomerPO = $event.CustomerPONo;
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
    this.RRIdCustomerSO = $event.CustomerSONo;
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
  getSubStatusList() {
    this.service.getHttpService("RRSubStatusDDl").subscribe((response) => {
      this.subStatusList = response.responseData;
    });
  }
  chartClicked(event: any): void {
    console.log(event);
  }

  chartHovered(event: any): void {
    console.log(event);
  }

  getChartValues() {
    this.service
      .getHttpService("getWorkchainChartValues")
      .subscribe((response) => {
        if (
          response &&
          response.responseData &&
          response.responseData.length > 0
        ) {
          response.responseData.forEach((element) => {
            this.workchainChartSeries.push(element.count);
            this.workchainChartlabels.push(element.SubStatusName);
            this.chartLoad();
          });
        }
        // else{
        //   // this.workchainChartSeries.push(0);
        //   // this.workchainChartlabels.push("noData");
        //   this.chartLoadNoData();
        // }
      });
  }
  chartLoad() {
    this.chartOptions = {
      // series: [44, 77, 99],
      series: this.workchainChartSeries,
      chart: {
        width: 420,
        type: "pie",
      },
      // labels: ["Awaiting Approval", "Awaiting RGA", "Awaiting RQ"],
      labels: this.workchainChartlabels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
  }

  chartLoadNoData() {
    this.chartOptions = {
      chart: {
        width: 380,
        type: "pie",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      noData: {
        text: "No Data!",
        align: "center",
        verticalAlign: "middle",
        offsetX: 0,
        offsetY: 0,
      },
    };
  }

  gridAllRowsCheckBoxChecked(e) {
    // console.log(e);
    // if (this.gridCheckAll) {
    this.uncheckedQuoteIds.length = 0;
    this.gridCheckAll = !this.gridCheckAll;

    // if (this.gridCheckAll) {
    //   this.checkedPersonIds.push();
    // }
    // } else {
    //   this.checkedPersonIds.length = 0;
    //   this.gridCheckAll = true;
    // }
    if (e.target.checked) {
      this.BulkDataItem.map((a) => (a.checked = true));
      this.checkedList = this.BulkDataItem.map((a) => {
        return {
          RRId: a.RRId,
          SubStatusId: a.SubStatusId,
          AssigneeUserId: a.AssigneeUserId,
        };
      });

      // this.QuoteList = this.QuoteItem.map(a => {
      //   let qObj: any;
      //   qObj.QuoteId = a.QuoteId;
      //   if (a.RRNo != '' && a.RRNo != '0' && a.RRNo != null) {
      //     qObj.RRNo = a.RRNo;
      //   } else if (a.MRONo != '' && a.MRONo != '0' && a.MRONo != null) {
      //     qObj.MRONo = a.MRONo;

      //   }
      //   return qObj;
      // });
    } else {
      this.BulkDataItem.map((a) => (a.checked = false));
      // this.QuoteList = [];
      this.checkedList = [];
    }
    $("#datatable-angular-rr").DataTable().ajax.reload();
  }
  private isQuoteChecked(CustomerId) {
    this.checkedList = [];
    if (!this.gridCheckAll) {
      // return this.checkedQuoteIds.indexOf(CustomerId) >= 0 ? true : false;
    } else {
      this.BulkDataItem.map((a) => (a.checked = true));
      this.checkedList = this.BulkDataItem.map((a) => {
        return {
          RRId: a.RRId,
          SubStatusId: a.SubStatusId,
          AssigneeUserId: a.AssigneeUserId,
        };
      });
      return this.uncheckedQuoteIds.indexOf(CustomerId) >= 0 ? false : true;
    }
  }
  rowCheckBoxChecked(e, RRId, SubStatusId, AssigneeUserId) {
    if (e.target.checked) {
      this.checkedList.push({ RRId, SubStatusId, AssigneeUserId });

      // let qObj: any;
      // qObj.QuoteId = QuoteId;

      // if (RRNo != '' && RRNo != '0' && RRNo != null) {
      //   qObj.RRNo = RRNo;
      // } else if (MRONo != '' && MRONo != '0' && MRONo != null) {
      //   qObj.MRONo = MRONo;

      // }

      // this.QuoteItem.push(qObj);
    } else {
      this.gridCheckAll = false;
      this.checkedList = this.checkedList.filter((a) => a.RRId != RRId);
      // this.QuoteList = this.QuoteList.filter(a => a.QuoteId != QuoteId);
    }
  }

  onBulkEdit() {
    var bulkData = this.checkedList;
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
      this.rerender();
      this.reLoad();
    });
  }

  onBulkEditonList(RRId) {
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
      this.rerender();
      this.reLoad();
    });
  }
  onSubStatusEdit(RRId, SubStatusId) {
    this.modalRef = this.CommonmodalService.show(SubStatusEditComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { SubStatusId, RRId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.rerender();
    });
  }
  onAssigneeEdit(RRId, AssigneeUserId) {
    this.modalRef = this.CommonmodalService.show(RrAssigneeEditComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { AssigneeUserId, RRId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.rerender();
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
      this.rerender();
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
      this.rerender();
    });
  }

  GetClassName(Status) {
    var className = "";
    var statusObj = array_rr_status.find((a) => a.id == Status);
    this.StatusName = statusObj ? statusObj.title : "";
    className = `badge ' ${statusObj ? statusObj.cstyle : ""}  ' btn-xs`;
    return className;
  }
}
