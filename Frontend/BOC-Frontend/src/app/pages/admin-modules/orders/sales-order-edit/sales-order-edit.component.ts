/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import Swal from 'sweetalert2';
import { NgbModal, NgbDateAdapter, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { ThrowStmt } from '@angular/compiler';
import { warranty_list, SalesOrder_Type, SalesOrder_Status, CONST_IDENTITY_TYPE_RR, CONST_IDENTITY_TYPE_SO, CONST_APPROVE_ACCESS, SalesOrder_Status_expectApprove, CONST_ShipAddressType, CONST_BillAddressType, CONST_ContactAddressType, Const_Alert_pop_title, Const_Alert_pop_message, CONST_IDENTITY_TYPE_CUSTOMER, CONST_VIEW_ACCESS, VAT_field_Name, TOTAL_VAT_field_Name, Shipping_field_Name } from 'src/assets/data/dropdown';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddNotesComponent } from '../../common-template/add-notes/add-notes.component';
import { EditNotesComponent } from '../../common-template/edit-notes/edit-notes.component';
import { RRAddAttachmentComponent } from '../../common-template/rr-add-attachment/rr-add-attachment.component';
import { RrEditAttachmentComponent } from '../../common-template/rr-edit-attachment/rr-edit-attachment.component';
import { AddReferenceComponent } from '../../common-template/add-reference/add-reference.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailComponent } from '../../common-template/email/email.component';
import { NgForm } from '@angular/forms';
import { CustomerReferenceComponent } from '../../common-template/customer-reference/customer-reference.component';
import { CreatePoInsoComponent } from '../../common-template/create-po-inso/create-po-inso.component';
import { BlanketPoNonRrEditComponent } from '../../common-template/blanket-po-non-rr-edit/blanket-po-non-rr-edit.component';

@Component({
  selector: 'app-sales-order-edit',
  templateUrl: './sales-order-edit.component.html',
  styleUrls: ['./sales-order-edit.component.scss'],
})
export class SalesOrderEditComponent implements OnInit {
  BillCode;
  ShipCode;
  RequestedDate;
  ReferenceNo;
  Warehouse;
  WarehouseId;
  customer_ref_no;
  FacilityId;
  Facility;
  ShippingMethod;
  Notes;


  number
  repairMessage
  NotesList;
  RRNotesList;
  PhoneBillingAddress
  faxBillingAddress
  SalesOrderItem: any = [];
  IsNotesEnabled;

  model: any = [];
  ShippingAddressList: any = []; BillingAddressList: any = [];
  ShipAddress: any = []; BillAddress: any = []

  //itemdetails
  LeadTime;
  Quantity;
  Rate;
  Price;
  WarrantyPeriod;
  SubTotal;
  GrandTotal;
  AdditionalCharge;
  TotalTax;
  PartNo;
  Discount;
  AHFees;
  Shipping;
  TaxPercent;
  //billingAddress
  bi_BillCodeId;
  bi_street_address;
  bi_city;
  bi_StateId;
  bi_zip;
  bi_BillName;
  bi_CountryId
  bi_SuiteOrApt;
  bi_CountryName
  bi_StateName
  BillAddressBookId
  btnDisabled: boolean = false;

  DueDate;
  //shippingAddress
  sh_street_address;
  sh_city;
  sh_StateId;
  sh_zip;
  sh_CountryId;
  sh_AllowShipment;
  sh_ShipCodeId;
  sh_SuiteOrApt;
  sh_ShipName;
  sh_CountryName;
  sh_StateName
  bi_AllowShipment
  ShipAddressBookId;
  IsConvertedToPO;
  IsConvertSOToInvoiceEnabled;
  IsRevertInvoiceEnabled;
  IsVoidLineItemPriceEnabled: boolean = false;
  Status;
  CustomerPONo;
  faxContactAddress;
  PhoneContactAddress;
  //edit model
  SalesOrderInfo;
  BillingAddress;
  ShippingAddress;
  ContactAddress;
  SalesOrderCustomerRef: any = [];
  SONotes: any = [];
  AttachmentList: any = [];
  SOId;
  result;
  CustomerId;
  CountryId
  //dropdown
  customerAddressList;
  countryList;
  customerReferenceList;
  sh_StateList;
  bi_StateList;
  warrantyList;
  AddressList;
  SalesOrderType;
  SalesOrderStatus_edit;
  SOType;
  //submit
  PartItem: any = [];
  RRId;
  partList: any = [];
  faxCustomerAddress;


  keyword = 'PartNo';
  filteredData: any[];
  isLoading: boolean = false;
  data = [];
  settingsView
  IsApproveEnabled;
  warehouseList: any = []
  gridCheckAll: boolean = false;
  Selectallenable: boolean = false;
  ExcludedPartItem: any = []
  showExcludedPartItem = false;
  BlanketPOExcludeAmount;
  BlanketPONetAmount



  showList: boolean = true;
  VAT_field_Name
  Shipping_field_Name
  IsDeleted;
  GrandTotalUSD
  IsDisplayBaseCurrencyValue
  showlineItem: boolean = false;
  Symbol
  CustomerLocation
  CustomerVatTax
  ExchangeRate
  CustomerCurrencyCode
  BaseCurrencySymbol
  isCurrencyMode: boolean = false;
  Location
  LocationName
  IsCancelSOEnabled: boolean = false
  InvoiceListArray: any = []
  POListArray: any = []
  constructor(private modalService: NgbModal, private commonService: CommonService, private cd_ref: ChangeDetectorRef,
    private datePipe: DatePipe, public navCtrl: NgxNavigationWithDataComponent,
    private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, public router: Router, private route: ActivatedRoute,
  ) { }
  currentRouter = decodeURIComponent(this.router.url);

  ngOnInit() {
    document.title = 'SO Edit'
    this.IsDisplayBaseCurrencyValue = localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol")
    this.VAT_field_Name = TOTAL_VAT_field_Name; //VAT_field_Name
    this.Shipping_field_Name = Shipping_field_Name
    // this.SOId = this.navCtrl.get('SOId');
    if (history.state.SOId == undefined) {
      this.route.queryParams.subscribe(
        params => {
          this.SOId = params['SOId'];
        }
      )
    }
    else if (history.state.SOId != undefined) {
      this.SOId = history.state.SOId
    }
    this.SalesOrderInfo = ""
    this.PartItem = [];
    this.BillingAddress = "";
    this.ShippingAddress = "";
    this.ContactAddress = "";
    this.SONotes = [];
    this.AttachmentList = [];
    this.BlanketPOExcludeAmount = "0"
    this.BlanketPONetAmount = "0"
    // Redirect to the List page if the View Id is not available
    if (this.SOId == '' || this.SOId == 'undefined' || this.SOId == null) {
      this.navCtrl.navigate('/admin/SO-Order-List');
      return false;
    }
    this.getViewContent();
    this.IsApproveEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_APPROVE_ACCESS);
    this.IsNotesEnabled = this.commonService.permissionCheck("SONotes", CONST_VIEW_ACCESS);
    this.IsConvertSOToInvoiceEnabled = this.commonService.permissionCheck("ConvertSOToInvoice", CONST_VIEW_ACCESS);
    this.IsRevertInvoiceEnabled = this.commonService.permissionCheck("RevertInvoice", CONST_VIEW_ACCESS);
    this.IsVoidLineItemPriceEnabled = this.commonService.permissionCheck("VoidLineItemPrice", CONST_VIEW_ACCESS);
    this.IsCancelSOEnabled = this.commonService.permissionCheck("CancelSalesOrder", CONST_VIEW_ACCESS);

    this.warrantyList = warranty_list;
    this.SalesOrderType = SalesOrder_Type;
    this.SalesOrderStatus_edit = SalesOrder_Status_expectApprove

    this.Facility = [
      { FacilityId: 1, FacilityCode: 'American Hydrostatic' },
      { FacilityId: 2, FacilityCode: 'AH - Canada' },
    ]

