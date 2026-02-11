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
import { PurchaseOrder_Status, PurchaseOrder_Type } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vendor-portal-list-po',
  templateUrl: './vendor-portal-list-po.component.html',
  styleUrls: ['./vendor-portal-list-po.component.scss']
})
export class VendorPortalListPoComponent implements OnInit {
  //ServerSide List
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  api_check: any;
  dataTable: any;
  RRId;


  //FILTER
  Created;
  VendorId;
  PONo
  PuchaseOrderStatus
  DateRequested;
  POType;
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
  POId
  PurchaseOrderType
  status
  DownloadOption
  constructor(private httpClient: HttpClient, public router: Router, private http: HttpClient, public navCtrl: NgxNavigationWithDataComponent,
    private cd_ref: ChangeDetectorRef, public service: CommonService,
    private datePipe: DatePipe,) { }
  currentRouter = this.router.url;


  ngOnInit(): void {
    this.PuchaseOrderStatus = PurchaseOrder_Status;
    this.PurchaseOrderType = PurchaseOrder_Type;
    this.DownloadOption = localStorage.getItem("IsRestrictExportReports")
    this.onList();
  }

  onList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/VendorPortal/VendorPOListByServerSide';
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
          "targets": [7],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [8],
          "visible": false,
          "searchable": true
        },

      ],
      createdRow: function (row, data, index) {

        // Set the Quote Type
        var TypeStyle = PurchaseOrder_Type.find(a => a.PurchaseOrder_TypeId == data.POType)
        var html = '<span class="badge ' + (TypeStyle ? TypeStyle.cstyle : 'btn-xs"') + '">' + (TypeStyle ? TypeStyle.PurchaseOrder_TypeName : '') + '</span>'
        $('td', row).eq(4).html(html);



        // Set the RRNo
        var number = '';
        if (data.RRNo != '' && data.RRNo != '0' && data.RRNo != null) {
          number = data.RRNo;
          var html = `<a href="#/vendor/RR-edit?RRId=${data.RRId}" target="_blank"  data-toggle='tooltip' title='RR View' data-placement='top'>${number}</a>`;

        }
        else if (data.MRONo != '' && data.MRONo != '0' && data.MRONo != null) {
          number = data.MRONo;
          var html = `<span ngbTooltip="View">${number}</span>`;
        }
        $('td', row).eq(1).html(html);


        // Set the Status
        var Status = PurchaseOrder_Status.find(a => a.PurchaseOrder_StateId == data.Status)
        var html = '<span class="badge ' + (Status ? Status.cstyle : 'btn-xs"') + '">' + (Status ? Status.PurchaseOrder_StateName : '') + '</span>'
        $('td', row).eq(2).html(html);



        var symbol = "$ "
        var html = '<span>' + data.CurrencySymbol + ' ' + data.GrandTotal + '</span>'
        $('td', row).eq(3).html(html);

      },
      columns: [
        {
          data: 'PONo', name: 'PONo', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            actiontext += `<a href="#/vendor/po-view?POId=${row.POId}" target="_blank"  data-toggle='tooltip' title='PO View' data-placement='top'>${row.PONo}</a>`;
            return actiontext;
          }
        },
        {
          data: 'RRNo', name: 'RRNo', orderable: true, searchable: true,

          render: (data: any, type: any, row: any, meta) => {
            if (data.RRNo != '') {
              return '<a href="#" class="" ngbTooltip="View">' + row.RRNo + '</a>';
            }
          }
        },
        { data: 'Status', name: 'Status', orderable: true, searchable: true, },
        { data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true, },
        { data: 'POType', name: 'POType', orderable: true, searchable: true, },
        { data: 'DateRequested', name: 'DateRequested', orderable: true, searchable: true, },
        { data: 'DueDate', name: 'DueDate', orderable: true, searchable: true, },
        { data: 'DateRequestedTo', name: 'DateRequestedTo', orderable: true, searchable: true, },
        { data: 'DueDateTo', name: 'DueDateTo', orderable: true, searchable: true, },
        {
          data: 'POId', name: 'POId', defaultContent: '', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            actiontext += `<a href="#/vendor/po-view?POId=${row.POId}" target="_blank" class="fa fa-eye text-secondary" data-toggle='tooltip' title='PO View' data-placement='top'></a>&nbsp;`;
            return actiontext;
          }
        },
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {

        $('.actionViewRR', row).unbind('click');
        $('.actionViewRR', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (data.RRNo != '' && data.RRNo != '0' && data.RRNo != null) {
            this.router.navigate(['/vendor/RR-edit'], { state: { RRId: data.RRId } });
          }
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

  RequesteddateFormat(Requesteddate) {
    const RequesteddateYears = Requesteddate.year;
    const RequesteddateDates = Requesteddate.day;
    const Requesteddatemonths = Requesteddate.month;
    let RequesteddateDate = new Date(RequesteddateYears, Requesteddatemonths - 1, RequesteddateDates);
    this.RequesteddateDate = moment(RequesteddateDate).format('YYYY-MM-DD');
  }
  RequestedDateToFormat(RequestedDateTo) {
    const RequestedDateToYears = RequestedDateTo.year;
    const RequestedDateToDates = RequestedDateTo.day;
    const RequestedDateTomonths = RequestedDateTo.month;
    let RequestedDateToDate = new Date(RequestedDateToYears, RequestedDateTomonths - 1, RequestedDateToDates);
    this.RequestedDateToDate = moment(RequestedDateToDate).format('YYYY-MM-DD')
  }

  DuedateFormat(Duedate) {
    const DuedateYears = Duedate.year;
    const DuedateDates = Duedate.day;
    const Duedatemonths = Duedate.month;
    let DuedateDate = new Date(DuedateYears, Duedatemonths - 1, DuedateDates);
    this.DuedateDate = moment(DuedateDate).format('YYYY-MM-DD')
  }

  DueDateToFormat(DueDateTo) {
    const DueDateToYears = DueDateTo.year;
    const DueDateToDates = DueDateTo.day;
    const DueDateTomonths = DueDateTo.month;
    let DueDateToDate = new Date(DueDateToYears, DueDateTomonths - 1, DueDateToDates);
    this.DueDateToDate = moment(DueDateToDate).format('YYYY-MM-DD')
  }

  onFilter(event) {
    let obj = this
    var table = $('#datatable-angular').DataTable();
    table.columns(0).search(this.PONo);
    table.columns(2).search(this.status);
    table.columns(5).search(this.RequesteddateDate);
    table.columns(4).search(this.POType);
    table.columns(1).search(this.RRNo);
    table.columns(8).search(this.DueDateToDate);
    table.columns(6).search(this.DuedateDate);
    table.columns(7).search(this.RequestedDateToDate);
    table.draw();

  }

  onClear(event) {
    var table = $('#datatable-angular').DataTable();
    this.PONo = '';
    this.status = '';
    this.Created = "";
    this.DateRequested = "";
    this.RRNo = "";
    this.POType = "";
    this.RequesteddateDate = "";
    this.RequestedDateToDate = "";
    this.DueDateToDate = "";
    this.DuedateDate = "";
    this.RequestedId = "";
    this.Requesteddate = "";
    this.RequestedDateTo = "";
    this.Duedate = "";
    this.DueDateTo = "";
    table.columns(0).search(this.PONo);
    table.columns(2).search(this.status);
    table.columns(5).search(this.RequesteddateDate);
    table.columns(4).search(this.POType);
    table.columns(1).search(this.RRNo);
    table.columns(8).search(this.DueDateToDate);
    table.columns(6).search(this.DuedateDate);
    table.columns(7).search(this.RequestedDateToDate);
    table.draw();

    this.status = undefined;
    this.POType = undefined;


    this.reLoad();
  }

  reLoad() {
    this.router.navigate([this.currentRouter])
  }



}
