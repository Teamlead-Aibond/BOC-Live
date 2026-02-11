/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox } from 'ngx-lightbox';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddressComponent } from '../../common-template/address/address.component';
import { EditAddressComponent } from '../../common-template/edit-address/edit-address.component';
import { ThrowStmt } from '@angular/compiler';
import Swal from 'sweetalert2';
import { AddDepartmentComponent } from '../../common-template/add-department/add-department.component';
import { EditDepartmentComponent } from '../../common-template/edit-department/edit-department.component';
import { AddAssetComponent } from '../../common-template/add-asset/add-asset.component';
import { EditAssetComponent } from '../../common-template/edit-asset/edit-asset.component';
import { Router } from '@angular/router';
import {
  customergroup, customertype, terms, taxtype, attachment_thumb_images,
  CONST_VIEW_ACCESS, CONST_CREATE_ACCESS, CONST_MODIFY_ACCESS, CONST_DELETE_ACCESS, Const_Alert_pop_title, Const_Alert_pop_message
} from 'src/assets/data/dropdown';
import { AttachementComponent } from '../../common-template/attachement/attachement.component';
import { EditAttachmentComponent } from '../../common-template/edit-attachment/edit-attachment.component';
import { CustomerReferenceComponent } from '../../common-template/customer-reference/customer-reference.component';
import { EditCustomerReferenceComponent } from '../../common-template/edit-customer-reference/edit-customer-reference.component';
import { AddUserComponent } from '../../common-template/add-user/add-user.component';
import { EditUserComponent } from '../../common-template/edit-user/edit-user.component';
import { UserChangePasswordComponent } from '../../common-template/user-change-password/user-change-password.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Observable, of, Subject, concat } from 'rxjs';
import { catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';
import * as fs from 'file-saver';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
})
export class CustomerEditComponent implements OnInit {
  CustomerEditForm: FormGroup;
  submitted = false;
  viewResult;
  Status;
  IdentityId;
  ImagePath;
  AddressList: any[] = []; DepartmentList: any[] = []; AssetList: any[] = []; CustomerUserList: any[] = [];
  CustomerGroup
  CustomerType
  Terms: any[]
  TaxType;
  fileData;
  uploadedpath;
  show: boolean = false;
  UserId;
  AttachmentList: any[] = [];
  UserList: any[] = [];
  RefList: any[] = [];
  showImagePath: boolean = false;
  attachmentThumb;
  CustomerCode;
  UserName;
  CustomerId: string;
  countryList;
  UserListddl;
  IsEditEnabled;
  IsCusRefEnabled;
  IsAddCusRefEnabled;
  IsEditCusRefEnabled;
  IsDeleteCusRefEnabled;
  IsPrimary;
  btnDisabled: boolean = false;
  vendors$: Observable<any> = of([]);
  vendorsInput$ = new Subject<string>();
  loadingVendors: boolean = false;
  VendorsList: any[] = [];
  DirectedVendorList:any=[]
  CustomerCurrencyCode
  CustomerCurrencyCodeDetails: string;
  countryListWithSymbol: any;
  IsEditCustomerIdEnabled: boolean;
  customerGroupList: any = [];
  constructor(private openmodalService: NgbModal, private fb: FormBuilder,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    public navCtrl: NgxNavigationWithDataComponent,private datePipe: DatePipe,
    private customValidator: CustomvalidationService) { }
  currentRouter = this.router.url;

