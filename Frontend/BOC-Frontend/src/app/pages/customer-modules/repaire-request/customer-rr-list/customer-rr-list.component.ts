/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import { Component, OnInit, ViewChild, Input } from "@angular/core";
import * as moment from "moment";
import { DataTableDirective } from "angular-datatables";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { CommonService } from "src/app/core/services/common.service";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";
import { rr_status_customer } from "src/assets/data/dropdown";
import { concat, Observable, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from "rxjs/operators";
@Component({
  selector: "app-customer-rr-list",
  templateUrl: "./customer-rr-list.component.html",
  styleUrls: ["./customer-rr-list.component.scss"],
})
export class CustomerRrListComponent implements OnInit {
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  Customer = [];
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
  public CompanyName: string;
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
  IsPartsDeliveredToCustomer: string;
  CustomerInvoiceId: string;
  VendorInvoiceId: string;
  ResponseMessage;
  showSearch: boolean = true;
  DownloadOption;
  constructor(
    private http: HttpClient,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    public service: CommonService,
    private datepipe: DatePipe
  ) {
    this.alwaysShowCalendars = true;
    this.showRangeLabelOnInput = true;
    this.keepCalendarOpeningWithRange = true;
  }
  currentRouter = this.router.url;
  ngOnInit() {
    this.dataTableMessage = "Loading...";

    this.DownloadOption = localStorage.getItem("IsRestrictExportReports");
    //this.breadCrumbItems = [{ label: 'Aibond', path: '/' }, { label: 'Repair Request', path: '/admin/repair-request/list/' }, { label: 'List', path: '/', active: true }];

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };

    var url =
      this.baseUrl + "/api/v1.0/CustomerPortal/CustomerRRListByServerSide";
    const that = this;
    var filterData = {};
    if (that.DownloadOption == 0) {
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
            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: resp.responseData.data || [],
            });
            this.ResponseMessage = resp.responseData;
          });
      },
      buttons: buttons,
      columnDefs: [
        {
          targets: [8],
          visible: false,
          searchable: true,
        },
        {
          targets: [9],
          visible: false,
          searchable: true,
        },
        {
          targets: [10],
          visible: false,
          searchable: true,
        },
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
          visible: true,

          render: $.fn.dataTable.render.number(",", ".", 2, "$ "),
          searchable: true,
        },
        {
          targets: [24],
          visible: false,
          searchable: true,
        },
      ],
      createdRow: function (row, data, index) {
        if (data.AddedFrom == 1 && data.StatusId == 0) {
          $(row).addClass("bg-light");
        }
        if (data.StatusId == 5 && data.DueDatePassed == "1") {
          $(row).addClass("bg-dueDatealert");
        }

        if (data.StatusId == 5 && data.DueDateNears == "1") {
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

        var statusObj = rr_status_customer.find((a) => a.id == data.Status);
        var html =
          '<span class="badge ' +
          (statusObj ? statusObj.cstyle : "") +
          ' btn-xs">' +
          (statusObj ? statusObj.title : "") +
          "</span>";
        $("td", row).eq(5).html(html);
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
            return (
              `<a  href="#/customer/RR-edit?RRId=${row.RRId}" target="_blank"  ngbTooltip="View">${row.RRNo}</a>` +
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
        { data: "PartNo", name: "PartNo", orderable: true, searchable: true },
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
        { data: "Status", name: "Status", orderable: true, searchable: true },
        { data: "Date", name: "Date", orderable: true, searchable: true },
        {
          data: "QuoteSubmittedDate",
          name: "QuoteSubmittedDate",
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
          data: "InvoiceAmountOrQuoteAmount",
          name: "InvoiceAmountOrQuoteAmount",
          orderable: true,
          searchable: true,
        },
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
          data: "CustomerId",
          name: "CustomerId",
          orderable: true,
          searchable: true,
        },
      ],
      preDrawCallback: function () {
        $("#datatable-angular_processing").attr(
          "style",
          "display: block; z-index: 10000 !important"
        );
      },
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $(".actionView1", row).unbind("click");
        $(".actionView1", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          //this.editRepairRequest(data.Status);
          this.navCtrl.navigate("customer/RR-edit", { RRId: data.RRId });
        });

        $(".actionView3", row).unbind("click");
        $(".actionView3", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDelete(data.RRId);
        });

        return row;
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

    this.loadCustomers();
    // this.onStat();
  }

  reLoad() {
    this.router.navigate([this.currentRouter]);
  }

  onFilter(event) {
    var table = $("#datatable-angular").DataTable();
    table.columns(0).search(this.RRNo);
    table.columns(2).search(this.PartNo);
    table.columns(3).search(this.SerialNo);
    table.columns(24).search(this.Customer.join());
    table.columns(5).search(this.Status);
    table.columns(8).search(this.RRDescription);
    table.columns(9).search(this.CustomerSONo);
    table.columns(10).search(this.CustomerPartNo1);
    table.columns(11).search(this.CustomerPONo);
    table.columns(12).search(this.IsWarrantyRecovery);
    table.columns(13).search(this.IsRushRepair);
    table.columns(14).search(this.IsRepairTag);
    table.draw();
    this.showSearch = false;
  }

  onClear(event) {
    var table = $("#datatable-angular").DataTable();
    this.Customer = [];
    this.RRNo = "";
    this.PartNo = "";
    this.SerialNo = "";
    this.CompanyName = "";
    this.Status = "";
    this.VendorName = "";
    this.RRDescription = "";
    this.CustomerSONo = "";
    this.CustomerPartNo1 = "";
    this.CustomerPONo = "";
    this.IsWarrantyRecovery = "";
    this.IsRushRepair = "";
    this.IsRepairTag = "";
    table.columns(0).search(this.RRNo);
    table.columns(2).search(this.PartNo);
    table.columns(3).search(this.SerialNo);
    table.columns(24).search(this.Customer.join());
    table.columns(5).search(this.Status);
    table.columns(8).search(this.RRDescription);
    table.columns(9).search(this.CustomerSONo);
    table.columns(10).search(this.CustomerPartNo1);
    table.columns(11).search(this.CustomerPONo);
    table.columns(12).search(this.IsWarrantyRecovery);
    table.columns(13).search(this.IsRushRepair);
    table.columns(14).search(this.IsRepairTag);
    table.draw();
    this.showSearch = false;
  }

  EnableSearch() {
    this.showSearch = true;
  }

  onSearch() {
    var table = $("#datatable-angular").DataTable();
    table.columns(this.RRtype).search(this.RRvalue);
    table.draw();
  }
  onClearSearch(event) {
    var table = $("#datatable-angular").DataTable();
    this.RRtype = "";
    this.RRvalue = "";
    table.columns(this.RRtype).search(this.RRvalue);
    table.draw();
    this.RRtype = undefined;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
          text: "Repair Request  is safe:)",
          type: "error",
        });
      }
    });
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
      CompanyName: term,
    };
    return this.service
      .postHttpService(postData, "CustomerNameAutoSuggest")
      .pipe(
        map((response) => {
          this.CustomersList = response.responseData;
          this.loadingCustomers = false;
          return response.responseData;
        })
      );
  }

  selectAll() {
    let customerIds = this.CustomersList.map((a) => a.CustomerId);
    let cMerge = [...new Set([...customerIds, ...this.Customer])];
    this.Customer = cMerge;
  }
}
