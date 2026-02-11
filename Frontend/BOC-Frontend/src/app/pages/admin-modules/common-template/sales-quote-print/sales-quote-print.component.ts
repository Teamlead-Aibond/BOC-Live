import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  EventEmitter,
  Output
} from "@angular/core";
import { Router } from "@angular/router";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import { BsModalRef } from "ngx-bootstrap";
import { FileSaverService } from "ngx-filesaver";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { NgxSpinnerService } from "ngx-spinner";
import { Subject } from "rxjs";
import { CommonService } from "src/app/core/services/common.service";
import {
  Const_AHGroupWebsite,
  CONST_AH_Group_ID,
  CONST_ContactAddressType,
  CONST_COST_HIDE_VALUE,
  CONST_VIEW_ACCESS,
  CONST_VIEW_COST_ACCESS,
  Quote_notes,
  Quote_type,
  Shipping_field_Name,
  VAT_field_Name,
  TOTAL_VAT_field_Name,
} from "src/assets/data/dropdown";
@Component({
  selector: "app-sales-quote-print",
  templateUrl: "./sales-quote-print.component.html",
  styleUrls: ["./sales-quote-print.component.scss"],
  providers: [NgxSpinnerService, BsModalRef],
})
export class SalesQuotePrintComponent implements OnInit, OnChanges {
  @Input() QuoteId?: any;
  @Input() IsDeleted: string;
  @Output() closeClicked: EventEmitter<void> = new EventEmitter<void>();
  result;
  SalesQuoteInfo;
  QuoteItem: any = [];
  NotesList: any = [];
  RRNotesList: any = [];
  TermsName;
  AHAddressList;
  AHGroupWebsite;
  AttachmentList: any = [];
  ShippingAddress;
  BillingAddress;
  CustomerAddress;
  RRId;
  faxCustomerAddress;
  faxBillingAddress;
  faxShippingAddress;
  PhoneCustomerAddress;
  PhoneBillingAddress;
  PhoneShippingAddress;
  IsRushRepair;
  IsWarrantyRecovery;
  QuoteTypeStyle;
  RRnumber;
  QTnumber;
  number;
  QuoteTypeList;
  repairMessage;
  Quote_notes;
  CustomerBillToId;
  CustomerShipToId;
  SalesQuotesCustomerRef: any = [];
  IsSOViewCostEnabled: boolean;
  PartId: any;
  IsSONotesEnabled: boolean;
  settingsView: any;
  TaxPercent: any;
  REMIT_Address;
  RemitToAddress;
  BaseCurrencySymbol;
  showActions: boolean = false;
  IsDisplayBaseCurrencyValue;
  VAT_field_Name;
  Shipping_field_Name;
  showPrint: boolean = false;
  BillName;
  ShipName;
  public onPrint: Subject<any>;
  public onEmail: Subject<any>;
  public onEdit: Subject<any>;
  constructor(
    private spinner: NgxSpinnerService,
    public service: CommonService,
    private router: Router,
    private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent,
    @Inject(BsModalRef) public initialState: any,
    private _FileSaverService: FileSaverService
  ) { }

  ngOnInit(): void {
    this.IsDisplayBaseCurrencyValue = localStorage.getItem(
      "IsDisplayBaseCurrencyValue"
    );
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol");
    this.Shipping_field_Name = Shipping_field_Name;
    this.VAT_field_Name = TOTAL_VAT_field_Name; // VAT_field_Name
    this.getAHGroupaddress();
    this.getAdminSettingsView();
    this.AHGroupWebsite = Const_AHGroupWebsite;
    this.SalesQuoteInfo = "";
    this.QuoteTypeStyle = "";
    this.AHAddressList = "";
    this.settingsView = "";
    this.REMIT_Address = "";
    this.QuoteTypeList = Quote_type;
    this.IsSOViewCostEnabled = this.service.permissionCheck(
      "ManageSalesQuotes",
      CONST_VIEW_COST_ACCESS
    );
    this.IsSONotesEnabled = this.service.permissionCheck(
      "SalesQuoteNotes",
      CONST_VIEW_ACCESS
    );

    if (this.initialState && "QuoteId" in this.initialState) {
      this.onEdit = new Subject();
      this.onPrint = new Subject();
      this.onEmail = new Subject();
      this.QuoteId = this.initialState.QuoteId;
      this.IsDeleted =
        "IsDeleted" in this.initialState ? this.initialState.IsDeleted : 0;
      this.loadTemplate(this.QuoteId, this.IsDeleted);
      this.showPrint = false;
      this.showActions = true;
    } else {
      this.showActions = false;
    }
  }

