import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, FormArray, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title, VAT_field_Name, warranty_list } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';

export interface Part {
  PartNo1: string,
  PartNo: string,
  Description: string,
  LeadTime: string,
  Quantity: string,
  Rate: string,
  Price: string,
  IsIncludeInQuote: boolean,
  PartId: string,
  RRVendorPartsId: string,
  PON: string,
  LPP: string
}
export interface PartData {
  VendorPartsList: Part[];
}

@Component({
  selector: 'app-vendor-quote',
  templateUrl: './vendor-quote.component.html',
  styleUrls: ['./vendor-quote.component.scss']
})
export class VendorQuoteComponent implements OnInit, AfterViewInit {
  //@ViewChild('auto', { static: true }) auto;
  RRVendorId;
  RRId;
  PartId; Status;
  EditForm: FormGroup;
  public event: EventEmitter<any> = new EventEmitter();
  warrantyList: any;
  viewResult: any;
  VendorPartsInfo: any = [];
  VendorsInfo: any = [];
  LPPList: any = []; LPP; PON;
  errorStatus = 0;

  RRPartNo: any;
  RRDescription: any;
  RRSerialNo: any;
  RRQuantity: any;
  RRRate: any;
  RRPrice: any;
  btnDisabled: boolean = false;
  WarrantyPeriod: any;
  SubTotal = 0;
  AdditionalCharge = 0;
  TotalTax = 0;
  TaxPercent = 0;
  Discount = 0;
  GrandTotal = 0;
  Shipping = 0;
  VendorId: any;
  RouteCause: any;
  VendorName: any;
  VendorCode: any;
  //VendorLeadTime: any;
  VendorStatus;
  submitted = false;
  RRLeadTime;
  VendorRefAttachment;
  imageresult;;
  fileData;
  LeadTime;
  CustomerShipToId; CustomerBillToId; CustomerId; keyword; partList: any = []; partNewList: any = [];
  VendorTypeName
  Directed
  select_title

