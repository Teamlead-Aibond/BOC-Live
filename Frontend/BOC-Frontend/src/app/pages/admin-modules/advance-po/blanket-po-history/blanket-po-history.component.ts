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
import {
  CONST_AH_Group_ID,
  CONST_ContactAddressType,
} from "src/assets/data/dropdown";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-blanket-po-history",
  templateUrl: "./blanket-po-history.component.html",
  styleUrls: ["./blanket-po-history.component.scss"],
})
export class BlanketPoHistoryComponent implements OnInit {
  CustomerBlanketPOId;
  breadCrumbItems;
  AHAddressList;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dtTrigger: Subject<any> = new Subject();
  baseUrl = `${environment.api.apiURL}`;
  api_check: any;
  dataTable: any;
  result;
  constructor(
    public router: Router,
    private http: HttpClient,
    private cd_ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    public service: CommonService,
    private datepipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Blanket-PO-History", path: "/", active: true },
    ];
    this.AHAddressList = "";
    this.result = "";
    if (history.state.CustomerBlanketPOId == undefined) {
      this.route.queryParams.subscribe((params) => {
        this.CustomerBlanketPOId = params["CustomerBlanketPOId"];
      });
    } else if (history.state.CustomerBlanketPOId != undefined) {
      this.CustomerBlanketPOId = history.state.CustomerBlanketPOId;
    }
    this.getViewContent();
    this.getBlanketHistoryList();
  }
  getViewContent() {
    this.service
      .postHttpService(
        { CustomerBlanketPOId: this.CustomerBlanketPOId },
        "ViewBlanketPO"
      )
      .subscribe((response) => {
        this.result = response.responseData;
      });
  }

  getBlanketHistoryList() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };

    var url =
      this.baseUrl + "/api/v1.0/CustomerBlanketPOHistory/ServerSideList";
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
        var symbol = data.LocalCurrencySymbol + " ";
        var html = "<span>" + symbol + data.Amount + "</span>";
        $("td", row).eq(3).html(html);
        // //Set Symbol
        // var symbol = "$ "
        // var html = '<span>' + symbol + data.CurrentBalance + '</span>'
        // $('td', row).eq(4).html(html);

        // if(data.RRId != null){
        //   var html = `<a href="#/admin/repair-request/edit?RRId=${data.RRId}"  target="_blank" data-toggle='tooltip' title='RR View' data-placement='top'>${row.RRNo}</a>`;
        // }else if(data.QuoteId != null){
        //   var html = `<a href="#/admin/sales-quote/list?QuoteId=${data.QuoteId}"  target="_blank" data-toggle='tooltip' title='Quote View' data-placement='top'>${row.QuoteNo}</a>`;
        // }
        // else if(data.MROId != null){
        //   var html = `<a href="#/admin/mro/edit?MROId=${data.MROId}"  target="_blank" data-toggle='tooltip' title='MRO View' data-placement='top'>${data.MRONo}</a>`;
        // }
        // $('td', row).eq(1).html(html);
      },
      columns: [
        { data: "Date", name: "Date", orderable: true, searchable: true },
        {
          data: "RRNoOrMRONo",
          name: "RRNoOrMRONo",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = "";
            if (row.RRId != null) {
              actiontext += `<a href="#/admin/repair-request/edit?RRId=${row.RRId}"  target="_blank" data-toggle='tooltip' title='RR View' data-placement='top'>${row.RRNo}</a>`;
            } else if (row.MROId != null) {
              actiontext += `<a href="#/admin/mro/edit?MROId=${row.MROId}"  target="_blank" data-toggle='tooltip' title='MRO View' data-placement='top'>${row.MRONo}</a>`;
            } else if (row.QuoteId != null) {
              actiontext += `<a href="#/admin/sales-quote/list?QuoteId=${row.QuoteId}"  target="_blank" data-toggle='tooltip' title='Quote View' data-placement='top'>${row.QuoteNo}</a>`;
            }

            return actiontext;
          },
        },
        {
          data: "PaymentType",
          name: "PaymentType",
          orderable: true,
          searchable: true,
        },
        { data: "Amount", name: "Amount", orderable: true, searchable: true },
        {
          data: "Comments",
          name: "Comments",
          orderable: true,
          searchable: true,
        },
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {},

      language: {
        paginate: {
          first: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          last: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          next: '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          previous: '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        },
      },
    };

    this.dataTable = $("#datatable-historyofbalnketPO");
    this.dataTable.DataTable(this.dtOptions);
  }

  getAhGroupaddress() {
    var postData = {
      IdentityId: CONST_AH_Group_ID,
      IdentityType: 2,
      Type: CONST_ContactAddressType,
    };
    this.service
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.AHAddressList = response.responseData[0];
      });
  }
}
