/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_DELETE_ACCESS, CONST_MODIFY_ACCESS } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consolidate-invoice-list',
  templateUrl: './consolidate-invoice-list.component.html',
  styleUrls: ['./consolidate-invoice-list.component.scss']
})
export class ConsolidateInvoiceListComponent implements OnInit {

  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  public CompanyName: any = [];

  baseUrl = `${environment.api.apiURL}`;
  ExcelData: any = [];
  Quote: any = [];

  //access rights variables
  IsViewEnabled
  IsAddEnabled
  IsEditEnabled
  IsDeleteEnabled
  DownloadOptionList: boolean = true
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  CustomerPONO
  ConsolidationInvoiceNo
  CustomerId
  keywordForCustomer = 'CompanyName';
  customerList: any = [];
  isLoadingCustomer: boolean = false;
  InvoiceNo
  CreatedBy
  Created
  CreatedDate
  adminList: any = []
  customerGroupList: any;
  CustomerGroupId: any;
  initLoad: boolean = true;
  constructor(private http: HttpClient,
    private router: Router, public service: CommonService, private cd_ref: ChangeDetectorRef, private commonService: CommonService,
    private CommonmodalService: BsModalService, private excelService: ExcelService,
    public modalRef: BsModalRef, private datePipe: DatePipe,
    public navCtrl: NgxNavigationWithDataComponent

  ) { }
  currentRouter = this.router.url;