  ngOnChanges() {
    // create header using child_id
    this.loadTemplate(this.QuoteId, this.IsDeleted);
  }

  getAHGroupaddress() {
    var postData = {
      IdentityId: CONST_AH_Group_ID,
      IdentityType: 2,
      Type: CONST_ContactAddressType,
    };
    this.service
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.AHAddressList = response.responseData[0];
      });
  }

  getAdminSettingsView() {
    var postData = {};
    this.service.postHttpService(postData, "getSettingsGeneralView").subscribe(
      (response) => {
        if (response.status == true) {
          this.settingsView = response.responseData;
          this.TaxPercent = this.settingsView.TaxPercent;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  loadTemplate(QuoteId, IsDeleted) {
    this.spinner.show();

    this.TermsName = "";
    var postData = {
      QuoteId: QuoteId,
      IsDeleted: IsDeleted,
    };

    this.service.postHttpService(postData, "getSalesQuotesView").subscribe(
      (response) => {
        if (response.status == true) {
          this.result = response.responseData;
          this.SalesQuoteInfo = this.result.BasicInfo[0];
          this.QuoteItem = this.result.QuoteItem.map((a) => {
            a.CurrencySymbol = this.SalesQuoteInfo.CurrencySymbol;
            return a;
          });
          this.TermsName = this.SalesQuoteInfo.Terms;
          this.AttachmentList = this.result.AttachmentList;
          this.BillingAddress = this.result.BillingAddress[0] || "";
          this.ShippingAddress = this.result.ShippingAddress[0] || "";
          this.CustomerAddress = this.result.ContactAddress[0] || "";
          this.NotesList = this.result.NotesList;
          this.RRNotesList = this.result.RRNotesList;
          this.RRId = this.SalesQuoteInfo.RRId;
          this.faxCustomerAddress = this.CustomerAddress.Fax;
          this.faxShippingAddress = this.ShippingAddress.Fax;
          this.faxBillingAddress = this.BillingAddress.Fax;
          this.IsRushRepair = this.SalesQuoteInfo.IsRushRepair;
          this.IsWarrantyRecovery = this.SalesQuoteInfo.IsWarrantyRecovery;
          this.REMIT_Address = this.result.RemitToAddress;
          this.RemitToAddress = this.result.RemitToAddress;
          this.QuoteTypeStyle = this.QuoteTypeList.find(
            (a) => a.Quote_TypeId == this.SalesQuoteInfo.QuoteType
          );
          if (this.REMIT_Address && this.REMIT_Address.EntityWebsite != "") {
            this.AHGroupWebsite = this.REMIT_Address.EntityWebsite;
          }

          if (this.SalesQuoteInfo.RRId != 0) {
            this.RRnumber = this.SalesQuoteInfo.RRNo;
            this.number = this.SalesQuoteInfo.RRNo;
          } else {
            this.QTnumber = this.SalesQuoteInfo.QuoteNo;
            this.number = this.SalesQuoteInfo.QuoteNo;
          }
          if (this.IsRushRepair == 1) {
            this.repairMessage = "Rush Repair";
          }
          if (this.IsWarrantyRecovery == 1) {
            this.repairMessage = "Warranty Repair";
          }
          if (this.IsWarrantyRecovery == 2) {
            this.repairMessage = "Warranty New";
          }
          if (this.IsRushRepair == 1 && this.IsWarrantyRecovery == 1) {
            this.repairMessage = "Rush Repair, Warranty Repair";
          }

          this.PhoneCustomerAddress = this.CustomerAddress.Phone;
          this.PhoneShippingAddress = this.ShippingAddress.Phone;
          this.PhoneBillingAddress = this.BillingAddress.Phone;
          this.Quote_notes = Quote_notes;
          this.CustomerBillToId = this.SalesQuoteInfo.CustomerBillToId;
          this.CustomerShipToId = this.SalesQuoteInfo.CustomerShipToId;
          this.SalesQuotesCustomerRef = this.result.CustomerReference || [];

          if (!this.IsSOViewCostEnabled) {
            this.SalesQuoteInfo.TotalValue = CONST_COST_HIDE_VALUE;
            this.SalesQuoteInfo.ProcessFee = CONST_COST_HIDE_VALUE;
            this.SalesQuoteInfo.TotalTax = CONST_COST_HIDE_VALUE;
            this.SalesQuoteInfo.Discount = CONST_COST_HIDE_VALUE;
            this.SalesQuoteInfo.ShippingFee = CONST_COST_HIDE_VALUE;
            this.SalesQuoteInfo.GrandTotal = CONST_COST_HIDE_VALUE;
          }
          if (this.BillingAddress.IdentityId == this.SalesQuoteInfo.VendorId) {
            this.BillName = this.SalesQuoteInfo.VendorName;
          } else if (this.BillingAddress.IdentityType == "Customer") {
            this.BillName = this.SalesQuoteInfo.CompanyName;
          } else if (this.BillingAddress.IdentityId == CONST_AH_Group_ID) {
            this.BillName = "Aibond";
          }

          if (this.ShippingAddress.IdentityId == this.SalesQuoteInfo.VendorId) {
            this.ShipName = this.SalesQuoteInfo.VendorName;
          } else if (this.ShippingAddress.IdentityType == "Customer") {
            this.ShipName = this.SalesQuoteInfo.CompanyName;
          } else if (this.ShippingAddress.IdentityId == CONST_AH_Group_ID) {
            this.ShipName = "Aibond";
          }
          this.getPON();
        } else {
        }
        this.cd_ref.detectChanges();
        this.spinner.hide();
      },
      (error) => console.log(error)
    );
  }

  getPON() {
    for (let x in this.QuoteItem) {
      if (!this.IsSOViewCostEnabled) {
        this.QuoteItem[x].Rate = CONST_COST_HIDE_VALUE;
        this.QuoteItem[x].Price = CONST_COST_HIDE_VALUE;
      }

      this.PartId = this.QuoteItem[x].PartId;
      var postData1 = {
        PartId: this.PartId,
        CustomerId: this.SalesQuoteInfo.IdentityId,
      };
      this.service
        .postHttpService(postData1, "getPON&LPP")
        .subscribe((response) => {
          if (response.status == true) {
            this.QuoteItem[x].PON = response.responseData.PartInfo.PON || "";
            this.QuoteItem[x].LPPList = response.responseData.LPPInfo || [];
            this.QuoteItem[x].RecommendedPrice =
              response.responseData.RecommendedPrice.RecommendedPrice || "";
          } else {
            this.QuoteItem[x].PON = "";
            this.QuoteItem[x].LPPList = [];
            this.QuoteItem[x].RecommendedPrice = "";
          }
        });
    }
  }

  backToRRView() {
    this.router.navigate(["/admin/repair-request/edit"], {
      state: { RRId: this.SalesQuoteInfo.RRId },
    });
  }

  backToMROView() {
    this.router.navigate(["/admin/mro/edit"], {
      state: { MROId: this.SalesQuoteInfo.MROId },
    });
  }

  hideAddress: boolean = true;

  editPO() {
    this.onEdit.next();
  }

  onPrintClick() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Sales Quote ${this.number}.pdf`);
    });
    // setTimeout(() => { this.onPrint.next(); this.hideAddress = true; });
  }
  onprint() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    });
  }
  onEmailClick() {
    this.getPdfBase64((pdfBase64) => {
      let fileName = `Repair Quote ${this.number}.pdf`;
      this.onEmail.next({
        path: `data:application/pdf;filename=generated.pdf;base64,${pdfBase64}`,
        filename: fileName,
      });
    });
  }
  onCloseClick() {
    this.closeClicked.emit();
  }
  onParentPrintClick() {
    // this.hideAddress = false;
    this.getPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Sales Quote ${this.number}.pdf`);
    });
  }

  onParentEmailClick(cb: (pdfBase64: string, fileName: string) => void) {
    this.getPdfBase64((pdfBase64) => {
      let fileName = `Sales Quote ${this.number}.pdf`;
      cb(pdfBase64, fileName);
    });
  }

  getPdfBase64(cb) {
    this.spinner.show();
    this.service.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        SalesQuoteInfo: this.SalesQuoteInfo,
        AHAddressList: this.AHAddressList,
        RRnumber: this.RRnumber,
        QTnumber: this.QTnumber,
        BillName: this.BillName,
        BillingAddress: this.BillingAddress,
        ShipName: this.ShipName,
        ShippingAddress: this.ShippingAddress,
        SalesQuotesCustomerRef: this.SalesQuotesCustomerRef,
        QuoteItem: this.QuoteItem,
        IsSONotesEnabled: this.IsSONotesEnabled,
        settingsView: this.settingsView,
        NotesList: this.NotesList,
        RRNotesList: this.RRNotesList,
        RemitToAddress: this.RemitToAddress,
        AHGroupWebsite: this.AHGroupWebsite,
        RRId: this.RRId,
        Logo: base64,
      };

      this.service
        .postHttpService({ pdfObj }, "getSQPdfBase64")
        .subscribe((response) => {
          if (response.status == true) {
            cb(response.responseData.pdfBase64);
            this.spinner.hide();
          }
        });
    });
  }

  afterParentPrintClick() {
    this.hideAddress = true;
  }

  onParentprint() {
    this.onprint();
  }
}