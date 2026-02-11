import { ThrowStmt } from '@angular/compiler';
import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { concat, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { Const_Alert_pop_title, Const_Alert_pop_message, CONST_COST_HIDE_VALUE, PartLocations, part_type } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-inventory-shop',
  templateUrl: './inventory-shop.component.html',
  styleUrls: ['./inventory-shop.component.scss']
})
export class InventoryShopComponent implements OnInit {


  AddFormNew: FormGroup;
  AddForm: FormGroup;
  QuantityForm: FormGroup;
  warehouseList: any[];
  warehouse1List: any[];
  warehouse2List: any[];
  warehouse3List: any[];
  warehouse4List: any[];
  rfidEnabled: boolean = false;
  submitted: boolean = false;
  CurrencyList: any;
  cd_ref: any;
  ExchangeRate: any;
  vendorList: any;
  categoryList: any;
  vendors$: Observable<any> = of([]);
  subscription: Subscription;
  vendorsInput$ = new Subject<string>();
  loadingVendors: boolean = false;
  VendorsList: any;
  IsEcommerceProduct: any;
  hideButton: boolean = true;
  disableSelectbox: any = "true";
  // addFormShow: any[] = [];
  addFormShow: boolean = false;
  // showQuantityForm: boolean = false;
  showQuantityForm: any[] = [];
  PartLocations = PartLocations;
  StoreLocation: any;
  // vendorSymbol: any;
  vendorSymbol: any[] = [];
  BuyingExchangeRateNew: any;
  SellingExchangeRateNew: any;
  BuyingExchangeRate: any[] = [];
  SellingExchangeRate: any[] = [];
  ShopPartItems: any;
  disabled: boolean = true;
  VendorIdForNewForm: any;
  partTypes = part_type;
  public event: EventEmitter<any> = new EventEmitter();
  vendorSymbolNewForm: any;
  constructor(
    private fb: FormBuilder,
    private service: CommonService,
    public modalRef: BsModalRef,
    @Inject(BsModalRef) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.loadCategory();
    this.loadVendors();
    this.getCurrencyList();
    this.getStoreLocation();
    this.IsEcommerceProduct = this.data.RRInfo.IsEcommerceProduct;
    this.ShopPartItems = this.data.ShopPartItems;
    this.disableSelectbox = this.data.RRInfo.IsEcommerceProduct == 0 ? "false" : "true";
    // if(this.data && this.data.RRInfo && this.data.RRInfo.SellingPrice != null && this.data.RRInfo.SellingCurrencyCode != null) {
    //   console.log("this.data.RRInfo.SellingPrice")
    //   this.hideButton = false;
    // }
    // 
    this.addForm();

    this.QuantityForm = this.fb.group({
      PartId: this.data.RRInfo.PartId,
      ShopPartItemId: 0,
      Quantity: ['', Validators.required]
    });
    this.patchEditForm();


  }
  get QuantityFormControl() {
    return this.QuantityForm.controls;
  }

  get AddFormControl() {
    return this.AddForm.controls;
  }
  get AddFormNewControl() {
    return this.AddFormNew.controls;
  }

  hide() {
    this.modalRef.hide()
  }

  addForm() {
    this.AddForm = this.fb.group({
      PartsItemList: this.fb.array([
        this.fb.group({
          PartId: ['', Validators.required],
          SellingPrice: ['', Validators.required],
          APNNo: ['', Validators.required],
          PartNo: ['', Validators.required],
          SellingCurrencyCode: ['', Validators.required],
          BuyingCurrencyCode: ['', Validators.required],
          VendorId: ['', Validators.required],
          IsEcommerceProduct: [1],
          ShopQuantity: [1],
          BuyingPrice: ['', Validators.required],
          PartCategoryId: [''],
          SerialNo: [''],
          LocationId: ['', Validators.required],
          RRId: [''],
          ShopCurrentQuantity: [''],
          BuyingExchangeRate: [''],
          SellingExchangeRate: [''],
          BaseBuyingPrice: [''],
          BaseSellingPrice: [''],
          PartItemType: ['', Validators.required],
          PartItemDelivery: [''],
          PartItemDescription: ['']
        })
      ])
    })
  }

