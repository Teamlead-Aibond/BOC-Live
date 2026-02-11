/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */

import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { CustomvalidationService } from "src/app/core/services/customvalidation.service";
import {
  FileUploadValidators,
  FileUploadControl,
} from "@iplab/ngx-file-upload";
import { UploadFilesService } from "src/app/core/services/upload-files.service";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { CommonService } from "src/app/core/services/common.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import {
  attachment_thumb_images,
  CONST_VIEW_ACCESS,
  CONST_CREATE_ACCESS,
  Const_Alert_pop_title,
  Const_Alert_pop_message,
  vendor_class,
} from "src/assets/data/dropdown";

export interface Address {
  StreetAddress: string;
  SuiteOrApt: string;
  CountryId: string;
  StateId: string;
  City: string;
  Zip: string;
  PhoneNoPrimary: string;
  PhoneNoSecondary: string;
  Fax: string;
  IsSetDefault: string;
  AddressType: string;
  // product: Product;
  // productNumber: number;
}
export interface AddressData {
  AddressList: Address[];
}
@Component({
  selector: "app-vendor-add",
  templateUrl: "./vendor-add.component.html",
  styleUrls: ["./vendor-add.component.scss"],
})
export class VendorAddComponent implements OnInit {
  public fileUploadControl = new FileUploadControl(
    FileUploadValidators.fileSize(80000)
  );
  btnDisabled: boolean = false;
  title;
  public multiple: boolean = true;
  public animation: boolean = false;
  urls = [];
  // bread crumb items
  breadCrumbItems: Array<{}>;
  VendorAddForm: FormGroup;
  submitted = false;
  displayRemoveIcon = false;
  displayContactRemoveIcon = false;
  imgresult;
  fileData;
  message = "";
  selectedFiles: File[] | any[] = [];
  progressInfos = [];
  fileInfos: Observable<any>;
  uploadedpath;
  IsAllowQuoteBeforeShip;
  Status;
  IsCorpVendor;
  CODPayment;
  RMARequired;
  IsPOWithoutPricing;
  countryList;
  StateList;
  AttachmentList: any = [];
  url: any = [];
  Attachment;
  AttachmentDesc;
  AttachmentOriginalFile;
  AttachmentMimeType;
  AttachmentSize;
  imageresult;
  attachmentThumb;
  CompanyLogo;
  CountryId;
  TermsList: any = [];
  VendorClassList: any = [];
  IsAddEnabled;
  spinner: boolean = false;
  CurrencyList: any = [];
  VendorCurrencyCode;
  VendorCurrencyCodeDetails: any;
  countryListWithSymbol: any;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private uploadService: UploadFilesService,
    private customValidator: CustomvalidationService
  ) {}

  ngOnInit() {
    document.title = "Vendor Add";

    this.title = "Add Vendor";
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Vendors", path: "/admin/vendor/list" },
      { label: "Add", path: "/", active: true },
    ];

    this.IsAddEnabled = this.commonService.permissionCheck(
      "ManageVendor",
      CONST_CREATE_ACCESS
    );

    //Validation for Vendor Page
    this.VendorAddForm = this.fb.group(
      {
        VendorCode: ["", Validators.required],
        VendorTypeId: ["", Validators.required],
        VendorClass: ["", Validators.required],
        VendorName: ["", Validators.required],
        TermsId: ["", Validators.required],
        // Currency: ['', Validators.required],
        Email: ["", [Validators.required, Validators.email]],
        Industry: [""],
        VendorCountryId: ["", Validators.required],
        Notes: [""],
        Website: [""],
        Status: [true],
        //IsCorpVendor: [false],
        // IsCorpVendorCode: [''],
        RMARequired: [false],
        IsFlatRateRepair: [false],
        CODPayment: [false],
        CODNotes: [""],
        RMANotes: [""],
        Username: ["", Validators.required],
        Password: [
          "",
          Validators.compose([
            Validators.required,
            this.customValidator.patternValidator(),
          ]),
        ],
        ConfirmPassword: ["", [Validators.required]],
        CompanyLogo: [""],
        IsAllowQuoteBeforeShip: [""],
        ShippingAccountNo: [""],
        SetupInformation: [""],
        PODeliveryMethod: [""],
        PrintFormat: [""],
        IsPOWithoutPricing: [""],
        UPSUsername: [""],
        UPSPassword: [""],
        UPSAccessLicenseNumber: [""],
        UPSShipperNumber: [""],
        VendorLocation: ["", [Validators.required]],
        VendorCurrencyCode: [""],
        ContactList: this.fb.array([
          this.fb.group({
            IdentityType: "2",
            ContactName: ["", Validators.required],
            Email: ["", [Validators.required, Validators.email]],
            DepartmentId: [""],
            Designation: ["", Validators.required],
            PhoneNo: ["", Validators.required],
            IsPrimary: [""],
          }),
        ]),
        AddressList: this.fb.array([
          this.fb.group({
            IdentityType: "2",
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
      },
      {
        validator: this.customValidator.MatchPassword(
          "Password",
          "ConfirmPassword"
        ),
      }
    );

    this.formSubscribe();
    this.getCountryList();
    this.getCountryListWithSymbol();
    this.getTermList();
    this.attachmentThumb = attachment_thumb_images;
    this.VendorClassList = vendor_class;
  }
  getVendorCurrencyCode(e) {
    var postData = {
      CountryId: e.target.value,
    };
    this.commonService.postHttpService(postData, "getCurrencyCode").subscribe(
      (response) => {
        if (response.status == true) {
          this.VendorCurrencyCode = response.responseData.CurrencyCode;
          this.VendorCurrencyCodeDetails =
            response.responseData.CountryName +
            " - " +
            response.responseData.CurrencyCode +
            " ( " +
            response.responseData.CurrencySymbol +
            " ) ";
          this.VendorAddForm.patchValue({
            VendorCurrencyCode: this.VendorCurrencyCode,
          });
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }
  onVendorChange($event) {
    this.VendorAddForm.patchValue({
      VendorCode: $event.target.value,
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
  getCountryList() {
    this.commonService.getconutryList().subscribe(
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
  //get VendorAddForm validation control
  get VendorAddFormControl() {
    return this.VendorAddForm.controls;
  }

  addAttachment(AttachmentContent) {
    this.modalService.open(AttachmentContent, { size: "xl" });
  }

  formSubscribe() {
    this.VendorAddForm.valueChanges.subscribe((value: AddressData) => {
      if (this.VendorAddForm.value.AddressList.length === 1) {
        this.displayRemoveIcon = false;
      } else {
        this.displayRemoveIcon = true;
      }

      if (this.VendorAddForm.value.ContactList.length === 1) {
        this.displayContactRemoveIcon = false;
      } else {
        this.displayContactRemoveIcon = true;
      }
    });
  }

  public initAddress(): FormGroup {
    return this.fb.group({
      IdentityType: "2",
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
    const control = <FormArray>this.VendorAddFormControl.AddressList;
    control.push(this.initAddress());
  }

  public initContact(): FormGroup {
    return this.fb.group({
      IdentityType: "2",
      ContactName: ["", Validators.required],
      Email: ["", [Validators.required, Validators.email]],
      DepartmentId: [""],
      Designation: ["", Validators.required],
      PhoneNo: ["", Validators.required],
      IsPrimary: ["", Validators.required],
    });
  }

  public addContact(): void {
    const control = <FormArray>this.VendorAddFormControl.ContactList;
    control.push(this.initContact());
  }

  selectFiles(event: any) {
    this.selectedFiles.push(event.target.files[0]);
  }

  fileProgressMultiple(event: any) {
    const formData = new FormData();
    //var fileData = event.target.files;
    var filesarray = event.target.files;
    for (var i = 0; i < filesarray.length; i++) {
      formData.append("files", filesarray[i]);
    }
    this.spinner = true;
    this.commonService
      .postHttpImageService(formData, "getVendoruploadAttachment")
      .subscribe(
        (response) => {
          this.imageresult = response.responseData;
          this.spinner = false;

          for (var x in this.imageresult) {
            this.AttachmentList.push({
              IdentityType: "2",
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

  get address(): FormArray {
    return this.VendorAddForm.get("AddressList") as FormArray;
  }
  removeAddress(i: number) {
    this.address.removeAt(i);
  }

  get Contact(): FormArray {
    return this.VendorAddForm.get("ContactList") as FormArray;
  }
  removeContact(i: number) {
    this.Contact.removeAt(i);
  }

  // image process
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    const formData = new FormData();
    formData.append("file", this.fileData);
    this.preview();
    this.commonService
      .postHttpImageService(formData, "getuploadVendorProfile")
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
      this.VendorAddForm.value.CompanyLogo = reader.result;
      this.CompanyLogo = reader.result;
    };
  }

  readFile(event) {
    var selectedFile = event.target.files[0];
    this.imgresult = "File Name: " + selectedFile.name;
    this.imgresult += "<br>File Size(byte): " + selectedFile.size;
    this.imgresult += "<br>File Type: " + selectedFile.type;
  }

  onSubmit() {
    this.submitted = true;
    if (this.VendorAddForm.valid) {
      this.btnDisabled = true;
      if (this.VendorAddForm.value.Status == true) {
        this.Status = 1;
      } else {
        this.Status = 0;
      }
      // if (this.VendorAddForm.value.IsCorpVendor == true) {
      //   this.IsCorpVendor = 1
      // }
      // else {
      //   this.IsCorpVendor = 0
      // }
      if (this.VendorAddForm.value.RMARequired == true) {
        this.RMARequired = 1;
      } else {
        this.RMARequired = 0;
      }

      if (this.VendorAddForm.value.IsFlatRateRepair == true) {
        var IsFlatRateRepair = 1;
      } else {
        IsFlatRateRepair = 0;
      }
      if (this.VendorAddForm.value.CODPayment == true) {
        this.CODPayment = 1;
      } else {
        this.CODPayment = 0;
      }
      if (this.VendorAddForm.value.IsPOWithoutPricing == true) {
        this.IsPOWithoutPricing = 1;
      } else {
        this.IsPOWithoutPricing = 0;
      }
      if (this.VendorAddForm.value.IsAllowQuoteBeforeShip == true) {
        this.IsAllowQuoteBeforeShip = 1;
      } else {
        this.IsAllowQuoteBeforeShip = 0;
      }
      var postData = {
        VendorTypeId: this.VendorAddForm.value.VendorTypeId,
        VendorName: this.VendorAddForm.value.VendorName,
        VendorCode: this.VendorAddForm.value.VendorCode,
        VendorClass: this.VendorAddForm.value.VendorClass,
        TermsId: this.VendorAddForm.value.TermsId,
        // "Currency": this.VendorAddForm.value.Currency,
        Email: this.VendorAddForm.value.Email,
        Industry: this.VendorAddForm.value.Industry,
        VendorCountryId: this.VendorAddForm.value.VendorCountryId,
        Notes: this.VendorAddForm.value.Notes,
        Website: this.VendorAddForm.value.Website,
        Status: this.Status,
        //"IsCorpVendor": this.IsCorpVendor,
        //"IsCorpVendorCode": this.VendorAddForm.value.IsCorpVendorCode,
        CODNotes: this.VendorAddForm.value.CODNotes,
        RMANotes: this.VendorAddForm.value.RMANotes,
        RMARequired: this.RMARequired,
        IsFlatRateRepair: IsFlatRateRepair,
        CODPayment: this.CODPayment,
        CompanyLogo: this.uploadedpath,
        IsAllowQuoteBeforeShip: this.IsAllowQuoteBeforeShip,
        ShippingAccountNo: this.VendorAddForm.value.ShippingAccountNo,
        SetupInformation: this.VendorAddForm.value.SetupInformation,
        PODeliveryMethod: this.VendorAddForm.value.PODeliveryMethod,
        PrintFormat: this.VendorAddForm.value.PrintFormat,
        IsPOWithoutPricing: this.VendorAddForm.value.IsPOWithoutPricing,
        Username: this.VendorAddForm.value.Username,
        Password: this.VendorAddForm.value.Password,
        ConfirmPassword: this.VendorAddForm.value.ConfirmPassword,
        ContactList: this.VendorAddForm.value.ContactList,
        AddressList: this.VendorAddForm.value.AddressList,
        UPSUsername: this.VendorAddForm.value.UPSUsername,
        UPSPassword: this.VendorAddForm.value.UPSPassword,
        UPSAccessLicenseNumber: this.VendorAddForm.value.UPSAccessLicenseNumber,
        UPSShipperNumber: this.VendorAddForm.value.UPSShipperNumber,
        VendorLocation: this.VendorAddForm.value.VendorLocation,
        VendorCurrencyCode: this.VendorAddForm.value.VendorCurrencyCode,
        AttachmentList: {
          AttachmentDesc: this.AttachmentDesc,
          AttachmentList: this.AttachmentList,
        },
      };
      this.commonService.postHttpService(postData, "getVendorAdd").subscribe(
        (response) => {
          if (response.status == true) {
            this.router.navigate(["admin/vendor/list"]);

            Swal.fire({
              title: "Success!",
              text: "Vendor saved Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
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
      this.btnDisabled = false;
      Swal.fire({
        type: "error",
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }
}
