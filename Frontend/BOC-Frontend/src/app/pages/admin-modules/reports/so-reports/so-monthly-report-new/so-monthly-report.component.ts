import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { DatePipe } from '@angular/common';
import { footerlineRight, footerlineLeft, SalesOrder_Status, SalesOrder_Type, CONST_VIEW_ACCESS, CONST_APPROVE_ACCESS, ProcessingHTML } from 'src/assets/data/dropdown';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators'; import { Router } from '@angular/router';
@Component({
  selector: 'app-so-monthly-report',
  templateUrl: './so-monthly-report.component.html',
  styleUrls: ['./so-monthly-report.component.scss']
})
export class SoMonthlyReportComponent implements OnInit {
  spinner: boolean = false;
  spinnerallCustomer: boolean = false;
  //Server Side
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  dtElement: DataTableDirective;


  //Filter
  SalesOrderReports: any = [];
  DateRequested;
  DateRequestedTo;
  DueDate;
  DueDateTo;
  dateRequested;
  dateRequestedTo;
  dueDate;
  dueDateTo;
  CustomerId: any = [];
  Month;
  PartId;
  PartNo;
  Part;
  SOType = '';
  Status = '';
  IncludeRR = ''
  yearRange = [];
  date = new Date();
  currentYear = this.date.getFullYear();
  syear = 2010;
  ReportingbyYear
  Year


  _opened: boolean = false;
  _showBackdrop: boolean = true;
  
  _toggleSidebar() {
    this._opened = !this._opened;
  }

  FooterRight
  FooterLeft
  TotalSales = "*******"

  //dropdown
  customerList;
  SalesOrderStatus;
  SalesOrderType;
  ExcelData;


  keyword = 'PartNo';
  data = [];
  SOReport = [];
  filteredData: any[];
  isLoading: boolean = false;
  datalen: boolean = false;

  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  OverAllSummary
  OverAllBaseSummary

  dtTrigger: Subject<any> = new Subject();

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  DownloadExcelCSVinReports
  IsViewEnabled
  ViewCostinReports
  ViewProfitinReports
  ViewMargininReports
  CurrencyList:any=[]
  CurrencyCode = ''
  CountryList:any=[]
  CreatedByLocation = ''
  OverAllBaseSummaryShow:boolean=false
  CustomerGroupId: any
  customerGroupList: any;
  constructor(private http: HttpClient, private cd_ref: ChangeDetectorRef, public navCtrl: NgxNavigationWithDataComponent,
    private commonService: CommonService, public router: Router,
    private excelService: ExcelService, private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.OverAllSummary = ''
    this.OverAllBaseSummary =''
    this.IsViewEnabled = this.commonService.permissionCheck("MonthlySalesReport", CONST_VIEW_ACCESS);
    this.DownloadExcelCSVinReports = this.commonService.permissionCheck("MonthlySalesReport", CONST_APPROVE_ACCESS);

    if (this.IsViewEnabled) {
      this.ViewCostinReports = this.commonService.permissionCheck("ViewCostinReports", CONST_VIEW_ACCESS);
      this.ViewProfitinReports = this.commonService.permissionCheck("ViewProfitinReports", CONST_VIEW_ACCESS);
      this.ViewMargininReports = this.commonService.permissionCheck("ViewMargininReports", CONST_VIEW_ACCESS);
      this.getYearDropDown(this.syear, this.currentYear);
      this.ReportingbyYear = this.currentYear;
      this.getCustomerGroupList();
      this.getCustomerList();
      this.onList();
      this.loadCustomers()
      this.getCountryList()
      this.getCurrencyList()
      this.SalesOrderStatus = SalesOrder_Status;
      this.SalesOrderType = SalesOrder_Type;
      this.FooterRight = footerlineRight;
      this.FooterLeft = footerlineLeft;
    }
    if(localStorage.getItem('IsSuperAdmin')=='0'){
      this.OverAllBaseSummaryShow=true
    }else{
      this.OverAllBaseSummaryShow=false
    }
  }

