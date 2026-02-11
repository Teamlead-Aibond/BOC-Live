/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { terms, warranty_list, CONST_IDENTITY_TYPE_INVOICE, CONST_IDENTITY_TYPE_VENDORINVOICE, Invoice_Status_expectApprove, CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, CONST_APPROVE_ACCESS, CONST_VIEW_COST_ACCESS, CONST_COST_HIDE_VALUE, Vendor_Bill_Status_expectApprove, Const_Alert_pop_message, Const_Alert_pop_title, VAT_field_Name,TOTAL_VAT_field_Name, Shipping_field_Name } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { AddRrPartsComponent } from '../../common-template/add-rr-parts/add-rr-parts.component';
import * as moment from 'moment';
import { AddNotesComponent } from '../../common-template/add-notes/add-notes.component';
import { EditNotesComponent } from '../../common-template/edit-notes/edit-notes.component';
import { RRAddAttachmentComponent } from '../../common-template/rr-add-attachment/rr-add-attachment.component';
import { RrEditAttachmentComponent } from '../../common-template/rr-edit-attachment/rr-edit-attachment.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-vendor-invoice',
  templateUrl: './edit-vendor-invoice.component.html',
  styleUrls: ['./edit-vendor-invoice.component.scss']
})
export class EditVendorInvoiceComponent implements OnInit {
  checkedCategoryList: any;
  isMasterSel: boolean;
  submitted = false;
  btnDisabled: boolean = false;
  BillCode;
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
  AHFees
  VendorInvoiceId;
  RRId;
  SubTotal;
  GrandTotal;
  TotalTax;
  TaxPercent;
  //view;
  result;
  VendorInvoiceInfo;
  VendorAddress;
  VendorInvoiceItem: any = [];
  model: any = [];
  VendorInvoiceNotes: any = [];
  AttachmentList: any = [];
  PhoneVendorAddress;
  faxVendorAddress;
  PartItem: any = [];
  POList: any = [];
  //Dropdown
  TermsList;
  warrantyList;
  Invoice_Status_edit;
  vendorList;
  partList;


  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;
  IsPrintPDFEnabled;
  IsExcelEnabled;
  IsNotesEnabled;
  IsApproveEnabled;
  IsNotesAddEnabled;
  IsNotesEditEnabled;
  IsNotesDeleteEnabled;
  settingsView;
  enableVendorApproved

  VAT_field_Name
  Shipping_field_Name
  IsDisplayBaseCurrencyValue
  Symbol
  VendorLocation
  VendorVatTax
  ExchangeRate
  VendorCurrencyCode
  GrandTotalUSD
  showlineItem:boolean=false
  BaseCurrencySymbol
  dataMessage
  Location
  LocationName
  isCurrencyMode:boolean = false;

  constructor(private modalService: NgbModal, public navCtrl: NgxNavigationWithDataComponent, private cd_ref: ChangeDetectorRef, private commonService: CommonService,
    private httpClient: HttpClient, private datePipe: DatePipe, private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, public router: Router,private route: ActivatedRoute
  ) { }
  currentRouter = decodeURIComponent(this.router.url);

