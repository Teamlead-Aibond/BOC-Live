/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { attachment_thumb_images, Const_Alert_pop_message, Const_Alert_pop_title, CONST_BillAddressType, CONST_ContactAddressType, CONST_ShipAddressType, Hide_add, SalesOrder_Status, SalesOrder_Type, VAT_field_Name, warranty_list } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { CustomerReferenceComponent } from '../../common-template/customer-reference/customer-reference.component';

@Component({
  selector: 'app-add-so',
  templateUrl: './add-so.component.html',
  styleUrls: ['./add-so.component.scss']
})
export class AddSoComponent implements OnInit {

  ShippingAddressList: any = []; BillingAddressList: any = [];
  keywordForCustomer = 'CompanyName';
  customerList: any = [];
  isLoadingCustomer: boolean = false;
  CompanyName;
  keywordForRR = 'RRNo';
  RRList: any[]
  RRId = ''
  isLoadingRR: boolean = false;
  isLoading = false;
  keyword = 'PartNo';
  filteredData: any[];
  data = [];
  btnDisabled: boolean = false;

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
  Currentdate = new Date();
  settingsView
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
  BillingAddress;
  ShippingAddress;
  CustomerPONo
  Billingaddress
  WarehouseId;
  CustomerId;
  CustomerList
  customerReferenceList: any = [];
  ShipAddress: any = []; BillAddress: any = []
  SalesOrderStatus
  SOTypeStyle
  attachmentThumb
  SalesOrderCustomerRef
  SalesOrderType: any = []
  adminList: any = []
  warehouseList: any = []
  ExcludedPartItem: any = []
  showExcludedPartItem = false;
  BlanketPOExcludeAmount;
  BlanketPONetAmount


  showList: boolean = true;
  VAT_field_Name
  IsDeleted;
  GrandTotalUSD
  IsDisplayBaseCurrencyValue
  showlineItem: boolean = false;
  Symbol
  CustomerLocation
  CustomerVatTax
  ExchangeRate
  CustomerCurrencyCode
  BaseCurrencySymbol
  Hide_add
  constructor(private datePipe: DatePipe, private commonService: CommonService, private router: Router,
    public modalRef: BsModalRef, private cd_ref: ChangeDetectorRef, private CommonmodalService: BsModalService,) { }

