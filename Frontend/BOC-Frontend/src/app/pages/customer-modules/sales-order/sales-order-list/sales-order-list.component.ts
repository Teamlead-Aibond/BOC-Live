/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, Input, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/core/services/common.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { SalesOrder_Status, SalesOrder_Type, warranty_list, SalesOrder_notes, CONST_IDENTITY_TYPE_SO, attachment_thumb_images } from 'src/assets/data/dropdown';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import { EmailComponent } from 'src/app/pages/admin-modules/common-template/email/email.component';
import * as moment from 'moment';
import { AddRrPartsComponent } from 'src/app/pages/admin-modules/common-template/add-rr-parts/add-rr-parts.component';
import jspdf from 'jspdf';

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.scss'],
  providers: [
    NgxSpinnerService, DatePipe

  ],
})
export class SalesOrderListComponent implements OnInit {
  baseUrl = `${environment.api.apiURL}`;
  Currentdate = new Date();
  showSearch: boolean = true;
  @Input() templateSettings: TemplateRef<HTMLElement>;
  @ViewChild('viewTemplate', null) viewTemplate: TemplateRef<HTMLElement>;
  @ViewChild('editTemplate', null) editTemplate: TemplateRef<HTMLElement>;
  @ViewChild('addTemplate', null) addTemplate: TemplateRef<HTMLElement>;

  dataTableMessage;
  tableData: any = [];
  BillCode;
  ShipCode;
  Warehouse;
  Facility
  SONo;
  result;
  SOId;
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

  customerList;
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

  ShipAddressBookId;
  IsConvertedToPO;
  BillAddressBookId
  DueDate;
  ReferenceNo;
  Notes;
  RequestedDate;
  SoStatus;
  TaxType;
  RRId;
  customerReferenceList;
  @Input() dateFilterField;
  @ViewChild('dataTable', { static: true }) table;
  IsRushRepair;
  IsWarrantyRecovery;
  repairMessage;
  SOList: any = [];
  attachmentThumb
  AttachmentList: any = []

  constructor(private http: HttpClient, public router: Router, public navCtrl: NgxNavigationWithDataComponent,
    private spinner: NgxSpinnerService, private modalService: NgbModal, private commonService: CommonService, private cd_ref: ChangeDetectorRef,
    private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, private datePipe: DatePipe,) { }
  currentRouter = this.router.url;

