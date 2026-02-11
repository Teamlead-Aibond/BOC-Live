/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { Component, OnInit, ViewChild, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
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
  CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, vendor_class
} from 'src/assets/data/dropdown';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
  /* ,providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ] */
})
export class VendorListComponent implements OnInit {// Datepicker
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

  @Input() dateFilterField;
  @ViewChild('dataTable', { static: true }) table;

  public VendorCode: string;
  public VendorName: string;
  public VendorTypeId: string;
  public IsCorpVendorCode: string;
  public Status: string;
  IsCSVProcessed: string;
  VendorClass
  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Card Data
  cardData: any;
  tableData: any = [];
  statData: any = [];
  CurrencyList:any=[]
  countryList:any=[]
  //access rights variables
  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;
  CSVData;
  Currentdate = new Date();
  checkedList: any = [];
  VendorClassList: any = []
  VendorLocation
  VendorCurrencyCode
  gridCheckAll: boolean = false;
  VendorDataItem:any=[]
  checkedQuoteIds = [];
  uncheckedQuoteIds = [];
  rowcheck: boolean = false;
  
  spinner: boolean = false;
  initLoad: boolean = true;
  constructor(public service: CommonService, private http: HttpClient,
    public router: Router, private datePipe: DatePipe, private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent,
  ) {
    this.alwaysShowCalendars = true;
    this.showRangeLabelOnInput = true;
    this.keepCalendarOpeningWithRange = true;
  }

