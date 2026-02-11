import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Observable, of, Subject, concat } from 'rxjs';
import { catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { SalesQuote_Status, Quote_type, CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_VIEW_COST_ACCESS } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { BulkShippingPackingslipComponent } from '../../common-template/bulk-shipping-packingslip/bulk-shipping-packingslip.component';
import { QuoteDuplicateComponent } from '../../common-template/quote-duplicate/quote-duplicate.component';
import { QrCodeComponent } from '../../common-template/qr-code/qr-code.component';
import { QrCodeLoopComponent } from '../../common-template/qr-code-loop/qr-code-loop.component';
@Component({
  selector: 'app-repair-request-patch-list',
  templateUrl: './repair-request-patch-list.component.html',
  styleUrls: ['./repair-request-patch-list.component.scss']
})
export class RepairRequesPatchtListComponent implements OnInit {
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
    IsViewEnabled
    IsAddEnabled
  
    dtOptions: any = {};
    dataTableMessage;
    api_check: any;
    dataTable: any;
    RRBatchNo
    CustomerId: string;
    CreatedBy: string;
    Created: string;
    adminList: any = []
    RRDetails: any;
    RRIds: any;
    RRNo: any;
    CustomerGroupId: any
  customerGroupList: any;
  emptyValue: any = '';
    constructor(private http: HttpClient,
      private router: Router, public service: CommonService, private cd_ref: ChangeDetectorRef, private commonService: CommonService,
      private CommonmodalService: BsModalService, private excelService: ExcelService,
      public modalRef: BsModalRef, private datePipe: DatePipe,
      public navCtrl: NgxNavigationWithDataComponent
  
    ) {
      this.RRIds = history.state.RRIds ? history.state.RRIds : ''; 
     }
    currentRouter = this.router.url;
  
    ngOnInit(): void {
      document.title='RR Batch List'
     this.IsViewEnabled = this.service.permissionCheck("RRBatchLogin", CONST_VIEW_ACCESS);
     this.IsAddEnabled = this.service.permissionCheck("RRBatchLogin", CONST_CREATE_ACCESS);
     this.loadCustomers();
     this.getCustomerGroupList();
     this.getAdminList();
     if(this.IsViewEnabled){
       this.onList();
       if(this.RRIds != ''){
        this.RRIds = this.RRIds.RRId.toString()
        var passData = {
          RRId: this.RRIds
        }
        this.PreviewQrCode(passData);
       }
     }  
    }
  

  onList(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/repairRequest/rr-batch-list';
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
      responsive: true,
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
       buttons: {
        dom: {
          button: {
            className: ''
          }
 
        },
        buttons: []
      }, 
      columnDefs: [
        {
          "targets": [6],
          "visible": false,
          "searchable": true,
        },
      ],
      'select': {
        'style': 'multi'
      },       
      createdRow: function (row, data, index) {
      

      },
      columns: [

        {
          data: 'RRBatchNo', name: 'RRBatchNo', defaultContent: '', orderable: false, searchable: true,

        },
        // {
        //   data: 'CustomerId', name: 'CustomerId', defaultContent: '', orderable: false, searchable: true,

        // },
        { data: 'CompanyName', name: 'CompanyName', orderable: true, searchable: true },
        {
          data: 'RRId', name: 'RRId', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var IId = '';
            if (row.RRId && row.RRId.indexOf(',') != -1) {
              row.RRId.split(",").forEach(function (item) {
                if (item) {
                  // var itemId = item.split("INV");
                  IId += `<a href="#/admin/repair-request/edit?RRId=${item}" target="_blank" data-toggle='tooltip' title='RR View' data-placement='top'>RR` + item + `</a>`;
                } else {
                  IId += item;
                };
                IId += ', ';
              });
            } else if (row.RRId != null) {
              if (row.RRId) {
                // var itemId = row.InvoiceNo.split("INV");
                IId += `<a href="#/admin/repair-request/edit?RRId=${row.RRId}" target="_blank" data-toggle='tooltip' title='RR View' data-placement='top'>RR` + row.RRId + `</a>`;
              } else {
                IId += row.RRId;
              };
              IId += ', ';
            } else {
              IId += '-, ';
            }
            return IId.trim().slice(0, -1);


          }
        },
       
        { data: 'Created', name: 'Created', orderable: true, searchable: true, },
        { data: 'CreatedByName', name: 'CreatedByName', orderable: true, searchable: true, },
        
        {
          data: 'RRBatchId', className: 'text-center', orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            if (row.RRBatchId) {
              actiontext += `<a href="#" class="mdi mdi-qrcode text-secondary actionView1" data-toggle='tooltip' title='QR Code' data-placement='top'"></a>`;
              
            }
        
            return actiontext;
          }
        },
        { data: 'CustomerGroupId', name: 'CustomerGroupId', orderable: true, searchable: true, },
       

      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {


        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.PreviewQrCode(data);
        });

        return row;
      },

      "preDrawCallback": function () {
        $('#datatable-bulk-shipping-list_processing').attr('style', 'display: block; z-index: 10000 !important');

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
     this.dataTable = $('#datatable-rr-batch-list');
    this.dataTable.DataTable(this.dtOptions);
  }

  getAdminList() {
    this.commonService.getHttpService('getAllActiveAdmin').subscribe(response => {//getAdminListDropdown
      this.adminList = response.responseData.map(function (value) {
        return { title: value.FirstName + " " + value.LastName, "UserId": value.UserId }
      });;;
    });
  }
 
  onFilter(event) {
    if(this.CustomerGroupId == null){
      this.CustomerGroupId = "";
    }
    var table = $('#datatable-rr-batch-list').DataTable();
    table.columns(0).search(this.RRBatchNo);
    table.columns(1).search(this.CompanyName);
    table.columns(2).search(this.RRId);
    table.columns(3).search(this.Created);
    table.columns(4).search(this.CreatedBy);
    table.columns(6).search(this.CustomerGroupId);
    table.draw();
  }
   
  onClear(){
    this.RRBatchNo = ''
    this.CompanyName = ''
    this.RRId = ''
    this.CreatedBy = ''
    this.Created = ''
    var CustomerGroupId = "";
    if(this.CustomerGroupId != null || this.CustomerGroupId != ''){
      this.CustomerGroupId = null;
      CustomerGroupId = "";
      this.loadCustomers();
    }
    var table = $('#datatable-rr-batch-list').DataTable();
    table.columns(0).search(this.RRBatchNo);
    table.columns(1).search(this.CompanyName);
    table.columns(2).search(this.RRId);
    table.columns(3).search(this.Created);
    table.columns(4).search(this.CreatedBy);
    table.columns(6).search(CustomerGroupId);
    table.draw();
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
  
  CreatedFormat(Created) {
    const CreatedYears = Created.year;
    const Createds = Created.day;
    const Createdmonths = Created.month;
    let Createdformat = new Date(CreatedYears, Createdmonths - 1, Createds);
    this.Created = moment(Createdformat).format('YYYY-MM-DD');
  }
  async PreviewQrCode(data){
    console.log(data);
    var postData = {
      "RRId": data.RRId
    }
    this.service.postHttpService(postData, "getRRForLoopQR").subscribe(response => {
      var RRDetails = response.responseData;
      // this.viewQrCode(response.responseData);
      this.modalRef = this.CommonmodalService.show(QrCodeLoopComponent,
        {
          backdrop: 'static',
          ignoreBackdropClick: false,
          initialState: {
            data: { RRDetails },
            class: 'modal-lg'
          }, class: 'gray modal-lg'
        });

      this.modalRef.content.closeBtnName = 'Close';

      // this.modalRef.content.event.subscribe(res => {
      // });
    });
    // return this.service.postHttpService(postData, "getRRForLoopQR")
    //   .pipe(
    //     map(response => {
    //       this.RRDetails = response.responseData;
    //       // this.viewQrCode(response.responseData);
    //     })
    //   );
      
  }
  viewQrCode(data) {
    console.log(data);
    var RRDetails = data;
    
    this.modalRef = this.CommonmodalService.show(QrCodeLoopComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { RRDetails},
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
    });
  }

  selectRREvent($event) {
    console.log($event);
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
  
  
  }
  

