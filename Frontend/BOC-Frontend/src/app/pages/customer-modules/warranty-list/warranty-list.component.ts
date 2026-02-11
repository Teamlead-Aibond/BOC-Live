/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { CommonService } from "src/app/core/services/common.service";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { WarrantyViewComponent } from "../common-template/warranty-view/warranty-view.component";
import * as moment from "moment";

@Component({
  selector: "app-warranty-list",
  templateUrl: "./warranty-list.component.html",
  styleUrls: ["./warranty-list.component.scss"],
  providers: [BsModalRef],
})
export class WarrantyListComponent implements OnInit {
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

  //filter
  public RRNo: string;
  public PartNo: string;
  public SerialNo: string;
  WarrantyStartDate;
  WarrantyEndDate;
  WarrantyFrom;
  WarrantyTo;
  WarrantySDate;
  WarrantyEDate;
  WarrantyFromdate;
  WarrantyTodate;
  ResponseMessage;
  showSearch: boolean = true;
  DownloadOption;
  constructor(
    private http: HttpClient,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private CommonmodalService: BsModalService,
    public modalRef: BsModalRef,
    public service: CommonService,
    private datepipe: DatePipe
  ) {}
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

    var url = this.baseUrl + "/api/v1.0/RRWarranty/CustomerWarrantyList";
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
          targets: [5],
          visible: false,
          searchable: true,
        },
        {
          targets: [6],
          visible: false,
          searchable: true,
        },
      ],
      createdRow: function (row, data, index) {},
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
              `<a href="#/customer/RR-edit?RRId=${row.RRId}" target="_blank" >${row.RRNo}</a>` +
              "<br>" +
              '<span style="font-weight: bold;padding: 0px;color: red">' +
              repairMessage +
              "<br>" +
              repairMessage1 +
              "</span>"
            );
          },
        },
        { data: "PartNo", name: "PartNo", orderable: true, searchable: true },
        {
          data: "SerialNo",
          name: "SerialNo",
          orderable: true,
          searchable: true,
        },
        {
          data: "WarrantyStartDate",
          name: "WarrantyStartDate",
          orderable: true,
          searchable: true,
        },
        {
          data: "WarrantyEndDate",
          name: "WarrantyEndDate",
          orderable: true,
          searchable: true,
        },
        {
          data: "WarrantyFrom",
          name: "WarrantyFrom",
          orderable: true,
          searchable: true,
        },
        {
          data: "WarrantyTo",
          name: "WarrantyTo",
          orderable: true,
          searchable: true,
        },
        {
          data: "WarrantyId",
          className: "text-center",
          orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            return `
                <a href="#" class="fa fa-eye text-secondary actionView1" ngbTooltip="view" style="cu"></a> &nbsp;
               `;
          },
        },
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $(".actionView1", row).unbind("click");
        $(".actionView1", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.viewWarranty(data.WarrantyId);
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
    // this.onStat();
  }

  reLoad() {
    this.router.navigate([this.currentRouter]);
  }

  WarrantyStart(WarrantyStartDate) {
    if (WarrantyStartDate != null) {
      const WarrantyStartDateYears = WarrantyStartDate.year;
      const WarrantyStartDateDates = WarrantyStartDate.day;
      const WarrantyStartDatemonths = WarrantyStartDate.month;
      let WarrantyStartDateDate = new Date(
        WarrantyStartDateYears,
        WarrantyStartDatemonths - 1,
        WarrantyStartDateDates
      );
      this.WarrantySDate = moment(WarrantyStartDateDate).format("YYYY-MM-DD");
    } else {
      this.WarrantySDate = "";
    }
  }
  WarrantyEnd(WarrantyEndDate) {
    if (WarrantyEndDate != null) {
      const WarrantyEndDateYears = WarrantyEndDate.year;
      const WarrantyEndDateDates = WarrantyEndDate.day;
      const WarrantyEndDatemonths = WarrantyEndDate.month;
      let WarrantyEndDateDate = new Date(
        WarrantyEndDateYears,
        WarrantyEndDatemonths - 1,
        WarrantyEndDateDates
      );
      this.WarrantyEDate = moment(WarrantyEndDateDate).format("YYYY-MM-DD");
    } else {
      this.WarrantyEDate = "";
    }
  }
  WarrantyFromDate(WarrantyFrom) {
    if (WarrantyFrom != null) {
      const WarrantyFromYears = WarrantyFrom.year;
      const WarrantyFromDates = WarrantyFrom.day;
      const WarrantyFrommonths = WarrantyFrom.month;
      let WarrantyFromDate = new Date(
        WarrantyFromYears,
        WarrantyFrommonths - 1,
        WarrantyFromDates
      );
      this.WarrantyFromdate = moment(WarrantyFromDate).format("YYYY-MM-DD");
    } else {
      this.WarrantyFromdate = "";
    }
  }
  WarrantyToDate(WarrantyTo) {
    if (WarrantyTo != null) {
      const WarrantyToYears = WarrantyTo.year;
      const WarrantyToDates = WarrantyTo.day;
      const WarrantyTomonths = WarrantyTo.month;
      let WarrantyToDate = new Date(
        WarrantyToYears,
        WarrantyTomonths - 1,
        WarrantyToDates
      );
      this.WarrantyTodate = moment(WarrantyToDate).format("YYYY-MM-DD");
    } else {
      this.WarrantyTodate = "";
    }
  }

  onFilter(event) {
    var table = $("#datatable-angular").DataTable();
    table.columns(0).search(this.RRNo);
    table.columns(1).search(this.PartNo);
    table.columns(2).search(this.SerialNo);
    table.columns(3).search(this.WarrantySDate);
    table.columns(4).search(this.WarrantyEDate);
    table.columns(5).search(this.WarrantyFromdate);
    table.columns(6).search(this.WarrantyTodate);
    table.draw();
    this.showSearch = false;
  }

  onClear(event) {
    var table = $("#datatable-angular").DataTable();
    this.RRNo = "";
    this.PartNo = "";
    this.SerialNo = "";
    this.WarrantyStartDate = "";
    this.WarrantyEndDate = "";
    this.WarrantyFrom = "";
    this.WarrantyTo = "";
    this.WarrantySDate = "";
    this.WarrantyEDate = "";
    this.WarrantyFromdate = "";
    this.WarrantyTodate = "";
    table.columns(0).search(this.RRNo);
    table.columns(1).search(this.PartNo);
    table.columns(2).search(this.SerialNo);
    table.columns(3).search(this.WarrantySDate);
    table.columns(4).search(this.WarrantyEDate);
    table.columns(5).search(this.WarrantyFromdate);
    table.columns(6).search(this.WarrantyTodate);
    table.draw();
    this.showSearch = false;
  }

  EnableSearch() {
    this.showSearch = true;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  //viewWarranty
  viewWarranty(WarrantyId) {
    var WarrantyId = WarrantyId;
    this.modalRef = this.CommonmodalService.show(WarrantyViewComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { WarrantyId },
        class: "modal-lg",
        centered: true,
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {});
  }
}
