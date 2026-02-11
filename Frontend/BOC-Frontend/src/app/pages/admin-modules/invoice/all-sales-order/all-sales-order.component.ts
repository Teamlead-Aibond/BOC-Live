/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, Input, TemplateRef, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import {
  SalesOrder_Status, SalesOrder_Type, warranty_list, SalesOrder_notes, CONST_IDENTITY_TYPE_SO,
  CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, attachment_thumb_images, CONST_ShipAddressType, CONST_BillAddressType, CONST_ContactAddressType, Const_Alert_pop_title, Const_Alert_pop_message
} from 'src/assets/data/dropdown';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddRrPartsComponent } from '../../common-template/add-rr-parts/add-rr-parts.component';
import Swal from 'sweetalert2';
import { timingSafeEqual } from 'crypto';
import { runInThisContext } from 'vm';
import { DatePipe } from '@angular/common';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { EmailComponent } from '../../common-template/email/email.component';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { NgForm } from '@angular/forms';
import { SalesOrderPrintComponent } from '../../common-template/sales-order-print/sales-order-print.component';
import { CustomerReferenceComponent } from '../../common-template/customer-reference/customer-reference.component';
@Component({
  selector: 'app-all-sales-order',
  templateUrl: './all-sales-order.component.html',
  styleUrls: ['./all-sales-order.component.scss'],
  providers: [
    NgxSpinnerService, DatePipe

  ],
})
export class AllSalesOrderComponent implements OnInit {
  keywordForCustomer = 'CompanyName';
  customerList: any = [];
  isLoadingCustomer: boolean = false;
  CompanyName;
  keywordForRR = 'RRNo';
  RRList: any[]
  RRId = ''
  isLoadingRR: boolean = false;
  baseUrl = `${environment.api.apiURL}`;
  Currentdate = new Date();
  showSearch: boolean = true;
  SalesOrder: any = [];
  ExcelData: any = [];

  CustomerList: any = []; ShippingAddressList: any = []; BillingAddressList: any = [];
  ShipAddress: any = []; BillAddress: any = []
  @Input() templateSettings: TemplateRef<HTMLElement>;
  @ViewChild('viewTemplate', null) viewTemplate: TemplateRef<HTMLElement>;
  @ViewChild('editTemplate', null) editTemplate: TemplateRef<HTMLElement>;
  @ViewChild('addTemplate', null) addTemplate: TemplateRef<HTMLElement>;
  @ViewChild(SalesOrderPrintComponent, null) printComponent: SalesOrderPrintComponent;
  dataTableMessage;
  tableData: any = [];
  BillCode;
  ShipCode;
  Warehouse;
  Facility
  SONo;
  result;
  SOId;
  WarehouseId;
  SOTypeStyle;
  //ServerSide List
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  api_check: any;
  dataTable: any;
  SalesOrderInfo;
  BillingAddress;
  ShippingAddress;
  faxBillingAddress;
  faxShippingAddress;
  PhoneBillingAddress;
  PhoneShippingAddress
  SalesOrderCustomerRef: any = [];;
  SalesOrderItem: any = [];
  NotesList: any = [];
  RRNotesList: any = [];

  SalesOrderType;
  adminList;
  //FILTER
  Created;
  CustomerId;
  Status;
  SalesOrderStatus;
  DateRequested;
  SOType;
  RRNo;
  QuoteNo;
  UserId;
  CustomerPONo;
  ReferenceNO;
  Requesteddate;
  RequestedDateTo;
  Duedate;
  DueDateTo;
  RequesteddateDate;
  RequestedDateToDate;
  DuedateDate;
  DueDateToDate;
  RequestedId;
  Billingaddress
  //ADD
  model: any = [];
  number;
  partList: any = [];
  customerPartList: any = [];
  partNewList: any = [];
  countryList: any = [];
  sh_StateList: any = [];
  bi_StateList: any = [];
  AddressList: any = [];
  AttachmentList: any = []
  customerAddressList: any = [];
  CustomerRef: any = [];
  PartItem: any = [];
  ResponseMessage;
  warrantyList: any = [];
  SalesOrder_notes;
  ManufacturerPartNo: any;
  Description: any;
  Manufacturer: any;
  SerialNo: any;
  Quantity: any;
  PartNo: any;
  Price: any;
  PON;
  LPP;
  PartId;
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

  //billingAddress
  bi_BillCodeId;
  bi_street_address;
  bi_city;
  bi_StateId;
  bi_zip;
  bi_BillName;
  bi_CountryId
  bi_SuiteOrApt
  bi_AllowShipment;
  bi_CountryName
  bi_StateName

  //shippingAddress
  sh_street_address;
  sh_city;
  sh_StateId;
  sh_zip;
  sh_CountryId;
  sh_AllowShipment;
  sh_ShipCodeId;
  sh_SuiteOrApt;
  sh_ShipName;
  sh_CountryName;
  sh_StateName
  ShipAddressBookId;
  IsConvertedToPO;
  BillAddressBookId
  DueDate;
  ReferenceNo;
  Notes;
  RequestedDate;
  SoStatus;
  TaxType;

  customerReferenceList;
  @Input() dateFilterField;
  @ViewChild('dataTable', { static: true }) table;
  IsRushRepair;
  IsWarrantyRecovery;
  repairMessage;
  SOList: any = [];
  btnDisabled: boolean = false;



  keyword = 'PartNo';
  filteredData: any[];
  data = [];
  isLoading = false;
  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;
  IsPrintPDFEnabled;
  IsEmailEnabled;
  IsExcelEnabled;
  IsConvertSOToInvoiceEnabled;
  IsNotesEnabled;
  IsApproveEnabled;
  settingsView;
  attachmentThumb;
  IsRevertInvoiceEnabled;
  warehouseList: any = []
  ListHidden: boolean = false;
  showList: boolean = true;
  IsDeleted: string;
  IsCancelSOEnabled: boolean = false
  constructor(private http: HttpClient, public router: Router, public navCtrl: NgxNavigationWithDataComponent,
    private spinner: NgxSpinnerService, private modalService: NgbModal, private commonService: CommonService, private cd_ref: ChangeDetectorRef,
    private CommonmodalService: BsModalService, private route: ActivatedRoute,
    public modalRef: BsModalRef, private datePipe: DatePipe,) { }
  currentRouter = decodeURIComponent(this.router.url);