  ngOnInit() {
    document.title='Vendor List'
    //this.dateFilter = "10/01/2020 - 10/30/2020";

    this.VendorCode = '';
    this.VendorName = '';
    this.VendorTypeId = '';
    this.IsCorpVendorCode = '';
    this.Status = '';
    this.IsCSVProcessed = '';
    this.VendorClass = ''
    this.VendorCurrencyCode = ''
    this.VendorLocation = ''
    this.VendorClassList = vendor_class;

    this.dataTableMessage = "Loading...";
    this.breadCrumbItems =
      [{ label: AppConfig.app_name, path: '/' },
      { label: 'Vendors', path: '/' },
      { label: 'List', path: '/', active: true }];

    this.IsViewEnabled = this.service.permissionCheck("ManageVendor", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.service.permissionCheck("ManageVendor", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.service.permissionCheck("ManageVendor", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.service.permissionCheck("ManageVendor", CONST_DELETE_ACCESS);
    this.IsViewCostEnabled = this.service.permissionCheck("ManageVendor", CONST_VIEW_COST_ACCESS);

    this.getList();
  }

  getList(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/vendor/getVendorListByServerSide';
    const that = this;
    var filterData = {}
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

            that.VendorDataItem = resp.responseData.data;

            that.VendorDataItem.forEach(item => {
              item.checked = this.isQuoteChecked(item.InvoiceId);
            });
            if(this.initLoad){
              this.getCountryList();
              this.getCurrencyList();
              this.onStat();
            }
            this.initLoad = false;
            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data:that.VendorDataItem
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

      createdRow: function (row, data, index) {
        var html = `<input type="checkbox" class="checkbox"  ${data.checked ? 'checked' : ''}  (change)="rowCheckBoxChecked($event, ${data.VendorId})">`;
        $('td', row).eq(0).html(html);

        // Set the Customer Type
        var cstyle1 = '';
        switch (data.VendorTypeId) {
          case "V": { cstyle1 = 'badge-info'; break; }
          case "M": { cstyle1 = 'badge-purple'; break; }
          case "B": { cstyle1 = 'badge-pink'; break; }
          default: { cstyle1 = ''; break; }
        }
        var html = '<span class="badge ' + cstyle1 + ' btn-xs">' + data.VendorType + '</span>';
        $('td', row).eq(3).html(html);

        /* if (data.IsCorpVendor == 1)
           $('td', row).eq(4).html('<span class="badge badge-success">Yes</span>');
         else
           $('td', row).eq(4).html('<span class="badge badge-warning">No</span>');*/

        $('td', row).eq(4).html('<span class="badge badge-primary">' + data.IsCorpVendorCode + '</span>');

        // Set the Phone
        /*  if (data.PhoneNoPrimary != '')
            $('td', row).eq(4).html('<i class="mdi mdi-phone mr-1"></i> ' + data.PhoneNoPrimary);*/

        // Set the Email
        if (data.VendorEmail != '')
          $('td', row).eq(5).html('<a href="mailto:' + data.VendorEmail + '">' + data.VendorEmail + '</a>');

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
      columnDefs: [
        {
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
      ],
      columns: [
        {
          data: 'VendorId', name: 'VendorId', className: 'text-center',orderable: false, searchable: true,
        },
        {
          data: 'VendorCode', name: 'VendorCode', defaultContent: '', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (this.IsViewEnabled) {
              return `<a href="#" class="actionView" data-toggle='tooltip' title='View Vendor' data-placement='top'>${row.VendorCode}</a>`;
            } else {
              return '<a ngbTooltip="View">' + row.VendorCode + '</a>';
            }

          }
        },
        {
          data: 'VendorName', name: 'VendorName', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (this.IsViewEnabled) {
              return `<a href="#" class="actionView" data-toggle='tooltip' title='View Vendor' data-placement='top'>${row.VendorName}</a>`;
            } else {
              return '<a ngbTooltip="View">' + row.VendorName + '</a>';
            }
          }
        },
        { data: 'VendorTypeId', name: 'VendorTypeId', orderable: true, searchable: true },
        { data: 'IsCorpVendor', name: 'IsCorpVendor', orderable: true, searchable: true },
        // { data: 'PhoneNoPrimary', name: 'PhoneNoPrimary', orderable: true, searchable: true },
        { data: 'VendorEmail', name: 'VendorEmail', orderable: true, searchable: true },
        { data: 'CountryName', name: 'CountryName', orderable: true, searchable: true },
        { data: 'Status', name: 'Status', orderable: true, searchable: true },
        {
          data: 'VendorId', className: 'text-center', orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            // Ref: https://github.com/l-lin/angular-datatables/issues/979
            var actiontext = '';
            if (this.IsViewEnabled) {
              actiontext += `<a href="#" class="fa fa-eye text-secondary actionView" data-toggle='tooltip' title='View Vendor' data-placement='top'></a>&nbsp;`;
            }
            if (this.IsEditEnabled) {
              actiontext += `<a href="#" class="fa fa-edit text-secondary actionView1" data-toggle='tooltip' title='Edit Vendor' data-placement='top'></a> &nbsp;`;
            }
            if (this.IsDeleteEnabled) {
              actiontext += `<a href="#" class="fa fa-trash text-danger actionView3" data-toggle='tooltip' title='Delete Vendor' data-placement='top'></a>`;
            }
            return actiontext;
          }
        },
        { data: 'IsCSVProcessed', name: 'IsCSVProcessed', orderable: true, searchable: true },
        { data: 'VendorClass', name: 'VendorClass', orderable: true, searchable: true },
        { data: 'IsCorpVendorCode', name: 'IsCorpVendorCode', orderable: true, searchable: true },
        { data: 'VendorCurrencyCode', name: 'VendorCurrencyCode', orderable: true, searchable: true },
        { data: 'VendorLocation', name: 'VendorLocation', orderable: true, searchable: true },


      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.actionView', row).unbind('click');
        $('.actionView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.navCtrl.navigate('/admin/vendor/view', { VendorId: data.VendorId });
        });

        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.navCtrl.navigate('/admin/vendor/edit', { VendorId: data.VendorId });
        });

        $('.actionView3', row).unbind('click');
        $('.actionView3', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDelete(data.VendorId);
        });

