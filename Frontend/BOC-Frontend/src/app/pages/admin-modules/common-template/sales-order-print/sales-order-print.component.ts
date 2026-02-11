import { ChangeDetectorRef, Component, Inject, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FileSaverService } from 'ngx-filesaver';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { attachment_thumb_images, CONST_COST_HIDE_VALUE, CONST_VIEW_ACCESS, CONST_VIEW_COST_ACCESS, SalesOrder_notes, SalesOrder_Type, Shipping_field_Name, VAT_field_Name, TOTAL_VAT_field_Name } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { BlanketPoNonRrEditComponent } from '../blanket-po-non-rr-edit/blanket-po-non-rr-edit.component';
import { CreatePoInsoComponent } from '../create-po-inso/create-po-inso.component';

@Component({
  selector: 'app-sales-order-print',
  templateUrl: './sales-order-print.component.html',
  styleUrls: ['./sales-order-print.component.scss'],
  providers: [
    NgxSpinnerService, BsModalRef
  ],
})
export class SalesOrderPrintComponent implements OnInit {
  @Input() SOId?: any;
  @Input() IsDeleted: string;
  @Output() closeClicked: EventEmitter<void> = new EventEmitter<void>();
  number;
  PartItem: any = [];
  result;
  AttachmentList: any = []
  SalesOrderInfo;
  BillingAddress;
  ShippingAddress;
  faxBillingAddress;
  faxShippingAddress;
  PhoneBillingAddress;
  PhoneShippingAddress
  SalesOrderCustomerRef: any = [];

  SalesOrderItem: any = [];
  SalesOrderItemEx: any = [];
  NotesList: any = [];
  RRNotesList: any = [];
  IsRushRepair;
  IsWarrantyRecovery;
  repairMessage;
  SOList: any = [];
  SOTypeStyle;
  settingsView;
  TaxPercent;
  SalesOrderType;
  RRId;
  MROId;
  SalesOrder_notes;

  IsViewCostEnabled;
  IsNotesEnabled;
  IsPrintPDFEnabled;
  attachmentThumb;

  showActions: boolean = false;
  showPrint: boolean = false;

  public onPrint: Subject<any>;
  public onEmail: Subject<any>;
  public onEdit: Subject<any>;
  gridCheckAll: boolean = false;
  Selectallenable: boolean = false;
  BlanketPOExcludeAmount
  BlanketPONetAmount
  BaseCurrencySymbol
  IsDisplayBaseCurrencyValue
  VAT_field_Name
  Shipping_field_Name
  InvoiceListArray: any = []
  POListArray: any = []
  showLocation: boolean;
  constructor(
    private spinner: NgxSpinnerService,
    public modalRef: BsModalRef,
    private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent,
    public service: CommonService,
    public router: Router, private CommonmodalService: BsModalService,
    @Inject(BsModalRef) public initialState: any,
    private _FileSaverService: FileSaverService,
  ) { }
  currentRouter = decodeURIComponent(this.router.url);

  ngOnInit(): void {
    this.IsDisplayBaseCurrencyValue = localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol")
    this.VAT_field_Name = TOTAL_VAT_field_Name; // VAT_field_Name
    this.Shipping_field_Name = Shipping_field_Name
    this.getAdminSettingsView();
    this.SalesOrderInfo = ""
    this.SalesOrderItem = [];
    this.SalesOrderItemEx = [];
    this.NotesList = [];
    this.RRNotesList = [];
    this.BillingAddress = "";
    this.ShippingAddress = "";
    this.AttachmentList = [];
    this.SalesOrderCustomerRef = [];
    this.settingsView = "";
    this.SOTypeStyle = "";

    this.SalesOrderType = SalesOrder_Type;
    this.IsViewCostEnabled = this.service.permissionCheck("ManageSalesOrder", CONST_VIEW_COST_ACCESS);
    this.IsNotesEnabled = this.service.permissionCheck("SONotes", CONST_VIEW_ACCESS);
    this.IsPrintPDFEnabled = this.service.permissionCheck("SOPrintAndPDFExport", CONST_VIEW_ACCESS);
    this.attachmentThumb = attachment_thumb_images;
    if (localStorage.getItem('IdentityType') == '0') {
      this.showLocation = true;
    } else {
      this.showLocation = false;
    }

    if (this.initialState && "SOId" in this.initialState) {
      this.onEdit = new Subject();
      this.onPrint = new Subject();
      this.onEmail = new Subject();
      this.SOId = this.initialState.SOId;
      this.IsDeleted = "IsDeleted" in this.initialState ? this.initialState.IsDeleted : 0;
      this.loadTemplate(this.SOId, this.IsDeleted);
      this.showPrint = false;
      this.showActions = true;
    } else {
      this.showPrint = true;
      this.showActions = false;
    }

  }