  ngOnInit(): void {
    this.Hide_add = Hide_add
    if (this.Hide_add != 1) {
      document.title = 'SO Add'
      this.IsDisplayBaseCurrencyValue = localStorage.getItem("IsDisplayBaseCurrencyValue")
      this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol")
      this.VAT_field_Name = VAT_field_Name
      this.settingsView = ""
      this.SOTypeStyle = ""
      this.Billingaddress = ""
      this.getAdminSettingsView();
      this.attachmentThumb = attachment_thumb_images;


      this.BillingAddress = "";
      this.ShippingAddress = "";
      this.AttachmentList = [];
      this.getCustomerList();
      this.getCountryList();
      this.getAdminList();
      this.getWarehouseList();
      this.SalesOrderStatus = SalesOrder_Status;
      this.SalesOrderType = SalesOrder_Type;
      this.warrantyList = warranty_list;
      this.Shipping = "0";
      this.Discount = "0";
      this.AHFees = "0";
      this.BlanketPOExcludeAmount = "0"
      this.BlanketPONetAmount = "0"

      this.PartItem.push({
        Part: '',
        PartId: '',
        PartNo: "",
        Description: "",
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
        IsExcludeFromBlanketPO: 0,
        Tax: '',
        ItemTaxPercent: '',
        BasePrice: '',
        ItemLocalCurrencyCode: '',
        ItemExchangeRate: '',
        ItemBaseCurrencyCode: '',
        ItemLocalCurrencySymbol: '',
        BaseRate: '',
        BaseTax: '',

      });
      this.CustomerRef.push({
        CReferenceId: '',
        ReferenceValue: '',
        ReferenceLabelName: ''
      })
      const years = Number(this.datePipe.transform(this.Currentdate, 'yyyy'));
      const Month = Number(this.datePipe.transform(this.Currentdate, 'MM'));
      const Day = Number(this.datePipe.transform(this.Currentdate, 'dd'));
      this.model.RequestedDate = {
        year: years,
        month: Month,
        day: Day
      }

      this.model.CustomerId = null;
      this.model.SOType = undefined;
      this.settingsView = ""
      this.Notes = "";
      this.Billingaddress = ""
      this.CustomerPONo = "";
      this.ReferenceNo = "";
      //this.CustomerRef = [];
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
      //this.AddReference();
    }

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
      // "Tax": "",
      "Price": "",
      "LeadTime": "",
      "WarrantyPeriod": undefined,
      "DeliveryDate": "",
      "AllowShipment": "",
      "Notes": "",
      "ItemStatus": "",
      "IsExcludeFromBlanketPO": 0,
      Tax: '',
      ItemTaxPercent: '',
      BasePrice: '',
      ItemLocalCurrencyCode: '',
      ItemExchangeRate: '',
      ItemBaseCurrencyCode: '',
      ItemLocalCurrencySymbol: this.Symbol,
      BaseRate: '',
      BaseTax: '',

    });
  }

  removePartItem(i) {
    this.PartItem.splice(i, 1);
    this.changeStatus(i)
  }

  AddExcludedPartItem() {
    this.showExcludedPartItem = true
    this.ExcludedPartItem.push({
      "Part": '',
      "PartId": '',
      "PartNo": "",
      "Description": "",
      "Quantity": "",
      "Rate": "",
      "Discount": "",
      // "Tax": "",
      "Price": "",
      "LeadTime": "",
      "WarrantyPeriod": undefined,
      "DeliveryDate": "",
      "AllowShipment": "",
      "Notes": "",
      "ItemStatus": "",
      "IsExcludeFromBlanketPO": 1,
      Tax: '',
      ItemTaxPercent: '',
      BasePrice: '',
      ItemLocalCurrencyCode: '',
      ItemExchangeRate: '',
      ItemBaseCurrencyCode: '',
      ItemLocalCurrencySymbol: this.Symbol,
      BaseRate: '',
      BaseTax: '',

    });
  }

  removeExcludedPartItem(i) {
    this.ExcludedPartItem.splice(i, 1);
    this.changeStatus(i)
  }
  getWarehouseList() {
    this.commonService.getHttpService('getWarehouseList').subscribe(response => {
      this.warehouseList = response.responseData;
    });
  }
  changeStatus(index) {
    var subTotal = 0;
    var subTotal1 = 0
    // Calculate the subtotal
    for (let i = 0; i < this.PartItem.length; i++) {

      subTotal += this.PartItem[i].Price

    }
    for (let i = 0; i < this.ExcludedPartItem.length; i++) {

      subTotal += this.ExcludedPartItem[i].Price
      subTotal1 += this.ExcludedPartItem[i].Price
    }
    this.BlanketPOExcludeAmount = subTotal1;
    this.SubTotal = subTotal
    // this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }
  calculateTax() {
    this.TotalTax = this.SubTotal * this.TaxPercent / 100;
    this.calculateTotal();

  }
  calculatePrice(index) {
    var price = 0; var subTotal = 0;
    var subTotal1 = 0
    let Quantity = this.PartItem[index].Quantity || 0;
    let Rate = this.PartItem[index].Rate || 0;
    let VatTax = this.PartItem[index].ItemTaxPercent / 100;
    let VatTaxPrice = Rate * VatTax
    // Calculate the price
    price = parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice);
    this.PartItem[index].Price = price
    this.PartItem[index].Tax = (Rate * VatTax)
    var TaxLocal = (Rate * VatTax)
    let priceUSD = price * this.ExchangeRate
    this.PartItem[index].BasePrice = priceUSD.toFixed(2)
    let RateUSD = Rate * this.ExchangeRate
    this.PartItem[index].BaseRate = RateUSD
    let BaseTaxUSD = TaxLocal * this.ExchangeRate
    this.PartItem[index].BaseTax = BaseTaxUSD
    for (let i = 0; i < this.PartItem.length; i++) {
      subTotal += this.PartItem[i].Price

    }
    for (let i = 0; i < this.ExcludedPartItem.length; i++) {
      subTotal += this.ExcludedPartItem[i].Price
      subTotal1 += this.ExcludedPartItem[i].Price

    }
    this.BlanketPOExcludeAmount = subTotal1;
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

    total = parseFloat(this.SubTotal)
    //  + parseFloat(this.TotalTax) +
    //   parseFloat(AdditionalCharge) + parseFloat(Shipping) - parseFloat(Discount);
    this.GrandTotal = parseFloat(total.toFixed(2));
    this.BlanketPONetAmount = (this.GrandTotal - this.BlanketPOExcludeAmount).toFixed(2);

    this.GrandTotalUSD = (this.GrandTotal * this.ExchangeRate).toFixed(2)

  }

  ExcludedPartcalculatePrice(index) {
    var price = 0; var subTotal = 0; var Tax = 0;
    let Quantity = this.ExcludedPartItem[index].Quantity || 0;
    let Rate = this.ExcludedPartItem[index].Rate || 0;
    let VatTax = this.ExcludedPartItem[index].ItemTaxPercent / 100;
    let VatTaxPrice = Rate * VatTax
    // Calculate the price
    price = parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice);
    Tax = (Rate * VatTax);
    this.ExcludedPartItem[index].Price = price.toFixed(2);
    this.ExcludedPartItem[index].Tax = Tax.toFixed(2);
    var TaxLocal = (Rate * VatTax);
    let priceUSD = price * this.ExchangeRate;
    this.ExcludedPartItem[index].BasePrice = priceUSD.toFixed(2);
    let RateUSD = Rate * this.ExchangeRate;
    this.ExcludedPartItem[index].BaseRate = RateUSD.toFixed(2);
    let BaseTaxUSD = TaxLocal * this.ExchangeRate;
    this.ExcludedPartItem[index].BaseTax = BaseTaxUSD.toFixed(2);
    for (let i = 0; i < this.ExcludedPartItem.length; i++) {
      subTotal += parseFloat(this.ExcludedPartItem[i].Price);

    }
    this.BlanketPOExcludeAmount = subTotal.toFixed(2);
    for (let i = 0; i < this.PartItem.length; i++) {

      subTotal += parseFloat(this.PartItem[i].Price);

    }
    //Calculate the subtotal
    this.SubTotal = subTotal.toFixed(2);


    // this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
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
  selectExcludedPartItemEvent(item, j) {
    var postData = { PartId: item.PartId, "CustomerId": this.model.CustomerId };
    this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {
      this.ExchangeRate = response.responseData[0].ExchangeRate
      if (this.CustomerCurrencyCode != localStorage.getItem('BaseCurrencyCode')) {
        if (this.ExchangeRate == null) {
          Swal.fire({
            type: 'info',
            title: 'Message',
            text: `Exchange rate is not available for ${this.CustomerCurrencyCode} to USD. Please contact admin to create a quote`,
            confirmButtonClass: 'btn btn-confirm mt-2',
          });
          this.ExcludedPartItem[j].Part = ''
        } else {
          this.ExcludedPartItem[j].PartId = response.responseData[0].PartId,
            this.ExcludedPartItem[j].PartNo = response.responseData[0].PartNo,
            this.ExcludedPartItem[j].PartDescription = response.responseData[0].Description,
            this.ExcludedPartItem[j].Quantity = response.responseData[0].Quantity,
            this.ExcludedPartItem[j].Rate = response.responseData[0].Price
          this.ExcludedPartItem[j].ItemLocalCurrencyCode = this.CustomerCurrencyCode
          this.ExcludedPartItem[j].ItemExchangeRate = this.ExchangeRate
          this.ExcludedPartItem[j].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
          this.ExcludedPartItem[j].ItemLocalCurrencySymbol = this.Symbol
          if (localStorage.getItem('Location') == this.CustomerLocation) {

            if (response.responseData[0].PartVatTaxPercentage != null) {
              this.ExcludedPartItem[j].ItemTaxPercent = response.responseData[0].PartVatTaxPercentage
            } else {
              this.ExcludedPartItem[j].ItemTaxPercent = this.CustomerVatTax
            }

          } else {
            this.ExcludedPartItem[j].ItemTaxPercent = '0'
          }
          this.ExcludedPartcalculatePrice(j)
        }
      } else {
        this.ExchangeRate = '1'
        this.ExcludedPartItem[j].PartId = response.responseData[0].PartId,
          this.ExcludedPartItem[j].PartNo = response.responseData[0].PartNo,
          this.ExcludedPartItem[j].PartDescription = response.responseData[0].Description,
          this.ExcludedPartItem[j].Quantity = response.responseData[0].Quantity,
          this.ExcludedPartItem[j].Rate = response.responseData[0].Price
        this.ExcludedPartItem[j].ItemLocalCurrencyCode = this.CustomerCurrencyCode
        this.ExcludedPartItem[j].ItemExchangeRate = this.ExchangeRate
        this.ExcludedPartItem[j].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
        this.ExcludedPartItem[j].ItemLocalCurrencySymbol = this.Symbol
        if (localStorage.getItem('Location') == this.CustomerLocation) {

          if (response.responseData[0].PartVatTaxPercentage != null) {
            this.ExcludedPartItem[j].ItemTaxPercent = response.responseData[0].PartVatTaxPercentage
          } else {
            this.ExcludedPartItem[j].ItemTaxPercent = this.CustomerVatTax
          }

        } else {
          this.ExcludedPartItem[j].ItemTaxPercent = '0'
        }
        this.ExcludedPartcalculatePrice(j)
      }
      // this.ExcludedPartItem[j].PartId = response.responseData[0].PartId,
      //   this.ExcludedPartItem[j].PartNo = response.responseData[0].PartNo,
      //   this.ExcludedPartItem[j].Description = response.responseData[0].Description,
      //   this.ExcludedPartItem[j].Quantity = response.responseData[0].Quantity,
      //   this.ExcludedPartItem[j].Rate = response.responseData[0].Price
      // this.ExcludedPartItem[j].DeliveryDate = "2020-12-24"
      // this.ExcludedPartcalculatePrice(j)

    });
  }
  selectEvent(item, i) {
    var postData = { PartId: item.PartId, "CustomerId": this.model.CustomerId };
    this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {

      this.ExchangeRate = response.responseData[0].ExchangeRate
      if (this.CustomerCurrencyCode != localStorage.getItem('BaseCurrencyCode')) {
        if (this.ExchangeRate == null) {
          Swal.fire({
            type: 'info',
            title: 'Message',
            text: `Exchange rate is not available for ${this.CustomerCurrencyCode} to USD. Please contact admin to create a quote`,
            confirmButtonClass: 'btn btn-confirm mt-2',
          });
          this.PartItem[i].Part = ''
          this.PartItem[i].PartId = ''
          this.PartItem[i].PartNo = ''
          this.PartItem[i].PartDescription = ''
          this.PartItem[i].Quantity = ''
          this.PartItem[i].Rate = ''
          this.PartItem[i].ItemLocalCurrencyCode = ''
          this.PartItem[i].ItemExchangeRate = ''
          this.PartItem[i].ItemBaseCurrencyCode = ''
          this.PartItem[i].ItemLocalCurrencySymbol = ''
        } else {
          this.PartItem[i].PartId = response.responseData[0].PartId,
            this.PartItem[i].PartNo = response.responseData[0].PartNo,
            this.PartItem[i].PartDescription = response.responseData[0].Description,
            this.PartItem[i].Quantity = response.responseData[0].Quantity,
            this.PartItem[i].Rate = response.responseData[0].Price
          this.PartItem[i].ItemLocalCurrencyCode = this.CustomerCurrencyCode
          this.PartItem[i].ItemExchangeRate = this.ExchangeRate
          this.PartItem[i].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
          this.PartItem[i].ItemLocalCurrencySymbol = this.Symbol
          if (localStorage.getItem('Location') == this.CustomerLocation) {

            if (response.responseData[0].PartVatTaxPercentage != null) {
              this.PartItem[i].ItemTaxPercent = response.responseData[0].PartVatTaxPercentage
            } else {
              this.PartItem[i].ItemTaxPercent = this.CustomerVatTax
            }

          } else {
            this.PartItem[i].ItemTaxPercent = '0'
          }
          this.calculatePrice(i)
        }
      } else {
        this.ExchangeRate = '1'
        this.PartItem[i].PartId = response.responseData[0].PartId,
          this.PartItem[i].PartNo = response.responseData[0].PartNo,
          this.PartItem[i].PartDescription = response.responseData[0].Description,
          this.PartItem[i].Quantity = response.responseData[0].Quantity,
          this.PartItem[i].Rate = response.responseData[0].Price
        this.PartItem[i].ItemLocalCurrencyCode = this.CustomerCurrencyCode
        this.PartItem[i].ItemExchangeRate = this.ExchangeRate
        this.PartItem[i].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
        this.PartItem[i].ItemLocalCurrencySymbol = this.Symbol
        if (localStorage.getItem('Location') == this.CustomerLocation) {

          if (response.responseData[0].PartVatTaxPercentage != null) {
            this.PartItem[i].ItemTaxPercent = response.responseData[0].PartVatTaxPercentage
          } else {
            this.PartItem[i].ItemTaxPercent = this.CustomerVatTax
          }

        } else {
          this.PartItem[i].ItemTaxPercent = '0'
        }
        this.calculatePrice(i)
      }
      // this.PartItem[i].PartId = response.responseData[0].PartId,
      //   this.PartItem[i].PartNo = response.responseData[0].PartNo,
      //   this.PartItem[i].Description = response.responseData[0].Description,
      //   this.PartItem[i].Quantity = response.responseData[0].Quantity,
      //   this.PartItem[i].Rate = response.responseData[0].Price
      // this.PartItem[i].DeliveryDate = "2020-12-24"
      // this.calculatePrice(i)

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

  getCustomerProperties(CustomerId) {

    this.CustomerId = CustomerId
    if (CustomerId == null || CustomerId == "" || CustomerId == 0) {

      return false;
    }
    let obj = this
    //CustomerInfo;
    var info = obj.CustomerList.filter(function (value) {
      if (value.CustomerId == CustomerId) {
        return value
      }
    }, obj);
    this.Symbol = info[0].CurrencySymbol
    this.CustomerLocation = info[0].CustomerLocation
    this.CustomerVatTax = info[0].VatTaxPercentage
    this.CustomerCurrencyCode = info[0].CustomerCurrencyCode
    this.showlineItem = true
    for (var i = 0; i < obj.PartItem.length; i++) {


      obj.PartItem.every(function (item: any) {
        return item.ItemLocalCurrencySymbol = obj.Symbol

      })
    }
    for (var i = 0; i < obj.ExcludedPartItem.length; i++) {


      obj.ExcludedPartItem.every(function (item: any) {
        return item.ItemLocalCurrencySymbol = obj.Symbol

      })
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
  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData.map(function (value) {
        return { title: value.CompanyName, "CustomerId": value.CustomerId }
      });
      this.CustomerList = response.responseData
    });
  }
  getAdminSettingsView() {
    var postData = {}
    this.commonService.postHttpService(postData, "getSettingsGeneralView").subscribe(response => {
      if (response.status == true) {
        this.settingsView = response.responseData;
        this.TaxPercent = this.settingsView.TaxPercent
        let DueDateFromSettings = new Date(new Date().getTime() + this.settingsView.SOLeadTime * 24 * 60 * 60 * 1000);

        const dueyears = Number(this.datePipe.transform(DueDateFromSettings, 'yyyy'));
        const dueMonth = Number(this.datePipe.transform(DueDateFromSettings, 'MM'));
        const dueDay = Number(this.datePipe.transform(DueDateFromSettings, 'dd'));
        this.model.DueDate = {
          year: dueyears,
          month: dueMonth,
          day: dueDay
        }
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
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
    var SalesOrderItem = []
    SalesOrderItem = this.PartItem.concat(this.ExcludedPartItem);
    if (f.valid) {
      this.btnDisabled = true;

      var postData = {

        "LocalCurrencyCode": this.CustomerCurrencyCode,
        "ExchangeRate": this.ExchangeRate,
        "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode'),
        "BaseGrandTotal": this.GrandTotalUSD,

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
        "BlanketPOExcludeAmount": this.BlanketPOExcludeAmount,
        "BlanketPONetAmount": this.BlanketPONetAmount,
        "SalesOrderItem": SalesOrderItem,
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
          this.router.navigate(['/admin/SO-Order-List'])

          Swal.fire({
            title: 'Success!',
            text: 'Sales Order Created Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          // this.reLoad();

        }
        else {
          this.btnDisabled = false;
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
      this.btnDisabled = false;
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }
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
}
