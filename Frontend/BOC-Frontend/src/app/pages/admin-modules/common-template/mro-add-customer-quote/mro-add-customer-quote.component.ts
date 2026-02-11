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
  templateUrl: './mro-add-customer-quote.component.html',
  styleUrls: ['./mro-add-customer-quote.component.scss']
})
export class MroAddCustomerQuoteComponent implements OnInit {

  QuoteId;
  MROId;
  btnDisabled: boolean = false;
  PartId;
  Status;
  EditForm: FormGroup;
  public event: EventEmitter<any> = new EventEmitter();
  warrantyList: any;
  viewResult: any;
  // QuoteItem: any = [];
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
  GrandTotalUSD
  CustomerSymbol
  CustomerExchangeRate
  CustomerLocation
  CustomerVatTax
  CustomerCurrencyCode
  isCurrencyMode:boolean=false
  AddForm: FormGroup;
  Vendors$: Observable<any> = of([]);
  VendorsInput$ = new Subject<string>();
  VendorLocation: any;
  VendorVatTax: any;
  VendorCurrencyCode: any;
  VendorExchangeRate: any;
  qtyerror: boolean;
  spinner: boolean = false;
  CustomerCurrencySymbol: any;
  LocalCurrencySymbol: string;
  Quote: any;
  Shipping_field_Name
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.MROId = this.data.MROId;
    this.QuoteId = this.data.QuoteId;
    this.Quote = this.data.Quote;
    this.CustomerId = this.data.CustomerId;
    this.CustomerBillToId = this.data.CustomerBillToId;
    this.CustomerShipToId = this.data.CustomerShipToId;
    this.IsDisplayBaseCurrencyValue =localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")
    this.LocalCurrencySymbol =localStorage.getItem("LocalCurrencySymbol")
    this.VAT_field_Name = VAT_field_Name
    this.Shipping_field_Name = Shipping_field_Name
    this.loadParts();
    this.loadVendors();
    
    this.getViewContent();
    this.PartTypes = part_type


// console.log(this.Quote);
    this.keyword = 'PartNo';

