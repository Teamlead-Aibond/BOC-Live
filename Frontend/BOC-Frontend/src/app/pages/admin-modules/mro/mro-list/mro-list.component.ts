/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
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
import * as moment from "moment";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { concat, empty, Observable, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from "rxjs/operators";
import { CommonService } from "src/app/core/services/common.service";
import { array_MRO_status } from "src/assets/data/dropdown";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { MroDuplicateComponent } from "../../common-template/mro-duplicate/mro-duplicate.component";
import {
  SalesOrder_Status,
  SalesOrder_Type,
  warranty_list,
  SalesOrder_notes,
  CONST_IDENTITY_TYPE_SO,
  CONST_VIEW_ACCESS,
  CONST_CREATE_ACCESS,
  CONST_MODIFY_ACCESS,
  CONST_DELETE_ACCESS,
  CONST_APPROVE_ACCESS,
  CONST_VIEW_COST_ACCESS,
  CONST_COST_HIDE_VALUE,
  attachment_thumb_images,
  CONST_ShipAddressType,
  CONST_BillAddressType,
  CONST_ContactAddressType,
  Const_Alert_pop_title,
  Const_Alert_pop_message,
} from "src/assets/data/dropdown";
@Component({
  selector: "app-mro-list",
  templateUrl: "./mro-list.component.html",
  styleUrls: ["./mro-list.component.scss"],
})
export class MroListComponent implements OnInit {
  statData: any = [];
  Status0;
  Status1;
  Status2;
  Status3;
  Status4;
  Status5;
  Status6;
  Status7;
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
  dateFilter = { FromDate: moment().subtract(29, "days"), ToDate: moment() };
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  public CompanyName: any = [];

  @Input() dateFilterField;
  @ViewChild("dataTable", { static: true }) table;
  public MRONo: string;
  public Status: string;

  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Card Data
  cardData: any;
  tableData: any = [];

  MROStatus: any = [];
  isLoading: boolean = false;
  keywordForCustomer = "CompanyName";
  CustomerId;
  isLoadingCustomer: boolean = false;
  isLoadingRR: boolean = false;
  keywordForRR = "RRNo";
  RRList: any[];
  RRId = "";
  RRNo;
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];

  keywordForPartNo = "PartNo";
  partList: any[];
  isLoadingPart: boolean = false;
  PartId;
  PartNo;
  CustomerPONo;
  CreatedDate;
  createddate;
  IsMROView: any;
  IsMROCreate: any;
  IsMROEdit: any;
  IsMRODelete: any;
  CustomerGroupId: any;
  customerGroupList: any;
  emptyValue: any = "";
  initLoad: boolean = true;
  constructor(
    public service: CommonService,
    private http: HttpClient,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent,
    private CommonmodalService: BsModalService,
    public modalRef: BsModalRef
  ) {
    this.alwaysShowCalendars = true;
    this.showRangeLabelOnInput = true;
    this.keepCalendarOpeningWithRange = true;
    this.IsMROView = this.service.permissionCheck("MRO", CONST_VIEW_ACCESS);
    this.IsMROCreate = this.service.permissionCheck("MRO", CONST_CREATE_ACCESS);
    this.IsMROEdit = this.service.permissionCheck("MRO", CONST_MODIFY_ACCESS);
    this.IsMRODelete = this.service.permissionCheck("MRO", CONST_DELETE_ACCESS);
  }
  currentRouter = this.router.url;

  ngOnInit() {
    document.title = "MRO List";
    this.MRONo = "";
    this.CompanyName = "";
    this.Status = "";
    this.Status0 = "";
    this.Status1 = "";
    this.Status2 = "";
    this.Status3 = "";
    this.Status4 = "";
    this.Status5 = "";
    this.Status6 = "";
    this.Status7 = "";
    if (this.IsMROView) {
      this.MROStatus = array_MRO_status;

      this.dataTableMessage = "Loading...";
      this.breadCrumbItems = [
        { label: "Aibond", path: "/" },
        { label: "MRO", path: "/" },
        { label: "List", path: "/admin/mro/list", active: true },
      ];

      this.getList();
    }
  }

  getList() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };

    var url = this.baseUrl + "/api/v1.0/MRO/MROListByServerSide";
    const that = this;
    var filterData = {};
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
      buttons: {
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
      },
      columnDefs: [
        {
          targets: [7],
          visible: false,
          searchable: true,
        },
        {
          targets: [8],
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
      ],
      createdRow: function (row, data, index) {
        var statusObj = array_MRO_status.find((a) => a.id == data.Status);
        var html =
          '<span class="badge ' +
          (statusObj ? statusObj.cstyle : "") +
          ' btn-xs">' +
          (statusObj ? statusObj.title : "") +
          "</span>";
        $("td", row).eq(5).html(html);
        if (this.IsMROEdit) {
          var html = `<a href="#/admin/mro/edit?MROId=${data.MROId}"  target="_blank" data-toggle='tooltip' title='View MRO' data-placement='top'>${data.MRONo}</a>`;
          $("td", row).eq(0).html(html);
        }
        if (data.RRId == 0) {
          var RRNo = "-";
        } else {
          RRNo = data.RRNo;
        }
        var EcommerceOrderNo = "-";
        if (data.EcommerceOrderId == 0) {
          EcommerceOrderNo = "-";
        } else {
          EcommerceOrderNo = "SHOP" + data.EcommerceOrderId;
        }

        var html = `<a href="#/admin/repair-request/edit?RRId=${data.RRId}"  target="_blank"  ngbTooltip="View">${RRNo}</a>`;
        $("td", row).eq(1).html(html);

        var buttonName = "Ship";
        var html =
          '<button class="badge badge-success btn-xs">' +
          buttonName +
          "</button>";
        $("td", row).eq(4).html(html);
      },
      columns: [
        {
          data: "MRONo",
          name: "MRONo",
          defaultContent: "",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (this.IsMROView) {
              return `<a  href="#" class="actionView" data-toggle='tooltip' title='View MRO' data-placement='top'>${row.MRONo}</a>`;
            }
          },
        },
        {
          data: "RRNo",
          name: "RRNo",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            return `<a  href="#" class="actionRRView" ngbTooltip="View" data-toggle='tooltip' title='View RR' data-placement='top'>${row.RRNo}</a>`;
          },
        },
        {
          data: "EcommerceOrderId",
          name: "EcommerceOrderId",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.EcommerceOrderId > 0) {
              return `<a href="#/admin/shop/view-order-history/${row.EcommerceOrderId}"  target="_blank"  ngbTooltip="View Order">SHOP${row.EcommerceOrderId}</a>`;
            } else {
              return `-`;
            }
          },
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
        { data: "Status", name: "Status", orderable: true, searchable: true },
        { data: "Created", name: "Created", orderable: true, searchable: true },
        {
          data: "CustomerId",
          name: "CustomerId",
          orderable: true,
          searchable: true,
        },
        { data: "RRId", name: "RRId", orderable: true, searchable: true },
        {
          data: "SONo",
          name: "SONo",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var link = "";
            if (row.SONo) {
              link += `<a href="#/admin/orders/sales-list?SOId=${row.SOId}" target="_blank"  data-toggle='tooltip' title='SO View' data-placement='top'>${row.SONo}</a>`;
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
            if (row.CustomerBlanketPOId) {
              link += `<a  href="#/admin/Blanket-PO-History?CustomerBlanketPOId=${row.CustomerBlanketPOId}"  target="_blank"   data-toggle= 'tooltip' title='Blanket PO' data-placement= 'top'>${row.CustomerPONo}</a>`;
            } else if (row.CustomerPONo != null) {
              link += `<a>${row.CustomerPONo}</a>`;
            }
            return link;
          },
        },
        {
          data: "MROId",
          className: "text-center",
          orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = "";
            if (this.IsMROCreate) {
              actiontext += `<a href="#" class="fa fa-clone text-secondary actionViewDuplicate" data-toggle='tooltip' title='MRO Duplicate' data-placement='top'></a> &nbsp;`;
            }
            if (this.IsMROEdit) {
              actiontext += `<a href="#/admin/mro/edit?MROId=${row.MROId}" class="fa fa-edit text-secondary" target="_blank"  data-toggle='tooltip' title='Edit MRO' data-placement='top'></a> &nbsp;`;
            }
            if (this.IsMRODelete) {
              actiontext += `<a href="#" class="fa fa-trash text-danger actionView3" data-toggle='tooltip' title='Delete MRO' data-placement='top'></a>`;
            }
            return actiontext;
          },
        },
        { data: "PartId", name: "PartId", orderable: true, searchable: true },
        { data: "PartNo", name: "PartNo", orderable: true, searchable: true },
        {
          data: "CustomerGroupId",
          name: "CustomerGroupId",
          orderable: true,
          searchable: true,
        },
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $(".actionView", row).unbind("click");
        $(".actionView", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(["/admin/mro/edit"], {
            queryParams: { MROId: data.MROId },
          });
        });

        $(".actionViewDuplicate", row).unbind("click");
        $(".actionViewDuplicate", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onduplicate(data.MROId, data.MRONo);
        });

        $(".actionView1", row).unbind("click");
        $(".actionView1", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(["/admin/mro/edit"], {
            queryParams: { MROId: data.MROId },
          });
        });

        $(".actionView3", row).unbind("click");
        $(".actionView3", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDelete(data.MROId);
        });

        return row;
      },
      preDrawCallback: function () {
        $("#datatable-angular_processing").attr(
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

    this.dataTable = $("#datatable-angular");
    this.dataTable.DataTable(this.dtOptions);
  }

  CreatedDateFormat(CreatedDate) {
    const CreatedDateYears = CreatedDate.year;
    const CreatedDateDates = CreatedDate.day;
    const CreatedDatemonths = CreatedDate.month;
    let CreatedDateformat = new Date(
      CreatedDateYears,
      CreatedDatemonths - 1,
      CreatedDateDates
    );
    this.createddate = moment(CreatedDateformat).format("YYYY-MM-DD");
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
      this.isLoadingPart = true;
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
            this.isLoadingPart = false;
            this.cd_ref.detectChanges();
          },
          (error) => {
            console.log(error);
            this.isLoadingPart = false;
          }
        );
    }
  }
  onFilter(event) {
    if (this.CustomerGroupId == null) {
      this.CustomerGroupId = "";
    }
    // var Customerid = ""
    // var CustomerName = ""
    var RRNO = "";
    var RRId = "";
    // if (this.CustomerId == '' || this.CustomerId == undefined || this.CustomerId == null) {
    //   Customerid = ""
    //   CustomerName = this.CompanyName
    // }
    // else if (this.CustomerId != "") {
    //   Customerid = this.CustomerId
    //   CustomerName = ''
    // }

    if (this.RRId == "" || this.RRId == undefined || this.RRId == null) {
      RRId = "";
      RRNO = this.RRNo;
    } else if (this.RRId != "") {
      RRId = this.RRId;
      RRNO = "";
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
    var table = $("#datatable-angular").DataTable();
    table.columns(0).search(this.MRONo);
    table.columns(5).search(this.Status);
    // table.columns(2).search(CustomerName);
    // table.columns(6).search(Customerid);
    table.columns(1).search(RRNO);
    table.columns(8).search(RRId);
    table.columns(7).search(this.CompanyName);
    table.columns(10).search(this.CustomerPONo);
    table.columns(12).search(partid);
    table.columns(13).search(partName);
    table.columns(6).search(this.createddate);
    table.columns(14).search(this.CustomerGroupId);
    table.draw();
  }

  onClear(event) {
    var table = $("#datatable-angular").DataTable();
    this.MRONo = "";
    this.CompanyName = "";
    this.CustomerId = "";
    this.Status = "";
    var Customerid = "";
    var CustomerName = "";
    this.RRId = "";
    this.RRNo = "";
    var RRNO = "";
    var RRId = "";
    this.PartId = "";
    this.PartNo = "";
    this.CustomerPONo = "";
    this.CreatedDate = "";
    this.createddate = "";
    var partid = "";
    var partName = "";
    var CustomerGroupId = "";
    if (this.CustomerGroupId != null || this.CustomerGroupId != "") {
      this.CustomerGroupId = null;
      CustomerGroupId = "";
      this.loadCustomers();
    }
    table.columns(0).search(this.MRONo);
    table.columns(5).search(this.Status);
    // table.columns(2).search(CustomerName);
    table.columns(7).search(this.CompanyName);
    table.columns(1).search(RRNO);
    table.columns(8).search(RRId);
    table.columns(12).search(partid);
    table.columns(13).search(partName);
    table.columns(10).search(this.CustomerPONo);
    table.columns(6).search(this.createddate);
    table.columns(14).search(CustomerGroupId);
    table.draw();
  }

  onStat() {
    var postData = {
      startDate: moment(this.dateFilter.FromDate).format("YYYY-MM-DD"),
      endDate: moment(this.dateFilter.ToDate).format("YYYY-MM-DD"),
    };
    this.service
      .postHttpService(postData, "GetMROStatistics")
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

  onDelete(MROId) {
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
          MROId: MROId,
        };
        this.service
          .postHttpService(postData, "MRODelete")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "MRO record has been deleted.",
                type: "success",
              });

              // Reload the table
              var table = $("#datatable-angular").DataTable();
              table.draw();
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "MRO Record is safe :)",
          type: "error",
        });
      }
    });
  }

  //AutoComplete for customer
  selectCustomerEvent($event) {
    this.CustomerId = $event.CustomerId;
  }
  clearCustomerEvent($event) {
    this.CustomerId = "";
    this.CompanyName = "";
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

  //Duplicate
  onduplicate(MROId, MRONo) {
    this.modalRef = this.CommonmodalService.show(MroDuplicateComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { MROId, MRONo },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  reLoad() {
    this.router.navigate([this.currentRouter]);
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
