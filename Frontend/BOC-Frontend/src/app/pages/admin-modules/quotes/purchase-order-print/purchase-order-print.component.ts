import { Component, OnInit, ViewChild, Input, TemplateRef, ChangeDetectorRef, ViewChildren, QueryList, OnDestroy, Inject } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/core/services/common.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  SalesQuote_Status, Quote_type, terms, warranty_list, taxtype, Quote_notes, CONST_IDENTITY_TYPE_QUOTE,
  CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, attachment_thumb_images, CONST_BillAddressType, CONST_ShipAddressType, CONST_ContactAddressType, PurchaseOrder_notes, CONST_AH_Group_ID, PurchaseOrder_Status, PurchaseOrder_Type, CONST_IDENTITY_TYPE_PO
} from 'src/assets/data/dropdown';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddRrPartsComponent } from '../../common-template/add-rr-parts/add-rr-parts.component';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { EmailComponent } from '../../common-template/email/email.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ExcelService } from 'src/app/core/services/excel.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-purchase-order-print',
  templateUrl: './purchase-order-print.component.html',
  styleUrls: ['./purchase-order-print.component.scss'],
  providers: [
    NgxSpinnerService,
  ]
})
export class PurchaseOrderPrintComponent implements OnInit {

  Currentdate = new Date();
  ResponseMessage;
  @Input() templateSettings: TemplateRef<HTMLElement>;
  @ViewChild('viewTemplate', null) viewTemplate: TemplateRef<HTMLElement>;
  @ViewChild('editTemplate', null) editTemplate: TemplateRef<HTMLElement>;
  @ViewChild('addTemplate', null) addTemplate: TemplateRef<HTMLElement>;
  PurchaseOrder: any = [];
  ExcelData: any = []

  keyword = 'PartNo';
  filteredData: any[];
  data = [];

  dataTableMessage;
  tableData: any = [];
  number
  baseUrl = `${environment.api.apiURL}`;
  POId;
  result;
  PurchaseOrderInfo;
  BillingAddress;
  ShippingAddress;
  PurchaseOrderCustomerRef: any = [];;
  PurchaseOrderItem: any = [];
  NotesList: any = [];
  RRNotesList: any = [];
  AttachmentList: any = [];
  ContactAddress;
  faxContactAddress;
  faxBillingAddress;
  faxShippingAddress;
  PhoneContactAddress;
  PhoneBillingAddress;
  PhoneShippingAddress;
  Status;
  status;
  vendorList;
  ShippingAddressList: any = []; BillingAddressList: any = [];
  ShipAddress: any = []; BillAddress: any = []
  //ServerSide List
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  api_check: any;
  dataTable: any;
  RRId;
  //FILTER
  Created;
  VendorId;
  PONo
  PuchaseOrderStatus
  DateRequested;
  POType;
  RRNo;
  RequestedId;
  Duedate;
  DueDateTo;
  Requesteddate;
  RequestedDateTo;
  UserId;
  RequesteddateDate;
  RequestedDateToDate;
  DuedateDate;
  DueDateToDate;
  IsEmailSent;
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
  PurchaseOrderType
  showSearch: boolean = true;
  PurchaseOrder_notes;
  //ADD
  model: any = [];
  partList: any = [];
  customerPartList: any = [];
  partNewList: any = [];
  AddressList;
  VendorAddressList;
  TermsList;
  warrantyList;
  adminList;
  PartItem: any = [];
  IsRushRepair;
  IsWarrantyRecovery;
  repairMessage;
  @Input() dateFilterField;
  POList: any = [];
  @ViewChild('dataTable', { static: true }) table;

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
  ShipViaList;
  POTypeStyle;
  RRnumber;
  POnumber;
  AHAddressList;
  constructor(private httpClient: HttpClient, public router: Router, private http: HttpClient, public navCtrl: NgxNavigationWithDataComponent,
    private spinner: NgxSpinnerService, private commonService: CommonService, private cd_ref: ChangeDetectorRef, private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, private datePipe: DatePipe,) { }
  currentRouter = this.router.url;

