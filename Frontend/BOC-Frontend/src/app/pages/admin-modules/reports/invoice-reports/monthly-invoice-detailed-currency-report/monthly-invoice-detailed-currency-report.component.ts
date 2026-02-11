import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Observable, of, Subject, concat } from 'rxjs';
import { catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { CONST_VIEW_ACCESS, CONST_APPROVE_ACCESS, Invoice_Type, Invoice_Status, footerlineRight, footerlineLeft, ProcessingHTML } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as fs from 'file-saver';

@Component({
  selector: 'app-monthly-invoice-detailed-currency-report',
  templateUrl: './monthly-invoice-detailed-currency-report.component.html',
  styleUrls: ['./monthly-invoice-detailed-currency-report.component.scss']
})
export class MonthlyInvoiceDetailedCurrencyReportComponent implements OnInit {


  spinner: boolean = false;
  spinnerallCustomer: boolean = false;
  //Server Side
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;

  //Filter
  InvoiceReports: any = [];
  InvoiceDate;
  InvoiceDateTo;
  DueDate;
  DueDateTo;
  invoiceDate;
  invoiceDateTo;
  dueDate;
  dueDateTo;
  CustomerId: any = [];
  Month;
  PartId;
  PartNo;
  Part;
  InvoiceType = '';
  Status = '';
  Year

  _opened: boolean = false;
  _showBackdrop: boolean = true;
  datalen: boolean = false;
  
  _toggleSidebar() {
    this._opened = !this._opened;
  }

  FooterRight
  FooterLeft;

  //dropdown
  customerList;
  Invoice_Status;
  Invoice_Type;
  ExcelData;
  ReportCurrencyCode;
  ReportCurrencySymbol

  keyword = 'PartNo';
  data = [];
  filteredData: any[];
  isLoading: boolean = false;
  OverAllSummary
  OverAllBaseSummary
  IncludeRR = ""
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];

  CSVspinnerallCustomer: boolean = false;
  CSVData;
  CSVDataFromList;

  ViewCostinReports
  ViewProfitinReports
  ViewMargininReports
  DownloadExcelCSVinReports
  CurrencyList: any = []
  CurrencyCode = ''
  CountryList: any = []
  CreatedByLocation = ''
  OverAllBaseSummaryShow: boolean = false
  CustomerGroupId: any
  customerGroupList: any;
  constructor(private http: HttpClient, private cd_ref: ChangeDetectorRef, public navCtrl: NgxNavigationWithDataComponent,
    private commonService: CommonService, private excelService: ExcelService, private datePipe: DatePipe,
    public router: Router,) { }
  ngOnInit(): void {
    this.OverAllSummary = ''
    this.OverAllBaseSummary = ''
    this.ViewCostinReports = this.commonService.permissionCheck("ViewCostinReports", CONST_VIEW_ACCESS);
    this.ViewProfitinReports = this.commonService.permissionCheck("ViewProfitinReports", CONST_VIEW_ACCESS);
    this.ViewMargininReports = this.commonService.permissionCheck("ViewMargininReports", CONST_VIEW_ACCESS);
    this.DownloadExcelCSVinReports = this.commonService.permissionCheck("MonthlyInvoiceSummary", CONST_APPROVE_ACCESS);
    this.getCustomerGroupList()
    this.onList();
    this.loadCustomers()
    this.getCountryList()
    this.getCurrencyList()
    this.Invoice_Type = Invoice_Type;
    this.Invoice_Status = Invoice_Status

    this.FooterRight = footerlineRight;
    this.FooterLeft = footerlineLeft;

  }




  //Invoice monthly Detailed List
  onList() {

    this.Month = history.state.Month
    this.Year = history.state.Year
    this.CurrencyCode = history.state.CurrencyCode
    this.CreatedByLocation = history.state.CreatedByLocation
    this.ReportCurrencyCode = history.state.ReportCurrencyCode
    this.IncludeRR = history.state.IncludeRR ? history.state.IncludeRR : ''
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };
    var url = this.baseUrl + '/api/v1.0/InvoiceReports/ParticularMonthInvoiceByCustomerWithCurrency';
    const that = this;
    var filterData = {
      Month: this.Month,
      Year: this.Year,
      CurrencyCode: this.CurrencyCode,
      CreatedByLocation: this.CreatedByLocation,
      ReportCurrencyCode: that.ReportCurrencyCode,
      IncludeRR: that.IncludeRR

    }
    this.dtOptions = this.getdtOption();
    this.dtOptions["ajax"] = (dataTablesParameters: any, callback) => {
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
          //this.OverAllSummary = resp.responseData.OverAllSummary
          this.OverAllBaseSummary = resp.responseData.OverAllBaseSummary[0]
        });
    };

    this.dtOptions["columns"] = [
      {
        data: 'CompanyName', width: '10%', name: 'CompanyName', defaultContent: '', orderable: true, searchable: true,
        // render: (data: any, type: any, row: any, meta) => {
        //   var link = '';
        //   link += `<a href="#" class="text-primary actionView1" ngbTooltip="Invoice By Customer">${row.CompanyName}</a>`;
        //   return link;
        // }
      },
      { data: 'Price', width: '20%', name: 'Price', defaultContent: '', orderable: true, searchable: true },
      { data: 'InvoiceDate', width: '10%', name: 'InvoiceDate', defaultContent: '', orderable: true, searchable: true },
      { data: 'InvoiceDateTo', width: '10%', name: 'InvoiceDateTo', defaultContent: '', orderable: true, searchable: true },
      { data: 'DueDate', width: '20%', name: 'DueDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'DueDateTo', width: '10%', name: 'DueDateTo', defaultContent: '', orderable: true, searchable: true, },
      { data: 'Created', width: '2%', name: 'Created', defaultContent: '', orderable: true, searchable: true, },
      { data: 'CreatedTo', width: '5%', name: 'CreatedTo', defaultContent: '', orderable: true, searchable: true, },
      { data: 'Status', width: '20%', name: 'Status', defaultContent: '', orderable: true, searchable: true },
      { data: 'InvoiceType', width: '20%', name: 'InvoiceType', defaultContent: '', orderable: true, searchable: true },
      { data: 'PartId', width: '20%', name: 'PartId', defaultContent: '', orderable: true, searchable: true },
      { data: 'IncludeRR', width: '20%', name: 'IncludeRR', defaultContent: '', orderable: true, searchable: true },
      { data: 'Cost', width: '20%', name: 'Cost', defaultContent: '', orderable: true, searchable: true },
      { data: 'Profit', width: '20%', name: 'Profit', defaultContent: '', orderable: true, searchable: true },
      { data: 'Margin', width: '20%', name: 'Margin', defaultContent: '', orderable: true, searchable: true },
      {
        data: 'CustomerId', name: 'CustomerId', className: 'text-center', orderable: true, searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          var link = '';
          link += `<a href="#" class="fas fa-file-csv text-primary actionViewCSVNew" data-toggle='tooltip' title='Month CSV Download' data-placement='top' ></a>
            &nbsp; <a href="#" class="far fa-file-excel text-primary actionView2" data-toggle='tooltip' title='Month Excel Download' data-placement='top' ></a>`;
          ;
          return link;
        }
      },
      {
        data: 'CustomerId', name: 'CustomerId', className: 'text-center', orderable: true, searchable: true,
      },
      { data: 'CurrencyCode', width: '20%', name: 'CurrencyCode', defaultContent: '', orderable: true, searchable: true },
      { data: 'CreatedByLocation', width: '20%', name: 'CreatedByLocation', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerGroupId', width: '20%', name: 'CustomerGroupId', defaultContent: '', orderable: true, searchable: true },

    ];

    this.dataTable = $('#datatable-angular-InvoiceByMonthly');
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
  InvoiceDateFormat(invoiceDate) {
    if (invoiceDate != null) {
      const invoiceDateYears = invoiceDate.year;
      const invoiceDateDates = invoiceDate.day;
      const invoiceDatemonths = invoiceDate.month;
      let DateRequestedDate = new Date(invoiceDateYears, invoiceDatemonths - 1, invoiceDateDates);
      this.InvoiceDate = moment(DateRequestedDate).format('YYYY-MM-DD');
    } else {
      this.InvoiceDate = ''
    }
  }
  invoiceDateToFormat(invoiceDateTo) {
    if (invoiceDateTo != null) {
      const invoiceDateToYears = invoiceDateTo.year;
      const invoiceDateToDates = invoiceDateTo.day;
      const invoiceDateTomonths = invoiceDateTo.month;
      let DateRequestedToof = new Date(invoiceDateToYears, invoiceDateTomonths - 1, invoiceDateToDates);
      this.InvoiceDateTo = moment(DateRequestedToof).format('YYYY-MM-DD')
    } else {
      this.InvoiceDateTo = ''
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
      searching: true,
      retrieve: true,
      paging: false,
      bInfo: false,
      order: [[0, 'desc']],
      serverMethod: 'post',
      buttons: buttons,
      columnDefs: [
        {
          "targets": [2],
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
          "visible": this.ViewCostinReports,
          "searchable": true
        },
        {
          "targets": [13],
          "visible": this.ViewProfitinReports,
          "searchable": true
        },
        {
          "targets": [14],
          "visible": this.ViewMargininReports,
          "searchable": true
        },
        {
          "targets": [15],
          "visible": this.DownloadExcelCSVinReports,
          "searchable": true
        },
        {
          "targets": [16],
          "visible": false,
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




      },

      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.actionView2', row).unbind('click');
        $('.actionView2', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onExceFromList(data.CustomerId)
        });

        $('.actionViewCSV', row).unbind('click');
        $('.actionViewCSV', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onCSVFromList(data.CustomerId)
        });

        $('.actionViewCSVNew', row).unbind('click');
        $('.actionViewCSVNew', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onCSVFromListNew(data.CustomerId)
        });

        return row;
      },
      "preDrawCallback": function () {
        $('#datatable-angular-InvoiceByMonthly_processing').attr('style', 'display: block; z-index: 10000 !important');

      },
      'loadingRecords': '&nbsp;',
      language: {
        "paginate": {
          "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>'
        },
        'loadingRecords': '&nbsp;',
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
    var table = $('#datatable-angular-InvoiceByMonthly').DataTable();
    table.columns(2).search(this.InvoiceDate);
    table.columns(3).search(this.InvoiceDateTo);
    table.columns(4).search(this.dueDate);
    table.columns(5).search(this.dueDateTo);
    table.columns(8).search(this.Status);
    table.columns(9).search(this.InvoiceType);
    table.columns(16).search(this.CustomerId);
    table.columns(10).search(this.PartId);
    table.columns(11).search(this.IncludeRR);
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
    var table = $('#datatable-angular-InvoiceByMonthly').DataTable();
    table.columns(2).search(this.InvoiceDate);
    table.columns(3).search(this.InvoiceDateTo);
    table.columns(4).search(this.dueDate);
    table.columns(5).search(this.dueDateTo);
    table.columns(8).search(this.Status);
    table.columns(9).search(this.InvoiceType);
    table.columns(16).search(this.CustomerId);
    table.columns(10).search(this.PartId);
    table.columns(11).search(this.IncludeRR);
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
    var table = $('#datatable-angular-InvoiceByMonthly').DataTable();
    this.InvoiceDate = ""
    this.InvoiceDateTo = ""
    this.dueDate = ""
    this.dueDateTo = ""
    this.invoiceDate = ""
    this.invoiceDateTo = ""
    this.DueDate = ""
    this.DueDateTo = ""
    this.InvoiceType = ""
    this.Status = ""
    this.Part = ""
    this.PartId = ""
    this.CustomerId = ""
    this.IncludeRR = ""
    this.CurrencyCode = ""
    this.CreatedByLocation = ""
    table.columns(2).search(this.InvoiceDate);
    table.columns(3).search(this.InvoiceDateTo);
    table.columns(4).search(this.dueDate);
    table.columns(5).search(this.dueDateTo);
    table.columns(8).search(this.Status);
    table.columns(9).search(this.InvoiceType);
    table.columns(16).search(this.CustomerId);
    table.columns(10).search(this.PartId);
    table.columns(11).search(this.IncludeRR);
    table.columns(17).search(this.CurrencyCode);
    table.columns(18).search(this.CreatedByLocation);
    table.columns(19).search(this.CustomerGroupId);
    table.draw();
    this._opened = !this._opened;
  }
  onExceFromList(CustomerId) {
    // this.InvoiceReports = [];
    // this.InvoiceReports.push({

    //   "Month": ""
    // })
    var postData = {
      "InvoiceDate": this.InvoiceDate,
      "InvoiceDateTo": this.InvoiceDateTo,
      "DueDate": this.dueDate,
      "DueDateTo": this.dueDateTo,
      "Status": this.Status,
      "InvoiceType": this.InvoiceType,
      "CustomerId": CustomerId || this.CustomerId,
      "PartId": this.PartId,
      "Month": this.Month,
      "Year": this.Year,
      "IncludeRR": this.IncludeRR,
      "CurrencyCode": this.CurrencyCode,
      "CreatedByLocation": this.CreatedByLocation,
      "ReportCurrencyCode": this.ReportCurrencyCode,
      "CustomerGroupId": this.CustomerGroupId
    }
    this.commonService.postHttpService(postData, "InvoiceDetailedReportWithCurrency").subscribe(response => {
      if (response.status == true) {
        this.ExcelData = response.responseData.ExcelData;
        this.generateInvoicedetailsExcelFormat();
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
  generateInvoicedetailsExcelFormat() {
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
    const title = `${this.Month} ${this.Year} Detailed Invoice Report`;
    const header = keyNames
    //["InvoiceNo", "PartNo", "SONo", "CompanyName", "InvoiceDate", "Quantity", "Currency", "Price", "Cost", "Discount", "ExtPrice", "ExtCost", "Profit", "GP"]
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
      var filename = (`${this.Month} ${this.Year} Detailed Invoice Report` + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })



  }
  onExcel() {
    this.InvoiceReports = [];
    this.InvoiceReports.push({

      "CustomerId": this.CustomerId
    })
    var postData = {
      "InvoiceReports": this.InvoiceReports,
      "InvoiceDate": this.InvoiceDate,
      "InvoiceDateTo": this.InvoiceDateTo,
      "DueDate": this.dueDate,
      "DueDateTo": this.dueDateTo,
      "Status": this.Status,
      "InvoiceType": this.InvoiceType,
      // "CustomerId": this.CustomerId,
      "PartId": this.PartId,
      "Month": this.Month,
      "Year": this.Year,
      "IncludeRR": this.IncludeRR,
      "CurrencyCode": this.CurrencyCode,
      "CreatedByLocation": this.CreatedByLocation,
      "ReportCurrencyCode": this.ReportCurrencyCode,
      "CustomerGroupId": this.CustomerGroupId
    }
    this.spinner = true
    this.commonService.postHttpService(postData, "ParticularMonthInvoiceByCustomerToExcelWithCurrency").subscribe(response => {
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

  onExcelAllcustomer() {

    var postData = {
      "InvoiceDate": this.InvoiceDate,
      "InvoiceDateTo": this.InvoiceDateTo,
      "DueDate": this.dueDate,
      "DueDateTo": this.dueDateTo,
      "Status": this.Status,
      "InvoiceType": this.InvoiceType,
      "CustomerId": this.CustomerId,
      "PartId": this.PartId,
      "Month": this.Month,
      "Year": this.Year,
      "IncludeRR": this.IncludeRR,
      "CurrencyCode": this.CurrencyCode,
      "CreatedByLocation": this.CreatedByLocation,
      "ReportCurrencyCode": this.ReportCurrencyCode,
      "CustomerGroupId": this.CustomerGroupId
    }
    this.spinnerallCustomer = true
    this.commonService.postHttpService(postData, "InvoiceDetailedReportWithCurrency").subscribe(response => {
      if (response.status == true) {
        this.ExcelData = response.responseData.ExcelData;
        this.generateInvoicedetailsallCustomerExcelFormat();
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
    const title = `${this.Month} ${this.Year} Invoice Report`;
    const header =keyNames
     //["Customer", "Currency", "Price", "Cost", "Profit", "Margin"]
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Data');
    // //Add Row and formatting
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
      var filename = (`${this.Month} ${this.Year} Invoice Report` + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })


  }
  generateInvoicedetailsallCustomerExcelFormat() {
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
    const title = `${this.Month} ${this.Year} Detailed Invoice Report`;
    const header = keyNames
    //["InvoiceNo", "PartNo", "SONo", "CompanyName", "InvoiceDate", "Quantity", "Currency", "Price", "Cost", "Discount", "ExtPrice", "ExtCost", "Profit", "GP"]
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
      var filename = (`${this.Month} ${this.Year} Detailed Invoice Report` + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })



  }


  onCSVAllcustomer() {
    var postData = {
      "InvoiceDate": this.InvoiceDate,
      "InvoiceDateTo": this.InvoiceDateTo,
      "DueDate": this.dueDate,
      "DueDateTo": this.dueDateTo,
      "Status": this.Status,
      "InvoiceType": this.InvoiceType,
      "CustomerId": this.CustomerId,
      "PartId": this.PartId,
      "Month": this.Month,
      "Year": this.Year,
      "IncludeRR": this.IncludeRR,
      "CurrencyCode": this.CurrencyCode,
      "CreatedByLocation": this.CreatedByLocation,
      "ReportCurrencyCode": this.ReportCurrencyCode,
      "CustomerGroupId": this.CustomerGroupId

    }
    this.CSVspinnerallCustomer = true;
    this.commonService.postHttpService(postData, "InvoiceDetailedReportWithCurrency").subscribe(response => {
      if (response.status == true) {
        this.CSVData = response.responseData.ExcelData;
        this.generateCSVFormat();
        this.CSVspinnerallCustomer = false;
        Swal.fire({
          title: 'Success!',
          text: 'CSV downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        this.CSVspinnerallCustomer = false;
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

  onCSVAllcustomerNew() {
    var postData = {
      "InvoiceDate": this.InvoiceDate,
      "InvoiceDateTo": this.InvoiceDateTo,
      "DueDate": this.dueDate,
      "DueDateTo": this.dueDateTo,
      "Status": this.Status,
      "InvoiceType": this.InvoiceType,
      "CustomerId": this.CustomerId,
      "PartId": this.PartId,
      "Month": this.Month,
      "Year": this.Year,
      "IncludeRR": this.IncludeRR,
      "CurrencyCode": this.CurrencyCode,
      "CreatedByLocation": this.CreatedByLocation,
      "ReportCurrencyCode": this.ReportCurrencyCode,
      "CustomerGroupId": this.CustomerGroupId
    }
    this.CSVspinnerallCustomer = true;
    this.commonService.postHttpService(postData, "InvoiceDetailedReportWithCurrency").subscribe(response => {
      if (response.status == true) {
        this.CSVData = response.responseData.ExcelData;
        this.generateCSVFormat();
        this.CSVspinnerallCustomer = false;
        Swal.fire({
          title: 'Success!',
          text: 'CSV downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        this.CSVspinnerallCustomer = false;
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
    var filename = (`${this.Month} ${this.Year} Detailed Invoice Report` + currentDate + '.csv')
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
      }
      str += line + '\r\n';
    }
    return str;
  }


  onCSVFromList(CustomerId) {
    var postData = {
      "InvoiceDate": this.InvoiceDate,
      "InvoiceDateTo": this.InvoiceDateTo,
      "DueDate": this.dueDate,
      "DueDateTo": this.dueDateTo,
      "Status": this.Status,
      "InvoiceType": this.InvoiceType,
      "CustomerId": CustomerId || this.CustomerId,
      "PartId": this.PartId,
      "Month": this.Month,
      "Year": this.Year,
      "IncludeRR": this.IncludeRR,
      "CurrencyCode": this.CurrencyCode,
      "CreatedByLocation": this.CreatedByLocation,
      "ReportCurrencyCode": this.ReportCurrencyCode,
      "CustomerGroupId": this.CustomerGroupId
    }
    this.commonService.postHttpService(postData, "InvoiceDetailedReportWithCurrency").subscribe(response => {
      if (response.status == true) {
        this.CSVDataFromList = response.responseData.ExcelData;
        this.generateCSVFormatFromList();
        Swal.fire({
          title: 'Success!',
          text: 'CSV downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
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

  onCSVFromListNew(CustomerId) {
    var postData = {
      "InvoiceDate": this.InvoiceDate,
      "InvoiceDateTo": this.InvoiceDateTo,
      "DueDate": this.dueDate,
      "DueDateTo": this.dueDateTo,
      "Status": this.Status,
      "InvoiceType": this.InvoiceType,
      "CustomerId": CustomerId || this.CustomerId,
      "PartId": this.PartId,
      "Month": this.Month,
      "Year": this.Year,
      "IncludeRR": this.IncludeRR,
      "CurrencyCode": this.CurrencyCode,
      "CreatedByLocation": this.CreatedByLocation,
      "ReportCurrencyCode": this.ReportCurrencyCode,
      "CustomerGroupId": this.CustomerGroupId
    }
    this.commonService.postHttpService(postData, "InvoiceDetailedReportWithCurrency").subscribe(response => {
      if (response.status == true) {
        this.CSVDataFromList = response.responseData.ExcelData;
        this.generateCSVFormatFromList();
        Swal.fire({
          title: 'Success!',
          text: 'CSV downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
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

  generateCSVFormatFromList() {
    let sampleJson: any = this.CSVDataFromList
    let a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    let csvData = this.ConvertToCSV(sampleJson);
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
    var filename = (`${this.Month} ${this.Year} Detailed Invoice Report` + currentDate + '.csv')
    a.download = filename;
    a.click()
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

  onBack(url){
    this.router.navigate([url], { state: { IncludeRR: this.IncludeRR } })
  }






}


