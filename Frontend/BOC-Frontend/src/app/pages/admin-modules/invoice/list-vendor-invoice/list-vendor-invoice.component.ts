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
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { CONST_APPROVE_ACCESS, CONST_COST_HIDE_VALUE, CONST_CREATE_ACCESS, CONST_DELETE_ACCESS, CONST_MODIFY_ACCESS, CONST_VIEW_ACCESS, CONST_VIEW_COST_ACCESS, Invoice_Type, Vendor_Bill_Status } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list-vendor-invoice',
  templateUrl: './list-vendor-invoice.component.html',
  styleUrls: ['./list-vendor-invoice.component.scss']
})
export class ListVendorInvoiceComponent implements OnInit {
  vendorList: any = [];
  baseUrl = `${environment.api.apiURL}`;
  IsDeleted=''
  keywordForVendor = 'VendorName';
  VendorsList: any[];
  VendorName;
  isLoadingVendor: boolean = false;
  keywordForRR = 'RRNo';
  RRList: any[]
  RRId = ''
  isLoadingRR: boolean = false;
  //ServerSide List
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  api_check: any;
  dataTable: any;
  //Filter
  RRNo;
  IsCSVProcessed='';
  VendorInvoiceNo;
  CustomerId;
  PONo;
  VendorInvoiceType='';
  Status='';
  InvoiceDateToDate
  InvoiceDateDate;
  DueDateToDate;
  DueDateDate;
  InvoiceDate;
  InvoiceDateTo;
  DueDateTo;
  DueDate;
  VendorId = ''
  PartItem: any = []
  VendorInvoiceList: any = [];
  POList: any = [];
  checkedList: any = [];
  postData;
  ExcelData;
  CSVData;
  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;
  IsPrintPDFEnabled;
  IsExcelEnabled;
  IsNotesEnabled;
  IsApproveEnabled;
  Invoice_Status;
  CustomerInvoiceApproved='';
  VendorBillApproved='';
  CustomerInvoiceCreated='';

  gridCheckAll: boolean = false;
  VendorBillDataItem:any=[]
  checkedQuoteIds = [];
  uncheckedQuoteIds = [];
  QuoteItem = [];
  rowcheck: boolean = false;
  spinnerxlsx:boolean = false;
  spinnercsv:boolean = false;
  DownloadOptionVBList
  CurrencyList:any=[]
  LocalCurrencyCode
  DifferentCurrency: boolean = false;
  Location=''
  countryList:any=[];
  initLoad: boolean = true;
  constructor(private http: HttpClient, public router: Router, public navCtrl: NgxNavigationWithDataComponent,
    private modalService: NgbModal, private commonService: CommonService, private cd_ref: ChangeDetectorRef,
    private datePipe: DatePipe,) { }