    this.AddForm = this.fb.group({
      MROId: [this.MROId],
      QuoteId: [this.QuoteId],
      LocalCurrencyCode: ['', Validators.required],
      ExchangeRate: ['', Validators.required],
      BaseCurrencyCode: ['', Validators.required],
      LineItem: this.fb.array([
        this.fb.group({
          Part: [''],
          PartNo: [''],
          PartDescription: [''],
          Rate: ['', Validators.required],
          Price: ['', Validators.required],
          LeadTime: [''],
          Quantity: [1, Validators.required],
          PartId: ['',[Validators.required,RxwebValidators.unique()]],
          PartType: ['', Validators.required],
          Tax:'',
          ItemTaxPercent:'',
          BasePrice:['', Validators.required],
          ItemLocalCurrencyCode:'',
          ItemExchangeRate:'',
          ItemBaseCurrencyCode:'',
          ItemLocalCurrencySymbol:'',
          BaseRate:'',
          BaseTax:'',
          ShippingCharge:0,
          BaseShippingCharge:0,
          VendorQuoteInfo: new FormArray([
            this.Createvendor()
          ]),
        })
      ]
      ),
    })
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
    this.selectCustomerEvent();
  }
  Createvendor(): FormGroup {
    return this.fb.group({

      Vendor: [''],
      VendorId: ['', Validators.required],
      Price: ['', Validators.required],
      LeadTime: [''],
      Rate: ['', Validators.required],
      Quantity: [1, Validators.required],
      VendorAttachment: ['', [
        RxwebValidators.extension({ extensions: ["png", "jpeg", "jpg", "gif", "xlsx", "pdf", "doc", "docx", "xls"] })
      ]],
      AttachmentMimeType: [''],
      PartNo: [''],
      Description: [''],
      PartId: [''],
      WebLink: [''],
      Tax:'',
      ItemTaxPercent:'',
      BasePrice:['', Validators.required],
      ItemLocalCurrencyCode:'',
      ItemExchangeRate:'',
      ItemBaseCurrencyCode:'',
      ItemLocalCurrencySymbol:'',
      BaseRate:'',
      BaseTax:'',
      ShippingCharge:0,
      BaseShippingCharge:0,
    });
  }
  selectCustomerEvent() {
    var postData = {
      CustomerId: this.CustomerId
    }
    this.commonService.postHttpService(postData, "getCustomerView").subscribe(response => {
      if (response.status == true) {
        const basicInfo = response.responseData.BasicInfo[0];
        for(var i=0;i<=this.QuoteItem.length;i++){
          const formGroup = this.QuoteItem.controls[i] as FormGroup;
          this.CustomerCurrencySymbol = basicInfo.CurrencySymbol;
          this.CustomerCurrencyCode = basicInfo.CustomerCurrencyCode;
          this.CustomerLocation =  basicInfo.CustomerLocation;
          this.CustomerVatTax =  basicInfo.VatTaxPercentage; 
          formGroup.controls['ItemLocalCurrencySymbol'].patchValue(this.CustomerCurrencySymbol);
          formGroup.controls['ItemLocalCurrencyCode'].patchValue(this.CustomerCurrencyCode);
          formGroup.controls['ItemBaseCurrencyCode'].patchValue(localStorage.getItem('BaseCurrencyCode'));
        }
      }
    });

  }
  getVendor(venIndex: number): FormArray {
    return this.quoteItem().at(venIndex).get("VendorQuoteInfo") as FormArray
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
    index = index ? index : 0;
    const formGroup = this.QuoteItem.controls[index] as FormGroup;
    formGroup.controls['PartNo'].setValue('');
    formGroup.controls['PartId'].setValue('');
    formGroup.controls['PartDescription'].setValue('');
    formGroup.controls['Part'].setValue('');
  }
  closeEvent(item, index) {
    //alert('close')
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
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  //get Form validation control
  get EditFormControl() {
    return this.EditForm.controls;
  }


  calculatePrice(index) {
    var price = 0; var subTotal = 0;
    const formGroup = this.QuoteItem.controls[index] as FormGroup;
    let Quantity = formGroup.controls['Quantity'].value || 0;
    let Rate = formGroup.controls['Rate'].value || 0;
    let VatTax =  formGroup.controls['ItemTaxPercent'].value /100;
    let VatTaxPrice = Rate * VatTax
    let ShippingCharge = formGroup.controls['ShippingCharge'].value || 0;

    // Calculate the price
    price = (parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice)) + parseFloat(ShippingCharge);
    let BaseShippingCharge = ShippingCharge* this.CustomerExchangeRate
    formGroup.controls['BaseShippingCharge'].patchValue((BaseShippingCharge.toFixed(2)));
    formGroup.controls['Price'].patchValue(price);
    formGroup.controls['Tax'].patchValue((Rate * VatTax));
    var TaxLocal=(Rate * VatTax);
    let priceUSD = price* this.CustomerExchangeRate;
    formGroup.controls['BasePrice'].patchValue((priceUSD.toFixed(2)));
    let RateUSD = Rate* this.CustomerExchangeRate;
    formGroup.controls['BaseRate'].patchValue((RateUSD.toFixed(2)));
    let BaseTaxUSD = TaxLocal* this.CustomerExchangeRate;
    formGroup.controls['BaseTax'].patchValue((BaseTaxUSD.toFixed(2)));
    // Calculate the subtotal
    for (let i = 0; i < this.QuoteItem.length; i++) {
      subTotal += parseFloat(this.QuoteItem.controls[i].get('Price').value);

    }
    this.SubTotal = subTotal.toFixed(2);
     this.AddForm.patchValue({ TotalValue: this.SubTotal });
    // //this.EditForm.patchValue({ TotalTax: (this.SubTotal * 5 / 100).toFixed(2) });    
    // this.AddForm.patchValue({ TotalTax: (this.SubTotal * this.AddForm.value.TaxPercent / 100).toFixed(2) });
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
    Object.keys(this.AddForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.AddForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

  onSubmit() {
    
    this.AddForm.patchValue({ LocalCurrencyCode: this.CustomerCurrencyCode, ExchangeRate: this.CustomerExchangeRate, BaseCurrencyCode: localStorage.getItem('BaseCurrencyCode'), });
    console.log(this.AddForm.value)
    this.submitted = true; this.getFormValidationErrors();
    let partNotFound = false;
    if (this.AddForm.valid) {
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
      var postData = this.AddForm.value;
      this.commonService.postHttpService(postData, "UpdateMROAddCustomerQuote").subscribe(response => {
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
        text: `Customer Currency Code is Changed. Please contact admin to create a quote`,
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
  // public initPart(): FormGroup {
  //   // this.SelectDisabledCondition=false
  //   return this.fb.group({
  //     Part: this.fb.control({value:'', disabled: false}),
  //     PartNo:[''],
  //     PartDescription: [''],
  //     LeadTime: [''],
  //     Quantity: [1],
  //     Rate: [''],
  //     Price: [''],
  //     PartId: [0],
  //     QuoteItemId: [0],
  //     PartType: [],
  //     Tax:'',
  //     ItemTaxPercent:'',
  //     BasePrice:'',
  //     ItemLocalCurrencyCode:'',
  //     ItemExchangeRate:'',
  //     ItemBaseCurrencyCode:'',
  //     ItemLocalCurrencySymbol:'',
  //     BaseRate:'',
  //     BaseTax:''
  //   });
  // }

  // public addPart(): void {
  //   const control = <FormArray>this.EditFormControl.QuoteItemList;
  //   control.push(this.initPart());
  // }

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
  quoteItem(): FormArray {
    return this.AddForm.get('LineItem') as FormArray;
  }
  get QuoteItem(): FormArray {
    return this.AddForm.get('LineItem') as FormArray;
  }

  loadVendors() {
    this.Vendors$ = concat(
      of([]), // default items
      this.VendorsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        // tap(() => this.moviesLoading = true),
        switchMap(term => {

          return this.searchVendors(term).pipe(
            catchError(() => of([])), // empty list on error
            // tap(() => this.moviesLoading = false)
          )
        })
      )
    );
  }

  searchVendors(term: string = ""): Observable<any> {
    var postData = {
      "Vendor": term
    }
    return this.commonService.postHttpService(postData, "getAllAutoCompleteofVendor")
      .pipe(
        map(response => {
          return response.responseData;
        })
      );
  }
  selectVendorEvent(item, i, j) {
    const formGroup = this.VendorQuoteInfo(i).controls[j] as FormGroup;
    const formGroup1 = this.QuoteItem.controls[i] as FormGroup;
    const IBCC = localStorage.getItem('BaseCurrencyCode');
    if(formGroup1.value.PartId != ''){
    if (item != null) {
      formGroup1.controls['ItemBaseCurrencyCode'].patchValue(IBCC);
      formGroup.controls['Vendor'].patchValue(item.VendorName);
      formGroup.controls['ItemLocalCurrencySymbol'].patchValue(item.CurrencySymbol);
      formGroup.controls['ItemLocalCurrencyCode'].patchValue(item.VendorCurrencyCode);
      formGroup.controls['ItemBaseCurrencyCode'].patchValue(IBCC);
      formGroup.controls['VendorId'].patchValue(item.VendorId);
      formGroup.controls['PartNo'].patchValue(formGroup1.value.PartNo);
      formGroup.controls['PartId'].patchValue(formGroup1.value.PartId);
      formGroup.controls['Description'].patchValue(this.getReplace(formGroup1.value.PartDescription));
      this.VendorLocation =  item.VendorLocation
      this.VendorVatTax =  item.VatTaxPercentage
      var PartId =formGroup1.value.PartId;
      var VendorId= item.VendorId;
      this.VendorCurrencyCode = item.VendorCurrencyCode
      this.onExchangeRateVendorChanges(PartId,VendorId,i,j)
    } else {
      this.clearVendorEvent(item, i,j)
    }
  }else{
    formGroup.controls['Vendor'].setValue('');
      Swal.fire({
        type: 'info',
        title: 'Message',
        text: `Please Choose the Part Before Select Vendor`,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    
  }
  }
  clearVendorEvent(item, i,j) { //alert('clear')
    // const formGroup = this.QuoteItem.controls[index] as FormGroup;
    const formGroup = this.VendorQuoteInfo(i).controls[j] as FormGroup;
    formGroup.controls['PartNo'].setValue('');
    formGroup.controls['PartId'].setValue('');
    formGroup.controls['Description'].setValue('');
    formGroup.controls['VendorId'].setValue('');
    formGroup.controls['ItemLocalCurrencySymbol'].setValue('');
    formGroup.controls['ItemLocalCurrencyCode'].setValue('');
    formGroup.controls['ItemBaseCurrencyCode'].setValue('');
    formGroup.controls['Vendor'].setValue('');
    this.VendorLocation =  ''
    this.VendorVatTax =  ''
    this.VendorCurrencyCode = ''
  }
  VendorQuoteInfo(venIndex): FormArray {
    return this.quoteItem().at(venIndex).get("VendorQuoteInfo") as FormArray
  }
  onExchangeRateVendorChanges(PartId,VendorId,i,j) {
    var postData = { PartId: PartId, "VendorId": VendorId };
    this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {
      this.VendorExchangeRate=response.responseData[0].ExchangeRate
      if(this.VendorCurrencyCode != localStorage.getItem('BaseCurrencyCode')){
      if(this.VendorExchangeRate==null){
        Swal.fire({
          type: 'info',
          title: 'Message',
          text: `Exchange rate is not available for ${this.VendorCurrencyCode} to USD. Please contact admin to create a quote`,
          confirmButtonClass: 'btn btn-confirm mt-2',
        });
        const formGroup1 = this.QuoteItem.controls[i] as FormGroup;
        formGroup1.controls['Part'].patchValue('');
      }else{
      const formGroup = this.VendorQuoteInfo(i).controls[j] as FormGroup;
      formGroup.controls['ItemExchangeRate'].patchValue(this.VendorExchangeRate);
      if(localStorage.getItem('Location')==this.VendorLocation){

        if(response.responseData[0].PartVatTaxPercentage!=null){
          formGroup.controls['ItemTaxPercent'].patchValue(response.responseData[0].PartVatTaxPercentage);

        }else{
          formGroup.controls['ItemTaxPercent'].patchValue(this.VendorVatTax);
        }

      }else{
        formGroup.controls['ItemTaxPercent'].patchValue('0');
      }
      this.calculateVendorPrice(i,j)
      }
    }else{
      this.VendorExchangeRate = '1'
      const formGroup = this.VendorQuoteInfo(i).controls[j] as FormGroup;
      formGroup.controls['ItemExchangeRate'].patchValue(this.VendorExchangeRate);

      

      if(localStorage.getItem('Location')==this.VendorLocation){

        if(response.responseData[0].PartVatTaxPercentage!=null){
          formGroup.controls['ItemTaxPercent'].patchValue(response.responseData[0].PartVatTaxPercentage);

        }else{
          formGroup.controls['ItemTaxPercent'].patchValue(this.VendorVatTax);
        }

      }else{
        formGroup.controls['ItemTaxPercent'].patchValue('0');
      }
      this.calculateVendorPrice(i,j)
      }

    });
  }
  calculateVendorPrice(i, j) {
    var price = 0;
    const formGroup = this.VendorQuoteInfo(i).controls[j] as FormGroup;
    let Quantity = formGroup.controls['Quantity'].value || 0;
    let Rate = formGroup.controls['Rate'].value || 0;
    let VatTax =  formGroup.controls['ItemTaxPercent'].value /100;
    let VatTaxPrice = Rate * VatTax
    let ShippingCharge = formGroup.controls['ShippingCharge'].value || 0;

    // Calculate the price
    price = (parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice)) + parseFloat(ShippingCharge);
    let BaseShippingCharge = ShippingCharge* this.CustomerExchangeRate
    formGroup.controls['BaseShippingCharge'].patchValue((BaseShippingCharge.toFixed(2)));
    formGroup.controls['Price'].patchValue(price);
    formGroup.controls['Tax'].patchValue((Rate * VatTax));
    var TaxLocal=(Rate * VatTax)
    let priceUSD = price* this.VendorExchangeRate;
    formGroup.controls['BasePrice'].patchValue((priceUSD.toFixed(2)));
    let RateUSD = Rate* this.VendorExchangeRate
    formGroup.controls['BaseRate'].patchValue((RateUSD.toFixed(2)));
    let BaseTaxUSD = TaxLocal* this.VendorExchangeRate
    formGroup.controls['BaseTax'].patchValue((BaseTaxUSD.toFixed(2)));
  }

  fileProgressMultiple(event: any, k, j) {
    var fileData = event.target.files[0];
    const formData = new FormData();
    var filesarray = event.target.files;
    for (var i = 0; i < filesarray.length; i++) {
      formData.append('files', filesarray[i]);
    }
    this.spinner = true;
    const formGroup = this.VendorQuoteInfo(k).controls[j] as FormGroup;

    // if (formGroup.VendorAttachment.valid == true) {
    this.commonService.postHttpImageService(formData, "RRImageupload").subscribe(response => {
      var imageresult = response.responseData;
      for (var x in imageresult) {
        const formGroup = this.VendorQuoteInfo(k).controls[j] as FormGroup;
        formGroup.controls['VendorAttachment'].patchValue(imageresult[x].location,);
        formGroup.controls['AttachmentMimeType'].patchValue(imageresult[x].mimetype);

      }
      this.spinner = false;
      this.cd_ref.detectChanges();
    }, error => {
      console.log(error);
      this.spinner = false;
    });
    // }
    // else {
    //   this.spinner = false;
    // }
  }

  

  validateqty(event, i, j) {
    const formGroup = this.QuoteItem.controls[i] as FormGroup;
    const formGroup1 = this.VendorQuoteInfo(i).controls[j] as FormGroup;
    this.calculateVendorPrice(i, j)
    if (Number(event.target.value) > Number(formGroup.value.Quantity)) {
      Swal.fire({
        title: 'Error!',
        text: 'Vendor Quantity should not exceed the Customer Quantity',
        type: 'warning',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
      event.target.value = ''
      this.qtyerror = true
      formGroup1.markAsTouched()


    } else {
      this.qtyerror = false
    }

  }
  addvendor(venIndex: number) {
    // const control = <FormArray>this.AddFormControl.Vendor;
    // control.push(this.Createvendor());
    this.getVendor(venIndex).push(this.Createvendor());



  }
  removeVendor(i: number, j: number) {
    this.getVendor(i).removeAt(j);
  }

  selectEvent(item, i) {
    i = i ? i : 0;
    if (item != null) {
      var postData = { PartId: item.PartId, "MROId": this.MROId };
      this.commonService.postHttpService(postData, 'viewQuoteItemUsingPartIdAndMROId').subscribe(response => {
        if(response.status == true && response.responseData.length > 0){
          Swal.fire({
            title: 'Error!',
            text: 'Part already exists in this MRO.',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          this.clearEvent(item, i)
        }else{
          if (item.PartId == "0") {
            this.openPopup(i)
          } else {
            const formGroup = this.QuoteItem.controls[i] as FormGroup;
            formGroup.controls['PartDescription'].patchValue(this.getReplace(item.Description));
            formGroup.controls['PartNo'].patchValue(item.PartNo);
            formGroup.controls['PartId'].patchValue(item.PartId);
            formGroup.controls['Quantity'].patchValue(1);
            formGroup.controls['Rate'].patchValue(item.SellingPrice || item.NewPrice);
            formGroup.controls['Part'].patchValue(item.PartNo);
            this.onExchangeRateCustomerChanges(item.PartId,this.CustomerId,i)
    
            this.calculatePrice(i);
          }
        }
      });
      
    } else {
      this.clearEvent(item, i)
    }
  }

  onExchangeRateCustomerChanges(PartId,CustomerId,i) {
    var postData = { PartId: PartId, "CustomerId": CustomerId };
    this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {
      this.CustomerExchangeRate=response.responseData[0].ExchangeRate
      if(this.CustomerCurrencyCode != localStorage.getItem('BaseCurrencyCode')){
      if(this.CustomerExchangeRate==null){
        Swal.fire({
          type: 'info',
          title: 'Message',
          text: `Exchange rate is not available for ${this.CustomerCurrencyCode} to USD. Please contact admin to create a quote`,
          confirmButtonClass: 'btn btn-confirm mt-2',
        });
        const formGroup1 = this.QuoteItem.controls[i] as FormGroup;
        formGroup1.controls['Part'].patchValue('');
      }else{
      const formGroup = this.QuoteItem.controls[i] as FormGroup;
      formGroup.controls['ItemExchangeRate'].patchValue(this.CustomerExchangeRate);
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
    }else{
      this.CustomerExchangeRate = '1'
      const formGroup = this.QuoteItem.controls[i] as FormGroup;
      formGroup.controls['ItemExchangeRate'].patchValue(this.CustomerExchangeRate);

      

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

    });
  }
  openPopup(i) {
    // if (this.AddForm.value.CustomerId == '' || this.AddForm.value.CustomerId == null) {
    //   Swal.fire({
    //     title: 'Alert',
    //     text: 'Please select the customer!',
    //     type: 'warning'
    //   });
    //   //this.CustomerPONoElement.nativeElement.focus();
    //   return false;
    // } else {
    //   var CustomerId = this.AddForm.value.CustomerId;
    //   var MROhidden = true

    //   this.modalRef = this.CommonmodalService.show(AddRrPartsComponent,
    //     {
    //       backdrop: 'static',
    //       ignoreBackdropClick: false,
    //       initialState: {
    //         data: { CustomerId, MROhidden },
    //         class: 'modal-lg'
    //       }, class: 'gray modal-lg'
    //     });

    //   this.modalRef.content.closeBtnName = 'Close';
    //   this.modalRef.content.event.subscribe(modelResponse => {

    //     const formGroup = this.QuoteItem.controls[i] as FormGroup;
    //     formGroup.controls['PartNo'].setValue('');
    //     formGroup.controls['PartId'].setValue('');
    //     formGroup.controls['PartDescription'].setValue('');
    //     formGroup.controls['Part'].setValue('');

    //     this.selectEvent(modelResponse.data, i)



    //   });

    // }
  }

  public initPart(): FormGroup {
    return this.fb.group({
      Part: [''],
      PartNo: [''],
      PartDescription: [''],
      Rate: ['', Validators.required],
      Price: ['', Validators.required],
      LeadTime: [''],
      Quantity: [1, Validators.required],
      PartId: ['', [Validators.required,RxwebValidators.unique()]],
      PartType: ['', Validators.required],
      Tax:'',
      ItemTaxPercent:'',
      BasePrice:['', Validators.required],
      ItemLocalCurrencyCode:this.CustomerCurrencyCode,
      ItemExchangeRate:'',
      ItemBaseCurrencyCode:'',
      ItemLocalCurrencySymbol:this.CustomerCurrencyCode,
      BaseRate:'',
      BaseTax:'',
      ShippingCharge:0,
      BaseShippingCharge:0,
      VendorQuoteInfo: new FormArray([
        this.Createvendor()
      ]),


    });
  }

  public addPart(): void {
    // const control = <FormArray>this.AddFormControl.QuoteItem;
    // control.push(this.initPart());
    this.quoteItem().push(this.initPart());
  }

}
