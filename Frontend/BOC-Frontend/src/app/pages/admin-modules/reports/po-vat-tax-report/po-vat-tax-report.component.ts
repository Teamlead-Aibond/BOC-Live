import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Subject, Observable, of, concat } from 'rxjs';
import { catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { CONST_VIEW_ACCESS, CONST_APPROVE_ACCESS, footerlineRight, footerlineLeft } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as fs from 'file-saver';

@Component({
  selector: 'app-po-vat-tax-report',
  templateUrl: './po-vat-tax-report.component.html',
  styleUrls: ['./po-vat-tax-report.component.scss']
})
export class PoVatTaxReportComponent implements OnInit {


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
  Fromdate;
  Todate;
  ToDate;
  VendorId: any = [];
  PartNo;
  PONo
  VendorInvoiceNo
  _opened: boolean = false;
  _showBackdrop: boolean = true;

  _toggleSidebar() {
    this._opened = !this._opened;
  }

  FooterRight
  FooterLeft
  OverAllSummary
  OverAllBaseSummary
  vendors$: Observable<any> = of([]);
  vendorsInput$ = new Subject<string>();
  loadingVendors: boolean = false;

  //dropdowns
  VendorsList: any = [];

  IsViewEnabled
  ViewCostinReports
  ViewProfitinReports
  ViewMargininReports
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  DownloadExcelCSVinReports
  constructor(private http: HttpClient, private cd_ref: ChangeDetectorRef, public navCtrl: NgxNavigationWithDataComponent,
    private commonService: CommonService, private excelService: ExcelService, private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.IsViewEnabled = this.commonService.permissionCheck("POTAXReport", CONST_VIEW_ACCESS)
    this.DownloadExcelCSVinReports = this.commonService.permissionCheck("POTAXReport", CONST_APPROVE_ACCESS);
    this.OverAllSummary = ''
    this.OverAllBaseSummary = ''
    if (this.IsViewEnabled) {
      this.loadVendors();
      this.onFilterofVatTaxReport();
      this.FooterRight = footerlineRight;
      this.FooterLeft = footerlineLeft
    }

  }





  onFilterofVatTaxReport() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };
    var url = this.baseUrl + '/api/v1.0/POReports/POTaxVatReport';
    const that = this;
    var filterData = {}
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
      { data: 'VendorName', width: '25%', name: 'VendorName', defaultContent: '', orderable: true, searchable: true },

      { data: 'PONo', width: '10%', name: 'PONo', defaultContent: '', orderable: true, searchable: true },
      { data: 'POStatusName', width: '50%', name: 'POStatusName', defaultContent: '', orderable: true, searchable: true },
      { data: 'VendorInvoiceNo', width: '20%', name: 'VendorInvoiceNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'VendorInvoiceStatusName', width: '20%', name: 'InvoiceStatusName', defaultContent: '', orderable: true, searchable: true },
      { data: 'ConvertedToVendorBill', width: '20%', name: 'ConvertedToVendorBill', defaultContent: '', orderable: true, searchable: true },
      { data: 'PartNo', width: '20%', name: 'PartNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'Description', width: '20%', name: 'Description', defaultContent: '', orderable: true, searchable: true },
      { data: 'Quantity', width: '20%', name: 'Quantity', defaultContent: '', orderable: true, searchable: true },
      { data: 'Tax', width: '20%', name: 'Tax', defaultContent: '', orderable: true, searchable: true },
      { data: 'ItemTaxPercent', width: '20%', name: 'ItemTaxPercent', defaultContent: '', orderable: true, searchable: true },
      { data: 'TotalTaxAmount', width: '20%', name: 'TotalTaxAmount', defaultContent: '', orderable: true, searchable: true },
      { data: 'ItemLocalCurrencyCode', width: '20%', name: 'ItemLocalCurrencyCode', defaultContent: '', orderable: true, searchable: true },
      { data: 'VendorId', width: '20%', name: 'VendorId', defaultContent: '', orderable: true, searchable: true },

    ];

    this.dataTable = $('#datatable-angular-POVatTaxReport');
    this.dataTable.DataTable(this.dtOptions);

  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      this.onFilterofVatTaxReport()
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
      searching: true,
      retrieve: true,
      order: [[0, 'desc']],
      serverMethod: 'post',
      buttons: buttons,
      columnDefs: [
        {
          "targets": [13],
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
    var table = $('#datatable-angular-POVatTaxReport').DataTable();
    table.columns(13).search(this.VendorId);
    table.columns(1).search(this.PONo);
    table.columns(3).search(this.VendorInvoiceNo);
    table.columns(6).search(this.PartNo);
    table.draw();
    this._opened = !this._opened;
  }
  onClear(event) {
    this.VendorId=''
    this.PONo=''
    this.VendorInvoiceNo=''
    this.PartNo=''
    var table = $('#datatable-angular-POVatTaxReport').DataTable();
    table.columns(13).search(this.VendorId);
    table.columns(1).search(this.PONo);
    table.columns(3).search(this.VendorInvoiceNo);
    table.columns(6).search(this.PartNo);
    table.draw();
    this._opened = !this._opened;
  }



  //Excel
  onExcel() {
    var postData = {
      "VendorId": this.VendorId,
      "PartNo": this.PartNo,
      "VendorInvoiceNo": this.VendorInvoiceNo,
      "PONo": this.PONo
    }
    this.spinner = true
    this.commonService.postHttpService(postData, "POTaxVatReportToExcel").subscribe(response => {
      if (response.status == true) {
        //this.excelService.exportAsExcelFile(response.responseData.ExcelData, 'Total Cost Savings Vs Cost of NewReport');
        this.spinner = false

        var data = []
        var jsonData = response.responseData.ExcelData
        for (var i = 0; i < jsonData.length; i++) {

          var obj = jsonData[i];
          delete jsonData[i].VendorId;
          var keyNames = Object.keys(jsonData[i]);
          // delete jsonData[i].RRId;
          // delete jsonData[i].Status
          var temparray = [];
          for (var key in obj) {
            var value = obj[key];
            temparray.push(value);
          }
          data.push(temparray);
        }

        //Excel Title, Header, Data
        const title = 'PO Vat/Tax Report';
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
          var filename = ('PO Vat/Tax Report' + currentDate + '.xlsx')
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

  selectAll() {
    let VendorIdIds = this.VendorsList.map(a => a.VendorId);
    let cMerge = [...new Set([...VendorIdIds, ...this.VendorId])];
    this.VendorId = cMerge
  }

}

