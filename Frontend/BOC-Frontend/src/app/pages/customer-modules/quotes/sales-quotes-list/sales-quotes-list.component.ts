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
import { Router } from "@angular/router";
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
  SalesQuote_Status_customer,
  attachment_thumb_images,
} from "src/assets/data/dropdown";
import * as moment from "moment";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import jspdf from "jspdf";
import html2canvas from "html2canvas";
import { NgSelectComponent } from "@ng-select/ng-select";
import { ExcelService } from "src/app/core/services/excel.service";

@Component({
  selector: "app-sales-quotes-list",
  templateUrl: "./sales-quotes-list.component.html",
  styleUrls: ["./sales-quotes-list.component.scss"],
  providers: [NgxSpinnerService, BsModalRef],
})
export class SalesQuotesListComponent implements OnInit {
  baseUrl = `${environment.api.apiURL}`;
  PartId;
  submitted = false;

  ExcelData: any = [
    {
      VendorInvoiceNo: "",
      VendorName: "2v",
      GrandTotal: 10000,
      RRNo: null,
      CustomerInvoiceAmount: 0,
      CustomerInvoiceNo: null,
      ReferenceNo: "1",
      Status: "Approved",
    },
    {
      VendorInvoiceNo: "VI1",
      VendorName: "Vendor",
      GrandTotal: 100001,
      RRNo: null,
      CustomerInvoiceAmount: 5000,
      CustomerInvoiceNo: null,
      ReferenceNo: "10",
      Status: "Approved",
    },
    {
      VendorInvoiceNo: "VI4",
      VendorName: "2v",
      GrandTotal: 10000,
      RRNo: null,
      CustomerInvoiceAmount: 4000,
      CustomerInvoiceNo: null,
      ReferenceNo: "1",
      Status: "Approved",
    },
    {
      VendorInvoiceNo: "VI5",
      VendorName: "2v",
      GrandTotal: 10000,
      RRNo: null,
      CustomerInvoiceAmount: 100,
      CustomerInvoiceNo: null,
      ReferenceNo: "1",
      Status: "Approved",
    },
    {
      VendorInvoiceNo: "",
      VendorName: "2v",
      GrandTotal: 10000,
      RRNo: "",
      CustomerInvoiceAmount: 4000,
      CustomerInvoiceNo: null,
      ReferenceNo: "1",
      Status: "Approved",
    },
    {
      VendorInvoiceNo: "VI11",
      VendorName: "Kesavan",
      GrandTotal: 200,
      RRNo: "RR100041",
      CustomerInvoiceAmount: 210,
      CustomerInvoiceNo: null,
      ReferenceNo: "",
      Status: "Draft",
    },
    {
      VendorInvoiceNo: "VI12",
      VendorName: "Kesavan",
      GrandTotal: 200,
      RRNo: "RR100041",
      CustomerInvoiceAmount: 210,
      CustomerInvoiceNo: null,
      ReferenceNo: "",
      Status: "Draft",
    },
    {
      VendorInvoiceNo: "VI13",
      VendorName: "Kesavan",
      GrandTotal: 200,
      RRNo: "RR100041",
      CustomerInvoiceAmount: 210,
      CustomerInvoiceNo: null,
      ReferenceNo: "",
      Status: "Draft",
    },
    {
      VendorInvoiceNo: "VI14",
      VendorName: "Kesavan",
      GrandTotal: 200,
      RRNo: "RR100041",
      CustomerInvoiceAmount: 210,
      CustomerInvoiceNo: "",
      ReferenceNo: "",
      Status: "Draft",
    },
    {
      VendorInvoiceNo: "VI15",
      VendorName: "Kesavan",
      GrandTotal: 200,
      RRNo: "RR100041",
      CustomerInvoiceAmount: 210,
      CustomerInvoiceNo: "",
      ReferenceNo: "",
      Status: "Draft",
    },
    {
      VendorInvoiceNo: "VI16",
      VendorName: "Kesavan",
      GrandTotal: 200,
      RRNo: "RR100041",
      CustomerInvoiceAmount: 210,
      CustomerInvoiceNo: "IO1",
      ReferenceNo: "",
      Status: "Draft",
    },
  ];

