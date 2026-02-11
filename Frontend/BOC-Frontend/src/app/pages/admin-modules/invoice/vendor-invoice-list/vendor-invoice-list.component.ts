/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, Input, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgbDateAdapter, NgbDateParserFormatter, NgbCalendar, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/core/services/common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { DatePipe } from '@angular/common';
import {
  warranty_list, terms, Vendorinvoice_notes,
  CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, Vendor_Bill_Status, Invoice_Type, Const_Alert_pop_message, Const_Alert_pop_title, VAT_field_Name, TOTAL_VAT_field_Name, Shipping_field_Name
} from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ExcelService } from 'src/app/core/services/excel.service';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { NgForm } from '@angular/forms';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-vendor-invoice-list',
  templateUrl: './vendor-invoice-list.component.html',
  styleUrls: ['./vendor-invoice-list.component.scss'],
  providers: [
    NgxSpinnerService
  ],
})
export class VendorInvoiceListComponent implements OnInit {
  checkedCategoryList: any;
  enableVendorApproved
  CustomerInvoiceApproved;
  VendorBillApproved;
  isMasterSel: boolean;
  IsCSVProcessed;
  keywordForVendor = 'VendorName';
  VendorsList: any[];
  VendorName;
  isLoadingVendor: boolean = false;
  keywordForRR = 'RRNo';
  RRList: any[]
  RRId;
  RRIdFilter = ''
  MROId
  isLoadingRR: boolean = false;
  @Input() templateSettings: TemplateRef<HTMLElement>;
  @ViewChild('viewTemplate', null) viewTemplate: TemplateRef<HTMLElement>;
  @ViewChild('editTemplate', null) editTemplate: TemplateRef<HTMLElement>;
  @ViewChild('addTemplate', null) addTemplate: TemplateRef<HTMLElement>;
  submitted = false;
  btnDisabled: boolean = false;
  dataTableMessage;
  tableData: any = [];
  ref_no;
  TermDisc;
  vendor;
  baseUrl = `${environment.api.apiURL}`;
  VendorInvoiceInfo;
  VendorAddress;
  PhoneVendorAddress;
  faxVendorAddress;
  VendorInvoiceItem: any = []
  Currentdate = new Date();
  //ServerSide List
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  api_check: any;
  dataTable: any;
  @ViewChild('dataTable', { static: true }) table;
  warrantyList;
  TermsList
  VendorInvoiceId;
  result;
  Vendorinvoice_notes;
  vendorList;
  showSearch: boolean = true;
  Invoice_Status;
  //itemdetails
  LeadTime;
  Rate;
  WarrantyPeriod;
  SubTotal;
  GrandTotal;
  AdditionalCharge;
  TotalTax;
  Discount;
  TaxPercent;
  AHFees;
  Shipping;
  AdvanceAmount;
  number;
  //Filter
  RRNo;
  VendorInvoiceNo;
  CustomerId;
  PONo;
  VendorInvoiceType;
  Status;
  InvoiceDateToDate
  InvoiceDateDate;
  DueDateToDate;
  DueDateDate;
  InvoiceDate;
  InvoiceDateTo;
  DueDateTo;
  DueDate;
  VendorId = ''
  PartItem: any = []
  VendorInvoiceList: any = [];
  NotesList: any = [];
  ResponseMessage;
  partList;
  //Add
  model: any = [];
  POList: any = [];
  checkedList: any = [];
  postData;
  ExcelData;
  CSVData;
  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;
  IsPrintPDFEnabled;
  IsExcelEnabled;
  IsNotesEnabled;
  IsApproveEnabled;
  settingsView;
  VendorInvoiceTypeStyle;
  ListHidden: boolean = false;
  showList: boolean = true;
  IsDeleted:string;
  IsDisplayBaseCurrencyValue
  VAT_field_Name
  Shipping_field_Name
  BaseCurrencySymbol
  constructor(private http: HttpClient, public router: Router, private spinner: NgxSpinnerService, public navCtrl: NgxNavigationWithDataComponent,
    private modalService: NgbModal, private service: CommonService, private cd_ref: ChangeDetectorRef, private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, private datePipe: DatePipe, private excelService: ExcelService,
    private _FileSaverService: FileSaverService, private route: ActivatedRoute) { }
  currentRouter = decodeURIComponent(this.router.url);

