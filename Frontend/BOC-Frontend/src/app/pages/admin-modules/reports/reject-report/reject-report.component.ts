import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Subject, Observable, of, concat } from 'rxjs';
import { catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { CONST_VIEW_ACCESS, CONST_APPROVE_ACCESS, footerlineRight, footerlineLeft, array_rr_status_rejectreport } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as fs from 'file-saver';

@Component({
  selector: 'app-reject-report',
  templateUrl: './reject-report.component.html',
  styleUrls: ['./reject-report.component.scss']
})
export class RejectReportComponent implements OnInit {


  spinner: boolean = false;

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
  todate;
  ToDate;
  fromdate;
  CustomerId: any = [];
  PartNo;
  SONo;
  RRNo
  Status
  _opened: boolean = false;
  _showBackdrop: boolean = true;

  _toggleSidebar() {
    this._opened = !this._opened;
  }

  FooterRight
  FooterLeft
  OverAllSummary
  OverAllBaseSummary
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];

  //dropdowns
  customerList: any = [];

  IsViewEnabled

  vendors$: Observable<any> = of([]);
  vendorsInput$ = new Subject<string>();
  loadingVendors: boolean = false;
  VendorId
  //dropdowns
  VendorsList: any = [];
  RRStatus: any = []
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  StatusName
  DownloadExcelCSVinReports
  CustomerGroupId: any
  customerGroupList: any;
  constructor(private http: HttpClient, private cd_ref: ChangeDetectorRef, public navCtrl: NgxNavigationWithDataComponent,
    private commonService: CommonService, private excelService: ExcelService, private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.IsViewEnabled = this.commonService.permissionCheck("RejectReport", CONST_VIEW_ACCESS);
    this.DownloadExcelCSVinReports = this.commonService.permissionCheck("RejectReport", CONST_APPROVE_ACCESS);
    this.Status = '6'
    this.StatusName = "Quote Rejected"
    this.OverAllSummary = ''
    this.OverAllBaseSummary = ''
    if (this.IsViewEnabled) {
      this.getCustomerGroupList();
      this.loadCustomers();
      this.onList();
      this.loadVendors()
      this.FooterRight = footerlineRight;
      this.FooterLeft = footerlineLeft;
      this.RRStatus = array_rr_status_rejectreport;

    }

  }

  onStatus(e) {
    if (e.target.value == 6) {
      this.StatusName = "Quote Rejected"
    } else {
      this.StatusName = "Completed"
    }
  }



  onList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };
    var url = this.baseUrl + '/api/v1.0/RRReports/RRARReports';
    const that = this;
    var filterData = {
      "Status": this.Status
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
          // Calling the DT trigger to manually render the table
          this.dtTrigger.next()
          this.OverAllSummary = resp.responseData.OverAllSummary
          this.OverAllBaseSummary = resp.responseData.OverAllBaseSummary[0]
        });
    };

    this.dtOptions["columns"] = [
      { data: 'RRNo', width: '10%', name: 'RRNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'Customer', width: '25%', name: 'Customer', defaultContent: '', orderable: true, searchable: true },
      { data: 'Vendor', width: '25%', name: 'Vendor', defaultContent: '', orderable: true, searchable: true },
      { data: 'PartNo', width: '20%', name: 'PartNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'Description', width: '20%', name: 'Description', defaultContent: '', orderable: true, searchable: true },
      { data: 'Amount', width: '50%', name: 'Amount', defaultContent: '', orderable: true, searchable: true },
      { data: 'StatusName', width: '20%', name: 'StatusName', defaultContent: '', orderable: true, searchable: true },
      { data: 'RejectedApprovedBy', width: '20%', name: 'RejectedApprovedBy', defaultContent: '', orderable: true, searchable: true },
      { data: 'RejectedApprovedDate', width: '20%', name: 'RejectedApprovedDate', defaultContent: '', orderable: true, searchable: true },
      { data: 'RejectedApprovedCode', width: '20%', name: 'RejectedApprovedCode', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerId', width: '20%', name: 'CustomerId', defaultContent: '', orderable: true, searchable: true },
      { data: 'VendorId', width: '20%', name: 'VendorId', defaultContent: '', orderable: true, searchable: true },
      { data: 'Status', width: '20%', name: 'Status', defaultContent: '', orderable: true, searchable: true },
      { data: 'fromDate', width: '20%', name: 'fromDate', defaultContent: '', orderable: true, searchable: true },
      { data: 'toDate', width: '20%', name: 'toDate', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerGroupId', width: '20%', name: 'CustomerGroupId', defaultContent: '', orderable: true, searchable: true },
   
    ];

    this.dataTable = $('#datatable-angular-RejectReport');
    this.dataTable.DataTable(this.dtOptions);

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
      order: [[0, 'desc']],
      serverMethod: 'post',
      buttons: buttons,
      columnDefs: [
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
        {
          "targets": [14],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [15],
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
        });
        return row;
      },
      "preDrawCallback": function () {
        $('#datatable-angular-RejectReport_processing').attr('style', 'display: block; z-index: 10000 !important');

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
      }
    };
  }


  FromDateFormat(FromDate) {
    if (FromDate != null) {
      const FromDateYears = FromDate.year;
      const FromDateDates = FromDate.day;
      const FromDatemonths = FromDate.month;
      let FromDateDate = new Date(FromDateYears, FromDatemonths - 1, FromDateDates);
      this.FromDate = moment(FromDateDate).format('YYYY-MM-DD');
    } else {
      this.FromDate = ''
    }
  }
  ToDateFormat(ToDate) {
    if (ToDate != null) {
      const ToDateYears = ToDate.year;
      const ToDateDates = ToDate.day;
      const ToDatemonths = ToDate.month;
      let ToDateof = new Date(ToDateYears, ToDatemonths - 1, ToDateDates);
      this.ToDate = moment(ToDateof).format('YYYY-MM-DD')
    } else {
      this.ToDate = ''
    }
  }


  onFilter(event) {
    var table = $('#datatable-angular-RejectReport').DataTable();
    table.columns(10).search(this.CustomerId);
    table.columns(11).search(this.VendorId);
    table.columns(12).search(this.Status);
    table.columns(0).search(this.RRNo);
    table.columns(3).search(this.PartNo);
    table.columns(13).search(this.FromDate);
    table.columns(14).search(this.ToDate);
    table.columns(15).search(this.CustomerGroupId);

    table.draw();
    this._opened = !this._opened;
  }
  onClear(event) {
    if(this.CustomerGroupId != null || this.CustomerGroupId != ''){
      this.CustomerGroupId = "";
      this.loadCustomers();
    }
    var table = $('#datatable-angular-RejectReport').DataTable();
    this.CustomerId = ""
    this.VendorId = ''
    this.PartNo = ""
    this.FromDate = ""
    this.ToDate = ""
    this.Status = ''
    this.RRNo = ''
    this.fromdate = ''
    this.todate = ''
    this.CustomerGroupId = ''
    table.columns(10).search(this.CustomerId);
    table.columns(11).search(this.VendorId);
    table.columns(12).search(this.Status);
    table.columns(3).search(this.PartNo);
    table.columns(0).search(this.RRNo);
    table.columns(13).search(this.FromDate);
    table.columns(14).search(this.ToDate);
    table.columns(15).search(this.CustomerGroupId);

    table.draw();
    this._opened = !this._opened;
  }



  //Excel
  onExcel() {
    var postData = {
      "CustomerId": this.CustomerId,
      "VendorId": this.VendorId,
      "PartNo": this.PartNo,
      "Status": this.Status,
      "fromDate": this.FromDate,
      "toDate": this.ToDate,
      "RRNo": this.RRNo,
      "CustomerGroupId": this.CustomerGroupId
    }
    this.spinner = true
    this.commonService.postHttpService(postData, "RRARReportsToExcel").subscribe(response => {
      if (response.status == true) {
        this.spinner = false
        var data = []
        var jsonData = response.responseData.ExcelData
        for (var i = 0; i < jsonData.length; i++) {

          var obj = jsonData[i];
          delete jsonData[i].CustomerId;
          delete jsonData[i].VendorId;
          delete jsonData[i].fromDate;
          delete jsonData[i].toDate;
          delete jsonData[i].Status;
          var keyNames = Object.keys(jsonData[i]);
          var temparray = [];
          for (var key in obj) {
            var value = obj[key];
            temparray.push(value);
          }
          data.push(temparray);
        }

        //Excel Title, Header, Data
        const title = 'Reject Report';
        const header = keyNames
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
        // worksheet.mergeCells('A1:D2');
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
        worksheet.getColumn(2).width = 20;
        worksheet.getColumn(3).width = 20;
        worksheet.getColumn(4).width = 30;
        worksheet.getColumn(5).width = 25;
        worksheet.getColumn(6).width = 15;
        worksheet.getColumn(7).width = 25;
        worksheet.getColumn(8).width = 20;
        worksheet.getColumn(9).width = 20;
        worksheet.getColumn(10).width = 20;
        worksheet.getColumn(11).width = 25;
        worksheet.getColumn(12).width = 15;
        worksheet.getColumn(13).width = 30;
        worksheet.getColumn(14).width = 30;
        worksheet.getColumn(15).width = 30;
        worksheet.getColumn(16).width = 30;
        worksheet.getColumn(17).width = 30;
        worksheet.getColumn(18).width = 30;
        worksheet.getColumn(19).width = 30;
        worksheet.getColumn(20).width = 30;
        worksheet.getColumn(21).width = 30;
        worksheet.getColumn(22).width = 40;
        worksheet.getColumn(23).width = 30;
        worksheet.getColumn(24).width = 25;
        worksheet.getColumn(25).width = 25;
        worksheet.getColumn(26).width = 25;
        worksheet.getColumn(27).width = 30;
        worksheet.getColumn(28).width = 30;
        worksheet.getColumn(29).width = 30;
        worksheet.getColumn(30).width = 30;
        worksheet.getColumn(31).width = 30;
        worksheet.getColumn(32).width = 30;
        worksheet.getColumn(33).width = 30;
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
        // worksheet.mergeCells(`A${footerRow.number}:AB${footerRow.number}`);
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
          var filename = ('Reject Report' + currentDate + '.xlsx')
          fs.saveAs(blob, filename);
        })



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

  selectVendorAll() {
    let VendorIdIds = this.VendorsList.map(a => a.VendorId);
    let cMerge = [...new Set([...VendorIdIds, ...this.VendorId])];
    this.VendorId = cMerge
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
