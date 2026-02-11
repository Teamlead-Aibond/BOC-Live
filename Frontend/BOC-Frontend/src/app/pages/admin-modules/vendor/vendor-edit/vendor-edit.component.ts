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

import {
  RepairRequestData,
  PartsData,
  PerformanceData,
  projectData,
  UsersData,
  revenueAreaChart,
  VendorContact,
  CapabilitiesData,
  ContractData,
  VendorCostData,
  cardData,
} from "../vendor-view/data";
import { AddressComponent } from "../../common-template/address/address.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { CommonService } from "src/app/core/services/common.service";
import { EditAddressComponent } from "../../common-template/edit-address/edit-address.component";
import { AttachementComponent } from "../../common-template/attachement/attachement.component";
import Swal from "sweetalert2";
import { ContactAddComponent } from "../../common-template/contact-add/contact-add.component";
import { EditContactComponent } from "../../common-template/edit-contact/edit-contact.component";
import { Router } from "@angular/router";
import {
  attachment_thumb_images,
  Const_Alert_pop_message,
  Const_Alert_pop_title,
  vendor_class,
  CONST_MODIFY_ACCESS,
} from "src/assets/data/dropdown";
import { EditAttachmentComponent } from "../../common-template/edit-attachment/edit-attachment.component";
import { AddUserComponent } from "../../common-template/add-user/add-user.component";
import { EditUserComponent } from "../../common-template/edit-user/edit-user.component";
import { UserChangePasswordComponent } from "../../common-template/user-change-password/user-change-password.component";

