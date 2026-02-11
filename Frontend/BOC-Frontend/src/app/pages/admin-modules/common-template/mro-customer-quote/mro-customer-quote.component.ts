import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title, part_type, Shipping_field_Name, VAT_field_Name, warranty_list } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
export interface Part {
  PartNo1: string,
  PartNo: string,
  PartDescription: string,
  LeadTime: string,
  Quantity: string,
  Rate: string,
  Price: string,
  VendorUnitPrice: string,
  //IsIncludeInQuote: boolean,
  PartId: string,
  QuoteItemId: string,

}

export interface PartData {
  QuoteItemList: Part[];
}
@Component({
  selector: 'app-mro-customer-quote',
  templateUrl: './mro-customer-quote.component.html',
  styleUrls: ['./mro-customer-quote.component.scss']
})
export class MroCustomerQuoteComponent implements OnInit {

  QuoteId;
  MROId;
  btnDisabled: boolean = false;
  PartId;
  Status;
  EditForm: FormGroup;
  public event: EventEmitter<any> = new EventEmitter();
  warrantyList: any;
  viewResult: any;
  QuoteItem: any = [];
  BasicInfo: any = [];
  PartNo: any;
  PartDescription: any;
  SerialNo: any;
  Quantity: any;
  Rate: any;
  Price: any;
  VendorUnitPrice: any;
  WarrantyPeriod: any;
  SubTotal: any;
  AdditionalCharge: any;
  Discount: any;
  GrandTotal: any;
  Shipping: any;
  VendorId: any;
  RouteCause: any;
  //VendorLeadTime: any;
  VendorName: any;
  VendorCode: any;
  LeadTime: any;
  VendorStatus;
  submitted = false;
  QuoteNo: any;
  QuoteCustomerStatus: any;
  TotalTax = 0;
  TaxPercent = 0;

  LPPList: any = []; LPP; PON; CustomerId;
  keyword; partList: any = []; partNewList: any = [];
  CustomerBillToId;
  CustomerShipToId

  parts$: Observable<any> = of([]);
  partsInput$ = new Subject<string>();
  PartTypes;
  filteredData: any[];
  isLoading: boolean = false;
  IsDisplayBaseCurrencyValue
  BaseCurrencySymbol
  VAT_field_Name
  Shipping_field_Name
  GrandTotalUSD
  CustomerSymbol
  CustomerExchangeRate
  CustomerLocation
  CustomerVatTax
  CustomerCurrencyCode
  isCurrencyMode:boolean=false
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.MROId = this.data.MROId;
    this.QuoteId = this.data.QuoteId;
    this.CustomerId = this.data.CustomerId;
    this.CustomerBillToId = this.data.CustomerBillToId;
    this.CustomerShipToId = this.data.CustomerShipToId;
    this.IsDisplayBaseCurrencyValue =localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")
    this.VAT_field_Name = VAT_field_Name
    this.Shipping_field_Name = Shipping_field_Name
    this.loadParts();

    this.getViewContent();
    this.PartTypes = part_type



    this.keyword = 'PartNo';

