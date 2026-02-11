/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox } from 'ngx-lightbox';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import { attachment_thumb_images, customergroup, customertype, terms, taxtype, Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
import { EditAddressComponent } from '../../common-template/edit-address/edit-address.component';
import { AttachementComponent } from '../../common-template/attachement/attachement.component';
import { EditAttachmentComponent } from '../../common-template/edit-attachment/edit-attachment.component';
import { AddDepartmentComponent } from '../../common-template/add-department/add-department.component';
import { EditDepartmentComponent } from '../../common-template/edit-department/edit-department.component';
import { CustomerReferenceComponent } from '../../common-template/customer-reference/customer-reference.component';
import { EditCustomerReferenceComponent } from '../../common-template/edit-customer-reference/edit-customer-reference.component';
import { AddAssetComponent } from '../../common-template/add-asset/add-asset.component';
import { EditAssetComponent } from '../../common-template/edit-asset/edit-asset.component';
import { AddressComponent } from '../../common-template/address/address.component';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss'],
  providers: [
    BsModalRef
  ]
})
export class CustomerProfileComponent implements OnInit {

  CustomerEditForm: FormGroup;
  submitted = false;
  viewResult;
  Status;
  IdentityId;
  ImagePath;
  AddressList: any[] = []; DepartmentList: any[] = []; AssetList: any[] = []; CustomerUserList: any[] = [];
  CustomerGroup
  CustomerType
  TermsList
  TaxType;
  fileData;
  uploadedpath;
  show: boolean = false;
  UserList;
  UserId;
  AttachmentList: any[] = [];
  RefList: any[] = [];
  showImagePath: boolean = false;
  attachmentThumb;
  CustomerCode;
  UserName;
  CustomerId: string;
  countryList;
  constructor(private openmodalService: NgbModal,
    private fb: FormBuilder,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    public navCtrl: NgxNavigationWithDataComponent,
    private customValidator: CustomvalidationService) { }