  ngOnInit(): void {

    this.POId = this.navCtrl.get('POId');
    this.POTypeStyle = ""
    this.AHAddressList = ""
    this.getAdminSettingsView();
    this.getAHGroupaddress();
    this.getAhGroupaddress();
    this.attachmentThumb = attachment_thumb_images;
    this.NotesList = [];
    this.RRNotesList = [];
    this.PurchaseOrderInfo = ""
    this.PurchaseOrderItem = [];
    this.BillingAddress = "";
    this.ShippingAddress = "";
    this.ContactAddress = ""
    this.PurchaseOrderCustomerRef = [];
    this.PuchaseOrderStatus = PurchaseOrder_Status;
    this.PurchaseOrderType = PurchaseOrder_Type;
    this.Created = ""
    this.Shipping = "0";
    this.Discount = "0";
    this.AHFees = "0";
    this.getVendorList();
    this.getPartList();
    this.getAdminList();
    this.getTermList();
    this.getShipViaList();
    this.warrantyList = warranty_list;



    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/PurchaseOrder/getPurchaseListByServerSide';
    const that = this;
    var filterData = {}

    this.IsViewEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_DELETE_ACCESS);
    this.IsViewCostEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_VIEW_COST_ACCESS);
    this.IsApproveEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_APPROVE_ACCESS);
    this.IsPrintPDFEnabled = this.commonService.permissionCheck("POPrintAndPDFExport", CONST_VIEW_ACCESS);
    this.IsEmailEnabled = this.commonService.permissionCheck("POEmail", CONST_VIEW_ACCESS);
    this.IsExcelEnabled = this.commonService.permissionCheck("PODownloadExcel", CONST_VIEW_ACCESS);
    this.IsNotesEnabled = this.commonService.permissionCheck("PONotes", CONST_VIEW_ACCESS);
    this.IsApproveEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_APPROVE_ACCESS);

    this.dtOptions = {
      dom: '<"row"<"col-12 col-sm-12 col-md-12 col-xl-12"B> <"col-12 col-sm-12 col-md-12 col-xl-12 aso"f>>rt<" row"<"help-block col-12 col-sm-6 col-md-6 col-xl-6"l><"col-12 col-sm-6 col-md-6 col-xl-6"i><"col-12 col-sm-12 col-md-12 col-xl-12"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      serverSide: true,
      searching: true,

      retrieve: true,
      order: [[0, 'desc']],
      serverMethod: 'post',
      ajax: (dataTablesParameters: any, callback) => {
        that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

        that.api_check = that.http.post<any>(url,
          Object.assign(dataTablesParameters,
            filterData
          ), httpOptions).subscribe(resp => {
            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: resp.responseData.data
            });
            if (this.POId == undefined) {
              this.POId = resp.responseData.data[0].POId;
            }
            if (this.POId == null) {
              this.POId = resp.responseData.data[0].POId;
            }
            this.templateSettings = this.viewTemplate;
            this.loadTemplate('view', this.POId)
          });
      },
      buttons: {
        dom: {
          button: {
            className: ''
          }
        },
        buttons: [
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
          "targets": [1],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [2],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [3],
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
        {
          "targets": [12],
          "visible": false,
          "searchable": true
        },
        {
          "targets": [13],
          "visible": false,
          "searchable": true
        }
      ],
      createdRow: function (row, data, index) {

      },
      columns: [
        {
          data: 'POId', name: 'POId', defaultContent: '', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {

            var cstyle = '';
            switch (row.Status) {
              case 1: { cstyle = 'badge-warning'; status = "Open"; break; }
              case 2: { cstyle = 'badge-secondary'; status = "Closed"; break; }
              case 3: { cstyle = 'badge-purple'; status = "Submit For Approval"; break; }
              case 4: { cstyle = 'badge-light'; status = "Hold"; break; }
              case 5: { cstyle = 'badge-danger'; status = "Cancelled"; break; }
              case 6: { cstyle = 'badge-success'; status = "Approved"; break; }
              case 7: { cstyle = 'badge-pink'; status = "Reviewed"; break; }
              case 8: { cstyle = 'badge-info'; status = "Draft"; break; }

              default: { cstyle = ''; break; }
            }
            var cstylealgin = 'float:right'
            var sostyles = 'background:#ececec!important;color:#333;padding:1px 5px;margin-right:8px;'
            var number = '';
            if (row.RRNo != '' && row.RRNo != '0' && row.RRNo != null) {
              number = row.RRNo;
            } else {
              number = row.PONo;
            }

            var IsEmailSent = '';
            if (row.IsEmailSent) {
              IsEmailSent = '<i  class="mdi mdi-email-outline red mailsent"></i>';
            }

            var Difference_In_Days = row.DueDateDiff;
            var daystext = '-';
            if ((row.Status == 1 || row.Status == 3 || row.Status == 4 || row.Status == 7 || row.Status == 8)) {
              if (Difference_In_Days < 0) {
                daystext = '<span class="badge badge-light-danger">Due Date Passed</span>';
              } else if (Difference_In_Days == 0) {
                daystext = '<span class="badge badge-light-pink">Due Today</span>';
              } else if (Difference_In_Days == 1) {
                daystext = '<span class="badge badge-light-dark">Due in 1 day</span>';
              } else if (Difference_In_Days == 2) {
                daystext = '<span class="badge badge-light-dark">Due in 2 days</span>';
              } else {
                daystext = '<span class="badge badge-light-primary">Due in ' + Difference_In_Days + ' days</span>';
              }
            }
            var checkbox = '';
            // if (row.Status == 1 || row.Status == 3 || row.Status == 4) {
            checkbox = '<input  name="chkpo" type="checkbox"  class="checkbox">&nbsp;';
            // }

            if (!this.IsViewCostEnabled) {
              row.GrandTotal = CONST_COST_HIDE_VALUE;
            }
            return '<p>' + checkbox + row.VendorName + `<span style="float:right;">$${row.GrandTotal}</span>` + '</p><a style="cursor:pointer" class="IDHREF"><span style="background:#ececec;padding:1px 5px;margin-right:2px;" >#' + number + '</span></a>&nbsp;|&nbsp;<span class="order-date">' + row.DateRequested + '</span> <span style="float:right" class="badge ' + cstyle + ' btn-xs">' + status + '</span><br><span class="pink" style="padding:1px 5px;margin-right:2px;">' + row.DueDate + '</span>&nbsp;|&nbsp; ' + daystext + '  <span style="float:right" class="btn-xs" ngbTooltip="Email Sent">' + IsEmailSent + '</span> </a>';


          },
        },
        { data: 'PONo', name: 'PONo', orderable: true, searchable: true },
        { data: 'VendorName', name: 'VendorName', orderable: true, searchable: true, },
        { data: 'Status', name: 'Status', orderable: true, searchable: true, },
        { data: 'DateRequested', name: 'DateRequested', orderable: true, searchable: true, },
        { data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true, },
        { data: 'VendorId', name: 'VendorId', orderable: true, searchable: true, },
        { data: 'RRNo', name: 'RRNo', orderable: true, searchable: true, },
        { data: 'POType', name: 'POType', orderable: true, searchable: true, },
        { data: 'DateRequestedTo', name: 'DateRequestedTo', orderable: true, searchable: true, },
        { data: 'DueDate', name: 'DueDate', orderable: true, searchable: true, },
        { data: 'DueDateTo', name: 'DueDateTo', orderable: true, searchable: true, },
        { data: 'RequestedById', name: 'RequestedById', orderable: true, searchable: true, },
        { data: 'ApprovedById', name: 'ApprovedById', orderable: true, searchable: true, },
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {


        $('.IDHREF', row).unbind('click');
        $('.IDHREF', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.loadTemplate("view", data.POId);
          this.POId = data.POId;
          this.cd_ref.detectChanges();
        });

        $('.checkbox', row).unbind('click');
        $('.checkbox', row).bind('click', (e) => {
          this.onSendEmail(data.POId)
          this.onExcelData(data.POId)

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

    this.dataTable = $('#datatable-angular');
    this.dataTable.DataTable(this.dtOptions);
  }
  getAhGroupaddress() {
    var postData = {
      "IdentityId": CONST_AH_Group_ID,
      "IdentityType": 2,
      "Type": CONST_ContactAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.AHAddressList = response.responseData[0];
    })
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
  getShipViaList() {
    this.commonService.getHttpService("ShipViaList").subscribe(response => {
      if (response.status == true) {
        this.ShipViaList = response.responseData
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
  onApprovedPO() {
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
          POId: this.POId,
        }
        this.commonService.postHttpService(postData, 'ApprovedPO').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Approved PO!',
              text: 'Purchase Order Approved has been Updated.',
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
          text: 'Purchase Order Approved has not Updated.',
          type: 'error'
        });
      }
    });



  }
  onExcelData(POId) {
    this.PurchaseOrder.push({
      POId
    })
  }
  exportAsXLSX(): void {
    var postData = {
      "PurchaseOrder": this.PurchaseOrder,
      "RRNo": this.RRNo,
      "PONo": this.PONo,
      "VendorId": this.VendorId,
      "RequestedById": this.RequestedId,
      "ApprovedById": this.UserId,
      "DateRequested": this.RequesteddateDate,
      "DateRequestedTo": this.RequestedDateToDate,
      "DueDate": this.DuedateDate,
      "DueDateTo": this.DueDateToDate,
      "POType": this.POType,
      "Status": this.Status

    }
    this.commonService.postHttpService(postData, "getPOExportToExcel").subscribe(response => {
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
    const title = 'Purchase Order';
    const header = ["RR #", "PO #", "Vendor Name", "Requested By Name", "Approved By Name", "Date Requested", "Grand Total", "Due Date", "PO Type", "Status"]
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
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 25;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;


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
    worksheet.mergeCells(`A${footerRow.number}:J${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Purchase Order.xlsx');
    })


  }
  hideAddress: boolean = true
  generatePDF() {
    var data = document.getElementById('contentToConvert');
    this.hideAddress = false;
    setTimeout(() => {
      html2canvas(data).then(canvas => {
        var imgWidth = 208;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png')
        let pdf = new jspdf('p', 'mm', 'a4');

        var position = 10;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
        pdf.save('purchase-order.pdf');
        this.hideAddress = true
      });
    }, 500);
  }

  getVendorList() {
    this.commonService.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
    });
  }
  getAdminList() {
    this.commonService.getHttpService('getUserList').subscribe(response => {
      this.adminList = response.responseData.map(function (value) {
        return { title: value.FirstName + " - " + value.LastName, "UserId": value.UserId }
      });
    });
  }
  loadTemplate(type, POId) {
    switch (type) {
      case "view":
        this.spinner.show();
        this.PartItem = [];
        var postData = {
          POId: POId,
        }
        this.commonService.postHttpService(postData, "getPuchaseOrderView").subscribe(response => {
          if (response.status == true) {
            this.result = response.responseData;
            this.AttachmentList = this.result.AttachmentList || []
            this.PurchaseOrderInfo = this.result.POInfo;
            this.PurchaseOrderItem = this.result.POItem;
            this.NotesList = this.result.NotesList;
            this.RRNotesList = this.result.RRNotesList
            this.BillingAddress = this.result.BillingAddress[0] || "";;
            this.ShippingAddress = this.result.ShippingAddress[0] || "";;
            this.ContactAddress = this.result.ContactAddress[0] || "";;
            this.PurchaseOrderCustomerRef = this.result.CustomerRef;
            this.RRId = this.PurchaseOrderInfo.RRId
            this.faxContactAddress = this.ContactAddress.Fax
            this.faxShippingAddress = this.ShippingAddress.Fax
            this.faxBillingAddress = this.BillingAddress.Fax
            this.IsRushRepair = this.PurchaseOrderInfo.IsRushRepair
            this.IsWarrantyRecovery = this.PurchaseOrderInfo.IsWarrantyRecovery
            if (this.PurchaseOrderInfo.RRId != 0) {
              this.number = this.PurchaseOrderInfo.RRNo
              this.RRnumber = this.PurchaseOrderInfo.RRNo
            }
            else {
              this.number = this.PurchaseOrderInfo.PONo
              this.POnumber = this.PurchaseOrderInfo.PONo
            }
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
            this.PhoneContactAddress = this.ContactAddress.PhoneNoPrimary
            this.PhoneShippingAddress = this.ShippingAddress.PhoneNoPrimary
            this.PhoneBillingAddress = this.BillingAddress.PhoneNoPrimary
            this.Status = this.PurchaseOrderInfo.Status;
            this.PurchaseOrder_notes = PurchaseOrder_notes
            this.POTypeStyle = this.PurchaseOrderType.find(a => a.PurchaseOrder_TypeId == this.PurchaseOrderInfo.POType)

            for (let x in this.PurchaseOrderItem) {
              if (!this.IsViewCostEnabled) {
                this.PurchaseOrderItem[x].Rate = CONST_COST_HIDE_VALUE;
                this.PurchaseOrderItem[x].Price = CONST_COST_HIDE_VALUE;
              }
            }
            if (!this.IsViewCostEnabled) {
              this.PurchaseOrderInfo.SubTotal = CONST_COST_HIDE_VALUE;
              this.PurchaseOrderInfo.AHFees = CONST_COST_HIDE_VALUE;
              this.PurchaseOrderInfo.TotalTax = CONST_COST_HIDE_VALUE;
              this.PurchaseOrderInfo.Discount = CONST_COST_HIDE_VALUE;
              this.PurchaseOrderInfo.Shipping = CONST_COST_HIDE_VALUE;
              this.PurchaseOrderInfo.GrandTotal = CONST_COST_HIDE_VALUE;
            }



          }
          else {

          }
          this.cd_ref.detectChanges();
          this.spinner.hide()

        }, error => console.log(error));
        // this.templateSettings = this.viewTemplate;
        break;
      case "edit":
        this.navCtrl.navigate('/admin/purchase-order/edit', { POId: POId });
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
          DeliveryDate: "",
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

        let DueDateFromSettings = new Date(new Date().getTime() + this.settingsView.POLeadTime * 24 * 60 * 60 * 1000);

        const dueyears = Number(this.datePipe.transform(DueDateFromSettings, 'yyyy'));
        const dueMonth = Number(this.datePipe.transform(DueDateFromSettings, 'MM'));
        const dueDay = Number(this.datePipe.transform(DueDateFromSettings, 'dd'));
        this.model.DueDate = {
          year: dueyears,
          month: dueMonth,
          day: dueDay
        }
        this.model.PoStatus = "8";
        this.model.VendorId = null;
        this.model.POType = undefined;
        this.model.TermsId = undefined;
        this.model.VendorRefNo = ""
        this.model.Notes = "";
        this.model.ShipVia = undefined;
        this.model.ShippingAccountNumber = "";
        this.model.AdditionalPONo = "";
        this.SubTotal = "";
        this.TotalTax = "";
        this.GrandTotal = "";
        this.getAHGroupaddress();
        this.templateSettings = this.addTemplate;
        break;
      default:
        this.templateSettings = this.viewTemplate;
        break;
    }
  }


  onSendEmail(POId) {
    this.POList.push({
      POId
    })
  }


  onSendEmailFromList() {

    if (this.POList.length == "") {
      this.ResponseMessage = "Please Select the Below Purchase Order List before Email"
    } else {
      var postData = {
        "POList": this.POList,
      }
      this.commonService.postHttpService(postData, "SendEmailFromPOList").subscribe(response => {
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
  EnableSearch() {
    this.showSearch = true;
  }

  onFilter(event) {
    let obj = this
    var table = $('#datatable-angular').DataTable();
    table.columns(1).search(this.PONo);
    table.columns(3).search(this.status);
    table.columns(4).search(this.RequesteddateDate);
    table.columns(6).search(this.VendorId);
    table.columns(8).search(this.POType);
    table.columns(7).search(this.RRNo);
    table.columns(12).search(this.RequestedId);
    table.columns(13).search(this.UserId);
    table.columns(11).search(this.DueDateToDate);
    table.columns(10).search(this.DuedateDate);
    table.columns(9).search(this.RequestedDateToDate);
    table.draw();
    this.showSearch = false;

  }

  onClear(event) {
    var table = $('#datatable-angular').DataTable();
    this.VendorId = "";
    this.PONo = '';
    this.status = '';
    this.Created = "";
    this.DateRequested = "";
    this.RRNo = "";
    this.POType = "";
    this.VendorId = ""
    this.IsEmailSent = "";
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
    table.columns(1).search(this.PONo);
    table.columns(3).search(this.status)
    table.columns(4).search(this.RequesteddateDate);
    table.columns(6).search(this.VendorId);
    table.columns(8).search(this.POType);
    table.columns(7).search(this.RRNo);
    table.columns(12).search(this.RequestedId);
    table.columns(13).search(this.UserId);
    table.columns(11).search(this.DueDateToDate);
    table.columns(10).search(this.DuedateDate);
    table.columns(9).search(this.RequestedDateToDate);
    table.draw();
    this.showSearch = false;

    this.status = undefined;
    this.VendorId = null;
    this.RequestedId = null;
    this.UserId = null;
    this.POType = undefined;

    this.reLoad();

  }


  backToRRView() {
    this.router.navigate(['/admin/repair-request/edit'], { state: { RRId: this.PurchaseOrderInfo.RRId } });
  }



  getAHGroupaddress() {
    var postData = {
      "IdentityId": CONST_AH_Group_ID,
      "IdentityType": 2,
      "Type": CONST_BillAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
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
      this.model.bi_BillCodeId = BillingAddress[0].AddressId
    });


    var postData = {
      "IdentityId": CONST_AH_Group_ID,
      "IdentityType": 2,
      "Type": CONST_ShipAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
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
      this.model.sh_ShipCodeId = ShippingAddress[0].AddressId

    })
  }



  getPartDetails(PartId, i) {

    var CustomerId = 1



    // Quote for Add New
    if (PartId == 0) {
      this.modalRef = this.CommonmodalService.show(AddRrPartsComponent,
        {
          backdrop: 'static',
          ignoreBackdropClick: false,
          initialState: {
            data: { CustomerId },
            class: 'modal-lg'
          }, class: 'gray modal-lg'
        });

      this.modalRef.content.closeBtnName = 'Close';
      this.modalRef.content.event.subscribe(modelResponse => {
        this.PartItem[i].PartId = modelResponse.data.PartId,
          this.PartItem[i].PartNo = modelResponse.dataPartNo,
          this.PartItem[i].Description = modelResponse.data.Description,
          this.PartItem[i].Quantity = modelResponse.data.Quantity,
          this.PartItem[i].Rate = modelResponse.data.Rate
        this.PartItem[i].Price = modelResponse.data.Price,


          // Update the Customer Parts List
          this.partNewList = [];
        this.partList = [];
        var postData = { CustomerId: CustomerId };
        this.commonService.postHttpService(postData, 'getPartListDropdown').subscribe(response => {
          this.partNewList.push({ "PartId": 0, "PartNo": '+ Add New', "PartColor": 'green' });
          for (var i in response.responseData) {
            this.partNewList.push({ "PartId": response.responseData[i].PartId, "PartNo": response.responseData[i].PartNo, "PartColor": 'blue' });
          }
          this.partList = this.partNewList;
        });
      });
    } else {
      var postData = { PartId: PartId };
      this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {

        this.PartItem[i].PartId = response.responseData[0].PartId,
          this.PartItem[i].PartNo = response.responseData[0].PartNo,
          this.PartItem[i].Description = response.responseData[0].Description,
          this.PartItem[i].Quantity = response.responseData[0].Quantity,
          this.PartItem[i].Rate = response.responseData[0].Rate
        this.PartItem[i].Price = response.responseData[0].Price

      });
    }
  }

  arrayOne(n: number): any[] {
    return Array(n);
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
  reLoad() {
    this.router.navigate([this.currentRouter])
  }


  selectEvent(item, i) {
    var postData = { PartId: item.PartId };
    this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {
      this.PartItem[i].PartId = response.responseData[0].PartId,
        this.PartItem[i].PartNo = response.responseData[0].PartNo,
        this.PartItem[i].Description = response.responseData[0].Description,
        this.PartItem[i].Quantity = response.responseData[0].Quantity,
        this.PartItem[i].Rate = response.responseData[0].Rate
      this.PartItem[i].Price = response.responseData[0].Price,
        this.PartItem[i].DeliveryDate = "2020-12-24"
    });

  }

  onChangeSearch(val: string, i) {

    if (val) {
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
        this.cd_ref.detectChanges();
      }, error => console.log(error));

    }
  }

  onFocused(e, i) {
    // do something when input is focused
  }

  onSubmit() {
    //DateRequested
    const reqYears = this.model.RequestedDate.year;
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



    var postData = {
      "RRId": "0",
      "VendorId": this.model.VendorId,
      "VendorRefNo": this.model.VendorRefNo,
      "POType": this.model.POType,
      "TermsId": this.model.TermsId,
      "DateRequested": DateRequested,
      "DueDate": DueDate,
      "AdditionalPONo": this.model.AdditionalPONo,
      "ShippingAccountNumber": this.model.ShippingAccountNumber,
      "ShipVia": this.model.ShipVia,
      "Code": this.model.Code,
      "ShipAddressBookId": this.model.sh_ShipCodeId,
      "BillAddressBookId": this.model.bi_BillCodeId,
      "ShippingNotes": this.model.Note,
      "SubTotal": this.SubTotal,
      "TotalTax": this.TotalTax,
      "Discount": this.Discount,
      "AHFees": this.AHFees,
      "Shipping": this.Shipping,
      "GrandTotal": this.GrandTotal,
      "TaxPercent": this.TaxPercent,
      "Status": this.model.PoStatus,
      "PurchaseOrderItem": this.PartItem
    }
    this.commonService.postHttpService(postData, "POCreate").subscribe(response => {
      if (response.status == true) {
        Swal.fire({
          title: 'Success!',
          text: 'Purchase Order Created Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
        this.reLoad();
      }
      else {
        Swal.fire({
          title: 'Error!',
          text: 'Purchase Order could not be Created!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  getPartList() {
    this.commonService.getHttpService('getPartListDD').subscribe(response => {
      this.partList = response.responseData
    });
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
  POEmail() {
    var RRId = this.RRId
    var IdentityId = this.POId
    var IdentityType = CONST_IDENTITY_TYPE_PO
    var followupName = "Purchase Order"
    this.modalRef = this.CommonmodalService.show(EmailComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { followupName, IdentityId, IdentityType, RRId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
    });
  }

  DeletePO() {
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
          POId: this.POId,
        }
        this.commonService.postHttpService(postData, 'DeletePO').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Purchase Order has been deleted.',
              type: 'success'
            });
            var table = $('#datatable-angular').DataTable();
            table.draw();
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Purchase Order  is safe:)',
          type: 'error'
        });
      }
    });

  }



}