        $('.checkbox', row).unbind('click');
        $('.checkbox', row).bind('click', (e) => {
          this.rowCheckBoxChecked(e,data.VendorId)

          // this.onExcelData(data.VendorId)
        });
        return row;
      },
      "preDrawCallback": function () {
        $('#datatable-vendor_processing').attr('style', 'display: block; z-index: 10000 !important');

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

    this.dataTable = $('#datatable-vendor');
    this.dataTable.DataTable(this.dtOptions);
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
  private isQuoteChecked(VendorId) {
    this.checkedList = [];
    if (!this.gridCheckAll) {
      return this.checkedQuoteIds.indexOf(VendorId) >= 0 ? true : false;
    } else {
      this.VendorDataItem.map(a => a.checked = true);
      this.checkedList = this.VendorDataItem.map(a => { return { VendorId: a.VendorId } });
      return this.uncheckedQuoteIds.indexOf(VendorId) >= 0 ? false : true;
    
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
      this.VendorDataItem.map(a => a.checked = true);
      this.checkedList = this.VendorDataItem.map(a => { return { VendorId: a.VendorId } });

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
      this.VendorDataItem.map(a => a.checked = false);
      // this.QuoteList = [];
      this.checkedList = [];
    }
    $('#datatable-vendor').DataTable().ajax.reload();
  }

  rowCheckBoxChecked(e, VendorId) {
    if (e.target.checked) {
      this.checkedList.push({ VendorId });

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
      this.checkedList = this.checkedList.filter(a => a.VendorId != VendorId);
      // this.QuoteList = this.QuoteList.filter(a => a.QuoteId != QuoteId);
    }
  }
  onExcelData(VendorId) {
    this.checkedList.push({
      VendorId
    })
  }
  onFilter(event) {
    var table = $('#datatable-vendor').DataTable();
    // table.columns(0).search(this.VendorCode);
    table.columns(2).search(this.VendorName);
    table.columns(3).search(this.VendorTypeId);
    table.columns(11).search(this.IsCorpVendorCode);
    table.columns(7).search(this.Status);
    table.columns(9).search(this.IsCSVProcessed);
    table.columns(10).search(this.VendorClass);
    table.columns(12).search(this.VendorCurrencyCode);
    table.columns(13).search(this.VendorLocation);

    table.draw();
  }

  onClear(event) {
    var table = $('#datatable-vendor').DataTable();
    this.VendorCode = '';
    this.VendorName = '';
    this.VendorTypeId = '';
    this.IsCorpVendorCode = '';
    this.Status = '';
    this.IsCSVProcessed = ''
    this.VendorClass = '';
    this.VendorCurrencyCode =''
    this.VendorLocation = ''
    // table.columns(0).search(this.VendorCode);
    table.columns(2).search(this.VendorName);
    table.columns(3).search(this.VendorTypeId);
    table.columns(11).search(this.IsCorpVendorCode);
    table.columns(7).search(this.Status);
    table.columns(9).search(this.IsCSVProcessed);
    table.columns(10).search(this.VendorClass);
    table.columns(12).search(this.VendorCurrencyCode);
    table.columns(13).search(this.VendorLocation);
    table.draw();
  }

  onStat() {
    var postData = {
      "startDate": moment(this.dateFilter.startDate).format("YYYY-MM-DD"),
      "endDate": moment(this.dateFilter.endDate).format("YYYY-MM-DD"),
    }
    this.service.postHttpService(postData, 'getVendorStatistics').subscribe(response => {
      this.statData = response.responseData;
    });
  }

  getFlag(country) {
    var flag = "assets/images/flags/" + country.toLowerCase().replace(' ', '_') + ".jpg";
    return flag;
  }


  onDelete(VendorId) {
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
          VendorId: VendorId
        }
        this.service.postHttpService(postData, 'getDeleteVendor').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Vendor record has been deleted.',
              type: 'success'
            });

            // Reload the table
            var table = $('#datatable-vendor').DataTable();
            table.draw();
          }else{
            Swal.fire({
              title: 'Info!',
              text: response.message,
              type: 'error'
            });
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Vendor is safe :)',
          type: 'error'
        });
      }
    });

  }


  exportAsCSV() {


    var postData = {
      "Vendor": this.checkedList,
      "VendorName": this.VendorName,
      "VendorTypeId": this.VendorTypeId,
      "Status": this.Status,
      "IsCSVProcessed": this.IsCSVProcessed,
      "DownloadType": "CSV",
      "VendorCurrencyCode":this.VendorCurrencyCode,
      "VendorLocation":this.VendorLocation
    }
    this.spinner = true;
    this.service.postHttpService(postData, "VendorExportToExcel").subscribe(response => {
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
    var filename = ('Vendor ' + currentDate + '.csv')
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
}
