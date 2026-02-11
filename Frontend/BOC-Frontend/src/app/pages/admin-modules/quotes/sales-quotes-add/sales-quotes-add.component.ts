/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  NgForm,
} from "@angular/forms";
import { CustomvalidationService } from "src/app/core/services/customvalidation.service";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { CommonService } from "src/app/core/services/common.service";
import {
  QuoteType,
  CONST_CREATE_ACCESS,
  warranty_list,
  SalesQuote_Status,
  taxtype,
  Quote_type,
  CONST_COST_HIDE_VALUE,
  Const_Alert_pop_title,
  Const_Alert_pop_message,
  CONST_BillAddressType,
  CONST_ShipAddressType,
  CONST_ContactAddressType,
  VAT_field_Name,
} from "src/assets/data/dropdown";
import {
  FileUploadValidators,
  FileUploadControl,
} from "@iplab/ngx-file-upload";
import { UploadFilesService } from "src/app/core/services/upload-files.service";
import { attachment_thumb_images } from "src/assets/data/dropdown";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { DatePipe } from "@angular/common";
import * as moment from "moment";

export interface Address {
  StreetAddress: string;
  SuiteOrApt: string;
  CountryId: string;
  StateId: string;
  City: string;
  Zip: string;
  PhoneNoPrimary: string;
  PhoneNoSecondary: string;
  Fax: string;
  IsSetDefault: string;
  AddressType: string;
  Addressname: string;
}
export interface AddressData {
  AddressList: Address[];
}

@Component({
  selector: "app-sales-quotes-add",
  templateUrl: "./sales-quotes-add.component.html",
  styleUrls: ["./sales-quotes-add.component.scss"],
})
export class SalesQuotesAddComponent implements OnInit {
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

  Currentdate = new Date();
  showSearch: boolean = true;

  dateFilter;
  PON;
  LPPList;
  RecommendedPrice;
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
  VAT_field_Name;
  IsDeleted;
  GrandTotalUSD;
  IsDisplayBaseCurrencyValue;
  showlineItem: boolean = false;
  Symbol;
  CustomerLocation;
  CustomerVatTax;
  ExchangeRate;
  CustomerCurrencyCode;
  BaseCurrencySymbol;
  LocationName;
  Location;
  countryList: any = [];
  CustomerCountry;
  CustomerCountryId;
  constructor(
    private router: Router,
    public service: CommonService,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private CommonmodalService: BsModalService,
    public modalRef: BsModalRef,
    private datePipe: DatePipe
  ) {}
  currentRouter = this.router.url;

