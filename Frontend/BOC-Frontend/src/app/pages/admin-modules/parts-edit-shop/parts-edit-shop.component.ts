/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationErrors } from '@iplab/ngx-file-upload';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { data } from 'jquery';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { join } from 'path';
import { concat, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message, CONST_COST_HIDE_VALUE, PartLocations, part_type, CONST_VIEW_ACCESS, CUSTOMER_GROUP_ID_FORD } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { PartQuantityStorePopupComponent } from '../total-part-list-store/part-quantity-store-popup/part-quantity-store-popup.component';
import { StockLogComponent } from '../common-template/stock-log/stock-log.component';
@Component({
  selector: 'app-parts-edit-shop',
  templateUrl: './parts-edit-shop.component.html',
  styleUrls: ['./parts-edit-shop.component.scss']
})
export class PartsEditShopComponent implements OnInit {
  // model: any = {}
  model: any = [];
  AddForm: FormGroup;
  vendorList: any[];
  vendorLists: any[];
  categoryList: any[];
  manufacturerList: any[];
  partList: any[];
  submitted = false;
  warehouseList: any[];
  warehouse1List: any[];
  warehouse2List: any[];
  warehouse3List: any[];
  warehouse4List: any[];
  ImagesList: any = [];
  Attachment;
  spinner: boolean = false;
  editMode: boolean = false;
  PartLocations = PartLocations;
  selectedRfid: string = "";
  subscription: Subscription;
  rfIdReaderForm: FormGroup;
  PartId: any;
  statusFilterId: any;
  fileData: any;
  imageresult: any;
  rfidEnabled: boolean = false;
  partTypes = part_type;
  RRId;

  ExchangeRate
  CurrencySymbol
  BaseCurrencySymbol;
  vendors$: Observable<any> = of([]);
  vendorsInput$ = new Subject<string>();
  
