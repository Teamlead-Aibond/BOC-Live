import { ChangeDetectorRef, Component, Inject, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { CommonService } from 'src/app/core/services/common.service';
import { CONST_AH_Group_ID, CONST_COST_HIDE_VALUE, CONST_MODIFY_ACCESS, CONST_VIEW_ACCESS, CONST_VIEW_COST_ACCESS, EDI_status, invoice_notes, Invoice_Type, Shipping_field_Name, VAT_field_Name, TOTAL_VAT_field_Name } from 'src/assets/data/dropdown';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Subject } from 'rxjs';
import { FileSaverService } from 'ngx-filesaver';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BlanketPoInvoiceEditComponent } from '../blanket-po-invoice-edit/blanket-po-invoice-edit.component';

@Component({
  selector: 'app-invoice-print',
  templateUrl: './invoice-print.component.html',
  styleUrls: ['./invoice-print.component.scss'],
  providers: [
    NgxSpinnerService, BsModalRef
  ],
})
export class InvoicePrintComponent implements OnInit {
  @Input() InvoiceId?: any;
  @Input() IsDeleted: string;
  @Output() closeClicked: EventEmitter<void> = new EventEmitter<void>();
  VendorPOCost
  VendorPOCost1
  StatusName
  EditStatusList: any = []
  REMIT_Address
  constructor(
    private spinner: NgxSpinnerService,
    private service: CommonService,
    private cd_ref: ChangeDetectorRef, public modalRef: BsModalRef,
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
  RemitToAddress;
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
  IsEmailEnabled;
  IsViewCostEnabled;
  IsNotesEnabled;
  IsPrintPDFEnabled;

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
    this.VAT_field_Name = TOTAL_VAT_field_Name; //VAT_field_Name
    this.Shipping_field_Name = Shipping_field_Name
    this.getAdminSettingsView();
    this.settingsView = ""
    this.NotesList = [];
    this.InvoiceTypeStyle = ""
    this.InvoiceInfo = "";
    this.BillingAddress = "";
    this.RemitToAddress = "";
    this.AH_Address = ''
    this.REMIT_Address = ''
    this.ShippingAddress = "";

    this.IsEditEnabled = this.service.permissionCheck("ManageInvoice", CONST_MODIFY_ACCESS);
    this.IsEmailEnabled = this.service.permissionCheck("INVEmail", CONST_VIEW_ACCESS);
    this.IsViewCostEnabled = this.service.permissionCheck("ManageInvoice", CONST_VIEW_COST_ACCESS);
    this.IsNotesEnabled = this.service.permissionCheck("INVNotes", CONST_VIEW_ACCESS);
    this.IsPrintPDFEnabled = this.service.permissionCheck("INVPrintAndPDFExport", CONST_VIEW_ACCESS);

    if (this.initialState && "InvoiceId" in this.initialState) {
      this.onEdit = new Subject();
      this.onPrint = new Subject();
      this.onEmail = new Subject();
      this.InvoiceId = this.initialState.InvoiceId;
      this.IsDeleted = "IsDeleted" in this.initialState ? this.initialState.IsDeleted : 0;
      this.loadTemplate(this.InvoiceId, this.IsDeleted);
      this.showPrint = false;
      this.showActions = true;
    } else {
      this.showPrint = true;
      this.showActions = false;
    }
  }

