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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import { Customer_Invoice_Status, Invoice_Type } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import { InvoiceViewComponent } from '../../common-template/invoice-view/invoice-view.component';

@Component({
  selector: 'app-grid-invoice-list',
  templateUrl: './grid-invoice-list.component.html',
  styleUrls: ['./grid-invoice-list.component.scss']
})
export class GridInvoiceListComponent implements OnInit {
  baseUrl = `${environment.api.apiURL}`;
  Currentdate = new Date();
  showSearch: boolean = true;
  //ServerSide List
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  api_check: any;
  dataTable: any;
  dataTableMessage;
  @ViewChild('dataTable', { static: true }) table;
  RRId;

  //Filter
  RRNo;
  InvoiceNo;
  CustomerId;
  CustomerPONo;
  InvoiceType;
  Status;
  InvoiceDateToDate
  InvoiceDateDate;
  DueDateToDate;
  DueDateDate;
  InvoiceDate;
  InvoiceDateTo;
  DueDateTo;
  DueDate;
  InvoiceId: any;
  Customer_Invoice_Status
  DownloadOption
  constructor(private http: HttpClient, public router: Router, public navCtrl: NgxNavigationWithDataComponent,
    private modalService: BsModalService,
    private commonService: CommonService, private cd_ref: ChangeDetectorRef, private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, private datePipe: DatePipe,) { }
  currentRouter = this.router.url;

  ngOnInit(): void {
    this.Customer_Invoice_Status = Customer_Invoice_Status;
    this.DownloadOption = localStorage.getItem("IsRestrictExportReports")

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/CustomerPortal/CustomerInvoiceListByServerSide';
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
      dom: '<"row"<"col-12 col-sm-12 col-md-12 col-xl-12"B> <"col-12 col-sm-12 col-md-12 col-xl-12 aso"f>>rt<" row"<"help-block col-12 col-sm-6 col-md-6 col-xl-6"l><"col-12 col-sm-6 col-md-6 col-xl-6"i><"col-12 col-sm-12 col-md-12 col-xl-12"p>>',
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
            this.InvoiceId = resp.responseData.data[0].InvoiceId;
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
        {
          "targets": [15],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [16],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [17],
          "visible": false,
          "searchable": true
        },


      ],

