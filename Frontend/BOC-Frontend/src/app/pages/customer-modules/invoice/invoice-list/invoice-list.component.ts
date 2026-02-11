import { Component, OnInit, Input, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { invoice_notes, warranty_list, Customer_Invoice_Status, terms, CONST_AH_Group_ID, attachment_thumb_images } from 'src/assets/data/dropdown';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/core/services/common.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  providers: [
    NgxSpinnerService
  ],
})
export class InvoiceListComponent implements OnInit {
  baseUrl = `${environment.api.apiURL}`;
  Currentdate = new Date();
  showSearch: boolean = true;
  invoice_notes;
  NotesList;
  ResponseMessage;
  submitted = false;

  @Input() templateSettings: TemplateRef<HTMLElement>;
  @ViewChild('viewTemplate', null) viewTemplate: TemplateRef<HTMLElement>;

  //ServerSide List
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  api_check: any;
  dataTable: any;
  dataTableMessage;
  @ViewChild('dataTable', { static: true }) table;
  RRId;

  InvoiceId;
  result: any = [];
  faxBillingAddress;
  PhoneBillingAddress;
  //view
  InvoiceInfo;
  BillingAddress;
  ContactAddress;
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
  AdvanceAmount;
  number;
  //Filter
  RRNo;
  InvoiceNo;
  CustomerId;
  CustomerPONo;
  InvoiceType = '';
  Status = '';
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
  customerList;
  customerPartList: any = [];
  partNewList: any = [];
  AddressList;
  TermsList;
  warrantyList;
  Customer_Invoice_Status;
  customerAddressList;
  PartItem: any = []
  InvoiceList: any = [];
  AttachmentList: any = []
  ShippingHistory;
  CONST_AH_Group_ID
  attachmentThumb
  constructor(private http: HttpClient, public router: Router, private spinner: NgxSpinnerService, public navCtrl: NgxNavigationWithDataComponent,
    private modalService: NgbModal, private commonService: CommonService, private cd_ref: ChangeDetectorRef, private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, private datePipe: DatePipe,) { }
  currentRouter = this.router.url;

