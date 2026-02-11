// 
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../../inventory/local-storage.service';
import {
  SalesOrder_Status, SalesOrder_Type, warranty_list, SalesOrder_notes, CONST_IDENTITY_TYPE_SO,
  CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, attachment_thumb_images, CONST_ShipAddressType, CONST_BillAddressType, CONST_ContactAddressType, Const_Alert_pop_title, Const_Alert_pop_message
} from 'src/assets/data/dropdown';
@Component({
  selector: 'app-product-single',
  templateUrl: './product-single.component.html',
  styleUrls: ['./product-single.component.scss'],
  providers: [NgxSpinnerService]
})
export class ProductSingleComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  product: any;
  Quantity: any = 1;
  loginType: any;
  CustomerId: any;
  stockCount: any = 19;
  // images = [
  //   'https://picsum.photos/300/200?random=6',
  //   'https://picsum.photos/300/200?random=7',
  //   'https://picsum.photos/300/200?random=8',
  //   'https://picsum.photos/300/200?random=9',
  //   'https://picsum.photos/300/200?random=2',
  //   'https://picsum.photos/300/200?random=3',
  //   'https://picsum.photos/300/200?random=1',
  // ];
  images: any;
  height = 0;
  productId: any;
  ShopPartItemId: any;
  APNNo: string;
  private APN = new BehaviorSubject<string>('');
  APNT = this.APN.asObservable();
  IsAddToCart: any;
  constructor(public router: Router, private commonService: CommonService, private localStorageService: LocalStorageService, private spinner: NgxSpinnerService,private route: ActivatedRoute) {
    this.product = history.state.product ? history.state.product : '';
    this.loginType = localStorage.getItem("IdentityType");
    this.CustomerId = localStorage.getItem("IdentityId");
    this.productId = this.route.snapshot.params.id;
    this.ShopPartItemId = this.route.snapshot.params.ShopPartItemId;
    this.IsAddToCart = this.commonService.permissionCheck("AddTocart", CONST_VIEW_ACCESS);
  }

  ngOnInit() {
    this.APNT.subscribe(val => {
      this.breadCrumbItems = [{ label: 'Shop', path: '#/admin/shop/product-list' }, { label: 'APN:' + val, path: '/', active: true }];
    });
    
    console.log(this.APNT);
    if ((this.product == '' && !this.productId) || !this.ShopPartItemId) {
      this.router.navigate(['/admin/shop/product-list'])
    }
    if (this.loginType != 1) {
      this.CustomerId = this.localStorageService.getData('adminOnlineStoreCustomerId');
    }
    this.getProduct();
  }

  getProduct(){
    var postData = {
      CustomerId: this.CustomerId,
      PartId: this.productId,
      ShopPartItemId: this.ShopPartItemId
    };
    this.commonService.postHttpService(postData, 'getEcommerceProductView').subscribe(response => {
      if (response.status == true) {
        this.product = response.responseData;
        this.images = response.responseData.images;
        this.APN.next(response.responseData.APNNo); 
      }else{
        this.product = '';
      }
    });
  }

  async getCartProductQuantity(product) {
    var postData = {
      CustomerId: this.CustomerId
    };

    return new Promise((resolve, reject) => {
      this.commonService.postHttpService(postData, 'getCart').subscribe(response => {
        if (response.status == true) {
          if (response.responseData && response.responseData.BasketItem.length > 0) {
            var res = response.responseData.BasketItem.filter(a => a.PartId == product.PartId);
            if (res && res.length > 0) {
              resolve(res[0].Quantity);
            } else {
              resolve(0);
            }
          } else {
            resolve(0);
          }
        } else {
          resolve(0);
        }
      });
    });
  }

  async addToCart(product) {
    this.spinner.show();
    var overallQuantity = await this.getCartProductQuantity(product);
    console.log(overallQuantity);
    overallQuantity = this.Quantity + overallQuantity;
    console.log(overallQuantity);
    if (product.ShopCurrentQuantity >= overallQuantity) {
      // if(product.ShopCurrentQuantity > this.Quantity){

      var VatTaxPercentage = 0;
      if (product.SellingCurrencyCode === product.CustomerCurrencyCode) {
        VatTaxPercentage = product.VatTaxPercentage;
      }
      var TotalTax = ((parseFloat(product.ConvertedPrice) * VatTaxPercentage) / 100);
      var BaseTotalTax = ((parseFloat(product.OriginalPrice) * VatTaxPercentage) / 100);

      var ConvertedPriceWithTax = product.ConvertedPrice + TotalTax;
      var OriginalPriceWithTax = product.OriginalPrice + BaseTotalTax;
      var Price = (parseFloat(ConvertedPriceWithTax) * this.Quantity).toFixed(2);
      var BasePrice = (parseFloat(OriginalPriceWithTax) * this.Quantity).toFixed(2);
      // var Price = (parseFloat(product.ConvertedPrice) * this.Quantity).toFixed(2);
      // var BasePrice = (parseFloat(product.OriginalPrice) * this.Quantity).toFixed(2);
      var postData = {
        CustomerId: product.CustomerId,
        CustomerBillToId: product.CustomerBillToId,
        CustomerShipToId: product.CustomerShipToId,
        GrandTotal: Price,
        LocalCurrencyCode: product.CustomerCurrencyCode,
        ExchangeRate: product.ExchangeRate,
        BaseCurrencyCode: product.BaseCurrencyCode,
        BaseGrandTotal: BasePrice,
        OrderStatus: 0,
        ShopCurrentQuantity: product.ShopCurrentQuantity,
        IsAddedByAdmin: this.loginType == 1 ? 0 : 1,
        Tax: (TotalTax * this.Quantity).toFixed(2),
        BaseTax: (BaseTotalTax * this.Quantity).toFixed(2),
        BasketItem: [{
          PartId: product.PartId,
          ShopPartItemId: product.ShopPartItemId,
          LocationId: product.LocationId,
          PartNo: product.PartNo,
          Quantity: this.Quantity,
          Rate: product.ConvertedPrice,
          BaseRate: product.OriginalPrice,
          // ToDo Start
          Tax: (TotalTax * this.Quantity).toFixed(2),
          BaseTax: (BaseTotalTax * this.Quantity).toFixed(2),
          ItemTaxPercent: VatTaxPercentage,
          ShippingCharge: 0,
          BaseShippingCharge: 0,
          // ToDo End
          ItemExchangeRate: product.ExchangeRate,
          ItemLocalCurrencyCode: product.CustomerCurrencyCode,
          ItemBaseCurrencyCode: product.BaseCurrencyCode,
          Price: Price,
          BasePrice: BasePrice
        }],

      }
      console.log(postData);
      this.commonService.postHttpService(postData, 'addToCart').subscribe(response => {
        if (response.status == true) {
          // window.location.reload();
          this.commonService.getCartCount();
          this.spinner.hide();
          Swal.fire({
            position: 'top-end',
            type: 'success',
            title: product.PartNo + ' has been added to your cart!',
            showConfirmButton: false,
            timer: 1400
          });
        } else {
          this.spinner.hide();
          Swal.fire(
            'Warning!',
            response.message,
            'error'
          )
        }
      });
    } else {
      this.spinner.hide();
      Swal.fire(
        'Warning!',
        'Maximum Stock reach!',
        'error'
      )
    }
  }

  buttonMinus() {
    if (this.Quantity > 1) {
      this.Quantity = this.Quantity - 1;
    }

  }

  buttonPlus(stockCount) {
    if (this.Quantity < stockCount) {
      this.Quantity = this.Quantity + 1;
    } else {
      Swal.fire({
        title: 'Warning!',
        text: 'Only ' + stockCount + ' stocks available.',
        type: 'info'
      });
    }

  }

}
