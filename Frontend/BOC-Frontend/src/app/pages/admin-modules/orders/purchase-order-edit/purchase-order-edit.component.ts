/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { NgbModal, NgbCalendar, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { DatePipe } from '@angular/common';
import { terms, PurchaseOrder_Status, warranty_list, CONST_IDENTITY_TYPE_PO, PurchaseOrder_Type, CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, CONST_AH_Group_ID, CONST_BillAddressType, CONST_ShipAddressType, Const_Alert_pop_title, Const_Alert_pop_message, PurchaseOrder_Status_expectApprove, VAT_field_Name, Shipping_field_Name, TOTAL_VAT_field_Name } from 'src/assets/data/dropdown';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RRAddAttachmentComponent } from '../../common-template/rr-add-attachment/rr-add-attachment.component';
import { RrEditAttachmentComponent } from '../../common-template/rr-edit-attachment/rr-edit-attachment.component';
import { AddNotesComponent } from '../../common-template/add-notes/add-notes.component';
import { EditNotesComponent } from '../../common-template/edit-notes/edit-notes.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailComponent } from '../../common-template/email/email.component';
import { NgForm } from '@angular/forms';
import { RrVendorInvoiceComponent } from '../../common-template/rr-vendor-invoice/rr-vendor-invoice.component';

@Component({
  selector: 'app-purchase-order-edit',
  templateUrl: './purchase-order-edit.component.html',
  styleUrls: ['./purchase-order-edit.component.scss'],
  providers: [DatePipe]
})
export class PurchaseOrderEditComponent implements OnInit {
  BillCode;
  vendor;
  ShipCode;
  BillCodeId;
  ShipCodeId;
  Requisition;
  add_po_number;
  po_date_requested;
  po_date_required;
  VendorName;
  UserName;
  User;
  po_delivery_method;
  SalesOrderNo;
  POId;
  Notes;
  btnDisabled: boolean = false;
  bi_BillCodeId;
  sh_ShipCodeId;
  AdditionalPONo;
  RequestedDate;
  DueDate;
  Status;
  SubTotal;
  GrandTotal;
  AdditionalCharge;
  TotalTax;
  PartNo;
  Discount;
  AHFees;
  Shipping;
  TaxPercent;
  ShippingAccountNumber;
  Code;
  ShipVia;
  StatusName;
  ApprovedByName;
  ApprovedDate;
  //dropdown
  VenodrAddressList;
  AddressList;
  VendorList;
  TermsList;
  PuchaseOrderStatus;
  warrantyList;
  //edit model
  PurchaseOrderInfo;
  BillingAddress;
  ShippingAddress;
  ContactAddress;
  PartItem: any = [];
  PurchaseOrderCustomerRef: any = [];
  ShippingAddressList: any = []; BillingAddressList: any = [];
  ShipAddress: any = []; BillAddress: any = []
  PONotes: any = [];
  AttachmentList: any = [];
  SOId;
  result;
  VendorId;
  CountryId;
  RRId;
  TermsId;
  BillAddressBookId;
  ShipAddressBookId;
  POType;
  PurchaseOrderType;
  partList;
  model: any = {};

  keyword = 'PartNo';
  filteredData: any[];
  isLoading: boolean = false;
  data = [];


  RRnumber;
  POnumber;
  BillName;
  ShipName;
  number;
  VendorAddress;
  PurchaseOrderItem: any = [];
  NotesList: any = [];
  RRNotesList: any = [];

  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;
  IsPrintPDFEnabled;
  IsEmailEnabled;
  IsExcelEnabled;
  IsConvertSOToInvoiceEnabled;
  IsNotesEnabled;
  IsApproveEnabled;
  IsNotesAddEnabled;
  IsNotesEditEnabled;
  IsNotesDeleteEnabled;
  IsAttachmentEnabled;
  IsAttachmentAddEnabled;
  IsAttachmentEditEnabled;
  IsAttachmentDeleteEnabled;
  IsRevertVendorBillInvoiceEnabled;
  settingsView;
  ShipViaList: any = [];
  CustomerId;
  ShipAddressIdentityType;
  ReopenPO
  VendorCode

