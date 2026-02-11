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
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { Observable, of, Subject, concat } from "rxjs";
import {
  distinctUntilChanged,
  debounceTime,
  switchMap,
  catchError,
  map,
} from "rxjs/operators";
import { CommonService } from "src/app/core/services/common.service";
import { CustomvalidationService } from "src/app/core/services/customvalidation.service";
import {
  warranty_list,
  taxtype,
  Const_Alert_pop_title,
  Const_Alert_pop_message,
  CONST_BillAddressType,
  CONST_ShipAddressType,
  part_type,
  attachment_thumb_images,
  VAT_field_Name,
  Shipping_field_Name,
  CONST_CREATE_ACCESS,
} from "src/assets/data/dropdown";
import Swal from "sweetalert2";
import { AddRrPartsComponent } from "../../common-template/add-rr-parts/add-rr-parts.component";

@Component({
  selector: "app-add-mro",
  templateUrl: "./add-mro.component.html",
  styleUrls: ["./add-mro.component.scss"],
  providers: [BsModalRef, BsModalService],
})
export class AddMroComponent implements OnInit {
  keyword = "PartNo";
  filteredData: any[];
  isLoading: boolean = false;
  qtyerror: boolean = false;
  data = [];
  selectPart;
  qtyVendormessage;
  qtyCustomermessage;
  WarrantyPeriod: any;
  SubTotal: any;
  AdditionalCharge: any;
  Discount: any;
  GrandTotal: any;
  keywordForRR = "RRNo";
  RRList: any[];
  RRId = "";
  isLoadingRR: boolean = false;

  isLoadingCustomer: boolean = false;
  keywordForCustomer = "CompanyName";
  CustomersList: any[];
  CustomerId;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  AddForm: FormGroup;
  submitted = false;

  //Dropdown
  customerList;
  departmentList;
  departmentNewList;
  assetNewList;
  assetList;
  customerReferenceList: any = [];
  partList: any = [];
  customerInfo;
  customerPartList: any = [];
  partNewList: any = [];
  adminList;
  warrantyList;
  taxType;
  TermsList;
  LPPList: any = [];
  AddressList;
  customerAddressList: any = [];
  admin;
  PriorityNotes = "";

  RRParts: any = [];
  RRImagesList: any = [];
  showsave: boolean = true;
  spinner: boolean = false;

  Attachment;
  url: any = [];

  public event: EventEmitter<any> = new EventEmitter();
  ContactPhone: any;
  ContactEmail: any;

  ManufacturerPartNo: any;
  Description: any;
  Manufacturer: any;
  ManufactuerName: "";
  SerialNo: any;
  Quantity: any;
  PartNo: any;
  Price: any;
  CReferenceId: string;

  PartId;
  DepartmentId;
  AssetId;
  IsWarrantyRecovery;
  UserId;
  PON;
  LPP;
  Manufactuer;
  RRDescription;

  Type;
  TypePartId;
  TypePartItemId;
  TypePartNo;

  parts$: Observable<any> = of([]);
  partsInput$ = new Subject<string>();

  Vendors$: Observable<any> = of([]);
  VendorsInput$ = new Subject<string>();

  Vendor: FormArray;
  RRNo;
  CustomerName;
  PartTypes;
  attachmentThumb;
  IsDisplayBaseCurrencyValue;
  BaseCurrencySymbol;
  VAT_field_Name;
  Shipping_field_Name;
  CustomerCurrencySymbol;
  VendorCurrencySymbol;
  CustomerExchangeRate;
  VendorExchangeRate;
  CustomerCurrencyCode;
  VendorCurrencyCode;
  CustomerLocation;
  CustomerVatTax;
  VendorLocation;
  VendorVatTax;
  GrandTotalUSD;
  IsMROCreate: any;
  constructor(
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private CommonmodalService: BsModalService,
    private datePipe: DatePipe,
    public modalRef: BsModalRef,
    private commonService: CommonService
  ) {
    this.IsMROCreate = this.commonService.permissionCheck(
      "MRO",
      CONST_CREATE_ACCESS
    );
  }

