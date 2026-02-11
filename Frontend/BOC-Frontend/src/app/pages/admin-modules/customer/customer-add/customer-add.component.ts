/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */

import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ChangeDetectorRef,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Lightbox } from "ngx-lightbox";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { CustomvalidationService } from "src/app/core/services/customvalidation.service";
import { AddressComponent } from "../../common-template/address/address.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { CommonService } from "src/app/core/services/common.service";
import {
  customergroup,
  customertype,
  terms,
  taxtype,
  attachment_thumb_images,
  CONST_VIEW_ACCESS,
  CONST_CREATE_ACCESS,
  Const_Alert_pop_title,
  Const_Alert_pop_message,
} from "src/assets/data/dropdown";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { AddressData } from "../../vendor/vendor-add/vendor-add.component";
import { Observable, of, Subject, concat } from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  debounceTime,
  switchMap,
  map,
} from "rxjs/operators";

@Component({
  selector: "app-customer-add",
  templateUrl: "./customer-add.component.html",
  styleUrls: ["./customer-add.component.scss"],
})
export class CustomerAddComponent implements OnInit {
  fileData;
  message = "";
  selectedFiles: File[] | any[] = [];
  title;
  displayRemoveIcon = false;
  btnDisabled: boolean = false;
  spinner: boolean = false;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  CustomerAddForm: FormGroup;
  submitted = false;
  countryList;
  customerGroupList: any = [];
  countryListWithSymbol;
  CustomerGroup;
  CustomerType;
  Terms;
  TaxType;
  StateList;
  UserList;
  uploadedpath;
  Status;
  AttachmentList: any = [];
  url: any = [];
  imageresult;
  AttachmentDesc;
  ProfilePhoto;
  Attachment;
  AttachmentMimeType;
  AttachmentOriginalFile;
  AttachmentSize;
  CountryId;
  attachmentThumb;
  TermsList: any = [];
  IsAddEnabled;
  IsAddCusRefEnabled;
  vendors$: Observable<any> = of([]);
  vendorsInput$ = new Subject<string>();
  loadingVendors: boolean = false;
  VendorsList: any[] = [];
  CustomerCurrencyCode;
  CustomerCurrencyCodeDetails: any;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService
  ) {}

  ngOnInit() {
    document.title = "Customer Add";
    this.title = "Add Customer";
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Customers", path: "/admin/customer/list" },
      { label: "Add", path: "/", active: true },
    ];
    //Validation for Customer Page
    this.IsAddEnabled = this.commonService.permissionCheck(
      "ManageCustomer",
      CONST_CREATE_ACCESS
    );

    this.IsAddCusRefEnabled = this.commonService.permissionCheck(
      "CustomerReference",
      CONST_CREATE_ACCESS
    );

    this.CustomerAddForm = this.fb.group(
      {
        CustomerTypeId: ["", Validators.required],
        Email: ["", [Validators.required, Validators.email]],
        CompanyName: ["", Validators.required],
        BlanketPOLowerLimitPercent: ["", Validators.required],
        CustomerCode: ["", Validators.required],
        TermsId: ["", Validators.required],
        FirstName: ["", Validators.required],
        CustomerIndustry: [""],
        CustomerCountryId: ["", Validators.required],
        CustomerGroupId: [""],
        Website: [""],
        Notes: [""],
        CustomerPONotes: [""],
        PriorityNotes: [""],
        IsLaborOnInvoice: [false],
        IsDisplayPOInQR: [false],
        TaxType: ["", Validators.required],
        Status: [true],
        GroupId: ["", Validators.required],
        ProfilePhoto: [""],
        Username: ["", Validators.required],
        Password: [
          "",
          Validators.compose([
            Validators.required,
            this.customValidator.patternValidator(),
          ]),
        ],
        ConfirmPassword: ["", [Validators.required]],
        UserId: ["", Validators.required],
        UPSUsername: [""],
        UPSPassword: [""],
        UPSAccessLicenseNumber: [""],
        UPSShipperNumber: [""],
        CustomerLocation: ["", Validators.required],
        CustomerCurrencyCode: [""],
        CustomerVATNo: [""],
        AddressList: this.fb.array([
          this.fb.group({
            IdentityType: "1",
            StreetAddress: ["", Validators.required],
            SuiteOrApt: [""],
            CountryId: ["", Validators.required],
            StateId: ["", Validators.required],
            City: ["", Validators.required],
            Zip: ["", Validators.required],
            PhoneNoPrimary: ["", Validators.required],
            PhoneNoSecondary: [""],
            Fax: [""],
            IsContactAddress: ["1"],
            IsShippingAddress: ["1"],
            IsBillingAddress: ["1"],
          }),
        ]),
        CustomerAttachmentList: this.fb.array([
          this.fb.group({
            files: [""],
            Description: [""],
          }),
        ]),
        CReferenceList: this.fb.array([
          // this.fb.group({
          //   CReferenceName: ['', Validators.required]
          // })
          this.initRef(1),
        ]),
        DirectedVendors: [""],
      },
      {
        validator: this.customValidator.MatchPassword(
          "Password",
          "ConfirmPassword"
        ),
      }
    );

    this.formSubscribe();

    //dropdownList
    this.getCountryList();
    this.getCustomerGroupList();
    this.getCountryListWithSymbol();
    this.getUserList();
    this.getTermList();
    this.loadVendors();
    this.CustomerGroup = customergroup;
    this.CustomerType = customertype;
    this.TaxType = taxtype;
    this.attachmentThumb = attachment_thumb_images;
  }
  getCustomerCurrencyCode(e) {
    var postData = {
      CountryId: e.target.value,
    };
    this.commonService.postHttpService(postData, "getCurrencyCode").subscribe(
      (response) => {
        if (response.status == true) {
          // console.log(response.responseData)
          this.CustomerCurrencyCode = response.responseData.CurrencyCode;
          this.CustomerCurrencyCodeDetails =
            response.responseData.CountryName +
            " - " +
            response.responseData.CurrencyCode +
            " ( " +
            response.responseData.CurrencySymbol +
            " ) ";
          this.CustomerAddForm.patchValue({
            CustomerCurrencyCode: this.CustomerCurrencyCode,
          });
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }
  onCustomerChange($event) {
    this.CustomerAddForm.patchValue({
      CustomerCode: $event.target.value,
    });
  }
  getCountryList() {
    this.commonService.getHttpService("getCountryList").subscribe(
      (response) => {
        if (response.status == true) {
          this.countryList = response.responseData;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }
  getCustomerGroupList() {
    this.commonService.getHttpService("ddCustomerGroup").subscribe(
      (response) => {
        if (response.status) {
          this.customerGroupList = response.responseData;
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }
  getCountryListWithSymbol() {
    this.commonService.getHttpService("getCountryListWithSymbol").subscribe(
      (response) => {
        if (response.status == true) {
          this.countryListWithSymbol = response.responseData;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  getUserList() {
    this.commonService.getHttpService("getAllActiveAdmin").subscribe(
      (response) => {
        if (response.status == true) {
          this.UserList = response.responseData;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
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

  getState(event, CountryId) {
    var postData = {
      CountryId: CountryId,
    };
    this.commonService
      .getHttpServiceStateId(postData, "getStateListDropdown")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.StateList = response.responseData;
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }
  //get Customerform validation control
  get CustomerAddFormControl() {
    return this.CustomerAddForm.controls;
  }

  //Add another address form
  public initAddress(): FormGroup {
    return this.fb.group({
      IdentityType: "1",
      StreetAddress: ["", Validators.required],
      SuiteOrApt: [""],
      CountryId: ["", Validators.required],
      StateId: ["", Validators.required],
      City: ["", Validators.required],
      Zip: ["", Validators.required],
      PhoneNoPrimary: ["", Validators.required],
      PhoneNoSecondary: [""],
      Fax: [""],
      IsContactAddress: [""],
      IsShippingAddress: [""],
      IsBillingAddress: [""],
    });
  }
  public addAddress(): void {
    const control = <FormArray>this.CustomerAddFormControl.AddressList;
    control.push(this.initAddress());
  }
  get address(): FormArray {
    return this.CustomerAddForm.get("AddressList") as FormArray;
  }
  removeAddress(i: number) {
    this.address.removeAt(i);
  }
  //Add Reference
  public initRef(val): FormGroup {
    return this.fb.group({
      CReferenceName: ["", [RxwebValidators.unique()]],
      Rank: [val],
    });
  }
  public addRef(): void {
    // const control = <FormArray>this.CustomerAddFormControl.CReferenceList;
    // control.push(this.initRef());
    let refArray = <FormArray>this.CustomerAddForm.controls.CReferenceList;
    refArray.push(this.initRef(refArray.length + 1));
  }
  get Ref(): FormArray {
    return this.CustomerAddForm.get("CReferenceList") as FormArray;
  }
  removeRef(i: number) {
    this.Ref.removeAt(i);
  }
  formSubscribe() {
    this.CustomerAddForm.valueChanges.subscribe((value: AddressData) => {
      if (this.CustomerAddForm.value.AddressList.length === 1) {
        this.displayRemoveIcon = false;
      } else {
        this.displayRemoveIcon = true;
      }
    });
    this.CustomerAddForm.valueChanges.subscribe((value: AddressData) => {
      if (this.CustomerAddForm.value.CReferenceList.length === 1) {
        this.displayRemoveIcon = false;
      } else {
        this.displayRemoveIcon = true;
      }
    });
  }

  onChange(IsContactAddress: string, isChecked: boolean) {
    const IsContactAddressFormArray = <FormArray>(
      this.CustomerAddForm.controls.AddressList
    );

    if (isChecked) {
      IsContactAddressFormArray.push(new FormControl(IsContactAddress));
    } else {
      let index = IsContactAddressFormArray.controls.findIndex(
        (x) => x.value == IsContactAddress
      );
      IsContactAddressFormArray.removeAt(index);
    }
  }

  // image process
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    const formData = new FormData();
    formData.append("file", this.fileData);
    this.preview();
    this.commonService
      .postHttpImageService(formData, "getuploadCustomerProfile")
      .subscribe(
        (response) => {
          this.uploadedpath = response.responseData.location;
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  preview() {
    // Show preview
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.CustomerAddForm.value.ProfilePhoto = reader.result;
      this.ProfilePhoto = reader.result;
    };
  }

  //Multiple
  fileProgressMultiple(event: any) {
    const formData = new FormData();
    //var fileData = event.target.files;
    var filesarray = event.target.files;
    for (var i = 0; i < filesarray.length; i++) {
      formData.append("files", filesarray[i]);
    }
    this.spinner = true;
    this.commonService
      .postHttpImageService(formData, "getCustomeruploadAttachment")
      .subscribe(
        (response) => {
          this.imageresult = response.responseData;
          this.spinner = false;

          //   for( var y in response){
          // this.url=response[y].path.split('public/')
          //   }
          for (var x in this.imageresult) {
            this.AttachmentList.push({
              IdentityType: "1",
              Attachment: this.imageresult[x].location,
              AttachmentOriginalFile: this.imageresult[x].originalname,
              AttachmentMimeType: this.imageresult[x].mimetype,
              AttachmentSize: this.imageresult[x].size,
              Attachment1: this.imageresult[x].location,
            });
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  onSubmit() {
    this.submitted = true;
    if (this.CustomerAddForm.valid) {
      this.btnDisabled = true;
      if (this.CustomerAddForm.value.Status == true) {
        this.Status = 1;
      } else {
        this.Status = 0;
      }

      if (this.CustomerAddForm.value.IsDisplayPOInQR == true) {
        var IsDisplayPOInQR = 1;
      } else {
        IsDisplayPOInQR = 0;
      }

      var postData = {
        GroupId: this.CustomerAddForm.value.GroupId,
        BlanketPOLowerLimitPercent:
          this.CustomerAddForm.value.BlanketPOLowerLimitPercent,
        CustomerTypeId: this.CustomerAddForm.value.CustomerTypeId,
        FirstName: this.CustomerAddForm.value.FirstName,
        CustomerCode: this.CustomerAddForm.value.CustomerCode,
        Username: this.CustomerAddForm.value.Username,
        UserId: this.CustomerAddForm.value.UserId,
        Password: this.CustomerAddForm.value.Password,
        ConfirmPassword: this.CustomerAddForm.value.ConfirmPassword,
        CompanyName: this.CustomerAddForm.value.CompanyName,
        TermsId: this.CustomerAddForm.value.TermsId,
        CustomerCountryId: this.CustomerAddForm.value.CustomerCountryId,
        CustomerGroupId: this.CustomerAddForm.value.CustomerGroupId,
        CustomerIndustry: this.CustomerAddForm.value.CustomerIndustry,
        Notes: this.CustomerAddForm.value.Notes,
        CustomerPONotes: this.CustomerAddForm.value.CustomerPONotes,
        PriorityNotes: this.CustomerAddForm.value.PriorityNotes,
        TaxType: this.CustomerAddForm.value.TaxType,
        IsLaborOnInvoice: this.CustomerAddForm.value.IsLaborOnInvoice,
        IsDisplayPOInQR: IsDisplayPOInQR,
        Status: this.Status,
        ProfilePhoto: this.uploadedpath,
        Email: this.CustomerAddForm.value.Email,
        Website: this.CustomerAddForm.value.Website,
        AddressList: this.CustomerAddForm.value.AddressList,
        CReferenceList: this.CustomerAddForm.value.CReferenceList,

        AttachmentList: {
          AttachmentDesc: this.AttachmentDesc,
          AttachmentList: this.AttachmentList,
        },
        DirectedVendors: this.CustomerAddForm.value.DirectedVendors.toString(),
        UPSUsername: this.CustomerAddForm.value.UPSUsername,
        UPSPassword: this.CustomerAddForm.value.UPSPassword,
        UPSAccessLicenseNumber:
          this.CustomerAddForm.value.UPSAccessLicenseNumber,
        UPSShipperNumber: this.CustomerAddForm.value.UPSShipperNumber,
        CustomerLocation: this.CustomerAddForm.value.CustomerLocation,
        CustomerCurrencyCode: this.CustomerAddForm.value.CustomerCurrencyCode,
        CustomerVATNo: this.CustomerAddForm.value.CustomerVATNo,
      };
      this.commonService.addCustomer(postData).subscribe(
        (response) => {
          if (response.status == true) {
            this.router.navigate(["admin/customer/list"]);

            Swal.fire({
              title: "Success!",
              text: "Record saved Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          } else {
            this.btnDisabled = false;
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
      this.btnDisabled = false;
      Swal.fire({
        type: "error",
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }

  loadVendors() {
    this.vendors$ = concat(
      this.searchVendors().pipe(
        // default items
        catchError(() => of([])) // empty list on error
      ),
      this.vendorsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap((term) => {
          if (term != null && term != undefined)
            return this.searchVendors(term).pipe(
              catchError(() => of([])) // empty list on error
            );
          else return of([]);
        })
      )
    );
  }

  searchVendors(term: string = ""): Observable<any> {
    this.loadingVendors = true;
    var postData = {
      Vendor: term,
    };
    return this.commonService
      .postHttpService(postData, "getAllAutoCompleteofVendor")
      .pipe(
        map((response) => {
          this.VendorsList = response.responseData;
          this.loadingVendors = false;
          return response.responseData;
        })
      );
  }

  selectAllVendor() {
    let VendorIdIds = this.VendorsList.map((a) => a.VendorId);
    let cMerge = [
      ...new Set([
        ...VendorIdIds,
        ...this.CustomerAddForm.value.DirectedVendors,
      ]),
    ];
    this.CustomerAddForm.patchValue({ DirectedVendors: cMerge });
  }
}
