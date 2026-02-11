import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, ValidationErrors, Validators, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { warranty_list, Const_Alert_pop_title, Const_Alert_pop_message, PurchaseOrder_Status, CONST_AH_Group_ID, CONST_BillAddressType } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-po-inso',
  templateUrl: './create-po-inso.component.html',
  styleUrls: ['./create-po-inso.component.scss'],
})
export class CreatePoInsoComponent implements OnInit {
  PuchaseOrderStatus
  warrantyList
  vendorList: any = []
  btnDisabled: boolean = false;
  Currentdate = new Date();

  public event: EventEmitter<any> = new EventEmitter();
  //ADD
  model: any = [];
  settingsView
  TaxPercent
  POPartItem: any = []
  keyword = 'PartNo';
  filteredData: any[];
  isLoading: boolean = false;
  data1 = [];
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
  SOId
  ExcludedPartItem:any=[]
  CurrencySymbol
  LocalCurrencyCode
  ExchangeRate
  VendorLocation
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder, public datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.POPartItem = this.data.PartItem;
    this.ExcludedPartItem = this.data.ExcludedPartItem
    this.SOId = this.data.SOId
    // this.TaxPercent = this.data.TaxPercent
    // this.TotalTax = this.data.TotalTax
    // this.Discount = this.data.Discount
    // this.AHFees = this.data.AHFees
    // this.Shipping = this.data.Shipping

