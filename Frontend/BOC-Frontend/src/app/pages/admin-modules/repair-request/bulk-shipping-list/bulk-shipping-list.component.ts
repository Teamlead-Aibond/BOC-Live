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

@Component({
  selector: 'app-bulk-shipping-list',
  templateUrl: './bulk-shipping-list.component.html',
  styleUrls: ['./bulk-shipping-list.component.scss']
})
export class BulkShippingListComponent implements OnInit {
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
    RRNo
  
    ShipFrom
    ShipTo
    ShipDate
    ShipDatedate
    initLoad: boolean = true;
    constructor(private http: HttpClient,
      private router: Router, public service: CommonService, private cd_ref: ChangeDetectorRef, private commonService: CommonService,
      private CommonmodalService: BsModalService, private excelService: ExcelService,
      public modalRef: BsModalRef, private datePipe: DatePipe,
      public navCtrl: NgxNavigationWithDataComponent
  
    ) { }
    currentRouter = this.router.url;
  
    ngOnInit(): void {
    document.title='Bulk Shipping List'
     this.IsViewEnabled = this.service.permissionCheck("BulkShipping", CONST_VIEW_ACCESS);
     this.IsAddEnabled = this.service.permissionCheck("BulkShipping", CONST_CREATE_ACCESS);
     if(this.IsViewEnabled){
     this.onList() 
     }  
    }
  

  onList(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/RRShipping/ServerSideList';
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
      
      ],
      'select': {
        'style': 'multi'
      },       
      createdRow: function (row, data, index) {
      

      },
      columns: [

        {
          data: 'BulkShipId', name: 'BulkShipId', defaultContent: '', orderable: false, searchable: true,

        },
       
        {
          data: 'Created', name: 'Created', orderable: true, searchable: true,defaultContent: '',
         
        
        },
        { data: 'ShipFrom', name: 'ShipFrom', orderable: true, searchable: true, },
        { data: 'ShipTo', name: 'ShipTo', orderable: true, searchable: true, },
        { data: 'CustomerVendorName', name: 'CustomerVendorName', orderable: true, searchable: true, },
        { data: 'ShippingStatus', name: 'ShippingStatus', orderable: true, searchable: true, },
        {
          data: 'BulkShipId', className: 'text-center', orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            if (row.BulkShipId) {
              actiontext += `<a href="#" class="fas fa-file-pdf text-secondary actionView1" data-toggle='tooltip' title='Download Bulk Packing Slip' data-placement='top'></a>`;
            }
        
            return actiontext;
          }
        },
       

      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {


        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDownloadBulkShip(data.BulkShipId)
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
     this.dataTable = $('#datatable-bulk-shipping-list');
    this.dataTable.DataTable(this.dtOptions);
  }
    
  
   
  onDownloadBulkShip(BulkShipId){
  this.modalRef = this.CommonmodalService.show(BulkShippingPackingslipComponent,
    {
      backdrop: 'static',
      ignoreBackdropClick: false,
      initialState: {
        data: { BulkShipId },
        class: 'modal-xl'
      }, class: 'gray modal-xl'
    });
  }
  ShipDateFormat(ShipDate) {
    const ShipDateYears = ShipDate.year;
    const ShipDateDates = ShipDate.day;
    const ShipDatemonths = ShipDate.month;
    let ShipDateDate = new Date(ShipDateYears, ShipDatemonths - 1, ShipDateDates);
    this.ShipDatedate = moment(ShipDateDate).format('YYYY-MM-DD')
  }
 
  onFilter(event) {
    var table = $('#datatable-bulk-shipping-list').DataTable();
    table.columns(2).search(this.ShipFrom);
    table.columns(3).search(this.ShipTo);
    table.columns(1).search(this.ShipDatedate);
    table.draw();

  }
   
  onClear(){
    this.ShipFrom = ''
    this.ShipTo = ''
    this.ShipDatedate = ''
    this.ShipDate=''
    var table = $('#datatable-bulk-shipping-list').DataTable();
    table.columns(2).search(this.ShipFrom);
    table.columns(3).search(this.ShipTo);
    table.columns(1).search(this.ShipDatedate);
    table.draw();
  }
  
  
  
   
   
  
  
  }
  

