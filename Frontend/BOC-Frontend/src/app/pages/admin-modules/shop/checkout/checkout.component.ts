/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/core/services/common.service';
import { LocalStorageService } from '../../inventory/local-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  CONST_AH_Group_ID, SalesOrder_Status, SalesOrder_Type, warranty_list, SalesOrder_notes, CONST_IDENTITY_TYPE_SO,
  CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, attachment_thumb_images, CONST_ShipAddressType, CONST_BillAddressType, CONST_ContactAddressType, Const_Alert_pop_title, Const_Alert_pop_message
} from 'src/assets/data/dropdown';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [NgxSpinnerService]
})
export class CheckoutComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  loginType: any;
  CustomerId: any;
  cartList: any;
  BillAddressList: any;
  ShipAddressList: any;
  Billing: any;
  Shipping: any;
  AddressList: any;
  CustomerPONew: any;
  CustomerPONo: any;
  CustomerBlanketPOId: any;
  BasketItem: any;
  BlanketPONo: any;
  btnDisabled: boolean = false;
  IsPlaceOrder: any;
  constructor(public navCtrl: NgxNavigationWithDataComponent, public router: Router, private commonService: CommonService,
    private localStorageService: LocalStorageService, private spinner: NgxSpinnerService) {
    this.CustomerPONew = history.state.data ? history.state.data : '';
    this.loginType = localStorage.getItem("IdentityType");
    this.CustomerId = localStorage.getItem("IdentityId");
    this.IsPlaceOrder = this.commonService.permissionCheck("PlaceShopOrder", CONST_VIEW_ACCESS);

  }

  ngOnInit() {
    if (this.CustomerPONew === '') {
      this.router.navigate(["/admin/shop/cart"]);
    }
    this.breadCrumbItems = [{ label: 'Shop', path: '#/admin/shop/product-list' }, { label: 'Cart', path: '#/admin/shop/cart' }, { label: 'Checkout', path: '/', active: true }];
    if (this.loginType != 1) {
      this.CustomerId = this.localStorageService.getData('adminOnlineStoreCustomerId');
    }
    this.getCart();
    this.getShipAddressList();
    this.getBillAddressList();
    this.CustomerBlanketPOId = this.CustomerPONew.CustomerBlanketPOId;
    this.CustomerPONo = this.CustomerPONew.CustomerPONo;
    this.BlanketPONo = this.CustomerPONew.BlanketPONo;
    console.log(this.CustomerPONew);
  }


  callRedirect() {
    this.btnDisabled = true;
    this.spinner.show();
    console.log(history.state.CustomerPO);
    console.log(this.CustomerPONew);
    console.log(this.CustomerBlanketPOId);
    console.log(this.CustomerPONo);

    var postDate = {
      EcommerceBasketId: this.cartList.BasketInfo[0].EcommerceBasketId,
      CustomerBlanketPOId: this.CustomerBlanketPOId ? this.CustomerBlanketPOId : 0,
      CustomerPONo: this.CustomerPONo ? this.CustomerPONo : this.BlanketPONo
    }
    // this.CustomerPO.EcommerceBasketId = this.cartList.BasketInfo[0].EcommerceBasketId
    this.commonService.postHttpService(postDate, 'createOrder').subscribe(response => {
      console.log(response);
      if (response.status == true) {
        var MROId = response.responseData && response.responseData.MROId ? response.responseData.MROId : '200001';
        this.spinner.hide();
        if (this.loginType === "1") {
          Swal.fire(
            'Order Success!',
            'Thank you for your order. Your reference number is MRO' + MROId + '. Please use this reference number for further communication.',
            'success'
          )
          this.router.navigate(["/admin/shop/product-list"]);
        } else {
          const queryParams = {
            MROId: MROId
          };
          // const url = this.router.serializeUrl(
          //   this.router.createUrlTree(['/admin/mro/edit'], {
          //     queryParams: queryParams
          //   })
          // );
          // window.open('/#' + url, '_blank');
          this.router.navigate(['admin/mro/edit'], { queryParams: queryParams });
        }
      } else {
        this.spinner.hide();
        Swal.fire(
          'Warning!',
          response.message,
          'error'
        )
      }
    });
  }

  callBack() {
    this.router.navigate(["/admin/shop/cart"]);
  }

  getCart() {
    this.spinner.show();
    var postData = {
      CustomerId: this.CustomerId
    };
    this.commonService.postHttpService(postData, 'getCart').subscribe(response => {
      if (response.status == true) {
        this.cartList = response.responseData;
        this.BasketItem = response.responseData.BasketItem;
        this.Billing = response.responseData.BasketInfo[0].CustomerBillToId;
        this.Shipping = response.responseData.BasketInfo[0].CustomerShipToId;
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.router.navigate(["/admin/shop/cart"]);
      }
    });
  }

  getShipAddressList() {
    var postData = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      "Type": CONST_ShipAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.ShipAddressList = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });
      console.log(this.ShipAddressList);
    });

  }

  getBillAddressList() {
    var postData = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      "Type": CONST_BillAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.AddressList = response.responseData;
      this.BillAddressList = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });
      console.log(this.BillAddressList);
    });

  }
  getAddress(id) {
    if (id != null) {
      return this.AddressList.map(function (value) {
        if (value.AddressId == id) {
          return value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip
        }
      });
    } else {
      return "-";
    }

  }


}
