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
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { CONST_APPROVE_ACCESS, CONST_COST_HIDE_VALUE, CONST_CREATE_ACCESS, CONST_DELETE_ACCESS, CONST_MODIFY_ACCESS, CONST_VIEW_ACCESS, CONST_VIEW_COST_ACCESS, PurchaseOrder_Status, PurchaseOrder_Type } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import Swal from 'sweetalert2';
import * as moment from 'moment';
@Component({
  selector: 'app-list-po',
  templateUrl: './list-po.component.html',
  styleUrls: ['./list-po.component.scss']
})
export class ListPoComponent implements OnInit {

  IsDeleted=''
  keywordForVendor = 'VendorName';
  VendorsList: any[];
  VendorName;
  isLoadingVendor: boolean = false;
  keywordForRR = 'RRNo';
  RRList: any[]
  RRId = ''
  isLoadingRR: boolean = false;
  //FILTER
  Created;
  VendorId = '';
  PONo;
  Status;
  PuchaseOrderStatus
  DateRequested;
  POType='';
  RRNo;
  RequestedId;
  Duedate;
  DueDateTo;
  Requesteddate;
  RequestedDateTo;
  UserId;
  RequesteddateDate;
  RequestedDateToDate;
  DuedateDate;
  DueDateToDate;
  IsEmailSent;
  status='';
  PurchaseOrder: any = [];
  ExcelData: any = [];
  POList: any = [];
  vendorList;
  adminList;
  //ServerSide List
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  api_check: any;
  dataTable: any;

  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;
  IsPrintPDFEnabled;
  IsEmailEnabled;
  IsExcelEnabled;
  IsConvertSOToInvoiceEnabled;
  IsNotesEnabled;
  IsApproveEnabled;
  baseUrl = `${environment.api.apiURL}`;
  PurchaseOrderType: any = []


