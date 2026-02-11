/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import { DatePipe } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FileSaverService } from "ngx-filesaver";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { CommonService } from "src/app/core/services/common.service";
import {
  array_MRO_status,
  CONST_AH_Group_ID,
  CONST_BillAddressType,
  CONST_ContactAddressType,
  CONST_COST_HIDE_VALUE,
  CONST_IDENTITY_TYPE_MRO,
  CONST_ShipAddressType,
  CONST_VIEW_ACCESS,
  CONST_VIEW_COST_ACCESS,
  Quote_notes,
  Quote_type,
  Shipping_field_Name,
  VAT_field_Name,
  CONST_MODIFY_ACCESS,
} from "src/assets/data/dropdown";
import Swal from "sweetalert2";
import { AddNotesComponent } from "../../common-template/add-notes/add-notes.component";
import { BalnketPoMroComponent } from "../../common-template/balnket-po-mro/balnket-po-mro.component";
import { CreateMroPoComponent } from "../../common-template/create-mro-po/create-mro-po.component";
import { CreateMroSoComponent } from "../../common-template/create-mro-so/create-mro-so.component";
import { EditNotesComponent } from "../../common-template/edit-notes/edit-notes.component";
import { MroCurrentHistoryComponent } from "../../common-template/mro-current-history/mro-current-history.component";
import { MroCustomerQuoteComponent } from "../../common-template/mro-customer-quote/mro-customer-quote.component";
import { MroReceiveComponent } from "../../common-template/mro-receive/mro-receive.component";
import { MroShipReceiveComponent } from "../../common-template/mro-ship-receive/mro-ship-receive.component";
import { MroShipComponent } from "../../common-template/mro-ship/mro-ship.component";
import { MroShippingHistoryComponent } from "../../common-template/mro-shipping-history/mro-shipping-history.component";
import { MroVendorInvoiceComponent } from "../../common-template/mro-vendor-invoice/mro-vendor-invoice.component";
import { RejectedMroComponent } from "../../common-template/rejected-mro/rejected-mro.component";
import { RRAddAttachmentComponent } from "../../common-template/rr-add-attachment/rr-add-attachment.component";
import { RrEditAttachmentComponent } from "../../common-template/rr-edit-attachment/rr-edit-attachment.component";
import { SalesQuotePrintComponent } from "../../common-template/sales-quote-print/sales-quote-print.component";
import { UpdateQuoteMroComponent } from "../../common-template/update-quote-mro/update-quote-mro.component";
import { UpdateVendorMroComponent } from "../../common-template/update-vendor-mro/update-vendor-mro.component";
import { MroAddCustomerQuoteComponent } from "../../common-template/mro-add-customer-quote/mro-add-customer-quote.component";
@Component({
  selector: "app-edit-mro",
  templateUrl: "./edit-mro.component.html",
  styleUrls: ["./edit-mro.component.scss"],
  providers: [BsModalService],
})
export class EditMroComponent implements OnInit {
  SODetails: boolean = false;
  PODetails: boolean = false;
  isMasterSel: boolean;
  MROId;
  MROInfo;
  Quote;
  MRONo;
  QuoteItemID;
  CustomerId;
  customerList: any = [];
  customerAddressList: any = [];
  AddressList: any = [];
  CustomerList: any = [];
  viewResult: any = [];
  PriorityNotes = "";
  repairMessage;
  disablesave: boolean = false;
  breadCrumbItems;
  EditForm: FormGroup;
  submitted: boolean = false;
  @ViewChild(SalesQuotePrintComponent, null)
  printComponent: SalesQuotePrintComponent;
  MROStatusNameStyle;

  isLoadingCustomer: boolean = false;
  keywordForCustomer = "CompanyName";
  CustomersList: any[];

