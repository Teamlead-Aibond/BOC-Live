/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, Input, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import {
  warranty_list, Invoice_Status, terms, invoice_notes, CONST_IDENTITY_TYPE_INVOICE, Customer_Invoice_Status,
  CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, CONST_AH_Group_ID, attachment_thumb_images, CONST_ShipAddressType, CONST_BillAddressType, Invoice_Type, Const_Alert_pop_message, Const_Alert_pop_title,
} from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { AddRrPartsComponent } from '../../common-template/add-rr-parts/add-rr-parts.component';
import { EmailComponent } from '../../common-template/email/email.component';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { NgForm } from '@angular/forms';
import { InvoicePrintComponent } from '../../common-template/invoice-print/invoice-print.component';
import { CustomerReferenceComponent } from '../../common-template/customer-reference/customer-reference.component';
import { UploadEDIComponent } from '../../common-template/upload-edi/upload-edi.component';

@Component({
  selector: 'app-list-invoice',
  templateUrl: './list-invoice.component.html',
  styleUrls: ['./list-invoice.component.scss'],
  providers: [
    NgxSpinnerService
  ],
})
export class ListInvoiceComponent implements OnInit {
  @ViewChild(InvoicePrintComponent, null) printComponent: InvoicePrintComponent;

  baseUrl = `${environment.api.apiURL}`;
  keywordForCustomer = 'CompanyName';
  customerList: any = [];
  isLoadingCustomer: boolean = false;
  CompanyName;
  keywordForRR = 'RRNo';
  RRList: any[]
  RRId = ''
  isLoadingRR: boolean = false;
  Currentdate = new Date();
  btnDisabled: boolean = false;
  showSearch: boolean = true;
  invoice_notes;
  NotesList;
  ResponseMessage;
  submitted = false;
  ShippingHistory;
  CONST_AH_Group_ID;
  customerReferenceList;
  @Input() templateSettings: TemplateRef<HTMLElement>;
  @ViewChild('viewTemplate', null) viewTemplate: TemplateRef<HTMLElement>;
  // @ViewChild('viewTemplate', { static: false }) viewTemplate: TemplateRef<HTMLElement>;
  @ViewChild('editTemplate', { static: false }) editTemplate: TemplateRef<HTMLElement>;
  @ViewChild('addTemplate', { static: false }) addTemplate: TemplateRef<HTMLElement>;
  //ServerSide List
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  api_check: any;
  dataTable: any;
  dataTableMessage;
  @ViewChild('dataTable', { static: true }) table;
  InvoiceId;
  result: any = [];
  faxBillingAddress;
  PhoneBillingAddress;
  checkedList: any = [];

  //view
  InvoiceInfo;
  BillingAddress;
  ContactAddress;
  attachmentThumb;
  InvoiceItem: any = [];
  CustomerRef: any = [];
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
  AdvanceAmount;
  number;
  IsCSVProcessed;
  //Filter
  RRNo;
  InvoiceNo;
  CustomerId;
  CustomerPONo;
  InvoiceType;
  Status;
  InvoiceDateToDate
  InvoiceDateDate;
  DueDateToDate;
  DueDateDate;
  InvoiceDate;
  InvoiceDateTo;
  DueDateTo;
  DueDate;
  //ADD
  model: any = [];
  partList: any = [];
  customerPartList: any = [];
  partNewList: any = [];
  AddressList;
  ShippingAddressList: any = []; BillingAddressList: any = [];
  ShipAddress: any = []; BillAddress: any = []
  TermsList;
  warrantyList;
  Customer_Invoice_Status;
  customerAddressList;
  PartItem: any = []
  InvoiceList: any = [];
  AttachmentList: any = []
  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;
  IsPrintPDFEnabled;
  IsEmailEnabled;
  IsExcelEnabled;
  IsNotesEnabled;
  IsApproveEnabled;
  ExcelData;
  keyword = 'PartNo';
  filteredData: any[];
  isLoading: boolean = false;
  data = [];
  settingsView;
  InvoiceTypeStyle;
  CSVData;
  CustomerInvoiceApproved;
  VendorBillApproved;
  ListHidden: boolean = false;
  showList: boolean = true;
  IsDeleted: string;
  IsDeletedValue
  ReopenInvoice
  UploadInvoiceCSVEDI
  IsCancelInvoiceEnabled
  IsPDFWithoutTax;
  constructor(private http: HttpClient, public router: Router, private spinner: NgxSpinnerService, public navCtrl: NgxNavigationWithDataComponent,
    private modalService: NgbModal, private commonService: CommonService, private cd_ref: ChangeDetectorRef, private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, private datePipe: DatePipe, private route: ActivatedRoute) { }
  currentRouter = decodeURIComponent(this.router.url);