    this.FacilityId = 1,
      this.ShippingMethod = "pdf"
    this.getAdminSettingsView();
    this.getWarehouseList();
    this.Location = localStorage.getItem("Location");
    this.LocationName = localStorage.getItem("LocationName");

  }
  getWarehouseList() {
    this.commonService.getHttpService('getWarehouseList').subscribe(response => {
      this.warehouseList = response.responseData;
    });
  }
  getAdminSettingsView() {
    var postData = {}
    this.commonService.postHttpService(postData, "getSettingsGeneralView").subscribe(response => {
      if (response.status == true) {
        this.settingsView = response.responseData;

      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  reLoad() {
    this.router.navigate([this.currentRouter.split('?')[0]], { queryParams: { SOId: this.SOId } })
    // this.router.navigate([this.currentRouter])
  }
  getViewContent() {
    //View content
    var postData = {
      SOId: this.SOId,
    }
    this.commonService.postHttpService(postData, "getSalesOrderView").subscribe(response => {
      if (response.status == true) {
        this.result = response.responseData;
        this.SalesOrderInfo = this.result.SalesOrderInfo[0];
        this.BillingAddress = this.result.BillingAddress[0];
        this.ShippingAddress = this.result.ShippingAddress[0];
        this.ContactAddress = this.result.ContactAddress[0];
        this.GrandTotalUSD = this.SalesOrderInfo.BaseGrandTotal.toFixed(2);
        this.ExchangeRate = this.SalesOrderInfo.ExchangeRate
        this.Symbol = this.SalesOrderInfo.CurrencySymbol
        this.CustomerLocation = this.SalesOrderInfo.CustomerLocation
        this.CustomerVatTax = this.SalesOrderInfo.VatTaxPercentage
        this.CustomerCurrencyCode = this.SalesOrderInfo.CustomerCurrencyCode
        this.result.SalesOrderItem.map(a => {
          a.checked = false;
          a.TaxWithQuantity = (a.Quantity * a.Tax).toFixed(2)
          a.PartDescription = a.Description
          if (a.IsExcludeFromBlanketPO == 1) {
            this.showExcludedPartItem = true
            this.ExcludedPartItem.push(a)
          } else {
            this.PartItem.push(a)
          }
          return a;
        });
        if (this.PartItem.length > 0) {
          this.showlineItem = true
          for (var i = 0; i < this.PartItem.length; i++) {


            this.PartItem.every(function (item: any) {
              return item.Part = item.PartNo;



            })

          }
        }
        if (this.ExcludedPartItem.length > 0) {
          for (var i = 0; i < this.ExcludedPartItem.length; i++) {


            this.ExcludedPartItem.every(function (item: any) {
              return item.Part = item.PartNo


            })

          }
        }
        this.SONotes = this.result.NotesList;
        this.AttachmentList = this.result.AttachmentList;
        this.Notes = this.SalesOrderInfo.Notes
        this.sh_AllowShipment = this.ShippingAddress.AllowShipment;
        this.model.Status = this.SalesOrderInfo.Status;
        this.model.SOType = this.SalesOrderInfo.SOType;

        this.RRId = this.SalesOrderInfo.RRId;
        if (this.RRId != 0) {
          this.SalesOrderCustomerRef = this.result.RRCustomerReference;
        }
        else {
          this.SalesOrderCustomerRef = this.result.CustomerRef
        }
        this.WarehouseId = this.SalesOrderInfo.WarehouseId;
        this.CustomerPONo = this.SalesOrderInfo.CustomerPONo;
        this.ReferenceNo = this.SalesOrderInfo.ReferenceNo;
        const Requestedyear = Number(this.datePipe.transform(this.SalesOrderInfo.DateRequested, 'yyyy'));
        const RequestedMonth = Number(this.datePipe.transform(this.SalesOrderInfo.DateRequested, 'MM'));
        const RequestedDay = Number(this.datePipe.transform(this.SalesOrderInfo.DateRequested, 'dd'));
        this.model.RequestedDate = {
          year: Requestedyear,
          month: RequestedMonth,
          day: RequestedDay
        }
        const years = Number(this.datePipe.transform(this.SalesOrderInfo.DueDate, 'yyyy'));
        const Month = Number(this.datePipe.transform(this.SalesOrderInfo.DueDate, 'MM'));
        const Day = Number(this.datePipe.transform(this.SalesOrderInfo.DueDate, 'dd'));
        this.model.DueDate = {
          year: years,
          month: Month,
          day: Day
        }
        if (this.SalesOrderInfo.IsConvertedToPO == 1) {
          this.IsConvertedToPO = "Yes"
        }
        else {
          this.IsConvertedToPO = "NO"
        }
        this.CustomerId = this.SalesOrderInfo.CustomerId;
        this.sh_CountryId = this.ShippingAddress.CountryId;
        this.bi_CountryId = this.BillingAddress.CountryId;

        this.TotalTax = this.SalesOrderInfo.TotalTax.toFixed(2);
        this.Discount = this.SalesOrderInfo.Discount;
        this.AHFees = this.SalesOrderInfo.AHFees;
        this.GrandTotal = this.SalesOrderInfo.GrandTotal.toFixed(2);
        this.Shipping = this.SalesOrderInfo.Shipping;
        this.SubTotal = this.SalesOrderInfo.SubTotal.toFixed(2);
        this.TaxPercent = this.SalesOrderInfo.TaxPercent;
        this.BlanketPOExcludeAmount = this.SalesOrderInfo.BlanketPOExcludeAmount.toFixed(2);
        this.BlanketPONetAmount = this.SalesOrderInfo.BlanketPONetAmount.toFixed(2);
        this.faxContactAddress = this.ContactAddress.Fax
        this.PhoneContactAddress = this.ContactAddress.PhoneNoPrimary
        //Dropdown Customer

        this.getCustomerReferenceList();
        this.getCustomerAddressList();
        this.getCustomerAddressdetails()


        //For email content
        if (this.SalesOrderInfo.RRId != 0) {
          this.number = this.SalesOrderInfo.RRNo
        }
        else {
          this.number = this.SalesOrderInfo.SONo
        }
        if (this.SalesOrderInfo.IsRushRepair == 1) {
          this.repairMessage = "Rush Repair"
        }
        if (this.SalesOrderInfo.IsWarrantyRecovery == 1) {
          this.repairMessage = "Warranty Repair"
        }
        if (this.SalesOrderInfo.IsWarrantyRecovery == 2) {
          this.repairMessage = "Warranty New"
        }
        if (this.SalesOrderInfo.IsRushRepair == 1 && this.SalesOrderInfo.IsWarrantyRecovery == 1) {
          this.repairMessage = "Rush Repair, Warranty Repair"
        }
        this.NotesList = this.result.NotesList;
        this.RRNotesList = this.result.RRNotesList;
        this.PhoneBillingAddress = this.BillingAddress.Phone;
        this.faxBillingAddress = this.BillingAddress.Fax;
        // this.SalesOrderItem = this.result.SalesOrderItem;


        this.POListArray = this.result.POList
        this.InvoiceListArray = this.result.InvoiceList

      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }

  getCountryList() {
    this.commonService.getconutryList().subscribe(response => {
      if (response.status == true) {
        this.countryList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  getCustomerAddressdetails() {
    this.model.sh_ShipCodeId = this.ShippingAddress.AddressId;
    this.sh_CountryId = this.ShippingAddress.CountryId;
    this.sh_ShipName = this.SalesOrderInfo.CompanyName;
    this.sh_street_address = this.ShippingAddress.StreetAddress;
    this.sh_city = this.ShippingAddress.City;
    this.sh_StateId = Number(this.ShippingAddress.StateId);
    this.sh_zip = this.ShippingAddress.Zip;
    this.sh_CountryId = this.ShippingAddress.CountryId;
    this.sh_SuiteOrApt = this.ShippingAddress.SuiteOrApt;
    this.sh_AllowShipment = this.ShippingAddress.AllowShipment
    this.sh_CountryName = this.ShippingAddress.CountryName
    this.sh_StateName = this.ShippingAddress.StateName


    this.model.bi_BillCodeId = this.BillingAddress.AddressId;
    this.bi_CountryId = this.BillingAddress.CountryId;
    this.bi_BillName = this.SalesOrderInfo.CompanyName;
    this.bi_street_address = this.BillingAddress.StreetAddress;
    this.bi_city = this.BillingAddress.City;
    this.bi_StateId = Number(this.BillingAddress.StateId);
    this.bi_zip = this.BillingAddress.Zip;
    this.bi_CountryId = this.BillingAddress.CountryId;
    this.bi_SuiteOrApt = this.BillingAddress.SuiteOrApt;
    this.bi_AllowShipment = this.BillingAddress.AllowShipment
    this.bi_CountryName = this.BillingAddress.CountryName
    this.bi_StateName = this.BillingAddress.StateName


  }
  getCustomerAddressList() {
    // var postData = {
    //   "IdentityId": this.CustomerId,
    //   "IdentityType": 1,
    //   "Type": CONST_ShipAddressType

    // }
    // this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
    //   this.ShippingAddressList = response.responseData;
    //   this.ShipAddress = response.responseData.map(function (value) {
    //     return { title: value.StreetAddress + " , " + value.City + " , " + value.CountryName + " ," + value.StateName + ".-" + value.Zip, "AddressId": value.AddressId }
    //   });
    //   //shippingAddress
    //   let obj = this
    //   var ShippingAddress = obj.ShippingAddressList.filter(function (value) {
    //     if (value.IsShippingAddress == 1) {
    //       return value.AddressId
    //     }
    //   }, obj);
    //   this.model.sh_ShipCodeId = ShippingAddress[0].AddressId;
    // })
    this.ShippingAddressList = this.result.ShipAddressList;
    this.ShipAddress = this.result.ShipAddressList.map(function (value) {
      return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
    });
    let obj = this
    var ShippingAddress = obj.ShippingAddressList.filter(function (value) {
      // console.log(value.AddressId);
      // console.log(this.SalesOrderInfo.CustomerShipIdLocked);
      if (this.SalesOrderInfo.CustomerShipIdLocked > 0) {
        if (value.AddressId == this.SalesOrderInfo.CustomerShipIdLocked) {
          return value.AddressId
        }
      } else {
        if (value.IsShippingAddress == 1) {
          return value.AddressId
        }
      }
    }, obj);
    // console.log(ShippingAddress);
    this.model.sh_ShipCodeId = ShippingAddress[0].AddressId
    // this.model.sh_ShipCodeId = this.ShipAddress[0].AddressId;
    // console.log(this.ShipAddress);
    // let obj = this
    // var ShippingAddress = obj.ShippingAddressList.filter(function (value) {
    //   if (value.IsShippingAddress == 1) {
    //     return value.AddressId
    //   }
    // }, obj);
    // console.log(ShippingAddress)





    // 
    var postData1 = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      "Type": CONST_BillAddressType

    }
    this.commonService.postHttpService(postData1, 'getAddressList').subscribe(response => {
      this.BillingAddressList = response.responseData;
      this.BillAddress = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });
      let obj = this
      var BillAddress = obj.BillingAddressList.filter(function (value) {
        if (value.IsBillingAddress == 1) {
          return value.AddressId
        }
      }, obj);
      this.model.bi_BillCodeId = BillAddress[0].AddressId;
    });



  }
  getContactAddress() {

    var postData = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      "Type": CONST_ContactAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.AddressList = response.responseData;
      this.ShipAddress = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });
      //ContactAddress
      let obj = this
      var ContactAddress = obj.AddressList.filter(function (value) {
        if (value.IsContactAddress == 1) {
          return value.AddressId
        }
      }, obj);
      this.model.sh_ShipCodeId = ContactAddress[0].AddressId;
      this.sh_CountryId = ContactAddress[0].CountryId;
      this.sh_ShipName = this.SalesOrderInfo.CompanyName;
      this.sh_street_address = ContactAddress[0].StreetAddress;
      this.sh_city = ContactAddress[0].City;
      this.sh_StateId = Number(ContactAddress[0].StateId);
      this.sh_zip = ContactAddress[0].Zip;
      this.sh_CountryId = ContactAddress[0].CountryId;
      this.sh_SuiteOrApt = ContactAddress[0].SuiteOrApt;
      this.sh_AllowShipment = ContactAddress[0].AllowShipment

    })
  }

  getContactAddressinBill() {
    var postData = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      "Type": CONST_ContactAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.AddressList = response.responseData;
      this.BillAddress = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });

      //ContactAddress
      let obj = this
      var ContactAddress = obj.AddressList.filter(function (value) {
        if (value.IsContactAddress == 1) {
          return value.AddressId
        }
      }, obj);
      this.model.bi_BillCodeId = ContactAddress[0].AddressId;
      this.bi_CountryId = ContactAddress[0].CountryId;
      this.bi_BillName = this.SalesOrderInfo.CompanyName;
      this.bi_street_address = ContactAddress[0].StreetAddress;
      this.bi_city = ContactAddress[0].City;
      this.bi_StateId = Number(ContactAddress[0].StateId);
      this.bi_zip = ContactAddress[0].Zip;
      this.bi_CountryId = ContactAddress[0].CountryId;
      this.bi_SuiteOrApt = ContactAddress[0].SuiteOrApt;
      this.bi_AllowShipment = ContactAddress[0].AllowShipment
    })
  }
  getBillingAddress() {
    var postData2 = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      "Type": CONST_BillAddressType

    }
    //CustomerAddressLoad
    this.commonService.postHttpService(postData2, 'getAddressList').subscribe(response => {
      this.BillingAddressList = response.responseData;
      this.ShipAddress = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });
      let obj = this

      //BillingAddress
      var BillingAddress = obj.BillingAddressList.filter(function (value) {
        if (value.IsBillingAddress == 1) {
          return value.AddressId
        }
      }, obj);
      this.model.sh_ShipCodeId = BillingAddress[0].AddressId;
      this.sh_CountryId = BillingAddress[0].CountryId;
      this.sh_ShipName = this.SalesOrderInfo.CompanyName;
      this.sh_street_address = BillingAddress[0].StreetAddress;
      this.sh_city = BillingAddress[0].City;
      this.sh_StateId = Number(BillingAddress[0].StateId);
      this.sh_zip = BillingAddress[0].Zip;
      this.sh_CountryId = BillingAddress[0].CountryId;
      this.sh_SuiteOrApt = BillingAddress[0].SuiteOrApt;
      this.sh_AllowShipment = BillingAddress[0].AllowShipment
    })

  }

  getShippingAddress() {
    var postData1 = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      "Type": CONST_ShipAddressType

    }
    //CustomerAddressLoad
    this.commonService.postHttpService(postData1, 'getAddressList').subscribe(response => {
      this.ShippingAddressList = response.responseData;
      this.BillAddress = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });


      //shippingAddress
      let obj = this
      var ShippingAddress = obj.ShippingAddressList.filter(function (value) {
        if (value.IsShippingAddress == 1) {
          return value.AddressId
        }
      }, obj);
      this.model.bi_BillCodeId = ShippingAddress[0].AddressId;
      this.bi_CountryId = ShippingAddress[0].CountryId;
      this.bi_BillName = this.SalesOrderInfo.CompanyName;
      this.bi_street_address = ShippingAddress[0].StreetAddress;
      this.bi_city = ShippingAddress[0].City;
      this.bi_StateId = Number(ShippingAddress[0].StateId);
      this.bi_zip = ShippingAddress[0].Zip;
      this.bi_CountryId = ShippingAddress[0].CountryId;
      this.bi_SuiteOrApt = ShippingAddress[0].SuiteOrApt;
      this.bi_AllowShipment = ShippingAddress[0].AllowShipment
    })
  }
  CreateCustomerInvoice() {
    if (this.SalesOrderInfo.POId != '' && this.SalesOrderInfo.POId != null) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Create it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success mt-2',
        cancelButtonClass: 'btn btn-danger ml-2 mt-2',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          var postData = {
            "RRId": this.RRId, "SOId": this.SOId, "QuoteId": this.SalesOrderInfo.QuoteId
          }
          this.commonService.postHttpService(postData, 'AutoCreateInvoice').subscribe(response => {
            if (response.status == true) {
              Swal.fire({
                title: 'Created Invoice!',
                text: 'Invoice has been Created.',
                type: 'success'
              });
              this.reLoad();
            }
          });
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          Swal.fire({
            title: 'Cancelled',
            text: 'Invoice  has not Created.',
            type: 'error'
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Message',
        text: 'Failed to create Invoice. Please create PO and then create Invoice',
        type: 'info'
      });
    }
  }


  selectExcludedPartItemEvent(item, j) {
    var postData = { PartId: item.PartId, "CustomerId": this.CustomerId };
    this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {
      this.ExchangeRate = response.responseData[0].ExchangeRate
      if (this.CustomerCurrencyCode != localStorage.getItem('BaseCurrencyCode')) {
        if (this.ExchangeRate == null) {
          Swal.fire({
            type: 'info',
            title: 'Message',
            text: `Exchange rate is not available for ${this.CustomerCurrencyCode} to USD. Please contact admin to create a quote`,
            confirmButtonClass: 'btn btn-confirm mt-2',
          });
          this.ExcludedPartItem[j].Part = ''
        } else {
          this.ExcludedPartItem[j].PartId = response.responseData[0].PartId,
            this.ExcludedPartItem[j].PartNo = response.responseData[0].PartNo,
            this.ExcludedPartItem[j].PartDescription = this.getReplace(response.responseData[0].Description),
            this.ExcludedPartItem[j].Quantity = response.responseData[0].Quantity,
            this.ExcludedPartItem[j].Rate = response.responseData[0].Price
          this.ExcludedPartItem[j].ItemLocalCurrencyCode = this.CustomerCurrencyCode
          this.ExcludedPartItem[j].ItemExchangeRate = this.ExchangeRate
          this.ExcludedPartItem[j].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
          this.ExcludedPartItem[j].ItemLocalCurrencySymbol = this.SalesOrderInfo.CustomerCurrencySymbol

          if (localStorage.getItem('Location') == this.CustomerLocation) {

            if (response.responseData[0].PartVatTaxPercentage != null) {
              this.ExcludedPartItem[j].ItemTaxPercent = response.responseData[0].PartVatTaxPercentage
            } else {
              this.ExcludedPartItem[j].ItemTaxPercent = this.CustomerVatTax
            }

          } else {
            this.ExcludedPartItem[j].ItemTaxPercent = '0'
          }
          this.ExcludedPartcalculatePrice(j)
        }
      } else {
        this.ExchangeRate = '1'
        this.ExcludedPartItem[j].PartId = response.responseData[0].PartId,
          this.ExcludedPartItem[j].PartNo = response.responseData[0].PartNo,
          this.ExcludedPartItem[j].PartDescription = this.getReplace(response.responseData[0].Description),
          this.ExcludedPartItem[j].Quantity = response.responseData[0].Quantity,
          this.ExcludedPartItem[j].Rate = response.responseData[0].Price
        this.ExcludedPartItem[j].ItemLocalCurrencyCode = this.CustomerCurrencyCode
        this.ExcludedPartItem[j].ItemExchangeRate = this.ExchangeRate
        this.ExcludedPartItem[j].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
        this.ExcludedPartItem[j].ItemLocalCurrencySymbol = this.SalesOrderInfo.CustomerCurrencySymbol
        if (localStorage.getItem('Location') == this.CustomerLocation) {

          if (response.responseData[0].PartVatTaxPercentage != null) {
            this.ExcludedPartItem[j].ItemTaxPercent = response.responseData[0].PartVatTaxPercentage
          } else {
            this.ExcludedPartItem[j].ItemTaxPercent = this.CustomerVatTax
          }

        } else {
          this.ExcludedPartItem[j].ItemTaxPercent = '0'
        }
        this.ExcludedPartcalculatePrice(j)
      }
      // this.ExcludedPartItem[j].PartId = response.responseData[0].PartId,
      //   this.ExcludedPartItem[j].PartNo = response.responseData[0].PartNo,
      //   this.ExcludedPartItem[j].Description = response.responseData[0].Description,
      //   this.ExcludedPartItem[j].Quantity = response.responseData[0].Quantity,
      //   this.ExcludedPartItem[j].Rate = response.responseData[0].Price
      // this.ExcludedPartItem[j].DeliveryDate = "2020-12-24"
      // this.ExcludedPartcalculatePrice(j)

    });
  }
  selectEvent(item, i) {
    var postData = { PartId: item.PartId, "CustomerId": this.CustomerId };
    this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {

      this.ExchangeRate = response.responseData[0].ExchangeRate
      if (this.CustomerCurrencyCode != localStorage.getItem('BaseCurrencyCode')) {
        if (this.ExchangeRate == null) {
          Swal.fire({
            type: 'info',
            title: 'Message',
            text: `Exchange rate is not available for ${this.CustomerCurrencyCode} to USD. Please contact admin to create a quote`,
            confirmButtonClass: 'btn btn-confirm mt-2',
          });
          this.PartItem[i].Part = ''
          this.PartItem[i].PartId = ''
          this.PartItem[i].PartNo = ''
          this.PartItem[i].PartDescription = ''
          this.PartItem[i].Quantity = ''
          this.PartItem[i].Rate = ''
          this.PartItem[i].ItemLocalCurrencyCode = ''
          this.PartItem[i].ItemExchangeRate = ''
          this.PartItem[i].ItemBaseCurrencyCode = ''
          this.PartItem[i].ItemLocalCurrencySymbol = ''

        } else {
          this.PartItem[i].PartId = response.responseData[0].PartId,
            this.PartItem[i].PartNo = response.responseData[0].PartNo,
            this.PartItem[i].PartDescription = this.getReplace(response.responseData[0].Description),
            this.PartItem[i].Quantity = response.responseData[0].Quantity,
            this.PartItem[i].Rate = response.responseData[0].Price
          this.PartItem[i].ItemLocalCurrencyCode = this.CustomerCurrencyCode
          this.PartItem[i].ItemExchangeRate = this.ExchangeRate
          this.PartItem[i].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
          this.PartItem[i].ItemLocalCurrencySymbol = this.SalesOrderInfo.CustomerCurrencySymbol
          if (localStorage.getItem('Location') == this.CustomerLocation) {

            if (response.responseData[0].PartVatTaxPercentage != null) {
              this.PartItem[i].ItemTaxPercent = response.responseData[0].PartVatTaxPercentage
            } else {
              this.PartItem[i].ItemTaxPercent = this.CustomerVatTax
            }

          } else {
            this.PartItem[i].ItemTaxPercent = '0'
          }
          this.calculatePrice(i)
        }
      } else {
        this.ExchangeRate = '1'
        this.PartItem[i].PartId = response.responseData[0].PartId,
          this.PartItem[i].PartNo = response.responseData[0].PartNo,
          this.PartItem[i].PartDescription = this.getReplace(response.responseData[0].Description),
          this.PartItem[i].Quantity = response.responseData[0].Quantity,
          this.PartItem[i].Rate = response.responseData[0].Price
        this.PartItem[i].ItemLocalCurrencyCode = this.CustomerCurrencyCode
        this.PartItem[i].ItemExchangeRate = this.ExchangeRate
        this.PartItem[i].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
        this.PartItem[i].ItemLocalCurrencySymbol = this.SalesOrderInfo.CustomerCurrencySymbol
        if (localStorage.getItem('Location') == this.CustomerLocation) {

          if (response.responseData[0].PartVatTaxPercentage != null) {
            this.PartItem[i].ItemTaxPercent = response.responseData[0].PartVatTaxPercentage
          } else {
            this.PartItem[i].ItemTaxPercent = this.CustomerVatTax
          }

        } else {
          this.PartItem[i].ItemTaxPercent = '0'
        }
        this.calculatePrice(i)
      }
      // this.PartItem[i].PartId = response.responseData[0].PartId,
      //   this.PartItem[i].PartNo = response.responseData[0].PartNo,
      //   this.PartItem[i].Description = response.responseData[0].Description,
      //   this.PartItem[i].Quantity = response.responseData[0].Quantity,
      //   this.PartItem[i].Rate = response.responseData[0].Price
      // this.PartItem[i].DeliveryDate = "2020-12-24"
      // this.calculatePrice(i)

    });
  }

  onChangeSearch(val: string, i) {

    if (val) {
      this.isLoading = true;
      var postData = {
        "PartNo": val
      }
      this.commonService.postHttpService(postData, "getonSearchPartByPartNo").subscribe(response => {
        if (response.status == true) {
          this.data = response.responseData
          this.filteredData = this.data.filter(a => a.PartNo.toLowerCase().includes(val.toLowerCase())

          )

        }
        else {

        }
        this.isLoading = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoading = false; });

    }
  }

  onFocused(e, i) {
    // do something when input is focused
  }

  //Email
  SOEmail() {
    this.getPdfBase64((pdfBase64) => {
      let fileName = `Sales Order ${this.number}.pdf`;
      var RRId = this.RRId
      var IdentityId = this.SOId
      var IdentityType = CONST_IDENTITY_TYPE_SO
      var followupName = "Sales Order"
      var ImportedAttachment = { path: `data:application/pdf;filename=generated.pdf;base64,${pdfBase64}`, filename: fileName };
      this.modalRef = this.CommonmodalService.show(EmailComponent,
        {
          backdrop: 'static',
          ignoreBackdropClick: false,
          initialState: {
            data: { followupName, IdentityId, IdentityType, RRId, ImportedAttachment },
            class: 'modal-lg'
          }, class: 'gray modal-lg'
        });

      this.modalRef.content.closeBtnName = 'Close';

      this.modalRef.content.event.subscribe(res => {
        this.reLoad()
      });
    })
  }

  getPdfBase64(cb) {
    var SalesOrderItem = []
    SalesOrderItem = this.PartItem.concat(this.ExcludedPartItem);
    this.commonService.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        SalesOrderInfo: this.SalesOrderInfo,
        number: this.number,
        repairMessage: this.repairMessage,
        BillingAddress: this.BillingAddress,
        PhoneBillingAddress: this.PhoneBillingAddress,
        faxBillingAddress: this.faxBillingAddress,
        ShippingAddress: this.ShippingAddress,
        SalesOrderCustomerRef: this.SalesOrderCustomerRef,
        SalesOrderItem: SalesOrderItem,
        IsNotesEnabled: this.IsNotesEnabled,
        settingsView: this.settingsView,
        NotesList: this.NotesList,
        RRNotesList: this.RRNotesList,
        RRId: this.RRId,
        Logo: base64
      }

      this.commonService.postHttpService({ pdfObj }, "getSOPdfBase64").subscribe(response => {
        if (response.status == true) {
          cb(response.responseData.pdfBase64);
        }
      });
    })
  }

  //addReference
  addReference() {
    if (this.RRId == 0) {
      var CustomerId = this.CustomerId;
      var IdentityType = CONST_IDENTITY_TYPE_SO;
      var IdentityId = this.SOId;
      var RRId = this.RRId
    }
    else {
      var IdentityId = this.RRId;
      var IdentityType = CONST_IDENTITY_TYPE_RR;
      var CustomerId = this.CustomerId;
      var RRId = this.RRId
    }
    this.modalRef = this.CommonmodalService.show(AddReferenceComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { CustomerId, IdentityType, IdentityId, RRId },
          class: 'modal-lg',
          centered: true
        }, class: 'gray modal-lg'

      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.SalesOrderCustomerRef.push(res.data);
    });
  }

  deleteReference(i) {
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


        this.SalesOrderCustomerRef.splice(i, 1);
        Swal.fire({
          title: 'Deleted!',
          text: 'Reference has been deleted.',
          type: 'success'
        });


      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Reference is safe:)',
          type: 'error'
        });
      }
    });
  }

  public addReferenceType() {
    var IdentityId = this.CustomerId;
    this.modalRef = this.CommonmodalService.show(CustomerReferenceComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { IdentityId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      }
    )

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.customerReferenceList.push(res.data);
    });
  }
  onApprovedSO() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, create it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          "SOId": this.SOId
        }
        this.commonService.postHttpService(postData, 'ApprovedSO').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Approved SO!',
              text: 'Sales Order Approved has been Updated.',
              type: 'success'
            });
            this.reLoad();
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Sales Order Approved has not Updated.',
          type: 'error'
        });
      }
    });

  }
  getStateList_sh(sh_CountryId) {
    var postData = {
      CountryId: this.sh_CountryId
    }
    this.commonService.getHttpServiceStateId(postData, "getStateListDropdown").subscribe(response => {
      if (response.status == true) {
        this.sh_StateList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));


  }


  getStateList_bi(bi_CountryId) {
    var postData = {
      CountryId: this.bi_CountryId
    }
    this.commonService.getHttpServiceStateId(postData, "getStateListDropdown").subscribe(response => {
      if (response.status == true) {
        this.bi_StateList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));


  }


  onchange_SH_StateList(sh_CountryId) {
    var postData = {
      CountryId: sh_CountryId
    }
    this.commonService.getHttpServiceStateId(postData, "getStateListDropdown").subscribe(response => {
      if (response.status == true) {
        this.sh_StateList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  onchange_Bi_StateList(bi_CountryId) {
    var postData = {
      CountryId: bi_CountryId
    }
    this.commonService.getHttpServiceStateId(postData, "getStateListDropdown").subscribe(response => {
      if (response.status == true) {
        this.bi_StateList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  BillingAddressChange(bi_BillCodeId) {
    let obj = this
    var BillingAddressDetails = obj.BillingAddressList.filter(function (value) {
      if (bi_BillCodeId == value.AddressId) {
        return value
      }
    }, obj);
    this.bi_CountryId = BillingAddressDetails[0].CountryId;
    this.bi_BillName = this.SalesOrderInfo.CompanyName;
    this.bi_street_address = BillingAddressDetails[0].StreetAddress;
    this.bi_city = BillingAddressDetails[0].City;
    this.bi_StateId = Number(BillingAddressDetails[0].StateId);
    this.bi_zip = BillingAddressDetails[0].Zip;
    this.bi_CountryId = BillingAddressDetails[0].CountryId;
    this.bi_SuiteOrApt = BillingAddressDetails[0].SuiteOrApt;
    this.bi_AllowShipment = BillingAddressDetails[0].AllowShipment
    this.model.BillAddressBookId = BillingAddressDetails[0].AddressId






  }


  ShippingAddressChange(sh_ShipCodeId) {
    let obj = this
    var ShippingAddressDetails = obj.ShippingAddressList.filter(function (value) {
      if (sh_ShipCodeId == value.AddressId) {
        return value
      }
    }, obj);
    this.sh_CountryId = ShippingAddressDetails[0].CountryId;
    this.sh_ShipName = this.SalesOrderInfo.CompanyName;
    this.sh_street_address = ShippingAddressDetails[0].StreetAddress;
    this.sh_city = ShippingAddressDetails[0].City;
    this.sh_StateId = Number(ShippingAddressDetails[0].StateId);
    this.sh_zip = ShippingAddressDetails[0].Zip;
    this.sh_CountryId = ShippingAddressDetails[0].CountryId;
    this.sh_SuiteOrApt = ShippingAddressDetails[0].SuiteOrApt;
    this.sh_AllowShipment = ShippingAddressDetails[0].AllowShipment
    this.model.ShipAddressBookId = ShippingAddressDetails[0].AddressId





  }


  getCustomerReferenceList() {
    var postdata = { CustomerId: this.CustomerId };
    this.commonService.postHttpService(postdata, 'getCustomerReferenceListDropdown').subscribe(response => {
      this.customerReferenceList = response.responseData;
    });
  }



  AddItem() {
    this.PartItem.push({
      "Part": '',
      "PartId": '',
      "PartNo": "",
      "PartDescription": "",
      "Quantity": "",
      "Rate": "",
      "Discount": "",
      // "Tax": "",
      "Price": "",
      "LeadTime": "",
      "WarrantyPeriod": undefined,
      "DeliveryDate": "2020-12-23",
      "AllowShipment": "",
      "Notes": "",
      "ItemStatus": "",
      "SOId": this.SOId,
      PON: '',
      RecommendedPrice: '',
      LPPList: [],
      "IsExcludeFromBlanketPO": 0,
      Tax: '',
      ItemTaxPercent: '',
      BasePrice: '',
      ItemLocalCurrencyCode: '',
      ItemExchangeRate: '',
      ItemBaseCurrencyCode: '',
      ItemLocalCurrencySymbol: this.SalesOrderInfo.CustomerCurrencySymbol,
      BaseRate: '',
      BaseTax: '',
      ShippingCharge: 0,
      BaseShippingCharge: 0
    });
  }

  removePartItem(i, SOItemId) {
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

        if (SOItemId != undefined) {
          if (this.SalesOrderInfo.CreatedByLocation == this.Location) {
            var postData = {
              "SOItemId": SOItemId,
              "TaxPercent": this.TaxPercent,
              "SOId": this.SOId
            }

            this.commonService.postHttpService(postData, 'DeleteSoItem').subscribe(response => {
              if (response.status == true) {
                this.PartItem.splice(i, 1)

                this.changeStatus(i)
                this.reLoad()
                Swal.fire({
                  title: 'Deleted!',
                  text: 'item has been deleted.',
                  type: 'success'
                });
              }
            });
          } else {
            Swal.fire({
              type: 'info',
              title: 'AH Country Mismatch',
              html: '<b style=" font-size: 14px !important;">' + (`SO Added from : <span class="badge badge-primary btn-xs">${this.SalesOrderInfo.CreatedByLocationName}</span> country. Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
              confirmButtonClass: 'btn btn-confirm mt-2',
            });
          }
        } else {
          this.PartItem.splice(i, 1)
          this.changeStatus(i)
        }

      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Item is safe:)',
          type: 'error'
        });
      }
    });
  }

  onMovetoExcludedParts(i, SOItemId, item) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'To Move this Part To  Excluded Part List !',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Move it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        if (SOItemId != undefined) {
          if (this.SalesOrderInfo.CreatedByLocation == this.Location) {

            var postData = {
              "SOItemId": SOItemId,
              "TaxPercent": this.TaxPercent,
              "SOId": this.SOId,
              "PartId": item.PartId
            }

            this.commonService.postHttpService(postData, 'onMovetoExcludedParts').subscribe(response => {
              if (response.status == true) {
                this.reLoad();
                Swal.fire({
                  title: 'Moved!',
                  text: 'item has been Moved To  Excluded Part List.',
                  type: 'success'
                });
              }
            });
          } else {
            Swal.fire({
              type: 'info',
              title: 'AH Country Mismatch',
              html: '<b style=" font-size: 14px !important;">' + (`SO Added from : <span class="badge badge-primary btn-xs">${this.SalesOrderInfo.CreatedByLocationName}</span> country. Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
              confirmButtonClass: 'btn btn-confirm mt-2',
            });
          }
        } else {
          this.ExcludedPartItem.push(item)
          this.PartItem.splice(i, 1)
          this.changeStatus(i)
        }
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Item is safe:)',
          type: 'error'
        });
      }
    });
  }



  AddExcludedPartItem() {
    if ((this.SalesOrderInfo.CustomerBlanketPOId == 0 && this.SalesOrderInfo.CustomerPONo != "")) {
      Swal.fire({
        title: 'Message',
        text: 'Excluded parts will be allowed only for Blanket PO.',
        type: 'info',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });

    } else {
      this.showExcludedPartItem = true
      this.ExcludedPartItem.push({
        "Part": '',
        "PartId": '',
        "PartNo": "",
        "PartDescription": "",
        "Quantity": "",
        "Rate": "",
        "Discount": "",
        // "Tax": "",
        "Price": "",
        "LeadTime": "",
        "WarrantyPeriod": undefined,
        "DeliveryDate": "",
        "AllowShipment": "",
        "Notes": "",
        "ItemStatus": "",
        "IsExcludeFromBlanketPO": 1,
        Tax: '',
        ItemTaxPercent: '',
        BasePrice: '',
        ItemLocalCurrencyCode: '',
        ItemExchangeRate: '',
        ItemBaseCurrencyCode: '',
        ItemLocalCurrencySymbol: this.SalesOrderInfo.CustomerCurrencySymbol,
        BaseRate: '',
        BaseTax: ''
      });
    }
  }

  removeExcludedPartItem(i, SOItemId) {
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
        if (SOItemId != undefined) {
          if (this.SalesOrderInfo.CreatedByLocation == this.Location) {

            var postData = {
              "SOItemId": SOItemId,
              "TaxPercent": this.TaxPercent,
              "SOId": this.SOId
            }

            this.commonService.postHttpService(postData, 'DeleteSoItem').subscribe(response => {
              if (response.status == true) {
                this.ExcludedPartItem.splice(i, 1);
                this.changeStatus(i)
                this.reLoad()
                Swal.fire({
                  title: 'Deleted!',
                  text: 'item has been deleted.',
                  type: 'success'
                });
              }
            });

          } else {
            Swal.fire({
              type: 'info',
              title: 'AH Country Mismatch',
              html: '<b style=" font-size: 14px !important;">' + (`SO Added from : <span class="badge badge-primary btn-xs">${this.SalesOrderInfo.CreatedByLocationName}</span> country. Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
              confirmButtonClass: 'btn btn-confirm mt-2',
            });
          }
        } else {
          this.ExcludedPartItem.splice(i, 1);
          this.changeStatus(i)
        }

      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Item is safe:)',
          type: 'error'
        });
      }
    });
  }
  onMovetoParts(j, SOItemId, item) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'To Move this Part To  Non-Excluded Part List !',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Move it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {

        if (SOItemId != undefined) {
          if (this.SalesOrderInfo.CreatedByLocation == this.Location) {

            var postData = {
              "SOItemId": SOItemId,
              "TaxPercent": this.TaxPercent,
              "SOId": this.SOId,
              "PartId": item.PartId
            }

            this.commonService.postHttpService(postData, 'onMovetoParts').subscribe(response => {
              if (response.status == true) {
                this.reLoad();
                Swal.fire({
                  title: 'Moved!',
                  text: 'item has been Moved To Non-Excluded List',
                  type: 'success'
                });
              }
            });
          } else {
            Swal.fire({
              type: 'info',
              title: 'AH Country Mismatch',
              html: '<b style=" font-size: 14px !important;">' + (`SO Added from : <span class="badge badge-primary btn-xs">${this.SalesOrderInfo.CreatedByLocationName}</span> country. Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
              confirmButtonClass: 'btn btn-confirm mt-2',
            });
          }
        } else {
          this.PartItem.push(item)
          this.ExcludedPartItem.splice(j, 1)
          this.changeStatus(j)
        }
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Item is safe:)',
          type: 'error'
        });
      }
    });
  }

  changeStatus(index) {
    var subTotal = 0;
    var subTotal1 = 0
    // Calculate the subtotal
    for (let i = 0; i < this.PartItem.length; i++) {

      subTotal += this.PartItem[i].Price

    }
    for (let i = 0; i < this.ExcludedPartItem.length; i++) {

      subTotal += this.ExcludedPartItem[i].Price
      subTotal1 += this.ExcludedPartItem[i].Price
    }
    this.BlanketPOExcludeAmount = subTotal1;
    this.SubTotal = subTotal
    this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }
  calculateTax() {
    this.TotalTax = this.SubTotal * this.TaxPercent / 100;
    this.calculateTotal();

  }
  calculatePrice(index) {
    var price = 0; var subTotal = 0; var Tax = 0;
    var subTotal1 = 0
    let Quantity = this.PartItem[index].Quantity || 0;
    let Rate = this.PartItem[index].Rate || 0;
    let ShippingCharge = this.PartItem[index].ShippingCharge || 0;
    let VatTax = this.PartItem[index].ItemTaxPercent / 100;
    let VatTaxPrice = Rate * VatTax
    // Calculate the price
    price = (parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice)) + parseFloat(ShippingCharge);
    Tax = (Rate * VatTax);
    this.PartItem[index].Price = price.toFixed(2);
    this.PartItem[index].Tax = Tax.toFixed(2);
    this.PartItem[index].TaxWithQuantity = (Quantity * Tax).toFixed(2);

    var TaxLocal = (Rate * VatTax);
    // console.log("priceUSD priceUSD priceUSD priceUSD");

    let priceUSD = price * this.ExchangeRate;
    let BaseShippingCharge = ShippingCharge * this.ExchangeRate
    this.PartItem[index].BaseShippingCharge = BaseShippingCharge.toFixed(2)
    this.PartItem[index].BasePrice = priceUSD.toFixed(2);
    let RateUSD = Rate * this.ExchangeRate;
    this.PartItem[index].BaseRate = RateUSD.toFixed(2);
    let BaseTaxUSD = TaxLocal * this.ExchangeRate;
    this.PartItem[index].BaseTax = BaseTaxUSD.toFixed(2);
    for (let i = 0; i < this.PartItem.length; i++) {
      subTotal += parseFloat(this.PartItem[i].Price);

    }
    for (let i = 0; i < this.ExcludedPartItem.length; i++) {
      subTotal += parseFloat(this.ExcludedPartItem[i].Price);
      subTotal1 += parseFloat(this.ExcludedPartItem[i].Price);

    }
    this.BlanketPOExcludeAmount = subTotal1.toFixed(2);
    //Calculate the subtotal
    this.SubTotal = subTotal;

    // this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }
  calculateTotal() {
    var total = 0;
    // let AdditionalCharge = this.AHFees || 0;
    // let Shipping = this.Shipping || 0;
    // let Discount = this.Discount || 0;

    total = parseFloat(this.SubTotal)
    //  + parseFloat(this.TotalTax) +
    //   parseFloat(AdditionalCharge) + parseFloat(Shipping) - parseFloat(Discount);
    this.GrandTotal = parseFloat(total.toFixed(2));
    this.BlanketPONetAmount = (this.GrandTotal - this.BlanketPOExcludeAmount).toFixed(2);

    this.GrandTotalUSD = (this.GrandTotal * this.ExchangeRate).toFixed(2)

  }
  ExcludedPartcalculatePrice(index) {
    var price = 0; var subTotal = 0; var Tax = 0;
    let Quantity = this.ExcludedPartItem[index].Quantity || 0;
    let Rate = this.ExcludedPartItem[index].Rate || 0;
    let VatTax = this.ExcludedPartItem[index].ItemTaxPercent / 100;
    let VatTaxPrice = Rate * VatTax;
    // Calculate the price
    price = parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice);
    Tax = (Rate * VatTax);
    this.ExcludedPartItem[index].Price = price.toFixed(2);
    this.ExcludedPartItem[index].Tax = Tax.toFixed(2);
    var TaxLocal = (Rate * VatTax);
    let priceUSD = price * this.ExchangeRate;
    this.ExcludedPartItem[index].BasePrice = priceUSD.toFixed(2);
    let RateUSD = Rate * this.ExchangeRate;
    this.ExcludedPartItem[index].BaseRate = RateUSD.toFixed(2);
    let BaseTaxUSD = TaxLocal * this.ExchangeRate;
    this.ExcludedPartItem[index].BaseTax = BaseTaxUSD.toFixed(2);
    for (let i = 0; i < this.ExcludedPartItem.length; i++) {
      subTotal += parseFloat(this.ExcludedPartItem[i].Price);

    }
    this.BlanketPOExcludeAmount = subTotal.toFixed(2);
    for (let i = 0; i < this.PartItem.length; i++) {

      subTotal += parseFloat(this.PartItem[i].Price);

    }
    //Calculate the subtotal
    this.SubTotal = subTotal.toFixed(2);


    // this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }

  onSubmit(f: NgForm) {
    //DateRequested
    const reqYears = this.model.RequestedDate.year;
    const reqDates = this.model.RequestedDate.day;
    const reqmonths = this.model.RequestedDate.month;
    let requestDates = new Date(reqYears, reqmonths - 1, reqDates);
    let DateRequested = moment(requestDates).format('YYYY-MM-DD');
    //DueDate
    const dueYears = this.model.DueDate.year;
    const dueDates = this.model.DueDate.day;
    const duemonths = this.model.DueDate.month;
    let dueDate = new Date(dueYears, duemonths - 1, dueDates);
    let DueDate = moment(dueDate).format('YYYY-MM-DD');
    var SalesOrderItem = []
    SalesOrderItem = this.PartItem.concat(this.ExcludedPartItem);
    if (f.valid) {
      if (this.SalesOrderInfo.CreatedByLocation == this.Location) {
        let obj = this
        obj.PartItem.filter(function (value) {
          if (value.ItemLocalCurrencySymbol != obj.SalesOrderInfo.CustomerCurrencySymbol) {
            this.isCurrencyMode = true
          }
        }, obj);
        obj.ExcludedPartItem.filter(function (value) {
          if (value.ItemLocalCurrencySymbol != obj.SalesOrderInfo.CustomerCurrencySymbol) {
            this.isCurrencyMode = true
          }
        }, obj);
        if (!this.isCurrencyMode) {
          this.btnDisabled = true;
          var postData = {


            "LocalCurrencyCode": this.CustomerCurrencyCode,
            "ExchangeRate": this.ExchangeRate,
            "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode'),
            "BaseGrandTotal": this.GrandTotalUSD,

            "SOId": this.SOId,
            "SONo": this.SalesOrderInfo.SONo,
            "RRId": this.SalesOrderInfo.RRId,
            "CustomerId": this.SalesOrderInfo.CustomerId,
            "SOType": this.model.SOType,
            "DateRequested": DateRequested,
            "DueDate": DueDate,
            "ReferenceNo": this.ReferenceNo,
            "ShipAddressBookId": this.model.sh_ShipCodeId,
            "BillAddressBookId": this.model.bi_BillCodeId,
            "Notes": this.Notes,
            "WarehouseId": this.WarehouseId,
            "SubTotal": this.SubTotal,
            "TotalTax": this.TotalTax,
            "Discount": this.Discount,
            "AHFees": this.AHFees,
            "Shipping": this.Shipping,
            "GrandTotal": this.GrandTotal,
            "TaxPercent": this.TaxPercent,
            "Status": this.model.Status,
            "BlanketPOExcludeAmount": this.BlanketPOExcludeAmount,
            "BlanketPONetAmount": this.BlanketPONetAmount,
            "SalesOrderItem": SalesOrderItem,
            "CustomerPONo": this.CustomerPONo,
            "MROId": this.SalesOrderInfo.MROId,
            "QuoteId": this.SalesOrderInfo.QuoteId,
            "CustomerBlanketPOId": this.SalesOrderInfo.CustomerBlanketPOId
          }
          this.commonService.putHttpService(postData, "editSalesOrder").subscribe(response => {
            if (response.status == true) {
              this.btnDisabled = false;
              this.reLoad()
              // this.navCtrl.navigate('/admin/orders/sales-list');
              Swal.fire({
                title: 'Success!',
                text: 'Sales Order Updated Successfully!',
                type: 'success',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            }
            else {
              this.btnDisabled = false;
              Swal.fire({
                title: 'Error!',
                text: response.message,
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
            text: `Customer Currency Code is Changed. Please contact admin to update a SO`,
            confirmButtonClass: 'btn btn-confirm mt-2',
          });
        }
      } else {
        Swal.fire({
          type: 'info',
          title: 'AH Country Mismatch',
          html: '<b style=" font-size: 14px !important;">' + (`SO Added from : <span class="badge badge-primary btn-xs">${this.SalesOrderInfo.CreatedByLocationName}</span> country. Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
          confirmButtonClass: 'btn btn-confirm mt-2',
        });
      }
    }
    else {
      this.btnDisabled = false;
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });

    }
  }




  backToRRView() {
    this.router.navigate(['/admin/repair-request/edit'], { state: { RRId: this.RRId } });
  }

  backToInvoiceView() {
    this.router.navigate(['/admin/invoice/list'], { state: { InvoiceId: this.SalesOrderInfo.InvoiceId } });
  }
  //Notes Section
  addNotes() {
    var IdentityId = this.SOId;
    var IdentityType = CONST_IDENTITY_TYPE_SO
    this.modalRef = this.CommonmodalService.show(AddNotesComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { IdentityId, IdentityType },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.SONotes.push(res.data);
    });
  }

  editNotes(note, i) {
    var IdentityId = this.SOId;
    var IdentityType = CONST_IDENTITY_TYPE_SO
    this.modalRef = this.CommonmodalService.show(EditNotesComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { note, i, IdentityId, IdentityType },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      }
    )

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.SONotes[i] = res.data;
    });
  }

  deleteNotes(NotesId, i) {
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
        var postData = {
          NotesId: NotesId,
        }
        this.commonService.postHttpService(postData, 'NotesDelete').subscribe(response => {
          if (response.status == true) {
            this.SONotes.splice(i, 1)
            Swal.fire({
              title: 'Deleted!',
              text: 'Notes has been deleted.',
              type: 'success'
            });
          }
        });

      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Notes is safe:)',
          type: 'error'
        });
      }
    });
  }




  //AttachementSection
  addAttachment() {
    var IdentityType = CONST_IDENTITY_TYPE_SO;
    var IdentityId = this.SOId
    this.modalRef = this.CommonmodalService.show(RRAddAttachmentComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { IdentityId, IdentityType },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.AttachmentList.push(res.data);
    });
  }

  editAttachment(attachment, i) {
    var IdentityType = CONST_IDENTITY_TYPE_SO;
    var IdentityId = this.SOId
    this.modalRef = this.CommonmodalService.show(RrEditAttachmentComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,

        initialState: {
          data: { attachment, i, IdentityType, IdentityId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.AttachmentList[i] = res.data
    });
  }

  deleteAttachment(AttachmentId, i) {
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
        var postData = {
          AttachmentId: AttachmentId,
        }
        this.commonService.postHttpService(postData, 'AttachmentDelete').subscribe(response => {
          if (response.status == true) {
            this.AttachmentList.splice(i, 1)
            Swal.fire({
              title: 'Deleted!',
              text: 'Attachment has been deleted.',
              type: 'success'
            });
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Attachment is safe:)',
          type: 'error'
        });
      }
    });
  }

  BackToView() {
    this.router.navigate(['/admin/orders/sales-list'], { state: { SOId: this.SalesOrderInfo.SOId } })
  }

  //CREATE PO From SO
  isAllSelected(event) {
    this.PartItem.map((item: any) => {
      if (item.POItemId == 0) {
        item.checked = event.target.checked;
      }
    });
  }
  CreatePOItem(event, i) {
    this.PartItem[i].checked = event.target.checked;
  }
  CreatePO() {

    var PartItem = this.PartItem
    var ExcludedPartItem = this.ExcludedPartItem
    var SOId = this.SOId
    //  var TaxPercent =  this.SalesOrderInfo.TaxPercent
    //  var TotalTax =  this.SalesOrderInfo.TotalTax
    //  var Discount =  this.SalesOrderInfo.Discount
    //  var AHFees = this.SalesOrderInfo.AHFees
    //  var Shipping = this.SalesOrderInfo.Shipping
    // TaxPercent,TotalTax,Discount,AHFees,Shipping
    this.modalRef = this.CommonmodalService.show(CreatePoInsoComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,

        initialState: {
          data: { PartItem, SOId, ExcludedPartItem },
          class: 'modal-xl'
        }, class: 'gray modal-xl'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      if (res) {
        this.reLoad();
      }
    });

    // } else {
    //   Swal.fire({
    //     type: 'info',
    //     title: 'Message',
    //     text: 'Please checked the Line Item',
    //     confirmButtonClass: 'btn btn-confirm mt-2',
    //   });

    // }
  }

  RevertInvoice() {
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
        if (this.SalesOrderInfo.IsCSVProcessed == 0) {
          var postData = {
            InvoiceId: this.SalesOrderInfo.InvoiceId,
          }
          this.commonService.postHttpService(postData, 'DeleteInvoice').subscribe(response => {
            if (response.status == true) {
              Swal.fire({
                title: 'Success!',
                text: 'Invoice Reverted Successfully!',
                type: 'success',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
              this.reLoad();
            } else {
              Swal.fire({
                title: 'Error!',
                text: response.message,
                type: 'warning',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            }
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Can not revert the invocie since it is processed. Please contact admin to revert this',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Invoice is safe:)',
          type: 'error'
        });
      }
    });
  }

  onUpdateCustomerPONo() {
    if (this.SalesOrderInfo.CustomerBlanketPOId == 0) {
      var ApproveType = "0"
    } else {
      var ApproveType = "1"
    }
    var CustomerBlanketPOId = this.SalesOrderInfo.CustomerBlanketPOId;
    var CustomerPONo = this.SalesOrderInfo.CustomerPONo;
    var RRId = this.RRId;
    var CustomerId = this.SalesOrderInfo.CustomerId;
    var GrandTotal = (this.SalesOrderInfo.GrandTotal).toFixed(2)
    var SOId = this.SOId;
    var MROId = this.SalesOrderInfo.MROId;
    var QuoteId = this.SalesOrderInfo.QuoteId;
    var BlanketPOExcludeAmount = this.SalesOrderInfo.BlanketPOExcludeAmount
    var BlanketPONetAmount = this.SalesOrderInfo.BlanketPONetAmount
    var ExcludedPartLength = this.ExcludedPartItem.length
    var CurrencySymbol = this.SalesOrderInfo.CurrencySymbol
    var ExchangeRate = this.SalesOrderInfo.ExchangeRate
    var LocalCurrencyCode = this.SalesOrderInfo.LocalCurrencyCode
    var Consolidated = this.SalesOrderInfo.Consolidated
    this.modalRef = this.CommonmodalService.show(BlanketPoNonRrEditComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { MROId, QuoteId, RRId, SOId, CustomerId, GrandTotal, ApproveType, CustomerBlanketPOId, CustomerPONo, BlanketPOExcludeAmount, BlanketPONetAmount, ExcludedPartLength, CurrencySymbol, ExchangeRate, LocalCurrencyCode, Consolidated },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.reLoad();
    });
  }
  getReplace(val) {
    // var firstdata = val.replace(/\'/g, "'");
    // console.log(firstdata)
    // var data = firstdata.replace(/\\/g, "");
    // console.log(data)
    // return data;
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
    // var data = val.replace(/'/g, "\'");
    // var data = val.replace("'","\\'")

    // console.log("data", data)
    // return data;

  }



  onVoidPartItem(i) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.PartItem[i].Rate = 0
        this.PartItem[i].ShippingCharge = 0
        this.calculatePrice(i)
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Item is safe:)',
          type: 'error'
        });
      }
    });
  }

  onVoid(j) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.ExcludedPartItem[j].Rate = 0
        this.ExcludedPartcalculatePrice(j)
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Item is safe:)',
          type: 'error'
        });
      }
    });
  }


  onCancelSO() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          "SOId": this.SOId
        }
        this.commonService.postHttpService(postData, 'CancelSO').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Cancelled SO!',
              text: 'SO Cancelled has been Updated.',
              type: 'success'
            });

            this.reLoad()
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Error',
          text: 'SO Cancelled has not Updated.',
          type: 'error'
        });
      }
    });

  }

}

