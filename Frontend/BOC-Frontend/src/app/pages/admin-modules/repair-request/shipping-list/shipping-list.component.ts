import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { array_rr_status, CONST_CREATE_ACCESS, CONST_VIEW_ACCESS } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { BulkShippingPackingslipComponent } from '../../common-template/bulk-shipping-packingslip/bulk-shipping-packingslip.component';
import { PartsPickedupComponent } from '../../common-template/parts-pickedup/parts-pickedup.component';
import { PackingSlipComponent } from '../../quotes/packing-slip/packing-slip.component';

@Component({
  selector: 'app-shipping-list',
  templateUrl: './shipping-list.component.html',
  styleUrls: ['./shipping-list.component.scss']
})
export class ShippingListComponent implements OnInit {

    customers$: Observable<any> = of([]);
    customersInput$ = new Subject<string>();
    loadingCustomers: boolean = false;
    CustomersList: any[] = [];
    public CompanyName: any = [];
    model:any={}
    baseUrl = `${environment.api.apiURL}`;
    ExcelData: any = [];
    keywordForCustomer = 'CompanyName';
    customerList: any = [];
    isLoadingCustomer: boolean = false;
    keywordForRR = 'RRNo';
    RRList: any[]
    RRId = ''
    isLoadingRR: boolean = false;
    //access rights variables
    IsViewEnabled
    IsPickedEnabled
  
    dtOptions: any = {};
    dataTableMessage;
    api_check: any;
    dataTable: any;
    RRNo
    @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective
    dtTrigger: Subject<any> = new Subject();
    dtOptions2: any = {};
    dtTrigger2: Subject<any> = new Subject();

  
    vendors$: Observable<any> = of([]);
    vendorsInput$ = new Subject<string>();
    loadingVendors: boolean = false;
    VendorsList: any[] = [];
    VendorId
    showDataTable:boolean=false
    ShippingItem:any=[]
    gridCheckAll: boolean = false;
    checkedIds = [];
    uncheckedIds = [];
    rowcheck: boolean = false;
    PartsItem= [];
    UserListddl:any=[]
    
    constructor(private http: HttpClient,
      private router: Router, public service: CommonService, private cd_ref: ChangeDetectorRef, private commonService: CommonService,
      private CommonmodalService: BsModalService, private excelService: ExcelService,
      public modalRef: BsModalRef, private datePipe: DatePipe,
      public navCtrl: NgxNavigationWithDataComponent
  
    ) { }
    currentRouter = this.router.url;
  