  ngOnInit(): void {
    this.attachmentThumb = attachment_thumb_images;

    this.CustomerEditForm = this.fb.group({
      CustomerId: [''],
      CustomerTypeId: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      CompanyName: ['', Validators.required],
      TermsId: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      CustomerIndustry: [''],
      CustomerCountryId: ['', Validators.required],
      Notes: [''],
      Website: [''],
      IsLaborOnInvoice: [false],
      TaxTypeId: ['', Validators.required],
      Status: [false],
      GroupId: ['', Validators.required],
      ProfilePhoto: [''],
      //IsContactAddress: [''], // Validators.required
      //IsBillingAddress: [''],
      //IsShippingAddress: [''],
    },
      {
        validator: this.customValidator.MatchPassword('Password', 'ConfirmPassword'),
      }
    );

    this.getViewContent();
    this.getCountryList();

    //dropdown
    this.CustomerGroup = customergroup;
    this.CustomerType = customertype;
this.getTermList();
    this.TaxType = taxtype;
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

  //get CustomerEditForm validation control
  get CustomerEditFormControl() {
    return this.CustomerEditForm.controls;
  }

  getCountryList() {
    this.commonService.getHttpService("getCountryList").subscribe(response => {
      if (response.status == true) {
        this.countryList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  //view of customer
  getViewContent() {

    this.commonService.getHttpService("ViewCustomerProfile").subscribe(response => {
      if (response.status == true) {
        this.viewResult = response.responseData;
        this.IdentityId = this.viewResult.BasicInfo[0].CustomerId
        this.CustomerCode = this.viewResult.BasicInfo[0].CustomerCode;
        this.UserName = this.viewResult.BasicInfo[0].Username;
        this.AddressList = this.viewResult.AddressList || [];
        this.DepartmentList = this.viewResult.CustomerDepartmentList || [];
        this.RefList = this.viewResult.CReference || [];

        this.AttachmentList = this.viewResult.AttachmentList || []
        if (this.viewResult.BasicInfo[0].ProfilePhoto === "" || this.viewResult.BasicInfo[0].ProfilePhoto == null) {
          this.showImagePath = false;
        }
        else {
          this.showImagePath = true;
          this.ImagePath = this.viewResult.BasicInfo[0].ProfilePhoto;

        }
        if (this.viewResult.BasicInfo[0].StatusName == "Active") {
          this.Status = true
        } else { this.Status = false }
        this.AssetList = this.viewResult.CustomerAssetList || [];
        this.CustomerUserList = this.viewResult.CustomerUsers || [];
        this.CustomerEditForm.setValue({
          CustomerId: this.viewResult.BasicInfo[0].CustomerId,
          GroupId: this.viewResult.BasicInfo[0].GroupId,
          Website: this.viewResult.BasicInfo[0].Website,
          CustomerTypeId: this.viewResult.BasicInfo[0].CustomerTypeId,
          FirstName: this.viewResult.BasicInfo[0].FirstName,
          LastName: this.viewResult.BasicInfo[0].LastName,
          CompanyName: this.viewResult.BasicInfo[0].CompanyName,
          TermsId: this.viewResult.BasicInfo[0].TermsId,
          Email: this.viewResult.BasicInfo[0].Email,
          CustomerIndustry: this.viewResult.BasicInfo[0].CustomerIndustry,
          CustomerCountryId: this.viewResult.BasicInfo[0].CustomerCountryId,
          Notes: this.viewResult.BasicInfo[0].Notes,
          TaxTypeId: this.viewResult.BasicInfo[0].TaxTypeId,
          ProfilePhoto: this.viewResult.BasicInfo[0].ProfilePhoto,
          IsLaborOnInvoice: this.viewResult.BasicInfo[0].IsLaborOnInvoice,
          Status: this.Status,

        })
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  onSubmit() {
    this.submitted = true;
    if (this.CustomerEditForm.valid) {
      if (this.CustomerEditForm.value.Status == true) {
        this.Status = 1
      }
      else {
        this.Status = 0
      }
      var postData = {
        "CustomerId": this.CustomerEditForm.value.CustomerId,
        "GroupId": this.CustomerEditForm.value.GroupId,
        "CustomerTypeId": this.CustomerEditForm.value.CustomerTypeId,
        "FirstName": this.CustomerEditForm.value.FirstName,
        "LastName": this.CustomerEditForm.value.LastName,
        "CompanyName": this.CustomerEditForm.value.CompanyName,
        "Website": this.CustomerEditForm.value.Website,
        "TermsId": this.CustomerEditForm.value.TermsId,
        "CustomerIndustry": this.CustomerEditForm.value.CustomerIndustry,
        "CustomerCountryId": this.CustomerEditForm.value.CustomerCountryId,
        "Notes": this.CustomerEditForm.value.Notes,
        "PriorityNotes": this.CustomerEditForm.value.PriorityNotes,
        "TaxTypeId": this.CustomerEditForm.value.TaxTypeId,
        "IsLaborOnInvoice": this.CustomerEditForm.value.IsLaborOnInvoice,
        "Status": this.Status,
        "ProfilePhoto": this.uploadedpath || this.CustomerEditForm.value.ProfilePhoto,
        "Email": this.CustomerEditForm.value.Email,

      }
      this.commonService.putHttpService(postData, "UpdateCustomerProfile").subscribe(response => {
        if (response.status == true) {
          Swal.fire({
            title: 'Success!',
            text: 'Customer updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Customer could not be updated!',
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
      }
    )

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
      })
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.AddressList[i] = res.data;
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

        this.commonService.postHttpService(postData, 'DeleteAddressCustomer').subscribe(response => {
          if (response.status == true) {
            this.AddressList.splice(i, 1)

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

        this.commonService.postHttpService(postData, 'DeleteAttachmentCustomer').subscribe(response => {
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
      }
    )

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
      })
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.AttachmentList[i] = res.data
    });

  }

  //DepartSection
  addDepartments() {
    this.modalRef = this.modalService.show(AddDepartmentComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: {},
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      }
    )

    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.event.subscribe(res => {
      this.DepartmentList.push(res.data);
    });
  }
  editDepartment(depart, i) {
    this.modalRef = this.modalService.show(EditDepartmentComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { depart, i },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      }
    )

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.DepartmentList[i] = res.data;
    });
  }

  deleteDepartment(CustomerDepartmentId, i) {

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
          CustomerDepartmentId: CustomerDepartmentId,
        }
        this.commonService.postHttpService(postData, 'DepartmentDeleteCustomer').subscribe(response => {
          if (response.status == true) {
            this.DepartmentList.splice(i, 1)
            Swal.fire({
              title: 'Deleted!',
              text: 'Department has been deleted.',
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
          text: 'Department is safe:)',
          type: 'error'
        });
      }
    });




  }


  //AssetSection
  addAsset() {
    this.modalRef = this.modalService.show(AddAssetComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: {},
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      }
    )

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.AssetList.push(res.data);
    });

  }
  editAsset(Asset, i) {
    this.modalRef = this.modalService.show(EditAssetComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: { Asset, i },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      }
    )

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.AssetList[i] = res.data;
    });
  }
  deleteAsset(CustomerAssetId, i) {
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
          CustomerAssetId: CustomerAssetId,

        }

        this.commonService.postHttpService(postData, 'AssetDeleteCustomer').subscribe(response => {
          if (response.status == true) {
            this.AssetList.splice(i, 1)
            Swal.fire({
              title: 'Deleted!',
              text: 'Asset has been deleted.',
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
          text: 'Asset is safe:)',
          type: 'error'
        });
      }
    });



  }

  setDefaultAddress(AddressId, type) {
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
        this.commonService.putHttpService(postData, 'SetPrimaryAddressCustomer').subscribe(response => {
          if (response.IsException == null) {
            Swal.fire({
              title: 'Saved!',
              text: 'Address has been updated',
              type: 'success'
            });

            //let tpl = document.querySelector('#tpl');

          } else if (
            // Read more about handling dismissals
            result.dismiss === Swal.DismissReason.cancel
          ) {
            Swal.fire({
              title: 'Cancelled',
              text: 'Address is not saved :)',
              type: 'error'
            });
          }
        });
      }
    })
  }


  // image process
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileData);
    this.preview();
    this.commonService.postHttpImageService(formData, "getuploadCustomerProfile").subscribe(response => {
      this.uploadedpath = response.responseData.location;
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  onFileChange($event) {
    let file = $event.target.files[0]; // <--- File Object for future use.
    this.CustomerEditForm.controls['ProfilePhoto'].setValue(file ? file.name : ''); // <-- Set Value for Validation
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
      this.CustomerEditForm.value.ProfilePhoto = reader.result;
      this.ImagePath = reader.result;

    }
  }
}
