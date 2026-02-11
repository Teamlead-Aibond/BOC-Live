import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { CommonService } from "src/app/core/services/common.service";
import {
  CONST_BillAddressType,
  CONST_ShipAddressType,
} from "src/assets/data/dropdown";
import Swal from "sweetalert2";
import { CreateMroPoComponent } from "../../common-template/create-mro-po/create-mro-po.component";
import { CreateMroSoComponent } from "../../common-template/create-mro-so/create-mro-so.component";
import { MroReceiveComponent } from "../../common-template/mro-receive/mro-receive.component";
import { MroShipComponent } from "../../common-template/mro-ship/mro-ship.component";
import { MroVendorInvoiceComponent } from "../../common-template/mro-vendor-invoice/mro-vendor-invoice.component";
import { UpdateQuoteMroComponent } from "../../common-template/update-quote-mro/update-quote-mro.component";
import { UpdateVendorMroComponent } from "../../common-template/update-vendor-mro/update-vendor-mro.component";

@Component({
  selector: "app-demo-mro-edit",
  templateUrl: "./demo-mro-edit.component.html",
  styleUrls: ["./demo-mro-edit.component.scss"],
})
export class DemoMroEditComponent implements OnInit {
  SODetails: boolean = false;
  PODetails: boolean = false;
  MROId;
  MROInfo;
  Quote;
  MRONo;
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

  isLoadingCustomer: boolean = false;
  keywordForCustomer = "CompanyName";
  CustomersList: any[];

