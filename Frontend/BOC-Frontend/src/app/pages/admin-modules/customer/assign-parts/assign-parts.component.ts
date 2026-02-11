/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, Input } from '@angular/core';
import { Subject, Subscription, interval } from 'rxjs';
import * as moment from 'moment';
import Swal from 'sweetalert2';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from 'src/app/core/services/common.service';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { AppConfig } from 'config';
import { attachment_thumb_images } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AssignPartComponent } from '../../common-template/assign-part/assign-part.component';
import { EditAssignPartsComponent } from '../../common-template/edit-assign-parts/edit-assign-parts.component';

@Component({
  selector: 'app-assign-parts',
  templateUrl: './assign-parts.component.html',
  styleUrls: ['./assign-parts.component.scss']
})
export class AssignPartsComponent implements OnInit, OnDestroy {
  CustomerId;
  CustomerPartId;
  data;
  basicData;
  ProfilePhoto;
  Website;
  Price;
  edit = false;
  show = true;
  PartId;
  partList;
  NewPrice;
  LPP;
  PartNo
  CustomerPartList: any[] = [];;
  datalen: boolean = false;
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  dtOptions: any = {};
  dtOptions2: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  dataTable2: any
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  @Input() dateFilterField;
  draw: string;
  start: string;
  length: string;

  // Card Data
  cardData: any;
  tableData: any = [];
  CustomerCurrencyCode
  CurrencySymbol
  constructor(
    public service: CommonService,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private cd_ref: ChangeDetectorRef,
    private openmodalService: NgbModal, private modalService: BsModalService,
    public modalRef: BsModalRef, private httpClient: HttpClient, private http: HttpClient, ) { }
  currentRouter = this.router.url;

  ngOnInit() {
    this.basicData = { Email: '', Website: '' };
    this.CustomerId = '';
    this.CustomerPartId = '';
    this.draw = '';
    this.start = '';
    this.length = '';

    this.CustomerId = this.navCtrl.get('CustomerId');

    // Redirect to the List page if the View Id is not available
    if (this.CustomerId == '' || this.CustomerId == 'undefined' || this.CustomerId == null) {
      this.navCtrl.navigate('/admin/customer/list/');
      return false;
    }
    var postData = {
      CustomerId: this.CustomerId
    }
    this.service.postHttpService(postData, "getCustomerPartInfoView").subscribe(response => {
      if (response.status == true) {
        this.basicData = response.responseData.CustomerInfo[0];
        this.CustomerPartList = response.responseData.PartsInfo
        this.CustomerCurrencyCode =  this.basicData.CustomerCurrencyCode
        this.CurrencySymbol = this.basicData.CurrencySymbol
        this.Price = "$150.00"
        // Get the basic data
        // Set the profile photo        
        this.ProfilePhoto = 'assets/images/icons/Customer.png';
        if (this.basicData.ProfilePhoto != null && this.basicData.ProfilePhoto != '') {
          this.ProfilePhoto = this.basicData.ProfilePhoto;
        }

        this.Website = "http://" + this.basicData.Website;
      } else { }
      if (!(this.cd_ref as any).destroyed) {
        this.cd_ref.detectChanges();
      }
    }, error => console.log(error));


    this.onTotalPartList();
    this.onCustomerPartList();

  }

  getdtOption() {
    return {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-3 col-sm-3 col-md-3 col-xl-3"l><"col-4 col-sm-4 col-md-4 col-xl-4"i><"col-5 col-sm-5 col-md-5 col-xl-5"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      autoWidth: false,
      serverSide: true,
      retrieve: true,
      order: [[0, 'desc']],
      serverMethod: 'post',
      buttons: {
        dom: {
          button: {
            className: ''
          }

        },
        buttons: []
      },


      //columnDefs: [{width: '10%', targets:0}],






      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.actionView2', row).unbind('click');
        $('.actionView2', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.MovetoCustomerParts(data)
        });
        return row;
      },