  ngOnChanges() {
    this.loadTemplate(this.SOId, this.IsDeleted);
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
        var position = 3;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
        pdf.save('sales-order.pdf');
        this.hideAddress = true
      });
    }, 500);
  }

  loadTemplate(SOId, IsDeleted) {
    this.spinner.show();
    this.PartItem = [];
    var postData = {
      SOId: SOId,
      IsDeleted: IsDeleted
    }
    this.service.postHttpService(postData, "getSalesOrderView").subscribe(response => {
      if (response.status == true) {
        this.result = response.responseData;
        this.AttachmentList = this.result.AttachmentList || []
        this.SalesOrderInfo = this.result.SalesOrderInfo[0] || "";
        this.BillingAddress = this.result.BillingAddress[0] || "";
        this.ShippingAddress = this.result.ShippingAddress[0] || "";
        this.NotesList = this.result.NotesList;
        this.RRNotesList = this.result.RRNotesList
        this.SalesOrderItem = this.result.SalesOrderItem
        this.SalesOrderItemEx = this.SalesOrderItem.filter(u => u.IsExcludeFromBlanketPO == '1');
        this.BlanketPOExcludeAmount = this.SalesOrderInfo.BlanketPOExcludeAmount;
        this.BlanketPONetAmount = this.SalesOrderInfo.BlanketPONetAmount;
        // map(a => { 
        //   if(a.POItemId!= 0){
        //   this.Selectallenable=true 
        //   return a; 
        //   }
        // });;
        this.SalesOrderCustomerRef = this.result.CustomerRef.concat(this.result.RRCustomerReference);
        this.faxShippingAddress = this.ShippingAddress.Fax
        this.faxBillingAddress = this.BillingAddress.Fax
        this.IsRushRepair = this.SalesOrderInfo.IsRushRepair
        this.IsWarrantyRecovery = this.SalesOrderInfo.IsWarrantyRecovery
        this.SOTypeStyle = this.SalesOrderType.find(a => a.SalesOrder_TypeId == this.SalesOrderInfo.SOType)

        if (this.SalesOrderInfo.RRId != 0) {
          this.number = this.SalesOrderInfo.RRNo
        }
        else {
          this.number = this.SalesOrderInfo.SONo
        }
        if (this.IsRushRepair == 1) {
          this.repairMessage = "Rush Repair"
        }
        if (this.IsWarrantyRecovery == 1) {
          this.repairMessage = "Warranty Repair"
        }
        if (this.IsWarrantyRecovery == 2) {
          this.repairMessage = "Warranty New"
        }
        if (this.IsRushRepair == 1 && this.IsWarrantyRecovery == 1) {
          this.repairMessage = "Rush Repair, Warranty Repair"
        }
        this.RRId = this.SalesOrderInfo.RRId
        this.MROId = this.SalesOrderInfo.MROId

        this.PhoneShippingAddress = this.ShippingAddress.Phone
        this.PhoneBillingAddress = this.BillingAddress.Phone;
        this.SalesOrder_notes = SalesOrder_notes

        for (let x in this.SalesOrderItem) {
          if (!this.IsViewCostEnabled) {
            this.SalesOrderItem[x].Rate = CONST_COST_HIDE_VALUE;
            this.SalesOrderItem[x].Price = CONST_COST_HIDE_VALUE;
          }
        }
        if (!this.IsViewCostEnabled) {
          this.SalesOrderInfo.SubTotal = CONST_COST_HIDE_VALUE;
          this.SalesOrderInfo.AHFees = CONST_COST_HIDE_VALUE;
          this.SalesOrderInfo.TotalTax = CONST_COST_HIDE_VALUE;
          this.SalesOrderInfo.Discount = CONST_COST_HIDE_VALUE;
          this.SalesOrderInfo.Shipping = CONST_COST_HIDE_VALUE;
          this.SalesOrderInfo.GrandTotal = CONST_COST_HIDE_VALUE;
        }


        this.POListArray = this.result.POList
        this.InvoiceListArray = this.result.InvoiceList

      }
      else {

      }
      this.spinner.hide()
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

  backToRRView() {
    this.router.navigate(['/admin/repair-request/edit'], { state: { RRId: this.SalesOrderInfo.RRId } });
  }
  backToMROView() {
    this.router.navigate(['/admin/mro/edit'], { state: { MROId: this.SalesOrderInfo.MROId } });
  }
  backToInvoiceView() {
    this.router.navigate(['/admin/invoice/list'], { state: { InvoiceId: this.SalesOrderInfo.InvoiceId } });
  }
  onPrintClick() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Sales Order ${this.number}.pdf`);
    })
    // setTimeout(() => { this.onPrint.next(); this.hideAddress = true; });

  }

  onEmailClick() {
    this.getPdfBase64((pdfBase64) => {
      let fileName = `Sales Order ${this.number}.pdf`;
      this.onEmail.next({ path: `data:application/pdf;filename=generated.pdf;base64,${pdfBase64}`, filename: fileName });
    })
  }

  onCloseClick() {
    this.closeClicked.emit();
  }

  onParentPrintClick() {
    // this.hideAddress = false;
    this.getPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Sales Order ${this.number}.pdf`);
    })
  }

  onParentEmailClick(cb: (pdfBase64: string, fileName: string) => void) {

    this.getPdfBase64((pdfBase64) => {
      let fileName = `Sales Order ${this.number}.pdf`;
      cb(pdfBase64, fileName);
    })
  }



  getPdfBase64(cb) {
    this.spinner.show();
    this.service.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        SalesOrderInfo: this.SalesOrderInfo,
        number: this.number,
        repairMessage: this.repairMessage,
        BillingAddress: this.BillingAddress,
        PhoneBillingAddress: this.PhoneBillingAddress,
        faxBillingAddress: this.faxBillingAddress,
        ShippingAddress: this.ShippingAddress,
        SalesOrderCustomerRef: this.SalesOrderCustomerRef,
        SalesOrderItem: this.SalesOrderItem,
        IsNotesEnabled: this.IsNotesEnabled,
        settingsView: this.settingsView,
        NotesList: this.NotesList,
        RRNotesList: this.RRNotesList,
        RRId: this.RRId,
        Logo: base64
      }

      this.service.postHttpService({ pdfObj }, "getSOPdfBase64").subscribe(response => {
        if (response.status == true) {
          cb(response.responseData.pdfBase64);
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


  //CREATE PO From SO
  isAllSelected(event) {
    this.SalesOrderItem.map((item: any) => {
      if (item.POItemId == 0) {
        item.checked = event.target.checked;
      }
    });
  }
  CreatePOItem(event, i) {
    this.SalesOrderItem[i].checked = event.target.checked;
  }
  CreatePO() {
    var SOId = this.SOId
    var PartItem = this.SalesOrderItem.filter(u => u.IsExcludeFromBlanketPO != '1');
    var ExcludedPartItem = this.SalesOrderItemEx
    // var TaxPercent =  this.SalesOrderInfo.TaxPercent
    // var TotalTax =  this.SalesOrderInfo.TotalTax
    // var Discount =  this.SalesOrderInfo.Discount
    // var AHFees = this.SalesOrderInfo.AHFees
    // var Shipping = this.SalesOrderInfo.Shipping
    // TaxPercent,TotalTax,Discount,AHFees,Shipping
    this.modalRef = this.CommonmodalService.show(CreatePoInsoComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,

        initialState: {
          data: { PartItem, SOId, ExcludedPartItem },
          class: 'modal-xl'
        }, class: 'gray modal-xl'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      if (res) {
        this.reLoad();
      }
    });

    // } else {
    //   Swal.fire({
    //     type: 'info',
    //     title: 'Message',
    //     text: 'Please checked the Line Item',
    //     confirmButtonClass: 'btn btn-confirm mt-2',
    //   });

    // }
  }

  reLoad() {
    this.router.navigate([this.currentRouter.split('?')[0]], { queryParams: { SOId: this.SOId } })
    // this.router.navigate([this.currentRouter])
  }

  onUpdateCustomerPONo() {
    if (this.SalesOrderInfo.CustomerBlanketPOId == 0) {
      var ApproveType = "0"
    } else {
      var ApproveType = "1"
    }
    var CustomerBlanketPOId = this.SalesOrderInfo.CustomerBlanketPOId;
    var CustomerPONo = this.SalesOrderInfo.CustomerPONo;
    var RRId = this.RRId;
    var CustomerId = this.SalesOrderInfo.CustomerId;
    var GrandTotal = (this.SalesOrderInfo.GrandTotal).toFixed(2)
    var SOId = this.SOId;
    var MROId = this.SalesOrderInfo.MROId;
    var QuoteId = this.SalesOrderInfo.QuoteId;
    var BlanketPOExcludeAmount = this.SalesOrderInfo.BlanketPOExcludeAmount
    var BlanketPONetAmount = this.SalesOrderInfo.BlanketPONetAmount
    var ExcludedPartLength = this.SalesOrderItemEx.length
    var CurrencySymbol = this.SalesOrderInfo.CurrencySymbol
    var ExchangeRate = this.SalesOrderInfo.ExchangeRate
    var LocalCurrencyCode = this.SalesOrderInfo.LocalCurrencyCode
    var Consolidated = this.SalesOrderInfo.Consolidated
    this.modalRef = this.CommonmodalService.show(BlanketPoNonRrEditComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { MROId, QuoteId, RRId, SOId, CustomerId, GrandTotal, ApproveType, CustomerBlanketPOId, CustomerPONo, BlanketPOExcludeAmount, BlanketPONetAmount, ExcludedPartLength, CurrencySymbol, LocalCurrencyCode, ExchangeRate, Consolidated },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.reLoad();
    });
  }
}