/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Observable, of, Subject, concat } from 'rxjs';
import { catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, EDI_status, boolean } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-edi-list',
  templateUrl: './invoice-edi-list.component.html',
  styleUrls: ['./invoice-edi-list.component.scss']
})
export class InvoiceEDIListComponent implements OnInit {


  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  public CompanyName: any = [];

  baseUrl = `${environment.api.apiURL}`;
  ExcelData: any = [];
  Quote: any = [];
  model: any = {};
  //access rights variables
  IsViewEnabled
  IsAddEnabled
  IsEditEnabled
  IsDeleteEnabled
  DownloadOptionList: boolean = true
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  ConsolidationInvoiceNo
  CustomerId
  keywordForCustomer = 'CompanyName';
  customerList: any = [];
  isLoadingCustomer: boolean = false;
  InvoiceNo
  UploadedBy
  CreatedDate
  createdDate
  adminList: any = []
  StatusList: any = []
  submitted = false;
  viewResult
  StatusName
  Status
  CreatedFrom
  createdfrom
  CreatedTo
  createdto
  CustomerPONo
  @ViewChild('Edit', { static: true }) EditModal: TemplateRef<any>;
  @ViewChild('View', { static: true }) ViewModal: TemplateRef<any>;
  CustomerGroupId: any;
  customerGroupList: any;
  initLoad: boolean = true;
  constructor(private http: HttpClient,
    private router: Router, public service: CommonService, private cd_ref: ChangeDetectorRef, private commonService: CommonService, private modalService: NgbModal,
    private CommonmodalService: BsModalService, private excelService: ExcelService,
    public modalRef: BsModalRef, private datePipe: DatePipe,
    public navCtrl: NgxNavigationWithDataComponent

  ) { }
  currentRouter = this.router.url;