  ngOnInit() {
    document.title = 'SO View'

    if (history.state.SOId == undefined) {
      this.route.queryParams.subscribe(
        params => {
          this.SOId = params['SOId'];
          //this.showList = params['showList'] == 1;
          this.IsDeleted = params['IsDeleted']

        }
      )
    }
    else if (history.state.SOId != undefined) {
      this.SOId = history.state.SOId
    }

    const { SOId, showList, IsDeleted } = history.state;
    //this.showList = showList;
    //this.IsDeleted = IsDeleted;

    // this.SOId = this.navCtrl.get('SOId');
    // this.showList = this.navCtrl.get('showList');
    // this.IsDeleted = this.navCtrl.get('IsDeleted');

    // if (this.showList == true) {
    // this.ListHidden = false
    this.loadTemplate('view', this.SOId, this.IsDeleted)

    // }
    // else {
    //   this.ListHidden = true;
    //   const httpOptions = {
    //     headers: new HttpHeaders({
    //       'Content-Type': 'application/json',
    //       'Authorization': `${localStorage.getItem("Access-Token")}`
    //     })
    //   };

    //   var url = this.baseUrl + '/api/v1.0/SalesOrder/getSaleListByServerSide';
    //   const that = this;
    //   var filterData = {}




    //   this.dtOptions = {
    //     dom: '<"row"<"col-12 col-sm-12 col-md-12 col-xl-12"B> <"col-12 col-sm-12 col-md-12 col-xl-12 aso"f>>rt<" row"<"help-block col-12 col-sm-6 col-md-6 col-xl-6"l><"col-12 col-sm-6 col-md-6 col-xl-6"i><"col-12 col-sm-12 col-md-12 col-xl-12"p>>',
    //     pagingType: 'full_numbers',
    //     pageLength: 10,
    //     lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
    //     processing: true,
    //     serverSide: true,
    //     searching: true,

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
    //           if (this.SOId == undefined) {
    //             this.SOId = resp.responseData.data[0].SOId;
    //             // this.router.navigate(['admin/orders/sales-list'], { queryParams:{SOId: this.SOId} });

    //           }
    //           else if (this.SOId == null) {
    //             this.SOId = resp.responseData.data[0].SOId;
    //             //this.router.navigate(['admin/orders/sales-list'], { queryParams:{SOId: this.SOId} });

    //           }
    //           this.loadTemplate('view', this.SOId, this.IsDeleted)
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
    //       {
    //         "targets": [13],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [14],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [15],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [16],
    //         "visible": false,
    //         "searchable": true
    //       },
    //       {
    //         "targets": [17],
    //         "visible": false,
    //         "searchable": true
    //       },

    //     ],
    //     createdRow: function (row, data, index) {



    //     },
    //     columns: [
    //       {
    //         data: 'SOId', name: 'SOId', defaultContent: '', orderable: true, searchable: true,
    //         render: (data: any, type: any, row: any, meta) => {
    //           var cstyle = '';
    //           switch (row.Status) {
    //             case 1: { cstyle = 'badge-warning'; status = "Open"; break; }
    //             case 2: { cstyle = 'badge-success'; status = "Approved"; break; }
    //             case 3: { cstyle = 'badge-danger'; status = "Cancelled"; break; }
    //             case 4: { cstyle = 'badge-light'; status = "On Hold"; break; }
    //             case 5: { cstyle = 'badge-info'; status = "Draft"; break; }

    //             default: { cstyle = ''; status = ""; break; }
    //           }
    //           var cstylealgin = 'float:right'
    //           var sostyles = 'background:#ececec!important;color:#333;padding:1px 5px;margin-right:8px;'

    //           var number = '';
    //           if (row.RRNo != '' && row.RRNo != '0' && row.RRNo != null) {
    //             number = row.RRNo;
    //           } else if (row.MRONo != '' && row.MRONo != '0' && row.MRONo != null) {
    //             number = row.MRONo;
    //           }
    //           else if (row.MRONo == '' || row.MRONo == '0' && row.MRONo == null || row.RRNo == '' || row.RRNo == '0' || row.RRNo == null) {
    //             number = row.SONo;
    //           }

    //           var IsEmailSent = '';
    //           if (row.IsEmailSent) {
    //             IsEmailSent = '<i  class="mdi mdi-email-outline red mailsent"></i>';
    //           }

    //           var Difference_In_Days = row.DueDateDiff;
    //           var daystext = '-';
    //           if ((row.Status == 1 || row.Status == 5 || row.Status == 4)) {
    //             if (Difference_In_Days < 0) {
    //               daystext = '<span class="badge badge-light-danger">Due Date Passed</span>';
    //             } else if (Difference_In_Days == 0) {
    //               daystext = '<span class="badge badge-light-pink">Due Today</span>';
    //             } else if (Difference_In_Days == 1) {
    //               daystext = '<span class="badge badge-light-dark">Due in 1 day</span>';
    //             } else if (Difference_In_Days == 2) {
    //               daystext = '<span class="badge badge-light-dark">Due in 2 days</span>';
    //             } else {
    //               daystext = '<span class="badge badge-light-primary">Due in ' + Difference_In_Days + ' days</span>';
    //             }
    //           }

    //           var checkbox = '';
    //           // if (row.Status == 1 || row.Status == 4) {
    //           checkbox = '<input type="checkbox"  class="checkbox">&nbsp;';
    //           // }
    //           if (!this.IsViewCostEnabled) {
    //             row.GrandTotal = CONST_COST_HIDE_VALUE;
    //           }
    //           return '<p>' + checkbox + row.CompanyName + `<span style="float:right;">$${row.GrandTotal}</span>` + '</p><a style="cursor:pointer" class="IDHREF"><span style="background:#ececec;padding:1px 5px;margin-right:2px;" >#' + number + '</span></a>&nbsp;|&nbsp;<span class="order-date">' + row.DateRequested + '</span> <span style="float:right" class="badge ' + cstyle + ' btn-xs">' + status + '</span><br><span class="pink" style="padding:1px 5px;margin-right:2px;">' + row.DueDate + '</span>&nbsp;|&nbsp; ' + daystext + '  <span style="float:right" class="btn-xs" ngbTooltip="Email Sent">' + IsEmailSent + '</span> </a>';


    //         },
    //       },
    //       { data: 'SONo', name: 'SONo', orderable: true, searchable: true, },
    //       { data: 'CompanyName', name: 'CompanyName', orderable: true, searchable: true, },
    //       { data: 'Status', name: 'Status', orderable: true, searchable: true, },
    //       { data: 'DateRequested', name: 'DateRequested', orderable: true, searchable: true, },
    //       { data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true, },
    //       { data: 'CustomerId', name: 'CustomerId', orderable: true, searchable: true, },
    //       { data: 'RRNo', name: 'RRNo', orderable: true, searchable: true, },
    //       { data: 'SOType', name: 'SOType', orderable: true, searchable: true, },
    //       { data: 'QuoteNo', name: 'QuoteNo', orderable: true, searchable: true, },
    //       { data: 'RequestedById', name: 'RequestedById', orderable: true, searchable: true, },
    //       { data: 'ApprovedById', name: 'ApprovedById', orderable: true, searchable: true, },
    //       { data: 'CustomerPONo', name: 'CustomerPONo', orderable: true, searchable: true, },
    //       { data: 'ReferenceNo', name: 'ReferenceNo', orderable: true, searchable: true, },
    //       { data: 'DueDateTo', name: 'DueDateTo', orderable: true, searchable: true, },
    //       { data: 'DueDate', name: 'DueDate', orderable: true, searchable: true, },
    //       { data: 'DateRequestedTo', name: 'DateRequestedTo', orderable: true, searchable: true, },
    //       { data: 'RRId', name: 'RRId', orderable: true, searchable: true, },


    //     ],
    //     rowCallback: (row: Node, data: any | Object, index: number) => {
    //       $('.IDHREF', row).unbind('click');
    //       $('.IDHREF', row).bind('click', (e) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         //this.router.navigate(['admin/orders/sales-list'], { queryParams:{SOId: data.SOId} });
    //         this.loadTemplate("view", data.SOId, this.IsDeleted);
    //         this.SOId = data.SOId
    //       });

    //       $('.checkbox', row).unbind('click');
    //       $('.checkbox', row).bind('click', (e) => {
    //         this.onExcelData(data.SOId)

    //         if (data.RRNo != '' && data.RRNo != '0' && data.RRNo != null) {
    //           this.onSendEmailofRR(data.SOId, data.RRId)
    //         } else if (data.MRONo != '' && data.MRONo != '0' && data.MRONo != null) {
    //           this.onSendEmailofMRO(data.SOId, data.MROId)

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

    //   this.dataTable = $('#datatable-angular');
    //   this.dataTable.DataTable(this.dtOptions);

    // }

    this.settingsView = ""
    this.SOTypeStyle = ""
    this.Billingaddress = ""
    this.getAdminSettingsView();
    this.attachmentThumb = attachment_thumb_images;

    this.SalesOrderInfo = ""
    this.SalesOrderItem = [];
    this.NotesList = [];
    this.RRNotesList = [];
    this.BillingAddress = "";
    this.ShippingAddress = "";
    this.AttachmentList = [];
    this.SalesOrderCustomerRef = [];
    this.getCustomerList();
    this.getCountryList();
    this.getAdminList();
    this.getWarehouseList();
    this.SalesOrderStatus = SalesOrder_Status;
    this.SalesOrderType = SalesOrder_Type;
    this.warrantyList = warranty_list;
    this.Created = "";
    this.Shipping = "0";
    this.Discount = "0";
    this.AHFees = "0";

    this.IsViewEnabled = this.commonService.permissionCheck("ManageSalesOrder", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.commonService.permissionCheck("ManageSalesOrder", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.commonService.permissionCheck("ManageSalesOrder", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.commonService.permissionCheck("ManageSalesOrder", CONST_DELETE_ACCESS);
    this.IsViewCostEnabled = this.commonService.permissionCheck("ManageSalesOrder", CONST_VIEW_COST_ACCESS);
    this.IsPrintPDFEnabled = this.commonService.permissionCheck("SOPrintAndPDFExport", CONST_VIEW_ACCESS);
    this.IsEmailEnabled = this.commonService.permissionCheck("SOEmail", CONST_VIEW_ACCESS);
    this.IsExcelEnabled = this.commonService.permissionCheck("SODownloadExcel", CONST_VIEW_ACCESS);
    this.IsConvertSOToInvoiceEnabled = this.commonService.permissionCheck("ConvertSOToInvoice", CONST_VIEW_ACCESS);
    this.IsNotesEnabled = this.commonService.permissionCheck("SONotes", CONST_VIEW_ACCESS);
    this.IsApproveEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_APPROVE_ACCESS);
    this.IsRevertInvoiceEnabled = this.commonService.permissionCheck("RevertInvoice", CONST_VIEW_ACCESS);
    this.IsCancelSOEnabled = this.commonService.permissionCheck("CancelSalesOrder", CONST_VIEW_ACCESS);





    this.Facility = [
      { FacilityId: 1, FacilityCode: 'American Hydrostatic' },
      { FacilityId: 2, FacilityCode: 'AH - Canada' },
    ]


  }
  getWarehouseList() {
    this.commonService.getHttpService('getWarehouseList').subscribe(response => {
      this.warehouseList = response.responseData;
    });
  }
  getAdminSettingsView() {
    var postData = {}
    this.commonService.postHttpService(postData, "getSettingsGeneralView").subscribe(response => {
      if (response.status == true) {
        this.settingsView = response.responseData;
        this.TaxPercent = this.settingsView.TaxPercent

      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  onExcelData(SOId) {
    this.SalesOrder.push({
      SOId
    })
  }
  exportAsXLSX(): void {
    var postData = {
      "SalesOrder": this.SalesOrder,
      "RRNo": this.RRNo,
      "SONo": this.SONo,
      "CustomerId": this.CustomerId,
      "QuoteNo": this.QuoteNo,
      "RequestedById": this.RequestedId,
      "ApprovedById": this.UserId,
      "CustomerPONo": this.CustomerPONo,
      "ReferenceNo": this.ReferenceNO,
      "DateRequested": this.RequesteddateDate,
      "DateRequestedTo": this.RequestedDateToDate,
      "DueDate": this.DuedateDate,
      "DueDateTo": this.DueDateToDate,
      "SOType": this.SOType

    }
    this.commonService.postHttpService(postData, "getSOExportToExcel").subscribe(response => {
      if (response.status == true) {
        this.ExcelData = response.responseData.ExcelData;
        this.generateExcelFormat();
        Swal.fire({
          title: 'Success!',
          text: 'Excel downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
        this.reLoad();
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
    const title = 'Sales Order';
    const header = ["RR #", "SO #", "Customer Name", "Quote #", "Requested By Name", "Approved By Name", "Customer PO No", "Reference No", "Date Requested", "Due Date", "Grand Total", "Status", "SO Type"]
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Data');
    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true }
    worksheet.addRow([]);
    let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')])
    // //Add Image
    // let logo = workbook.addImage({
    //   filename: 'assets/images/ah_logo.png', 
    //    extension: 'png',
    // });
    // worksheet.addImage(logo, 'E1:F3');
    worksheet.mergeCells('A1:B2');
    //Blank Row 
    worksheet.addRow([]);
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
    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 15;
    worksheet.getColumn(12).width = 20;
    worksheet.getColumn(13).width = 15;
    worksheet.getColumn(14).width = 15;

    worksheet.addRow([]);
    //Footer Row
    let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCFFE5' }
    };
    footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:M${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = ('Sales Order ' + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })


  }
  loadTemplate(type, SOId, IsDeleted) {
    switch (type) {
      case "view":

        this.spinner.show();
        this.PartItem = [];
        var postData = {
          SOId: SOId,
          IsDeleted: IsDeleted
        }
        this.commonService.postHttpService(postData, "getSalesOrderView").subscribe(response => {
          if (response.status == true) {
            this.result = response.responseData;
            this.AttachmentList = this.result.AttachmentList || []
            this.SalesOrderInfo = this.result.SalesOrderInfo[0] || "";
            this.BillingAddress = this.result.BillingAddress[0] || "";
            this.ShippingAddress = this.result.ShippingAddress[0] || "";
            this.NotesList = this.result.NotesList;
            this.RRNotesList = this.result.RRNotesList
            this.SalesOrderItem = this.result.SalesOrderItem;
            this.SalesOrderCustomerRef = this.result.CustomerRef;
            this.faxShippingAddress = this.ShippingAddress.Fax
            this.faxBillingAddress = this.BillingAddress.Fax
            this.IsRushRepair = this.SalesOrderInfo.IsRushRepair
            this.IsWarrantyRecovery = this.SalesOrderInfo.IsWarrantyRecovery
            this.SOTypeStyle = this.SalesOrderType.find(a => a.SalesOrder_TypeId == this.SalesOrderInfo.SOType)
            this.number = this.SalesOrderInfo.SONo

            // if (this.SalesOrderInfo.RRId != 0) {
            //   this.number = this.SalesOrderInfo.RRNo
            // }
            // else {
            //   this.number = this.SalesOrderInfo.SONo
            // }
            if (this.IsRushRepair == 1) {
              this.repairMessage = "Rush Repair"
            }
            if (this.IsWarrantyRecovery == 1) {
              this.repairMessage = "Warranty Repair"
            }
            if (this.IsWarrantyRecovery == 2) {
              this.repairMessage = "Warranty New"
            }
            if (this.IsRushRepair == 1 && this.IsWarrantyRecovery == 1) {
              this.repairMessage = "Rush Repair, Warranty Repair"
            }
            this.RRId = this.SalesOrderInfo.RRId

            this.PhoneShippingAddress = this.ShippingAddress.Phone
            this.PhoneBillingAddress = this.BillingAddress.Phone;
            this.SalesOrder_notes = SalesOrder_notes

            for (let x in this.SalesOrderItem) {
              if (!this.IsViewCostEnabled) {
                this.SalesOrderItem[x].Rate = CONST_COST_HIDE_VALUE;
                this.SalesOrderItem[x].Price = CONST_COST_HIDE_VALUE;
              }
            }
            if (!this.IsViewCostEnabled) {
              this.SalesOrderInfo.SubTotal = CONST_COST_HIDE_VALUE;
              this.SalesOrderInfo.AHFees = CONST_COST_HIDE_VALUE;
              this.SalesOrderInfo.TotalTax = CONST_COST_HIDE_VALUE;
              this.SalesOrderInfo.Discount = CONST_COST_HIDE_VALUE;
              this.SalesOrderInfo.Shipping = CONST_COST_HIDE_VALUE;
              this.SalesOrderInfo.GrandTotal = CONST_COST_HIDE_VALUE;
            }

          }
          else {

          }
          this.spinner.hide()
          this.cd_ref.detectChanges();
        }, error => console.log(error));
        this.templateSettings = this.viewTemplate;
        break;
      case "edit":
        this.router.navigate(['/admin/sales-order/edit'], { state: { SOId: SOId } });
        break;
      case "add":
        this.PartItem.push({
          Part: '',
          PartId: '',
          PartNo: "",
          Description: "",
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
          ItemStatus: ""
        });
        const years = Number(this.datePipe.transform(this.Currentdate, 'yyyy'));
        const Month = Number(this.datePipe.transform(this.Currentdate, 'MM'));
        const Day = Number(this.datePipe.transform(this.Currentdate, 'dd'));
        this.model.RequestedDate = {
          year: years,
          month: Month,
          day: Day
        }
        let DueDateFromSettings = new Date(new Date().getTime() + this.settingsView.SOLeadTime * 24 * 60 * 60 * 1000);

        const dueyears = Number(this.datePipe.transform(DueDateFromSettings, 'yyyy'));
        const dueMonth = Number(this.datePipe.transform(DueDateFromSettings, 'MM'));
        const dueDay = Number(this.datePipe.transform(DueDateFromSettings, 'dd'));
        this.model.DueDate = {
          year: dueyears,
          month: dueMonth,
          day: dueDay
        }
        this.model.CustomerId = null;
        this.model.SOType = undefined;
        this.Notes = "";
        this.Billingaddress = ""
        this.CustomerPONo = "";
        this.ReferenceNo = "";
        this.CustomerRef = [];
        this.model.sh_ShipCodeId = null;
        this.sh_ShipName = "";
        this.sh_street_address = "";
        this.sh_SuiteOrApt = "";
        this.sh_city = "";
        this.sh_CountryId = null;
        this.sh_StateId = null;
        this.sh_CountryName = ""
        this.sh_StateName = ""
        this.sh_zip = "";
        this.sh_AllowShipment = undefined;
        this.model.bi_BillCodeId = null;
        this.bi_BillName = "";
        this.bi_street_address = "";
        this.bi_SuiteOrApt = "";
        this.bi_city = "";
        this.bi_CountryId = null;
        this.bi_StateId = null;
        this.bi_zip = "";
        this.bi_CountryName = ""
        this.bi_StateName = ""
        this.bi_AllowShipment = undefined
        this.model.SoStatus = "5"
        this.SubTotal = "";
        this.TotalTax = "";
        this.GrandTotal = ""
        this.AddReference();
        this.templateSettings = this.addTemplate;
        break;
      default:
        this.templateSettings = this.viewTemplate;
        break;
    }
  }

  onSendEmail(SOId) {
    this.SOList.push({
      SOId
    })
  }

  onSendEmailofMRO(SOId, MROId) {
    this.SOList.push({
      SOId: SOId,
      MROId: MROId
    })
  }
  onSendEmailofRR(SOId, RRId) {
    this.SOList.push({
      SOId: SOId,
      RRId: RRId
    })
  }

  hideAddress: boolean = true
  generatePDF() {
    this.printComponent.onParentPrintClick();
  }

  generatePrint() {
    this.printComponent.onParentprint();
  }
  onApprovedSO() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, create it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          "SOId": this.SOId
        }
        this.commonService.postHttpService(postData, 'ApprovedSO').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Approved SO!',
              text: 'Sales Order Approved has been Updated.',
              type: 'success'
            });
            this.reLoad();

          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Sales Order Approved has not Updated.',
          type: 'error'
        });
      }
    });

  }
  onSendEmailFromList() {
    if (this.SOList.length == "") {
      this.ResponseMessage = "Please Select the Below Sales Order List before Email"
    } else {
      var postData = {
        "SOList": this.SOList
      }
      this.commonService.postHttpService(postData, "SendEmailFromSOList").subscribe(response => {
        if (response.status == true) {
          Swal.fire({
            title: 'Success!',
            text: 'Email Sent Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          this.reLoad();
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Email could not be Sent!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
  }



  //Email
  SOEmail() {
    this.printComponent.onParentEmailClick((pdfBase64, fileName) => {
      var RRId = this.RRId
      var IdentityId = this.SOId
      var IdentityType = CONST_IDENTITY_TYPE_SO
      var followupName = "Sales Order"
      var ImportedAttachment = { path: `data:application/pdf;filename=generated.pdf;base64,${pdfBase64}`, filename: fileName };
      this.modalRef = this.CommonmodalService.show(EmailComponent,
        {
          initialState: {
            data: { followupName, IdentityId, IdentityType, RRId, ImportedAttachment },
            class: 'modal-lg'
          }, class: 'gray modal-lg'
        });

      this.modalRef.content.closeBtnName = 'Close';

      this.modalRef.content.event.subscribe(res => {
        this.reLoad();
      });
    })
  }
  RequesteddateFormat(Requesteddate) {
    const RequesteddateYears = Requesteddate.year;
    const RequesteddateDates = Requesteddate.day;
    const Requesteddatemonths = Requesteddate.month;
    let RequesteddateDate = new Date(RequesteddateYears, Requesteddatemonths - 1, RequesteddateDates);
    this.RequesteddateDate = moment(RequesteddateDate).format('YYYY-MM-DD');
  }
  RequestedDateToFormat(RequestedDateTo) {
    const RequestedDateToYears = RequestedDateTo.year;
    const RequestedDateToDates = RequestedDateTo.day;
    const RequestedDateTomonths = RequestedDateTo.month;
    let RequestedDateToDate = new Date(RequestedDateToYears, RequestedDateTomonths - 1, RequestedDateToDates);
    this.RequestedDateToDate = moment(RequestedDateToDate).format('YYYY-MM-DD')
  }

  DuedateFormat(Duedate) {
    const DuedateYears = Duedate.year;
    const DuedateDates = Duedate.day;
    const Duedatemonths = Duedate.month;
    let DuedateDate = new Date(DuedateYears, Duedatemonths - 1, DuedateDates);
    this.DuedateDate = moment(DuedateDate).format('YYYY-MM-DD')
  }

  DueDateToFormat(DueDateTo) {
    const DueDateToYears = DueDateTo.year;
    const DueDateToDates = DueDateTo.day;
    const DueDateTomonths = DueDateTo.month;
    let DueDateToDate = new Date(DueDateToYears, DueDateTomonths - 1, DueDateToDates);
    this.DueDateToDate = moment(DueDateToDate).format('YYYY-MM-DD')
  }
  onFilter(event) {
    var Customerid = ""
    var CustomerName = ""
    if (this.CustomerId == '' || this.CustomerId == undefined || this.CustomerId == null) {
      Customerid = ""
      CustomerName = this.CompanyName
    }
    else if (this.CustomerId != "") {
      Customerid = this.CustomerId
      CustomerName = ''
    }

    var rrid = ""
    var RRNo = ""
    if (this.RRId == '' || this.RRId == undefined || this.RRId == null) {
      rrid = ""
      RRNo = this.RRNo
    }
    else if (this.RRId != "") {
      rrid = this.RRId
      RRNo = ''
    }

    let obj = this
    var table = $('#datatable-angular').DataTable();
    table.columns(1).search(this.SONo);
    table.columns(3).search(this.Status);
    table.columns(4).search(this.RequesteddateDate);
    table.columns(6).search(Customerid);
    table.columns(2).search(CustomerName);
    table.columns(8).search(this.SOType);
    table.columns(7).search(RRNo);
    table.columns(9).search(this.QuoteNo);
    table.columns(10).search(this.RequestedId);
    table.columns(11).search(this.UserId);
    table.columns(12).search(this.CustomerPONo);
    table.columns(13).search(this.ReferenceNO);
    table.columns(14).search(this.DueDateToDate);
    table.columns(15).search(this.DuedateDate);
    table.columns(16).search(this.RequestedDateToDate);
    table.columns(17).search(rrid);

    table.draw();
    this.showSearch = false;
  }

  onClear(event) {
    var table = $('#datatable-angular').DataTable();
    this.SONo = '';
    this.CustomerId = '';
    this.Status = '';
    this.Created = '';
    this.DateRequested = "";
    this.RRNo = '';
    this.SOType = "";
    this.QuoteNo = "";
    this.CustomerPONo = "";
    this.ReferenceNO = "";
    this.UserId = "";
    this.RequesteddateDate = "";
    this.RequestedDateToDate = "";
    this.DueDateToDate = "";
    this.DuedateDate = "";
    this.RequestedId = "";
    this.Requesteddate = "";
    this.RequestedDateTo = "";
    this.Duedate = "";
    this.DueDateTo = "";
    var Customerid = ""
    var CustomerName = "";
    var rrid = ""
    var RRNo = "";
    this.CompanyName = ''
    table.columns(1).search(this.SONo);
    table.columns(3).search(this.Status);
    table.columns(4).search(this.RequesteddateDate);
    table.columns(6).search(Customerid);
    table.columns(2).search(CustomerName);
    table.columns(8).search(this.SOType);
    table.columns(7).search(RRNo);
    table.columns(9).search(this.QuoteNo);
    table.columns(10).search(this.RequestedId);
    table.columns(11).search(this.UserId);
    table.columns(12).search(this.CustomerPONo);
    table.columns(13).search(this.ReferenceNO);
    table.columns(14).search(this.DueDateToDate);
    table.columns(15).search(this.DuedateDate);
    table.columns(16).search(this.RequestedDateToDate);
    table.columns(17).search(rrid);
    table.draw();
    this.showSearch = false;

    this.CustomerId = null;
    this.RequestedId = null;
    this.UserId = null
    this.SOType = undefined;
    this.Status = undefined;
    this.reLoad();


  }
  EnableSearch() {
    this.showSearch = true;
  }
  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData.map(function (value) {
        return { title: value.CompanyName, "CustomerId": value.CustomerId }
      });
      this.CustomerList = response.responseData
    });
  }

  getAdminList() {
    this.commonService.getHttpService('getAllActiveAdmin').subscribe(response => {//getAdminListDropdown
      this.adminList = response.responseData.map(function (value) {
        return { title: value.FirstName + " - " + value.LastName, "UserId": value.UserId }
      });
    });
  }



  getCountryList() {
    this.commonService.getconutryList().subscribe(response => {
      if (response.status == true) {
        this.countryList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  onchange_SH_StateList(sh_CountryId) {
    var postData = {
      CountryId: sh_CountryId
    }
    this.commonService.getHttpServiceStateId(postData, "getStateListDropdown").subscribe(response => {
      if (response.status == true) {
        this.sh_StateList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  onchange_Bi_StateList(bi_CountryId) {
    var postData = {
      CountryId: bi_CountryId
    }
    this.commonService.getHttpServiceStateId(postData, "getStateListDropdown").subscribe(response => {
      if (response.status == true) {
        this.bi_StateList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  BillingAddressChange(bi_BillCodeId) {
    let obj = this
    var BillingAddressDetails = obj.BillingAddressList.filter(function (value) {
      if (bi_BillCodeId == value.AddressId) {
        return value
      }
    }, obj);
    this.bi_CountryId = BillingAddressDetails[0].CountryId;
    this.bi_BillName = this.CustomerList.find(a => a.CustomerId == this.CustomerId).CompanyName;
    this.bi_street_address = BillingAddressDetails[0].StreetAddress;
    this.bi_city = BillingAddressDetails[0].City;
    this.bi_StateId = Number(BillingAddressDetails[0].StateId);
    this.bi_zip = BillingAddressDetails[0].Zip;
    this.bi_CountryId = BillingAddressDetails[0].CountryId;
    this.bi_SuiteOrApt = BillingAddressDetails[0].SuiteOrApt;
    this.bi_AllowShipment = BillingAddressDetails[0].AllowShipment
    this.BillAddressBookId = BillingAddressDetails[0].AddressId
  }


  ShippingAddressChange(sh_ShipCodeId) {
    let obj = this
    var ShippingAddressDetails = obj.ShippingAddressList.filter(function (value) {
      if (sh_ShipCodeId == value.AddressId) {
        return value
      }
    }, obj);
    this.sh_CountryId = ShippingAddressDetails[0].CountryId;
    this.sh_ShipName = this.CustomerList.find(a => a.CustomerId == this.CustomerId).CompanyName;
    this.sh_street_address = ShippingAddressDetails[0].StreetAddress;
    this.sh_city = ShippingAddressDetails[0].City;
    this.sh_StateId = Number(ShippingAddressDetails[0].StateId);
    this.sh_zip = ShippingAddressDetails[0].Zip;
    this.sh_CountryId = ShippingAddressDetails[0].CountryId;
    this.sh_SuiteOrApt = ShippingAddressDetails[0].SuiteOrApt;
    this.sh_AllowShipment = ShippingAddressDetails[0].AllowShipment
    this.ShipAddressBookId = ShippingAddressDetails[0].AddressId
  }



  backToRRView() {
    this.router.navigate(['/admin/repair-request/edit'], { state: { RRId: this.SalesOrderInfo.RRId } });
  }



  AddItem() {
    this.PartItem.push({
      "Part": '',
      "PartId": '',
      "PartNo": "",
      "Description": "",
      "Quantity": "",
      "Rate": "",
      "Discount": "",
      "Tax": "",
      "Price": "",
      "LeadTime": "",
      "WarrantyPeriod": undefined,
      "DeliveryDate": "",
      "AllowShipment": "",
      "Notes": "",
      "ItemStatus": ""
    });
  }

  removePartItem(i) {
    this.PartItem.splice(i, 1);
    this.changeStatus(i)
  }


  AddReference() {
    this.CustomerRef.push({
      CReferenceId: '',
      ReferenceValue: '',
      ReferenceLabelName: ''
    })
  }

  public addReferenceType() {
    var IdentityId = this.CustomerId;
    this.modalRef = this.CommonmodalService.show(CustomerReferenceComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { IdentityId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      }
    )

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.customerReferenceList.push(res.data);
    });
  }
  changeStatus(index) {
    var subTotal = 0;
    // Calculate the subtotal
    for (let i = 0; i < this.PartItem.length; i++) {

      subTotal += this.PartItem[i].Price

    }
    this.SubTotal = subTotal
    this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }
  calculateTax() {
    this.TotalTax = this.SubTotal * this.TaxPercent / 100;
    this.calculateTotal();

  }
  getCustomerProperties(CustomerId) {

    this.CustomerId = CustomerId
    if (CustomerId == null || CustomerId == "" || CustomerId == 0) {

      return false;
    }
    var postData = { CustomerId: CustomerId };
    this.customerAddressList = [];
    this.ShipAddress = [];
    this.BillAddress = [];
    var postData1 = {
      "IdentityId": CustomerId,
      "IdentityType": 1,

    }
    //CustomerAddressLoad
    this.commonService.postHttpService(postData1, 'getAddressList').subscribe(response => {
      this.ShippingAddressList = response.responseData;
      this.ShipAddress = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });


      //shippingAddress
      let obj = this
      var ShippingAddress = obj.ShippingAddressList.filter(function (value) {
        if (value.IsShippingAddress == 1) {
          return value.AddressId
        }
      }, obj);
      this.model.sh_ShipCodeId = ShippingAddress[0].AddressId || "";
      this.sh_CountryId = ShippingAddress[0].CountryId || "";
      this.getStateList_sh(this.sh_CountryId);
      this.sh_ShipName = this.CustomerList.find(a => a.CustomerId == this.model.CustomerId).CompanyName || "";
      this.sh_street_address = ShippingAddress[0].StreetAddress || "";
      this.sh_city = ShippingAddress[0].City || "";
      this.sh_StateId = Number(ShippingAddress[0].StateId) || "";
      this.sh_zip = ShippingAddress[0].Zip || "";
      this.sh_CountryId = ShippingAddress[0].CountryId || "";
      this.sh_SuiteOrApt = ShippingAddress[0].SuiteOrApt || "";
      this.sh_AllowShipment = ShippingAddress[0].AllowShipment || "";
      this.sh_CountryName = ShippingAddress[0].CountryName || "";
      this.sh_StateName = ShippingAddress[0].StateName || "";
    })


    var postData2 = {
      "IdentityId": CustomerId,
      "IdentityType": 1,

    }
    //CustomerAddressLoad
    this.commonService.postHttpService(postData2, 'getAddressList').subscribe(response => {
      this.BillingAddressList = response.responseData;
      this.BillAddress = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });
      //BillingAddress
      let obj = this
      this.Billingaddress = obj.BillingAddressList.filter(function (value) {
        if (value.IsBillingAddress == 1) {
          return value.AddressId
        }
      }, obj);
      this.model.bi_BillCodeId = this.Billingaddress[0].AddressId || "";
      this.bi_CountryId = this.Billingaddress[0].CountryId || "";
      this.getStateList_bi(this.bi_CountryId);

      this.bi_BillName = this.CustomerList.find(a => a.CustomerId == this.model.CustomerId).CompanyName || "";
      this.bi_street_address = this.Billingaddress[0].StreetAddress || "";
      this.bi_city = this.Billingaddress[0].City || "";
      this.bi_StateId = Number(this.Billingaddress[0].StateId || "");
      this.bi_zip = this.Billingaddress[0].Zip || "";
      this.bi_CountryId = this.Billingaddress[0].CountryId || "";
      this.bi_SuiteOrApt = this.Billingaddress[0].SuiteOrApt || "";
      this.bi_AllowShipment = this.Billingaddress[0].AllowShipment || ""
      this.bi_CountryName = this.Billingaddress[0].CountryName || "";
      this.bi_StateName = this.Billingaddress[0].StateName || "";

    });



    //referenceList dropdown
    this.commonService.postHttpService(postData, 'getCustomerReferenceListDropdown').subscribe(response => {
      this.customerReferenceList = response.responseData;
    });


  }



  CreateCustomerInvoice() {
    if (this.SalesOrderInfo.POId != '' && this.SalesOrderInfo.POId != null) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Create it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success mt-2',
        cancelButtonClass: 'btn btn-danger ml-2 mt-2',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          var postData = {
            "RRId": this.RRId, "SOId": this.SOId, "QuoteId": this.SalesOrderInfo.QuoteId
          }
          this.commonService.postHttpService(postData, 'AutoCreateInvoice').subscribe(response => {
            if (response.status == true) {
              Swal.fire({
                title: 'Created Invoice!',
                text: 'Invoice has been Created.',
                type: 'success'
              });
              this.reLoad();
            }
          });
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          Swal.fire({
            title: 'Cancelled',
            text: 'Invoice  has not Created.',
            type: 'error'
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Message',
        text: 'Failed to create Invoice. Please create PO and then create Invoice',
        type: 'info'
      });
    }
  }

  getStateList_sh(sh_CountryId) {
    var postData = {
      CountryId: this.sh_CountryId
    }
    this.commonService.getHttpServiceStateId(postData, "getStateListDropdown").subscribe(response => {
      if (response.status == true) {
        this.sh_StateList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));


  }


  getStateList_bi(bi_CountryId) {
    var postData = {
      CountryId: this.bi_CountryId
    }
    this.commonService.getHttpServiceStateId(postData, "getStateListDropdown").subscribe(response => {
      if (response.status == true) {
        this.bi_StateList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));


  }

  getContactAddress() {

    var postData = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      "Type": CONST_ContactAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.AddressList = response.responseData;
      this.ShipAddress = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });
      //ContactAddress
      let obj = this
      var ContactAddress = obj.AddressList.filter(function (value) {
        if (value.IsContactAddress == 1) {
          return value.AddressId
        }
      }, obj);
      this.model.sh_ShipCodeId = ContactAddress[0].AddressId;
      this.sh_CountryId = ContactAddress[0].CountryId;
      this.sh_ShipName = this.CustomerList.find(a => a.CustomerId == this.model.CustomerId).CompanyName;
      this.sh_street_address = ContactAddress[0].StreetAddress;
      this.sh_city = ContactAddress[0].City;
      this.sh_StateId = Number(ContactAddress[0].StateId);
      this.sh_zip = ContactAddress[0].Zip;
      this.sh_CountryId = ContactAddress[0].CountryId;
      this.sh_SuiteOrApt = ContactAddress[0].SuiteOrApt;
      this.sh_AllowShipment = ContactAddress[0].AllowShipment

    })
  }

  getContactAddressinBill() {
    var postData = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      "Type": CONST_ContactAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.AddressList = response.responseData;
      this.BillAddress = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });

      //ContactAddress
      let obj = this
      var ContactAddress = obj.AddressList.filter(function (value) {
        if (value.IsContactAddress == 1) {
          return value.AddressId
        }
      }, obj);
      this.model.bi_BillCodeId = ContactAddress[0].AddressId;
      this.bi_CountryId = ContactAddress[0].CountryId;
      this.bi_BillName = this.CustomerList.find(a => a.CustomerId == this.model.CustomerId).CompanyName;
      this.bi_street_address = ContactAddress[0].StreetAddress;
      this.bi_city = ContactAddress[0].City;
      this.bi_StateId = Number(ContactAddress[0].StateId);
      this.bi_zip = ContactAddress[0].Zip;
      this.bi_CountryId = ContactAddress[0].CountryId;
      this.bi_SuiteOrApt = ContactAddress[0].SuiteOrApt;
      this.bi_AllowShipment = ContactAddress[0].AllowShipment
    })
  }
  getBillingAddress() {
    var postData2 = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      "Type": CONST_BillAddressType

    }
    //CustomerAddressLoad
    this.commonService.postHttpService(postData2, 'getAddressList').subscribe(response => {
      this.BillingAddressList = response.responseData;
      this.ShipAddress = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });
      let obj = this

      //BillingAddress
      var BillingAddress = obj.BillingAddressList.filter(function (value) {
        if (value.IsBillingAddress == 1) {
          return value.AddressId
        }
      }, obj);
      this.model.sh_ShipCodeId = BillingAddress[0].AddressId;
      this.sh_CountryId = BillingAddress[0].CountryId;
      this.sh_ShipName = this.CustomerList.find(a => a.CustomerId == this.model.CustomerId).CompanyName;;
      this.sh_street_address = BillingAddress[0].StreetAddress;
      this.sh_city = BillingAddress[0].City;
      this.sh_StateId = Number(BillingAddress[0].StateId);
      this.sh_zip = BillingAddress[0].Zip;
      this.sh_CountryId = BillingAddress[0].CountryId;
      this.sh_SuiteOrApt = BillingAddress[0].SuiteOrApt;
      this.sh_AllowShipment = BillingAddress[0].AllowShipment
    })

  }

  getShippingAddress() {
    var postData1 = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      "Type": CONST_ShipAddressType

    }
    //CustomerAddressLoad
    this.commonService.postHttpService(postData1, 'getAddressList').subscribe(response => {
      this.ShippingAddressList = response.responseData;
      this.BillAddress = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });


      //shippingAddress
      let obj = this
      var ShippingAddress = obj.ShippingAddressList.filter(function (value) {
        if (value.IsShippingAddress == 1) {
          return value.AddressId
        }
      }, obj);
      this.model.bi_BillCodeId = ShippingAddress[0].AddressId;
      this.bi_CountryId = ShippingAddress[0].CountryId;
      this.bi_BillName = this.CustomerList.find(a => a.CustomerId == this.model.CustomerId).CompanyName;
      this.bi_street_address = ShippingAddress[0].StreetAddress;
      this.bi_city = ShippingAddress[0].City;
      this.bi_StateId = Number(ShippingAddress[0].StateId);
      this.bi_zip = ShippingAddress[0].Zip;
      this.bi_CountryId = ShippingAddress[0].CountryId;
      this.bi_SuiteOrApt = ShippingAddress[0].SuiteOrApt;
      this.bi_AllowShipment = ShippingAddress[0].AllowShipment
    })
  }




  calculatePrice(index) {
    var price = 0; var subTotal = 0;
    let Quantity = this.PartItem[index].Quantity || 0;
    let Rate = this.PartItem[index].Rate || 0;

    // Calculate the price
    price = parseFloat(Quantity) * parseFloat(Rate);
    this.PartItem[index].Price = price

    for (let i = 0; i < this.PartItem.length; i++) {
      subTotal += this.PartItem[i].Price

    }
    //Calculate the subtotal
    this.SubTotal = subTotal;

    this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }

  calculateTotal() {
    var total = 0;
    let AdditionalCharge = this.AHFees || 0;
    let Shipping = this.Shipping || 0;
    let Discount = this.Discount || 0;

    total = parseFloat(this.SubTotal) + parseFloat(this.TotalTax) +
      parseFloat(AdditionalCharge) + parseFloat(Shipping) - parseFloat(Discount);
    this.GrandTotal = parseFloat(total.toFixed(2));
  }

  selectEvent(item, i) {
    var postData = { PartId: item.PartId };
    this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {
      this.PartItem[i].PartId = response.responseData[0].PartId,
        this.PartItem[i].PartNo = response.responseData[0].PartNo,
        this.PartItem[i].Description = response.responseData[0].Description,
        this.PartItem[i].Quantity = response.responseData[0].Quantity,
        this.PartItem[i].Rate = response.responseData[0].Price
      this.PartItem[i].DeliveryDate = "2020-12-24"
      this.calculatePrice(i)

    });
  }

  onChangeSearch(val: string, i) {

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

  onFocused(e, i) {
    // do something when input is focused
  }



  reLoad() {
    //window.location.reload()
    this.router.navigate([this.currentRouter.split('?')[0]], { queryParams: { SOId: this.SOId } })
  }
  onSubmit(f: NgForm) {
    //DateRequested
    const reqYears = this.model.RequestedDate.year
    const reqDates = this.model.RequestedDate.day;
    const reqmonths = this.model.RequestedDate.month;
    let requestDates = new Date(reqYears, reqmonths - 1, reqDates);
    let DateRequested = moment(requestDates).format('YYYY-MM-DD');
    //DueDate
    const dueYears = this.model.DueDate.year;
    const dueDates = this.model.DueDate.day;
    const duemonths = this.model.DueDate.month;
    let dueDate = new Date(dueYears, duemonths - 1, dueDates);
    let DueDate = moment(dueDate).format('YYYY-MM-DD');

    let obj = this;
    let Reference = this.CustomerRef.map(function (value) {
      let filterdValue = obj.customerReferenceList.filter(function (label) {
        return value.CReferenceId == label.CReferenceId;
      }, value);
      value.ReferenceLabelName = filterdValue[0].CReferenceName;
      return value;
    })
    if (f.valid) {
      this.btnDisabled = true;

      var postData = {
        "RRId": 0,
        "CustomerId": this.model.CustomerId,
        "SOType": this.model.SOType,
        "DateRequested": DateRequested,
        "DueDate": DueDate,
        "CustomerPONo": "",
        "ReferenceNo": this.ReferenceNo,
        "WarehouseId": this.WarehouseId,
        "ShipAddressBookId": this.model.sh_ShipCodeId,
        "BillAddressBookId": this.model.bi_BillCodeId,
        "Notes": this.Notes,
        "IsConvertedToPO": this.IsConvertedToPO,
        "SubTotal": this.SubTotal,
        "TotalTax": this.TotalTax,
        "Discount": this.Discount,
        "AHFees": this.AHFees,
        "Shipping": this.Shipping,
        "GrandTotal": this.GrandTotal,
        "TaxPercent": this.TaxPercent,
        "Status": this.model.SoStatus,
        "SalesOrderItem": this.PartItem,
        // "ShipOrderAddress":
        // {
        //   "AddressName": this.sh_ShipName,
        //   "AddressType": 1,
        //   "StreetAddress": this.sh_street_address,
        //   "SuiteOrApt": this.sh_SuiteOrApt,
        //   "City": this.sh_city,
        //   "StateId": this.sh_StateId,
        //   "CountryId": this.sh_CountryId,
        //   "Zip": this.sh_zip,
        //   "AllowShipment": this.sh_AllowShipment,
        //   "Phone": "123457",
        //   "Fax": "987656544"
        // },
        // "BillOrderAddress":
        // {
        //   "AddressName": this.bi_BillName,
        //   "AddressType": 2,
        //   "StreetAddress": this.bi_street_address,
        //   "SuiteOrApt": this.bi_SuiteOrApt,
        //   "City": this.bi_city,
        //   "StateId": this.bi_StateId,
        //   "CountryId": this.bi_CountryId,
        //   "Zip": this.bi_zip,
        //   "AllowShipment": this.bi_AllowShipment,
        //   "Phone": "565",
        //   "Fax": "787686"
        // },
        "GlobalCustomerReference": this.CustomerRef
      }
      this.commonService.postHttpService(postData, "SOCreate").subscribe(response => {
        if (response.status == true) {
          this.templateSettings = this.viewTemplate;

          Swal.fire({
            title: 'Success!',
            text: 'Sales Order Created Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          this.reLoad();

        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Sales Order could not be Created!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    } else {
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }
  }


  DeleteSO() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          SOId: this.SOId,
        }
        this.commonService.postHttpService(postData, 'DeleteSO').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Sales Order has been deleted.',
              type: 'success'
            });
            this.router.navigate(['/admin/SO-Order-List'])
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Sales Order  is safe:)',
          type: 'error'
        });
      }
    });

  }

  onbackToList() {
    this.navCtrl.navigate('admin/SO-Order-List');
  }
  //AutoComplete for RR
  selectRREvent($event) {
    this.RRId = $event.RRId;
  }

  onChangeRRSearch(val: string) {

    if (val) {
      this.isLoadingRR = true;
      var postData = {
        "RRNo": val
      }
      this.commonService.postHttpService(postData, "RRNoAotoSuggest").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.RRList = data.filter(a => a.RRNo.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingRR = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingRR = false; });

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
        "Customer": val
      }
      this.commonService.postHttpService(postData, "getAllAutoComplete").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.CustomerList = data.filter(a => a.CompanyName.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingCustomer = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingCustomer = false; });

    }
  }

  RevertInvoice() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        if (this.SalesOrderInfo.IsCSVProcessed == 0) {
          var postData = {
            InvoiceId: this.SalesOrderInfo.InvoiceId,
          }
          this.commonService.postHttpService(postData, 'DeleteInvoice').subscribe(response => {
            if (response.status == true) {
              Swal.fire({
                title: 'Success!',
                text: 'Invoice Reverted Successfully!',
                type: 'success',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
              this.reLoad();
            } else {
              Swal.fire({
                title: 'Error!',
                text: response.message,
                type: 'warning',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            }
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Can not revert the invocie since it is processed. Please contact admin to revert this',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Invoice is safe:)',
          type: 'error'
        });
      }
    });
  }
  onCancelSO() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          "SOId": this.SOId
        }
        this.commonService.postHttpService(postData, 'CancelSO').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Cancelled SO!',
              text: 'SO Cancelled has been Updated.',
              type: 'success'
            });

            this.reLoad()
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Error',
          text: 'SO Cancelled has not Updated.',
          type: 'error'
        });
      }
    });

  }
}
