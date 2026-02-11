import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import Swal from 'sweetalert2';
import { footerlineRight, footerlineLeft, CONST_VIEW_ACCESS, CONST_APPROVE_ACCESS } from 'src/assets/data/dropdown';
import { Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';
import * as fs from 'file-saver';
import * as logofile from 'src/assets/data/logoFile.js';
import * as moment from 'moment';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-costofnew-rr-report',
  templateUrl: './costofnew-rr-report.component.html',
  styleUrls: ['./costofnew-rr-report.component.scss']
})
export class CostofnewRrReportComponent implements OnInit, OnDestroy {
  spinner:boolean = false;

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
  PartNo;
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
    this.IsViewEnabled = this.commonService.permissionCheck("TotalCostSavingsvsCostofnew", CONST_VIEW_ACCESS);
    this.DownloadExcelCSVinReports = this.commonService.permissionCheck("TotalCostSavingsvsCostofnew", CONST_APPROVE_ACCESS);

  if(this.IsViewEnabled){
    this.getCustomerGroupList();
    this.loadCustomers();
    this.onFilterofTotalCostSavingvsCostofnew();
    this.FooterRight = footerlineRight;
    this.FooterLeft = footerlineLeft
 }

  }




  //Total Cost Saving vs Cost of new
  onFilterofTotalCostSavingvsCostofnew() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };
    var url = this.baseUrl + '/api/v1.0/RRReports/getTotalCostSavingsVsCostofNewReport';
    const that = this;
    var filterData = {
      "CustomerId": this.CustomerId,
      "PartNo": this.PartNo,
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
      { data: 'RepairRequestNo', width: '10%', name: 'RepairRequestNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerId', width: '25%', name: 'CustomerId', defaultContent: '', orderable: true, searchable: true },
      { data: 'DepartmentName', width: '15%', name: 'DepartmentName', defaultContent: '', orderable: true, searchable: true },
      { data: 'VendorName', width: '25%', name: 'VendorName', defaultContent: '', orderable: true, searchable: true },

      { data: 'Manufacturer', width: '10%', name: 'Manufacturer', defaultContent: '', orderable: true, searchable: true },
      { data: 'ManufacturerPartNo', width: '50%', name: 'ManufacturerPartNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerPartNo1', width: '20%', name: 'CustomerPartNo1', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerPartNo2', width: '20%', name: 'CustomerPartNo2', defaultContent: '', orderable: true, searchable: true },
      { data: 'SerialNo', width: '20%', name: 'SerialNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerRepairCost', width: '20%', name: 'CustomerRepairCost', defaultContent: '', orderable: true, searchable: true },
      { data: 'PriceOfNew', width: '20%', name: 'PriceOfNew', defaultContent: '', orderable: true, searchable: true },
      { data: 'Difference', width: '20%', name: 'InvoiceDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'CostOfNew', width: '5%', name: 'CostOfNew', defaultContent: '', orderable: true, searchable: true },
      { data: 'DateLogged', width: '20%', name: 'DateLogged', defaultContent: '', orderable: true, searchable: true },
      { data: 'QuoteSubmittedToCustomer', width: '20%', name: 'QuoteSubmittedToCustomer', defaultContent: '', orderable: true, searchable: true },
      { data: 'QuoteApproveddate', width: '20%', name: 'QuoteApproveddate', defaultContent: '', orderable: true, searchable: true },
      { data: 'DateCompleted', width: '20%', name: 'DateCompleted', defaultContent: '', orderable: true, searchable: true },
      { data: 'WarrantyRecovery', width: '20%', name: 'WarrantyRecovery', defaultContent: '', orderable: true, searchable: true },
      { data: 'RushNormal', width: '20%', name: 'RushNormal', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerPONo', width: '20%', name: 'CustomerPONo', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerReference', width: '20%', name: 'CustomerReference', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerReference2', width: '20%', name: 'CustomerReference2', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerReference3', width: '20%', name: 'CustomerReference3', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerReference4', width: '20%', name: 'CustomerReference4', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerReference5', width: '20%', name: 'CustomerReference5', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerReference6', width: '20%', name: 'CustomerReference6', defaultContent: '', orderable: true, searchable: true },
      { data: 'CustomerStatedIssue', width: '40%', name: 'CustomerStatedIssue', defaultContent: '', orderable: true, searchable: true },
      { data: 'RootCause', width: '60%', name: 'RootCause', defaultContent: '', orderable: true, searchable: true },
      // { data: 'InvoiceCreatedOn', width: '20%', name: 'InvoiceCreatedOn', defaultContent: '', orderable: true, searchable: true },
      // { data: 'RepairRate', width: '10%', name: 'RepairRate', defaultContent: '', orderable: true, searchable: true },
      // { data: 'Percentage', width: '10%', name: 'DueDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'FromDate', width: '2%', name: 'InvoiceDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'ToDate', width: '5%', name: 'DueDate', defaultContent: '', orderable: true, searchable: true, },
      //{ data: 'CustomerId', width: '5%', name: 'CustomerId', defaultContent: '', orderable: true, searchable: true, },
      { data: 'CustomerAssetName', width: '5%', name: 'CustomerAssetName', defaultContent: '', orderable: true, searchable: true, },

    ];

    this.dataTable = $('#datatable-angular-TotalCostSavingsVsCostofNewReport');
    this.dataTable.DataTable(this.dtOptions);

  }
  rerender(): void {
    this.dtOptionsdeferLoadingShow = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      this.onFilterofTotalCostSavingvsCostofnew()
    });
  }

  getdtOption() {
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
      autoWidth: false,
      serverSide: true,
      searching: true,
      retrieve: true,
      order: [[0, 'desc']],
      serverMethod: 'post',
      buttons: buttons,
      columnDefs: [
        // {
        //   "targets": [30],
        //   "visible": false,
        //   "searchable": true
        // },
        {
          "targets": [28],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [29],
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
        $('#datatable-angular-TotalCostSavingsVsCostofNewReport_processing').attr('style', 'display: block; z-index: 10000 !important');

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
    this.PartNo = ""
    this.Fromdate = ""
    this.Todate = ""
    this.FromDate = ""
    this.ToDate = ""
    this.CustomerGroupId = ""
    this.rerender();
    this._opened = !this._opened;
  }



  //Excel
  onTotalCostSavingsVsCostofNewReportExportToExcel() {


    var postData = {
      "CustomerId": this.CustomerId,
      "PartNo": this.PartNo,
      "FromDate": this.Fromdate,
      "ToDate": this.Todate,
      "RRReports": [

      ],
      "CustomerGroupId": this.CustomerGroupId

    }
    this.spinner = true
    this.commonService.postHttpService(postData, "getTotalCostSavingsVsCostofNewReportExportToExcel").subscribe(response => {
      if (response.status == true) {
        //this.excelService.exportAsExcelFile(response.responseData.ExcelData, 'Total Cost Savings Vs Cost of NewReport');
        this.spinner = false

        var data = []
        var jsonData = response.responseData.ExcelData
        for (var i = 0; i < jsonData.length; i++) {

          var obj = jsonData[i];
          // delete jsonData[i].CustomerId;
          delete jsonData[i].RRId;
          delete jsonData[i].Status
          var temparray = [];
          for (var key in obj) {
            var value = obj[key];
            temparray.push(value);
          }
          data.push(temparray);
        }

        //Excel Title, Header, Data
        const title = 'Total Cost Savings Vs Cost of New Report';
        const header = ["Part No","Quantity","Status","Customer PO No","Repair Request No", "Customer", "Department", "Vendor", "Manufacturer", "Manufacturer Part No","Customer Part No 1", "Customer Part No 2", "Serial No", "Currency","Customer Repair Cost", "Price Of New", "Difference", "AH Repair Cost", "Date Logged", "Quote Submitted To Customer", "Date Approved", "Date Completed", "Warranty Recovery", "Rush / Normal", "Customer Reference", "Customer Reference 2", "Customer Reference 3", "Customer Reference 4", "Customer Reference 5", "Customer Reference 6", "Customer Stated Issue", "Root Cause",]
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
          var filename = ('Total Cost Savings Vs Cost of New Report ' + currentDate + '.xlsx')
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

