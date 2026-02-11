import { DatePipe } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { concat, Observable, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from "rxjs/operators";
import { CommonService } from "src/app/core/services/common.service";
import {
  Const_Alert_pop_message,
  Const_Alert_pop_title,
  CONST_BillAddressType,
  CONST_ShipAddressType,
  taxtype,
  warranty_list,
  CONST_CREATE_ACCESS,
} from "src/assets/data/dropdown";
import Swal from "sweetalert2";
import { AddAssetComponent } from "../../common-template/add-asset/add-asset.component";
import { AddDepartmentComponent } from "../../common-template/add-department/add-department.component";
import { CustomerReferenceComponent } from "../../common-template/customer-reference/customer-reference.component";

@Component({
  selector: "app-mro-add",
  templateUrl: "./mro-add.component.html",
  styleUrls: ["./mro-add.component.scss"],
})
export class MroAddComponent implements OnInit {
  keyword = "PartNo";
  filteredData: any[];
  isLoading: boolean = false;
  data = [];
  selectPart;
  WarrantyPeriod: any;
  SubTotal: any;
  AdditionalCharge: any;
  Discount: any;
  GrandTotal: any;

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
  RRId;

  parts$: Observable<any> = of([]);
  partsInput$ = new Subject<string>();
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
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "MRO", path: "/" },
      { label: "Add", path: "/mro/add", active: true },
    ];
    //this.selectValue = ['Alaska', 'Hawaii', 'California', 'Nevada', 'Oregon', 'Washington', 'Arizona', 'Colorado', 'Idaho', 'Montana', 'Nebraska', 'New Mexico', 'North Dakota', 'Utah', 'Wyoming', 'Alabama', 'Arkansas', 'Illinois', 'Iowa'];

    if (this.IsMROCreate) {
      this.Type = history.state.Type;
      this.TypePartId = history.state.PartId;
      this.TypePartItemId = history.state.PartItemId;
      this.TypePartNo = history.state.PartNo;
      this.RRId = history.state.RRId;
      this.CustomerId = history.state.CustomerId;
      this.loadParts();

      this.AddForm = this.fb.group({
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
        QuoteItem: this.fb.array([
          this.fb.group({
            Part: [""],
            PartNo: [""],
            PartDescription: [""],
            LeadTime: [""],
            Quantity: [1],
            Rate: [""],
            Price: [""],
            PartId: [""],
            WarrantyPeriod: [""],
            PON: [""],
          }),
        ]),
      });

      this.warrantyList = warranty_list;
      this.taxType = taxtype;

      this.getTermList();
      this.getAdminList();

      if (this.Type == "RR") {
        this.getCustomerProperties(this.CustomerId, null);
        this.getPartInfoFromRR(this.TypePartNo, 0);
      }

      if (this.Type == "MRO") {
        this.getPartInfo(this.TypePartItemId, 0);
      }
    }
  }

  getPartInfoFromRR(PartNo, i) {
    var postData = { PartNo: PartNo };
    const formGroup = this.QuoteItem.controls[i] as FormGroup;

    this.commonService
      .postHttpService(postData, "getcheckMROPartsAvailability")
      .subscribe((response) => {
        formGroup.controls["PartDescription"].patchValue(
          response.responseData[0].Description
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
          Description: response.responseData[0].Description,
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
          response.responseData[0].Description
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
          Description: response.responseData[0].Description,
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
      const formGroup = this.QuoteItem.controls[i] as FormGroup;
      formGroup.controls["PartDescription"].patchValue(item.Description);
      formGroup.controls["PartNo"].patchValue(item.PartNo);
      formGroup.controls["PartId"].patchValue(item.PartId);
      this.selectPart = true;
      formGroup.controls["Quantity"].patchValue(1);
      formGroup.controls["Rate"].patchValue(item.SellingPrice);
      formGroup.controls["PON"].patchValue(item.Price);
      this.calculatePrice(i);
    } else {
      this.clearEvent(item, i);
    }

    // this.AddForm.patchValue({
    //   "Description": item.Description
    // })
    // this.PartId = item.PartId
    // var postData = { PartNo: item.PartNo };

    // this.commonService.postHttpService(postData, 'SearchNonRepairPartByPartNo').subscribe(response => {
    //   formGroup.controls['PartDescription'].patchValue(response.responseData[0].Description);
    //   formGroup.controls['PartNo'].patchValue(response.responseData[0].PartNo);
    //   formGroup.controls['PartId'].patchValue(response.responseData[0].PartId);
    //   formGroup.controls['Quantity'].patchValue(1);
    //   formGroup.controls['Rate'].patchValue(response.responseData[0].SellingPrice);
    //   formGroup.controls['PON'].patchValue(response.responseData[0].Price);

    // });
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

  onSubmit(AddForm) {
    this.submitted = true;
    if (this.AddForm.valid && this.selectPart != "Error") {
      let obj = this;

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
              state: { MROId: response.responseData.data },
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "MRO could not be saved!",
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

  getCustomerList() {
    this.commonService
      .getHttpService("getCustomerListDropdown")
      .subscribe((response) => {
        this.customerInfo = response.responseData;
        this.customerList = response.responseData.map(function (value) {
          return {
            title: value.CompanyName,
            CustomerId: value.CustomerId,
            PriorityNotes: value.PriorityNotes,
          };
        });
      });
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

  getAdminList() {
    this.commonService.getHttpService("getUserList").subscribe((response) => {
      //getAdminListDropdown
      this.adminList = response.responseData.map(function (value) {
        return {
          title: value.FirstName + " - " + value.LastName,
          UserId: value.UserId,
        };
      });
    });
  }

  viewRR(RRId) {
    this.router.navigate(["/admin/repair-request/edit"], {
      state: { RRId: RRId },
    });
  }

  getDepartmentDetails(DepartmentId) {
    var IdentityId = this.CustomerId;

    // Quote for Add New
    if (DepartmentId == 0) {
      this.modalRef = this.CommonmodalService.show(AddDepartmentComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: { IdentityId },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe((modelResponse) => {
        // Update the Customer Department List
        this.departmentNewList = [];
        this.departmentList = [];
        var postData = { CustomerId: IdentityId };
        this.commonService
          .postHttpService(postData, "getCustomerDepartmentListDropdown")
          .subscribe((response) => {
            this.departmentNewList.push({
              DepartmentId: 0,
              DepartmentName: "+ Add New",
            });
            for (var i in response.responseData) {
              this.departmentNewList.push({
                DepartmentId: response.responseData[i].CustomerDepartmentId,
                DepartmentName: response.responseData[i].CustomerDepartmentName,
              });
            }
            this.departmentList = this.departmentNewList;
          });
        this.DepartmentId = modelResponse.data.CustomerDepartmentId;
      });
    }
  }

  getAssetDetails(AssetId) {
    var IdentityId = this.CustomerId;

    // Quote for Add New
    if (AssetId == 0) {
      this.modalRef = this.CommonmodalService.show(AddAssetComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: { IdentityId },
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe((modelResponse) => {
        // Update the Customer Asset List
        this.assetNewList = [];
        this.assetList = [];
        var postData = { CustomerId: IdentityId };
        this.commonService
          .postHttpService(postData, "getAssetListDropdown")
          .subscribe((response) => {
            this.assetNewList.push({ AssetId: 0, AssetName: "+ Add New" });
            for (var i in response.responseData) {
              this.assetNewList.push({
                AssetId: response.responseData[i].CustomerAssetId,
                AssetName: response.responseData[i].CustomerAssetName,
              });
            }
            this.assetList = this.assetNewList;
          });
        this.AssetId = modelResponse.data.CustomerAssetId;
      });
    }
  }

  getCustomerProperties(CustomerId, event) {
    // this.PriorityNotes = event.PriorityNotes || '';
    if (!CustomerId) {
      this.assetList = [];
      this.customerReferenceList = [];
      return false;
    }
    var postData = { CustomerId: CustomerId };

    //departmentList dropdown
    this.departmentNewList = [];
    this.departmentList = [];
    this.commonService
      .postHttpService(postData, "getCustomerDepartmentListDropdown")
      .subscribe((response) => {
        this.departmentNewList.push({
          DepartmentId: 0,
          DepartmentName: "+ Add New",
        });
        for (var i in response.responseData) {
          this.departmentNewList.push({
            DepartmentId: response.responseData[i].CustomerDepartmentId,
            DepartmentName: response.responseData[i].CustomerDepartmentName,
          });
        }
        this.departmentList = this.departmentNewList;
      });

    //assetList dropdown
    this.assetNewList = [];
    this.assetList = [];
    this.commonService
      .postHttpService(postData, "getAssetListDropdown")
      .subscribe((response) => {
        this.assetNewList.push({ AssetId: 0, AssetName: "+ Add New" });
        for (var i in response.responseData) {
          this.assetNewList.push({
            AssetId: response.responseData[i].CustomerAssetId,
            AssetName: response.responseData[i].CustomerAssetName,
          });
        }
        this.assetList = this.assetNewList;
      });

    // Customer Parts List
    this.partNewList = [];
    this.partList = [];
    this.commonService
      .postHttpService(postData, "getPartListDropdown")
      .subscribe((response) => {
        this.partNewList.push({ PartId: 0, PartNo: "+ Add New" });
        for (var i in response.responseData) {
          this.partNewList.push({
            PartId: response.responseData[i].PartId,
            PartNo: response.responseData[i].PartNo,
          });
        }
        this.partList = this.partNewList;
      });

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

    //referenceList dropdown
    this.commonService
      .postHttpService(postData, "getCustomerReferenceListDropdown")
      .subscribe((response) => {
        this.customerReferenceList = response.responseData;
      });
  }

  calculatePrice(index) {
    var price = 0;
    var subTotal = 0;
    const formGroup = this.QuoteItem.controls[index] as FormGroup;
    let Quantity = formGroup.controls["Quantity"].value || 0;
    let Rate = formGroup.controls["Rate"].value || 0;

    // Calculate the price
    price = parseFloat(Quantity) * parseFloat(Rate);
    formGroup.controls["Price"].patchValue(price);

    // Calculate the subtotal
    for (let i = 0; i < this.QuoteItem.length; i++) {
      subTotal += this.QuoteItem.controls[i].get("Price").value;
    }
    this.SubTotal = subTotal;
    this.AddForm.patchValue({ TotalValue: this.SubTotal });
    //this.EditForm.patchValue({ TotalTax: (this.SubTotal * 5 / 100).toFixed(2) });
    this.AddForm.patchValue({
      TotalTax: ((this.SubTotal * this.AddForm.value.TaxPercent) / 100).toFixed(
        2
      ),
    });
    this.calculateTotal();
  }

  calculateTotal() {
    var total = 0;
    let AdditionalCharge = this.AddForm.value.ProcessFee || 0;
    let Shipping = this.AddForm.value.ShippingFee || 0;
    let Discount = this.AddForm.value.Discount || 0;

    total =
      parseFloat(this.AddForm.value.TotalValue) +
      parseFloat(this.AddForm.value.TotalTax) +
      parseFloat(AdditionalCharge) +
      parseFloat(Shipping) -
      parseFloat(Discount);
    this.GrandTotal = parseFloat(total.toFixed(2));
    this.AddForm.patchValue({ GrandTotal: this.GrandTotal });
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
      LeadTime: [""],
      Quantity: [1],
      Rate: [""],
      Price: [""],
      PartId: [""],
      WarrantyPeriod: [""],
      PON: [""],
    });
  }

  public addPart(): void {
    const control = <FormArray>this.AddFormControl.QuoteItem;
    control.push(this.initPart());
  }

  get QuoteItem(): FormArray {
    return this.AddForm.get("QuoteItem") as FormArray;
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
    //this.EditForm.patchValue({ TotalTax: (this.SubTotal * 5 / 100).toFixed(2) });
    this.AddForm.patchValue({
      TotalTax: ((this.SubTotal * this.AddForm.value.TaxPercent) / 100).toFixed(
        2
      ),
    });
    this.calculateTotal();
  }
  //AutoComplete for customer
  selectCustomerEvent($event) {
    this.getCustomerProperties($event.CustomerId, $event.PriorityNotes);
    this.AddForm.patchValue({
      CustomerId: $event.CustomerId,
    });
    this.CustomerId = $event.CustomerId;
  }

  clearEventCustomer($event) {
    this.AddForm.patchValue({
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
      of([]), // default items
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
          return response.responseData;
        })
      );
  }
}
