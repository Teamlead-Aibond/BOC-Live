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
import { Workbook } from 'exceljs';
import * as moment from 'moment';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_APPROVE_ACCESS, CONST_COST_HIDE_VALUE, Customer_Invoice_Status, Invoice_Type } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as fs from 'file-saver';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  baseUrl = `${environment.api.apiURL}`;
  IsDeleted=''
  keywordForCustomer = 'CompanyName';
  customerList: any = [];
  isLoadingCustomer: boolean = false;
  public CompanyName: any = [];
  keywordForRR = 'RRNo';
  RRList: any[]
  RRId = ''
  isLoadingRR: boolean = false;
  spinnercsvIntacct:boolean=false
  //ServerSide List
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  api_check: any;
  dataTable: any;
  dataTableMessage;
  //Filter
  RRNo;
  InvoiceNo;
  CustomerId;
  CustomerPONo;
  InvoiceType='';
  Status='';
  InvoiceDateToDate
  InvoiceDateDate;
  DueDateToDate;
  DueDateDate;
  InvoiceDate;
  InvoiceDateTo;
  DueDateTo;
  DueDate;
  IsCSVProcessed='';
  InvoiceList: any = [];
  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;
  IsPrintPDFEnabled;
  IsEmailEnabled;
  IsExcelEnabled;
  IsNotesEnabled;
  IsApproveEnabled;
  ExcelData;
  checkedList: any = [];
  Customer_Invoice_Status;
  CSVData
  CustomerInvoiceApproved='';
  VendorBillApproved='';
  VendorBillCreated='';
  gridCheckAll: boolean = false;
  InvoiceDataItem:any=[]
  checkedQuoteIds = [];
  uncheckedQuoteIds = [];
  QuoteItem = [];
  rowcheck: boolean = false;
  spinnerxlsx: boolean = false;
  spinnercsv: boolean = false;
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList:any=[]
  spinnercsvnew: boolean = false;
  DownloadOptionINVList
  CurrencyList:any=[]
  LocalCurrencyCode
  DifferentCurrency: boolean = false;
  Location=''
  countryList:any=[]
  EDIUpload=''
  CustomerGroupId: any;
  customerGroupList: any;
  initLoad: boolean = true;
  constructor(private http: HttpClient, public router: Router, public navCtrl: NgxNavigationWithDataComponent,
    private modalService: NgbModal, private commonService: CommonService, private cd_ref: ChangeDetectorRef,
    private datePipe: DatePipe,) { }
  ngOnInit(): void {
    document.title='Invoice List'
    this.Customer_Invoice_Status = Customer_Invoice_Status;
    this.IsDeleted = "0";
    this.LocalCurrencyCode = '';

    this.IsViewEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_DELETE_ACCESS);
    this.IsViewCostEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_VIEW_COST_ACCESS);
    this.IsApproveEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_APPROVE_ACCESS);
    this.IsPrintPDFEnabled = this.commonService.permissionCheck("INVPrintAndPDFExport", CONST_VIEW_ACCESS);
    this.IsEmailEnabled = this.commonService.permissionCheck("INVEmail", CONST_VIEW_ACCESS);
    this.DownloadOptionINVList = this.commonService.permissionCheck("DownloadOptionINVList", CONST_VIEW_ACCESS);
    this.IsNotesEnabled = this.commonService.permissionCheck("INVNotes", CONST_VIEW_ACCESS);
    this.getList();
    
  }
  getList(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/invoice/getInvoiceListByServerSide';
    const that = this;
    var filterData = {}
    if(this.DownloadOptionINVList){
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


            that.InvoiceDataItem = resp.responseData.data;

            that.InvoiceDataItem.forEach(item => {
              item.checked = this.isQuoteChecked(item.InvoiceId);
            });
            if(this.initLoad){
              this.loadCustomers();
              this.getCustomerGroupList();
              this.getCurrencyList();
              this.getCountryList();
            }
            this.initLoad = false;
            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: that.InvoiceDataItem
            });

          });

      },
      buttons:buttons,
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
        {
          "targets": [22],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [23],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [24],
          "visible": false,
          "searchable": true
        },
      ],
      'select': {
        'style': 'multi'
      },
      createdRow: function (row, data, index) {

        // Set the Quote Type
        var TypeStyle = Invoice_Type.find(a => a.Invoice_TypeId == data.InvoiceType)
        var html = '<span class="badge ' + (TypeStyle ? TypeStyle.cstyle : 'btn-xs"') + '">' + (TypeStyle ? TypeStyle.Invoice_TypeName : '') + '</span>'
        $('td', row).eq(4).html(html);

        var html = `<input type="checkbox" class="checkbox"  ${data.checked ? 'checked' : ''}  (change)="rowCheckBoxChecked($event, ${data.InvoiceId})">`;
        $('td', row).eq(0).html(html);


        // Set the RRNo
        var number = '';
        if (data.RRNo != '' && data.RRNo != '0' && data.RRNo != null) {
          number = data.RRNo;
          var html = `<a href="#/admin/repair-request/edit?RRId=${data.RRId}" target="_blank" data-toggle='tooltip' title='RR View' data-placement='top'>${number}</a>`;
          $('td', row).eq(2).html(html);
        } else if (data.MRONo != '' && data.MRONo != '0' && data.MRONo != null) {
          number = data.MRONo;
          var html = `<a href="#/admin/mro/edit?MROId=${data.MROId}" target="_blank" data-toggle='tooltip' title='MRO View' data-placement='top'>${number}</a>`;
          $('td', row).eq(2).html(html);
        }
        else if (data.QuoteNo != '' && data.QuoteNo != '0' && data.QuoteNo != null) {
          number = data.QuoteNo;
          var html = `<a href="#/admin/sales-quote/list?QuoteId=${data.QuoteId}" target="_blank" data-toggle='tooltip' title='MRO View' data-placement='top'>${number}</a>`;
          $('td', row).eq(2).html(html);
        }


        if (data.CustomerBlanketPOId != 0) {
          var html = `<a  href="#/admin/Blanket-PO-History?CustomerBlanketPOId=${data.CustomerBlanketPOId}"  target="_blank"   data-toggle= 'tooltip' title='Blanket PO' data-placement= 'top'>${data.CustomerPONo}</a>`;
        }
        else{
          var html = `<a>${data.CustomerPONo}</a>`;
        }
        $('td', row).eq(8).html(html);

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
        $('td', row).eq(7).html(html);


        //Set Grand Total
        var html = '<span>' +data.CurrencySymbol+ " "+ data.GrandTotal + '</span>'
        $('td', row).eq(5).html(html);

      },
      columns: [
        {
          data: 'InvoiceId', name: 'InvoiceId', defaultContent: '', orderable: false, searchable: true,

        },
        {
          data: 'InvoiceNo', name: 'InvoiceNo', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var Inv_text = '';

            if (this.IsViewEnabled) {

              Inv_text = `<a  href="#/admin/invoice/list?InvoiceId=${row.InvoiceId}&IsDeleted=${row.IsDeleted}" target="_blank" data-toggle='tooltip' title='Invoice View' data-placement='top'>${row.InvoiceNo}</a>`;

            } else {

              Inv_text = '<a  ngbTooltip="View">' + row.InvoiceNo + '</a>';

            }

            if (row.IsCSVProcessed == 1) {

              Inv_text += `&nbsp;<i class="fas fa-check-circle greentick"></i></a>`;

            }

            if (row.IsEDIUpload) {

              Inv_text += `&nbsp;<span style="color:red"><strong>EDI</strong></span></a>`;

            }

            return Inv_text;

          }
        },
        {
          data: 'RRNo', name: 'RRNo', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (data.RRNo != '') {
              return `<a href="#" class="actionViewRR" data-toggle='tooltip' title='RR View' data-placement='top'>` + row.RRNo + `</a>`;
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
        { data: 'CustomerPONo', name: 'CustomerPONo', orderable: true, searchable: true },
        {
          data: 'InvoiceId', name: 'InvoiceId', defaultContent: '', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            if (row.IsDeleted == 0) {
              
              if (this.IsViewEnabled) {
                actiontext += `<a href="#/admin/invoice/list?InvoiceId=${row.InvoiceId}&IsDeleted=0" target="_blank" class="fa fa-eye text-secondary" data-toggle='tooltip' title='Invoice View' data-placement='top'></a>&nbsp;`;
              }
              if (this.IsEditEnabled) {
                actiontext += `<a href="#/admin/invoice/edit?InvoiceId=${row.InvoiceId}"  target="_blank" class="fa fa-edit text-secondary" data-toggle='tooltip' title='Invoice Edit' data-placement='top'></a> &nbsp;`;
              }
              if (this.IsDeleteEnabled) {
                actiontext += `<a href="#" class="fa fa-trash text-danger actionView3" data-toggle='tooltip' title='Invoice Delete' data-placement='top'></a>`;
              }
            }
            else {
              if (this.IsViewEnabled) {
                actiontext += `<a href="#/admin/invoice/list?InvoiceId=${row.InvoiceId}&IsDeleted=1" target="_blank" class="fa fa-eye text-secondary" data-toggle='tooltip' title='Invoice View' data-placement='top'></a>&nbsp;`;
              }
            }
            return actiontext;
          }
        },
        { data: 'IsDeleted', name: 'IsDeleted', orderable: true, searchable: true, },
        { data: 'VendorBillCreated', name: 'VendorBillCreated', orderable: true, searchable: true, },
        { data: 'LocalCurrencyCode', name: 'LocalCurrencyCode', orderable: true, searchable: true, },
        { data: 'CreatedByLocation', name: 'CreatedByLocation', orderable: true, searchable: true, },
        { data: 'IsEDIUpload', name: 'IsEDIUpload', orderable: true, searchable: true, },
        { data: 'CustomerGroupId', name: 'CustomerGroupId', orderable: true, searchable: true, },

      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {

        $('.actionView', row).unbind('click');
        $('.actionView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['/admin/invoice/list'], { state: { InvoiceId: data.InvoiceId, showList: true } });
        });


        $('.actionDeleteView', row).unbind('click');
        $('.actionDeleteView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['/admin/invoice/list'], { state: { InvoiceId: data.InvoiceId, showList: true, IsDeleted: data.IsDeleted } });
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
          this.navCtrl.navigate('admin/invoice/edit', { InvoiceId: data.InvoiceId });
        });

        $('.actionView3', row).unbind('click');
        $('.actionView3', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDelete(data.InvoiceId);
        });


        $('.checkbox', row).unbind('click');
        $('.checkbox', row).bind('click', (e) => {
          this.rowCheckBoxChecked(e,data.InvoiceId,data.RRNo, data.MRONo,data.LocalCurrencyCode)

          // this.onExcelData(data.InvoiceId)

          // this.onSendEmail(data.InvoiceId)
        });

        return row;
      },
      "preDrawCallback": function () {
        $('#datatable-invoice_processing').attr('style', 'display: block; z-index: 10000 !important');

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

    this.dataTable = $('#datatable-invoice');
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

  private isQuoteChecked(InvoiceId) {
    this.checkedList = [];
    if (!this.gridCheckAll) {
      return this.checkedQuoteIds.indexOf(InvoiceId) >= 0 ? true : false;
    } else {
      this.InvoiceDataItem.map(a => a.checked = true);
      this.checkedList = this.InvoiceDataItem.map(a => { return { InvoiceId: a.InvoiceId,LocalCurrencyCode:a.LocalCurrencyCode } });
      return this.uncheckedQuoteIds.indexOf(InvoiceId) >= 0 ? false : true;
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
      this.InvoiceDataItem.map(a => a.checked = true);
      this.checkedList = this.InvoiceDataItem.map(a => { return { InvoiceId: a.InvoiceId,LocalCurrencyCode:a.LocalCurrencyCode } });

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
      this.InvoiceDataItem.map(a => a.checked = false);
      // this.QuoteList = [];
      this.checkedList = [];
    }
    $('#datatable-invoice').DataTable().ajax.reload();
  }

  rowCheckBoxChecked(e, InvoiceId, RRNo, MRONo,LocalCurrencyCode) {
    this.DifferentCurrency = false
    if (e.target.checked) {
      this.checkedList.push({ InvoiceId,LocalCurrencyCode });

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
      this.checkedList = this.checkedList.filter(a => a.InvoiceId != InvoiceId);
      // this.QuoteList = this.QuoteList.filter(a => a.QuoteId != QuoteId);
    }
  }

  onDelete(InvoiceId) {
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
          InvoiceId: InvoiceId,
        }
        this.commonService.postHttpService(postData, 'DeleteInvoice').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Invoice has been deleted.',
              type: 'success'
            });
            var table = $('#datatable-invoice').DataTable();
            table.draw();
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Invoice is safe:)',
          type: 'error'
        });
      }
    });

  }
  onSendEmail(InvoiceId) {
    this.InvoiceList.push({
      InvoiceId
    })
  }

  onSendEmailFromList() {
    if (this.InvoiceList.length == "") {
      Swal.fire({
        title: 'Message',
        text: 'Please Select the Below Invoice List before Email',
        type: 'info',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
    } else {
      var postData = {
        "InvoiceList": this.InvoiceList
      }
      this.commonService.postHttpService(postData, "SendEmailFromInvoiceList").subscribe(response => {
        if (response.status == true) {
          Swal.fire({
            title: 'Success!',
            text: 'Email Sent Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Email could not be Sent!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
  }

  InvoiceDateToFormat(InvoiceDateTo) {
    if(InvoiceDateTo!=null){
    const InvoiceDateToYears = InvoiceDateTo.year;
    const InvoiceDateToDates = InvoiceDateTo.day;
    const InvoiceDateTomonths = InvoiceDateTo.month;
    let InvoiceDateToDate = new Date(InvoiceDateToYears, InvoiceDateTomonths - 1, InvoiceDateToDates);
    this.InvoiceDateToDate = moment(InvoiceDateToDate).format('YYYY-MM-DD');
    }else{
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
    }
    else{
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
    }
    else{
      this.DueDateDate = ''
    }
  }
  onFilter(event) {
    // var Customerid = ""
    // var CustomerName = ""
    // if (this.CustomerId == '' || this.CustomerId == undefined || this.CustomerId == null) {
    //   Customerid = ""
    //   CustomerName = this.CompanyName
    // }
    // else if (this.CustomerId != "") {
    //   Customerid = this.CustomerId
    //   CustomerName = ''
    // }

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
    var table = $('#datatable-invoice').DataTable();
    table.columns(2).search(RRNo);
    // table.columns(3).search(CustomerName);
    table.columns(7).search(this.Status);
    table.columns(6).search(this.InvoiceDateDate);
    table.columns(9).search(this.InvoiceDateToDate);
    table.columns(1).search(this.InvoiceNo);
    table.columns(8).search(this.CustomerPONo);
    table.columns(10).search(this.DueDateDate);
    table.columns(11).search(this.DueDateToDate);
    table.columns(12).search(this.CompanyName)
    table.columns(4).search(this.InvoiceType)
    table.columns(13).search(this.IsCSVProcessed);
    table.columns(14).search(rrid)
    table.columns(15).search(this.CustomerInvoiceApproved)
    table.columns(16).search(this.VendorBillApproved)
    table.columns(19).search(this.IsDeleted)
    table.columns(20).search(this.VendorBillCreated)
    table.columns(21).search(this.LocalCurrencyCode)
    table.columns(22).search(this.Location)
    table.columns(23).search(this.EDIUpload)
    table.columns(24).search(this.CustomerGroupId)
    table.draw();
  }
  onClear(event) {
    var table = $('#datatable-invoice').DataTable();
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
    this.IsCSVProcessed = "";
    this.checkedList = [];
    var Customerid = ""
    var CustomerName = "";
    var rrid = ""
    var RRNo = "";
    this.CompanyName = ''
    this.CustomerInvoiceApproved = "";
    this.VendorBillApproved = "";
    this.IsDeleted = ""
    this.RRId = ""
    this.VendorBillCreated = ""
    this.LocalCurrencyCode = ''
    this.Location=''
    this.EDIUpload = ''
    var CustomerGroupId = "";
    if(this.CustomerGroupId != null || this.CustomerGroupId != ''){
      this.CustomerGroupId = null;
      CustomerGroupId = "";
      this.loadCustomers();
    }
    table.columns(2).search(RRNo);
    // table.columns(3).search(CustomerName);
    table.columns(7).search(this.Status);
    table.columns(6).search(this.InvoiceDateDate);
    table.columns(9).search(this.InvoiceDateToDate);
    table.columns(1).search(this.InvoiceNo);
    table.columns(8).search(this.CustomerPONo);
    table.columns(10).search(this.DueDateDate);
    table.columns(11).search(this.DueDateToDate);
    table.columns(12).search(this.CompanyName)
    table.columns(4).search(this.InvoiceType)
    table.columns(13).search(this.IsCSVProcessed);
    table.columns(14).search(rrid)
    table.columns(15).search(this.CustomerInvoiceApproved)
    table.columns(16).search(this.VendorBillApproved)
    table.columns(19).search(this.IsDeleted)
    table.columns(20).search(this.VendorBillCreated)
    table.columns(21).search(this.LocalCurrencyCode)
    table.columns(22).search(this.Location)
    table.columns(23).search(this.EDIUpload)
    table.columns(24).search(CustomerGroupId)
    table.draw();
  }


  onExcelData(InvoiceId) {
    this.checkedList.push({
      InvoiceId
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
    var postData = {
      "Invoice": this.checkedList,
      "RRNo": RRNo,
      "InvoiceNo": this.InvoiceNo,
      "CustomerId": this.CompanyName,
      "CustomerPONo": this.CustomerPONo,
      "InvoiceDate": this.InvoiceDateDate,
      "InvoiceDateTo": this.InvoiceDateToDate,
      "DueDate": this.DueDateDate,
      "DueDateTo": this.DueDateToDate,
      "InvoiceType": this.InvoiceType,
      "Status": this.Status,
      "IsCSVProcessed": this.IsCSVProcessed,
      "DownloadType": "Excel",
      "RRId":rrid,
      "VendorBillApproved":this.VendorBillApproved,
      "CustomerInvoiceApproved":this.CustomerInvoiceApproved,
      "IsDeleted":this.IsDeleted,
      "VendorBillCreated":this.VendorBillCreated,
      "LocalCurrencyCode":this.LocalCurrencyCode,
      "CreatedByLocation":this.Location,
      'IsEDIUpload':this.EDIUpload

    }
    this.spinnerxlsx = true;
    this.commonService.postHttpService(postData, "InvoiceExcel").subscribe(response => {
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
    var postData = {
      "Invoice": this.checkedList,
      "RRNo": RRNo,
      "InvoiceNo": this.InvoiceNo,
      "CustomerId": this.CompanyName,
      "CustomerPONo": this.CustomerPONo,
      "InvoiceDate": this.InvoiceDateDate,
      "InvoiceDateTo": this.InvoiceDateToDate,
      "DueDate": this.DueDateDate,
      "DueDateTo": this.DueDateToDate,
      "InvoiceType": this.InvoiceType,
      "Status": this.Status,
      "IsCSVProcessed": this.IsCSVProcessed,
      "DownloadType": "CSV",
      "RRId":rrid,
      "VendorBillApproved":this.VendorBillApproved,
      "CustomerInvoiceApproved":this.CustomerInvoiceApproved,
      "IsDeleted":this.IsDeleted,
      "VendorBillCreated":this.VendorBillCreated,
      "LocalCurrencyCode":this.LocalCurrencyCode,
      "CreatedByLocation":this.Location,
      'IsEDIUpload':this.EDIUpload
    }
    this.spinnercsv = true;
    this.commonService.postHttpService(postData, "InvoiceExcel").subscribe(response => {
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
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
    var filename = ('Sales Invoice ' + currentDate + '.csv')
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
      var keyNames = Object.keys(jsonData[i]);
      var temparray = [];
      for (var key in obj) {
        var value = obj[key];
        temparray.push(value);
      }
      data.push(temparray);
    }

    //Excel Title, Header, Data
    const title = 'Invoice';
    //const header = ["Customer ID", "Customer Name", "Invoice/CM #", "Date", "Ship To Name", "Ship to Address-Line One", "Ship to Address-Line Two", "Ship To City", "Ship To State", "Ship to Zipcode", "Ship To Country", "Customer PO", "Ship Date", "Due Date", "Displayed Terms", "Accounts Receivable Account", "Accounts", "Invoice Note", "Number Of Distributions", "Quantity", "SO/Proposal Number", "Item ID", "Description", "G/L Account", "Unit Price", "Tax Type", "Amount"]
    const header = keyNames
   // ["CustomerCode", "CustomerName", "InvoiceNo", "Date", "ShipToName", "ShipToAddressLineOne", "ShipToAddressLineTwo", "ShipToCity", "ShipToState", "ShipToZipCode", "ShipToCountry", "CustomerPONo", "ShipDate", "DueDate", "DisplayedTerms", "AccountsReceivableAccount", "Accounts", "InvoiceNote", "NumberOfDistributions", "Quantity", "SOProposalNumber", "ItemID", "Description", "G/L Account", "UnitPrice", "TaxType", "Amount"]

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
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 20;
    worksheet.getColumn(12).width = 15;
    worksheet.getColumn(13).width = 15;
    worksheet.getColumn(14).width = 15;
    worksheet.getColumn(15).width = 25;
    worksheet.getColumn(16).width = 15;
    worksheet.getColumn(17).width = 20;
    worksheet.getColumn(18).width = 25;
    worksheet.getColumn(19).width = 15;
    worksheet.getColumn(20).width = 20;
    worksheet.getColumn(21).width = 15;
    worksheet.getColumn(22).width = 30;
    worksheet.getColumn(23).width = 15;
    worksheet.getColumn(24).width = 15;
    worksheet.getColumn(25).width = 15;
    worksheet.getColumn(26).width = 15;
    worksheet.getColumn(27).width = 20;
    worksheet.getColumn(28).width = 20;
    worksheet.getColumn(29).width = 20;
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
    // worksheet.mergeCells(`A${footerRow.number}:Z${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = ('Sales Invoice ' + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })


  }

  exportAsCSV1() {
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
    var postData = {
      "Invoice": this.checkedList,
      "RRNo": RRNo,
      "InvoiceNo": this.InvoiceNo,
      "CustomerId": this.CompanyName,
      "CustomerPONo": this.CustomerPONo,
      "InvoiceDate": this.InvoiceDateDate,
      "InvoiceDateTo": this.InvoiceDateToDate,
      "DueDate": this.DueDateDate,
      "DueDateTo": this.DueDateToDate,
      "InvoiceType": this.InvoiceType,
      "Status": this.Status,
      "IsCSVProcessed": this.IsCSVProcessed,
      "DownloadType": "CSV",
      "RRId":rrid,
      "VendorBillApproved":this.VendorBillApproved,
      "CustomerInvoiceApproved":this.CustomerInvoiceApproved,
      "IsDeleted":this.IsDeleted,
      "VendorBillCreated":this.VendorBillCreated,
      "LocalCurrencyCode":this.LocalCurrencyCode,
      "CreatedByLocation":this.Location,
      'IsEDIUpload':this.EDIUpload

    }
    this.spinnercsvnew = true;
    this.commonService.postHttpService(postData, "InvoiceExcelNew").subscribe(response => {
      if (response.status == true) {
        this.CSVData = response.responseData.ExcelData;
        this.generateCSVFormat();
        this.spinnercsvnew = false;
        Swal.fire({
          title: 'Success!',
          text: 'CSV downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        this.spinnercsvnew = false;
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
  onbackToGridList() {
    this.navCtrl.navigate('/admin/invoice/list');
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
  //AutoComplete for customer
  selectCustomerEvent($event) {
    this.CustomerId = $event.CustomerId;
  }
  onChangeCustomerSearch(val: string) {

    if (val) {
      this.isLoadingCustomer = true;
      var postData = {
        "Customer": val
      }
      this.commonService.postHttpService(postData, "getAllAutoComplete").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.customerList = data.filter(a => a.CompanyName.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingCustomer = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingCustomer = false; });

    }
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
    return this.commonService.postHttpService(postData, "getAllAutoComplete")
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

  generateIntacctCSV() {
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
    var postData = {
      "Invoice": this.checkedList,
      "RRNo": RRNo,
      "InvoiceNo": this.InvoiceNo,
      "CustomerId": this.CompanyName,
      "CustomerPONo": this.CustomerPONo,
      "InvoiceDate": this.InvoiceDateDate,
      "InvoiceDateTo": this.InvoiceDateToDate,
      "DueDate": this.DueDateDate,
      "DueDateTo": this.DueDateToDate,
      "InvoiceType": this.InvoiceType,
      "Status": this.Status,
      "IsCSVProcessed": this.IsCSVProcessed,
      "DownloadType": "CSV",
      "RRId":rrid,
      "VendorBillApproved":this.VendorBillApproved,
      "CustomerInvoiceApproved":this.CustomerInvoiceApproved,
      "IsDeleted":this.IsDeleted,
      "VendorBillCreated":this.VendorBillCreated,
      "LocalCurrencyCode":this.LocalCurrencyCode,
      "CreatedByLocation":this.Location,
      'IsEDIUpload':this.EDIUpload
    }
    this.spinnercsvIntacct = true;
    this.commonService.postHttpService(postData, "InvoiceIntacctCSVExport").subscribe(response => {
      if (response.status == true) {
        var IntacctCSVData = response.responseData.ExcelData;
        this.generateIntacctCSVFormat(IntacctCSVData);
        this.spinnercsvIntacct = false;
        Swal.fire({
          title: 'Success!',
          text: 'CSV downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        this.spinnercsvIntacct = false;
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
  generateIntacctCSVFormat(IntacctCSVData) {
  
    let sampleJson: any = IntacctCSVData
    let a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    let csvData = this.ConvertToIntacctCSV(sampleJson);
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
    var filename = ('Intacct CSV' + currentDate + '.csv')
    a.download = filename;
    a.click()
  
  }
  ConvertToIntacctCSV(objArray) {
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
