/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import { DatePipe } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { concat, Observable, of, Subject } from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  debounceTime,
  switchMap,
  map,
} from "rxjs/operators";
import { CommonService } from "src/app/core/services/common.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-list-blanket-bycustomer",
  templateUrl: "./list-blanket-bycustomer.component.html",
  styleUrls: ["./list-blanket-bycustomer.component.scss"],
})
export class ListBlanketBycustomerComponent implements OnInit {
  breadCrumbItems;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dtTrigger: Subject<any> = new Subject();
  baseUrl = `${environment.api.apiURL}`;
  api_check: any;
  dataTable: any;

  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  Customer;
  CustomerPONo;
  DownloadOption;
  constructor(
    private http: HttpClient,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    public service: CommonService,
    private datepipe: DatePipe
  ) {}
  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Customer-Blanket-PO-Report-List", path: "/", active: true },
    ];
    this.DownloadOption = localStorage.getItem("IsRestrictExportReports");

    this.loadCustomers();

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };

    var url = this.baseUrl + "/api/v1.0/CustomerPortal/ListBlanketByCustomer";
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
              data: resp.responseData.data,
            });
          });
      },
      buttons: buttons,
      columnDefs: [
        {
          targets: [7],
          visible: false,
          searchable: true,
        },
      ],
      createdRow: function (row, data, index) {
        //Set Symbol
        if (data.StartingBalance > 0) {
          var symbol = data.CurrencySymbol;
        } else {
          symbol = "";
        }
        var html = "<span>" + symbol + data.StartingBalance + "</span>";
        $("td", row).eq(2).html(html);

        //Set Symbol
        if (data.InvoicedAmount > 0) {
          symbol = data.CurrencySymbol;
        } else {
          symbol = "";
        }
        var html = "<span>" + symbol + data.InvoicedAmount + "</span>";
        $("td", row).eq(3).html(html);

        //Set Symbol
        if (data.UpcomingInvoice > 0) {
          var symbol = data.CurrencySymbol;
        } else {
          symbol = "";
        }
        var html = "<span>" + symbol + data.UpcomingInvoice + "</span>";
        $("td", row).eq(4).html(html);

        //Set Symbol
        if (data.BookedAmount > 0) {
          var symbol = data.CurrencySymbol;
        } else {
          symbol = "";
        }
        var html = "<span>" + symbol + data.BookedAmount + "</span>";
        $("td", row).eq(5).html(html);

        //Set Symbol
        if (data.BalanceAmount > 0) {
          var symbol = data.CurrencySymbol;
        } else {
          symbol = "";
        }
        var html = "<span>" + symbol + data.BalanceAmount + "</span>";
        $("td", row).eq(6).html(html);
      },
      columns: [
        {
          data: "CompanyName",
          name: "CompanyName",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerPONo",
          name: "CustomerPONo",
          orderable: true,
          searchable: true,

          render: (data: any, type: any, row: any, meta) => {
            if (row.CustomerPONo) {
              return (
                `<a href="#/customer/list-blanket-so?CustomerBlanketPOId=${row.CustomerBlanketPOId}" target="_blank"  class="actionViewPONO" ngbTooltip="View">` +
                row.CustomerPONo +
                `</a>`
              );
            } else {
              return row.CustomerPONo;
            }
          },
        },
        {
          data: "StartingBalance",
          name: "StartingBalance",
          orderable: true,
          searchable: true,
        },
        {
          data: "InvoicedAmount",
          name: "InvoicedAmount",
          orderable: true,
          searchable: true,
        },
        {
          data: "UpcomingInvoice",
          name: "UpcomingInvoice",
          orderable: true,
          searchable: true,
        },
        {
          data: "BookedAmount",
          name: "BookedAmount",
          orderable: true,
          searchable: true,
        },
        {
          data: "BalanceAmount",
          name: "BalanceAmount",
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
          data: "CustomerBlanketPOId",
          name: "CustomerBlanketPOId",
          className: "text-center",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var link = "";
            link += `<a href="#/customer/REPLENISH-history?CustomerBlanketPOId=${row.CustomerBlanketPOId}" class="fa fa-edit text-secondary" target="_blank"  ngbTooltip="Top up Blanket PO"></a> &nbsp;`;

            return link;
          },
        },
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {},
      preDrawCallback: function () {
        $("#datatable-angular-po-report_processing").attr(
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

    this.dataTable = $("#datatable-angular-po-report");
    this.dataTable.DataTable(this.dtOptions);
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

  onFilter(event) {
    var table = $("#datatable-angular-po-report").DataTable();
    table.columns(7).search(this.Customer);
    table.columns(1).search(this.CustomerPONo);
    table.draw();
  }
  onClear() {
    this.Customer = "";
    this.CustomerPONo = "";
    var table = $("datatable-angular-po-report").DataTable();
    table.columns(7).search(this.Customer);
    table.columns(1).search(this.CustomerPONo);
    table.draw();
  }
}