  ngOnInit(): void {
    document.title='Vendor Bill List'
    this.Invoice_Status = Vendor_Bill_Status;
    this.IsDeleted = "0"
    this.LocalCurrencyCode = '';

    this.IsViewEnabled = this.commonService.permissionCheck("ManageVendorBills", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.commonService.permissionCheck("ManageVendorBills", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.commonService.permissionCheck("ManageVendorBills", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.commonService.permissionCheck("ManageVendorBills", CONST_DELETE_ACCESS);
    this.IsViewCostEnabled = this.commonService.permissionCheck("ManageVendorBills", CONST_VIEW_COST_ACCESS);
    this.IsApproveEnabled = this.commonService.permissionCheck("ManageVendorBills", CONST_APPROVE_ACCESS);
    this.IsPrintPDFEnabled = this.commonService.permissionCheck("VBPrintAndPDFExport", CONST_VIEW_ACCESS);
    this.IsExcelEnabled = this.commonService.permissionCheck("VBDownloadExcel", CONST_VIEW_ACCESS);
    this.IsNotesEnabled = this.commonService.permissionCheck("VendorBillNotes", CONST_VIEW_ACCESS);
    this.DownloadOptionVBList = this.commonService.permissionCheck("DownloadOptionVBList", CONST_VIEW_ACCESS);
    this.getList();
  }
  getList(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/VendorInvoice/getVendorInvListByServerSide';
    const that = this;
    var filterData = {};
    if(this.DownloadOptionVBList){
      var buttons={}
      buttons= {
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
    else{
      buttons= {
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
            that.VendorBillDataItem = resp.responseData.data;

            that.VendorBillDataItem.forEach(item => {
              item.checked = this.isQuoteChecked(item.InvoiceId);
            });
            if(this.initLoad){
              this.getVendorList();
              this.getCurrencyList();
              this.getCountryList();
            }
            this.initLoad = false;
            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: that.VendorBillDataItem
            });

          });

      },
      buttons: buttons,
      columnDefs: [
        {
          "orderable": false,
          "className": 'select-checkbox',
          "targets": [0]
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
          "targets": [18],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [19],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [20],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [21],
          "visible": false,
          "searchable": true
        },
      ],
      'select': {
        'style': 'multi'
      },
      createdRow: function (row, data, index) {

        // Set the Quote Type
        var TypeStyle = Invoice_Type.find(a => a.Invoice_TypeId == data.VendorInvoiceType)
        var html = '<span class="badge ' + (TypeStyle ? TypeStyle.cstyle : 'btn-xs"') + '">' + (TypeStyle ? TypeStyle.Invoice_TypeName : '') + '</span>'
        $('td', row).eq(4).html(html);

        var html = `<input type="checkbox" class="checkbox"  ${data.checked ? 'checked' : ''}  (change)="rowCheckBoxChecked($event, ${data.VendorInvoiceId})">`;
        $('td', row).eq(0).html(html);

        // Set the RRNo
        var number = '';
        if (data.RRNo != '' && data.RRNo != '0' && data.RRNo != null) {
          number = data.RRNo;
          var html = `<a href="#/admin/repair-request/edit?RRId=${data.RRId}" target="_blank"  data-toggle='tooltip' title='RR View' data-placement='top'>${number}</a>`;
          $('td', row).eq(2).html(html);
        } else if (data.MRONo != '' && data.MRONo != '0' && data.MRONo != null) {
          number = data.MRONo;
          var html = `<a href="#/admin/mro/edit?MROId=${data.MROId}" target="_blank"  data-toggle='tooltip' title='MRO View' data-placement='top'>${number}</a>`;
          $('td', row).eq(2).html(html);
        }else if (data.QuoteNo != '' && data.QuoteNo != '0' && data.QuoteNo != null) {
          number = data.QuoteNo;
          var html = `<a href="#/admin/sales-quote/list?QuoteId=${data.QuoteId}" target="_blank" data-toggle='tooltip' title='MRO View' data-placement='top'>${number}</a>`;
          $('td', row).eq(2).html(html);
        }

        // Set the Status
        var cstyle = '';
        var statusObj = Vendor_Bill_Status.find(a => a.Invoice_StatusId == data.Status)
        var html = '<span  class="badge ' + (statusObj ? statusObj.cstyle : '') + ' btn-xs">' + (statusObj ? statusObj.Invoice_StatusName : '') + '</span>'
        $('td', row).eq(7).html(html);


        //Set Grand Total
        var html = '<span>' +data.CurrencySymbol+ " " + data.GrandTotal + '</span>'
        $('td', row).eq(5).html(html);

      },
      columns: [
        {
          data: 'VendorInvoiceId', name: 'VendorInvoiceId', defaultContent: '', orderable: false, searchable: true,

        },
        {
          data: 'VendorInvoiceNo', name: 'VendorInvoiceNo', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.IsDeleted == 0) {
              if (this.IsViewEnabled) {
                if(row.IsCSVProcessed==1){

                return `<a href="#/admin/invoice/vendor-invoice-list?VendorInvoiceId=${row.VendorInvoiceId}&IsDeleted=0" target="_blank"  data-toggle='tooltip' title='Vendor Bill View' data-placement='top'>${row.VendorInvoiceNo}&nbsp;<i class="fas fa-check-circle greentick"></i></a>`;
             
             }else{
              return `<a href="#/admin/invoice/vendor-invoice-list?VendorInvoiceId=${row.VendorInvoiceId}" target="_blank"  data-toggle='tooltip' title='Vendor Bill View' data-placement='top'>${row.VendorInvoiceNo}</a>`;

             } 
            } else {
                return '<a  ngbTooltip="View">' + row.VendorInvoiceNo + '</a>';
              }
            }
            if (this.IsViewEnabled) {
              return `<a  href="#/admin/invoice/vendor-invoice-list?VendorInvoiceId=${row.VendorInvoiceId}&IsDeleted=1" target="_blank" data-toggle='tooltip' title='Vendor Bill View' data-placement='top'>${row.VendorInvoiceNo}</a>`;
            } else {
              return '<a  ngbTooltip="View">' + row.VendorInvoiceNo + '</a>';
            }
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

        { data: 'VendorName', name: 'VendorName', orderable: true, searchable: true, },
        { data: 'VendorInvoiceType', name: 'VendorInvoiceType', orderable: true, searchable: true, },
        { data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true, },
        { data: 'InvoiceDate', name: 'InvoiceDate', orderable: true, searchable: true, },
        { data: 'Status', name: 'Status', orderable: true, searchable: true, },
        { data: 'PONo', name: 'PONo', orderable: true, searchable: true, },
        { data: 'InvoiceDateTo', name: 'InvoiceDateTo', orderable: true, searchable: true, },
        { data: 'DueDate', name: 'DueDate', orderable: true, searchable: true, },
        { data: 'DueDateTo', name: 'DueDateTo', orderable: true, searchable: true, },
        { data: 'VendorId', name: 'VendorId', orderable: true, searchable: true, },
        { data: 'IsCSVProcessed', name: 'IsCSVProcessed', orderable: true, searchable: true, },
        { data: 'RRId', name: 'RRId', orderable: true, searchable: true, },
        { data: 'CustomerInvoiceApproved', name: 'CustomerInvoiceApproved', orderable: true, searchable: true, },
        { data: 'VendorBillApproved', name: 'VendorBillApproved', orderable: true, searchable: true, },

        {
          data: 'VendorInvoiceId', name: 'VendorInvoiceId', defaultContent: '', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            if (row.IsDeleted == 0) {
              if (this.IsViewEnabled) {
                actiontext += `<a  href="#/admin/invoice/vendor-invoice-list?VendorInvoiceId=${row.VendorInvoiceId}&IsDeleted=0" target="_blank" class="fa fa-eye text-secondary" data-toggle='tooltip' title='Vendor Bill View' data-placement='top'></a>&nbsp;`;
              }
              if (this.IsEditEnabled) {
                actiontext += `<a href="#/admin/invoice/vendor-invoice-edit?VendorInvoiceId=${row.VendorInvoiceId}" target="_blank" class="fa fa-edit text-secondary" data-toggle='tooltip' title='Vendor Bill Edit' data-placement='top'></a> &nbsp;`;
              }
              if (this.IsDeleteEnabled) {
                actiontext += `<a href="#" class="fa fa-trash text-danger actionView3" data-toggle='tooltip' title='Vendor Bill Delete' data-placement='top'></a>`;
              }
            }
            else {
              if (this.IsViewEnabled) {
                actiontext += `<a href="#/admin/invoice/vendor-invoice-list?VendorInvoiceId=${row.VendorInvoiceId}&IsDeleted=1" target="_blank" class="fa fa-eye text-secondary" data-toggle='tooltip' title='Vendor Bill View' data-placement='top'></a>&nbsp;`;
              }
            }
            return actiontext;
          }
        },
        { data: 'IsDeleted', name: 'IsDeleted', orderable: true, searchable: true, },
        { data: 'CustomerInvoiceCreated', name: 'CustomerInvoiceCreated', orderable: true, searchable: true, },
        { data: 'LocalCurrencyCode', name: 'LocalCurrencyCode', orderable: true, searchable: true, },
        { data: 'CreatedByLocation', name: 'CreatedByLocation', orderable: true, searchable: true, },

      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {

        $('.actionView', row).unbind('click');
        $('.actionView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['admin/invoice/vendor-invoice-list'], { state: { VendorInvoiceId: data.VendorInvoiceId, showList: true } });
        });


        $('.actionDeleteView', row).unbind('click');
        $('.actionDeleteView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['admin/invoice/vendor-invoice-list'], { state: { VendorInvoiceId: data.VendorInvoiceId, showList: true, IsDeleted: data.IsDeleted } });
        });
        $('.actionViewRR', row).unbind('click');
        $('.actionViewRR', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (data.RRNo != '' && data.RRNo != '0' && data.RRNo != null) {
            this.router.navigate(['admin/repair-request/edit'], { state: { RRId: data.RRId } });
          } else if (data.MRONo != '' && data.MRONo != '0' && data.MRONo != null) {
            this.router.navigate(['admin/mro/edit'], { state: { MROId: data.MROId } });
          }
        });

        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.navCtrl.navigate('admin/invoice/vendor-invoice-edit', { VendorInvoiceId: data.VendorInvoiceId });
        });

        $('.actionView3', row).unbind('click');
        $('.actionView3', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDelete(data.VendorInvoiceId);
        });


        $('.checkbox', row).unbind('click');
        $('.checkbox', row).bind('click', (e) => {
          // this.onExcelData(data.VendorInvoiceId)
          this.rowCheckBoxChecked(e,data.VendorInvoiceId,data.RRNo, data.MRONo,data.LocalCurrencyCode)

        });

        return row;
      },
      "preDrawCallback": function () {
        $('#datatable-vinvoice_processing').attr('style', 'display: block; z-index: 10000 !important');

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

    this.dataTable = $('#datatable-vinvoice');
    this.dataTable.DataTable(this.dtOptions);

    this.onFilter(null)
  }
  getCountryList() {
    this.commonService.getconutryList().subscribe(response => {
      if (response.status == true) {
        this.countryList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  getCurrencyList() {
    this.commonService.getHttpService('Currencyddl').subscribe(response => {
      if (response.status == true) {
        this.CurrencyList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  private isQuoteChecked(VendorInvoiceId) {
    this.checkedList = [];
    if (!this.gridCheckAll) {
      return this.checkedQuoteIds.indexOf(VendorInvoiceId) >= 0 ? true : false;
    } else {
      this.VendorBillDataItem.map(a => a.checked = true);
      this.checkedList = this.VendorBillDataItem.map(a => { return { VendorInvoiceId: a.VendorInvoiceId,LocalCurrencyCode:a.LocalCurrencyCode } });
      return this.uncheckedQuoteIds.indexOf(VendorInvoiceId) >= 0 ? false : true;
    }
  }
  gridAllRowsCheckBoxChecked(e) {
    this.DifferentCurrency = false
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
      this.VendorBillDataItem.map(a => a.checked = true);
      this.checkedList = this.VendorBillDataItem.map(a => { return { VendorInvoiceId: a.VendorInvoiceId,LocalCurrencyCode:a.LocalCurrencyCode } });

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
      this.VendorBillDataItem.map(a => a.checked = false);
      // this.QuoteList = [];
      this.checkedList = [];
    }
    $('#datatable-vinvoice').DataTable().ajax.reload();
  }

  rowCheckBoxChecked(e, VendorInvoiceId, RRNo, MRONo,LocalCurrencyCode) {
    this.DifferentCurrency = false
    if (e.target.checked) {
      this.checkedList.push({ VendorInvoiceId,LocalCurrencyCode });

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
      this.checkedList = this.checkedList.filter(a => a.VendorInvoiceId != VendorInvoiceId);
      // this.QuoteList = this.QuoteList.filter(a => a.QuoteId != QuoteId);
    }
  }

  onDelete(VendorInvoiceId) {
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
          VendorInvoiceId: VendorInvoiceId,
        }
        this.commonService.postHttpService(postData, 'DeleteVendorInvoice').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Vendor Bill has been deleted.',
              type: 'success'
            });
            var table = $('#datatable-vinvoice').DataTable();
            table.draw();
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Vendor Bill is safe:)',
          type: 'error'
        });
      }
    });

  }

  getVendorList() {
    this.commonService.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
    });
  }

  InvoiceDateToFormat(InvoiceDateTo) {
    if(InvoiceDateTo!=null){
    const InvoiceDateToYears = InvoiceDateTo.year;
    const InvoiceDateToDates = InvoiceDateTo.day;
    const InvoiceDateTomonths = InvoiceDateTo.month;
    let InvoiceDateToDate = new Date(InvoiceDateToYears, InvoiceDateTomonths - 1, InvoiceDateToDates);
    this.InvoiceDateToDate = moment(InvoiceDateToDate).format('YYYY-MM-DD');
    }
    else{
      this.InvoiceDateToDate = ''
    }
  }
  InvoiceDateFormat(InvoiceDate) {
    if(InvoiceDate!=null){
    const InvoiceDateYears = InvoiceDate.year;
    const InvoiceDateDates = InvoiceDate.day;
    const InvoiceDatemonths = InvoiceDate.month;
    let InvoiceDateDate = new Date(InvoiceDateYears, InvoiceDatemonths - 1, InvoiceDateDates);
    this.InvoiceDateDate = moment(InvoiceDateDate).format('YYYY-MM-DD')
    }else{
      this.InvoiceDateDate = ''
    }
  }


  DueDateToFormat(DueDateTo) {
    if(DueDateTo!=null){
    const DueDateToYears = DueDateTo.year;
    const DueDateToDates = DueDateTo.day;
    const DueDateTomonths = DueDateTo.month;
    let DueDateToDate = new Date(DueDateToYears, DueDateTomonths - 1, DueDateToDates);
    this.DueDateToDate = moment(DueDateToDate).format('YYYY-MM-DD');
    }else{
      this.DueDateToDate = ''
    }
  }
  DueDateFormat(DueDate) {
    if(DueDate!=null){
    const DueDateYears = DueDate.year;
    const DueDateDates = DueDate.day;
    const DueDatemonths = DueDate.month;
    let DueDateDate = new Date(DueDateYears, DueDatemonths - 1, DueDateDates);
    this.DueDateDate = moment(DueDateDate).format('YYYY-MM-DD')
    }else{ 
      this.DueDateDate = ''
    }
  }
  onFilter(event) {
    var vendorid = ""
    var vendorName = ""
    if (this.VendorId == '') {
      vendorid = ""
      vendorName = this.VendorName
    }
    else if (this.VendorId != "") {
      vendorid = this.VendorId
      vendorName = ''
    }
    var rrid = ""
    var RRNo = ""
    if (this.RRId == '' || this.RRId == undefined || this.RRId == null) {
      rrid = ""
      RRNo = this.RRNo
    }
    else if (this.RRId != "") {
      rrid = this.RRId
      RRNo = ''
    }
    let obj = this
    var table = $('#datatable-vinvoice').DataTable();
    table.columns(2).search(RRNo);
    table.columns(3).search(vendorName);
    table.columns(7).search(this.Status);
    table.columns(6).search(this.InvoiceDateDate);
    table.columns(9).search(this.InvoiceDateToDate);
    table.columns(1).search(this.VendorInvoiceNo);
    table.columns(8).search(this.PONo);
    table.columns(10).search(this.DueDateDate);
    table.columns(11).search(this.DueDateToDate);
    table.columns(12).search(vendorid)
    table.columns(4).search(this.VendorInvoiceType)
    table.columns(13).search(this.IsCSVProcessed)
    table.columns(14).search(rrid)
    table.columns(15).search(this.CustomerInvoiceApproved)
    table.columns(16).search(this.VendorBillApproved)
    table.columns(18).search(this.IsDeleted)
    table.columns(19).search(this.CustomerInvoiceCreated)
    table.columns(20).search(this.LocalCurrencyCode)
    table.columns(21).search(this.Location)

    table.draw();

  }
  onClear(event) {
    var table = $('#datatable-vinvoice').DataTable();
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
    this.IsCSVProcessed = ""
    this.checkedList = []
    var vendorid = ""
    var vendorName = "";
    var rrid = ""
    var RRNo = "";
    this.RRNo = '';
    this.VendorName = ''
    this.CustomerInvoiceApproved = "";
    this.VendorBillApproved = ""
    this.IsDeleted = ""
    this.CustomerInvoiceCreated = ""
    this.LocalCurrencyCode = ''
    this.Location = ''
    this.RRId = ''
    table.columns(2).search(RRNo);
    table.columns(3).search(vendorName);
    table.columns(7).search(this.Status);
    table.columns(6).search(this.InvoiceDateDate);
    table.columns(9).search(this.InvoiceDateToDate);
    table.columns(1).search(this.VendorInvoiceNo);
    table.columns(8).search(this.PONo);
    table.columns(10).search(this.DueDateDate);
    table.columns(11).search(this.DueDateToDate);
    table.columns(12).search(vendorid)
    table.columns(4).search(this.VendorInvoiceType)
    table.columns(13).search(this.IsCSVProcessed)
    table.columns(14).search(rrid)
    table.columns(15).search(this.CustomerInvoiceApproved)
    table.columns(16).search(this.VendorBillApproved);
    table.columns(18).search(this.IsDeleted)
    table.columns(19).search(this.CustomerInvoiceCreated)
    table.columns(20).search(this.LocalCurrencyCode)
    table.columns(21).search(this.Location)
    table.draw();


  }

  onExcelData(VendorInvoiceId) {
    this.checkedList.push({
      VendorInvoiceId
    })
  }

  exportAsXLSX() {

    if(this.LocalCurrencyCode!=''){
      if(this.checkedList.length>0){
        for(var i =0 ; i<this.checkedList.length;i++){
          if(this.checkedList[i].LocalCurrencyCode!=this.checkedList[0].LocalCurrencyCode){
             this.DifferentCurrency = true
          }else{
            
          }
        }
      }
    if(!this.DifferentCurrency){
    this.postData = {
      "VendorInvoice": this.checkedList,
      "RRNo": this.RRNo,
      "VendorInvoiceNo": this.VendorInvoiceNo,
      "VendorId": this.VendorId,
      "PONo": this.PONo,
      "InvoiceDate": this.InvoiceDateDate,
      "InvoiceDateTo": this.InvoiceDateToDate,
      "DueDate": this.DueDateDate,
      "DueDateTo": this.DueDateToDate,
      "VendorInvoiceType": this.VendorInvoiceType,
      "Status": this.Status,
      "IsCSVProcessed": this.IsCSVProcessed,
      "DownloadType": "Excel",
      "CustomerInvoiceCreated":this.CustomerInvoiceCreated,
      "LocalCurrencyCode":this.LocalCurrencyCode,
      "CreatedByLocation":this.Location
    }
    this.spinnerxlsx = true;
    this.commonService.postHttpService(this.postData, "VendorInvoiceExcelData").subscribe(response => {
      if (response.status == true) {
        this.ExcelData = response.responseData.ExcelData;
        this.generateExcelFormat();
        this.spinnerxlsx = false;

        Swal.fire({
          title: 'Success!',
          text: 'Excel downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        this.spinnerxlsx = false;
        Swal.fire({
          title: 'Error!',
          text: response.message,
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }else{
    Swal.fire({
      type: 'info',
      title: 'Message',
      text: 'Different currency not able to download the file',
      confirmButtonClass: 'btn btn-confirm mt-2',
    });
  }
  }else{
    Swal.fire({
      type: 'info',
      title: 'Message',
      text: 'Please Choose the Currency for Download Option',
      confirmButtonClass: 'btn btn-confirm mt-2',
    });
  }

  }

  exportAsCSV() {

    if(this.LocalCurrencyCode!=''){
      if(this.checkedList.length>0){
        for(var i =0 ; i<this.checkedList.length;i++){
          if(this.checkedList[i].LocalCurrencyCode!=this.checkedList[0].LocalCurrencyCode){
             this.DifferentCurrency = true
          }else{
            
          }
        }
      }
    if(!this.DifferentCurrency){
    this.postData = {
      "VendorInvoice": this.checkedList,
      "RRNo": this.RRNo,
      "VendorInvoiceNo": this.VendorInvoiceNo,
      "VendorId": this.VendorId,
      "PONo": this.PONo,
      "InvoiceDate": this.InvoiceDateDate,
      "InvoiceDateTo": this.InvoiceDateToDate,
      "DueDate": this.DueDateDate,
      "DueDateTo": this.DueDateToDate,
      "VendorInvoiceType": this.VendorInvoiceType,
      "Status": this.Status,
      "IsCSVProcessed": this.IsCSVProcessed,
      "DownloadType": "CSV",
      "CustomerInvoiceCreated":this.CustomerInvoiceCreated,
      "LocalCurrencyCode":this.LocalCurrencyCode,
      "CreatedByLocation":this.Location
    }
    this.spinnercsv = true;
    this.commonService.postHttpService(this.postData, "VendorInvoiceExcelData").subscribe(response => {
      if (response.status == true) {
        this.CSVData = response.responseData.ExcelData;
        this.generateCSVFormat();
        this.spinnercsv = false;
        Swal.fire({
          title: 'Success!',
          text: 'CSV downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        this.spinnercsv = false;
        Swal.fire({
          title: 'Error!',
          text: response.message,
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }else{
    Swal.fire({
      type: 'info',
      title: 'Message',
      text: 'Different currency not able to download the file',
      confirmButtonClass: 'btn btn-confirm mt-2',
    });
  }
  }else{
    Swal.fire({
      type: 'info',
      title: 'Message',
      text: 'Please Choose the Currency for Download Option',
      confirmButtonClass: 'btn btn-confirm mt-2',
    });
  }

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
    var filename = ('Vendor Bill ' + currentDate + '.csv')
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


  generateExcelFormat() {
    var data = []
    var jsonData = this.ExcelData
    for (var i = 0; i < jsonData.length; i++) {
      var obj = jsonData[i];
      // delete jsonData[i].VendorId;

      var temparray = [];
      for (var key in obj) {
        var value = obj[key];
        temparray.push(value);
      }
      data.push(temparray);
    }

    //Excel Title, Header, Data
    const title = 'Vendor Bill';
   // const header = ["Vendor Code", "Vendor Invoice No", "Apply to Invoice Number", "Credit Memo", "Date", "Drop ship", "Customer SO #", "Waiting On Bill", "Customer ID", "Customer Invoice #", "Ship To Name", "Ship to Address-Line One", "Ship to Address-Line Two", "Ship to City", "Ship To State", "Ship to Zipcode", "Ship To Country", "Due Date", "Discount Date", "Discount Amount", "Accounts Payable Account", "Ship Via", "P.O. Note", "Note Prints After Line Items", "Beginning Balance Transaction", "Applied To Purchase Order", "Number Of Distributions", "Invoice/CM Distribution", "Apply to Invoice Distribution", "PO Number", "PO Distribution", 'Quantity', "Stocking Quantity", "Item ID", "Serial Number", "U/M ID", "U/M No. of Stocking Units", "Description", "G/L Account", "Unit Price", "Stocking Unit Price", "UPC / SKU", "Weight", "Amount", "Job ID", "Used for Reimbursable Expense", "Displayed Terms", "Return Authorization", "Row Type", "Recur Number", "Recur Frequency"]
    const header = ["VendorCode", "VendorInvNo", "ApplyToInvoiceNumber", "Credit Memo", "Date", "Dropship", "CustomerSO", "WaitingOnBill", "CustomerId", "CustomerInvoice", "ShipToName", "ShipToAddressLineOne", "ShipToAddressLineTwo", "ShipToCity", "ShipToState", "ShipToZipCode", "ShipToCountry", "DueDate", "DisCountDate", "DisCountAmount", "AccountsPayableAccount", "ShipVia", "PONote", "NotePrintsAfterLineItems", "BeginningBalanceTransaction", "AppliedToPurchaseOrder", "NumberOfDistributions", "InvoiceCMDistribution", "ApplytoInvoiceDistribution", "PONo", "PODistribution", 'Quantity', "StockingQuantity", "ItemID", "SerialNumber", "UMID", "UMNoOfStockingUnits","Description", "GLAccount", "UnitPrice", "StockingUnitPrice", "UPCSKU", "Weight", "Amount", "JobId", "UsedForReimbursableExpense", "DisplayedTerms", "ReturnAuthorization", "RowType", "RecurNumber", "RecurFrequency"]

    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Data');
    // //Add Row and formatting
    // let titleRow = worksheet.addRow([title]);
    // titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true }
    // worksheet.addRow([]);
    // let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')])
    // // //Add Image
    // // let logo = workbook.addImage({
    // //   filename: 'assets/images/ah_logo.png', 
    // //    extension: 'png',
    // // });
    // // worksheet.addImage(logo, 'E1:F3');
    // worksheet.mergeCells('A1:B2');
    // //Blank Row 
    // worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.font = { bold: true }

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);
    }
    );
    worksheet.getColumn(1).width = 35;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 30;
    worksheet.getColumn(12).width = 30;
    worksheet.getColumn(13).width = 15;
    worksheet.getColumn(14).width = 15;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 20;
    worksheet.getColumn(17).width = 20;
    worksheet.getColumn(18).width = 20;
    worksheet.getColumn(19).width = 20;
    worksheet.getColumn(20).width = 25;
    worksheet.getColumn(21).width = 15;
    worksheet.getColumn(22).width = 15;
    worksheet.getColumn(23).width = 25;
    worksheet.getColumn(24).width = 25;
    worksheet.getColumn(25).width = 25;
    worksheet.getColumn(26).width = 25;
    worksheet.getColumn(27).width = 25;
    worksheet.getColumn(28).width = 15;
    worksheet.getColumn(29).width = 20;
    worksheet.getColumn(30).width = 20;
    worksheet.getColumn(31).width = 20;
    worksheet.getColumn(32).width = 20;
    worksheet.getColumn(33).width = 20;
    worksheet.getColumn(34).width = 20;
    worksheet.getColumn(35).width = 25;
    worksheet.getColumn(36).width = 30;
    worksheet.getColumn(37).width = 20;
    worksheet.getColumn(38).width = 40;
    worksheet.getColumn(39).width = 20;
    worksheet.getColumn(40).width = 20;
    worksheet.getColumn(41).width = 20;
    worksheet.getColumn(42).width = 20;
    worksheet.getColumn(43).width = 20;
    worksheet.getColumn(44).width = 20;
    worksheet.getColumn(45).width = 20;
    worksheet.getColumn(46).width = 20;
    worksheet.getColumn(47).width = 20;
    worksheet.getColumn(48).width = 20;
    worksheet.getColumn(49).width = 20;
    worksheet.getColumn(50).width = 20;
    worksheet.getColumn(51).width = 20;

    worksheet.addRow([]);
    // //Footer Row
    // let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
    // footerRow.getCell(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'FFCCFFE5' }
    // };
    // footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    // //Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:AW${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = ('Vendor Bill ' + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })


  }
  onbackToGridList() {
    this.navCtrl.navigate('admin/invoice/vendor-invoice-list');
  }

  //AutoComplete for RR
  selectRREvent($event) {
    this.RRId = $event.RRId;
  }
  clearRREvent($event) {
    this.RRId = ''
    this.RRNo = ''
  }
 
  onChangeRRSearch(val: string) {

    if (val) {
      this.isLoadingRR = true;
      var postData = {
        "RRNo": val
      }
      this.commonService.postHttpService(postData, "RRNoAotoSuggest").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.RRList = data.filter(a => a.RRNo.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingRR = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingRR = false; });

    }
  }

  //AutoComplete for Vendor
  selectVendorEvent($event) {
    this.VendorId = $event.VendorId;
  }
  clearVendorEvent($event) {
    this.VendorId = '';
    this.VendorName = ''
  }
  onChangeVendorSearch(val: string) {

    if (val) {
      this.isLoadingVendor = true;
      var postData = {
        "Vendor": val
      }
      this.commonService.postHttpService(postData, "getAllAutoCompleteofVendor").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.VendorsList = data.filter(a => a.VendorName.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingVendor = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingVendor = false; });

    }
  }
}
