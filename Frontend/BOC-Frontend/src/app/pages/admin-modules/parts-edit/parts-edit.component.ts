/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { data } from 'jquery';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { join } from 'path';
import { concat, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message, CONST_COST_HIDE_VALUE, CUSTOMER_GROUP_ID_FORD } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parts-edit',
  templateUrl: './parts-edit.component.html',
  styleUrls: ['./parts-edit.component.scss']
})
export class PartsEditComponent implements OnInit {
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

  selectedRfid: string = "";
  subscription: Subscription;
  rfIdReaderForm: FormGroup;
  PartId: any;
  statusFilterId: any;
  fileData: any;
  imageresult: any;
  rfidEnabled: boolean = false;

  RRId;

  ExchangeRate
  CurrencySymbol
  BaseCurrencySymbol
  vendors$: Observable<any> = of([]);
  vendorsInput$ = new Subject<string>();
  loadingVendors: boolean = false;
  VendorsList: any[] = [];
  CurrencyList: any = []
  PrimaryVendorId;
  BuyingExchangeRate: any = 1;
  vendorSymbol: any;
  SellingExchangeRate: any = 1;
  IsEcommerceProduct: any;
  CustomerGroupId
  constructor(
    private fb: FormBuilder,
    private service: CommonService,
    private router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private cd_ref: ChangeDetectorRef,
  ) {

    this.AddForm = this.fb.group({
      PartId: [""],
      PartNo: ['', Validators.required],
      Description: [''],
      ManufacturerId: [''],
      ManufacturerPartNo: [''],
      UnitType: ['', Validators.required],
      StoreSince: [null, Validators.required],
      PrimaryVendorId: [''],
      IsNewOrRefurbished: [''],
      IsActive: [true],
      TaxType: ['', Validators.required],
      // SellingPrice: ['0', Validators.required],
      // BaseSellingPrice:[''],
      // SellingPriceDescription: [''],
      Price: ['', Validators.required],
      BasePrice: [''],
      // BuyingPrice: [''],
      // BaseBuyingPrice:[''],
      // BuyingPriceDescription: [''],
      SellingPrice: [''],
      BuyingPrice: [''],
      SellingCurrencyCode: [''],
      BuyingCurrencyCode: [''],
      LocalCurrencyCode: [''],
      ExchangeRate: ['1'],
      SellingExchangeRate: [''],
      BuyingExchangeRate: [''],
      BaseCurrencyCode: [''],
      Attachment: ['', [
        RxwebValidators.extension({ extensions: ["jpeg", "png", "jpg", "gif"] })
      ]],
      APNNo: [''],
      VendorId: [''],
      IsEcommerceProduct: [0],
      PartCategoryId: [''],
      ShopTotalQuantity: [''],
      ShopCurrentQuantity: ['']
      
    })
  }

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
    // console.log(this.RRId)

    this.loadVendors();
    this.loadCategory();
    this.getVendorActiveList();
    this.getManufacturerList();
    this.getCurrencyList();
    this.getWarehouseList();
    this.getWarehouseSub1List();
    this.getWarehouseSub2List();
    this.getWarehouseSub3List();
    this.getWarehouseSub4List();

