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
import { CONST_COST_HIDE_VALUE, CONST_CREATE_ACCESS, CONST_DELETE_ACCESS, CONST_MODIFY_ACCESS, CONST_VIEW_ACCESS, CONST_VIEW_COST_ACCESS, SalesOrder_Status, SalesOrder_Type } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import { event } from 'jquery';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-list-so',
  templateUrl: './list-so.component.html',
  styleUrls: ['./list-so.component.scss']
})
export class ListSoComponent implements OnInit {
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  public CompanyName: any = [];
  IsDeleted=''
  IsConvertedToInvoice=''
  keywordForCustomer = 'CompanyName';
  customerList: any = [];
  isLoadingCustomer: boolean = false;
  keywordForRR = 'RRNo';
  RRList: any[]
  RRId = ''
  isLoadingRR: boolean = false;
  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;
  IsPrintPDFEnabled;
  IsEmailEnabled;
  IsExcelEnabled;
  //FILTER
  Created;
  CustomerId;
  Status='';
  SalesOrderStatus;
  DateRequested;
  SOType='';
  RRNo;
  SONo;
  QuoteNo;
  UserId;
  CustomerPONo;
  ReferenceNO;
  Requesteddate;
  RequestedDateTo;
  Duedate;
  DueDateTo;
  RequesteddateDate;
  RequestedDateToDate;
  DuedateDate;
  DueDateToDate;
  RequestedId;
  SalesOrderType: any = []
  SalesOrder: any = [];
  ExcelData: any = [];
  CustomerList;
  adminList
  //ServerSide List
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  api_check: any;
  dataTable: any;
  baseUrl = `${environment.api.apiURL}`;
  SOList: any = []


