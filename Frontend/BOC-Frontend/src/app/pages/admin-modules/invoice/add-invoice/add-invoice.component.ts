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
import { attachment_thumb_images, Const_Alert_pop_message, Const_Alert_pop_title, CONST_BillAddressType, CONST_ShipAddressType, Customer_Invoice_Status, Hide_add, VAT_field_Name, warranty_list } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { CustomerReferenceComponent } from '../../common-template/customer-reference/customer-reference.component';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit {


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
  IsDeleted;
  IsDeletedValue
  ExcludedPartItem: any = []
  showExcludedPartItem = false;
  BlanketPOExcludeAmount;
  BlanketPONetAmount


  VAT_field_Name
  GrandTotalUSD
  IsDisplayBaseCurrencyValue
  showlineItem: boolean = false;
  Symbol
  CustomerLocation
  CustomerVatTax
  ExchangeRate
  CustomerCurrencyCode
  BaseCurrencySymbol
  CustomerList: any = []
  Hide_add
  constructor(public router: Router,
    private commonService: CommonService, private cd_ref: ChangeDetectorRef, private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, private datePipe: DatePipe,) { }
  currentRouter = decodeURIComponent(this.router.url);

  ngOnInit(): void {
    this.Hide_add = Hide_add
    if (this.Hide_add != 1) {
      document.title = 'Invoice Add'
      this.IsDisplayBaseCurrencyValue = localStorage.getItem("IsDisplayBaseCurrencyValue")
      this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol")
      this.VAT_field_Name = VAT_field_Name
      this.attachmentThumb = attachment_thumb_images;
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
      this.BlanketPOExcludeAmount = "0"
      this.BlanketPONetAmount = "0"

      this.PartItem = [{
        'Part': '',
        "PartId": '',
        "PartNo": "",
        "Description": "",
        "Quantity": "",
        "Rate": "",
        "Discount": "",
        // "Tax": "",
        "Price": "",
        "LeadTime": "",
        "WarrantyPeriod": "",
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
        ItemLocalCurrencySymbol: '',
        BaseRate: '',
        BaseTax: ''
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


    }
  }

  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData.map(function (value) {
        return { title: value.CompanyName, "CustomerId": value.CustomerId }
      });
      this.CustomerList = response.responseData
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









  getCustomerProperties(CustomerId) {
    if (CustomerId == null || CustomerId == "" || CustomerId == 0) {
      this.showlineItem = false
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
      // "Tax": "",
      "Price": "",
      "LeadTime": "",
      "WarrantyPeriod": "",
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
      BaseTax: ''

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
      BaseTax: ''
    });
  }

  removeExcludedPartItem(i) {
    this.ExcludedPartItem.splice(i, 1);
    this.changeStatus(i)
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
    Tax = (Rate * VatTax)
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
          this.PartItem[i].ItemBaseCurrencyCode = '',
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
    var InvoiceItem = []
    InvoiceItem = this.PartItem.concat(this.ExcludedPartItem);
    if (f.valid) {
      this.btnDisabled = true;
      var postData = {

        "LocalCurrencyCode": this.CustomerCurrencyCode,
        "ExchangeRate": this.ExchangeRate,
        "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode'),
        "BaseGrandTotal": this.GrandTotalUSD,

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
        "GlobalCustomerReference": this.CustomerRef,
        "BlanketPOExcludeAmount": this.BlanketPOExcludeAmount,
        "BlanketPONetAmount": this.BlanketPONetAmount,
        "InvoiceItem": InvoiceItem,

      }
      this.commonService.postHttpService(postData, "InvoiceCreate").subscribe(response => {
        if (response.status == true) {
          this.router.navigate(['/admin/Invoice-List'])

          Swal.fire({
            title: 'Success!',
            text: 'Invoice Created Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          this.btnDisabled = false;
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
      this.btnDisabled = false;
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });

    }

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



}
