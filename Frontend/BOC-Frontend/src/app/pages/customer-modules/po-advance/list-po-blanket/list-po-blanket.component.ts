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
import { Subject } from "rxjs";
import { CommonService } from "src/app/core/services/common.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-list-po-blanket",
  templateUrl: "./list-po-blanket.component.html",
  styleUrls: ["./list-po-blanket.component.scss"],
})
export class ListPoBlanketComponent implements OnInit {
  breadCrumbItems;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dtTrigger: Subject<any> = new Subject();
  baseUrl = `${environment.api.apiURL}`;
  api_check: any;
  dataTable: any;
  DownloadOption;
  CustomerBlanketPOId;
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
      { label: "Blanket-SO-Report-List", path: "/", active: true },
    ];
    this.DownloadOption = localStorage.getItem("IsRestrictExportReports");

    if (history.state.CustomerBlanketPOId == undefined) {
      this.route.queryParams.subscribe((params) => {
        this.CustomerBlanketPOId = params["CustomerBlanketPOId"];
      });
    } else if (history.state.CustomerBlanketPOId != undefined) {
      this.CustomerBlanketPOId = history.state.CustomerBlanketPOId;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };

    var url = this.baseUrl + "/api/v1.0/SalesOrder/BlanketSOList";
    const that = this;
    var filterData = {
      CustomerBlanketPOId: this.CustomerBlanketPOId,
    };
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
      createdRow: function (row, data, index) {
        //Set Symbol
        var symbol = "$ ";
        var html =
          "<span>" + data.CurrencySymbol + " " + data.GrandTotal + "</span>";
        $("td", row).eq(3).html(html);
      },
      columns: [
        {
          data: "CustomerPONo",
          name: "CustomerPONo",
          orderable: true,
          searchable: true,
        },
        { data: "SONo", name: "SONo", orderable: true, searchable: true },
        {
          data: "InvoiceNo",
          name: "InvoiceNo",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.InvoiceNo) {
              return (
                `<a class="actionView4"  ngbTooltip="View">` +
                row.InvoiceNo +
                `</a>`
              );
            } else {
              return row.InvoiceNo;
            }
          },
        },
        {
          data: "GrandTotal",
          name: "GrandTotal",
          orderable: true,
          searchable: true,
        },
        {
          data: "DateRequested",
          name: "DateRequested",
          orderable: true,
          searchable: true,
        },
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        // $('.actionView1', row).bind('click', (e) => {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   this.router.navigate(['/admin/repair-request/edit'], { queryParams: { RRId: data.RRId } });
        // });

        $(".actionView4", row).unbind("click");
        $(".actionView4", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(["customer/invoice-view"], {
            state: { InvoiceId: data.InvoiceId, IsDeleted: data.IsDeleted },
          });
        });
        return row;
      },
      preDrawCallback: function () {
        $("#datatable-angular-so-report_processing").attr(
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

    this.dataTable = $("#datatable-angular-so-report");
    this.dataTable.DataTable(this.dtOptions);
  }
}
