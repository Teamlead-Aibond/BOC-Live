import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title, Shipping_field_Name, VAT_field_Name } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-vendor-mro',
  templateUrl: './update-vendor-mro.component.html',
  styleUrls: ['./update-vendor-mro.component.scss']
})
export class UpdateVendorMroComponent implements OnInit {




  btnDisabled: boolean = false;
  qtyerror:boolean = false;
  AddForm: FormGroup;
  submitted = false;
  QuoteItemId;
  QuoteId;
  MROId; PartId;
  CustomerId;
  SOId;
  POId;
  Invoice_Status;
  POAmount
  IsInvoiceApproved
  public event: EventEmitter<any> = new EventEmitter();

  Vendors$: Observable<any> = of([]);
  VendorsInput$ = new Subject<string>();
  Status

  viewResult: any = []
  QuoteItemInfo;
  spinner: boolean = false;
  Rejected = 6

  VAT_field_Name
  Shipping_field_Name
  IsDisplayBaseCurrencyValue
  BaseCurrencySymbol
  VendorLocation
  VendorVatTax
  ExchangeRate
  VendorCurrencyCode
  BaseGrandTotal
  isCurrencyMode:boolean=false
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,    private CommonmodalService: BsModalService,
    ) { }

  ngOnInit(): void {
    this.VAT_field_Name = VAT_field_Name
    this.Shipping_field_Name = Shipping_field_Name
    this.IsDisplayBaseCurrencyValue =localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")

    this.MROId = this.data.MROId;
    this.QuoteId = this.data.QuoteId;
    this.QuoteItemId = this.data.QuoteItemId;
    this.PartId = this.data.PartId;
    this.Status = this.data.Status
    this.loadVendors();

    this.AddForm = this.fb.group({
      MROId: this.MROId,
      QuoteItem: this.fb.array([
        // this.fb.group({
        //   VendorQuoteId:[''],
        //   VendorQuoteItemId:[''],
        //   VendorName:[''],
        //   VendorId: [''],
        //   PartNo:[''],
        //   Description:[''],
        //   Price: [''],
        //   LeadTime: [''],
        //   PartId: [''],
        //   Rate: [''],
        //   Quantity: ['1'],
        //   Attachment: ['']
        // })
      ]),
    })
    this.getViewContent();
  }

  get QuoteItemList(): FormArray {
    return this.AddForm.get('QuoteItem') as FormArray;
  }

  getViewContent() {
    var postData = {
      MROId: this.MROId,
      "QuoteId": this.QuoteId,
      "QuoteItemId": this.QuoteItemId,
      "PartId": this.PartId

    }

    this.commonService.postHttpService(postData, "ViewMROVendorInfo").subscribe(response => {
      if (response.status == true) {
        this.viewResult = response.responseData;
        this.BaseGrandTotal = this.viewResult.VendorsInfo[0].BaseGrandTotal;
        this.ExchangeRate = this.viewResult.VendorsInfo[0].ItemExchangeRate
        this.VendorLocation = this.viewResult.VendorsInfo[0].VendorLocation 
        this.VendorVatTax = this.viewResult.VendorsInfo[0].VatTaxPercentage 
        this.VendorCurrencyCode = this.viewResult.VendorsInfo[0].VendorCurrencyCode 
        if(this.VendorCurrencyCode==localStorage.getItem("BaseCurrencyCode")){
          this.ExchangeRate = 1
        }
        if (this.viewResult.VendorsInfo.length > 0) {
          for (let val of this.viewResult.VendorsInfo) {
            this.QuoteItemList.push(this.fb.group({
              VendorQuoteId: val.VendorQuoteId,
              VendorQuoteItemId: val.VendorQuoteItemId,
              VendorName: val.VendorName,
              VendorId: val.VendorId,
              PartNo: val.PartNo,
              Description: val.Description,
              Price: val.Price,
              LeadTime: val.LeadTime,
              PartId: val.PartId,
              Rate: val.Rate,
              Quantity: val.Quantity,
              VendorAttachment: val.VendorAttachment,
              WebLink:val.WebLink,
              AttachmentMimeType:val.AttachmentMimeType,
              Vendor:val.VendorName,
              "Tax":val.Tax,
              "ItemTaxPercent":val.ItemTaxPercent,
              "BasePrice":val.BasePrice,
              "ItemLocalCurrencyCode":val.ItemLocalCurrencyCode,
              "ItemExchangeRate":val.ItemExchangeRate,
              "ItemBaseCurrencyCode":val.ItemBaseCurrencyCode,
              "ItemLocalCurrencySymbol":val.CurrencySymbol,
              'BaseRate':val.BaseRate,
              "BaseTax":val.BaseTax,
              "ShippingCharge":val.ShippingCharge,
              "BaseShippingCharge":val.BaseShippingCharge
            })
            )
          }
        } else {
          this.Createvendor()
        }




        this.QuoteItemInfo = this.viewResult.QuoteItemInfo[0]



      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  quoteItem(): FormArray {
    return this.AddForm.get('QuoteItem') as FormArray;
  }

  Createvendor(): FormGroup {
    let Obj=this

    return this.fb.group({

      VendorQuoteId: [''],
      VendorQuoteItemId: [''],
      VendorName: [''],
      VendorId: [''],
      PartNo: [''],
      Description: [''],
      Price: [''],
      LeadTime: [''],
      PartId: this.PartId,
      Rate: [''],
      Quantity: ['1'],
      VendorAttachment: [''],
      AttachmentMimeType:[''],
      WebLink:[''],
      Vendor:[''],
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
  addvendor() {
    const control = <FormArray>this.AddFormControl.QuoteItem;
    control.push(this.Createvendor());
  }
  removeVendor(i: number) {
    this.quoteItem().removeAt(i);

  }
  onSubmit() {
    this.submitted = true;
    
    if (this.AddForm.valid && !(this.qtyerror)) {
      this.QuoteItem.controls.forEach((control, i) => {
        if (control.get('ItemLocalCurrencySymbol').value != this.viewResult.VendorsInfo[0].VendorCurrencySymbol) {
          this.isCurrencyMode = true
       }
     })
     if(!this.isCurrencyMode){
      this.btnDisabled=true
      var postData = {
        "LocalCurrencyCode":this.VendorCurrencyCode,
        "ExchangeRate":this.ExchangeRate,
        "BaseCurrencyCode":localStorage.getItem('BaseCurrencyCode'),
        "BaseGrandTotal":this.BaseGrandTotal,
        "MROId": this.MROId,
        "QuoteId": this.QuoteId,
        "QuoteItemId": this.QuoteItemId,
        "VendorQuoteInfo": this.AddForm.value.QuoteItem
      }
      this.commonService.putHttpService(postData, "UpdateMROVendorQuote").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Vendor Quote Updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: response.message,
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }else{
      Swal.fire({
        type: 'info',
        title: 'Vendor Currency Mismatch',
        text: `Vendor Currency Code is Changed. Please contact admin to update a quote`,
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

  fileProgressMultiple(event: any, k) {
    var fileData = event.target.files[0];
    const formData = new FormData();
    var filesarray = event.target.files;
    for (var i = 0; i < filesarray.length; i++) {
      formData.append('files', filesarray[i]);
    }
    this.spinner = true;
    const formGroup = this.QuoteItem.controls[k] as FormGroup;

    // if (formGroup.VendorAttachment.valid == true) {
    this.commonService.postHttpImageService(formData, "RRImageupload").subscribe(response => {
      var imageresult = response.responseData;
      for (var x in imageresult) {
        formGroup.controls['VendorAttachment'].patchValue(imageresult[x].location,);
        formGroup.controls['AttachmentMimeType'].patchValue(imageresult[x].mimetype);

      }
      this.spinner = false;
      this.cd_ref.detectChanges();
    }, error => console.log(error));
    // }
    // else {
    //   this.spinner = false;
    // }
  }

  //get AddressForm validation control
  get AddFormControl() {
    return this.AddForm.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
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
  get QuoteItem(): FormArray {
    return this.AddForm.get('QuoteItem') as FormArray;
  }
  validateqty($event,i){
    let Obj=this
     if($event.target.value>Obj.QuoteItemInfo.Quantity){
      Swal.fire({
        title: 'Error!',
        text: 'Vendor Quantity should not exceeds the Customer Quantity',
        type: 'warning',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
      $event.target.value=''
      this.qtyerror=true
    }else{
      this.qtyerror=false
    }
    
    
    this.calculatePrice(i)
  }
  calculatePrice(index) {
    var price = 0; var subTotal = 0; var Tax = 0;
    const formGroup = this.QuoteItem.controls[index] as FormGroup;
    let Quantity = formGroup.controls['Quantity'].value || 0;
    let Rate = formGroup.controls['Rate'].value || 0;
    let ShippingCharge = formGroup.controls['ShippingCharge'].value || 0;
    let VatTax = formGroup.controls['ItemTaxPercent'].value /100;
    let VatTaxPrice = Rate * VatTax;
    // Calculate the price
    price = (parseFloat(Quantity) * (parseFloat(Rate)+ VatTaxPrice)) + parseFloat(ShippingCharge);
    Tax = Rate * VatTax;
    formGroup.controls['Price'].patchValue(price.toFixed(2));
    formGroup.controls['Tax'].patchValue(Tax.toFixed(2))
    var TaxLocal=(Rate * VatTax);
    let priceUSD = price*this.ExchangeRate;
    formGroup.controls['BasePrice'].patchValue(priceUSD.toFixed(2))
    let RateUSD = Rate*this.ExchangeRate;
   let BaseShippingCharge = ShippingCharge*this.ExchangeRate
   formGroup.controls['BasePrice'].patchValue(priceUSD.toFixed(2))
   formGroup.controls['BaseShippingCharge'].patchValue(BaseShippingCharge.toFixed(2))   
   formGroup.controls['BaseRate'].patchValue(RateUSD.toFixed(2))
   let BaseRateUSD = TaxLocal*this.ExchangeRate;
   formGroup.controls['BaseTax'].patchValue(BaseRateUSD.toFixed(2))
   
  // // Calculate the subtotal
    // for (let i = 0; i < this.QuoteItem.length; i++) {
    //   subTotal += this.QuoteItem.controls[i].get('Price').value;

    // }
    // this.SubTotal = subTotal;
   
    // //this.EditForm.patchValue({ TotalTax: (this.SubTotal * 5 / 100).toFixed(2) });    
    // this.AddForm.patchValue({ TotalTax: (this.SubTotal * this.AddForm.value.TaxPercent / 100).toFixed(2) });
    
  }

 
 

    //*************Vendor dropdown************
    clearEvent(item, index) { //alert('clear')
      const formGroup = this.QuoteItem.controls[index] as FormGroup;
      formGroup.controls['VendorId'].setValue('');
      formGroup.controls['VendorName'].setValue('');
      formGroup.controls['Quantity'].setValue('');
      formGroup.controls['Rate'].setValue('');
      formGroup.controls['ItemLocalCurrencyCode'].setValue('');
      formGroup.controls['ItemExchangeRate'].setValue('');
      formGroup.controls['ItemBaseCurrencyCode'].setValue('');
      formGroup.controls['ItemTaxPercent'].setValue('');
      formGroup.controls['BaseRate'].setValue('');
      formGroup.controls['BaseTax'].setValue('');

   }
    closeEvent(item, index) {
      //alert('close')
    }
    selectVendor(item, i) {
      if (item != null) {
       
          const formGroup = this.QuoteItem.controls[i] as FormGroup;
          formGroup.controls['VendorId'].patchValue(item.VendorId);
          formGroup.controls['VendorName'].patchValue(item.VendorName);
          formGroup.controls['ItemLocalCurrencySymbol'].patchValue(item.CurrencySymbol);
          formGroup.controls['ItemLocalCurrencyCode'].patchValue(item.VendorCurrencyCode);
          formGroup.controls['ItemBaseCurrencyCode'].patchValue(localStorage.getItem('BaseCurrencyCode'));
          this.VendorCurrencyCode = item.VendorCurrencyCode
          var postData = { PartId: this.viewResult.QuoteItemInfo[0].PartId,"VendorId": item.VendorId};
          this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {
           
            this.ExchangeRate=response.responseData[0].ExchangeRate
            if(this.VendorCurrencyCode != localStorage.getItem('BaseCurrencyCode')){
            if(this.ExchangeRate== null){
              Swal.fire({
                type: 'info',
                title: 'Message',
                text: `Exchange rate is not available for ${this.VendorCurrencyCode} to USD. Please contact admin to create a quote`,
                confirmButtonClass: 'btn btn-confirm mt-2',
              });
              formGroup.controls['PartNo'].setValue('');
              formGroup.controls['PartId'].setValue('');
              formGroup.controls['Description'].setValue('');
              formGroup.controls['PartNo1'].setValue('');
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
              formGroup.controls['Description'].patchValue(response.responseData[0].Description);
              formGroup.controls['PartNo'].patchValue(response.responseData[0].PartNo);
              formGroup.controls['PartId'].patchValue(response.responseData[0].PartId);
              formGroup.controls['Quantity'].patchValue(response.responseData[0].Quantity);
              formGroup.controls['Rate'].patchValue(response.responseData[0].Price);
              formGroup.controls['ItemLocalCurrencyCode'].patchValue(this.VendorCurrencyCode);
              formGroup.controls['ItemExchangeRate'].patchValue(this.ExchangeRate);
              formGroup.controls['ItemBaseCurrencyCode'].patchValue(localStorage.getItem('BaseCurrencyCode'));
              formGroup.controls['ItemLocalCurrencySymbol'].patchValue(this.viewResult.VendorsInfo[0].VendorCurrencySymbol);
      
            
              if(localStorage.getItem('Location')==this.VendorLocation){
      
                if(response.responseData[0].PartVatTaxPercentage!=null){
                  formGroup.controls['ItemTaxPercent'].patchValue(response.responseData[0].PartVatTaxPercentage);
                }else{
                  formGroup.controls['ItemTaxPercent'].patchValue(this.VendorVatTax);
                }
        
              }else{
                formGroup.controls['ItemTaxPercent'].patchValue('0');
              }
              this.calculatePrice(i)
            }
          }else{
              this.ExchangeRate = '1'
              formGroup.controls['Description'].patchValue(response.responseData[0].Description,);
              formGroup.controls['PartNo'].patchValue(response.responseData[0].PartNo);
              formGroup.controls['PartId'].patchValue(response.responseData[0].PartId);
              formGroup.controls['Quantity'].patchValue(response.responseData[0].Quantity);
              formGroup.controls['Rate'].patchValue(response.responseData[0].Price);
              formGroup.controls['ItemLocalCurrencyCode'].patchValue(this.VendorCurrencyCode);
              formGroup.controls['ItemExchangeRate'].patchValue(this.ExchangeRate);
              formGroup.controls['ItemBaseCurrencyCode'].patchValue(localStorage.getItem('BaseCurrencyCode'));
              formGroup.controls['ItemLocalCurrencySymbol'].patchValue(this.viewResult.VendorsInfo[0].VendorCurrencySymbol);
      
              if(localStorage.getItem('Location')==this.VendorLocation){
      
                if(response.responseData[0].PartVatTaxPercentage!=null){
                  formGroup.controls['ItemTaxPercent'].patchValue(response.responseData[0].PartVatTaxPercentage);
                }else{
                  formGroup.controls['ItemTaxPercent'].patchValue(this.VendorVatTax);
                }
        
              }else{
                formGroup.controls['ItemTaxPercent'].patchValue('0');
              }
              this.calculatePrice(i)
           
        
      } 
    })
  }else{
    this.clearEvent(item, i)
  }
}
  
  
}

