/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import { CONST_AH_Group_ID, Const_Alert_pop_message, Const_Alert_pop_title, CONST_MODIFY_ACCESS, CONST_VIEW_ACCESS, Invoice_Status, Invoice_Type, Shipping_field_Name, VAT_field_Name } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-consolidate-invoice',
  templateUrl: './edit-consolidate-invoice.component.html',
  styleUrls: ['./edit-consolidate-invoice.component.scss'],
  providers: [
    NgxSpinnerService
  ],
})
export class EditConsolidateInvoiceComponent implements OnInit {
  ConsolidateInvoiceId
  result
  InvoiceInfo;
  BillingAddress;
  ShippingAddress
  ContactAddress;
  InvoiceItem: any = []
  faxBillingAddress
  PhoneBillingAddress
  AH_Address
  CONST_AH_Group_ID
  IsEditEnabled: boolean = false
  IsViewEnabled: boolean = false
  VAT_field_Name
  Shipping_field_Name
  IsDisplayBaseCurrencyValue
  BaseCurrencySymbol
  submitted = false;
  ShippingHistory;
  btnDisabled: boolean = false;
  REMIT_Address

  model: any = {}
  InvoiceList: any = []
  gridCheckAll: boolean;
  uncheckedQuoteIds: any = []
  checkedList: any = []
  InvoiceType
  StatusName
  SubTotal
  GrandTotal
  GrandTotalUSD
  InvoiceItemList: any = []
  ShowAddList: boolean = false
  constructor(private http: HttpClient, public router: Router, private spinner: NgxSpinnerService, public navCtrl: NgxNavigationWithDataComponent,
    private modalService: NgbModal, private commonService: CommonService, private cd_ref: ChangeDetectorRef, private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, private datePipe: DatePipe, private route: ActivatedRoute) { }
  currentRouter = decodeURIComponent(this.router.url);

