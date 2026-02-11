import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter, AfterViewInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, FormArray, ValidationErrors } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title, VAT_field_Name, warranty_list } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

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
  PON: string,
  LPP: string
}

export interface PartData {
  QuoteItemList: Part[];
}

@Component({
  selector: 'app-customer-quote',
  templateUrl: './customer-quote.component.html',
  styleUrls: ['./customer-quote.component.scss']
})
export class CustomerQuoteComponent implements OnInit, AfterViewInit {
  QuoteId;
  RRId;
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
  keyword = "PartNo"; partList: any = []; partNewList: any = [];



  VAT_field_Name
  IsDisplayBaseCurrencyValue
  Symbol
  ExchangeRate
  BaseGrandTotal
  CustomerLocation
  CustomerVatTax
  CustomerCurrencyCode
  BaseCurrencySymbol
  isCurrencyMode: boolean = false
  CreatedByLocation
  LocationName
  Location
  CreatedByLocationName
  RRPartInfoPartId: any;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {

    this.VAT_field_Name = VAT_field_Name
    this.IsDisplayBaseCurrencyValue = localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol")
    this.VendorName = this.data.VendorName;
    this.VendorId = this.data.VendorId;
    this.RRId = this.data.RRId;
    this.QuoteId = this.data.QuoteId;
    this.QuoteCustomerStatus = this.data.QuoteCustomerStatus;
    this.Status = this.data.Status;
    this.CustomerId = this.data.CustomerId;
    this.LocationName = localStorage.getItem("LocationName");
    this.Location = localStorage.getItem("Location");
    this.RRPartInfoPartId = this.data.RRPartInfoPartId;
    this.getViewContent();

    this.warrantyList = warranty_list;

    this.getPartList();

    this.keyword = 'PartNo';

    this.EditForm = this.fb.group({
      //RRId: ['', Validators.required],
      RouteCause: [''],
      // VendorLeadTime: [''],
      WarrantyPeriod: [''],

      SubTotal: [''],
      AdditionalCharge: [''],
      TotalTax: [''],
      TaxPercent: [''],
      Discount: [''],
      Shipping: [''],
      GrandTotal: [''],
      //QuoteId: ['', Validators.required],

      QuoteItemList: this.fb.array([
        this.fb.group({
          PartNo1: [''],
          PartNo: [''],
          PartDescription: [''],
          LeadTime: [''],
          Quantity: 1,
          Rate: [''],
          Price: [''],
          VendorUnitPrice: [''],
          SerialNo: [''],
          //IsIncludeInQuote: 1,
          QuoteItemId: [''],
          PartId: [0],
          PON: [''],
          LPP: [''],
          Tax: '',
          ItemTaxPercent: '',
          BasePrice: '',
          ItemLocalCurrencyCode: '',
          ItemExchangeRate: '',
          ItemBaseCurrencyCode: '',
          ItemLocalCurrencySymbol: '',
          BaseRate: '',
          BaseTax: ''
        })
      ]),
    })
  }

  getPartList() {
    // Update the Customer Parts List
    this.partNewList = [];
    this.partList = [];
    var postData = { CustomerId: this.CustomerId };
    this.commonService.postHttpService(postData, 'getPartListDropdown').subscribe(response => {
      for (var i in response.responseData) {
        this.partNewList.push({
          "PartId": response.responseData[i].PartId,
          "PartNo": response.responseData[i].PartNo,
          "PartNo1": response.responseData[i].PartNo,
          "PartDescription": this.getReplace(response.responseData[i].Description)
        });
      }
      this.partList = this.partNewList;
    });
  }

  getPartPrice(PartId, index) {
    this.LPPList = [];
    var postData = { PartId: PartId, CustomerId: this.CustomerId };
    this.commonService.postHttpService(postData, 'RRGetPartPrice').subscribe(response => {
      for (var i in response.responseData.LPPInfo) {
        this.LPPList.push(response.responseData.LPPInfo[i].LPP);
      }
      this.LPP = this.LPPList.join(', ');
      this.PON = response.responseData.PartInfo.PON;
    });
  }

  clearEvent(item, index) { //alert('clear')
    const formGroup = this.QuoteItemList.controls[index] as FormGroup;
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

  }

  closeEvent(item, index) {
    //alert('close')
  }

