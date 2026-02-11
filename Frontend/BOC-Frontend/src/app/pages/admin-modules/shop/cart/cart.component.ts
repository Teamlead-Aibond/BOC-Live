/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { CONST_AH_Group_ID, Const_Alert_pop_message, Const_Alert_pop_title, CONST_ShipAddressType, CONST_BillAddressType, CONST_VIEW_ACCESS, CUSTOMER_GROUP_ID_FORD, CUSTOMER_GROUP_ID_AMAZON } from 'src/assets/data/dropdown';
import { LocalStorageService } from '../../inventory/local-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [NgxSpinnerService]
})
export class CartComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  loginType: any;
  CustomerId: any;
  cartList: any;
  BillAddressList: any;
  ShipAddressList: any;
  Billing: any;
  Shipping: any;
  stockCount: any = 19;
  BlanketList: any;
  BlanketddlList: any;
  showBlanketPO: boolean;
  CustomPO: boolean;
  poName;
  CustomerPONo: any;
  GrandTotal: any;
  POValidationError: string;
  POValidationErrorMessage: string;
  CustomerBlanketPOId: any;
  CustomerCustomerPONo: any;
  IsAddToCart: any;
  constructor(private commonService: CommonService, public router: Router, private localStorageService: LocalStorageService, private spinner: NgxSpinnerService) {
    this.loginType = localStorage.getItem("IdentityType");
    this.CustomerId = localStorage.getItem("IdentityId");
    this.IsAddToCart = this.commonService.permissionCheck("AddTocart", CONST_VIEW_ACCESS);
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Shop', path: '#/admin/shop/product-list' }, { label: 'Cart', path: '/', active: true }];
    if (this.loginType != 1) {
      this.CustomerId = this.localStorageService.getData('adminOnlineStoreCustomerId');
    }
    // console.log("one");
    this.getCart();
    // console.log("two");
    this.getShipAddressList();
    // console.log("three");
    this.getBillAddressList();
    // console.log("four");
    this.getBlanketList();
    // console.log("five");
  }

  getCart() {
    this.spinner.show();
    var postData = {
      CustomerId: this.CustomerId
    };

    this.commonService.postHttpService(postData, 'getCart').subscribe(response => {
      if (response.status == true) {
        this.commonService.getCartCount();
        this.cartList = response.responseData;
        this.Billing = response.responseData.BasketInfo[0].CustomerBillToId;
        this.Shipping = response.responseData.BasketInfo[0].CustomerShipToId;
        this.spinner.hide();
        // console.log(this.cartList);
        if (response.responseData && response.responseData.BasketItem && response.responseData.BasketItem.length === 0) {
          this.router.navigate(["/admin/shop/product-list"]);
        }
      } else {
        this.spinner.hide();
        // Swal.fire({
        //   title: 'Info',
        //   text: response.message ? response.message : "Something went wrong. Please try again later!",
        //   type: 'info'
        // });
        // this.router.navigate(["/admin/shop/product-list"]);
      }
    });
  }

  removeFromCart(cart) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove from cart!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.commonService.postHttpService(cart, 'removeFromCart').subscribe(response => {
          if (response.status == true) {
            console.log(response.responseData);
            this.getCart();
            this.commonService.getCartCount();
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Cart is safe:)',
          type: 'info'
        });
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
      this.BillAddressList = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });
      console.log(this.BillAddressList);
    });

  }

  buttonMinus(cart, i) {
    if (this.cartList.BasketItem[i].Quantity > 1) {
      cart.Quantity = this.cartList.BasketItem[i].Quantity = this.cartList.BasketItem[i].Quantity - 1;
      this.commonService.postHttpService(cart, 'changeCartCount').subscribe(response => {
        if (response.status == true) {
          console.log(response.responseData);
          this.getCart();
        }
      });
    }

  }

  buttonPlus(cart, i, stockCount) {
    if (this.cartList.BasketItem[i].Quantity < stockCount) {
      cart.Quantity = this.cartList.BasketItem[i].Quantity = this.cartList.BasketItem[i].Quantity + 1;
      this.commonService.postHttpService(cart, 'changeCartCount').subscribe(response => {
        if (response.status == true) {
          console.log(response.responseData);
          this.getCart();
        }
      });
    } else {
      Swal.fire({
        title: 'Warning!',
        text: 'Only ' + stockCount + ' stocks available.',
        type: 'info'
      });
    }
  }

  getBlanketList() {
    // this.showSpinner=true;
    var postData = {
      "CustomerId": this.CustomerId,
    }
    var URI = '';
    if (this.loginType == 1) {
      URI = 'ByCustomerPortalBlanketPOList';
    } else {
      URI = 'ByCustomerBlanketPOList';
    }
    this.commonService.postHttpService(postData, URI).subscribe(response => {
      if (response.status == true) {

        this.BlanketList = response.responseData
        this.BlanketddlList = response.responseData.map(function (value) {
          return { title: "PO #: " + value.CustomerPONo + " - " + "Current Balance: $ " + value.CurrentBalance, "CustomerBlanketPOId": value.CustomerBlanketPOId }
        });
        if (this.BlanketList.length > 0) {
          this.showBlanketPO = true
        }
      }
      else {
        this.showBlanketPO = false
        this.CustomPO = true
      }
    });
  }

  onPOValidation(CustomerBlanketPOId) {
    // console.log(CustomerBlanketPOId);
    this.GrandTotal = this.cartList.BasketInfo[0].GrandTotal;
    var CurrentBalance = this.BlanketList.find(a => a.CustomerBlanketPOId == CustomerBlanketPOId).CurrentBalance;
    // console.log(this.GrandTotal);
    // console.log(CurrentBalance);
    this.CustomerPONo = this.BlanketList.find(a => a.CustomerBlanketPOId == CustomerBlanketPOId).CustomerPONo
    if (this.GrandTotal >= CurrentBalance) {
      this.POValidationError = 'Error';
      this.POValidationErrorMessage = `Cann't Approve due to insufficient balance`
    }
    else {
      this.POValidationError = '';
      this.POValidationErrorMessage = ''
    }

  }

  ChoosePOType(event: any) {
    // console.log(this.poName)
    // console.log(event.target.value)
    if (event.target.value == "custom") {
      this.POValidationError = '';
      this.POValidationErrorMessage = '';
      this.CustomerBlanketPOId = undefined;
    }
    // console.log(this.proceedToCheckout);
    this.poName = event.target.value;
  }

  proceedToCheckout() {
    // console.log(this.CustomerCustomerPONo);
    // console.log(this.CustomerBlanketPOId);
    // console.log(this.POValidationError);
    // if(this.POValidationError == '' && ((this.CustomerBlanketPOId!='' || this.CustomerBlanketPOId!=undefined) || (this.CustomerCustomerPONo!='' || this.CustomerCustomerPONo!=undefined))){
    if ((this.POValidationError == '' || this.POValidationError == undefined) && (this.CustomerBlanketPOId != undefined || this.CustomerCustomerPONo)) {
      var CustomerPo = {
        CustomerBlanketPOId: this.CustomerBlanketPOId,
        BlanketPONo: this.CustomerPONo,
        CustomerPONo: this.CustomerCustomerPONo

      }
      // console.log(CustomerPo);
      this.router.navigate(['/admin/shop/checkout'], { state: { data: CustomerPo } });
    } else {
      Swal.fire({
        title: 'Warning!',
        text: 'Please select CustomerBlanketPOId/CustomerPONo.',
        type: 'info'
      });
    }

  }

  onback() {
    if (this.cartList.BasketItem[0].CustomerGroupId == CUSTOMER_GROUP_ID_FORD) {
      this.router.navigate(['/admin/shop/ford-product-list']);
    } else if (this.cartList.BasketItem[0].CustomerGroupId == CUSTOMER_GROUP_ID_AMAZON) {
      this.router.navigate(['/admin/shop/amazon-product-list']);
    } else {
      this.router.navigate(['/admin/shop/product-list']);
    }
  }

}
