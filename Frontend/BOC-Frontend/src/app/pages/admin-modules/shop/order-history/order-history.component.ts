/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/core/services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import {
  SalesOrder_Status, SalesOrder_Type, warranty_list, SalesOrder_notes, CONST_IDENTITY_TYPE_SO,
  CONST_VIEW_ACCESS, array_MRO_status, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, attachment_thumb_images, CONST_ShipAddressType, CONST_BillAddressType, CONST_ContactAddressType, Const_Alert_pop_title, Const_Alert_pop_message
} from 'src/assets/data/dropdown';
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  loginType: any;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  HotelId;
  dataTableMessage;
  dtOptions: any = {};
  result: any = [];
  MRONo
  EcommerceOrderNo
  public CompanyName: any = [];
  CustomerGroupId: any
  customerGroupList: any;
  baseUrl = `${environment.api.apiURL}`;
  api_check: any;
  @Input() dateFilterField;
  @ViewChild('dataTable', { static: true }) table;
  dataTable: any;

  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  createddate: string;
  Date;
  IsOrderHistoryView: any;
  IsOrderHistoryEdit: any;
  initLoad: boolean = true;
  constructor(public navCtrl: NgxNavigationWithDataComponent, public router: Router,
    public service: CommonService, private http: HttpClient) {
    this.IsOrderHistoryView = this.service.permissionCheck("OrderHistory", CONST_VIEW_ACCESS);
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Shop', path: '#/admin/shop/product-list' }, { label: 'Order History', path: '#/admin/shop/order-history' }];
    this.loginType = localStorage.getItem("IdentityType");
    if (this.IsOrderHistoryView || this.loginType == 1) {
      this.getList()
    }


  }
  getList() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/ecommerce/order/list';
    const that = this;
    var filterData = {
      CustomerId: localStorage.getItem("IdentityId")
    }
    this.dtOptions = {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-12 col-sm-4 col-md-4 col-xl-4"l><"col-12 col-sm-4 col-md-4 col-xl-4"i><"col-12 col-sm-4 col-md-4 col-xl-4"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      serverSide: true,
      retrieve: true,
      order: [[0, 'desc']],
      serverMethod: 'post',
      ajax: (dataTablesParameters: any, callback) => {
        that.api_check ? that.api_check.unsubscribe() : that.api_check = null;


        that.api_check = that.http.post<any>(url,
          Object.assign(dataTablesParameters,
            filterData
          ), httpOptions).subscribe(resp => {
            if(this.initLoad){
              this.getCustomerGroupList();
              this.loadCustomers()
            }
            this.initLoad = false;
            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: resp.responseData.data
            });
          });
      },
      buttons: {
        dom: {
          button: {
            className: ''
          }
        },
        buttons: [
          {
            extend: 'colvis',
            className: 'btn btn-xs btn-primary',
            text: 'COLUMNS'
          },
          {
            extend: 'excelHtml5',
            text: 'EXCEL',
            className: 'btn btn-xs btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'csvHtml5',
            text: 'CSV',
            className: 'btn btn-xs btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'pdfHtml5',
            text: 'PDF',
            className: 'btn btn-xs btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'print',
            className: 'btn btn-xs btn-secondary',
            text: 'PRINT',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'copy',
            className: 'btn btn-xs btn-secondary',
            text: 'COPY',
            exportOptions: {
              columns: ':visible'
            }
          },
        ]
      },
      columnDefs: [
        {
          "targets": [6],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [9],
          "visible": false,
          "searchable": true
        },

      ],
      createdRow: function (row, data, index) {
        var statusObj = array_MRO_status.find(a => a.id == data.MROStatus)
        var html = '<span class="badge ' + (statusObj ? statusObj.cstyle : '') + ' btn-xs">' + (statusObj ? statusObj.title : '') + '</span>';
        $('td', row).eq(2).html(html);
      },
      columns: [
        {
          data: 'EcommerceOrderNo', name: 'EcommerceOrderNo', defaultContent: '', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {

            return `<a  href="#" class="actionView" data-toggle='tooltip' title='View MRO' data-placement='top'>${row.EcommerceOrderNo}</a>`;

          }
        },
        {
          data: 'MRONo', name: 'MRONo', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.MRONo) {
              return `<span>${row.MRONo}</a>`;

            } else {
              return `<span>-</a>`;
            }
          }
        },
        {
          data: 'MROStatus', name: 'MROStatus', orderable: true, searchable: true,
        },
        {
          data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {

            return `<span>${row.CurrencySymbol}` + `${row.GrandTotal.toFixed(2)}</span>`;

          }
        },

        {
          data: 'CustomerPONo', name: 'CustomerPONo', orderable: true, searchable: true,
        },
        { data: 'CompanyName', name: 'CompanyName', orderable: true, searchable: true },
        { data: 'Created', name: 'Created', orderable: true, searchable: true },
        { data: 'CustomerId', name: 'CustomerId', orderable: true, searchable: true },

        {
          data: 'EcommerceOrderId', className: 'text-center', orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            // console.log(data);
            var actiontext = '';
            actiontext += `<a href="/#/admin/shop/view-order-history/${data}" class="fa fa-eye text-secondary" data-toggle='tooltip' title='View Order' data-placement='top'></a> &nbsp;`;
            // actiontext += `<a href="#" class="fa fa-eye text-secondary actionView" data-toggle='tooltip' title='View Order' data-placement='top'></a>&nbsp;`;
            // actiontext += `<a href="#/admin/mro/edit?MROId=${row.MROId}" class="fa fa-edit text-secondary" target="_blank"  data-toggle='tooltip' title='Edit MRO' data-placement='top'></a> &nbsp;`;
            // actiontext += `<a href="#" class="fa fa-trash text-danger actionView3" data-toggle='tooltip' title='Delete MRO' data-placement='top'></a>`;
            return actiontext;
          }
        },
        { data: 'CustomerGroupId', name: 'CustomerGroupId', orderable: true, searchable: true },


      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {



        $('.actionView', row).unbind('click');
        $('.actionView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['/admin/shop/view-order-history/', data.EcommerceOrderId]);
        });


        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['/admin/mro/edit'], { queryParams: { MROId: data.MROId } });
        });







        return row;
      },
      "preDrawCallback": function () {
        $('#datatable-angular_processing').attr('style', 'display: block; z-index: 10000 !important');

      },
      language: {
        "paginate": {
          "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>'
        },
        'loadingRecords': '&nbsp;',
        'processing': 'Loading...'
      }
    };

    this.dataTable = $('#datatable-angular1');
    this.dataTable.DataTable(this.dtOptions);
  }

  loadCustomers() {
    this.customers$ = concat(
      this.searchCustomers().pipe( // default items
        catchError(() => of([])), // empty list on error
      ),
      this.customersInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap(term => {
          if (term != null && term != undefined)
            return this.searchCustomers(term).pipe(
              catchError(() => of([])), // empty list on error
            )
          else
            return of([])
        })
      )
    );
  }
  searchCustomers(term: string = ""): Observable<any> {
    this.loadingCustomers = true;
    var postData = {
      "Customer": term
    }
    return this.service.postHttpService(postData, "getAllAutoComplete")
      .pipe(
        map(response => {
          this.CustomersList = response.responseData;
          this.loadingCustomers = false;
          return response.responseData;
        })
      );
  }
  selectAll() {
    let customerIds = this.CustomersList.map(a => a.CustomerId);
    let cMerge = [...new Set([...customerIds, ...this.CompanyName])];
    this.CompanyName = cMerge;
  }
  CreatedDateFormat(CreatedDate) {
    const CreatedDateYears = CreatedDate.year;
    const CreatedDateDates = CreatedDate.day;
    const CreatedDatemonths = CreatedDate.month;
    let CreatedDateformat = new Date(CreatedDateYears, CreatedDatemonths - 1, CreatedDateDates);
    this.createddate = moment(CreatedDateformat).format('YYYY-MM-DD');
  }

  onFilter(event) {

    if (this.CustomerGroupId == null) {
      this.CustomerGroupId = "";
    }
    var table = $('#datatable-angular1').DataTable();
    table.columns(0).search(this.EcommerceOrderNo);
    table.columns(1).search(this.MRONo);
    table.columns(6).search(this.createddate);
    table.columns(7).search(this.CompanyName);
    table.columns(9).search(this.CustomerGroupId);

    // table.columns(6).search(localStorage.getItem("IdentityId"));
    table.draw();
  }

  onClear(event) {
    var CustomerGroupId = "";
    if (this.CustomerGroupId != null || this.CustomerGroupId != '') {
      this.CustomerGroupId = null;
      CustomerGroupId = "";
      this.loadCustomers();
    }
    var table = $('#datatable-angular1').DataTable();
    this.MRONo = '';
    this.CompanyName = '';
    this.EcommerceOrderNo = ''
    this.Date = ''
    this.createddate = ''
    table.columns(0).search(this.EcommerceOrderNo);
    table.columns(1).search(this.MRONo);
    table.columns(6).search(this.createddate);
    table.columns(7).search(this.CompanyName);
    table.columns(9).search(CustomerGroupId);

    // table.columns(6).search(localStorage.getItem("IdentityId"));
    table.draw();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  getCustomerGroupList() {
    this.service.getHttpService("ddCustomerGroup").subscribe(response => {
      if (response.status) {
        this.customerGroupList = response.responseData;
      }
    });
  }
  changeCustomerGroup(event) {
    // console.log(event);
    if (event && event.CustomerGroupId > 0) {
      this.CompanyName = ''
      this.customers$ = concat(
        this.searchCustomersWithGroup().pipe( // default items
          catchError(() => of([])), // empty list on error
        ),
        this.customersInput$.pipe(
          distinctUntilChanged(),
          debounceTime(800),
          switchMap(term => {
            if (term != null && term != undefined)
              return this.searchCustomersWithGroup(term).pipe(
                catchError(() => of([])), // empty list on error
              )
            else
              return of([])
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
      "Customer": term,
      "CustomerGroupId": this.CustomerGroupId
    }
    return this.service.postHttpService(postData, "getAllAutoComplete")
      .pipe(
        map(response => {
          this.CustomersList = response.responseData;
          this.loadingCustomers = false;
          return response.responseData;
        })
      );
  }
}