  QuoteLineItem: any = [];
  SalesOrderItem = [];
  VendorBillDetails: any = [];
  CustomerInvoiceDetails: any = [];
  POShippingHistoryList: any = [];
  SOShippingHistoryList: any = [];
  MROShippingHistorylist: any = [];
  MROReceivingHistorylist: any = [];
  CustomerSOId;
  VendorPOId;
  VendorInvoiceId;
  CustomerInvoiceId;
  SOItem: any = [];
  POItem: any = [];
  showReceive;
  keywordForRR = "RRNo";
  RRList: any[];
  RRId = "";
  isLoadingRR: boolean = false;
  MRONotesInfo: any = [];
  AttachmentList: any = [];
  notesArr: any = [];

  MROStatusHistory;
  MRO_COMPLETED = 7;
  Rejected = 6;

  IsDisplayBaseCurrencyValue;
  BaseCurrencySymbol;
  VAT_field_Name;
  Shipping_field_Name;
  //.................Quote pdf download varaible.........................
  result;
  SalesQuoteInfo;
  QuoteItem: any = [];
  NotesList: any = [];
  RRNotesList: any = [];
  TermsName;
  AHAddressList;
  AHGroupWebsite;
  ShippingAddress;
  BillingAddress;
  CustomerAddress;
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
  Quote_notes;
  CustomerBillToId;
  CustomerShipToId;
  SalesQuotesCustomerRef: any = [];
  IsSOViewCostEnabled: boolean;
  PartId: any;
  IsSONotesEnabled: boolean;
  settingsView: any;
  TaxPercent: any;
  BillName;
  ShipName;
  CSVData: any = [];
  //.................End Quote pdf download varaible.........................

  IsActive;
  showLocation: boolean;
  IsMROEdit: any;
  constructor(
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    public router: Router,
    private modalService: NgbModal,
    public navCtrl: NgxNavigationWithDataComponent,
    private service: CommonService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private CommonmodalService: BsModalService,
    public modalRef: BsModalRef,
    private _FileSaverService: FileSaverService
  ) {
    this.IsMROEdit = this.service.permissionCheck("MRO", CONST_MODIFY_ACCESS);
  }

  currentRouter = decodeURIComponent(this.router.url);
  ngOnInit() {
    if (this.IsMROEdit) {
      document.title = "MRO Edit";
      this.MROStatusNameStyle = "";
      this.MROInfo = "";
      this.QuoteTypeList = Quote_type;
      this.IsDisplayBaseCurrencyValue = localStorage.getItem(
        "IsDisplayBaseCurrencyValue"
      );
      this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol");
      this.VAT_field_Name = VAT_field_Name;
      this.Shipping_field_Name = Shipping_field_Name;
      this.getAHGroupaddress();
      this.getAdminSettingsView();

      this.breadCrumbItems = [
        { label: "Aibond", path: "/" },
        { label: "MRO", path: "/admin/mro/list/" },
        { label: "Edit", path: "/", active: true },
      ];
      if (history.state.MROId == undefined) {
        this.route.queryParams.subscribe((params) => {
          this.MROId = params["MROId"];
        });
      } else if (history.state.MROId != undefined) {
        this.MROId = history.state.MROId;
      }
      if (localStorage.getItem("IdentityType") == "0") {
        this.showLocation = true;
      } else {
        this.showLocation = false;
      }
      // Redirect to the List page if the View Id is not available
      if (this.MROId == "" || this.MROId == "undefined" || this.MROId == null) {
        this.navCtrl.navigate("/admin/mro/list/");
        return false;
      }
      this.EditForm = this.fb.group({
        CustomerId: ["", Validators.required],
        Customer: [""],
        // Notes: [''],
        CustomerShipToId: [null, Validators.required],
        CustomerBillToId: [null, Validators.required],
        TermsId: ["", Validators.required],
        TaxType: ["", Validators.required],
        TotalValue: [""],
        ProcessFee: [""],
        TotalTax: [""],
        TaxPercent: [""],
        Discount: [""],
        ShippingFee: [""],
        GrandTotal: [""],
        RRNo: [],
        RRId: [],
      });
      this.getViewContent();
    }
  }
  //AutoComplete for customer
  selectCustomerEvent($event) {
    this.getCustomerProperties($event.CustomerId, $event.PriorityNotes);
    this.EditForm.patchValue({
      CustomerId: $event.CustomerId,
    });
    this.CustomerId = $event.CustomerId;
  }