  ngOnInit(): void {
    if (this.IsMROCreate) {
      document.title = "MRO Add";
      this.IsDisplayBaseCurrencyValue = localStorage.getItem(
        "IsDisplayBaseCurrencyValue"
      );
      this.BaseCurrencySymbol = localStorage.getItem("BaseCurrencySymbol");
      this.VAT_field_Name = VAT_field_Name;
      this.Shipping_field_Name = Shipping_field_Name;
      this.breadCrumbItems = [
        { label: "Aibond", path: "/" },
        { label: "MRO", path: "/" },
        { label: "Add", path: "/mro/add", active: true },
      ];
      //this.selectValue = ['Alaska', 'Hawaii', 'California', 'Nevada', 'Oregon', 'Washington', 'Arizona', 'Colorado', 'Idaho', 'Montana', 'Nebraska', 'New Mexico', 'North Dakota', 'Utah', 'Wyoming', 'Alabama', 'Arkansas', 'Illinois', 'Iowa'];
      this.attachmentThumb = attachment_thumb_images;

      this.Type = history.state.Type;
      this.TypePartId = history.state.PartId;
      this.TypePartItemId = history.state.PartItemId;
      this.TypePartNo = history.state.PartNo;
      this.RRId = history.state.RRId;
      this.CustomerId = history.state.CustomerId;
      this.RRNo = history.state.RRNo;
      this.CustomerName = history.state.CustomerName;
      this.loadParts();
      this.loadVendors();

      this.AddForm = this.fb.group({
        LocalCurrencyCode: "",
        ExchangeRate: "",
        BaseCurrencyCode: "",
        BaseGrandTotal: "",
        // Notes: [''],
        Customer: [""],
        CustomerId: ["", Validators.required],
        CustomerShipToId: [null, Validators.required],
        CustomerBillToId: [null, Validators.required],
        TermsId: ["", Validators.required],
        TaxType: ["", Validators.required],
        RRNo: [""],
        RRId: [""],
        TotalValue: [""],
        ProcessFee: [""],
        TotalTax: [""],
        TaxPercent: [""],
        Discount: [""],
        ShippingFee: [""],
        GrandTotal: [""],
        LineItem: this.fb.array([
          this.fb.group({
            Part: [""],
            PartNo: [""],
            PartDescription: [""],
            Rate: ["", Validators.required],
            Price: ["", Validators.required],
            LeadTime: [""],
            Quantity: [1, Validators.required],
            PartId: ["", [Validators.required, RxwebValidators.unique()]],
            PartType: ["", Validators.required],
            Tax: "",
            ItemTaxPercent: "",
            BasePrice: ["", Validators.required],
            ItemLocalCurrencyCode: "",
            ItemExchangeRate: "",
            ItemBaseCurrencyCode: "",
            ItemLocalCurrencySymbol: "",
            BaseRate: "",
            BaseTax: "",
            ShippingCharge: 0,
            BaseShippingCharge: 0,
            VendorQuoteInfo: new FormArray([this.Createvendor()]),
          }),
        ]),
      });

      this.warrantyList = warranty_list;
      this.taxType = taxtype;
      this.PartTypes = part_type;

      this.getTermList();

      if (this.Type == "RR") {
        this.AddForm.patchValue({
          RRNo: this.RRNo,
          RRId: this.RRId,
        });
        this.onChangeCustomerFromRRSearch(this.CustomerName);
        this.getPartDetails();
      }

      if (this.Type == "MRO") {
        this.getPartInfo(this.TypePartItemId, 0);
      }
    }
  }

  //-----------------***NOT Used now ***************

  getPartInfoFromRR(PartNo, i) {
    var postData = { PartNo: PartNo };
    const formGroup = this.QuoteItem.controls[i] as FormGroup;

    this.commonService
      .postHttpService(postData, "getcheckMROPartsAvailability")
      .subscribe((response) => {
        formGroup.controls["PartDescription"].patchValue(
          this.getReplace(response.responseData[0].Description)
        );
        formGroup.controls["Part"].patchValue(response.responseData[0].PartNo);
        formGroup.controls["PartNo"].patchValue(
          response.responseData[0].PartNo
        );
        formGroup.controls["PartId"].patchValue(
          response.responseData[0].PartId
        );
        formGroup.controls["Quantity"].patchValue(
          response.responseData[0].Quantity
        );
        formGroup.controls["Rate"].patchValue(
          response.responseData[0].SellingPrice
        );

        this.AddForm.patchValue({
          Description: this.getReplace(response.responseData[0].Description),
        });
        // let Quantity = formGroup.controls['Quantity'].value || 0;
        // let Rate = formGroup.controls['Rate'].value || 0;

        // // Calculate the price
        // var price = parseFloat(Quantity) * parseFloat(Rate);
        // formGroup.controls['Price'].patchValue(price);

        this.calculatePrice(0);

        this.LPPList = [];

        var postData = { PartNo: PartNo, CustomerId: this.CustomerId };
        this.commonService
          .postHttpService(postData, "RRGetPartPrice")
          .subscribe((response) => {
            for (var i in response.responseData.LPPInfo) {
              this.LPPList.push(response.responseData.LPPInfo[i].LPP);
            }
            formGroup.controls["LPP"].patchValue(this.LPPList.join(", "));
            formGroup.controls["PON"].patchValue(
              response.responseData.PartInfo.PON
            );
          });
      });
  }
  getPartInfo(PartItemId, i) {
    const formGroup = this.QuoteItem.controls[i] as FormGroup;

    var postData = { PartItemId: PartItemId };
    this.commonService
      .postHttpService(postData, "getPartItemView")
      .subscribe((response) => {
        formGroup.controls["PartDescription"].patchValue(
          this.getReplace(response.responseData[0].Description)
        );
        formGroup.controls["Part"].patchValue(response.responseData[0].PartNo);
        formGroup.controls["PartNo"].patchValue(
          response.responseData[0].PartNo
        );
        formGroup.controls["PartId"].patchValue(
          response.responseData[0].PartId
        );
        formGroup.controls["Quantity"].patchValue(1);
        formGroup.controls["Rate"].patchValue(
          response.responseData[0].SellingPrice
        );
        this.AddForm.patchValue({
          Description: this.getReplace(response.responseData[0].Description),
        });

        let Quantity = formGroup.controls["Quantity"].value || 0;
        let Rate = formGroup.controls["Rate"].value || 0;

        // Calculate the price
        var price = parseFloat(Quantity) * parseFloat(Rate);
        formGroup.controls["Price"].patchValue(price);
      });

    this.LPPList = [];

    var postData1 = { PartId: this.TypePartId, CustomerId: this.CustomerId };
    this.commonService
      .postHttpService(postData1, "RRGetPartPrice")
      .subscribe((response) => {
        for (var i in response.responseData.LPPInfo) {
          this.LPPList.push(response.responseData.LPPInfo[i].LPP);
        }
        formGroup.controls["LPP"].patchValue(this.LPPList.join(", "));
        formGroup.controls["PON"].patchValue(
          response.responseData.PartInfo.PON
        );
      });
  }
  viewRR(RRId) {
    this.router.navigate(["/admin/repair-request/edit"], {
      state: { RRId: RRId },
    });
  }
  //-----------------***NOT Used now ***************