      createdRow: function (row, data, index) {

        // Set the Quote Type
        var TypeStyle = Invoice_Type.find(a => a.Invoice_TypeId == data.InvoiceType)
        var html = '<span class="badge ' + (TypeStyle ? TypeStyle.cstyle : 'btn-xs"') + '">' + (TypeStyle ? TypeStyle.Invoice_TypeName : '') + '</span>'
        $('td', row).eq(3).html(html);




        // Set the RRNo
        var number = '';
        if (data.RRNo != '' && data.RRNo != '0' && data.RRNo != null) {
          number = data.RRNo;
          var html = `<a href="#/customer/RR-edit?RRId=${data.RRId}" target="_blank" ngbTooltip="View">${number}</a>`;
        } else if (data.MRONo != '' && data.MRONo != '0' && data.MRONo != null) {
          number = data.MRONo;
          var html = `<span ngbTooltip="View">${number}</span>`;
        }

        $('td', row).eq(1).html(html);

        // Set the Status
        var cstyle = '';
        switch (data.Status) {
          case 1: { cstyle = 'badge-warning'; status = "Open"; break; }
          case 2: { cstyle = 'badge-success'; status = "Approved"; break; }
          case 3: { cstyle = 'badge-danger'; status = "Cancelled"; break; }
          case 7: { cstyle = 'badge-primary'; status = "ReOpened"; break; }
          case 8: { cstyle = 'badge-secondary'; status = "On Hold"; break; }

          default: { cstyle = ''; break; }
        }
        var html = '<span class="badge ' + cstyle + ' btn-xs">' + status + '</span>';
        $('td', row).eq(6).html(html);


        //Set Grand Total
        var symbol = "$ "
        var html = '<span>' + data.CurrencySymbol + ' ' + data.GrandTotal + '</span>'
        $('td', row).eq(4).html(html);


        var html = '<a href="#" class="actionViewInvoice" ngbTooltip="View">' + data.InvoiceNo + '</a>';
        $('td', row).eq(0).html(html);
      },
      columns: [

        {
          data: 'InvoiceNo', name: 'InvoiceNo', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            return '<a  ngbTooltip="View">' + row.InvoiceNo + '</a>';

          }

        },
        {
          data: 'RRNo', name: 'RRNo', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (data.RRNo != '') {
              return '<a href="#" class="actionViewRR" ngbTooltip="View">' + row.RRNo + '</a>';
            }
          }
        },
        { data: 'CompanyName', name: 'CompanyName', orderable: true, searchable: true, },
        { data: 'InvoiceType', name: 'InvoiceType', orderable: true, searchable: true, },
        { data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true, },
        { data: 'InvoiceDate', name: 'InvoiceDate', orderable: true, searchable: true, },
        { data: 'Status', name: 'Status', orderable: true, searchable: true, },
        { data: 'CustomerPONo', name: 'CustomerPONo', orderable: true, searchable: true, },
        { data: 'InvoiceDateTo', name: 'InvoiceDateTo', orderable: true, searchable: true, },
        { data: 'DueDate', name: 'DueDate', orderable: true, searchable: true, },
        { data: 'DueDateTo', name: 'DueDateTo', orderable: true, searchable: true, },
        { data: 'CustomerId', name: 'CustomerId', orderable: true, searchable: true, },
        { data: 'IsCSVProcessed', name: 'IsCSVProcessed', orderable: true, searchable: true, },
        { data: 'RRId', name: 'RRId', orderable: true, searchable: true, },
        { data: 'CustomerInvoiceApproved', name: 'CustomerInvoiceApproved', orderable: true, searchable: true, },
        { data: 'VendorBillApproved', name: 'VendorBillApproved', orderable: true, searchable: true, },

        {
          data: 'InvoiceId', name: 'InvoiceId', defaultContent: '', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            if (row.IsDeleted == 0) {

              actiontext += `<a href="#" class="fa fa-eye text-secondary actionView" ngbTooltip="View"></a>&nbsp;`;

              actiontext += `<a href="#" class="fa fa-edit text-secondary actionView1" ngbTooltip="Edit"></a> &nbsp;`;

              actiontext += `<a href="#" class="fa fa-trash text-danger actionView3" ngbTooltip="Delete"></a>`;

            }
            else {
              {
                actiontext += `<a href="#" class="fa fa-eye text-secondary actionDeleteView" ngbTooltip="View"></a>&nbsp;`;
              }
            }
            return actiontext;
          }
        },
        { data: 'IsDeleted', name: 'IsDeleted', orderable: true, searchable: true, },


      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.actionViewRR', row).unbind('click');
        $('.actionViewRR', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.navCtrl.navigate('customer/RR-edit', { RRId: data.RRId });

        });
        $('.checkbox', row).unbind('click');
        $('.checkbox', row).bind('click', (e) => {
        });
        $('.actionViewInvoice', row).unbind('click');
        $('.actionViewInvoice', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['customer/invoice-view'], { state: { InvoiceId: data.InvoiceId, IsDeleted: data.IsDeleted } });

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

    this.dataTable = $('#datatable-angular');
    this.dataTable.DataTable(this.dtOptions);
  }
  loadTemplate(arg0: string, InvoiceId: any) {
    throw new Error('Method not implemented.');
  }



  EnableSearch() {
    this.showSearch = true;
  }



  InvoiceDateToFormat(InvoiceDateTo) {
    const InvoiceDateToYears = InvoiceDateTo.year;
    const InvoiceDateToDates = InvoiceDateTo.day;
    const InvoiceDateTomonths = InvoiceDateTo.month;
    let InvoiceDateToDate = new Date(InvoiceDateToYears, InvoiceDateTomonths - 1, InvoiceDateToDates);
    this.InvoiceDateToDate = moment(InvoiceDateToDate).format('YYYY-MM-DD');
  }
  InvoiceDateFormat(InvoiceDate) {
    const InvoiceDateYears = InvoiceDate.year;
    const InvoiceDateDates = InvoiceDate.day;
    const InvoiceDatemonths = InvoiceDate.month;
    let InvoiceDateDate = new Date(InvoiceDateYears, InvoiceDatemonths - 1, InvoiceDateDates);
    this.InvoiceDateDate = moment(InvoiceDateDate).format('YYYY-MM-DD')
  }


  DueDateToFormat(DueDateTo) {
    const DueDateToYears = DueDateTo.year;
    const DueDateToDates = DueDateTo.day;
    const DueDateTomonths = DueDateTo.month;
    let DueDateToDate = new Date(DueDateToYears, DueDateTomonths - 1, DueDateToDates);
    this.DueDateToDate = moment(DueDateToDate).format('YYYY-MM-DD');
  }
  DueDateFormat(DueDate) {
    const DueDateYears = DueDate.year;
    const DueDateDates = DueDate.day;
    const DueDatemonths = DueDate.month;
    let DueDateDate = new Date(DueDateYears, DueDatemonths - 1, DueDateDates);
    this.DueDateDate = moment(DueDateDate).format('YYYY-MM-DD')
  }
  onFilter(event) {
    let obj = this
    var table = $('#datatable-angular').DataTable();
    table.columns(1).search(this.RRNo);
    table.columns(6).search(this.Status);
    table.columns(5).search(this.InvoiceDateDate);
    table.columns(8).search(this.InvoiceDateToDate);
    table.columns(0).search(this.InvoiceNo);
    table.columns(7).search(this.CustomerPONo);
    table.columns(9).search(this.DueDateDate);
    table.columns(10).search(this.DueDateToDate);
    table.columns(11).search(this.CustomerId)
    table.columns(3).search(this.InvoiceType)

    table.draw();
    this.showSearch = false;

  }
  onClear(event) {
    var table = $('#datatable-angular').DataTable();
    this.RRNo = '';
    this.Status = '';
    this.InvoiceDate = "";
    this.InvoiceDateTo = "";
    this.InvoiceDateDate = '';
    this.InvoiceNo = "";
    this.CustomerId = "";
    this.InvoiceDateToDate = "";
    this.CustomerPONo = "";
    this.DueDateDate = "";
    this.DueDate = "";
    this.DueDateTo = "";
    this.DueDateToDate = "";
    this.InvoiceType = "";
    table.columns(1).search(this.RRNo);
    table.columns(6).search(this.Status);
    table.columns(5).search(this.InvoiceDateDate);
    table.columns(8).search(this.InvoiceDateToDate);
    table.columns(0).search(this.InvoiceNo);
    table.columns(7).search(this.CustomerPONo);
    table.columns(9).search(this.DueDateDate);
    table.columns(10).search(this.DueDateToDate);
    table.columns(11).search(this.CustomerId)
    table.columns(3).search(this.InvoiceType)
    table.draw();
    this.showSearch = false;

    this.InvoiceType = undefined;
    this.Status = undefined;

    this.reLoad();
  }



  reLoad() {
    this.router.navigate([this.currentRouter])
  }



























}
