import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  EventEmitter,
  Output
} from "@angular/core";
import html2canvas from "html2canvas";
import { NgxSpinnerService } from "ngx-spinner";
import jspdf from "jspdf";
import { DatePipe } from "@angular/common";
import { CommonService } from "src/app/core/services/common.service";
import {
  attachment_thumb_images,
  CONST_AH_Group_ID,
  CONST_ContactAddressType,
  CONST_COST_HIDE_VALUE,
  CONST_ShipAddressType,
  CONST_VIEW_ACCESS,
  CONST_VIEW_COST_ACCESS,
  PurchaseOrder_notes,
  PurchaseOrder_Type,
  Shipping_field_Name,
  VAT_field_Name,
  TOTAL_VAT_field_Name,
} from "src/assets/data/dropdown";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { Subject } from "rxjs";
import { FileSaverService } from "ngx-filesaver";
import * as printJS from "print-js";
import { Router } from "@angular/router";
import { BsModalRef } from "ngx-bootstrap/modal";
@Component({
  selector: "app-purchase-order-view",
  templateUrl: "./purchase-order-view.component.html",
  styleUrls: ["./purchase-order-view.component.scss"],
  providers: [NgxSpinnerService, DatePipe, BsModalRef],
})
export class PurchaseOrderViewComponent implements OnInit, OnChanges {
  @Input() POId?: any;
  @Input() IsDeleted: string;
  @Output() closeClicked: EventEmitter<void> = new EventEmitter<void>();
  REMIT_Address;

  hideAddress: boolean = true;
  result: any;
  RRnumber;
  POnumber;
  BillName;
  ShipName;
  PurchaseOrderCustomerRef: any = [];
  IsRushRepair: any;
  IsWarrantyRecovery: any;
  PartItem: any[];
  IsViewCostEnabled: any;
  PurchaseOrderInfo: any;
  PurchaseOrderItem: any = [];
  NotesList: any = [];
  RRNotesList: any = [];
  AttachmentList: any = [];
  BillingAddress: any;
  ShippingAddress: any;
  ContactAddress: any;
  RRId: any;
  MROId;
  faxContactAddress: any;
  faxShippingAddress: any;
  faxBillingAddress: any;
  number: any;
  repairMessage: string;
  PhoneContactAddress: any;
  PhoneShippingAddress: any;
  PhoneBillingAddress: any;
  Status: any;
  IsNotesEnabled: boolean;
  settingsView;
  TaxPercent: any;
  attachmentThumb: any;
  IsPrintPDFEnabled: boolean;
  PurchaseOrder_notes: string;

  showActions: boolean = false;

  showPrint: boolean = false;

  public onPrint: Subject<any>;
  public onEmail: Subject<any>;
  public onEdit: Subject<any>;
  POTypeStyle;
  AHAddressList;
  VendorAddress;
  BaseCurrencySymbol;
  IsDisplayBaseCurrencyValue;
  VAT_field_Name;
  Shipping_field_Name;
  constructor(
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private cd_ref: ChangeDetectorRef,
    private router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    @Inject(BsModalRef) public initialState: any,
    private _FileSaverService: FileSaverService
  ) { }

