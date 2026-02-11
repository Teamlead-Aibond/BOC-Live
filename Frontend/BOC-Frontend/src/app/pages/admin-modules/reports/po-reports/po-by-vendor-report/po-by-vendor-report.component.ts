import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { DatePipe } from '@angular/common';
import { footerlineRight, footerlineLeft, PurchaseOrder_Status, PurchaseOrder_Type } from 'src/assets/data/dropdown';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-po-by-vendor-report',
  templateUrl: './po-by-vendor-report.component.html',
  styleUrls: ['./po-by-vendor-report.component.scss']
})
export class PoByVendorReportComponent implements OnInit {
  spinner:boolean = false;

  //Server Side
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;

  //Filter
  POReports: any = [];
  DateRequested;
  DateRequestedTo;
  DueDate;
  DueDateTo;
  dateRequested;
  dateRequestedTo;
  dueDate;
  dueDateTo;
  VendorId;
  Status = '';
  POType = '';
  _opened: boolean = false;
  _showBackdrop: boolean = true;
  datalen: boolean = false;
  _toggleSidebar() {
    this._opened = !this._opened;
  }

  FooterRight
  FooterLeft

  //dropdown
  vendorList;
  PurchaseOrderStatus;
  PurchaseOrderType;
  ExcelData;

  constructor(private http: HttpClient, private cd_ref: ChangeDetectorRef, public navCtrl: NgxNavigationWithDataComponent,
    private commonService: CommonService, private excelService: ExcelService, private datePipe: DatePipe) { }
  ngOnInit(): void {

    this.getVendorList();
    this.onList();


    this.PurchaseOrderStatus = PurchaseOrder_Status;;
    this.PurchaseOrderType = PurchaseOrder_Type;



    this.FooterRight = footerlineRight;
    this.FooterLeft = footerlineLeft
  }



  getVendorList() {
    this.commonService.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
    });
  }

  //So by customer List
  onList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };
    var url = this.baseUrl + '/api/v1.0/POReports/PurchasesByVendor';
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


        });
    };

    this.dtOptions["columns"] = [
      { data: 'VendorId', width: '5%', name: 'VendorId', defaultContent: '', orderable: true, searchable: true, },
      { data: 'VendorName', width: '20%', name: 'VendorName', defaultContent: '', orderable: true, searchable: true },
      { data: 'QuantityPurchased', width: '10%', name: 'QuantityPurchased', defaultContent: '', orderable: true, searchable: true },
      { data: 'TotalAmount', width: '20%', name: 'TotalAmount', defaultContent: '', orderable: true, searchable: true },
      { data: 'DateRequested', width: '15%', name: 'DateRequested', defaultContent: '', orderable: true, searchable: true },
      { data: 'DateRequestedTo', width: '10%', name: 'DateRequestedTo', defaultContent: '', orderable: true, searchable: true },
      { data: 'DueDate', width: '20%', name: 'DueDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'DueDateTo', width: '10%', name: 'DueDateTo', defaultContent: '', orderable: true, searchable: true, },
      { data: 'Created', width: '2%', name: 'Created', defaultContent: '', orderable: true, searchable: true, },
      { data: 'CreatedTo', width: '5%', name: 'CreatedTo', defaultContent: '', orderable: true, searchable: true, },
      { data: 'Status', width: '5%', name: 'Status', defaultContent: '', orderable: true, searchable: true, },
      { data: 'POType', width: '5%', name: 'POType', defaultContent: '', orderable: true, searchable: true, },

    ];

    this.dataTable = $('#datatable-angular-POByVendor');
    this.dataTable.DataTable(this.dtOptions);

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


  getdtOption() {
    return {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-3 col-sm-3 col-md-3 col-xl-3"l><"col-4 col-sm-4 col-md-4 col-xl-4"i><"col-5 col-sm-5 col-md-5 col-xl-5"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: false,
      autoWidth: false,
      serverSide: true,
      searching: true,
      retrieve: true,
      order: [[0, 'desc']],
      serverMethod: 'post',
      buttons: {
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
      },


      columnDefs: [
        {
          "targets": [0],
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


  onFilter(event) {
    if (this.VendorId == null || this.VendorId == 'undefined') {
      this.VendorId = ""
    }
    var table = $('#datatable-angular-POByVendor').DataTable();
    table.columns(0).search(this.VendorId);
    table.columns(4).search(this.dateRequested);
    table.columns(5).search(this.dateRequestedTo);
    table.columns(6).search(this.dueDate);
    table.columns(7).search(this.dueDateTo);
    table.columns(10).search(this.Status);
    table.columns(11).search(this.POType);
    table.draw();
    this._opened = !this._opened;
  }
  onClear(event) {
    var table = $('#datatable-angular-POByVendor').DataTable();
    this.VendorId = ""
    this.dateRequested = ""
    this.dateRequestedTo = ""
    this.dueDate = ""
    this.dueDateTo = ""
    this.DateRequested = ""
    this.DateRequestedTo = ""
    this.DueDate = ""
    this.DueDateTo = ""
    this.Status = ""
    this.POType = ""
    table.columns(0).search(this.VendorId);
    table.columns(4).search(this.dateRequested);
    table.columns(5).search(this.dateRequestedTo);
    table.columns(6).search(this.dueDate);
    table.columns(7).search(this.dueDateTo);
    table.columns(10).search(this.Status);
    table.columns(11).search(this.POType);
    table.draw();
    this._opened = !this._opened;
    this.VendorId = null
  }


  onExcel() {
    this.POReports = []
    if (this.VendorId == null || this.VendorId == 'undefined') {
      this.VendorId = ""
    }
    this.POReports.push({

      VendorId: this.VendorId
    })
    var postData = {
      "SalesOrderReports": this.POReports,
      "DateRequested": this.dateRequested,
      "DateRequestedTo": this.dateRequestedTo,
      "DueDate": this.dueDate,
      "DueDateTo": this.dueDateTo,
      "Status": this.Status,
      "POType": this.POType
    }
    this.spinner = true
    this.commonService.postHttpService(postData, "getPurchasesByVendorReportToExcel").subscribe(response => {
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
    const title = 'Purchase Order By Vendor Report';
    const header = ["Vendor Name", "Quantity Purchased", "Total Amount"]
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
    // worksheet.mergeCells('A1:C2');
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
    worksheet.getColumn(3).width = 15;


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
    // worksheet.mergeCells(`A${footerRow.number}:C${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = ('Purchase Order By Vendor Report ' + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })


  }

  onVendorChange(value) {
    if (value == null) {
      this.VendorId = ''
    }

  }
}