  ngOnInit() {


    this.SalesOrderInfo = ""
    this.SalesOrderItem = [];
    this.NotesList = [];
    this.RRNotesList = [];
    this.BillingAddress = "";
    this.ShippingAddress = "";
    this.SalesOrderCustomerRef = [];
    this.SalesOrderStatus = SalesOrder_Status;
    this.SalesOrderType = SalesOrder_Type;
    this.warrantyList = warranty_list;
    this.attachmentThumb = attachment_thumb_images;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/CustomerPortal/CustomerSOListByServerSide';
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
            this.SOId = resp.responseData.data[0].SOId;
            this.loadTemplate('view', this.SOId)
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





      ],
      createdRow: function (row, data, index) {



      },
      columns: [
        {
          data: 'SOId', name: 'SOId', defaultContent: '', orderable: true, searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var cstyle = '';
            switch (row.Status) {
              case 1: { cstyle = 'badge-warning'; status = "Open"; break; }
              case 2: { cstyle = 'badge-success'; status = "Approved"; break; }
              case 3: { cstyle = 'badge-danger'; status = "Cancelled"; break; }
              case 4: { cstyle = 'badge-light'; status = "On Hold"; break; }
              case 5: { cstyle = 'badge-info'; status = "Draft"; break; }

              default: { cstyle = ''; status = ""; break; }
            }
            var cstylealgin = 'float:right'
            var sostyles = 'background:#ececec!important;color:#333;padding:1px 5px;margin-right:8px;'

            var number = '';
            if (row.RRNo != '' && row.RRNo != '0' && row.RRNo != null) {
              number = row.RRNo;
            } else {
              number = row.SONo;
            }
            var IsEmailSent = '';
            if (row.IsEmailSent) {
              IsEmailSent = '<i  class="mdi mdi-email-outline red mailsent"></i>';
            }

            var Difference_In_Days = row.DueDateDiff;
            var daystext = '-';
            if ((row.Status == 1 || row.Status == 5 || row.Status == 4)) {
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
            // if (row.Status == 1 || row.Status == 4) {
            checkbox = '<input type="checkbox"  class="checkbox">&nbsp;';
            // }

            return '<p>' + checkbox + row.CompanyName + `<span style="float:right;">$${row.GrandTotal}</span>` + '</p><a style="cursor:pointer" class="IDHREF"><span style="background:#ececec;padding:1px 5px;margin-right:2px;" >#' + number + '</span></a>&nbsp;|&nbsp;<span class="order-date">' + row.DateRequested + '</span> <span style="float:right" class="badge ' + cstyle + ' btn-xs">' + status + '</span><br><span class="pink" style="padding:1px 5px;margin-right:2px;">' + row.DueDate + '</span>&nbsp;|&nbsp; ' + daystext + '  <span style="float:right" class="btn-xs" ngbTooltip="Email Sent">' + IsEmailSent + '</span> </a>';


          },
        },
        { data: 'SONo', name: 'SONo', orderable: true, searchable: true, },
        { data: 'Status', name: 'Status', orderable: true, searchable: true, },
        { data: 'DateRequested', name: 'DateRequested', orderable: true, searchable: true, },
        { data: 'GrandTotal', name: 'GrandTotal', orderable: true, searchable: true, },
        { data: 'RRNo', name: 'RRNo', orderable: true, searchable: true, },
        { data: 'SOType', name: 'SOType', orderable: true, searchable: true, },
        { data: 'QuoteNo', name: 'QuoteNo', orderable: true, searchable: true, },
        { data: 'CustomerPONo', name: 'CustomerPONo', orderable: true, searchable: true, },
        { data: 'DueDateTo', name: 'DueDateTo', orderable: true, searchable: true, },
        { data: 'DueDate', name: 'DueDate', orderable: true, searchable: true, },
        { data: 'DateRequestedTo', name: 'DateRequestedTo', orderable: true, searchable: true, },



      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.IDHREF', row).unbind('click');
        $('.IDHREF', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.loadTemplate("view", data.SOId);
          this.SOId = data.SOId
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

  loadTemplate(type, SOId) {
    switch (type) {
      case "view":
        this.spinner.show();
        this.PartItem = [];
        var postData = {
          SOId: SOId,
        }
        this.commonService.postHttpService(postData, "SOView").subscribe(response => {
          if (response.status == true) {
            this.result = response.responseData;
            this.SalesOrderInfo = this.result.SalesOrderInfo[0] || "";
            this.AttachmentList = this.result.AttachmentList || []
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

            if (this.SalesOrderInfo.RRId != 0) {
              this.number = this.SalesOrderInfo.RRNo
            }
            else {
              this.number = this.SalesOrderInfo.SONo
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
            this.RRId = this.SalesOrderInfo.RRId

            this.PhoneShippingAddress = this.ShippingAddress.Phone
            this.PhoneBillingAddress = this.BillingAddress.Phone;
            this.SalesOrder_notes = SalesOrder_notes

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
        var position = 3;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
        pdf.save('sales-order.pdf');
        this.hideAddress = true
      });
    }, 500);
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
    let obj = this
    var table = $('#datatable-angular').DataTable();
    table.columns(1).search(this.SONo);
    table.columns(2).search(this.Status);
    table.columns(3).search(this.RequesteddateDate);
    table.columns(6).search(this.SOType);
    table.columns(5).search(this.RRNo);
    table.columns(7).search(this.QuoteNo);
    table.columns(8).search(this.CustomerPONo);
    table.columns(9).search(this.DueDateToDate);
    table.columns(10).search(this.DuedateDate);
    table.columns(11).search(this.RequestedDateToDate);
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
    table.columns(1).search(this.SONo);
    table.columns(2).search(this.Status);
    table.columns(3).search(this.RequesteddateDate);
    table.columns(6).search(this.SOType);
    table.columns(5).search(this.RRNo);
    table.columns(7).search(this.QuoteNo);
    table.columns(8).search(this.CustomerPONo);
    table.columns(9).search(this.DueDateToDate);
    table.columns(10).search(this.DuedateDate);
    table.columns(11).search(this.RequestedDateToDate);
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








  backToRRView() {
    this.navCtrl.navigate('/admin/repair-request/edit', { RRId: this.SalesOrderInfo.RRId });
  }
















  reLoad() {
    this.router.navigate([this.currentRouter])
  }
  onSubmit() {
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

    var postData = {
      "RRId": 0,
      "CustomerId": this.model.CustomerId,
      "SOType": this.model.SOType,
      "DateRequested": DateRequested,
      "DueDate": DueDate,
      "CustomerPONo": "",
      "ReferenceNo": this.ReferenceNo,
      "WarehouseId": "2",
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
      "Status": this.model.SoStatus,
      "SalesOrderItem": this.PartItem,
      "ShipOrderAddress":
      {
        "AddressName": this.sh_ShipName,
        "AddressType": 1,
        "StreetAddress": this.sh_street_address,
        "SuiteOrApt": this.sh_SuiteOrApt,
        "City": this.sh_city,
        "StateId": this.sh_StateId,
        "CountryId": this.sh_CountryId,
        "Zip": this.sh_zip,
        "AllowShipment": this.sh_AllowShipment,
        "Phone": "123457",
        "Fax": "987656544"
      },
      "BillOrderAddress":
      {
        "AddressName": this.bi_BillName,
        "AddressType": 2,
        "StreetAddress": this.bi_street_address,
        "SuiteOrApt": this.bi_SuiteOrApt,
        "City": this.bi_city,
        "StateId": this.bi_StateId,
        "CountryId": this.bi_CountryId,
        "Zip": this.bi_zip,
        "AllowShipment": this.bi_AllowShipment,
        "Phone": "565",
        "Fax": "787686"
      },
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
          text: 'Sales Order  is safe:)',
          type: 'error'
        });
      }
    });

  }



}


