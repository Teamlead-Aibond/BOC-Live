/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { Invoice_Status, Invoice_Type, Vendor_Bill_Status } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vendor-portal-vendorbill-list',
  templateUrl: './vendor-portal-vendorbill-list.component.html',
  styleUrls: ['./vendor-portal-vendorbill-list.component.scss']
})
export class VendorPortalVendorbillListComponent implements OnInit {
  //ServerSide List
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  api_check: any;
  dataTable: any;
  //Filter
  RRNo;
  VendorInvoiceNo;
  CustomerId;
  PONo;
  VendorInvoiceType = '';
  Status = '';
  InvoiceDateToDate
  InvoiceDateDate;
  DueDateToDate;
  DueDateDate;
  InvoiceDate;
  InvoiceDateTo;
  DueDateTo;
  DueDate;
  VendorId
  PartItem: any = []
  VendorInvoiceList: any = [];
  NotesList: any = [];
  ResponseMessage;
  partList;
  Invoice_Status
  DownloadOption
  constructor(private httpClient: HttpClient, public router: Router, private http: HttpClient, public navCtrl: NgxNavigationWithDataComponent,
    private cd_ref: ChangeDetectorRef, public service: CommonService,
    private datePipe: DatePipe,) { }
  currentRouter = this.router.url;

  ngOnInit(): void {
    this.Invoice_Status = Invoice_Status;
    this.DownloadOption = localStorage.getItem("IsRestrictExportReports")
    this.onList()
  }