  @Input() templateSettings: TemplateRef<HTMLElement>;
  @ViewChild("viewTemplate", null) viewTemplate: TemplateRef<HTMLElement>;
  @ViewChild("editTemplate", null) editTemplate: TemplateRef<HTMLElement>;
  @ViewChild("addTemplate", null) addTemplate: TemplateRef<HTMLElement>;
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
  customerList;
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
  CompanyName;
  Created;
  SalesQuoteStatusList;
  QuoteTypeList;
  DateRequested;
  QuoteType;
  RRNo;
  RRId;
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
  //ADD
  model: any = [];
  partList: any = [];
  customerPartList: any = [];
  partNewList: any = [];
  AddressList;
  customerAddressList;
  TermsList;
  warrantyList;
  PartItem: any = [];
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
  attachmentThumb;
  AttachmentList: any = [];
  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    public router: Router,
    public service: CommonService,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private CommonmodalService: BsModalService,
    private excelService: ExcelService,
    public modalRef: BsModalRef,
    private datePipe: DatePipe,
    public navCtrl: NgxNavigationWithDataComponent,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>
  ) {}
  currentRouter = this.router.url;

  ngOnInit(): void {
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
    this.Created = "";
    this.warrantyList = warranty_list;
    this.SalesQuoteStatusList = SalesQuote_Status_customer;
    this.QuoteTypeList = Quote_type;
    this.attachmentThumb = attachment_thumb_images;
    this.taxType = taxtype;
    this.getTermList();

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };

    var url = this.baseUrl + "/api/v1.0/CustomerPortal/QuoteList";
    const that = this;
    var filterData = {};

    this.dtOptions = {
      dom: '<"row"<"col-12 col-sm-12 col-md-12 col-xl-12"B> <"col-12 col-sm-12 col-md-12 col-xl-12 aso"f>>rt<" row"<"help-block col-12 col-sm-6 col-md-6 col-xl-6"l><"col-12 col-sm-6 col-md-6 col-xl-6"i><"col-12 col-sm-12 col-md-12 col-xl-12"p>>',
      pagingType: "full_numbers",
      pageLength: 10,
      lengthMenu: [
        [10, 25, 50, 100, -1],
        [10, 25, 50, 100, "All"],
      ],
      processing: true,
      serverSide: true,
      retrieve: true,
      order: [[0, "desc"]],
      serverMethod: "post",
      ajax: (dataTablesParameters: any, callback) => {
        that.api_check ? that.api_check.unsubscribe() : (that.api_check = null);

        that.api_check = that.http
          .post<any>(
            url,
            Object.assign(dataTablesParameters, filterData),
            httpOptions
          )
          .subscribe((resp) => {
            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: resp.responseData.data,
            });
            this.QuoteId = resp.responseData.data[0].QuoteId;
            this.loadTemplate("view", this.QuoteId);
          });
      },
      buttons: {
        dom: {
          button: {
            className: "",
          },
        },
        buttons: [
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
      },
      columnDefs: [
        {
          targets: [1],
          visible: false,
          searchable: true,
        },
        {
          targets: [2],
          visible: false,
          searchable: true,
        },
        {
          targets: [3],
          visible: false,
          searchable: true,
        },
        {
          targets: [4],
          visible: false,
          searchable: true,
        },
        {
          targets: [5],
          visible: false,
          searchable: true,
        },
        {
          targets: [6],
          visible: false,
          searchable: true,
        },
        {
          targets: [7],
          visible: false,
          searchable: true,
        },
        {
          targets: [8],
          visible: false,
          searchable: true,
        },
        {
          targets: [9],
          visible: false,
          searchable: true,
        },
        {
          targets: [10],
          visible: false,
          searchable: true,
        },
        {
          targets: [11],
          visible: false,
          searchable: true,
        },
      ],
      createdRow: function (row, data, index) {},
      columns: [
        {
          data: "QuoteId",
          name: "QuoteId",
          defaultContent: "",
          orderable: true,
          searchable: true,
          render: (data: any, type: any, row: any, meta) => {
            var cstyle = "";
            switch (row.Status) {
              case 0: {
                cstyle = "badge-warning";
                status = "Open";
                break;
              }
              case 1: {
                cstyle = "badge-success";
                status = "Approved";
                break;
              }
              case 2: {
                cstyle = "badge-danger";
                status = "Cancelled";
                break;
              }
              case 3: {
                cstyle = "badge-info";
                status = "Draft";
                break;
              }
              case 4: {
                cstyle = "badge-primary";
                status = "Submitted";
                break;
              }
              case 5: {
                cstyle = "badge-secondary";
                status = "Quoted";
                break;
              }
              default: {
                cstyle = "";
                status = "";
                break;
              }
            }
            var cstylealgin = "float:right";
            var sostyles =
              "background:#E8EAF6!important;color:#333;padding:1px 5px;margin-right:8px;";

            var number = "";
            if (row.RRNo != "" && row.RRNo != "0" && row.RRNo != null) {
              number = row.RRNo;
            } else {
              number = row.QuoteNo + " &nbsp;";
            }

            var IsEmailSent = "";
            if (row.IsEmailSent) {
              IsEmailSent = '<i  class="mdi mdi-email-outline red"></i>';
            }

            var QuoteTypeStyle = this.QuoteTypeList.find(
              (a) => a.Quote_TypeId == row.QuoteType
            );

            var checkbox = "";
            // if (row.Status == 0) {
            checkbox = '<input type="checkbox" class="checkbox">&nbsp;';
            //}

            return (
              "<p>" +
              checkbox +
              row.CompanyName +
              `<span style="float:right;">$${row.GrandTotal}</span>` +
              '</p><a style="cursor:pointer" class="IDHREF"><span style="background:#E8EAF6;padding:1px 5px;margin-right:2px;" >#' +
              number +
              '</span></a>&nbsp;|&nbsp;<span class="order-date">' +
              row.Created +
              '</span><br><span style="float:right" class="badge ' +
              cstyle +
              ' btn-xs">' +
              status +
              '</span><span class="pink"><span class="badge ' +
              (QuoteTypeStyle ? QuoteTypeStyle.cstyle : 'btn-xs"') +
              '">' +
              (QuoteTypeStyle ? QuoteTypeStyle.Quote_TypeName : "") +
              '</span>  <span style="float:right" class="btn-xs" ngbTooltip="Email Sent">' +
              IsEmailSent +
              "</span> </a>"
            );
          },
        },
        { data: "QuoteNo", name: "QuoteNo", orderable: true, searchable: true },
        {
          data: "CompanyName",
          name: "CompanyName",
          orderable: true,
          searchable: true,
        },
        { data: "Status", name: "Status", orderable: true, searchable: true },
        { data: "Created", name: "Created", orderable: true, searchable: true },
        {
          data: "GrandTotal",
          name: "GrandTotal",
          orderable: true,
          searchable: true,
        },
        {
          data: "CustomerId",
          name: "CustomerId",
          orderable: true,
          searchable: true,
        },
        { data: "RRNo", name: "RRNo", orderable: true, searchable: true },
        {
          data: "QuoteType",
          name: "QuoteType",
          orderable: true,
          searchable: true,
        },
        {
          data: "Description",
          name: "Description",
          orderable: true,
          searchable: true,
        },
        {
          data: "QuoteDate",
          name: "QuoteDate",
          orderable: true,
          searchable: true,
        },
        {
          data: "QuoteDateTo",
          name: "QuoteDateTo",
          orderable: true,
          searchable: true,
        },
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $(".IDHREF", row).unbind("click");
        $(".IDHREF", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.loadTemplate("view", data.QuoteId);
          this.QuoteId = data.QuoteId;
        });

        $(".checkbox", row).unbind("click");
        $(".checkbox", row).bind("click", (e) => {});

        return row;
      },

      language: {
        paginate: {
          first: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          last: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          next: '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          previous: '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        },
      },
    };

    this.dataTable = $("#datatable-angular");
    this.dataTable.DataTable(this.dtOptions);
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

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.ExcelData, "sample");
  }

  backToRRView() {
    this.navCtrl.navigate("/customer/rr-list");
  }
  hideAddress: boolean = true;
  generatePDF() {
    var data = document.getElementById("contentToConvert");
    this.hideAddress = false;
    setTimeout(() => {
      html2canvas(data).then((canvas) => {
        var imgWidth = 208;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL("image/png");
        let pdf = new jspdf("p", "mm", "a4");

        var position = 3;
        pdf.addImage(
          contentDataURL,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        pdf.save("sales-quote.pdf");
        this.hideAddress = true;
      });
    }, 500);
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
    let obj = this;
    var table = $("#datatable-angular").DataTable();
    table.columns(1).search(this.QuoteNo);
    table.columns(2).search(this.CompanyName);
    table.columns(3).search(this.Status);
    table.columns(4).search(this.DateRequested);
    table.columns(6).search(this.CustomerId);
    table.columns(8).search(this.QuoteType);
    table.columns(7).search(this.RRNo);
    table.columns(9).search(this.Description);
    table.columns(10).search(this.QuoteDateDate);
    table.columns(11).search(this.QuoteDateToDate);
    table.draw();
    this.showSearch = false;
  }

  EnableSearch() {
    this.showSearch = true;
  }

  loadTemplate(type, QuoteId) {
    switch (type) {
      case "view":
        this.spinner.show();

        this.PartItem = [];

        var postData = {
          QuoteId: QuoteId,
        };

        this.service.postHttpService(postData, "QuotesView").subscribe(
          (response) => {
            if (response.status == true) {
              this.result = response.responseData;
              this.SalesQuoteInfo = this.result.BasicInfo[0];
              this.QuoteItem = this.result.QuoteItem;
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

              if (this.SalesQuoteInfo.RRId != 0) {
                this.number = this.SalesQuoteInfo.RRNo;
              } else {
                this.number = this.SalesQuoteInfo.QuoteNo;
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
            } else {
            }
            this.cd_ref.detectChanges();
            this.spinner.hide();
          },
          (error) => console.log(error)
        );
        this.templateSettings = this.viewTemplate;
        break;
      default:
        this.templateSettings = this.viewTemplate;
        break;
    }
  }

  onClear(event) {
    var table = $("#datatable-angular").DataTable();
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
    table.columns(1).search(this.QuoteNo);
    table.columns(2).search(this.CompanyName);
    table.columns(3).search(this.Status);
    table.columns(4).search(this.Created);
    table.columns(6).search(this.CustomerId);
    table.columns(8).search(this.QuoteType);
    table.columns(7).search(this.RRNo);
    table.columns(9).search(this.Description);
    table.columns(10).search(this.QuoteDate);
    table.columns(11).search(this.QuoteDateTo);
    table.draw();
    this.showSearch = false;
    this.CustomerId = null;
    this.QuoteType = undefined;
    this.Status = undefined;

    this.reLoad();
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
          .postHttpService(postData, "getDeleteCustomer")
          .subscribe((response) => {
            if (response.IsException == null) {
              Swal.fire({
                title: "Deleted!",
                text: "Customer record has been deleted.",
                type: "success",
              });

              // Reload the table
              var table = $("#datatable-angular").DataTable();
              table.draw();
            } else if (
              // Read more about handling dismissals
              result.dismiss === Swal.DismissReason.cancel
            ) {
              Swal.fire({
                title: "Cancelled",
                text: "Customer is safe :)",
                type: "error",
              });
            }
          });
      }
    });
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  getPON() {
    for (let x in this.QuoteItem) {
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

  reLoad() {
    this.router.navigate([this.currentRouter]);
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
              var table = $("#datatable-angular").DataTable();
              table.draw();
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
}
