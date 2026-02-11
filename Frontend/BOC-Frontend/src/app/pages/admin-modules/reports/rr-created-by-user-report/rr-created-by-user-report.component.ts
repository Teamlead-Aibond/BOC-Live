import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Workbook } from 'exceljs';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Subject, Observable, of, concat } from 'rxjs';
import { catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { CONST_VIEW_ACCESS, CONST_APPROVE_ACCESS, array_rr_status, user_type, ShipViaReportIdentity } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as fs from 'file-saver';
import * as moment from 'moment';
@Component({
  selector: 'app-rr-created-by-user-report',
  templateUrl: './rr-created-by-user-report.component.html',
  styleUrls: ['./rr-created-by-user-report.component.scss']
})
export class RRCreatedByUserReportComponent implements OnInit {

  spinner: boolean = false;

  //Server Side
  baseUrl = `${environment.api.apiURL}`;
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  //Filter
  FromDate;
  Fromdate;
  Todate;
  ToDate;
  CustomerId: any = [];
  Status = '';
  VendorId: any = [];

  _opened: boolean = false;
  _showBackdrop: boolean = true;
  UserName: string;

  _toggleSidebar() {
    this._opened = !this._opened;
  }

  FooterRight
  FooterLeft



  //dropdowns
  customerList: any = [];
  vendorList: any = [];
  ExcelData;
  RRStatus


  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];


  vendors$: Observable<any> = of([]);
  vendorsInput$ = new Subject<string>();
  loadingVendors: boolean = false;
  VendorsList: any[] = [];
  IsViewEnabled
  DownloadExcelCSVinReports;
  adminList: any = []
  UserTypeList: any = []
  ShipViaList: any = []
  ShipTo
  ShipFrom
  ShipById
  ShipViaId
  ShipDate
  Shipdate
  ShipFromIdentity
  ShipToIdentity
  CustomerGroupId: any
  customerGroupList: any;
  dtOptionsdeferLoadingShow: boolean = true;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  constructor(private http: HttpClient, private cd_ref: ChangeDetectorRef, public navCtrl: NgxNavigationWithDataComponent,
    private commonService: CommonService, private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.IsViewEnabled = this.commonService.permissionCheck("ShipViaReport", CONST_VIEW_ACCESS);
    this.DownloadExcelCSVinReports = this.commonService.permissionCheck("ShipViaReport", CONST_APPROVE_ACCESS);

    if (this.IsViewEnabled) {
      this.getCustomerGroupList();
      this.loadCustomers();
      this.loadVendors();
      this.getAdminList()
      this.getShipViaList()
      this.UserTypeList = ShipViaReportIdentity
      this.onList();
    }

  }

  getShipViaList() {
    this.commonService.getHttpService('ShipViaList').subscribe(response => {
      this.ShipViaList = response.responseData;
    });
  }
  onList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };
    var url3 = this.baseUrl + '/api/v1.0/RRReports/RRCreatedByUserReports';
    const that = this;
    var filterData = {
      "CustomerId": (this.CustomerId).toString(),
      "UserName": this.UserName,
      "FromDate": this.Fromdate,
      "ToDate": this.Todate,
      "CustomerGroupId": this.CustomerGroupId
    }

    this.dtOptions = this.getdtOption();
    if(this.dtOptionsdeferLoadingShow){
      this.dtOptions.deferLoading = 0;
    }
    this.dtOptions["ajax"] = (dataTablesParameters: any, callback) => {
      that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

      that.api_check = that.http.post<any>(url3,
        Object.assign(dataTablesParameters,
          filterData
        ), httpOptions).subscribe(resp => {
          callback({
            draw: resp.responseData.draw,
            recordsTotal: resp.responseData.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.data || []
          });
          this.dtTrigger.next()
        });
    };


    this.dtOptions["columns"] = [
      { data: 'UserName', name: 'UserName', defaultContent: '', orderable: true, searchable: true,},
      { data: 'Created', name: 'Created', defaultContent: '', orderable: true, searchable: true },
      { data: 'count', name: 'count', defaultContent: '', orderable: false, searchable: false },
      { data: 'Customer', name: 'Customer', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerId', name: 'CustomerId', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerGroupId', name: 'CustomerGroupId', defaultContent: '', orderable: true, searchable: true }
    ];

    this.dataTable = $('#datatable-angular-ShipViaReport');
    this.dataTable.DataTable(this.dtOptions);

  }

  rerender(): void {
    this.dtOptionsdeferLoadingShow = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      this.onList()
    });
  }
  getdtOption() {
    if (this.DownloadExcelCSVinReports) {
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
    return {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-3 col-sm-3 col-md-3 col-xl-3"l><"col-4 col-sm-4 col-md-4 col-xl-4"i><"col-5 col-sm-5 col-md-5 col-xl-5"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      autoWidth: false,
      serverSide: true,
      searching: false,
      retrieve: true,
      order: [[1, 'desc']],
      serverMethod: 'post',
      buttons: buttons,
      columnDefs: [
      
        {
          "targets": [4],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [5],
          "visible": false,
          "searchable": true
        }
      
      ],
      createdRow: function (row, data, index) {
        var html = moment(data.Created).format('L');
        $('td', row).eq(1).html(html);
      },

      rowCallback: (row: Node, data: any | Object, index: number) => {
      },
      "preDrawCallback": function () {
        $('#datatable-angular-ShipViaReport_processing').attr('style', 'display: block; z-index: 10000 !important');

      },
      language: {
        "paginate": {
          "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>'
        },
        "loadingRecords": '&nbsp;',
        "processing": 'Loading...',
        "emptyTable":  this.dtOptionsdeferLoadingShow ? '<div class="alert alert-info" style="margin-left: 17%" role="alert">Please select filter to load data!</div>' : 'No data available!'
      }
    };
  }
  FromDateFormat(DATE) {
    const DateYears = DATE.year;
    const DateDates = DATE.day;
    const Datemonths = DATE.month;
    let Dateformat = new Date(DateYears, Datemonths - 1, DateDates);
    this.Fromdate = moment(Dateformat).format('YYYY-MM-DD');
  }
  ToDateFormat(DATE) {
    const DateYears = DATE.year;
    const DateDates = DATE.day;
    const Datemonths = DATE.month;
    let Dateformat = new Date(DateYears, Datemonths - 1, DateDates);
    this.Todate = moment(Dateformat).format('YYYY-MM-DD');
  }

  onFilter(event) {
    this.rerender()
    this._opened = !this._opened;
  }
  onClear(event) {
    if(this.CustomerGroupId != null || this.CustomerGroupId != ''){
      this.CustomerGroupId = "";
      this.loadCustomers();
    }
      this.CustomerId = "",
      this.UserName = "",
      this.FromDate = null;
      this.ToDate = null;
      this.CustomerGroupId = "";
    this.rerender()
    this._opened = !this._opened;
  }
  onExcel() {
    var postData = {
      "CustomerId": (this.CustomerId).toString(),
      "UserName": this.UserName,
      "FromDate": this.Fromdate,
      "ToDate": this.Todate,
      "CustomerGroupId": this.CustomerGroupId
    }
    this.spinner = true
    this.commonService.postHttpService(postData, "RRCreatedByUserReportsExcel").subscribe(response => {
      if (response.status == true) {
        this.ExcelData = response.responseData.ExcelData;
        this.generateExcelFormat();
        this.spinner = false
        Swal.fire({
          title: 'Success!',
          text: 'Excel downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        this.spinner = false
        Swal.fire({
          title: 'Error!',
          text: 'Excel could not be downloaded!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }
  generateExcelFormat() {
    var data = []
    var jsonData = this.ExcelData
    for (var i = 0; i < jsonData.length; i++) {
      var obj = jsonData[i];
      var keyNames = Object.keys(jsonData[i]);
      var temparray = [];
      for (var key in obj) {
        var value = obj[key];
        temparray.push(value);
      }
      data.push(temparray);
    }

    //Excel Title, Header, Data
    const title = 'RRs created by User Report';
    // const header = keyNames
    const header = ['User Name', 'RR Created Date', 'Number of RRs', 'Customer Name']
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Data');
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
    worksheet.getColumn(1).width = 25;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 25;

    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = ('RRs created by User Report ' + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })


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
    let cMerge = [...new Set([...customerIds, ...this.CustomerId])];
    this.CustomerId = cMerge;
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
    let VendorIdIds = this.VendorsList.map(a => a.VendorId);
    let cMerge = [...new Set([...VendorIdIds, ...this.VendorId])];
    this.VendorId = cMerge;
  }
  getAdminList() {
    this.commonService.getHttpService('getAllActiveAdmin').subscribe(response => {//getAdminListDropdown
      this.adminList = response.responseData.map(function (value) {
        return { title: value.FirstName + " " + value.LastName, "UserId": value.UserId }
      })
    });
  }
  getCustomerGroupList() {
    this.commonService.getHttpService("ddCustomerGroup").subscribe(response => {
      if (response.status) {
        this.customerGroupList = response.responseData;
      } 
    });
  }
  changeCustomerGroup(event){
    // console.log(event);
    if(event && event.CustomerGroupId > 0){
      this.CustomerId = ''
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


