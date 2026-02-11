/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { DatePipe } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { CommonService } from "src/app/core/services/common.service";
import {
  warranty_list,
  Quote_type,
  SalesQuote_Status,
  CONST_IDENTITY_TYPE_QUOTE,
  CONST_VIEW_ACCESS,
  CONST_CREATE_ACCESS,
  CONST_MODIFY_ACCESS,
  CONST_DELETE_ACCESS,
  CONST_APPROVE_ACCESS,
  CONST_VIEW_COST_ACCESS,
  CONST_COST_HIDE_VALUE,
  CONST_ShipAddressType,
  CONST_BillAddressType,
  Const_Alert_pop_title,
  Const_Alert_pop_message,
  CONST_AH_Group_ID,
  CONST_ContactAddressType,
  Const_AHGroupWebsite,
  VAT_field_Name,
  TOTAL_VAT_field_Name,
  Shipping_field_Name,
} from "src/assets/data/dropdown";
import Swal from "sweetalert2";
import * as moment from "moment";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { AddNotesComponent } from "../../common-template/add-notes/add-notes.component";
import { EditNotesComponent } from "../../common-template/edit-notes/edit-notes.component";
import { RRAddAttachmentComponent } from "../../common-template/rr-add-attachment/rr-add-attachment.component";
import { RrEditAttachmentComponent } from "../../common-template/rr-edit-attachment/rr-edit-attachment.component";
import { EmailComponent } from "../../common-template/email/email.component";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BlanketPoNonRrComponent } from "../../common-template/blanket-po-non-rr/blanket-po-non-rr.component";

@Component({
  selector: "app-sales-quotes-edit",
  templateUrl: "./sales-quotes-edit.component.html",
  styleUrls: ["./sales-quotes-edit.component.scss"],
})
export class SalesQuotesEditComponent implements OnInit {
  submitted = false;
  keyword = "PartNo";
  filteredData: any[];
  isLoading: boolean = false;
  btnDisabled: boolean = false;
  data = [];
  QuoteId;
  result;
  SalesQuoteInfo;
  PartItem: any = [];
  BillingAddress;
  ShippingAddress;
  ContactAddress;
  CustomerBillToId;
  CustomerShipToId;
  warrantyList;
  QuoteTypeList;
  SalesQuoteStatusList;
  customerAddressList;
  AddressList;
  StateList;
  countryList;
  SubTotal;
  GrandTotal;
  AdditionalCharge;
  TotalTax;
  TaxPercent;
  PartNo;
  Discount;
  AHFees;
  Shipping;
  Description;
  QuoteType;
  Status;
  QuoteDate;
  CustomerId;
  QuoteNo;
  SONotes: any = [];
  AttachmentList: any = [];
  RRId;
  partList;
  model: any = [];

  PON;
  LPPList;
  RecommendedPrice;
  //Address
  street_address;
  city;
  StateId;
  zip;
  CountryId;
  AllowShipment;
  ShipCodeId;
  SuiteOrApt;
  ShipName;
  faxContactAddress;
  PhoneContactAddress;
  faxCustomerAddress;

  RRnumber;
  QTnumber;
  number;
  AHAddressList;
  BillName;
  NotesList;
  RRNotesList;
  SalesQuotesCustomerRef;
  QuoteItem;
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
  IsNotesAddEnabled;
  IsNotesEditEnabled;
  IsNotesDeleteEnabled;
  IsAttachmentEnabled;
  IsAttachmentAddEnabled;
  IsAttachmentEditEnabled;
  IsAttachmentDeleteEnabled;
  QuoteTypeStyle;
  settingsView;
  Notes;
  AHGroupWebsite;
  VAT_field_Name;
  Shipping_field_Name;
  GrandTotalUSD;
  IsDisplayBaseCurrencyValue;
  showlineItem: boolean = false;
  Symbol;
  CustomerLocation;
  CustomerVatTax;
  CustomerCurrencyCode;
  ExchangeRate;
  BaseCurrencySymbol;
  BaseCurrencyCode;
  isCurrencyMode: boolean = false;
  Location;
  LocationName;
  constructor(
    private modalService: NgbModal,
    private commonService: CommonService,
    private cd_ref: ChangeDetectorRef,
    private datePipe: DatePipe,
    public navCtrl: NgxNavigationWithDataComponent,
    private CommonmodalService: BsModalService,
    public modalRef: BsModalRef,
    private router: Router,
    private route: ActivatedRoute
  ) // private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>
  {}
  currentRouter = decodeURIComponent(this.router.url);