  QuoteLineItem: any = [];
  SalesOrderItem = [];
  CustomerSOId;
  VendorPOId;
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
    public modalRef: BsModalRef
  ) { }

  currentRouter = decodeURIComponent(this.router.url);
  ngOnInit() {
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
    // Redirect to the List page if the View Id is not available
    if (this.MROId == "" || this.MROId == "undefined" || this.MROId == null) {
      this.navCtrl.navigate("/admin/mro/list/");
      return false;
    }
    this.EditForm = this.fb.group({
      CustomerId: ["", Validators.required],
      Notes: [""],
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
    });
    this.getCustomerList();
    this.getViewContent();
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

  getCustomerProperties(CustomerId, event) {
    var postData1 = {
      IdentityId: CustomerId,
      IdentityType: 1,
      Type: CONST_BillAddressType,
    };
    //CustomerShipAddressLoad
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
      });
    var postData2 = {
      IdentityId: CustomerId,
      IdentityType: 1,
      Type: CONST_ShipAddressType,
    };
    //CustomerBillAddressLoad
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
      });
  }

  reLoad() {
    this.router.navigate([this.currentRouter.split("?")[0]], {
      queryParams: { MROId: this.MROId },
    });
  }

  onSubmit() { }
  //Create Invoice
  CreateVendorInvoice() {
    this.modalRef = this.CommonmodalService.show(MroVendorInvoiceComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: {},
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

  //Receive
  onRRShippingReceive() {
    var RRShippingHistory = [
      {
        ShippingHistoryId: 443,
        RRId: 100721,
        ShipFromIdentityName: "Vendor",
        ShipFromId: 5,
        ShipFromName: "Aibond",
        ShipFromAddressId: 666,
        ShowCustomerReference: 0,
        ShowRootCause: 0,
        ShipIdentityType: "Vendor",
        ShipAddressType: 1,
        ShipStreetAddress: "1885 Thunderbird St",
        ShipSuiteOrApt: "",
        ShipCity: "Troy",
        ShipState: "Michigan",
        ShipCountry: "USA",
        ShipZip: " 48084",
        ShipEmail: " ",
        ShipPhoneNoPrimary: "+91 8489813526",
        ReceiveIdentityType: "Vendor",
        ReceiveAddressType: 1,
        ReceiveStreetAddress: "48553 WEST RD",
        ReceiveSuiteOrApt: "",
        ReceiveCity: "WIXOM",
        ReceiveState: "Michigan",
        ReceiveCountry: "USA",
        ReceiveZip: "48393",
        ReceiveEmail: "WHAYSE@2VINDUSTRIES.COM",
        ReceivePhoneNoPrimary: "248-624-7943",
        ShipViaName: "Drop-off",
        IsShipViaUPS: 0,
        TrackingNo: "",
        PackWeight: 12,
        ShippingCost: 100,
        ShipDate: "2021-07-21",
        ShippedBy: "Remigus L",
        ShipComment: "",
        ShipToIdentityName: "Vendor",
        ShipToId: 10493,
        ShipToName: "2V INDUSTRIES",
        ReceiveAddressId: 2248,
        ReceivedBy: "Remigus L",
        ReceiveDate: "2021-07-21",
        ReceiveComment: "",
      },
      {
        ShippingHistoryId: 444,
        RRId: 100721,
        ShipFromIdentityName: "Vendor",
        ShipFromId: 10493,
        ShipFromName: "Aibond",
        ShipFromAddressId: 2248,
        ShowCustomerReference: 1,
        ShowRootCause: 1,
        ShipIdentityType: "Vendor",
        ShipAddressType: 1,
        ShipStreetAddress: "48553 WEST RD",
        ShipSuiteOrApt: "",
        ShipCity: "WIXOM",
        ShipState: "Michigan",
        ShipCountry: "USA",
        ShipZip: "48393",
        ShipEmail: "WHAYSE@2VINDUSTRIES.COM",
        ShipPhoneNoPrimary: "248-624-7943",
        ReceiveIdentityType: "Vendor",
        ReceiveAddressType: 1,
        ReceiveStreetAddress: "1885 Thunderbird St",
        ReceiveSuiteOrApt: "",
        ReceiveCity: "Troy",
        ReceiveState: "Michigan",
        ReceiveCountry: "USA",
        ReceiveZip: " 48084",
        ReceiveEmail: " ",
        ReceivePhoneNoPrimary: "+91 8489813526",
        ShipViaName: "FedEx",
        IsShipViaUPS: 0,
        TrackingNo: "",
        PackWeight: 12,
        ShippingCost: 100,
        ShipDate: "2021-07-21",
        ShippedBy: "Remigus L",
        ShipComment: "",
        ShipToIdentityName: "Vendor",
        ShipToId: 5,
        ShipToName: "2V Industry",
        ReceiveAddressId: 666,
        ReceivedBy: "Remigus L",
        ReceiveDate: "2021-07-21",
        ReceiveComment: "",
      },
      {
        ShippingHistoryId: 457,
        RRId: 100721,
        ShipFromIdentityName: "Vendor",
        ShipFromId: 5,
        ShipFromName: "Aibond",
        ShipFromAddressId: 666,
        ShowCustomerReference: 0,
        ShowRootCause: 0,
        ShipIdentityType: "Vendor",
        ShipAddressType: 1,
        ShipStreetAddress: "1885 Thunderbird St",
        ShipSuiteOrApt: "",
        ShipCity: "Troy",
        ShipState: "Michigan",
        ShipCountry: "USA",
        ShipZip: " 48084",
        ShipEmail: " ",
        ShipPhoneNoPrimary: "+91 8489813526",
        ReceiveIdentityType: "Vendor",
        ReceiveAddressType: 1,
        ReceiveStreetAddress: "48553 WEST RD",
        ReceiveSuiteOrApt: "",
        ReceiveCity: "WIXOM",
        ReceiveState: "Michigan",
        ReceiveCountry: "USA",
        ReceiveZip: "48393",
        ReceiveEmail: "WHAYSE@2VINDUSTRIES.COM",
        ReceivePhoneNoPrimary: "248-624-7943",
        ShipViaName: "UPS",
        IsShipViaUPS: 1,
        TrackingNo: "TR45",
        PackWeight: 7,
        ShippingCost: 450,
        ShipDate: "2021-07-22",
        ShippedBy: "Super AWS Admin",
        ShipComment: "",
        ShipToIdentityName: "Vendor",
        ShipToId: 10493,
        ShipToName: "2V INDUSTRIES",
        ReceiveAddressId: 2248,
        ReceivedBy: null,
        ReceiveDate: null,
        ReceiveComment: null,
      },
    ];
    var MROId = this.MROId;
    var CustomerId = this.CustomerId;
    var Status = 2;
    this.modalRef = this.CommonmodalService.show(MroReceiveComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { RRShippingHistory, MROId, CustomerId, Status },
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
  onMroShip() {
    var RRShippingHistory = [
      {
        ShippingHistoryId: 465,
        MROId: 10161,
        RRId: 0,
        ShipFromIdentityName: "Vendor",
        ShipFromId: 5,
        ShipFromName: "Aibond",
        ShipFromAddressId: 666,
        ShipIdentityType: "Vendor",
        ShipAddressType: 1,
        ShipStreetAddress: "1885 Thunderbird St",
        ShipSuiteOrApt: "",
        ShipCity: "Troy",
        ShipState: "Michigan",
        ShipCountry: "USA",
        ShipZip: " 48084",
        ShipEmail: " ",
        ShipPhoneNoPrimary: "+91 8489813526",
        ReceiveIdentityType: "Vendor",
        ReceiveAddressType: 1,
        ReceiveStreetAddress: "48553 WEST RD",
        ReceiveSuiteOrApt: "",
        ReceiveCity: "WIXOM",
        ReceiveState: "Michigan",
        ReceiveCountry: "USA",
        ReceiveZip: "48393",
        ReceiveEmail: "WHAYSE@2VINDUSTRIES.COM",
        ReceivePhoneNoPrimary: "248-624-7943",
        ShipViaName: "FedEx",
        IsShipViaUPS: 0,
        TrackingNo: "TR45",
        PackWeight: 7,
        ShippingCost: 250,
        ShipDate: "2021-07-23",
        ShippedBy: "Super AWS Admin",
        ShipComment: "",
        ShipToIdentityName: "Vendor",
        ShipToId: 10493,
        ShipToName: "2V INDUSTRIES",
        ReceiveAddressId: 2248,
        ReceivedBy: "Super AWS Admin",
        ReceiveDate: "2021-07-23",
        ReceiveComment: "",
      },
    ];
    var MROId = this.MROId;
    var VendorId = 10493;
    var CustomerId = 11553;
    var ShippingStatus = 2;
    var ShippingIdentityType = 2;
    var ShippingIdentityName = "2V INDUSTRIES";
    var ShippingIdentityId = 10493;
    var ShippingAddressId = 2248;
    var Status = 5;
    this.modalRef = this.CommonmodalService.show(MroShipComponent, {
      initialState: {
        data: {
          RRShippingHistory,
          MROId,
          VendorId,
          ShippingAddressId,
          ShippingIdentityName,
          ShippingIdentityId,
          CustomerId,
          ShippingStatus,
          ShippingIdentityType,
          Status,
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
  CreateSO(SalesOrderItem) {
    this.SalesOrderItem.push(SalesOrderItem);
  }
  CreateMROSO() {
    if (this.SalesOrderItem.length > 0) {
      var MROId = this.MROId;
      var CustomerId = this.CustomerId;
      var QuoteId = this.Quote.QuoteId;
      var SalesOrderItem = this.SalesOrderItem;
      var SOType = 0;
      var CustomerBillToId = this.MROInfo.CustomerBillToId;
      var CustomerShipToId = this.MROInfo.CustomerShipToId;
      var Notes = this.MROInfo.Notes;
      var TotalValue = this.Quote.TotalTax;
      var ProcessFee = this.Quote.ProcessFee;
      var TotalTax = this.Quote.TotalTax;
      var TaxPercent = this.Quote.TaxPercent;
      var Discount = this.Quote.Discount;
      var ShippingFee = this.Quote.ShippingFee;
      var GrandTotal = this.Quote.GrandTotal;
      var Status = 1;
      this.modalRef = this.CommonmodalService.show(CreateMroSoComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: {
            MROId,
            CustomerId,
            QuoteId,
            SalesOrderItem,
            SOType,
            CustomerBillToId,
            CustomerShipToId,
            Notes,
            TotalValue,
            ProcessFee,
            TotalTax,
            TaxPercent,
            Discount,
            ShippingFee,
            GrandTotal,
            Status,
          },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";

      this.modalRef.content.event.subscribe((res) => {
        this.SODetails = true;

        // this.reLoad();
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
    // var MROId = this.MROId;
    // var CustomerId = this.CustomerId;
    // var POId = this.VendorPOId;
    // var SOId = this.CustomerSOId;
    // var POAmount = this.MROInfo.POAmount
    // var IsInvoiceApproved = this.IsInvoiceApproved
    this.modalRef = this.CommonmodalService.show(CreateMroPoComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        // data: { MROId, CustomerId, POId, SOId, POAmount, IsInvoiceApproved },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.PODetails = true;

      // this.reLoad();
    });
  }

  // Edit Customer Quote
  EditCustomerQuote(QuoteId, QuoteItemId) {
    this.modalRef = this.CommonmodalService.show(UpdateQuoteMroComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { QuoteId, QuoteItemId },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.reLoad();
    });
  }

  EditVendor(QuoteId, QuoteItemId, PartId) {
    var MROId = this.MROId;
    this.modalRef = this.CommonmodalService.show(UpdateVendorMroComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { MROId, QuoteId, QuoteItemId, PartId },
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
          // For QR Code
          this.MRONo = this.MROInfo.MRONo;
          this.CustomerId = this.MROInfo.CustomerId;
          this.QuoteLineItem = this.viewResult.QuoteItem;
          this.CustomerSOId = this.MROInfo.CustomerSOId;
          this.VendorPOId = this.MROInfo.VendorPOId;

          this.getCustomerProperties(this.MROInfo.CustomerId, {
            PriorityNotes: this.PriorityNotes,
          });

          //Set the form value
          this.EditForm.patchValue({
            CustomerId: this.MROInfo.CustomerId,
            CustomerBillToId: this.MROInfo.CustomerBillToId,
            CustomerShipToId: this.MROInfo.CustomerShipToId,
            Notes: this.MROInfo.Notes,
            TermsId: this.Quote.TermsId,
            TaxType: this.Quote.TaxType,
            TotalValue: this.Quote.TotalTax,
            ProcessFee: this.Quote.ProcessFee,
            TotalTax: this.Quote.TotalTax,
            TaxPercent: this.Quote.TaxPercent,
            Discount: this.Quote.Discount,
            ShippingFee: this.Quote.ShippingFee,
            GrandTotal: this.Quote.GrandTotal,
            RRNo: [],
          });
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }
}