    for (var i = 0; i < this.POPartItem.length; i++) {
      this.POPartItem.every(function (item: any) {
        return item.Rate1 = ""
      })
    }
    for (var i = 0; i < this.ExcludedPartItem.length; i++) {
      this.ExcludedPartItem.every(function (item: any) {
        return item.Rate1 = ""
      })
    }
    this.getAdminSettingsView();
    this.getVendorList();
    this.PuchaseOrderStatus = PurchaseOrder_Status;
    this.warrantyList = warranty_list;
  }
  onCurrencyChange() {
   
   
    var postData={
    "LocalCurrencyCode" :this.LocalCurrencyCode,
    "BaseCurrencyCode" : localStorage.getItem('BaseCurrencyCode')
    }
    this.commonService.postHttpService(postData,'Exchange').subscribe(response => {
      if (response.status == true) {
        this.ExchangeRate = response.responseData.ExchangeRate;
      
      
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));

   
  
  }
  onVendorChange(){
    this.CurrencySymbol = this.vendorList.find(a=>a.VendorId==this.model.VendorId).CurrencySymbol
    this.LocalCurrencyCode = this.vendorList.find(a=>a.VendorId==this.model.VendorId).VendorCurrencyCode
    this.VendorLocation = this.vendorList.find(a=>a.VendorId==this.model.VendorId).VendorLocation
    this.onCurrencyChange()

    if(this.LocalCurrencyCode != localStorage.getItem('BaseCurrencyCode')){
      this.ExchangeRate = this.ExchangeRate
    }else{
      this.ExchangeRate = 1
    }
  }
  getVendorList() {
    this.commonService.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
    });
  }
  getAdminSettingsView() {
    var postData = {}
    this.commonService.postHttpService(postData, "getSettingsGeneralView").subscribe(response => {
      if (response.status == true) {
        this.settingsView = response.responseData;
        this.TaxPercent = this.settingsView.TaxPercent
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
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  AddItem() {
    this.POPartItem.push({
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
    this.POPartItem.splice(i, 1);
    this.changeStatus(i)

  }
  changeStatus(index) {
    var subTotal = 0;
    // Calculate the subtotal
    for (let i = 0; i < this.POPartItem.length; i++) {

      subTotal += this.POPartItem[i].Price

    }
    this.SubTotal = subTotal
    this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }
  calculateTax() {
    this.TotalTax = this.SubTotal * this.TaxPercent / 100;
    this.calculateTotal();

  }
  selectEvent(item, i) {
    var postData = { PartId: item.PartId };
    this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {
      this.POPartItem[i].PartId = response.responseData[0].PartId,
        this.POPartItem[i].PartNo = response.responseData[0].PartNo,
        this.POPartItem[i].Description = response.responseData[0].Description,
        this.POPartItem[i].Quantity = response.responseData[0].Quantity,
        this.POPartItem[i].Rate = response.responseData[0].Price,
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
          this.data1 = response.responseData
          this.filteredData = this.data1.filter(a => a.PartNo.toLowerCase().includes(val.toLowerCase())

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
      this.POPartItem.map((item: any) => {
        item.Rate = item.Rate1;
        item.ItemLocalCurrencySymbol = this.CurrencySymbol
        item.ItemLocalCurrencyCode = this.LocalCurrencyCode
        item.ItemExchangeRate = this.ExchangeRate
        item.LocalCurrencySymbol = this.CurrencySymbol
        var price = 0; var subTotal = 0;
    var subTotal1 =0
        let Quantity = item.Quantity || 0;
    let Rate = item.Rate || 0;
    let VatTax = item.ItemTaxPercent /100;
    let VatTaxPrice = Rate * VatTax
    // Calculate the price
    price = parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice);
    item.Price = price.toFixed(2)
    item.Tax=(Rate * VatTax).toFixed(2)
    var TaxLocal=(Rate * VatTax)
    let priceUSD = price* this.ExchangeRate
    item.BasePrice = priceUSD.toFixed(2)
    let RateUSD = item.Rate* this.ExchangeRate
    item.BaseRate = RateUSD.toFixed(2)
    let BaseTaxUSD = TaxLocal* this.ExchangeRate
    item.BaseTax = BaseTaxUSD.toFixed(2)
    for (let i = 0; i < this.POPartItem.length; i++) {
      subTotal += this.POPartItem[i].Price

    }
    for (let i = 0; i < this.ExcludedPartItem.length; i++) {
      subTotal += this.ExcludedPartItem[i].Price
      subTotal1 += this.ExcludedPartItem[i].Price

    }
    var total = 0;
    this.SubTotal = subTotal
    total = parseFloat(this.SubTotal)
    item.GrandTotal = parseFloat(total.toFixed(2));
    item.BaseGrandTotal =  (item.GrandTotal *  this.ExchangeRate).toFixed(2)
    item.LocalCurrencyCode=this.LocalCurrencyCode,
    item.ExchangeRate=this.ExchangeRate,
    item.BaseCurrencyCode=localStorage.getItem('BaseCurrencyCode')
      });
      this.ExcludedPartItem.map((item: any) => {
        item.Rate = item.Rate1;
        item.ItemLocalCurrencySymbol = this.CurrencySymbol
        item.ItemLocalCurrencyCode = this.LocalCurrencyCode
        item.ItemExchangeRate = this.ExchangeRate
        item.LocalCurrencySymbol = this.CurrencySymbol
        var price = 0; var subTotal = 0;
        var subTotal1 =0
            let Quantity = item.Quantity || 0;
        let Rate = item.Rate || 0;
        let VatTax = item.ItemTaxPercent /100;
        let VatTaxPrice = Rate * VatTax
        // Calculate the price
        price = parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice);
        item.Price = price.toFixed(2)
        item.Tax=(Rate * VatTax).toFixed(2)
        var TaxLocal=(Rate * VatTax)
        let priceUSD = price* this.ExchangeRate
        item.BasePrice = priceUSD.toFixed(2)
        let RateUSD = item.Rate* this.ExchangeRate
        item.BaseRate = RateUSD.toFixed(2)
        let BaseTaxUSD = TaxLocal* this.ExchangeRate
        item.BaseTax = BaseTaxUSD.toFixed(2)
        for (let i = 0; i < this.POPartItem.length; i++) {
          subTotal += this.POPartItem[i].Price
    
        }
        for (let i = 0; i < this.ExcludedPartItem.length; i++) {
          subTotal += this.ExcludedPartItem[i].Price
          subTotal1 += this.ExcludedPartItem[i].Price
    
        }
        var total = 0;
        this.SubTotal = subTotal
      total = parseFloat(this.SubTotal)
      item.GrandTotal = parseFloat(total.toFixed(2));
      item.BaseGrandTotal =  (item.GrandTotal *  this.ExchangeRate).toFixed(2)
      item.LocalCurrencyCode=this.LocalCurrencyCode,
      item.ExchangeRate=this.ExchangeRate,
      item.BaseCurrencyCode=localStorage.getItem('BaseCurrencyCode')
      });
      var PurchaseOrderItem =[]
      PurchaseOrderItem=this.POPartItem.concat(this.ExcludedPartItem);
      var postData = {
        "RRId": "0",
        "DateRequested": DateRequested,
        "DueDate": DueDate,
        "Status": this.model.PoStatus,
        "PurchaseOrderItem": PurchaseOrderItem,
        "VendorId": this.model.VendorId,
        "SOId": this.SOId,
        // "TaxPercent": this.TaxPercent,
        // "TotalTax": this.TotalTax,
        // "Discount": this.Discount,
        // "AHFees": this.AHFees,
        // "Shipping":this.Shipping
      }
      this.commonService.postHttpService(postData, "CreatePOFromSO").subscribe(response => {
        if (response.status == true) {
          Swal.fire({
            title: 'Success!',
            text: 'Purchase Order Created Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
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
    else {
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });

    }
  }
  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
  calculatePrice(index) {
    var price = 0; var subTotal = 0;
    let Quantity = this.POPartItem[index].Quantity || 0;
    let Rate = this.POPartItem[index].Rate || 0;
    // Calculate the price
    price = parseFloat(Quantity) * parseFloat(Rate);
    this.POPartItem[index].Price = price.toFixed(2)
    for (let i = 0; i < this.POPartItem.length; i++) {
      subTotal += this.POPartItem[i].Price
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



}