    this.EditForm = this.fb.group({
      //RRId: ['', Validators.required],
      RouteCause: [''],
      // VendorLeadTime: [''],

      SubTotal: [''],
      AdditionalCharge: [''],
      TotalTax: [''],
      TaxPercent: [''],
      Discount: [''],
      Shipping: [''],
      GrandTotal: [''],
      //QuoteId: ['', Validators.required],

      QuoteItemList: this.fb.array([

      ]),
    })
  }
  loadParts() {
    this.parts$ = concat(
      of([]), // default items
      this.partsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        // tap(() => this.moviesLoading = true),
        switchMap(term => {

          return this.searchParts(term).pipe(
            catchError(() => of([])), // empty list on error
            // tap(() => this.moviesLoading = false)
          )
        })
      )
    );
  }

  searchParts(term: string = ""): Observable<any> {
    var postData = {
      "PartNo": term
    }
    return this.commonService.postHttpService(postData, "SearchNonRepairPartByPartNo")
      .pipe(
        map(response => {
          return response.responseData;
        })
      );
  }

  clearEvent(item, index) { //alert('clear')
    const formGroup = this.QuoteItemList.controls[index] as FormGroup;
    formGroup.controls['PartNo'].setValue('');
    formGroup.controls['PartId'].setValue('');
    formGroup.controls['PartDescription'].setValue('');
    formGroup.controls['Part'].setValue('');
    formGroup.controls['Quantity'].setValue('');
    formGroup.controls['Rate'].setValue('');
    formGroup.controls['ItemLocalCurrencyCode'].setValue('');
    formGroup.controls['ItemExchangeRate'].setValue('');
    formGroup.controls['ItemBaseCurrencyCode'].setValue('');
    formGroup.controls['ItemTaxPercent'].setValue('');
    formGroup.controls['ItemLocalCurrencySymbol'].setValue('');
    formGroup.controls['BaseRate'].setValue('');
    formGroup.controls['BaseTax'].setValue('');

  }
  closeEvent(item, index) {
    //alert('close')
  }
  // selectEvent(item, i) {
  //   if (item != null) {
  //     const formGroup = this.QuoteItemList.controls[i] as FormGroup;
  //     formGroup.controls['PartDescription'].patchValue(item.Description);
  //     formGroup.controls['PartNo'].patchValue(item.PartNo);
  //     formGroup.controls['Part'].patchValue(item.PartNo);
  //     formGroup.controls['PartId'].patchValue(item.PartId);
  //     formGroup.controls['Quantity'].patchValue(1);
  //     formGroup.controls['Rate'].patchValue(item.SellingPrice);
  //     this.calculatePrice(i);
  //   } else {
  //     this.clearEvent(item, i)
  //   }
  // }
  selectEvent(item, i) {
    var error = false;
    const formGroup = this.QuoteItemList.controls[i] as FormGroup;

    //get form array reference
   const parts = this.EditForm.get('QuoteItemList') as FormArray;

    var postData = { PartId: item.PartId,"CustomerId": this.CustomerId};
    this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {
      for (var i = 0; i < parts.length; i++) {
        if (item.PartNo == this.QuoteItemList.controls[i].get('PartNo').value) {
          Swal.fire({
            title: 'Error!',
            text: 'The Part # ' + item.PartNo + ' is already available!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          error = true;
          formGroup.controls['PartNo1'].setValue('');
          formGroup.controls['PartNo'].setValue('');
          formGroup.controls['PartId'].setValue('');
          formGroup.controls['PartDescription'].setValue('');
          formGroup.controls['Quantity'].setValue('');
          formGroup.controls['Rate'].setValue('');
          formGroup.controls['ItemLocalCurrencyCode'].setValue('');
          formGroup.controls['ItemExchangeRate'].setValue('');
          formGroup.controls['ItemBaseCurrencyCode'].setValue('');
          formGroup.controls['ItemTaxPercent'].setValue('');
          formGroup.controls['SerialNo'].setValue('');
          formGroup.controls['ItemLocalCurrencySymbol'].setValue('');
          formGroup.controls['BaseRate'].setValue('');
          formGroup.controls['BaseTax'].setValue('');

          continue;
        }
      }
      if (error == false) {
      this.CustomerExchangeRate=response.responseData[0].ExchangeRate
      if(this.CustomerCurrencyCode != localStorage.getItem('BaseCurrencyCode')){
      if(this.CustomerExchangeRate== null){
        Swal.fire({
          type: 'info',
          title: 'Message',
          text: `Exchange rate is not available for ${this.CustomerCurrencyCode} to USD. Please contact admin to create a quote`,
          confirmButtonClass: 'btn btn-confirm mt-2',
        });
        formGroup.controls['PartNo1'].setValue('');
        formGroup.controls['Part'].setValue('');
        formGroup.controls['PartId'].setValue('');
        formGroup.controls['PartDescription'].setValue('');
        formGroup.controls['Quantity'].setValue('');
        formGroup.controls['Rate'].setValue('');
        formGroup.controls['ItemLocalCurrencyCode'].setValue('');
        formGroup.controls['ItemExchangeRate'].setValue('');
        formGroup.controls['ItemBaseCurrencyCode'].setValue('');
        formGroup.controls['ItemTaxPercent'].setValue('');
        formGroup.controls['ItemLocalCurrencySymbol'].setValue('');
        formGroup.controls['BaseRate'].setValue('');
        formGroup.controls['BaseTax'].setValue('');


      }else{
        formGroup.controls['PartDescription'].patchValue(this.getReplace(response.responseData[0].Description));
        formGroup.controls['Part'].patchValue(response.responseData[0].PartNo);
        formGroup.controls['PartNo'].patchValue(response.responseData[0].PartNo);
        formGroup.controls['PartId'].patchValue(response.responseData[0].PartId);
        formGroup.controls['Quantity'].patchValue(response.responseData[0].Quantity);
        formGroup.controls['Rate'].patchValue(response.responseData[0].Price);
        formGroup.controls['ItemLocalCurrencyCode'].patchValue(this.CustomerCurrencyCode);
        formGroup.controls['ItemExchangeRate'].patchValue(this.CustomerExchangeRate);
        formGroup.controls['ItemBaseCurrencyCode'].patchValue(localStorage.getItem('BaseCurrencyCode'));
        formGroup.controls['ItemLocalCurrencySymbol'].patchValue(this.viewResult.BasicInfo[0].CustomerCurrencySymbol);

      
        if(localStorage.getItem('Location')==this.CustomerLocation){

          if(response.responseData[0].PartVatTaxPercentage!=null){
            formGroup.controls['ItemTaxPercent'].patchValue(response.responseData[0].PartVatTaxPercentage);
          }else{
            formGroup.controls['ItemTaxPercent'].patchValue(response.responseData[0].PartVatTaxPercentage);
          }
  
        }else{
          formGroup.controls['ItemTaxPercent'].patchValue('0');
        }
        this.calculatePrice(i)
      }
    }else{
        this.CustomerExchangeRate = '1'
        formGroup.controls['PartDescription'].patchValue(this.getReplace(response.responseData[0].Description));
        formGroup.controls['Part'].patchValue(response.responseData[0].PartNo);
        formGroup.controls['PartNo'].patchValue(response.responseData[0].PartNo);
        formGroup.controls['PartId'].patchValue(response.responseData[0].PartId);
        formGroup.controls['Quantity'].patchValue(response.responseData[0].Quantity);
        formGroup.controls['Rate'].patchValue(response.responseData[0].Price);
        formGroup.controls['ItemLocalCurrencyCode'].patchValue(this.CustomerCurrencyCode);
        formGroup.controls['ItemExchangeRate'].patchValue(this.CustomerExchangeRate);
        formGroup.controls['ItemBaseCurrencyCode'].patchValue(localStorage.getItem('BaseCurrencyCode'));
        formGroup.controls['ItemLocalCurrencySymbol'].patchValue(this.viewResult.BasicInfo[0].CustomerCurrencySymbol);

        if(localStorage.getItem('Location')==this.CustomerLocation){

          if(response.responseData[0].PartVatTaxPercentage!=null){
            formGroup.controls['ItemTaxPercent'].patchValue(response.responseData[0].PartVatTaxPercentage);
          }else{
            formGroup.controls['ItemTaxPercent'].patchValue(this.CustomerVatTax);
          }
  
        }else{
          formGroup.controls['ItemTaxPercent'].patchValue('0');
        }
        this.calculatePrice(i)
      }
      }
  
    });
  

    this.LPPList = [];

    var postData = { PartId: item.PartId, CustomerId: this.CustomerId };
    this.commonService.postHttpService(postData, 'RRGetPartPrice').subscribe(response => {
      for (var i in response.responseData.LPPInfo) {
        this.LPPList.push(response.responseData.LPPInfo[i].LPP);
      }
      formGroup.controls['LPP'].patchValue(this.LPPList.join(', '));
      formGroup.controls['PON'].patchValue(response.responseData.PartInfo.PON);
    });
  }
  onChangeSearch(val: string, i) {

    if (val) {
      this.isLoading = true;
      var postData = {
        "PartNo": val
      }
      this.commonService.postHttpService(postData, "SearchNonRepairPartByPartNo").subscribe(response => {
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
 

 
  onFocused(e) {
    // do something when input is focused
  }

  getViewContent() {
    var postData = {
      MROId: this.MROId,
      QuoteId: this.QuoteId
    }

    this.commonService.postHttpService(postData, "MROQuoteView").subscribe(response => {
      if (response.status == true) {
        this.viewResult = response.responseData;
        this.RouteCause = this.viewResult.BasicInfo[0].RouteCause;
        this.SubTotal = this.viewResult.BasicInfo[0].TotalValue;
        this.AdditionalCharge = this.viewResult.BasicInfo[0].ProcessFee;
        this.TotalTax = this.viewResult.BasicInfo[0].TotalTax;
        this.TaxPercent = this.viewResult.BasicInfo[0].TaxPercent;
        this.Discount = this.viewResult.BasicInfo[0].Discount;
        this.Shipping = this.viewResult.BasicInfo[0].ShippingFee;
        this.GrandTotal = this.viewResult.BasicInfo[0].GrandTotal;
        this.GrandTotalUSD = this.viewResult.BasicInfo[0].BaseGrandTotal;
        this.CustomerExchangeRate = this.viewResult.BasicInfo[0].ExchangeRate;
        this.CustomerSymbol = this.viewResult.BasicInfo[0].CurrencySymbol;
        this.CustomerLocation = this.viewResult.BasicInfo[0].CustomerLocation; 
        this.CustomerVatTax = this.viewResult.BasicInfo[0].VatTaxPercentage ;
        this.CustomerCurrencyCode = this.viewResult.BasicInfo[0].CustomerCurrencyCode; 
        // console.log(localStorage.getItem("BaseCurrencyCode"));
        // console.log(this.CustomerCurrencyCode);
        if(this.CustomerCurrencyCode==localStorage.getItem("BaseCurrencyCode")){
          this.CustomerExchangeRate = 1
        }
        

        if (this.viewResult.QuoteItem.length > 0) {


          for (let val of this.viewResult.QuoteItem) {



            this.QuoteItemList.push(this.fb.group({
              "PartNo": val.PartNo,
              "Part": this.fb.control({value: val.PartNo, disabled: true})
            ,
              "PartDescription": this.getReplace(val.PartDescription),
              "LeadTime": val.LeadTime,
              "Quantity":val.Quantity,
              "Rate": val.Rate,
              "Price": val.Price,
              "PartId": val.PartId,
              "QuoteItemId": val.QuoteItemId,
              "PartType": val.PartType,
              "Tax":val.Tax,
              "ItemTaxPercent":val.ItemTaxPercent,
              "BasePrice":val.BasePrice,
              "ItemLocalCurrencyCode":val.ItemLocalCurrencyCode,
              "ItemExchangeRate":val.ItemExchangeRate,
              "ItemBaseCurrencyCode":val.ItemBaseCurrencyCode,
              "ItemLocalCurrencySymbol":val.ItemLocalCurrencySymbol,
              "BaseRate":val.BaseRate,
              'BaseTax':val.BaseTax,
              "ShippingCharge":val.ShippingCharge,
              "BaseShippingCharge":val.BaseShippingCharge
            }));

          }
        }



        this.EditForm.patchValue({
          RouteCause: this.viewResult.BasicInfo[0].RouteCause,
          SubTotal: this.viewResult.BasicInfo[0].TotalValue,
          AdditionalCharge: this.viewResult.BasicInfo[0].ProcessFee,
          TotalTax: this.viewResult.BasicInfo[0].TotalTax,
          TaxPercent: this.viewResult.BasicInfo[0].TaxPercent,
          Discount: this.viewResult.BasicInfo[0].Discount,
          Shipping: this.viewResult.BasicInfo[0].ShippingFee,
          GrandTotal: this.viewResult.BasicInfo[0].GrandTotal,
        })
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  //get Form validation control
  get EditFormControl() {
    return this.EditForm.controls;
  }


  calculatePrice(index) {
    var price = 0; var subTotal = 0; var Tax = 0;
    const formGroup = this.QuoteItemList.controls[index] as FormGroup;
    let Quantity = formGroup.controls['Quantity'].value || 0;
    let Rate = formGroup.controls['Rate'].value || 0;
    let ShippingCharge = formGroup.controls['ShippingCharge'].value || 0;
    let VatTax = formGroup.controls['ItemTaxPercent'].value /100;
    let VatTaxPrice = Rate * VatTax
    // Calculate the price
    price = (parseFloat(Quantity) * (parseFloat(Rate)+ VatTaxPrice)) + parseFloat(ShippingCharge);
    Tax = Rate * VatTax;
    formGroup.controls['Price'].patchValue(price.toFixed(2));
    formGroup.controls['Tax'].patchValue(Tax.toFixed(2));
    var TaxLocal=(Rate * VatTax)
    let priceUSD = price*this.CustomerExchangeRate
    let BaseShippingCharge = ShippingCharge*this.CustomerExchangeRate
    formGroup.controls['BasePrice'].patchValue(priceUSD.toFixed(2))
    formGroup.controls['BaseShippingCharge'].patchValue(BaseShippingCharge.toFixed(2))
    let RateUSD = Rate*this.CustomerExchangeRate
    formGroup.controls['BaseRate'].patchValue(RateUSD.toFixed(2))
    let BaseTaxUSD = TaxLocal*this.CustomerExchangeRate
    formGroup.controls['BaseTax'].patchValue(BaseTaxUSD.toFixed(2))
    // Calculate the subtotal
    for (let i = 0; i < this.QuoteItemList.length; i++) {
      //if (this.QuoteItemList.controls[i].get('IsIncludeInQuote').value == 1) {
      subTotal += parseFloat(this.QuoteItemList.controls[i].get('Price').value);
      //}
    }
    this.SubTotal = subTotal.toFixed(2);
    this.EditForm.patchValue({ SubTotal: this.SubTotal });
    //this.EditForm.patchValue({ TotalTax: (this.SubTotal * 5 / 100).toFixed(2) });    
    // this.EditForm.patchValue({ TotalTax: (this.SubTotal * this.EditForm.value.TaxPercent / 100).toFixed(2) });
    this.calculateTotal();
  }

  calculateTotal() {
    var total = 0;
    // let AdditionalCharge = this.EditForm.value.AdditionalCharge || 0;
    // let Shipping = this.EditForm.value.Shipping || 0;
    // let Discount = this.EditForm.value.Discount || 0;

    total = parseFloat(this.EditForm.value.SubTotal) 
    // + parseFloat(this.EditForm.value.TotalTax) +
    //   parseFloat(AdditionalCharge) + parseFloat(Shipping) - parseFloat(Discount);
    this.GrandTotal = parseFloat(total.toFixed(2));
    this.EditForm.patchValue({ GrandTotal: this.GrandTotal });
    this.GrandTotalUSD =  (this.GrandTotal *  this.CustomerExchangeRate).toFixed(2)

  }
  // calculatePrice(index) {
  //   var price = 0; var subTotal = 0;
  //   const formGroup = this.QuoteItemList.controls[index] as FormGroup;
  //   let Quantity = formGroup.controls['Quantity'].value || 0;
  //   let Rate = formGroup.controls['Rate'].value || 0;

  //   // Calculate the price
  //   price = parseFloat(Quantity) * parseFloat(Rate);
  //   formGroup.controls['Price'].patchValue(price);

  //   // Calculate the subtotal
  //   for (let i = 0; i < this.QuoteItemList.length; i++) {
  //     //if (this.QuoteItemList.controls[i].get('IsIncludeInQuote').value == 1) {
  //     subTotal += this.QuoteItemList.controls[i].get('Price').value;
  //     //}
  //   }
  //   this.SubTotal = subTotal;
  //   this.EditForm.patchValue({ SubTotal: this.SubTotal });
  //   //this.EditForm.patchValue({ TotalTax: (this.SubTotal * 5 / 100).toFixed(2) });    
  //   this.EditForm.patchValue({ TotalTax: (this.SubTotal * this.EditForm.value.TaxPercent / 100).toFixed(2) });
  //   this.calculateTotal();
  // }

  // calculateTotal() {
  //   var total = 0;
  //   let AdditionalCharge = this.EditForm.value.AdditionalCharge || 0;
  //   let Shipping = this.EditForm.value.Shipping || 0;
  //   let Discount = this.EditForm.value.Discount || 0;

  //   total = parseFloat(this.EditForm.value.SubTotal) + parseFloat(this.EditForm.value.TotalTax) +
  //     parseFloat(AdditionalCharge) + parseFloat(Shipping) - parseFloat(Discount);
  //   this.GrandTotal = parseFloat(total.toFixed(2));
  //   this.EditForm.patchValue({ GrandTotal: this.GrandTotal });
  // }

  calculateTax() {
    this.EditForm.patchValue({ TotalTax: (this.SubTotal * this.EditForm.value.TaxPercent / 100).toFixed(2) });
    this.calculateTotal();
  }

  changeStatus(index) {
    var subTotal = 0;
    // Calculate the subtotal
    for (let i = 0; i < this.QuoteItemList.length; i++) {
      //if (this.QuoteItemList.controls[i].get('IsIncludeInQuote').value == 1) {
      subTotal += this.QuoteItemList.controls[i].get('Price').value;
      //}
    }
    this.SubTotal = subTotal;
    this.EditForm.patchValue({ SubTotal: this.SubTotal });
    //this.EditForm.patchValue({ TotalTax: (this.SubTotal * 5 / 100).toFixed(2) });
    // this.EditForm.patchValue({ TotalTax: (this.SubTotal * this.EditForm.value.TaxPercent / 100).toFixed(2) });
    this.calculateTotal();
  }

  getFormValidationErrors() {
    Object.keys(this.EditForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.EditForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          // console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

  onSubmit() {
    this.submitted = true; this.getFormValidationErrors();
    let partNotFound = false;
    if (this.EditForm.valid) {
      this.btnDisabled = true;
      // this.QuoteItemList.controls.forEach((control, i) => {
      //   if (!this.partList.some(a => a.PartNo == control.get('PartNo').value)) {
      //     partNotFound = true;
      //   }
      // })

      // if (partNotFound) {
      //   Swal.fire({
      //     title: 'Error!',
      //     text: 'Some seleted parts are not found!',
      //     type: 'warning',
      //     confirmButtonClass: 'btn btn-confirm mt-2'
      //   });
      //   return;
      // }

      this.QuoteItemList.controls.forEach((control, i) => {
        if (control.get('ItemLocalCurrencySymbol').value != this.viewResult.BasicInfo[0].CustomerCurrencySymbol) {
          this.isCurrencyMode = true
       }
     })
     if(!this.isCurrencyMode){
      var postData = {
        "LocalCurrencyCode":this.CustomerCurrencyCode,
        "ExchangeRate":this.CustomerExchangeRate,
        "BaseCurrencyCode":localStorage.getItem('BaseCurrencyCode'),
        "BaseGrandTotal":this.GrandTotalUSD,

        "MROId": this.MROId,
        "QuoteId": this.QuoteId,
        "CustomerId": this.CustomerId,
        "CustomerBillToId": this.CustomerBillToId,
        "CustomerShipToId": this.CustomerShipToId,
        "RouteCause": this.EditForm.value.RouteCause, //RootCause
        "TotalValue": this.EditForm.value.SubTotal,
        "ProcessFee": this.EditForm.value.AdditionalCharge,
        "TotalTax": this.EditForm.value.TotalTax,
        "TaxPercent": this.EditForm.value.TaxPercent,
        "Discount": this.EditForm.value.Discount,
        "ShippingFee": this.EditForm.value.Shipping,
        "GrandTotal": this.EditForm.value.GrandTotal,
        "QuoteItem": this.EditForm.value.QuoteItemList,
      }
      this.commonService.putHttpService(postData, "UpdateMROCustomerQuote").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();

          Swal.fire({
            title: 'Success!',
            text: 'Quote for Customer Updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Quote for Customer could not be Updated!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }else{
      Swal.fire({
        type: 'info',
        title: 'Customer Currency Mismatch',
        text: `Customer Currency Code is Changed. Please contact admin to update a quote`,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }
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

  //Add another Part 
  public initPart(): FormGroup {
    // this.SelectDisabledCondition=false
    return this.fb.group({
      Part: this.fb.control({value:'', disabled: false}),
      PartNo:[''],
      PartDescription: [''],
      LeadTime: [''],
      Quantity: [1],
      Rate: [''],
      Price: [''],
      PartId: [0],
      QuoteItemId: [0],
      PartType: [],
      Tax:'',
      ItemTaxPercent:'',
      BasePrice:'',
      ItemLocalCurrencyCode:'',
      ItemExchangeRate:'',
      ItemBaseCurrencyCode:'',
      ItemLocalCurrencySymbol:'',
      BaseRate:'',
      BaseTax:'',
      ShippingCharge:0,
      BaseShippingCharge:0
    });
  }

  public addPart(): void {
    const control = <FormArray>this.EditFormControl.QuoteItemList;
    control.push(this.initPart());
  }

  get QuoteItemList(): FormArray {
    return this.EditForm.get('QuoteItemList') as FormArray;
  }

  removePart(i: number) {
    var partId = this.QuoteItemList.controls[i].get('QuoteItemId').value;
    if (partId > 0) {
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
          this.QuoteItemList.removeAt(i);
          this.changeStatus(i);
          var postData = {
            QuoteItemId: partId,
          }
          this.commonService.postHttpService(postData, 'RRCustomerQuoteDelete').subscribe(response => {
            if (response.status == true) {
              /*  Swal.fire({
                 title: 'Deleted!',
                 text: 'Part has been deleted.',
                 type: 'success'
               }); */
            }
          });
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          /* Swal.fire({
            title: 'Cancelled',
            text: 'Part is safe:)',
            type: 'error'
          }); */
        }
      });
    } else {
      this.QuoteItemList.removeAt(i);
      this.changeStatus(i);
    }
  }

  ngAfterViewInit() {

    $(document).on("blur", ".autocomplete-container .input-container input", (e) => {
      if (!this.partList.find(a => a.PartNo == e.target.value)) {
        e.target.value = "";

        let idx = $(e.target).closest(".row").index();
        this.QuoteItemList.controls[idx].patchValue({
          PartNo: "",
          PartId: "",
          Description: "",
          PartNo1: ""
        })
        // this.VendorPartsList.setErrors({ 'partNotFound': true });
      }
    })
  }

  getReplace(val) {
    // var firstdata = val.replace(/\'/g, "'");
    // console.log(firstdata)
    // var data = firstdata.replace(/\\/g, "");
    // console.log(data)
    // return data;
    if (val) {
      var firstdata = val.replace("\\", "");
      var data = firstdata.replace(/\'/g, "'");
      console.log(data)
      return data;
    } else {
      return val;
    }

  }
  setReplace(val) {
    if (val) {
      var firstdata = val.replace("\\", "")
      var data = firstdata.replace("'", "\\'")
      console.log("data", data)
      return data;
    } else {
      return val;
    }
    // var data = val.replace(/'/g, "\'");
    // var data = val.replace("'","\\'")

    // console.log("data", data)
    // return data;

  }

}