  /* selectEvent(item, index) {
    const formGroup = this.QuoteItemList.controls[index] as FormGroup;
    formGroup.controls['PartDescription'].patchValue(item.Description);
    formGroup.controls['PartNo'].patchValue(item.PartNo);
    formGroup.controls['PartId'].patchValue(item.PartId);

    this.LPPList = [];

    var postData = { PartId: item.PartId, CustomerId: this.CustomerId };
    this.commonService.postHttpService(postData, 'RRGetPartPrice').subscribe(response => {
      for (var i in response.responseData.LPPInfo) {
        this.LPPList.push(response.responseData.LPPInfo[i].LPP);
      }
      formGroup.controls['LPP'].patchValue(this.LPPList.join(', '));
      formGroup.controls['PON'].patchValue(response.responseData.PartInfo.PON);
    });
  } */

  selectEvent(item, i) {
    var error = false;
    const formGroup = this.QuoteItemList.controls[i] as FormGroup;

    //get form array reference
    const parts = this.EditForm.get('QuoteItemList') as FormArray;

    var postData = { PartId: item.PartId, "CustomerId": this.CustomerId };
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
          continue;
        }
      }
      if (error == false) {
        this.ExchangeRate = response.responseData[0].ExchangeRate
        if (this.CustomerCurrencyCode != localStorage.getItem('BaseCurrencyCode')) {
          if (this.ExchangeRate == null) {
            Swal.fire({
              type: 'info',
              title: 'Message',
              text: `Exchange rate is not available for ${this.CustomerCurrencyCode} to USD. Please contact admin to create a quote`,
              confirmButtonClass: 'btn btn-confirm mt-2',
            });
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


          } else {
            formGroup.controls['PartDescription'].patchValue(this.getReplace(response.responseData[0].Description));
            formGroup.controls['PartNo1'].patchValue(response.responseData[0].PartNo);
            formGroup.controls['PartNo'].patchValue(response.responseData[0].PartNo);
            formGroup.controls['PartId'].patchValue(response.responseData[0].PartId);
            formGroup.controls['Quantity'].patchValue(response.responseData[0].Quantity);
            formGroup.controls['Rate'].patchValue(response.responseData[0].Price);
            formGroup.controls['ItemLocalCurrencyCode'].patchValue(this.CustomerCurrencyCode);
            formGroup.controls['ItemExchangeRate'].patchValue(this.ExchangeRate);
            formGroup.controls['ItemBaseCurrencyCode'].patchValue(localStorage.getItem('BaseCurrencyCode'));
            formGroup.controls['SerialNo'].patchValue('');
            formGroup.controls['ItemLocalCurrencySymbol'].patchValue(this.viewResult.BasicInfo[0].CustomerCurrencySymbol);


            if (localStorage.getItem('Location') == this.CustomerLocation) {

              if (response.responseData[0].PartVatTaxPercentage != null) {
                formGroup.controls['ItemTaxPercent'].patchValue(response.responseData[0].PartVatTaxPercentage);
              } else {
                formGroup.controls['ItemTaxPercent'].patchValue(response.responseData[0].PartVatTaxPercentage);
              }

            } else {
              formGroup.controls['ItemTaxPercent'].patchValue('0');
            }
            this.calculatePrice(i)
          }
        } else {
          this.ExchangeRate = '1'
          formGroup.controls['PartDescription'].patchValue(this.getReplace(response.responseData[0].Description));
          formGroup.controls['PartNo1'].patchValue(response.responseData[0].PartNo);
          formGroup.controls['PartNo'].patchValue(response.responseData[0].PartNo);
          formGroup.controls['PartId'].patchValue(response.responseData[0].PartId);
          formGroup.controls['Quantity'].patchValue(response.responseData[0].Quantity);
          formGroup.controls['Rate'].patchValue(response.responseData[0].Price);
          formGroup.controls['ItemLocalCurrencyCode'].patchValue(this.CustomerCurrencyCode);
          formGroup.controls['ItemExchangeRate'].patchValue(this.ExchangeRate);
          formGroup.controls['ItemBaseCurrencyCode'].patchValue(localStorage.getItem('BaseCurrencyCode'));
          formGroup.controls['SerialNo'].patchValue('');
          formGroup.controls['ItemLocalCurrencySymbol'].patchValue(this.viewResult.BasicInfo[0].CustomerCurrencySymbol);

          if (localStorage.getItem('Location') == this.CustomerLocation) {

            if (response.responseData[0].PartVatTaxPercentage != null) {
              formGroup.controls['ItemTaxPercent'].patchValue(response.responseData[0].PartVatTaxPercentage);
            } else {
              formGroup.controls['ItemTaxPercent'].patchValue(this.CustomerVatTax);
            }

          } else {
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
  // selectEvent(item, index) {
  //   var error = false;
  //   const formGroup = this.QuoteItemList.controls[index] as FormGroup;

  //   //get form array reference
  //   const parts = this.EditForm.get('QuoteItemList') as FormArray;
  //   // empty form array
  //   for (var i = 0; i < parts.length; i++) {
  //     if (item.PartNo == this.QuoteItemList.controls[i].get('PartNo').value) {
  //       Swal.fire({
  //         title: 'Error!',
  //         text: 'The Part # '+ item.PartNo + ' is already available!',
  //         type: 'warning',
  //         confirmButtonClass: 'btn btn-confirm mt-2'
  //       });
  //       error = true;
  //       formGroup.controls['PartNo'].setValue('');
  //       formGroup.controls['PartId'].setValue('');
  //       formGroup.controls['PartDescription'].setValue('');
  //       formGroup.controls['PartNo1'].setValue('');
  //       continue; 
  //     }
  //   }

  //   if (error == false) {
  //     formGroup.controls['PartDescription'].patchValue(item.PartDescription);
  //     formGroup.controls['PartNo'].patchValue(item.PartNo);
  //     formGroup.controls['PartId'].patchValue(item.PartId);

  //     this.LPPList = [];

  //     var postData = { PartId: item.PartId, CustomerId: this.CustomerId };
  //     this.commonService.postHttpService(postData, 'RRGetPartPrice').subscribe(response => {
  //       for (var i in response.responseData.LPPInfo) {
  //         this.LPPList.push(response.responseData.LPPInfo[i].LPP);
  //       }
  //       formGroup.controls['LPP'].patchValue(this.LPPList.join(', '));
  //       formGroup.controls['PON'].patchValue(response.responseData.PartInfo.PON);
  //     });
  //   }
  // }

  onChangeSearch(val: string, index) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    const formGroup = this.QuoteItemList.controls[index] as FormGroup;
    formGroup.controls['PartNo'].patchValue(val);
    formGroup.controls['PartNo1'].patchValue(val);
    formGroup.controls['PartId'].patchValue('');
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

  }

  onFocused(e) {
    // do something when input is focused
  }

  getViewContent() {
    var postData = {
      RRId: this.RRId,
      QuoteId: this.QuoteId
    }

    this.commonService.postHttpService(postData, "RRCustomerQuoteView").subscribe(response => {
      if (response.status == true) {
        this.viewResult = response.responseData;

        //this.RRId = this.viewResult.BasicInfo[0].RRId;
        //this.QuoteId = this.viewResult.BasicInfo[0].QuoteId;
        //this.QuoteNo = this.viewResult.BasicInfo[0].QuoteNo;

        this.RouteCause = this.viewResult.BasicInfo[0].RouteCause;
        this.SubTotal = this.viewResult.BasicInfo[0].TotalValue.toFixed(2);
        this.AdditionalCharge = this.viewResult.BasicInfo[0].ProcessFee;
        this.TotalTax = this.viewResult.BasicInfo[0].TotalTax.toFixed(2);
        this.TaxPercent = this.viewResult.BasicInfo[0].TaxPercent;
        this.Discount = this.viewResult.BasicInfo[0].Discount.toFixed(2);
        this.Shipping = this.viewResult.BasicInfo[0].ShippingFee.toFixed(2);
        this.GrandTotal = this.viewResult.BasicInfo[0].GrandTotal.toFixed(2);

        //this.VendorLeadTime = this.viewResult.BasicInfo[0].LeadTime;
        this.WarrantyPeriod = this.viewResult.BasicInfo[0].WarrantyPeriod;

        this.BaseGrandTotal = this.viewResult.BasicInfo[0].BaseGrandTotal.toFixed(2);
        this.ExchangeRate = this.viewResult.BasicInfo[0].ExchangeRate.toFixed(2);
        this.Symbol = this.viewResult.BasicInfo[0].CurrencySymbol;
        this.CustomerLocation = this.viewResult.BasicInfo[0].CustomerLocation;
        this.CustomerVatTax = this.viewResult.BasicInfo[0].VatTaxPercentage;
        this.CustomerCurrencyCode = this.viewResult.BasicInfo[0].CustomerCurrencyCode;
        this.CreatedByLocation = this.viewResult.BasicInfo[0].RRCreatedByLocation;
        this.CreatedByLocationName = this.viewResult.BasicInfo[0].RRCreatedByLocationName;
        if (this.CustomerCurrencyCode == localStorage.getItem("BaseCurrencyCode")) {
          this.ExchangeRate = 1
        }
        if (this.viewResult.QuoteItem.length > 0) {
          var PON; var LPP;

          //get form array reference
          const parts = this.EditForm.get('QuoteItemList') as FormArray;
          // empty form array
          while (parts.length) {
            parts.removeAt(0);
          }
          
          for (let val of this.viewResult.QuoteItem) {
            this.LPPList = [];
            PON = ''; LPP = '';

            if (val.PartId != 0) {

              var postData = { PartId: val.PartId, CustomerId: this.CustomerId };
              this.commonService.postHttpService(postData, 'RRGetPartPrice').subscribe(response => {
                if (response.status == true) {
                  if (response.responseData.LPPInfo.length > 0) {
                    for (var i in response.responseData.LPPInfo) {
                      this.LPPList.push(response.responseData.LPPInfo[i].LPP);
                    }
                    LPP = this.LPPList.join(', ');
                  } else {
                    LPP = '';
                  }
                  PON = response.responseData.PartInfo.PON || '';
                  
                  this.QuoteItemList.push(this.fb.group({
                    "PartNo1": val.PartNo,
                    "PartNo": val.PartNo,
                    "PartDescription": this.getReplace(val.PartDescription),
                    "LeadTime": val.LeadTime,
                    "Quantity": val.Quantity,
                    "Rate": val.Rate.toFixed(2),
                    "Price": val.Price.toFixed(2),
                    "PartId": val.PartId,
                    "QuoteItemId": val.QuoteItemId,
                    "VendorUnitPrice": val.VendorUnitPrice.toFixed(2),
                    "SerialNo": val.SerialNo,
                    //"IsIncludeInQuote": val.IsIncludeInQuote,
                    //"RRVendorPartsId": val.RRVendorPartsId,
                    "PON": PON,
                    "LPP": LPP,
                    "Tax": val.Tax.toFixed(2),
                    "ItemTaxPercent": val.ItemTaxPercent,
                    "BasePrice": val.BasePrice.toFixed(2),
                    "ItemLocalCurrencyCode": val.ItemLocalCurrencyCode,
                    "ItemExchangeRate": val.ItemExchangeRate,
                    "ItemBaseCurrencyCode": val.ItemBaseCurrencyCode,
                    "ItemLocalCurrencySymbol": val.ItemLocalCurrencySymbol,
                    "BaseRate": val.BaseRate.toFixed(2),
                    "BaseTax": val.BaseTax.toFixed(2)
                  }));
                }
              });
            } else {
              this.QuoteItemList.push(this.fb.group({
                "PartNo1": val.PartNo,
                "PartNo": val.PartNo,
                "PartDescription": this.getReplace(val.Description),
                "LeadTime": val.LeadTime,
                "Quantity": val.Quantity,
                "Rate": val.Rate.toFixed(2),
                "Price": val.Price.toFixed(2),
                "PartId": val.PartId,
                "QuoteItemId": val.QuoteItemId,
                "VendorUnitPrice": val.VendorUnitPrice.toFixed(2),
                "SerialNo": val.SerialNo,
                //"IsIncludeInQuote": val.IsIncludeInQuote,
                //"RRVendorPartsId": val.RRVendorPartsId,
                "PON": '',
                "LPP": '',
                "Tax": val.Tax.toFixed(2),
                "ItemTaxPercent": val.ItemTaxPercent,
                "BasePrice": val.BasePrice.toFixed(2),
                "ItemLocalCurrencyCode": val.ItemLocalCurrencyCode,
                "ItemExchangeRate": val.ItemExchangeRate,
                "ItemBaseCurrencyCode": val.ItemBaseCurrencyCode,
                "ItemLocalCurrencySymbol": val.ItemLocalCurrencySymbol,
                "BaseRate": val.BaseRate.toFixed(2),
                "BaseTax": val.BaseTax.toFixed(2)
              }));
            }
          }
        }
        
        /* if (this.viewResult.QuoteItem.length > 0) {
          for (let val of this.viewResult.QuoteItem) {
            this.QuoteItem.push(
              {
                "PartNo1": val.PartNo,
                "PartNo": val.PartNo,
                "PartDescription": val.PartDescription,
                "LeadTime": val.LeadTime,
                "Quantity": val.Quantity,
                "Rate": val.Rate,
                "Price": val.Price,
                "QuoteItemId": val.QuoteItemId,
                //"IsIncludeInQuote": val.IsIncludeInQuote,
                "PartId": val.PartId,
                "PON": '',
                "LPP": ''
              }
            );
          }
        } 

        // get form array reference
        const parts = this.EditForm.get('QuoteItemList') as FormArray;
        // empty form array
        while (parts.length) {
          parts.removeAt(0);
        }
        // use patchValue instead of setValue
        this.EditForm.patchValue(this.QuoteItem);
        // add form array values in a loop
        this.QuoteItem.forEach(item => this.QuoteItemList.push(this.fb.group(item)));*/

        this.EditForm.patchValue({
          //RRId: this.viewResult.BasicInfo[0].RRId,
          // QuoteId: this.viewResult.BasicInfo[0].QuoteId, 
          RouteCause: this.viewResult.BasicInfo[0].RouteCause,
          SubTotal: this.viewResult.BasicInfo[0].TotalValue,
          AdditionalCharge: this.viewResult.BasicInfo[0].ProcessFee,
          TotalTax: this.viewResult.BasicInfo[0].TotalTax,
          TaxPercent: this.viewResult.BasicInfo[0].TaxPercent,
          Discount: this.viewResult.BasicInfo[0].Discount,
          Shipping: this.viewResult.BasicInfo[0].ShippingFee,
          GrandTotal: this.viewResult.BasicInfo[0].GrandTotal,
          //VendorLeadTime: this.viewResult.BasicInfo[0].LeadTime,
          WarrantyPeriod: this.viewResult.BasicInfo[0].WarrantyPeriod,
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
    let VatTax = formGroup.controls['ItemTaxPercent'].value / 100;
    let VatTaxPrice = Rate * VatTax
    // Calculate the price
    price = parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice);
    Tax = Rate * VatTax;
    formGroup.controls['Price'].patchValue(price.toFixed(2));
    formGroup.controls['Tax'].patchValue(Tax.toFixed(2))
    var TaxLocal = (Rate * VatTax)
    let priceUSD = price * this.ExchangeRate
    formGroup.controls['BasePrice'].patchValue(priceUSD.toFixed(2))
    let RateUSD = Rate * this.ExchangeRate
    formGroup.controls['BaseRate'].patchValue(RateUSD.toFixed(2))
    let BaseTaxUSD = TaxLocal * this.ExchangeRate
    formGroup.controls['BaseTax'].patchValue(BaseTaxUSD.toFixed(2))
    // Calculate the subtotal
    for (let i = 0; i < this.QuoteItemList.length; i++) {
      //if (this.QuoteItemList.controls[i].get('IsIncludeInQuote').value == 1) {
      subTotal += parseFloat(this.QuoteItemList.controls[i].get('Price').value);
      //}
    }
    this.SubTotal = subTotal;
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
    this.BaseGrandTotal = (this.GrandTotal * this.ExchangeRate).toFixed(2)

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
    if (this.CreatedByLocation == this.Location) {

      this.submitted = true; this.getFormValidationErrors();
      let partNotFound = false;
      if (this.EditForm.valid) {
        this.btnDisabled = true;
        this.QuoteItemList.controls.forEach((control, i) => {
          if (!this.partList.some(a => a.PartNo == control.get('PartNo').value)) {
            partNotFound = true;
          }

        })
        this.QuoteItemList.controls.forEach((control, i) => {
          if (control.get('ItemLocalCurrencySymbol').value != this.viewResult.BasicInfo[0].CustomerCurrencySymbol) {
            this.isCurrencyMode = true
          }
        })

        if (partNotFound) {
          Swal.fire({
            title: 'Error!',
            text: 'Some seleted parts are not found!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          return;
        }
        if (!this.isCurrencyMode) {
          var postData = {

            "LocalCurrencyCode": this.CustomerCurrencyCode,
            "ExchangeRate": this.ExchangeRate,
            "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode'),
            "BaseGrandTotal": this.BaseGrandTotal,

            "RRId": this.RRId,
            "QuoteId": this.QuoteId,
            "RouteCause": this.EditForm.value.RouteCause, //RootCause
            "TotalValue": this.EditForm.value.SubTotal,
            "ProcessFee": this.EditForm.value.AdditionalCharge,
            "TotalTax": this.EditForm.value.TotalTax,
            "TaxPercent": this.EditForm.value.TaxPercent,
            "Discount": this.EditForm.value.Discount,
            "ShippingFee": this.EditForm.value.Shipping,
            "GrandTotal": this.EditForm.value.GrandTotal,
            "WarrantyPeriod": this.EditForm.value.WarrantyPeriod,
            //"LeadTime": this.EditForm.value.VendorLeadTime,

            "QuoteItem": this.EditForm.value.QuoteItemList,
          }
          this.commonService.putHttpService(postData, "RRCustomerQuoteEdit").subscribe(response => {
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
        } else {
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
    } else {
      Swal.fire({
        type: 'info',
        title: 'AH Country Mismatch',
        html: '<b style=" font-size: 14px !important;">' + (`Customer Quote Added from  : <span class="badge badge-primary btn-xs">${this.CreatedByLocationName}</span> country . Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }
  }
  onSubmitQuote() {
    if (this.CreatedByLocation == this.Location) {
      this.submitted = true;
      let partNotFound = false;
      this.getFormValidationErrors();
      if (this.EditForm.valid) {
        this.btnDisabled = true;
        this.QuoteItemList.controls.forEach((control, i) => {
          if (!this.partList.some(a => a.PartNo == control.get('PartNo').value)) {
            partNotFound = true;
          }
        })
        this.QuoteItemList.controls.forEach((control, i) => {
          if (control.get('ItemLocalCurrencySymbol').value != this.viewResult.BasicInfo[0].CustomerCurrencySymbol) {
            this.isCurrencyMode = true
          }
        })

        if (partNotFound) {
          Swal.fire({
            title: 'Error!',
            text: 'Some seleted parts are not found!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          return;
        }
        if (!this.isCurrencyMode) {
          var postData = {
            "LocalCurrencyCode": this.CustomerCurrencyCode,
            "ExchangeRate": this.ExchangeRate,
            "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode'),
            "BaseGrandTotal": this.BaseGrandTotal,

            "RRId": this.RRId,
            "QuoteId": this.QuoteId,
            "RouteCause": this.EditForm.value.RouteCause, //RootCause
            "TotalValue": this.EditForm.value.SubTotal,
            "ProcessFee": this.EditForm.value.AdditionalCharge,
            "TotalTax": this.EditForm.value.TotalTax,
            "TaxPercent": this.EditForm.value.TaxPercent,
            "Discount": this.EditForm.value.Discount,
            "ShippingFee": this.EditForm.value.Shipping,
            "GrandTotal": this.EditForm.value.GrandTotal,
            "WarrantyPeriod": this.EditForm.value.WarrantyPeriod,
            //"LeadTime": this.EditForm.value.VendorLeadTime,

            "QuoteItem": this.EditForm.value.QuoteItemList,
          }
          this.commonService.postHttpService(postData, "SaveAndSubmitToCustomer").subscribe(response => {
            if (response.status == true) {
              this.triggerEvent(response.responseData);
              this.modalRef.hide();

              Swal.fire({
                title: 'Submitted!',
                text: 'Quote for Customer has been submitted.',
                type: 'success'
              });
            }else{
              Swal.fire({
                title: 'Error',
                text: response.message,
                type: 'warning'
              });
            }
            this.cd_ref.detectChanges();
          }, error => console.log(error));
        } else {
          Swal.fire({
            type: 'info',
            title: 'Customer Country Mismatch',
            text: `Customer Currency Code is Changed. Please contact admin to create a submit to Customer quote`,
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
    } else {
      Swal.fire({
        type: 'info',
        title: 'AH Country Mismatch',
        html: '<b style=" font-size: 14px !important;">' + (`Customer Quote Added from  : <span class="badge badge-primary btn-xs">${this.CreatedByLocationName}</span> country . Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }

  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  //Add another Part 
  public initPart(): FormGroup {
    return this.fb.group({
      PartNo1: ['', Validators.required],
      PartNo: ['', Validators.required],
      PartDescription: [''],
      LeadTime: [''],
      Quantity: [1],
      Rate: [''],
      Price: [''],
      SerialNo: [''],
      VendorUnitPrice: [''],
      //IsIncludeInQuote: [1],
      PartId: [0],
      QuoteItemId: [0],
      PON: [''],
      LPP: [''],
      Tax: '',
      ItemTaxPercent: '',
      BasePrice: '',
      ItemLocalCurrencyCode: '',
      ItemExchangeRate: '',
      ItemBaseCurrencyCode: '',
      ItemLocalCurrencySymbol: this.viewResult.BasicInfo[0].CustomerCurrencySymbol,
      BaseRate: '',
      BaseTax: ''
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
          PartDescription: "",
          PartNo1: ""
        })
        // this.VendorPartsList.setErrors({ 'partNotFound': true });
      }
    })
  }
  getReplace(val) {
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

  }
}