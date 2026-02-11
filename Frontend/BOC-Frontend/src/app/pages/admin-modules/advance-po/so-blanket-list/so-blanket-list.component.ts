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
  selector: "app-so-blanket-list",
  templateUrl: "./so-blanket-list.component.html",
  styleUrls: ["./so-blanket-list.component.scss"],
})
export class SoBlanketListComponent implements OnInit {
  breadCrumbItems;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dtTrigger: Subject<any> = new Subject();
  baseUrl = `${environment.api.apiURL}`;
  api_check: any;
  dataTable: any;
  result;
  CustomerBlanketPOId;
  show: boolean = false;
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

    if (history.state.CustomerBlanketPOId == undefined) {
      this.route.queryParams.subscribe((params) => {
        this.CustomerBlanketPOId = params["CustomerBlanketPOId"];
      });
    } else if (history.state.CustomerBlanketPOId != undefined) {
      this.CustomerBlanketPOId = history.state.CustomerBlanketPOId;
    }
    this.getViewContent();
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
        //Set Symbol
        if (data.CurrencySymbol) {
          var symbol = data.CurrencySymbol + " ";
        } else {
          symbol = "";
        }
        var BlanketPONetAmount = "";
        if (
          data.InvoiceBlanketPONetAmount &&
          data.InvoiceBlanketPONetAmount != null
        ) {
          BlanketPONetAmount = data.InvoiceBlanketPONetAmount;
        } else {
          BlanketPONetAmount = data.BlanketPONetAmount;
        }
        var GrandTotal = "";
        if (data.InvoiceGrandTotal && data.InvoiceGrandTotal != null) {
          GrandTotal = data.InvoiceGrandTotal;
        } else {
          GrandTotal = data.GrandTotal;
        }
        $("td", row).eq(4).html(BlanketPONetAmount);

        var html = "<span>" + symbol + GrandTotal + "</span>";
        $("td", row).eq(3).html(html);
      },
      columns: [
        {
          data: "CustomerPONo",
          name: "CustomerPONo",
          orderable: true,
          searchable: true,
        },
        {
          data: "SONo",
          name: "SONo",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.SONo) {
              return `<a href="#/admin/orders/sales-list?SOId=${row.SOId}" target="_blank" data-toggle='tooltip' title='SO View' data-placement='top'>${row.SONo}</a>`;
            } else {
              return row.SONo;
            }
          },
        },
        {
          data: "InvoiceNo",
          name: "InvoiceNo",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var IId = "";
            if (row.InvoiceNo && row.InvoiceNo.indexOf(",") != -1) {
              row.InvoiceNo.split(",").forEach(function (item) {
                if (item) {
                  var itemId = item.split("INV");
                  IId +=
                    `<a href="#/admin/invoice/list?InvoiceId=${itemId[1]}" target="_blank" data-toggle='tooltip' title='Invoice View' data-placement='top'>` +
                    item +
                    `</a>`;
                } else {
                  IId += item;
                }
                IId += ", ";
              });
            } else if (row.InvoiceNo != null) {
              if (row.InvoiceNo) {
                var itemId = row.InvoiceNo.split("INV");
                IId +=
                  `<a href="#/admin/invoice/list?InvoiceId=${itemId[1]}" target="_blank" data-toggle='tooltip' title='Invoice View' data-placement='top'>` +
                  row.InvoiceNo +
                  `</a>`;
              } else {
                IId += row.InvoiceNo;
              }
              IId += ", ";
            } else {
              IId += "-, ";
            }
            return IId.trim().slice(0, -1);
          },

          // if (row.InvoiceNo) {
          //   return `<a href="#/admin/invoice/list?InvoiceId=${row.InvoiceId}" target="_blank" data-toggle='tooltip' title='Invoice View' data-placement='top'>` + row.InvoiceNo + `</a>`;
          // } else {
          //   return row.InvoiceNo;
          // };
          // }
        },
        {
          data: "GrandTotal",
          name: "GrandTotal",
          orderable: true,
          searchable: true,
        },
        {
          data: "BlanketPONetAmount",
          name: "BlanketPONetAmount",
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

        // $('.actionView4', row).unbind('click');
        // $('.actionView4', row).bind('click', (e) => {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   this.router.navigate(['/admin/parts-edit'], { state: { PartId: data.PartId, RRId: data.RRId, } });
        // });
        return row;
      },

      language: {
        paginate: {
          first: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          last: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          next: '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          previous: '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        },
      },
    };

    this.dataTable = $("#datatable-angular-so-report");
    this.dataTable.DataTable(this.dtOptions);
  }

  getViewContent() {
    this.service
      .postHttpService(
        { CustomerBlanketPOId: this.CustomerBlanketPOId },
        "ViewBlanketPO"
      )
      .subscribe((response) => {
        // console.log(response.responseData);
        this.result = response.responseData;
        this.show = true;
      });
  }
}