  ngOnChanges() {
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

  loadTemplate(InvoiceId, IsDeleted) {
    this.ShippingHistory = ""

    this.spinner.show();

    var postData = {
      InvoiceId: InvoiceId,
      IsDeleted: IsDeleted
    }
    this.service.postHttpService(postData, "getInvoiceView").subscribe(response => {
      if (response.status == true) {
        // console.log(response.responseData)
        this.result = response.responseData;
        this.InvoiceInfo = this.result.InvoiceInfo[0] || "";
        this.NotesList = this.result.NotesList;
        this.BillingAddress = this.result.BillingAddressInfo[0] || "";
        this.ShippingAddress = this.result.ShippingAddressInfo[0] || "";
        this.RemitToAddress = this.result.RemitToAddress || "";
        this.ContactAddress = this.result.ContactAddressInfo[0] || "";
        this.InvoiceItem = this.result.InvoiceItem;
        this.EditStatusList = this.result.EdiStatusList
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
        this.AH_Address = this.result.AHBillingAddress[0]
        this.REMIT_Address = this.result.RemitToAddress
        this.invoice_notes = invoice_notes;
        this.InvoiceTypeStyle = Invoice_Type.find(a => a.Invoice_TypeId == this.InvoiceInfo.InvoiceType)


        if (this.InvoiceInfo.RRId != 0) {
          this.number = this.InvoiceInfo.RRNo
        }
        else {
          this.number = this.InvoiceInfo.InvoiceNo
        }

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
        this.InvoiceItemEx = this.InvoiceItem.filter(u => u.IsExcludeFromBlanketPO == '1');
        this.BlanketPOExcludeAmount = this.InvoiceInfo.BlanketPOExcludeAmount;
        this.BlanketPONetAmount = this.InvoiceInfo.BlanketPONetAmount;
        this.VendorPOCost = this.result.VendorPOCost.VendorPOCost ? this.result.VendorPOCost.VendorPOCost : ''
        this.VendorPOCost1 = this.result.VendorPOCost.VendorPOCost1 ? this.result.VendorPOCost.VendorPOCost1 : ''
        this.CurrencySymbol1 = this.result.VendorPOCost.CurrencySymbol ? this.result.VendorPOCost.CurrencySymbol : ''
        this.CurrencySymbolNormal = this.result.VendorPOCost.CurrencySymbol1 ? this.result.VendorPOCost.CurrencySymbol1 : ''
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
      this._FileSaverService.save(blob, `Invoice ${this.InvoiceInfo.InvoiceNo}.pdf`);
    })
    // setTimeout(() => { this.onPrint.next(); this.hideAddress = true; });

  }

  onEmailClick() {
    this.getPdfBase64((pdfBase64) => {
      let fileName = `Invoice ${this.InvoiceInfo.InvoiceNo}.pdf`;
      this.onEmail.next({ path: `data:application/pdf;filename=generated.pdf;base64,${pdfBase64}`, filename: fileName });
    })

  }

  onCloseClick() {
    this.closeClicked.emit();
  }

  onParentEmailClick(cb: (pdfBase64: string, fileName: string) => void) {

    this.getPdfBase64((pdfBase64) => {
      let fileName = `Invoice ${this.InvoiceInfo.InvoiceNo}.pdf`;
      cb(pdfBase64, fileName);
    })
  }

  onParentPrintClick() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Invoice ${this.InvoiceInfo.InvoiceNo}.pdf`);
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
        RemitToAddress: this.RemitToAddress,
        ShippingAddress: this.ShippingAddress,
        PhoneBillingAddress: this.PhoneBillingAddress,
        faxBillingAddress: this.faxBillingAddress,
        ShippingHistory: this.ShippingHistory,
        CONST_AH_Group_ID: this.CONST_AH_Group_ID,
        CustomerRef: this.CustomerRef.length > 0 && !("NoRecord" in this.CustomerRef[0]) ? this.CustomerRef : null,

        InvoiceItem: this.InvoiceItem,
        IsNotesEnabled: this.IsNotesEnabled,
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

  onParentWithoutTaxPrintClick() {
    this.getWithoutTaxPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Invoice ${this.InvoiceInfo.InvoiceNo}.pdf`);
    })
  }

  getWithoutTaxPdfBase64(cb) {
    this.spinner.show();
    this.service.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        AHBillingAddress: this.AH_Address,
        InvoiceInfo: this.InvoiceInfo,
        number: this.number,
        BillingAddress: this.BillingAddress,
        RemitToAddress: this.RemitToAddress,
        ShippingAddress: this.ShippingAddress,
        PhoneBillingAddress: this.PhoneBillingAddress,
        faxBillingAddress: this.faxBillingAddress,
        ShippingHistory: this.ShippingHistory,
        CONST_AH_Group_ID: this.CONST_AH_Group_ID,
        CustomerRef: this.CustomerRef.length > 0 && !("NoRecord" in this.CustomerRef[0]) ? this.CustomerRef : null,

        InvoiceItem: this.InvoiceItem,
        IsNotesEnabled: this.IsNotesEnabled,
        settingsView: this.settingsView,
        NotesList: this.NotesList,
        RRId: this.RRId,
        Logo: base64
      }

      this.service.postHttpService({ pdfObj }, "getWithoutTaxPdfBase64").subscribe(response => {
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
        RemitToAddress: this.RemitToAddress,
        ShippingAddress: this.ShippingAddress,
        PhoneBillingAddress: this.PhoneBillingAddress,
        faxBillingAddress: this.faxBillingAddress,
        ShippingHistory: this.ShippingHistory,
        CONST_AH_Group_ID: this.CONST_AH_Group_ID,
        CustomerRef: this.CustomerRef.length > 0 && !("NoRecord" in this.CustomerRef[0]) ? this.CustomerRef : null,

        InvoiceItem: this.InvoiceItem,
        IsNotesEnabled: this.IsNotesEnabled,
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
        RemitToAddress: this.RemitToAddress,
        ShippingAddress: this.ShippingAddress,
        PhoneBillingAddress: this.PhoneBillingAddress,
        faxBillingAddress: this.faxBillingAddress,
        ShippingHistory: this.ShippingHistory,
        CONST_AH_Group_ID: this.CONST_AH_Group_ID,
        CustomerRef: this.CustomerRef.length > 0 && !("NoRecord" in this.CustomerRef[0]) ? this.CustomerRef : null,

        InvoiceItem: this.InvoiceItem,
        IsNotesEnabled: this.IsNotesEnabled,
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
    this.router.navigate([this.currentRouter.split('?')[0]], { queryParams: { InvoiceId: this.InvoiceId } })
    // this.router.navigate([this.currentRouter])
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
    var ExcludedPartLength = this.InvoiceItemEx.length
    var CurrencySymbol = this.InvoiceInfo.CurrencySymbol
    var ExchangeRate = this.InvoiceInfo.ExchangeRate
    var LocalCurrencyCode = this.InvoiceInfo.LocalCurrencyCode
    var Consolidated = this.InvoiceInfo.Consolidated
    this.modalRef = this.CommonmodalService.show(BlanketPoInvoiceEditComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { MROId, RRId, InvoiceId, CustomerId, GrandTotal, ApproveType, CustomerBlanketPOId, CustomerPONo, BlanketPOExcludeAmount, BlanketPONetAmount, ExcludedPartLength, CurrencySymbol, LocalCurrencyCode, ExchangeRate, Consolidated },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.reLoad();
    });
  }

  GetClassStatusName(Status) {
    var className = ""
    var StatusStyle = EDI_status.find(a => a.id == Status)
    this.StatusName = (StatusStyle ? StatusStyle.title : '')
    className = `badge ' ${(StatusStyle ? StatusStyle.cstyle : '')}  ' btn-xs`
    return className;
  }
}