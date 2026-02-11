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
import { url } from "inspector";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { concat, Observable, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from "rxjs/operators";
import { CommonService } from "src/app/core/services/common.service";
import {
  array_rr_status,
  CONST_CREATE_ACCESS,
  CONST_DELETE_ACCESS,
  CONST_MODIFY_ACCESS,
  CONST_VIEW_ACCESS,
  CONST_VIEW_COST_ACCESS,
} from "src/assets/data/dropdown";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-blanket-po-list",
  templateUrl: "./blanket-po-list.component.html",
  styleUrls: ["./blanket-po-list.component.scss"],
})
export class BlanketPoListComponent implements OnInit {
  isLoading: boolean = false;
  keywordForCustomer = "CompanyName";
  CustomersList: any[] = [];
  CustomerId;
  isLoadingVendorPO: boolean = false;
  keywordForCustomerPONo = "CustomerPONo";
  CustomerPONoList: any[];
  RRIdCustomerPO;
  isLoadingCustomerPONo: boolean = false;
  CompanyName: any = [];
  CustomerPONo;

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
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;
  REPLENISHCustomerPO;

  IsLowerLimitReached = "";
  IsActive = "";
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
    document.title = "Blanket PO List";
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Blanket-PO-List", path: "/", active: true },
    ];
    this.IsViewEnabled = this.service.permissionCheck(
      "ManageBlanketPO",
      CONST_VIEW_ACCESS
    );
    this.IsAddEnabled = this.service.permissionCheck(
      "ManageBlanketPO",
      CONST_CREATE_ACCESS
    );
    this.IsEditEnabled = this.service.permissionCheck(
      "ManageBlanketPO",
      CONST_MODIFY_ACCESS
    );
    this.IsDeleteEnabled = this.service.permissionCheck(
      "ManageBlanketPO",
      CONST_DELETE_ACCESS
    );
    this.REPLENISHCustomerPO = this.service.permissionCheck(
      "REPLENISHCustomerPO",
      CONST_VIEW_ACCESS
    );

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

    var url = this.baseUrl + "/api/v1.0/CustomerBlanketPO/List";
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
          targets: [0],
          visible: false,
          searchable: true,
        },

        {
          targets: [7],
          visible: false,
          searchable: true,
        },
        {
          targets: [9],
          visible: false,
          searchable: true,
        },
        {
          targets: [13],
          visible: false,
          searchable: true,
        },
      ],
      createdRow: function (row, data, index) {
        if (data.IsLowerLimitReached == 2) {
          $(row).addClass("bg-dueDatealert");
        }

        var cstyle = "";
        var IsActive = "";
        switch (data.IsActive) {
          case 0: {
            cstyle = "badge-danger";
            IsActive = "No";
            break;
          }
          case 1: {
            cstyle = "badge-success";
            IsActive = "YES";
            break;
          }
          default: {
            cstyle = "";
            IsActive = "";
            break;
          }
        }
        var html =
          '<span class="badge ' + cstyle + ' btn-xs">' + IsActive + "</span>";
        $("td", row).eq(7).html(html);
        // //Set Symbol
        // var symbol = "$ "
        // var html = '<span>' + symbol + data.StartingBalance + '</span>'
        // $('td', row).eq(3).html(html);
        // //Set Symbol
        // var symbol = "$ "
        // var html = '<span>' + symbol + data.CurrentBalance + '</span>'
        // $('td', row).eq(4).html(html);
      },
      columns: [
        {
          data: "CustomerBlanketPOId",
          name: "CustomerBlanketPOId",
          className: "text-center",
          orderable: true,
          searchable: true,
        },
        {
          data: "CompanyName",
          name: "CompanyName",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.CustomerId) {
              return (
                `<a  href="#/admin/PO-Report-List?CustomerId=${row.CustomerId}"  target="_blank" class="actionViewCustomer" data-toggle='tooltip' title='Customer Blanket PO Report List' data-placement='top'>` +
                row.CompanyName +
                `</a>`
              );
            } else {
              return row.CompanyName;
            }
          },
        },

        {
          data: "CustomerPONo",
          name: "CustomerPONo",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.CustomerPONo) {
              return (
                `<a href="#/admin/SO-Report-List?CustomerBlanketPOId=${row.CustomerBlanketPOId}" target="_blank"  class="actionViewPONO" data-toggle='tooltip' title='Blanket SO Report List' data-placement='top'>` +
                row.CustomerPONo +
                `</a>`
              );
            } else {
              return row.CustomerPONo;
            }
          },
        },
        /*{
          data: 'StartingBalance', name: 'StartingBalance', orderable: true, searchable: true,

          render: (data: any, type: any, row: any, meta) => {
            if (row.StartingBalance) {
              return `<p>` + row.LocalCurrencySymbol + ' ' + row.StartingBalance + `</p>`;
            } else {
              return row.StartingBalance;
            };
          }
        },*/
        {
          data: "BlanketPONotes",
          name: "BlanketPONotes",
          orderable: true,
          searchable: true,
        },
        {
          data: "TotalAmount",
          name: "TotalAmount",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.CurrentBalance) {
              return (
                `<p>` + row.LocalCurrencySymbol + " " + row.TotalAmount + `</p>`
              );
            } else {
              return row.TotalAmount;
            }
          },
        },
        {
          data: "CurrentBalance",
          name: "CurrentBalance",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.CurrentBalance) {
              return (
                `<p>` +
                row.LocalCurrencySymbol +
                " " +
                row.CurrentBalance +
                `</p>`
              );
            } else {
              return row.CurrentBalance;
            }
          },
        },

        {
          data: "BlanketPODate",
          name: "BlanketPODate",
          orderable: true,
          searchable: true,
        },
        {
          data: "IsLowerLimitReached",
          name: "IsLowerLimitReached",
          orderable: true,
          searchable: true,
        },
        {
          data: "BlanketPOLowerLimitPercent",
          name: "BlanketPOLowerLimitPercent",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            return `<p>` + row.BlanketPOLowerLimitPercent + "%" + `</p>`;
          },
        },
        {
          data: "CustomerId",
          name: "CustomerId",
          orderable: true,
          searchable: true,
        },
        {
          data: "IsActive",
          name: "IsActive",
          orderable: true,
          searchable: true,
        },
        {
          data: "CreatedByName",
          name: "CreatedByName",
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
            var actiontext = "";
            if (this.IsViewEnabled) {
              actiontext += `<a style="cursor:pointer;font-size:18px" class="mdi mdi-history text-secondary" href="#/admin/Blanket-PO-History?CustomerBlanketPOId=${row.CustomerBlanketPOId}"  target="_blank"   data-toggle= 'tooltip' title='Blanket PO History' data-placement= 'top'></a>&nbsp;`;
            }
            if (this.IsEditEnabled) {
              actiontext += `<a href="#/admin/Blanket-PO-Edit?CustomerBlanketPOId=${row.CustomerBlanketPOId}" class="fa fa-edit text-secondary" target="_blank" data-toggle='tooltip' title='Blanket PO Edit' data-placement= 'top'></a> &nbsp;
            <a href="#/admin/Blanket-PO-Edit1?CustomerBlanketPOId=${row.CustomerBlanketPOId}" class="fas fa-money-bill text-secondary" target="_blank" data-toggle='tooltip' title='Blanket PO Amount Edit' data-placement= 'top'></a> &nbsp;`;
            }
            if (this.REPLENISHCustomerPO) {
              actiontext += `<a href="#/admin/REPLENISH-Blanket-PO?CustomerBlanketPOId=${row.CustomerBlanketPOId}" class="fas fa-file-invoice-dollar text-secondary" target="_blank" data-toggle= 'tooltip' title='REPLENISH Blanket PO' data-placement= 'top'></a> &nbsp;`;
            }
            if (this.IsDeleteEnabled) {
              actiontext += `<a href="#" class="fa fa-trash text-danger actionDelete" data-toggle= 'tooltip' title='Blanket PO Delete' data-placement= 'top'></a>`;
            }
            return actiontext;
          },
          // render: (data: any, type: any, row: any, meta) => {

          //   var link = '';
          //   link += `<a href="#/admin/Blanket-PO-Edit?CustomerBlanketPOId=${row.CustomerBlanketPOId}" class="fa fa-edit text-secondary" target="_blank" data-toggle='tooltip' title='Blanket PO Edit' data-placement= 'top'></a> &nbsp;
          //   <a href="#/admin/Blanket-PO-Edit1?CustomerBlanketPOId=${row.CustomerBlanketPOId}" class="fas fa-money-bill text-secondary" target="_blank" data-toggle='tooltip' title='Blanket PO Amount Edit' data-placement= 'top'></a> &nbsp;
          //   <a href="#/admin/REPLENISH-Blanket-PO?CustomerBlanketPOId=${row.CustomerBlanketPOId}" class="fas fa-file-invoice-dollar text-secondary" target="_blank" data-toggle= 'tooltip' title='REPLENISH Blanket PO' data-placement= 'top'></a> &nbsp;
          //   <a style="cursor:pointer;font-size:18px" class="mdi mdi-history text-secondary" href="#/admin/Blanket-PO-History?CustomerBlanketPOId=${row.CustomerBlanketPOId}"  target="_blank"   data-toggle= 'tooltip' title='Blanket PO History' data-placement= 'top'></a>&nbsp;
          //   <a href="#" class="fa fa-trash text-danger actionDelete" data-toggle= 'tooltip' title='Blanket PO Delete' data-placement= 'top'></a>`

          //   return link;
          // }
        },
        {
          data: "CustomerGroupId",
          name: "CustomerGroupId",
          orderable: true,
          searchable: true,
        },
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        // $('.actionViewPONO', row).bind('click', (e) => {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   this.router.navigate(['/admin/repair-request/edit'], { queryParams: { RRId: data.RRId } });
        // });

        $(".actionDelete", row).unbind("click");
        $(".actionDelete", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDelete(data.CustomerBlanketPOId);
        });

        // $('.actionView4', row).unbind('click');
        // $('.actionView4', row).bind('click', (e) => {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   this.router.navigate(['/admin/parts-edit'], { state: { PartId: data.PartId, RRId: data.RRId, } });
        // });
        // return row;
      },
      preDrawCallback: function () {
        $("#datatable-angular-po_processing").attr(
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

    this.dataTable = $("#datatable-angular-po");
    this.dataTable.DataTable(this.dtOptions);
  }

  //AutoComplete for CustomerPO
  selectCustomerPONoEvent($event) {
    this.RRIdCustomerPO = $event.RRId;
  }

  onChangeCustomerPONoSearch(val: string) {
    if (val) {
      this.isLoadingCustomerPONo = true;
      var postData = {
        CustomerPONo: val,
      };
      this.service.postHttpService(postData, "CustomerPOAutoSuggest").subscribe(
        (response) => {
          if (response.status == true) {
            var data = response.responseData;
            this.CustomerPONoList = data.filter((a) =>
              a.CustomerPONo.toLowerCase().includes(val.toLowerCase())
            );
          } else {
          }
          this.isLoadingCustomerPONo = false;
          this.cd_ref.detectChanges();
        },
        (error) => {
          console.log(error);
          this.isLoadingCustomerPONo = false;
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

  onFilter(event) {
    if (this.CustomerPONo) {
      var CustomerPONo = this.CustomerPONo.trim();
    }
    if (this.CustomerGroupId == null) {
      this.CustomerGroupId = "";
    }
    var table = $("#datatable-angular-po").DataTable();
    table.columns(9).search(this.CompanyName);
    table.columns(2).search(CustomerPONo);
    table.columns(7).search(this.IsLowerLimitReached);
    table.columns(10).search(this.IsActive);
    table.columns(13).search(this.CustomerGroupId);
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
    this.CustomerPONo = "";
    this.IsActive = "";
    this.IsLowerLimitReached = "";
    var table = $("#datatable-angular-po").DataTable();
    table.columns(9).search(this.CompanyName);
    table.columns(2).search(this.CustomerPONo);
    table.columns(7).search(this.IsLowerLimitReached);
    table.columns(10).search(this.IsActive);
    table.columns(13).search(CustomerGroupId);
    table.draw();
  }

  onDelete(CustomerBlanketPOId) {
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
          CustomerBlanketPOId: CustomerBlanketPOId,
        };
        this.service
          .postHttpService(postData, "DeleteCustomerBlanketPO")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "Customer Blanket PO record has been deleted.",
                type: "success",
              });

              // Reload the table
              var table = $("#datatable-angular-po").DataTable();
              table.draw();
            } else {
              Swal.fire({
                title: "Error!",
                text: response.message,
                type: "warning",
              });
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Customer Blanket PO is safe :)",
          type: "error",
        });
      }
    });
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