  getYearDropDown(startYear, endYear) {
    this.yearRange = [];
    for (var i = startYear; i <= endYear; i++) {
      this.yearRange.push(i);
    } //console.log(this.yearRange, 'yearRange')
    this.yearRange = this.yearRange.slice().reverse()
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear();
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }


  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData.map(function (value) {
        return { title: value.CompanyName, "CustomerId": value.CustomerId }
      });
    });
  }

  //So by customer List
  onList() {
    this.IncludeRR = history.state.IncludeRR ? history.state.IncludeRR : '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };
    var url = this.baseUrl + '/api/v1.0/SalesOrderReports/SalesByMonthNew';
    const that = this;
    var filterData = {}
    this.dtOptions = this.getdtOption(this);
    this.dtOptions["ajax"] = (dataTablesParameters: any, callback) => {
      var filterData = {
        Year: that.ReportingbyYear,
        IncludeRR: that.IncludeRR
      }
      that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

      that.api_check = that.http.post<any>(url,
        Object.assign(dataTablesParameters,
          filterData
        ), httpOptions).subscribe(resp => {
          callback({
            draw: resp.responseData.draw,
            recordsTotal: resp.responseData.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.data || []
          });
          this.OverAllSummary = resp.responseData.OverAllSummary
          this.OverAllBaseSummary = resp.responseData.OverAllBaseSummary[0]
        });
    };

    this.dtOptions["columns"] = [
      { data: 'CustomerId', width: '5%', name: 'CustomerId', defaultContent: '', orderable: true, searchable: true, },
      {
        data: 'Year', width: '10%', name: 'Year', defaultContent: '', orderable: true, searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          var link = '';
          link += `<a  href ="#" class="text-primary actionView1" data-toggle='tooltip' title='SO Report By Customer' data-placement='top'>${row.Month} ${row.Year}</a>`;
          return link;
        }
      },
      { data: 'Price', width: '20%', name: 'Price', defaultContent: '', orderable: true, searchable: true },
      { data: 'DateRequested', width: '10%', name: 'DateRequested', defaultContent: '', orderable: true, searchable: true },
      { data: 'DateRequestedTo', width: '10%', name: 'DateRequestedTo', defaultContent: '', orderable: true, searchable: true },
      { data: 'DueDate', width: '20%', name: 'DueDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'DueDateTo', width: '10%', name: 'DueDateTo', defaultContent: '', orderable: true, searchable: true, },
      { data: 'Created', width: '2%', name: 'Created', defaultContent: '', orderable: true, searchable: true, },
      { data: 'CreatedTo', width: '5%', name: 'CreatedTo', defaultContent: '', orderable: true, searchable: true, },
      { data: 'PartId', width: '20%', name: 'PartId', defaultContent: '', orderable: true, searchable: true },
      { data: 'Status', width: '20%', name: 'Status', defaultContent: '', orderable: true, searchable: true },
      { data: 'SOType', width: '20%', name: 'SOType', defaultContent: '', orderable: true, searchable: true },

      { data: 'IncludeRR', width: '20%', name: 'IncludeRR', defaultContent: '', orderable: true, searchable: true },
      { data: 'Cost', width: '20%', name: 'Cost', defaultContent: '', orderable: true, searchable: true },
      { data: 'Profit', width: '20%', name: 'Profit', defaultContent: '', orderable: true, searchable: true },
      { data: 'Margin', width: '20%', name: 'Margin', defaultContent: '', orderable: true, searchable: true },
      {
        data: 'Month', name: 'Month', className: 'text-center', orderable: true, searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          var link = '';
          link += `<a href="#" class="far fa-file-excel text-primary actionView2" data-toggle='tooltip' title='Month Excel Download' data-placement='top' ></a> &nbsp;`;
          return link;
        }
      },
      { data: 'CurrencyCode', width: '20%', name: 'CurrencyCode', defaultContent: '', orderable: true, searchable: true },
      { data: 'CreatedByLocation', width: '20%', name: 'CreatedByLocation', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerGroupId', width: '20%', name: 'CustomerGroupId', defaultContent: '', orderable: true, searchable: true },
  
    ];


    this.dataTable = $('#datatable-angular-SoByMonthly');
    this.dataTable.DataTable(this.dtOptions);

  }



  selectEvent(item) {
    this.PartId = item.PartId
  }
  clearRREvent(item) {
    this.PartId = ''
    this.Part = ''

  }
  onChangeSearch(val: string) {

    if (val) {
      // console.log(val)
      this.isLoading = true;
      var postData = {
        "PartNo": val
      }
      this.commonService.postHttpService(postData, "getonSearchPartByPartNo").subscribe(response => {
        if (response.status == true) {
          this.data = response.responseData
          this.filteredData = this.data.filter(a => a.PartNo.toLowerCase().includes(val.toLowerCase())

          )

        }
        else {

        }
        this.isLoading = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoading = false; });

    }
  }


  onFocused(e) {
    // do something when input is focused
  }
  //Format
  RequestedDateFormat(DateRequested) {
    if (DateRequested != null) {
      const DateRequestedYears = DateRequested.year;
      const DateRequestedDates = DateRequested.day;
      const DateRequestedmonths = DateRequested.month;
      let DateRequestedDate = new Date(DateRequestedYears, DateRequestedmonths - 1, DateRequestedDates);
      this.dateRequested = moment(DateRequestedDate).format('YYYY-MM-DD');
    } else {
      this.dateRequested = ''
    }
  }
  DateRequestedToFormat(DateRequestedTo) {
    if (DateRequestedTo != null) {

      const DateRequestedToYears = DateRequestedTo.year;
      const DateRequestedToDates = DateRequestedTo.day;
      const DateRequestedTomonths = DateRequestedTo.month;
      let DateRequestedToof = new Date(DateRequestedToYears, DateRequestedTomonths - 1, DateRequestedToDates);
      this.dateRequestedTo = moment(DateRequestedToof).format('YYYY-MM-DD')
    } else {
      this.dateRequestedTo = ''
    }
  }

  DueDateFormat(DueDate) {
    if (DueDate != null) {

      const DueDateYears = DueDate.year;
      const DueDateDates = DueDate.day;
      const DueDatemonths = DueDate.month;
      let DueDateDate = new Date(DueDateYears, DueDatemonths - 1, DueDateDates);
      this.dueDate = moment(DueDateDate).format('YYYY-MM-DD');
    } else {
      this.dueDate = ''
    }
  }
  DueDateToFormat(DueDateTo) {
    if (DueDateTo != null) {

      const DueDateToYears = DueDateTo.year;
      const DueDateToDates = DueDateTo.day;
      const DueDateTomonths = DueDateTo.month;
      let DueDateToof = new Date(DueDateToYears, DueDateTomonths - 1, DueDateToDates);
      this.dueDateTo = moment(DueDateToof).format('YYYY-MM-DD')
    } else {
      this.dueDateTo = ''
    }
  }

  getdtOption(that) {
    if(this.DownloadExcelCSVinReports){
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
    return {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-3 col-sm-3 col-md-3 col-xl-3"l><"col-4 col-sm-4 col-md-4 col-xl-4"i><"col-5 col-sm-5 col-md-5 col-xl-5"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      // autoWidth: false,
      serverSide: true,
      searching: true,
      retrieve: true,
      paging: false,
      bInfo: false,
      order: [[0, 'desc']],
      serverMethod: 'post',
      buttons:buttons,  
      columnDefs: [
        {
          "targets": [0],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [3],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [4],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [5],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [6],
          "visible": false,
          "searchable": true
        },
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
          "visible": this.ViewCostinReports,
          "searchable": true
        },
        {
          "targets": [14],
          "visible": this.ViewProfitinReports,
          "searchable": true
        },
        {
          "targets": [15],
          "visible": this.ViewMargininReports,
          "searchable": true
        },
        {
          "targets": [16],
          "visible": this.DownloadExcelCSVinReports,
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
        {
          "targets": [19],
          "visible": false,
          "searchable": true
        },
      ],
      createdRow: function (row, data, index) {
        $('.actionView2', row).unbind('click');
        $('.actionView2', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          that.onExceFromList(data.Month, data.Year)
        });

        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          console.log('on click');
          e.preventDefault();
          e.stopPropagation();
          that.router.navigate(['/admin/reports/Monthly-SO-Report-New'], { state: { Month: data.Month, Year: data.Year, CurrencyCode: data.LCC, CreatedByLocation: data.CreatedByLocation, IncludeRR: that.IncludeRR  } });

        });
      },

      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.actionView2', row).unbind('click');
        $('.actionView2', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onExceFromList(data.Month, data.Year)
        });

        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          console.log('on click');
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(['/admin/reports/Monthly-SO-Report-New'], { state: { Month: data.Month, Year: data.Year, IncludeRR: that.IncludeRR  } });

        });
        return row;
      },
      "preDrawCallback": function () {
        $('#datatable-angular-SoByMonthly_processing').attr('style', 'display: block; z-index: 10000 !important');

      },
      language: {
        "paginate": {
          "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>'
        },
        processing: ProcessingHTML,
       
      }
    };
  }


  onFilter(event) {
    if (this.CustomerId == null || this.CustomerId == 'undefined') {
      this.CustomerId = ""
    }
    if (this.CustomerGroupId == null || this.CustomerGroupId == '' || this.CustomerGroupId == undefined) {
      this.CustomerGroupId = ""
    }
    var table = $('#datatable-angular-SoByMonthly').DataTable();
    table.columns(0).search(this.CustomerId);
    table.columns(1).search(this.ReportingbyYear);
    table.columns(3).search(this.dateRequested);
    table.columns(4).search(this.dateRequestedTo);
    table.columns(5).search(this.dueDate);
    table.columns(6).search(this.dueDateTo);
    table.columns(9).search(this.PartId);
    table.columns(10).search(this.Status);
    table.columns(11).search(this.SOType);
    table.columns(12).search(this.IncludeRR);
    table.columns(17).search(this.CurrencyCode);
    table.columns(18).search(this.CreatedByLocation);
    table.columns(19).search(this.CustomerGroupId);

    table.draw();
    this._opened = !this._opened;
  }
  onChangeFilter(event) {
    
    if (this.CustomerId == null || this.CustomerId == 'undefined') {
      this.CustomerId = ""
    }
    if (this.CustomerGroupId == null || this.CustomerGroupId == '' || this.CustomerGroupId == undefined) {
      this.CustomerGroupId = ""
    }
    var table = $('#datatable-angular-SoByMonthly').DataTable();
    table.columns(0).search(this.CustomerId);
    table.columns(1).search(this.ReportingbyYear);
    table.columns(3).search(this.dateRequested);
    table.columns(4).search(this.dateRequestedTo);
    table.columns(5).search(this.dueDate);
    table.columns(6).search(this.dueDateTo);
    table.columns(9).search(this.PartId);
    table.columns(10).search(this.Status);
    table.columns(11).search(this.SOType);
    table.columns(12).search(this.IncludeRR);
    table.columns(17).search(this.CurrencyCode);
    table.columns(18).search(this.CreatedByLocation);
    table.columns(19).search(this.CustomerGroupId);
    table.draw();
    
  }
  onClear(event) {
    if(this.CustomerGroupId != null || this.CustomerGroupId != ''){
      this.CustomerGroupId = "";
      this.loadCustomers();
    }
    var table = $('#datatable-angular-SoByMonthly').DataTable();
    this.CustomerId = ""
    this.dateRequested = ""
    this.dateRequestedTo = ""
    this.dueDate = ""
    this.dueDateTo = ""
    this.DateRequested = ""
    this.DateRequestedTo = ""
    this.DueDate = ""
    this.DueDateTo = ""
    this.Part = ""
    this.PartId = ""
    this.Month = ""
    this.SOType = ""
    this.Status = ""
    this.ReportingbyYear = ""
    this.IncludeRR = ""
    this.CurrencyCode = ""
    this.CreatedByLocation = ""
    this.CustomerGroupId = ""
    table.columns(0).search(this.CustomerId);
    table.columns(1).search(this.ReportingbyYear);
    table.columns(3).search(this.dateRequested);
    table.columns(4).search(this.dateRequestedTo);
    table.columns(5).search(this.dueDate);
    table.columns(6).search(this.dueDateTo);
    table.columns(9).search(this.PartId);
    table.columns(10).search(this.Status);
    table.columns(11).search(this.SOType);
    table.columns(12).search(this.IncludeRR);
    table.columns(17).search(this.CurrencyCode);
    table.columns(18).search(this.CreatedByLocation);
    table.columns(19).search(this.CustomerGroupId);
    table.draw();
    this._opened = !this._opened;
    this.CustomerId = null
  }
  onExceFromList(Month, Year) {
    this.SalesOrderReports = []
    // this.SalesOrderReports.push({

    //   "Month": Month
    // })
    this.Month = Month
    this.Year = Year
    var postData = {
      //"SalesOrderReports": this.SalesOrderReports,
      "DateRequested": this.dateRequested,
      "DateRequestedTo": this.dateRequestedTo,
      "DueDate": this.dueDate,
      "DueDateTo": this.dueDateTo,
      "CustomerId": this.CustomerId,
      "PartId": this.PartId,
      "Status": this.Status,
      "SOType": this.SOType,
      "Month": this.Month,
      "Year": Year,
      "IncludeRR": this.IncludeRR,
      "CurrencyCode":this.CurrencyCode,
      "CreatedByLocation":this.CreatedByLocation,
      "CustomerGroupId":this.CustomerGroupId,
    }
    this.commonService.postHttpService(postData, "SODetailedReportNew").subscribe(response => {
      if (response.status == true) {
        this.ExcelData = response.responseData.ExcelData;
        this.generateSOdetailsExcelFormat();
        Swal.fire({
          title: 'Success!',
          text: 'Excel downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
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
  generateSOdetailsExcelFormat() {
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
    const title = `${this.Month} ${this.Year} Detailed SO Report`;
    const header = ["SO No", "Part No", "RR # / MRO #", "Company Name", "Date Requested", "Quantity", "Currency", "Price", "Rate", "Discount", "Ext Price", "Ext Cost", "Profit", "GP %"]
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Data');
    //Add Row and formatting
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
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 30;
    worksheet.getColumn(9).width = 30;
    worksheet.getColumn(10).width = 30;
    worksheet.getColumn(11).width = 30;
    worksheet.getColumn(12).width = 30;
    worksheet.getColumn(13).width = 30;
    worksheet.getColumn(14).width = 30;
    worksheet.getColumn(15).width = 30;
    worksheet.getColumn(16).width = 20;


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
    // worksheet.mergeCells(`A${footerRow.number}:M${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = (`${this.Month} ${this.Year} Detailed SO Report` + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })



  }

  onExcel() {
    this.SalesOrderReports = []
    if (this.CustomerId == null || this.CustomerId == 'undefined') {
      this.CustomerId = ""
    }
    // this.SalesOrderReports.push({

    //   "Month": ""
    // })
    var postData = {
      "SalesOrderReports": this.SalesOrderReports,
      "DateRequested": this.dateRequested,
      "DateRequestedTo": this.dateRequestedTo,
      "DueDate": this.dueDate,
      "DueDateTo": this.dueDateTo,
      "CustomerId": this.CustomerId,
      "PartId": this.PartId,
      "Status": this.Status,
      "SOType": this.SOType,
      "Year": this.ReportingbyYear,
      "IncludeRR": this.IncludeRR,
      "CurrencyCode":this.CurrencyCode,
      "CreatedByLocation":this.CreatedByLocation,
      "CustomerGroupId":this.CustomerGroupId,

    }
    this.spinner = true
    this.commonService.postHttpService(postData, "getSalesByMonthReportToExcelNew").subscribe(response => {
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
      var temparray = [];
      for (var key in obj) {
        var value = obj[key];
        temparray.push(value);
      }
      data.push(temparray);
    }

    //Excel Title, Header, Data
    const title = 'Monthly Sales Report';
    const header = ["Month & Year","Currency", "Price", "Cost", "Profit", 'Margin']
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Data');
    //Add Row and formatting
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
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;


    worksheet.addRow([]);
    //Footer Row
    // let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
    // footerRow.getCell(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'FFCCFFE5' }
    // };
    // footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    // //Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:E${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = ('Monthly Sales Report ' + currentDate + '.xlsx')
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

  onExcelAllcustomer() {
    this.SalesOrderReports = []

    this.Month = ''
    var postData = {
      // "SalesOrderReports": this.SalesOrderReports,
      "DateRequested": this.dateRequested,
      "DateRequestedTo": this.dateRequestedTo,
      "DueDate": this.dueDate,
      "DueDateTo": this.dueDateTo,
      "CustomerId": this.CustomerId,
      "PartId": this.PartId,
      "Status": this.Status,
      "SOType": this.SOType,
      "Month": this.Month,
      "Year": this.ReportingbyYear,
      "IncludeRR": this.IncludeRR,
      "CurrencyCode":this.CurrencyCode,
      "CreatedByLocation":this.CreatedByLocation,
      "CustomerGroupId":this.CustomerGroupId,
    }
    this.spinnerallCustomer = true
    this.commonService.postHttpService(postData, "SODetailedReportNew").subscribe(response => {
      if (response.status == true) {
        this.ExcelData = response.responseData.ExcelData;
        this.generateSOdetailsallCustomerExcelFormat();
        this.spinnerallCustomer = false
        Swal.fire({
          title: 'Success!',
          text: 'Excel downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        this.spinnerallCustomer = false
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


  generateSOdetailsallCustomerExcelFormat() {
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
    const title = `Detailed SO Report for All customer`;
    const header = ["SO No", "Part No", "RR # / MRO #", "Company Name", "Date Requested", "Quantity", "Currency", "Price", "Rate", "Discount", "Ext Price", "Ext Cost", "Profit", "GP %"]
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Data');
    //Add Row and formatting
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
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 30;
    worksheet.getColumn(9).width = 30;
    worksheet.getColumn(10).width = 30;
    worksheet.getColumn(11).width = 30;
    worksheet.getColumn(12).width = 30;
    worksheet.getColumn(13).width = 30;
    worksheet.getColumn(14).width = 30;
    worksheet.getColumn(15).width = 30;
    worksheet.getColumn(16).width = 20;


    worksheet.addRow([]);
    //Footer Row
    // let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
    // footerRow.getCell(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'FFCCFFE5' }
    // };
    // footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    // //Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:M${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = (`Detailed SO Report` + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })



  }
  getCurrencyList() {
    this.commonService.getHttpService('Currencyddl').subscribe(response => {
      if (response.status == true) {
        this.CurrencyList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  getCountryList() {
    this.commonService.getHttpService("getCountryList").subscribe(response => {
      if (response.status == true) {
        this.CountryList = response.responseData
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
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
