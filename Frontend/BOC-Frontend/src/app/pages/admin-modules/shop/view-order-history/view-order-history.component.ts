/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import {
  array_MRO_status, SalesOrder_Status, SalesOrder_Type, warranty_list, SalesOrder_notes, CONST_IDENTITY_TYPE_SO,
  CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, attachment_thumb_images, CONST_ShipAddressType, CONST_BillAddressType, CONST_ContactAddressType, Const_Alert_pop_title, Const_Alert_pop_message
} from 'src/assets/data/dropdown';
@Component({
  selector: 'app-view-order-history',
  templateUrl: './view-order-history.component.html',
  styleUrls: ['./view-order-history.component.scss']
})
export class ViewOrderHistoryComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  loginType: any;
  OrderId: any;
  orderList: any;
  BasketItem: any;
  Billing: any;
  Shipping: any;
  CustomerId: any;
  ShipAddressList: any;
  AddressList: any;
  BillAddressList: any;
  OrderItem: any;
  ShippingAddress: any;
  BillingAddress: any;
  IsOrderHistoryView: any;
  MROStatusHtml: string;
  MROStatusObj: any;
  constructor(public navCtrl: NgxNavigationWithDataComponent, public router: Router, private route: ActivatedRoute, private commonService: CommonService) {
    this.IsOrderHistoryView = this.commonService.permissionCheck("OrderHistory", CONST_VIEW_ACCESS);
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Shop', path: '#/admin/shop/product-list' }, { label: 'Order History', path: '#/admin/shop/order-history' }, { label: 'View Order', path: '/', active: true }];
    this.loginType = localStorage.getItem("IdentityType");
    this.CustomerId = localStorage.getItem("IdentityId");
    this.OrderId = this.route.snapshot.params.id;
    if (this.IsOrderHistoryView || this.loginType == 1) {
      this.getOrder();
      this.getShipAddressList();
      this.getBillAddressList();
    }
  }

  getOrder() {
    var postData = {
      OrderId: this.OrderId
    };
    this.commonService.postHttpService(postData, 'getOrder').subscribe(response => {
      if (response.status == true) {
        this.orderList = response.responseData;
        this.OrderItem = response.responseData.OrderItem;
        this.Billing = response.responseData.OrderInfo[0].CustomerBillToId;
        this.Shipping = response.responseData.OrderInfo[0].CustomerShipToId;
        this.BillingAddress = response.responseData.BillingAddress && response.responseData.BillingAddress[0] ? response.responseData.BillingAddress[0] : '';
        this.ShippingAddress = response.responseData.ShippingAddress && response.responseData.ShippingAddress[0] ? response.responseData.ShippingAddress[0] : '';
        var MROStatus = this.orderList && this.orderList.OrderInfo && this.orderList.OrderInfo[0].MROStatus ? this.orderList.OrderInfo[0].MROStatus : 0;
        if (MROStatus > 0) {
          var statusObj = array_MRO_status.find(a => a.id == MROStatus);
          this.MROStatusObj = statusObj;
          this.MROStatusHtml = '<span class="badge ' + (statusObj ? statusObj.cstyle : '') + ' btn-xs">' + (statusObj ? statusObj.title : '') + '</span>';
        } else {

          this.MROStatusHtml = '-';
        }


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
      if (response.status == true) {
        this.ShipAddressList = response.responseData.map(function (value) {
          return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
        });
      } else {
        // this.ShipAddressList = [];
      }
    });

  }

  getBillAddressList() {
    var postData = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      "Type": CONST_BillAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      if (response.status == true) {
        this.AddressList = response.responseData;
        this.BillAddressList = response.responseData.map(function (value) {
          return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
        });
      } else {
        this.AddressList = [];
      }
    });

  }
  getAddress(data) {
    // if (data != null && this.AddressList && this.AddressList.length > 0) {
    //   return this.AddressList.map(function (value) {
    //     if (value.AddressId == data) {
    //       return value.StreetAddress + " , " + value.City + " , " + value.CountryName + " ," + value.StateName + ".-" + value.Zip
    //     }
    //   });
    // } else {
    //   return "-";
    // }

    if (data != null && data != '') {
      return data.StreetAddress + " " + data.SuiteOrApt + ", " + data.City + " , " + data.StateName + " ," + data.CountryName + ". - " + data.Zip
    } else {
      return "-";
    }

  }

}