  clearEventCustomer($event) {
    this.EditForm.patchValue({
      CustomerId: "",
      CustomerBillToId: "",
      CustomerShipToId: "",
    });
    this.CustomerId = "";
  }
  onChangeCustomerSearch(val: string) {
    if (val) {
      this.isLoadingCustomer = true;
      var postData = {
        Customer: val,
      };
      this.service.postHttpService(postData, "getAllAutoComplete").subscribe(
        (response) => {
          if (response.status == true) {
            var data = response.responseData;
            this.CustomersList = data.filter((a) =>
              a.CompanyName.toLowerCase().includes(val.toLowerCase())
            );
          } else {
          }
          this.isLoadingCustomer = false;
          this.cd_ref.detectChanges();
        },
        (error) => {
          console.log(error);
          this.isLoadingCustomer = false;
        }
      );
    }
  }

  getCustomerList() {
    this.service
      .getHttpService("getCustomerListDropdown")
      .subscribe((response) => {
        this.customerList = response.responseData.map(function (value) {
          return {
            title: value.CompanyName,
            CustomerId: value.CustomerId,
            PriorityNotes: value.PriorityNotes,
          };
          //return { title: value.CustomerCode + " - " + value.CompanyName, "CustomerId": value.CustomerId, "PriorityNotes": value.PriorityNotes }
        });
        this.CustomerList = response.responseData;
      });
  }

  getCustomerProperties(CustomerId, event) {
    var postData1 = {
      IdentityId: CustomerId,
      IdentityType: 1,
      Type: CONST_BillAddressType,
    };
    //CustomerAddressLoad
    this.service
      .postHttpService(postData1, "getAddressList")
      .subscribe((response) => {
        this.AddressList = response.responseData;
        this.customerAddressList = response.responseData.map(function (value) {
          return {
            title:
              value.StreetAddress +
              " " +
              value.SuiteOrApt +
              ", " +
              value.City +
              " , " +
              value.StateName +
              " ," +
              value.CountryName +
              ". - " +
              value.Zip,
            AddressId: value.AddressId,
          };
        });

        let obj = this;
        //BillingAddress
        var BillingAddress = obj.AddressList.filter(function (value) {
          if (value.IsBillingAddress == 1) {
            return value.AddressId;
          }
        }, obj);

        //CustomerInfo;
        var info = obj.CustomersList.filter(function (value) {
          if (value.CustomerId == CustomerId) {
            return value;
          }
        }, obj);

        this.EditForm.patchValue({
          CustomerBillToId: BillingAddress[0].AddressId,
        });
      });
    var postData2 = {
      IdentityId: CustomerId,
      IdentityType: 1,
      Type: CONST_ShipAddressType,
    };

    //CustomerAddressLoad
    this.service
      .postHttpService(postData2, "getAddressList")
      .subscribe((response) => {
        this.AddressList = response.responseData;
        this.customerAddressList = response.responseData.map(function (value) {
          return {
            title:
              value.StreetAddress +
              " " +
              value.SuiteOrApt +
              ", " +
              value.City +
              " , " +
              value.StateName +
              " ," +
              value.CountryName +
              ". - " +
              value.Zip,
            AddressId: value.AddressId,
          };
        });

        //shippingAddress
        let obj = this;
        var ShippingAddress = obj.AddressList.filter(function (value) {
          if (value.IsShippingAddress == 1) {
            return value.AddressId;
          }
        }, obj);
        this.EditForm.patchValue({
          CustomerShipToId: ShippingAddress[0].AddressId,
        });
      });
  }

  reLoad() {
    this.router.navigate([this.currentRouter.split("?")[0]], {
      queryParams: { MROId: this.MROId },
    });
  }

