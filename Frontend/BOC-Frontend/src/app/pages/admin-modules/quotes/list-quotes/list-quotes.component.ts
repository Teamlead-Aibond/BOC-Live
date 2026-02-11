/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { DatePipe, } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { dataUri } from '@rxweb/reactive-form-validators';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { attachment_thumb_images, warranty_list, SalesQuote_Status, Quote_type, taxtype, CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, CONST_IDENTITY_TYPE_QUOTE , CONST_ContactAddressType, CONST_AH_Group_ID} from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as fs from 'file-saver';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { identifierModuleUrl } from '@angular/compiler';
import { QuoteDuplicateComponent } from '../../common-template/quote-duplicate/quote-duplicate.component';
import { EmailComponent } from '../../common-template/email/email.component';
import { SalesQuotePrintComponent } from '../../common-template/sales-quote-print/sales-quote-print.component';


@Component({
  selector: 'app-list-quotes',
  templateUrl: './list-quotes.component.html',
  styleUrls: ['./list-quotes.component.scss'],
  providers: [NgxSpinnerService]
})
export class ListQuotesComponent implements OnInit {
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  public CompanyName: any = [];

  baseUrl = `${environment.api.apiURL}`;
  ExcelData: any = [];
  Quote: any = [];
  keywordForCustomer = 'CompanyName';
  customerList: any = [];
  isLoadingCustomer: boolean = false;
  keywordForRR = 'RRNo';
  RRList: any[]
  RRId = ''
  isLoadingRR: boolean = false;
  //access rights variables
  IsSOAddEnabled;
  IsSOEditEnabled;
  IsSODeleteEnabled;
  IsSOPrintPDFEnabled;
  IsSOEmailEnabled;
  IsSOExcelEnabled;
  IsSONotesEnabled;
  IsConvertQuoteToSOEnabled;
  IsSOViewCostEnabled;
  IsSOViewEnabled;

  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  public QuoteNo: string;
  public Description: string;
  public CustomerId: string;
  public Status: string = '';
  SalesQuoteStatusList;
  QuoteTypeList;
  DateRequested;
  QuoteType = '';
  RRNo;
  QuoteDate;
  QuoteDateTo;
  QuoteDateToDate;
  QuoteDateDate;
  QuoteList: any = []
  IsDeleted = '';

  gridCheckAll: boolean = false;

  checkedQuoteIds = [];
  uncheckedQuoteIds = [];
  QuoteItem = [];
  rowcheck: boolean = false;
  spinner: boolean = false;
  QuoteTypes = ''
  DownloadOptionQTList
  CurrencyList:any=[]
  LocalCurrencyCode
  Location=''
  countryList:any=[];
  CustomerGroupId: any;
  customerGroupList: any;
  emptyValue: any = '';
  @ViewChild(SalesQuotePrintComponent, null) printComponent: SalesQuotePrintComponent;
  number: any;
  QuoteEmailSuccess: boolean = false;
  QuoteEmailCustomerId: any;
  AHAddressList: any;
  settingsView: any;
  initLoad: boolean = true;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(private http: HttpClient,
    private router: Router, public service: CommonService, private cd_ref: ChangeDetectorRef, private commonService: CommonService,
    private CommonmodalService: BsModalService, private excelService: ExcelService,
    public modalRef: BsModalRef, private datePipe: DatePipe,
    public navCtrl: NgxNavigationWithDataComponent, private loader: NgxSpinnerService

  ) { }
  currentRouter = this.router.url;

