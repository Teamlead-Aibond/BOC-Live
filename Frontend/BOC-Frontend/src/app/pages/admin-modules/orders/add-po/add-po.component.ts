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
import { attachment_thumb_images, CONST_AH_Group_ID, Const_Alert_pop_message, Const_Alert_pop_title, CONST_BillAddressType, CONST_ShipAddressType, Hide_add, PurchaseOrder_Status, PurchaseOrder_Type, VAT_field_Name, warranty_list } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { AddRrPartsComponent } from '../../common-template/add-rr-parts/add-rr-parts.component';

@Component({
  selector: 'app-add-po',
  templateUrl: './add-po.component.html',
  styleUrls: ['./add-po.component.scss']
})
export class AddPoComponent implements OnInit {



  keywordForVendor = 'VendorName';
  VendorsList: any[];
  VendorName;
  isLoadingVendor: boolean = false;
  keywordForRR = 'RRNo';
  RRList: any[]
  isLoadingRR: boolean = false;
  Currentdate = new Date();
  ResponseMessage;


  PurchaseOrder: any = [];
  ExcelData: any = []

  keyword = 'PartNo';
  filteredData: any[];
  isLoading: boolean = false;
  data = [];

  dataTableMessage;
  tableData: any = [];
  number
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

  RRId = '';
  //FILTER
  Created;
  VendorId = '';
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
  POList: any = [];
  btnDisabled: boolean = false;
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
  POTypeStyle
  ListHidden: boolean = false;
  showList: boolean = false;
  IsDeleted;
  VendorCode


  VAT_field_Name
  IsDisplayBaseCurrencyValue
  Symbol
  VendorLocation
  VendorVatTax
  ExchangeRate
  VendorCurrencyCode
  GrandTotalUSD
  showlineItem: boolean = false
  BaseCurrencySymbol
  Hide_add
  constructor(public router: Router,
    private commonService: CommonService, private cd_ref: ChangeDetectorRef, private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, private datePipe: DatePipe,) { }

  ngOnInit(): void {
    this.Hide_add = Hide_add
    if (this.Hide_add != 1) {
      document.title = 'PO Add'
      this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol")
      this.VAT_field_Name = VAT_field_Name
      this.IsDisplayBaseCurrencyValue = localStorage.getItem("IsDisplayBaseCurrencyValue")
      this.POTypeStyle = ""
      this.getAdminSettingsView();
      this.attachmentThumb = attachment_thumb_images;
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
        DeliveryDate: "",
        AllowShipment: "",
        Notes: "",
        ItemStatus: "",
        Tax: '',
        ItemTaxPercent: '',
        BasePrice: '',
        ItemLocalCurrencyCode: '',
        ItemExchangeRate: '',
        ItemBaseCurrencyCode: '',
        ItemLocalCurrencySymbol: '',
        BaseRate: '',
        BaseTax: ''
      });
      const years = Number(this.datePipe.transform(this.Currentdate, 'yyyy'));
      const Month = Number(this.datePipe.transform(this.Currentdate, 'MM'));
      const Day = Number(this.datePipe.transform(this.Currentdate, 'dd'));
      this.model.RequestedDate = {
        year: years,
        month: Month,
        day: Day
      }