  ngOnInit(): void {
    document.title = 'Consolidate Invoice List'
    this.IsViewEnabled = this.service.permissionCheck("ConsolidateInvoice", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.service.permissionCheck("ConsolidateInvoice", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.commonService.permissionCheck("ConsolidateInvoice", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.commonService.permissionCheck("ConsolidateInvoice", CONST_DELETE_ACCESS);
    if (this.IsViewEnabled) {
      this.onList();
    }
  }
  getAdminList() {
    this.commonService.getHttpService('getAllActiveAdmin').subscribe(response => {//getAdminListDropdown
      this.adminList = response.responseData.map(function (value) {
        return { title: value.FirstName + " " + value.LastName, "UserId": value.UserId }
      });;;
    });
  }


  onList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/ConsolidateInvoice/list';
    const that = this;
    var filterData = {}
    if (this.DownloadOptionList) {
      var buttons = {}
      buttons = {
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
      }
    }
    else {
      buttons = {
        dom: {
          button: {
            className: ''
          }

        },
        buttons: []
      }
    }
    this.dtOptions = {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-12 col-sm-4 col-md-4 col-xl-4"l><"col-12 col-sm-4 col-md-4 col-xl-4"i><"col-12 col-sm-4 col-md-4 col-xl-4"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      serverSide: true,
      retrieve: true,
      order: [[9, 'desc']],
      serverMethod: 'post',
      responsive: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.api_check ? that.api_check.unsubscribe() : that.api_check = null;
        that.api_check = that.http.post<any>(url,
          Object.assign(dataTablesParameters,
            filterData
          ), httpOptions).subscribe(resp => {
            if(this.initLoad){
              this.loadCustomers();
              this.getCustomerGroupList();
              this.getAdminList();
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
      buttons: buttons,
      columnDefs: [
        {
          "targets": [7],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [8],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [9],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [10],
          "visible": false,
          "searchable": true
        },
      ],
      'select': {
        'style': 'multi'
      },
      createdRow: function (row, data, index) {


      },
      columns: [
        {
          data: 'CInvoiceNo', name: 'CInvoiceNo', orderable: true, searchable: true, defaultContent: '',
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';

            if (this.IsViewEnabled) {
              actiontext += `<a href="#/admin/ConsolidateInvoice-View?ConsolidateInvoiceId=${row.ConsolidateInvoiceId}" target="_blank"  data-toggle='tooltip' title='Consolidate Invoice View' data-placement='top'>${row.CInvoiceNo}</a`;
            }
           

            return actiontext;
          }

        },
        {
          data: 'InvoiceNo', name: 'InvoiceNo', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var IId = '';
            if (row.InvoiceNo && row.InvoiceNo.indexOf(',') != -1) {
              row.InvoiceNo.split(",").forEach(function (item) {
                if (item) {
                  var itemId = item.split("INV");
                  IId += `<a href="#/admin/invoice/list?InvoiceId=${itemId[1]}" target="_blank" data-toggle='tooltip' title='Invoice View' data-placement='top'>` + item + `</a>`;
                } else {
                  IId += item;
                };
                IId += ', ';
              });
            } else if (row.InvoiceNo != null) {
              if (row.InvoiceNo) {
                var itemId = row.InvoiceNo.split("INV");
                IId += `<a href="#/admin/invoice/list?InvoiceId=${itemId[1]}" target="_blank" data-toggle='tooltip' title='Invoice View' data-placement='top'>` + row.InvoiceNo + `</a>`;
              } else {
                IId += row.InvoiceNo;
              };
              IId += ', ';
            } else {
              IId += '-, ';
            }
            return IId.trim().slice(0, -1);


          }



          // if (row.InvoiceNo) {
          //   return `<a href="#/admin/invoice/list?InvoiceId=${row.InvoiceId}" target="_blank" data-toggle='tooltip' title='Invoice View' data-placement='top'>` + row.InvoiceNo + `</a>`;
          // } else {
          //   return row.InvoiceNo;
          // };
          // }
        },
        {
          data: 'CompanyName', name: 'CompanyName', defaultContent: '', orderable: false, searchable: true,

        },


        { data: 'CustomerPONo', name: 'CustomerPONo', orderable: true, searchable: true, },
        { data: 'Created', name: 'Created', orderable: true, searchable: true, },
        { data: 'CreatedByName', name: 'CreatedByName', orderable: true, searchable: true, },
        {
          data: 'ConsolidateInvoiceDetailId', className: 'text-center', orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';

            if (this.IsViewEnabled) {
              actiontext += `<a href="#/admin/ConsolidateInvoice-View?ConsolidateInvoiceId=${row.ConsolidateInvoiceId}" target="_blank" class="fa fa-eye text-secondary" data-toggle='tooltip' title='Consolidate Invoice View' data-placement='top'></a>&nbsp;`;
            }
            if (this.IsEditEnabled) {
              actiontext += `<a href="#/admin/ConsolidateInvoice-Edit?ConsolidateInvoiceId=${row.ConsolidateInvoiceId}"  target="_blank" class="fa fa-edit text-secondary" data-toggle='tooltip' title='Consolidate Invoice Edit' data-placement='top'></a> &nbsp;`;
            }
            if (this.IsDeleteEnabled) {
              actiontext += `<a href="#" class="fa fa-trash text-danger actionView3" data-toggle='tooltip' title='Consolidate Invoice Delete' data-placement='top'></a>`;
            }

            return actiontext;
          }

        },
        { data: 'CustomerId', name: 'CustomerId', orderable: true, searchable: true, },
        { data: 'CreatedBy', name: 'CreatedBy', orderable: true, searchable: true, },
        { data: 'ConsolidateInvoiceId', name: 'ConsolidateInvoiceId', orderable: true, searchable: true, },
        { data: 'CustomerGroupId', name: 'CustomerGroupId', orderable: true, searchable: true, },

      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {


        $('.actionView3', row).unbind('click');
        $('.actionView3', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDelete(data.ConsolidateInvoiceId);
        });


        return row;
      },
      "preDrawCallback": function () {
        $('#datatable-Consolidate-Invoice_processing').attr('style', 'display: block; z-index: 10000 !important');

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
      },

    };
    this.dataTable = $('#datatable-Consolidate-Invoice');
    this.dataTable.DataTable(this.dtOptions);
  }
  onDelete(ConsolidateInvoiceId) {
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
          ConsolidateInvoiceId: ConsolidateInvoiceId,
        }
        this.commonService.postHttpService(postData, 'ConsolidateInvoiceDelete').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Consolidate Invoice has been deleted.',
              type: 'success'
            });
            var table = $('#datatable-Consolidate-Invoice').DataTable();
            table.draw();
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Consolidate Invoice is safe:)',
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
  getCustomerGroupList() {
    this.commonService.getHttpService("ddCustomerGroup").subscribe(response => {
      if (response.status) {
        this.customerGroupList = response.responseData;
      } 
    });
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




  CreatedDateFormat(Created) {
    const CreatedYears = Created.year;
    const CreatedDates = Created.day;
    const Createdmonths = Created.month;
    let Createdformat = new Date(CreatedYears, Createdmonths - 1, CreatedDates);
    this.CreatedDate = moment(Createdformat).format('YYYY-MM-DD');
  }

  onFilter(event) {
    if(this.CustomerGroupId == null){
      this.CustomerGroupId = "";
    }
    var table = $('#datatable-Consolidate-Invoice').DataTable();
    table.columns(0).search(this.ConsolidationInvoiceNo);
    table.columns(7).search(this.CompanyName);
    table.columns(3).search(this.CustomerPONO);
    table.columns(1).search(this.InvoiceNo);
    table.columns(8).search(this.CreatedBy);
    table.columns(4).search(this.CreatedDate);
    table.columns(10).search(this.CustomerGroupId);
    table.draw();
  }

  onClear() {
    this.CustomerPONO = ''
    this.InvoiceNo = ''
    this.CompanyName = ""
    this.ConsolidationInvoiceNo = ""
    this.CreatedBy = ''
    this.Created = ""
    this.CreatedDate = ""
    var CustomerGroupId = "";
    if(this.CustomerGroupId != null || this.CustomerGroupId != ''){
      this.CustomerGroupId = null;
      CustomerGroupId = "";
      this.loadCustomers();
    }
    var table = $('#datatable-Consolidate-Invoice').DataTable();
    table.columns(0).search(this.ConsolidationInvoiceNo);
    table.columns(7).search(this.CompanyName);
    table.columns(3).search(this.CustomerPONO);
    table.columns(1).search(this.InvoiceNo);
    table.columns(8).search(this.CreatedBy);
    table.columns(4).search(this.CreatedDate);
    table.columns(10).search(CustomerGroupId);
    table.draw();
  }

  changeCustomerGroup(event){
    // console.log(event);
    if(event && event.CustomerGroupId > 0){
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
    }else{
      this.loadCustomers();
    }
  }
  searchCustomersWithGroup(term: string = ""): Observable<any> {
    this.loadingCustomers = true;
    var postData = {
      "Customer": term,
      "CustomerGroupId": this.CustomerGroupId
    }
    return this.commonService.postHttpService(postData, "getAllAutoComplete")
      .pipe(
        map(response => {
          this.CustomersList = response.responseData;
          this.loadingCustomers = false;
          return response.responseData;
        })
      );
  }

}


