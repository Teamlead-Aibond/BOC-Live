/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { NgbModal, NgbDateAdapter, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { DatePipe } from '@angular/common';
import { terms, PurchaseOrder_Status, warranty_list, Invoice_Status, CONST_IDENTITY_TYPE_INVOICE, Customer_Invoice_Status, Customer_Invoice_Status_expectApprove, CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, CONST_AH_Group_ID, CONST_ShipAddressType, CONST_BillAddressType, Const_Alert_pop_message, Const_Alert_pop_title, CONST_IDENTITY_TYPE_RR, VAT_field_Name, TOTAL_VAT_field_Name, Shipping_field_Name } from 'src/assets/data/dropdown';
import { AddRrPartsComponent } from '../../common-template/add-rr-parts/add-rr-parts.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AddNotesComponent } from '../../common-template/add-notes/add-notes.component';
import { EditNotesComponent } from '../../common-template/edit-notes/edit-notes.component';
import { RRAddAttachmentComponent } from '../../common-template/rr-add-attachment/rr-add-attachment.component';
import { RrEditAttachmentComponent } from '../../common-template/rr-edit-attachment/rr-edit-attachment.component';
import { EmailComponent } from '../../common-template/email/email.component';
import { NgForm } from '@angular/forms';
import { AddReferenceComponent } from '../../common-template/add-reference/add-reference.component';
import { CustomerReferenceComponent } from '../../common-template/customer-reference/customer-reference.component';
import { BlanketPoInvoiceEditComponent } from '../../common-template/blanket-po-invoice-edit/blanket-po-invoice-edit.component';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.scss'],
})
export class EditInvoiceComponent implements OnInit {
  BillCode;
  VendorPOCost
  VendorPOCost1
  submitted = false;
  ShippingHistory;
  btnDisabled: boolean = false;
  CONST_AH_Group_ID;
  ShippingAddressList: any = []; BillingAddressList: any = [];
  ShipAddress: any = []; BillAddress: any = []
  Shipping_method;
  invoice_date;
  due_date;
  BillCodeId;
  BillName;
  StreetAddress;
  Suite;
  Zip;
  City;
  BillState;
  salestax;
  Discount;
  Shipping;
  grandtotal;
  AHFees;
  TaxPercent;
  InvoiceId;
  RRId;
  SubTotal;
  GrandTotal;
  TotalTax;
  //view;
  result;
  InvoiceInfo;
  BillingAddress;
  RemitToAddress;
  ContactAddress;
  InvoiceCustomerRef: any = []
  InvoiceItem: any = [];
  CustomerRef: any = [];
  model: any = [];
  InvoiceNotes: any = [];
  AttachmentList: any = [];
  //Dropdown
  TermsList;
  warrantyList;
  Customer_Invoice_Status_edit;
  customerList;
  AddressList;
  customerAddressList;
  partList;

  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;
  IsPrintPDFEnabled;
  IsEmailEnabled;
  IsExcelEnabled;
  IsNotesEnabled;
  IsApproveEnabled;
  IsNotesAddEnabled;
  IsNotesEditEnabled;
  IsNotesDeleteEnabled;
  IsAttachmentEnabled;
  IsAttachmentAddEnabled;
  IsAttachmentEditEnabled;
  IsAttachmentDeleteEnabled;
  keyword = 'PartNo';
  filteredData: any[];
  data = [];
  settingsView
  isLoading: boolean = false;


  faxBillingAddress;
  PhoneBillingAddress;
  number
  NotesList
  ReopenInvoice
  ExcludedPartItem: any = []
  showExcludedPartItem = false;
  BlanketPOExcludeAmount;
  BlanketPONetAmount
  PartItem: any = []

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
  isCurrencyMode: boolean = false
  CustomerList: any = []
  CurrencySymbolNormal
  CurrencySymbol1
  Location
  LocationName
  showReset: boolean = false
  disbleLineItem: boolean = false
  IsCancelInvoiceEnabled: boolean = false
  constructor(private modalService: NgbModal, public navCtrl: NgxNavigationWithDataComponent, private cd_ref: ChangeDetectorRef, private commonService: CommonService,
    private httpClient: HttpClient, private datePipe: DatePipe, private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, public router: Router, private route: ActivatedRoute
  ) { }
  currentRouter = decodeURIComponent(this.router.url);