  ngOnInit(): void {
    this.NotesList = [];
    this.InvoiceInfo = "";
    this.ContactAddress = "";
    this.BillingAddress = "";
    this.ShippingHistory = ""
    this.InvoiceItem = [];
    this.CustomerRef = [];
    this.AttachmentList = []
    this.warrantyList = warranty_list;
    this.Customer_Invoice_Status = Customer_Invoice_Status;
    this.attachmentThumb = attachment_thumb_images;
    this.getTermList();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/CustomerPortal/CustomerInvoiceListByServerSide';
    const that = this;
    var filterData = {}

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
            this.InvoiceId = resp.responseData.data[0].InvoiceId;
            this.loadTemplate('view', this.InvoiceId)
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

      ],
      createdRow: function (row, data, index) {

      },
      columns: [
        {
          data: 'InvoiceId', name: 'InvoiceId', defaultContent: '', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {

            var cstyle = '';
            switch (row.Status) {
              case 0: { cstyle = 'badge-info'; status = "Draft"; break; }
              case 1: { cstyle = 'badge-warning'; status = "Open"; break; }
              case 2: { cstyle = 'badge-success'; status = "Approved"; break; }
              case 3: { cstyle = 'badge-danger'; status = "Cancelled"; break; }
              case 4: { cstyle = 'badge-purple'; status = "UnPaid"; break; }
              case 5: { cstyle = 'badge-secondary'; status = "Partially Paid"; break; }
              case 6: { cstyle = 'badge-pink'; status = "Paid"; break; }


              default: { cstyle = ''; break; }
            }
            var cstylealgin = 'float:right'
            var sostyles = 'background:#ececec!important;color:#333;padding:1px 5px;margin-right:8px;'

            var number = '';
            if (row.RRNo != '' && row.RRNo != '0' && row.RRNo != null) {
              number = row.RRNo;
            } else {
              number = row.InvoiceNo;
            }
            var Difference_In_Days = row.DueDateDiff;
            var daystext = '-';
            if ((row.Status == 1)) {
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
            var IsEmailSent = '';
            if (row.IsEmailSent) {
              IsEmailSent = '<i  class="mdi mdi-email-outline red mailsent"></i>';
            }

            var checkbox = '';
            // if (row.Status == 1) {
            checkbox = '<input type="checkbox" class="checkbox">&nbsp;';
            //}


            return '<p>' + checkbox + row.CompanyName + `<span style="float:right;">$${row.GrandTotal}</span>` + '</p><a style="cursor:pointer" class="IDHREF"><span style="background:#ececec;padding:1px 5px;margin-right:2px;" >#' + number + '</span></a>&nbsp;|&nbsp;<span class="order-date">' + row.InvoiceDate + '</span> <span style="float:right" class="badge ' + cstyle + ' btn-xs">' + status + '</span><br><span class="pink" style="padding:1px 5px;margin-right:2px;">' + row.DueDate + '</span>&nbsp;|&nbsp; ' + daystext + '  <span style="float:right" class="btn-xs" ngbTooltip="Email Sent">' + IsEmailSent + '</span> </a>';

          },
        },
        { data: 'InvoiceNo', name: 'InvoiceNo', orderable: true, searchable: true, },
        { data: 'CompanyName', name: 'CompanyName', orderable: true, searchable: true, },
        { data: 'Status', name: 'Status', orderable: true, searchable: true, },
        { data: 'InvoiceDate', name: 'InvoiceDate', orderable: true, searchable: true, },
        { data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true, },
        { data: 'RRNo', name: 'RRNo', orderable: true, searchable: true, },
        { data: 'CustomerPONo', name: 'CustomerPONo', orderable: true, searchable: true, },
        { data: 'InvoiceDateTo', name: 'InvoiceDateTo', orderable: true, searchable: true, },
        { data: 'DueDate', name: 'DueDate', orderable: true, searchable: true, },
        { data: 'DueDateTo', name: 'DueDateTo', orderable: true, searchable: true, },
        { data: 'CustomerId', name: 'CustomerId', orderable: true, searchable: true, },
        { data: 'InvoiceType', name: 'InvoiceType', orderable: true, searchable: true, },


      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.IDHREF', row).unbind('click');
        $('.IDHREF', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.loadTemplate("view", data.InvoiceId);
          this.InvoiceId = data.InvoiceId

        });
        $('.checkbox', row).unbind('click');
        $('.checkbox', row).bind('click', (e) => {
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
        pdf.save('invoice.pdf');
        this.hideAddress = true
      });
    }, 500);
  }

  loadTemplate(type, InvoiceId) {
    switch (type) {
      case "view":
        this.PartItem = [];

        this.spinner.show();

        var postData = {
          InvoiceId: InvoiceId,
        }
        this.commonService.postHttpService(postData, "InvoiceView").subscribe(response => {
          if (response.status == true) {
            this.result = response.responseData;
            this.InvoiceInfo = this.result.InvoiceInfo[0] || "";
            this.NotesList = this.result.NotesList
            this.BillingAddress = this.result.BillingAddressInfo[0] || "";
            this.ContactAddress = this.result.ContactAddressInfo[0] || "";
            this.InvoiceItem = this.result.InvoiceItem;
            this.CustomerRef = this.result.CustomerRef;
            this.RRId = this.InvoiceInfo.RRId;
            this.ShippingHistory = this.result.LastShippingHistory[0] || "";
            this.faxBillingAddress = this.BillingAddress.Fax
            this.PhoneBillingAddress = this.BillingAddress.Phone;
            this.invoice_notes = invoice_notes;
            this.AttachmentList = this.result.AttachmentList;
            this.CONST_AH_Group_ID = CONST_AH_Group_ID;

            if (this.InvoiceInfo.RRId != 0) {
              this.number = this.InvoiceInfo.RRNo
            }
            else {
              this.number = this.InvoiceInfo.InvoiceNo
            }
          }
          else {

          }
          this.spinner.hide()
          this.cd_ref.detectChanges();
        }, error => console.log(error));
        this.templateSettings = this.viewTemplate;
        break;
      default:
        this.templateSettings = this.viewTemplate;
        break;
    }
  }


  EnableSearch() {
    this.showSearch = true;
  }



  InvoiceDateToFormat(InvoiceDateTo) {
    if (InvoiceDateTo != null) {
      const InvoiceDateToYears = InvoiceDateTo.year;
      const InvoiceDateToDates = InvoiceDateTo.day;
      const InvoiceDateTomonths = InvoiceDateTo.month;
      let InvoiceDateToDate = new Date(InvoiceDateToYears, InvoiceDateTomonths - 1, InvoiceDateToDates);
      this.InvoiceDateToDate = moment(InvoiceDateToDate).format('YYYY-MM-DD');
    } else {
      this.InvoiceDateToDate = ''
    }
  }
  InvoiceDateFormat(InvoiceDate) {
    if (InvoiceDate != null) {
      const InvoiceDateYears = InvoiceDate.year;
      const InvoiceDateDates = InvoiceDate.day;
      const InvoiceDatemonths = InvoiceDate.month;
      let InvoiceDateDate = new Date(InvoiceDateYears, InvoiceDatemonths - 1, InvoiceDateDates);
      this.InvoiceDateDate = moment(InvoiceDateDate).format('YYYY-MM-DD')
    } else {
      this.InvoiceDateDate = ''
    }
  }


  DueDateToFormat(DueDateTo) {
    if (DueDateTo != null) {
      const DueDateToYears = DueDateTo.year;
      const DueDateToDates = DueDateTo.day;
      const DueDateTomonths = DueDateTo.month;
      let DueDateToDate = new Date(DueDateToYears, DueDateTomonths - 1, DueDateToDates);
      this.DueDateToDate = moment(DueDateToDate).format('YYYY-MM-DD');
    } else {
      this.DueDateToDate = ''
    }
  }
  DueDateFormat(DueDate) {
    if (DueDate != null) {
      const DueDateYears = DueDate.year;
      const DueDateDates = DueDate.day;
      const DueDatemonths = DueDate.month;
      let DueDateDate = new Date(DueDateYears, DueDatemonths - 1, DueDateDates);
      this.DueDateDate = moment(DueDateDate).format('YYYY-MM-DD')
    } else {
      this.DueDateDate = ''
    }
  }
  onFilter(event) {
    let obj = this
    var table = $('#datatable-angular').DataTable();
    table.columns(6).search(this.RRNo);
    table.columns(3).search(this.Status);
    table.columns(4).search(this.InvoiceDateDate);
    table.columns(8).search(this.InvoiceDateToDate);
    table.columns(1).search(this.InvoiceNo);
    table.columns(7).search(this.CustomerPONo);
    table.columns(9).search(this.DueDateDate);
    table.columns(10).search(this.DueDateToDate);
    table.columns(11).search(this.CustomerId)
    table.columns(12).search(this.InvoiceType)

    table.draw();
    this.showSearch = false;

  }
  onClear(event) {
    var table = $('#datatable-angular').DataTable();
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
    table.columns(6).search(this.RRNo);
    table.columns(3).search(this.Status);
    table.columns(4).search(this.InvoiceDateDate);
    table.columns(8).search(this.InvoiceDateToDate);
    table.columns(1).search(this.InvoiceNo);
    table.columns(7).search(this.CustomerPONo);
    table.columns(9).search(this.DueDateDate);
    table.columns(10).search(this.DueDateToDate);
    table.columns(11).search(this.CustomerId)
    table.columns(12).search(this.InvoiceType)
    table.draw();
    this.showSearch = false;

    this.InvoiceType = undefined;
    this.Status = undefined;

    this.reLoad();
  }



  reLoad() {
    this.router.navigate([this.currentRouter])
  }










  backToRRView() {
    this.navCtrl.navigate('/admin/repair-request/edit', { RRId: this.InvoiceInfo.RRId });
  }















}
