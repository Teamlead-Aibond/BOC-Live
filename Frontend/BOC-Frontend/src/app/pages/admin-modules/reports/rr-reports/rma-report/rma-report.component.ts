import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { concat, Observable, of, Subject } from 'rxjs';
import { array_rr_status, CONST_APPROVE_ACCESS, CONST_VIEW_ACCESS } from 'src/assets/data/dropdown';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-rma-report',
  templateUrl: './rma-report.component.html',
  styleUrls: ['./rma-report.component.scss']
})
export class RmaReportComponent implements OnInit {
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
  CustomerPONo;
  Manufacturer;
  ManufacturerPartNo;
  SerialNo;
  Status = '';
  VendorId: any = [];

  _opened: boolean = false;
  _showBackdrop: boolean = true;
  recordsTotal: any = 0;

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
  keyword = 'Manufacturer';
  isLoading: boolean = false;
  public placeholder: string = "Enter the Manufacturer Name";
  ManufacturerList: any = [];
  subStatusList: any = []
  adminList: any = []
  RRPartLocationList: any = []
  AssigneeUserId
  RRPartLocationId
  SubStatusId
  CustomerGroupId: any
  customerGroupList: any;
  dtOptionsdeferLoadingShow: boolean = true;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  constructor(private http: HttpClient, private cd_ref: ChangeDetectorRef, public navCtrl: NgxNavigationWithDataComponent,
    private commonService: CommonService, private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.IsViewEnabled = this.commonService.permissionCheck("OpenOrderBySupplierReport", CONST_VIEW_ACCESS);
    this.DownloadExcelCSVinReports = this.commonService.permissionCheck("OpenOrderBySupplierReport", CONST_APPROVE_ACCESS);
    if (this.IsViewEnabled) {
      this.loadCount();
      this.loadCustomers();
      this.getCustomerGroupList();
      this.loadVendors();
      this.getPartLocationList();
      this.getSubStatusList();
      this.getAdminList();
      this.RRStatus = array_rr_status;
      this.onFilterofRMAReport();

    }

  }
  loadCount() {
    var postData = {};
    this.commonService.postHttpService(postData, "getRMAReportCount").subscribe(response => {
      if (response.status == true) {
        this.recordsTotal = response.responseData.recordsTotal;

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  callAlertMsg() {
    Swal.fire({
      title: 'Info!',
      text: 'Please select filter to load data!',
      type: 'info',
      confirmButtonClass: 'btn btn-confirm mt-2'
    });
  }

  onFilterofRMAReport() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };
    var url3 = this.baseUrl + '/api/v1.0/RRReports/RMAReport';
    const that = this;
    var filterData = {
      "Manufacturer": this.Manufacturer,
      "ManufacturerPartNo": this.ManufacturerPartNo,
      "SerialNo": this.SerialNo,
      "Status": this.Status,
      "CustomerId": this.CustomerId,
      "VendorId": this.VendorId,
      "CustomerPONo": this.CustomerPONo,
      "SubStatusId": this.SubStatusId,
      "AssigneeUserId": this.AssigneeUserId,
      "RRPartLocationId": this.RRPartLocationId,
      "CustomerGroupId": this.CustomerGroupId
    }

    this.dtOptions = this.getdtOption();
    if (this.dtOptionsdeferLoadingShow) {
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
            recordsTotal: that.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.data || []
          });
          this.dtTrigger.next()
        });
    },


      this.dtOptions["columns"] = [
        { data: 'PartNo', name: 'PartNo', defaultContent: '', orderable: true, searchable: true },
        { data: 'RRNo', name: 'RRNo', defaultContent: '', orderable: true, searchable: true },
        { data: 'Supplier', name: 'Supplier', defaultContent: '', orderable: true, searchable: true },
        { data: 'RMARequired', name: 'RMARequired', defaultContent: '', orderable: true, searchable: true },
        { data: 'InternalNotes', name: 'InternalNotes', defaultContent: '', orderable: true, searchable: true },
        { data: 'Manufacturer', name: 'Manufacturer', defaultContent: '', orderable: true, searchable: true },
        { data: 'ManufacturerPartNo', name: 'ManufacturerPartNo', defaultContent: '', orderable: true, searchable: true },
        { data: 'SerialNo', name: 'SerialNo', defaultContent: '', orderable: true, searchable: true },
        { data: 'Description', name: 'Description', defaultContent: '', orderable: true, searchable: true, },
        // { data: 'StatusName', name: 'StatusName', defaultContent: '', orderable: true, searchable: true, },
        { data: 'CompanyName', name: 'CompanyName', defaultContent: '', orderable: true, searchable: true, },

        { data: 'AHReceivedDate', name: 'AHReceivedDate', defaultContent: '', orderable: true, searchable: true },
        { data: 'CustomerReference1', name: 'CustomerReference1', defaultContent: '', orderable: true, searchable: true },
        { data: 'CustomerReference2', name: 'CustomerReference2', defaultContent: '', orderable: true, searchable: true },
        { data: 'CustomerReference3', name: 'CustomerReference3', defaultContent: '', orderable: true, searchable: true },
        { data: 'CustomerReference4', name: 'CustomerReference4', defaultContent: '', orderable: true, searchable: true },
        { data: 'CustomerReference5', name: 'CustomerReference5', defaultContent: '', orderable: true, searchable: true },
        { data: 'CustomerReference6', name: 'CustomerReference6', defaultContent: '', orderable: true, searchable: true },
        { data: 'CustomerStatedIssue', name: 'CustomerStatedIssue', defaultContent: '', orderable: true, searchable: true },

        { data: 'DirectedSupplier', name: 'DirectedSupplier', defaultContent: '', orderable: true, searchable: true, },
        { data: 'VendorRefNo', name: 'VendorRefNo', defaultContent: '', orderable: true, searchable: true, },
        { data: 'VendorEmail', name: 'VendorEmail', defaultContent: '', orderable: true, searchable: true },

       

      ];

    this.dataTable = $('#datatable-angular-RMAReport');
    this.dataTable.DataTable(this.dtOptions);
    $('#datatable-angular-RMAReport .dataTables_empty').text('You have ' + this.recordsTotal + ' records, Please select filter to load data!');
    $('#datatable-angular-RMAReport_filter').attr('style', 'display: none;');

  }

  rerender(): void {
    this.dtOptionsdeferLoadingShow = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      this.onFilterofRMAReport()
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
      columnDefs: [

      ],

      createdRow: function (row, data, index) {


        // var statusObj = array_rr_status.find(a => a.id == data.Status)
        // var html = '<span class="badge ' + (statusObj ? statusObj.cstyle : '') + ' btn-xs">' + (statusObj ? statusObj.title : '') + '</span>';
        // $('td', row).eq(6).html(html);

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
        $('#datatable-angular-RMAReport_processing').attr('style', 'display: block; z-index: 10000 !important');

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
        //  "infoEmpty": this.dtOptionsdeferLoadingShow ? '<div class="alert alert-info" style="margin-left: 17%" role="alert">You have '+ this.recordsTotal +' records, Please select filter to load data!</div>' : 'No data available!',
        "emptyTable": this.dtOptionsdeferLoadingShow ? '<div class="alert alert-info" style="margin-left: 17%" role="alert">Please select filter to load data!</div>' : 'No data available!'
      }
    };
  }


  onFilter(event) {
    this.rerender();
    this._opened = !this._opened;

  }
  onClear(event) {
    this.Manufacturer = "";
    this.ManufacturerPartNo = "";
    this.SerialNo = "";
    this.Status = "";
    this.CustomerId = "";
    this.VendorId = "";
    this.CustomerPONo = "";
    if (this.CustomerGroupId != null || this.CustomerGroupId != '') {
      this.CustomerGroupId = "";
      this.loadCustomers();
    }
    this.rerender();
    this._opened = !this._opened;

  }
  onExcel() {


    var postData = {
      "Manufacturer": this.Manufacturer,
      "ManufacturerPartNo": this.ManufacturerPartNo,
      "SerialNo": this.SerialNo,
      // "Status": this.Status,
      "CustomerId": this.CustomerId,
      "VendorId": this.VendorId,
      // "CustomerPONo": this.CustomerPONo,
      // "SubStatusId": this.SubStatusId,
      // "AssigneeUserId": this.AssigneeUserId,
      // "RRPartLocationId": this.RRPartLocationId,
      "CustomerGroupId": this.CustomerGroupId,
      "RRReports": []

    }
    this.spinner = true
    this.commonService.postHttpService(postData, "getRMAReportExportToExcel").subscribe(response => {
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
      delete jsonData[i].RRId;
      delete jsonData[i].Status
      for (var key in obj) {
        var value = obj[key];
        temparray.push(value);
      }
      data.push(temparray);
    }

    //Excel Title, Header, Data
    const title = 'RMA Report';
    const header = ["Part No", "RRNo", "Supplier", "RMA Required (Y/N)", "Internal Notes", "Manufacturer", "Manufacturer Part No", "Serial No", "Description", "CompanyName", "AH Received Date", "Customer Reference 1", "Customer Reference 2", "Customer Reference 3", "Customer Reference 4", "Customer Reference 5", "Customer Reference 6", "Customer Stated Issue", "Directed Supplier", "Vendor Ref No", "Vendor Emaild"]
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
    // //    extension: 'png' ,
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
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 30;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 30;
    worksheet.getColumn(11).width = 30;
    worksheet.getColumn(12).width = 30;
    worksheet.getColumn(13).width = 20;
    worksheet.getColumn(14).width = 15;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 20;
    worksheet.getColumn(17).width = 20;
    worksheet.getColumn(18).width = 20;
    worksheet.getColumn(19).width = 20;
    worksheet.getColumn(20).width = 20;
    worksheet.getColumn(21).width = 20;

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
    // worksheet.mergeCells(`A${footerRow.number}:L${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = ('RMA Report ' + currentDate + '.xlsx')
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
  getCustomerGroupList() {
    this.commonService.getHttpService("ddCustomerGroup").subscribe(response => {
      if (response.status) {
        this.customerGroupList = response.responseData;
      }
    });
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


  //AutoSuggestuiion for Manufacturer
  selectEvent($event) {

    this.Manufacturer = $event.ManufacturerId
  }

  onChangeSearch(val: string) {

    if (val) {
      this.isLoading = true;
      var postData = {
        "Manufacturer": val
      }
      this.commonService.postHttpService(postData, "ManufacturerAutoSuggest").subscribe(response => {
        if (response.status == true) {
          var data = []
          data = response.responseData
          this.ManufacturerList = data.filter(a => a.Manufacturer.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoading = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoading = false; });

    }
  }
  clearEvent($event) {
    this.Manufacturer = ""
  }
  onFocused(e) {
    // do something when input is focused
  }


  getAdminList() {
    this.commonService.getHttpService('getAllActiveAdmin').subscribe(response => {//getAdminListDropdown
      this.adminList = response.responseData.map(function (value) {
        return { title: value.FirstName + " " + value.LastName, "UserId": value.UserId }
      });;;
    });
  }

  getSubStatusList() {
    this.commonService.getHttpService('RRSubStatusDDl').subscribe(response => {
      this.subStatusList = response.responseData;
    });
  }

  getPartLocationList() {
    this.commonService.getHttpService('RRPartLocationDDl').subscribe(response => {
      if (response.status == true) {
        this.RRPartLocationList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
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

