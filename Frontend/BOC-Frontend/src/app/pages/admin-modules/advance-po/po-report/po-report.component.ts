/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import { DatePipe } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { CommonService } from "src/app/core/services/common.service";
import { array_rr_status } from "src/assets/data/dropdown";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-po-report",
  templateUrl: "./po-report.component.html",
  styleUrls: ["./po-report.component.scss"],
})
export class PoReportComponent implements OnInit {
  breadCrumbItems;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dtTrigger: Subject<any> = new Subject();
  baseUrl = `${environment.api.apiURL}`;
  api_check: any;
  dataTable: any;
  CompanyName;

  CustomerId;
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

    if (history.state.CustomerId == undefined) {
      this.route.queryParams.subscribe((params) => {
        this.CustomerId = params["CustomerId"];
      });
    } else if (history.state.CustomerId != undefined) {
      this.CustomerId = history.state.CustomerId;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };

    var url = this.baseUrl + "/api/v1.0/CustomerBlanketPO/Report1List";
    const that = this;
    var filterData = {
      CustomerId: this.CustomerId,
    };

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
            var data = [];
            data = resp.responseData.data;

            if (data.length > 0) {
              this.CompanyName = resp.responseData.data[0].CompanyName;
            }
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

      createdRow: function (row, data, index) {
        var symbolTA = "";
        //Set Symbol
        if (data.StartingBalance > 0) {
          var symbol = data.CurrencySymbol + " ";
        } else {
          symbol = "";
        }
        var html = "<span>" + symbol + data.StartingBalance + "</span>";
        $("td", row).eq(2).html(html);

        if (data.TotalAmount > 0) {
          symbolTA = data.CurrencySymbol + " ";
        } else {
          symbolTA = "";
        }

        var htmlTA = "<span>" + symbolTA + data.TotalAmount + "</span>";
        $("td", row).eq(3).html(htmlTA);

        //Set Symbol
        if (data.InvoicedAmount > 0) {
          var symbol = data.CurrencySymbol + " ";
        } else {
          symbol = "";
        }
        var html = "<span>" + symbol + data.InvoicedAmount + "</span>";
        $("td", row).eq(4).html(html);

        //Set Symbol
        if (data.UpcomingInvoice > 0) {
          var symbol = data.CurrencySymbol + " ";
        } else {
          symbol = "";
        }
        var html = "<span>" + symbol + data.UpcomingInvoice + "</span>";
        $("td", row).eq(5).html(html);

        //Set Symbol
        if (data.BookedAmount > 0) {
          var symbol = data.CurrencySymbol + " ";
        } else {
          symbol = "";
        }
        var html = "<span>" + symbol + data.BookedAmount + "</span>";
        $("td", row).eq(6).html(html);

        //Set Symbol
        if (data.BalanceAmount > 0) {
          var symbol = data.CurrencySymbol + " ";
        } else {
          symbol = "";
        }
        var html = "<span>" + symbol + data.BalanceAmount + "</span>";
        $("td", row).eq(7).html(html);
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
          // render: (data: any, type: any, row: any, meta) => {
          //   if (row.CustomerPONo) {
          //     return `<a href="#/admin/SO-Report-List?CustomerPONo=${row.CustomerPONo}" target="_blank" class="actionView4" ngbTooltip="View">` + row.CustomerPONo + `</a>`;
          //   } else {
          //     return row.CustomerPONo;
          //   };
          // }
        },
        {
          data: "StartingBalance",
          name: "StartingBalance",
          orderable: true,
          searchable: true,
        },
        {
          data: "TotalAmount",
          name: "Amount",
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
}
