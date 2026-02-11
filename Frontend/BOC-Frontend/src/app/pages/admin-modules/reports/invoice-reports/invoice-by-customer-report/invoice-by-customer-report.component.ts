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
import { footerlineRight, footerlineLeft, Invoice_Type, Invoice_Status } from 'src/assets/data/dropdown';
@Component({
  selector: 'app-invoice-by-customer-report',
  templateUrl: './invoice-by-customer-report.component.html',
  styleUrls: ['./invoice-by-customer-report.component.scss']
})
export class InvoiceByCustomerReportComponent implements OnInit {
  //Server Side
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  spinner:boolean = false;

  //Filter
  InvoiceReports: any = [];
  invoiceDate;
  invoiceDateTo;
  DueDate;
  DueDateTo;
  InvoiceDate;
  InvoiceDateTo;
  dueDate;
  dueDateTo;
  CustomerId;
  Status = '';
  InvoiceType = '';
  _opened: boolean = false;
  _showBackdrop: boolean = true;
  datalen: boolean = false;
  _toggleSidebar() {
    this._opened = !this._opened;
  }

  FooterRight
  FooterLeft

  //dropdown
  customerList;
  Invoice_Status;
  Invoice_Type;
  ExcelData;

  constructor(private http: HttpClient, private cd_ref: ChangeDetectorRef, public navCtrl: NgxNavigationWithDataComponent,
    private commonService: CommonService, private excelService: ExcelService, private datePipe: DatePipe) { }
  ngOnInit(): void {


    this.getCustomerList();
    this.onList();


    this.Invoice_Type = Invoice_Type;
    this.Invoice_Status = Invoice_Status


    this.FooterRight = footerlineRight;
    this.FooterLeft = footerlineLeft
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
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };
    var url = this.baseUrl + '/api/v1.0/InvoiceReports/InvoiceByCustomer';
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
      { data: 'CustomerId', width: '5%', name: 'CustomerId', defaultContent: '', orderable: true, searchable: true, },
      { data: 'CompanyName', width: '20%', name: 'CompanyName', defaultContent: '', orderable: true, searchable: true },
      { data: 'InvoiceCount', width: '10%', name: 'InvoiceCount', defaultContent: '', orderable: true, searchable: true },
      { data: 'Amount', width: '20%', name: 'Amount', defaultContent: '', orderable: true, searchable: true },
      { data: 'InvoiceDate', width: '15%', name: 'InvoiceDate', defaultContent: '', orderable: true, searchable: true },
      { data: 'InvoiceDateTo', width: '10%', name: 'InvoiceDateTo', defaultContent: '', orderable: true, searchable: true },
      { data: 'DueDate', width: '20%', name: 'DueDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'DueDateTo', width: '10%', name: 'DueDateTo', defaultContent: '', orderable: true, searchable: true, },
      { data: 'Created', width: '2%', name: 'Created', defaultContent: '', orderable: true, searchable: true, },
      { data: 'CreatedTo', width: '5%', name: 'CreatedTo', defaultContent: '', orderable: true, searchable: true, },
      { data: 'Status', width: '5%', name: 'Status', defaultContent: '', orderable: true, searchable: true, },
      { data: 'InvoiceType', width: '5%', name: 'InvoiceType', defaultContent: '', orderable: true, searchable: true, },

    ];

    this.dataTable = $('#datatable-angular-InvoiceByCustomer');
    this.dataTable.DataTable(this.dtOptions);

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
    if (this.CustomerId == null || this.CustomerId == 'undefined') {
      this.CustomerId = ""
    }
    var table = $('#datatable-angular-InvoiceByCustomer').DataTable();
    table.columns(0).search(this.CustomerId);
    table.columns(4).search(this.InvoiceDate);
    table.columns(5).search(this.InvoiceDateTo);
    table.columns(6).search(this.dueDate);
    table.columns(7).search(this.dueDateTo);
    table.columns(10).search(this.Status);
    table.columns(11).search(this.InvoiceType);
    table.draw();
    this._opened = !this._opened;
  }
  onClear(event) {
    var table = $('#datatable-angular-InvoiceByCustomer').DataTable();
    this.CustomerId = ""
    this.InvoiceDate = ""
    this.InvoiceDateTo = ""
    this.dueDate = ""
    this.dueDateTo = ""
    this.invoiceDateTo = ""
    this.InvoiceDate = ""
    this.DueDate = ""
    this.DueDateTo = ""
    this.Status = ""
    this.InvoiceType = ""
    table.columns(0).search(this.CustomerId);
    table.columns(4).search(this.InvoiceDate);
    table.columns(5).search(this.InvoiceDateTo);
    table.columns(6).search(this.dueDate);
    table.columns(7).search(this.dueDateTo);
    table.columns(10).search(this.Status);
    table.columns(11).search(this.InvoiceType);
    table.draw();
    this._opened = !this._opened;
    this.CustomerId = null
  }


  onExcel() {
    this.InvoiceReports = []
    if (this.CustomerId == null || this.CustomerId == 'undefined') {
      this.CustomerId = ""
    }
    this.InvoiceReports.push({

      CustomerId: this.CustomerId
    })
    var postData = {
      "InvoiceReports": this.InvoiceReports,
      "InvoiceDate": this.InvoiceDate,
      "InvoiceDateTo": this.InvoiceDateTo,
      "DueDate": this.dueDate,
      "DueDateTo": this.dueDateTo,
      "Status": this.Status,
      "InvoiceType": this.InvoiceType,
      "IncludeRR": "",
    }
    this.spinner = true
    this.commonService.postHttpService(postData, "getInvoiceByCustomerReportToExcel").subscribe(response => {
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
        this.spinner= false
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
    const title = 'Invoice By Customer Report';
    const header = ["Customer Name", "Invoice Count", "Amount"]
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
    //Footer Row
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
      var filename = ('Invoice By Customer Report ' + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })



  }

  onChangeCustomer(CustomerId) {
    if (CustomerId == null) {
      this.CustomerId = ''
    }
  }
}
