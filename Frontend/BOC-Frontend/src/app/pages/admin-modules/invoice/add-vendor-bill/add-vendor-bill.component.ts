/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title, Hide_add, VAT_field_Name, Vendor_Bill_Status } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-vendor-bill',
  templateUrl: './add-vendor-bill.component.html',
  styleUrls: ['./add-vendor-bill.component.scss']
})
export class AddVendorBillComponent implements OnInit {

  checkedCategoryList: any;
  enableVendorApproved
  CustomerInvoiceApproved;
  VendorBillApproved;
  isMasterSel: boolean;
  IsCSVProcessed;
  keywordForVendor = 'VendorName';
  VendorsList: any[];
  VendorName;
  isLoadingVendor: boolean = false;
  keywordForRR = 'RRNo';
  RRList: any[]
  RRId;
  RRIdFilter = ''
  MROId
  isLoadingRR: boolean = false;

  submitted = false;
  btnDisabled: boolean = false;
  dataTableMessage;
  tableData: any = [];
  ref_no;
  TermDisc;
  vendor;
  VendorInvoiceInfo;
  VendorAddress;
  PhoneVendorAddress;
  faxVendorAddress;
  VendorInvoiceItem: any = []
  Currentdate = new Date();

  warrantyList;
  TermsList
  VendorInvoiceId;
  result;
  Vendorinvoice_notes;
  vendorList;
  showSearch: boolean = true;
  Invoice_Status;
  //itemdetails
  LeadTime;
  Rate;
  WarrantyPeriod;
  SubTotal;
  GrandTotal;
  AdditionalCharge;
  TotalTax;
  Discount;
  TaxPercent;
  AHFees;
  Shipping;
  AdvanceAmount;
  number;
  //Filter
  RRNo;
  VendorInvoiceNo;
  CustomerId;
  PONo;
  VendorInvoiceType;
  Status;
  InvoiceDateToDate
  InvoiceDateDate;
  DueDateToDate;
  DueDateDate;
  InvoiceDate;
  InvoiceDateTo;
  DueDateTo;
  DueDate;
  VendorId = ''
  PartItem: any = []
  VendorInvoiceList: any = [];
  NotesList: any = [];
  ResponseMessage;
  partList;
  //Add
  model: any = [];
  POList: any = [];
  checkedList: any = [];
  postData;
  ExcelData;
  CSVData;
  IsViewEnabled;
  IsAddEnabled;
  IsEditEnabled;
  IsDeleteEnabled;
  IsViewCostEnabled;
  IsPrintPDFEnabled;
  IsExcelEnabled;
  IsNotesEnabled;
  IsApproveEnabled;
  settingsView;
  VendorInvoiceTypeStyle;
  ListHidden: boolean = false;
  showList: boolean = true;
  IsDeleted;


  VAT_field_Name
  IsDisplayBaseCurrencyValue
  Symbol
  VendorLocation
  VendorVatTax
  ExchangeRate
  VendorCurrencyCode
  GrandTotalUSD
  showlineItem:boolean=false
  BaseCurrencySymbol
  Hide_add
  constructor(public router: Router,
    private service: CommonService, private cd_ref: ChangeDetectorRef, private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, private datePipe: DatePipe, private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.Hide_add = Hide_add
    if(this.Hide_add != 1){
    document.title='Vendor Bill Add'
    this.VAT_field_Name = VAT_field_Name
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")
    this.IsDisplayBaseCurrencyValue =localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.settingsView = ""
    this.getAdminSettingsView();
    this.getVendorList();
    this.getPartList();
    this.getTermList();
    this.Invoice_Status = Vendor_Bill_Status;
    this.VendorInvoiceInfo = "";
    this.VendorInvoiceTypeStyle = ""
    this.VendorInvoiceItem = [];
    this.NotesList = [];
    this.VendorAddress = "";
    this.Shipping = "0";
    this.Discount = "0";
    this.AHFees = "0";

    const years = Number(this.datePipe.transform(this.Currentdate, 'yyyy'));
    const Month = Number(this.datePipe.transform(this.Currentdate, 'MM'));
    const Day = Number(this.datePipe.transform(this.Currentdate, 'dd'));
    this.model.InvoiceDate = {
      year: years,
      month: Month,
      day: Day
    }

    let DueDateFromSettings = new Date(new Date().getTime() + this.settingsView.VendorBillLeadTime * 24 * 60 * 60 * 1000);

    const dueyears = Number(this.datePipe.transform(DueDateFromSettings, 'yyyy'));
    const dueMonth = Number(this.datePipe.transform(DueDateFromSettings, 'MM'));
    const dueDay = Number(this.datePipe.transform(DueDateFromSettings, 'dd'));
    this.model.DueDate = {
      year: dueyears,
      month: dueMonth,
      day: dueDay
    }
    this.model.VendorId = null
    this.model.VendorName = "";
    this.model.ReferenceNo = "";
    this.model.VendorInvoiceType = undefined
    this.SubTotal = "";
    this.Shipping = "0";
    this.Discount = "0";
    this.AHFees = "0";
    this.GrandTotal = "";
    this.TotalTax = "";
    this.PartItem = [];
    this.model.Status = "0"

  }
}



