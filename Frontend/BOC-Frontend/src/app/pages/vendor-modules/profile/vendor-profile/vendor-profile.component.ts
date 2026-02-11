/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import { attachment_thumb_images, Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { EditAttachmentComponent } from '../../common-template/edit-attachment/edit-attachment.component';
import { AttachementComponent } from '../../common-template/attachement/attachement.component';
import { EditAddressComponent } from '../../common-template/edit-address/edit-address.component';
import { AddressComponent } from '../../common-template/address/address.component';
import { ContactAddComponent } from '../../common-template/contact-add/contact-add.component';
import { EditContactComponent } from '../../common-template/edit-contact/edit-contact.component';
import { AddUserComponent } from '../../common-template/add-user/add-user.component';
import { EditUserComponent } from '../../common-template/edit-user/edit-user.component';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.scss'],
  providers: [
    BsModalRef
  ],
})
export class VendorProfileComponent implements OnInit {


  title;
  public multiple: boolean = true;
  public animation: boolean = false;
  urls = [];
  model: any = {}
  // bread crumb items
  breadCrumbItems: Array<{}>;
  VendorEditForm: FormGroup;
  UserForm: FormGroup
  submitted = false;
  displayRemoveIcon = false;
  message = '';
  selectedFiles: File[] | any[] = [];
  progressInfos = [];
  fileInfos: Observable<any>; IsContactAddress; IsBillingAddress; IsShippingAddress;
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
  attachmentThumb;
  AttachmentList: any[] = [];
  UserList: any[] = [];
  VendorId: any;
  AddressId;
  countryList;
  IsPrimay;
  CustomerId;
  TermsList:any=[];
  Terms
  constructor(
    private fb: FormBuilder,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    private insidemodalService: NgbModal,
    private commonService: CommonService,
    private cd_ref: ChangeDetectorRef,
    private customValidator: CustomvalidationService) { }
  ngOnInit(): void {
    this.attachmentThumb = attachment_thumb_images;

    //Validation for VendorEdit Page 
    this.VendorEditForm = this.fb.group({
      VendorId: ['', Validators.required],
      VendorTypeId: ['', Validators.required],
      VendorName: ['', Validators.required],
      // TermsId: ['', Validators.required],
      Terms:[''],
      Currency: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Industry: [''],
      VendorCountryId: ['', Validators.required],
      Notes: [''],
      Website: [''],
      //CODNotes: [''],
      RMANotes: [''],
      Status: [true],
      IsCorpVendor: [false],
      IsCorpVendorCode: [''],
      RMARequired: [false],
      // CODPayment: [false],
      CompanyLogo: [''],
      ShippingAccountNo: [''],
      SetupInformation: ['', Validators.required],
      PODeliveryMethod: ['', Validators.required],
      PrintFormat: ['', Validators.required],
      IsPOWithoutPricing: [''],

    },
      {
        validator: this.customValidator.MatchPassword('Password', 'ConfirmPassword'),
      }
    );


    this.getTermList();
    this.getViewContent();
    this.getCountryList();


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

  getCountryList() {
    this.commonService.getconutryList().subscribe(response => {
      if (response.status == true) {
        this.countryList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  getViewContent() {

    this.commonService.getHttpService("ViewVendorProfile").subscribe(response => {
      if (response.IsException == null) {
        this.viewResult = response.responseData;
        this.VendorCode = this.viewResult.BasicInfo[0].VendorCode;
        this.UserName = this.viewResult.BasicInfo[0].Username
        this.IdentityId = this.viewResult.BasicInfo[0].VendorId;
        if (this.viewResult.BasicInfo[0].ProfilePhoto === "" || this.viewResult.BasicInfo[0].ProfilePhoto === null) {
          this.showImagePath = false;
        } else {
          this.showImagePath = true;
          this.ImagePath = this.viewResult.BasicInfo[0].ProfilePhoto;
        }
        if (this.viewResult.BasicInfo[0].StatusName == "Active") {
          this.Status = true
        } else {
          this.Status = false
        }
        this.AddressList = this.viewResult.AddressList;
        this.ContactList = this.viewResult.ContactList || [];
        this.AttachmentList = this.viewResult.AttachmentList || []
        this.UserList = this.viewResult.UserList;
        this.Terms = this.viewResult.BasicInfo[0].Terms
        this.VendorEditForm.setValue({
          VendorId: this.viewResult.BasicInfo[0].VendorId,
          VendorTypeId: this.viewResult.BasicInfo[0].VendorTypeId,
          VendorName: this.viewResult.BasicInfo[0].VendorName,
          Terms: this.viewResult.BasicInfo[0].Terms,
           // TermsId: this.viewResult.BasicInfo[0].TermsId,
          Currency: this.viewResult.BasicInfo[0].Currency,
          Email: this.viewResult.BasicInfo[0].VendorEmail,
          Industry: this.viewResult.BasicInfo[0].Industry,
          VendorCountryId: this.viewResult.BasicInfo[0].VendorCountryId,
          Notes: this.viewResult.BasicInfo[0].Notes,
          Website: this.viewResult.BasicInfo[0].Website,
          Status: this.Status,
          IsCorpVendor: this.viewResult.BasicInfo[0].IsCorpVendor,
          IsCorpVendorCode: this.viewResult.BasicInfo[0].IsCorpVendorCode,
          //CODNotes: this.viewResult.BasicInfo[0].CODNotes,
          RMANotes: this.viewResult.BasicInfo[0].RMANotes,
          RMARequired: this.viewResult.BasicInfo[0].IsRMARequired,
          // CODPayment: this.viewResult.BasicInfo[0].CODPayment,
          CompanyLogo: this.viewResult.BasicInfo[0].ProfilePhoto,
          ShippingAccountNo: this.viewResult.BasicInfo[0].ShippingAccountNo,
          SetupInformation: this.viewResult.BasicInfo[0].SetupInformation,
          PODeliveryMethod: this.viewResult.BasicInfo[0].PODeliveryMethodId,
          PrintFormat: this.viewResult.BasicInfo[0].PrintFormatId,
          IsPOWithoutPricing: this.viewResult.BasicInfo[0].IsPOWithoutPricing,
        })
      } else {
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  get VendorEditFormControl() {
    return this.VendorEditForm.controls;
  }


  //AddressSection
  addAddress() {
    this.modalRef = this.modalService.show(AddressComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: {},
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.AddressList.push(res.data);
    });
  }

  editAddress(Addressdata, i) {
    this.modalRef = this.modalService.show(EditAddressComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { Addressdata, i },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.AddressList[i] = res.data
    });
  }

  deleteAddress(AddressId, i) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          AddressId: AddressId,
        }
        this.commonService.postHttpService(postData, 'DeleteAddressVendor').subscribe(response => {
          if (response.status == true) {
            this.AddressList.splice(i, 1);

            Swal.fire({
              title: 'Deleted!',
              text: 'Address has been deleted.',
              type: 'success'
            });
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {         
          Swal.fire({
          title: 'Cancelled',
          text: 'Address is safe:)',
          type: 'error'
        });
      }
    });
  }

  setDefaultAddress(e, AddressId, type) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'To make this address as a default',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          "AddressId": AddressId,
          "AddressType": type
        }
        this.commonService.putHttpService(postData, 'SetPrimaryAddressVendor').subscribe(response => {
          if (response.status == true) {

            Swal.fire({
              title: 'Saved!',
              text: 'Address has been updated!',
              type: 'success'
            });
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {

        Swal.fire({
          title: 'Cancelled',
          text: 'Address is not updated!',
          type: 'error'
        });
      }
    });
  }
  //ContactSection
  addContact() {
    this.modalRef = this.modalService.show(ContactAddComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: {},
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      })

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.ContactList.push(res.data);
    });
  }

  editContact(item, i) {
    this.modalRef = this.modalService.show(EditContactComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { item, i },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.ContactList[i] = res.data
    });
  }

  deleteContact(ContactId, i) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          ContactId: ContactId,
        }
        this.commonService.postHttpService(postData, 'DeleteContactVendor').subscribe(response => {
          if (response.status == true) {
            this.ContactList.splice(i, 1);

            Swal.fire({
              title: 'Deleted!',
              text: 'Contact has been deleted.',
              type: 'success'
            });
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {         
        Swal.fire({
          title: 'Cancelled',
          text: 'Contact is safe:)',
          type: 'error'
        });
      }
    });
  }