  loadingVendors: boolean = false;
  VendorsList: any[] = [];
  CurrencyList: any = []
  PrimaryVendorId: any;
  // BuyingExchangeRate: any = 1;
  BuyingExchangeRate: any[] = [];
  vendorSymbol: any[] = [];
  // SellingExchangeRate: any = 1;
  SellingExchangeRate: any[] = [];
  IsEcommerceProduct: any;
  PartNo: any;
  PartNo1: any;
  StoreLocation: any;
  ImagesItemList: any[] = [];
  spinneritem: boolean;
  inventoryDatas: any;
  partsData: any[];
  keyword = "PartNo";
  isLoading: Boolean = false;
  IsAddStockInView: any;
  IsReduceStockView: any;
  IsViewStockLogView: any;
  StoreType
  FordTemplate:boolean=false
  constructor(
    private fb: FormBuilder,
    private service: CommonService,
    private router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private cd_ref: ChangeDetectorRef,
    public modalRef: BsModalRef, private modalService: BsModalService,
  ) {
    this.IsAddStockInView = this.service.permissionCheck("AddStockIn", CONST_VIEW_ACCESS);
    this.IsReduceStockView = this.service.permissionCheck("ReduceStock", CONST_VIEW_ACCESS);
    this.IsViewStockLogView = this.service.permissionCheck("ViewStockLog", CONST_VIEW_ACCESS);
    this.AddForm = this.fb.group({
      PartId: [""],
      PartNo: ['', Validators.required],
      Description: [''],
      ManufacturerId: [''],
      ManufacturerPartNo: [''],
      UnitType: [''],
      StoreSince: [null, Validators.required],
      PrimaryVendorId: [''],
      IsNewOrRefurbished: [''],
      IsActive: [true],
      TaxType: [''],
      // SellingPrice: ['0', Validators.required],
      // BaseSellingPrice:[''],
      // SellingPriceDescription: [''],
      Price: [''],
      BasePrice: [''],
      // BuyingPrice: [''],
      // BaseBuyingPrice:[''],
      // BuyingPriceDescription: [''],
      // SellingPrice: [''],
      // BuyingPrice: [''],
      // SellingCurrencyCode: [''],
      // BuyingCurrencyCode: [''],
      LocalCurrencyCode: [''],
      ExchangeRate: ['1'],
      // SellingExchangeRate: [''],
      // BuyingExchangeRate: [''],
      BaseCurrencyCode: [''],
      Attachment: ['', [
        RxwebValidators.extension({ extensions: ["jpeg", "png", "jpg", "gif"] })
      ]],
      // APNNo: [''],
      // VendorId: [''],
      IsEcommerceProduct: [1],
      // PartCategoryId: [''],
      PartCategoryId: [''],
      // ShopTotalQuantity: [''],
      // ShopCurrentQuantity: [''],

      PartsItemList: this.fb.array([
        this.fb.group({
          SerialNo: [''],
          LocationId: ['', Validators.required],
          APNNo: ['', Validators.required],
          VendorId: ['', Validators.required],
          ShopTotalQuantity: [''],
          ShopCurrentQuantity: ['', Validators.required],
          SellingExchangeRate: [''],
          BuyingExchangeRate: [''],
          SellingPrice: ['', Validators.required],
          BuyingPrice: ['', Validators.required],
          SellingCurrencyCode: [''],
          BuyingCurrencyCode: [''],
          // PartCategoryId: ['', Validators.required],
          BaseSellingPrice: [''],
          BaseBuyingPrice: [''],
          ShopPartItemId:[''],
          PartItemType:['', Validators.required],
          PartItemDelivery:[''],
          PartItemDescription:[''],
          ItemAttachment: ['', [
            RxwebValidators.extension({ extensions: ["jpeg", "png", "jpg", "gif"] })
          ]],
          ItemAttachmentList: ['']
        })
      ]),
      
    })
  }
  currentRouter = this.router.url;
  ngOnInit(): void {
    this.ExchangeRate = '1'
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol")

    this.AddForm.patchValue({
      ExchangeRate: this.ExchangeRate,
      BaseCurrencyCode: localStorage.getItem('BaseCurrencyCode'),
      LocalCurrencyCode: localStorage.getItem('BaseCurrencyCode'),
    })

    this.PartId = history.state.PartId;
    this.RRId = history.state.RRId;
    this.StoreType = history.state.StoreType;

    if(this.StoreType==CUSTOMER_GROUP_ID_FORD){
      this.FordTemplate=true
    }else{
      this.FordTemplate=false
    }

    // console.log(this.RRId)

    this.loadVendors();
    // this.partVendors();
    this.loadCategory();
    this.getVendorActiveList();
    this.getManufacturerList();
    this.getCurrencyList();
    this.getWarehouseList();
    this.getWarehouseSub1List();
    this.getWarehouseSub2List();
    this.getWarehouseSub3List();
    this.getWarehouseSub4List();
    this.getStoreLocation();

    if (this.PartId) {
      this.patchEditValue()
    }



  }
  // onCurrencyChange(e) {
  //   if(e.target.value == ''){
  //   this.CurrencySymbol = ''
  //   this.ExchangeRate = ''
  //   this.AddForm.patchValue({
  //     ExchangeRate:'',
  //     BaseCurrencyCode: localStorage.getItem('BaseCurrencyCode'),
  //     BasePrice:'',
  //     BaseSellingPrice:'',
  //     BaseBuyingPrice:''
  //   })
  // }else{
  //   this.CurrencySymbol=this.CurrencyList.find(a=>a.CurrencyCode==e.target.value).CurrencySymbol
  //   if(e.target.value==localStorage.getItem('BaseCurrencyCode')){
  //     this.AddForm.patchValue({
  //       ExchangeRate:1,
  //     })
  //     this.ExchangeRate = 1
  //     if(this.AddForm.value.BuyingPrice != ''){
  //       this.onCalculatBaseBuyingPrice();
  //     }
  //     if(this.AddForm.value.SellingPrice != ''){
  //       this.onCalculateBaseSellingPrice();
  //     }
  //     if(this.AddForm.value.Price != ''){
  //       this.onCalculatBasePrice();
  //     }
  //     return false
  //   }
  //   var postData={
  //   "LocalCurrencyCode" :e.target.value,
  //   "BaseCurrencyCode" : localStorage.getItem('BaseCurrencyCode')
  //   }
  //   this.service.postHttpService(postData,'Exchange').subscribe(response => {
  //     if (response.status == true) {
  //       this.ExchangeRate = response.responseData.ExchangeRate;
  //       this.AddForm.patchValue({
  //         ExchangeRate:this.ExchangeRate,
  //         BaseCurrencyCode: localStorage.getItem('BaseCurrencyCode')
  //       })
  //       if(this.AddForm.value.BuyingPrice != ''){
  //         this.onCalculatBaseBuyingPrice();
  //       }
  //       if(this.AddForm.value.SellingPrice != ''){
  //         this.onCalculateBaseSellingPrice();
  //       }
  //       if(this.AddForm.value.Price != ''){
  //         this.onCalculatBasePrice();
  //       }
  //     } else { }
  //     this.cd_ref.detectChanges();
  //   }, error => console.log(error));


  // }
  // }