  get PartsItemList(): FormArray {
    return this.AddForm.get('PartsItemList') as FormArray;
  }

  patchEditForm() {
    this.data.ShopPartItems.forEach((currentValue, index) => {
      // console.log("Loop No = "+ index);
      if (index > 0) {
        this.addRepairPart();
      }
      var formGroup = this.PartsItemList.controls[index] as FormGroup;
      console.log(currentValue);
      // var formGroup = this.AddForm.controls[index] as FormGroup;
      formGroup.controls['SerialNo'].patchValue(currentValue.SerialNo);
      formGroup.controls['LocationId'].patchValue(currentValue.LocationId);
      formGroup.controls['APNNo'].patchValue(currentValue.APNNo);
      formGroup.controls['VendorId'].patchValue(currentValue.PartsVendorId);
      // formGroup.controls['ShopTotalQuantity'].patchValue(currentValue.ShopTotalQuantity);
      formGroup.controls['ShopCurrentQuantity'].patchValue(currentValue.ShopCurrentQuantity);
      formGroup.controls['SellingExchangeRate'].patchValue(currentValue.SellingExchangeRate);
      formGroup.controls['BuyingExchangeRate'].patchValue(currentValue.BuyingExchangeRate);
      formGroup.controls['SellingPrice'].patchValue(currentValue.SellingPrice);
      formGroup.controls['BuyingPrice'].patchValue(currentValue.BuyingPrice);
      formGroup.controls['SellingCurrencyCode'].patchValue(currentValue.SellingCurrencyCode);
      // formGroup.controls['BuyingCurrencyCode'].patchValue(currentValue.BuyingCurrencyCode);
      formGroup.controls['PartCategoryId'].patchValue(currentValue.PartCategoryId);
      formGroup.controls['BaseSellingPrice'].patchValue(currentValue.BaseSellingPrice);
      formGroup.controls['BaseBuyingPrice'].patchValue(currentValue.BaseBuyingPrice);
      formGroup.controls['PartId'].patchValue(currentValue.PartId);
      formGroup.controls['PartNo'].patchValue(currentValue.PartNo);
      formGroup.controls['PartItemType'].patchValue(currentValue.PartItemType);
      formGroup.controls['PartItemDelivery'].patchValue(currentValue.PartItemDelivery);
      formGroup.controls['PartItemDescription'].patchValue(currentValue.Description);
      formGroup.controls['RRId'].patchValue(this.data.RRInfo.RRId);

    });
  }
  public addRepairPart(): void {
    // this.partLoop.push(1)
    const control = <FormArray>this.AddFormControl.PartsItemList;
    control.push(this.initPart());
    // console.log(control);
  }
  public initPart(): FormGroup {
    return this.fb.group({
      PartId: ['', Validators.required],
      SellingPrice: ['', Validators.required],
      APNNo: ['', Validators.required],
      PartNo: ['', Validators.required],
      SellingCurrencyCode: ['', Validators.required],
      BuyingCurrencyCode: ['', Validators.required],
      VendorId: ['', Validators.required],
      IsEcommerceProduct: [1],
      ShopQuantity: [1],
      BuyingPrice: ['', Validators.required],
      PartCategoryId: [''],
      SerialNo: [''],
      LocationId: ['', Validators.required],
      RRId: [''],
      ShopCurrentQuantity: [''],
      BuyingExchangeRate: [''],
      SellingExchangeRate: [''],
      BaseBuyingPrice: [''],
      BaseSellingPrice: [''],
      PartItemType: ['', Validators.required],
      PartItemDelivery: ['', Validators.required],
      PartItemDescription: ['', Validators.required]
    });

  }


