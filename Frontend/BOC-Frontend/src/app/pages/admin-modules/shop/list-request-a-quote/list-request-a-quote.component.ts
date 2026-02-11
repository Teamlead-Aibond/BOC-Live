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
import {
  CONST_AH_Group_ID,SalesOrder_Status, SalesOrder_Type, warranty_list, SalesOrder_notes, CONST_IDENTITY_TYPE_SO,
  CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, attachment_thumb_images, CONST_ShipAddressType, CONST_BillAddressType, CONST_ContactAddressType, Const_Alert_pop_title, Const_Alert_pop_message,priority, requestQuoteStatus
} from 'src/assets/data/dropdown';
@Component({
  selector: 'app-list-request-a-quote',
  templateUrl: './list-request-a-quote.component.html',
  styleUrls: ['./list-request-a-quote.component.scss']
})
export class ListRequestAQuoteComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  loginType: any;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  HotelId;
  dataTableMessage;
  dtOptions: any = {};
  result: any = [];
  PartNo
  RequestQuoteNo
  priority = ''
  Status = ''
  priorityArr = priority
  requestQuotesStatus = requestQuoteStatus
  baseUrl = `${environment.api.apiURL}`;
  api_check: any;
  @Input() dateFilterField;
  @ViewChild('dataTable', { static: true }) table;
  dataTable: any;

  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  IsRFQView: any;
  IsRFQEdit: any;
  IsRFQDelete: any;
  initLoad: boolean = true;
  constructor(public navCtrl: NgxNavigationWithDataComponent, public router: Router,
    public service: CommonService, private http: HttpClient) { 
      this.IsRFQView = this.service.permissionCheck("RequestForQuote", CONST_VIEW_ACCESS);
      this.IsRFQEdit = this.service.permissionCheck("RequestForQuote", CONST_MODIFY_ACCESS);
      this.IsRFQDelete = this.service.permissionCheck("RequestForQuote", CONST_DELETE_ACCESS);
    }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Shop', path: '#/admin/shop/product-list' }, { label: 'Order History', path: '#/admin/shop/order-history' }];
    this.loginType = localStorage.getItem("IdentityType");
    if(this.IsRFQView){
      this.getList();
    }
  }
  getList() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/RequestForQuote/RequestForQuoteListByServerSide';
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
        // {
        //   "targets": [6],
        //   "visible": false,
        //   "searchable": true
        // },

      ],
      createdRow: function (row, data, index) {

      },
      columns: [
        {
          data: 'PartNo', name: 'PartNo', defaultContent: '', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {

            return `<a  href="#/admin/shop/request-a-quote" class="actionView" data-toggle='tooltip' title='View MRO' data-placement='top'>${row.PartNo}</a>`;

          }
        },
        // {
        //   data: 'MRONo', name: 'MRONo', orderable: true, searchable: true,
        //   render: (data: any, type: any, row: any, meta) => {
        //     if (row.MRONo) {
        //       return `<span>${row.MRONo}</a>`;

        //     }else{
        //       return `<span>-</a>`;
        //     }
        //   }
        // },
        // {
        //   data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true,
        //   render: (data: any, type: any, row: any, meta) => {

        //     return `<span>${row.CurrencySymbol}` + `${row.GrandTotal}</span>`;

        //   }
        // },

        { data: 'RequestQuoteNo', name: 'RequestQuoteNo', orderable: true, searchable: true },
        { data: 'Manufacturer', name: 'Manufacturer', orderable: true, searchable: true },
        {
          data: 'Priority', name: 'Priority', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.Priority) {
              if (row.Priority == 1) {
                return `<span>Urgent - Machine down</span>`;

              } else if (row.Priority == 2) {
                return `<span>High</span>`;
              } else if (row.Priority == 3) {
                return `<span>Low</span>`;
              } else {
                return `<span>-</span>`;
              }
            } else {
              return `<span>-</span>`;
            }
          }
        },
        { data: 'ContactName', name: 'ContactName', orderable: true, searchable: true },
        {
          data: 'Status', name: 'Status', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.Status) {
              if (row.Status == 1) {
                return `<span>Open</span>`;

              } else if (row.Status == 2) {
                return `<span>Closed</span>`;
              } else {
                return `<span>-</span>`;
              }
            } else {
              return `<span>-</span>`;
            }
          }
        },
        { data: 'Created', name: 'Created', orderable: true, searchable: true },

        {
          data: 'RequestQuoteId', className: 'text-center', orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            // console.log(data);
            var actiontext = '';
            // actiontext += `<a href="/#/admin/shop/view-order-history/${data}" class="fa fa-eye text-secondary" data-toggle='tooltip' title='View Order' data-placement='top'></a> &nbsp;`;
            // actiontext += `<a href="#" class="fa fa-eye text-secondary actionView" data-toggle='tooltip' title='View Order' data-placement='top'></a>&nbsp;`;
            if (this.IsRFQEdit) {
              actiontext += `<a href="#/admin/shop/request-a-quote" class="fa fa-edit text-secondary actionView" target="_blank"  data-toggle='tooltip' title='Edit' data-placement='top'></a> &nbsp;`;
            }
            if (this.IsRFQDelete) {
              actiontext += `<a href="#" class="fa fa-trash text-danger actionView1" data-toggle='tooltip' title='Delete MRO' data-placement='top'></a>`;
            }
            return actiontext;
          }
        },

      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {



        $('.actionView', row).unbind('click');
        $('.actionView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          this.router.navigate(['/admin/shop/request-a-quote'], { state: { requestQuoteId: data.RequestQuoteId } });
        });


        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDelete(data.RequestQuoteId);
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
  onDelete(RequestQuoteId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          RequestQuoteId: RequestQuoteId,
        }
        this.service.postHttpService(postData, 'deleteRequestForQuote').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Record has been deleted.',
              type: 'success'
            });

            // Reload the table
            var table = $('#datatable-angular1').DataTable();
            table.draw();
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'MRO Record is safe :)',
          type: 'error'
        });
      }
    });
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

  onFilter(event) {


    var table = $('#datatable-angular1').DataTable();
    table.columns(0).search(this.PartNo);
    table.columns(1).search(this.RequestQuoteNo);
    table.columns(3).search(this.priority);
    table.columns(5).search(this.Status);

    table.draw();
    this.loadCustomers();
  }

  onClear(event) {
    var table = $('#datatable-angular1').DataTable();
    this.PartNo = '';
    this.RequestQuoteNo = '';
    this.priority = ''
    this.Status = ''
    table.columns(0).search(this.PartNo);
    table.columns(1).search(this.RequestQuoteNo);
    table.columns(3).search(this.priority);
    table.columns(5).search(this.Status);

    table.draw();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
