/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, Input, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/core/services/common.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/core/services/excel.service';
import { Invoice_Status, Invoice_Type, terms, VAT_field_Name, Vendorinvoice_notes } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-vendor-invoice',
  templateUrl: './vendor-invoice.component.html',
  styleUrls: ['./vendor-invoice.component.scss'],
  providers: [
    NgxSpinnerService, BsModalRef
  ],
})
export class VendorInvoiceComponent implements OnInit {

  checkedCategoryList: any;
  isMasterSel: boolean;

  @Input() templateSettings: TemplateRef<HTMLElement>;
  @ViewChild('viewTemplate', null) viewTemplate: TemplateRef<HTMLElement>;

  submitted = false;

  dataTableMessage;
  tableData: any = [];
  ref_no;
  TermDisc;
  vendor;
  baseUrl = `${environment.api.apiURL}`;
  VendorInvoiceInfo;
  VendorAddress;
  PhoneVendorAddress;
  faxVendorAddress;
  VendorInvoiceItem: any = []
  Currentdate = new Date();
  //ServerSide List
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  api_check: any;
  dataTable: any;
  @ViewChild('dataTable', { static: true }) table;
  RRId;
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
  AHFees;
  Shipping;
  AdvanceAmount;
  number;
  //Filter
  RRNo;
  VendorInvoiceNo;
  CustomerId;
  PONo;
  VendorInvoiceType='';
  Status='';
  InvoiceDateToDate
  InvoiceDateDate;
  DueDateToDate;
  DueDateDate;
  InvoiceDate;
  InvoiceDateTo;
  DueDateTo;
  DueDate;
  VendorId
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
  enableVendorApproved
  CustomerInvoiceApproved;
  VendorBillApproved;
  VendorInvoiceTypeStyle
  MROId

  IsDisplayBaseCurrencyValue 
  VAT_field_Name
  BaseCurrencySymbol
  constructor(private http: HttpClient, public router: Router, private spinner: NgxSpinnerService, public navCtrl: NgxNavigationWithDataComponent,
    private commonService: CommonService, private cd_ref: ChangeDetectorRef,public modalRef: BsModalRef,private _FileSaverService: FileSaverService, private route: ActivatedRoute) { }
  currentRouter = this.router.url;

  ngOnInit(): void {
    this.IsDisplayBaseCurrencyValue =localStorage.getItem("IsDisplayBaseCurrencyValue")
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")
    this.VAT_field_Name = VAT_field_Name
    this.Invoice_Status = Invoice_Status;
    this.VendorInvoiceInfo = "";
    this.VendorInvoiceItem = [];
    this.NotesList = [];
    this.VendorAddress = "";
    this.getTermList();
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
  
    this.loadTemplate(this.VendorInvoiceId)

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

 


  arrayOne(n: number): any[] {
    return Array(n);
  }
  

  loadTemplate(VendorInvoiceId) {
        this.PartItem = []
        this.spinner.show();
        var postData = {
          VendorInvoiceId: VendorInvoiceId,
        }
        this.commonService.postHttpService(postData, "VendorInvoiceView").subscribe(response => {
          if (response.status == true) {
            this.result = response.responseData;
            this.VendorInvoiceInfo = this.result.VendorInvoiceInfo[0] || "";
            this.VendorInvoiceItem = this.result.VendorInvoiceItem;
            this.VendorAddress = this.result.ContactAddress[0] || ""
            this.Vendorinvoice_notes = Vendorinvoice_notes;
            this.NotesList = this.result.NotesList
            this.faxVendorAddress = this.VendorAddress.Fax
            this.PhoneVendorAddress = this.VendorAddress.PhoneNoPrimary;
            this.RRId = this.VendorInvoiceInfo.RRId;
            this.MROId = this.VendorInvoiceInfo.MROId;
            this.VendorInvoiceTypeStyle = Invoice_Type.find(a => a.Invoice_TypeId == this.VendorInvoiceInfo.VendorInvoiceType)
            this.number = this.VendorInvoiceInfo.VendorInvoiceNo
            // this.IsInvoiceApproved = this.VendorInvoiceInfo.IsInvoiceApproved

            if (this.VendorInvoiceInfo.RRId != 0) {
              this.enableVendorApproved = this.VendorInvoiceInfo.IsInvoiceApproved
            }
            else {
              this.enableVendorApproved = this.VendorInvoiceInfo.IsMROInvoiceApproved
            }
            if (this.VendorInvoiceInfo.TermsName == "Credit Card") {
              this.enableVendorApproved = 1;

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
    this.getPdfBase64((pdfBase64) => {
      let blob = this.commonService.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Vendor Invoice ${this.number}.pdf`);
    })
  }

  generatePrint(){
    this.getPdfBase64((pdfBase64) => {
      let blob = this.commonService.base64ToBlob(pdfBase64, "application/pdf");
    const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    })
  }
  getPdfBase64(cb) {
    this.spinner.show();
    this.commonService.getLogoAsBas64().then((base64) => {
      let pdfObj = {
        VendorInvoiceInfo: this.VendorInvoiceInfo,
        number: this.number,
        VendorAddress: this.VendorAddress,
        VendorInvoiceItem: this.VendorInvoiceItem,
        IsNotesEnabled: '',
        settingsView: '',
        NotesList: this.NotesList,
        RRId: this.RRId,
        Logo: base64
      }

      this.commonService.postHttpService({ pdfObj }, "getVIPdfBase64").subscribe(response => {
        if (response.status == true) {
          cb(response.responseData.pdfBase64);
          this.spinner.hide();
        }
      });
    })
  }

 
  


}