      language: {
        "paginate": {
          "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>'
        }
      }
    };
  }

  getdtOption2() {
    return {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-12 col-sm-6 col-md-6 col-xl-6"l><"col-12 col-sm-6 col-md-6 col-xl-6"i><"col-12 col-sm-12 col-md-12 col-xl-12"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      serverSide: true,
      retrieve: true,
      order: [[0, 'desc']],
      serverMethod: 'post',
      buttons: {
        dom: {
          button: {
            className: ''
          }
        },
        buttons: []
      },
      createdRow: function (row, data, index) {
        var html = '<span>' +data.CurrencySymbol+ ' '+data.NewPrice + '</span>'
        $('td', row).eq(3).html(html);

      },
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.actionView3', row).unbind('click');
        $('.actionView3', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.deleteCustomerPart(data.CustomerPartId);
        });

        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.editCustomerParts(data);
        });
        return row;
      },

      language: {
        "paginate": {
          "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>'
        }
      }
    };
  }

  MovetoCustomerParts(item) {
    var i = 0
    var CustomerId = this.CustomerId
    var CustomerCurrencyCode = this.CustomerCurrencyCode
    var CurrencySymbol = this.CurrencySymbol
    this.modalRef = this.modalService.show(AssignPartComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { item, i, CustomerId,CustomerCurrencyCode,CurrencySymbol },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      })
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      // this.CustomerPartList.push(res.data);
      this.reLoad();

    });
  }

  onTotalPartList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/parts/PartsListByServerSide';
    const that = this;
    var filterData = {}
    this.dtOptions = this.getdtOption();
    this.dtOptions["ajax"] = (dataTablesParameters: any, callback) => {
      // that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

      that.http.post<any>(url,
        Object.assign(dataTablesParameters,
          filterData
        ), httpOptions).subscribe(resp => {
          // if (resp.responseData == "No record") {
          //   this.datalen = true;
          // }
          callback({
            draw: resp.responseData.draw,
            recordsTotal: resp.responseData.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.data || []
          });
        });
    };

    this.dtOptions["columns"] = [
      { data: 'PartNo', width: '15%', name: 'PartNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'Description', width: '65%', name: 'Description', defaultContent: '', orderable: true, searchable: true },
      { data: 'Price', width: '10%', name: 'Price', defaultContent: '', orderable: true, searchable: true },
      {
        data: 'PartId', width: '10%', name: 'PartId', defaultContent: '', orderable: true, searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          return `
        <a href="#" class="remixicon-arrow-right-fill text-secondary actionView2" data-toggle='tooltip' title='Move To Customer Parts' data-placement='top' ngbTooltip="Move To Customerparts"></a>`;
        }
      },
    ];

    this.dataTable = $('#datatable-angular-partslist');
    this.dataTable.DataTable(this.dtOptions);
  }


  onCustomerPartList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };
    var url2 = this.baseUrl + '/api/v1.0/customerParts/CustomerPartsListByServerSide';
    const that = this;
    var filterData2 = { CustomerId: this.CustomerId }
    this.dtOptions2 = this.getdtOption2();
    this.dtOptions2["ajax"] = (dataTablesParameters: any, callback) => {
      // that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

      that.http.post<any>(url2,
        Object.assign(dataTablesParameters,
          filterData2
        ), httpOptions).subscribe(resp => {
          // if (resp.responseData == "No record") {
          //   console.log("response", resp);
          //   this.datalen = true;
          // }
          callback({
            draw: resp.responseData.draw,
            recordsTotal: resp.responseData.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.data || []
          });
        });
    };

    this.dtOptions2["columns"] = [
      { data: 'PartNo', width: '15%', name: 'PartNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerPartNo1', name: 'CustomerPartNo1', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerPartNo2', name: 'CustomerPartNo2', defaultContent: '', orderable: true, searchable: true },
      { data: 'NewPrice', name: 'NewPrice', defaultContent: '', orderable: true, searchable: true },
      { data: 'LastPricePaid', name: 'LastPricePaid', defaultContent: '', orderable: true, searchable: true },
      {
        data: 'CustomerPartId', name: 'CustomerPartId', defaultContent: '', orderable: true, searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          return `
        <a href="#" class="fa fa-edit text-secondary actionView1" data-toggle='tooltip' title='Edit Part' data-placement='top'></a> &nbsp;
        <a href="#" class="fa fa-trash text-danger actionView3" data-toggle='tooltip' title='Delete Part' data-placement='top'></a>`;
        }
      },
    ];
    this.dataTable2 = $('#datatable-angular-customerparts');
    this.dataTable2.DataTable(this.dtOptions2);
  }

  reLoad() {
    this.router.navigate([this.currentRouter])
  }
  deleteCustomerPart(CustomerPartId) {
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
          CustomerPartId: CustomerPartId,
        }
        this.service.postHttpService(postData, 'getCustomerPartDelete').subscribe(response => {
          if (response.status == true) {
            //  this.CustomerPartList.splice(i, 1)
            this.reLoad();
            Swal.fire({
              title: 'Deleted!',
              text: 'Customer Part has been deleted.',
              type: 'success'
            });
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Customer Part is safe:)',
          type: 'error'
        });
      }
    });
  }




  editCustomerParts(item) {
    var i = 0
    var CustomerId = this.CustomerId
    var CustomerCurrencyCode = this.CustomerCurrencyCode
    var CurrencySymbol = this.CurrencySymbol
    this.modalRef = this.modalService.show(EditAssignPartsComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { item, CustomerId,CustomerCurrencyCode,CurrencySymbol },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      })
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.reLoad();

    });
  }
  updateCustomerPart(CustomerPartId, i, PartId, item) {
    var postData = {
      "CustomerPartId": CustomerPartId,
      "CustomerId": this.CustomerId,
      "PartId": item.PartId,
      "PartNo": this.PartNo || item.PartNo,
      "NewPrice": this.NewPrice || item.NewPrice,
      "LPP": this.LPP || item.LPP,

    }
    this.service.postHttpService(postData, "getCustomerPartEdit").subscribe(response => {
      if (response.status == true) {
        this.show = true;
        this.edit = false;
        Swal.fire({
          title: 'Success!',
          text: 'Customer Part updated Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
        this.CustomerPartList[i] = response.responseData
      }
      else {
        Swal.fire({
          title: 'Error!',
          text: 'Customer Part could not be updated!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }

}