  ngOnInit() {
    document.title='Vendor Bill Edit'
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")
    this.VAT_field_Name = TOTAL_VAT_field_Name; // VAT_field_Name
    this.Shipping_field_Name = Shipping_field_Name
    this.IsDisplayBaseCurrencyValue =localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.getVendorList();
    this.getAdminSettingsView();
    this.Invoice_Status_edit = Vendor_Bill_Status_expectApprove;
    this.VendorInvoiceInfo = "";
    this.PartItem = []
    this.VendorAddress = "";
    this.VendorInvoiceNotes = []
    this.getPartList();
    this.Shipping = "0";
    this.Discount = "0";
    this.AHFees = "0";
    // this.VendorInvoiceId = this.navCtrl.get('VendorInvoiceId')

    if (history.state.VendorInvoiceId == undefined) {
      this.route.queryParams.subscribe(
        params => {
          this.VendorInvoiceId = params['VendorInvoiceId'];
        }
      )

    }
    else if (history.state.VendorInvoiceId != undefined) {
      this.VendorInvoiceId = history.state.VendorInvoiceId
    }
    // Redirect to the List page if the View Id is not available
    if (this.VendorInvoiceId == '' || this.VendorInvoiceId == 'undefined' || this.VendorInvoiceId == null) {
      this.navCtrl.navigate('/admin/VendorBill-List');
      return false;
    }
    this.getViewContent();
    this.getTermList();
    this.warrantyList = warranty_list;



    this.IsViewEnabled = this.commonService.permissionCheck("ManageVendorBills", CONST_VIEW_ACCESS);
    this.IsAddEnabled = this.commonService.permissionCheck("ManageVendorBills", CONST_CREATE_ACCESS);
    this.IsEditEnabled = this.commonService.permissionCheck("ManageVendorBills", CONST_MODIFY_ACCESS);
    this.IsDeleteEnabled = this.commonService.permissionCheck("ManageVendorBills", CONST_DELETE_ACCESS);
    this.IsViewCostEnabled = this.commonService.permissionCheck("ManageVendorBills", CONST_VIEW_COST_ACCESS);
    this.IsApproveEnabled = this.commonService.permissionCheck("ManageVendorBills", CONST_APPROVE_ACCESS);
    this.IsPrintPDFEnabled = this.commonService.permissionCheck("VBPrintAndPDFExport", CONST_VIEW_ACCESS);
    this.IsExcelEnabled = this.commonService.permissionCheck("VBDownloadExcel", CONST_VIEW_ACCESS);
    this.IsNotesEnabled = this.commonService.permissionCheck("VendorBillNotes", CONST_VIEW_ACCESS);
    this.IsNotesAddEnabled = this.commonService.permissionCheck("VendorBillNotes", CONST_CREATE_ACCESS);
    this.IsNotesEditEnabled = this.commonService.permissionCheck("VendorBillNotes", CONST_MODIFY_ACCESS);
    this.IsNotesDeleteEnabled = this.commonService.permissionCheck("VendorBillNotes", CONST_DELETE_ACCESS);
    this.Location = localStorage.getItem("Location");
    this.LocationName = localStorage.getItem("LocationName");

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
  getVendorList() {
    this.commonService.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
    });
  }
  getVendorProperties(VendorId) {

    let obj = this
    var VendorDetails = obj.vendorList.filter(function (value) {
      if (value.VendorId == VendorId) {
        return value
      }
    }, obj);
    this.model.VendorName = VendorDetails[0].VendorName;
    this.model.TermsId = VendorDetails[0].TermsId
    this.Symbol = VendorDetails[0].CurrencySymbol
    this.VendorLocation = VendorDetails[0].VendorLocation
    this.VendorVatTax = VendorDetails[0].VatTaxPercentage
    this.VendorCurrencyCode =VendorDetails[0].VendorCurrencyCode
    this.showlineItem = true

  }
  getPartList() {
    this.commonService.getHttpService('getPartListDD').subscribe(response => {
      this.partList = response.responseData
    });
  }



  getViewContent() {
    var postData = {
      VendorInvoiceId: this.VendorInvoiceId,
    }
    this.commonService.postHttpService(postData, "getVendorInvoiceView").subscribe(response => {
      if (response.status == true) {
        this.result = response.responseData;
        this.VendorInvoiceInfo = this.result.VendorInvoiceInfo[0] || "";
        this.PartItem = this.result.VendorInvoiceItem;
        this.VendorInvoiceNotes = this.result.NotesList
        this.VendorAddress = this.result.ContactAddress[0] || ""
        this.faxVendorAddress = this.VendorAddress.Fax
        this.PhoneVendorAddress = this.VendorAddress.PhoneNoPrimary;
        this.RRId = this.VendorInvoiceInfo.RRId
        this.GrandTotalUSD = this.VendorInvoiceInfo.BaseGrandTotal;
        this.ExchangeRate = this.VendorInvoiceInfo.ExchangeRate
        this.Symbol = this.VendorInvoiceInfo.CurrencySymbol
        this.VendorLocation = this.VendorInvoiceInfo.VendorLocation 
        this.VendorVatTax = this.VendorInvoiceInfo.VatTaxPercentage 
        this.VendorCurrencyCode = this.VendorInvoiceInfo.VendorCurrencyCode 
        this.model.VendorInvNo = this.VendorInvoiceInfo.VendorInvNo;
        this.model.VendorId = this.VendorInvoiceInfo.VendorId;
        this.model.VendorName = this.VendorInvoiceInfo.VendorName;
        this.model.VendorInvoiceType = this.VendorInvoiceInfo.VendorInvoiceType
        this.model.ReferenceNo = this.VendorInvoiceInfo.ReferenceNo
        if (this.VendorInvoiceInfo.RRId != 0) {
          this.enableVendorApproved = this.VendorInvoiceInfo.IsInvoiceApproved
        }
        else {
          this.enableVendorApproved = this.VendorInvoiceInfo.IsMROInvoiceApproved
        }
        if (this.VendorInvoiceInfo.TermsName == "Credit Card") {
          this.enableVendorApproved = 1;

        }
       
        this.model.TermsId = this.VendorInvoiceInfo.TermsId;
        this.model.Status = this.VendorInvoiceInfo.Status
        const Requestedyear = Number(this.datePipe.transform(this.VendorInvoiceInfo.InvoiceDate, 'yyyy'));
        const RequestedMonth = Number(this.datePipe.transform(this.VendorInvoiceInfo.InvoiceDate, 'MM'));
        const RequestedDay = Number(this.datePipe.transform(this.VendorInvoiceInfo.InvoiceDate, 'dd'));
        this.model.InvoiceDate = {
          year: Requestedyear,
          month: RequestedMonth,
          day: RequestedDay
        }
        const years = Number(this.datePipe.transform(this.VendorInvoiceInfo.DueDate, 'yyyy'));
        const Month = Number(this.datePipe.transform(this.VendorInvoiceInfo.DueDate, 'MM'));
        const Day = Number(this.datePipe.transform(this.VendorInvoiceInfo.DueDate, 'dd'));
        this.model.DueDate = {
          year: years,
          month: Month,
          day: Day
        }

        this.TotalTax = this.VendorInvoiceInfo.TotalTax;
        this.Discount = this.VendorInvoiceInfo.Discount;
        this.AHFees = this.VendorInvoiceInfo.AHFees;
        this.GrandTotal = this.VendorInvoiceInfo.GrandTotal;
        this.Shipping = this.VendorInvoiceInfo.Shipping;
        this.SubTotal = this.VendorInvoiceInfo.SubTotal;
        this.TaxPercent = this.VendorInvoiceInfo.TaxPercent;
        this.PartItem.map(a => {
          a.TaxWithQuantity = (a.Quantity * a.Tax).toFixed(2);
        })

      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  reLoad() {
    this.router.navigate([this.currentRouter.split('?')[0]], { queryParams: { VendorInvoiceId: this.VendorInvoiceId } })

    // this.router.navigate([this.currentRouter])
  }

  onApprovedVendorInvoice() {
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
          "VendorInvoiceId": this.VendorInvoiceId
        }
        this.commonService.postHttpService(postData, 'ApprovedVendorInvoice').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Approved Bill!',
              text: 'Vendor Bill Approved has been Updated.',
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
          text: 'Vendor Bill Approved has not Updated.',
          type: 'error'
        });
      }
    });

  }
  onReOpenVendorInvoice() {
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
          "VendorInvoiceId": this.VendorInvoiceId
        }
        this.commonService.postHttpService(postData, 'ReOpenVendorInvoice').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'ReOpen Vendor Bill!',
              text: 'Vendor Bill ReOpen has been Updated.',
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
          text: 'Vendor Bill ReOpen has not Updated.',
          type: 'error'
        });
      }
    });

  }
  arrayOne(n: number): any[] {
    return Array(n);
  }

  addItem(AddItem) {
    this.model.PONo = "";
    this.POList = [];
    this.isMasterSel = false
    this.modalService.open(AddItem, { centered: true, size: 'xl' });


  }



  removePartItem(i, VendorInvoiceItemId) {

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
        if (VendorInvoiceItemId != undefined) {
          if(this.VendorInvoiceInfo.CreatedByLocation == this.Location ){

          var postData = {
            "VendorInvoiceItemId": VendorInvoiceItemId,
            "TaxPercent":this.TaxPercent,
            "VendorInvoiceId":this.VendorInvoiceId

          }

          this.commonService.postHttpService(postData, 'DeleteVendorInvoiceItem').subscribe(response => {
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
        }else{
          Swal.fire({
            type: 'info',
            title: 'AH Country Mismatch',
            html:'<b style=" font-size: 14px !important;">'+(`Vendor Bill Added from : <span class="badge badge-primary btn-xs">${this.VendorInvoiceInfo.CreatedByLocationName}</span> country. Now the AH Country is <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`)+'</b>',
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
    let Quantity = this.PartItem[index].Quantity || 0;
    let Rate = this.PartItem[index].Rate || 0;
    let ShippingCharge = this.PartItem[index].ShippingCharge || 0;
    let VatTax = this.PartItem[index].ItemTaxPercent /100;
    let VatTaxPrice = Rate * VatTax
    // Calculate the price
    price = (parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice)) + parseFloat(ShippingCharge);
    this.PartItem[index].Price = price.toFixed(2);
    this.PartItem[index].Tax=(Rate * VatTax).toFixed(2);
    var TaxLocal=(Rate * VatTax)
    this.PartItem[index].TaxWithQuantity=(Quantity * TaxLocal).toFixed(2);
    let priceUSD = price* this.ExchangeRate
    let BaseShippingCharge = ShippingCharge* this.ExchangeRate
    this.PartItem[index].BaseShippingCharge = BaseShippingCharge.toFixed(2)
    this.PartItem[index].BasePrice = priceUSD.toFixed(2)
    let RateUSD = Rate* this.ExchangeRate
    this.PartItem[index].BaseRate = RateUSD.toFixed(2);
    let BaseTaxUSD = TaxLocal* this.ExchangeRate
    this.PartItem[index].BaseTax = BaseTaxUSD.toFixed(2);

    for (let i = 0; i < this.PartItem.length; i++) {
      subTotal += parseFloat(this.PartItem[i].Price)

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

    this.GrandTotalUSD =  (this.GrandTotal *  this.ExchangeRate).toFixed(2)
    
  }



  calculateBeforePrice() {
    var price = 0; var subTotal = 0;
    for (var i = 0; i < this.PartItem.length; i++) {
      let Quantity = this.PartItem[i].Quantity || 0;
      let Rate = this.PartItem[i].Rate || 0;
      let VatTax = this.PartItem[i].ItemTaxPercent /100;
      let VatTaxPrice = Rate * VatTax
      let ShippingCharge = this.PartItem[i].ShippingCharge || 0;
      // Calculate the price
      price = (parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice)) +parseFloat(ShippingCharge);
      this.PartItem[i].Price = price.toFixed(2);
      this.PartItem[i].Tax=(Rate * VatTax).toFixed(2);
      var TaxLocal=(Rate * VatTax) 
      let priceUSD = price* this.ExchangeRate
      let BaseShippingCharge = ShippingCharge* this.ExchangeRate
    this.PartItem[i].BaseShippingCharge = BaseShippingCharge.toFixed(2)
      this.PartItem[i].BasePrice = priceUSD.toFixed(2)
      let RateUSD = Rate* this.ExchangeRate
      this.PartItem[i].BaseRate = RateUSD.toFixed(2);
      let BaseTaxUSD = TaxLocal* this.ExchangeRate
      this.PartItem[i].BaseTax = BaseTaxUSD.toFixed(2);
    }
    for (let i = 0; i < this.PartItem.length; i++) {
      subTotal += parseFloat(this.PartItem[i].Price)

    }
    //Calculate the subtotal
    this.SubTotal = subTotal;

    //this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }

  onItemSubmit() {
    this.submitted = true;
    let obj = this


    this.PartItem = this.PartItem.concat(this.checkedCategoryList);
    
    this.PartItem.every(function (item: any) {
      return item.VendorInvoiceId = obj.VendorInvoiceId;
    })
    // this.PartItem.push(this.checkedCategoryList)
    this.modalService.dismissAll();
    this.calculateBeforePrice()

  }


  checkUncheckAll() {
    for (var i = 0; i < this.POList.length; i++) {
      this.POList[i].isSelected = this.isMasterSel;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.isMasterSel = this.POList.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    let obj = this
    this.checkedCategoryList = [];

    for (var i = 0; i < this.POList.length; i++) {

      if (this.POList[i].isSelected)
        //this.PartItem.push(this.POList[i])
        this.checkedCategoryList.push(this.POList[i]);

    }

    // this.checkedCategoryList = JSON.stringify(this.checkedCategoryList);

  }

  SearchPONo() {
    var postData = {
      PONo: this.model.PONo.trim(),
    }
    this.commonService.postHttpService(postData, "getPONOList").subscribe(response => {
      if (response.status == true) {
        this.POList = response.responseData;
        if(this.POList.length==0){
        this.dataMessage='No data'
        }
        this.POList.forEach(function (element) {
          element.TaxWithQuantity = (element.Quantity * element.Tax).toFixed(2);
          element.isSelected = false;
        });
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  backToRRView() {
    this.router.navigate(['/admin/repair-request/edit'], { state:{RRId: this.VendorInvoiceInfo.RRId} });
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
    if (f.valid) {
      if(this.VendorInvoiceInfo.CreatedByLocation == this.Location ){
        let obj=this
        obj.PartItem.filter(function (value) {
          if (value.ItemLocalCurrencySymbol != obj.VendorInvoiceInfo.VendorCurrencySymbol) {
            this.isCurrencyMode = true
          }
        }, obj);
        if(!this.isCurrencyMode){
      this.btnDisabled = true;
      var postData = {

        "LocalCurrencyCode":this.VendorCurrencyCode,
        "ExchangeRate":this.ExchangeRate,
        "BaseCurrencyCode":localStorage.getItem('BaseCurrencyCode'),
        "BaseGrandTotal":this.GrandTotalUSD,
        
        "VendorInvoiceId": this.VendorInvoiceId,
        "VendorInvNo": this.model.VendorInvNo,
        "VendorInvoiceType": this.model.VendorInvoiceType,
        "InvoiceDate": DateRequested,
        "DueDate": DueDate,
        "VendorId": this.model.VendorId,
        "VendorName": this.model.VendorName,
        "ReferenceNo": this.model.ReferenceNo,
        "TermsId": this.model.TermsId,
        "RRId": this.RRId,
        "POId": "0",
        "SubTotal": this.SubTotal,
        "TotalTax": this.TotalTax,
        "Discount": this.Discount,
        "AHFees": this.AHFees,
        "Shipping": this.Shipping,
        "GrandTotal": this.GrandTotal,
        "TaxPercent": this.TaxPercent,
        "Status": this.model.Status,
        "VendorInvoiceItem": this.PartItem
      }
      this.commonService.putHttpService(postData, "VendorInvoiceUpdate").subscribe(response => {
        if (response.status == true) {
          this.btnDisabled = false;
          this.reLoad()

          Swal.fire({
            title: 'Success!',
            text: 'Vendor Bill has been Updated!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          // this.router.navigate(['./admin/invoice/vendor-invoice-list'])

        }
        else {
          this.btnDisabled = false;
          Swal.fire({
            title: 'Error!',
            text: 'Vendor Bill could not be Updated!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }else{
      Swal.fire({
        type: 'info',
        title: 'Vendor Currency Mismatch',
        text: `Vendor Currency Code is Changed. Please contact admin to update a Vendor Bill`,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }
    }else{
      Swal.fire({
        type: 'info',
        title: 'AH Country Mismatch',
        html:'<b style=" font-size: 14px !important;">'+(`Vendor Bill Added from : <span class="badge badge-primary btn-xs">${this.VendorInvoiceInfo.CreatedByLocationName}</span> country. Now the AH Country is <span class="badge badge-pink btn-xs">${this.LocationName}</span> . Please change country to proceed!`)+'</b>',
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


  //Notes Section
  addNotes() {
    var IdentityId = this.VendorInvoiceId;
    var IdentityType = CONST_IDENTITY_TYPE_VENDORINVOICE
    this.modalRef = this.CommonmodalService.show(AddNotesComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { IdentityId, IdentityType },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.VendorInvoiceNotes.push(res.data);
    });
  }

  editNotes(note, i) {
    var IdentityId = this.VendorInvoiceId;
    var IdentityType = CONST_IDENTITY_TYPE_VENDORINVOICE
    this.modalRef = this.CommonmodalService.show(EditNotesComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { note, i, IdentityId, IdentityType },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      }
    )

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.VendorInvoiceNotes[i] = res.data;
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
            this.VendorInvoiceNotes.splice(i, 1)
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


  BackToView(){
    this.router.navigate(['/admin/invoice/vendor-invoice-list'],{state:{VendorInvoiceId: this.VendorInvoiceInfo.VendorInvoiceId}})
  }




}