  ngOnInit(): void {
    document.title = 'EDI List'
    this.StatusList= EDI_status
    this.IsViewEnabled = this.service.permissionCheck("InvocieEDILog", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.service.permissionCheck("InvocieEDILog", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.commonService.permissionCheck("InvocieEDILog", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.commonService.permissionCheck("InvocieEDILog", CONST_DELETE_ACCESS);
    if (this.IsViewEnabled) {
      this.onList();
    }
  }
  getAdminList() {
    this.commonService.getHttpService('getAllActiveAdmin').subscribe(response => {//getAdminListDropdown
      this.adminList = response.responseData.map(function (value) {
        return { title: value.FirstName + " " + value.LastName, "UserId": value.UserId }
      });
    });
  }
  getEDIStatusList() {
    this.commonService.getHttpService('EDIStatusddl').subscribe(response => {
      this.StatusList = [response.responseData]
      this.StatusList.map(function (value) {
        return { title: value}
      });
    });
  }


  onList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/edi/list';
    const that = this;
    var filterData = {}
    if (this.DownloadOptionList) {
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
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-12 col-sm-4 col-md-4 col-xl-4"l><"col-12 col-sm-4 col-md-4 col-xl-4"i><"col-12 col-sm-4 col-md-4 col-xl-4"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      serverSide: true,
      retrieve: true,
      order: [[9, 'asc']],
      serverMethod: 'post',
      responsive: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.api_check ? that.api_check.unsubscribe() : that.api_check = null;
        that.api_check = that.http.post<any>(url,
          Object.assign(dataTablesParameters,
            filterData
          ), httpOptions).subscribe(resp => {
            if(this.initLoad){
              this.loadCustomers();
              this.getCustomerGroupList();
              this.getAdminList();
            }
            this.initLoad = false;
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
          "targets":[0],
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
      ],
      createdRow: function (row, data, index) {
        var TypeStyle = EDI_status.find(a => a.id == data.EdiStatus)
        var html = '<span class="badge ' + (TypeStyle ? TypeStyle.cstyle : 'btn-xs"') + '">' + (TypeStyle ? TypeStyle.title : '') + '</span>'
        $('td', row).eq(4).html(html);

      },
      columns: [
        {
          "data": "InvoiceEdiId",
          "name": "InvoiceEdiId",
          "searchable": true,
          "orderable": true,
          "search": {
              "value": "",
              "regex": false
          }
      },
        {
          data: 'InvoiceNo', name: 'InvoiceNo', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var IId = '';
            if (row.InvoiceNo && row.InvoiceNo.indexOf(',') != -1) {
              row.InvoiceNo.split(",").forEach(function (item) {
                if (item) {
                  var itemId = item.split("INV");
                  IId += `<a href="#/admin/invoice/list?InvoiceId=${itemId[1]}" target="_blank" data-toggle='tooltip' title='Invoice View' data-placement='top'>` + item + `</a>`;
                } else {
                  IId += item;
                };
                IId += ', ';
              });
            } else if (row.InvoiceNo != null) {
              if (row.InvoiceNo) {
                var itemId = row.InvoiceNo.split("INV");
                IId += `<a href="#/admin/invoice/list?InvoiceId=${itemId[1]}" target="_blank" data-toggle='tooltip' title='Invoice View' data-placement='top'>` + row.InvoiceNo + `</a>`;
              } else {
                IId += row.InvoiceNo;
              };
              IId += ', ';
            } else {
              IId += '-, ';
            }
            return IId.trim().slice(0, -1);


          }     
        },
        {
          data: 'CompanyName', name: 'CompanyName', defaultContent: '', orderable: false, searchable: true,

        },
        { data: 'Created', name: 'Created', orderable: true, searchable: true, },
        { data: 'CreatedByName', name: 'CreatedByName', orderable: true, searchable: true, },
        { data: 'EdiStatus', name: 'EdiStatus', orderable: true, searchable: true, },
        { data: 'CustomerPONo', name: 'CustomerPONo', orderable: true, searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          var text = '';

          if (row.CustomerBlanketPOId) {

            text = `<a  href="#/admin/Blanket-PO-History?CustomerBlanketPOId=${row.CustomerBlanketPOId}"  target="_blank"  data-toggle='tooltip' title='Customer Blanket PO View' data-placement='top'>${row.CustomerPONo}</a>`;

          } else {

            text = '<a  ngbTooltip="View">' + row.CustomerPONo + '</a>';

          }

         

          return text;

        } },
        { data: 'Comments', name: 'Comments', orderable: true, searchable: true, },
        {
          data: 'InvoiceEdiId', className: 'text-center', orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';

            if (this.IsViewEnabled) {
              actiontext += `<a href="#" class="actionView1 fa fa-eye text-secondary" data-toggle='tooltip' title='View EDI' data-placement='top'></a>&nbsp;`;
            }
            if (this.IsEditEnabled) {
              actiontext += `<a href="#" class="actionView2 fa fa-edit text-secondary" data-toggle='tooltip' title='Edit EDI' data-placement='top'></a> &nbsp;`;
            }


            return actiontext;
          }

        },
        { data: 'CustomerId', name: 'CustomerId', orderable: true, searchable: true, },
        { data: 'CreatedBy', name: 'CreatedBy', orderable: true, searchable: true, },
        { data: 'CreatedFrom', name: 'CreatedFrom', orderable: true, searchable: true, },
        { data: 'CreatedTo', name: 'CreatedTo', orderable: true, searchable: true, },
        { data: 'CustomerGroupId', name: 'CustomerGroupId', orderable: true, searchable: true, },

      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onView(data.InvoiceEdiId);
        });
        $('.actionView2', row).unbind('click');
        $('.actionView2', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onEdit(data.EdiStatus,data.InvoiceEdiId);
        });
        return row;
      },
      "preDrawCallback": function () {
        $('#datatable-EDI-list_processing').attr('style', 'display: block; z-index: 10000 !important');
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
    this.dataTable = $('#datatable-EDI-list');
    this.dataTable.DataTable(this.dtOptions);
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

  CreatedFromFormat(CreatedFrom) {
    const CreatedFromYears = CreatedFrom.year;
    const CreatedFromDates = CreatedFrom.day;
    const CreatedFrommonths = CreatedFrom.month;
    let CreatedFromformat = new Date(CreatedFromYears, CreatedFrommonths - 1, CreatedFromDates);
    this.createdfrom = moment(CreatedFromformat).format('YYYY-MM-DD');
  }



  CreatedToFormat(CreatedTo) {
    const CreatedToYears = CreatedTo.year;
    const CreatedToDates = CreatedTo.day;
    const CreatedTomonths = CreatedTo.month;
    let CreatedToformat = new Date(CreatedToYears, CreatedTomonths - 1, CreatedToDates);
    this.createdto = moment(CreatedToformat).format('YYYY-MM-DD');
  }
  onFilter(event) {
    if(this.CustomerGroupId == null){
      this.CustomerGroupId = "";
    }
    var table = $('#datatable-EDI-list').DataTable();
    table.columns(1).search(this.InvoiceNo);
    table.columns(9).search(this.CompanyName);
    table.columns(10).search(this.UploadedBy);
    table.columns(5).search(this.Status);
    table.columns(11).search(this.createdfrom);
    table.columns(12).search(this.createdto);
    table.columns(6).search(this.CustomerPONo);
    table.columns(13).search(this.CustomerGroupId);
    table.draw();
  }
  onClear() {
    this.InvoiceNo = ''
    this.CompanyName = ""
    this.ConsolidationInvoiceNo = ""
    this.UploadedBy = ''
    this.CreatedDate = ""
    this.createdDate = ""
    this.Status = ""
    this.createdfrom = ''
    this.createdto =''
    this.CreatedFrom = ''
    this.CreatedTo = ''
    this.CustomerPONo = ''
    var CustomerGroupId = "";
    if(this.CustomerGroupId != null || this.CustomerGroupId != ''){
      this.CustomerGroupId = null;
      CustomerGroupId = "";
      this.loadCustomers();
    }
    var table = $('#datatable-EDI-list').DataTable();
    table.columns(1).search(this.InvoiceNo);
    table.columns(9).search(this.CompanyName);
    table.columns(10).search(this.UploadedBy);
    table.columns(5).search(this.Status);
    table.columns(11).search(this.createdfrom);
    table.columns(12).search(this.createdto);
    table.columns(6).search(this.CustomerPONo);
    table.columns(13).search(CustomerGroupId);
    table.draw();
  }
  onEdit(EdiStatus, InvoiceEdiId) {
    this.model.EdiStatus = EdiStatus;
    this.model.InvoiceEdiId = InvoiceEdiId
    this.modalService.open(this.EditModal, { centered: true, size: 'xl' });
  }
  onItemSubmit() {
    this.submitted = true;
    var postData = {
      "EdiStatus": this.model.EdiStatus,
      "InvoiceEdiId": this.model.InvoiceEdiId,
      "Comments": this.model.Comments,
    }
    this.commonService.postHttpService(postData, "EDIInvoiceUpdate").subscribe(response => {
      if (response.status == true) {
        this.modalService.dismissAll();
        var table = $('#datatable-EDI-list').DataTable();
        table.draw();
        Swal.fire({
          title: 'Success!',
          text: 'EDI has been Updated!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
        // this.router.navigate(['./admin/invoice/list'])

      }
      else {
        Swal.fire({
          title: 'Error!',
          text: response.message,
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  reLoad() {
    this.router.navigate([this.router.url])
  }
  onView(InvoiceEdiId) {
    this.viewResult = ""
    var postData = {
      "InvoiceEdiId": InvoiceEdiId,
    }
    this.commonService.postHttpService(postData, "EDIInvoiceView").subscribe(response => {
      if (response.status == true) {
       
        this.viewResult = response.responseData

      }
      else {
       
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
    this.modalService.open(this.ViewModal, { centered: true, size: 'xl' });
  }
  GetClassStatusName(Status) {
    var className = ""
    var StatusStyle = EDI_status.find(a => a.id == Status)
    this.StatusName = (StatusStyle ? StatusStyle.title : '')
    className = `badge ' ${(StatusStyle ? StatusStyle.cstyle : '')}  ' btn-xs`
    return className;
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