  ngOnInit() {
    document.title = "Quote Edit";
    this.VAT_field_Name = TOTAL_VAT_field_Name; // VAT_field_Name
    this.Shipping_field_Name = Shipping_field_Name;
    this.IsDisplayBaseCurrencyValue = localStorage.getItem(
      "IsDisplayBaseCurrencyValue"
    );
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol");
    this.BaseCurrencyCode = localStorage.getItem("BaseCurrencyCode");

    this.IsSOViewEnabled = this.commonService.permissionCheck(
      "ManageSalesQuotes",
      CONST_VIEW_ACCESS
    );
    this.IsSOAddEnabled = this.commonService.permissionCheck(
      "ManageSalesQuotes",
      CONST_CREATE_ACCESS
    );
    this.IsSOEditEnabled = this.commonService.permissionCheck(
      "ManageSalesQuotes",
      CONST_MODIFY_ACCESS
    );
    this.IsSODeleteEnabled = this.commonService.permissionCheck(
      "ManageSalesQuotes",
      CONST_DELETE_ACCESS
    );
    this.IsSOViewCostEnabled = this.commonService.permissionCheck(
      "ManageSalesQuotes",
      CONST_VIEW_COST_ACCESS
    );
    this.IsSOPrintPDFEnabled = this.commonService.permissionCheck(
      "QuotePrintAndPDFExport",
      CONST_VIEW_ACCESS
    );
    this.IsSOEmailEnabled = this.commonService.permissionCheck(
      "QuoteEmail",
      CONST_VIEW_ACCESS
    );
    this.IsSOExcelEnabled = this.commonService.permissionCheck(
      "QuoteDownloadExcel",
      CONST_VIEW_ACCESS
    );
    this.IsConvertQuoteToSOEnabled = this.commonService.permissionCheck(
      "ConvertQuoteToSO",
      CONST_VIEW_ACCESS
    );
    this.IsSONotesEnabled = this.commonService.permissionCheck(
      "SalesQuoteNotes",
      CONST_VIEW_ACCESS
    );
    this.IsNotesAddEnabled = this.commonService.permissionCheck(
      "SalesQuoteNotes",
      CONST_CREATE_ACCESS
    );
    this.IsNotesEditEnabled = this.commonService.permissionCheck(
      "SalesQuoteNotes",
      CONST_MODIFY_ACCESS
    );
    this.IsNotesDeleteEnabled = this.commonService.permissionCheck(
      "SalesQuoteNotes",
      CONST_DELETE_ACCESS
    );

    this.IsAttachmentEnabled = this.commonService.permissionCheck(
      "SalesQuoteAttachment",
      CONST_VIEW_ACCESS
    );
    this.IsAttachmentAddEnabled = this.commonService.permissionCheck(
      "SalesQuoteAttachment",
      CONST_CREATE_ACCESS
    );
    this.IsAttachmentEditEnabled = this.commonService.permissionCheck(
      "SalesQuoteAttachment",
      CONST_MODIFY_ACCESS
    );
    this.IsAttachmentDeleteEnabled = this.commonService.permissionCheck(
      "SalesQuoteAttachment",
      CONST_DELETE_ACCESS
    );

    // this.QuoteId = this.navCtrl.get('QuoteId');

    if (history.state.QuoteId == undefined) {
      this.route.queryParams.subscribe((params) => {
        this.QuoteId = params["QuoteId"];
      });
    } else if (history.state.QuoteId != undefined) {
      this.QuoteId = history.state.QuoteId;
    }
    this.QuoteTypeStyle = "";
    this.SalesQuoteInfo = "";
    this.Notes = "";
    this.PartItem = [];
    this.BillingAddress = "";
    this.ShippingAddress = "";
    this.ContactAddress = "";
    this.SONotes = [];
    this.AttachmentList = [];
    // Redirect to the List page if the View Id is not available
    if (
      this.QuoteId == "" ||
      this.QuoteId == "undefined" ||
      this.QuoteId == null
    ) {
      this.navCtrl.navigate("./admin/Quotes-List");
      return false;
    }
    this.getAHGroupaddress();
    this.getViewContent();
    this.warrantyList = warranty_list;
    this.QuoteTypeList = Quote_type;
    this.SalesQuoteStatusList = SalesQuote_Status;
    this.AHGroupWebsite = Const_AHGroupWebsite;

    this.getAdminSettingsView();
    this.Location = localStorage.getItem("Location");
    this.LocationName = localStorage.getItem("LocationName");
  }

