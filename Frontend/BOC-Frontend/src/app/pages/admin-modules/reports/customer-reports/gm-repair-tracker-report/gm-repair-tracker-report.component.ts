import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Subject, Observable, of, concat } from 'rxjs';
import { catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { CONST_VIEW_ACCESS, CONST_APPROVE_ACCESS, footerlineRight, footerlineLeft } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gm-repair-tracker-report',
  templateUrl: './gm-repair-tracker-report.component.html',
  styleUrls: ['./gm-repair-tracker-report.component.scss']
})
export class GmRepairTrackerReportComponent implements OnInit {


  //Server Side
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  dtTrigger: Subject<any> = new Subject();
  //Filter
  FromDate;
  Fromdate;
  Todate;
  ToDate;
  CustomerId: any = [];
  _opened: boolean = false;
  _showBackdrop: boolean = true;

  _toggleSidebar() {
    this._opened = !this._opened;
  }

  FooterRight
  FooterLeft

  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];

  //dropdowns
  customerList: any = [];
  CSVData: any = []
  spinner: boolean = false;
  IsViewEnabled

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  DownloadExcelCSVinReports
  CustomerGroupId: any
  customerGroupList: any;
  dtOptionsdeferLoadingShow: boolean = true;
  constructor(private http: HttpClient, private cd_ref: ChangeDetectorRef, public navCtrl: NgxNavigationWithDataComponent,
    private commonService: CommonService, private excelService: ExcelService, private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.IsViewEnabled = this.commonService.permissionCheck("GMRepairTrackerReport", CONST_VIEW_ACCESS);
    this.DownloadExcelCSVinReports = this.commonService.permissionCheck("GMRepairTrackerReport", CONST_APPROVE_ACCESS);
    
    //this.commonService.permissionCheck("GMReport", CONST_VIEW_ACCESS);
    //this.commonService.permissionCheck("GMReport", CONST_APPROVE_ACCESS);

    if (this.IsViewEnabled) {
      this.getCustomerGroupList()
      this.loadCustomers();
      this.onGMReport();


      this.FooterRight = footerlineRight;
      this.FooterLeft = footerlineLeft
    }

  }




  //GM Report
  onGMReport() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };
    var url = this.baseUrl + '/api/v1.0/RRReports/GMRepairTrackerReport';
    const that = this;
    var filterData = {
      "CustomerId": this.CustomerId,
      "FromDate": this.Fromdate,
      "ToDate": this.Todate,
      "CustomerGroupId": this.CustomerGroupId
    }
    this.dtOptions = this.getdtOption();
    if(this.dtOptionsdeferLoadingShow){
      this.dtOptions.deferLoading = 0;
    }
    this.dtOptions["ajax"] = (dataTablesParameters: any, callback) => {
      // that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

      that.http.post<any>(url,
        Object.assign(dataTablesParameters,
          filterData
        ), httpOptions).subscribe(resp => {
          callback({
            draw: resp.responseData.draw,
            recordsTotal: resp.responseData.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.data || []
          });
          // Calling the DT trigger to manually render the table
          this.dtTrigger.next()
        });
    };

    this.dtOptions["columns"] = [
      { data: 'IsBroken', width: '10%', name: 'IsBroken', defaultContent: '', orderable: true, searchable: true },
      { data: 'ApprovedFor', width: '10%', name: 'ApprovedFor', defaultContent: '', orderable: true, searchable: true },
      { data: 'RRNo', width: '25%', name: 'RRNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'CoreReturnDate', width: '20%', name: 'CoreReturnDate', defaultContent: '', orderable: true, searchable: true },
      { data: 'CommonCode', width: '10%', name: 'CommonCode', defaultContent: '', orderable: true, searchable: true },
      { data: 'ManufacturerPartNo', width: '25%', name: 'ManufacturerPartNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'Description', width: '50%', name: 'Description', defaultContent: '', orderable: true, searchable: true },
      { data: 'Manufacturer', width: '20%', name: 'Manufacturer', defaultContent: '', orderable: true, searchable: true },
      { data: 'SerialNo', width: '20%', name: 'SerialNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'ReasonForFailure', width: '20%', name: 'ReasonForFailure', defaultContent: '', orderable: true, searchable: true },
      { data: 'FailedOnInstall', width: '20%', name: 'FailedOnInstall', defaultContent: '', orderable: true, searchable: true },
      { data: 'FailedOnInstallNotes', width: '20%', name: 'FailedOnInstallNotes', defaultContent: '', orderable: true, searchable: true, },
      { data: 'Requestor', width: '5%', name: 'Requestor', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerDepartment', width: '20%', name: 'CustomerDepartment', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerAsset', width: '20%', name: 'CustomerAsset', defaultContent: '', orderable: true, searchable: true },
      { data: 'RepairVendor', width: '20%', name: 'RepairVendor', defaultContent: '', orderable: true, searchable: true },
      { data: 'GCCLItem', width: '5%', name: 'GCCLItem', defaultContent: '', orderable: true, searchable: true, },
      { data: 'Qty', width: '2%', name: 'Qty', defaultContent: '', orderable: true, searchable: true, },
      { data: 'CostOfNew', width: '5%', name: 'CostOfNew', defaultContent: '', orderable: true, searchable: true, },
      { data: 'TotalCostOfNew', width: '5%', name: 'TotalCostOfNew', defaultContent: '', orderable: true, searchable: true, },
      { data: 'WarrantyType', width: '5%', name: 'WarrantyType', defaultContent: '', orderable: true, searchable: true, },
      { data: 'RepairNotes', width: '5%', name: 'RepairNotes', defaultContent: '', orderable: true, searchable: true, },

      // { data: 'RepairNotes', width: '5%', name: 'RepairNotes', defaultContent: '', orderable: true, searchable: true, },
      { data: 'ShipDate', width: '5%', name: 'ShipDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'GMShipper', width: '5%', name: 'GMShipper', defaultContent: '', orderable: true, searchable: true, },
      { data: 'ShoppingCartNo', width: '5%', name: 'ShoppingCartNo', defaultContent: '', orderable: true, searchable: true, },
      { data: 'GMPO', width: '5%', name: 'GMPO', defaultContent: '', orderable: true, searchable: true, },
      { data: 'QuoteReceivedDate', width: '5%', name: 'QuoteReceivedDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'QuoteNo', width: '5%', name: 'QuoteNo', defaultContent: '', orderable: true, searchable: true, },
      { data: 'QuotedPrice', width: '5%', name: 'QuotedPrice', defaultContent: '', orderable: true, searchable: true, },
      { data: 'ExtPrice', width: '5%', name: 'ExtPrice', defaultContent: '', orderable: true, searchable: true, },
      { data: 'CostOfNewPercent', width: '5%', name: 'CostOfNewPercent', defaultContent: '', orderable: true, searchable: true, },
      { data: 'QuoteApprovedDate', width: '5%', name: 'QuoteApprovedDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'TotalSavings', width: '5%', name: 'TotalSavings', defaultContent: '', orderable: true, searchable: true, },
      { data: 'ExpectedReturnDate', width: '5%', name: 'ExpectedReturnDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'ReceiptDate', width: '5%', name: 'ReceiptDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'RepairWarrantyExpiration', width: '5%', name: 'RepairWarrantyExpiration', defaultContent: '', orderable: true, searchable: true, },
      { data: 'OpenOrderStatus', width: '5%', name: 'OpenOrderStatus', defaultContent: '', orderable: true, searchable: true, },
      { data: 'Account', width: '5%', name: 'Account', defaultContent: '', orderable: true, searchable: true, },      
      { data: 'AccountValuationClass', width: '5%', name: 'AccountValuationClass', defaultContent: '', orderable: true, searchable: true, },
      { data: 'ReceiptMonth', width: '5%', name: 'ReceiptMonth', defaultContent: '', orderable: true, searchable: true, },
      { data: 'ReceiptYear', width: '5%', name: 'ReceiptYear', defaultContent: '', orderable: true, searchable: true, },
      { data: 'CoreReturnMonth', width: '5%', name: 'CoreReturnMonth', defaultContent: '', orderable: true, searchable: true, },
      { data: 'CoreReturnYear', width: '5%', name: 'CoreReturnYear', defaultContent: '', orderable: true, searchable: true, },
      { data: 'CommonCode', width: '5%', name: 'CommonCode', defaultContent: '', orderable: true, searchable: true, },


    ];

    this.dataTable = $('#datatable-angular-gmreport');
    this.dataTable.DataTable(this.dtOptions);

  }
  rerender(): void {
    this.dtOptionsdeferLoadingShow = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      this.onGMReport()
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
      order: [[0, 'desc']],
      serverMethod: 'post',
      buttons: buttons,
      // columnDefs: [

      // ],

      createdRow: function (row, data, index) {




      },

      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.actionView2', row).unbind('click');
        $('.actionView2', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
        return row;
      },
      "preDrawCallback": function () {
        $('#datatable-angular-gmreport_processing').attr('style', 'display: block; z-index: 10000 !important');

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


  FromDateFormat(FromDate) {
    if (FromDate != null) {
      const FromDateYears = FromDate.year;
      const FromDateDates = FromDate.day;
      const FromDatemonths = FromDate.month;
      let FromDateDate = new Date(FromDateYears, FromDatemonths - 1, FromDateDates);
      this.Fromdate = moment(FromDateDate).format('YYYY-MM-DD');
    } else {
      this.Fromdate = ''
    }
  }
  ToDateFormat(ToDate) {
    if (ToDate != null) {
      const ToDateYears = ToDate.year;
      const ToDateDates = ToDate.day;
      const ToDatemonths = ToDate.month;
      let ToDateof = new Date(ToDateYears, ToDatemonths - 1, ToDateDates);
      this.Todate = moment(ToDateof).format('YYYY-MM-DD')
    } else {
      this.Todate = ''
    }
  }


  onFilter(event) {

    this.rerender();
    this._opened = !this._opened;
  }
  onClear(event) {
    if(this.CustomerGroupId != null || this.CustomerGroupId != ''){
      this.CustomerGroupId = "";
      this.loadCustomers();
    }
    this.CustomerId = ""
    this.Fromdate = ""
    this.Todate = ""
    this.FromDate = ""
    this.ToDate = ""
    this.CustomerGroupId = ""
    this.rerender();
    this._opened = !this._opened;
  }



  //Excel
  onExportToCSV() {
    var postData = {
      "CustomerId": this.CustomerId,
      "FromDate": this.Fromdate,
      "ToDate": this.Todate,
      "CustomerGroupId": this.CustomerGroupId
    }
    this.spinner = true
    this.commonService.postHttpService(postData, "GMRepairTrackerReportExcel").subscribe(response => {
      if (response.status == true) {
        this.CSVData = response.responseData.ExcelData;
        this.generateCSVFormat();
        this.spinner = false
        Swal.fire({
          title: 'Success!',
          text: 'CSV downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        this.spinner = false
        Swal.fire({
          title: 'Error!',
          text: 'CSV could not be downloaded!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  generateCSVFormat() {

    let sampleJson: any = this.CSVData
    let a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    let csvData = this.ConvertToCSV(sampleJson);
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
    var filename = ('GM Repair Tracker Report .csv')
    a.download = filename;
    a.click()

  }
  ConvertToCSV(objArray) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = "";
    for (let index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        if (line != '') line += ',';

        line += "\"" + array[i][index] + "\"";

        // line += "\"" + (array[i][index]).toString().replace(/"/g, '""') + "\"";


      }
      str += line + '\r\n';
    }
    return str;
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
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

  getCustomerGroupList() {
    this.commonService.getHttpService("ddCustomerGroup").subscribe(response => {
      if (response.status) {
        this.customerGroupList = response.responseData;
      }
    });
  }
  changeCustomerGroup(event) {
    // console.log(event);
    if (event && event.CustomerGroupId > 0) {
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
    } else {
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
