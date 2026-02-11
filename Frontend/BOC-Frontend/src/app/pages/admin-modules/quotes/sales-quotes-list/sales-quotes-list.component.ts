/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  TemplateRef,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  OnDestroy,
} from "@angular/core";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbCalendar,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import Swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { environment } from "src/environments/environment";
import { CommonService } from "src/app/core/services/common.service";
import { DatePipe } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
import {
  SalesQuote_Status,
  Quote_type,
  terms,
  warranty_list,
  taxtype,
  Quote_notes,
  CONST_IDENTITY_TYPE_QUOTE,
  CONST_VIEW_ACCESS,
  CONST_CREATE_ACCESS,
  CONST_MODIFY_ACCESS,
  CONST_DELETE_ACCESS,
  CONST_APPROVE_ACCESS,
  CONST_VIEW_COST_ACCESS,
  CONST_COST_HIDE_VALUE,
  attachment_thumb_images,
  CONST_BillAddressType,
  CONST_ShipAddressType,
  CONST_ContactAddressType,
  Const_Alert_pop_title,
  Const_Alert_pop_message,
} from "src/assets/data/dropdown";
import * as moment from "moment";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { AddRrPartsComponent } from "../../common-template/add-rr-parts/add-rr-parts.component";
import jspdf from "jspdf";
import html2canvas from "html2canvas";
import { EmailComponent } from "../../common-template/email/email.component";
import { NgSelectComponent } from "@ng-select/ng-select";
import { ExcelService } from "src/app/core/services/excel.service";
import { Workbook } from "exceljs";
import * as fs from "file-saver";
import { NgForm } from "@angular/forms";
import { SalesQuotePrintComponent } from "../../common-template/sales-quote-print/sales-quote-print.component";
import { BlanketPoNonRrComponent } from "../../common-template/blanket-po-non-rr/blanket-po-non-rr.component";
@Component({
  selector: "app-sales-quotes-list",
  templateUrl: "./sales-quotes-list.component.html",
  styleUrls: ["./sales-quotes-list.component.scss"],
  providers: [NgxSpinnerService],
})
export class SalesQuotesListComponent implements OnInit, OnDestroy {
  baseUrl = `${environment.api.apiURL}`;
  PartId;
  submitted = false;
  postdata;
  QuoteTypeStyle;
  Part;
  ExcelData: any = [];
  AttachmentList: any = [];
  Quote: any = [];
  keywordForCustomer = "CompanyName";
  customerList: any = [];
  isLoadingCustomer: boolean = false;
  CompanyName;
  keywordForRR = "RRNo";
  RRList: any[];
  RRId = "";
  isLoadingRR: boolean = false;
  @Input() templateSettings: TemplateRef<HTMLElement>;
  @ViewChild("viewTemplate", null) viewTemplate: TemplateRef<HTMLElement>;
  @ViewChild("editTemplate", null) editTemplate: TemplateRef<HTMLElement>;
  @ViewChild("addTemplate", null) addTemplate: TemplateRef<HTMLElement>;
  @ViewChild(SalesQuotePrintComponent, null)
  printComponent: SalesQuotePrintComponent;

  @ViewChild(DataTableDirective, { static: false })
  Currentdate = new Date();
  showSearch: boolean = true;

  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  dateFilter;
  PON;
  LPPList;
  RecommendedPrice;
  @ViewChild("dataTable", { static: true }) table;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  faxCustomerAddress;
  faxBillingAddress;
  faxShippingAddress;
  PhoneCustomerAddress;
  PhoneBillingAddress;
  PhoneShippingAddress;
  public QuoteNo: string;
  public Description: string;
  public CustomerId: string;
  public Status: string;
  QuoteId;
  result;
  SalesQuoteInfo;
  QuoteItem: any = [];
  NotesList: any = [];
  RRNotesList: any = [];
  ShippingAddress;
  BillingAddress;
  CustomerAddress;
  CurrentDate;
  Created;
  SalesQuoteStatusList;
  QuoteTypeList;
  DateRequested;
  QuoteType;
  RRNo;
  QuoteDate;
  QuoteDateTo;
  //itemdetails
  LeadTime;
  Rate;
  WarrantyPeriod;
  SubTotal;
  GrandTotal;
  AdditionalCharge;
  TotalTax;
  Discount;
  AHFees;
  Shipping;
  TaxPercent;
  btnDisabled: boolean = false;
  //ADD
  model: any = [];
  partList: any = [];
  customerPartList: any = [];
  partNewList: any = [];
  AddressList;
  customerAddressList;
  TermsList;
  warrantyList;
  PartItem: any[] = [];
  taxType: any = [];
  customerInfo;
  Quote_notes;
  QuoteDateToDate;
  QuoteDateDate;
  CustomerBillToId;
  CustomerShipToId;
  IsRushRepair;
  IsWarrantyRecovery;
  repairMessage;
  QuoteList: any = [];
  ResponseMessage;
  number;

  //access rights variables
  IsSOAddEnabled;
  IsSOEditEnabled;
  IsSODeleteEnabled;
  IsSOPrintPDFEnabled;
  IsSOEmailEnabled;
  IsSOExcelEnabled;
  IsSONotesEnabled;
  IsConvertQuoteToSOEnabled;
  IsSOViewCostEnabled;
  IsSOViewEnabled;

  keyword = "PartNo";
  filteredData: any[];
  isLoading: boolean = false;
  data = [];