  async ngOnInit(): Promise<void> {
    document.title='Quote List'
    this.SalesQuoteStatusList = SalesQuote_Status
    this.QuoteTypeList = Quote_type;
    this.IsSONotesEnabled = this.service.permissionCheck("SalesQuoteNotes", CONST_VIEW_ACCESS);
    this.LocalCurrencyCode = ''
    this.IsDeleted = "0";
    
    this.IsSOViewEnabled = this.service.permissionCheck("ManageSalesQuotes", CONST_VIEW_ACCESS);
    this.IsSOAddEnabled = this.service.permissionCheck("ManageSalesQuotes", CONST_CREATE_ACCESS);
    this.IsSOEditEnabled = this.service.permissionCheck("ManageSalesQuotes", CONST_MODIFY_ACCESS);
    this.IsSODeleteEnabled = this.service.permissionCheck("ManageSalesQuotes", CONST_DELETE_ACCESS);
    this.IsSOViewCostEnabled = this.service.permissionCheck("ManageSalesQuotes", CONST_VIEW_COST_ACCESS);
    this.IsSOPrintPDFEnabled = this.service.permissionCheck("QuotePrintAndPDFExport", CONST_VIEW_ACCESS);
    this.IsSOEmailEnabled = this.service.permissionCheck("QuoteEmail", CONST_VIEW_ACCESS);
    this.IsSOExcelEnabled = this.service.permissionCheck("QuoteDownloadExcel", CONST_VIEW_ACCESS);
    this.DownloadOptionQTList = this.service.permissionCheck("DownloadOptionQTList", CONST_VIEW_ACCESS);
    await this.getList();
  }

