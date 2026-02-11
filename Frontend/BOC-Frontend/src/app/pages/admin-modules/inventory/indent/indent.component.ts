import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { environment } from "src/environments/environment";
import { cardData } from "./data";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import pdfMake from "pdfmake/build/pdfmake.min.js";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from "sweetalert2";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbCalendar,
} from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "src/app/core/services/common.service";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-indent",
  templateUrl: "./indent.component.html",
  styleUrls: ["./indent.component.scss"],
})
export class IndentComponent implements OnInit {
  isCollapsed: boolean;
  public isOpen = false;

  private _toggleWindow() {
    this.isOpen = !this.isOpen;
  }
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dtTrigger: Subject<any> = new Subject();
  api_check: any;
  dataTable: any;
  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Card Data
  cardData: any;
  tableData: any = [];

  warehouseList: any[];
  WarehouseId: string;
  IntentReqNo: string;
  PartNo: string;
  RequestedQty: string;

  constructor(
    private http: HttpClient,
    public service: CommonService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>
  ) {}

  ngOnInit() {
    this.isCollapsed = false;
    this.dataTableMessage = "Loading...";
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Inventory", path: "/" },
      { label: "List", path: "/", active: true },
    ];
    this.loadDataTable();
  }

  loadDataTable() {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };

    var url =
      this.baseUrl +
      "/api/v1.0/InventoryIndent/InventoryIndentListByServerSide";
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
            //console.log('vendors', resp)
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

      createdRow: function (row, data, index) {},
      // columnDefs: [
      //   {
      //     "targets": [0],
      //     "visible": true,
      //     "searchable": false
      //   },
      //   {
      //     "targets": [1],
      //     "visible": true,
      //     "searchable": true
      //   },
      //   {
      //     "targets": [3],
      //     "visible": true,
      //     "searchable": true
      //   },
      //   {
      //     "targets": [4],
      //     "visible": true,
      //     "searchable": true
      //   },
      //   {
      //     "targets": [5],
      //     "visible": true,
      //     "searchable": true
      //   },
      //   {
      //     "targets": [6],
      //     "visible": true,
      //     "searchable": true
      //   },
      //   {
      //     "targets": [7],
      //     "visible": true,
      //     "searchable": true
      //   },
      //   {
      //     "targets": [8],
      //     "visible": false,
      //     "searchable": true
      //   }
      // ],
      columns: [
        {
          data: "WarehouseName",
          name: "WarehouseName",
          defaultContent: "",
          orderable: true,
          searchable: false,
        },
        {
          data: "IntentRequestNo",
          name: "IntentRequestNo",
          orderable: true,
          searchable: false,
        },
        { data: "PartNo", name: "PartNo", orderable: true, searchable: false },
        {
          data: "RequestedQty",
          name: "RequestedQty",
          orderable: true,
          searchable: false,
        },
        {
          data: "TransferQty",
          name: "TransferQty",
          orderable: true,
          searchable: false,
        },
        // { data: 'PhoneNoPrimary', name: 'PhoneNoPrimary', orderable: true, searchable: true },
        {
          data: "FirstName",
          name: "FirstName",
          orderable: true,
          searchable: false,
        },
        { data: "Date", name: "Date", orderable: true, searchable: false },
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
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

    this.dataTable = $("#datatable-angular");
    this.dataTable.DataTable(this.dtOptions);
    this.getWarehouseList();
  }

  getWarehouseList() {
    this.service
      .postHttpService(
        { UserId: localStorage.getItem("UserId") },
        "getWarehouseListByUserId"
      )
      .subscribe((response) => {
        this.warehouseList = response.responseData.map(function (value) {
          return { name: value.WarehouseName, id: value.WarehouseId };
        });
      });
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

  onFilter() {
    var table = $("#datatable-angular").DataTable();
    table.columns(0).search(this.WarehouseId);
    table.columns(1).search(this.IntentReqNo);
    table.columns(2).search(this.PartNo);
    table.columns(2).search(this.RequestedQty);
    table.draw();
  }

  onClear() {
    this.PartNo = "";
    this.WarehouseId = "";
    this.IntentReqNo = "";
    this.RequestedQty = "";
    this.onFilter();
  }

  delete() {
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
        Swal.fire({
          title: "Deleted!",
          text: "Inventory has been deleted.",
          type: "success",
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Inventory  is safe :)",
          type: "error",
        });
      }
    });
  }
}