  settingsView;
  Type;
  TypePartItemId;
  TypePartId;
  TypePartNo;
  attachmentThumb;
  TermsName;
  ListHidden: boolean = false;
  showList: boolean = true;
  IsDeleted: string;
  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private router: Router,
    public service: CommonService,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private CommonmodalService: BsModalService,
    private excelService: ExcelService,
    public modalRef: BsModalRef,
    private datePipe: DatePipe,
    public navCtrl: NgxNavigationWithDataComponent,
    private route: ActivatedRoute
  ) {}
  currentRouter = decodeURIComponent(this.router.url);

  ngOnInit(): void {
    document.title = "Quote View";

    if (history.state.QuoteId == undefined) {
      this.route.queryParams.subscribe((params) => {
        this.QuoteId = params["QuoteId"];
        this.showList = params["showList"] == 1;
        this.IsDeleted = params["IsDeleted"];
      });
    } else if (history.state.QuoteId != undefined) {
      this.QuoteId = history.state.QuoteId;
    }
    // this.IsDeleted =history.state.IsDeleted;
    // if (this.showList == true) {
    //this.ListHidden = false
    this.loadTemplate("view", this.QuoteId, this.IsDeleted);

    //}
    // else {
    //   this.ListHidden = true;
    //   const httpOptions = {
    //     headers: new HttpHeaders({
    //       'Content-Type': 'application/json',
    //       'Authorization': `${localStorage.getItem("Access-Token")}`
    //     })
    //   };

    //   var url = this.baseUrl + '/api/v1.0/quotes/getQuoteListByServerSide';
    //   const that = this;
    //   var filterData = {}

    //   this.dtOptions = {
    //     dom: '<"row"<"col-12 col-sm-12 col-md-12 col-xl-12"B> <"col-12 col-sm-12 col-md-12 col-xl-12 aso"f>>rt<" row"<"help-block col-12 col-sm-6 col-md-6 col-xl-6"l><"col-12 col-sm-6 col-md-6 col-xl-6"i><"col-12 col-sm-12 col-md-12 col-xl-12"p>>',
    //     pagingType: 'full_numbers',
    //     pageLength: 10,
    //     lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
    //     processing: true,
    //     serverSide: true,
    //     retrieve: true,
    //     order: [[0, 'desc']],
    //     serverMethod: 'post',
    //     ajax: (dataTablesParameters: any, callback) => {
    //       that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

    //       that.api_check = that.http.post<any>(url,
    //         Object.assign(dataTablesParameters,
    //           filterData
    //         ), httpOptions).subscribe(resp => {
    //           callback({
    //             draw: resp.responseData.draw,
    //             recordsTotal: resp.responseData.recordsTotal,
    //             recordsFiltered: resp.responseData.recordsFiltered,
    //             data: resp.responseData.data
    //           });
    //           if (this.QuoteId == undefined) {
    //             this.QuoteId = resp.responseData.data[0].QuoteId;
    //           }
    //           if (this.QuoteId == undefined) {
    //             this.QuoteId = resp.responseData.data[0].QuoteId;
    //           }

    //           if (this.Type == "MRO") {
    //             this.loadTemplate('add', this.Type, this.IsDeleted)
    //           }
    //           else {
    //             this.loadTemplate('view', this.QuoteId, this.IsDeleted)
    //           }

    //         });
    //     },
    //     buttons: {
    //       dom: {
    //         button: {
    //           className: ''
    //         }

    //       },
    //       buttons: []
    //     },
    //     columnDefs: [
    //       {
    //         "targets": [1],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [2],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [3],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [4],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [5],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [6],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [7],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [8],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [9],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [10],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [11],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [12],
    //         "visible": false,
    //         "searchable": true
    //       },

    //     ],
    //     createdRow: function (row, data, index) {
    //     },
    //     columns: [

    //       {
    //         data: 'QuoteId', name: 'QuoteId', defaultContent: '', orderable: true, searchable: true,
    //         render: (data: any, type: any, row: any, meta) => {
    //           var cstyle = '';
    //           switch (row.Status) {
    //             case 0: { cstyle = 'badge-warning'; status = "Open"; break; }
    //             case 1: { cstyle = 'badge-success'; status = "Approved"; break; }
    //             case 2: { cstyle = 'badge-danger'; status = "Cancelled"; break; }
    //             case 3: { cstyle = 'badge-info'; status = "Draft"; break; }
    //             case 4: { cstyle = 'badge-primary'; status = "Submitted"; break; }
    //             case 5: { cstyle = 'badge-secondary'; status = "Quoted"; break; }
    //             default: { cstyle = ''; status = ''; break; }
    //           }
    //           var cstylealgin = 'float:right'
    //           var sostyles = 'background:#E8EAF6!important;color:#333;padding:1px 5px;margin-right:8px;'

    //           var number = '';
    //           if (row.RRNo != '' && row.RRNo != '0' && row.RRNo != null) {
    //             number = row.RRNo;
    //           } else if (row.MRONo != '' && row.MRONo != '0' && row.MRONo != null) {
    //             number = row.MRONo;
    //           } else {
    //             number = row.QuoteNo + ' &nbsp;';
    //           }

    //           var IsEmailSent = '';
    //           if (row.IsEmailSent) {
    //             IsEmailSent = '<i  class="mdi mdi-email-outline red"></i>';
    //           }

    //           var QuoteTypeStyle = this.QuoteTypeList.find(a => a.Quote_TypeId == row.QuoteType)

    //           var checkbox = '';
    //           // if (row.Status == 0) {
    //           checkbox = '<input type="checkbox" class="checkbox">&nbsp;';
    //           //}

    //           if (!this.IsSOViewCostEnabled) {
    //             row.GrandTotal = CONST_COST_HIDE_VALUE;
    //           }
    //           return '<p>' + checkbox + row.CompanyName + `<span style="float:right;">$${row.GrandTotal}</span>` + '</p><a style="cursor:pointer" class="IDHREF"><span style="background:#E8EAF6;padding:1px 5px;margin-right:2px;" >#' + number + '</span></a>&nbsp;|&nbsp;<span class="order-date">' + row.Created + '</span><br><span style="float:right" class="badge ' + cstyle + ' btn-xs">' + status + '</span><span class="pink"><span class="badge ' + (QuoteTypeStyle ? QuoteTypeStyle.cstyle : 'btn-xs"') + '">' + (QuoteTypeStyle ? QuoteTypeStyle.Quote_TypeName : '') + '</span>  <span style="float:right" class="btn-xs" ngbTooltip="Email Sent">' + IsEmailSent + '</span> </a>';

    //         },
    //       },
    //       { data: 'QuoteNo', name: 'QuoteNo', orderable: true, searchable: true, },
    //       { data: 'CompanyName', name: 'CompanyName', orderable: true, searchable: true, },
    //       { data: 'Status', name: 'Status', orderable: true, searchable: true, },
    //       { data: 'Created', name: 'Created', orderable: true, searchable: true, },
    //       { data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true, },
    //       { data: 'CustomerId', name: 'CustomerId', orderable: true, searchable: true, },
    //       { data: 'RRNo', name: 'RRNo', orderable: true, searchable: true, },
    //       { data: 'QuoteType', name: 'QuoteType', orderable: true, searchable: true, },
    //       { data: 'Description', name: 'Description', orderable: true, searchable: true, },
    //       { data: 'QuoteDate', name: 'QuoteDate', orderable: true, searchable: true, },
    //       { data: 'QuoteDateTo', name: 'QuoteDateTo', orderable: true, searchable: true, },
    //       { data: 'RRId', name: 'RRId', orderable: true, searchable: true, },

    //     ],
    //     rowCallback: (row: Node, data: any | Object, index: number) => {

    //       $('.IDHREF', row).unbind('click');
    //       $('.IDHREF', row).bind('click', (e) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         this.loadTemplate("view", data.QuoteId, this.IsDeleted);
    //         this.QuoteId = data.QuoteId
    //       });

    //       $('.checkbox', row).unbind('click');
    //       $('.checkbox', row).bind('click', (e) => {
    //         this.onExcelData(data.QuoteId)

    //         if (data.RRNo != '' && data.RRNo != '0' && data.RRNo != null) {
    //           this.onSendEmailofRR(data.QuoteId, data.RRId)
    //         } else if (data.MRONo != '' && data.MRONo != '0' && data.MRONo != null) {
    //           this.onSendEmailofMRO(data.QuoteId, data.MROId)

    //         }
    //       });

    //       return row;
    //     },

    //     language: {
    //       "paginate": {
    //         "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
    //         "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
    //         "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
    //         "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>'
    //       }
    //     }
    //   };

    //   this.dataTable = $('#datatable-sq');
    //   this.dataTable.DataTable(this.dtOptions);
    // }
    this.QuoteTypeStyle = "";
    this.TermsName = "";
    this.settingsView = "";
    this.getAdminSettingsView();
    this.Type = history.state.Type;
    this.TypePartId = history.state.PartId;
    this.TypePartItemId = history.state.PartItemId;
    this.TypePartNo = history.state.PartNo;
    this.attachmentThumb = attachment_thumb_images;
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Sales-Quotes", path: "/" },
      { label: "List", path: "/", active: true },
    ];
    this.SalesQuoteInfo = "";
    this.QuoteItem = [];
    this.ShippingAddress = "";
    this.BillingAddress = "";
    this.CustomerAddress = "";
    this.NotesList = [];
    this.RRNotesList = [];
    this.AttachmentList = [];
    this.getCustomerList();
    this.getTermList();
    this.Created = "";
    this.warrantyList = warranty_list;
    this.SalesQuoteStatusList = SalesQuote_Status;
    this.QuoteTypeList = Quote_type;
    this.taxType = taxtype;
    this.Shipping = "0";
    this.Discount = "0";
    this.AHFees = "0";
    const years = Number(this.datePipe.transform(this.Currentdate, "yyyy"));
    const Month = Number(this.datePipe.transform(this.Currentdate, "MM"));
    const Day = Number(this.datePipe.transform(this.Currentdate, "dd"));
    this.model.QuoteDate = {
      year: years,
      month: Month,
      day: Day,
    };
    this.IsSOViewEnabled = this.service.permissionCheck(
      "ManageSalesQuotes",
      CONST_VIEW_ACCESS
    );
    this.IsSOAddEnabled = this.service.permissionCheck(
      "ManageSalesQuotes",
      CONST_CREATE_ACCESS
    );
    this.IsSOEditEnabled = this.service.permissionCheck(
      "ManageSalesQuotes",
      CONST_MODIFY_ACCESS
    );
    this.IsSODeleteEnabled = this.service.permissionCheck(
      "ManageSalesQuotes",
      CONST_DELETE_ACCESS
    );
    this.IsSOViewCostEnabled = this.service.permissionCheck(
      "ManageSalesQuotes",
      CONST_VIEW_COST_ACCESS
    );
    this.IsSOPrintPDFEnabled = this.service.permissionCheck(
      "QuotePrintAndPDFExport",
      CONST_VIEW_ACCESS
    );
    this.IsSOEmailEnabled = this.service.permissionCheck(
      "QuoteEmail",
      CONST_VIEW_ACCESS
    );
    this.IsSOExcelEnabled = this.service.permissionCheck(
      "QuoteDownloadExcel",
      CONST_VIEW_ACCESS
    );
    this.IsConvertQuoteToSOEnabled = this.service.permissionCheck(
      "ConvertQuoteToSO",
      CONST_VIEW_ACCESS
    );
    this.IsSONotesEnabled = this.service.permissionCheck(
      "SalesQuoteNotes",
      CONST_VIEW_ACCESS
    );
  }
  getTermList() {
    this.commonService.getHttpService("getTermsList").subscribe(
      (response) => {
        if (response.status == true) {
          this.TermsList = response.responseData;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }
  getAdminSettingsView() {
    var postData = {};
    this.commonService
      .postHttpService(postData, "getSettingsGeneralView")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.settingsView = response.responseData;
            this.TaxPercent = this.settingsView.TaxPercent;
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }
  onExcelData(QuoteId) {
    this.Quote.push({
      QuoteId,
    });
  }
  exportAsXLSX(): void {
    var postData = {
      Quote: this.Quote,
      RRNo: this.RRNo,
      QuoteNo: this.QuoteNo,
      CustomerId: this.CustomerId,
      Description: this.Description,
      QuoteDate: this.QuoteDateDate,
      QuoteDateTo: this.QuoteDateToDate,
      QuoteType: this.QuoteType,
      Status: this.Status,
    };
    this.commonService
      .postHttpService(postData, "getQuotesExportToExcel")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.ExcelData = response.responseData.ExcelData;
            this.generateExcelFormat();
            Swal.fire({
              title: "Success!",
              text: "Excel downloaded Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
            this.reLoad();
          } else {
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
      delete jsonData[i].QuoteId;

      var temparray = [];
      for (var key in obj) {
        var value = obj[key];
        temparray.push(value);
      }
      data.push(temparray);
    }

    //Excel Title, Header, Data
    const title = "Sales Quote";
    const header = [
      "Quote #",
      "Part Description",
      "Serial #",
      "Customer Name",
      "PON",
      "Price",
      "Vendor Name",
      "LLP",
      "Vendor Cost",
      "AH Cost",
      "Comment",
      "Repair Vs New",
    ];
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Data");
    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = {
      name: "Comic Sans MS",
      family: 4,
      size: 16,
      underline: "double",
      bold: true,
    };
    worksheet.addRow([]);
    let subTitleRow = worksheet.addRow([
      "Date : " + this.datePipe.transform(new Date(), "medium"),
    ]);
    // //Add Image
    // let logo = workbook.addImage({
    //   filename: 'assets/images/ah_logo.png',
    //    extension: 'png',
    // });
    // worksheet.addImage(logo, 'E1:F3');
    worksheet.mergeCells("A1:B2");
    //Blank Row
    worksheet.addRow([]);
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
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 35;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 10;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 40;
    worksheet.getColumn(12).width = 20;

    worksheet.addRow([]);
    //Footer Row
    let footerRow = worksheet.addRow(["This is system generated excel sheet."]);
    footerRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCFFE5" },
    };
    footerRow.getCell(1).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:L${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      var currentDate = this.datePipe.transform(
        new Date(),
        "M-d-yyyy hh-mm-ss a"
      );
      var filename = "Sales Quote " + currentDate + ".xlsx";
      fs.saveAs(blob, filename);
    });
  }

  hideAddress: boolean = true;
  generatePDF() {
    this.printComponent.onParentPrintClick();
  }

  generatePrint() {
    this.printComponent.onParentprint();
  }

  QuoteDateToFormat(QuoteDateTo) {
    const QuoteDateToYears = QuoteDateTo.year;
    const QuoteDateToDates = QuoteDateTo.day;
    const QuoteDateTomonths = QuoteDateTo.month;
    let QuoteDateToDate = new Date(
      QuoteDateToYears,
      QuoteDateTomonths - 1,
      QuoteDateToDates
    );
    this.QuoteDateToDate = moment(QuoteDateToDate).format("YYYY-MM-DD");
  }
  QuoteDateFormat(QuoteDate) {
    const QuoteDateYears = QuoteDate.year;
    const QuoteDateDates = QuoteDate.day;
    const QuoteDatemonths = QuoteDate.month;
    let QuoteDateDate = new Date(
      QuoteDateYears,
      QuoteDatemonths - 1,
      QuoteDateDates
    );
    this.QuoteDateDate = moment(QuoteDateDate).format("YYYY-MM-DD");
  }
  onFilter(event) {
    var Customerid = "";
    var CustomerName = "";
    if (
      this.CustomerId == "" ||
      this.CustomerId == undefined ||
      this.CustomerId == null
    ) {
      Customerid = "";
      CustomerName = this.CompanyName;
    } else if (this.CustomerId != "") {
      Customerid = this.CustomerId;
      CustomerName = "";
    }

    var rrid = "";
    var RRNo = "";
    if (this.RRId == "" || this.RRId == undefined || this.RRId == null) {
      rrid = "";
      RRNo = this.RRNo;
    } else if (this.RRId != "") {
      rrid = this.RRId;
      RRNo = "";
    }
    let obj = this;
    var table = $("#datatable-sq").DataTable();
    table.columns(1).search(this.QuoteNo);
    table.columns(2).search(CustomerName);
    table.columns(3).search(this.Status);
    table.columns(4).search(this.DateRequested);
    table.columns(6).search(Customerid);
    table.columns(8).search(this.QuoteType);
    table.columns(7).search(RRNo);
    table.columns(9).search(this.Description);
    table.columns(10).search(this.QuoteDateDate);
    table.columns(11).search(this.QuoteDateToDate);
    table.columns(12).search(rrid);

    table.draw();
    this.showSearch = false;
  }

  onSendEmailofMRO(QuoteId, MROId) {
    this.QuoteList.push({
      QuoteId: QuoteId,
      MROId: MROId,
    });
  }
  onSendEmailofRR(QuoteId, RRId) {
    this.QuoteList.push({
      QuoteId: QuoteId,
      RRId: RRId,
    });
  }

  onSendEmailFromList() {
    if (this.QuoteList.length == "") {
      this.ResponseMessage =
        "Please Select the Below Sales Quote List before Email";
    } else {
      var postData = {
        QuoteList: this.QuoteList,
      };
      this.commonService
        .postHttpService(postData, "SendEmailFromQuotesList")
        .subscribe(
          (response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Success!",
                text: "Email Sent Successfully!",
                type: "success",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
              this.reLoad();
            } else {
              Swal.fire({
                title: "Error!",
                text: "Email could not be Sent!",
                type: "warning",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            }
            this.cd_ref.detectChanges();
          },
          (error) => console.log(error)
        );
    }
  }
  EnableSearch() {
    this.showSearch = true;
  }

  loadTemplate(type, QuoteId, IsDeleted) {
    switch (type) {
      case "view":
        this.spinner.show();

        this.PartItem = [];
        this.TermsName = "";
        this.PON = "";
        this.LPPList = [];
        this.RecommendedPrice = "";
        var postData = {
          QuoteId: QuoteId,
          IsDeleted: IsDeleted,
        };

        this.service.postHttpService(postData, "getSalesQuotesView").subscribe(
          (response) => {
            if (response.status == true) {
              this.result = response.responseData;
              this.SalesQuoteInfo = this.result.BasicInfo[0];
              this.QuoteItem = this.result.QuoteItem;
              this.TermsName = this.SalesQuoteInfo.Terms;
              this.AttachmentList = this.result.AttachmentList;
              this.BillingAddress = this.result.BillingAddress[0] || "";
              this.ShippingAddress = this.result.ShippingAddress[0] || "";
              this.CustomerAddress = this.result.ContactAddress[0] || "";
              this.NotesList = this.result.NotesList;
              this.RRNotesList = this.result.RRNotesList;
              this.RRId = this.SalesQuoteInfo.RRId;
              this.faxCustomerAddress = this.CustomerAddress.Fax;
              this.faxShippingAddress = this.ShippingAddress.Fax;
              this.faxBillingAddress = this.BillingAddress.Fax;
              this.IsRushRepair = this.SalesQuoteInfo.IsRushRepair;
              this.IsWarrantyRecovery = this.SalesQuoteInfo.IsWarrantyRecovery;

              this.QuoteTypeStyle = this.QuoteTypeList.find(
                (a) => a.Quote_TypeId == this.SalesQuoteInfo.QuoteType
              );

              if (this.SalesQuoteInfo.RRId != 0) {
                this.number = this.SalesQuoteInfo.RRNo;
              }
              if (this.SalesQuoteInfo.RRId == 0) {
                this.number = this.SalesQuoteInfo.QuoteNo;
              }
              if (
                this.SalesQuoteInfo.MROId != 0 ||
                this.SalesQuoteInfo.MROId != ""
              ) {
                this.number = this.SalesQuoteInfo.MRONo;
              }
              if (this.IsRushRepair == 1) {
                this.repairMessage = "Rush Repair";
              }
              if (this.IsWarrantyRecovery == 1) {
                this.repairMessage = "Warranty Repair";
              }
              if (this.IsWarrantyRecovery == 2) {
                this.repairMessage = "Warranty New";
              }
              if (this.IsRushRepair == 1 && this.IsWarrantyRecovery == 1) {
                this.repairMessage = "Rush Repair, Warranty Repair";
              }

              this.PhoneCustomerAddress = this.CustomerAddress.Phone;
              this.PhoneShippingAddress = this.ShippingAddress.Phone;
              this.PhoneBillingAddress = this.BillingAddress.Phone;
              this.Quote_notes = Quote_notes;
              this.CustomerBillToId = this.SalesQuoteInfo.CustomerBillToId;
              this.CustomerShipToId = this.SalesQuoteInfo.CustomerShipToId;

              if (!this.IsSOViewCostEnabled) {
                this.SalesQuoteInfo.TotalValue = CONST_COST_HIDE_VALUE;
                this.SalesQuoteInfo.ProcessFee = CONST_COST_HIDE_VALUE;
                this.SalesQuoteInfo.TotalTax = CONST_COST_HIDE_VALUE;
                this.SalesQuoteInfo.Discount = CONST_COST_HIDE_VALUE;
                this.SalesQuoteInfo.ShippingFee = CONST_COST_HIDE_VALUE;
                this.SalesQuoteInfo.GrandTotal = CONST_COST_HIDE_VALUE;
              }

              this.getPON();
            } else {
            }
            this.cd_ref.detectChanges();
            this.spinner.hide();
          },
          (error) => console.log(error)
        );
        this.templateSettings = this.viewTemplate;
        break;
      case "edit":
        this.router.navigate(["/admin/sales-quote/edit"], {
          state: { QuoteId: QuoteId },
        });
        break;
      case "add":
        if (this.Type == "MRO") {
          this.model.QuoteType = "6";
          this.model.CustomerId = null;
          this.model.CompanyName = "";
          this.model.FirstName = "";
          this.model.LastName = "";
          this.model.Email = "";
          this.model.contact_AddressId = null;
          this.model.TermsId = undefined;
          this.model.TaxType = undefined;
          this.model.CustomerBillToId = null;
          this.model.CustomerShipToId = null;
          this.model.QuoteStatus = "3";
          this.SubTotal = "";
          this.TotalTax = "";
          this.GrandTotal = "";
          var item = {
            PartNo: this.TypePartNo,
            PartId: this.TypePartId,
          };
          this.PartItem.push({
            Part: this.TypePartNo,
            PartId: this.TypePartId,
            PartNo: this.TypePartNo,
            PartDescription: "",
            Quantity: "",
            Rate: "",
            Discount: "",
            Tax: "",
            Price: "",
            LeadTime: "",
            WarrantyPeriod: undefined,
            DeliveryDate: "2020-12-23",
            AllowShipment: "",
            Notes: "",
            ItemStatus: "",
            PON: "",
            RecommendedPrice: "",
            LPPList: [],
          });

          this.getPartInfo(this.TypePartItemId, 0);
        } else {
          this.PartItem.push({
            Part: "",
            PartId: "",
            PartNo: "",
            PartDescription: "",
            Quantity: "",
            Rate: "",
            Discount: "",
            Tax: "",
            Price: "",
            LeadTime: "",
            WarrantyPeriod: undefined,
            DeliveryDate: "2020-12-23",
            AllowShipment: "",
            Notes: "",
            ItemStatus: "",
            PON: "",
            RecommendedPrice: "",
            LPPList: [],
          });
          this.model.CustomerId = null;
          this.model.CompanyName = "";
          this.model.FirstName = "";
          this.model.LastName = "";
          this.model.Email = "";
          this.model.contact_AddressId = null;
          this.model.TermsId = undefined;
          this.model.TaxType = undefined;
          this.model.CustomerBillToId = null;
          this.model.CustomerShipToId = null;
          this.model.QuoteStatus = "3";
          this.model.QuoteType = undefined;
          this.SubTotal = "";
          this.TotalTax = "";
          this.GrandTotal = "";
        }
        this.templateSettings = this.addTemplate;
        break;
      default:
        this.templateSettings = this.viewTemplate;
        break;
    }
  }

  onClear(event) {
    var table = $("#datatable-sq").DataTable();
    this.QuoteNo = "";
    this.CompanyName = "";
    this.Status = "";
    this.Created = "";
    this.DateRequested = "";
    this.CustomerId = "";
    this.QuoteType = "";
    this.RRNo = "";
    this.Description = "";
    this.QuoteDate = "";
    this.QuoteDateTo = "";
    this.QuoteDateToDate = "";
    this.QuoteDateDate = "";
    var Customerid = "";
    var CustomerName = "";
    var rrid = "";
    var RRNo = "";
    this.CompanyName = "";
    table.columns(1).search(this.QuoteNo);
    table.columns(2).search(CustomerName);
    table.columns(3).search(this.Status);
    table.columns(4).search(this.DateRequested);
    table.columns(6).search(Customerid);
    table.columns(8).search(this.QuoteType);
    table.columns(7).search(RRNo);
    table.columns(9).search(this.Description);
    table.columns(10).search(this.QuoteDateDate);
    table.columns(11).search(this.QuoteDateToDate);
    table.columns(12).search(rrid);
    table.draw();
    this.showSearch = false;
    this.CustomerId = null;
    this.QuoteType = undefined;
    this.Status = undefined;

    this.reLoad();
  }
  getPartInfo(PartItemId, i) {
    var postData = { PartItemId: PartItemId };
    this.commonService
      .postHttpService(postData, "getPartItemView")
      .subscribe((response) => {
        (this.PartItem[i].PartId = response.responseData[0].PartId),
          (this.PartItem[i].PartNo = response.responseData[0].PartNo),
          (this.PartItem[i].PartDescription =
            response.responseData[0].Description),
          (this.PartItem[i].Quantity = response.responseData[0].Quantity),
          (this.PartItem[i].Rate = response.responseData[0].SellingPrice);
        (this.PartItem[i].Price = response.responseData[0].Price),
          (this.PartItem[i].DeliveryDate = "2020-12-24");
      });

    //GetPON
    var postData1 = {
      PartId: this.TypePartId,
      CustomerId: this.model.CustomerId,
    };
    this.commonService
      .postHttpService(postData1, "getPON&LPP")
      .subscribe((response) => {
        this.PartItem[i].PON = response.responseData.PartInfo.PON || "";
        this.PartItem[i].LPPList = response.responseData.LPPInfo || [];
        this.PartItem[i].RecommendedPrice =
          response.responseData.RecommendedPrice.RecommendedPrice || "";
      });
  }
  getCustomerList() {
    this.service
      .getHttpService("getCustomerListDropdown")
      .subscribe((response) => {
        this.customerInfo = response.responseData;
        this.customerList = response.responseData.map(function (value) {
          return { title: value.CompanyName, CustomerId: value.CustomerId };
        });
      });
  }

  onDelete(QuoteId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          QuoteId: QuoteId,
        };
        this.service
          .postHttpService(postData, "DeleteQuote")
          .subscribe((response) => {
            if (response.IsException == null) {
              Swal.fire({
                title: "Deleted!",
                text: "Quotes record has been deleted.",
                type: "success",
              });

              // Reload the table
              var table = $("#datatable-sq").DataTable();
              table.draw();
            } else if (
              // Read more about handling dismissals
              result.dismiss === Swal.DismissReason.cancel
            ) {
              Swal.fire({
                title: "Cancelled",
                text: "Quotes is safe :)",
                type: "error",
              });
            }
          });
      }
    });
  }

  backToRRView() {
    this.router.navigate(["/admin/repair-request/edit"], {
      state: { RRId: this.SalesQuoteInfo.RRId },
    });
  }

  AddItem() {
    this.PartItem.push({
      Part: "",
      PartId: "",
      PartNo: "",
      PartDescription: "",
      Quantity: "",
      Rate: "",
      Discount: "",
      Tax: "",
      Price: "",
      LeadTime: "",
      WarrantyPeriod: undefined,
      DeliveryDate: "2020-12-23",
      AllowShipment: "",
      Notes: "",
      ItemStatus: "",

      PON: "",
      RecommendedPrice: "",
      LPPList: [],
    });
  }

  removePartItem(i) {
    this.PartItem.splice(i, 1);
    this.changeStatus(i);
  }

  changeStatus(index) {
    var subTotal = 0;
    // Calculate the subtotal
    for (let i = 0; i < this.PartItem.length; i++) {
      subTotal += this.PartItem[i].Price;
    }
    this.SubTotal = subTotal;
    this.TotalTax = (this.SubTotal * this.TaxPercent) / 100;
    this.calculateTotal();
  }

  calculatePrice(index) {
    var price = 0;
    var subTotal = 0;
    let Quantity = this.PartItem[index].Quantity || 0;
    let Rate = this.PartItem[index].Rate || 0;

    // Calculate the price
    price = parseFloat(Quantity) * parseFloat(Rate);
    this.PartItem[index].Price = price;

    for (let i = 0; i < this.PartItem.length; i++) {
      subTotal += this.PartItem[i].Price;
    }
    //Calculate the subtotal
    this.SubTotal = subTotal;

    let SaveAmount = this.PartItem[index].PON - Rate;

    this.PartItem[index].SaveAmount = SaveAmount;
    this.PartItem[index].NewPricePercent =
      (Rate / this.PartItem[index].PON) * 100;

    this.TotalTax = (this.SubTotal * this.TaxPercent) / 100;
    this.calculateTotal();
  }

  calculateTax() {
    this.TotalTax = (this.SubTotal * this.TaxPercent) / 100;
    this.calculateTotal();
  }

  calculateTotal() {
    var total = 0;
    let AdditionalCharge = this.AHFees || 0;
    let Shipping = this.Shipping || 0;
    let Discount = this.Discount || 0;

    total =
      parseFloat(this.SubTotal) +
      parseFloat(this.TotalTax) +
      parseFloat(AdditionalCharge) +
      parseFloat(Shipping) -
      parseFloat(Discount);
    this.GrandTotal = parseFloat(total.toFixed(2));
  }

  getCustomerProperties(CustomerId) {
    if (CustomerId == null || CustomerId == "" || CustomerId == 0) {
      return false;
    }
    var postData = { CustomerId: CustomerId };

    var postData1 = {
      IdentityId: CustomerId,
      IdentityType: 1,
      Type: CONST_BillAddressType,
    };
    //CustomerAddressLoad
    this.commonService
      .postHttpService(postData1, "getAddressList")
      .subscribe((response) => {
        this.AddressList = response.responseData;
        this.customerAddressList = response.responseData.map(function (value) {
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

        let obj = this;
        //BillingAddress
        var BillingAddress = obj.AddressList.filter(function (value) {
          if (value.IsBillingAddress == 1) {
            return value.AddressId;
          }
        }, obj);
        this.model.CustomerBillToId = BillingAddress[0].AddressId;

        //CustomerInfo;
        var info = obj.customerInfo.filter(function (value) {
          if (value.CustomerId == CustomerId) {
            return value;
          }
        }, obj);
        this.model.CompanyName = info[0].CompanyName;
        this.model.FirstName = info[0].FirstName;
        this.model.LastName = info[0].LastName;
        this.model.TaxType = info[0].TaxType;
        this.model.TermsId = info[0].TermsId;
        this.model.Email = info[0].Email;
      });
    var postData2 = {
      IdentityId: CustomerId,
      IdentityType: 1,
      Type: CONST_ShipAddressType,
    };
    //CustomerAddressLoad
    this.commonService
      .postHttpService(postData2, "getAddressList")
      .subscribe((response) => {
        this.AddressList = response.responseData;
        this.customerAddressList = response.responseData.map(function (value) {
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

        //shippingAddress
        let obj = this;
        var ShippingAddress = obj.AddressList.filter(function (value) {
          if (value.IsShippingAddress == 1) {
            return value.AddressId;
          }
        }, obj);
        this.model.CustomerShipToId = ShippingAddress[0].AddressId;
      });

    var postData3 = {
      IdentityId: CustomerId,
      IdentityType: 1,
      Type: CONST_ContactAddressType,
    };
    //CustomerAddressLoad
    this.commonService
      .postHttpService(postData3, "getAddressList")
      .subscribe((response) => {
        this.AddressList = response.responseData;
        this.customerAddressList = response.responseData.map(function (value) {
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
        //ContactAddress
        let obj = this;
        var ContactAddress = obj.AddressList.filter(function (value) {
          if (value.IsContactAddress == 1) {
            return value.AddressId;
          }
        }, obj);
        this.model.contact_AddressId = ContactAddress[0].AddressId;
      });
  }

  selectEvent(item, i) {
    this.PartId = item.PartId;
    var postData = { PartId: item.PartId };
    this.commonService
      .postHttpService(postData, "getPartDetails")
      .subscribe((response) => {
        (this.PartItem[i].PartId = response.responseData[0].PartId),
          (this.PartItem[i].PartNo = response.responseData[0].PartNo),
          (this.PartItem[i].PartDescription =
            response.responseData[0].Description),
          (this.PartItem[i].Quantity = response.responseData[0].Quantity),
          (this.PartItem[i].Rate = response.responseData[0].Price);
        this.calculatePrice(i);
      });

    //GetPON
    var postData1 = {
      PartId: item.PartId,
      CustomerId: this.model.CustomerId,
    };
    this.commonService
      .postHttpService(postData1, "getPON&LPP")
      .subscribe((response) => {
        this.PartItem[i].PON = response.responseData.PartInfo.PON || "";
        this.PartItem[i].LPPList = response.responseData.LPPInfo || [];
        this.PartItem[i].RecommendedPrice =
          response.responseData.RecommendedPrice.RecommendedPrice || "";
      });
  }

  onChangeSearch(val: string, i) {
    if (val) {
      this.isLoading = true;
      var postData = {
        PartNo: val,
      };
      this.commonService
        .postHttpService(postData, "getonSearchPartByPartNo")
        .subscribe(
          (response) => {
            if (response.status == true) {
              this.data = response.responseData;
              this.filteredData = this.data.filter((a) =>
                a.PartNo.toLowerCase().includes(val.toLowerCase())
              );
            } else {
            }
            this.isLoading = false;
            this.cd_ref.detectChanges();
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
          }
        );
    }
  }

  onFocused(e, i) {
    // do something when input is focused
  }

  getPON() {
    for (let x in this.QuoteItem) {
      if (!this.IsSOViewCostEnabled) {
        this.QuoteItem[x].Rate = CONST_COST_HIDE_VALUE;
        this.QuoteItem[x].Price = CONST_COST_HIDE_VALUE;
      }

      this.PartId = this.QuoteItem[x].PartId;
      var postData1 = {
        PartId: this.PartId,
        CustomerId: this.SalesQuoteInfo.IdentityId,
      };
      this.commonService
        .postHttpService(postData1, "getPON&LPP")
        .subscribe((response) => {
          if (response.status == true) {
            this.QuoteItem[x].PON = response.responseData.PartInfo.PON || "";
            this.QuoteItem[x].LPPList = response.responseData.LPPInfo || [];
            this.QuoteItem[x].RecommendedPrice =
              response.responseData.RecommendedPrice.RecommendedPrice || "";
          } else {
            this.QuoteItem[x].PON = "";
            this.QuoteItem[x].LPPList = [];
            this.QuoteItem[x].RecommendedPrice = "";
          }
        });
    }
  }
  ConvertSO() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Convert it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          RRId: this.RRId,
          CustomerShipToId: this.CustomerShipToId,
          CustomerBillToId: this.CustomerBillToId,
          CustomerId: this.CustomerId,
          QuoteId: this.QuoteId,
        };
        this.commonService
          .postHttpService(postData, "AutoCreateSO")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Convert To SO!",
                text: "Quotes has been Convert To SO.",
                type: "success",
              });
              this.reLoad();
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Quotes  has not Convert To SO.",
          type: "error",
        });
      }
    });
  }
  ConvertSONonRR() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Convert it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var RRId = this.RRId;
        var CustomerId = this.SalesQuoteInfo.IdentityId;
        var QuoteId = this.QuoteId;
        var GrandTotal = this.SalesQuoteInfo.GrandTotal.toFixed(2);
        var CustomerShipToId = this.CustomerShipToId;
        var CustomerBillToId = this.CustomerBillToId;
        var CurrencySymbol = this.SalesQuoteInfo.CurrencySymbol;
        var ExchangeRate = this.SalesQuoteInfo.ExchangeRate;
        var LocalCurrencyCode = this.SalesQuoteInfo.LocalCurrencyCode;
        this.modalRef = this.CommonmodalService.show(BlanketPoNonRrComponent, {
          backdrop: "static",
          ignoreBackdropClick: false,
          initialState: {
            data: {
              RRId,
              QuoteId,
              CustomerId,
              GrandTotal,
              CustomerShipToId,
              CustomerBillToId,
              CurrencySymbol,
              ExchangeRate,
              LocalCurrencyCode,
            },
            class: "modal-lg",
          },
          class: "gray modal-lg",
        });

        this.modalRef.content.closeBtnName = "Close";

        this.modalRef.content.event.subscribe((res) => {
          this.reLoad();
        });

        // var postData = {
        //   "RRId": this.RRId, "CustomerId": this.CustomerId, "QuoteId": this.QuoteId  ,"CustomerShipToId" = this.CustomerShipToId, "CustomerBillToId" = this.CustomerBillToId
        // }
        // this.commonService.postHttpService(postData, 'AutoCreateSO').subscribe(response => {
        //   if (response.status == true) {
        //     Swal.fire({
        //       title: 'Convert To SO!',
        //       text: 'Quotes has been Convert To SO.',
        //       type: 'success'
        //     });
        //     this.reLoad();
        //   }
        // });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Quotes  has not Convert To SO.",
          type: "error",
        });
      }
    });
  }

  reLoad() {
    this.router.navigate([this.currentRouter.split("?")[0]], {
      queryParams: { QuoteId: this.QuoteId },
    });
  }
  onSubmit(f: NgForm) {
    this.submitted = true;

    //quoteDate
    const reqYears = this.model.QuoteDate.year;
    const reqDates = this.model.QuoteDate.day;
    const reqmonths = this.model.QuoteDate.month;
    let requestDates = new Date(reqYears, reqmonths - 1, reqDates);
    let DateRequested = moment(requestDates).format("YYYY-MM-DD");

    if (f.valid) {
      this.btnDisabled = true;
      var postData = {
        QuoteType: this.model.QuoteType,
        RRId: "0",
        RRNo: "0",
        IdentityType: "1",
        IdentityId: this.model.CustomerId,
        Description: this.model.Description,
        QuoteDate: DateRequested,
        CompanyName: this.model.CompanyName,
        FirstName: this.model.FirstName,
        LastName: this.model.LastName,
        Email: this.model.Email,
        TaxType: this.model.TaxType,
        TermsId: this.model.TermsId,
        Notes: this.model.Notes,
        AddressId: this.model.contact_AddressId,
        CustomerShipToId: this.model.CustomerShipToId,
        CustomerBillToId: this.model.CustomerBillToId,
        TotalValue: this.SubTotal,
        ProcessFee: this.AHFees,
        TotalTax: this.TotalTax,
        Discount: this.Discount,
        ShippingFee: this.Shipping,
        TaxPercent: this.TaxPercent,
        GrandTotal: this.GrandTotal,
        Status: this.model.QuoteStatus,

        QuoteItem: this.PartItem,
      };
      this.commonService.postHttpService(postData, "QuotesCreate").subscribe(
        (response) => {
          if (response.status == true) {
            this.templateSettings = this.viewTemplate;

            Swal.fire({
              title: "Success!",
              text: "Sales Quotes Created Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
            this.reLoad();
          } else {
            Swal.fire({
              title: "Error!",
              text: "Sales Quotes could not be Created!",
              type: "warning",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
    } else {
      Swal.fire({
        type: "error",
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }

  //Email
  QuoteEmail() {
    this.printComponent.onParentEmailClick((pdfBase64) => {
      if (this.SalesQuoteInfo.RRId != 0) {
        var fileName = `Repair Quote ${this.number}.pdf`;
      } else {
        var fileName = `Sales Quote ${this.number}.pdf`;
      }
      var RRId = this.RRId;
      var IdentityId = this.QuoteId;
      var IdentityType = CONST_IDENTITY_TYPE_QUOTE;
      var followupName = "Quotes";
      var ImportedAttachment = {
        path: `data:application/pdf;filename=generated.pdf;base64,${pdfBase64}`,
        filename: fileName,
      };
      this.modalRef = this.CommonmodalService.show(EmailComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: {
            followupName,
            IdentityId,
            IdentityType,
            RRId,
            ImportedAttachment,
          },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";

      this.modalRef.content.event.subscribe((res) => {
        this.reLoad();
      });
    });
  }

  DeleteQuote() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          QuoteId: this.QuoteId,
        };
        this.commonService
          .postHttpService(postData, "DeleteQuote")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "Sales Quotes has been deleted.",
                type: "success",
              });
              this.router.navigate(["/admin/Quotes-List"]);
            } else {
              Swal.fire({
                title: "Info!",
                text: response.message,
                type: "info",
              });
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Sales Quotes is safe:)",
          type: "error",
        });
      }
    });
  }
  ngOnDestroy() {
    this.Type = "";
  }

  onbackToList() {
    this.navCtrl.navigate("admin/Quotes-List");
  }

  //AutoComplete for RR
  selectRREvent($event) {
    this.RRId = $event.RRId;
  }

  onChangeRRSearch(val: string) {
    if (val) {
      this.isLoadingRR = true;
      var postData = {
        RRNo: val,
      };
      this.service.postHttpService(postData, "RRNoAotoSuggest").subscribe(
        (response) => {
          if (response.status == true) {
            var data = response.responseData;
            this.RRList = data.filter((a) =>
              a.RRNo.toLowerCase().includes(val.toLowerCase())
            );
          } else {
          }
          this.isLoadingRR = false;
          this.cd_ref.detectChanges();
        },
        (error) => {
          console.log(error);
          this.isLoadingRR = false;
        }
      );
    }
  }
  //AutoComplete for customer
  selectCustomerEvent($event) {
    this.CustomerId = $event.CustomerId;
  }

  onChangeCustomerSearch(val: string) {
    if (val) {
      this.isLoadingCustomer = true;
      var postData = {
        Customer: val,
      };
      this.service.postHttpService(postData, "getAllAutoComplete").subscribe(
        (response) => {
          if (response.status == true) {
            var data = response.responseData;
            this.customerList = data.filter((a) =>
              a.CompanyName.toLowerCase().includes(val.toLowerCase())
            );
          } else {
          }
          this.isLoadingCustomer = false;
          this.cd_ref.detectChanges();
        },
        (error) => {
          console.log(error);
          this.isLoadingCustomer = false;
        }
      );
    }
  }
}