  async getList(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/quotes/getQuoteListByServerSide';
    const that = this;
    var filterData = {}
    if(this.DownloadOptionQTList){
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
      retrieve: true,
      order: [[0, 'desc']],
      serverMethod: 'post',
      responsive: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.api_check ? that.api_check.unsubscribe() : that.api_check = null;
        that.api_check = that.http.post<any>(url,
          Object.assign(dataTablesParameters,
            filterData
          ), httpOptions).subscribe(resp => {

            that.QuoteItem = resp.responseData.data;

            that.QuoteItem.forEach(item => {
              item.checked = this.isQuoteChecked(item.QuoteId);
            });
            if(this.initLoad){
              this.getCurrencyList();
              this.getCountryList();
              this.loadCustomers();
              this.getCustomerGroupList();
            }
            this.initLoad = false;

            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: this.QuoteItem

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
          "targets": [17],
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
        var obj = this

        // Set the Quote Type
        var QuoteTypeStyle = Quote_type.find(a => a.Quote_TypeId == data.QuoteType)
        var html = '<span class="badge ' + (QuoteTypeStyle ? QuoteTypeStyle.cstyle : 'btn-xs"') + '">' + (QuoteTypeStyle ? QuoteTypeStyle.Quote_TypeName : '') + '</span>'
        $('td', row).eq(4).html(html);

        var html = `<input type="checkbox" class="checkbox"  ${data.checked ? 'checked' : ''}  (change)="rowCheckBoxChecked($event, ${data.QuoteId})">`;
        $('td', row).eq(0).html(html);

        // Set the RRNo 
        var number = '';
        if (data.RRNo != '' && data.RRNo != '0' && data.RRNo != null) {
          number = data.RRNo;
          var html = `<a href="#/admin/repair-request/edit?RRId=${data.RRId}" target="_blank"  data-toggle='tooltip' title='RR View' data-placement='top'>${number}</a>`;
          $('td', row).eq(2).html(html);
        } else if (data.MRONo != '' && data.MRONo != '0' && data.MRONo != null) {
          number = data.MRONo;
          var html = `<a href="#/admin/mro/edit?MROId=${data.MROId}" target="_blank" data-toggle='tooltip' title='MRO View' data-placement='top'>${number}</a>`;
          $('td', row).eq(2).html(html);
        }
        else if ((data.MRONo == '' && data.MRONo == '0' && data.MRONo == null)&& (data.RRNo == '' && data.RRNo == '0' && data.RRNo == null)) {
          var numberEmpty = '-';
          var html = '<a href="#"  ngbTooltip="View">'+numberEmpty+'</a>';
          $('td', row).eq(2).html(html);
        }
        


        // Set the Status
        var cstyle = '';
        switch (data.Status) {
          case 0: { cstyle = 'badge-warning'; status = "Open"; break; }
          case 1: { cstyle = 'badge-success'; status = "Approved"; break; }
          case 2: { cstyle = 'badge-danger'; status = "Cancelled"; break; }
          case 3: { cstyle = 'badge-info'; status = "Draft"; break; }
          case 4: { cstyle = 'badge-primary'; status = "Submitted"; break; }
          case 5: { cstyle = 'badge-secondary'; status = "Quoted"; break; }
          default: { cstyle = ''; status = ''; break; }
        }
        var html = '<span class="badge ' + cstyle + ' btn-xs">' + status + '</span>';
        $('td', row).eq(7).html(html);


        var html = '<span>' + data.CurrencySymbol+ " " + data.GrandTotal + '</span>'
        $('td', row).eq(5).html(html);

      },
      columns: [

        {
          data: 'QuoteId', name: 'QuoteId', defaultContent: '', orderable: false, searchable: true,

        },
        {
          data: 'QuoteNo', name: 'QuoteNo', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.IsDeleted == 0) {
              if (this.IsSOViewEnabled) {
                return `<a href="#/admin/sales-quote/list?QuoteId=${row.QuoteId}&IsDeleted=0" target="_blank"  data-toggle='tooltip' title='Quote View' data-placement='top'>${row.QuoteNo}</a>`;
              } else {
                return '<a  ngbTooltip="View">' + row.QuoteNo + '</a>';
              }
            }
            else {
              if (this.IsSOViewEnabled) {
                return `<a href="#/admin/sales-quote/list?QuoteId=${row.QuoteId}&IsDeleted=1" target="_blank" data-toggle='tooltip' title='Quote View' data-placement='top'>${row.QuoteNo}</a>`;
              } else {
                return '<a  ngbTooltip="View">' + row.QuoteNo + '</a>';
              }
            }
          }
        },
        {
          data: 'RRNo', name: 'RRNo', orderable: true, searchable: true,defaultContent: '',
          render: (data: any, type: any, row: any, meta) => {
            if(row.RRNo ==0){
              return '<a  ngbTooltip="View">' +"-"+ '</a>';
            }else{
               // Set the RRNo 
        var number = '';
        if (data.RRNo != '' && data.RRNo != '0' && data.RRNo != null) {
          number = data.RRNo;
          var html = `<a href="#/admin/repair-request/edit?RRId=${data.RRId}" target="_blank"  data-toggle='tooltip' title='RR View' data-placement='top'>${number}</a>`;
          $('td', row).eq(2).html(html);
        } else if (data.MRONo != '' && data.MRONo != '0' && data.MRONo != null) {
          number = data.MRONo;
          var html = `<a href="#/admin/mro/edit?MROId=${data.MROId}" target="_blank" data-toggle='tooltip' title='MRO View' data-placement='top'>${number}</a>`;
          $('td', row).eq(2).html(html);
        }
            }
          }
        
        },
        { data: 'CompanyName', name: 'CompanyName', orderable: true, searchable: true, },
        { data: 'QuoteType', name: 'QuoteType', orderable: true, searchable: true, },
        { data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true, },
        { data: 'QuoteDate', name: 'QuoteDate', orderable: true, searchable: true, },
        { data: 'Status', name: 'Status', orderable: true, searchable: true, },
        { data: 'Description', name: 'Description', orderable: true, searchable: true, },
        { data: 'QuoteDateTo', name: 'QuoteDateTo', orderable: true, searchable: true, },
        { data: 'CustomerId', name: 'CustomerId', orderable: true, searchable: true, },
        { data: 'RRId', name: 'RRId', orderable: true, searchable: true, },
        { data: 'SONo', name: 'SONo', orderable: true, searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          var link = '';
          if(row.SONo){
          link += `<a href="#/admin/orders/sales-list?SOId=${row.SOId}" target="_blank"  data-toggle='tooltip' title='SO View' data-placement='top'>${row.SONo}</a>`
          }else {
            return '<a  ngbTooltip="View">' +"-"+ '</a>';
          }
          return link;
        }
         },
        { data: 'PONo', name: 'PONo', orderable: true, searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          var link = '';
          if(row.PONo){
          link +=  `<a href="#/admin/orders/purchase-list?POId=${row.POId}" target="_blank"  data-toggle='tooltip' title='PO View' data-placement='top'>${row.PONo}</a>`;
        }else {
          return '<a  ngbTooltip="View">' + "-" + '</a>';
        }      
          return link;
        } },
        { data: 'InvoiceNo', name: 'InvoiceNo', orderable: true, searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          var link = '';
          if(row.InvoiceNo){
          link += `<a href="#/admin/invoice/list?InvoiceId=${row.InvoiceId}" target="_blank"  data-toggle='tooltip' title='Invoice View' data-placement='top'>${row.InvoiceNo}</a>`;
          }  
          else {
            return '<a  ngbTooltip="View">' + "-" + '</a>';
          }   
          return link;
        } },
        { data: 'CustomerPONo', name: 'CustomerPONo', orderable: true, searchable: true },
        {
          data: 'QuoteId', className: 'text-center', orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            if (row.IsDeleted == 0) {
              if (row.MROId == 0 && row.RRId == 0 ) {
              actiontext += `<a href="#" class="fa fa-clone text-secondary actionViewDuplicate" data-toggle='tooltip' title='Duplicate QT' data-placement='top'></a> &nbsp;`;
              }
              if (this.IsSOViewEnabled) {
                actiontext += `<a href="#/admin/sales-quote/list?QuoteId=${row.QuoteId}&IsDeleted=0"  class="fa fa-eye text-secondary" target="_blank" data-toggle='tooltip' title='Quote View' data-placement='top'></a>&nbsp;`;
              }
              if (this.IsSOEditEnabled) {
                actiontext += `<a href="#/admin/sales-quote/edit?QuoteId=${row.QuoteId}" class="fa fa-edit text-secondary" target="_blank" data-toggle='tooltip' title='Quote Edit' data-placement='top'></a> &nbsp;`;
              }
              if (this.IsSODeleteEnabled) {
                actiontext += `<a href="#" class="fa fa-trash text-danger actionView3" data-toggle='tooltip' title='Quote Delete' data-placement='top'></a>`;
              }
            }
            else {
              if (this.IsSOViewEnabled) {
                actiontext += `<a  href="#/admin/sales-quote/list?QuoteId=${row.QuoteId}&IsDeleted=1" target="_blank" data-toggle='tooltip' title='Quote View' data-placement='top' ngbTooltip="View" class="fa fa-eye text-secondary"></a>&nbsp;`;
              }
            }
            return actiontext;
          }
        },
        { data: 'IsDeleted', name: 'IsDeleted', orderable: true, searchable: true, },
        { data: 'QuoteCategory', name: 'QuoteCategory', orderable: true, searchable: true, },
        { data: 'LocalCurrencyCode', name: 'LocalCurrencyCode', orderable: true, searchable: true, },
        { data: 'CreatedByLocation', name: 'CreatedByLocation', orderable: true, searchable: true, },
        { data: 'CustomerGroupId', name: 'CustomerGroupId', orderable: true, searchable: true, },
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {


        $('.actionView', row).unbind('click');
        $('.actionView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['admin/sales-quote/list'], { state: { QuoteId: data.QuoteId, showList: true, } });
        });

        $('.actionDeleteView', row).unbind('click');
        $('.actionDeleteView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['admin/sales-quote/list'], { state: { QuoteId: data.QuoteId, showList: true, IsDeleted: data.IsDeleted } });
        });

        $('.actionViewMRO', row).unbind('click');
        $('.actionViewMRO', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['admin/mro/edit'], { state: { MROId: data.MROId } });
        });

        $('.actionViewRR', row).unbind('click');
        $('.actionViewRR', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (data.RRNo != '' && data.RRNo != '0' && data.RRNo != null) {
            this.router.navigate(['admin/repair-request/edit'], { state: { RRId: data.RRId } })
          } else if (data.MRONo != '' && data.MRONo != '0' && data.MRONo != null) {
            this.router.navigate(['admin/mro/edit'], { state: { MROId: data.MROId } });
          }
        });

        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.navCtrl.navigate('admin/sales-quote/edit', { QuoteId: data.QuoteId });
        });

        $('.actionView3', row).unbind('click');
        $('.actionView3', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDelete(data.QuoteId);
        });


        $('.checkbox', row).unbind('click');
        $('.checkbox', row).bind('click', (e) => {
          this.rowCheckBoxChecked(e, data.QuoteId,data.RRNo,data.MRONo, data.CustomerId)
         
        });


        $('.actionViewDuplicate', row).unbind('click');
        $('.actionViewDuplicate', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onduplicate(data.QuoteId,data.QuoteNo)
        });
        return row;
      },
      "preDrawCallback": function () {
        $('#datatable-sq_processing').attr('style', 'display: block; z-index: 10000 !important');

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
      
      "fnPreDrawCallback": function( oSettings ) {
        // that.gridAllRowsCheckBoxChecked({target:{checked:true}})

      
      }
    };
 
    this.dataTable = $('#datatable-sq');
    this.dataTable.DataTable(this.dtOptions);

    this.onFilter(null);
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
    this.service.getHttpService('Currencyddl').subscribe(response => {
      if (response.status == true) {
        this.CurrencyList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  private isQuoteChecked(QuoteId) {
    this.Quote = [];
    if (!this.gridCheckAll) {
      return this.checkedQuoteIds.indexOf(QuoteId) >= 0 ? true : false;
    } else {
      this.QuoteItem.map(a => a.checked = true);
      this.Quote = this.QuoteItem.map(a => { return { QuoteId: a.QuoteId } });
      return this.uncheckedQuoteIds.indexOf(QuoteId) >= 0 ? false : true;

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
      this.QuoteItem.map(a => a.checked = true);
      this.Quote = this.QuoteItem.map(a => { return { QuoteId: a.QuoteId, CustomerId: a.CustomerId } });

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
      this.QuoteItem.map(a => a.checked = false);
      // this.QuoteList = [];
      this.Quote = [];
    }
    $('#datatable-sq').DataTable().ajax.reload();
  }

  rowCheckBoxChecked(e, QuoteId, RRNo, MRONo, CustomerId) {
    if (e.target.checked) {
      this.Quote.push({ QuoteId, CustomerId });

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
      this.Quote = this.Quote.filter(a => a.QuoteId != QuoteId);
      // this.QuoteList = this.QuoteList.filter(a => a.QuoteId != QuoteId);
    }
  }


  listCheck() {
    this.checkedQuoteIds = [];
    if (this.gridCheckAll) {
      // console.log(this.persons);
      this.QuoteItem.filter((item) => {
        if (item.checked) {
          this.checkedQuoteIds.push(item.QuoteId);
        }
      });
    }
  }
  onDelete(QuoteId) {
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
          QuoteId: QuoteId
        }

        this.service.postHttpService(postData, 'DeleteQuote').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Quotes has been deleted.',
              type: 'success'
            });

            // Reload the table
            var table = $('#datatable-sq').DataTable();
            table.draw();
          }else{
            Swal.fire({
              title: 'Info!',
              text: response.message,
              type: 'info'
            });
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Quotes is safe :)',
          type: 'error'
        });
      }
    });

  }





  QuoteDateToFormat(QuoteDateTo) {
    if (QuoteDateTo != null) {
      const QuoteDateToYears = QuoteDateTo.year;
      const QuoteDateToDates = QuoteDateTo.day;
      const QuoteDateTomonths = QuoteDateTo.month;
      let QuoteDateToDate = new Date(QuoteDateToYears, QuoteDateTomonths - 1, QuoteDateToDates);
      this.QuoteDateToDate = moment(QuoteDateToDate).format('YYYY-MM-DD');
    } else {
      this.QuoteDateToDate = ''
    }
  }
  QuoteDateFormat(QuoteDate) {
    if (QuoteDate != null) {
      const QuoteDateYears = QuoteDate.year;
      const QuoteDateDates = QuoteDate.day;
      const QuoteDatemonths = QuoteDate.month;
      let QuoteDateDate = new Date(QuoteDateYears, QuoteDatemonths - 1, QuoteDateDates);
      this.QuoteDateDate = moment(QuoteDateDate).format('YYYY-MM-DD')
    }
    else {
      this.QuoteDateDate = ''
    }
  }
  onFilter(event) {
    if(this.CustomerGroupId == null){
      this.CustomerGroupId = "";
    }
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
    var table = $('#datatable-sq').DataTable();
    table.columns(1).search(this.QuoteNo);
    table.columns(7).search(this.Status);
    // table.columns(3).search(CustomerName);
    table.columns(10).search(this.CompanyName);
    table.columns(4).search(this.QuoteType);
    table.columns(2).search(RRNo);
    table.columns(11).search(rrid);
    table.columns(8).search(this.Description);
    table.columns(6).search(this.QuoteDateDate);
    table.columns(9).search(this.QuoteDateToDate);
    table.columns(17).search(this.IsDeleted);
    table.columns(19).search(this.LocalCurrencyCode);
    table.columns(20).search(this.Location);
    table.columns(21).search(this.CustomerGroupId);
    table.draw();

  }

  onClear(event) {
    var table = $('#datatable-sq').DataTable();
    this.QuoteNo = '';
    this.Status = '';
    this.DateRequested = "";
    this.CustomerId = "";
    this.QuoteType = "";
    this.RRNo = "";
    this.Description = "";
    this.QuoteDate = "";
    this.QuoteDateTo = ""
    this.QuoteDateToDate = "";
    this.QuoteDateDate = "";
    var Customerid = ""
    var CustomerName = "";
    var rrid = ""
    var RRNo = "";
    this.CompanyName = ''
    this.IsDeleted = " "
    this.LocalCurrencyCode = ''
    this.Location = '';
    var CustomerGroupId = "";
    if(this.CustomerGroupId != null || this.CustomerGroupId != ''){
      this.CustomerGroupId = null;
      CustomerGroupId = "";
      this.loadCustomers();
    }
    table.columns(1).search(this.QuoteNo);
    table.columns(7).search(this.Status);
    // table.columns(3).search(CustomerName);
    table.columns(10).search(this.CompanyName);
    table.columns(4).search(this.QuoteType);
    table.columns(2).search(RRNo);
    table.columns(11).search(rrid);
    table.columns(8).search(this.Description);
    table.columns(6).search(this.QuoteDateDate);
    table.columns(9).search(this.QuoteDateToDate);
    table.columns(17).search(this.IsDeleted);
    table.columns(19).search(this.LocalCurrencyCode);
    table.columns(20).search(this.LocalCurrencyCode);
    table.columns(21).search(CustomerGroupId);
    table.draw();
    // this.CustomerId = null;
    // this.QuoteType = undefined;
    // this.Status = undefined;
  }

  onSendEmailofMRO(QuoteId, MROId) {
    this.QuoteList.push({
      QuoteId: QuoteId,
      MROId: MROId
    })
  }
  onSendEmailofRR(QuoteId, RRId) {
    this.QuoteList.push({
      QuoteId: QuoteId,
      RRId: RRId
    })
  }
  onSendEmailFromList() {

    if (this.QuoteList.length == "") {
      Swal.fire({
        title: 'Message',
        text: 'Please Select the Below Sales Quote List before Email',
        type: 'info',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
    } else {
      var postData = {
        "QuoteList": this.QuoteList
      }
      this.commonService.postHttpService(postData, "SendEmailFromQuotesList").subscribe(response => {
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

  onExcelData(QuoteId) {
    this.Quote = this.checkedQuoteIds.find(a => a.checked == true).QuoteId;

    // this.checkedQuoteIds.forEach(item => {
    //   if(item.checked=="true"){
    //     var data=item.QuoteId
    //     this.Quote.push({
    //       data
    //     })
    //   }
    console.log(this.Quote)

    // });

  }
  exportAsXLSX(): void {
    if(this.LocalCurrencyCode!=''){

    var postData = {
      "Quote": this.Quote,
      "RRNo": this.RRNo,
      "QuoteNo": this.QuoteNo,
      "CustomerId": this.CompanyName,
      "Description": this.Description,
      "QuoteDate": this.QuoteDateDate,
      "QuoteDateTo": this.QuoteDateToDate,
      "QuoteType": this.QuoteType,
      "Status": this.Status,
      "LocalCurrencyCode":this.LocalCurrencyCode,
      "CreatedByLocation":this.Location
    }
    this.spinner = true;
    this.commonService.postHttpService(postData, "getQuotesExportToExcel").subscribe(response => {
      if (response.status == true) {
        this.ExcelData = response.responseData.ExcelData;
        this.generateExcelFormat();
        this.spinner = false;

        Swal.fire({
          title: 'Success!',
          text: 'Excel downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        this.spinner = false;
        Swal.fire({
          title: 'Error!',
          text: 'Excel could not be downloaded!',
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
      text: 'Please Choose the Currency for Download Option',
      confirmButtonClass: 'btn btn-confirm mt-2',
    });
  }
  }
  generateExcelFormat() {
    var data = []
    var jsonData = this.ExcelData
    for (var i = 0; i < jsonData.length; i++) {
      var obj = jsonData[i];
      delete jsonData[i].QuoteId;

      var temparray = [];
      for (var key in obj) {
        var value = obj[key];
        temparray.push(value);
      }
      data.push(temparray);
    }

    //Excel Title, Header, Data
    // const title = 'Sales Quote';
    const header = ["RR / MRO #","Quote #", "Part Description", "Serial #", "Customer Name", "PON", "Price", "Vendor Name", "LLP", "Vendor Cost", "AH Cost", "Comment", "Repair Vs New"]
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Data');
    //Add Row and formatting
    // let titleRow = worksheet.addRow([title]);
    // titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true }
    // worksheet.addRow([]);
    // let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')])
    // //Add Image
    // let logo = workbook.addImage({
    //   filename: 'assets/images/ah_logo.png', 
    //    extension: 'png',
    // });
    // worksheet.addImage(logo, 'E1:F3');
    // worksheet.mergeCells('A1:B2');
    //Blank Row 
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
    worksheet.getColumn(2).width = 35;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 10;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 40;
    worksheet.getColumn(12).width = 20;

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
    // worksheet.mergeCells(`A${footerRow.number}:L${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = ('Sales Quote ' + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })


  }


  onbackToGridList() {
    this.navCtrl.navigate('admin/sales-quote/list');
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
      this.service.postHttpService(postData, "RRNoAotoSuggest").subscribe(response => {
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
  clearCustomerEvent($event) {
    this.CustomerId = '';
    this.CompanyName = '';
  }
  onChangeCustomerSearch(val: string) {

    if (val) {
      this.isLoadingCustomer = true;
      var postData = {
        "Customer": val
      }
      this.service.postHttpService(postData, "getAllAutoComplete").subscribe(response => {
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


  onQuoteTypeFilter(value){
    var table = $('#datatable-sq').DataTable();
    table.columns(18).search(value);
    table.draw();
  }


  //Duplicate
onduplicate(QuoteId,QuoteNo) {
  this.modalRef = this.CommonmodalService.show(QuoteDuplicateComponent,
    {
      backdrop: 'static',
      ignoreBackdropClick: false,
      initialState: {
        data: { QuoteId,QuoteNo},
        class: 'modal-lg'
      }, class: 'gray modal-lg'
    });

  this.modalRef.content.closeBtnName = 'Close';
  this.modalRef.content.event.subscribe(res => {
    this.reLoad()
  });
}

reLoad() {
  this.router.navigate([this.currentRouter])
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
  return this.service.postHttpService(postData, "getAllAutoComplete")
    .pipe(
      map(response => {
        this.CustomersList = response.responseData;
        this.loadingCustomers = false;
        return response.responseData;
      })
    );
}
getAHGroupaddress() {
  var postData = {
    "IdentityId": CONST_AH_Group_ID,
    "IdentityType": 2,
    "Type": CONST_ContactAddressType

  }
  this.service.postHttpService(postData, 'getAddressList').subscribe(response => {
    this.AHAddressList = response.responseData[0];
  })
}
getAdminSettingsView() {
  var postData = {}
  this.service.postHttpService(postData, "getSettingsGeneralView").subscribe(response => {
    if (response.status == true) {
      this.settingsView = response.responseData;

    }
    else {

    }
    this.cd_ref.detectChanges();
  }, error => console.log(error));
}
  sendMail() {
    this.loader.show();
    console.log(this.Quote);
    this.service.getLogoAsBas64().then((base64) => {
    var customers = this.Quote.map(item => item.CustomerId).filter((value, index, self) => self.indexOf(value) === index);
    if(customers.length == 1){
      var postData = {
        Logo: base64,
        Quote: this.Quote,
        IsSONotesEnabled: this.IsSONotesEnabled,
        AHAddressList: this.AHAddressList,
        settingsView: this.settingsView
      }
      this.service.postHttpService(postData, "getSQMultiplePdfBase64").subscribe(response => {
        console.log(response.responseData.pdfBase64);
        if (response.status == true) {
          this.loader.hide();
          var ImportedAttachment = [];
          var pdfBase64 = response.responseData.pdfBase64;
          if(pdfBase64.length > 0){
            pdfBase64.forEach(ele => {
              var number: any;
              if (ele != 0) {
                number = ele.RRNo
              }
              if (ele.RRId == 0) {
                number = ele.QuoteNo
              }
              if (ele.MROId != 0 || ele.MROId != '') {
                number = ele.MRONo
              }
              if (ele.RRId != 0) {
                var fileName = `Repair Quote ${number}.pdf`;
              }
              else {
                var fileName = `Sales Quote ${number}.pdf`;
              }
              ImportedAttachment.push(
                { path: `data:application/pdf;filename=generated.pdf;base64,${ele.pdfSource}`, filename: fileName }
              );
            })
            var RRId = this.RRId
            var IdentityId = 0;
            var IdentityType = CONST_IDENTITY_TYPE_QUOTE
            var followupName = "Quotes";
            this.modalRef = this.CommonmodalService.show(EmailComponent,
              {
                backdrop: 'static',
                ignoreBackdropClick: false,
                initialState: {
                  data: { followupName, IdentityId, IdentityType, RRId, ImportedAttachment },
                  class: 'modal-lg'
                }, class: 'gray modal-lg'
            });
    
            this.modalRef.content.closeBtnName = 'Close';
    
            this.modalRef.content.event.subscribe(res => {
              this.resetDataTables();
              // this.reLoad();
            });
          }else{
            this.loader.hide();
            this.resetDataTables();
            Swal.fire({
              title: 'Info!',
              text: "Something went wrong. Please try again!",
              type: 'info'
            });
          }
        }else{
          this.loader.hide();
          this.resetDataTables();
          Swal.fire({
            title: 'Info!',
            text: response.message,
            type: 'info'
          });
        }
      });
    }else if(customers.length == 0) {
      this.loader.hide();
      Swal.fire({
        title: 'Info!',
        text: "Please select Quote's to send mail!",
        type: 'info'
      });
    }
    else{
      this.loader.hide();
      this.resetDataTables();
      Swal.fire({
        title: 'Info!',
        text: "Multiple customer's Quote selected. Please select the single customer Quote!",
        type: 'info'
      });
    }
  })
  }
  resetDataTables(){
    this.QuoteItem.map(a => a.checked = false);
    $('#datatable-sq').DataTable().ajax.reload();
  }
}
