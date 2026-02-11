import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FileSaverService } from 'ngx-filesaver';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { VAT_field_Name, TOTAL_VAT_field_Name, Shipping_field_Name, CONST_MODIFY_ACCESS, CONST_VIEW_ACCESS, CONST_VIEW_COST_ACCESS, CONST_AH_Group_ID, invoice_notes, Invoice_Type, CONST_COST_HIDE_VALUE } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-consolidate-invoice-view',
  templateUrl: './consolidate-invoice-view.component.html',
  styleUrls: ['./consolidate-invoice-view.component.scss'],
  providers: [
    NgxSpinnerService
  ],
})
export class ConsolidateInvoiceViewComponent implements OnInit {

  @Input() ConsolidateInvoiceId?: any;
  constructor(
    public modalRef: BsModalRef,
    private spinner: NgxSpinnerService,
    private service: CommonService,
    private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent, private CommonmodalService: BsModalService,
    @Inject(BsModalRef) public initialState: any,
    private _FileSaverService: FileSaverService,
    private router: Router
  ) { }

  currentRouter = decodeURIComponent(this.router.url);

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

  IsEditEnabled;
  IsPrintPDFEnabled;
  REMIT_Address
  showActions: boolean = false;
  showPrint: boolean = false;
  AH_Address
  public onPrint: Subject<any>;
  public onEmail: Subject<any>;
  public onEdit: Subject<any>;
  InvoiceItemEx: any = []
  BlanketPOExcludeAmount
  BlanketPONetAmount
  BaseCurrencySymbol
  IsDisplayBaseCurrencyValue
  VAT_field_Name
  Shipping_field_Name
  CurrencySymbolNormal
  CurrencySymbol1
  ngOnInit(): void {
    this.IsDisplayBaseCurrencyValue = localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol")
    this.VAT_field_Name = TOTAL_VAT_field_Name; // VAT_field_Name
    this.Shipping_field_Name = Shipping_field_Name
    this.getAdminSettingsView();
    this.settingsView = ""
    this.NotesList = [];
    this.InvoiceTypeStyle = ""
    this.InvoiceInfo = "";
    this.BillingAddress = "";
    this.AH_Address = ''
    this.ShippingAddress = "";

    this.IsEditEnabled = this.service.permissionCheck("ConsolidateInvoice", CONST_MODIFY_ACCESS);
    this.IsPrintPDFEnabled = this.service.permissionCheck("INVPrintAndPDFExport", CONST_VIEW_ACCESS);

    //if (this.initialState && "ConsolidateInvoiceId" in this.initialState) {
    this.onEdit = new Subject();
    this.onPrint = new Subject();
    this.onEmail = new Subject();
    this.ConsolidateInvoiceId = this.initialState.ConsolidateInvoiceId;
    this.loadTemplate(this.ConsolidateInvoiceId);
    this.showPrint = this.initialState.showPrint;
    this.showActions = this.initialState.showActions;
    // } else {
    //   this.showPrint = true;
    //   this.showActions = false;
    // }
  }