  VAT_field_Name
  Shipping_field_Name
  IsDisplayBaseCurrencyValue
  Symbol
  VendorLocation
  VendorVatTax
  ExchangeRate
  VendorCurrencyCode
  GrandTotalUSD
  BaseCurrencySymbol
  isCurrencyMode: boolean = false;
  Location
  LocationName
  ShipAddressLoader: boolean = false;
  BillAddressLoader: boolean = false;
  REMIT_Address: any;
  constructor(private modalService: NgbModal, public navCtrl: NgxNavigationWithDataComponent, private cd_ref: ChangeDetectorRef, private commonService: CommonService,
    private httpClient: HttpClient, private datePipe: DatePipe, private CommonmodalService: BsModalService,
    public modalRef: BsModalRef,
    public router: Router, private route: ActivatedRoute
  ) { }
  currentRouter = decodeURIComponent(this.router.url);

  ngOnInit() {
    document.title = 'PO Edit'
    this.VAT_field_Name = TOTAL_VAT_field_Name; //VAT_field_Name
    this.Shipping_field_Name = Shipping_field_Name
    this.IsDisplayBaseCurrencyValue = localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol")
    this.settingsView = ""
    this.getAdminSettingsView();
    this.IsViewEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_DELETE_ACCESS);
    this.IsViewCostEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_VIEW_COST_ACCESS);
    this.IsApproveEnabled = this.commonService.permissionCheck("ManagePurchaseOrder", CONST_APPROVE_ACCESS);
    this.IsPrintPDFEnabled = this.commonService.permissionCheck("POPrintAndPDFExport", CONST_VIEW_ACCESS);
    this.IsEmailEnabled = this.commonService.permissionCheck("POEmail", CONST_VIEW_ACCESS);
    this.IsExcelEnabled = this.commonService.permissionCheck("PODownloadExcel", CONST_VIEW_ACCESS);
    this.IsNotesEnabled = this.commonService.permissionCheck("PONotes", CONST_VIEW_ACCESS);
    // this.IsApproveEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_APPROVE_ACCESS);
    this.IsNotesAddEnabled = this.commonService.permissionCheck("PONotes", CONST_CREATE_ACCESS);
    this.IsNotesEditEnabled = this.commonService.permissionCheck("PONotes", CONST_MODIFY_ACCESS);
    this.IsNotesDeleteEnabled = this.commonService.permissionCheck("PONotes", CONST_DELETE_ACCESS);
    this.IsRevertVendorBillInvoiceEnabled = this.commonService.permissionCheck("RevertVendorBill", CONST_VIEW_ACCESS);

    this.IsAttachmentEnabled = this.commonService.permissionCheck("POAttachment", CONST_VIEW_ACCESS);
    this.IsAttachmentAddEnabled = this.commonService.permissionCheck("POAttachment", CONST_CREATE_ACCESS);
    this.IsAttachmentEditEnabled = this.commonService.permissionCheck("POAttachment", CONST_MODIFY_ACCESS);
    this.IsAttachmentDeleteEnabled = this.commonService.permissionCheck("POAttachment", CONST_DELETE_ACCESS);
    this.ReopenPO = this.commonService.permissionCheck("ReopenPO", CONST_VIEW_ACCESS);


    this.PurchaseOrderInfo = ""
    this.PartItem = [];
    this.BillingAddress = "";
    this.ShippingAddress = "";
    this.ContactAddress = ""
    this.PurchaseOrderCustomerRef = [];
    this.PONotes = [];
    this.AttachmentList = [];
    this.REMIT_Address = "";
    //this.POId = this.navCtrl.get('POId');


    if (history.state.POId == undefined) {
      this.route.queryParams.subscribe(
        params => {
          this.POId = params['POId'];

        }
      )
    }
    else if (history.state.POId != undefined) {
      this.POId = history.state.POId
    }
    // Redirect to the List page if the View Id is not available
    if (this.POId == '' || this.POId == 'undefined' || this.POId == null) {
      this.navCtrl.navigate('/admin/PO-Order-List');
      return false;
    }
    this.getTermList();
    this.getShipViaList();
    this.getViewContent();
    this.PuchaseOrderStatus = PurchaseOrder_Status_expectApprove;
    this.PurchaseOrderType = PurchaseOrder_Type;
    this.warrantyList = warranty_list;

    this.Location = localStorage.getItem("Location");
    this.LocationName = localStorage.getItem("LocationName");




  }
  getVendoraddress() {
    var postData = {
      "IdentityId": this.PurchaseOrderInfo.VendorId,
      "IdentityType": 2,
      "Type": CONST_ShipAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.VendorAddress = response.responseData[0];
    })
  }
  getShipViaList() {
    this.commonService.getHttpService("ShipViaList").subscribe(response => {
      if (response.status == true) {
        this.ShipViaList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  getTermList() {
    this.commonService.getHttpService("getTermsList").subscribe(response => {
      if (response.status == true) {
        this.TermsList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
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
    this.router.navigate([this.currentRouter.split('?')[0]], { queryParams: { POId: this.POId } })

    // this.router.navigate([this.currentRouter])
  }
  getViewContent() {
    //View content
    var postData = {
      POId: this.POId,
    }
    this.commonService.postHttpService(postData, "getPuchaseOrderView").subscribe(response => {
      if (response.status == true) {
        this.result = response.responseData;
        this.PurchaseOrderInfo = this.result.POInfo;
        this.BillingAddress = this.result.BillingAddress[0];
        this.ShippingAddress = this.result.ShippingAddress[0];
        this.ContactAddress = this.result.ContactAddress[0];
        this.PartItem = this.result.POItem;
        for (var i = 0; i < this.PartItem.length; i++) {
          this.PartItem.every(function (item: any) {
            return item.Part = item.PartNo

          })
        }
        this.CustomerId = this.PurchaseOrderInfo.CustomerId
        this.PONotes = this.result.NotesList;
        this.RRId = this.PurchaseOrderInfo.RRId
        this.AttachmentList = this.result.AttachmentList;
        this.PurchaseOrderCustomerRef = this.result.CustomerRef
        this.ShipAddressBookId = this.PurchaseOrderInfo.ShipAddressBookId;
        this.ShipAddressIdentityType = this.PurchaseOrderInfo.ShipAddressIdentityType
        this.BillAddressBookId = this.PurchaseOrderInfo.BillAddressBookId;
        this.ShippingAccountNumber = this.PurchaseOrderInfo.ShippingAccountNumber;
        this.Code = this.PurchaseOrderInfo.Code
        this.ShipVia = this.PurchaseOrderInfo.ShipVia;
        this.REMIT_Address = this.result.RemitAddress[0];
        this.Notes = this.PurchaseOrderInfo.ShippingNotes;
        this.model.VendorId = this.PurchaseOrderInfo.VendorId;
        // this.AdditionalPONo = this.PurchaseOrderInfo.AdditionalPONo;
        this.model.TermsId = this.PurchaseOrderInfo.TermsId
        this.model.Status = this.PurchaseOrderInfo.Status;
        this.model.POType = this.PurchaseOrderInfo.POType;
        this.model.VendorRefNo = this.PurchaseOrderInfo.VendorRefNo
        this.StatusName = this.PurchaseOrderInfo.StatusName;

        this.RRId = this.PurchaseOrderInfo.RRId
        this.GrandTotalUSD = this.PurchaseOrderInfo.BaseGrandTotal;
        this.ExchangeRate = this.PurchaseOrderInfo.ExchangeRate
        this.Symbol = this.PurchaseOrderInfo.CurrencySymbol
        this.VendorLocation = this.PurchaseOrderInfo.VendorLocation
        this.VendorVatTax = this.PurchaseOrderInfo.VatTaxPercentage
        this.VendorCurrencyCode = this.PurchaseOrderInfo.VendorCurrencyCode
        const Requestedyear = Number(this.datePipe.transform(this.PurchaseOrderInfo.DateRequested, 'yyyy'));
        const RequestedMonth = Number(this.datePipe.transform(this.PurchaseOrderInfo.DateRequested, 'MM'));
        const RequestedDay = Number(this.datePipe.transform(this.PurchaseOrderInfo.DateRequested, 'dd'));
        this.model.RequestedDate = {
          year: Requestedyear,
          month: RequestedMonth,
          day: RequestedDay
        }
        const years = Number(this.datePipe.transform(this.PurchaseOrderInfo.DueDate, 'yyyy'));
        const Month = Number(this.datePipe.transform(this.PurchaseOrderInfo.DueDate, 'MM'));
        const Day = Number(this.datePipe.transform(this.PurchaseOrderInfo.DueDate, 'dd'));
        this.model.DueDate = {
          year: years,
          month: Month,
          day: Day
        }

        this.TotalTax = this.PurchaseOrderInfo.TotalTax;
        this.Discount = this.PurchaseOrderInfo.Discount;
        this.AHFees = this.PurchaseOrderInfo.AHFees;
        this.GrandTotal = this.PurchaseOrderInfo.GrandTotal;
        this.Shipping = this.PurchaseOrderInfo.Shipping;
        this.SubTotal = this.PurchaseOrderInfo.SubTotal;
        this.TaxPercent = this.PurchaseOrderInfo.TaxPercent


        //For Email Attachment
        this.PurchaseOrderItem = this.result.POItem;
        this.NotesList = this.result.NotesList;
        this.RRNotesList = this.result.RRNotesList
        if (this.PurchaseOrderInfo.RRId != 0) {
          this.number = this.PurchaseOrderInfo.RRNo
          this.RRnumber = this.PurchaseOrderInfo.RRNo
        }
        else {
          this.number = this.PurchaseOrderInfo.PONo
          this.POnumber = this.PurchaseOrderInfo.PONo
        }
        this.Status = this.PurchaseOrderInfo.Status;
        this.getVendoraddress();
        this.PartItem.map(a => {
          a.TaxWithQuantity = (a.Quantity * a.Tax).toFixed(2);
        })
        this.model.Type = (this.ShipAddressIdentityType).toString();
        // console.log(this.model.Type);
        if (this.model.Type == 2) {
          this.setahShipAddress(this.model.Type);
        } else if (this.model.Type == 1) {
          this.setCustomerShipAddress(this.model.Type);
        }


        //Dropdown
        this.getVendorList();


        if (this.RRId == 0) {
          this.getAHGroupaddress();
          var initship;
          if (this.ShipAddressIdentityType == 1) {
            initship = this.CustomerId
            var postData1 = {
              "IdentityId": initship,
              "IdentityType": this.ShipAddressIdentityType,
              "Type": CONST_ShipAddressType

            }
            this.commonService.postHttpService(postData1, 'getAddressList').subscribe(response => {
              this.ShippingAddressList = response.responseData;
              this.ShipAddress = response.responseData.map(function (value) {
                return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
              });



              let obj = this
              var ShippingAddress = obj.ShippingAddressList.filter(function (value) {
                if (value.IsShippingAddress == 1) {
                  return value.AddressId
                }
              }, obj);
              this.model.sh_ShipCodeId = ShippingAddress[0].AddressId
            });
          }
          else {
            initship = CONST_AH_Group_ID
            this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(response => {
              if (response.status == true) {
                this.ShippingAddressList = response.responseData.AHGroupVendorAddress;

                this.ShipAddress = response.responseData.AHGroupVendorAddress.map(function (value) {
                  return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
                });
              }
              // var postData = {
              //   "IdentityId": initship,
              //   "IdentityType": this.ShipAddressIdentityType,
              //   "Type": CONST_ShipAddressType

              // }
              // this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
              //   this.ShippingAddressList = response.responseData;
              //   this.ShipAddress = response.responseData.map(function (value) {
              //     return { title: value.StreetAddress + " , " + value.City + " , " + value.CountryName + " ," + value.StateName + ".-" + value.Zip, "AddressId": value.AddressId }
              //   });



              let obj = this
              var ShippingAddress = obj.ShippingAddressList.filter(function (value) {
                if (value.AddressId == obj.ShipAddressBookId) {
                  //  value.AddressId
                  return this.model.sh_ShipCodeId = value.AddressId
                }
              }, obj);

            });
          }

        }
        else {
          this.getVendorAddressList();
          var initship;
          if (this.ShipAddressIdentityType == 1) {
            initship = this.CustomerId
            var postData1 = {
              "IdentityId": initship,
              "IdentityType": this.ShipAddressIdentityType,
              "Type": CONST_ShipAddressType

            }
            this.commonService.postHttpService(postData1, 'getAddressList').subscribe(response => {
              this.ShippingAddressList = response.responseData;
              this.ShipAddress = response.responseData.map(function (value) {
                return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
              });



              let obj = this
              var ShippingAddress = obj.ShippingAddressList.filter(function (value) {
                if (value.IsShippingAddress == 1) {
                  return value.AddressId
                }
              }, obj);
              this.model.sh_ShipCodeId = ShippingAddress[0].AddressId
            });
          }
          else {
            initship = CONST_AH_Group_ID
            this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(response => {
              if (response.status == true) {
                this.ShippingAddressList = response.responseData.AHGroupVendorAddress;

                this.ShipAddress = response.responseData.AHGroupVendorAddress.map(function (value) {
                  return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
                });
              }
              // var postData = {
              //   "IdentityId": initship,
              //   "IdentityType": this.ShipAddressIdentityType,
              //   "Type": CONST_ShipAddressType

              // }
              // this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
              //   this.ShippingAddressList = response.responseData;
              //   this.ShipAddress = response.responseData.map(function (value) {
              //     return { title: value.StreetAddress + " , " + value.City + " , " + value.CountryName + " ," + value.StateName + ".-" + value.Zip, "AddressId": value.AddressId }
              //   });



              let obj = this
              var ShippingAddress = obj.ShippingAddressList.filter(function (value) {
                if (value.AddressId == obj.ShipAddressBookId) {
                  //  value.AddressId
                  return this.model.sh_ShipCodeId = value.AddressId
                }
              }, obj);

            });
          }


        }

      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }

  getAHGroupaddress() {
    // var postData = {
    //   "IdentityId": CONST_AH_Group_ID,
    //   "IdentityType": 2,
    //   "Type": CONST_BillAddressType

    // // }
    // this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
    //   this.BillingAddressList = response.responseData;
    //   this.BillAddress = response.responseData.map(function (value) {
    //     return { title: value.StreetAddress + " , " + value.City + " , " + value.CountryName + " ," + value.StateName + ".-" + value.Zip, "AddressId": value.AddressId }
    //   });


    this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(response => {
      if (response.status == true) {
        this.BillingAddressList = response.responseData.AHGroupVendorAddress;

        this.BillAddress = response.responseData.AHGroupVendorAddress.map(function (value) {
          return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
        });
      }
      //BillingAddress
      let obj = this
      var BillingAddress = obj.BillingAddressList.filter(function (value) {
        if (value.IsBillingAddress == 1) {
          return value.AddressId
        }
      }, obj);
      this.model.bi_BillCodeId = BillingAddress[0].AddressId
    });

    // this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(response => {
    //   if (response.status == true) {
    //     this.ShippingAddressList = response.responseData.AHGroupVendorAddress;

    //     this.ShipAddress = response.responseData.AHGroupVendorAddress.map(function (value) {
    //       return { title: value.StreetAddress + " , " + value.City + " , " + value.CountryName + " ," + value.StateName + ".-" + value.Zip, "AddressId": value.AddressId }
    //     });
    //   }
    //   //shippingAddress
    //   let obj = this
    //   var ShippingAddress = obj.ShippingAddressList.filter(function (value) {
    //     if (value.IsShippingAddress == 1) {
    //       return value.AddressId
    //     }
    //   }, obj);
    //   this.model.sh_ShipCodeId = ShippingAddress[0].AddressId

    //})
  }


  getVendorAddressList() {
    var postData = {
      "IdentityId": CONST_AH_Group_ID,
      "IdentityType": 2,
      "Type": CONST_BillAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.BillingAddressList = response.responseData;
      this.BillAddress = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });

      //BillingAddress
      let obj = this
      var BillingAddress = obj.BillingAddressList.filter(function (value) {
        if (value.IsBillingAddress == 1) {
          return value.AddressId
        }
      }, obj);
      this.model.bi_BillCodeId = BillingAddress[0].AddressId;
    });

  }

  setahShipAddress(value) {
    if (value == 2) {
      this.ShipAddressLoader = true;
      this.model.sh_ShipCodeId = 0;
      this.ShipAddressIdentityType = 2
      this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(response => {
        if (response.status == true) {
          this.ShippingAddressList = response.responseData.AHGroupVendorAddress;

          this.ShipAddress = response.responseData.AHGroupVendorAddress.map(function (value) {
            return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
          });
          //shippingAddress
          let obj = this
          var ShippingAddress = obj.ShippingAddressList.filter(function (value) {
            if (value.IsShippingAddress == 1) {
              return value.AddressId
            }
          }, obj);
          this.model.sh_ShipCodeId = ShippingAddress[0].AddressId;
          this.ShipAddressLoader = false;
        } else {
          this.ShipAddressLoader = false;
        }
      })
    }
  }
  setCustomerShipAddress(value) {
    if (value == 1) {
      this.ShipAddressLoader = true;
      this.model.sh_ShipCodeId = 0;
      this.ShippingAddressList = this.result.ShipAddressList;
      var resData = this.result.ShipAddressList;
      this.ShipAddress = resData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });
      let obj = this
      var ShippingAddress = obj.ShippingAddressList.filter(function (value) {
        // console.log(value.AddressId);
        if (this.PurchaseOrderInfo.CustomerShipIdLocked > 0) {
          if (value.AddressId == this.PurchaseOrderInfo.CustomerShipIdLocked) {
            return value.AddressId
          }
        } else {
          if (value.IsShippingAddress == 1) {
            return value.AddressId
          }
        }
      }, obj);
      this.model.sh_ShipCodeId = ShippingAddress[0].AddressId;
      this.ShipAddressLoader = false;
    }
  }
  getVendorDetails(VendorId) {
    //getdeliverymethod
    let obj = this
    var po_delivery_method = obj.VendorList.filter(function (value) {
      if (VendorId == value.VendorId) {
        return value.PODeliveryMethodName
      }
    }, obj);
    this.po_delivery_method = po_delivery_method[0].PODeliveryMethodName

    this.VendorCode = this.VendorList.find(a => a.VendorId == VendorId).VendorCode

  }
  getVendorList() {
    this.commonService.getHttpService("getVendorListDropdown").subscribe(response => {
      if (response.status == true) {
        this.VendorList = response.responseData;
        this.VendorCode = this.VendorList.find(a => a.VendorId == this.PurchaseOrderInfo.VendorId).VendorCode
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }




  AddItem() {
    this.PartItem.push({
      "Part": '',
      "PartId": '',
      "PartNo": "",
      "Description": "",
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

      PON: '',
      RecommendedPrice: '',
      LPPList: [],
      Tax: '',
      ItemTaxPercent: '',
      BasePrice: '',
      ItemLocalCurrencyCode: '',
      ItemExchangeRate: '',
      ItemBaseCurrencyCode: '',
      ItemLocalCurrencySymbol: this.PurchaseOrderInfo.VendorCurrencySymbol,
      BaseRate: '',
      BaseTax: '',
      ShippingCharge: 0,
      BaseShippingCharge: 0


    });
  }


  removePartItem(i, POItemId) {


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
        if (POItemId != undefined) {
          if (this.PurchaseOrderInfo.CreatedByLocation == this.Location) {

            var postData = {
              "POItemId": POItemId,
              "TaxPercent": this.TaxPercent,
              "POId": this.POId
            }

            this.commonService.postHttpService(postData, 'DeletePoItem').subscribe(response => {
              if (response.status == true) {
                this.PartItem.splice(i, 1)

                this.changeStatus(i)

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
              html: '<b style=" font-size: 14px !important;">' + (`PO Added from : <span class="badge badge-primary btn-xs">${this.PurchaseOrderInfo.CreatedByLocationName}</span> country.Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
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

  selectEvent(item, i) {
    var postData = { PartId: item.PartId, "VendorId": this.model.VendorId };
    this.commonService.postHttpService(postData, 'getPartDetails').subscribe(response => {

      this.ExchangeRate = response.responseData[0].ExchangeRate
      if (this.VendorCurrencyCode != localStorage.getItem('BaseCurrencyCode')) {
        if (this.ExchangeRate == null) {
          Swal.fire({
            type: 'info',
            title: 'Message',
            text: `Exchange rate is not available for ${this.VendorCurrencyCode} to USD. Please contact admin to create a quote`,
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
            this.PartItem[i].PartDescription = response.responseData[0].Description,
            this.PartItem[i].Quantity = response.responseData[0].Quantity,
            this.PartItem[i].Rate = response.responseData[0].Price
          this.PartItem[i].ItemLocalCurrencyCode = this.VendorCurrencyCode
          this.PartItem[i].ItemExchangeRate = this.ExchangeRate
          this.PartItem[i].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
          this.PartItem[i].ItemLocalCurrencySymbol = this.PurchaseOrderInfo.VendorCurrencySymbol

          if (localStorage.getItem('Location') == this.VendorLocation) {

            if (response.responseData[0].PartVatTaxPercentage != null) {
              this.PartItem[i].ItemTaxPercent = response.responseData[0].PartVatTaxPercentage
            } else {
              this.PartItem[i].ItemTaxPercent = this.VendorVatTax
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
          this.PartItem[i].PartDescription = response.responseData[0].Description,
          this.PartItem[i].Quantity = response.responseData[0].Quantity,
          this.PartItem[i].Rate = response.responseData[0].Price
        this.PartItem[i].ItemLocalCurrencyCode = this.VendorCurrencyCode
        this.PartItem[i].ItemExchangeRate = this.ExchangeRate
        this.PartItem[i].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
        this.PartItem[i].ItemLocalCurrencySymbol = this.PurchaseOrderInfo.VendorCurrencySymbol

        if (localStorage.getItem('Location') == this.VendorLocation) {

          if (response.responseData[0].PartVatTaxPercentage != null) {
            this.PartItem[i].ItemTaxPercent = response.responseData[0].PartVatTaxPercentage
          } else {
            this.PartItem[i].ItemTaxPercent = this.VendorVatTax
          }

        } else {
          this.PartItem[i].ItemTaxPercent = '0'
        }
        this.calculatePrice(i)
      }
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

  changeStatus(index) {
    var subTotal = 0;
    // Calculate the subtotal
    for (let i = 0; i < this.PartItem.length; i++) {

      subTotal += this.PartItem[i].Price

    }
    this.SubTotal = subTotal
    // this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }
  calculateTax() {
    this.TotalTax = this.SubTotal * this.TaxPercent / 100;
    this.calculateTotal();

  }
  calculatePrice(index) {
    var price = 0; var subTotal = 0;
    var subTotal1 = 0
    let Quantity = this.PartItem[index].Quantity || 0;
    let Rate = this.PartItem[index].Rate || 0;
    let ShippingCharge = this.PartItem[index].ShippingCharge || 0;
    let VatTax = this.PartItem[index].ItemTaxPercent / 100;
    let VatTaxPrice = Rate * VatTax
    // Calculate the price
    price = (parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice)) + parseFloat(ShippingCharge);
    var TaxLocal = (Rate * VatTax)
    this.PartItem[index].Price = parseFloat(price.toFixed(2)); // price.toFixed(2);
    this.PartItem[index].Tax = (Rate * VatTax).toFixed(2);
    this.PartItem[index].TaxWithQuantity = (Quantity * VatTaxPrice).toFixed(2);
    let BaseShippingCharge = ShippingCharge * this.ExchangeRate
    this.PartItem[index].BaseShippingCharge = BaseShippingCharge.toFixed(2)
    let priceUSD = price * this.ExchangeRate
    this.PartItem[index].BasePrice = priceUSD.toFixed(2)
    let RateUSD = Rate * this.ExchangeRate
    this.PartItem[index].BaseRate = RateUSD.toFixed(2);
    let BaseTaxUSD = TaxLocal * this.ExchangeRate
    this.PartItem[index].BaseTax = BaseTaxUSD.toFixed(2);

    for (let i = 0; i < this.PartItem.length; i++) {
      subTotal += this.PartItem[i].Price

    }

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

    this.GrandTotalUSD = (this.GrandTotal * this.ExchangeRate).toFixed(2)

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

    if (f.valid) {
      if (this.PurchaseOrderInfo.CreatedByLocation == this.Location) {
        let obj = this
        obj.PartItem.filter(function (value) {
          if (value.ItemLocalCurrencySymbol != obj.PurchaseOrderInfo.VendorCurrencySymbol) {
            this.isCurrencyMode = true
          }
        }, obj);
        if (!this.isCurrencyMode) {
          this.btnDisabled = true;
          var postData = {

            "LocalCurrencyCode": this.VendorCurrencyCode,
            "ExchangeRate": this.ExchangeRate,
            "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode'),
            "BaseGrandTotal": this.GrandTotalUSD,
            "POId": this.POId,
            "RRId": this.RRId,
            "VendorId": this.model.VendorId,
            "VendorRefNo": (this.model.VendorRefNo).trim(),
            "POType": this.model.POType,
            "TermsId": this.model.TermsId,
            "DateRequested": DateRequested,
            "DueDate": DueDate,
            "ShippingAccountNumber": this.ShippingAccountNumber,
            "ShipAddressIdentityType": this.ShipAddressIdentityType,
            "ShipVia": this.ShipVia,
            // "AdditionalPONo": this.AdditionalPONo,
            "ShipAddressBookId": this.model.sh_ShipCodeId,
            "BillAddressBookId": this.model.bi_BillCodeId,
            "ShippingNotes": this.Notes,
            "SubTotal": this.SubTotal,
            "TotalTax": this.TotalTax,
            "Discount": this.Discount,
            "AHFees": this.AHFees,
            "Shipping": this.Shipping,
            "GrandTotal": this.GrandTotal,
            "TaxPercent": this.TaxPercent,

            "Status": this.model.Status,
            "PurchaseOrderItem": this.PartItem

          }
          this.commonService.postHttpService(postData, "editPurchaseOrder").subscribe(response => {
            if (response.status == true) {
              this.btnDisabled = false;
              this.reLoad()
              // this.navCtrl.navigate('/admin/orders/purchase-list');
              Swal.fire({
                title: 'Success!',
                text: 'Purchase Order Updated Successfully!',
                type: 'success',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });
            }
            else {
              this.btnDisabled = false;
              Swal.fire({
                title: 'Error!',
                text: 'Purchase Order could not be Updated!',
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
            text: `Vendor Currency Code is Changed. Please contact admin to update a PO`,
            confirmButtonClass: 'btn btn-confirm mt-2',
          });
        }
      } else {
        Swal.fire({
          type: 'info',
          title: 'AH Country Mismatch',
          html: '<b style=" font-size: 14px !important;">' + (`PO Added from : <span class="badge badge-primary btn-xs">${this.PurchaseOrderInfo.CreatedByLocationName}</span> country.Now the AH Country is : <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
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


  itemDelete() {
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
        Swal.fire({
          title: 'Deleted!',
          text: 'Item has been deleted.',
          type: 'success'
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: ' Item  is safe :)',
          type: 'error'
        });
      }
    });

  }




  backToRRView() {
    this.router.navigate(['/admin/repair-request/edit'], { state: { RRId: this.PurchaseOrderInfo.RRId } });
  }

  //Email
  POEmail() {
    this.getPdfBase64((pdfBase64) => {
      let fileName = `Purchase Order ${this.number}.pdf`;
      var RRId = this.RRId
      var IdentityId = this.POId
      var IdentityType = CONST_IDENTITY_TYPE_PO
      var followupName = "Purchase Order"
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
    this.commonService.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        PurchaseOrderInfo: this.PurchaseOrderInfo,
        RemitToAddress: this.REMIT_Address,
        VendorAddress: this.VendorAddress,
        BillName: this.BillName,
        BillingAddress: this.BillingAddress,
        ShipName: this.ShipName,
        ShippingAddress: this.ShippingAddress,
        ContactAddress: this.ContactAddress,
        PurchaseOrderItem: this.PurchaseOrderItem,
        settingsView: this.settingsView,
        NotesList: this.NotesList,
        RRNotesList: this.RRNotesList,
        Status: this.Status,
        Logo: base64
      }

      this.commonService.postHttpService({ pdfObj }, "getPOPdfBase64").subscribe(response => {
        if (response.status == true) {
          cb(response.responseData.pdfBase64);
        }
      });
    })
  }

  onApprovedPO() {
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
          POId: this.POId,
        }
        this.commonService.postHttpService(postData, 'ApprovedPO').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Approved PO!',
              text: 'Purchase Order Approved has been Updated.',
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
          text: 'Purchase Order Approved has not Updated.',
          type: 'error'
        });
      }
    });



  }
  onReOpenPO() {
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
          POId: this.POId,
        }
        this.commonService.postHttpService(postData, 'ReopenPO').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'ReOpen PO!',
              text: 'Purchase Order ReOpen has been Updated.',
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
          text: 'Purchase Order ReOpen has not Updated.',
          type: 'error'
        });
      }
    });



  }


  //Notes Section
  addNotes() {
    var IdentityId = this.POId;
    var IdentityType = CONST_IDENTITY_TYPE_PO
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
      this.PONotes.push(res.data);
    });
  }

  editNotes(note, i) {
    var IdentityId = this.POId;
    var IdentityType = CONST_IDENTITY_TYPE_PO
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
      this.PONotes[i] = res.data;
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
            this.PONotes.splice(i, 1)
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
    var IdentityType = CONST_IDENTITY_TYPE_PO;
    var IdentityId = this.POId
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
    var IdentityType = CONST_IDENTITY_TYPE_PO;
    var IdentityId = this.POId
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
    this.router.navigate(['/admin/orders/purchase-list'], { state: { POId: this.PurchaseOrderInfo.POId } })
  }



  //Create Invoice
  CreateVendorInvoice() {
    var RRId = this.RRId;
    var QuoteId = this.PurchaseOrderInfo.QuoteId;
    var CustomerId = this.PurchaseOrderInfo.CustomerId;
    var POId = this.PurchaseOrderInfo.POId;
    var SOId = this.PurchaseOrderInfo.SOId;
    var POAmount = this.PurchaseOrderInfo.GrandTotal
    var IsInvoiceApproved = this.PurchaseOrderInfo.IsInvoiceApproved
    var CurrencySymbol = this.PurchaseOrderInfo.CurrencySymbol
    this.modalRef = this.CommonmodalService.show(RrVendorInvoiceComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { RRId, QuoteId, CustomerId, POId, SOId, POAmount, IsInvoiceApproved, CurrencySymbol },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.reLoad();
    });


  }

  RevertVendorBill() {
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
        if (this.PurchaseOrderInfo.IsCSVProcessed == 0) {
          var postData = {
            VendorInvoiceId: this.PurchaseOrderInfo.VendorInvoiceId,
          }
          this.commonService.postHttpService(postData, 'DeleteVendorInvoice').subscribe(response => {
            if (response.status == true) {
              Swal.fire({
                title: 'Success!',
                text: 'Vendor Bill Reverted Successfully!',
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
          text: 'Vendor Bill is safe:)',
          type: 'error'
        });
      }
    });
  }
}