  // onCalculateBaseSellingPrice(){
  //   this.AddForm.patchValue({
  //     BaseSellingPrice: ((this.AddForm.value.SellingPrice)*this.ExchangeRate).toFixed(2),
  //   })
  // }
  // onCalculatBasePrice(){
  //   this.AddForm.patchValue({
  //     BasePrice: ((this.AddForm.value.Price)*this.ExchangeRate).toFixed(2),
  //   })
  // }
  // onCalculatBaseBuyingPrice(){
  //   this.AddForm.patchValue({
  //     BaseBuyingPrice: (this.AddForm.value.BuyingPrice*this.ExchangeRate).toFixed(2),
  //   })
  // }
  onBuyingPriceChange(e, i){
    var BaseBuyingPrice = ((e.target.value)*this.BuyingExchangeRate[i]).toFixed(2);
    const formGroup = this.PartsItemList.controls[i] as FormGroup;
    formGroup.controls['BaseBuyingPrice'].patchValue(BaseBuyingPrice);
  }
  onSellingPriceChange(e, i){
    var BaseSellingPrice = ((e.target.value)*this.SellingExchangeRate[i]).toFixed(2);
    const formGroup = this.PartsItemList.controls[i] as FormGroup;
    formGroup.controls['BaseSellingPrice'].patchValue(BaseSellingPrice);
  }
  onPriceChange(e) {
    this.AddForm.patchValue({
      BasePrice: ((e.target.value) * this.ExchangeRate).toFixed(2),
    })
  }
  getCurrencyList() {
    this.service.getHttpService('Currencyddl').subscribe(response => {
      if (response.status == true) {
        this.CurrencyList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  removeImage(imgIndex) {
    this.ImagesList[imgIndex].IsDeleted = 1;
  }

  toDate(dateStr) {
    if (dateStr) {
      const [year, month, day] = dateStr.split('-');
      const obj = {
        year: parseInt(year), month: parseInt(month), day:
          parseInt(day.split(' ')[0].trim())
      };
      return obj;
    }
  }





  loadCategory() {
    this.service.postHttpService({}, 'getPartCategory').subscribe(response => {
      this.categoryList = response.responseData.map(function (value) {
        return { title: value.PartCategoryName, "PartCategoryId": (value.PartCategoryId).toString() }
      });
    });
  }

  getVendorList() {
    this.service.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData.map(function (value) {
        return { title: value.VendorName, "VendorId": (value.VendorId).toString() }
      });
    });
  }
  getVendorActiveList() {
    this.service.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorLists = response.responseData.map(function (value) {
        return { title: value.VendorName, "VendorId": (value.VendorId).toString() }
      });
    });
  }

  getManufacturerList() {
    this.service.getHttpService('getManufacturerList').subscribe(response => {
      this.manufacturerList = response.responseData.map(function (value) {
        return { title: value.VendorName, "VendorId": value.VendorId }
      });
    });
  }

  getWarehouseList() {
    this.service.postHttpService({ UserId: localStorage.getItem("UserId") }, 'getWarehouseListByUserId').subscribe(response => {
      this.warehouseList = response.responseData.map(function (value) {
        return { name: value.WarehouseName, "id": value.WarehouseId }
      });
    });
  }

  getWarehouseSub1List() {
    this.service.getHttpService('getWarehouseSub1List').subscribe(response => {
      this.warehouse1List = response.responseData.map(function (value) {
        return { name: value.WarehouseSub1Name, "id": value.WarehouseSub1Id }
      });
    });
  }

  getWarehouseSub2List() {
    this.service.getHttpService('getWarehouseSub2List').subscribe(response => {
      this.warehouse2List = response.responseData.map(function (value) {
        return { name: value.WarehouseSub2Name, "id": value.WarehouseSub2Id }
      });
    });
  }

  getWarehouseSub3List() {
    this.service.getHttpService('getWarehouseSub3List').subscribe(response => {
      this.warehouse3List = response.responseData.map(function (value) {
        return { name: value.WarehouseSub3Name, "id": value.WarehouseSub3Id }
      });
    });
  }

  getWarehouseSub4List() {
    this.service.getHttpService('getWarehouseSub4List').subscribe(response => {
      this.warehouse4List = response.responseData.map(function (value) {
        return { name: value.WarehouseSub4Name, "id": value.WarehouseSub4Id }
      });
    });
  }

  private dateToString = (date) => `${date.year}-${date.month}-${date.day}`;



  fileProgressMultiple(event: any) {

    this.fileData = event.target.files[0];
    const formData = new FormData();
    //var fileData = event.target.files;     
    var filesarray = event.target.files;
    for (var i = 0; i < filesarray.length; i++) {
      formData.append('files', filesarray[i]);
    }
    this.spinner = true;
    //console.log(this.AddFormControl.Attachment.valid)
    if (this.AddFormControl.Attachment.valid == true) {
      this.service.postHttpImageService(formData, "PartImageupload").subscribe(response => {
        this.imageresult = response.responseData;

        for (var x in this.imageresult) {

          this.ImagesList.push({
            "IdentityType": "0", // For RR
            "path": this.imageresult[x].location,
            "originalname": this.imageresult[x].originalname,
            "mimetype": this.imageresult[x].mimetype,
            "size": this.imageresult[x].size,
            "IsDeleted": 0
          });
          console.log('ImagesList', this.ImagesList)
        }
        this.spinner = false;

        this.cd_ref.detectChanges();
      }, error => console.log(error));

    }
  }



