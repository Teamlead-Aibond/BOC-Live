/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../../inventory/local-storage.service';
import {
  SalesOrder_Status, SalesOrder_Type, warranty_list, SalesOrder_notes, CONST_IDENTITY_TYPE_SO,
  CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, attachment_thumb_images, CONST_ShipAddressType, CONST_BillAddressType, CONST_ContactAddressType, Const_Alert_pop_title, Const_Alert_pop_message
} from 'src/assets/data/dropdown';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [NgxSpinnerService]
})
export class ProductListComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  productList: any;
  loginType: any;
  CustomerId: any;
  viewResult: any;
  Quantity: any = 1;
  filterAPNNo: any;
  filterPartNo: any;
  filterExcludeOutOfStock: boolean = false;
  manufacturerList: any;
  selectedManufacturers: any[] = [];
  checkedIDs: any[];
  selectedItemsList: any = [];
  categoryrList: any;
  categorySelectedItemsList: any[];
  showSpinner: boolean = false;
  customerList: any;
  defaultDisplayDataLength: any = 9;
  loadMoreLength: any = 9;
  displayData: any;
  displayLoadMore: boolean = false;
  IsAddToCart: any;
  IsOnlineShop: any;
  constructor(private commonService: CommonService, public router: Router, private spinner: NgxSpinnerService,
    private localStorageService: LocalStorageService) {
    this.loginType = localStorage.getItem("IdentityType");
    this.CustomerId = localStorage.getItem("IdentityId");
    this.IsAddToCart = this.commonService.permissionCheck("AddTocart", CONST_VIEW_ACCESS);
    this.IsOnlineShop = this.commonService.permissionCheck("OnlineShop", CONST_VIEW_ACCESS);

  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Shop', path: '/', active: true }];
    if (this.IsOnlineShop || this.loginType == 1) {
      this.getCustomerList();
      this.getManufacturerList();
      this.getPartCategoryList();
      this.getProducts();
      if (this.loginType == 1) {
        this.getProducts();
        // this.getManufacturerList();
        // this.getPartCategoryList();
      } else {
        this.CustomerId = this.localStorageService.getData('adminOnlineStoreCustomerId');
        if (this.CustomerId > 0) {
          this.getProducts();
          // this.getManufacturerList();
          // this.getPartCategoryList();
        }
        // else{
        //   Swal.fire(
        //     'Warning!',
        //     'Please choose customer to continue the shopping.',
        //     'error'
        //   )
        // }

      }
    }

  }

  selectCustomer() {
    if (this.CustomerId > 0) {
      this.localStorageService.saveData('adminOnlineStoreCustomerId', this.CustomerId);
      this.getProducts();
      // this.getManufacturerList();
      // this.getPartCategoryList();
    } else {
      this.localStorageService.removeData('adminOnlineStoreCustomerId');
      this.CustomerId = '';
    }

  }

  getProducts() {
    var postData = {
      CustomerId: this.CustomerId
    };
    this.commonService.postHttpService(postData, 'getEcommerceProduct').subscribe(response => {
      if (response.status == true) {
        this.productList = response.responseData;
        this.loadMore();
      } else {
        this.productList = [];
        this.displayData = [];
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

  async addToCart(product, redirect) {
    this.spinner.show();
    var overallQuantity = await this.getCartProductQuantity(product);
    // console.log(overallQuantity);
    overallQuantity = this.Quantity + overallQuantity;
    // console.log(overallQuantity);
    if (product.ShopCurrentQuantity >= overallQuantity) {
      var postData1 = {
        CustomerId: product.CustomerId
      }
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
        IsAddedByAdmin: this.loginType === 1 ? 0 : 1,
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
      this.commonService.postHttpService(postData, 'addToCart').subscribe(response => {
        if (response.status == true) {
          // window.location.reload();
          this.commonService.getCartCount();
          this.spinner.hide();
          if (redirect) {
            this.router.navigate(['/admin/shop/cart']);
          } else {
            Swal.fire({
              position: 'top-end',
              type: 'success',
              title: product.PartNo + ' has been added to your cart!',
              showConfirmButton: false,
              timer: 1400
            });
          }
        } else {
          console.log(response.message)
          this.spinner.hide();
          Swal.fire(
            'Warning!',
            'Please choose customer to continue the shopping.',
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

  productViewPage(product) {
    // this.router.navigate(['/admin/shop/product-single'], { state: {product: product}});
    this.router.navigate(['/admin/shop/product-single/', product.PartId, product.ShopPartItemId]);
  }

  getManufacturerList() {
    this.commonService.getHttpService('getManufacturerListWithChecked').subscribe(response => {
      this.manufacturerList = response.responseData.map(function (value) {
        return { title: value.VendorName, "VendorId": value.VendorId }
      });
    });
  }

  getPartCategoryList() {
    var postDate = {};
    this.commonService.postHttpService(postDate, 'getPartCategory').subscribe(response => {
      this.categoryrList = response.responseData
      // this.categoryrList = response.responseData.map(function (value) {
      //   return { title: value.VendorName, "VendorId": value.VendorId }
      // });
    });
  }

  changeSelection() {
    this.selectedItemsList = this.selectedManufacturers;
    this.getProductsWithFilter();
    console.log(this.selectedItemsList);
  }

  fetchSelectedItems() {
    this.selectedItemsList = this.manufacturerList.filter((value, index) => {
      return value.isChecked
    });
  }

  fetchCheckedIDs() {
    this.selectedItemsList = []
    this.manufacturerList.forEach((value, index) => {
      if (value.isChecked) {
        this.selectedItemsList.push(value.VendorId);
      }
    });
    this.getProductsWithFilter();
  }

  changeCategorySelection() {
    this.fetchCheckedCategoryIDs();
  }

  fetchCheckedCategoryIDs() {
    this.categorySelectedItemsList = []
    this.categoryrList.forEach((value, index) => {
      if (value.isChecked) {
        this.categorySelectedItemsList.push(value.PartCategoryId);
      }
    });
    this.getProductsWithFilter();
  }


  filter(event: any) {
    this.getProductsWithFilter();
  }

  getProductsWithFilter() {
    if (this.CustomerId > 0) {
      this.spinner.show();
      this.showSpinner = true;
      var postData = {
        CustomerId: this.CustomerId,
        PartNo: this.filterPartNo,
        APNNo: this.filterAPNNo,
        ExcludeOutOfStock: this.filterExcludeOutOfStock,
        ManufacturIds: this.selectedItemsList,
        CategoryIds: this.categorySelectedItemsList
      };
      this.commonService.postHttpService(postData, 'getEcommerceProduct').subscribe(response => {
        if (response.status == true) {
          this.productList = response.responseData;
          this.loadMore();
          this.spinner.hide();
          this.showSpinner = false;
        } else {
          this.productList = [];
          this.displayData = [];
          this.spinner.hide();
          this.showSpinner = false;
        }
      });
    }
  }

  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData;
      // this.CustomerName = this.customerList.find(a => a.CustomerId == this.CustomerId).CompanyName

    });
  }

  loadMore(size = 0) {
    this.displayLoadMore = true;
    // console.log(this.defaultDisplayDataLength);
    this.defaultDisplayDataLength = this.defaultDisplayDataLength + size;
    var newLength = this.defaultDisplayDataLength;
    if (newLength > this.productList.length) {
      newLength = this.productList.length;
      this.displayLoadMore = false;
    }
    // console.log(this.displayLoadMore);
    // console.log(newLength);
    // console.log(this.productList.length);
    this.displayData = this.productList.slice(0, newLength);
  }




}