    if (this.PartId) {
      this.editMode = true;

      this.service.postHttpService({ PartId: this.PartId }, 'getInventoryView').subscribe(response => {


        let inventoryData = response.responseData;
        this.CustomerGroupId=inventoryData.data.CustomerGroupId
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
          SellingPrice: inventoryData.data.SellingPrice,
          SellingCurrencyCode: inventoryData.data.SellingCurrencyCode,
          APNNo: inventoryData.data.APNNo,
          VendorId: inventoryData.data.VendorId,
          IsEcommerceProduct: (inventoryData.data.IsEcommerceProduct ? inventoryData.data.IsEcommerceProduct : 0).toString(),
          PartCategoryId: inventoryData.data.PartCategoryId,
          BuyingPrice: inventoryData.data.BuyingPrice,
          ShopTotalQuantity: inventoryData.data.ShopTotalQuantity,
          ShopCurrentQuantity: inventoryData.data.ShopCurrentQuantity,
          BaseSellingPrice:inventoryData.data.BaseSellingPrice,
          BaseBuyingPrice:inventoryData.data.BaseBuyingPrice,

          SellingExchangeRate:inventoryData.data.SellingExchangeRate,
          BuyingExchangeRate:inventoryData.data.BuyingExchangeRate,
          BuyingCurrencyCode:inventoryData.data.BuyingCurrencyCode,

          //PrimaryVendorId:inventoryData.data.PrimaryVendorId ? inventoryData.data.PrimaryVendorId.split(",").map(a => Number(a)) : []
        })

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
  onBuyingPriceChange(e){
    this.AddForm.patchValue({
      BaseBuyingPrice: ((e.target.value)*this.BuyingExchangeRate).toFixed(2),
    })
  }
  onSellingPriceChange(e){
    console.log(e.target.value);
    this.AddForm.patchValue({
      BaseSellingPrice: ((e.target.value)*this.SellingExchangeRate).toFixed(2),
    })
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
    if (this.AddForm.valid) {

      let body = { ...this.AddForm.value };
      body.StoreSince = this.dateToString(body.StoreSince);
      let api = "addPart";

      if (body) {
        this.PrimaryVendorId = body.PrimaryVendorId
        if (this.PrimaryVendorId != '0' && this.PrimaryVendorId != '' && this.PrimaryVendorId != null && this.PrimaryVendorId != undefined) {
          body.PrimaryVendorId = body.PrimaryVendorId.map(a => a.VendorId).join()
        }

        if (this.ImagesList.length > 0) {
          body.ImagesList = this.ImagesList;
        }

        if (body.PartId) {
          api = "UpdatePart";
        } else {
          if (body.ImagesList)
            body.ImagesList = body.ImagesList.filter(a => !a.IsDeleted);
        }

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
            Swal.fire({
              title: 'Error!',
              text: 'Record could not be saved!',
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
      if(this.IsEcommerceProduct == 1){
        if(this.CustomerGroupId==CUSTOMER_GROUP_ID_FORD){
          this.navCtrl.navigate('/admin/PartsList-fordstore');
        }else{
          this.navCtrl.navigate('/admin/PartsList-amazonstore');
        }
      }else{
        this.navCtrl.navigate('/admin/total-PartsList');
      }
    } else {
      this.router.navigate(['/admin/repair-request/edit'], { state: { RRId: this.RRId } });
    }
  }

  loadVendors() {
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
  vendorChange(event){
    // console.log(event.target.value)
    var vendor = this.VendorsList.filter(u => u.VendorId == event.target.value);
    this.vendorSymbol = vendor[0].CurrencySymbol;
    this.callExchange(vendor[0].VendorCurrencyCode, 'buying');
    this.AddForm.patchValue({
      BuyingCurrencyCode: vendor[0].VendorCurrencyCode,
      BuyingPrice: ''
    })
  }

  sellingCurrencyChange(event){
    var CurrencyCode = event.target.value;
    this.callExchange(CurrencyCode, 'selling');
    this.AddForm.patchValue({
      SellingCurrencyCode: CurrencyCode,
      SellingPrice: ''
    })
  }

  callExchange(CurrencyCode, type){
    var postData={
      "LocalCurrencyCode" : CurrencyCode,
      "BaseCurrencyCode" : localStorage.getItem('BaseCurrencyCode')
      }
      this.service.postHttpService(postData,'Exchange').subscribe(response => {
        if (response.status == true) {
          if(type == 'buying'){
            this.BuyingExchangeRate = response.responseData.ExchangeRate;
            this.AddForm.patchValue({
              BuyingExchangeRate:this.BuyingExchangeRate
            })
          }else if(type == 'selling'){
            this.SellingExchangeRate = response.responseData.ExchangeRate;
            this.AddForm.patchValue({
              SellingExchangeRate:this.SellingExchangeRate
            })
          }
          
         
        } else { }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
  }
}