  VAT_field_Name
  IsDisplayBaseCurrencyValue
  Symbol
  VendorLocation
  VendorVatTax
  ExchangeRate
  VendorCurrencyCode
  BaseGrandTotal
  IsRMARequired
  IsFlatRateRepair
  BaseCurrencySymbol
  isCurrencyMode: boolean = false
  CreatedByLocation
  LocationName
  Location
  CreatedByLocationName
  IsWarrantyRecovery
  IsWarrantyRecoveryvalidation: boolean = false
  showpopalert: boolean = false
  IsWarrantyDenied;
  displayBasePrice: any[] = [];
  displayPrice: any[] = [];
  RRPartInfoPartId: any;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,
    private elem: ElementRef) { }

  ngOnInit(): void {

    this.VAT_field_Name = VAT_field_Name
    this.IsDisplayBaseCurrencyValue = localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol")

    this.RRVendorId = this.data.RRVendorId;
    this.VendorId = this.data.VendorId;
    this.RRId = this.data.RRId;
    this.PartId = this.data.PartId;
    this.VendorStatus = this.data.VendorStatus;
    this.Status = this.data.Status;
    this.CustomerId = this.data.CustomerId;
    this.CustomerShipToId = this.data.CustomerShipToId;
    this.CustomerBillToId = this.data.CustomerBillToId;

    this.VendorTypeName = this.data.VendorTypeName;
    this.Directed = this.data.Directed;
    this.IsRMARequired = this.data.IsRMARequired;
    this.IsFlatRateRepair = this.data.IsFlatRateRepair

    this.LocationName = localStorage.getItem("LocationName");
    this.Location = localStorage.getItem("Location");
    this.RRPartInfoPartId = this.data.RRPartInfoPartId;
    this.getViewContent();

    this.warrantyList = warranty_list;

    this.getPartList();

    this.keyword = 'PartNo';
    this.IsWarrantyRecovery = this.data.IsWarrantyRecovery
    this.IsWarrantyDenied = this.data.IsWarrantyDenied

    this.EditForm = this.fb.group({
      RouteCause: [''],
      VendorRefAttachment: [''],
      //VendorLeadTime: [''],
      WarrantyPeriod: [''],
      AdditionalCharge: [''],
      Shipping: [''],
      SubTotal: [''],
      TotalTax: [''],
      TaxPercent: [''],
      Discount: [''],
      GrandTotal: [''],

      VendorPartsList: this.fb.array([
        this.fb.group({
          PartNo1: ['', Validators.required],
          PartNo: ['', Validators.required],
          Description: [''],
          LeadTime: [''],
          Quantity: 1,
          Rate: [''],
          Price: [''],
          PartId: [0],
          RRVendorPartsId: [''],
          IsIncludeInQuote: 1,
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
      //this.partNewList.push({ "PartId": 0, "PartNo": '+ Add New', "PartColor": 'green' });
      for (var i in response.responseData) {
        this.partNewList.push({
          "PartId": response.responseData[i].PartId,
          "PartNo": response.responseData[i].PartNo,
          "Description": this.getReplace(response.responseData[i].Description)
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
      //this.RecommendedPrice = response.responseData[0].RecommendedPrice.RecommendedPrice;
    });
  }

  clearEvent(item, index) { //alert('clear')
    const formGroup = this.VendorPartsList.controls[index] as FormGroup;
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
    formGroup.controls['BaseRate'].setValue('');
    formGroup.controls['BaseTax'].setValue('');

  }

  closeEvent(item, index) {
    //alert('close')
  }

  selectEvent(item, i) {
    var error = false;
    const formGroup = this.VendorPartsList.controls[i] as FormGroup;

    //get form array reference
    const parts = this.EditForm.get('VendorPartsList') as FormArray;

    var postData = { PartId: item.PartId, "VendorId": this.VendorId };
    this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {
      for (var i = 0; i < parts.length; i++) {
        if (item.PartNo == this.VendorPartsList.controls[i].get('PartNo').value) {
          this.errorStatus = 2;
          Swal.fire({
            title: 'Error!',
            text: 'The Part # ' + item.PartNo + ' is already available!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          error = true;
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
          continue;
        }
      }
      if (error == false) {
        this.errorStatus = 0;
        this.ExchangeRate = response.responseData[0].ExchangeRate
        if (this.VendorCurrencyCode != localStorage.getItem('BaseCurrencyCode')) {
          if (this.ExchangeRate == null) {
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
          } else {
            formGroup.controls['Description'].patchValue(this.getReplace(response.responseData[0].Description));
            formGroup.controls['PartNo'].patchValue(response.responseData[0].PartNo);
            formGroup.controls['PartId'].patchValue(response.responseData[0].PartId);
            formGroup.controls['Quantity'].patchValue(response.responseData[0].Quantity);
            formGroup.controls['Rate'].patchValue(response.responseData[0].Price);
            formGroup.controls['ItemLocalCurrencyCode'].patchValue(this.VendorCurrencyCode);
            formGroup.controls['ItemExchangeRate'].patchValue(this.ExchangeRate);
            formGroup.controls['ItemBaseCurrencyCode'].patchValue(localStorage.getItem('BaseCurrencyCode'));
            formGroup.controls['ItemLocalCurrencySymbol'].patchValue(this.viewResult.VendorsInfo[0].VendorCurrencySymbol);


            if (localStorage.getItem('Location') == this.VendorLocation) {

              if (response.responseData[0].PartVatTaxPercentage != null) {
                formGroup.controls['ItemTaxPercent'].patchValue(response.responseData[0].PartVatTaxPercentage);
              } else {
                formGroup.controls['ItemTaxPercent'].patchValue(this.VendorVatTax);
              }

            } else {
              formGroup.controls['ItemTaxPercent'].patchValue('0');
            }
            this.calculatePrice(i)
          }
        } else {
          this.ExchangeRate = '1'
          formGroup.controls['Description'].patchValue(this.getReplace(response.responseData[0].Description),);
          formGroup.controls['PartNo'].patchValue(response.responseData[0].PartNo);
          formGroup.controls['PartId'].patchValue(response.responseData[0].PartId);
          formGroup.controls['Quantity'].patchValue(response.responseData[0].Quantity);
          formGroup.controls['Rate'].patchValue(response.responseData[0].Price);
          formGroup.controls['ItemLocalCurrencyCode'].patchValue(this.VendorCurrencyCode);
          formGroup.controls['ItemExchangeRate'].patchValue(this.ExchangeRate);
          formGroup.controls['ItemBaseCurrencyCode'].patchValue(localStorage.getItem('BaseCurrencyCode'));
          formGroup.controls['ItemLocalCurrencySymbol'].patchValue(this.viewResult.VendorsInfo[0].VendorCurrencySymbol);

          if (localStorage.getItem('Location') == this.VendorLocation) {

            if (response.responseData[0].PartVatTaxPercentage != null) {
              formGroup.controls['ItemTaxPercent'].patchValue(response.responseData[0].PartVatTaxPercentage);
            } else {
              formGroup.controls['ItemTaxPercent'].patchValue(this.VendorVatTax);
            }

          } else {
            formGroup.controls['ItemTaxPercent'].patchValue('0');
          }
          this.calculatePrice(i)
        }
      }

    });


    this.LPPList = [];

    var postData1 = { PartId: item.PartId, CustomerId: this.CustomerId };
    this.commonService.postHttpService(postData1, 'RRGetPartPrice').subscribe(response => {
      for (var i in response.responseData.LPPInfo) {
        this.LPPList.push(response.responseData.LPPInfo[i].LPP);
      }
      formGroup.controls['LPP'].patchValue(this.LPPList.join(', '));
      formGroup.controls['PON'].patchValue(response.responseData.PartInfo.PON);
    });
  }
  // selectEvent(item, index) {
  //   var error = false;
  //   const formGroup = this.VendorPartsList.controls[index] as FormGroup;

  //   //get form array reference
  //   const parts = this.EditForm.get('VendorPartsList') as FormArray;
  //   // empty form array


  //   if (error == false) {
  //     this.errorStatus = 0;
  //     formGroup.controls['Description'].patchValue(item.Description);
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
    const formGroup = this.VendorPartsList.controls[index] as FormGroup;
    formGroup.controls['PartNo'].patchValue(val);
    formGroup.controls['PartId'].patchValue('');
    formGroup.controls['PartNo1'].patchValue(val);
    formGroup.controls['Description'].setValue('');
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

  onFocused(e) {
    // do something when input is focused
  }

  getViewContent() {
    var postData = {
      RRId: this.RRId,
      PartId: this.PartId,
      RRVendorId: this.RRVendorId,
      VendorId: this.VendorId
    }

    this.commonService.postHttpService(postData, "RRVendorQuote").subscribe(response => {
      if (response.status == true) {
        this.viewResult = response.responseData;

        this.RRVendorId = this.viewResult.VendorsInfo[0].RRVendorId;
        this.RouteCause = this.viewResult.VendorsInfo[0].RouteCause;
        this.SubTotal = this.viewResult.VendorsInfo[0].SubTotal;
        this.AdditionalCharge = this.viewResult.VendorsInfo[0].AdditionalCharge;
        this.TotalTax = this.viewResult.VendorsInfo[0].TotalTax;
        this.TaxPercent = this.viewResult.VendorsInfo[0].TaxPercent;
        this.Discount = this.viewResult.VendorsInfo[0].Discount;
        this.Shipping = this.viewResult.VendorsInfo[0].Shipping;
        this.GrandTotal = this.viewResult.VendorsInfo[0].GrandTotal;
        this.VendorName = this.viewResult.VendorsInfo[0].VendorName;
        this.VendorCode = this.viewResult.VendorsInfo[0].VendorCode;
        this.VendorStatus = this.viewResult.VendorsInfo[0].Status;
        this.VendorRefAttachment = this.viewResult.VendorsInfo[0].VendorRefAttachment;


        this.BaseGrandTotal = this.viewResult.VendorsInfo[0].BaseGrandTotal;
        this.ExchangeRate = this.viewResult.VendorsInfo[0].ExchangeRate
        this.Symbol = this.viewResult.VendorsInfo[0].CurrencySymbol
        this.VendorLocation = this.viewResult.VendorsInfo[0].VendorLocation
        this.VendorVatTax = this.viewResult.VendorsInfo[0].VatTaxPercentage
        this.VendorCurrencyCode = this.viewResult.VendorsInfo[0].VendorCurrencyCode
        this.CreatedByLocation = this.viewResult.VendorsInfo[0].CreatedByLocation
        this.CreatedByLocationName = this.viewResult.VendorsInfo[0].CreatedByLocationName
        if (this.VendorCurrencyCode == localStorage.getItem("BaseCurrencyCode")) {
          this.ExchangeRate = 1
        }

        if (this.viewResult.VendorPartsInfo.length > 0) {
          var PON; var LPP;

          //get form array reference
          const parts = this.EditForm.get('VendorPartsList') as FormArray;
          // empty form array
          while (parts.length) {
            parts.removeAt(0);
          }

          for (let val of this.viewResult.VendorPartsInfo) {
            this.LPPList = [];
            PON = ''; LPP = '';

            if (val.PartId != 0) {
              // empty form array
              /* while (this.LPPList.length) {
                this.LPPList.removeAt(0);
              } */

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
                  this.VendorPartsList.push(this.fb.group({
                    "PartNo1": val.PartNo,
                    "PartNo": val.PartNo,
                    "Description": this.getReplace(val.Description),
                    "LeadTime": val.LeadTime,
                    "Quantity": val.Quantity,
                    "Rate": val.Rate,
                    "Price": val.Price,
                    "IsIncludeInQuote": val.IsIncludeInQuote,
                    "PartId": val.PartId,
                    "RRVendorPartsId": val.RRVendorPartsId,
                    "PON": PON,
                    "LPP": LPP,
                    "Tax": val.Tax,
                    "ItemTaxPercent": val.ItemTaxPercent,
                    "BasePrice": val.BasePrice,
                    "ItemLocalCurrencyCode": val.ItemLocalCurrencyCode,
                    "ItemExchangeRate": val.ItemExchangeRate,
                    "ItemBaseCurrencyCode": val.ItemBaseCurrencyCode,
                    "ItemLocalCurrencySymbol": val.ItemLocalCurrencySymbol,
                    "BaseRate": val.BaseRate,
                    "BaseTax": val.BaseTax
                  }));
                }
              });
            } else {
              this.VendorPartsList.push(this.fb.group({
                "PartNo1": val.PartNo,
                "PartNo": val.PartNo,
                "Description": this.getReplace(val.Description),
                "LeadTime": val.LeadTime,
                "Quantity": val.Quantity,
                "Rate": val.Rate,
                "Price": val.Price,
                "IsIncludeInQuote": val.IsIncludeInQuote,
                "PartId": val.PartId,
                "RRVendorPartsId": val.RRVendorPartsId,
                "PON": '',
                "LPP": '',
                "Tax": val.Tax,
                "ItemTaxPercent": val.ItemTaxPercent,
                "BasePrice": val.BasePrice,
                "ItemLocalCurrencyCode": val.ItemLocalCurrencyCode,
                "ItemExchangeRate": val.ItemExchangeRate,
                "ItemBaseCurrencyCode": val.ItemBaseCurrencyCode,
                "ItemLocalCurrencySymbol": val.ItemLocalCurrencySymbol,
                "BaseRate": val.BaseRate,
                "BaseTax": val.BaseTax
              }));
            }
          }
        }
        
        // get form array reference
        /*  const parts = this.EditForm.get('VendorPartsList') as FormArray;
         // empty form array
         while (parts.length) {
           parts.removeAt(0);
         }
         // use patchValue instead of setValue
         this.EditForm.patchValue(this.VendorPartsInfo); 
         // add form array values in a loop
         this.VendorPartsInfo.forEach(item => this.VendorPartsList.push(this.fb.group(item))); */
        //this.VendorPartsInfo.forEach(item => console.log(item));


        this.RRPartNo = this.viewResult.PartInfo[0].PartNo; // Fix error
        this.RRDescription = this.getReplace(this.viewResult.PartInfo[0].Description);
        this.RRSerialNo = this.viewResult.PartInfo[0].SerialNo;
        this.RRQuantity = this.viewResult.PartInfo[0].Quantity;
        this.RRRate = this.viewResult.PartInfo[0].Rate;
        this.RRLeadTime = this.viewResult.PartInfo[0].LeadTime;
        this.RRPrice = this.viewResult.PartInfo[0].Price;

        //this.VendorLeadTime = this.viewResult.VendorsInfo[0].LeadTime;
        this.WarrantyPeriod = this.viewResult.VendorsInfo[0].WarrantyPeriod;

        this.EditForm.patchValue({
          RouteCause: this.viewResult.VendorsInfo[0].RouteCause,
          VendorRefAttachment: this.viewResult.VendorsInfo[0].VendorRefAttachment,
          AdditionalCharge: this.viewResult.VendorsInfo[0].AdditionalCharge,
          Shipping: this.viewResult.VendorsInfo[0].Shipping,
          SubTotal: this.viewResult.VendorsInfo[0].SubTotal,
          TotalTax: this.viewResult.VendorsInfo[0].TotalTax,
          TaxPercent: this.viewResult.VendorsInfo[0].TaxPercent,
          Discount: this.viewResult.VendorsInfo[0].Discount,
          GrandTotal: this.viewResult.VendorsInfo[0].GrandTotal,
          //VendorLeadTime: this.viewResult.VendorsInfo[0].LeadTime,
          WarrantyPeriod: this.viewResult.VendorsInfo[0].WarrantyPeriod,
        });
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
    const formGroup = this.VendorPartsList.controls[index] as FormGroup;
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
    let BaseRateUSD = TaxLocal * this.ExchangeRate
    formGroup.controls['BaseTax'].patchValue(BaseRateUSD.toFixed(2));
    this.displayPrice[index] = price.toFixed(2);
    this.displayBasePrice[index] = priceUSD.toFixed(2);
    // Calculate the subtotal
    for (let i = 0; i < this.VendorPartsList.length; i++) {
      if (this.VendorPartsList.controls[i].get('IsIncludeInQuote').value == 1) {
        subTotal += parseFloat(this.VendorPartsList.controls[i].get('Price').value);
      }
    }
    this.EditForm.patchValue({ SubTotal: subTotal });
    this.SubTotal = subTotal;
    //this.EditForm.patchValue({ TotalTax: (this.SubTotal * this.TaxPercent / 100).toFixed(2) });
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
    for (let i = 0; i < this.VendorPartsList.length; i++) {
      if (this.VendorPartsList.controls[i].get('IsIncludeInQuote').value == 1) {
        subTotal += parseFloat(this.VendorPartsList.controls[i].get('Price').value);
      }
    }
    this.EditForm.patchValue({ SubTotal: subTotal });
    this.SubTotal = subTotal;
    //this.EditForm.patchValue({ TotalTax: (this.SubTotal * this.TaxPercent / 100).toFixed(2) });
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

      this.submitted = true;
      this.getFormValidationErrors();
      this.EditForm.markAllAsTouched();
      let partNotFound = false;
      if (this.EditForm.valid) {
        if(!this.IsWarrantyDenied){
        if(this.IsWarrantyRecovery=="2" || this.IsWarrantyRecovery=="1"){
          this.VendorPartsList.controls.forEach((control, i) => {
            if (control.get('Rate').value!=0) {
              this.IsWarrantyRecoveryvalidation = true
              Swal.fire({
                title: 'Warranty Error!',
                text: `You have selected the Warranty Selection as Warranty New. The quote amount should be ${control.get('ItemLocalCurrencySymbol').value} 0. If you want to add the quote amount, Please change the Warranty selection and save the RR.`,
                type: 'warning',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
              return; 
            }
          })
         }else{
          this.VendorPartsList.controls.forEach((control, i) => {
            if (control.get('Rate').value==0) {
              this.showpopalert = true
              Swal.fire({
                title: `Warning! Quote amount is ${control.get('ItemLocalCurrencySymbol').value} 0!`,
                text: `You have not selected the Warranty Recovery as Warranty New or Warranty Repair in RR.Do you still want to proceed with ${control.get('ItemLocalCurrencySymbol').value} 0 amount?`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, create it!',
                cancelButtonText: 'No, cancel!',
                confirmButtonClass: 'btn btn-success mt-2',
                cancelButtonClass: 'btn btn-danger ml-2 mt-2',
                buttonsStyling: false
              }).then((result) => {
                this.EditForm.value.VendorPartsList.map((item: any) => {
                  item.Rate = Number(item.Rate)
                  item.BaseRate = Number(item.BaseRate),
                    item.BaseTax = Number(item.BaseTax)
                  item.BasePrice = Number(item.BasePrice)
                })
                if (result.value) {
                  var postData = {

                    "LocalCurrencyCode": this.VendorCurrencyCode,
                    "ExchangeRate": this.ExchangeRate,
                    "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode'),
                    "BaseGrandTotal": this.BaseGrandTotal,
        
                    "RRId": this.RRId,
                    "CustomerBillToId": this.CustomerBillToId,
                    "CustomerShipToId": this.CustomerShipToId,
                    "VendorPartsList": this.EditForm.value.VendorPartsList,
                    "VendorsList": {
                      "RRVendorId": this.RRVendorId,
                      "RouteCause": this.EditForm.value.RouteCause,
                      "VendorRefAttachment": this.EditForm.value.VendorRefAttachment,
                      //"LeadTime": this.EditForm.value.VendorLeadTime,
                      "WarrantyPeriod": this.EditForm.value.WarrantyPeriod,
                      "SubTotal": this.EditForm.value.SubTotal,
                      "AdditionalCharge": this.EditForm.value.AdditionalCharge || 0,
                      "TotalTax": this.EditForm.value.TotalTax,
                      "TaxPercent": this.EditForm.value.TaxPercent,
                      "Discount": this.EditForm.value.Discount || 0,
                      "Shipping": this.EditForm.value.Shipping || 0,
                      "GrandTotal": this.EditForm.value.GrandTotal,
                    }
                  }
                  this.commonService.putHttpService(postData, "RRVendorQuoteUpdate").subscribe(response => {
                    if (response.status == true) {
                      let from = 'save';
                      this.triggerEvent(from);
                      //this.triggerEvent(response.responseData.VendorsList);
                      this.modalRef.hide();
        
                      Swal.fire({
                        title: 'Success!',
                        text: 'Vendor Quote Updated Successfully!',
                        type: 'success',
                        confirmButtonClass: 'btn btn-confirm mt-2'
                      });
                    } else {
                      Swal.fire({
                        title: 'Error!',
                        text: 'Vendor Quote could not be Updated!',
                        type: 'warning',
                        confirmButtonClass: 'btn btn-confirm mt-2'
                      });
                    }
                    this.cd_ref.detectChanges();
                  }, error => console.log(error));
                } else if (
                  result.dismiss === Swal.DismissReason.cancel
                ) {
                  this.modalRef.hide();
                }
              }); 
            }
          })
         }
        }
         if(!this.IsWarrantyRecoveryvalidation && !this.showpopalert){
        this.VendorPartsList.controls.forEach((control, i) => {
          if (!this.partList.some(a => a.PartNo == control.get('PartNo').value)) {
            partNotFound = true;
          }

        })
        this.errorStatus = 0;
        this.VendorPartsList.controls.forEach((control, i) => {
          if (control.get('ItemLocalCurrencySymbol').value != this.viewResult.VendorsInfo[0].VendorCurrencySymbol) {
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

            "LocalCurrencyCode": this.VendorCurrencyCode,
            "ExchangeRate": this.ExchangeRate,
            "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode'),
            "BaseGrandTotal": this.BaseGrandTotal,

            "RRId": this.RRId,
            "CustomerBillToId": this.CustomerBillToId,
            "CustomerShipToId": this.CustomerShipToId,
            "VendorPartsList": this.EditForm.value.VendorPartsList,
            "VendorsList": {
              "RRVendorId": this.RRVendorId,
              "RouteCause": this.EditForm.value.RouteCause,
              "VendorRefAttachment": this.EditForm.value.VendorRefAttachment,
              //"LeadTime": this.EditForm.value.VendorLeadTime,
              "WarrantyPeriod": this.EditForm.value.WarrantyPeriod,
              "SubTotal": this.EditForm.value.SubTotal,
              "AdditionalCharge": this.EditForm.value.AdditionalCharge || 0,
              "TotalTax": this.EditForm.value.TotalTax,
              "TaxPercent": this.EditForm.value.TaxPercent,
              "Discount": this.EditForm.value.Discount || 0,
              "Shipping": this.EditForm.value.Shipping || 0,
              "GrandTotal": this.EditForm.value.GrandTotal,
            }
          }
          this.commonService.putHttpService(postData, "RRVendorQuoteUpdate").subscribe(response => {
            if (response.status == true) {
              let from = 'save';
              this.triggerEvent(from);
              //this.triggerEvent(response.responseData.VendorsList);
              this.modalRef.hide();

              Swal.fire({
                title: 'Success!',
                text: 'Vendor Quote Updated Successfully!',
                type: 'success',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'Vendor Quote could not be Updated!',
                type: 'warning',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            }
            this.cd_ref.detectChanges();
          }, error => console.log(error));
        } else {
          Swal.fire({
            type: 'info',
            title: 'Vendor Currency Mismatch',
            text: `Vendor Currency Code is Changed. Please contact admin to update a quote`,
            confirmButtonClass: 'btn btn-confirm mt-2',
          });
        }
      }
      } else {
        this.errorStatus = 1;
      }
    } else {
      Swal.fire({
        type: 'info',
        title: 'AH Country Mismatch',
        html: '<b style=" font-size: 14px !important;">' + (`Vendor Quote Added from  : <span class="badge badge-primary btn-xs">${this.CreatedByLocationName}</span> country . Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
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
      Description: [''],
      LeadTime: [''],
      Quantity: [1],
      Rate: [''],
      Price: [''], // Price: ['', Validators.required], Rate: ['', Validators.required],
      IsIncludeInQuote: [1],
      PartId: [0],
      RRVendorPartsId: [0],
      PON: [''],
      LPP: [''],
      Tax: '',
      ItemTaxPercent: '',
      BasePrice: '',
      ItemLocalCurrencyCode: '',
      ItemExchangeRate: '',
      ItemBaseCurrencyCode: '',
      "ItemLocalCurrencySymbol": this.viewResult.VendorsInfo[0].VendorCurrencySymbol,
      BaseRate: '',
      BaseTax: ''

    });
  }

  public addPart(): void {
    const control = <FormArray>this.EditFormControl.VendorPartsList;
    control.push(this.initPart());
  }

  get VendorPartsList(): FormArray {
    return this.EditForm.get('VendorPartsList') as FormArray;
  }

  removePart(i: number) {
    var partId = this.VendorPartsList.controls[i].get('RRVendorPartsId').value;
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
          this.VendorPartsList.removeAt(i);
          this.changeStatus(i);
          var postData = {
            RRVendorPartsId: partId,
          }
          this.commonService.putHttpService(postData, 'RRVendorPartDelete').subscribe(response => {
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
      this.VendorPartsList.removeAt(i);
      this.changeStatus(i);
    }
  }

  CreateCustomerQuote(VendorId, RRVendorId) {
    if (this.CreatedByLocation == this.Location) {

      this.submitted = true;
      let partNotFound = false;
      this.getFormValidationErrors();
      if (this.EditForm.valid) {
        if(!this.IsWarrantyDenied){
        if(this.IsWarrantyRecovery=="2" || this.IsWarrantyRecovery=="1"){
          this.VendorPartsList.controls.forEach((control, i) => {
            if (control.get('Rate').value!=0) {
              this.IsWarrantyRecoveryvalidation = true
              Swal.fire({
                title: 'Warranty Error!',
                text: `You have selected the Warranty Selection as Warranty New. The quote amount should be ${control.get('ItemLocalCurrencySymbol').value} 0. If you want to add the quote amount, Please change the Warranty selection and save the RR.`,
                type: 'warning',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
              return; 
            }
          })
         }else{
          this.VendorPartsList.controls.forEach((control, i) => {
            if (control.get('Rate').value==0) {
              this.showpopalert = true
              Swal.fire({
                title: `Warning! Quote amount is ${control.get('ItemLocalCurrencySymbol').value} 0!`,
                text: `You have not selected the Warranty Recovery as Warranty New or Warranty Repair in RR. Do you still want to proceed with ${control.get('ItemLocalCurrencySymbol').value} 0 amount?`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, create it!',
                cancelButtonText: 'No, cancel!',
                confirmButtonClass: 'btn btn-success mt-2',
                cancelButtonClass: 'btn btn-danger ml-2 mt-2',
                buttonsStyling: false
              }).then((result) => {
                this.EditForm.value.VendorPartsList.map((item: any) => {
                  item.Rate = Number(item.Rate)
                  item.BaseRate = Number(item.BaseRate),
                    item.BaseTax = Number(item.BaseTax)
                  item.BasePrice = Number(item.BasePrice)
                })
                if (result.value) {
                  var postData = {
                    "LocalCurrencyCode": this.VendorCurrencyCode,
                    "ExchangeRate": this.ExchangeRate,
                    "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode'),
                    "BaseGrandTotal": Number(this.BaseGrandTotal),
    
                    "RRId": this.RRId,
                    "CustomerId": this.CustomerId,
                    "VendorId": VendorId,
                    "CustomerShipToId": this.CustomerShipToId,
                    "CustomerBillToId": this.CustomerBillToId,
                    "VendorPartsList": this.EditForm.value.VendorPartsList,
                    "VendorsList": {
                      "RRVendorId": this.RRVendorId,
                      "RouteCause": this.EditForm.value.RouteCause,
                      "VendorRefAttachment": this.EditForm.value.VendorRefAttachment,
                      //"LeadTime": this.EditForm.value.VendorLeadTime,
                      "WarrantyPeriod": this.EditForm.value.WarrantyPeriod,
                      "SubTotal": this.EditForm.value.SubTotal,
                      "AdditionalCharge": this.EditForm.value.AdditionalCharge || 0,
                      "TotalTax": this.EditForm.value.TotalTax,
                      "TaxPercent": this.EditForm.value.TaxPercent,
                      "Discount": this.EditForm.value.Discount || 0,
                      "Shipping": this.EditForm.value.Shipping || 0,
                      "GrandTotal": this.EditForm.value.GrandTotal,
                    }
                  }
    
                  this.commonService.postHttpService(postData, "RRSaveAndCreateCustomerQuote").subscribe(response => {
                    if (response.status == true) {
                      this.triggerEvent(response.responseData);
                      this.modalRef.hide();
    
                      Swal.fire({
                        title: 'Success!',
                        text: 'Quote for Customer has been created!',
                        type: 'success',
                        confirmButtonClass: 'btn btn-confirm mt-2'
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
                } else if (
                  result.dismiss === Swal.DismissReason.cancel
                ) {
                  this.modalRef.hide();
                }
              }); 
            }
          })
         }
        }
         if(!this.IsWarrantyRecoveryvalidation && !this.showpopalert){
          
        this.btnDisabled = true;
        
        this.VendorPartsList.controls.forEach((control, i) => {
          if (!this.partList.some(a => a.PartNo == control.get('PartNo').value)) {
            partNotFound = true;
          }
        })

        this.VendorPartsList.controls.forEach((control, i) => {
          if (control.get('ItemLocalCurrencySymbol').value != this.viewResult.VendorsInfo[0].VendorCurrencySymbol) {
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
        this.errorStatus = 0;
        if (!this.isCurrencyMode) {
          Swal.fire({
            title: 'Do you wish to proceed?',
            text: 'You won\'t be able to revert this! ',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, create it!',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success mt-2',
            cancelButtonClass: 'btn btn-danger ml-2 mt-2',
            buttonsStyling: false
          }).then((result) => {
            this.EditForm.value.VendorPartsList.map((item: any) => {
              item.Rate = Number(item.Rate)
              item.BaseRate = Number(item.BaseRate),
                item.BaseTax = Number(item.BaseTax)
              item.BasePrice = Number(item.BasePrice)
            })
            if (result.value) {
              var postData = {
                "LocalCurrencyCode": this.VendorCurrencyCode,
                "ExchangeRate": this.ExchangeRate,
                "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode'),
                "BaseGrandTotal": Number(this.BaseGrandTotal),

                "RRId": this.RRId,
                "CustomerId": this.CustomerId,
                "VendorId": VendorId,
                "CustomerShipToId": this.CustomerShipToId,
                "CustomerBillToId": this.CustomerBillToId,
                "VendorPartsList": this.EditForm.value.VendorPartsList,
                "VendorsList": {
                  "RRVendorId": this.RRVendorId,
                  "RouteCause": this.EditForm.value.RouteCause,
                  "VendorRefAttachment": this.EditForm.value.VendorRefAttachment,
                  //"LeadTime": this.EditForm.value.VendorLeadTime,
                  "WarrantyPeriod": this.EditForm.value.WarrantyPeriod,
                  "SubTotal": this.EditForm.value.SubTotal,
                  "AdditionalCharge": this.EditForm.value.AdditionalCharge || 0,
                  "TotalTax": this.EditForm.value.TotalTax,
                  "TaxPercent": this.EditForm.value.TaxPercent,
                  "Discount": this.EditForm.value.Discount || 0,
                  "Shipping": this.EditForm.value.Shipping || 0,
                  "GrandTotal": this.EditForm.value.GrandTotal,
                }
              }

              this.commonService.postHttpService(postData, "RRSaveAndCreateCustomerQuote").subscribe(response => {
                if (response.status == true) {
                  this.triggerEvent(response.responseData);
                  this.modalRef.hide();

                  Swal.fire({
                    title: 'Success!',
                    text: 'Quote for Customer has been created!',
                    type: 'success',
                    confirmButtonClass: 'btn btn-confirm mt-2'
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
            } else if (
              result.dismiss === Swal.DismissReason.cancel
            ) {
              Swal.fire({
                title: 'Cancelled',
                text: 'Quote for Custome has not created.',
                type: 'error'
              });
            }
          });
        } else {
          Swal.fire({
            type: 'info',
            title: 'Vendor Currency Mismatch',
            text: `Vendor Currency Code is Changed. Please contact admin to create a quote`,
            confirmButtonClass: 'btn btn-confirm mt-2',
          });
        }
      
    }
      } else {
        this.errorStatus = 1;
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
        html: '<b style=" font-size: 14px !important;">' + (`Vendor Quote Added from  : <span class="badge badge-primary btn-xs">${this.CreatedByLocationName}</span> country . Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }
  }

  fileProgress(event: any) {


    const formData = new FormData();
    //var fileData = event.target.files;     
    var filesarray = event.target.files;
    for (var i = 0; i < filesarray.length; i++) {
      formData.append('files', filesarray[i]);
    }

    this.commonService.postHttpImageService(formData, "getVendoruploadAttachment").subscribe(response => {
      this.imageresult = response.responseData;

      this.EditForm.patchValue({
        VendorRefAttachment: this.imageresult[0].location
      });

      //this.VendorRefAttachment = this.imageresult[0].location;
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  ngAfterViewInit() {
    $(document).on("blur", ".autocomplete-container .input-container input", (e) => {
      if (!this.partList.find(a => a.PartNo == e.target.value)) {
        e.target.value = "";

        let idx = $(e.target).closest(".row").index();
        this.VendorPartsList.controls[idx].patchValue({
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
      // var data = val.replace(/'/g, "\'");
      var firstdata = val.replace("\\", "")
      var data = firstdata.replace("'", "\\'")
      console.log("data", data)
      return data;
    } else {
      return val;
    }

  }

}