  gridCheckAll: boolean = false;
  SODataItem:any=[]
  checkedQuoteIds = [];
  uncheckedQuoteIds = [];
  QuoteItem = [];
  rowcheck: boolean = false;
  spinner: boolean = false;
  DownloadOptionSOList
  CurrencyList:any=[]
  LocalCurrencyCode
  Location=''
  countryList:any=[]
  CustomerGroupId: any;
  customerGroupList: any;
  initLoad: boolean = true;
  constructor(private http: HttpClient, public router: Router, public navCtrl: NgxNavigationWithDataComponent,
    private modalService: NgbModal, private commonService: CommonService, private cd_ref: ChangeDetectorRef,
    private datePipe: DatePipe,) { }
  async ngOnInit(): Promise<void> {
    document.title='SO List'
    this.SalesOrderStatus = SalesOrder_Status;
    this.SalesOrderType = SalesOrder_Type;
    this.LocalCurrencyCode = '';

    this.IsViewEnabled = this.commonService.permissionCheck("ManageSalesOrder", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.commonService.permissionCheck("ManageSalesOrder", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.commonService.permissionCheck("ManageSalesOrder", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.commonService.permissionCheck("ManageSalesOrder", CONST_DELETE_ACCESS);
    this.IsViewCostEnabled = this.commonService.permissionCheck("ManageSalesOrder", CONST_VIEW_COST_ACCESS);
    this.IsPrintPDFEnabled = this.commonService.permissionCheck("SOPrintAndPDFExport", CONST_VIEW_ACCESS);
    this.IsEmailEnabled = this.commonService.permissionCheck("SOEmail", CONST_VIEW_ACCESS);
    this.DownloadOptionSOList = this.commonService.permissionCheck("DownloadOptionSOList", CONST_VIEW_ACCESS);
    this.IsDeleted = "0";
    await this.getList();
    
  }

  async getList(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/SalesOrder/getSaleListByServerSide';
    const that = this;
    var filterData = {}
    if(this.DownloadOptionSOList){
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

            that.SODataItem = resp.responseData.data;

            that.SODataItem.forEach(item => {
              item.checked = this.isQuoteChecked(item.SOId);
            });
            if(this.initLoad){
              this.getAdminList();
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
              data: that.SODataItem
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
      ],
      'select': {
        'style': 'multi'
      },
      createdRow: function (row, data, index) {

        // Set the Quote Type
        var TypeStyle = SalesOrder_Type.find(a => a.SalesOrder_TypeId == data.SOType)
        var html = '<span class="badge ' + (TypeStyle ? TypeStyle.cstyle : 'btn-xs"') + '">' + (TypeStyle ? TypeStyle.SalesOrder_TypeName : '') + '</span>'
        $('td', row).eq(4).html(html);

        var html = `<input type="checkbox" class="checkbox"  ${data.checked ? 'checked' : ''}  (change)="rowCheckBoxChecked($event, ${data.SOId})">`;
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


    

        // Set the Status
        var cstyle = '';
        switch (data.Status) {
          case 1: { cstyle = 'badge-warning'; status = "Open"; break; }
          case 2: { cstyle = 'badge-success'; status = "Approved"; break; }
          case 3: { cstyle = 'badge-danger'; status = "Cancelled"; break; }
          case 4: { cstyle = 'badge-light'; status = "On Hold"; break; }
          case 5: { cstyle = 'badge-info'; status = "Draft"; break; }

          default: { cstyle = ''; status = ""; break; }
        }
        var html = '<span class="badge ' + cstyle + ' btn-xs">' + status + '</span>';
        $('td', row).eq(7).html(html);


        //Set Grand Total
        var html = '<span>' + data.CurrencySymbol+ " " + data.GrandTotal + '</span>'
        $('td', row).eq(5).html(html);

      },
      columns: [
        {
          data: 'SOId', name: 'SOId', defaultContent: '', orderable: false, searchable: true,
        },
        {
          data: 'SONo', name: 'SONo', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.IsDeleted == 0) {

              if (this.IsViewEnabled) {
                return `<a href="#/admin/orders/sales-list?SOId=${row.SOId}&IsDeleted=0" target="_blank"  data-toggle='tooltip' title='SO View' data-placement='top'>${row.SONo}</a>`;
              } else {
                return '<a  ngbTooltip="View">' + row.SONo + '</a>';
              }
            }
            else {
              if (this.IsViewEnabled) {
                return `<a href="#/admin/orders/sales-list?SOId=${row.SOId}&IsDeleted=1" target="_blank" data-toggle='tooltip' title='SO View' data-placement='top'>${row.SONo}</a>`;
              } else {
                return '<a  ngbTooltip="View">' + row.SONo + '</a>';
              }
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
        { data: 'CompanyName', name: 'CompanyName', orderable: true, searchable: true, },
        { data: 'SOType', name: 'SOType', orderable: true, searchable: true, },
        { data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true, },
        { data: 'DateRequested', name: 'DateRequested', orderable: true, searchable: true, },
        { data: 'Status', name: 'Status', orderable: true, searchable: true, },
        { data: 'CustomerId', name: 'CustomerId', orderable: true, searchable: true, },
        { data: 'QuoteNo', name: 'QuoteNo', orderable: true, searchable: true, },
        { data: 'RequestedById', name: 'RequestedById', orderable: true, searchable: true, },
        { data: 'ApprovedById', name: 'ApprovedById', orderable: true, searchable: true, },
        { data: 'CustomerPONo', name: 'CustomerPONo', orderable: true, searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          var link = '';
          if (row.CustomerBlanketPOId != 0) {
            link += `<a  href="#/admin/Blanket-PO-History?CustomerBlanketPOId=${row.CustomerBlanketPOId}"  target="_blank"   data-toggle= 'tooltip' title='Blanket PO' data-placement= 'top'>${row.CustomerPONo}</a>`;
          }
          else if (row.CustomerPONo!=  null){
            link += `<a>${row.CustomerPONo}</a>`;
          }
          return link;
        } },
        { data: 'ReferenceNo', name: 'ReferenceNo', orderable: true, searchable: true, },
        { data: 'DueDateTo', name: 'DueDateTo', orderable: true, searchable: true, },
        { data: 'DueDate', name: 'DueDate', orderable: true, searchable: true, },
        { data: 'DateRequestedTo', name: 'DateRequestedTo', orderable: true, searchable: true, },
        { data: 'RRId', name: 'RRId', orderable: true, searchable: true, },

        {
          data: 'SOId', name: 'SOId', defaultContent: '', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            if (row.IsDeleted == 0) {
              if (this.IsViewEnabled) {
                actiontext += `<a href="#/admin/orders/sales-list?SOId=${row.SOId}&IsDeleted=0" target="_blank" class="fa fa-eye text-secondary" data-toggle='tooltip' title='SO View' data-placement='top'></a>&nbsp;`;
              }
              if (this.IsEditEnabled) {
                actiontext += `<a href="#/admin/sales-order/edit?SOId=${row.SOId}" target="_blank" class="fa fa-edit text-secondary" data-toggle='tooltip' title='SO Edit' data-placement='top'></a> &nbsp;`;
              }
              if (this.IsDeleteEnabled) {
                actiontext += `<a href="#" class="fa fa-trash text-danger actionView3" data-toggle='tooltip' title='SO Delete' data-placement='top'></a>`;
              }
            }
            else {
              if (this.IsViewEnabled) {
                actiontext += `<a href="#/admin/orders/sales-list?SOId=${row.SOId}&IsDeleted=1" target="_blank" class="fa fa-eye text-secondary"data-toggle='tooltip' title='SO View' data-placement='top'></a>&nbsp;`;
              }
            }
            return actiontext;
          }
        },
        { data: 'IsDeleted', name: 'IsDeleted', orderable: true, searchable: true, },

        { data: 'IsConvertedToInvoice', name: 'IsConvertedToInvoice', orderable: true, searchable: true, },
        { data: 'LocalCurrencyCode', name: 'LocalCurrencyCode', orderable: true, searchable: true, },
        { data: 'CreatedByLocation', name: 'CreatedByLocation', orderable: true, searchable: true, },
        { data: 'CustomerGroupId', name: 'CustomerGroupId', orderable: true, searchable: true, },

      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {

        $('.actionView', row).unbind('click');
        $('.actionView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['admin/orders/sales-list'], { state: { SOId: data.SOId, showList: true } })

          //this.navCtrl.navigate('admin/orders/sales-list', { SOId: data.SOId, showList: true });
        });

        $('.actionDeleteView', row).unbind('click');
        $('.actionDeleteView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['admin/orders/sales-list'], { state: { SOId: data.SOId, showList: true, IsDeleted: data.IsDeleted } })
          // this.navCtrl.navigate('admin/orders/sales-list', { SOId: data.SOId, showList: true, IsDeleted: data.IsDeleted });
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
          this.navCtrl.navigate('admin/sales-order/edit', { SOId: data.SOId });
        });

        $('.actionView3', row).unbind('click');
        $('.actionView3', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDelete(data.SOId,data.RRId);
        });


        $('.checkbox', row).unbind('click');
        $('.checkbox', row).bind('click', (e) => {
          this.rowCheckBoxChecked(e,data.SOId,data.RRNo, data.MRONo)
          // if (data.RRNo != '' && data.RRNo != '0' && data.RRNo != null) {
          //   this.onSendEmailofRR(data.SOId, data.RRId)
          // } else if (data.MRONo != '' && data.MRONo != '0' && data.MRONo != null) {
          //   this.onSendEmailofMRO(data.SOId, data.MROId)

          // }
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

    this.onFilter(event);
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
  private isQuoteChecked(SOId) {
    this.SalesOrder = [];
    if (!this.gridCheckAll) {
     return this.checkedQuoteIds.indexOf(SOId) >= 0 ? true : false;     
    } else {
      this.SODataItem.map(a => a.checked = true);
      this.SalesOrder = this.SODataItem.map(a => { return { SOId: a.SOId } });  
     return this.uncheckedQuoteIds.indexOf(SOId) >= 0 ? false : true;

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
      this.SODataItem.map(a => a.checked = true);
      this.SalesOrder = this.SODataItem.map(a => { return { SOId: a.SOId } });

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
      this.SODataItem.map(a => a.checked = false);
      // this.QuoteList = [];
      this.SalesOrder = [];
    }
    $('#datatable-angular').DataTable().ajax.reload();
  }

  rowCheckBoxChecked(e, SOId, RRNo, MRONo) {
    if (e.target.checked) {
      this.SalesOrder.push({ SOId });

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
      this.SalesOrder = this.SalesOrder.filter(a => a.SOId != SOId);
      // this.QuoteList = this.QuoteList.filter(a => a.QuoteId != QuoteId);
    }
  }


  getAdminList() {
    this.commonService.getHttpService('getAllActiveAdmin').subscribe(response => {//getAdminListDropdown
      this.adminList = response.responseData.map(function (value) {
        return { title: value.FirstName + " - " + value.LastName, "UserId": value.UserId }
      });
    });
  }

  RequesteddateFormat(Requesteddate) {
    if(Requesteddate!=null){
    const RequesteddateYears = Requesteddate.year;
    const RequesteddateDates = Requesteddate.day;
    const Requesteddatemonths = Requesteddate.month;
    let RequesteddateDate = new Date(RequesteddateYears, Requesteddatemonths - 1, RequesteddateDates);
    this.RequesteddateDate = moment(RequesteddateDate).format('YYYY-MM-DD');
    }else{
      this.RequesteddateDate = ''
    }
  }
  RequestedDateToFormat(RequestedDateTo) {
    if(RequestedDateTo!=null){
    const RequestedDateToYears = RequestedDateTo.year;
    const RequestedDateToDates = RequestedDateTo.day;
    const RequestedDateTomonths = RequestedDateTo.month;
    let RequestedDateToDate = new Date(RequestedDateToYears, RequestedDateTomonths - 1, RequestedDateToDates);
    this.RequestedDateToDate = moment(RequestedDateToDate).format('YYYY-MM-DD')
    }else{
      this.RequestedDateToDate = ''
    }
  }

  DuedateFormat(Duedate) {
    if(Duedate!=null){
    const DuedateYears = Duedate.year;
    const DuedateDates = Duedate.day;
    const Duedatemonths = Duedate.month;
    let DuedateDate = new Date(DuedateYears, Duedatemonths - 1, DuedateDates);
    this.DuedateDate = moment(DuedateDate).format('YYYY-MM-DD')
    }else{
      this.DuedateDate = ''
    }
  }

  DueDateToFormat(DueDateTo) {
    if(DueDateTo!=null){
    const DueDateToYears = DueDateTo.year;
    const DueDateToDates = DueDateTo.day;
    const DueDateTomonths = DueDateTo.month;
    let DueDateToDate = new Date(DueDateToYears, DueDateTomonths - 1, DueDateToDates);
    this.DueDateToDate = moment(DueDateToDate).format('YYYY-MM-DD')
    }else{
      this.DueDateToDate = ''
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
    if(this.CustomerGroupId == null){
      this.CustomerGroupId = "";
    }
    let obj = this
    var table = $('#datatable-angular').DataTable();
    table.columns(1).search(this.SONo);
    table.columns(7).search(this.Status);
    table.columns(6).search(this.RequesteddateDate);
    table.columns(8).search(this.CompanyName);
    table.columns(4).search(this.SOType);
    // table.columns(3).search(CustomerName);
    table.columns(2).search(RRNo);
    table.columns(9).search(this.QuoteNo);
    table.columns(10).search(this.RequestedId);
    table.columns(11).search(this.UserId);
    table.columns(12).search(this.CustomerPONo);
    table.columns(13).search(this.ReferenceNO);
    table.columns(14).search(this.DueDateToDate);
    table.columns(15).search(this.DuedateDate);
    table.columns(16).search(this.RequestedDateToDate);
    table.columns(17).search(rrid);
    table.columns(19).search(this.IsDeleted);
    table.columns(20).search(this.IsConvertedToInvoice);
    table.columns(21).search(this.LocalCurrencyCode);
    table.columns(22).search(this.Location);
    table.columns(23).search(this.CustomerGroupId);
    table.draw();
  }

  onClear(event) {
    var table = $('#datatable-angular').DataTable();
    this.SONo = '';
    this.CustomerId = '';
    this.Status = '';
    this.Created = '';
    this.DateRequested = "";
    this.RRNo = '';
    this.SOType = "";
    this.QuoteNo = "";
    this.CustomerPONo = "";
    this.ReferenceNO = "";
    this.UserId = "";
    this.RequesteddateDate = "";
    this.RequestedDateToDate = "";
    this.DueDateToDate = "";
    this.DuedateDate = "";
    this.RequestedId = "";
    this.Requesteddate = "";
    this.RequestedDateTo = "";
    this.Duedate = "";
    this.DueDateTo = "";
    var Customerid = ""
    var CustomerName = "";
    var rrid = ""
    var RRNo = "";
    this.CompanyName = ''
    this.IsDeleted = ''
    this.IsConvertedToInvoice = ''
    this.LocalCurrencyCode = ''
    this.Location = ''
    this.RRId = ''
    var CustomerGroupId = "";
    if(this.CustomerGroupId != null || this.CustomerGroupId != ''){
      this.CustomerGroupId = null;
      CustomerGroupId = "";
      this.loadCustomers();
    }
    var table = $('#datatable-angular').DataTable();
    table.columns(1).search(this.SONo);
    table.columns(7).search(this.Status);
    table.columns(6).search(this.RequesteddateDate);
    table.columns(8).search(this.CompanyName);
    table.columns(4).search(this.SOType);
    // table.columns(3).search(CustomerName);
    table.columns(2).search(RRNo);
    table.columns(9).search(this.QuoteNo);
    table.columns(10).search(this.RequestedId);
    table.columns(11).search(this.UserId);
    table.columns(12).search(this.CustomerPONo);
    table.columns(13).search(this.ReferenceNO);
    table.columns(14).search(this.DueDateToDate);
    table.columns(15).search(this.DuedateDate);
    table.columns(16).search(this.RequestedDateToDate);
    table.columns(17).search(rrid);
    table.columns(19).search(this.IsDeleted);
    table.columns(20).search(this.IsConvertedToInvoice);
    table.columns(21).search(this.LocalCurrencyCode);
    table.columns(22).search(this.Location);
    table.columns(23).search(CustomerGroupId);
    table.draw();
  }


  onDelete(SOId,RRId) {
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
          SOId: SOId,
          RRId:RRId
        }
        this.commonService.postHttpService(postData, 'DeleteSO').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Sales Order has been deleted.',
              type: 'success'
            });
            var table = $('#datatable-angular').DataTable();
            table.draw();
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Sales Order  is safe:)',
          type: 'error'
        });
      }
    });

  }
  onSendEmail(SOId) {
    this.SOList.push({
      SOId
    })
  }


  onSendEmailofMRO(SOId, MROId) {
    this.SOList.push({
      SOId: SOId,
      MROId: MROId
    })
  }
  onSendEmailofRR(SOId, RRId) {
    this.SOList.push({
      SOId: SOId,
      RRId: RRId
    })
  }
  onSendEmailFromList() {
    if (this.SOList.length == "") {
      Swal.fire({
        title: 'Message',
        text: 'Please Select the Below Sales Order List before Email',
        type: 'info',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
    } else {
      var postData = {
        "SOList": this.SOList
      }
      this.commonService.postHttpService(postData, "SendEmailFromSOList").subscribe(response => {
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


  onExcelData(SOId) {
    this.SalesOrder = this.checkedQuoteIds.find(a => a.checked == true).QuoteId;

    // this.SalesOrder.push({
    //   SOId
    // })
  }
  exportAsXLSX(): void {
    if(this.LocalCurrencyCode!=''){

    var postData = {
      "SalesOrder": this.SalesOrder,
      "RRNo": this.RRNo,
      "SONo": this.SONo,
      "CustomerId": this.CompanyName,
      "QuoteNo": this.QuoteNo,
      "RequestedById": this.RequestedId,
      "ApprovedById": this.UserId,
      "CustomerPONo": this.CustomerPONo,
      "ReferenceNo": this.ReferenceNO,
      "DateRequested": this.RequesteddateDate,
      "DateRequestedTo": this.RequestedDateToDate,
      "DueDate": this.DuedateDate,
      "DueDateTo": this.DueDateToDate,
      "SOType": this.SOType,
      "IsConvertedToInvoice":this.IsConvertedToInvoice,
      "LocalCurrencyCode":this.LocalCurrencyCode,
      "CreatedByLocation":this.Location
    }
    this.spinner =  true
    this.commonService.postHttpService(postData, "getSOExportToExcel").subscribe(response => {
      if (response.status == true) {
        this.ExcelData = response.responseData.ExcelData;
        this.generateExcelFormat();
        this.spinner =  false
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
      var temparray = [];
      for (var key in obj) {
        var value = obj[key];
        temparray.push(value);
      }
      data.push(temparray);
    }

    //Excel Title, Header, Data
    const title = 'Sales Order';
    const header = ["RR #", "SO #", "Customer Name", "Quote #", "Requested By Name", "Approved By Name", "Customer PO No", "Reference No", "Date Requested", "Due Date", "Grand Total", "Status", "SO Type"]
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
    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 15;
    worksheet.getColumn(12).width = 20;
    worksheet.getColumn(13).width = 15;
    worksheet.getColumn(14).width = 15;

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
    // worksheet.mergeCells(`A${footerRow.number}:M${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = ('Sales Order ' + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })


  }

  onbackToGridList() {
    this.navCtrl.navigate('admin/orders/sales-list');
  }

  //AutoComplete for RR
  selectRREvent($event) {
    this.RRId = $event.RRId;
  }
  clearRREvent($event) {
    this.RRId = '';
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
  clearCustomerEvent($event) {
    this.CustomerId = '';
    this.CompanyName = ''
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

  onApproved(e,UserId){
    if(UserId==null){
      this.UserId = ''
    }
  }
  onRequested(e,value){
    if(value==null){
      this.RequestedId = ''
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