@Component({
  selector: "app-vendor-edit",
  templateUrl: "./vendor-edit.component.html",
  styleUrls: ["./vendor-edit.component.scss"],
})
export class VendorEditComponent implements OnInit {
  public fileUploadControl = new FileUploadControl(
    FileUploadValidators.fileSize(80000)
  );
  TermsList: any = [];
  btnDisabled: boolean = false;
  title;
  public multiple: boolean = true;
  public animation: boolean = false;
  urls = [];
  model: any = {};
  // bread crumb items
  breadCrumbItems: Array<{}>;
  VendorEditForm: FormGroup;
  submitted = false;
  displayRemoveIcon = false;
  message = "";
  selectedFiles: File[] | any[] = [];
  progressInfos = [];
  fileInfos: Observable<any>;
  IsContactAddress;
  IsBillingAddress;
  IsShippingAddress;
  viewResult;
  UsersData;
  AddressList;
  StatusId;
  IsCorpVendor;
  RMARequired;
  CODPayment;
  ContactList: any[] = [];
  AddressType;
  IdentityId;
  ImagePath;
  uploadedpath;
  fileData;
  showImagePath: boolean = false;
  Status;
  VendorCode;
  UserName;
  IsCorpVendorCode;
  attachmentThumb;
  AttachmentList: any[] = [];
  UserList: any[] = [];
  VendorClassList: any = [];
  VendorId: any;
  AddressId;
  countryList;
  CustomerId;
  IsAllowQuoteBeforeShip;
  IsPrimary;
  VendorCurrencyCode;
  VendorCurrencyCodeDetails: string;
  countryListWithSymbol: any;
  IsEditVendorIdEnabled: boolean;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    private insidemodalService: NgbModal,
    private commonService: CommonService,
    private cd_ref: ChangeDetectorRef,
    private uploadService: UploadFilesService,
    private customValidator: CustomvalidationService
  ) {}
  currentRouter = this.router.url;

  ngOnInit() {
    document.title = "Vendor Edit";
    this.title = "Edit Vendor";
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Vendors", path: "/admin/vendor/list" },
      { label: "Add", path: "/", active: true },
    ];
    this.IsEditVendorIdEnabled = this.commonService.permissionCheck(
      "EditVendorCode",
      CONST_MODIFY_ACCESS
    );
    this.VendorId = this.navCtrl.get("VendorId");

    // Redirect to the List page if the View Id is not available
    if (
      this.VendorId == "" ||
      this.VendorId == "undefined" ||
      this.VendorId == null
    ) {
      this.navCtrl.navigate("/admin/vendor/list/");
      return false;
    }

    this.UsersData = UsersData;
    this.attachmentThumb = attachment_thumb_images;
    this.VendorClassList = vendor_class;

    //Validation for VendorEdit Page
    this.VendorEditForm = this.fb.group(
      {
        VendorId: ["", Validators.required],
        VendorCode: ["", Validators.required],
        VendorClass: ["", Validators.required],
        VendorTypeId: ["", Validators.required],
        VendorName: ["", Validators.required],
        TermsId: ["", Validators.required],
        // Currency: ['', Validators.required],
        Email: ["", [Validators.required, Validators.email]],
        Industry: [""],
        VendorCountryId: ["", Validators.required],
        Notes: [""],
        Website: [""],
        CODNotes: [""],
        RMANotes: [""],
        Status: [true],
        //IsCorpVendor: [false],
        //IsCorpVendorCode: [''],
        RMARequired: [false],
        IsFlatRateRepair: [false],
        CODPayment: [false],
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
      },
      {
        validator: this.customValidator.MatchPassword(
          "Password",
          "ConfirmPassword"
        ),
      }
    );
    this.getCountryList();
    this.getCountryListWithSymbol();
    this.getTermList();
    this.getViewContent();
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
          this.VendorEditForm.patchValue({
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
    this.VendorEditForm.patchValue({
      VendorCode: $event.target.value,
    });
  }
  reLoad() {
    this.router.navigate([this.currentRouter]);
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

  get VendorEditFormControl() {
    return this.VendorEditForm.controls;
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

  getViewContent() {
    var VendorId = this.navCtrl.get("VendorId");
    var postData = {
      VendorId: VendorId,
    };

    this.commonService.postHttpService(postData, "getVendorView").subscribe(
      (response) => {
        if (response.IsException == null) {
          this.viewResult = response.responseData;
          this.VendorCode = this.viewResult.BasicInfo[0].VendorCode;
          this.UserName = this.viewResult.BasicInfo[0].Username;
          this.IsCorpVendorCode = this.viewResult.BasicInfo[0].IsCorpVendorCode;
          this.IdentityId = this.viewResult.BasicInfo[0].VendorId;
          if (
            this.viewResult.BasicInfo[0].ProfilePhoto === "" ||
            this.viewResult.BasicInfo[0].ProfilePhoto === null
          ) {
            this.showImagePath = false;
          } else {
            this.showImagePath = true;
            this.ImagePath = this.viewResult.BasicInfo[0].ProfilePhoto;
          }
          if (this.viewResult.BasicInfo[0].StatusName == "Active") {
            this.Status = true;
          } else {
            this.Status = false;
          }
          this.AddressList = this.viewResult.AddressList;
          this.ContactList = this.viewResult.ContactList || [];
          this.AttachmentList = this.viewResult.AttachmentList || [];
          this.UserList = this.viewResult.UserList;
          this.VendorEditForm.setValue({
            VendorId: this.viewResult.BasicInfo[0].VendorId,
            VendorClass: this.viewResult.BasicInfo[0].VendorClass,
            VendorTypeId: this.viewResult.BasicInfo[0].VendorTypeId,
            VendorName: this.viewResult.BasicInfo[0].VendorName,
            VendorCode: this.viewResult.BasicInfo[0].VendorCode,
            TermsId: this.viewResult.BasicInfo[0].TermsId,
            // Currency: this.viewResult.BasicInfo[0].Currency,
            Email: this.viewResult.BasicInfo[0].VendorEmail,
            Industry: this.viewResult.BasicInfo[0].Industry,
            VendorCountryId: this.viewResult.BasicInfo[0].VendorCountryId,
            Notes: this.viewResult.BasicInfo[0].Notes,
            Website: this.viewResult.BasicInfo[0].Website,
            Status: this.Status,
            // IsCorpVendor: this.viewResult.BasicInfo[0].IsCorpVendor,
            //IsCorpVendorCode: this.viewResult.BasicInfo[0].IsCorpVendorCode,
            CODNotes: this.viewResult.BasicInfo[0].CODNotes,
            RMANotes: this.viewResult.BasicInfo[0].RMANotes,
            RMARequired: this.viewResult.BasicInfo[0].IsRMARequired,
            IsFlatRateRepair: this.viewResult.BasicInfo[0].IsFlatRateRepair,
            CODPayment: this.viewResult.BasicInfo[0].CODPayment,
            CompanyLogo: this.viewResult.BasicInfo[0].ProfilePhoto,
            IsAllowQuoteBeforeShip:
              this.viewResult.BasicInfo[0].IsAllowQuoteBeforeShip,
            ShippingAccountNo: this.viewResult.BasicInfo[0].ShippingAccountNo,
            SetupInformation: this.viewResult.BasicInfo[0].SetupInformation,
            PODeliveryMethod: this.viewResult.BasicInfo[0].PODeliveryMethodId,
            PrintFormat: this.viewResult.BasicInfo[0].PrintFormatId,
            IsPOWithoutPricing: this.viewResult.BasicInfo[0].IsPOWithoutPricing,
            UPSUsername: this.viewResult.BasicInfo[0].UPSUsername,
            UPSPassword: this.viewResult.BasicInfo[0].UPSPassword,
            UPSAccessLicenseNumber:
              this.viewResult.BasicInfo[0].UPSAccessLicenseNumber,
            UPSShipperNumber: this.viewResult.BasicInfo[0].UPSShipperNumber,
            VendorLocation: this.viewResult.BasicInfo[0].VendorLocation,
            VendorCurrencyCode: this.viewResult.BasicInfo[0].VendorCurrencyCode,
          });
          // console.log(this.viewResult)
          this.VendorCurrencyCode =
            this.viewResult.BasicInfo[0].VendorCurrencyCode;
          this.VendorCurrencyCodeDetails =
            this.viewResult.BasicInfo[0].VendorCountry +
            " - " +
            this.viewResult.BasicInfo[0].VendorCurrencyCode +
            " ( " +
            this.viewResult.BasicInfo[0].VendorCurrencySymbol +
            " ) ";
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  //AddressSection
  addAddress() {
    var IdentityType = "2";
    var IdentityId = this.viewResult.BasicInfo[0].VendorId;
    this.modalRef = this.modalService.show(AddressComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { IdentityType, IdentityId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.AddressList.push(res.data);
    });
  }

  editAddress(Addressdata, i) {
    var IdentityType = 2;
    var IdentityId = this.viewResult.BasicInfo[0].VendorId;
    this.modalRef = this.modalService.show(EditAddressComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { Addressdata, i, IdentityType, IdentityId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.AddressList[i] = res.data;
    });
  }

  deleteAddress(AddressId, i) {
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
          AddressId: AddressId,
        };
        this.commonService
          .postHttpService(postData, "getAddressDelete")
          .subscribe((response) => {
            if (response.status == true) {
              this.AddressList.splice(i, 1);

              Swal.fire({
                title: "Deleted!",
                text: "Address has been deleted.",
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
          text: "Address is safe:)",
          type: "error",
        });
      }
    });
  }

  //ContactSection
  addContact() {
    var IdentityType = "2";
    var IdentityId = this.viewResult.BasicInfo[0].VendorId;
    this.modalRef = this.modalService.show(ContactAddComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { IdentityType, IdentityId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.ContactList.push(res.data);
    });
  }

  editContact(item, i) {
    var IdentityType = 2;
    var IdentityId = this.viewResult.BasicInfo[0].VendorId;
    this.modalRef = this.modalService.show(EditContactComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { item, i, IdentityType, IdentityId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });
    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.ContactList[i] = res.data;
    });
  }

  deleteContact(ContactId, i) {
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
          ContactId: ContactId,
        };
        this.commonService
          .postHttpService(postData, "getContactDelete")
          .subscribe((response) => {
            if (response.status == true) {
              this.ContactList.splice(i, 1);

              Swal.fire({
                title: "Deleted!",
                text: "Contact has been deleted.",
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
          text: "Contact is safe:)",
          type: "error",
        });
      }
    });
  }

  //Attachementsection
  deleteAttachement(AttachmentId, i) {
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

        this.commonService
          .postHttpService(postData, "getAttachmentdelete")
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

  addAttachement() {
    var IdentityType = "2";
    var IdentityId = this.viewResult.BasicInfo[0].VendorId;
    this.modalRef = this.modalService.show(AttachementComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { IdentityType, IdentityId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.AttachmentList.push(res.data);
      this.reLoad();
    });
  }

  editAttachement(item, i) {
    var IdentityType = 2;
    var IdentityId = this.viewResult.BasicInfo[0].VendorId;
    this.modalRef = this.modalService.show(EditAttachmentComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { item, i, IdentityType, IdentityId },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });
    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.AttachmentList[i] = res.data;
      this.reLoad();
    });
  }
  onFileChange($event) {
    let file = $event.target.files[0]; // <--- File Object for future use.
    this.VendorEditForm.controls["CompanyLogo"].setValue(file ? file.name : ""); // <-- Set Value for Validation
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
      this.VendorEditForm.value.CompanyLogo = reader.result;
      this.ImagePath = reader.result;
    };
  }

  //UserSection
  addUser() {
    var IdentityType = "2";
    var IdentityId = this.viewResult.BasicInfo[0].VendorId;
    var UserName = this.viewResult.BasicInfo[0].VendorName;
    this.modalRef = this.modalService.show(AddUserComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { IdentityType, IdentityId, UserName },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.UserList.push(res.data);
      this.reLoad();
    });
  }

  editUser(users, i) {
    var IdentityType = 2;
    var IdentityId = this.viewResult.BasicInfo[0].VendorId;
    var UserName = this.viewResult.BasicInfo[0].VendorName;
    this.modalRef = this.modalService.show(EditUserComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { users, i, IdentityType, IdentityId, UserName },
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });
    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {
      this.UserList[i] = res.data;
      this.reLoad();
    });
  }

  deleteUser(UserId, i) {
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
          UserId: UserId,
        };

        this.commonService
          .postHttpService(postData, "getUserDelete")
          .subscribe((response) => {
            if (response.status == true) {
              this.UserList.splice(i, 1);
              Swal.fire({
                title: "Deleted!",
                text: "User has been deleted.",
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
          text: "User is safe:)",
          type: "error",
        });
      }
    });
  }

  setDefaultAddress(e, AddressId, type) {
    Swal.fire({
      title: "Are you sure?",
      text: "To make this address as a default",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      cancelButtonText: "No!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var postData = {
          IdentityType: "2",
          IdentityId: this.viewResult.BasicInfo[0].VendorId,
          AddressId: AddressId,
          AddressType: type,
        };
        this.commonService
          .putHttpService(postData, "getSetprimaryaddress")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Saved!",
                text: "Address has been updated!",
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
          text: "Address is not updated!",
          type: "error",
        });
      }
    });
  }

  filterAndGetValue(object, getField, filterField, filterValue) {
    var value = object.filter(
      function (data) {
        return data[filterField] == filterValue;
      },
      filterField,
      filterValue
    );
    return value[0][getField];
  }

  EditCustomerAssigned(Customercontent: string) {
    this.insidemodalService.open(Customercontent, {
      centered: true,
      size: "lg",
    });
  }

  EditUserRight(UserRightscontent: string) {
    this.insidemodalService.open(UserRightscontent, {
      centered: true,
      size: "xl",
    });
  }

  selectFiles(event) {
    //this.selectedFiles = event.target.files;
    this.selectedFiles.push(event.target.files[0]);
  }

  onSubmit() {
    this.submitted = true;
    if (this.VendorEditForm.valid) {
      this.btnDisabled = true;
      if (this.VendorEditForm.value.Status == true) {
        this.Status = 1;
      } else {
        this.Status = 0;
      }
      if (this.VendorEditForm.value.IsAllowQuoteBeforeShip == true) {
        this.IsAllowQuoteBeforeShip = 1;
      } else {
        this.IsAllowQuoteBeforeShip = 0;
      }
      if (this.VendorEditForm.value.IsFlatRateRepair == true) {
        var IsFlatRateRepair = 1;
      } else {
        IsFlatRateRepair = 0;
      }
      var postData = {
        VendorId: this.VendorEditForm.value.VendorId,
        VendorClass: this.VendorEditForm.value.VendorClass,
        VendorTypeId: this.VendorEditForm.value.VendorTypeId,
        VendorName: this.VendorEditForm.value.VendorName,
        VendorCode: this.VendorEditForm.value.VendorCode,
        TermsId: this.VendorEditForm.value.TermsId,
        // "Currency": this.VendorEditForm.value.Currency,
        Email: this.VendorEditForm.value.Email,
        Industry: this.VendorEditForm.value.Industry,
        VendorCountryId: this.VendorEditForm.value.VendorCountryId,
        Notes: this.VendorEditForm.value.Notes,
        Website: this.VendorEditForm.value.Website,
        Status: this.Status,
        //"IsCorpVendor": this.VendorEditForm.value.IsCorpVendor,
        ///"IsCorpVendorCode": this.VendorEditForm.value.IsCorpVendorCode,
        CODNotes: this.VendorEditForm.value.CODNotes,
        RMANotes: this.VendorEditForm.value.RMANotes,
        RMARequired: this.VendorEditForm.value.RMARequired,
        IsFlatRateRepair: IsFlatRateRepair,
        CODPayment: this.VendorEditForm.value.CODPayment,
        CompanyLogo: this.uploadedpath || this.VendorEditForm.value.CompanyLogo,
        IsAllowQuoteBeforeShip: this.IsAllowQuoteBeforeShip,
        ShippingAccountNo: this.VendorEditForm.value.ShippingAccountNo,
        SetupInformation: this.VendorEditForm.value.SetupInformation,
        PODeliveryMethod: this.VendorEditForm.value.PODeliveryMethod,
        PrintFormat: this.VendorEditForm.value.PrintFormat,
        IsPOWithoutPricing: this.VendorEditForm.value.IsPOWithoutPricing,
        UPSUsername: this.VendorEditForm.value.UPSUsername,
        UPSPassword: this.VendorEditForm.value.UPSPassword,
        UPSAccessLicenseNumber:
          this.VendorEditForm.value.UPSAccessLicenseNumber,
        UPSShipperNumber: this.VendorEditForm.value.UPSShipperNumber,
        VendorLocation: this.VendorEditForm.value.VendorLocation,
        VendorCurrencyCode: this.VendorEditForm.value.VendorCurrencyCode,
        AddressList: this.AddressList,
        ContactList: this.ContactList,
      };

      this.commonService.putHttpService(postData, "getVendorEdit").subscribe(
        (response) => {
          if (response.status == true) {
            this.router.navigate(["admin/vendor/list"]);

            Swal.fire({
              title: "Success!",
              text: "Vendor updated Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          } else {
            var message = response.message ? response.message : "";
            Swal.fire({
              title: "Error!",
              // text: 'Vendor could not be updated!',
              html:
                "<div>Vendor could not be updated! <br /><br />" +
                message +
                "<br /></div>",

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
  GetClassName(IsPrimay: number): string {
    let className: string = "black";
    if (IsPrimay == 1) {
      this.IsPrimary = "Yes";
      className = "badge badge-success";
    } else {
      this.IsPrimary = "No";
      className = "badge badge-warning";
    }
    return className;
  }
  onChangePassword(users, i) {
    var result = users;
    var index = i;
    this.modalRef.hide();
    this.modalRef = this.modalService.show(UserChangePasswordComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: { index, result },
        class: "modal-xl",
      },
      class: "gray modal-xl",
    });

    this.modalRef.content.closeBtnName = "Close";

    this.modalRef.content.event.subscribe((res) => {});
  }
}
