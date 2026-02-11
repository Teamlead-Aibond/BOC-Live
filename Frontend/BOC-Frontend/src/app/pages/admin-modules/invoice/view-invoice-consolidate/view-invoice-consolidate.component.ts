/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import { CONST_AH_Group_ID, CONST_COST_HIDE_VALUE, CONST_DELETE_ACCESS, CONST_MODIFY_ACCESS, CONST_VIEW_ACCESS } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { ConsolidateInvoiceViewComponent } from '../../common-template/consolidate-invoice-view/consolidate-invoice-view.component';

@Component({
  selector: 'app-view-invoice-consolidate',
  templateUrl: './view-invoice-consolidate.component.html',
  styleUrls: ['./view-invoice-consolidate.component.scss'],
  providers: [
    NgxSpinnerService
  ],
})
export class ViewInvoiceConsolidateComponent implements OnInit {
  ConsolidateInvoiceId
  settingsView;
  result: any = [];
  number;
  ShippingHistory;

  InvoiceInfo;
  BillingAddress;
  ShippingAddress
  ContactAddress;
  attachmentThumb;
  InvoiceItem: any = [];
  CustomerRef: any = [];
  //itemdetails
  LeadTime;
  Rate;
  WarrantyPeriod;
  SubTotal;
  GrandTotal;
  AdditionalCharge;
  TotalTax;
  Discount;
  AHFees;
  Shipping;
  TaxPercent;
  AdvanceAmount;

  NotesList;
  RRId;
  MROId
  faxBillingAddress;
  PhoneBillingAddress;
  CONST_AH_Group_ID;
  AttachmentList: any = []
  invoice_notes;
  InvoiceTypeStyle;
  RemitToAddress
  IsEditEnabled;
  IsEmailEnabled;
  IsViewCostEnabled;
  IsNotesEnabled;
  IsPrintPDFEnabled;
  IsDeleteEnabled;
  
  showActions: boolean = false;
  showPrint: boolean = false;
  AH_Address
  InvoiceItemEx: any = []
  BlanketPOExcludeAmount
  BlanketPONetAmount
  BaseCurrencySymbol
  IsDisplayBaseCurrencyValue
  VAT_field_Name
  Shipping_field_Name
  CurrencySymbolNormal
  CurrencySymbol1

  IsViewEnabled: boolean = true
  @ViewChild(ConsolidateInvoiceViewComponent, null) printComponent: ConsolidateInvoiceViewComponent;

  constructor(private http: HttpClient, public router: Router, private spinner: NgxSpinnerService, public navCtrl: NgxNavigationWithDataComponent,
    private modalService: NgbModal, private commonService: CommonService, private cd_ref: ChangeDetectorRef, private CommonmodalService: BsModalService,
    public modalRef: BsModalRef, private datePipe: DatePipe, private route: ActivatedRoute) { }
  currentRouter = decodeURIComponent(this.router.url);
  ngOnInit(): void {
    document.title = 'Consolidate Invoice View'
    this.IsPrintPDFEnabled = this.commonService.permissionCheck("INVPrintAndPDFExport", CONST_VIEW_ACCESS);
    this.IsEditEnabled = this.commonService.permissionCheck("ConsolidateInvoice", CONST_MODIFY_ACCESS);
    this.IsViewEnabled = this.commonService.permissionCheck("ConsolidateInvoice", CONST_VIEW_ACCESS);
    this.IsDeleteEnabled = this.commonService.permissionCheck("ConsolidateInvoice", CONST_DELETE_ACCESS);


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
    if(this.IsViewEnabled){
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
        this.InvoiceItem = this.result.ConsolidateDetailItem;
        this.faxBillingAddress = this.BillingAddress.Fax
        this.PhoneBillingAddress = this.BillingAddress.Phone;
        this.AH_Address = this.result.AHBillingAddress[0]
        this.CONST_AH_Group_ID = CONST_AH_Group_ID;
        this.RemitToAddress = this.result.RemitToAddress || "";




        for (let x in this.InvoiceItem) {
          if (!this.IsViewCostEnabled) {
            this.InvoiceItem[x].Rate = CONST_COST_HIDE_VALUE;
            this.InvoiceItem[x].Price = CONST_COST_HIDE_VALUE;
          }
        }
        if (!this.IsViewCostEnabled) {
          this.InvoiceInfo.SubTotal = CONST_COST_HIDE_VALUE;
          this.InvoiceInfo.AHFees = CONST_COST_HIDE_VALUE;
          this.InvoiceInfo.TotalTax = CONST_COST_HIDE_VALUE;
          this.InvoiceInfo.Discount = CONST_COST_HIDE_VALUE;
          this.InvoiceInfo.Shipping = CONST_COST_HIDE_VALUE;
          this.InvoiceInfo.GrandTotal = CONST_COST_HIDE_VALUE;
        }
      }
      else {

      }
      this.spinner.hide()
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }
  hideAddress: boolean = true
  generatePDF() {
    this.printComponent.onParentPrintClick();
  }
  generatePrint() {
    this.printComponent.onParentprint();
  }

  onDelete() {
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
          ConsolidateInvoiceId: this.ConsolidateInvoiceId,
        }
        this.commonService.postHttpService(postData, 'ConsolidateInvoiceDelete').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Consolidate Invoice has been deleted.',
              type: 'success'
            });
            this.router.navigate(['/admin/ConsolidateInvoice-List']);
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Consolidate Invoice is safe:)',
          type: 'error'
        });
      }
    });

  }


  onbackToList() {
    this.navCtrl.navigate('/admin/ConsolidateInvoice-List');
  }
}