  add() {
    if (this.AddForm.invalid) {
      this.AddForm.markAllAsTouched();
      return;
    }
    this.submitted = true;
    let body = this.AddForm.value;
    // let api = "UpdateShopPart";
    body.updateCategory = 0;
    let api = "addShopPartItem";
    if (body) {

      this.service.postHttpService(body, api).subscribe(response => {
        console.log(response, "response")
        this.triggerEvent(response.responseData);
        if (response.status == true) {
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: "Part added successfully!",
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: response.message,
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        // this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
  }

  addNewForm() {
    console.log("enter....");
    console.log(this.AddFormNew.value);
    if (this.AddFormNew.invalid) {
      this.AddFormNew.markAllAsTouched();
      return;
    }
    this.submitted = true;
    let body = this.AddFormNew.value;
    let api = "addShopPartItem";
    body.updateCategory = 1;
    // console.log(body);
    if (body) {
      this.service.postHttpService(body, api).subscribe(response => {
        // console.log(response, "response")
        this.triggerEvent(response.responseData);
        if (response.status == true) {
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: "Part Item added successfully!",
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: response.message,
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        // this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
  }

  addNew(i) {
    console.log(this.AddForm.value);
    var AddFormValue = this.AddForm.value;
    // console.log(this.AddForm.controls.PartsItemList[i].invalid);
    if (this.AddForm.invalid) {
      this.AddForm.markAllAsTouched();
      return;
    }
    this.submitted = true;
    let body = AddFormValue.PartsItemList[i];
    body.updateCategory = 1;
    let api = "addShopPartItem";
    if (body) {

      this.service.postHttpService(body, api).subscribe(response => {
        // console.log(response, "response")
        this.triggerEvent(response.responseData);
        if (response.status == true) {
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: "Part Item added successfully!",
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: response.message,
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        // this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
  }

  getCurrencyList() {
    this.service.getHttpService('Currencyddl').subscribe(response => {
      if (response.status == true) {
        this.CurrencyList = response.responseData;
      } else { }
      // this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  onSellingPriceChange(e, i) {
    var BaseSellingPrice = ((e.target.value) * this.SellingExchangeRate[i]).toFixed(2);
    const formGroup = this.PartsItemList.controls[i] as FormGroup;
    formGroup.controls['BaseSellingPrice'].patchValue(BaseSellingPrice);
  }

  onBuyingPriceChange(e, i) {
    var BaseBuyingPrice = ((e.target.value) * this.BuyingExchangeRate[i]).toFixed(2);
    const formGroup = this.PartsItemList.controls[i] as FormGroup;
    formGroup.controls['BaseBuyingPrice'].patchValue(BaseBuyingPrice);
  }

  getVendorList() {
    this.service.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData.map(function (value) {
        return { title: value.VendorName, "VendorId": (value.VendorId).toString() }
      });
    });
  }

  loadCategory() {
    this.service.postHttpService({}, 'getPartCategory').subscribe(response => {
      this.categoryList = response.responseData.map(function (value) {
        return { title: value.PartCategoryName, "PartCategoryId": (value.PartCategoryId).toString() }
      });
    });
  }

  loadVendors() {
    this.loadingVendors = true;
    var postData = {
      "Vendor": ""
    }
    this.service.postHttpService(postData, 'getAllAutoCompleteofVendor').subscribe(response => {
      this.VendorsList = response.responseData;
      this.loadingVendors = false;
      // if(this.data.RRInfo.PartsVendorId > 0 || this.data.RRInfo.PartsVendorId != null){
      this.vendorChangeOnload(this.data.ShopPartItems);
      // }
    });
  }
  loadVendors1() {
    this.vendors$ = concat(
      this.searchVendors().pipe( // default items
        catchError(() => of([])), // empty list on error
      ),
      this.vendorsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap(term => {
          if (term != null && term != undefined)
            return this.searchVendors(term).pipe(
              catchError(() => of([])), // empty list on error
            )
          else
            return of([])
        })
      )
    );
  }


  searchVendors(term: string = ""): Observable<any> {
    this.loadingVendors = true;
    var postData = {
      "Vendor": term
    }
    return this.service.postHttpService(postData, "getAllAutoCompleteofVendor")
      .pipe(
        map(response => {
          this.VendorsList = response.responseData;
          this.loadingVendors = false;
          return response.responseData;
        })
      );
  }

  selectAll() {
    let VendorIdIds = this.VendorsList;
    let cMerge = [...new Set([...VendorIdIds, ...this.AddForm.value.PrimaryVendorId])];
    this.AddForm.patchValue({ "PrimaryVendorId": cMerge })
  }

  quantityChange(e, i) {
    this.ShopPartItems[i].UpdatedQuantity = e.target.value;
  }

  saveQuantity(i) {
    this.QuantityForm.patchValue({
      PartId: this.ShopPartItems[i].PartId,
      ShopPartItemId: this.ShopPartItems[i].ShopPartItemId ? this.ShopPartItems[i].ShopPartItemId : 0,
      Quantity: parseInt(this.ShopPartItems[i].UpdatedQuantity)
    })
    this.submitted = true;
    if (this.QuantityForm.valid) {
      let body = { ...this.QuantityForm.value }

      this.service.postHttpService(body, "updatePartsItemQuantity").subscribe(response => {
        if (response.status == true) {
          //  this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Quantity updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Record could not be updated!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));

    }
  }

  addNewPartItem(i) {
    this.addFormShow = true;
    this.addFormNew();
    this.AddFormNew.patchValue({
      PartId: this.ShopPartItems[i].PartId,
      PartNo: this.ShopPartItems[i].PartNo,
      RRId: this.data.RRInfo.RRId,
      SerialNo: this.ShopPartItems[i].SerialNo
    })
  }
  addFormNew() {
    this.AddFormNew = this.fb.group({
      PartId: ['', Validators.required],
      SellingPrice: ['', Validators.required],
      APNNo: ['', Validators.required],
      PartNo: ['', Validators.required],
      SellingCurrencyCode: ['', Validators.required],
      BuyingCurrencyCode: ['', Validators.required],
      VendorId: ['', Validators.required],
      IsEcommerceProduct: [1],
      ShopQuantity: [1],
      BuyingPrice: ['', Validators.required],
      PartCategoryId: [''],
      SerialNo: [''],
      LocationId: ['', Validators.required],
      RRId: [''],
      ShopCurrentQuantity: [''],
      BuyingExchangeRate: [''],
      SellingExchangeRate: [''],
      BaseBuyingPrice: [''],
      BaseSellingPrice: [''],
      PartItemType: ['', Validators.required],
      PartItemDelivery: [''],
      PartItemDescription: ['']
    })
  }
  addQuantityInPartItem(i) {
    this.showQuantityForm[i] = true;
  }
  closeQuantity(i) {
    this.showQuantityForm[i] = false;
  }
  clearVendor(i) {
    this.vendorSymbol[i] = '';
    const formGroup = this.PartsItemList.controls[i] as FormGroup;
    formGroup.controls['BuyingPrice'].patchValue('');
    formGroup.controls['BuyingCurrencyCode'].patchValue('');
  }
  vendorChange(i) {
    // console.log(event.target.value)
    console.log(i)
    // var vendor = this.VendorsList.filter(u => u.VendorId == event.target.value);
    // this.vendorSymbol = vendor[0].CurrencySymbol;
    // this.callExchange(vendor[0].VendorCurrencyCode, 'buying');
    // this.AddForm.patchValue({
    //   BuyingCurrencyCode : vendor[0].VendorCurrencyCode,
    //   BuyingPrice: ''
    // });
    var VendorId = this.PartsItemList.controls[i].get('VendorId').value;
    var vendor = this.VendorsList.filter(u => u.VendorId == VendorId);
    this.vendorSymbol[i] = vendor && vendor[0] && vendor[0].CurrencySymbol ? vendor[0].CurrencySymbol : '';
    this.callExchange(vendor[0].VendorCurrencyCode, 'buying', i);
    const formGroup = this.PartsItemList.controls[i] as FormGroup;
    formGroup.controls['BuyingPrice'].patchValue('');
    formGroup.controls['BuyingCurrencyCode'].patchValue(vendor[0].VendorCurrencyCode);

  }

  vendorChangeOnload(ShopPartItems) {
    // console.log(event.target.value)
    ShopPartItems.forEach((currentValue, index) => {
      if (currentValue.PartsVendorId > 0) {
        var vendor = this.VendorsList.filter(u => u.VendorId == currentValue.PartsVendorId);
        this.vendorSymbol[index] = vendor && vendor[0] && vendor[0].CurrencySymbol ? vendor[0].CurrencySymbol : '';
      } else {
        this.vendorSymbol[index] = '';
      }
    });
  }

  sellingCurrencyChange(event, i) {
    // var CurrencyCode = event.target.value;
    // this.callExchange(CurrencyCode, 'selling', i);
    // this.AddForm.patchValue({
    //   SellingCurrencyCode : CurrencyCode,
    //   SellingPrice: ''
    // });

    var CurrencyCode = event.target.value;
    this.callExchange(CurrencyCode, 'selling', i);
    const formGroup = this.PartsItemList.controls[i] as FormGroup;
    formGroup.controls['SellingPrice'].patchValue('');
    formGroup.controls['SellingCurrencyCode'].patchValue(CurrencyCode);
  }

  callExchangeNew(CurrencyCode, type) {
    var postData = {
      "LocalCurrencyCode": CurrencyCode,
      "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode')
    }
    this.service.postHttpService(postData, 'Exchange').subscribe(response => {
      if (response.status == true) {
        if (type == 'buying') {
          this.BuyingExchangeRateNew = response.responseData.ExchangeRate;
          this.AddForm.patchValue({
            BuyingExchangeRate: this.BuyingExchangeRate
          })
        } else if (type == 'selling') {
          this.SellingExchangeRateNew = response.responseData.ExchangeRate;
          this.AddForm.patchValue({
            SellingExchangeRate: this.SellingExchangeRate
          })
        }


      } else { }
      // this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  callExchange(CurrencyCode, type, i) {
    var postData = {
      "LocalCurrencyCode": CurrencyCode,
      "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode')
    }
    this.service.postHttpService(postData, 'Exchange').subscribe(response => {
      if (response.status == true) {
        const formGroup = this.PartsItemList.controls[i] as FormGroup;
        if (type == 'buying') {
          this.BuyingExchangeRate[i] = response.responseData.ExchangeRate;
          formGroup.controls['BuyingExchangeRate'].patchValue(response.responseData.ExchangeRate);
          // this.AddForm.patchValue({
          //   BuyingExchangeRate:this.BuyingExchangeRate
          // })
        } else if (type == 'selling') {
          this.SellingExchangeRate[i] = response.responseData.ExchangeRate;
          formGroup.controls['SellingExchangeRate'].patchValue(response.responseData.ExchangeRate);
          // this.AddForm.patchValue({
          //   SellingExchangeRate:this.SellingExchangeRate
          // })
        }


      } else { }
      // this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  getStoreLocation() {
    this.service.getHttpService('ddStoreLocation').subscribe(response => {
      this.StoreLocation = response.responseData;
    });
  }

  sellingCurrencyChangeNewForm(event) {
    var CurrencyCode = event.target.value;
    this.callExchangeNew(CurrencyCode, 'selling');
    this.AddFormNew.patchValue({
      SellingCurrencyCode: CurrencyCode,
      SellingPrice: ''
    });
  }

  clearVendorNewForm() {
    this.vendorSymbolNewForm = '';
    this.AddFormNew.patchValue({
      BuyingCurrencyCode: '',
      BuyingPrice: ''
    });
  }

  vendorChangeNewForm() {
    // console.log(this.VendorIdForNewForm)
    var VendorId = this.VendorIdForNewForm;
    var vendor = this.VendorsList.filter(u => u.VendorId == VendorId);
    this.vendorSymbolNewForm = vendor[0].CurrencySymbol;
    this.callExchangeNew(vendor[0].VendorCurrencyCode, 'buying');
    this.AddFormNew.patchValue({
      BuyingCurrencyCode: vendor[0].VendorCurrencyCode,
      BuyingPrice: ''
    });

  }
  onSellingPriceChangeNewForm(e) {
    // console.log(this.SellingExchangeRate);
    this.AddFormNew.patchValue({
      BaseSellingPrice: ((e.target.value) * this.SellingExchangeRateNew).toFixed(2),
    })
  }

  onBuyingPriceChangeNewForm(e) {
    var BaseBuyingPrice = ((e.target.value) * this.BuyingExchangeRateNew).toFixed(2);
    this.AddFormNew.patchValue({
      BaseBuyingPrice: BaseBuyingPrice,
    })
  }




}