  //Attachementsection
  deleteAttachement(AttachmentId, i) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          AttachmentId: AttachmentId,
        }

        this.commonService.postHttpService(postData, 'DeleteAttachmentVendor').subscribe(response => {
          if (response.status == true) {
            this.AttachmentList.splice(i, 1)

            Swal.fire({
              title: 'Deleted!',
              text: 'Attachment has been deleted.',
              type: 'success'
            });
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {         
        Swal.fire({
          title: 'Cancelled',
          text: 'Attachment is safe:)',
          type: 'error'
        });
      }
    });


  }

  addAttachement() {
    this.modalRef = this.modalService.show(AttachementComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: {},
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.AttachmentList.push(res.data);
    });
  }

  editAttachement(item, i) {
    this.modalRef = this.modalService.show(EditAttachmentComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { item, i },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.AttachmentList[i] = res.data
    });

  }
  onFileChange($event) {
    let file = $event.target.files[0]; // <--- File Object for future use.
    this.VendorEditForm.controls['CompanyLogo'].setValue(file ? file.name : ''); // <-- Set Value for Validation
  }

  // image process
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileData);
    this.preview();
    this.commonService.postHttpImageService(formData, "getuploadVendorProfile").subscribe(response => {
      this.uploadedpath = response.responseData.location;
      this.cd_ref.detectChanges();
    }, error => console.log(error));
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
    }
  }

  //UserSection
  addUser() {
    this.modalRef = this.modalService.show(AddUserComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: {},
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.UserList.push(res.data);
    });
  }

  editUser(users, i) {
    this.modalRef = this.modalService.show(EditUserComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { users, i },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.UserList[i] = res.data
    });
  }

  deleteUser(UserId, i) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          UserId: UserId,
        }

        this.commonService.postHttpService(postData, 'DeleteUserVendor').subscribe(response => {
          if (response.status == true) {
            this.UserList.splice(i, 1)
            Swal.fire({
              title: 'Deleted!',
              text: 'User has been deleted.',
              type: 'success'
            });
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {         
        Swal.fire({
          title: 'Cancelled',
          text: 'User is safe:)',
          type: 'error'
        });
      }
    });

  }




  onSubmit() {
    this.submitted = true;
    if (this.VendorEditForm.valid) {
      if (this.VendorEditForm.value.Status == true) {
        this.Status = 1
      } else {
        this.Status = 0
      }
      var postData = {
        "VendorId": this.VendorEditForm.value.VendorId,
        "VendorTypeId": this.VendorEditForm.value.VendorTypeId,
        "VendorName": this.VendorEditForm.value.VendorName,
        "Terms": this.VendorEditForm.value.Terms,
        // "TermsId": this.VendorEditForm.value.TermsId,
        "Currency": this.VendorEditForm.value.Currency,
        "Email": this.VendorEditForm.value.Email,
        "Industry": this.VendorEditForm.value.Industry,
        "VendorCountryId": this.VendorEditForm.value.VendorCountryId,
        "Notes": this.VendorEditForm.value.Notes,
        "Website": this.VendorEditForm.value.Website,
        "Status": this.Status,
        "IsCorpVendor": this.VendorEditForm.value.IsCorpVendor,
        "IsCorpVendorCode": this.VendorEditForm.value.IsCorpVendorCode,
        //"CODNotes": this.VendorEditForm.value.CODNotes,
        "RMANotes": this.VendorEditForm.value.RMANotes,
        "RMARequired": this.VendorEditForm.value.RMARequired,
        // "CODPayment": this.VendorEditForm.value.CODPayment,
        "CompanyLogo": this.uploadedpath || this.VendorEditForm.value.CompanyLogo,
        "ShippingAccountNo": this.VendorEditForm.value.ShippingAccountNo,
        "SetupInformation": this.VendorEditForm.value.SetupInformation,
        "PODeliveryMethod": this.VendorEditForm.value.PODeliveryMethod,
        "PrintFormat": this.VendorEditForm.value.PrintFormat,
        "IsPOWithoutPricing": this.VendorEditForm.value.IsPOWithoutPricing,
        // AddressList: this.AddressList,
        // ContactList: this.ContactList,
      }

      this.commonService.putHttpService(postData, "UpdateVendorProfile").subscribe(response => {
        if (response.status == true) {
          Swal.fire({
            title: 'Success!',
            text: 'Vendor updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Vendor could not be updated!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
    else{
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }
  }
}