  ngOnChanges() {
    this.loadTemplate(this.ConsolidateInvoiceId);
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

  hideAddress: boolean = true
  generatePDF() {
    var data = document.getElementById('contentToConvert');
    this.hideAddress = false;
    setTimeout(() => {
      html2canvas(data).then(canvas => {
        var imgWidth = 208;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png')
        let pdf = new jspdf('p', 'mm', 'a4');

        var position = 10;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
        pdf.save('invoice.pdf');
        this.hideAddress = true
      });
    }, 500);
  }

  loadTemplate(ConsolidateInvoiceId) {
    this.ShippingHistory = ""

    this.spinner.show();

    var postData = {
      ConsolidateInvoiceId: ConsolidateInvoiceId,
    }
    this.service.postHttpService(postData, "ConsolidateInvoiceView").subscribe(response => {
      if (response.status == true) {
        // console.log(response.responseData)
        this.result = response.responseData;
        this.InvoiceInfo = this.result.Consolidate || "";
        this.BillingAddress = this.result.BillingAddressInfo[0] || "";
        this.ShippingAddress = this.result.ShippingAddressInfo[0] || "";
        this.ContactAddress = this.result.ContactAddressInfo[0] || "";
        this.InvoiceItem = this.result.ConsolidateDetailItem;
        this.AH_Address = this.result.AHBillingAddress[0]
        this.REMIT_Address=this.result.RemitToAddress
        this.faxBillingAddress = this.BillingAddress.Fax
        this.PhoneBillingAddress = this.BillingAddress.Phone;
        this.CONST_AH_Group_ID = CONST_AH_Group_ID;       
      }
      else {

      }
      this.spinner.hide()
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }

  backToRRView() {
    this.router.navigate(['/admin/repair-request/edit'], { state: { RRId: this.InvoiceInfo.RRId } });
  }
  backToMROView() {
    this.router.navigate(['/admin/mro/edit'], { state: { MROId: this.InvoiceInfo.MROId } });
  }
  onSoBack() {
    this.router.navigate(['/admin/orders/sales-list'], { state: { SOId: this.InvoiceInfo.SOId } });
  }
  editInvoice() {
    this.onEdit.next();
  }

  onPrintClick() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Consolidate Invoice ${this.InvoiceInfo.InvoiceNo}.pdf`);
    })
    // setTimeout(() => { this.onPrint.next(); this.hideAddress = true; });

  }

  onEmailClick() {
    this.getPdfBase64((pdfBase64) => {
      let fileName = `Consolidate Invoice ${this.InvoiceInfo.InvoiceNo}.pdf`;
      this.onEmail.next({ path: `data:application/pdf;filename=generated.pdf;base64,${pdfBase64}`, filename: fileName });
    })

  }

  onParentEmailClick(cb: (pdfBase64: string, fileName: string) => void) {

    this.getPdfBase64((pdfBase64) => {
      let fileName = `Consolidate Invoice ${this.InvoiceInfo.InvoiceNo}.pdf`;
      cb(pdfBase64, fileName);
    })
  }

  onParentPrintClick() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Consolidate Invoice ${this.InvoiceInfo.InvoiceNo}.pdf`);
    })
  }

  getPdfBase64(cb) {
    this.spinner.show();
    this.service.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        AHBillingAddress: this.AH_Address,
        InvoiceInfo: this.InvoiceInfo,
        number: this.number,
        BillingAddress: this.BillingAddress,
        ShippingAddress: this.ShippingAddress,
        RemitToAddress: this.REMIT_Address,
        PhoneBillingAddress: this.PhoneBillingAddress,
        faxBillingAddress: this.faxBillingAddress,
        ShippingHistory: this.ShippingHistory,
        CONST_AH_Group_ID: this.CONST_AH_Group_ID,
        CustomerRef: this.CustomerRef.length > 0 && !("NoRecord" in this.CustomerRef[0]) ? this.CustomerRef : null,

        InvoiceItem: this.InvoiceItem,
        settingsView: this.settingsView,
        NotesList: this.NotesList,
        RRId: this.RRId,
        Logo: base64
      }

      this.service.postHttpService({ pdfObj }, "getCINVPdfBase64").subscribe(response => {
        if (response.status == true) {
          cb(response.responseData.pdfBase64);
          this.spinner.hide();
        }
      });
    })
  }

  onParentCSVClick(cb) {
    this.getCSVBase64((json) => {
      cb(json);
      // let blob = this.service.base64ToBlob(pdfBase64, "text/csv");
      // this._FileSaverService.save(blob, `Invoice ${this.InvoiceInfo.InvoiceNo}.pdf`);
    })
  }

  getCSVBase64(cb) {
    this.spinner.show();
    this.service.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        AHBillingAddress: this.AH_Address,
        InvoiceInfo: this.InvoiceInfo,
        number: this.number,
        BillingAddress: this.BillingAddress,
        ShippingAddress: this.ShippingAddress,
        PhoneBillingAddress: this.PhoneBillingAddress,
        faxBillingAddress: this.faxBillingAddress,
        RemitToAddress: this.REMIT_Address,
        ShippingHistory: this.ShippingHistory,
        CONST_AH_Group_ID: this.CONST_AH_Group_ID,
        CustomerRef: this.CustomerRef.length > 0 && !("NoRecord" in this.CustomerRef[0]) ? this.CustomerRef : null,

        InvoiceItem: this.InvoiceItem,
        settingsView: this.settingsView,
        NotesList: this.NotesList,
        RRId: this.RRId,
        Logo: base64
      }

      this.service.postHttpService({ pdfObj }, "getINVCSVBase64").subscribe(response => {
        if (response.status == true) {
          cb(response.responseData.json);
          this.spinner.hide();
        }
      });
    })
  }

  onParentAutoUploadCSVClick(cb) {
    this.autoUploadCSVBase64((json) => {
      cb(json);
      // let blob = this.service.base64ToBlob(pdfBase64, "text/csv");
      // this._FileSaverService.save(blob, `Invoice ${this.InvoiceInfo.InvoiceNo}.pdf`);
    })
  }

  autoUploadCSVBase64(cb) {
    this.spinner.show();
    this.service.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        AHBillingAddress: this.AH_Address,
        InvoiceInfo: this.InvoiceInfo,
        number: this.number,
        BillingAddress: this.BillingAddress,
        ShippingAddress: this.ShippingAddress,
        RemitToAddress: this.REMIT_Address,
        PhoneBillingAddress: this.PhoneBillingAddress,
        faxBillingAddress: this.faxBillingAddress,
        ShippingHistory: this.ShippingHistory,
        CONST_AH_Group_ID: this.CONST_AH_Group_ID,
        CustomerRef: this.CustomerRef.length > 0 && !("NoRecord" in this.CustomerRef[0]) ? this.CustomerRef : null,

        InvoiceItem: this.InvoiceItem,
        settingsView: this.settingsView,
        NotesList: this.NotesList,
        RRId: this.RRId,
        Logo: base64
      }

      this.service.postHttpService({ pdfObj }, "autoUploadINVCSV").subscribe(response => {
        if (response.status == true) {
          cb(response.responseData);
          this.spinner.hide();
        }
      });
    })
  }

  afterParentPrintClick() {
    this.hideAddress = true;
  }

  onprint() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    })

  }
  onParentprint() {
    this.onprint()
  }

  reLoad() {
    this.router.navigate([this.currentRouter.split('?')[0]], { queryParams: { ConsolidateInvoiceId: this.ConsolidateInvoiceId } })
    // this.router.navigate([this.currentRouter])
  }
}