  onList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/VendorPortal/VendorInvoiceListByServerSide';
    const that = this;
    var filterData = {}
    if (that.DownloadOption==0) {
      var buttons = {}
      buttons = {
        dom: {
          button: {
            className: ''
          }
        },
        buttons: [
          // {
          //   extend: 'colvis',
          //   className: 'btn btn-xs btn-primary',
          //   text: 'COLUMNS'
          // },
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
      dom: '<"row"<"col-12 col-sm-12 col-md-12 col-xl-12"B> <"col-12 col-sm-12 col-md-12 col-xl-12 aso"f>>rt<" row"<"help-block col-12 mt-1 col-sm-3 col-md-3 col-xl-3"l><"col-12 col-sm-4 col-md-4 col-xl-4"i><"col-12 mt-1 col-sm-5 col-md-5 col-xl-5"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      serverSide: true,
      searching: true,

      retrieve: true,
      order: [[0, 'desc']],
      serverMethod: 'post',
      ajax: (dataTablesParameters: any, callback) => {
        that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

        that.api_check = that.http.post<any>(url,
          Object.assign(dataTablesParameters,
            filterData
          ), httpOptions).subscribe(resp => {
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
          "targets": [8],
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
        // Set the RRNo
        var number = '';
        if (data.RRNo != '' && data.RRNo != '0' && data.RRNo != null) {
          number = data.RRNo;
          var html = `<a href="#/vendor/RR-edit?RRId=${data.RRId}" target="_blank"  data-toggle='tooltip' title='RR View' data-placement='top'>${number}</a>`;
        } else if (data.MRONo != '' && data.MRONo != '0' && data.MRONo != null) {
          number = data.MRONo;
          var html = `<span ngbTooltip="View">${number}</span>`;
        }
        $('td', row).eq(1).html(html);


        var TypeStyle = Invoice_Type.find(a => a.Invoice_TypeId == data.VendorInvoiceType)
        var html = '<span class="badge ' + (TypeStyle ? TypeStyle.cstyle : 'btn-xs"') + '">' + (TypeStyle ? TypeStyle.Invoice_TypeName : '') + '</span>'
        $('td', row).eq(5).html(html);

        // Set the Status
        var cstyle = '';
        var statusObj = Vendor_Bill_Status.find(a => a.Invoice_StatusId == data.Status)
        var html = '<span  class="badge ' + (statusObj ? statusObj.cstyle : '') + ' btn-xs">' + (statusObj ? statusObj.Invoice_StatusName : '') + '</span>'
        $('td', row).eq(3).html(html);


        //Set Grand Total
        var symbol = "$ "
        var html = '<span>' + data.CurrencySymbol + ' ' + data.GrandTotal + '</span>'
        $('td', row).eq(4).html(html);

      },
      columns: [

        {
          data: 'VendorInvoiceNo', name: 'VendorInvoiceNo', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            actiontext += `<a href="#/vendor/vendor-bill-view?VendorInvoiceId=${row.VendorInvoiceId}" target="_blank"  data-toggle='tooltip' title='PO View' data-placement='top'>${row.PONo}</a>`;
            return actiontext;
          }
        },
        { data: 'RRNo', name: 'RRNo', orderable: true, searchable: true, },
        { data: 'PONo', name: 'PONo', orderable: true, searchable: true, },
        { data: 'Status', name: 'Status', orderable: true, searchable: true, },
        { data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true, },
        { data: 'VendorInvoiceType', name: 'VendorInvoiceType', orderable: true, searchable: true, },
        { data: 'InvoiceDate', name: 'InvoiceDate', orderable: true, searchable: true, },
        { data: 'DueDate', name: 'DueDate', orderable: true, searchable: true, },
        { data: 'InvoiceDateTo', name: 'InvoiceDateTo', orderable: true, searchable: true, },
        { data: 'DueDateTo', name: 'DueDateTo', orderable: true, searchable: true, },
        {
          data: 'VendorInvoiceId', name: 'VendorInvoiceId', orderable: true, searchable: true,

          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            actiontext += `<a  href="#/vendor/vendor-bill-view?VendorInvoiceId=${row.VendorInvoiceId}" target="_blank" class="fa fa-eye text-secondary" data-toggle='tooltip' title='Vendor Bill View' data-placement='top'></a>&nbsp;`;
            return actiontext;
          }
        },


      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {


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

    this.dataTable = $('#datatable-angular');
    this.dataTable.DataTable(this.dtOptions);
  }
  InvoiceDateToFormat(InvoiceDateTo) {
    if (InvoiceDateTo != null) {
      const InvoiceDateToYears = InvoiceDateTo.year;
      const InvoiceDateToDates = InvoiceDateTo.day;
      const InvoiceDateTomonths = InvoiceDateTo.month;
      let InvoiceDateToDate = new Date(InvoiceDateToYears, InvoiceDateTomonths - 1, InvoiceDateToDates);
      this.InvoiceDateToDate = moment(InvoiceDateToDate).format('YYYY-MM-DD');
    } else {
      this.InvoiceDateToDate = ''
    }
  }
  InvoiceDateFormat(InvoiceDate) {
    if (InvoiceDate != null) {
      const InvoiceDateYears = InvoiceDate.year;
      const InvoiceDateDates = InvoiceDate.day;
      const InvoiceDatemonths = InvoiceDate.month;
      let InvoiceDateDate = new Date(InvoiceDateYears, InvoiceDatemonths - 1, InvoiceDateDates);
      this.InvoiceDateDate = moment(InvoiceDateDate).format('YYYY-MM-DD')
    } else {
      this.InvoiceDateDate = ''
    }
  }
  DueDateToFormat(DueDateTo) {
    if (DueDateTo != null) {

      const DueDateToYears = DueDateTo.year;
      const DueDateToDates = DueDateTo.day;
      const DueDateTomonths = DueDateTo.month;
      let DueDateToDate = new Date(DueDateToYears, DueDateTomonths - 1, DueDateToDates);
      this.DueDateToDate = moment(DueDateToDate).format('YYYY-MM-DD');
    } else {
      this.DueDateToDate = ''
    }
  }
  DueDateFormat(DueDate) {
    if (DueDate != null) {

      const DueDateYears = DueDate.year;
      const DueDateDates = DueDate.day;
      const DueDatemonths = DueDate.month;
      let DueDateDate = new Date(DueDateYears, DueDatemonths - 1, DueDateDates);
      this.DueDateDate = moment(DueDateDate).format('YYYY-MM-DD')
    } else {
      this.DueDateDate = ''
    }
  }
  onFilter(event) {
    let obj = this
    var table = $('#datatable-angular').DataTable();
    table.columns(1).search(this.RRNo);
    table.columns(3).search(this.Status);
    table.columns(6).search(this.InvoiceDateDate);
    table.columns(8).search(this.InvoiceDateToDate);
    table.columns(0).search(this.VendorInvoiceNo);
    table.columns(2).search(this.PONo);
    table.columns(7).search(this.DueDateDate);
    table.columns(9).search(this.DueDateToDate);
    table.columns(5).search(this.VendorInvoiceType)
    table.draw();

  }
  onClear(event) {
    var table = $('#datatable-angular').DataTable();
    this.RRNo = '';
    this.Status = '';
    this.InvoiceDate = "";
    this.InvoiceDateTo = "";
    this.InvoiceDateDate = '';
    this.VendorInvoiceNo = "";
    this.InvoiceDateToDate = "";
    this.PONo = "";
    this.DueDateDate = "";
    this.DueDate = "";
    this.DueDateTo = "";
    this.DueDateToDate = "";
    this.VendorInvoiceType = "";
    this.VendorId = ""
    table.columns(1).search(this.RRNo);
    table.columns(3).search(this.Status);
    table.columns(6).search(this.InvoiceDateDate);
    table.columns(8).search(this.InvoiceDateToDate);
    table.columns(0).search(this.VendorInvoiceNo);
    table.columns(2).search(this.PONo);
    table.columns(7).search(this.DueDateDate);
    table.columns(9).search(this.DueDateToDate);
    table.columns(5).search(this.VendorInvoiceType)
    table.draw();
    this.VendorId = null;
    this.VendorInvoiceType = undefined;
    this.Status = undefined;
    this.reLoad();


  }
  reLoad() {
    this.router.navigate([this.currentRouter])
  }
}