  getTermList() {
    this.service.getHttpService("getTermsList").subscribe(response => {
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
    this.service.postHttpService(postData, "getSettingsGeneralView").subscribe(response => {
      if (response.status == true) {
        this.settingsView = response.responseData;
        this.TaxPercent = this.settingsView.TaxPercent

      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }











  EnableSearch() {
    this.showSearch = true;
  }


  getVendorList() {
    this.service.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
    });
  }
  getPartList() {
    this.service.getHttpService('getPartListDD').subscribe(response => {
      this.partList = response.responseData
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



  addItem(AddItem) {
    this.model.PONo = "";
    this.POList = [];
    this.isMasterSel = false
    this.modalService.open(AddItem, { centered: true, size: 'xl' });


  }





  removePartItem(i) {
    this.PartItem.splice(i, 1);
    this.changeStatus(i)

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
    var subTotal1 =0
    let Quantity = this.PartItem[index].Quantity || 0;
    let Rate = this.PartItem[index].Rate || 0;
    let VatTax = this.PartItem[index].ItemTaxPercent /100;
    let VatTaxPrice = Rate * VatTax
    // Calculate the price
    price = parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice);
    this.PartItem[index].Price = price
    this.PartItem[index].Tax=(Rate * VatTax)
    var TaxLocal=(Rate * VatTax)
    let priceUSD = price* this.ExchangeRate
    this.PartItem[index].BasePrice = priceUSD.toFixed(2)
    let RateUSD = Rate* this.ExchangeRate
    this.PartItem[index].BaseRate = RateUSD
    let BaseTaxUSD = TaxLocal* this.ExchangeRate
    this.PartItem[index].BaseTax = BaseTaxUSD

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

    this.GrandTotalUSD =  (this.GrandTotal *  this.ExchangeRate).toFixed(2)
    
  }



  calculateBeforePrice() {
    var price = 0; var subTotal = 0;
    for (var i = 0; i < this.PartItem.length; i++) {
      let Quantity = this.PartItem[i].Quantity || 0;
      let Rate = this.PartItem[i].Rate || 0;
      let VatTax = this.PartItem[i].ItemTaxPercent /100;
      let VatTaxPrice = Rate * VatTax
      // Calculate the price
      price = parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice);
      this.PartItem[i].Price = price
      this.PartItem[i].Tax=(Rate * VatTax) 
      var TaxLocal=(Rate * VatTax)
      let priceUSD = price* this.ExchangeRate
      this.PartItem[i].BasePrice = priceUSD.toFixed(2)
      let RateUSD = Rate* this.ExchangeRate
      this.PartItem[i].BaseRate = RateUSD
      let BaseTaxUSD = TaxLocal* this.ExchangeRate
      this.PartItem[i].BaseTax = BaseTaxUSD
    }
    for (let i = 0; i < this.PartItem.length; i++) {
      subTotal += this.PartItem[i].Price

    }
    //Calculate the subtotal
    this.SubTotal = subTotal;

    this.TotalTax = this.SubTotal * this.TaxPercent / 100
    this.calculateTotal();
  }

  onItemSubmit() {
    this.submitted = true;
    this.PartItem = this.PartItem.concat(this.checkedCategoryList);
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
    this.checkedCategoryList = [];
    for (var i = 0; i < this.POList.length; i++) {
      if (this.POList[i].isSelected)
        this.checkedCategoryList.push(this.POList[i]);
    }

  }

  SearchPONo() {
    var postData = {
      PONo: this.model.PONo,
    }
    this.service.postHttpService(postData, "getPONOList").subscribe(response => {
      if (response.status == true) {
        this.POList = response.responseData;

        this.POList.forEach(function (element) {
          element.isSelected = false;
        });
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
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
      this.btnDisabled = true;
      var postData = {

        "LocalCurrencyCode":this.VendorCurrencyCode,
        "ExchangeRate":this.ExchangeRate,
        "BaseCurrencyCode":localStorage.getItem('BaseCurrencyCode'),
        "BaseGrandTotal":this.GrandTotalUSD,
        
        "InvoiceDate": DateRequested,
        "DueDate": DueDate,
        "VendorId": this.model.VendorId,
        "ReferenceNo": this.model.ReferenceNo,
        "VendorName": this.model.VendorName,
        "VendorInvoiceType": this.model.VendorInvoiceType,
        "VendorInvNo": this.model.VendorInvNo,
        "TermsId": this.model.TermsId,
        "RRId": "0",
        "POId": "0",
        "SubTotal": this.SubTotal,
        "TotalTax": this.TotalTax,
        "Discount": this.Discount,
        "AHFees": this.AHFees,
        "Shipping": this.Shipping,
        "TaxPercent": this.TaxPercent,
        "GrandTotal": this.GrandTotal,
        "Status": this.model.Status,
        "VendorInvoiceItem": this.PartItem


      }
      this.service.postHttpService(postData, "VendorInvoiceCreate").subscribe(response => {
        if (response.status == true) {
          this.router.navigate(['/admin/VendorBill-List'])

          Swal.fire({
            title: 'Success!',
            text: 'Vendor Bill Created Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });

        }
        else {
          this.btnDisabled = false;
          Swal.fire({
            title: 'Error!',
            text: 'Vendor Bill  could not be Created!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
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





  //AutoComplete for RR
  selectRREvent($event) {
    this.RRIdFilter = $event.RRId;
  }

  onChangeRRSearch(val: string) {

    if (val) {
      this.isLoadingRR = true;
      var postData = {
        "RRNo": val
      }
      this.service.postHttpService(postData, "RRNoAotoSuggest").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.RRList = data.filter(a => a.RRNo.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingRR = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingRR = false; });

    }
  }

  //AutoComplete for Vendor
  selectVendorEvent($event) {
    this.VendorId = $event.VendorId;
  }

  onChangeVendorSearch(val: string) {

    if (val) {
      this.isLoadingVendor = true;
      var postData = {
        "Vendor": val
      }
      this.service.postHttpService(postData, "getAllAutoCompleteofVendor").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.VendorsList = data.filter(a => a.VendorName.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingVendor = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingVendor = false; });

    }
  }

}