  getAdminSettingsView() {
    var postData = {};
    this.commonService
      .postHttpService(postData, "getSettingsGeneralView")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.settingsView = response.responseData;
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  getViewContent() {
    //View content
    var postData = {
      QuoteId: this.QuoteId,
    };
    this.commonService
      .postHttpService(postData, "getSalesQuotesView")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.result = response.responseData;
            this.result = response.responseData;
            this.SalesQuoteInfo = this.result.BasicInfo[0];
            this.PartItem = this.result.QuoteItem;
            for (var i = 0; i < this.PartItem.length; i++) {
              this.PartItem.every(function (item: any) {
                return (item.Part = item.PartNo);
              });
            }
            this.QuoteTypeStyle = this.QuoteTypeList.find(
              (a) => a.Quote_TypeId == this.SalesQuoteInfo.QuoteType
            );

            this.model.QuoteType = this.SalesQuoteInfo.QuoteType;
            this.BillingAddress = this.result.BillingAddress[0];
            this.ShippingAddress = this.result.ShippingAddress[0];
            this.ContactAddress = this.result.ContactAddress[0];
            this.SONotes = this.result.NotesList;
            this.AttachmentList = this.result.AttachmentList;
            this.model.Status = this.SalesQuoteInfo.Status;
            this.RRId = this.SalesQuoteInfo.RRId;
            this.QuoteNo = this.SalesQuoteInfo.QuoteNo;
            this.Description = this.getReplace(this.SalesQuoteInfo.Description);
            this.Notes = this.SalesQuoteInfo.Notes;
            const Requestedyear = Number(
              this.datePipe.transform(this.SalesQuoteInfo.QuoteDate, "yyyy")
            );
            const RequestedMonth = Number(
              this.datePipe.transform(this.SalesQuoteInfo.QuoteDate, "MM")
            );
            const RequestedDay = Number(
              this.datePipe.transform(this.SalesQuoteInfo.QuoteDate, "dd")
            );
            this.model.QuoteDate = {
              year: Requestedyear,
              month: RequestedMonth,
              day: RequestedDay,
            };
            this.CustomerId = this.SalesQuoteInfo.IdentityId;
            this.model.CustomerBillToId = this.SalesQuoteInfo.CustomerBillToId;
            this.model.CustomerShipToId = this.SalesQuoteInfo.CustomerShipToId;
            this.CountryId = this.ContactAddress.CountryId;
            // this.TotalTax = this.SalesQuoteInfo.TotalTax;
            // this.Discount = this.SalesQuoteInfo.Discount;
            // this.AHFees = this.SalesQuoteInfo.ProcessFee;
            this.GrandTotal = this.SalesQuoteInfo.GrandTotal;
            this.GrandTotalUSD = this.SalesQuoteInfo.BaseGrandTotal;
            this.ExchangeRate = this.SalesQuoteInfo.ExchangeRate;

            // this.Shipping = this.SalesQuoteInfo.ShippingFee;
            // this.SubTotal = this.SalesQuoteInfo.TotalValue;
            // this.TaxPercent = this.SalesQuoteInfo.TaxPercent
            this.faxContactAddress = this.ContactAddress.Fax;
            this.PhoneContactAddress = this.ContactAddress.Phone;
            this.Symbol = this.SalesQuoteInfo.CurrencySymbol;
            this.CustomerLocation = this.SalesQuoteInfo.CustomerLocation;
            this.CustomerVatTax = this.SalesQuoteInfo.VatTaxPercentage;
            this.CustomerCurrencyCode =
              this.SalesQuoteInfo.CustomerCurrencyCode;
            if (
              this.CustomerCurrencyCode ==
              localStorage.getItem("BaseCurrencyCode")
            ) {
              this.ExchangeRate = 1;
            }
            this.getCustomerProperties(this.CustomerId);
            this.PartItem.map((a) => {
              a.TaxWithQuantity = (a.Quantity * a.Tax).toFixed(2);
            });

            //For attachment
            if (this.SalesQuoteInfo.RRId != 0) {
              this.RRnumber = this.SalesQuoteInfo.RRNo;
              this.number = this.SalesQuoteInfo.RRNo;
            } else {
              this.QTnumber = this.SalesQuoteInfo.QuoteNo;
              this.number = this.SalesQuoteInfo.QuoteNo;
            }

            if (
              this.BillingAddress.IdentityId == this.SalesQuoteInfo.VendorId
            ) {
              this.BillName = this.SalesQuoteInfo.VendorName;
            } else if (this.BillingAddress.IdentityType == "Customer") {
              this.BillName = this.SalesQuoteInfo.CompanyName;
            } else if (this.BillingAddress.IdentityId == CONST_AH_Group_ID) {
              this.BillName = "Aibond";
            }
            this.QuoteItem = this.result.QuoteItem;
            this.SalesQuotesCustomerRef = this.result.CustomerReference || [];
            if (
              this.ShippingAddress.IdentityId == this.SalesQuoteInfo.VendorId
            ) {
              this.ShipName = this.SalesQuoteInfo.VendorName;
            } else if (this.ShippingAddress.IdentityType == "Customer") {
              this.ShipName = this.SalesQuoteInfo.CompanyName;
            } else if (this.ShippingAddress.IdentityId == CONST_AH_Group_ID) {
              this.ShipName = "Aibond";
            }
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }
  getCustomerProperties(CustomerId) {
    if (CustomerId == null || CustomerId == "" || CustomerId == 0) {
      this.showlineItem = false;
      return false;
    }
    this.showlineItem = true;
    var postData = {
      IdentityId: this.CustomerId,
      IdentityType: this.SalesQuoteInfo.IdentityType,
      Type: CONST_ShipAddressType,
    };
    //CustomerAddressLoad
    this.commonService
      .postHttpService(postData, "getAddressList")
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
        //shippingAddress
        var ShippingAddress = obj.AddressList.filter(function (value) {
          if (value.IsShippingAddress == 1) {
            return value.AddressId;
          }
        }, obj);
        this.model.CustomerShipToId = ShippingAddress[0].AddressId;
      });