  ngOnInit(): void {
    document.title='Vendor Bill View'
    this.IsDisplayBaseCurrencyValue =localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")
    this.VAT_field_Name = TOTAL_VAT_field_Name; // VAT_field_Name
    this.Shipping_field_Name = Shipping_field_Name
    if (history.state.VendorInvoiceId == undefined) {
      this.route.queryParams.subscribe(
        params => {
          this.VendorInvoiceId = params['VendorInvoiceId'];
          //this.showList = params['showList'] == 1;
          this.IsDeleted = params['IsDeleted'] 
        }
      )

    }
    else if (history.state.VendorInvoiceId != undefined) {
      this.VendorInvoiceId = history.state.VendorInvoiceId
    }
    // this.showList =history.state.showList
    // this.IsDeleted = history.state.IsDeleted

    // if (this.showList == true) {
     // this.ListHidden = false
      this.loadTemplate('view', this.VendorInvoiceId, this.IsDeleted)

    // } else {
    //   this.ListHidden = true;
    //   const httpOptions = {
    //     headers: new HttpHeaders({
    //       'Content-Type': 'application/json',
    //       'Authorization': `${localStorage.getItem("Access-Token")}`
    //     })
    //   };

    //   var url = this.baseUrl + '/api/v1.0/VendorInvoice/getVendorInvListByServerSide';
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
    //           if (this.VendorInvoiceId == undefined) {

    //             this.VendorInvoiceId = resp.responseData.data[0].VendorInvoiceId;
    //           }
    //           if (this.VendorInvoiceId == null) {
    //             this.VendorInvoiceId = resp.responseData.data[0].VendorInvoiceId;
    //           }
    //           this.loadTemplate('view', this.VendorInvoiceId, this.IsDeleted)
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


    //     ],
    //     createdRow: function (row, data, index) {
    //     },
    //     columns: [
    //       {
    //         data: 'VendorInvoiceId', name: 'VendorInvoiceId', defaultContent: '', orderable: true, searchable: true,
    //         render: (data: any, type: any, row: any, meta) => {

    //           // var cstyle = '';
    //           // switch (row.Status) {
    //           //   case 0: { cstyle = 'badge-info'; status = "Draft"; break; }
    //           //   case 1: { cstyle = 'badge-warning'; status = "Open"; break; }
    //           //   case 2: { cstyle = 'badge-success'; status = "Approved"; break; }
    //           //   case 3: { cstyle = 'badge-danger'; status = "Cancelled"; break; }


    //           //   default: { cstyle = ''; break; }
    //           // }


    //           var statusObj = this.Invoice_Status.find(a => a.Invoice_StatusId == row.Status)

    //           var cstylealgin = 'float:right'
    //           var sostyles = 'background:#ececec!important;color:#333;padding:1px 5px;margin-right:8px;'

    //           var number = '';
    //           if (row.RRNo != '' && row.RRNo != '0' && row.RRNo != null) {
    //             number = row.RRNo;
    //           }
    //           else if (row.MRONo != '' && row.MRONo != '0' && row.MRONo != null) {
    //             number = row.MRONo;
    //           }
    //           else if (row.MRONo == '' || row.MRONo == '0' && row.MRONo == null || row.RRNo == '' || row.RRNo == '0' || row.RRNo == null) {
    //             number = row.VendorInvoiceNo;
    //           }




    //           var Difference_In_Days = row.DueDateDiff;
    //           var daystext = '-';
    //           if ((row.Status == 1)) {
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
    //           //  var IsEmailSent = '';
    //           //  if (row.IsEmailSent) {
    //           //    IsEmailSent = '<i  class="mdi mdi-email-outline red"></i>';
    //           //  }


    //           var checkbox = '';
    //           checkbox = '<input type="checkbox" class="checkbox">&nbsp;';

    //           if (!this.IsViewCostEnabled) {
    //             row.GrandTotal = CONST_COST_HIDE_VALUE;
    //           }
    //           return '<p>' + checkbox + row.VendorName + `<span style="float:right;">$${row.GrandTotal}</span>` + '</p><a style="cursor:pointer" class="IDHREF"><span style="background:#ececec;padding:1px 5px;margin-right:2px;" >#' + number + '</span></a>&nbsp;|&nbsp;<span class="order-date">' + row.InvoiceDate + '</span> <span style="float:right" class="badge ' + (statusObj ? statusObj.cstyle : '') + ' btn-xs">' + (statusObj ? statusObj.Invoice_StatusName : '') + '</span><br><span class="pink" style="padding:1px 5px;margin-right:2px;">' + row.DueDate + '</span>&nbsp;|&nbsp; ' + daystext + '</a>';

    //         },
    //       },
    //       { data: 'VendorInvoiceNo', name: 'VendorInvoiceNo', orderable: true, searchable: true, },
    //       { data: 'VendorName', name: 'VendorName', orderable: true, searchable: true, },
    //       { data: 'Status', name: 'Status', orderable: true, searchable: true, },
    //       { data: 'InvoiceDate', name: 'InvoiceDate', orderable: true, searchable: true, },
    //       { data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true, },
    //       { data: 'RRNo', name: 'RRNo', orderable: true, searchable: true, },
    //       { data: 'InvoiceDateTo', name: 'InvoiceDateTo', orderable: true, searchable: true, },
    //       { data: 'DueDate', name: 'DueDate', orderable: true, searchable: true, },
    //       { data: 'DueDateTo', name: 'DueDateTo', orderable: true, searchable: true, },
    //       { data: 'VendorId', name: 'VendorId', orderable: true, searchable: true, },
    //       { data: 'VendorInvoiceType', name: 'VendorInvoiceType', orderable: true, searchable: true, },
    //       { data: 'PONo', name: 'PONo', orderable: true, searchable: true, },
    //       { data: 'IsCSVProcessed', name: 'IsCSVProcessed', orderable: true, searchable: true, },
    //       { data: 'RRId', name: 'RRId', orderable: true, searchable: true, },
    //       { data: 'CustomerInvoiceApproved', name: 'CustomerInvoiceApproved', orderable: true, searchable: true, },
    //       { data: 'VendorBillApproved', name: 'VendorBillApproved', orderable: true, searchable: true, },


    //     ],
    //     rowCallback: (row: Node, data: any | Object, index: number) => {
    //       $('.IDHREF', row).unbind('click');
    //       $('.IDHREF', row).bind('click', (e) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         this.loadTemplate("view", data.VendorInvoiceId, this.IsDeleted);
    //         this.VendorInvoiceId = data.VendorInvoiceId

    //       });


    //       $('.checkbox', row).unbind('click');
    //       $('.checkbox', row).bind('click', (e) => {
    //         this.onExcelData(data.VendorInvoiceId)
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

    //   this.dataTable = $('#datatable-vinvoice');
    //   this.dataTable.DataTable(this.dtOptions);
    // }

    this.settingsView = ""
    this.getAdminSettingsView();
    this.getVendorList();
    this.getPartList();
    this.getTermList();
    this.Invoice_Status = Vendor_Bill_Status;
    this.VendorInvoiceInfo = "";
    this.VendorInvoiceTypeStyle = ""
    this.VendorInvoiceItem = [];
    this.NotesList = [];
    this.VendorAddress = "";
    this.Shipping = "0";
    this.Discount = "0";
    this.AHFees = "0";
    this.IsViewEnabled = this.service.permissionCheck("ManageVendorBills", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.service.permissionCheck("ManageVendorBills", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.service.permissionCheck("ManageVendorBills", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.service.permissionCheck("ManageVendorBills", CONST_DELETE_ACCESS);
    this.IsViewCostEnabled = this.service.permissionCheck("ManageVendorBills", CONST_VIEW_COST_ACCESS);
    this.IsApproveEnabled = this.service.permissionCheck("ManageVendorBills", CONST_APPROVE_ACCESS);
    this.IsPrintPDFEnabled = this.service.permissionCheck("VBPrintAndPDFExport", CONST_VIEW_ACCESS);
    this.IsExcelEnabled = this.service.permissionCheck("VBDownloadExcel", CONST_VIEW_ACCESS);
    this.IsNotesEnabled = this.service.permissionCheck("VendorBillNotes", CONST_VIEW_ACCESS);


  }

  onReOpenVendorInvoice() {
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
          "VendorInvoiceId": this.VendorInvoiceId
        }
        this.service.postHttpService(postData, 'ReOpenVendorInvoice').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'ReOpen Vendor Bill!',
              text: 'Vendor Bill ReOpen has been Updated.',
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
          text: 'Vendor Bill ReOpen has not Updated.',
          type: 'error'
        });
      }
    });

  }

  getTermList() {
    this.service.getHttpService("getTermsList").subscribe(response => {
      if (response.status == true) {
        this.TermsList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  getAdminSettingsView() {
    var postData = {}
    this.service.postHttpService(postData, "getSettingsGeneralView").subscribe(response => {
      if (response.status == true) {
        this.settingsView = response.responseData;
        this.TaxPercent = this.settingsView.TaxPercent

      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  onExcelData(VendorInvoiceId) {
    this.checkedList.push({
      VendorInvoiceId
    })
  }

  exportAsXLSX() {


    this.postData = {
      "VendorInvoice": this.checkedList,
      "RRNo": this.RRNo,
      "VendorInvoiceNo": this.VendorInvoiceNo,
      "VendorId": this.VendorId,
      "PONo": this.PONo,
      "InvoiceDate": this.InvoiceDateDate,
      "InvoiceDateTo": this.InvoiceDateToDate,
      "DueDate": this.DueDateDate,
      "DueDateTo": this.DueDateToDate,
      "VendorInvoiceType": this.VendorInvoiceType,
      "Status": this.Status,
      "IsCSVProcessed": this.IsCSVProcessed,
      "DownloadType": "Excel"
    }
    this.service.postHttpService(this.postData, "VendorInvoiceExcelData").subscribe(response => {
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

  exportAsCSV() {


    this.postData = {
      "VendorInvoice": this.checkedList,
      "RRNo": this.RRNo,
      "VendorInvoiceNo": this.VendorInvoiceNo,
      "VendorId": this.VendorId,
      "PONo": this.PONo,
      "InvoiceDate": this.InvoiceDateDate,
      "InvoiceDateTo": this.InvoiceDateToDate,
      "DueDate": this.DueDateDate,
      "DueDateTo": this.DueDateToDate,
      "VendorInvoiceType": this.VendorInvoiceType,
      "Status": this.Status,
      "IsCSVProcessed": this.IsCSVProcessed,
      "DownloadType": "CSV"
    }
    this.service.postHttpService(this.postData, "VendorInvoiceExcelData").subscribe(response => {
      if (response.status == true) {
        this.CSVData = response.responseData.ExcelData;
        this.generateCSVFormat();
        Swal.fire({
          title: 'Success!',
          text: 'CSV downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
        this.reLoad();
      }
      else {
        Swal.fire({
          title: 'Error!',
          text: response.message,
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
    let blob = new Blob([csvData], { type: 'text/csv;encoding:utf-8' });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
    var filename = ('Vendor Bill ' + currentDate + '.csv')
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


  generateExcelFormat() {
    var data = []
    var jsonData = this.ExcelData
    for (var i = 0; i < jsonData.length; i++) {
      var obj = jsonData[i];
      // delete jsonData[i].VendorId;

      var temparray = [];
      for (var key in obj) {
        var value = obj[key];
        temparray.push(value);
      }
      data.push(temparray);
    }

    //Excel Title, Header, Data
    const title = 'Vendor Bill';
    const header = ["VendorId", "Vendor Name", "Invoice/CM #", "Apply to Invoice Number", "Credit Memo", "Date", "Drop ship", "Customer SO #", "Waiting On Bill", "Customer ID", "Customer Invoice #", "Ship To Name", "Ship to Address-Line One", "Ship to Address-Line Two", "Ship to City", "Ship To State", "Ship to Zipcode", "Ship To Country", "Due Date", "Discount Date", "Discount Amount", "Accounts Payable Account", "Ship Via", "P.O. Note", "Note Prints After Line Items", "Beginning Balance Transaction", "Applied To Purchase Order", "Number Of Distributions", "Invoice/CM Distribution", "Apply to Invoice Distribution", "PO Number", "PO Distribution", 'Quantity', "Stocking Quantity", "Item ID", "Serial Number", "U/M ID", "U/M No. of Stocking Units", "Description", "G/L Account", "Unit Price", "Stocking Unit Price", "UPC / SKU", "Weight", "Amount", "Job ID", "Used for Reimbursable Expense", "Displayed Terms", "Return Authorization", "Row Type", "Recur Number", "Recur Frequency"]
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
    worksheet.getColumn(1).width = 35;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 30;
    worksheet.getColumn(12).width = 30;
    worksheet.getColumn(13).width = 15;
    worksheet.getColumn(14).width = 15;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 20;
    worksheet.getColumn(17).width = 20;
    worksheet.getColumn(18).width = 20;
    worksheet.getColumn(19).width = 20;
    worksheet.getColumn(20).width = 25;
    worksheet.getColumn(21).width = 15;
    worksheet.getColumn(22).width = 15;
    worksheet.getColumn(23).width = 25;
    worksheet.getColumn(24).width = 25;
    worksheet.getColumn(25).width = 25;
    worksheet.getColumn(26).width = 25;
    worksheet.getColumn(27).width = 25;
    worksheet.getColumn(28).width = 15;
    worksheet.getColumn(29).width = 20;
    worksheet.getColumn(30).width = 20;
    worksheet.getColumn(31).width = 20;
    worksheet.getColumn(32).width = 20;
    worksheet.getColumn(33).width = 20;
    worksheet.getColumn(34).width = 20;
    worksheet.getColumn(35).width = 25;
    worksheet.getColumn(36).width = 30;
    worksheet.getColumn(37).width = 20;
    worksheet.getColumn(38).width = 40;
    worksheet.getColumn(39).width = 20;
    worksheet.getColumn(40).width = 20;
    worksheet.getColumn(41).width = 20;
    worksheet.getColumn(42).width = 20;
    worksheet.getColumn(43).width = 20;
    worksheet.getColumn(44).width = 20;
    worksheet.getColumn(45).width = 20;
    worksheet.getColumn(46).width = 20;
    worksheet.getColumn(47).width = 20;
    worksheet.getColumn(48).width = 20;
    worksheet.getColumn(49).width = 20;
    worksheet.getColumn(50).width = 20;
    worksheet.getColumn(51).width = 20;

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
    worksheet.mergeCells(`A${footerRow.number}:AW${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = ('Vendor Bill ' + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })


  }

  arrayOne(n: number): any[] {
    return Array(n);
  }
  loadTemplate(type, VendorInvoiceId, IsDeleted) {
    switch (type) {
      case "view":
        this.PartItem = []
        this.spinner.show();
        var postData = {
          VendorInvoiceId: VendorInvoiceId,
          IsDeleted: IsDeleted
        }
        this.service.postHttpService(postData, "getVendorInvoiceView").subscribe(response => {
          if (response.status == true) {
            this.result = response.responseData;
            this.VendorInvoiceInfo = this.result.VendorInvoiceInfo[0] || "";
            this.VendorInvoiceItem = this.result.VendorInvoiceItem;
            this.VendorAddress = this.result.ContactAddress[0] || ""
            this.Vendorinvoice_notes = Vendorinvoice_notes;
            this.NotesList = this.result.NotesList
            this.faxVendorAddress = this.VendorAddress.Fax
            this.PhoneVendorAddress = this.VendorAddress.PhoneNoPrimary;
            this.RRId = this.VendorInvoiceInfo.RRId;
            this.MROId = this.VendorInvoiceInfo.MROId;
            this.VendorInvoiceTypeStyle = Invoice_Type.find(a => a.Invoice_TypeId == this.VendorInvoiceInfo.VendorInvoiceType)
            this.number = this.VendorInvoiceInfo.VendorInvoiceNo
            // this.IsInvoiceApproved = this.VendorInvoiceInfo.IsInvoiceApproved

            if (this.VendorInvoiceInfo.RRId != 0) {
              this.enableVendorApproved = this.VendorInvoiceInfo.IsInvoiceApproved
            }
            else {
              this.enableVendorApproved = this.VendorInvoiceInfo.IsMROInvoiceApproved
            }
            if (this.VendorInvoiceInfo.TermsName == "Credit Card") {
              this.enableVendorApproved = 1;

            }

            for (let x in this.VendorInvoiceItem) {
              if (!this.IsViewCostEnabled) {
                this.VendorInvoiceItem[x].Rate = CONST_COST_HIDE_VALUE;
                this.VendorInvoiceItem[x].Price = CONST_COST_HIDE_VALUE;
              }
            }
            if (!this.IsViewCostEnabled) {
              this.VendorInvoiceInfo.SubTotal = CONST_COST_HIDE_VALUE;
              this.VendorInvoiceInfo.AHFees = CONST_COST_HIDE_VALUE;
              this.VendorInvoiceInfo.TotalTax = CONST_COST_HIDE_VALUE;
              this.VendorInvoiceInfo.Discount = CONST_COST_HIDE_VALUE;
              this.VendorInvoiceInfo.Shipping = CONST_COST_HIDE_VALUE;
              this.VendorInvoiceInfo.GrandTotal = CONST_COST_HIDE_VALUE;
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
        this.router.navigate(['./admin/invoice/vendor-invoice-edit'], { state:{VendorInvoiceId: VendorInvoiceId} });
        break;
      case "add":
        const years = Number(this.datePipe.transform(this.Currentdate, 'yyyy'));
        const Month = Number(this.datePipe.transform(this.Currentdate, 'MM'));
        const Day = Number(this.datePipe.transform(this.Currentdate, 'dd'));
        this.model.InvoiceDate = {
          year: years,
          month: Month,
          day: Day
        }

        let DueDateFromSettings = new Date(new Date().getTime() + this.settingsView.VendorBillLeadTime * 24 * 60 * 60 * 1000);

        const dueyears = Number(this.datePipe.transform(DueDateFromSettings, 'yyyy'));
        const dueMonth = Number(this.datePipe.transform(DueDateFromSettings, 'MM'));
        const dueDay = Number(this.datePipe.transform(DueDateFromSettings, 'dd'));
        this.model.DueDate = {
          year: dueyears,
          month: dueMonth,
          day: dueDay
        }
        this.model.VendorId = null
        this.model.VendorName = "";
        this.model.ReferenceNo = "";
        this.model.VendorInvoiceType = undefined
        this.SubTotal = "";
        this.Shipping = "0";
        this.Discount = "0";
        this.AHFees = "0";
        this.GrandTotal = "";
        this.TotalTax = "";
        this.PartItem = [];
        this.model.Status = "0"
        this.templateSettings = this.addTemplate;
        break;
      default:
        this.templateSettings = this.viewTemplate;
        break;
    }
  }


  onApprovedVendorInvoice() {
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
          "VendorInvoiceId": this.VendorInvoiceId
        }
        this.service.postHttpService(postData, 'ApprovedVendorInvoice').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Approved Invoice!',
              text: 'Vendor Bill Approved has been Updated.',
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
          title: 'Cancelled',
          text: 'Vendor Bill Approved has not Updated.',
          type: 'error'
        });
      }
    });
  }
  // onSendEmail(VendorInvoiceId){
  //   this.VendorInvoiceList.push({
  //     VendorInvoiceId
  //   })
  // }

  //   onSendEmailFromList() {
  //     if(this.VendorInvoiceList.length==""){
  //       this.ResponseMessage="Please Select the Below Vendor Bill List before Email"
  //     }else{
  //     var postData = {
  //       "VendorInvoiceList": this.VendorInvoiceList
  //     }
  //     this.commonService.postHttpService(postData, "SendEmailFromCVendorInvoiceList").subscribe(response => {
  //       if (response.status == true) {
  //         Swal.fire({
  //           title: 'Success!',
  //           text: 'Email Sent Successfully!',
  //           type: 'success',
  //           confirmButtonClass: 'btn btn-confirm mt-2'
  //         });
  //         this.reLoad();
  //       }
  //       else {
  //         Swal.fire({
  //           title: 'Error!',
  //           text: 'Email could not be Sent!',
  //           type: 'warning',
  //           confirmButtonClass: 'btn btn-confirm mt-2'
  //         });
  //       }
  //       this.cd_ref.detectChanges();
  //     }, error => console.log(error));
  //   }
  //   }

  InvoiceDateToFormat(InvoiceDateTo) {
    const InvoiceDateToYears = InvoiceDateTo.year;
    const InvoiceDateToDates = InvoiceDateTo.day;
    const InvoiceDateTomonths = InvoiceDateTo.month;
    let InvoiceDateToDate = new Date(InvoiceDateToYears, InvoiceDateTomonths - 1, InvoiceDateToDates);
    this.InvoiceDateToDate = moment(InvoiceDateToDate).format('YYYY-MM-DD');
  }
  InvoiceDateFormat(InvoiceDate) {
    const InvoiceDateYears = InvoiceDate.year;
    const InvoiceDateDates = InvoiceDate.day;
    const InvoiceDatemonths = InvoiceDate.month;
    let InvoiceDateDate = new Date(InvoiceDateYears, InvoiceDatemonths - 1, InvoiceDateDates);
    this.InvoiceDateDate = moment(InvoiceDateDate).format('YYYY-MM-DD')
  }


  DueDateToFormat(DueDateTo) {
    const DueDateToYears = DueDateTo.year;
    const DueDateToDates = DueDateTo.day;
    const DueDateTomonths = DueDateTo.month;
    let DueDateToDate = new Date(DueDateToYears, DueDateTomonths - 1, DueDateToDates);
    this.DueDateToDate = moment(DueDateToDate).format('YYYY-MM-DD');
  }
  DueDateFormat(DueDate) {
    const DueDateYears = DueDate.year;
    const DueDateDates = DueDate.day;
    const DueDatemonths = DueDate.month;
    let DueDateDate = new Date(DueDateYears, DueDatemonths - 1, DueDateDates);
    this.DueDateDate = moment(DueDateDate).format('YYYY-MM-DD')
  }
  onFilter(event) {
    var vendorid = ""
    var vendorName = ""
    if (this.VendorId == '') {
      vendorid = ""
      vendorName = this.VendorName
    }
    else if (this.VendorId != "") {
      vendorid = this.VendorId
      vendorName = ''
    }
    var rrid = ""
    var RRNo = ""
    if (this.RRIdFilter == '' || this.RRIdFilter == undefined || this.RRIdFilter == null) {
      rrid = ""
      RRNo = this.RRNo
    }
    else if (this.RRIdFilter != "") {
      rrid = this.RRIdFilter
      RRNo = ''
    }
    let obj = this
    var table = $('#datatable-vinvoice').DataTable();
    table.columns(6).search(RRNo);
    table.columns(3).search(this.Status);
    table.columns(4).search(this.InvoiceDateDate);
    table.columns(7).search(this.InvoiceDateToDate);
    table.columns(1).search(this.VendorInvoiceNo);
    table.columns(12).search(this.PONo);
    table.columns(8).search(this.DueDateDate);
    table.columns(9).search(this.DueDateToDate);
    table.columns(10).search(vendorid)
    table.columns(11).search(this.VendorInvoiceType)
    table.columns(13).search(this.IsCSVProcessed)
    table.columns(14).search(rrid)
    table.columns(2).search(vendorName)
    table.columns(15).search(this.CustomerInvoiceApproved)
    table.columns(16).search(this.VendorBillApproved)

    table.draw();
    this.showSearch = false;

  }
  onClear(event) {
    var table = $('#datatable-vinvoice').DataTable();
    this.RRNo = '';
    this.Status = '';
    this.InvoiceDate = "";
    this.InvoiceDateTo = "";
    this.InvoiceDateDate = '';
    this.VendorInvoiceNo = "";
    this.InvoiceDateToDate = "";
    this.PONo = "";
    this.DueDateDate = "";
    this.DueDate = "";
    this.DueDateTo = "";
    this.DueDateToDate = "";
    this.VendorInvoiceType = "";
    this.VendorId = ""
    this.IsCSVProcessed = ""
    this.checkedList = []
    var vendorid = ""
    var vendorName = "";
    var rrid = ""
    var RRNo = "";
    this.RRIdFilter = '';
    this.VendorName = ''
    this.CustomerInvoiceApproved = "";
    this.VendorBillApproved = ""
    this.RRId = ""
    table.columns(6).search(RRNo);
    table.columns(3).search(this.Status);
    table.columns(4).search(this.InvoiceDateDate);
    table.columns(7).search(this.InvoiceDateToDate);
    table.columns(1).search(this.VendorInvoiceNo);
    table.columns(12).search(this.PONo);
    table.columns(8).search(this.DueDateDate);
    table.columns(9).search(this.DueDateToDate);
    table.columns(10).search(vendorid)
    table.columns(11).search(this.VendorInvoiceType)
    table.columns(13).search(this.IsCSVProcessed)
    table.columns(14).search(rrid)
    table.columns(2).search(vendorName)
    table.columns(15).search(this.CustomerInvoiceApproved)
    table.columns(16).search(this.VendorBillApproved)
    table.draw();
    this.showSearch = false;
    this.VendorInvoiceType = undefined;
    this.Status = undefined;
    this.reLoad();

  }
  EnableSearch() {
    this.showSearch = true;
  }

  reLoad() {
    this.router.navigate([this.currentRouter.split('?')[0]], { queryParams: { VendorInvoiceId: this.VendorInvoiceId } })
  }
  getVendorList() {
    this.service.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
    });
  }
  getPartList() {
    this.service.getHttpService('getPartListDD').subscribe(response => {
      this.partList = response.responseData
    });
  }

  getVendorProperties(VendorId) {

    let obj = this
    var VendorDetails = obj.vendorList.filter(function (value) {
      if (value.VendorId == VendorId) {
        return value
      }
    }, obj);
    this.model.VendorName = VendorDetails[0].VendorName;
    this.model.TermsId = VendorDetails[0].TermsId


  }

  backToRRView() {
    this.router.navigate(['/admin/repair-request/edit'], { state: { RRId: this.VendorInvoiceInfo.RRId } });
  }
  backToMROView() {
    this.router.navigate(['/admin/mro/edit'], { state: { MROId: this.VendorInvoiceInfo.MROId } });
  }

  addItem(AddItem) {
    this.model.PONo = "";
    this.POList = [];
    this.modalService.open(AddItem, { centered: true, size: 'xl' });


  }

  hideAddress: boolean = true
  generatePDF() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Vendor Invoice ${this.number}.pdf`);
    })
  }

  generatePrint(){
    this.getPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
    const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    })
  }
  getPdfBase64(cb) {
    this.spinner.show();
    this.service.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        VendorInvoiceInfo: this.VendorInvoiceInfo,
        number: this.number,
        VendorAddress: this.VendorAddress,
        VendorInvoiceItem: this.VendorInvoiceItem,
        IsNotesEnabled: this.IsNotesEnabled,
        settingsView: this.settingsView,
        NotesList: this.NotesList,
        RRId: this.RRId,
        Logo: base64
      }

      this.service.postHttpService({ pdfObj }, "getVIPdfBase64").subscribe(response => {
        if (response.status == true) {
          cb(response.responseData.pdfBase64);
          this.spinner.hide();
        }
      });
    })
  }

  removePartItem(i) {
    this.PartItem.splice(i, 1);
    this.changeStatus(i)

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


  calculateBeforePrice() {
    var price = 0; var subTotal = 0;
    for (var i = 0; i < this.PartItem.length; i++) {
      let Quantity = this.PartItem[i].Quantity || 0;
      let Rate = this.PartItem[i].Rate || 0;

      // Calculate the price
      price = parseFloat(Quantity) * parseFloat(Rate);
      this.PartItem[i].Price = price
    }
    for (let i = 0; i < this.PartItem.length; i++) {
      subTotal += this.PartItem[i].Price

    }
    //Calculate the subtotal
    this.SubTotal = subTotal;

    this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }

  onItemSubmit() {
    this.submitted = true;


    this.PartItem = this.checkedCategoryList.concat(this.PartItem);
    this.modalService.dismissAll();
    this.calculateBeforePrice()

  }


  checkUncheckAll() {
    for (var i = 0; i < this.POList.length; i++) {
      this.POList[i].isSelected = this.isMasterSel;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.isMasterSel = this.POList.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedCategoryList = [];
    for (var i = 0; i < this.POList.length; i++) {
      if (this.POList[i].isSelected)
        this.checkedCategoryList.push(this.POList[i]);
    }

  }

  SearchPONo() {
    var postData = {
      PONo: this.model.PONo,
    }
    this.service.postHttpService(postData, "getPONOList").subscribe(response => {
      if (response.status == true) {
        this.POList = response.responseData;

        this.POList.forEach(function (element) {
          element.isSelected = false;
        });
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  onSubmit(f: NgForm) {
    this.submitted = true;

    //DateRequested
    const reqYears = this.model.InvoiceDate.year
    const reqDates = this.model.InvoiceDate.day;
    const reqmonths = this.model.InvoiceDate.month;
    let requestDates = new Date(reqYears, reqmonths - 1, reqDates);
    let DateRequested = moment(requestDates).format('YYYY-MM-DD');
    //DueDate
    const dueYears = this.model.DueDate.year;
    const dueDates = this.model.DueDate.day;
    const duemonths = this.model.DueDate.month;
    let dueDate = new Date(dueYears, duemonths - 1, dueDates);
    let DueDate = moment(dueDate).format('YYYY-MM-DD');
    if (f.valid) {
      this.btnDisabled = true;
      var postData = {
        "InvoiceDate": DateRequested,
        "DueDate": DueDate,
        "VendorId": this.model.VendorId,
        "ReferenceNo": this.model.ReferenceNo,
        "VendorName": this.model.VendorName,
        "VendorInvoiceType": this.model.VendorInvoiceType,
        "VendorInvNo": this.model.VendorInvNo,
        "TermsId": this.model.TermsId,
        "RRId": "0",
        "POId": "0",
        "SubTotal": this.SubTotal,
        "TotalTax": this.TotalTax,
        "Discount": this.Discount,
        "AHFees": this.AHFees,
        "Shipping": this.Shipping,
        "TaxPercent": this.TaxPercent,
        "GrandTotal": this.GrandTotal,
        "Status": this.model.Status,
        "VendorInvoiceItem": this.PartItem


      }
      this.service.postHttpService(postData, "VendorInvoiceCreate").subscribe(response => {
        if (response.status == true) {
          this.templateSettings = this.viewTemplate;

          Swal.fire({
            title: 'Success!',
            text: 'Vendor Bill Created Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          this.reLoad();
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Vendor Bill  could not be Created!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
    else {
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });

    }
  }


  DeleteVendorInvoice() {
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
          VendorInvoiceId: this.VendorInvoiceId,
        }
        this.service.postHttpService(postData, 'DeleteVendorInvoice').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Vendor Bill has been deleted.',
              type: 'success'
            });
          this.router.navigate(['/admin/VendorBill-List'])
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Vendor Bill is safe:)',
          type: 'error'
        });
      }
    });

  }

  onbackToList() {
    this.navCtrl.navigate('admin/VendorBill-List');
  }

  //AutoComplete for RR
  selectRREvent($event) {
    this.RRIdFilter = $event.RRId;
  }

  onChangeRRSearch(val: string) {

    if (val) {
      this.isLoadingRR = true;
      var postData = {
        "RRNo": val
      }
      this.service.postHttpService(postData, "RRNoAotoSuggest").subscribe(response => {
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

  //AutoComplete for Vendor
  selectVendorEvent($event) {
    this.VendorId = $event.VendorId;
  }

  onChangeVendorSearch(val: string) {

    if (val) {
      this.isLoadingVendor = true;
      var postData = {
        "Vendor": val
      }
      this.service.postHttpService(postData, "getAllAutoCompleteofVendor").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.VendorsList = data.filter(a => a.VendorName.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingVendor = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingVendor = false; });

    }
  }
}