  ngOnInit() {
    document.title='Customer Edit'
    this.CustomerId = this.navCtrl.get('CustomerId');

    this.IsEditEnabled = this.commonService.permissionCheck("ManageCustomer", CONST_MODIFY_ACCESS);
    this.IsCusRefEnabled = this.commonService.permissionCheck("CustomerReference", CONST_VIEW_ACCESS);
    this.IsAddCusRefEnabled = this.commonService.permissionCheck("CustomerReference", CONST_CREATE_ACCESS);
    this.IsEditCusRefEnabled = this.commonService.permissionCheck("CustomerReference", CONST_MODIFY_ACCESS);
    this.IsDeleteCusRefEnabled = this.commonService.permissionCheck("CustomerReference", CONST_DELETE_ACCESS);
    this.IsEditCustomerIdEnabled = this.commonService.permissionCheck("EditCustomerCode", CONST_MODIFY_ACCESS);


    // Redirect to the List page if the View Id is not available
    if (this.CustomerId == '' || this.CustomerId == 'undefined' || this.CustomerId == null) {
      this.navCtrl.navigate('/admin/customer/list/');
      return false;
    }

    this.attachmentThumb = attachment_thumb_images;

    this.CustomerEditForm = this.fb.group({
      CustomerId: [''],
      CustomerTypeId: ['', Validators.required],
      CustomerCode: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      CompanyName: ['', Validators.required],
      TermsId: ['', Validators.required],
      FirstName: ['', Validators.required],
      CustomerIndustry: [''],
      CustomerCountryId: ['', Validators.required],
      CustomerGroupId: [''],
      Notes: [''],
      CustomerPONotes: [''],
      PriorityNotes: [''],
      Website: [''],
      IsLaborOnInvoice: [false],
      IsDisplayPOInQR: [false],
      TaxTypeId: ['', Validators.required],
      Status: [false],
      GroupId: ['', Validators.required],
      ProfilePhoto: [''],
      BlanketPOLowerLimitPercent: ['', Validators.required],
      DirectedVendors:[''],
      UPSUsername: [''],
      UPSPassword: [''],
      UPSAccessLicenseNumber: [''],
      UPSShipperNumber: [''],
      CustomerLocation:['',Validators.required],
      CustomerCurrencyCode:[''],
      CustomerVATNo:[''],
      //IsContactAddress: [''], // Validators.required
      //IsBillingAddress: [''],
      //IsShippingAddress: [''],
    },
      {
        validator: this.customValidator.MatchPassword('Password', 'ConfirmPassword'),
      }
    );
    this.getCountryList();
    this.getCustomerGroupList();
    this.getCountryListWithSymbol()
    this.getTermList();
    this.getUserList();
    this.loadVendors();
    this.getViewContent();

    //dropdown
    this.CustomerGroup = customergroup;
    this.CustomerType = customertype;
    this.TaxType = taxtype;


  }
  getCustomerCurrencyCode(e){
    var postData={
      CountryId:e.target.value
    }
    this.commonService.postHttpService(postData,"getCurrencyCode").subscribe(response => {
      if (response.status == true) {
        this.CustomerCurrencyCode = response.responseData.CurrencyCode
        this.CustomerCurrencyCodeDetails = response.responseData.CountryName+' - '+response.responseData.CurrencyCode+' ( '+response.responseData.CurrencySymbol+' ) '
        this.CustomerEditForm.patchValue({
          CustomerCurrencyCode:this.CustomerCurrencyCode
        })
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  onCustomerChange($event) {
    this.CustomerEditForm.patchValue({
      "CustomerCode": $event.target.value
    })

  }
  reLoad() {
    this.router.navigate([this.currentRouter])
  }

  getTermList() {
    this.commonService.getHttpService("getTermsList").subscribe(response => {
      if (response.status == true) {
        this.Terms = response.responseData
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
  getCustomerGroupList() {
    this.commonService.getHttpService("ddCustomerGroup").subscribe(response => {
      if (response.status) {
        this.customerGroupList = response.responseData
      }    
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  getCountryListWithSymbol() {
    this.commonService.getHttpService("getCountryListWithSymbol").subscribe(response => {
      if (response.status == true) {
        this.countryListWithSymbol = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  getUserList() {
    this.commonService.getHttpService("getAllActiveAdmin").subscribe(response => {
      if (response.status == true) {
        this.UserListddl = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  //view of customer
  getViewContent() {
    var CustomerId = this.navCtrl.get('CustomerId')
    var postData = {
      CustomerId: CustomerId
    }
    this.commonService.postHttpService(postData, "getCustomerView").subscribe(response => {
      if (response.status == true) {
        this.viewResult = response.responseData;
        this.IdentityId = this.viewResult.BasicInfo[0].CustomerId
        this.UserId = this.viewResult.BasicInfo[0].UserId;
        this.DirectedVendorList = this.viewResult.DirectedVendorList;
        this.CustomerCode = this.viewResult.BasicInfo[0].CustomerCode;
        this.UserName = this.viewResult.BasicInfo[0].Username;
        this.AddressList = this.viewResult.AddressList || [];
        this.DepartmentList = this.viewResult.CustomerDepartmentList || [];
        this.RefList = this.viewResult.CReference || [];
        this.UserList = this.viewResult.UserList
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
        this.CustomerEditForm.patchValue({
          CustomerId: this.viewResult.BasicInfo[0].CustomerId,
          BlanketPOLowerLimitPercent: this.viewResult.BasicInfo[0].BlanketPOLowerLimitPercent,
          CustomerCode: this.viewResult.BasicInfo[0].CustomerCode,
          GroupId: this.viewResult.BasicInfo[0].GroupId,
          Website: this.viewResult.BasicInfo[0].Website,
          CustomerTypeId: this.viewResult.BasicInfo[0].CustomerTypeId,
          FirstName: this.viewResult.BasicInfo[0].FirstName,
          CompanyName: this.viewResult.BasicInfo[0].CompanyName,
          TermsId: this.viewResult.BasicInfo[0].TermsId,
          Email: this.viewResult.BasicInfo[0].Email,
          CustomerIndustry: this.viewResult.BasicInfo[0].CustomerIndustry,
          CustomerCountryId: this.viewResult.BasicInfo[0].CustomerCountryId,
          CustomerGroupId: this.viewResult.BasicInfo[0].CustomerGroupId,
          Notes: this.viewResult.BasicInfo[0].Notes,
          CustomerPONotes: this.viewResult.BasicInfo[0].CustomerPONotes,
          TaxTypeId: this.viewResult.BasicInfo[0].TaxTypeId,
          ProfilePhoto: this.viewResult.BasicInfo[0].ProfilePhoto,
          IsLaborOnInvoice: this.viewResult.BasicInfo[0].IsLaborOnInvoice,
          IsDisplayPOInQR: this.viewResult.BasicInfo[0].IsDisplayPOInQR,
          Status: this.Status,
          PriorityNotes: this.viewResult.BasicInfo[0].PriorityNotes,
          DirectedVendors:this.viewResult.BasicInfo[0].DirectedVendors ? this.viewResult.BasicInfo[0].DirectedVendors.split(",").map(a => Number(a)) : [],
          UPSUsername: this.viewResult.BasicInfo[0].UPSUsername,
          UPSPassword: this.viewResult.BasicInfo[0].UPSPassword,
          UPSAccessLicenseNumber: this.viewResult.BasicInfo[0].UPSAccessLicenseNumber,
          UPSShipperNumber: this.viewResult.BasicInfo[0].UPSShipperNumber,
          CustomerLocation: this.viewResult.BasicInfo[0].CustomerLocation,
          CustomerCurrencyCode: this.viewResult.BasicInfo[0].CustomerCurrencyCode,
          CustomerVATNo: this.viewResult.BasicInfo[0].CustomerVATNo
        })
        
        this.CustomerCurrencyCode=this.viewResult.BasicInfo[0].CustomerCurrencyCode
        this.CustomerCurrencyCodeDetails = this.viewResult.BasicInfo[0].CustomerCountry+' - '+this.viewResult.BasicInfo[0].CustomerCurrencyCode+' ( '+this.viewResult.BasicInfo[0].CurrencySymbol+' ) '
     
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  //AddressSection
  addAddress() {

    var IdentityType = "1"
    var IdentityId = this.viewResult.BasicInfo[0].CustomerId
    this.modalRef = this.modalService.show(AddressComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { IdentityType, IdentityId },
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
    var IdentityType = 1;
    var IdentityId = this.viewResult.BasicInfo[0].CustomerId
    this.modalRef = this.modalService.show(EditAddressComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { Addressdata, i, IdentityType, IdentityId },
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

        this.commonService.postHttpService(postData, 'getAddressDelete').subscribe(response => {
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


  //UserSection
  addUser() {
    var IdentityType = 1
    var IdentityId = this.viewResult.BasicInfo[0].CustomerId;
    var UserName = this.viewResult.BasicInfo[0].CompanyName
    this.modalRef = this.modalService.show(AddUserComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { IdentityType, IdentityId,UserName },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.UserList.push(res.data);
      this.reLoad();
    });
  }

  editUser(users, i) {
    var IdentityType = 1;
    var IdentityId = this.viewResult.BasicInfo[0].CustomerId
    var UserName = this.viewResult.BasicInfo[0].CompanyName
    this.modalRef = this.modalService.show(EditUserComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { users, i, IdentityType, IdentityId,UserName },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.UserList[i] = res.data
      this.reLoad();

    });
  }
  setPrimaryUser(users, i) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to set as primary?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, set it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var IdentityType = 1;
        var IdentityId = this.viewResult.BasicInfo[0].CustomerId;
        var postData = {
          IdentityType: IdentityType,
          IdentityId: IdentityId,
          UserId: users
        }
        this.commonService.postHttpService(postData, 'setasprimary').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Updated!',
              text: 'Primary set successfully.',
              type: 'success'
            });
            this.reLoad();
          } else {
          }
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Primary not set:)',
          type: 'error'
        });
      }
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

        this.commonService.postHttpService(postData, 'getUserDelete').subscribe(response => {
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

        this.commonService.postHttpService(postData, 'getAttachmentdelete').subscribe(response => {
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
    var IdentityType = "1"
    var IdentityId = this.viewResult.BasicInfo[0].CustomerId
    this.modalRef = this.modalService.show(AttachementComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { IdentityType, IdentityId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      }
    )

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.AttachmentList.push(res.data);
      this.reLoad();

    });
  }

  editAttachement(item, i) {
    var IdentityType = "1";
    var IdentityId = this.viewResult.BasicInfo[0].CustomerId
    this.modalRef = this.modalService.show(EditAttachmentComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { item, i, IdentityType, IdentityId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      })
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.AttachmentList[i] = res.data
      this.reLoad();

    });

  }

  //DepartSection
  addDepartments() {
    var IdentityId = this.viewResult.BasicInfo[0].CustomerId
    this.modalRef = this.modalService.show(AddDepartmentComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { IdentityId },
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
    var IdentityId = this.viewResult.BasicInfo[0].CustomerId
    this.modalRef = this.modalService.show(EditDepartmentComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { depart, i, IdentityId },
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
        this.commonService.postHttpService(postData, 'getDepartmentDelete').subscribe(response => {
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

  //ReferenceSection
  deleteReference(CReferenceId, i) {
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
          CReferenceId: CReferenceId,
        }
        this.commonService.postHttpService(postData, 'getReferenceDelete').subscribe(response => {
          if (response.status == true) {
            this.RefList.splice(i, 1)
            Swal.fire({
              title: 'Deleted!',
              text: 'Reference has been deleted.',
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
          text: 'Reference is safe:)',
          type: 'error'
        });
      }
    });


  }
  addReference() {
    var IdentityId = this.viewResult.BasicInfo[0].CustomerId;
    this.modalRef = this.modalService.show(CustomerReferenceComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { IdentityId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      }
    )

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.RefList.push(res.data);
    });

  }
  editReference(ref, i) {
    var IdentityId = this.viewResult.BasicInfo[0].CustomerId
    this.modalRef = this.modalService.show(EditCustomerReferenceComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { ref, i, IdentityId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      }
    )

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.RefList[i] = res.data;
    });
  }
  //AssetSection
  addAsset() {
    var IdentityId = this.viewResult.BasicInfo[0].CustomerId
    this.modalRef = this.modalService.show(AddAssetComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { IdentityId },
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
    var IdentityId = this.viewResult.BasicInfo[0].CustomerId
    this.modalRef = this.modalService.show(EditAssetComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { Asset, i, IdentityId },
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

        this.commonService.postHttpService(postData, 'getAssetDelete').subscribe(response => {
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
          "IdentityType": "1",
          "IdentityId": this.viewResult.BasicInfo[0].CustomerId,
          "AddressId": AddressId,
          "AddressType": type
        }
        this.commonService.putHttpService(postData, 'getSetprimaryaddress').subscribe(response => {
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

  //AddressDefault
  defaultShipping(AddressId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'To make this address to  default Shipping Address',
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
          "IdentityType": "1",
          "IdentityId": this.viewResult.BasicInfo[0].CustomerId,
          "AddressId": AddressId,
          "AddressType": 2
        }
        this.commonService.putHttpService(postData, 'getSetprimaryaddress').subscribe(response => {
          if (response.IsException == null) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Address Saved has been Shipping Address.',
              type: 'success'
            });

            // Reload the table
            var table = $('#datatable-angular').DataTable();
            table.draw();
          } else if (
            // Read more about handling dismissals
            result.dismiss === Swal.DismissReason.cancel
          ) {
            Swal.fire({
              title: 'Cancelled',
              text: 'Customer is safe :)',
              type: 'error'
            });
          }
        });
      }
    })
  }

  defaultBilling(AddressId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'To make this address to  default Billing Address',
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
          "IdentityType": "1",
          "IdentityId": this.viewResult.BasicInfo[0].CustomerId,
          "AddressId": AddressId,
          "AddressType": 3
        }
        this.commonService.putHttpService(postData, 'getSetprimaryaddress').subscribe(response => {
          if (response.IsException == null) {
            Swal.fire({
              title: 'Saved!',
              text: 'Address Saved has been Billing Address',
              type: 'success'
            });


          } else if (
            // Read more about handling dismissals
            result.dismiss === Swal.DismissReason.cancel
          ) {
            Swal.fire({
              title: 'Cancelled',
              text: 'Address is not safed :)',
              type: 'error'
            });
          }
        });
      }
    })
  }

  defaultContact(AddressId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'To make this address to  default Contact Address',
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
          "IdentityType": "1",
          "IdentityId": this.viewResult.BasicInfo[0].CustomerId,
          "AddressId": AddressId,
          "AddressType": 1
        }
        this.commonService.putHttpService(postData, 'getSetprimaryaddress').subscribe(response => {
          if (response.IsException == null) {
            Swal.fire({
              title: 'Saved!',
              text: 'Address Saved has been Contact Address',
              type: 'success'
            });


          } else if (
            // Read more about handling dismissals
            result.dismiss === Swal.DismissReason.cancel
          ) {
            Swal.fire({
              title: 'Cancelled',
              text: 'Address is not Saved :)',
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
  onSubmit() {
    this.submitted = true;
    if (this.CustomerEditForm.valid) {
      this.btnDisabled = true;
      if (this.CustomerEditForm.value.Status == true) {
        this.Status = 1
      }
      else {
        this.Status = 0
      }
      if (this.CustomerEditForm.value.IsDisplayPOInQR == true) {
        var IsDisplayPOInQR = 1
      }
      else {
        IsDisplayPOInQR = 0
      }

      
      var postData = {
        "CustomerId": this.CustomerEditForm.value.CustomerId,
        "BlanketPOLowerLimitPercent": this.CustomerEditForm.value.BlanketPOLowerLimitPercent,
        "GroupId": this.CustomerEditForm.value.GroupId,
        "CustomerTypeId": this.CustomerEditForm.value.CustomerTypeId,
        "CustomerCode": this.CustomerEditForm.value.CustomerCode,
        "FirstName": this.CustomerEditForm.value.FirstName,
        "CompanyName": this.CustomerEditForm.value.CompanyName,
        "Website": this.CustomerEditForm.value.Website,
        "TermsId": this.CustomerEditForm.value.TermsId,
        "CustomerIndustry": this.CustomerEditForm.value.CustomerIndustry,
        "CustomerCountryId": this.CustomerEditForm.value.CustomerCountryId,
        "CustomerGroupId": this.CustomerEditForm.value.CustomerGroupId,
        "Notes": this.CustomerEditForm.value.Notes,
        "CustomerPONotes": this.CustomerEditForm.value.CustomerPONotes,
        "PriorityNotes": this.CustomerEditForm.value.PriorityNotes,
        "TaxTypeId": this.CustomerEditForm.value.TaxTypeId,
        "IsLaborOnInvoice": this.CustomerEditForm.value.IsLaborOnInvoice,
        "IsDisplayPOInQR": IsDisplayPOInQR,
        "Status": this.Status,
        "ProfilePhoto": this.uploadedpath || this.CustomerEditForm.value.ProfilePhoto,
        "Email": this.CustomerEditForm.value.Email,
        "UserId": this.UserId,
        "UPSUsername": this.CustomerEditForm.value.UPSUsername,
        "UPSPassword": this.CustomerEditForm.value.UPSPassword,
        "UPSAccessLicenseNumber": this.CustomerEditForm.value.UPSAccessLicenseNumber,
        "UPSShipperNumber": this.CustomerEditForm.value.UPSShipperNumber,
        CustomerAssetList: this.AssetList,
        CustomerDepartmentList: this.DepartmentList,
        CustomerAddressList: this.AddressList,
        CustomerUsers: this.CustomerUserList,
        "DirectedVendors":this.CustomerEditForm.value.DirectedVendors.toString(),
        "CustomerLocation":this.CustomerEditForm.value.CustomerLocation,
        "CustomerCurrencyCode":this.CustomerEditForm.value.CustomerCurrencyCode,
        "CustomerVATNo":this.CustomerEditForm.value.CustomerVATNo
      }
      this.commonService.putHttpService(postData, "getCustomerEdit").subscribe(response => {
        if (response.status == true) {
          this.router.navigate(['admin/customer/list']);

          Swal.fire({
            title: 'Success!',
            text: 'Customer updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          this.btnDisabled = false;
          var message = response.message ? response.message : '';
          Swal.fire({
            title: 'Error!',
            // text: 'Customer could not be updated!',
            html: '<div>Customer could not be updated! <br /><br />'+ message +'<br /></div>', 
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
    else {
      this.btnDisabled = false;
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }

  }


  GetClassName(IsPrimay: number): string {
    let className: string = 'black';
    if (IsPrimay == 1) {
      this.IsPrimary = "Yes"
      className = 'badge badge-success';
    }
    else {
      this.IsPrimary = "No"
      className = 'badge badge-warning';
    }
    return className;
  }
  onChangePassword(users, i) {
    var result = users;
    var index = i;
    this.modalRef.hide();
    this.modalRef = this.modalService.show(UserChangePasswordComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { index, result },
          class: 'modal-xl'
        }, class: 'gray modal-xl'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
    });
  }
  openModal(content: string) {
    this.openmodalService.open(content);
  }
  addAttachment(AttachmentContent) {
    this.openmodalService.open(AttachmentContent, { size: 'xl' });
  }
  extraLarge(exlargeModal: string) {
    this.openmodalService.open(exlargeModal, { size: 'xl' });
  }


  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.RefList, event.previousIndex, event.currentIndex);
    this.RefList.forEach((user, idx) => {
      user.Rank = idx + 1;
    });
    var postData = {
      "CustomerReferenceRankList": this.RefList,
    }
    this.commonService.putHttpService(postData, "UpdateCustomerRefOrder").subscribe(response => {
      if (response.status == true) {

        Swal.fire({
          title: 'Success!',
          text: 'Customer Reference order Updated Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        Swal.fire({
          title: 'Error!',
          text: response.message,
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  onUpdateQRcode(e, item, i, isDisplayOnQR = false) {
    if (e.target.checked == true) {
      if (isDisplayOnQR && e.target.checked == true) {
        var poQR = 0
      } else {
        poQR = this.CustomerEditForm.value.IsDisplayPOInQR ? 1 : 0;
      }
      let displayOnQR = this.RefList.filter(a => a.IsDisplayOnQRCode == 1).length;
      let qrCount = poQR + displayOnQR;
      if (qrCount < 2) {
        if (!isDisplayOnQR) {
          this.RefList[i].IsDisplayOnQRCode = 1;
          Swal.fire({
            title: 'Are you sure?',
            text: 'To Update this Reference Value as QR Code',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Update it!',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success mt-2',
            cancelButtonClass: 'btn btn-danger ml-2 mt-2',
            buttonsStyling: false
          }).then((result) => {
            if (result.value) {
              var postData = {
                CReferenceId: item.CReferenceId,
                IsDisplayOnQRCode: 1
              }

              this.commonService.putHttpService(postData, 'onUpdateDisplayInQR').subscribe(response => {
                if (response.status == true) {
                  Swal.fire({
                    title: 'Success',
                    text: ' QR code for this Reference Value Updated Successfully',
                    type: 'success'
                  });

                }
              });
            } else if (
              // Read more about handling dismissals
              result.dismiss === Swal.DismissReason.cancel
            ) {
              this.RefList[i].IsDisplayOnQRCode = 0;
              e.target.checked = false;
              Swal.fire({
                title: 'Cancelled',
                text: ' QR code for this Reference Value is safe :)',
                type: 'error'
              });
            }
          });
        }
      } else {
        if (isDisplayOnQR) {
          this.CustomerEditForm.value.IsDisplayPOInQR = 0;
        } else {
          this.RefList[i].IsDisplayOnQRCode = 0;
         
        }
        e.target.checked = false;
        if(this.CustomerEditForm.value.IsDisplayPOInQR==0){
          Swal.fire({
            type: 'info',
            title: 'Message',
            text: 'Max 2 references allowed for selection.please uncheck to add another',
            confirmButtonClass: 'btn btn-confirm mt-2',
          });
        }else{
          Swal.fire({
            type: 'info',
            title: 'Message',
            text: 'Max 2 references allowed for selection. "Customer PO" is selected, please uncheck to add another',
            confirmButtonClass: 'btn btn-confirm mt-2',
          });
        }
        
      }
    }
    else {
      if (isDisplayOnQR) {
        this.CustomerEditForm.value.IsDisplayPOInQR = 0;
      } else {
        this.RefList[i].IsDisplayOnQRCode = 0;
        Swal.fire({
          title: 'Are you sure?',
          text: 'To Update this Reference Value as QR Code',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Update it!',
          cancelButtonText: 'No, cancel!',
          confirmButtonClass: 'btn btn-success mt-2',
          cancelButtonClass: 'btn btn-danger ml-2 mt-2',
          buttonsStyling: false
        }).then((result) => {
          if (result.value) {
            var postData = {
              CReferenceId: item.CReferenceId,
              IsDisplayOnQRCode: 0
            }
            this.commonService.putHttpService(postData, 'onUpdateDisplayInQR').subscribe(response => {
              if (response.status == true) {
                Swal.fire({
                  title: 'Success',
                  text: 'QR code for this Reference Value Updated Successfully',
                  type: 'success'
                });

              }
            });
          } else if (
            // Read more about handling dismissals
            result.dismiss === Swal.DismissReason.cancel
          ) {
            this.RefList[i].IsDisplayOnQRCode = 1;

            Swal.fire({
              title: 'Cancelled',
              text: 'QR code for this Reference Value is safe :)',
              type: 'error'
            });
          }
        });
      }
    }
  }


  onChangeEditableCustomerRef(e, item, i) {
    if (e.target.checked == true) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'To make this Reference Editable by Customer?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Process it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
  
    }).then((result) => {
      if (result.value) {
        var postData = {
          CReferenceId: item.CReferenceId,
          IsEditableByCustomer: 1
        }
        this.commonService.putHttpService(postData, 'updateEditableByCustomer').subscribe(response => {
          if (response.Status == true) {
            Swal.fire({
              title: 'Saved!',
              text: 'Record Saved Successfully',
              type: 'success'
            });
          }
        })
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Record is safe :)',
          type: 'success'
        });
        e.target.checked = false;

     }
    });
  
  }else{
    Swal.fire({
      title: 'Are you sure?',
      text: 'To make this Reference Editable by Customer?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Process it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
  
    }).then((result) => {
      if (result.value) {
        var postData = {
          CReferenceId: item.CReferenceId,
          IsEditableByCustomer: 0
        }
        this.commonService.putHttpService(postData, 'updateEditableByCustomer').subscribe(response => {
          if (response.Status == true) {
            Swal.fire({
              title: 'Saved!',
              text: 'Record Saved Successfully',
              type: 'success'
            });
          }
        })
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Record is safe :)',
          type: 'success'
        });
        e.target.checked = false;

     }
    });
  }
}

  loadVendors() {
    this.vendors$ = concat(
      this.searchVendors().pipe( // default items
        catchError(() => of([])), // empty list on error
      ),
      this.vendorsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap(term => {
          if (term != null && term != undefined)
            return this.searchVendors(term).pipe(
              catchError(() => of([])), // empty list on error
            )
          else
            return of([])
        })
      )
    );
  }


  searchVendors(term: string = ""): Observable<any> {
    this.loadingVendors = true;
    var postData = {
      "Vendor": term
    }
    return this.commonService.postHttpService(postData, "getAllAutoCompleteofVendor")
      .pipe(
        map(response => {
          this.VendorsList = response.responseData;
          this.loadingVendors = false;
          return response.responseData;
        })
      );
  }

  selectAllVendor() {
    let VendorIdIds = this.VendorsList.map(a => a.VendorId);
    let cMerge = [...new Set([...VendorIdIds, ...this.CustomerEditForm.value.DirectedVendors])];
    this.CustomerEditForm.patchValue({ "DirectedVendors": cMerge })

  }


 
  onExcel() {
    var data = []
    var jsonData = this.DirectedVendorList
    for (var i = 0; i < jsonData.length; i++) {
      var obj = jsonData[i];
       delete jsonData[i].VendorId;

      var temparray = [];
      for (var key in obj) {
        var value = obj[key];
        temparray.push(value);
      }
      data.push(temparray);
    }

    //Excel Title, Header, Data
    // const title = 'Sales Quote';
    const header = ["Customer Name","Vendor Code","Vendor Name","Vendor Type"]
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Data');
   
    
    //Add Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.font = { bold: true }

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);
    }
    );
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 35;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 10;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 40;
    worksheet.getColumn(12).width = 20;

    worksheet.addRow([]);
    // //Footer Row
    // let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
    // footerRow.getCell(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'FFCCFFE5' }
    // };
    // footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    // //Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:L${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = ('Directed Vendor ' + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })


  }
}