  gridCheckAll: boolean = false;
  PODataItem:any=[]
  checkedQuoteIds = [];
  uncheckedQuoteIds = [];
  QuoteItem = [];
  rowcheck: boolean = false;
  spinner: boolean = false;
  DownloadOptionPOList
  CurrencyList:any=[]
  LocalCurrencyCode
  Location=''
  countryList:any=[];
  initLoad: boolean = true;
  constructor(private http: HttpClient, public router: Router, public navCtrl: NgxNavigationWithDataComponent,
    private modalService: NgbModal, private commonService: CommonService, private cd_ref: ChangeDetectorRef,
    private datePipe: DatePipe,) { }
  ngOnInit(): void {
    document.title='PO List'
    this.PuchaseOrderStatus = PurchaseOrder_Status;
    this.PurchaseOrderType = PurchaseOrder_Type;
    this.IsDeleted = "0"
    this.LocalCurrencyCode = '';

    this.IsViewEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_DELETE_ACCESS);
    this.IsViewCostEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_VIEW_COST_ACCESS);
    this.IsApproveEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_APPROVE_ACCESS);
    this.IsPrintPDFEnabled = this.commonService.permissionCheck("POPrintAndPDFExport", CONST_VIEW_ACCESS);
    this.IsEmailEnabled = this.commonService.permissionCheck("POEmail", CONST_VIEW_ACCESS);
    this.DownloadOptionPOList = this.commonService.permissionCheck("DownloadOptionPOList", CONST_VIEW_ACCESS);
    this.getList();    
  }
  getList(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/PurchaseOrder/getPurchaseListByServerSide';
    const that = this;
    var filterData = {};
    if(this.DownloadOptionPOList){
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

            that.PODataItem = resp.responseData.data;

            that.PODataItem.forEach(item => {
              item.checked = this.isQuoteChecked(item.POId);
            });
            if(this.initLoad){
              this.getAdminList();
              this.getCurrencyList();
              this.getCountryList();
            }
            this.initLoad = false;
            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: that.PODataItem
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
          "targets": [18],
          "visible": false,
          "searchable": true
        },
      ],
      'select': {
        'style': 'multi'
      }, 
      createdRow: function (row, data, index) {

        // Set the Quote Type
        var TypeStyle = PurchaseOrder_Type.find(a => a.PurchaseOrder_TypeId == data.POType)
        var html = '<span class="badge ' + (TypeStyle ? TypeStyle.cstyle : 'btn-xs"') + '">' + (TypeStyle ? TypeStyle.PurchaseOrder_TypeName : '') + '</span>'
        $('td', row).eq(4).html(html);

        var html = `<input type="checkbox" class="checkbox"  ${data.checked ? 'checked' : ''}  (change)="rowCheckBoxChecked($event, ${data.POId})">`;
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
        var Status = PurchaseOrder_Status.find(a => a.PurchaseOrder_StateId == data.Status)
        var html = '<span class="badge ' + (Status ? Status.cstyle : 'btn-xs"') + '">' + (Status ? Status.PurchaseOrder_StateName : '') + '</span>'
        $('td', row).eq(7).html(html);



        var html = '<span>' +data.CurrencySymbol+ " " + data.GrandTotal + '</span>'
        $('td', row).eq(5).html(html);

      },
      columns: [
        {
          data: 'POId', name: 'POId', defaultContent: '',orderable: false, searchable: true,

        },
        {
          data: 'PONo', name: 'PONo', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.IsDeleted == 0) {

              if (this.IsViewEnabled) {
                return `<a href="#/admin/orders/purchase-list?POId=${row.POId}&IsDeleted=0" target="_blank"  data-toggle='tooltip' title='PO View' data-placement='top'>${row.PONo}</a>`;
              } else {
                return '<a  ngbTooltip="View">' + row.PONo + '</a>';
              }
            }
            if (this.IsViewEnabled) {
              return `<a href="#/admin/orders/purchase-list?POId=${row.POId}&IsDeleted=1" target="_blank" data-toggle='tooltip' title='PO View' data-placement='top'>${row.PONo}</a>`;
            } else {
              return '<a  ngbTooltip="View">' + row.PONo + '</a>';
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
        { data: 'POType', name: 'POType', orderable: true, searchable: true, },
        { data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true, },
        { data: 'DateRequested', name: 'DateRequested', orderable: true, searchable: true, },
        { data: 'Status', name: 'Status', orderable: true, searchable: true, },
        { data: 'VendorId', name: 'VendorId', orderable: true, searchable: true, },
        { data: 'DateRequestedTo', name: 'DateRequestedTo', orderable: true, searchable: true, },
        { data: 'DueDate', name: 'DueDate', orderable: true, searchable: true, },
        { data: 'DueDateTo', name: 'DueDateTo', orderable: true, searchable: true, },
        { data: 'RequestedById', name: 'RequestedById', orderable: true, searchable: true, },
        { data: 'ApprovedById', name: 'ApprovedById', orderable: true, searchable: true, },
        { data: 'RRId', name: 'RRId', orderable: true, searchable: true, },

        {
          data: 'POId', name: 'POId', defaultContent: '', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            if (row.IsDeleted == 0) {
              if (this.IsViewEnabled) {
                actiontext += `<a href="#/admin/orders/purchase-list?POId=${row.POId}&IsDeleted=0" target="_blank" class="fa fa-eye text-secondary" data-toggle='tooltip' title='PO View' data-placement='top'></a>&nbsp;`;
              }
              if (this.IsEditEnabled) {
                actiontext += `<a href="#/admin/purchase-order/edit?POId=${row.POId}"  target="_blank" class="fa fa-edit text-secondary" data-toggle='tooltip' title='PO Edit' data-placement='top'></a> &nbsp;`;
              }
              if (this.IsDeleteEnabled) {
                actiontext += `<a href="#" class="fa fa-trash text-danger actionView3" data-toggle='tooltip' title='PO Delete' data-placement='top'></a>`;
              }
            }
            else {
              if (this.IsViewEnabled) {
                actiontext += `<a href="#/admin/orders/purchase-list?POId=${row.POId}&IsDeleted=1" target="_blank" class="fa fa-eye text-secondary" data-toggle='tooltip' title='PO View' data-placement='top'></a>&nbsp;`;
              }
            }

            return actiontext;
          }
        },
        { data: 'IsDeleted', name: 'IsDeleted', orderable: true, searchable: true, },
        { data: 'LocalCurrencyCode', name: 'LocalCurrencyCode', orderable: true, searchable: true, },
        { data: 'CreatedByLocation', name: 'CreatedByLocation', orderable: true, searchable: true, },


      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {

        $('.actionView', row).unbind('click');
        $('.actionView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['admin/orders/purchase-list'], { state: { POId: data.POId, showList: true } });
        });


        $('.actionDeleteView', row).unbind('click');
        $('.actionDeleteView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['admin/orders/purchase-list'], { state: { POId: data.POId, showList: true, IsDeleted: data.IsDeleted } });
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
          this.navCtrl.navigate('admin/purchase-order/edit', { POId: data.POId });
        });

        $('.actionView3', row).unbind('click');
        $('.actionView3', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDelete(data.POId);
        });


        $('.checkbox', row).unbind('click');
        $('.checkbox', row).bind('click', (e) => {
          this.rowCheckBoxChecked(e,data.POId,data.RRNo, data.MRONo)

          // this.onExcelData(data.POId)

          // this.onSendEmail(data.POId)
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
    this.commonService.getHttpService('Currencyddl').subscribe(response => {
      if (response.status == true) {
        this.CurrencyList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  private isQuoteChecked(POId) {
    this.PurchaseOrder = [];
    if (!this.gridCheckAll) {
      return this.checkedQuoteIds.indexOf(POId) >= 0 ? true : false;
    } else {
      this.PODataItem.map(a => a.checked = true);
      this.PurchaseOrder = this.PODataItem.map(a => { return { POId: a.POId } });
      return this.uncheckedQuoteIds.indexOf(POId) >= 0 ? false : true;
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
      this.PODataItem.map(a => a.checked = true);
      this.PurchaseOrder = this.PODataItem.map(a => { return { POId: a.POId } });

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
      this.PODataItem.map(a => a.checked = false);
      // this.QuoteList = [];
      this.PurchaseOrder = [];
    }
    $('#datatable-angular').DataTable().ajax.reload();
  }

  rowCheckBoxChecked(e, POId, RRNo, MRONo) {
    if (e.target.checked) {
      this.PurchaseOrder.push({ POId });

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
      this.PurchaseOrder = this.PurchaseOrder.filter(a => a.POId != POId);
      // this.QuoteList = this.QuoteList.filter(a => a.QuoteId != QuoteId);
    }
  }
  getAdminList() {
    this.commonService.getHttpService('getAllActiveAdmin').subscribe(response => {
      this.adminList = response.responseData.map(function (value) {
        return { title: value.FirstName + " - " + value.LastName, "UserId": value.UserId }
      });
    });
  }
  onDelete(POId) {
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
          POId: POId,
        }
        this.commonService.postHttpService(postData, 'DeletePO').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Purchase Order has been deleted.',
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
          text: 'Purchase Order  is safe:)',
          type: 'error'
        });
      }
    });

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
    var table = $('#datatable-angular').DataTable();
    table.columns(1).search(this.PONo);
    table.columns(7).search(this.status);
    table.columns(6).search(this.RequesteddateDate);
    table.columns(3).search(vendorName);
    table.columns(8).search(vendorid);
    table.columns(4).search(this.POType);
    table.columns(2).search(RRNo);
    table.columns(14).search(rrid);
    table.columns(12).search(this.RequestedId);
    table.columns(13).search(this.UserId);
    table.columns(11).search(this.DueDateToDate);
    table.columns(10).search(this.DuedateDate);
    table.columns(9).search(this.RequestedDateToDate);
    table.columns(16).search(this.IsDeleted);
    table.columns(17).search(this.LocalCurrencyCode);
    table.columns(18).search(this.Location);
    table.draw();

  }

  onClear(event) {
    var table = $('#datatable-angular').DataTable();
    this.VendorId = "";
    this.PONo = '';
    this.status = '';
    this.Created = "";
    this.DateRequested = "";
    this.RRNo = "";
    this.POType = "";
    this.VendorId = ""
    this.IsEmailSent = "";
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
    var vendorid = ""
    var vendorName = "";
    var rrid = ""
    var RRNo = "";
    this.RRNo = '';
    this.VendorName = ''
    this.IsDeleted = ""
    this.LocalCurrencyCode=''
    this.Location=''
    this.RRId = ''
    table.columns(1).search(this.PONo);
    table.columns(7).search(this.status);
    table.columns(6).search(this.RequesteddateDate);
    table.columns(3).search(vendorName);
    table.columns(8).search(vendorid);
    table.columns(4).search(this.POType);
    table.columns(2).search(RRNo);
    table.columns(14).search(rrid);
    table.columns(12).search(this.RequestedId);
    table.columns(13).search(this.UserId);
    table.columns(11).search(this.DueDateToDate);
    table.columns(10).search(this.DuedateDate);
    table.columns(9).search(this.RequestedDateToDate);
    table.columns(16).search(this.IsDeleted);
    table.columns(17).search(this.LocalCurrencyCode);
    table.columns(18).search(this.Location);
    table.draw();
  }
  onSendEmail(POId) {
    this.POList.push({
      POId
    })
  }
  onSendEmailFromList() {

    if (this.POList.length == "") {
      Swal.fire({
        title: 'Message',
        text: 'Please Select the Below Purchase Order List before Email',
        type: 'info',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
    } else {
      var postData = {
        "POList": this.POList,
      }
      this.commonService.postHttpService(postData, "SendEmailFromPOList").subscribe(response => {
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

  onExcelData(POId) {
    this.PurchaseOrder.push({
      POId
    })
  }
  exportAsXLSX(): void {
    if(this.LocalCurrencyCode!=''){

    var postData = {
      "PurchaseOrder": this.PurchaseOrder,
      "RRNo": this.RRNo,
      "PONo": this.PONo,
      "VendorId": this.VendorId,
      "RequestedById": this.RequestedId,
      "ApprovedById": this.UserId,
      "DateRequested": this.RequesteddateDate,
      "DateRequestedTo": this.RequestedDateToDate,
      "DueDate": this.DuedateDate,
      "DueDateTo": this.DueDateToDate,
      "POType": this.POType,
      "Status": this.Status,
      "LocalCurrencyCode":this.LocalCurrencyCode,
      "CreatedByLocation":this.Location

    }
    this.spinner = true ;
    this.commonService.postHttpService(postData, "getPOExportToExcel").subscribe(response => {
      if (response.status == true) {
        this.ExcelData = response.responseData.ExcelData;
        this.generateExcelFormat();
        this.spinner = false ;
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
    const title = 'Purchase Order';
    const header = ["RR #", "PO #", "Vendor Name", "Requested By Name", "Approved By Name", "Date Requested", "Grand Total", "Due Date", "PO Type", "Status"]
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
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 25;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;


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
    // worksheet.mergeCells(`A${footerRow.number}:J${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = ('Purchase Order ' + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })


  }

  onbackToGridList() {
    this.navCtrl.navigate('admin/orders/purchase-list');
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
}