  ngOnInit(): void {
    this.IsDisplayBaseCurrencyValue = localStorage.getItem(
      "IsDisplayBaseCurrencyValue"
    );
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol");
    this.VAT_field_Name = TOTAL_VAT_field_Name; // VAT_field_Name
    this.Shipping_field_Name = Shipping_field_Name;
    this.getAdminSettingsView();
    this.getAhGroupaddress();
    this.NotesList = [];
    this.RRNotesList = [];
    // this.PurchaseOrderInfo = ""
    this.PurchaseOrderItem = [];
    this.BillingAddress = "";
    this.ShippingAddress = "";
    this.ContactAddress = "";
    this.POTypeStyle = "";
    this.AHAddressList = "";
    this.settingsView = "";
    this.VendorAddress = "";
    this.REMIT_Address = "";

    this.PurchaseOrderCustomerRef = [];

    this.attachmentThumb = attachment_thumb_images;
    this.IsViewCostEnabled = this.commonService.permissionCheck(
      "ManagePurchaseOrder",
      CONST_VIEW_COST_ACCESS
    );
    this.IsPrintPDFEnabled = this.commonService.permissionCheck(
      "POPrintAndPDFExport",
      CONST_VIEW_ACCESS
    );
    this.IsNotesEnabled = this.commonService.permissionCheck(
      "PONotes",
      CONST_VIEW_ACCESS
    );

    if (this.initialState && "POId" in this.initialState) {
      this.onEdit = new Subject();
      this.onPrint = new Subject();
      this.onEmail = new Subject();
      this.POId = this.initialState.POId;
      this.IsDeleted =
        "IsDeleted" in this.initialState ? this.initialState.IsDeleted : 0;

      this.loadTemplate(this.POId, this.IsDeleted);
      this.showPrint = false;
      this.showActions = true;
    } else {
      this.showPrint = true;
      this.showActions = false;
    }
  }
  getVendoraddress() {
    var postData = {
      IdentityId: this.PurchaseOrderInfo.VendorId,
      IdentityType: 2,
      Type: CONST_ShipAddressType,
    };
    this.commonService
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.VendorAddress = response.responseData[0];
      });
  }
  getAhGroupaddress() {
    var postData = {
      IdentityId: CONST_AH_Group_ID,
      IdentityType: 2,
      Type: CONST_ContactAddressType,
    };
    this.commonService
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.AHAddressList = response.responseData[0];
      });
  }
  backToRRView() {
    this.router.navigate(["/admin/repair-request/edit"], {
      state: { RRId: this.PurchaseOrderInfo.RRId },
    });
  }

  ngOnChanges() {
    // create header using child_id
    this.loadTemplate(this.POId, this.IsDeleted);
  }

  editPO() {
    this.onEdit.next();
  }

  loadTemplate(POId, IsDeleted) {
    this.spinner.show();

    this.PartItem = [];
    var postData = {
      POId: POId,
      IsDeleted: IsDeleted,
    };
    this.commonService
      .postHttpService(postData, "getPuchaseOrderView")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.result = response.responseData;
            this.AttachmentList = this.result.AttachmentList || [];
            this.PurchaseOrderInfo = this.result.POInfo;
            this.PurchaseOrderItem = this.result.POItem;
            this.NotesList = this.result.NotesList;
            this.RRNotesList = this.result.RRNotesList;
            this.BillingAddress = this.result.BillingAddress[0] || "";
            this.ShippingAddress = this.result.ShippingAddress[0] || "";
            this.ContactAddress = this.result.ContactAddress[0] || "";
            this.PurchaseOrderCustomerRef = this.result.CustomerRef;
            this.RRId = this.PurchaseOrderInfo.RRId;
            this.MROId = this.PurchaseOrderInfo.MROId;
            this.REMIT_Address = this.result.RemitAddress[0];
            this.faxContactAddress = this.ContactAddress.Fax;
            this.faxShippingAddress = this.ShippingAddress.Fax;
            this.faxBillingAddress = this.BillingAddress.Fax;
            this.IsRushRepair = this.PurchaseOrderInfo.IsRushRepair;
            this.IsWarrantyRecovery = this.PurchaseOrderInfo.IsWarrantyRecovery;
            this.getVendoraddress();
            if (this.PurchaseOrderInfo.RRId != 0) {
              this.number = this.PurchaseOrderInfo.RRNo;
              this.RRnumber = this.PurchaseOrderInfo.RRNo;
            } else {
              this.number = this.PurchaseOrderInfo.PONo;
              this.POnumber = this.PurchaseOrderInfo.PONo;
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
            this.PhoneContactAddress = this.ContactAddress.PhoneNoPrimary;
            this.PhoneShippingAddress = this.ShippingAddress.PhoneNoPrimary;
            this.PhoneBillingAddress = this.BillingAddress.PhoneNoPrimary;
            this.Status = this.PurchaseOrderInfo.Status;
            this.PurchaseOrder_notes = PurchaseOrder_notes;
            this.POTypeStyle = PurchaseOrder_Type.find(
              (a) => a.PurchaseOrder_TypeId == this.PurchaseOrderInfo.POType
            );

            for (let x in this.PurchaseOrderItem) {
              if (!this.IsViewCostEnabled) {
                this.PurchaseOrderItem[x].Rate = CONST_COST_HIDE_VALUE;
                this.PurchaseOrderItem[x].Price = CONST_COST_HIDE_VALUE;
              }
            }
            if (!this.IsViewCostEnabled) {
              this.PurchaseOrderInfo.SubTotal = CONST_COST_HIDE_VALUE;
              this.PurchaseOrderInfo.AHFees = CONST_COST_HIDE_VALUE;
              this.PurchaseOrderInfo.TotalTax = CONST_COST_HIDE_VALUE;
              this.PurchaseOrderInfo.Discount = CONST_COST_HIDE_VALUE;
              this.PurchaseOrderInfo.Shipping = CONST_COST_HIDE_VALUE;
              this.PurchaseOrderInfo.GrandTotal = CONST_COST_HIDE_VALUE;
            }

            if (
              this.BillingAddress.IdentityId == this.PurchaseOrderInfo.VendorId
            ) {
              this.BillName = this.PurchaseOrderInfo.VendorName;
            } else if (
              this.BillingAddress.IdentityId ==
              this.PurchaseOrderInfo.CustomerId
            ) {
              this.BillName = this.PurchaseOrderInfo.CompanyName;
            } else if (this.BillingAddress.IdentityId == CONST_AH_Group_ID) {
              this.BillName = "Aibond";
            }

            if (
              this.ShippingAddress.IdentityId == this.PurchaseOrderInfo.VendorId
            ) {
              this.ShipName = this.PurchaseOrderInfo.VendorName;
            } else if (
              this.ShippingAddress.IdentityId ==
              this.PurchaseOrderInfo.CustomerId
            ) {
              this.ShipName = this.PurchaseOrderInfo.CompanyName;
            } else if (this.ShippingAddress.IdentityId == CONST_AH_Group_ID) {
              this.ShipName = "Aibond";
            }
            // console.log("result", this.result)
          } else {
          }
          this.cd_ref.detectChanges();
          this.spinner.hide();

          // if (this.initialState) {
          //   this.onPrint.next(true);
          // }
        },
        (error) => console.log(error)
      );
  }
  backToMROView() {
    this.router.navigate(["/admin/mro/edit"], {
      state: { MROId: this.PurchaseOrderInfo.MROId },
    });
  }

  getAdminSettingsView() {
    var postData = {};
    this.commonService
      .postHttpService(postData, "getSettingsGeneralView")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.settingsView = response.responseData;
            this.TaxPercent = this.settingsView.TaxPercent;
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log("issue here")
      );
  }

  generatePDF() {
    var data = document.getElementById("contentToConvert");
    this.hideAddress = false;
    setTimeout(() => {
      html2canvas(data).then((canvas) => {
        var imgWidth = 208;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL("image/png");
        let pdf = new jspdf("p", "mm", "a4");

        var position = 10;
        pdf.addImage(
          contentDataURL,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );

        let base64PDF = pdf.output("datauristring");
        pdf.save("purchase-order.pdf");
        this.hideAddress = true;
      });
    }, 500);
  }

  onPrintClick() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.commonService.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Purchase Order ${this.number}.pdf`);
    });
    // setTimeout(() => { this.onPrint.next(); this.hideAddress = true; });
  }

  onEmailClick() {
    this.getPdfBase64((pdfBase64) => {
      let fileName = `Purchase Order ${this.number}.pdf`;
      this.onEmail.next({
        path: `data:application/pdf;filename=generated.pdf;base64,${pdfBase64}`,
        filename: fileName,
      });
    });
  }

  onCloseClick() {
    this.closeClicked.emit();
  }

  onParentEmailClick(cb: (pdfBase64: string, fileName: string) => void) {
    // this.hideAddress = false;
    // setTimeout(() => { this.onEmail.next(); this.hideAddress = true; });

    this.getPdfBase64((pdfBase64) => {
      let fileName = `Purchase Order ${this.number}.pdf`;
      cb(pdfBase64, fileName);
    });
  }

  onParentPrintClick() {
    // this.hideAddress = false;
    this.getPdfBase64((pdfBase64) => {
      let blob = this.commonService.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Purchase Order ${this.number}.pdf`);
    });
  }
  onParentPrintClickForWithoutTax() {
    this.getWithoutTaxPdfBase64((pdfBase64) => {
      let blob = this.commonService.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Purchase Order ${this.number}.pdf`);
    });
  }

  onParentPrintPdfClick() {
    this.getPdfBase64((pdfBase64) => {
      printJS({
        printable: `${pdfBase64}`,
        type: "pdf",
        showModal: true,
      });
    });
  }

  getPdfBase64(cb) {
    this.spinner.show();
    this.commonService.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        PurchaseOrderInfo: this.PurchaseOrderInfo,
        VendorAddress: this.VendorAddress,
        RemitToAddress: this.REMIT_Address,
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
        Logo: base64,
      };

      this.commonService
        .postHttpService({ pdfObj }, "getPOPdfBase64")
        .subscribe((response) => {
          if (response.status == true) {
            cb(response.responseData.pdfBase64);
            this.spinner.hide();
          }
        });
    });
  }

  getWithoutTaxPdfBase64(cb) {
    this.spinner.show();
    this.commonService.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        PurchaseOrderInfo: this.PurchaseOrderInfo,
        VendorAddress: this.VendorAddress,
        RemitToAddress: this.REMIT_Address,
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
        Logo: base64,
      };

      this.commonService
        .postHttpService({ pdfObj }, "getPOPdfWithoutTaxBase64")
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
  onprint() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.commonService.base64ToBlob(pdfBase64, "application/pdf");
      const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    });
  }
  onParentprint() {
    this.onprint();
  }
}