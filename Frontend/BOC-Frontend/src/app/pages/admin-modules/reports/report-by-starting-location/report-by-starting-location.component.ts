import { DatePipe } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Workbook } from "exceljs";
import * as moment from "moment";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { Subject, Observable, of, concat } from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  debounceTime,
  switchMap,
  map,
} from "rxjs/operators";
import { CommonService } from "src/app/core/services/common.service";
import {
  CONST_VIEW_ACCESS,
  CONST_APPROVE_ACCESS,
  ShipViaReportIdentity,
  CONST_AH_Group_ID,
  CONST_ShipAddressType,
} from "src/assets/data/dropdown";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import * as fs from "file-saver";

@Component({
  selector: "app-report-by-starting-location",
  templateUrl: "./report-by-starting-location.component.html",
  styleUrls: ["./report-by-starting-location.component.scss"],
})
export class ReportByStartingLocationComponent implements OnInit {
  spinner: boolean = false;

  //Server Side
  baseUrl = `${environment.api.apiURL}`;
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
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
  Status = "";
  VendorId: any = [];

  _opened: boolean = false;
  _showBackdrop: boolean = true;

  _toggleSidebar() {
    this._opened = !this._opened;
  }

  FooterRight;
  FooterLeft;

  //dropdowns
  customerList: any = [];
  vendorList: any = [];
  ExcelData;
  RRStatus;

  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];

  vendors$: Observable<any> = of([]);
  vendorsInput$ = new Subject<string>();
  loadingVendors: boolean = false;
  VendorsList: any[] = [];
  IsViewEnabled;
  DownloadExcelCSVinReports;
  adminList: any = [];
  UserTypeList: any = [];
  ShipViaList: any = [];
  ShipTo;
  ShipFrom;
  ShipById;
  ShipViaId;
  ShipDate;
  Shipdate;
  ShipFromIdentity;
  ShipToIdentity;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ShippingIdentityType;
  ShippingAddressId;
  AddressList: any = [];
  ShippingIdentityId;
  PartNo;
  RRNo;
  dtOptionsdeferLoadingShow: boolean = true;
  constructor(
    private http: HttpClient,
    private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent,
    private commonService: CommonService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.IsViewEnabled = this.commonService.permissionCheck(
      "ShipViaReport",
      CONST_VIEW_ACCESS
    );
    this.DownloadExcelCSVinReports = this.commonService.permissionCheck(
      "ShipViaReport",
      CONST_APPROVE_ACCESS
    );

    if (this.IsViewEnabled) {
      this.loadCustomers();
      // this.UserTypeList = ShipViaReportIdentity
      this.onList();
    }
  }

  getShipViaList() {
    this.commonService.getHttpService("ShipViaList").subscribe((response) => {
      this.ShipViaList = response.responseData;
    });
  }
  onList() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };
    var url3 = this.baseUrl + "/api/v1.0/RRReports/RRStartLocationReport";
    const that = this;
    var filterData = {
      ShippingIdentityType: this.ShippingIdentityType,
      ShippingIdentityId: this.ShippingIdentityId,
      ShippingAddressId: this.ShippingAddressId,
      PartNo: this.PartNo,
      RRNo: this.RRNo,
    };

    this.dtOptions = this.getdtOption();
    if (this.dtOptionsdeferLoadingShow) {
      this.dtOptions.deferLoading = 0;
    }
    this.dtOptions["ajax"] = (dataTablesParameters: any, callback) => {
      that.api_check ? that.api_check.unsubscribe() : (that.api_check = null);

      that.api_check = that.http
        .post<any>(
          url3,
          Object.assign(dataTablesParameters, filterData),
          httpOptions
        )
        .subscribe((resp) => {
          callback({
            draw: resp.responseData.draw,
            recordsTotal: resp.responseData.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.data || [],
          });
          this.dtTrigger.next();
        });
    };

    this.dtOptions["columns"] = [
      {
        data: "RRNo",
        name: "RRNo",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "ShipFromIdentity",
        name: "ShipFromIdentity",
        defaultContent: "",
        orderable: true,
        searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          if (
            row.ShipFromIdentity == 1 ||
            (row.ShipFromIdentity == null && row.ShippingIdentityType == 1)
          ) {
            return `Customer`;
          } else {
            return "Aibond";
          }
        },
      },
      {
        data: "ShipFromName",
        name: "ShipFromName",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "ShipToName",
        name: "ShipToName",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "ShippedBy",
        name: "ShippedBy",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "ShipViaName",
        name: "ShipViaName",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "ShipDate",
        name: "ShipDate",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "ShipStatus",
        name: "ShipStatus",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "ShipComment",
        name: "ShipComment",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "ReceiveComment",
        name: "ReceiveComment",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "ReceiveDate",
        name: "ReceiveDate",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "CreatedDate",
        name: "CreatedDate",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "IsPickedUpType",
        name: "IsPickedUpType",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "PickedUpDate",
        name: "PickedUpDate",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "PickedUpBy",
        name: "PickedUpBy",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },

      // { data: 'CustomerId', name: 'CustomerId', defaultContent: '', orderable: true, searchable: true, },
      // { data: 'VendorId', name: 'VendorId', defaultContent: '', orderable: true, searchable: true, },
      // { data: 'CreatedBy', name: 'CreatedBy', defaultContent: '', orderable: true, searchable: true, },
      // { data: 'ShipViaId', name: 'ShipViaId', defaultContent: '', orderable: true, searchable: true, },
      // { data: 'ShipFromIdentity', name: 'ShipFromIdentity', defaultContent: '', orderable: true, searchable: true, },
      // { data: 'ShipToIdentity', name: 'ShipToIdentity', defaultContent: '', orderable: true, searchable: true, },
    ];

    this.dataTable = $("#datatable-angular-ReportByLocation");
    this.dataTable.DataTable(this.dtOptions);
  }

  rerender(): void {
    this.dtOptionsdeferLoadingShow = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      this.onList();
    });
  }
  getdtOption() {
    if (this.DownloadExcelCSVinReports) {
      var buttons = {};
      buttons = {
        dom: {
          button: {
            className: "",
          },
        },
        buttons: [
          {
            extend: "colvis",
            className: "btn btn-xs btn-primary",
            text: "COLUMNS",
          },
          {
            extend: "excelHtml5",
            text: "EXCEL",
            className: "btn btn-xs btn-secondary",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "csvHtml5",
            text: "CSV",
            className: "btn btn-xs btn-secondary",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "pdfHtml5",
            text: "PDF",
            className: "btn btn-xs btn-secondary",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "print",
            className: "btn btn-xs btn-secondary",
            text: "PRINT",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "copy",
            className: "btn btn-xs btn-secondary",
            text: "COPY",
            exportOptions: {
              columns: ":visible",
            },
          },
        ],
      };
    } else {
      buttons = {
        dom: {
          button: {
            className: "",
          },
        },
        buttons: [],
      };
    }
    return {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-3 col-sm-3 col-md-3 col-xl-3"l><"col-4 col-sm-4 col-md-4 col-xl-4"i><"col-5 col-sm-5 col-md-5 col-xl-5"p>>',
      pagingType: "full_numbers",
      pageLength: 10,
      lengthMenu: [
        [10, 25, 50, 100, -1],
        [10, 25, 50, 100, "All"],
      ],
      processing: true,
      autoWidth: false,
      serverSide: true,
      searching: false,
      retrieve: true,
      order: [[0, "desc"]],
      serverMethod: "post",
      buttons: buttons,
      // columnDefs: [

      //   {
      //     "targets": [10],
      //     "visible": false,
      //     "searchable": true
      //   },
      //   {
      //     "targets": [11],
      //     "visible": false,
      //     "searchable": true
      //   },
      //   {
      //     "targets": [12],
      //     "visible": false,
      //     "searchable": true
      //   },
      //   {
      //     "targets": [13],
      //     "visible": false,
      //     "searchable": true
      //   },
      //   {
      //     "targets": [14],
      //     "visible": false,
      //     "searchable": true
      //   },
      //   {
      //     "targets": [15],
      //     "visible": false,
      //     "searchable": true
      //   },

      // ],
      columnDefs: [],
      createdRow: function (row, data, index) {
        var html = `<a href="#/admin/repair-request/edit?RRId=${data.RRId}" target="_blank"  data-toggle='tooltip' title='RR View' data-placement='top'>${data.RRNo}</a>`;
        $("td", row).eq(0).html(html);
      },

      rowCallback: (row: Node, data: any | Object, index: number) => {},
      preDrawCallback: function () {
        $("#datatable-angular-ReportByLocation_processing").attr(
          "style",
          "display: block; z-index: 10000 !important"
        );
      },
      language: {
        paginate: {
          first: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          last: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          next: '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          previous: '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        },
        loadingRecords: "&nbsp;",
        processing: "Loading...",
        emptyTable: this.dtOptionsdeferLoadingShow
          ? '<div class="alert alert-info" style="margin-left: 17%" role="alert">Please select filter to load data!</div>'
          : "No data available!",
      },
    };
  }
  ShipDateFormat(ShipDate) {
    const ShipDateYears = ShipDate.year;
    const ShipDateDates = ShipDate.day;
    const ShipDatemonths = ShipDate.month;
    let ShipDateformat = new Date(
      ShipDateYears,
      ShipDatemonths - 1,
      ShipDateDates
    );
    this.Shipdate = moment(ShipDateformat).format("YYYY-MM-DD");
  }

  onFilter(event) {
    this.rerender();
    this._opened = !this._opened;
  }
  onClear(event) {
    (this.ShipDate = ""),
      (this.ShipFromIdentity = ""),
      (this.ShipToIdentity = ""),
      (this.ShipViaId = ""),
      (this.CustomerId = ""),
      (this.VendorId = ""),
      (this.ShipById = ""),
      (this.Shipdate = "");
    this.ShippingIdentityType = "";
    this.RRNo = "";
    this.ShippingAddressId = "";
    this.rerender();
    this._opened = !this._opened;
  }
  onExcel() {
    var postData = {
      ShippingIdentityType: this.ShippingIdentityType,
      ShippingIdentityId: this.ShippingIdentityId,
      ShippingAddressId: this.ShippingAddressId,
      PartNo: this.PartNo,
      RRNo: this.RRNo,
    };
    this.spinner = true;
    this.commonService.postHttpService(postData, "ReportByLocation").subscribe(
      (response) => {
        if (response.status == true) {
          this.ExcelData = response.responseData.ExcelData;
          this.generateExcelFormat();
          this.spinner = false;
          Swal.fire({
            title: "Success!",
            text: "Excel downloaded Successfully!",
            type: "success",
            confirmButtonClass: "btn btn-confirm mt-2",
          });
        } else {
          this.spinner = false;
          Swal.fire({
            title: "Error!",
            text: "Excel could not be downloaded!",
            type: "warning",
            confirmButtonClass: "btn btn-confirm mt-2",
          });
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }
  generateExcelFormat() {
    var data = [];
    var jsonData = this.ExcelData;
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
    const title = "Ship Via Report";
    const header = keyNames;
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Data");
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
    headerRow.font = { bold: true };

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "FF0000FF" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    data.forEach((d) => {
      let row = worksheet.addRow(d);
    });
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
    worksheet.getColumn(22).width = 20;
    worksheet.getColumn(23).width = 20;
    worksheet.getColumn(24).width = 20;
    worksheet.getColumn(25).width = 20;
    worksheet.getColumn(26).width = 30;
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
    // worksheet.mergeCells(`A${footerRow.number}:L${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      var currentDate = this.datePipe.transform(
        new Date(),
        "M-d-yyyy hh-mm-ss a"
      );
      var filename = "Ship Via Report " + currentDate + ".xlsx";
      fs.saveAs(blob, filename);
    });
  }

  loadCustomers() {
    this.customers$ = concat(
      this.searchCustomers().pipe(
        // default items
        catchError(() => of([])) // empty list on error
      ),
      this.customersInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap((term) => {
          if (term != null && term != undefined)
            return this.searchCustomers(term).pipe(
              catchError(() => of([])) // empty list on error
            );
          else return of([]);
        })
      )
    );
  }

  searchCustomers(term: string = ""): Observable<any> {
    this.loadingCustomers = true;
    var postData = {
      Customer: term,
    };
    return this.commonService
      .postHttpService(postData, "getAllAutoComplete")
      .pipe(
        map((response) => {
          this.CustomersList = response.responseData;
          this.loadingCustomers = false;
          return response.responseData;
        })
      );
  }
  selectAll() {
    let customerIds = this.CustomersList.map((a) => a.CustomerId);
    let cMerge = [...new Set([...customerIds, ...this.CustomerId])];
    this.CustomerId = cMerge;
  }
  loadVendors() {
    this.vendors$ = concat(
      this.searchVendors().pipe(
        // default items
        catchError(() => of([])) // empty list on error
      ),
      this.vendorsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap((term) => {
          if (term != null && term != undefined)
            return this.searchVendors(term).pipe(
              catchError(() => of([])) // empty list on error
            );
          else return of([]);
        })
      )
    );
  }
  searchVendors(term: string = ""): Observable<any> {
    this.loadingVendors = true;
    var postData = {
      Vendor: term,
    };
    return this.commonService
      .postHttpService(postData, "getAllAutoCompleteofVendor")
      .pipe(
        map((response) => {
          this.VendorsList = response.responseData;
          this.loadingVendors = false;
          return response.responseData;
        })
      );
  }
  selectAllVendor() {
    let VendorIdIds = this.VendorsList.map((a) => a.VendorId);
    let cMerge = [...new Set([...VendorIdIds, ...this.VendorId])];
    this.VendorId = cMerge;
  }
  getAdminList() {
    this.commonService
      .getHttpService("getAllActiveAdmin")
      .subscribe((response) => {
        //getAdminListDropdown
        this.adminList = response.responseData.map(function (value) {
          return {
            title: value.FirstName + " " + value.LastName,
            UserId: value.UserId,
          };
        });
      });
  }

  onLocationChange(e) {
    this.AddressList = [];
    this.ShippingAddressId = "";
    if (e.target.value == "2") {
      this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(
        (response) => {
          if (response.status == true) {
            this.AddressList = response.responseData.AHGroupVendorAddress.map(
              function (value) {
                return {
                  title:
                    value.StreetAddress +
                    " " +
                    value.SuiteOrApt +
                    ", " +
                    value.City +
                    " , " +
                    value.StateName +
                    " ," +
                    value.CountryName +
                    ". - " +
                    value.Zip,
                  AddressId: value.AddressId,
                };
              }
            );
            this.ShippingIdentityId = CONST_AH_Group_ID;
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
    }
  }

  onCustomerChange() {
    this.AddressList = [];
    this.ShippingAddressId = "";
    var postData = {
      IdentityId: this.CustomerId.toString(),
      IdentityType: 1,
      Type: CONST_ShipAddressType,
    };
    this.commonService
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.AddressList = response.responseData.map(function (value) {
          return {
            title:
              value.StreetAddress +
              " " +
              value.SuiteOrApt +
              ", " +
              value.City +
              " , " +
              value.StateName +
              " ," +
              value.CountryName +
              ". - " +
              value.Zip,
            AddressId: value.AddressId,
          };
        });
        this.ShippingIdentityId = this.CustomerId.toString();
      });
  }
}
