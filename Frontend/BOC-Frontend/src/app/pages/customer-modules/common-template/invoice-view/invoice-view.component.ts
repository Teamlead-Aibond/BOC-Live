/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FileSaverService } from 'ngx-filesaver';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import { CONST_AH_Group_ID, invoice_notes, Invoice_Type, VAT_field_Name } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss'],
  providers: [NgxSpinnerService, BsModalRef]
})
export class InvoiceViewComponent implements OnInit {
  InvoiceId
  IsDeleted

  constructor(
    private spinner: NgxSpinnerService,
    private service: CommonService,
    private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent,
    @Inject(BsModalRef) public initialState: any,
    private _FileSaverService: FileSaverService,
    private router: Router,private route: ActivatedRoute
  ) { }


  settingsView;
  result: any = [];
  number;
  ShippingHistory;

  InvoiceInfo;
  BillingAddress;
  RemitToAddress;
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

  IsDisplayBaseCurrencyValue 
  VAT_field_Name
  BaseCurrencySymbol
  ngOnInit(): void {
    this.IsDisplayBaseCurrencyValue =localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")
    this.VAT_field_Name = VAT_field_Name
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
  
    // this.InvoiceId = history.state.InvoiceId
    this.IsDeleted = history.state.IsDeleted

    // Redirect to the List page if the View Id is not available
    if (this.InvoiceId == '' || this.InvoiceId == 'undefined' || this.InvoiceId == null) {
      this.navCtrl.navigate('/customer/Invoice-List');
    }

    this.getAdminSettingsView();
    this.settingsView = ""
    this.NotesList = [];
    this.InvoiceTypeStyle = ""
    this.InvoiceInfo = "";
    this.BillingAddress = "";
    this.RemitToAddress = "";

    this.loadTemplate(this.InvoiceId, this.IsDeleted);

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


  loadTemplate(InvoiceId, IsDeleted) {
    this.ShippingHistory = ""

    this.spinner.show();

    var postData = {
      InvoiceId: InvoiceId,
      IsDeleted: IsDeleted
    }
    this.service.postHttpService(postData, "InvoiceView").subscribe(response => {
      if (response.status == true) {
        this.result = response.responseData;
        this.InvoiceInfo = this.result.InvoiceInfo[0] || "";
        this.NotesList = this.result.NotesList;
        this.BillingAddress = this.result.BillingAddressInfo[0] || "";
        this.RemitToAddress = this.result.RemitToAddress || "";
        this.ContactAddress = this.result.ContactAddressInfo[0] || "";
        this.InvoiceItem = this.result.InvoiceItem;
        this.CustomerRef = this.result.CustomerRef.concat(this.result.RRCustomerReference);
        this.RRId = this.InvoiceInfo.RRId
        this.MROId = this.InvoiceInfo.MROId
        this.faxBillingAddress = this.BillingAddress.Fax
        this.PhoneBillingAddress = this.BillingAddress.Phone;
        if ("LastShippingHistory" in this.result) {
          this.ShippingHistory = this.result.LastShippingHistory[0] || "";
        }
        else {
          this.ShippingHistory = "";
        }
        this.CONST_AH_Group_ID = CONST_AH_Group_ID;
        this.AttachmentList = this.result.AttachmentList;
        this.invoice_notes = invoice_notes;
        this.InvoiceTypeStyle = Invoice_Type.find(a => a.Invoice_TypeId == this.InvoiceInfo.InvoiceType)


        if (this.InvoiceInfo.RRId != 0) {
          this.number = this.InvoiceInfo.RRNo
        }
        else {
          this.number = this.InvoiceInfo.InvoiceNo
        }

        // for (let x in this.InvoiceItem) {
        //   if (!this.IsViewCostEnabled) {
        //     this.InvoiceItem[x].Rate = CONST_COST_HIDE_VALUE;
        //     this.InvoiceItem[x].Price = CONST_COST_HIDE_VALUE;
        //   }
        // }
        // if (!this.IsViewCostEnabled) {
        //   this.InvoiceInfo.SubTotal = CONST_COST_HIDE_VALUE;
        //   this.InvoiceInfo.AHFees = CONST_COST_HIDE_VALUE;
        //   this.InvoiceInfo.TotalTax = CONST_COST_HIDE_VALUE;
        //   this.InvoiceInfo.Discount = CONST_COST_HIDE_VALUE;
        //   this.InvoiceInfo.Shipping = CONST_COST_HIDE_VALUE;
        //   this.InvoiceInfo.GrandTotal = CONST_COST_HIDE_VALUE;
        // }



      }
      else {

      }
      this.spinner.hide()
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }

  hideAddress: boolean = true
  generatePDF() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Invoice ${this.InvoiceInfo.InvoiceNo}.pdf`);
    })
  }

  getPdfBase64(cb) {
    this.spinner.show();
    this.service.getLogoAsBas64().then((base64) => {
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

        InvoiceItem: this.InvoiceItem,
        IsNotesEnabled: 0,
        settingsView: this.settingsView,
        NotesList: this.NotesList,
        RRId: this.RRId,
        Logo: base64
      }

      this.service.postHttpService({ pdfObj }, "getINVPdfBase64").subscribe(response => {
        if (response.status == true) {
          cb(response.responseData.pdfBase64);
          this.spinner.hide();
        }
      });
    })
  }
  backToRRView() {

    this.navCtrl.navigate('/customer/RR-edit', { RRId: this.InvoiceInfo.RRId });
  }
  backToMROView() {
    //this.router.navigate(['/admin/mro/edit'], { state:{MROId: this.InvoiceInfo.MROId }});
  }
}