  //get form validation control
  get AddFormControl() {
    return this.AddForm.controls;
  }



  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }


  onFormSubmit() {
    this.submitted = true;
    // console.log("inner");
    // this.getFormValidationErrors();
    // this.findInvalidControlsRecursive(this.AddForm)
    if (this.AddForm.valid) {

      let body = { ...this.AddForm.value };
      
      console.log(body);
      body.StoreSince = this.dateToString(body.StoreSince);
      let api = "addShopPart";

      if (body) {
        this.PrimaryVendorId = body.PrimaryVendorId
        if (this.PrimaryVendorId != '0' && this.PrimaryVendorId != '' && this.PrimaryVendorId != null && this.PrimaryVendorId != undefined) {
          body.PrimaryVendorId = body.PrimaryVendorId.map(a => a.VendorId).join()
        }

        if (this.ImagesList.length > 0) {
          body.ImagesList = this.ImagesList;
        }

        // if (this.ImagesItemList.length > 0) {
        //   body.ImagesItemList = this.ImagesItemList;
        // }

        if (body.PartId) {
          api = "updateShopPart";
        } else {
          if (body.ImagesList){
            body.ImagesList = body.ImagesList.filter(a => !a.IsDeleted);
          }

          // if (body.ImagesItemList){
          //   this.ImagesItemList.forEach
          //   this.ImagesItemList.forEach((img, index) => {
          //     body.ImagesItemList = body.ImagesItemList[index].filter(a => !a.IsDeleted);
          //   })
            
          // }

            
        }
// console.log(body);
        this.service.postHttpService(body, api).subscribe(response => {
          // console.log(response, "response")
          if (response.status == true) {
            Swal.fire({
              title: 'Success!',
              text: 'Record saved  Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });

            if (this.RRId == "" || this.RRId == undefined) {
              if(body.IsEcommerceProduct == 1){
                this.navCtrl.navigate('/admin/total-PartsList-store');
              }else{
                this.navCtrl.navigate('/admin/total-PartsList');
              }
              // this.navCtrl.navigate('/admin/total-PartsList');
            } else {
              this.router.navigate(['/admin/repair-request/edit'], { state: { RRId: this.RRId } });
            }
          } else {
            // Swal.fire({
            //   title: 'Error!',
            //   text: 'Record could not be saved!',
            //   type: 'warning',
            //   confirmButtonClass: 'btn btn-confirm mt-2'
            // });
            Swal.fire({
              title: 'Error!',
              text: response.message ? response.message : 'Record could not be saved!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          // this.cd_ref.detectChanges();
        }, error => console.log(error));
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
  onback() {
    // console.log(this.RRId)
    if (this.RRId == "" || this.RRId == undefined) {
      if(this.StoreType==CUSTOMER_GROUP_ID_FORD){
        this.navCtrl.navigate('/admin/PartsList-fordstore');
      }else{
        this.navCtrl.navigate('/admin/PartsList-amazonstore');
      }
      // if(this.IsEcommerceProduct == 1){
      //   this.navCtrl.navigate('/admin/total-PartsList-store');
      // }else{
      //   this.navCtrl.navigate('/admin/total-PartsList');
      // }
    } else {
      this.router.navigate(['/admin/repair-request/edit'], { state: { RRId: this.RRId } });
    }
  }

  

  loadVendors() {
    // console.log("one");
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
  // loadVendors1() {
  //   this.Vendors$ = concat(
  //     of([]), // default items
  //     this.VendorsInput$.pipe(
  //       distinctUntilChanged(),
  //       debounceTime(800),
  //       // tap(() => this.moviesLoading = true),
  //       switchMap(term => {

  //         return this.searchVendors(term).pipe(
  //           catchError(() => of([])), // empty list on error
  //           // tap(() => this.moviesLoading = false)
  //         )
  //       })
  //     )
  //   );
  // }
  // searchVendors1(term: string = ""): Observable<any> {
  //   var postData = {
  //     "Vendor": term
  //   }
  //   return this.service.postHttpService(postData, "getAllAutoCompleteofVendor")
  //     .pipe(
  //       map(response => {
  //         return response.responseData;
  //       })
  //     );
  // }
  partVendors(term: string = ""){
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

  manageOnline(event){
    console.log(event);
    var val = event.target.value;
    console.log(val);
    const SellingPrice = this.AddForm.get('SellingPrice');
    const BuyingPrice = this.AddForm.get('BuyingPrice');
    const SellingCurrencyCode = this.AddForm.get('SellingCurrencyCode');
    const BuyingCurrencyCode = this.AddForm.get('BuyingCurrencyCode');
    const SellingExchangeRate = this.AddForm.get('SellingExchangeRate');
    const BuyingExchangeRate = this.AddForm.get('BuyingExchangeRate');
    const APNNo = this.AddForm.get('APNNo');
    const VendorId = this.AddForm.get('VendorId');
    const PartCategoryId = this.AddForm.get('PartCategoryId');
    if(val == 1){
      SellingPrice.setValidators(Validators.required);
      BuyingPrice.setValidators(Validators.required);
      SellingCurrencyCode.setValidators(Validators.required);
      BuyingCurrencyCode.setValidators(Validators.required);
      SellingExchangeRate.setValidators(Validators.required);
      BuyingExchangeRate.setValidators(Validators.required);
      APNNo.setValidators(Validators.required);
      VendorId.setValidators(Validators.required);
      PartCategoryId.setValidators(Validators.required);
      SellingPrice.updateValueAndValidity();
      BuyingPrice.updateValueAndValidity();
      SellingCurrencyCode.updateValueAndValidity();
      BuyingCurrencyCode.updateValueAndValidity();
      SellingExchangeRate.updateValueAndValidity();
      BuyingExchangeRate.updateValueAndValidity();
      APNNo.updateValueAndValidity();
      VendorId.updateValueAndValidity();
      PartCategoryId.updateValueAndValidity();
    }else{
      SellingPrice.setValidators(null);
      BuyingPrice.setValidators(null);
      SellingCurrencyCode.setValidators(null);
      BuyingCurrencyCode.setValidators(null);
      SellingExchangeRate.setValidators(null);
      BuyingExchangeRate.setValidators(null);
      APNNo.setValidators(null);
      VendorId.setValidators(null);
      PartCategoryId.setValidators(null);
      SellingPrice.updateValueAndValidity();
      BuyingPrice.updateValueAndValidity();
      SellingCurrencyCode.updateValueAndValidity();
      BuyingCurrencyCode.updateValueAndValidity();
      SellingExchangeRate.updateValueAndValidity();
      BuyingExchangeRate.updateValueAndValidity();
      APNNo.updateValueAndValidity();
      VendorId.updateValueAndValidity();
      PartCategoryId.updateValueAndValidity();
    }

  }
  clearVendor(i){
    this.vendorSymbol[i] = '';
    const formGroup = this.PartsItemList.controls[i] as FormGroup;
    formGroup.controls['BuyingPrice'].patchValue('');
    formGroup.controls['BuyingCurrencyCode'].patchValue('');
  }
  vendorChange(i){
    var VendorId = this.PartsItemList.controls[i].get('VendorId').value;
    var vendor = this.VendorsList.filter(u => u.VendorId == VendorId);
    // var CurrencySymbol = vendor && vendor[0] && vendor[0].CurrencySymbol ? vendor[0].CurrencySymbol : '';
    // var VendorCurrencyCode = vendor && vendor[0] && vendor[0].VendorCurrencyCode ? vendor[0].VendorCurrencyCode : '';
    var CurrencySymbol = vendor[0].CurrencySymbol;
    var VendorCurrencyCode = vendor[0].VendorCurrencyCode;
    this.vendorSymbol[i] = CurrencySymbol;
    this.callExchange(VendorCurrencyCode, 'buying', i);
    const formGroup = this.PartsItemList.controls[i] as FormGroup;
    formGroup.controls['BuyingPrice'].patchValue('');
    formGroup.controls['BuyingCurrencyCode'].patchValue(VendorCurrencyCode);
  }

  sellingCurrencyChange(event, i){
    var CurrencyCode = event.target.value;
    this.callExchange(CurrencyCode, 'selling', i);
    const formGroup = this.PartsItemList.controls[i] as FormGroup;
    formGroup.controls['SellingPrice'].patchValue('');
    formGroup.controls['SellingCurrencyCode'].patchValue(CurrencyCode);
  }

  callExchange(CurrencyCode, type, i){
    if(CurrencyCode != ''){
      var postData={
        "LocalCurrencyCode" : CurrencyCode,
        "BaseCurrencyCode" : localStorage.getItem('BaseCurrencyCode')
        }
        this.service.postHttpService(postData,'Exchange').subscribe(response => {
          if (response.status == true) {
            const formGroup = this.PartsItemList.controls[i] as FormGroup;
            if(type == 'buying'){
              this.BuyingExchangeRate[i] = response.responseData.ExchangeRate;
              formGroup.controls['BuyingExchangeRate'].patchValue(response.responseData.ExchangeRate);
              // this.AddForm.patchValue({
              //   BuyingExchangeRate:this.BuyingExchangeRate
              // })
            }else if(type == 'selling'){
              this.SellingExchangeRate[i] = response.responseData.ExchangeRate;
              formGroup.controls['SellingExchangeRate'].patchValue(response.responseData.ExchangeRate);
              // this.AddForm.patchValue({
              //   SellingExchangeRate:this.SellingExchangeRate
              // })
            }
            
           
          } else { }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
    }
    
  }

  public addRepairPart(): void {
    // this.partLoop.push(1)
    const control = <FormArray>this.AddFormControl.PartsItemList;
    control.push(this.initPart());
    // console.log(control);
  }
  get PartsItemList(): FormArray {
    return this.AddForm.get('PartsItemList') as FormArray;
  }

  initPartWithValue(currentValue, index) {
  }
  public initPart(): FormGroup {
    return this.fb.group({
      SerialNo: [''],
      LocationId: ['', Validators.required],
      APNNo: ['', Validators.required],
      VendorId: ['', Validators.required],
      ShopTotalQuantity: [''],
      ShopCurrentQuantity: ['', Validators.required],
      SellingExchangeRate: [''],
      BuyingExchangeRate: [''],
      SellingPrice: ['', Validators.required],
      BuyingPrice: ['', Validators.required],
      SellingCurrencyCode: [''],
      BuyingCurrencyCode: [''],
      // PartCategoryId: ['', Validators.required],
      BaseSellingPrice: [''],
      BaseBuyingPrice: [''],
      ShopPartItemId:[''],
      PartItemType:['', Validators.required],
      PartItemDelivery:[''],
      PartItemDescription:[''],
      ItemAttachment: ['', [
        RxwebValidators.extension({ extensions: ["jpeg", "png", "jpg", "gif"] })
      ]],
      ItemAttachmentList: ['']
    });
    
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

  findInvalidControlsRecursive(AddFormControl:FormGroup|FormArray) {
    var invalidControls:string[] = [];
    let recursiveFunc = (form:FormGroup|FormArray) => {
      Object.keys(form.controls).forEach(field => { 
        const control = form.get(field);
        if (control.invalid) invalidControls.push(field);
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }        
      });
    }
    recursiveFunc(AddFormControl);
    console.log(invalidControls);
  }

  removePartItem(i){
    var PartId = this.PartId; // this.PartsItemList.controls[i].get('PartId').value;
    var ShopPartItemId = this.PartsItemList.controls[i].get('ShopPartItemId').value;
    if (PartId > 0 && ShopPartItemId > 0) {
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
          this.PartsItemList.removeAt(i);
          var params = { 
            PartId: PartId,
            ShopPartItemId: ShopPartItemId,
          }
          this.service.postHttpService(params, 'deleteShopPartItem').subscribe(resData => {
            
          });

        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          Swal.fire({
            title: 'Cancelled',
            text: 'Part is safe:)',
            type: 'error'
          });
        }
      });
    }else{
      this.PartsItemList.removeAt(i);
    }
  }

  addPartQuantity(i, type) {
    var ShopPartItemId = this.PartsItemList.controls[i].get('ShopPartItemId').value;
    var ShopTotalQuantity = this.PartsItemList.controls[i].get('ShopTotalQuantity').value;
    var ShopCurrentQuantity = this.PartsItemList.controls[i].get('ShopCurrentQuantity').value;
    var data = {
      PartId: this.PartId,
      ShopPartItemId: ShopPartItemId,
      PartNo: this.PartNo,
      ShopTotalQuantity: ShopTotalQuantity,
      ShopCurrentQuantity: ShopCurrentQuantity,
      Type: type
    }
    this.modalRef = this.modalService.show(PartQuantityStorePopupComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { data },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.event.subscribe(res => {
      // console.log(res.data.PartId);
      this.reLoad();
    });
  }

  reLoad() {
    // this.router.navigate([this.currentRouter])
    this.patchEditValue()
  }

  patchEditValue(){
    this.editMode = true;

      this.service.postHttpService({ PartId: this.PartId }, 'viewShopPart').subscribe(response => {


        let inventoryData = response.responseData;
        // this.inventoryDatas = inventoryData && inventoryData.dataItems && inventoryData.dataItems.length > 0 ? inventoryData.dataItems : [];
        this.PartNo = inventoryData.data.PartNo;
        var PrimaryVendorId
        PrimaryVendorId = inventoryData.data.PrimaryVendorId
        let obj = this
        this.vendors$.
          subscribe(res => {
            inventoryData.data.PrimaryVendorId.split(",").map(a => {
              if (a != '0') {
                obj.PrimaryVendorId = res.find(b => b.VendorId == a);
                return obj.PrimaryVendorId
              }
            })
            if (obj.PrimaryVendorId != '0' && obj.PrimaryVendorId != '' && obj.PrimaryVendorId != null) {
              this.AddForm.patchValue({
                PrimaryVendorId:
                  inventoryData.data.PrimaryVendorId.split(",").map(a => {
                    if (a != '0') {
                      return res.find(b => b.VendorId == a);
                    }
                  }),
              })
            }
          }
          );
        // this.CurrencySymbol=this.CurrencyList.find(a=>a.CurrencyCode==inventoryData.data.LocalCurrencyCode).CurrencySymbol
        this.IsEcommerceProduct = (inventoryData.data.IsEcommerceProduct ? inventoryData.data.IsEcommerceProduct : 0).toString();
        this.AddForm.patchValue({
          PartId: this.PartId,
          PartNo: inventoryData.data.PartNo,
          Description: inventoryData.data.Description,
          ManufacturerId: inventoryData.data.ManufacturerId,
          ManufacturerPartNo: inventoryData.data.ManufacturerPartNo,
          UnitType: inventoryData.data.UnitType,
          StoreSince: this.toDate(inventoryData.data.StoreSince),
          IsActive: inventoryData.data.IsActive,
          TaxType: inventoryData.data.TaxType,
          // SellingPrice: inventoryData.data.SellingPrice || 0,
          // SellingPriceDescription: inventoryData.data.SellingPriceDescription,
          Price: inventoryData.data.Price,
          // BuyingPrice: inventoryData.data.BuyingPrice,
          // BuyingPriceDescription: inventoryData.data.BuyingPriceDescription,
          IsNewOrRefurbished: (inventoryData.data.IsNewOrRefurbished ? inventoryData.data.IsNewOrRefurbished : 0).toString(),

          LocalCurrencyCode: localStorage.getItem('BaseCurrencyCode'),
          ExchangeRate: inventoryData.data.ExchangeRate,
          BaseCurrencyCode: localStorage.getItem('BaseCurrencyCode'),
          BasePrice: inventoryData.data.BasePrice,
          // SellingPrice: inventoryData.data.SellingPrice,
          // SellingCurrencyCode: inventoryData.data.SellingCurrencyCode,
          // APNNo: inventoryData.data.APNNo,
          // VendorId: inventoryData.data.VendorId,
          // IsEcommerceProduct: (inventoryData.data.IsEcommerceProduct ? inventoryData.data.IsEcommerceProduct : 0).toString(),
          PartCategoryId: inventoryData.data.PartCategoryId,
          // BuyingPrice: inventoryData.data.BuyingPrice,
          // ShopTotalQuantity: inventoryData.data.ShopTotalQuantity,
          // ShopCurrentQuantity: inventoryData.data.ShopCurrentQuantity,
          // BaseSellingPrice:inventoryData.data.BaseSellingPrice,
          // BaseBuyingPrice:inventoryData.data.BaseBuyingPrice,

          // SellingExchangeRate:inventoryData.data.SellingExchangeRate,
          // BuyingExchangeRate:inventoryData.data.BuyingExchangeRate,
          // BuyingCurrencyCode:inventoryData.data.BuyingCurrencyCode,

          // PartsItemList: this.fb.array([
          //   this.fb.group({
          //     SerialNo: [''],
          //     Location: [''],
          //     APNNo: [''],
          //     VendorId: [''],
          //     ShopTotalQuantity: [''],
          //     ShopCurrentQuantity: [''],
          //     SellingExchangeRate: [''],
          //     BuyingExchangeRate: [''],
          //     SellingPrice: [''],
          //     BuyingPrice: [''],
          //     SellingCurrencyCode: [''],
          //     BuyingCurrencyCode: [''],
          //     PartCategoryId: [''],
          //     BaseSellingPrice: [''],
          //     BaseBuyingPrice: [''],
          //   })
          // ]),

          //PrimaryVendorId:inventoryData.data.PrimaryVendorId ? inventoryData.data.PrimaryVendorId.split(",").map(a => Number(a)) : []
        })
      if(inventoryData && inventoryData.dataItems && inventoryData.dataItems.length > 0){
        const control = <FormArray>this.AddFormControl.PartsItemList;
        
        let formGroup: FormGroup = new FormGroup({});
        inventoryData.dataItems.forEach((currentValue, index) => {
          if(index > 0){
            this.addRepairPart();
          }
          this.SellingExchangeRate[index] = currentValue.SellingExchangeRate;
          this.BuyingExchangeRate[index] = currentValue.BuyingExchangeRate;
          this.ImagesItemList[index] = currentValue.ItemAttachment;
          this.vendorSymbol[index] = currentValue.VendorCurrencySymbol;
          
          const imgItem = [];
          const ItemAttachment = currentValue.ItemAttachment;
          for (var x in ItemAttachment) {
            imgItem.push({
              "IdentityType": "0", // For RR
              "path": ItemAttachment[x].ImagePath,
              "originalname": ItemAttachment[x].ImageOriginalFile,
              "mimetype": ItemAttachment[x].ImageMimeType,
              "size": ItemAttachment[x].ImageSize,
              "PartImageId": ItemAttachment[x].PartImageId,
              "IsDeleted": 0,
            });
            this.ImagesItemList[index] = imgItem;
            // console.log('ImagesList', this.ImagesList)
          }
          var formGroup = this.PartsItemList.controls[index] as FormGroup;
          formGroup.controls['SerialNo'].patchValue(currentValue.SerialNo);
          formGroup.controls['LocationId'].patchValue(currentValue.LocationId);
          formGroup.controls['APNNo'].patchValue(currentValue.APNNo);
          formGroup.controls['VendorId'].patchValue(currentValue.VendorId);
          formGroup.controls['ShopTotalQuantity'].patchValue(currentValue.ShopTotalQuantity);
          formGroup.controls['ShopCurrentQuantity'].patchValue(currentValue.ShopCurrentQuantity);
          formGroup.controls['SellingExchangeRate'].patchValue(currentValue.SellingExchangeRate);
          formGroup.controls['BuyingExchangeRate'].patchValue(currentValue.BuyingExchangeRate);
          formGroup.controls['SellingPrice'].patchValue(currentValue.SellingPrice);
          formGroup.controls['BuyingPrice'].patchValue(currentValue.BuyingPrice);
          formGroup.controls['SellingCurrencyCode'].patchValue(currentValue.SellingCurrencyCode);
          formGroup.controls['BuyingCurrencyCode'].patchValue(currentValue.BuyingCurrencyCode);
          // formGroup.controls['PartCategoryId'].patchValue(currentValue.PartCategoryId);
          formGroup.controls['BaseSellingPrice'].patchValue(currentValue.BaseSellingPrice);
          formGroup.controls['BaseBuyingPrice'].patchValue(currentValue.BaseBuyingPrice);
          formGroup.controls['ShopPartItemId'].patchValue(currentValue.ShopPartItemId);
          formGroup.controls['PartItemType'].patchValue(currentValue.PartItemType);
          formGroup.controls['PartItemDelivery'].patchValue(currentValue.PartItemDelivery);
          formGroup.controls['PartItemDescription'].patchValue(currentValue.PartItemDescription);
        });

        
      }
        

        if (inventoryData.data.LocalCurrencyCode == localStorage.getItem('BaseCurrencyCode')) {
          this.AddForm.patchValue({
            ExchangeRate: 1,
          })
          this.ExchangeRate = 1
        } else {
          this.ExchangeRate = inventoryData.data.ExchangeRate
        }


        this.service.postHttpService({ PartId: this.PartId }, 'ViewPartImages').subscribe(PartImages => {
          this.imageresult = PartImages.responseData;
          for (var x in this.imageresult) {
            this.ImagesList.push({
              "IdentityType": "0", // For RR
              "path": this.imageresult[x].ImagePath,
              "originalname": this.imageresult[x].ImageOriginalFile,
              "mimetype": this.imageresult[x].ImageMimeType,
              "size": this.imageresult[x].ImageSize,
              "PartImageId": this.imageresult[x].PartImageId,
              "IsDeleted": 0,
            });
            // console.log('ImagesList', this.ImagesList)
          }
        });
      });
  }

  checkShowStockIn(i){
    var ShopPartItemId = this.PartsItemList.controls[i].get('ShopPartItemId').value;
    if(ShopPartItemId){
      return true;
    }else{
      return false;
    }
  }

  getStoreLocation(){
    this.service.getHttpService('ddStoreLocation').subscribe(response => {
      this.StoreLocation = response.responseData;
    });
  }

  fileProgressMultipleItem(event: any, i) {

    this.fileData = event.target.files[0];
    const formData = new FormData();
    //var fileData = event.target.files;     
    var filesarray = event.target.files;
    for (var k = 0; k < filesarray.length; k++) {
      formData.append('files', filesarray[k]);
    }
    console.log(this.ImagesItemList[i])
    this.spinneritem = true;
    // this.PartsItemList.controls[i].get('ShopPartItemId').value;
    // if (this.AddFormControl.ItemAttachment.valid == true) {
    if (this.PartsItemList.controls[i].get('ItemAttachment').valid == true) {
      this.service.postHttpImageService(formData, "PartImageupload").subscribe(response => {
        this.imageresult = response.responseData;
        const imgItem = this.ImagesItemList && this.ImagesItemList[i] ? this.ImagesItemList[i] : [];
        for (var x in this.imageresult) {
          imgItem.push({
            "IdentityType": "0", // For RR
            "path": this.imageresult[x].location,
            "originalname": this.imageresult[x].originalname,
            "mimetype": this.imageresult[x].mimetype,
            "size": this.imageresult[x].size,
            "IsDeleted": 0
          });
          this.ImagesItemList[i] = imgItem;
          console.log('ImagesItemList', this.ImagesItemList[i])
        }
        console.log(this.PartsItemList.controls[i]);
        var formGroup = this.PartsItemList.controls[i] as FormGroup;
        formGroup.controls['ItemAttachmentList'].patchValue(this.ImagesItemList[i]);
        this.spinneritem = false;

        this.cd_ref.detectChanges();
      }, error => console.log(error));

    }else{
      console.log('ImagesItemList', this.ImagesItemList[i])
    }
  }

  removeImageItem(i,j) {
    this.ImagesItemList[i][j].IsDeleted = 1;
    var formGroup = this.PartsItemList.controls[i] as FormGroup;
    formGroup.controls['ItemAttachmentList'].patchValue(this.ImagesItemList[i]);
  }

  callStockLog(i) {
    var ShopPartItemId = this.PartsItemList.controls[i].get('ShopPartItemId').value;
    var postdata = {
      ShopPartItemId: ShopPartItemId
    }
    this.service.postHttpImageService(postdata, 'getPartsStockLogs').subscribe(response => {
      var logs = response.responseData;
      this.modalRef = this.modalService.show(StockLogComponent,
        {
          backdrop: 'static',
          ignoreBackdropClick: false,
          initialState: {
            data: { logs },
          },
        });
      this.modalRef.content.closeBtnName = 'Close';
    });
    
  }

  onChangeSearch(val: string) {
    if (val) {
      this.isLoading = true;
      var postData = {
        "PartNo": val
      }
      this.service.postHttpService(postData, "getonSearchPartByPartNo").subscribe(response => {
        if (response.status == true) {
          this.partsData = response.responseData.filter(a => a.PartNo.toLowerCase().includes(val.toLowerCase()));
          console.log(this.partsData);
        }
        else {
          console.log("else");
        }

        this.isLoading = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoading = false; });

    }
  }

  onFocused(e) {
    // console.log(this.model.PartNo);
  }

  selectEvent(item) {
    // console.log(this.model.PartNo);
    // console.log(item);
    if(item && item.PartId && item.PartId > 0){
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to move this part to store?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Move it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success mt-2',
        cancelButtonClass: 'btn btn-danger ml-2 mt-2',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          var postData = {
            PartId: item.PartId
          }
          this.service.postHttpService(postData, "checkPartId").subscribe(response => {
            if (response.status == true) {
              if(response.responseData.Status == 1){
                this.router.navigate(['/admin/shop-parts-edit'], { state: { PartId: response.responseData.PartId } });
              }else if(response.responseData.Status == 0){
                this.model.PartNo = '';
                Swal.fire({
                  title: 'Info!',
                  text: 'Part # '+response.responseData.PartNo+' is already in the store list!',
                  type: 'info'
                });
              }else{
                this.model.PartNo = '';
                Swal.fire({
                  title: 'Error!',
                  text: 'Something went wrong! Please try again later.',
                  type: 'error'
                });
              }
            }
          });

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.model.PartNo = '';
          // Swal.fire({
          //   title: 'Cancelled',
          //   text: 'Part is safe:)',
          //   type: 'error'
          // });
        }
      });
      
    }
  }

  clearEvent(e){
    console.log(this.model.PartNo);
  }
  
}
