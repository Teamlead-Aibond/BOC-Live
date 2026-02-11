/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import { DatePipe } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { Subject, Observable, of, concat } from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  debounceTime,
  switchMap,
  map,
} from "rxjs/operators";
import { CommonService } from "src/app/core/services/common.service";
import {
  CONST_VIEW_ACCESS,
  CONST_CREATE_ACCESS,
  CONST_MODIFY_ACCESS,
  CONST_DELETE_ACCESS,
} from "src/assets/data/dropdown";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-blanket-po-excluded-parts-list",
  templateUrl: "./blanket-po-excluded-parts-list.component.html",
  styleUrls: ["./blanket-po-excluded-parts-list.component.scss"],
})
export class BlanketPoExcludedPartsListComponent implements OnInit {
  isLoading: boolean = false;
  keywordForCustomer = "CompanyName";
  CustomersList: any[] = [];
  CustomerId;
  CompanyName: any = [];
  BlanketPONo;
  PartNo;
  PartId;
  keywordForPartNo = "PartNo";
  partList: any[];
  isLoadingPart: boolean = false;
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

  //access rights variables
  IsViewEnabled;
  CustomerGroupId: any;
  customerGroupList: any;
  initLoad: boolean = true;
  constructor(
    private http: HttpClient,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private CommonmodalService: BsModalService,
    public modalRef: BsModalRef,
    private cd_ref: ChangeDetectorRef,
    public service: CommonService,
    private datepipe: DatePipe
  ) {}
  ngOnInit() {
    document.title = "Blanket PO Excluded Parts List";
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Blanket-PO-Excluded-Parts-List", path: "/", active: true },
    ];
    this.IsViewEnabled = true;
    //this.service.permissionCheck("ManageBlanketPO", CONST_VIEW_ACCESS);
    if (this.IsViewEnabled) {
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

    var url =
      this.baseUrl + "/api/v1.0/CustomerBlanketPO/BlanketPOExludedPartList";
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
              this.getCustomerGroupList();
              this.loadCustomers();
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
      ],
      createdRow: function (row, data, index) {},
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
        },
        {
          data: "InvoiceNo",
          name: "InvoiceNo",
          orderable: true,
          searchable: true,
        },
        {
          data: "SONo",
          name: "SONo",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = "";

            actiontext += `<a href="#/admin/sales-order/edit?SOId=${row.SOId}" target="_blank"  data-toggle='tooltip' title='SO Edit' data-placement='top'>${row.SONo}</a> &nbsp;`;

            return actiontext;
          },
        },
        { data: "QuoteNo", name: "QuoteNo", orderable: true, searchable: true },
        {
          data: "RRNoOrMRONo",
          name: "RRNoOrMRONo",
          orderable: true,
          searchable: true,
        },
        { data: "PartNo", name: "PartNo", orderable: true, searchable: true },
        { data: "Rate", name: "Rate", orderable: true, searchable: true },
        {
          data: "Quantity",
          name: "Quantity",
          className: "text-center",
          orderable: true,
          searchable: true,
        },
        {
          data: "Price",
          name: "Price",
          className: "text-center",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerId",
          name: "CustomerId",
          orderable: true,
          searchable: true,
        },
        { data: "PartId", name: "PartId", orderable: true, searchable: true },
        {
          data: "CustomerGroupId",
          name: "CustomerGroupId",
          orderable: true,
          searchable: true,
        },
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {},
      preDrawCallback: function () {
        $("#datatable-angular-excluded-part_processing").attr(
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

    this.dataTable = $("#datatable-angular-excluded-part");
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
    var partid = "";
    var partName = "";
    if (this.PartId == "" || this.PartId == undefined || this.PartId == null) {
      partid = "";
      partName = this.PartNo;
    } else if (this.PartId != "") {
      partid = this.PartId;
      partName = "";
    }
    if (this.CustomerGroupId == null) {
      this.CustomerGroupId = "";
    }
    var table = $("#datatable-angular-excluded-part").DataTable();
    table.columns(10).search(this.CompanyName);
    table.columns(6).search(partName);
    table.columns(11).search(partid);
    table.columns(1).search(this.BlanketPONo);
    table.columns(12).search(this.CustomerGroupId);
    table.draw();
  }
  onClear() {
    var CustomerGroupId = "";
    if (this.CustomerGroupId != null || this.CustomerGroupId != "") {
      this.CustomerGroupId = null;
      CustomerGroupId = "";
      this.loadCustomers();
    }
    this.CompanyName = "";
    var partid = "";
    var partName = "";
    this.PartId = "";
    this.PartNo = "";
    this.BlanketPONo = "";
    var table = $("#datatable-angular-excluded-part").DataTable();
    table.columns(10).search(this.CompanyName);
    table.columns(6).search(partName);
    table.columns(11).search(partid);
    table.columns(1).search(this.BlanketPONo);
    table.columns(12).search(CustomerGroupId);
    table.draw();
  }
  getCustomerGroupList() {
    this.service.getHttpService("ddCustomerGroup").subscribe((response) => {
      if (response.status) {
        this.customerGroupList = response.responseData;
      }
    });
  }
  changeCustomerGroup(event) {
    // console.log(event);
    if (event && event.CustomerGroupId > 0) {
      this.CompanyName = "";
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