    ngOnInit(): void {
      document.title='Shipping Ready for Pick Up List'
      this.IsViewEnabled = this.service.permissionCheck("ShippingReadyforPickUpList", CONST_VIEW_ACCESS);
      this.IsPickedEnabled = true
      //this.service.permissionCheck("ShippingReadyforPickUpList", CONST_CREATE_ACCESS);
      if(this.IsViewEnabled){
      this.loadVendors();
      this.getUserList()
      this.dtOptions2 = {
        pagingType: 'full_numbers',
        pageLength: 100,
        responsive: true,
        processing: true,
        retrieve: true,
        language: {
          paginate: {
            first: '«',
            previous: '‹',
            next: '›',
            last: '»'
          },
          aria: {
            paginate: {
              first: 'First',
              previous: 'Previous',
              next: 'Next',
              last: 'Last'
            }
          }
        },
        dom: '<" row"<"col-12 col-xl-6"B> <"col-12 col-xl-6"f>>rt<"row"<"help-block col-12 col-xl-4"l><"col-12 col-xl-4"i><"col-12 col-xl-4"p>>',
        buttons: {
          dom: {
            button: {
              className: '',
            }
          },
          buttons: [
            {
              extend: 'colvis',
              className: 'btn btn-sm btn-primary',
              text: 'COLUMNS'
            },
            {
              extend: 'excelHtml5',
              text: 'EXCEL',
              className: 'btn btn-sm btn-secondary',
              exportOptions: {
                columns: ':visible'
              }
            },
            {
              extend: 'csvHtml5',
              text: 'CSV',
              className: 'btn btn-sm btn-secondary',
              exportOptions: {
                columns: ':visible'
              }
            },
            {
              extend: 'pdfHtml5',
              text: 'PDF',
              className: 'btn btn-sm btn-secondary',
              exportOptions: {
                columns: ':visible'
              }
            },
            {
              extend: 'print',
              className: 'btn btn-sm btn-secondary',
              text: 'PRINT',
              exportOptions: {
                columns: ':visible'
                //columns: [ 0, 1, 2, 3 ]
              }
            },
            {
              extend: 'copy',
              className: 'btn btn-sm btn-secondary',
              text: 'COPY',
              exportOptions: {
                columns: ':visible'
              }
            },
          ]
        },
      };
      this.dtTrigger2.next();
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 100,
        responsive: true,
        processing: true,
        retrieve: true,
        language: {
          paginate: {
            first: '«',
            previous: '‹',
            next: '›',
            last: '»'
          },
          aria: {
            paginate: {
              first: 'First',
              previous: 'Previous',
              next: 'Next',
              last: 'Last'
            }
          }
        },
        dom: '<" row"<"col-12 col-xl-6"B> <"col-12 col-xl-6"f>>rt<"row"<"help-block col-12 col-xl-4"l><"col-12 col-xl-4"i><"col-12 col-xl-4"p>>',
        buttons: {
          dom: {
            button: {
              className: '',
            }
          },
          buttons: [
            {
              extend: 'colvis',
              className: 'btn btn-sm btn-primary',
              text: 'COLUMNS'
            },
            {
              extend: 'excelHtml5',
              text: 'EXCEL',
              className: 'btn btn-sm btn-secondary',
              exportOptions: {
                columns: ':visible'
              }
            },
            {
              extend: 'csvHtml5',
              text: 'CSV',
              className: 'btn btn-sm btn-secondary',
              exportOptions: {
                columns: ':visible'
              }
            },
            {
              extend: 'pdfHtml5',
              text: 'PDF',
              className: 'btn btn-sm btn-secondary',
              exportOptions: {
                columns: ':visible'
              }
            },
            {
              extend: 'print',
              className: 'btn btn-sm btn-secondary',
              text: 'PRINT',
              exportOptions: {
                columns: ':visible'
                //columns: [ 0, 1, 2, 3 ]
              }
            },
            {
              extend: 'copy',
              className: 'btn btn-sm btn-secondary',
              text: 'COPY',
              exportOptions: {
                columns: ':visible'
              }
            },
          ]
        },
      };
      this.dtTrigger.next();
      }
    }

 
  fetch_data(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      responsive: true,
      processing: true,
      retrieve: true,
      language: {
        paginate: {
          first: '«',
          previous: '‹',
          next: '›',
          last: '»'
        },
        aria: {
          paginate: {
            first: 'First',
            previous: 'Previous',
            next: 'Next',
            last: 'Last'
          }
        }
      },
      dom: '<" row"<"col-12 col-xl-6"B> <"col-12 col-xl-6"f>>rt<"row"<"help-block col-12 col-xl-4"l><"col-12 col-xl-4"i><"col-12 col-xl-4"p>>',
      buttons: {
        dom: {
          button: {
            className: '',
          }
        },
        buttons: [
          {
            extend: 'colvis',
            className: 'btn btn-sm btn-primary',
            text: 'COLUMNS'
          },
          {
            extend: 'excelHtml5',
            text: 'EXCEL',
            className: 'btn btn-sm btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'csvHtml5',
            text: 'CSV',
            className: 'btn btn-sm btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'pdfHtml5',
            text: 'PDF',
            className: 'btn btn-sm btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'print',
            className: 'btn btn-sm btn-secondary',
            text: 'PRINT',
            exportOptions: {
              columns: ':visible'
              //columns: [ 0, 1, 2, 3 ]
            }
          },
          {
            extend: 'copy',
            className: 'btn btn-sm btn-secondary',
            text: 'COPY',
            exportOptions: {
              columns: ':visible'
            }
          },
        ]
      },
    };
    var postData = {
      VendorId:this.model.VendorId,
      ShippingStatus:3,
      UserId:this.model.UserId   
    }
    this.service.postHttpService(postData,"RRShipHistoryListByVendor").subscribe((response: any) => {
      if (response.status == true) {
       
        this.ShippingItem = response.responseData;
        if (this.ShippingItem.length==0) {
          $('[Id $= "datatable-shipping-list_paginate"]').css('display','none');
          $('[Id $= "datatable-shipping-list_info"]').css('display','none');
          $('[Id $= "datatable-shipping-list_length"]').css('display','none');      
          
      } else {
        $('[Id $= "datatable-shipping-list_paginate"]').css('display','block');
        $('[Id $= "datatable-shipping-list_info"]').css('display','block');
        $('[Id $= "datatable-shipping-list_length"]').css('display','block');   
      } 
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
        

    }
    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  ///**************Server side list */
  onList(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/RRShipping/ServerSideRRShipHistoryListByVendor';
    const that = this;
    var filterData = {
      VendorId:this.model.VendorId,
      ShippingStatus:3
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

            that.ShippingItem = resp.responseData.data;

            that.ShippingItem.forEach(item => {
              item.checked = this.isPickupChecked(item.ShippingHistoryId);
            });

            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: this.ShippingItem

            });
          // Calling the DT trigger to manually render the table
          this.dtTrigger.next()
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
          "orderable": false,
          "className": 'select-checkbox',
          "targets": [0]
        },
      
      ],
      'select': {
        'style': 'multi'
      },       
      createdRow: function (row, data, index) {
        var html = `<a href="#/admin/repair-request/edit?RRId=${data.RRId}" target="_blank"  data-toggle='tooltip' title='RR View' data-placement='top'>${data.RRNo}</a>`;
        $('td', row).eq(4).html(html);
        var html = `<input type="checkbox" class="checkbox"  ${data.checked ? 'checked' : ''}  (change)="rowCheckBoxChecked($event, ${data.ShippingHistoryId})">`;
        $('td', row).eq(0).html(html);

      },
      columns: [
        {
          data: 'ShippingHistoryId',name: 'ShippingHistoryId', className: 'text-center', orderable: true,},
        {
          data: 'ShipFromName', name: 'ShipFromName', defaultContent: '', orderable: false, searchable: true,

        },
        { data: 'ShipToName', name: 'ShipToName', orderable: true, searchable: true, },

        {
          data: 'Created', name: 'Created', orderable: true, searchable: true,defaultContent: '',
         
        
        },
        {
          data: 'RRNo', name: 'RRNo', defaultContent: '', orderable: true, searchable: true,
        },
        {
          data: 'ShippingHistoryId', className: 'text-center', orderable: true,
          render: (data: any, type: any, row: any, meta) => {
            var actiontext = '';
            var labelName = "Picked Up"
            if (row.ShippingHistoryId) {
              // actiontext += `<a class="actionView1 text-primary" data-toggle='tooltip' title='Picked Up' data-placement='top'>
              // <img _ngcontent-nkb-c12="" height="30" src="../../../../assets/images/icons/Transit---From-Industry-to-Customer.png" width="20"></a>&nbsp&nbsp`
              actiontext += `<a href="#" class="fas fa-file-pdf text-secondary actionView2" data-toggle='tooltip' title='Download Packing Slip' data-placement='top'></a>`;

            }
        
            return actiontext;
          }
        },
       

      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {


        // $('.actionView1', row).unbind('click');
        // $('.actionView1', row).bind('click', (e) => {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   this.onPartsPickup(data.ShippingHistoryId,data.RRId)
        // });

        $('.actionView2', row).unbind('click');
        $('.actionView2', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDownloadShip(data.ShippingHistoryId,data.RRId)
        });

        $('.checkbox', row).unbind('click');
        $('.checkbox', row).bind('click', (e) => {
          this.rowCheckBoxChecked(e, data.ShippingHistoryId,data.RRId)
         
        });
        return row;
      },

      "preDrawCallback": function () {

        $('#datatable-shipping-list_processing').attr('style', 'display: block; z-index: 10000 !important');

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
     this.dataTable = $('#datatable-shipping-list');
    this.dataTable.DataTable(this.dtOptions);
  }
 
  /////******************************* */

  reLoad() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  onClear(){
    this.model.VendorId=''
    this.model.UserId=''
    $('[Id $= "datatable-list"]').css('display','none'); 
    $('[Id $= "datatable-list2"]').css('display','none');

 }
  onListLoad(){
    var postData = {
      VendorId:this.model.VendorId,
      ShippingStatus:3,
      UserId:this.model.UserId   
    }
    this.service.postHttpService(postData,"RRShipHistoryListByVendor").subscribe((response: any) => {
      if (response.status == true) {
       
        this.ShippingItem = response.responseData;

        
        // Calling the DT trigger to manually render the table
        if (this.ShippingItem.length==0) {
          $('[Id $= "datatable-list"]').css('display','none');
          $('[Id $= "datatable-list2"]').css('display','block');
          this.dtTrigger2.next();
          $('[Id $= "datatable-shipping-list2_paginate"]').css('display','none');
          $('[Id $= "datatable-shipping-list2_info"]').css('display','none');
          $('[Id $= "datatable-shipping-list2_length"]').css('display','none');      
          
      } else {
        $('[Id $= "datatable-list2"]').css('display','none');
        $('[Id $= "datatable-list"]').css('display','block');
        this.dtTrigger.next();
        $('[Id $= "datatable-shipping-list_paginate"]').css('display','block');
        $('[Id $= "datatable-shipping-list_info"]').css('display','block');
        $('[Id $= "datatable-shipping-list_length"]').css('display','block');   
      }  
      }
    })
  }
  onFilter(f: NgForm){
    let obj = this
      if(f.valid){
        this.onListLoad()     
      
      }
  }
  onPartsPickup(){
    if (this.PartsItem.length > 0) {
    Swal.fire({
      title: 'Are you sure, You want to change the status from Ready for Pick up to Picked up by Vendor / Customer?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var PickupItem = this.PartsItem
        this.modalRef = this.CommonmodalService.show(PartsPickedupComponent,
          {
            backdrop: 'static',
            ignoreBackdropClick: false,
            initialState: {
              data: {PickupItem },
              class: 'modal-lg'
            }, class: 'gray modal-lg'
          });
          this.modalRef.content.closeBtnName = 'Close';

          this.modalRef.content.event.subscribe(res => {
            this.rerenderFilter();
          });
        

      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'No Change:)',
          type: 'error'
        });
      }
    });
  }
  else {
    Swal.fire({
      type: 'info',
      title: 'Message',
      text: 'Please checked the Part Item',
      confirmButtonClass: 'btn btn-confirm mt-2',
    });

  }
  }

  rerenderFilter(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      this.fetch_data()
    });
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  private isPickupChecked(ShippingHistoryId) {
    this.PartsItem = [];
    if (!this.gridCheckAll) {
      return this.checkedIds.indexOf(ShippingHistoryId) >= 0 ? true : false;
    } else {
      this.PartsItem.map(a => a.checked = true);
      this.PartsItem = this.ShippingItem.map(a => { return { ShippingHistoryId: a.ShippingHistoryId,RRId:a.RRId  } });
      return this.uncheckedIds.indexOf(ShippingHistoryId) >= 0 ? false : true;

    }
  }
  gridAllRowsCheckBoxChecked(e) {
    this.uncheckedIds.length = 0;
    this.gridCheckAll = !this.gridCheckAll;
    if (e.target.checked) {
      this.ShippingItem.map(a => a.checked = true);
      this.PartsItem = this.ShippingItem.map(a => { return { ShippingHistoryId: a.ShippingHistoryId,RRId:a.RRId } });
    } else {
      this.ShippingItem.map(a => a.checked = false);
      this.PartsItem = [];
    }
  }
  rowCheckBoxChecked(e, ShippingHistoryId, RRId) {
    if (e.target.checked) {
      this.PartsItem.push({ ShippingHistoryId,RRId });
    } else {
      this.gridCheckAll = false
      this.PartsItem = this.PartsItem.filter(a => a.ShippingHistoryId != ShippingHistoryId);
    }
  }
  
  loadVendors() {
    this.vendors$ = concat(
      this.searchVendors().pipe( // default items
        catchError(() => of([])), // empty list on error
      ),
      this.vendorsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap(term => {
          if (term != null && term != undefined)
            return this.searchVendors(term).pipe(
              catchError(() => of([])), // empty list on error
            )
          else
            return of([])
        })
      )
    );
  }
  searchVendors(term: string = ""): Observable<any> {
    this.loadingVendors = true;
    var postData = {
      "Vendor": term
    }
    return this.commonService.postHttpService(postData, "getAllAutoCompleteofVendor")
      .pipe(
        map(response => {
          this.VendorsList = response.responseData;
          this.loadingVendors = false;
          return response.responseData;
        })
      );
  }
  selectAllVendor() {
    var VendorId=this.model.VendorId
    let VendorIdIds = this.VendorsList.map(a => a.VendorId);
    let cMerge = [...new Set([...VendorIdIds, ...VendorId])];
    this.model.VendorId = cMerge;
  }
  getUserList() {
    this.commonService.getHttpService("getAllActiveAdmin").subscribe(response => {
      if (response.status == true) {
        this.UserListddl = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  onDownloadShip(ShippingHistoryId,RRId){
    var shippingDetails={
      ShippingHistoryId:ShippingHistoryId,
      RRId:RRId
    }
    this.modalRef = this.CommonmodalService.show(PackingSlipComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { shippingDetails },
          class: 'modal-xl'
        }, class: 'gray modal-xl'
      });
  }
   
  }