  ngOnInit(): void {
    document.title = "Quote Add";

    this.IsDisplayBaseCurrencyValue = localStorage.getItem(
      "IsDisplayBaseCurrencyValue"
    );
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol");
    this.VAT_field_Name = VAT_field_Name;
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
        // Tax: "",
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
        ItemLocalCurrencySymbol: "",
        BaseRate: "",
        BaseTax: "",
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
        // Tax: "",
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
        ItemLocalCurrencySymbol: "",
        BaseRate: "",
        BaseTax: "",
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

    this.getCountryList();
    this.LocationName = localStorage.getItem("LocationName");
    this.Location = localStorage.getItem("Location");
  }
  getCountryList() {
    this.service.getconutryList().subscribe(
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

  getPartInfo(PartItemId, i) {
    var postData = { PartItemId: PartItemId };
    this.commonService
      .postHttpService(postData, "getPartItemView")
      .subscribe((response) => {
        (this.PartItem[i].PartId = response.responseData[0].PartId),
          (this.PartItem[i].PartNo = response.responseData[0].PartNo),
          (this.PartItem[i].PartDescription = this.getReplace(
            response.responseData[0].Description
          )),
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
      ItemLocalCurrencySymbol: this.Symbol,
      BaseRate: "",
      BaseTax: "",
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
    //this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }

  calculatePrice(index) {
    var price = 0;
    var subTotal = 0;
    let Quantity = this.PartItem[index].Quantity || 0;
    let Rate = this.PartItem[index].Rate || 0;
    let VatTax = this.PartItem[index].ItemTaxPercent / 100;
    let VatTaxPrice = Rate * VatTax;

    // Calculate the price
    price = parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice);
    this.PartItem[index].Tax = (Rate * VatTax).toFixed(2);
    var TaxLocal = Rate * VatTax;
    this.PartItem[index].Price = price.toFixed(2);

    let priceUSD = price * this.ExchangeRate;
    this.PartItem[index].BasePrice = priceUSD.toFixed(2);
    let RateUSD = Rate * this.ExchangeRate;
    this.PartItem[index].BaseRate = RateUSD.toFixed(2);
    let BaseTaxUSD = TaxLocal * this.ExchangeRate;
    this.PartItem[index].BaseTax = BaseTaxUSD.toFixed(2);
    for (let i = 0; i < this.PartItem.length; i++) {
      subTotal += parseFloat(this.PartItem[i].Price);
    }
    //Calculate the subtotal
    this.SubTotal = subTotal;

    let SaveAmount = this.PartItem[index].PON - Rate;

    this.PartItem[index].SaveAmount = SaveAmount;
    this.PartItem[index].NewPricePercent = Math.round(
      (Rate / this.PartItem[index].PON) * 100
    );

    //this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }

  calculateTax() {
    this.TotalTax = (this.SubTotal * this.TaxPercent) / 100;
    this.calculateTotal();
  }

  calculateTotal() {
    var total = 0;
    // let AdditionalCharge = this.AHFees || 0;
    // let Shipping = this.Shipping || 0;
    // let Discount = this.Discount || 0;

    total = parseFloat(this.SubTotal);
    // + parseFloat(this.TotalTax) +
    //   parseFloat(AdditionalCharge) + parseFloat(Shipping) - parseFloat(Discount);
    this.GrandTotal = total.toFixed(2);

    this.GrandTotalUSD = (this.GrandTotal * this.ExchangeRate).toFixed(2);
  }

  getCustomerProperties(CustomerId) {
    if (CustomerId == null || CustomerId == "" || CustomerId == 0) {
      this.showlineItem = false;
      return false;
    }
    let obj = this;

    //CustomerInfo;
    var info = obj.customerInfo.filter(function (value) {
      if (value.CustomerId == CustomerId) {
        return value;
      }
    }, obj);
    this.CustomerCountryId = info[0].CustomerLocation;
    this.CustomerCountry = this.countryList.find(
      (a) => a.CountryId == this.CustomerCountryId
    ).CountryName;
    if (this.CustomerCountryId != this.Location) {
      Swal.fire({
        title: "Country Mismatch",
        html:
          '<b style=" font-size: 14px !important;">' +
          `Customer Country : <span class="badge badge-primary btn-xs">${this.CustomerCountry}</span> , AH Country : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Are you Sure to Process this!` +
          "</b>",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Process it!",
        cancelButtonText: "No, cancel!",
        confirmButtonClass: "btn btn-success mt-2",
        cancelButtonClass: "btn btn-danger ml-2 mt-2",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.model.CompanyName = info[0].CompanyName;
          this.model.FirstName = info[0].FirstName;
          this.model.LastName = info[0].LastName;
          this.model.TaxType = info[0].TaxType;
          this.model.TermsId = info[0].TermsId;
          this.model.Email = info[0].Email;
          this.Symbol = info[0].CurrencySymbol;
          this.CustomerLocation = info[0].CustomerLocation;
          this.CustomerVatTax = info[0].VatTaxPercentage;
          this.CustomerCurrencyCode = info[0].CustomerCurrencyCode;
          this.showlineItem = true;
          for (var i = 0; i < obj.PartItem.length; i++) {
            obj.PartItem.every(function (item: any) {
              return (item.ItemLocalCurrencySymbol = obj.Symbol);
            });
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
              this.customerAddressList = response.responseData.map(function (
                value
              ) {
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
              this.customerAddressList = response.responseData.map(function (
                value
              ) {
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
              this.customerAddressList = response.responseData.map(function (
                value
              ) {
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
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.reLoad();
        }
      });
    } else {
      this.model.CompanyName = info[0].CompanyName;
      this.model.FirstName = info[0].FirstName;
      this.model.LastName = info[0].LastName;
      this.model.TaxType = info[0].TaxType;
      this.model.TermsId = info[0].TermsId;
      this.model.Email = info[0].Email;
      this.Symbol = info[0].CurrencySymbol;
      this.CustomerLocation = info[0].CustomerLocation;
      this.CustomerVatTax = info[0].VatTaxPercentage;
      this.CustomerCurrencyCode = info[0].CustomerCurrencyCode;
      this.showlineItem = true;
      for (var i = 0; i < obj.PartItem.length; i++) {
        obj.PartItem.every(function (item: any) {
          return (item.ItemLocalCurrencySymbol = obj.Symbol);
        });
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
          this.customerAddressList = response.responseData.map(function (
            value
          ) {
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
          this.customerAddressList = response.responseData.map(function (
            value
          ) {
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
          this.customerAddressList = response.responseData.map(function (
            value
          ) {
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
  }

  reLoad() {
    this.router.navigate([this.currentRouter]);
  }
  selectEvent(item, i) {
    this.PartId = item.PartId;
    var postData = { PartId: item.PartId, CustomerId: this.model.CustomerId };
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
            this.PartItem[i].ItemLocalCurrencySymbol = this.Symbol;
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
          this.PartItem[i].ItemLocalCurrencySymbol = this.Symbol;
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
        LocalCurrencyCode: this.CustomerCurrencyCode,
        ExchangeRate: this.ExchangeRate,
        BaseCurrencyCode: localStorage.getItem("BaseCurrencyCode"),
        BaseGrandTotal: this.GrandTotalUSD,

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
        // "TotalValue": this.SubTotal,
        // "ProcessFee": this.AHFees,
        // "TotalTax": this.TotalTax,
        // "Discount": this.Discount,
        // "ShippingFee": this.Shipping,
        // "TaxPercent": this.TaxPercent,
        GrandTotal: this.GrandTotal,
        Status: this.model.QuoteStatus,
        QuoteItem: this.PartItem,
      };
      this.commonService.postHttpService(postData, "QuotesCreate").subscribe(
        (response) => {
          if (response.status == true) {
            this.router.navigate(["/admin/sales-quote/list"], {
              queryParams: { QuoteId: response.responseData.id },
            });

            Swal.fire({
              title: "Success!",
              text: "Sales Quotes Created Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          } else {
            this.btnDisabled = false;
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
      this.btnDisabled = false;
      Swal.fire({
        type: "error",
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }

  ngOnDestroy() {
    this.Type = "";
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
      console.log("firstdata", firstdata);
      var data = firstdata.replace("'", "\\'");
      console.log("data", data);
      return data;
    } else {
      return val;
    }
    // var data = val.replace(/'/g, "\'");
    // console.log(val)
    // var data = val.replace("'","\\'")

    // console.log("data", data)
    // return data;
    // return val;
  }
}