  ngOnInit(): void {
    document.title = 'Consolidate Invoice Edit'
    this.IsEditEnabled = this.commonService.permissionCheck("ConsolidateInvoice", CONST_MODIFY_ACCESS);
    this.IsViewEnabled = this.commonService.permissionCheck("ConsolidateInvoice", CONST_VIEW_ACCESS);
    if (history.state.InvoiceId == undefined) {
      this.route.queryParams.subscribe(
        params => {
          this.ConsolidateInvoiceId = params['ConsolidateInvoiceId'];
        }
      )
    }
    else if (history.state.InvoiceId != undefined) {
      this.ConsolidateInvoiceId = history.state.InvoiceId
    }
    this.InvoiceInfo = "";
    this.BillingAddress = "";
    this.AH_Address = ''
    this.ShippingAddress = "";
    this.VAT_field_Name = VAT_field_Name
    this.Shipping_field_Name = Shipping_field_Name
    this.IsDisplayBaseCurrencyValue = localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol")
    if(this.IsEditEnabled){
    this.loadTemplate(this.ConsolidateInvoiceId)
    }
  }
  loadTemplate(ConsolidateInvoiceId) {
    this.spinner.show();

    var postData = {
      ConsolidateInvoiceId: ConsolidateInvoiceId,
    }
    this.commonService.postHttpService(postData, "ConsolidateInvoiceView").subscribe(response => {
      if (response.status == true) {
        // console.log(response.responseData)
        this.result = response.responseData;
        this.InvoiceInfo = this.result.Consolidate || "";
        this.BillingAddress = this.result.BillingAddressInfo[0] || "";
        this.ShippingAddress = this.result.ShippingAddressInfo[0] || "";
        this.ContactAddress = this.result.ContactAddressInfo[0] || "";
        this.REMIT_Address=this.result.RemitToAddress
        this.InvoiceItem = this.result.ConsolidateDetail.map(a => {
          a.CustomerPONo = this.InvoiceInfo.CustomerPONo,
            a.CustomerId = this.InvoiceInfo.CustomerId,
            a.CustomerBlanketPOId = this.InvoiceInfo.CustomerBlanketPOId
          return a
        })
        this.faxBillingAddress = this.BillingAddress.Fax
        this.PhoneBillingAddress = this.BillingAddress.Phone;
        this.AH_Address = this.result.AHBillingAddress[0]
        this.CONST_AH_Group_ID = CONST_AH_Group_ID;
        this.GrandTotal = this.InvoiceInfo.GrandTotal
        this.GrandTotalUSD = this.InvoiceInfo.BaseGrandTotal

      }
      else {

      }
      this.spinner.hide()
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }

  BackToView() {
    this.router.navigate(['/admin/ConsolidateInvoice-List'], { state: { ConsolidateInvoiceId: this.ConsolidateInvoiceId } })
  }
  // onSubmit(f: NgForm) {
  //   this.submitted = true;


  //   if (f.valid) {


  //       this.btnDisabled = true;
  //       var postData = {
  //         "CustomerPONo": this.InvoiceInfo.CustomerPONo,
  //         "CustomerId": this.InvoiceInfo.CustomerId,
  //         "CustomerBlanketPOId": this.InvoiceInfo.CustomerBlanketPOId,
  //         "ConsolidateDetail": this.InvoiceItem
  //       }
  //       this.commonService.putHttpService(postData, "ConsolidateInvoiceUpdate").subscribe(response => {
  //         if (response.status == true) {
  //           this.btnDisabled = false;
  //           this.reLoad()
  //           Swal.fire({
  //             title: 'Success!',
  //             text: 'Consolidate Invoice has been Updated!',
  //             type: 'success',
  //             confirmButtonClass: 'btn btn-confirm mt-2'
  //           });
  //           // this.router.navigate(['./admin/invoice/list'])

  //         }
  //         else {
  //           this.btnDisabled = false;
  //           Swal.fire({
  //             title: 'Error!',
  //             text: 'Consolidate Invoice could not be Updated!',
  //             type: 'warning',
  //             confirmButtonClass: 'btn btn-confirm mt-2'
  //           });
  //         }
  //         this.cd_ref.detectChanges();
  //       }, error => console.log(error));


  // }else {
  //     this.btnDisabled = false;
  //     Swal.fire({
  //       type: 'error',
  //       title: Const_Alert_pop_title,
  //       text: Const_Alert_pop_message,
  //       confirmButtonClass: 'btn btn-confirm mt-2',
  //     });

  //   }

  // }

  reLoad() {
    this.router.navigate([this.currentRouter.split('?')[0]], { queryParams: { ConsolidateInvoiceId: this.ConsolidateInvoiceId } })
  }

  onDelete(ConsolidateInvoiceDetailId) {
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
          ConsolidateInvoiceDetailId: ConsolidateInvoiceDetailId,
        }
        this.commonService.postHttpService(postData, 'ConsolidateInvoiceDeleteDetail').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Consolidate Invoice Line item has been deleted.',
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
          title: 'Cancelled',
          text: 'Consolidate Invoice Line item is safe:)',
          type: 'error'
        });
      }
    });

  }

  addItem(AddItem) {
    this.ShowAddList = false
    this.model.InvoiceNo = "";
    this.checkedList = []
    this.gridCheckAll = false
    this.InvoiceList = [];
    this.modalService.open(AddItem, { centered: true, size: 'xl' });
  }

  gridAllRowsCheckBoxChecked(e) {
    // console.log(e);
    // if (this.gridCheckAll) {
    this.uncheckedQuoteIds.length = 0;
    this.gridCheckAll = !this.gridCheckAll;

    // if (this.gridCheckAll) {
    //   this.checkedPersonIds.push();
    // }
    // } else {
    //   this.checkedPersonIds.length = 0;
    //   this.gridCheckAll = true;
    // }
    if (e.target.checked) {
      this.InvoiceList.map(a => {
        if(a.IsApproved==1 && a.Consolidated!=1)
        {
          a.checked = true
        }else{
          a.checked = false;
        }
      })
      this.checkedList = this.InvoiceList.map(a => { return { InvoiceNo: a.InvoiceNo, InvoiceId: a.InvoiceId, CustomerId: a.CustomerId, CustomerPONo: a.CustomerPONo, CustomerBlanketPOId: a.CustomerBlanketPOId, LocalCurrencyCode: a.LocalCurrencyCode } });

      // this.QuoteList = this.QuoteItem.map(a => {
      //   let qObj: any;
      //   qObj.QuoteId = a.QuoteId;
      //   if (a.RRNo != '' && a.RRNo != '0' && a.RRNo != null) {
      //     qObj.RRNo = a.RRNo;
      //   } else if (a.MRONo != '' && a.MRONo != '0' && a.MRONo != null) {
      //     qObj.MRONo = a.MRONo;

      //   }
      //   return qObj;
      // });
    } else {
      this.InvoiceList.map(a => a.checked = false);
      // this.QuoteList = [];
      this.checkedList = [];
    }
  }
  private isQuoteChecked(InvoiceId) {
    this.checkedList = [];
    if (!this.gridCheckAll) {
      // return this.checkedQuoteIds.indexOf(CustomerId) >= 0 ? true : false;
    } else {
      this.InvoiceList.map(a => a.checked = false);
      this.checkedList = this.InvoiceList.map(a => { return { InvoiceNo: a.InvoiceNo, InvoiceId: a.InvoiceId, CustomerId: a.CustomerId, CustomerPONo: a.CustomerPONo, CustomerBlanketPOId: a.CustomerBlanketPOId, LocalCurrencyCode: a.LocalCurrencyCode } });
      return this.uncheckedQuoteIds.indexOf(InvoiceId) >= 0 ? false : true;

    }
  }
  rowCheckBoxChecked(e, InvoiceNo, InvoiceId, CustomerId, CustomerPONo, CustomerBlanketPOId, LocalCurrencyCode) {
    if (e.target.checked) {

      this.checkedList.push({ InvoiceNo, InvoiceId, CustomerId, CustomerPONo, CustomerBlanketPOId, LocalCurrencyCode });

      // let qObj: any;
      // qObj.QuoteId = QuoteId;

      // if (RRNo != '' && RRNo != '0' && RRNo != null) {
      //   qObj.RRNo = RRNo;
      // } else if (MRONo != '' && MRONo != '0' && MRONo != null) {
      //   qObj.MRONo = MRONo;

      // }

      // this.QuoteItem.push(qObj);

    } else {
      this.gridCheckAll = false
      this.checkedList = this.checkedList.filter(a => a.InvoiceId != InvoiceId);
      // this.QuoteList = this.QuoteList.filter(a => a.QuoteId != QuoteId);
    }
  }


  GetClassStatusName(Status) {
    var className = ""
    var StatusStyle = Invoice_Status.find(a => a.Invoice_StatusId == Status)
    this.StatusName = (StatusStyle ? StatusStyle.Invoice_StatusName : '')
    className = `badge ' ${(StatusStyle ? StatusStyle.cstyle : '')}  ' btn-xs`
    return className;
  }
  GetClassInvoiceTypeName(InvoiceType) {
    var className = ""
    var TypeStyle = Invoice_Type.find(a => a.Invoice_TypeId == InvoiceType)
    this.InvoiceType = (TypeStyle ? TypeStyle.Invoice_TypeName : '')
    className = `badge ' ${(TypeStyle ? TypeStyle.cstyle : '')}  ' btn-xs`
    return className;
  }

  onSearch() {
    this.ShowAddList = true
    this.InvoiceList = []
    if (this.model.InvoiceNo != undefined) {
      var invoiceNo = this.model.InvoiceNo.replace("\n", "").toString()
      var InvoiceNo = invoiceNo.split(" ");
    } else {
      InvoiceNo = ""
    }
    var postData = {
      "InvoiceNo": InvoiceNo.toString(),
    }
    this.commonService.postHttpService(postData, "ConsolidateInvoiceSearch").subscribe(response => {
      if (response.status == true) {
        this.InvoiceList = response.responseData.data;
        this.InvoiceList.forEach(item => {
          item.checked = this.isQuoteChecked(item.InvoiceId);
        });
        this.cd_ref.detectChanges();
      }
      else {
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
  onItemSubmit() {
    this.submitted = true;
    if(this.checkedList.length>0){
    var InvoiceItem = this.InvoiceItem.concat(this.checkedList);
    var postData = {
      "ConsolidateInvoiceId": this.ConsolidateInvoiceId,
      "CustomerPONo": this.InvoiceInfo.CustomerPONo,
      "CustomerId": this.InvoiceInfo.CustomerId,
      "CustomerBlanketPOId": this.InvoiceInfo.CustomerBlanketPOId,
      "ConsolidateDetail": InvoiceItem
    }
    this.commonService.postHttpService(postData, "ConsolidateInvoiceUpdate").subscribe(response => {
      if (response.status == true) {
        this.btnDisabled = false;
        this.modalService.dismissAll();
        this.reLoad()
        Swal.fire({
          title: 'Success!',
          text: 'Consolidate Invoice has been Updated!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
        // this.router.navigate(['./admin/invoice/list'])

      }
      else {
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
      title: 'Message',
      text: 'Please checked the Invoice Line Item',
      confirmButtonClass: 'btn btn-confirm mt-2',
    });

  }

  }
  calculateBeforePrice() {
    var price = 0; var subTotal = 0;
    for (var i = 0; i < this.InvoiceItem.length; i++) {
      let Quantity = this.InvoiceItem[i].Quantity || 0;
      let Rate = this.InvoiceItem[i].Rate || 0;
      let VatTax = this.InvoiceItem[i].ItemTaxPercent / 100;
      let VatTaxPrice = Rate * VatTax
      let ShippingCharge = this.InvoiceItem[i].ShippingCharge || 0;
      // Calculate the price
      price = (parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice)) + parseFloat(ShippingCharge);
      this.InvoiceItem[i].Price = price
      //   this.InvoiceItem[i].Tax=(Rate * VatTax)
      //   var TaxLocal=(Rate * VatTax) 
      //   let priceUSD = price* this.InvoiceItem[i].ExchangeRate
      //   let BaseShippingCharge = ShippingCharge* this.InvoiceItem[i].ExchangeRate
      // this.InvoiceItem[i].BaseShippingCharge = BaseShippingCharge.toFixed(2)
      //   this.InvoiceItem[i].BasePrice = priceUSD.toFixed(2)
      //   let RateUSD = Rate* this.ExchangeRate
      //   this.InvoiceItem[i].BaseRate = RateUSD
      //   let BaseTaxUSD = TaxLocal* this.ExchangeRate
      //   this.InvoiceItem[i].BaseTax = BaseTaxUSD
    }
    for (let i = 0; i < this.InvoiceItem.length; i++) {
      subTotal += this.InvoiceItem[i].Price

    }
    //Calculate the subtotal
    this.SubTotal = subTotal;

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

    this.GrandTotalUSD = (this.GrandTotal * this.InvoiceInfo.ExchangeRate).toFixed(2)

  }


  loadInvoiceItem() {
    var postData = {
      "InvoiceNo": this.InvoiceInfo.InvoiceNo.toString(),
    }
    this.commonService.postHttpService(postData, "ConsolidateInvoiceSearch").subscribe(response => {
      if (response.status == true) {
        this.InvoiceItemList = response.responseData.data;

        this.cd_ref.detectChanges();
      }
      else {
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
}