    var postData1 = {
      IdentityId: this.CustomerId,
      IdentityType: this.SalesQuoteInfo.IdentityType,
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
      });
  }
  getCountryList() {
    this.commonService.getconutryList().subscribe(
      (response) => {
        if (response.status == true) {
          this.countryList = response.responseData;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  getStateList(sh_CountryId) {
    var postData = {
      CountryId: this.CountryId,
    };
    this.commonService
      .getHttpServiceStateId(postData, "getStateListDropdown")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.StateList = response.responseData;
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
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
      // "Tax": "",
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
      Tax: "",
      ItemTaxPercent: "",
      BasePrice: "",
      ItemLocalCurrencyCode: "",
      ItemExchangeRate: "",
      ItemBaseCurrencyCode: "",
      ItemLocalCurrencySymbol: this.SalesQuoteInfo.CustomerCurrencySymbol,
      BaseRate: "",
      BaseTax: "",
      ShippingCharge: 0,
      BaseShippingCharge: 0,
    });
  }

  onSubmit(f: NgForm) {
    //QuoteDate
    const reqYears = this.model.QuoteDate.year;
    const reqDates = this.model.QuoteDate.day;
    const reqmonths = this.model.QuoteDate.month;
    let requestDates = new Date(reqYears, reqmonths - 1, reqDates);
    let DateRequested = moment(requestDates).format("YYYY-MM-DD");

    if (f.valid) {
      if (this.SalesQuoteInfo.CreatedByLocation == this.Location) {
        let obj = this;
        obj.PartItem.filter(function (value) {
          if (
            value.ItemLocalCurrencySymbol !=
            obj.SalesQuoteInfo.CustomerCurrencySymbol
          ) {
            return (this.isCurrencyMode = true);
          }
        }, obj);
        if (!this.isCurrencyMode) {
          this.btnDisabled = true;
          var postData = {
            LocalCurrencyCode: this.CustomerCurrencyCode,
            ExchangeRate: this.ExchangeRate,
            BaseCurrencyCode: localStorage.getItem("BaseCurrencyCode"),
            BaseGrandTotal: this.GrandTotalUSD,

            QuoteId: this.QuoteId,
            QuoteNo: this.QuoteNo,
            QuoteType: this.model.QuoteType,
            RRId: this.SalesQuoteInfo.RRId,
            IdentityType: this.SalesQuoteInfo.IdentityType,
            IdentityId: this.SalesQuoteInfo.IdentityId,
            Description: this.setReplace(this.Description),
            QuoteDate: DateRequested,
            CompanyName: this.SalesQuoteInfo.CompanyName,
            FirstName: this.SalesQuoteInfo.FirstName,
            LastName: this.SalesQuoteInfo.LastName,
            TaxType: this.SalesQuoteInfo.TaxType,
            TermsId: this.SalesQuoteInfo.TermsId,
            Notes: this.Notes,
            AddressId: this.SalesQuoteInfo.AddressId,
            CustomerShipToId: this.model.CustomerShipToId,
            CustomerBillToId: this.model.CustomerBillToId,
            // "TotalValue": this.SubTotal,
            // "ProcessFee": this.AHFees,
            // "TotalTax": this.TotalTax,
            // "Discount": this.Discount,
            // "ShippingFee": this.Shipping,
            GrandTotal: this.GrandTotal,
            Status: this.Status,
            // "TaxPercent": this.TaxPercent,
            QuoteItem: this.PartItem,
          };
          this.commonService
            .putHttpService(postData, "editSalesQuotes")
            .subscribe(
              (response) => {
                if (response.status == true) {
                  this.btnDisabled = false;
                  this.reLoad();
                  // this.navCtrl.navigate('/admin/sales-quote/list');
                  Swal.fire({
                    title: "Success!",
                    text: "Sales Quotes Updated Successfully!",
                    type: "success",
                    confirmButtonClass: "btn btn-confirm mt-2",
                  });
                } else {
                  this.btnDisabled = false;
                  Swal.fire({
                    title: "Error!",
                    text: "Sales Quotes could not be Updated!",
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
            type: "info",
            title: "Customer Currency Mismatch",
            text: `Customer Currency Code is Changed. Please contact admin to update a quote`,
            confirmButtonClass: "btn btn-confirm mt-2",
          });
        }
      } else {
        Swal.fire({
          type: "info",
          title: "AH Country Mismatch",
          html:
            '<b style=" font-size: 14px !important;">' +
            `Quote Added from  : <span class="badge badge-primary btn-xs">${this.SalesQuoteInfo.CreatedByLocationName}</span> country . Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!` +
            "</b>",
          confirmButtonClass: "btn btn-confirm mt-2",
        });
      }
    } else {
      this.btnDisabled = false;
      Swal.fire({
        type: "error",
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: "btn btn-confirm mt-2",
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
          CustomerShipToId: this.model.CustomerShipToId,
          CustomerBillToId: this.model.CustomerBillToId,
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
        var LocalCurrencyCode = this.SalesQuoteInfo.LocalCurrencyCode;
        var ExchangeRate = this.SalesQuoteInfo.ExchangeRate;
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
              LocalCurrencyCode,
              ExchangeRate,
            },
            class: "modal-lg",
          },
          class: "gray modal-lg",
        });

        this.modalRef.content.closeBtnName = "Close";

        this.modalRef.content.event.subscribe((res) => {
          this.reLoad();
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

  reLoad() {
    this.router.navigate([this.currentRouter.split("?")[0]], {
      queryParams: { QuoteId: this.QuoteId },
    });
  }

  removePartItem(i, QuoteItemId) {
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
        if (QuoteItemId != undefined) {
          if (this.SalesQuoteInfo.CreatedByLocation == this.Location) {
            var postData = {
              QuoteItemId: QuoteItemId,
              TaxPercent: this.TaxPercent,
              QuoteId: this.QuoteId,
            };

            this.commonService
              .postHttpService(postData, "DeleteQuoteItem")
              .subscribe((response) => {
                if (response.status == true) {
                  this.PartItem.splice(i, 1);

                  this.changeStatus(i);

                  Swal.fire({
                    title: "Deleted!",
                    text: "item has been deleted.",
                    type: "success",
                  });
                }
              });
          } else {
            Swal.fire({
              type: "info",
              title: "AH Country Mismatch",
              html:
                '<b style=" font-size: 14px !important;">' +
                `Quote Added from  : <span class="badge badge-primary btn-xs">${this.SalesQuoteInfo.CreatedByLocationName}</span> country . Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!` +
                "</b>",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          }
        } else {
          this.PartItem.splice(i, 1);
          this.changeStatus(i);
        }
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Item is safe:)",
          type: "error",
        });
      }
    });
  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }
  selectEvent(item, i) {
    var postData = {
      PartId: item.PartId,
      CustomerId: this.SalesQuoteInfo.IdentityId,
    };
    this.commonService
      .postHttpService(postData, "getPartDetails")
      .subscribe((response) => {
        this.ExchangeRate = response.responseData[0].ExchangeRate;
        if (
          this.CustomerCurrencyCode != localStorage.getItem("BaseCurrencyCode")
        ) {
          if (this.ExchangeRate == null) {
            Swal.fire({
              type: "info",
              title: "Message",
              text: `Exchange rate is not available for ${this.CustomerCurrencyCode} to USD. Please contact admin to create a quote`,
              confirmButtonClass: "btn btn-confirm mt-2",
            });
            this.PartItem[i].Part = "";
          } else {
            (this.PartItem[i].PartId = response.responseData[0].PartId),
              (this.PartItem[i].PartNo = response.responseData[0].PartNo),
              (this.PartItem[i].PartDescription = this.getReplace(
                response.responseData[0].Description
              )),
              (this.PartItem[i].Quantity = response.responseData[0].Quantity),
              (this.PartItem[i].Rate = response.responseData[0].Price);
            this.PartItem[i].ItemLocalCurrencyCode = this.CustomerCurrencyCode;
            this.PartItem[i].ItemExchangeRate = this.ExchangeRate;
            this.PartItem[i].ItemBaseCurrencyCode =
              localStorage.getItem("BaseCurrencyCode");
            this.PartItem[i].ItemLocalCurrencySymbol =
              this.SalesQuoteInfo.CustomerCurrencySymbol;
            if (localStorage.getItem("Location") == this.CustomerLocation) {
              if (response.responseData[0].PartVatTaxPercentage != null) {
                this.PartItem[i].ItemTaxPercent =
                  response.responseData[0].PartVatTaxPercentage;
              } else {
                this.PartItem[i].ItemTaxPercent = this.CustomerVatTax;
              }
            } else {
              this.PartItem[i].ItemTaxPercent = "0";
            }
            this.calculatePrice(i);
          }
        } else {
          this.ExchangeRate = "1";
          (this.PartItem[i].PartId = response.responseData[0].PartId),
            (this.PartItem[i].PartNo = response.responseData[0].PartNo),
            (this.PartItem[i].PartDescription = this.getReplace(
              response.responseData[0].Description
            )),
            (this.PartItem[i].Quantity = response.responseData[0].Quantity),
            (this.PartItem[i].Rate = response.responseData[0].Price);
          this.PartItem[i].ItemLocalCurrencyCode = this.CustomerCurrencyCode;
          this.PartItem[i].ItemExchangeRate = this.ExchangeRate;
          this.PartItem[i].ItemBaseCurrencyCode =
            localStorage.getItem("BaseCurrencyCode");
          this.PartItem[i].ItemLocalCurrencySymbol =
            this.SalesQuoteInfo.CustomerCurrencySymbol;
          if (localStorage.getItem("Location") == this.CustomerLocation) {
            if (response.responseData[0].PartVatTaxPercentage != null) {
              this.PartItem[i].ItemTaxPercent =
                response.responseData[0].PartVatTaxPercentage;
            } else {
              this.PartItem[i].ItemTaxPercent = this.CustomerVatTax;
            }
          } else {
            this.PartItem[i].ItemTaxPercent = "0";
          }
          this.calculatePrice(i);
        }
      });

    //GetPON
    var postData1 = {
      PartId: item.PartId,
      CustomerId: this.SalesQuoteInfo.IdentityId,
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

  changeStatus(index) {
    var subTotal = 0;
    // Calculate the subtotal
    for (let i = 0; i < this.PartItem.length; i++) {
      subTotal += this.PartItem[i].Price;
    }
    this.SubTotal = subTotal;
    // this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }
  calculateTax() {
    this.TotalTax = (this.SubTotal * this.TaxPercent) / 100;
    this.calculateTotal();
  }

  calculatePrice(index) {
    var price = 0;
    var subTotal = 0;
    let Quantity = this.PartItem[index].Quantity || 0;
    let Rate = this.PartItem[index].Rate || 0;
    let VatTax = this.PartItem[index].ItemTaxPercent / 100;
    let VatTaxPrice = Rate * VatTax;
    let ShippingCharge = this.PartItem[index].ShippingCharge || 0;
    // Calculate the price
    price =
      parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice) +
      parseFloat(ShippingCharge);
    this.PartItem[index].Tax = (Rate * VatTax).toFixed(2);

    this.PartItem[index].Price = parseFloat(price.toFixed(2));
    var TaxLocal = Rate * VatTax;
    this.PartItem[index].TaxWithQuantity = (Quantity * TaxLocal).toFixed(2);
    let BaseShippingCharge = ShippingCharge * this.ExchangeRate;
    this.PartItem[index].BaseShippingCharge = BaseShippingCharge.toFixed(2);
    let priceUSD = price * this.ExchangeRate;
    this.PartItem[index].BasePrice = priceUSD.toFixed(2);
    let RateUSD = Rate * this.ExchangeRate;
    this.PartItem[index].BaseRate = RateUSD.toFixed(2);
    let BaseTaxUSD = TaxLocal * this.ExchangeRate;
    this.PartItem[index].BaseTax = BaseTaxUSD.toFixed(2);
    for (let i = 0; i < this.PartItem.length; i++) {
      subTotal += this.PartItem[i].Price;
    }
    //Calculate the subtotal
    this.SubTotal = subTotal;

    // this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }

  calculateTotal() {
    var total = 0;
    // let AdditionalCharge = this.AHFees || 0;
    // let Shipping = this.Shipping || 0;
    // let Discount = this.Discount || 0;

    total = parseFloat(this.SubTotal);
    //  parseFloat(this.TotalTax) +
    //   parseFloat(AdditionalCharge) + parseFloat(Shipping) - parseFloat(Discount);
    this.GrandTotal = parseFloat(total.toFixed(2));
    this.GrandTotalUSD = (this.GrandTotal * this.ExchangeRate).toFixed(2);
  }

  backToRRView() {
    this.router.navigate(["/admin/repair-request/edit"], {
      state: { RRId: this.SalesQuoteInfo.RRId },
    });
  }

  //Email
  QuoteEmail() {
    this.getPdfBase64((pdfBase64) => {
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

      this.modalRef.content.event.subscribe((res) => {});
    });
  }

  getAHGroupaddress() {
    var postData = {
      IdentityId: CONST_AH_Group_ID,
      IdentityType: 2,
      Type: CONST_ContactAddressType,
    };
    this.commonService
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.AHAddressList = response.responseData[0];
      });
  }
  getPdfBase64(cb) {
    this.commonService.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        SalesQuoteInfo: this.SalesQuoteInfo,
        AHAddressList: this.AHAddressList,
        RRnumber: this.RRnumber,
        QTnumber: this.QTnumber,
        BillName: this.BillName,
        BillingAddress: this.BillingAddress,
        ShipName: this.ShipName,
        ShippingAddress: this.ShippingAddress,
        SalesQuotesCustomerRef: this.SalesQuotesCustomerRef,
        QuoteItem: this.QuoteItem,
        IsSONotesEnabled: this.IsSONotesEnabled,
        settingsView: this.settingsView,
        NotesList: this.NotesList,
        RRNotesList: this.RRNotesList,
        AHGroupWebsite: this.AHGroupWebsite,
        RRId: this.RRId,
        Logo: base64,
      };

      this.commonService
        .postHttpService({ pdfObj }, "getSQPdfBase64")
        .subscribe((response) => {
          if (response.status == true) {
            cb(response.responseData.pdfBase64);
          }
        });
    });
  }
  //Notes Section
  addNotes() {
    var IdentityId = this.QuoteId;
    var IdentityType = CONST_IDENTITY_TYPE_QUOTE;
    this.modalRef = this.CommonmodalService.show(AddNotesComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { IdentityId, IdentityType },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.SONotes.push(res.data);
    });
  }

  editNotes(note, i) {
    var IdentityId = this.QuoteId;
    var IdentityType = CONST_IDENTITY_TYPE_QUOTE;
    this.modalRef = this.CommonmodalService.show(EditNotesComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { note, i, IdentityId, IdentityType },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.SONotes[i] = res.data;
    });
  }

  deleteNotes(NotesId, i) {
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
          NotesId: NotesId,
        };
        this.commonService
          .postHttpService(postData, "NotesDelete")
          .subscribe((response) => {
            if (response.status == true) {
              this.SONotes.splice(i, 1);
              Swal.fire({
                title: "Deleted!",
                text: "Notes has been deleted.",
                type: "success",
              });
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Notes is safe:)",
          type: "error",
        });
      }
    });
  }

  //AttachementSection
  addAttachment() {
    var IdentityType = CONST_IDENTITY_TYPE_QUOTE;
    var IdentityId = this.QuoteId;
    this.modalRef = this.CommonmodalService.show(RRAddAttachmentComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { IdentityId, IdentityType },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.AttachmentList.push(res.data);
    });
  }

  editAttachment(attachment, i) {
    var IdentityType = CONST_IDENTITY_TYPE_QUOTE;
    var IdentityId = this.QuoteId;
    this.modalRef = this.CommonmodalService.show(RrEditAttachmentComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { attachment, i, IdentityType, IdentityId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.AttachmentList[i] = res.data;
    });
  }

  deleteAttachment(AttachmentId, i) {
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
          AttachmentId: AttachmentId,
        };
        this.commonService
          .postHttpService(postData, "AttachmentDelete")
          .subscribe((response) => {
            if (response.status == true) {
              this.AttachmentList.splice(i, 1);
              Swal.fire({
                title: "Deleted!",
                text: "Attachment has been deleted.",
                type: "success",
              });
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Attachment is safe:)",
          type: "error",
        });
      }
    });
  }

  BackToView() {
    this.router.navigate(["/admin/sales-quote/list"], {
      state: { QuoteId: this.SalesQuoteInfo.QuoteId },
    });
  }
  getReplace(val) {
    if (val) {
      var firstdata = val.replace("\\", "");
      var data = firstdata.replace(/\'/g, "'");
      console.log(data);
      return data;
    } else {
      return val;
    }
  }
  setReplace(val) {
    if (val) {
      var firstdata = val.replace("\\", "");
      var data = firstdata.replace("'", "\\'");
      console.log("data", data);
      return data;
    } else {
      return val;
    }
  }
}
