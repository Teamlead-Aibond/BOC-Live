/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { Component, OnInit, ViewChild, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { concat, Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';

import { DataTableDirective } from 'angular-datatables';
import pdfMake from 'pdfmake/build/pdfmake.min.js';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { AppConfig } from 'config';
import { environment } from 'src/environments/environment';
import {
  CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE
} from 'src/assets/data/dropdown';
import { DatePipe } from '@angular/common';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  public CompanyName: any = [];

  // Datepicker
  selected: any;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 15 Days': [moment().subtract(14, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
  }

  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }

  baseUrl = `${environment.api.apiURL}`;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dateFilter = { startDate: moment().subtract(29, 'days'), endDate: moment() };
  api_check: any;
  dataTable: any;
  CSVData;

  @Input() dateFilterField;
  @ViewChild('dataTable', { static: true }) table;
  public CustomerCode: string;
  public FirstName: string;
  public LastName: string;
  public Status: string;
  UserEmail
  IsCSVProcessed: string
  CustomerLocation
  CustomerCurrencyCode
  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Card Data
  cardData: any;
  tableData: any = [];
  statData: any = [];

  //access rights variables
  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;
  Currentdate = new Date();
  checkedList: any = [];
  CurrencyList: any = []
  countryList: any = []
  gridCheckAll: boolean = false;
  CustomerDataItem: any = []
  checkedQuoteIds = [];
  uncheckedQuoteIds = [];
  rowcheck: boolean = false;
  TermsList: any = []
  spinner: boolean = false;
  TermsId
  CustomerGroupId: any;
  customerGroupList: any;
  empty: any = '';
  constructor(public service: CommonService, private http: HttpClient,
    public router: Router, private datePipe: DatePipe, private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent,
  ) {
    this.alwaysShowCalendars = true;
    this.showRangeLabelOnInput = true;
    this.keepCalendarOpeningWithRange = true;
  }

  ngOnInit() {
    //this.dateFilter = "10/01/2020 - 10/30/2020";
    document.title = 'Customer List'

    this.CustomerCode = '';
    this.CompanyName = '';
    this.FirstName = '';
    this.LastName = '';
    this.Status = '';
    this.IsCSVProcessed = '';
    this.CustomerCurrencyCode = ''
    this.CustomerLocation = ''
    this.TermsId = ''
    this.loadCustomers();
    this.getCustomerGroupList();
    this.getCountryList()
    this.getCurrencyList()
    this.getTermList()

    this.dataTableMessage = "Loading...";
    this.breadCrumbItems =
      [{ label: AppConfig.app_name, path: '/' },
      { label: 'Customers', path: '/' },
      { label: 'List', path: '/', active: true }];

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/customers/getCustomerListByServerSide';
    const that = this;
    var filterData = {}

    this.IsViewEnabled = this.service.permissionCheck("ManageCustomer", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.service.permissionCheck("ManageCustomer", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.service.permissionCheck("ManageCustomer", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.service.permissionCheck("ManageCustomer", CONST_DELETE_ACCESS);
    this.IsViewCostEnabled = this.service.permissionCheck("ManageCustomer", CONST_VIEW_COST_ACCESS);

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
            that.CustomerDataItem = resp.responseData.data;

            that.CustomerDataItem.forEach(item => {
              item.checked = this.isQuoteChecked(item.InvoiceId);
            });
            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: that.CustomerDataItem
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
      columnDefs: [{
        "orderable": false,
        "className": 'select-checkbox',
        "targets": [0]
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
      {
        "targets": [11],
        "visible": false,
        "searchable": true
      },
      {
        "targets": [12],
        "visible": false,
        "searchable": true
      },
      {
        "targets": [13],
        "visible": false,
        "searchable": true
      },
      {
        "targets": [14],
        "visible": false,
        "searchable": true
      },
      ],
      'select': {
        'style': 'multi'
      },
      createdRow: function (row, data, index) {

        // Set the Customer Type
        var cstyle1 = '';
        switch (data.CustomerType) {
          case "Company": { cstyle1 = 'badge-info'; break; }
          case "Personal": { cstyle1 = 'badge-pink'; break; }
          default: { cstyle1 = ''; break; }
        }
        var html = '<span class="badge ' + cstyle1 + ' btn-xs">' + data.CustomerType + '</span>';
        $('td', row).eq(3).html(html);

        var html = `<input type="checkbox" class="checkbox"  ${data.checked ? 'checked' : ''}  (change)="rowCheckBoxChecked($event, ${data.CustomerId})">`;
        $('td', row).eq(0).html(html);

        // Set the Phone
        if (data.Email != '')
          $('td', row).eq(4).html('<i class="mdi mdi-email mr-1"></i> ' + data.Email);

        // Set the Email
        /* if (data.Email != '')
          $('td', row).eq(6).html('<a href="mailto:'+ data.Email +'">'+ data.Email +'</a>'); 
        
        // Set the Address
        $('td', row).eq(7).html( data.StreetAddress + '<br>' + data.City + ', ' + data.Zip);  */

        // Set the State
        $('td', row).eq(6).html(data.CountryName);

        // Set the Status
        var cstyle = '';
        switch (data.Status) {
          case "Active": { cstyle = 'badge-success'; break; }
          case "InActive": { cstyle = 'badge-warning'; break; }
          default: { cstyle = ''; break; }
        }
        var html = '<span class="badge ' + cstyle + ' btn-xs">' + data.Status + '</span>';
        $('td', row).eq(7).html(html);

      },
      columns: [
        {
          data: 'CustomerId', name: 'CustomerId', className: 'text-center', searchable: true, orderable: false,
        },
        {
          data: 'CompanyName', name: 'CompanyName', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (this.IsViewEnabled) {
              return `<a href="#" class="actionView" data-toggle='tooltip' title='View Customer' data-placement='top'>${row.CompanyName}</a>`;
            } else {
              return '<a  ngbTooltip="View">' + row.CompanyName + '</a>';
            }
          }
        },
        // {
        //   data: 'CustomerCode', name: 'CustomerCode', defaultContent: '', orderable: true, searchable: true,
        //   render: (data: any, type: any, row: any, meta) => {
        //     if (this.IsViewEnabled) {
        //       return '<a href="#" class="actionView" ngbTooltip="View">' + row.CustomerCode + '</a>';
        //     } else {
        //       return '<a  ngbTooltip="View">' + row.CustomerCode + '</a>';
        //     }
        //   }
        // },
        { data: 'FirstName', name: 'FirstName', orderable: true, searchable: true },
        { data: 'CustomerType', name: 'CustomerType', orderable: true, searchable: true },
        { data: 'Email', name: 'Email', orderable: true, searchable: true },
        { data: 'Terms', name: 'Terms', orderable: true, searchable: true },
        /* { data: 'Email', name: 'Email', orderable: true, searchable: true },
        { data: 'StreetAddress', name: 'StreetAddress', orderable: true, searchable: true }, */
        { data: 'CountryName', name: 'CountryName', orderable: true, searchable: true },
        { data: 'Status', name: 'Status', orderable: true, searchable: true },
        {
          data: 'CustomerId', className: 'text-center', orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            actiontext += `<a href="#" class="fa fa-tasks text-secondary actionView2" data-toggle='tooltip' title='Assign Parts' data-placement='top'></a>&nbsp;`;
            if (this.IsViewEnabled) {
              actiontext += `<a href="#" class="fa fa-eye text-secondary actionView" data-toggle='tooltip' title='View Customer' data-placement='top'></a>&nbsp;`;
            }
            if (this.IsEditEnabled) {
              actiontext += `<a href="#" class="fa fa-edit text-secondary actionView1"data-toggle='tooltip' title='Edit Customer' data-placement='top'></a> &nbsp;`;
            }
            if (this.IsDeleteEnabled) {
              actiontext += `<a href="#" class="fa fa-trash text-danger actionView3" data-toggle='tooltip' title='Delete Customer' data-placement='top'></a>`;
            }
            return actiontext;
          }
        },
        { data: 'IsCSVProcessed', name: 'IsCSVProcessed', orderable: true, searchable: true },
        { data: 'CustomerCurrencyCode', name: 'CustomerCurrencyCode', orderable: true, searchable: true },
        { data: 'CustomerLocation', name: 'CustomerLocation', orderable: true, searchable: true },
        { data: 'TermsId', name: 'TermsId', orderable: true, searchable: true },
        { data: 'UserEmail', name: 'UserEmail', orderable: true, searchable: true },
        { data: 'CustomerGroupId', name: 'CustomerGroupId', orderable: true, searchable: true },

      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.actionView', row).unbind('click');
        $('.actionView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.navCtrl.navigate('admin/customer/view', { CustomerId: data.CustomerId });
        });

        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.navCtrl.navigate('admin/customer/edit', { CustomerId: data.CustomerId });
        });

        $('.actionView3', row).unbind('click');
        $('.actionView3', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDelete(data.CustomerId);
        });


        $('.actionView2', row).unbind('click');
        $('.actionView2', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.navCtrl.navigate('admin/customer/assign-parts', { CustomerId: data.CustomerId });
        });

        $('.checkbox', row).unbind('click');
        $('.checkbox', row).bind('click', (e) => {
          this.rowCheckBoxChecked(e, data.CustomerId)

          // this.onExcelData(data.CustomerId)
        });

        return row;
      },
      "preDrawCallback": function () {
        $('#datatable-customer_processing').attr('style', 'display: block; z-index: 10000 !important');

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

    this.dataTable = $('#datatable-customer');
    this.dataTable.DataTable(this.dtOptions);

    this.onStat();
  }
  getTermList() {
    this.service.getHttpService("getTermsList").subscribe(response => {
      if (response.status == true) {
        this.TermsList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  getCountryList() {
    this.service.getHttpService("getCountryList").subscribe(response => {
      if (response.status == true) {
        this.countryList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  getCurrencyList() {
    this.service.getHttpService('Currencyddl').subscribe(response => {
      if (response.status == true) {
        this.CurrencyList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  private isQuoteChecked(CustomerId) {
    this.checkedList = [];
    if (!this.gridCheckAll) {
      return this.checkedQuoteIds.indexOf(CustomerId) >= 0 ? true : false;
    } else {
      this.CustomerDataItem.map(a => a.checked = true);
      this.checkedList = this.CustomerDataItem.map(a => { return { CustomerId: a.CustomerId } });
      return this.uncheckedQuoteIds.indexOf(CustomerId) >= 0 ? false : true;

    }
  }
  gridAllRowsCheckBoxChecked(e) {
    // console.log(e);
    // if (this.gridCheckAll) {
    this.uncheckedQuoteIds.length = 0;
    this.gridCheckAll = !this.gridCheckAll;

    // if (this.gridCheckAll) {
    //   this.checkedPersonIds.push();
    // }
    // } else {
    //   this.checkedPersonIds.length = 0;
    //   this.gridCheckAll = true;
    // }
    if (e.target.checked) {
      this.CustomerDataItem.map(a => a.checked = true);
      this.checkedList = this.CustomerDataItem.map(a => { return { CustomerId: a.CustomerId } });

      // this.QuoteList = this.QuoteItem.map(a => {
      //   let qObj: any;
      //   qObj.QuoteId = a.QuoteId;
      //   if (a.RRNo != '' && a.RRNo != '0' && a.RRNo != null) {
      //     qObj.RRNo = a.RRNo;
      //   } else if (a.MRONo != '' && a.MRONo != '0' && a.MRONo != null) {
      //     qObj.MRONo = a.MRONo;

      //   }
      //   return qObj;
      // });
    } else {
      this.CustomerDataItem.map(a => a.checked = false);
      // this.QuoteList = [];
      this.checkedList = [];
    }
    $('#datatable-customer').DataTable().ajax.reload();
  }

  rowCheckBoxChecked(e, CustomerId) {
    if (e.target.checked) {
      this.checkedList.push({ CustomerId });

      // let qObj: any;
      // qObj.QuoteId = QuoteId;

      // if (RRNo != '' && RRNo != '0' && RRNo != null) {
      //   qObj.RRNo = RRNo;
      // } else if (MRONo != '' && MRONo != '0' && MRONo != null) {
      //   qObj.MRONo = MRONo;

      // }

      // this.QuoteItem.push(qObj);

    } else {
      this.gridCheckAll = false
      this.checkedList = this.checkedList.filter(a => a.CustomerId != CustomerId);
      // this.QuoteList = this.QuoteList.filter(a => a.QuoteId != QuoteId);
    }
  }
  onExcelData(CustomerId) {
    this.checkedList.push({
      CustomerId
    })
  }
  onFilter(event) {
    if (this.CustomerGroupId == null) {
      this.CustomerGroupId = "";
    }
    var table = $('#datatable-customer').DataTable();
    table.columns(2).search(this.FirstName);
    table.columns(0).search(this.CompanyName);
    table.columns(7).search(this.Status);
    table.columns(9).search(this.IsCSVProcessed);
    table.columns(10).search(this.CustomerCurrencyCode);
    table.columns(11).search(this.CustomerLocation);
    table.columns(12).search(this.TermsId);
    table.columns(13).search(this.UserEmail);
    table.columns(14).search(this.CustomerGroupId);
    table.draw();
  }

  onClear(event) {
    var table = $('#datatable-customer').DataTable();
    this.CustomerCode = '';
    this.CompanyName = '';
    this.FirstName = '';
    this.LastName = '';
    this.Status = '';
    this.IsCSVProcessed = '';
    this.checkedList = []
    this.CustomerCurrencyCode = ''
    this.CustomerLocation = ''
    this.TermsId = ''
    this.UserEmail = ''
    var CustomerGroupId = "";
    if (this.CustomerGroupId != null || this.CustomerGroupId != '') {
      this.CustomerGroupId = null;
      CustomerGroupId = "";
      this.loadCustomers();
    }

    // table.columns(0).search(this.CustomerCode);
    table.columns(2).search(this.FirstName);
    table.columns(0).search(this.CompanyName);
    table.columns(7).search(this.Status);
    table.columns(9).search(this.IsCSVProcessed);
    table.columns(10).search(this.CustomerCurrencyCode);
    table.columns(11).search(this.CustomerLocation);
    table.columns(12).search(this.TermsId);
    table.columns(13).search(this.UserEmail);
    table.columns(14).search(CustomerGroupId);
    table.draw();
  }

  onStat() {
    var postData = {
      "startDate": moment(this.dateFilter.startDate).format("YYYY-MM-DD"),
      "endDate": moment(this.dateFilter.endDate).format("YYYY-MM-DD"),
    }
    this.service.postHttpService(postData, 'getCustomerStatistics').subscribe(response => {
      this.statData = response.responseData;
    });
  }

  getFlag(country) {
    var flag = "assets/images/flags/" + country.toLowerCase().replace(' ', '_') + ".jpg";
    return flag;
  }

  onDelete(CustomerId) {
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
          CustomerId: CustomerId
        }

        this.service.postHttpService(postData, 'getDeleteCustomer').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Customer record has been deleted.',
              type: 'success'
            });
            // Reload the table
            var table = $('#datatable-customer').DataTable();
            table.draw();
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Customer is safe :)',
          type: 'error'
        });
      }
    });

  }


  exportAsCSV() {


    var postData = {
      "Customer": this.checkedList,
      "CustomerId": this.CompanyName,
      "FirstName": this.FirstName,
      "Status": this.Status,
      "IsCSVProcessed": this.IsCSVProcessed,
      "DownloadType": "CSV",
      "CustomerCurrencyCode": this.CustomerCurrencyCode,
      "CustomerLocation": this.CustomerLocation,
      "TermsId": this.TermsId,
      "UserEmail": this.UserEmail
    }
    this.spinner = true;
    this.service.postHttpService(postData, "CustomerExportToExcel").subscribe(response => {
      if (response.status == true) {
        this.CSVData = response.responseData.ExcelData;
        this.generateCSVFormat();
        this.spinner = false;
        Swal.fire({
          title: 'Success!',
          text: 'CSV downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        this.spinner = false;
        Swal.fire({
          title: 'Error!',
          text: 'CSV could not be downloaded!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }

  generateCSVFormat() {

    let sampleJson: any = this.CSVData
    let a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    let csvData = this.ConvertToCSV(sampleJson);
    let blob = new Blob([csvData], { type: 'text/csv;encoding:utf-8' });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
    var filename = ('Customer ' + currentDate + '.csv')
    a.download = filename;
    a.click()

  }
  ConvertToCSV(objArray) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = "";
    for (let index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (let i = 0; i < array.length; i++) {
      let line = '';

      for (let index in array[i]) {
        if (line != '') line += ',';
        line += "\"" + array[i][index] + "\"";
      }
      str += line + '\r\n';
    }
    return str;
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
    this.service.getHttpService("ddCustomerGroup").subscribe(response => {
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

  changeCustomerGroup(event) {
    // console.log(event);
    if (event && event.CustomerGroupId > 0) {
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