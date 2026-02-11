/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { CONST_VIEW_ACCESS, CONST_CREATE_ACCESS } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-login-loglist',
  templateUrl: './user-login-loglist.component.html',
  styleUrls: ['./user-login-loglist.component.scss']
})
export class UserLoginLoglistComponent implements OnInit {



  baseUrl = `${environment.api.apiURL}`;

  //access rights variables
  IsViewEnabled
  IsAddEnabled

  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;


  LoginDomain
  LoginDate
  loginDate
  UserId
  adminListddl: any = []
  vendorList: any = []
  customerList: any = []
  UserListddl: any = []
  UserName
  LoginSuccess = ""
  LogUserIdentityType = ""
  LogUserIdentityId
  constructor(private http: HttpClient,
    private router: Router, public service: CommonService, private cd_ref: ChangeDetectorRef, private commonService: CommonService,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    public navCtrl: NgxNavigationWithDataComponent

  ) { }
  currentRouter = this.router.url;

  ngOnInit(): void {
    document.title = 'Login Log List'
    this.IsViewEnabled = this.service.permissionCheck("UserLoginLog", CONST_VIEW_ACCESS);
    if (this.IsViewEnabled) {
      this.onList()
      this.getCustomerList()
      this.getAdminList();
      this.getVendorList();
    }
  }
  getAdminList() {
    this.service.getHttpService('getAllActiveAdmin').subscribe(response => {//getAdminListDropdown
      this.adminListddl = response.responseData.map(function (value) {
        return { title: value.FirstName + " " + value.LastName, "Id": value.UserId }
      });
    });
  }
  getVendorList() {
    this.commonService.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData.map(function (value) {
        return { title: value.VendorName, "Id": value.VendorId }
      });
    });
  }

  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData.map(function (value) {
        return { title: value.CompanyName, "Id": value.CustomerId }
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

    var url = this.baseUrl + '/api/v1.0/UserLoginLog/listwithFilter';
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
          "targets": [7],
          "visible": false,
          "searchable": true
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
      ],
      'select': {
        'style': 'multi'
      },
      createdRow: function (row, data, index) {


      },
      columns: [


        {
          data: 'LogUserIdentityTypeName', name: 'LogUserIdentityTypeName', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var text
            if (row.LogUserIdentityTypeName == "Admin") {
              return row.LogUserIdentityTypeName = "Aibond Portal";
            } else {
              return row.LogUserIdentityTypeName
            };
          }
        },
        {
          data: 'Username', name: 'Username', defaultContent: '', orderable: false, searchable: true,

        },
        {
          data: 'LogUserFullName', name: 'LogUserFullName', defaultContent: '', orderable: false, searchable: true,

        },
        {
          data: 'LoginDomain', name: 'LoginDomain', orderable: true, searchable: true, defaultContent: '',


        },
        { data: 'IPAddress', name: 'IPAddress', orderable: true, searchable: true, },
        {
          data: 'IsLoginSuccess', name: 'IsLoginSuccess', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            if (row.IsLoginSuccess == 1) {
              return `<span class="badge badge-success  btn-xs">Yes</span>`;
            } else {
              return `<span class="badge badge-danger  btn-xs">No</span>`;
            };
          }
        },
        { data: 'LoginDateTime', name: 'LoginDateTime', orderable: true, searchable: true, },

        {
          data: 'UserId', name: 'UserId', orderable: true, searchable: true,
        },


        {
          data: 'Created', name: 'Created', orderable: true, searchable: true,
        },
        { data: 'LogUserIdentityType', name: 'LogUserIdentityType', orderable: true, searchable: true, },
        { data: 'LogUserIdentityId', name: 'LogUserIdentityId', orderable: true, searchable: true, },

      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {




        return row;
      },
      "preDrawCallback": function () {
        $('#login-loglist_processing').attr('style', 'display: block; z-index: 10000 !important');

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
    this.dataTable = $('#login-loglist');
    this.dataTable.DataTable(this.dtOptions);
  }




  LoginDateFormat(LoginDate) {
    const LoginDateYears = LoginDate.year;
    const LoginDateDates = LoginDate.day;
    const LoginDatemonths = LoginDate.month;
    let LoginDateformat = new Date(LoginDateYears, LoginDatemonths - 1, LoginDateDates);
    this.loginDate = moment(LoginDateformat).format('YYYY-MM-DD')
  }

  onFilter(event) {
    var table = $('#login-loglist').DataTable();
    table.columns(1).search(this.UserName);
    table.columns(3).search(this.LoginDomain);
    table.columns(5).search(this.LoginSuccess);
    table.columns(7).search(this.UserId);
    table.columns(8).search(this.loginDate);
    table.columns(9).search(this.LogUserIdentityType);
    table.columns(10).search(this.LogUserIdentityId);
    table.draw();

  }

  onClear() {
    this.loginDate = ''
    this.LoginDate = ''
    this.UserId = ''
    this.LoginDomain = ''
    this.LoginSuccess = ""
    this.UserName = ''
    this.LogUserIdentityType = ''
    this.LogUserIdentityId = ''
    var table = $('#login-loglist').DataTable();
    table.columns(1).search(this.UserName);
    table.columns(3).search(this.LoginDomain);
    table.columns(5).search(this.LoginSuccess);
    table.columns(7).search(this.UserId);
    table.columns(8).search(this.loginDate);
    table.columns(9).search(this.LogUserIdentityType);
    table.columns(10).search(this.LogUserIdentityId);
    table.draw();
  }


  onUserType(value) {
    this.UserId = ""
    this.LogUserIdentityId = ""
    if (value == "0") {
      this.UserListddl = this.adminListddl
    }
    else if (value == "1") {
      this.UserListddl = this.customerList
    }
    else if (value == "2") {
      this.UserListddl = this.vendorList
    }

  }




}