  //-----------------***Used Code***************

  calculatePrice(index) {
    var price = 0;
    var subTotal = 0;
    var Tax = 0;
    const formGroup = this.QuoteItem.controls[index] as FormGroup;
    let Quantity = formGroup.controls["Quantity"].value || 0;
    let Rate = formGroup.controls["Rate"].value || 0;

    let VatTax = formGroup.controls["ItemTaxPercent"].value / 100;
    let VatTaxPrice = Rate * VatTax;
    // Calculate the price
    let ShippingCharge = formGroup.controls["ShippingCharge"].value || 0;
    price =
      parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice) +
      parseFloat(ShippingCharge);
    let BaseShippingCharge = ShippingCharge * this.CustomerExchangeRate;
    formGroup.controls["BaseShippingCharge"].patchValue(
      BaseShippingCharge.toFixed(2)
    );
    Tax = Rate * VatTax;
    formGroup.controls["Price"].patchValue(price.toFixed(2));
    formGroup.controls["Tax"].patchValue(Tax.toFixed(2));
    var TaxLocal = Rate * VatTax;
    let priceUSD = price * this.CustomerExchangeRate;
    formGroup.controls["BasePrice"].patchValue(priceUSD.toFixed(2));
    let RateUSD = Rate * this.CustomerExchangeRate;
    formGroup.controls["BaseRate"].patchValue(RateUSD.toFixed(2));
    let BaseTaxUSD = TaxLocal * this.CustomerExchangeRate;
    formGroup.controls["BaseTax"].patchValue(BaseTaxUSD.toFixed(2));
    // Calculate the subtotal
    for (let i = 0; i < this.QuoteItem.length; i++) {
      subTotal += parseFloat(this.QuoteItem.controls[i].get("Price").value);
    }
    this.SubTotal = subTotal.toFixed(2);
    this.AddForm.patchValue({ TotalValue: this.SubTotal });
    // //this.EditForm.patchValue({ TotalTax: (this.SubTotal * 5 / 100).toFixed(2) });
    // this.AddForm.patchValue({ TotalTax: (this.SubTotal * this.AddForm.value.TaxPercent / 100).toFixed(2) });
    this.calculateTotal();
  }

  calculateTotal() {
    var total = 0;
    // let AdditionalCharge = this.AddForm.value.ProcessFee || 0;
    // let Shipping = this.AddForm.value.ShippingFee || 0;
    // let Discount = this.AddForm.value.Discount || 0;

    total = parseFloat(this.AddForm.value.TotalValue);
    // + parseFloat(this.AddForm.value.TotalTax) +
    //   parseFloat(AdditionalCharge) + parseFloat(Shipping) - parseFloat(Discount);
    this.GrandTotal = parseFloat(total.toFixed(2));

    this.GrandTotalUSD = (this.GrandTotal * this.CustomerExchangeRate).toFixed(
      2
    );

    this.AddForm.patchValue({
      GrandTotal: this.GrandTotal,
      BaseGrandTotal: this.GrandTotalUSD,
    });
  }

  calculateTax() {
    this.AddForm.patchValue({
      TotalTax: ((this.SubTotal * this.AddForm.value.TaxPercent) / 100).toFixed(
        2
      ),
    });
    this.calculateTotal();
  }

  //get form validation control
  get AddFormControl() {
    return this.AddForm.controls;
  }

  //Add another Part
  public initPart(): FormGroup {
    return this.fb.group({
      Part: [""],
      PartNo: [""],
      PartDescription: [""],
      Rate: ["", Validators.required],
      Price: ["", Validators.required],
      LeadTime: [""],
      Quantity: [1, Validators.required],
      PartId: ["", [Validators.required, RxwebValidators.unique()]],
      PartType: ["", Validators.required],
      Tax: "",
      ItemTaxPercent: "",
      BasePrice: ["", Validators.required],
      ItemLocalCurrencyCode: this.CustomerCurrencyCode,
      ItemExchangeRate: "",
      ItemBaseCurrencyCode: "",
      ItemLocalCurrencySymbol: this.CustomerCurrencySymbol,
      BaseRate: "",
      BaseTax: "",
      ShippingCharge: 0,
      BaseShippingCharge: 0,
      VendorQuoteInfo: new FormArray([this.Createvendor()]),
    });
  }

  public addPart(): void {
    // const control = <FormArray>this.AddFormControl.QuoteItem;
    // control.push(this.initPart());
    this.quoteItem().push(this.initPart());
  }

  Createvendor(): FormGroup {
    return this.fb.group({
      Vendor: [""],
      VendorId: ["", Validators.required],
      Price: ["", Validators.required],
      LeadTime: [""],
      Rate: ["", Validators.required],
      Quantity: [1, Validators.required],
      VendorAttachment: [
        "",
        [
          RxwebValidators.extension({
            extensions: [
              "png",
              "jpeg",
              "jpg",
              "gif",
              "xlsx",
              "pdf",
              "doc",
              "docx",
              "xls",
            ],
          }),
        ],
      ],
      AttachmentMimeType: [""],
      PartNo: [""],
      Description: [""],
      PartId: [""],
      WebLink: [""],
      Tax: "",
      ItemTaxPercent: "",
      BasePrice: ["", Validators.required],
      ItemLocalCurrencyCode: "",
      ItemExchangeRate: "",
      ItemBaseCurrencyCode: "",
      ItemLocalCurrencySymbol: "",
      BaseRate: "",
      BaseTax: "",
      ShippingCharge: 0,
      BaseShippingCharge: 0,
    });
  }
  addvendor(venIndex: number) {
    // const control = <FormArray>this.AddFormControl.Vendor;
    // control.push(this.Createvendor());
    this.getVendor(venIndex).push(this.Createvendor());
  }
  removeVendor(i: number, j: number) {
    this.getVendor(i).removeAt(j);
  }

  getVendor(venIndex: number): FormArray {
    return this.quoteItem().at(venIndex).get("VendorQuoteInfo") as FormArray;
  }

  quoteItem(): FormArray {
    return this.AddForm.get("LineItem") as FormArray;
  }
  get QuoteItem(): FormArray {
    return this.AddForm.get("LineItem") as FormArray;
  }
  VendorQuoteInfo(venIndex): FormArray {
    return this.quoteItem().at(venIndex).get("VendorQuoteInfo") as FormArray;
  }
  removePart(i: number) {
    var partId = this.QuoteItem.controls[i].get("PartId").value;
    if (partId > 0) {
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
          this.QuoteItem.removeAt(i);
          this.changeStatus(i);
          var postData = {
            QuoteItemId: partId,
          };
          this.commonService
            .postHttpService(postData, "RRCustomerQuoteDelete")
            .subscribe((response) => {
              if (response.status == true) {
                /*  Swal.fire({
                 title: 'Deleted!',
                 text: 'Part has been deleted.',
                 type: 'success'
               }); */
              }
            });
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          /* Swal.fire({
            title: 'Cancelled',
            text: 'Part is safe:)',
            type: 'error'
          }); */
        }
      });
    } else {
      this.QuoteItem.removeAt(i);
    }
  }

  changeStatus(index) {
    var subTotal = 0;
    // Calculate the subtotal
    for (let i = 0; i < this.QuoteItem.length; i++) {
      //if (this.QuoteItemList.controls[i].get('IsIncludeInQuote').value == 1) {
      subTotal += this.QuoteItem.controls[i].get("Price").value;
      //}
    }
    this.SubTotal = subTotal;
    this.AddForm.patchValue({ TotalValue: this.SubTotal });
    // //this.EditForm.patchValue({ TotalTax: (this.SubTotal * 5 / 100).toFixed(2) });
    //this.AddForm.patchValue({ TotalTax: (this.SubTotal * this.AddForm.value.TaxPercent / 100).toFixed(2) });
    this.calculateTotal();
  }

  getTermList() {
    this.commonService.getHttpService("getTermsList").subscribe(
      (response) => {
        if (response.status == true) {
          this.TermsList = response.responseData;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  getCustomerProperties(CustomerId, event) {
    // this.PriorityNotes = event.PriorityNotes || '';
    if (!CustomerId) {
      this.assetList = [];
      this.customerReferenceList = [];
      return false;
    }
    var postData = { CustomerId: CustomerId };

    var postData1 = {
      IdentityId: CustomerId,
      IdentityType: 1,
      Type: CONST_BillAddressType,
    };
    //CustomerAddressLoad
    this.commonService
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

        this.AddForm.patchValue({
          CustomerBillToId: BillingAddress[0].AddressId,
        });
        this.AddForm.patchValue({
          TermsId: info[0].TermsId,
        });
        this.AddForm.patchValue({
          TaxType: info[0].TaxType || 3,
        });
      });
    var postData2 = {
      IdentityId: CustomerId,
      IdentityType: 1,
      Type: CONST_ShipAddressType,
    };
    //CustomerAddressLoad
    this.commonService
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
        this.AddForm.patchValue({
          CustomerShipToId: ShippingAddress[0].AddressId,
        });
      });
  }
  //AutoComplete for customer
  selectCustomerEvent($event) {
    this.getCustomerProperties($event.CustomerId, $event.PriorityNotes);
    this.AddForm.patchValue({
      CustomerId: $event.CustomerId,
    });
    this.CustomerId = $event.CustomerId;
    for (var i = 0; i <= this.QuoteItem.length; i++) {
      const formGroup = this.QuoteItem.controls[i] as FormGroup;
      this.CustomerCurrencySymbol = $event.CurrencySymbol;
      this.CustomerCurrencyCode = $event.CustomerCurrencyCode;
      this.CustomerLocation = $event.CustomerLocation;
      this.CustomerVatTax = $event.VatTaxPercentage;
      formGroup.controls["ItemLocalCurrencySymbol"].patchValue(
        this.CustomerCurrencySymbol
      );
      formGroup.controls["ItemLocalCurrencyCode"].patchValue(
        this.CustomerCurrencyCode
      );
      formGroup.controls["ItemBaseCurrencyCode"].patchValue(
        localStorage.getItem("BaseCurrencyCode")
      );
    }
  }

  clearEventCustomer($event) {
    this.AddForm.patchValue({
      CustomerId: "",
      Customer: "",
    });
    this.CustomerId = "";
    for (var i = 0; i <= this.QuoteItem.length; i++) {
      const formGroup = this.QuoteItem.controls[i] as FormGroup;
      this.CustomerCurrencySymbol = "";
      formGroup.controls["ItemLocalCurrencySymbol"].patchValue("");
      this.CustomerCurrencyCode = "";
      this.CustomerLocation = "";
      this.CustomerVatTax = "";
      formGroup.controls["ItemLocalCurrencySymbol"].patchValue("");
      formGroup.controls["ItemBaseCurrencyCode"].patchValue("");
    }
  }
  onChangeCustomerSearch(val: string) {
    if (val) {
      this.isLoadingCustomer = true;
      var postData = {
        Customer: val,
      };
      this.commonService
        .postHttpService(postData, "getAllAutoComplete")
        .subscribe(
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

  loadParts() {
    this.parts$ = concat(
      of([
        {
          PartId: 0,
          PartNo: "+ Add New",
        },
      ]), // default items
      this.partsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        // tap(() => this.moviesLoading = true),
        switchMap((term) => {
          return this.searchParts(term).pipe(
            catchError(() => of([])) // empty list on error
            // tap(() => this.moviesLoading = false)
          );
        })
      )
    );
  }

  searchParts(term: string = ""): Observable<any> {
    var postData = {
      PartNo: term,
    };
    return this.commonService
      .postHttpService(postData, "SearchNonRepairPartByPartNo")
      .pipe(
        map((response) => {
          response.responseData.unshift({
            PartId: 0,
            PartNo: "+ Add New",
          });
          return response.responseData;
        })
      );
  }

  loadVendors() {
    this.Vendors$ = concat(
      of([]), // default items
      this.VendorsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        // tap(() => this.moviesLoading = true),
        switchMap((term) => {
          return this.searchVendors(term).pipe(
            catchError(() => of([])) // empty list on error
            // tap(() => this.moviesLoading = false)
          );
        })
      )
    );
  }

  searchVendors(term: string = ""): Observable<any> {
    var postData = {
      Vendor: term,
    };
    return this.commonService
      .postHttpService(postData, "getAllAutoCompleteofVendorMRO")
      .pipe(
        map((response) => {
          return response.responseData;
        })
      );
  }
  selectVendorEvent(item, i, j) {
    const formGroup = this.VendorQuoteInfo(i).controls[j] as FormGroup;
    const formGroup1 = this.QuoteItem.controls[i] as FormGroup;
    const IBCC = localStorage.getItem("BaseCurrencyCode");
    if (formGroup1.value.PartId != "") {
      if (item != null) {
        formGroup1.controls["ItemBaseCurrencyCode"].patchValue(IBCC);
        formGroup.controls["Vendor"].patchValue(item.VendorName);
        formGroup.controls["ItemLocalCurrencySymbol"].patchValue(
          item.CurrencySymbol
        );
        formGroup.controls["ItemLocalCurrencyCode"].patchValue(
          item.VendorCurrencyCode
        );
        formGroup.controls["ItemBaseCurrencyCode"].patchValue(IBCC);
        formGroup.controls["VendorId"].patchValue(item.VendorId);
        formGroup.controls["PartNo"].patchValue(formGroup1.value.PartNo);
        formGroup.controls["PartId"].patchValue(formGroup1.value.PartId);
        formGroup.controls["Description"].patchValue(
          this.getReplace(formGroup1.value.PartDescription)
        );
        this.VendorLocation = item.VendorLocation;
        this.VendorVatTax = item.VatTaxPercentage;
        var PartId = formGroup1.value.PartId;
        var VendorId = item.VendorId;
        this.VendorCurrencyCode = item.VendorCurrencyCode;
        this.onExchangeRateVendorChanges(PartId, VendorId, i, j);
      } else {
        this.clearVendorEvent(item, i, j);
      }
    } else {
      formGroup.controls["Vendor"].setValue("");
      Swal.fire({
        type: "info",
        title: "Message",
        text: `Please Choose the Part Before Select Vendor`,
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }
  clearVendorEvent(item, i, j) {
    //alert('clear')
    const formGroup = this.VendorQuoteInfo(i).controls[j] as FormGroup;
    // const formGroup = this.QuoteItem.controls[index] as FormGroup;
    formGroup.controls["PartNo"].setValue("");
    formGroup.controls["PartId"].setValue("");
    formGroup.controls["Description"].setValue("");
    formGroup.controls["VendorId"].setValue("");
    formGroup.controls["ItemLocalCurrencySymbol"].setValue("");
    formGroup.controls["ItemLocalCurrencyCode"].setValue("");
    formGroup.controls["ItemBaseCurrencyCode"].setValue("");
    formGroup.controls["Vendor"].setValue("");
    this.VendorLocation = "";
    this.VendorVatTax = "";
    this.VendorCurrencyCode = "";
  }

  onChangeCustomerFromRRSearch(val: string) {
    if (val) {
      this.isLoadingCustomer = true;
      var postData = {
        Customer: val,
      };
      this.commonService
        .postHttpService(postData, "getAllAutoComplete")
        .subscribe(
          (response) => {
            if (response.status == true) {
              var data = response.responseData;
              this.CustomersList = data.filter((a) =>
                a.CompanyName.toLowerCase().includes(val.toLowerCase())
              );

              this.selectCustomerRREvent(this.CustomerId);
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
  selectCustomerRREvent($event) {
    this.AddForm.patchValue({
      CustomerId: $event,
      Customer: this.CustomerName,
    });
    this.getCustomerProperties($event, $event.PriorityNotes);
    for (var i = 0; i <= this.QuoteItem.length; i++) {
      const formGroup = this.QuoteItem.controls[i] as FormGroup;
      this.CustomerCurrencySymbol = $event.CurrencySymbol;
      this.CustomerCurrencyCode = $event.CustomerCurrencyCode;
      this.CustomerLocation = $event.CustomerLocation;
      this.CustomerVatTax = $event.VatTaxPercentage;
      formGroup.controls["ItemLocalCurrencySymbol"].patchValue(
        this.CustomerCurrencySymbol
      );
      formGroup.controls["ItemLocalCurrencyCode"].patchValue(
        this.CustomerCurrencyCode
      );
      formGroup.controls["ItemBaseCurrencyCode"].patchValue(
        localStorage.getItem("BaseCurrencyCode")
      );
    }
    this.CustomerId = $event;
  }

  onExchangeRateCustomerChanges(PartId, CustomerId, i) {
    var postData = { PartId: PartId, CustomerId: CustomerId };
    this.commonService
      .postHttpService(postData, "getPartDetails")
      .subscribe((response) => {
        this.CustomerExchangeRate = response.responseData[0].ExchangeRate;
        if (
          this.CustomerCurrencyCode != localStorage.getItem("BaseCurrencyCode")
        ) {
          if (this.CustomerExchangeRate == null) {
            Swal.fire({
              type: "info",
              title: "Message",
              text: `Exchange rate is not available for ${this.CustomerCurrencyCode} to USD. Please contact admin to create a quote`,
              confirmButtonClass: "btn btn-confirm mt-2",
            });
            const formGroup1 = this.QuoteItem.controls[i] as FormGroup;
            formGroup1.controls["Part"].patchValue("");
          } else {
            const formGroup = this.QuoteItem.controls[i] as FormGroup;
            formGroup.controls["ItemExchangeRate"].patchValue(
              this.CustomerExchangeRate
            );
            if (localStorage.getItem("Location") == this.CustomerLocation) {
              if (response.responseData[0].PartVatTaxPercentage != null) {
                formGroup.controls["ItemTaxPercent"].patchValue(
                  response.responseData[0].PartVatTaxPercentage
                );
              } else {
                formGroup.controls["ItemTaxPercent"].patchValue(
                  this.CustomerVatTax
                );
              }
            } else {
              formGroup.controls["ItemTaxPercent"].patchValue("0");
            }
            this.calculatePrice(i);
          }
        } else {
          this.CustomerExchangeRate = "1";
          const formGroup = this.QuoteItem.controls[i] as FormGroup;
          formGroup.controls["ItemExchangeRate"].patchValue(
            this.CustomerExchangeRate
          );

          if (localStorage.getItem("Location") == this.CustomerLocation) {
            if (response.responseData[0].PartVatTaxPercentage != null) {
              formGroup.controls["ItemTaxPercent"].patchValue(
                response.responseData[0].PartVatTaxPercentage
              );
            } else {
              formGroup.controls["ItemTaxPercent"].patchValue(
                this.CustomerVatTax
              );
            }
          } else {
            formGroup.controls["ItemTaxPercent"].patchValue("0");
          }
          this.calculatePrice(i);
        }
      });
  }

  onExchangeRateVendorChanges(PartId, VendorId, i, j) {
    var postData = { PartId: PartId, VendorId: VendorId };
    this.commonService
      .postHttpService(postData, "getPartDetails")
      .subscribe((response) => {
        this.VendorExchangeRate = response.responseData[0].ExchangeRate;
        if (
          this.VendorCurrencyCode != localStorage.getItem("BaseCurrencyCode")
        ) {
          if (this.VendorExchangeRate == null) {
            Swal.fire({
              type: "info",
              title: "Message",
              text: `Exchange rate is not available for ${this.VendorCurrencyCode} to USD. Please contact admin to create a quote`,
              confirmButtonClass: "btn btn-confirm mt-2",
            });
            const formGroup1 = this.QuoteItem.controls[i] as FormGroup;
            formGroup1.controls["Part"].patchValue("");
          } else {
            const formGroup = this.VendorQuoteInfo(i).controls[j] as FormGroup;
            formGroup.controls["ItemExchangeRate"].patchValue(
              this.VendorExchangeRate
            );
            if (localStorage.getItem("Location") == this.VendorLocation) {
              if (response.responseData[0].PartVatTaxPercentage != null) {
                formGroup.controls["ItemTaxPercent"].patchValue(
                  response.responseData[0].PartVatTaxPercentage
                );
              } else {
                formGroup.controls["ItemTaxPercent"].patchValue(
                  this.VendorVatTax
                );
              }
            } else {
              formGroup.controls["ItemTaxPercent"].patchValue("0");
            }
            this.calculateVendorPrice(i, j);
          }
        } else {
          this.VendorExchangeRate = "1";
          const formGroup = this.VendorQuoteInfo(i).controls[j] as FormGroup;
          formGroup.controls["ItemExchangeRate"].patchValue(
            this.VendorExchangeRate
          );

          if (localStorage.getItem("Location") == this.VendorLocation) {
            if (response.responseData[0].PartVatTaxPercentage != null) {
              formGroup.controls["ItemTaxPercent"].patchValue(
                response.responseData[0].PartVatTaxPercentage
              );
            } else {
              formGroup.controls["ItemTaxPercent"].patchValue(
                this.VendorVatTax
              );
            }
          } else {
            formGroup.controls["ItemTaxPercent"].patchValue("0");
          }
          this.calculateVendorPrice(i, j);
        }
      });
  }
  //*************Part dropdown************
  clearEvent(item, index) {
    //alert('clear')
    const formGroup = this.QuoteItem.controls[index] as FormGroup;
    formGroup.controls["PartNo"].setValue("");
    formGroup.controls["PartId"].setValue("");
    formGroup.controls["PartDescription"].setValue("");
    formGroup.controls["Part"].setValue("");
  }
  closeEvent(item, index) {
    //alert('close')
  }
  selectEvent(item, i) {
    if (item != null) {
      if (item.PartId == "0") {
        this.openPopup(i);
      } else {
        const formGroup = this.QuoteItem.controls[i] as FormGroup;
        formGroup.controls["PartDescription"].patchValue(
          this.getReplace(item.Description)
        );
        formGroup.controls["PartNo"].patchValue(item.PartNo);
        formGroup.controls["PartId"].patchValue(item.PartId);
        formGroup.controls["Quantity"].patchValue(1);
        formGroup.controls["Rate"].patchValue(
          item.SellingPrice || item.NewPrice
        );
        formGroup.controls["Part"].patchValue(item.PartNo);
        this.onExchangeRateCustomerChanges(item.PartId, this.CustomerId, i);

        this.calculatePrice(i);
      }
    } else {
      this.clearEvent(item, i);
    }
  }

  selectPartRREvent(item, i) {
    if (item != null) {
      if (item.PartId == "0") {
        this.openPopup(i);
      } else {
        const formGroup = this.QuoteItem.controls[i] as FormGroup;
        formGroup.controls["PartDescription"].patchValue(
          this.getReplace(item.Description)
        );
        formGroup.controls["PartNo"].patchValue(item.PartNo);
        formGroup.controls["PartId"].patchValue(item.PartId);
        formGroup.controls["Quantity"].patchValue(1);
        formGroup.controls["Rate"].patchValue(
          item.SellingPrice || item.NewPrice
        );
        formGroup.controls["Part"].patchValue(item.PartNo);
        this.onExchangeRateCustomerChanges(item.PartId, this.CustomerId, i);

        this.calculatePrice(i);
      }
    } else {
      this.clearEvent(item, i);
    }
  }

  openPopup(i) {
    if (
      this.AddForm.value.CustomerId == "" ||
      this.AddForm.value.CustomerId == null
    ) {
      Swal.fire({
        title: "Alert",
        text: "Please select the customer!",
        type: "warning",
      });
      //this.CustomerPONoElement.nativeElement.focus();
      return false;
    } else {
      var CustomerId = this.AddForm.value.CustomerId;
      var MROhidden = true;

      this.modalRef = this.CommonmodalService.show(AddRrPartsComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: { CustomerId, MROhidden },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe((modelResponse) => {
        const formGroup = this.QuoteItem.controls[i] as FormGroup;
        formGroup.controls["PartNo"].setValue("");
        formGroup.controls["PartId"].setValue("");
        formGroup.controls["PartDescription"].setValue("");
        formGroup.controls["Part"].setValue("");

        this.selectEvent(modelResponse.data, i);
      });
    }
  }

  getPartDetails() {
    var postData = { PartId: this.TypePartId };
    this.commonService
      .postHttpService(postData, "getPartDetails")
      .subscribe((response) => {
        this.RRDescription = this.getReplace(
          response.responseData[0].Description
        );

        this.selectPartRREvent(response.responseData[0], 0);
      });
  }
  onChangeSearch(val: string, i) {
    if (val) {
      this.isLoading = true;
      var postData = {
        PartNo: val,
      };
      this.commonService
        .postHttpService(postData, "SearchNonRepairPartByPartNo")
        .subscribe(
          (response) => {
            if (response.status == true) {
              this.data = response.responseData;
              this.filteredData = this.data.filter((a) =>
                a.PartNo.toLowerCase().includes(val.toLowerCase())
              );
            } else {
            }
            this.isLoading = false;
            this.cd_ref.detectChanges();
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
          }
        );
    }
  }
  onFocused(e, i) {
    // do something when input is focused
  }
  //*************Part dropdown************

  validateqty(event, i, j) {
    const formGroup = this.QuoteItem.controls[i] as FormGroup;
    const formGroup1 = this.VendorQuoteInfo(i).controls[j] as FormGroup;
    this.calculateVendorPrice(i, j);
    if (Number(event.target.value) > Number(formGroup.value.Quantity)) {
      Swal.fire({
        title: "Error!",
        text: "Vendor Quantity should not exceed the Customer Quantity",
        type: "warning",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
      event.target.value = "";
      this.qtyerror = true;
      formGroup1.markAsTouched();
    } else {
      this.qtyerror = false;
    }
  }

  calculateVendorPrice(i, j) {
    var price = 0;
    var Tax = 0;
    const formGroup = this.VendorQuoteInfo(i).controls[j] as FormGroup;
    let Quantity = formGroup.controls["Quantity"].value || 0;
    let Rate = formGroup.controls["Rate"].value || 0;
    let ShippingCharge = formGroup.controls["ShippingCharge"].value || 0;
    let VatTax = formGroup.controls["ItemTaxPercent"].value / 100;
    let VatTaxPrice = Rate * VatTax;
    // Calculate the price
    price =
      parseFloat(Quantity) * (parseFloat(Rate) + VatTaxPrice) +
      parseFloat(ShippingCharge);
    let BaseShippingCharge = ShippingCharge * this.VendorExchangeRate;
    formGroup.controls["BaseShippingCharge"].patchValue(
      BaseShippingCharge.toFixed(2)
    );
    Tax = Rate * VatTax;
    formGroup.controls["Price"].patchValue(price.toFixed(2));
    formGroup.controls["Tax"].patchValue(Tax.toFixed(2));
    var TaxLocal = Rate * VatTax;
    let priceUSD = price * this.VendorExchangeRate;
    formGroup.controls["BasePrice"].patchValue(priceUSD.toFixed(2));
    let RateUSD = Rate * this.VendorExchangeRate;
    formGroup.controls["BaseRate"].patchValue(RateUSD.toFixed(2));
    let BaseTaxUSD = TaxLocal * this.VendorExchangeRate;
    formGroup.controls["BaseTax"].patchValue(BaseTaxUSD.toFixed(2));
  }
  validateCustomerqtyFrom($event, i) {
    this.calculatePrice(i);
    const formGroup = this.QuoteItem.controls[i] as FormGroup;
    if ($event.target.value != formGroup.controls["VendorQuantity"].value) {
      this.qtyCustomermessage = "Error";
    } else {
      this.qtyCustomermessage = true;
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.AddForm.valid && !this.qtyerror) {
      this.AddForm.patchValue({
        LocalCurrencyCode: this.CustomerCurrencyCode,
        ExchangeRate: this.CustomerExchangeRate,
        BaseCurrencyCode: localStorage.getItem("BaseCurrencyCode"),
        BaseGrandTotal: this.GrandTotalUSD,
      });
      var postData = this.AddForm.value;
      this.commonService.postHttpService(postData, "createMRO").subscribe(
        (response) => {
          if (response.status == true) {
            Swal.fire({
              title: "Success!",
              text: "MRO saved Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
            this.router.navigate(["/admin/mro/edit"], {
              state: { MROId: response.responseData.MROId },
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: response.message,
              type: "warning",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
    } else {
      Swal.fire({
        type: "error",
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }

  fileProgressMultiple(event: any, k, j) {
    var fileData = event.target.files[0];
    const formData = new FormData();
    var filesarray = event.target.files;
    for (var i = 0; i < filesarray.length; i++) {
      formData.append("files", filesarray[i]);
    }
    this.spinner = true;
    const formGroup = this.VendorQuoteInfo(k).controls[j] as FormGroup;

    // if (formGroup.VendorAttachment.valid == true) {
    this.commonService
      .postHttpImageService(formData, "RRImageupload")
      .subscribe(
        (response) => {
          var imageresult = response.responseData;
          for (var x in imageresult) {
            const formGroup = this.VendorQuoteInfo(k).controls[j] as FormGroup;
            formGroup.controls["VendorAttachment"].patchValue(
              imageresult[x].location
            );
            formGroup.controls["AttachmentMimeType"].patchValue(
              imageresult[x].mimetype
            );
          }
          this.spinner = false;
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
    // }
    // else {
    //   this.spinner = false;
    // }
  }

  //AutoComplete for RR
  selectRREvent($event) {
    this.AddForm.patchValue({
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
      this.commonService.postHttpService(postData, "RRNoAotoSuggest").subscribe(
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
}