  ngOnInit(): void {
    document.title = 'Invoice View'

    if (history.state.InvoiceId == undefined) {
      this.route.queryParams.subscribe(
        params => {
          this.InvoiceId = params['InvoiceId'];
          //this.showList = params['showList'] == 1;
          this.IsDeleted = params['IsDeleted'];
        }
      )
    }
    else if (history.state.InvoiceId != undefined) {
      this.InvoiceId = history.state.InvoiceId
    }
    // this.showList = history.state.showList;
    //this.IsDeleted = history.state.IsDeleted;
    this.attachmentThumb = attachment_thumb_images;
    if (this.IsDeleted == '1') {
      this.IsDeletedValue = 1
    }
    else {
      this.IsDeletedValue = 0
    }

    // if (this.showList == true) {
    //   this.ListHidden = false
    this.loadTemplate('view', this.InvoiceId, this.IsDeletedValue)

    // } else {
    //   this.ListHidden = true;
    //   const httpOptions = {
    //     headers: new HttpHeaders({
    //       'Content-Type': 'application/json',
    //       'Authorization': `${localStorage.getItem("Access-Token")}`
    //     })
    //   };

    //   var url = this.baseUrl + '/api/v1.0/invoice/getInvoiceListByServerSide';
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
    //           if (this.InvoiceId == undefined) {

    //             this.InvoiceId = resp.responseData.data[0].InvoiceId;
    //           }
    //           if (this.InvoiceId == null) {

    //             this.InvoiceId = resp.responseData.data[0].InvoiceId;
    //           }
    //           this.loadTemplate('view', this.InvoiceId, this.IsDeleted)
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
    //         data: 'InvoiceId', name: 'InvoiceId', defaultContent: '', orderable: true, searchable: true,
    //         render: (data: any, type: any, row: any, meta) => {

    //           var cstyle = '';
    //           switch (row.Status) {
    //             case 0: { cstyle = 'badge-info'; status = "Draft"; break; }
    //             case 1: { cstyle = 'badge-warning'; status = "Open"; break; }
    //             case 2: { cstyle = 'badge-success'; status = "Approved"; break; }
    //             case 3: { cstyle = 'badge-danger'; status = "Cancelled"; break; }
    //             case 4: { cstyle = 'badge-purple'; status = "Unpaid"; break; }
    //             case 5: { cstyle = 'badge-secondary'; status = "Partially Paid"; break; }
    //             case 6: { cstyle = 'badge-pink'; status = "Paid"; break; }
    //             case 7: { cstyle = 'badge-primary'; status = "ReOpened"; break; }


    //             default: { cstyle = ''; break; }
    //           }
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
    //             number = row.InvoiceNo;
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
    //           var IsEmailSent = '';
    //           if (row.IsEmailSent) {
    //             IsEmailSent = '<i  class="mdi mdi-email-outline red mailsent"></i>';
    //           }

    //           var checkbox = '';
    //           // if (row.Status == 1) {
    //           checkbox = '<input type="checkbox" class="checkbox">&nbsp;';
    //           //}

    //           if (!this.IsViewCostEnabled) {
    //             row.GrandTotal = CONST_COST_HIDE_VALUE;
    //           }
    //           return '<p>' + checkbox + row.CompanyName + `<span style="float:right;">$${row.GrandTotal}</span>` + '</p><a style="cursor:pointer" class="IDHREF"><span style="background:#ececec;padding:1px 5px;margin-right:2px;" >#' + number + '</span></a>&nbsp;|&nbsp;<span class="order-date">' + row.InvoiceDate + '</span> <span style="float:right" class="badge ' + cstyle + ' btn-xs">' + status + '</span><br><span class="pink" style="padding:1px 5px;margin-right:2px;">' + row.DueDate + '</span>&nbsp;|&nbsp; ' + daystext + '  <span style="float:right" class="btn-xs" ngbTooltip="Email Sent">' + IsEmailSent + '</span> </a>';

    //         },
    //       },
    //       { data: 'InvoiceNo', name: 'InvoiceNo', orderable: true, searchable: true, },
    //       { data: 'CompanyName', name: 'CompanyName', orderable: true, searchable: true, },
    //       { data: 'Status', name: 'Status', orderable: true, searchable: true, },
    //       { data: 'InvoiceDate', name: 'InvoiceDate', orderable: true, searchable: true, },
    //       { data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true, },
    //       { data: 'RRNo', name: 'RRNo', orderable: true, searchable: true, },
    //       { data: 'CustomerPONo', name: 'CustomerPONo', orderable: true, searchable: true, },
    //       { data: 'InvoiceDateTo', name: 'InvoiceDateTo', orderable: true, searchable: true, },
    //       { data: 'DueDate', name: 'DueDate', orderable: true, searchable: true, },
    //       { data: 'DueDateTo', name: 'DueDateTo', orderable: true, searchable: true, },
    //       { data: 'CustomerId', name: 'CustomerId', orderable: true, searchable: true, },
    //       { data: 'InvoiceType', name: 'InvoiceType', orderable: true, searchable: true, },
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
    //         this.loadTemplate("view", data.InvoiceId, this.IsDeleted);
    //         this.InvoiceId = data.InvoiceId

    //       });
    //       $('.checkbox', row).unbind('click');
    //       $('.checkbox', row).bind('click', (e) => {
    //         this.onSendEmail(data.InvoiceId)
    //         this.onExcelData(data.InvoiceId)
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

    //   this.dataTable = $('#datatable-invoice');
    //   this.dataTable.DataTable(this.dtOptions);
    // }

    this.settingsView = ""
    this.getAdminSettingsView();

    this.NotesList = [];
    this.InvoiceTypeStyle = ""
    this.InvoiceInfo = "";
    this.ContactAddress = "";
    this.BillingAddress = "";
    this.InvoiceItem = [];
    this.CustomerRef = [];
    this.AttachmentList = []
    this.ShippingHistory = ""
    this.warrantyList = warranty_list;
    this.Customer_Invoice_Status = Customer_Invoice_Status;
    this.getTermList();
    this.Shipping = "0";
    this.Discount = "0";
    this.AHFees = "0";

    this.IsViewEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_DELETE_ACCESS);
    this.IsViewCostEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_VIEW_COST_ACCESS);
    this.IsApproveEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_APPROVE_ACCESS);
    this.IsPrintPDFEnabled = this.commonService.permissionCheck("INVPrintAndPDFExport", CONST_VIEW_ACCESS);
    this.IsEmailEnabled = this.commonService.permissionCheck("INVEmail", CONST_VIEW_ACCESS);
    this.IsExcelEnabled = this.commonService.permissionCheck("INVDownloadExcel", CONST_VIEW_ACCESS);
    this.IsNotesEnabled = this.commonService.permissionCheck("INVNotes", CONST_VIEW_ACCESS);
    this.ReopenInvoice = this.commonService.permissionCheck("ReopenInvoice", CONST_VIEW_ACCESS);
    this.UploadInvoiceCSVEDI = this.commonService.permissionCheck("UploadInvoiceCSVEDI", CONST_VIEW_ACCESS);
    this.IsCancelInvoiceEnabled = this.commonService.permissionCheck("CancelInvoice", CONST_VIEW_ACCESS);
    this.IsPDFWithoutTax = this.commonService.permissionCheck("InvoicePDFWithoutTax", CONST_VIEW_ACCESS);
  }
  onReOpenInvoice() {
    if (this.InvoiceInfo.Consolidated != 1) {
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
            "InvoiceId": this.InvoiceId
          }
          this.commonService.postHttpService(postData, 'ReOpenInvoice').subscribe(response => {
            if (response.status == true) {
              Swal.fire({
                title: 'ReOpen Invoice!',
                text: 'Invoice ReOpen has been Updated.',
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
            text: 'Invoice ReOpen has not Updated.',
            type: 'error'
          });
        }
      });
    } else {
      Swal.fire({
        type: 'info',
        text: 'The Invoice is added into Consolidated. Please remove from consolidate to Reopen the Invoice',
        title: 'Message',
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }

  }
  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData.map(function (value) {
        return { title: value.CompanyName, "CustomerId": value.CustomerId }
      });
    });
  }
  getTermList() {
    this.commonService.getHttpService("getTermsList").subscribe(response => {
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
  hideAddress: boolean = true
  generatePDF() {
    this.printComponent.onParentPrintClick();
  }
  generateWithoutTaxPDF() {
    this.printComponent.onParentWithoutTaxPrintClick();
  }
  generateCSV() {
    this.printComponent.onParentCSVClick((json) => {
      if (json) {
        if (json.status == false) {
          Swal.fire({
            title: 'Error!',
            text: json.message ? json.message : 'Something went wrong!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        } else {
          this.downloadFile(json)
          Swal.fire({
            title: 'Success!',
            text: 'CSV downloaded Successfully and also stored in backend "edi" folder!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
      }
      else {
        Swal.fire({
          title: 'Error!',
          text: 'CSV could not be downloaded!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }

    });
  }

  autoUploadCSV() {
    this.spinner.show();
    this.printComponent.onParentAutoUploadCSVClick((json) => {
      this.spinner.hide();
      if (json.success == true) {
        Swal.fire({
          title: 'Success!',
          text: 'EDI Auto Uploaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      } else if (json.success == false) {
        Swal.fire({
          title: 'Error!',
          text: json.errors && json.errors[0] ? json.errors[0] : 'EDI could not be auto uploaded. Please try manually!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        if (json.json && json.json.status == false) {
          Swal.fire({
            title: 'Error!',
            text: json.json && json.json.message ? json.json.message : 'EDI could not be auto uploaded. Please try manually!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'EDI could not be auto uploaded. Please try manually!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }

      }

    });
  }

  downloadFile(json) {
    // const blob = new Blob([data], { type: 'text/csv' });
    // const url= window.URL.createObjectURL(blob);
    let sampleJson: any = json
    let a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    let csvData = this.ConvertToCSV(sampleJson);
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy-hh-mm-ss")
    var InvId = json[0]['Invoice No']
    var filename = (InvId + '-' + currentDate + '.csv')
    a.download = filename;
    a.click()
  }


  generatePrint() {
    this.printComponent.onParentprint();
  }
  loadTemplate(type, InvoiceId, IsDeleted) {
    switch (type) {
      case "view":
        this.PartItem = [];
        this.ShippingHistory = ""

        this.spinner.show();

        var postData = {
          InvoiceId: InvoiceId,
          IsDeleted: IsDeleted
        }
        this.commonService.postHttpService(postData, "getInvoiceView").subscribe(response => {
          if (response.status == true) {
            this.spinner.hide()

            this.result = response.responseData;
            this.InvoiceInfo = this.result.InvoiceInfo[0] || "";
            this.NotesList = this.result.NotesList;
            this.BillingAddress = this.result.BillingAddressInfo[0] || "";
            this.ContactAddress = this.result.ContactAddressInfo[0] || "";
            this.InvoiceItem = this.result.InvoiceItem;
            this.CustomerRef = this.result.CustomerRef;
            this.RRId = this.InvoiceInfo.RRId
            this.faxBillingAddress = this.BillingAddress.Fax
            this.PhoneBillingAddress = this.BillingAddress.Phone;
            if ("LastShippingHistory" in this.result) {
              this.ShippingHistory = this.result.LastShippingHistory[0] || "";
            }
            else {
              this.ShippingHistory = "";
            }
            this.CONST_AH_Group_ID = CONST_AH_Group_ID;
            this.AttachmentList = this.result.AttachmentList;
            this.invoice_notes = invoice_notes;
            this.InvoiceTypeStyle = Invoice_Type.find(a => a.Invoice_TypeId == this.InvoiceInfo.InvoiceType)
            this.number = this.InvoiceInfo.InvoiceNo


            // if (this.InvoiceInfo.RRId != 0) {
            //   this.number = this.InvoiceInfo.RRNo
            // }
            // else {
            //   this.number = this.InvoiceInfo.InvoiceNo
            // }

            for (let x in this.InvoiceItem) {
              if (!this.IsViewCostEnabled) {
                this.InvoiceItem[x].Rate = CONST_COST_HIDE_VALUE;
                this.InvoiceItem[x].Price = CONST_COST_HIDE_VALUE;
              }
            }
            if (!this.IsViewCostEnabled) {
              this.InvoiceInfo.SubTotal = CONST_COST_HIDE_VALUE;
              this.InvoiceInfo.AHFees = CONST_COST_HIDE_VALUE;
              this.InvoiceInfo.TotalTax = CONST_COST_HIDE_VALUE;
              this.InvoiceInfo.Discount = CONST_COST_HIDE_VALUE;
              this.InvoiceInfo.Shipping = CONST_COST_HIDE_VALUE;
              this.InvoiceInfo.GrandTotal = CONST_COST_HIDE_VALUE;
            }



          }
          else {

          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
        this.templateSettings = this.viewTemplate;
        break;
      case "edit":
        this.router.navigate(['./admin/invoice/edit'], { state: { InvoiceId: InvoiceId } });
        break;
      case "add":
        this.PartItem = [{
          'Part': '',
          "PartId": '',
          "PartNo": "",
          "Description": "",
          "Quantity": "",
          "Rate": "",
          "Discount": "",
          "Tax": "",
          "Price": "",
          "LeadTime": "",
          "WarrantyPeriod": "",
          "DeliveryDate": "",
          "AllowShipment": "",
          "Notes": "",
          "ItemStatus": ""
        }];
        const years = Number(this.datePipe.transform(this.Currentdate, 'yyyy'));
        const Month = Number(this.datePipe.transform(this.Currentdate, 'MM'));
        const Day = Number(this.datePipe.transform(this.Currentdate, 'dd'));
        this.model.RequestedDate = {
          year: years,
          month: Month,
          day: Day
        }

        let DueDateFromSettings = new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000);

        const dueyears = Number(this.datePipe.transform(DueDateFromSettings, 'yyyy'));
        const dueMonth = Number(this.datePipe.transform(DueDateFromSettings, 'MM'));
        const dueDay = Number(this.datePipe.transform(DueDateFromSettings, 'dd'));
        this.model.DueDate = {
          year: dueyears,
          month: dueMonth,
          day: dueDay
        }
        this.model.InvoiceStatus = "0";
        this.model.CustomerId = null;
        this.model.InvoiceType = undefined;
        this.model.TermsId = undefined;
        this.model.bi_BillCodeId = null;
        this.model.sh_ShipCodeId = null;
        this.model.SONo = "";
        this.model.ReferenceNo = "";
        this.model.CustomerPONo = "";
        this.SubTotal = "";
        this.TotalTax = "";
        this.GrandTotal = ""
        this.AddReference();
        this.getCustomerList();

        // this.model=[]
        this.templateSettings = this.addTemplate;
        break;
      default:
        this.templateSettings = this.viewTemplate;
        break;
    }
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
  onSendEmail(InvoiceId) {
    this.InvoiceList.push({
      InvoiceId
    })
  }

  onSendEmailFromList() {
    if (this.InvoiceList.length == "") {
      this.ResponseMessage = "Please Select the Below Invoice List before Email"
    } else {
      var postData = {
        "InvoiceList": this.InvoiceList
      }
      this.commonService.postHttpService(postData, "SendEmailFromInvoiceList").subscribe(response => {
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
    var table = $('#datatable-invoice').DataTable();
    table.columns(6).search(RRNo);
    table.columns(2).search(CustomerName);
    table.columns(3).search(this.Status);
    table.columns(4).search(this.InvoiceDateDate);
    table.columns(8).search(this.InvoiceDateToDate);
    table.columns(1).search(this.InvoiceNo);
    table.columns(7).search(this.CustomerPONo);
    table.columns(9).search(this.DueDateDate);
    table.columns(10).search(this.DueDateToDate);
    table.columns(11).search(Customerid)
    table.columns(12).search(this.InvoiceType)
    table.columns(13).search(this.IsCSVProcessed)
    table.columns(14).search(rrid)
    table.columns(15).search(this.CustomerInvoiceApproved)
    table.columns(16).search(this.VendorBillApproved)
    table.draw();
    this.showSearch = false;

  }
  onClear(event) {
    var table = $('#datatable-invoice').DataTable();
    this.RRNo = '';
    this.Status = '';
    this.InvoiceDate = "";
    this.InvoiceDateTo = "";
    this.InvoiceDateDate = '';
    this.InvoiceNo = "";
    this.CustomerId = "";
    this.InvoiceDateToDate = "";
    this.CustomerPONo = "";
    this.DueDateDate = "";
    this.DueDate = "";
    this.DueDateTo = "";
    this.DueDateToDate = "";
    this.InvoiceType = "";
    this.IsCSVProcessed = "";
    this.checkedList = [];
    var Customerid = ""
    var CustomerName = "";
    var rrid = ""
    var RRNo = "";
    this.CompanyName = ''
    this.CustomerInvoiceApproved = "";
    this.VendorBillApproved = ""
    this.RRId = ''
    table.columns(6).search(RRNo);
    table.columns(2).search(CustomerName);
    table.columns(3).search(this.Status);
    table.columns(4).search(this.InvoiceDateDate);
    table.columns(8).search(this.InvoiceDateToDate);
    table.columns(1).search(this.InvoiceNo);
    table.columns(7).search(this.CustomerPONo);
    table.columns(9).search(this.DueDateDate);
    table.columns(10).search(this.DueDateToDate);
    table.columns(11).search(Customerid)
    table.columns(12).search(this.InvoiceType)
    table.columns(13).search(this.IsCSVProcessed)
    table.columns(14).search(rrid)
    table.columns(15).search(this.CustomerInvoiceApproved)
    table.columns(16).search(this.VendorBillApproved)
    table.draw();
    this.showSearch = false;

    this.CustomerId = null;
    this.InvoiceType = undefined;
    this.Status = undefined;

    this.reLoad();

  }


  onApprovedInvoice() {
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
          "InvoiceId": this.InvoiceId
        }
        this.commonService.postHttpService(postData, 'ApprovedInvoice').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Approved Invoice!',
              text: 'Invoice Approved has been Updated.',
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
          text: 'Invoice Approved has not Updated.',
          type: 'error'
        });
      }
    });

  }



  getCustomerProperties(CustomerId) {
    if (CustomerId == null || CustomerId == "" || CustomerId == 0) {

      return false;
    }
    var postData = { CustomerId: CustomerId };

    var postData1 = {
      "IdentityId": CustomerId,
      "IdentityType": 1,
      "Type": CONST_ShipAddressType

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
      this.model.sh_ShipCodeId = ShippingAddress[0].AddressId;

    })

    var postData2 = {
      "IdentityId": CustomerId,
      "IdentityType": 1,
      "Type": CONST_BillAddressType

    }
    //CustomerAddressLoad
    this.commonService.postHttpService(postData2, 'getAddressList').subscribe(response => {
      this.BillingAddressList = response.responseData;
      this.BillAddress = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });
      //BillingAddress
      let obj = this
      var BillingAddress = obj.BillingAddressList.filter(function (value) {
        if (value.IsBillingAddress == 1) {
          return value.AddressId
        }
      }, obj);
      this.model.bi_BillCodeId = BillingAddress[0].AddressId;



    });

    //referenceList dropdown
    this.commonService.postHttpService(postData, 'getCustomerReferenceListDropdown').subscribe(response => {
      this.customerReferenceList = response.responseData;
    });
    // // Customer Parts List
    // this.partNewList = [];
    // this.partList = [];
    // this.commonService.postHttpService(postData, 'getPartListDropdown').subscribe(response => {
    //   this.partNewList.push({ "PartId": 0, "PartNo": '+ Add New' });
    //   for (var i in response.responseData) {
    //     this.partNewList.push({ "PartId": response.responseData[i].PartId, "PartNo": response.responseData[i].PartNo });
    //   }
    //   this.partList = this.partNewList; console.log('getPartListDropdown', this.partList)
    // });

  }


  onExcelData(InvoiceId) {
    this.checkedList.push({
      InvoiceId
    })
  }

  exportAsXLSX() {
    var postData = {
      "Invoice": this.checkedList,
      "RRNo": this.RRNo,
      "InvoiceNo": this.InvoiceNo,
      "CustomerId": this.CustomerId,
      "CustomerPONo": this.CustomerPONo,
      "InvoiceDate": this.InvoiceDateDate,
      "InvoiceDateTo": this.InvoiceDateToDate,
      "DueDate": this.DueDateDate,
      "DueDateTo": this.DueDateToDate,
      "InvoiceType": this.InvoiceType,
      "Status": this.Status,
      "IsCSVProcessed": this.IsCSVProcessed,
      "DownloadType": "Excel"
    }
    this.commonService.postHttpService(postData, "InvoiceExcel").subscribe(response => {
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
    var postData = {
      "Invoice": this.checkedList,
      "RRNo": this.RRNo,
      "InvoiceNo": this.InvoiceNo,
      "CustomerId": this.CustomerId,
      "CustomerPONo": this.CustomerPONo,
      "InvoiceDate": this.InvoiceDateDate,
      "InvoiceDateTo": this.InvoiceDateToDate,
      "DueDate": this.DueDateDate,
      "DueDateTo": this.DueDateToDate,
      "InvoiceType": this.InvoiceType,
      "Status": this.Status,
      "IsCSVProcessed": this.IsCSVProcessed,
      "DownloadType": "CSV"

    }
    this.commonService.postHttpService(postData, "InvoiceExcel").subscribe(response => {
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
          text: 'CSV could not be downloaded!',
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
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
    var filename = ('Sales Invoice ' + currentDate + '.csv')
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
      var temparray = [];
      for (var key in obj) {
        var value = obj[key];
        temparray.push(value);
      }
      data.push(temparray);
    }

    //Excel Title, Header, Data
    const title = 'Invoice';
    const header = ["Customer ID", "Customer Name", "Invoice/CM #", "Date", "Ship To Name", "Ship to Address-Line One", "Ship to Address-Line Two", "Ship To City", "Ship To State", "Ship to Zipcode", "Ship To Country", "Customer PO", "Ship Date", "Due Date", "Displayed Terms", "Accounts Receivable Account", "Accounts", "Invoice Note", "Number Of Distributions", "Quantity", "SO/Proposal Number", "Item ID", "Description", "G/L Account", "Unit Price", "Tax Type", "Amount"]
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
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 20;
    worksheet.getColumn(12).width = 15;
    worksheet.getColumn(13).width = 15;
    worksheet.getColumn(14).width = 15;
    worksheet.getColumn(15).width = 25;
    worksheet.getColumn(16).width = 15;
    worksheet.getColumn(17).width = 20;
    worksheet.getColumn(18).width = 25;
    worksheet.getColumn(19).width = 15;
    worksheet.getColumn(20).width = 20;
    worksheet.getColumn(21).width = 15;
    worksheet.getColumn(22).width = 30;
    worksheet.getColumn(23).width = 15;
    worksheet.getColumn(24).width = 15;
    worksheet.getColumn(25).width = 15;
    worksheet.getColumn(26).width = 15;
    worksheet.getColumn(27).width = 20;
    worksheet.getColumn(28).width = 20;
    worksheet.getColumn(29).width = 20;
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
    worksheet.mergeCells(`A${footerRow.number}:Z${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = ('Sales Invoice ' + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })


  }

  EnableSearch() {
    this.showSearch = true;
  }


  AddItem() {
    this.PartItem.push({
      'Part': '',
      "PartId": '',
      "PartNo": "",
      "Description": "",
      "Quantity": "",
      "Rate": "",
      "Discount": "",
      "Tax": "",
      "Price": "",
      "LeadTime": "",
      "WarrantyPeriod": "",
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
  backToRRView() {
    this.router.navigate(['/admin/repair-request/edit'], { state: { RRId: this.InvoiceInfo.RRId } });
  }




  selectEvent(item, i) {
    var postData = { PartId: item.PartId };
    this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {
      this.PartItem[i].PartId = response.responseData[0].PartId,
        this.PartItem[i].PartNo = response.responseData[0].PartNo,
        this.PartItem[i].Description = response.responseData[0].Description,
        this.PartItem[i].Quantity = response.responseData[0].Quantity,
        this.PartItem[i].Rate = response.responseData[0].Price
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
    this.router.navigate([this.currentRouter.split('?')[0]], { queryParams: { InvoiceId: this.InvoiceId } })
  }
  onSubmit(f: NgForm) {
    this.submitted = true;

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
        "SONo": this.model.SONo,
        "RRId": "0",
        "CustomerId": this.model.CustomerId,
        "InvoiceType": this.model.InvoiceType,
        "TermsId": this.model.TermsId,
        "InvoiceDate": DateRequested,
        "DueDate": DueDate,
        "ReferenceNo": this.model.ReferenceNo,
        "CustomerPONo": this.model.CustomerPONo,
        "ShipAddressId": this.model.sh_ShipCodeId,
        "BillAddressId": this.model.bi_BillCodeId,
        "LaborDescription": this.model.Notes,
        "SubTotal": this.SubTotal,
        "TotalTax": this.TotalTax,
        "Discount": this.Discount,
        "AHFees": this.AHFees,
        "Shipping": this.Shipping,
        "AdvanceAmount": this.AdvanceAmount,
        "GrandTotal": this.GrandTotal,
        "TaxPercent": this.TaxPercent,
        "Status": this.model.InvoiceStatus,
        "InvoiceItem": this.PartItem,
        "GlobalCustomerReference": this.CustomerRef

      }
      this.commonService.postHttpService(postData, "InvoiceCreate").subscribe(response => {
        if (response.status == true) {
          this.templateSettings = this.viewTemplate;

          Swal.fire({
            title: 'Success!',
            text: 'Invoice Created Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          this.reLoad();
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Invoice could not be Created!',
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


  //Email
  InvoiceEmail() {
    this.printComponent.onParentEmailClick((pdfBase64, fileName) => {
      var RRId = this.RRId
      var IdentityId = this.InvoiceId
      var IdentityType = CONST_IDENTITY_TYPE_INVOICE
      var followupName = "Invoice"
      var ImportedAttachment = { path: `data:application/pdf;filename=generated.pdf;base64,${pdfBase64}`, filename: fileName };
      this.modalRef = this.CommonmodalService.show(EmailComponent,
        {
          backdrop: 'static',
          ignoreBackdropClick: false,
          initialState: {
            data: { followupName, IdentityId, IdentityType, RRId, ImportedAttachment },
            class: 'modal-lg'
          }, class: 'gray modal-lg'
        });

      this.modalRef.content.closeBtnName = 'Close';

      this.modalRef.content.event.subscribe(res => {
      });
    });
  }


  //DeleteInvoice

  DeleteInvoice() {
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
          InvoiceId: this.InvoiceId,
        }
        this.commonService.postHttpService(postData, 'DeleteInvoice').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Invoice has been deleted.',
              type: 'success'
            });
            this.router.navigate(['/admin/Invoice-List'])


          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Invoice  is safe:)',
          type: 'error'
        });
      }
    });

  }


  onbackToList() {
    this.navCtrl.navigate('admin/Invoice-List');
  }

  //AutoComplete for RR
  selectRREvent($event) {
    this.RRId = $event.RRId;
  }

  clearRREvent($event) {
    this.RRId = ''
    this.RRNo = ''
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
          this.customerList = data.filter(a => a.CompanyName.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingCustomer = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingCustomer = false; });

    }
  }


  onUploadEDI() {
    var InvoiceId = this.InvoiceId
    var InvoiceNo = this.InvoiceInfo.InvoiceNo
    this.modalRef = this.CommonmodalService.show(UploadEDIComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { InvoiceId, InvoiceNo },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });
    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.event.subscribe(res => {
      this.reLoad()
    });
  }


  onCancelInvoice() {
    if (this.InvoiceInfo.Consolidated != 1) {
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
            "InvoiceId": this.InvoiceId
          }
          this.commonService.postHttpService(postData, 'CancelInvoice').subscribe(response => {
            if (response.status == true) {
              Swal.fire({
                title: 'Cancelled Invoice!',
                text: 'Invoice Cancelled has been Updated.',
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
            text: 'Invoice Cancelled has not Updated.',
            type: 'error'
          });
        }
      });
    } else {
      Swal.fire({
        type: 'info',
        text: 'The Invoice is added into Consolidated. Please remove from consolidate to cancel the Invoice',
        title: 'Message',
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }
  }
}