  onSubmit() {}
  //Create Invoice
  CreateVendorInvoice(
    SOItemId,
    VendorId,
    Quantity,
    POId,
    j,
    Rate,
    ItemLocalCurrencySymbol,
    item
  ) {
    var MROShippingHistoryId =
      this.POShippingHistoryList[j].MROShippingHistoryId;
    var CustomerId = this.CustomerId;
    var MROId = this.MROId;
    var IsInvoiceApproved = this.MROInfo.IsInvoiceApproved;
    var price = (Rate + item.Tax) * Quantity;
    var ssc = item.ShippingCharge / item.Quantity;
    var ShippingCharge = ssc * Quantity;
    var POAmount = (price + ShippingCharge).toFixed(2);
    this.modalRef = this.CommonmodalService.show(MroVendorInvoiceComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: {
          MROShippingHistoryId,
          SOItemId,
          VendorId,
          Quantity,
          POId,
          CustomerId,
          MROId,
          IsInvoiceApproved,
          POAmount,
          ItemLocalCurrencySymbol,
        },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  //get form validation control
  get EditFormControl() {
    return this.EditForm.controls;
  }

  //Delete MRO Record
  onDelete() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          MROId: this.MROId,
        };
        this.service
          .postHttpService(postData, "MRODelete")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "MRO has been deleted.",
                type: "success",
              });
              this.navCtrl.navigate("/admin/mro/list/");
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "MRO  is safe:)",
          type: "error",
        });
      }
    });
  }

  //Ship&Receive
  onRRShippingReceive(item) {
    var MROId = this.MROId;
    var CustomerId = this.CustomerId;
    var VendorName = item.VendorName;
    var VendorId = item.VendorId;
    var SOId = item.SOId;
    var SOItemId = item.SOItemId;
    var POItemId = item.POItemId;
    var POId = item.POId;
    var Pending = item.Pending;
    this.modalRef = this.CommonmodalService.show(MroShipReceiveComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: {
          MROId,
          CustomerId,
          VendorName,
          VendorId,
          SOItemId,
          SOId,
          POItemId,
          POId,
          Pending,
        },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }
  //Ship
  onMroShip(item) {
    var MROId = this.MROId;
    var VendorId = CONST_AH_Group_ID;
    var CustomerId = this.CustomerId;
    var CustomerName = this.viewResult.SalesOrder[0].CompanyName;
    var SOId = item.SOId;
    var SOItemId = item.SOItemId;
    var POItemId = item.POItemId;
    var POId = item.POId;
    var PartId = item.PartId;
    var ReadyForShipment = item.ReadyForShipment;
    this.modalRef = this.CommonmodalService.show(MroShipComponent, {
      initialState: {
        data: {
          MROId,
          VendorId,
          CustomerId,
          CustomerName,
          SOItemId,
          SOId,
          POItemId,
          POId,
          PartId,
          ReadyForShipment,
        },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  //Receive
  onMroReceive(j) {
    var MROShippingHistoryId =
      this.SOShippingHistoryList[j].MROShippingHistoryId;

    var shippingItem = this.MROShippingHistorylist.find(
      (a) => a.MROShippingHistoryId == MROShippingHistoryId
    );
    // for(var i = 0 ; i<= this.MROShippingHistorylist.length ;i++){
    //   if(this.MROShippingHistorylist[i].MROShippingHistoryId==MROShippingHistoryId){
    //     var shippingItem = this.MROShippingHistorylist[i];
    //     break;
    //   }
    // }
    var MROId = this.MROId;
    var CustomerId = this.CustomerId;
    var CustomerName = this.viewResult.SalesOrder[0].CompanyName;

    this.modalRef = this.CommonmodalService.show(MroReceiveComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: {
          MROId,
          CustomerId,
          CustomerName,
          MROShippingHistoryId,
          shippingItem,
        },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((res) => {
      if (res) {
        this.reLoad();
      }
    });
  }

  onShippingHistory(j) {
    var MROShippingHistoryId =
      this.SOShippingHistoryList[j].MROShippingHistoryId;
    var shippingItem = this.MROShippingHistorylist.find(
      (a) => a.MROShippingHistoryId == MROShippingHistoryId
    );
    var RecevingItem = this.MROReceivingHistorylist.find(
      (a) => a.MROShippingHistoryId == MROShippingHistoryId
    );
    this.modalRef = this.CommonmodalService.show(MroShippingHistoryComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { RecevingItem, MROShippingHistoryId, shippingItem },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";
  }
  deleteQuotes() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          QuoteId: 1,
        };
        this.service
          .postHttpService(postData, "DeleteQuote")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Deleted!",
                text: "Quote has been deleted.",
                type: "success",
              });
              this.reLoad();
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Quote is safe:)",
          type: "error",
        });
      }
    });
  }
  //Create SO

  isAllSelected(event) {
    this.QuoteLineItem.map((item: any) => {
      item.checked = event.target.checked;
    });
  }

  CreateSO(event, i) {
    this.QuoteLineItem[i].checked = event.target.checked;
  }
  CreateMROSO() {
    this.SalesOrderItem = this.QuoteLineItem.filter((a) => a.checked);
    if (this.SalesOrderItem.length > 0) {
      var MROId = this.MROId;
      var CustomerId = this.CustomerId;
      var QuoteId = this.Quote.QuoteId;
      var SalesOrderItem = this.SalesOrderItem;
      var CustomerBillToId = this.MROInfo.CustomerBillToId;
      var CustomerShipToId = this.MROInfo.CustomerShipToId;
      var GrandTotal = this.Quote.GrandTotal.toFixed(2);
      var LocalCurrencyCode = this.Quote.LocalCurrencyCode;
      var ExchangeRate = this.Quote.ExchangeRate;
      var BaseCurrencyCode = this.Quote.BaseCurrencyCode;
      var BaseGrandTotal = this.Quote.BaseGrandTotal;
      var CurrencySymbol = this.Quote.CurrencySymbol;
      this.modalRef = this.CommonmodalService.show(BalnketPoMroComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: {
            MROId,
            CustomerId,
            QuoteId,
            SalesOrderItem,
            CustomerBillToId,
            CustomerShipToId,
            GrandTotal,
            LocalCurrencyCode,
            ExchangeRate,
            BaseCurrencyCode,
            BaseGrandTotal,
            CurrencySymbol,
          },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";

      this.modalRef.content.event.subscribe((res) => {
        this.reLoad();
      });
    } else {
      Swal.fire({
        type: "info",
        title: "Message",
        text: "Please checked the Quote Item",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }
  CreateMROPO() {
    var MROId = this.MROId;
    var SOId = this.CustomerSOId;
    this.modalRef = this.CommonmodalService.show(CreateMroPoComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { MROId, SOId },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  // Edit Customer Quote
  EditCustomerQuote() {
    var QuoteId = this.Quote.QuoteId;
    var MROId = this.MROId;
    var CustomerId = this.CustomerId;
    var CustomerBillToId = this.MROInfo.CustomerBillToId;
    var CustomerShipToId = this.MROInfo.CustomerShipToId;
    this.modalRef = this.CommonmodalService.show(MroCustomerQuoteComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: {
          QuoteId,
          CustomerId,
          MROId,
          CustomerBillToId,
          CustomerShipToId,
        },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  // Add Customer Quote
  AddCustomerQuote() {
    var QuoteId = this.Quote.QuoteId;
    var Quote = this.Quote;
    var MROId = this.MROId;
    var CustomerId = this.CustomerId;
    var CustomerBillToId = this.MROInfo.CustomerBillToId;
    var CustomerShipToId = this.MROInfo.CustomerShipToId;
    this.modalRef = this.CommonmodalService.show(MroAddCustomerQuoteComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: {
          QuoteId,
          Quote,
          CustomerId,
          MROId,
          CustomerBillToId,
          CustomerShipToId,
        },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  //.................Quote pdf download.........................
  hideAddress: boolean = true;
  generatePDF() {
    this.IsSOViewCostEnabled = this.service.permissionCheck(
      "ManageSalesQuotes",
      CONST_VIEW_COST_ACCESS
    );
    this.IsSONotesEnabled = this.service.permissionCheck(
      "SalesQuoteNotes",
      CONST_VIEW_ACCESS
    );
    this.onExportCustomerQuote();
    this.loadTemplate();
  }
  onExportCustomerQuote() {
    var postData = {
      MROId: this.MROId,
    };
    this.service.postHttpService(postData, "changeStatusToQuoted").subscribe(
      (response) => {
        if (response.status == true) {
          this.reLoad();
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
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

  onPrintClick() {
    this.getPdfBase64((pdfBase64) => {
      let blob = this.service.base64ToBlob(pdfBase64, "application/pdf");
      this._FileSaverService.save(blob, `Sales Quote ${this.number}.pdf`);
    });
  }

  loadTemplate() {
    var postData = {
      QuoteId: this.Quote.QuoteId,
      IsDeleted: false,
    };

    this.service.postHttpService(postData, "getSalesQuotesView").subscribe(
      (response) => {
        if (response.status == true) {
          this.result = response.responseData;
          this.SalesQuoteInfo = this.result.BasicInfo[0];
          this.QuoteItem = this.result.QuoteItem;
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

          this.QuoteTypeStyle = this.QuoteTypeList.find(
            (a) => a.Quote_TypeId == this.SalesQuoteInfo.QuoteType
          );

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
          this.onPrintClick();
        } else {
        }
        this.cd_ref.detectChanges();
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
  getPdfBase64(cb) {
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
        AHGroupWebsite: this.AHGroupWebsite,
        RRId: this.RRId,
        Logo: base64,
      };

      this.service
        .postHttpService({ pdfObj }, "getSQPdfBase64")
        .subscribe((response) => {
          if (response.status == true) {
            cb(response.responseData.pdfBase64);
          }
        });
    });
  }

  //.....................................end..................................
  EditVendor(QuoteId, QuoteItemId, PartId, Status) {
    var MROId = this.MROId;
    this.modalRef = this.CommonmodalService.show(UpdateVendorMroComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { MROId, QuoteId, QuoteItemId, PartId, Status },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  getViewContent() {
    var postData = {
      MROId: this.MROId,
    };
    this.service.postHttpService(postData, "viewMRO").subscribe(
      (response) => {
        if (response.status == true) {
          this.viewResult = response.responseData;
          this.MROInfo = this.viewResult.MROInfo[0];
          this.Quote = this.viewResult.Quote[0];
          this.IsActive = this.MROInfo.IsActive;
          // For QR Code
          this.MRONo = this.MROInfo.MRONo;
          this.CustomerId = this.MROInfo.CustomerId;
          this.QuoteLineItem = this.viewResult.QuoteItem.map((a) => {
            a.checked = false;
            return a;
          });
          this.CustomerSOId = this.MROInfo.CustomerSOId;
          this.VendorPOId = this.MROInfo.VendorPOId;
          this.VendorInvoiceId = this.MROInfo.VendorInvoiceId;
          this.CustomerInvoiceId = this.MROInfo.CustomerInvoiceId;
          this.SOItem = this.viewResult.SalesOrderItem;
          this.POItem = this.viewResult.PurchaseOrderItem;
          this.VendorBillDetails = this.viewResult.VendorBillDetails;
          this.CustomerInvoiceDetails = this.viewResult.CustomerInvoiceDetails;
          this.POShippingHistoryList = this.viewResult.POShippingHistoryList;
          this.SOShippingHistoryList = this.viewResult.SOShippingHistoryList;
          this.MROShippingHistorylist = this.viewResult.MROShippingHistorylist;
          this.MROReceivingHistorylist =
            this.viewResult.MROReceivingHistorylist;
          this.MROStatusHistory = this.viewResult.MROStatusHistory || [];

          this.MROStatusNameStyle = array_MRO_status.find(
            (a) => a.id == this.MROInfo.Status
          );

          this.MRONotesInfo = this.viewResult.MRONote || [];
          this.AttachmentList = this.viewResult.MROAttachment || [];
          this.getCustomerProperties(this.MROInfo.CustomerId, {
            PriorityNotes: this.PriorityNotes,
          });

          this.QuoteLineItem.filter(function (item) {
            var firstdata = item.PartDescription.replace(/\'/g, "'");
            var data = firstdata.replace("\\", "");
            item.PartDescription = data;
            return item;
          });

          //Set the form value
          this.EditForm.patchValue({
            Customer: this.MROInfo.CompanyName,
            CustomerId: this.MROInfo.CustomerId,
            CustomerBillToId: this.MROInfo.CustomerBillToId,
            CustomerShipToId: this.MROInfo.CustomerShipToId,
            // Notes: this.MROInfo.Notes,
            TermsId: this.Quote.TermsId,
            TaxType: this.Quote.TaxType,
            TotalValue: this.Quote.TotalTax,
            ProcessFee: this.Quote.ProcessFee,
            TotalTax: this.Quote.TotalTax,
            TaxPercent: this.Quote.TaxPercent,
            Discount: this.Quote.Discount,
            ShippingFee: this.Quote.ShippingFee,
            GrandTotal: this.Quote.GrandTotal,
            RRNo: this.MROInfo.RRNo,
            RRId: this.MROInfo.RRId,
          });

          /********** RR Notes Group - Start ***********/
          if (this.MRONotesInfo.length > 0) {
            // Accepts the array and key
            const groupBy = (array, key) => {
              // Return the end result
              return array.reduce((result, currentValue) => {
                // If an array already present for key, push it to the array. Else create an array and push the object
                (result[currentValue[key]] =
                  result[currentValue[key]] || []).push(currentValue);
                // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
                return result;
              }, {}); // empty object is the initial value for result object
            };

            // Group by color as key to the person array
            this.notesArr = groupBy(this.MRONotesInfo, "NotesType");
          }
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  //AutoComplete for RR
  selectRREvent($event) {
    this.EditForm.patchValue({
      RRId: $event.RRId,
    });
    // this.RRId = $event.RRId;
  }

  onChangeRRSearch(val: string) {
    if (val) {
      this.isLoadingRR = true;
      var postData = {
        RRNo: val,
        CustomerId: this.CustomerId,
      };
      this.service.postHttpService(postData, "RRNoAotoSuggest").subscribe(
        (response) => {
          if (response.status == true) {
            var data = response.responseData;
            this.RRList = data.filter((a) =>
              a.RRNo.toLowerCase().includes(val.toLowerCase())
            );
          } else {
          }
          this.isLoadingRR = false;
          this.cd_ref.detectChanges();
        },
        (error) => {
          console.log(error);
          this.isLoadingRR = false;
        }
      );
    }
  }

  //Notes Section
  addNotes() {
    var IdentityId = this.MROId;
    var IdentityType = CONST_IDENTITY_TYPE_MRO;
    this.modalRef = this.CommonmodalService.show(AddNotesComponent, {
      initialState: {
        data: { IdentityId, IdentityType },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.MRONotesInfo.push(res.data);
      this.reLoad();
    });
  }

  editNotes(note, i) {
    var IdentityId = this.MROId;
    var IdentityType = CONST_IDENTITY_TYPE_MRO;
    this.modalRef = this.CommonmodalService.show(EditNotesComponent, {
      initialState: {
        data: { note, i, IdentityId, IdentityType },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.MRONotesInfo[i] = res.data;
      this.reLoad();
    });
  }

  deleteNotes(NotesId, i) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          NotesId: NotesId,
        };
        this.service
          .postHttpService(postData, "NotesDelete")
          .subscribe((response) => {
            if (response.status == true) {
              this.MRONotesInfo.splice(i, 1);
              Swal.fire({
                title: "Deleted!",
                text: "Notes has been deleted.",
                type: "success",
              });
            }
          });
        this.reLoad();
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Notes is safe:)",
          type: "error",
        });
      }
    });
  }

  //Attachement Section
  addAttachment() {
    var IdentityId = this.MROId;
    var IdentityType = CONST_IDENTITY_TYPE_MRO;
    this.modalRef = this.CommonmodalService.show(RRAddAttachmentComponent, {
      initialState: {
        data: { IdentityId, IdentityType },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.AttachmentList.push(res.data);
    });
  }

  editAttachment(attachment, i) {
    var IdentityId = this.MROId;
    var IdentityType = CONST_IDENTITY_TYPE_MRO;
    this.modalRef = this.CommonmodalService.show(RrEditAttachmentComponent, {
      initialState: {
        data: { attachment, i, IdentityType, IdentityId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.AttachmentList[i] = res.data;
    });
  }

  deleteAttachment(AttachmentId, i) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          AttachmentId: AttachmentId,
        };
        this.service
          .postHttpService(postData, "AttachmentDelete")
          .subscribe((response) => {
            if (response.status == true) {
              this.AttachmentList.splice(i, 1);
              Swal.fire({
                title: "Deleted!",
                text: "Attachment has been deleted.",
                type: "success",
              });
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Attachment is safe:)",
          type: "error",
        });
      }
    });
  }

  //MROCurrent History
  MROcurrentstatus() {
    var currentHistory = this.MROStatusHistory;
    this.modalRef = this.CommonmodalService.show(MroCurrentHistoryComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { currentHistory },
      },
    });
    this.modalRef.content.closeBtnName = "Close";
  }

  //Rejected MRO
  RejectedMRO() {
    var MROId = this.MROId;
    this.modalRef = this.CommonmodalService.show(RejectedMroComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { MROId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  onInvoiceReport() {
    var postData = { MROId: this.MROId };
    this.service
      .postHttpService(postData, "MROInvoiceDetailedReportCSV")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.CSVData = response.responseData.ExcelData;
            this.generateCSVFormat();
            Swal.fire({
              title: "Success!",
              text: "Invoice Report downloaded Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "Invoice Report could not be downloaded!",
              type: "warning",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  generateCSVFormat() {
    let sampleJson: any = this.CSVData;
    let a = document.createElement("a");
    a.setAttribute("style", "display:none;");
    document.body.appendChild(a);
    let csvData = this.ConvertToCSV(sampleJson);
    let blob = new Blob([csvData], { type: "text/csv;encoding:utf-8" });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    var currentDate = this.datePipe.transform(
      new Date(),
      "M-d-yyyy hh-mm-ss a"
    );
    var filename = "Invoice Report " + currentDate + ".csv";
    a.download = filename;
    a.click();
  }
  ConvertToCSV(objArray) {
    let array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = "";
    let row = "";
    for (let index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ",";
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + "\r\n";

    for (let i = 0; i < array.length; i++) {
      let line = "";

      for (let index in array[i]) {
        if (line != "") line += ",";
        line += '"' + array[i][index] + '"';
      }
      str += line + "\r\n";
    }
    return str;
  }
  getReplace(val) {
    if (val) {
      var firstdata = val.replace("\\", "");
      var data = firstdata.replace(/\'/g, "'");
      console.log(data);
      return data;
    } else {
      return val;
    }
  }
  setReplace(val) {
    if (val) {
      var firstdata = val.replace("\\", "");
      var data = firstdata.replace("'", "\\'");
      console.log("data", data);
      return data;
    } else {
      return val;
    }
    // return val;
    // var data = val.replace("'","\\'")

    // console.log("data", data)
    // return data;
  }

  onInActiveorActiveMRO(data) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          MROId: this.MROId,
          IsActive: data,
        };
        this.service
          .postHttpService(postData, "ActiveInActiveMRO")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Success",
                text: "MRO Status Changed Successfully!",
                type: "success",
              });
              this.reLoad();
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "MRO Status  is safe:)",
          type: "error",
        });
      }
    });
  }
}