      this.model.PoStatus = "8";
      this.model.VendorId = null;
      this.model.POType = undefined;
      this.model.TermsId = undefined;
      this.model.VendorRefNo = ""
      this.model.Notes = "";
      this.model.ShipVia = undefined;
      this.model.ShippingAccountNumber = "";
      // this.model.AdditionalPONo = "";
      this.SubTotal = "";
      this.TotalTax = "";
      this.GrandTotal = "";
      this.getAHGroupaddress();
    }
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
        let DueDateFromSettings = new Date(new Date().getTime() + (this.settingsView.POLeadTime) * 24 * 60 * 60 * 1000);

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







  getVendorList() {
    this.commonService.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
    });
  }
  getAdminList() {
    this.commonService.getHttpService('getAllActiveAdmin').subscribe(response => {
      this.adminList = response.responseData.map(function (value) {
        return { title: value.FirstName + " - " + value.LastName, "UserId": value.UserId }
      });
    });
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


    var postData1 = {
      "IdentityId": CONST_AH_Group_ID,
      "IdentityType": 2,
      "Type": CONST_ShipAddressType

    }
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

  changeStatus(index) {
    var subTotal = 0;
    // Calculate the subtotal
    for (let i = 0; i < this.PartItem.length; i++) {

      subTotal += this.PartItem[i].Price

    }
    this.SubTotal = subTotal
    // this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }
  calculateTax() {
    this.TotalTax = this.SubTotal * this.TaxPercent / 100;
    this.calculateTotal();

  }



  selectEvent(item, i) {
    var postData = { PartId: item.PartId, "VendorId": this.model.VendorId };
    // this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {
    //   this.PartItem[i].PartId = response.responseData[0].PartId,
    //     this.PartItem[i].PartNo = response.responseData[0].PartNo,
    //     this.PartItem[i].Description = response.responseData[0].Description,
    //     this.PartItem[i].Quantity = response.responseData[0].Quantity,
    //     this.PartItem[i].Rate = response.responseData[0].Price,
    //     this.calculatePrice(i)
    // });

    this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {

      this.ExchangeRate = response.responseData[0].ExchangeRate
      if (this.VendorCurrencyCode != localStorage.getItem('BaseCurrencyCode')) {
        if (this.ExchangeRate == null) {
          Swal.fire({
            type: 'info',
            title: 'Message',
            text: `Exchange rate is not available for ${this.VendorCurrencyCode} to USD. Please contact admin to create a quote`,
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
          this.PartItem[i].ItemLocalCurrencyCode = this.VendorCurrencyCode
          this.PartItem[i].ItemExchangeRate = this.ExchangeRate
          this.PartItem[i].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
          this.PartItem[i].ItemLocalCurrencySymbol = this.Symbol

          if (localStorage.getItem('Location') == this.VendorLocation) {

            if (response.responseData[0].PartVatTaxPercentage != null) {
              this.PartItem[i].ItemTaxPercent = response.responseData[0].PartVatTaxPercentage
            } else {
              this.PartItem[i].ItemTaxPercent = this.VendorVatTax
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
        this.PartItem[i].ItemLocalCurrencyCode = this.VendorCurrencyCode
        this.PartItem[i].ItemExchangeRate = this.ExchangeRate
        this.PartItem[i].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
        this.PartItem[i].ItemLocalCurrencySymbol = this.Symbol

        if (localStorage.getItem('Location') == this.VendorLocation) {

          if (response.responseData[0].PartVatTaxPercentage != null) {
            this.PartItem[i].ItemTaxPercent = response.responseData[0].PartVatTaxPercentage
          } else {
            this.PartItem[i].ItemTaxPercent = this.VendorVatTax
          }

        } else {
          this.PartItem[i].ItemTaxPercent = '0'
        }
        this.calculatePrice(i)
      }
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


    if (f.valid) {
      this.btnDisabled = true;
      var postData = {

        "LocalCurrencyCode": this.VendorCurrencyCode,
        "ExchangeRate": this.ExchangeRate,
        "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode'),
        "BaseGrandTotal": this.GrandTotalUSD,
        "RRId": "0",
        "VendorId": this.model.VendorId,
        "VendorRefNo": this.model.VendorRefNo,
        "POType": this.model.POType,
        "TermsId": this.model.TermsId,
        "DateRequested": DateRequested,
        "DueDate": DueDate,
        // "AdditionalPONo": this.model.AdditionalPONo,
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
          this.btnDisabled = false;
          Swal.fire({
            title: 'Success!',
            text: 'Purchase Order Created Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          this.router.navigate(['/admin/PO-Order-List'])

        }
        else {
          this.btnDisabled = false;
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

  getPartList() {
    this.commonService.getHttpService('getPartListDD').subscribe(response => {
      this.partList = response.responseData
    });
  }
  // calculatePrice(index) {
  //   var price = 0; var subTotal = 0;
  //   let Quantity = this.PartItem[index].Quantity || 0;
  //   let Rate = this.PartItem[index].Rate || 0;

  //   // Calculate the price
  //   price = parseFloat(Quantity) * parseFloat(Rate);
  //   this.PartItem[index].Price = price

  //   for (let i = 0; i < this.PartItem.length; i++) {
  //     subTotal += this.PartItem[i].Price

  //   }
  //   //Calculate the subtotal
  //   this.SubTotal = subTotal;

  //   this.TotalTax = this.SubTotal * this.TaxPercent / 100
  //   this.calculateTotal();
  // }

  // calculateTotal() {
  //   var total = 0;
  //   let AdditionalCharge = this.AHFees || 0;
  //   let Shipping = this.Shipping || 0;
  //   let Discount = this.Discount || 0;

  //   total = parseFloat(this.SubTotal) + parseFloat(this.TotalTax) +
  //     parseFloat(AdditionalCharge) + parseFloat(Shipping) - parseFloat(Discount);
  //   this.GrandTotal = parseFloat(total.toFixed(2));
  // }

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

    this.GrandTotalUSD = (this.GrandTotal * this.ExchangeRate).toFixed(2)

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
      this.commonService.postHttpService(postData, "getAllAutoCompleteofVendor").subscribe(response => {
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


  selectVendor(item) {
    //this.VendorCode = this.vendorList.find(a=>a.VendorId==item).VendorCode
    let obj = this
    //VendorInfo;
    var info = obj.vendorList.filter(function (value) {
      if (value.VendorId == item) {
        return value
      }
    }, obj);
    this.VendorCode = info[0].VendorCode
    this.Symbol = info[0].CurrencySymbol
    this.VendorLocation = info[0].VendorLocation
    this.VendorVatTax = info[0].VatTaxPercentage
    this.VendorCurrencyCode = info[0].VendorCurrencyCode
    this.showlineItem = true
    for (var i = 0; i < obj.PartItem.length; i++) {


      obj.PartItem.every(function (item: any) {
        return item.ItemLocalCurrencySymbol = obj.Symbol

      })
    }
  }
}