  ngOnInit() {
    document.title = 'Invoice Edit'
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol")
    this.IsDisplayBaseCurrencyValue = localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.VAT_field_Name = TOTAL_VAT_field_Name; // VAT_field_Name
    this.Shipping_field_Name = Shipping_field_Name
    this.InvoiceInfo = "";
    this.ShippingHistory = ""
    this.ContactAddress = "";
    this.BillingAddress = "";
    this.RemitToAddress = "";
    this.InvoiceItem = [];
    this.CustomerRef = [];
    this.getAdminSettingsView();
    this.Shipping = "0";
    this.Discount = "0";
    this.AHFees = "0";
    this.BlanketPOExcludeAmount = "0"
    this.BlanketPONetAmount = "0"

    if (history.state.InvoiceId == undefined) {
      this.route.queryParams.subscribe(
        params => {
          this.InvoiceId = params['InvoiceId'];
        }
      )
    }
    else if (history.state.InvoiceId != undefined) {
      this.InvoiceId = history.state.InvoiceId
    }
    // this.InvoiceId = this.navCtrl.get('InvoiceId')
    // Redirect to the List page if the View Id is not available
    if (this.InvoiceId == '' || this.InvoiceId == 'undefined' || this.InvoiceId == null) {
      this.router.navigate(['/admin/Invoice-List']);
      return false;
    }
    this.getTermList();
    this.getViewContent();
    this.warrantyList = warranty_list;
    this.Customer_Invoice_Status_edit = Customer_Invoice_Status_expectApprove;

    this.IsViewEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_DELETE_ACCESS);
    this.IsViewCostEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_VIEW_COST_ACCESS);
    this.IsApproveEnabled = this.commonService.permissionCheck("ManageInvoice", CONST_APPROVE_ACCESS);
    this.IsPrintPDFEnabled = this.commonService.permissionCheck("INVPrintAndPDFExport", CONST_VIEW_ACCESS);
    this.IsEmailEnabled = this.commonService.permissionCheck("INVEmail", CONST_VIEW_ACCESS);
    this.IsExcelEnabled = this.commonService.permissionCheck("INVDownloadExcel", CONST_VIEW_ACCESS);
    this.IsNotesEnabled = this.commonService.permissionCheck("INVNotes", CONST_VIEW_ACCESS);
    this.IsNotesAddEnabled = this.commonService.permissionCheck("INVNotes", CONST_CREATE_ACCESS);
    this.IsNotesEditEnabled = this.commonService.permissionCheck("INVNotes", CONST_MODIFY_ACCESS);
    this.IsNotesDeleteEnabled = this.commonService.permissionCheck("INVNotes", CONST_DELETE_ACCESS);
    this.ReopenInvoice = this.commonService.permissionCheck("ReopenInvoice", CONST_VIEW_ACCESS);

    this.IsAttachmentEnabled = this.commonService.permissionCheck("INVAttachment", CONST_VIEW_ACCESS);
    this.IsAttachmentAddEnabled = this.commonService.permissionCheck("INVAttachment", CONST_CREATE_ACCESS);
    this.IsAttachmentEditEnabled = this.commonService.permissionCheck("INVAttachment", CONST_MODIFY_ACCESS);
    this.IsAttachmentDeleteEnabled = this.commonService.permissionCheck("INVAttachment", CONST_DELETE_ACCESS);
    this.Location = localStorage.getItem("Location");
    this.LocationName = localStorage.getItem("LocationName");
    this.IsCancelInvoiceEnabled = this.commonService.permissionCheck("CancelInvoice", CONST_VIEW_ACCESS);


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

  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData.map(function (value) {
        return { title: value.CompanyName, "CustomerId": value.CustomerId }
      });
      this.CustomerList = response.responseData
    });

  }


  getCustomerProperties(CustomerId) {
    if (CustomerId == null || CustomerId == "" || CustomerId == 0) {
      this.showlineItem = false
      return false;
    }
    let obj = this
    //CustomerInfo;
    var info = obj.CustomerList.filter(function (value) {
      if (value.CustomerId == CustomerId) {
        return value
      }
    }, obj);
    this.Symbol = info[0].CurrencySymbol
    this.CustomerLocation = info[0].CustomerLocation
    this.CustomerVatTax = info[0].VatTaxPercentage
    this.CustomerCurrencyCode = info[0].CustomerCurrencyCode
    this.showlineItem = true
    var postData = { CustomerId: CustomerId };


    var postData1 = {
      "IdentityId": CustomerId,
      "IdentityType": 1,
      "Type": CONST_ShipAddressType

    }
    //CustomerAddressLoad
    this.commonService.postHttpService(postData1, 'getAddressList').subscribe(response => {
      this.ShippingAddressList = response.responseData;
      this.ShipAddress = response.responseData.map(function (value) {
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

    })

    var postData2 = {
      "IdentityId": CustomerId,
      "IdentityType": 1,
      "Type": CONST_BillAddressType

    }
    //CustomerAddressLoad
    this.commonService.postHttpService(postData2, 'getAddressList').subscribe(response => {
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

    // // Customer Parts List
    // this.partNewList = [];
    // this.partList = [];
    // this.commonService.postHttpService(postData, 'getPartListDropdown').subscribe(response => {
    //   this.partNewList.push({ "PartId": 0, "PartNo": '+ Add New' });
    //   for (var i in response.responseData) {
    //     this.partNewList.push({ "PartId": response.responseData[i].PartId, "PartNo": response.responseData[i].PartNo });
    //   }
    //   this.partList = this.partNewList; console.log('getPartListDropdown', this.partList)
    // });

  }



  getViewContent() {
    var postData = {
      InvoiceId: this.InvoiceId,
    }
    this.commonService.postHttpService(postData, "getInvoiceView").subscribe(response => {
      if (response.status == true) {
        this.result = response.responseData;
        this.InvoiceInfo = this.result.InvoiceInfo[0] || "";
        if (this.InvoiceInfo.MROId != 0) {
          this.disbleLineItem = true
        } else {
          this.disbleLineItem = false
        }
        this.BillingAddress = this.result.BillingAddressInfo[0] || "";
        this.RemitToAddress = this.result.RemitToAddress || "";
        this.ContactAddress = this.result.ContactAddressInfo[0] || "";
        this.GrandTotalUSD = this.InvoiceInfo.BaseGrandTotal.toFixed(2);
        this.ExchangeRate = this.InvoiceInfo.ExchangeRate;
        this.Symbol = this.InvoiceInfo.CurrencySymbol;
        this.CustomerLocation = this.InvoiceInfo.CustomerLocation;
        this.CustomerVatTax = this.InvoiceInfo.VatTaxPercentage;
        this.CustomerCurrencyCode = this.InvoiceInfo.CustomerCurrencyCode;
        if ("LastShippingHistory" in this.result) {
          this.ShippingHistory = this.result.LastShippingHistory[0] || "";
        }
        this.CONST_AH_Group_ID = CONST_AH_Group_ID

        this.result.InvoiceItem.map(a => {
          a.checked = false;
          a.PartDescription = a.Description
          a.BasePrice = a.BasePrice.toFixed(2);
          a.TaxWithQuantity = (a.Quantity * a.Tax).toFixed(2);
          if (a.IsExcludeFromBlanketPO == 1) {
            this.showExcludedPartItem = true
            this.ExcludedPartItem.push(a)
          } else {
            this.PartItem.push(a)
          }


          if (a.Rate == a.SORate && a.ShippingCharge == ((a.SOShippingCharge / a.SOQuantity) * a.Quantity)) {
            this.showReset = false
          } else {
            this.showReset = true
          }
          return a;
        });
        if (this.PartItem.length > 0) {
          this.showlineItem = true

          for (var i = 0; i < this.PartItem.length; i++) {


            this.PartItem.every(function (item: any) {
              return item.Part = item.PartNo


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

        this.InvoiceNotes = this.result.NotesList;
        this.AttachmentList = this.result.AttachmentList;
        this.RRId = this.InvoiceInfo.RRId
        this.RRId = this.InvoiceInfo.RRId;
        this.model.SONo = this.InvoiceInfo.SONo;
        this.model.ReferenceNo = this.InvoiceInfo.ReferenceNo;
        // this.model.CustomerPONo = this.InvoiceInfo.CustomerPONo

        if (this.RRId != 0) {
          this.InvoiceCustomerRef = this.result.RRCustomerReference;
        }
        else {
          this.InvoiceCustomerRef = this.result.CustomerRef
        }
        this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
          this.customerList = response.responseData.map(function (value) {
            return { title: value.CompanyName, "CustomerId": value.CustomerId }
          });
          this.CustomerList = response.responseData
          this.model.CustomerId = this.InvoiceInfo.CustomerId;
          this.getCustomerProperties(this.model.CustomerId)

        });

        this.model.TermsId = this.InvoiceInfo.TermsId;
        this.model.Notes = this.InvoiceInfo.LaborDescription
        this.model.InvoiceType = this.InvoiceInfo.InvoiceType;
        this.model.InvoiceStatus = this.InvoiceInfo.Status
        const Requestedyear = Number(this.datePipe.transform(this.InvoiceInfo.InvoiceDate, 'yyyy'));
        const RequestedMonth = Number(this.datePipe.transform(this.InvoiceInfo.InvoiceDate, 'MM'));
        const RequestedDay = Number(this.datePipe.transform(this.InvoiceInfo.InvoiceDate, 'dd'));
        this.model.InvoiceDate = {
          year: Requestedyear,
          month: RequestedMonth,
          day: RequestedDay
        }
        const years = Number(this.datePipe.transform(this.InvoiceInfo.DueDate, 'yyyy'));
        const Month = Number(this.datePipe.transform(this.InvoiceInfo.DueDate, 'MM'));
        const Day = Number(this.datePipe.transform(this.InvoiceInfo.DueDate, 'dd'));
        this.model.DueDate = {
          year: years,
          month: Month,
          day: Day
        }

        this.TotalTax = this.InvoiceInfo.TotalTax.toFixed(2);
        this.Discount = this.InvoiceInfo.Discount;
        this.AHFees = this.InvoiceInfo.AHFees;
        this.GrandTotal = this.InvoiceInfo.GrandTotal.toFixed(2);
        this.Shipping = this.InvoiceInfo.Shipping;
        this.SubTotal = this.InvoiceInfo.SubTotal.toFixed(2);
        this.TaxPercent = this.InvoiceInfo.TaxPercent;
        this.BlanketPOExcludeAmount = this.InvoiceInfo.BlanketPOExcludeAmount.toFixed(2);
        this.BlanketPONetAmount = this.InvoiceInfo.BlanketPONetAmount.toFixed(2);
        //For Email content
        if (this.InvoiceInfo.RRId != 0) {
          this.number = this.InvoiceInfo.RRNo
        }
        else {
          this.number = this.InvoiceInfo.InvoiceNo
        }
        this.faxBillingAddress = this.BillingAddress.Fax
        this.PhoneBillingAddress = this.BillingAddress.Phone;
        this.NotesList = this.result.NotesList;
        this.VendorPOCost = this.result.VendorPOCost.VendorPOCost ? this.result.VendorPOCost.VendorPOCost : ''
        this.VendorPOCost1 = this.result.VendorPOCost.VendorPOCost ? this.result.VendorPOCost.VendorPOCost1 : ''
        this.CurrencySymbol1 = this.result.VendorPOCost.CurrencySymbol ? this.result.VendorPOCost.CurrencySymbol : ''
        this.CurrencySymbolNormal = this.result.VendorPOCost.CurrencySymbol1 ? this.result.VendorPOCost.CurrencySymbol1 : ''
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  //addReference
  addReference() {
    if (this.RRId == 0) {
      var CustomerId = this.model.CustomerId;
      var IdentityType = CONST_IDENTITY_TYPE_INVOICE;
      var IdentityId = this.InvoiceId;
      var RRId = this.RRId
    }
    else {
      var IdentityId = this.RRId;
      var IdentityType = CONST_IDENTITY_TYPE_RR;
      var CustomerId = this.model.CustomerId;
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
      this.InvoiceCustomerRef.push(res.data);
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


        this.InvoiceCustomerRef.splice(i, 1);
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
    var IdentityId = this.model.CustomerId;
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
      //this.customerReferenceList.push(res.data);
    });
  }
  generalDelete() {
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
          text: 'General Journal has been deleted.',
          type: 'success'
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'General Journal  is safe :)',
          type: 'error'
        });
      }
    });

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
  reLoad() {
    this.router.navigate([this.currentRouter.split('?')[0]], { queryParams: { InvoiceId: this.InvoiceId } })

    // this.router.navigate([this.currentRouter])
  }


  selectExcludedPartItemEvent(item, j) {
    var postData = { PartId: item.PartId, "CustomerId": this.model.CustomerId };
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
            this.ExcludedPartItem[j].PartDescription = response.responseData[0].Description,
            this.ExcludedPartItem[j].Quantity = response.responseData[0].Quantity,
            this.ExcludedPartItem[j].Rate = response.responseData[0].Price
          this.ExcludedPartItem[j].ItemLocalCurrencyCode = this.CustomerCurrencyCode
          this.ExcludedPartItem[j].ItemExchangeRate = this.ExchangeRate
          this.ExcludedPartItem[j].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
          this.ExcludedPartItem[j].ItemLocalCurrencySymbol = this.InvoiceInfo.CustomerCurrencySymbol

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
          this.ExcludedPartItem[j].PartDescription = response.responseData[0].Description,
          this.ExcludedPartItem[j].Quantity = response.responseData[0].Quantity,
          this.ExcludedPartItem[j].Rate = response.responseData[0].Price
        this.ExcludedPartItem[j].ItemLocalCurrencyCode = this.CustomerCurrencyCode
        this.ExcludedPartItem[j].ItemExchangeRate = this.ExchangeRate
        this.ExcludedPartItem[j].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
        this.ExcludedPartItem[j].ItemLocalCurrencySymbol = this.InvoiceInfo.CustomerCurrencySymbol
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
    var postData = { PartId: item.PartId, "CustomerId": this.model.CustomerId };
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
            this.PartItem[i].PartDescription = response.responseData[0].Description,
            this.PartItem[i].Quantity = response.responseData[0].Quantity,
            this.PartItem[i].Rate = response.responseData[0].Price
          this.PartItem[i].ItemLocalCurrencyCode = this.CustomerCurrencyCode
          this.PartItem[i].ItemExchangeRate = this.ExchangeRate
          this.PartItem[i].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
          this.PartItem[i].ItemLocalCurrencySymbol = this.InvoiceInfo.CustomerCurrencySymbol

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
          this.PartItem[i].PartDescription = response.responseData[0].Description,
          this.PartItem[i].Quantity = response.responseData[0].Quantity,
          this.PartItem[i].Rate = response.responseData[0].Price
        this.PartItem[i].ItemLocalCurrencyCode = this.CustomerCurrencyCode
        this.PartItem[i].ItemExchangeRate = this.ExchangeRate
        this.PartItem[i].ItemBaseCurrencyCode = localStorage.getItem('BaseCurrencyCode')
        this.PartItem[i].ItemLocalCurrencySymbol = this.InvoiceInfo.CustomerCurrencySymbol
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
  onApprovedInvoice() {
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
          "InvoiceId": this.InvoiceId
        }
        this.commonService.postHttpService(postData, 'ApprovedInvoice').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Approved Invoice!',
              text: 'Invoice Approved has been Updated.',
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
          text: 'Invoice Approved has not Updated.',
          type: 'error'
        });
      }
    });

  }

  onReOpenInvoice() {
    if (this.InvoiceInfo.Consolidated != 1) {

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
            "InvoiceId": this.InvoiceId
          }
          this.commonService.postHttpService(postData, 'ReOpenInvoice').subscribe(response => {
            if (response.status == true) {
              Swal.fire({
                title: 'ReOpen Invoice!',
                text: 'Invoice ReOpen has been Updated.',
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
            text: 'Invoice ReOpen has not Updated.',
            type: 'error'
          });
        }
      });
    } else {
      Swal.fire({
        type: 'info',
        text: 'The Invoice is added into Consolidated. Please remove from consolidate to Reopen the Invoice',
        title: 'Message',
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }
  }
  EditItem(ItemEditContent) {
    this.modalService.open(ItemEditContent, { centered: true });

  }

  arrayOne(n: number): any[] {
    return Array(n);
  }





  backToRRView() {
    this.router.navigate(['/admin/repair-request/edit'], { state: { RRId: this.InvoiceInfo.RRId } });
  }




  AddExcludedPartItem() {
    if ((this.InvoiceInfo.CustomerBlanketPOId == 0 && this.InvoiceInfo.CustomerPONo != "")) {
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
        ItemLocalCurrencySymbol: this.InvoiceInfo.CustomerCurrencySymbol,
        BaseRate: '',
        BaseTax: ''
      });
    }
  }

  removeExcludedPartItem(i, InvoiceItemId) {

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
        if (InvoiceItemId != undefined) {
          if (this.InvoiceInfo.CreatedByLocation == this.Location) {

            var postData = {
              "InvoiceItemId": InvoiceItemId,
              "TaxPercent": this.TaxPercent,
              "InvoiceId": this.InvoiceId
            }

            this.commonService.postHttpService(postData, 'DeleteInvoiceItem').subscribe(response => {
              if (response.status == true) {
                this.ExcludedPartItem.splice(i, 1)

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
              html: '<b style=" font-size: 14px !important;">' + (`Invoice Added from  : <span class="badge badge-primary btn-xs">${this.InvoiceInfo.CreatedByLocationName}</span> country. Now the AH Country is <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
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
    // this.TotalTax = this.SubTotal * this.TaxPercent / 100
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
    let ShippingCharge = this.PartItem[index].ShippingCharge || 0
    let VatTax = this.PartItem[index].ItemTaxPercent / 100;
    let VatTaxPrice = Rate * VatTax
    // Calculate the price
    price = (parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice)) + parseFloat(ShippingCharge);
    let BaseShippingCharge = ShippingCharge * this.ExchangeRate
    this.PartItem[index].BaseShippingCharge = BaseShippingCharge.toFixed(2)
    Tax = (Rate * VatTax);
    this.PartItem[index].Price = price.toFixed(2);
    this.PartItem[index].Tax = Tax.toFixed(2);
    this.PartItem[index].TaxWithQuantity = (Quantity * Tax).toFixed(2);
    var TaxLocal = (Rate * VatTax)
    let priceUSD = price * this.ExchangeRate;
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
    this.BlanketPOExcludeAmount = subTotal1;
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

    this.GrandTotalUSD = (this.GrandTotal * this.ExchangeRate).toFixed(2);

  }
  ExcludedPartcalculatePrice(index) {
    var price = 0; var subTotal = 0; var Tax = 0;
    let Quantity = this.ExcludedPartItem[index].Quantity || 0;
    let Rate = this.ExcludedPartItem[index].Rate || 0;
    let VatTax = this.ExcludedPartItem[index].ItemTaxPercent / 100;
    let VatTaxPrice = Rate * VatTax
    // Calculate the price
    price = parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice);
    Tax = (Rate * VatTax);
    this.ExcludedPartItem[index].Price = price.toFixed(2);
    this.ExcludedPartItem[index].Tax = Tax.toFixed(2);
    this.ExcludedPartItem[index].TaxWithQuantity = (Quantity * Tax).toFixed(2);
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
      "IsExcludeFromBlanketPO": 0,
      PON: '',
      RecommendedPrice: '',
      LPPList: [],
      Tax: '',
      ItemTaxPercent: '',
      BasePrice: '',
      ItemLocalCurrencyCode: '',
      ItemExchangeRate: '',
      ItemBaseCurrencyCode: '',
      ItemLocalCurrencySymbol: this.InvoiceInfo.CustomerCurrencySymbol,
      BaseRate: '',
      BaseTax: '',
      ShippingCharge: 0,
      BaseShippingCharge: 0
    });
  }

  removePartItem(i, InvoiceItemId) {
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
        if (InvoiceItemId != undefined) {
          if (this.InvoiceInfo.CreatedByLocation == this.Location) {

            var postData = {
              "InvoiceItemId": InvoiceItemId,
              "TaxPercent": this.TaxPercent,
              "InvoiceId": this.InvoiceId
            }

            this.commonService.postHttpService(postData, 'DeleteInvoiceItem').subscribe(response => {
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
              html: '<b style=" font-size: 14px !important;">' + (`Invoice Added from  : <span class="badge badge-primary btn-xs">${this.InvoiceInfo.CreatedByLocationName}</span> country. Now the AH Country is <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
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

  onMovetoExcludedParts(i, InvoiceItemId, item) {
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
        if (InvoiceItemId != undefined) {
          if (this.InvoiceInfo.CreatedByLocation == this.Location) {

            //           var postData = {
            //             "InvoiceItemId": InvoiceItemId,
            //             "TaxPercent":this.TaxPercent,
            //             "InvoiceId":this.InvoiceId
            //           }
            // console.log(InvoiceItemId);console.log(item);
            var postData = {
              "SOItemId": item.SOItemId,
              "TaxPercent": this.TaxPercent,
              "SOId": item.SOId,
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
              html: '<b style=" font-size: 14px !important;">' + (`Invoice Added from  : <span class="badge badge-primary btn-xs">${this.InvoiceInfo.CreatedByLocationName}</span> country. Now the AH Country is <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
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

  onMovetoParts(j, InvoiceItemId, item) {
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
        if (InvoiceItemId != undefined) {
          if (this.InvoiceInfo.CreatedByLocation == this.Location) {

            // var postData = {
            //   "InvoiceItemId": InvoiceItemId,
            //   "TaxPercent":this.TaxPercent,
            //   "InvoiceId":this.InvoiceId
            // }
            // console.log(InvoiceItemId); console.log(item);
            var postData = {
              "SOItemId": item.SOItemId,
              "TaxPercent": this.TaxPercent,
              "SOId": item.SOId,
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
              html: '<b style=" font-size: 14px !important;">' + (`Invoice Added from  : <span class="badge badge-primary btn-xs">${this.InvoiceInfo.CreatedByLocationName}</span> country. Now the AH Country is <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
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

  onSubmit(f: NgForm) {
    this.submitted = true;

    //DateRequested
    const reqYears = this.model.InvoiceDate.year
    const reqDates = this.model.InvoiceDate.day;
    const reqmonths = this.model.InvoiceDate.month;
    let requestDates = new Date(reqYears, reqmonths - 1, reqDates);
    let DateRequested = moment(requestDates).format('YYYY-MM-DD');
    //DueDate
    const dueYears = this.model.DueDate.year;
    const dueDates = this.model.DueDate.day;
    const duemonths = this.model.DueDate.month;
    let dueDate = new Date(dueYears, duemonths - 1, dueDates);
    let DueDate = moment(dueDate).format('YYYY-MM-DD');
    var InvoiceItem = []
    InvoiceItem = this.PartItem.concat(this.ExcludedPartItem);
    if (f.valid) {
      if (this.InvoiceInfo.CreatedByLocation == this.Location) {

        let obj = this
        obj.PartItem.filter(function (value) {
          if (value.ItemLocalCurrencySymbol != obj.InvoiceInfo.CustomerCurrencySymbol) {
            this.isCurrencyMode = true
          }
        }, obj);
        obj.ExcludedPartItem.filter(function (value) {
          if (value.ItemLocalCurrencySymbol != obj.InvoiceInfo.CustomerCurrencySymbol) {
            this.isCurrencyMode = true
          }
        }, obj);
        if (!this.isCurrencyMode) {
          if (this.RRId != 0 && this.GrandTotal < this.InvoiceInfo.POGrandTotal) {
            Swal.fire({
              title: 'Are you sure to update invoice?',
              text: "Invoice Amount" + " ( $ " + this.InvoiceInfo.POGrandTotal + ' )' + " is less than " + "Vendor PO Amount" + " ( $ " + this.GrandTotal + ' )',
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, Update it!',
              cancelButtonText: 'No, cancel!',
              confirmButtonClass: 'btn btn-success mt-2',
              cancelButtonClass: 'btn btn-danger ml-2 mt-2',
              buttonsStyling: false
            }).then((result) => {
              if (result.value) {
                this.btnDisabled = true;
                var postData = {
                  "LocalCurrencyCode": this.CustomerCurrencyCode,
                  "ExchangeRate": this.ExchangeRate,
                  "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode'),
                  "BaseGrandTotal": this.GrandTotalUSD,

                  "InvoiceId": this.InvoiceId,
                  "InvoiceNo": this.InvoiceInfo.InvoiceNo,
                  "SONo": this.model.SONo,
                  "RRId": this.InvoiceInfo.RRId,
                  "MROId": this.InvoiceInfo.MROId,
                  "CustomerId": this.model.CustomerId,
                  "InvoiceType": this.model.InvoiceType,
                  "TermsId": this.model.TermsId,
                  "InvoiceDate": DateRequested,
                  "DueDate": DueDate,
                  "ReferenceNo": this.model.ReferenceNo,
                  // "CustomerPONo": this.model.CustomerPONo,
                  "ShipAddressId": this.model.sh_ShipCodeId,
                  "BillAddressId": this.model.bi_BillCodeId,
                  "LaborDescription": this.model.Notes,
                  "SubTotal": this.SubTotal,
                  "TotalTax": this.TotalTax,
                  "Discount": this.Discount,
                  "AHFees": this.AHFees,
                  "Shipping": this.Shipping,
                  "TaxPercent": this.TaxPercent,
                  "GrandTotal": this.GrandTotal,
                  "Status": this.model.InvoiceStatus,
                  "InvoiceItem": InvoiceItem,
                  "BlanketPOExcludeAmount": this.BlanketPOExcludeAmount,
                  "BlanketPONetAmount": this.BlanketPONetAmount,
                  "CustomerBlanketPOId": this.InvoiceInfo.CustomerBlanketPOId
                }
                this.commonService.putHttpService(postData, "InvoiceUpdate").subscribe(response => {
                  if (response.status == true) {
                    this.btnDisabled = false;
                    this.reLoad()
                    Swal.fire({
                      title: 'Success!',
                      text: 'Invoice has been Updated!',
                      type: 'success',
                      confirmButtonClass: 'btn btn-confirm mt-2'
                    });
                    // this.router.navigate(['./admin/invoice/list'])

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

              } else if (
                // Read more about handling dismissals
                result.dismiss === Swal.DismissReason.cancel
              ) {
                Swal.fire({
                  title: 'Cancelled',
                  text: 'Invoice Update is safe:)',
                  type: 'error'
                });
              }
            });
          }

          else {
            this.btnDisabled = true;
            var postData = {
              "LocalCurrencyCode": this.CustomerCurrencyCode,
              "ExchangeRate": this.ExchangeRate,
              "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode'),
              "BaseGrandTotal": this.GrandTotalUSD,

              "InvoiceId": this.InvoiceId,
              "InvoiceNo": this.InvoiceInfo.InvoiceNo,
              "SONo": this.model.SONo,
              "RRId": this.InvoiceInfo.RRId,
              "MROId": this.InvoiceInfo.MROId,
              "CustomerId": this.model.CustomerId,
              "InvoiceType": this.model.InvoiceType,
              "TermsId": this.model.TermsId,
              "InvoiceDate": DateRequested,
              "DueDate": DueDate,
              "ReferenceNo": this.model.ReferenceNo,
              // "CustomerPONo": this.model.CustomerPONo,
              "ShipAddressId": this.model.sh_ShipCodeId,
              "BillAddressId": this.model.bi_BillCodeId,
              "LaborDescription": this.model.Notes,
              "SubTotal": this.SubTotal,
              "TotalTax": this.TotalTax,
              "Discount": this.Discount,
              "AHFees": this.AHFees,
              "Shipping": this.Shipping,
              "TaxPercent": this.TaxPercent,
              "GrandTotal": this.GrandTotal,
              "Status": this.model.InvoiceStatus,
              "InvoiceItem": InvoiceItem,
              "BlanketPOExcludeAmount": this.BlanketPOExcludeAmount,
              "BlanketPONetAmount": this.BlanketPONetAmount,
              "CustomerBlanketPOId": this.InvoiceInfo.CustomerBlanketPOId

            }
            this.commonService.putHttpService(postData, "InvoiceUpdate").subscribe(response => {
              if (response.status == true) {
                this.btnDisabled = false;
                this.reLoad()
                Swal.fire({
                  title: 'Success!',
                  text: 'Invoice has been Updated!',
                  type: 'success',
                  confirmButtonClass: 'btn btn-confirm mt-2'
                });
                // this.router.navigate(['./admin/invoice/list'])

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
          }
        } else {
          Swal.fire({
            type: 'info',
            title: 'Customer Currency Mismatch',
            text: `Customer Currency Code is Changed. Please contact admin to update a invoice`,
            confirmButtonClass: 'btn btn-confirm mt-2',
          });
        }
      } else {
        Swal.fire({
          type: 'info',
          title: 'AH Country Mismatch',
          html: '<b style=" font-size: 14px !important;">' + (`Invoice Added from  : <span class="badge badge-primary btn-xs">${this.InvoiceInfo.CreatedByLocationName}</span> country. Now the AH Country is <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`) + '</b>',
          confirmButtonClass: 'btn btn-confirm mt-2',
        });
      }
    } else {
      this.btnDisabled = false;
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });

    }

  }

  //Email
  InvoiceEmail() {
    this.getPdfBase64((pdfBase64) => {
      let fileName = `Invoice ${this.InvoiceInfo.InvoiceNo}.pdf`;
      var RRId = this.RRId
      var IdentityId = this.InvoiceId
      var IdentityType = CONST_IDENTITY_TYPE_INVOICE
      var followupName = "Invoice"
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
      });
    });
  }
  getPdfBase64(cb) {
    var InvoiceItem = []
    InvoiceItem = this.PartItem.concat(this.ExcludedPartItem);
    this.commonService.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        InvoiceInfo: this.InvoiceInfo,
        number: this.number,
        BillingAddress: this.BillingAddress,
        RemitToAddress: this.RemitToAddress,
        PhoneBillingAddress: this.PhoneBillingAddress,
        faxBillingAddress: this.faxBillingAddress,
        ShippingHistory: this.ShippingHistory,
        CONST_AH_Group_ID: this.CONST_AH_Group_ID,
        CustomerRef: this.CustomerRef.length > 0 && !("NoRecord" in this.CustomerRef[0]) ? this.CustomerRef : null,
        InvoiceItem: InvoiceItem,
        IsNotesEnabled: this.IsNotesEnabled,
        settingsView: this.settingsView,
        NotesList: this.NotesList,
        RRId: this.RRId,
        Logo: base64
      }

      this.commonService.postHttpService({ pdfObj }, "getINVPdfBase64").subscribe(response => {
        if (response.status == true) {
          cb(response.responseData.pdfBase64);
        }
      });
    })
  }

  //Notes Section
  addNotes() {
    var IdentityId = this.InvoiceId;
    var IdentityType = CONST_IDENTITY_TYPE_INVOICE
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
      this.InvoiceNotes.push(res.data);
    });
  }

  editNotes(note, i) {
    var IdentityId = this.InvoiceId;
    var IdentityType = CONST_IDENTITY_TYPE_INVOICE
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
      this.InvoiceNotes[i] = res.data;
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
            this.InvoiceNotes.splice(i, 1)
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
    var IdentityType = CONST_IDENTITY_TYPE_INVOICE;
    var IdentityId = this.InvoiceId
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
    var IdentityType = CONST_IDENTITY_TYPE_INVOICE;
    var IdentityId = this.InvoiceId
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
    this.router.navigate(['/admin/invoice/list'], { state: { InvoiceId: this.InvoiceInfo.InvoiceId } })
  }


  onUpdateCustomerPONo() {
    if (this.InvoiceInfo.CustomerBlanketPOId == 0) {
      var ApproveType = "0"
    } else {
      var ApproveType = "1"
    }
    var MROId = this.InvoiceInfo.MROId
    var CustomerBlanketPOId = this.InvoiceInfo.CustomerBlanketPOId;
    var CustomerPONo = this.InvoiceInfo.CustomerPONo;
    var RRId = this.RRId;
    var CustomerId = this.InvoiceInfo.CustomerId;
    var GrandTotal = (this.InvoiceInfo.GrandTotal).toFixed(2)
    var InvoiceId = this.InvoiceId;
    var BlanketPOExcludeAmount = this.InvoiceInfo.BlanketPOExcludeAmount
    var BlanketPONetAmount = this.InvoiceInfo.BlanketPONetAmount
    var ExcludedPartLength = this.ExcludedPartItem.length
    var CurrencySymbol = this.InvoiceInfo.CurrencySymbol
    var ExchangeRate = this.InvoiceInfo.ExchangeRate
    var LocalCurrencyCode = this.InvoiceInfo.LocalCurrencyCode
    var Consolidated = this.InvoiceInfo.Consolidated
    this.modalRef = this.CommonmodalService.show(BlanketPoInvoiceEditComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { MROId, RRId, InvoiceId, CustomerId, GrandTotal, ApproveType, CustomerBlanketPOId, CustomerPONo, BlanketPOExcludeAmount, BlanketPONetAmount, ExcludedPartLength, CurrencySymbol, ExchangeRate, LocalCurrencyCode, Consolidated },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.reLoad();
    });
  }

  onResetInvoiceItem() {
    Swal.fire({
      title: 'Are you sure to populate the SO price to this invoice?',
      text: 'After auto populate review and save it.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reset it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.PartItem = []
        this.getViewContentReset()

      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Invoice Reset has not Updated.',
          type: 'error'
        });
      }
    });
  }


  getViewContentReset() {
    var postData = {
      InvoiceId: this.InvoiceId,
    }
    this.commonService.postHttpService(postData, "getInvoiceView").subscribe(response => {
      if (response.status == true) {
        this.result = response.responseData;
        this.InvoiceInfo = this.result.InvoiceInfo[0] || "";
        if (this.InvoiceInfo.MROId != 0) {
          this.disbleLineItem = true
        } else {
          this.disbleLineItem = false
        }
        this.BillingAddress = this.result.BillingAddressInfo[0] || "";
        this.RemitToAddress = this.result.RemitToAddress || "";
        this.ContactAddress = this.result.ContactAddressInfo[0] || "";
        this.GrandTotalUSD = this.InvoiceInfo.BaseGrandTotal;
        this.ExchangeRate = this.InvoiceInfo.ExchangeRate
        this.Symbol = this.InvoiceInfo.CurrencySymbol
        this.CustomerLocation = this.InvoiceInfo.CustomerLocation
        this.CustomerVatTax = this.InvoiceInfo.VatTaxPercentage
        this.CustomerCurrencyCode = this.InvoiceInfo.CustomerCurrencyCode
        if ("LastShippingHistory" in this.result) {
          this.ShippingHistory = this.result.LastShippingHistory[0] || "";
        }
        this.CONST_AH_Group_ID = CONST_AH_Group_ID

        this.result.InvoiceItem.map(a => {
          a.checked = false;
          if (a.IsExcludeFromBlanketPO == 1) {
            this.showExcludedPartItem = true
            this.ExcludedPartItem.push(a)
          } else {
            this.PartItem.push(a)
          }
          a.Rate = a.SORate
          a.ShippingCharge = ((a.SOShippingCharge / a.SOQuantity) * a.Quantity)
          if (a.Rate == a.SORate && a.ShippingCharge == ((a.SOShippingCharge / a.SOQuantity) * a.Quantity)) {
            this.showReset = false
          } else {
            this.showReset = true
          }
          return a;
        });
        if (this.PartItem.length > 0) {
          this.showlineItem = true

          for (var i = 0; i < this.PartItem.length; i++) {
            this.PartItem.every(function (item: any) {
              return item.Part = item.PartNo
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

        this.InvoiceNotes = this.result.NotesList;
        this.AttachmentList = this.result.AttachmentList;
        this.RRId = this.InvoiceInfo.RRId
        this.RRId = this.InvoiceInfo.RRId;
        this.model.SONo = this.InvoiceInfo.SONo;
        this.model.ReferenceNo = this.InvoiceInfo.ReferenceNo;
        // this.model.CustomerPONo = this.InvoiceInfo.CustomerPONo

        if (this.RRId != 0) {
          this.InvoiceCustomerRef = this.result.RRCustomerReference;
        }
        else {
          this.InvoiceCustomerRef = this.result.CustomerRef
        }
        this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
          this.customerList = response.responseData.map(function (value) {
            return { title: value.CompanyName, "CustomerId": value.CustomerId }
          });
          this.CustomerList = response.responseData
          this.model.CustomerId = this.InvoiceInfo.CustomerId;
          this.getCustomerProperties(this.model.CustomerId)

        });

        this.model.TermsId = this.InvoiceInfo.TermsId;
        this.model.Notes = this.InvoiceInfo.LaborDescription
        this.model.InvoiceType = this.InvoiceInfo.InvoiceType;
        this.model.InvoiceStatus = this.InvoiceInfo.Status
        const Requestedyear = Number(this.datePipe.transform(this.InvoiceInfo.InvoiceDate, 'yyyy'));
        const RequestedMonth = Number(this.datePipe.transform(this.InvoiceInfo.InvoiceDate, 'MM'));
        const RequestedDay = Number(this.datePipe.transform(this.InvoiceInfo.InvoiceDate, 'dd'));
        this.model.InvoiceDate = {
          year: Requestedyear,
          month: RequestedMonth,
          day: RequestedDay
        }
        const years = Number(this.datePipe.transform(this.InvoiceInfo.DueDate, 'yyyy'));
        const Month = Number(this.datePipe.transform(this.InvoiceInfo.DueDate, 'MM'));
        const Day = Number(this.datePipe.transform(this.InvoiceInfo.DueDate, 'dd'));
        this.model.DueDate = {
          year: years,
          month: Month,
          day: Day
        }

        this.TotalTax = this.InvoiceInfo.TotalTax.toFixed(2);
        this.Discount = this.InvoiceInfo.Discount;
        this.AHFees = this.InvoiceInfo.AHFees;
        this.GrandTotal = this.InvoiceInfo.GrandTotal.toFixed(2);
        this.Shipping = this.InvoiceInfo.Shipping;
        this.SubTotal = this.InvoiceInfo.SubTotal.toFixed(2);
        this.TaxPercent = this.InvoiceInfo.TaxPercent
        this.BlanketPOExcludeAmount = this.InvoiceInfo.BlanketPOExcludeAmount.toFixed(2);
        this.BlanketPONetAmount = this.InvoiceInfo.BlanketPONetAmount.toFixed(2);
        //For Email content
        if (this.InvoiceInfo.RRId != 0) {
          this.number = this.InvoiceInfo.RRNo
        }
        else {
          this.number = this.InvoiceInfo.InvoiceNo
        }
        this.faxBillingAddress = this.BillingAddress.Fax
        this.PhoneBillingAddress = this.BillingAddress.Phone;
        this.NotesList = this.result.NotesList;
        this.VendorPOCost = this.result.VendorPOCost.VendorPOCost ? this.result.VendorPOCost.VendorPOCost : ''
        this.VendorPOCost1 = this.result.VendorPOCost.VendorPOCost ? this.result.VendorPOCost.VendorPOCost1 : ''
        this.CurrencySymbol1 = this.result.VendorPOCost.CurrencySymbol ? this.result.VendorPOCost.CurrencySymbol : ''
        this.CurrencySymbolNormal = this.result.VendorPOCost.CurrencySymbol1 ? this.result.VendorPOCost.CurrencySymbol1 : ''


        for (var i = 0; i < this.PartItem.length; i++) {
          this.calculatePrice(i)
        }
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  onCancelInvoice() {
    if (this.InvoiceInfo.Consolidated != 1) {
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
            "InvoiceId": this.InvoiceId
          }
          this.commonService.postHttpService(postData, 'CancelInvoice').subscribe(response => {
            if (response.status == true) {
              Swal.fire({
                title: 'Cancelled Invoice!',
                text: 'Invoice Cancelled has been Updated.',
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
            text: 'Invoice Cancelled has not Updated.',
            type: 'error'
          });
        }
      });
    } else {
      Swal.fire({
        type: 'info',
        text: 'The Invoice is added into Consolidated. Please remove from consolidate to cancel the Invoice',
        title: 'Message',
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }
  }

}

